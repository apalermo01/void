import {
  Decoration,
  DecorationSet,
  EditorView,
  ViewPlugin,
  ViewUpdate
} from '@codemirror/view'
import { RangeSetBuilder } from '@codemirror/state'

/** Находит ~~...~~ и применяет зачеркивание, скрывая `~~`, если курсор не внутри */
function findStrikethrough(line: string, offset: number, cursor: number) {
  const decorations: { from: number; to: number; deco: Decoration }[] = []
  const regex = /~~(.+?)~~/g
  let match

  while ((match = regex.exec(line)) !== null) {
    const start = offset + match.index
    const end = start + match[0].length
    const contentStart = start + 2
    const contentEnd = end - 2

    const cursorInside = cursor >= start && cursor <= end

    // скрыть ~~ только если курсор не внутри
    if (!cursorInside) {
      // Удаляем левые ~~ через replace
      decorations.push({
        from: start,
        to: start + 2,
        deco: Decoration.replace({ inclusive: false })
      })

      // И правые ~~
      decorations.push({
        from: contentEnd,
        to: end,
        deco: Decoration.replace({ inclusive: false })
      })
    } else {
      // Если курсор внутри — оставляем как есть
    }

    // зачеркивание содержимого
    decorations.push({
      from: contentStart,
      to: contentEnd,
      deco: Decoration.mark({ class: 'cm-strike' })
    })
  }

  return decorations
}

/** CodeMirror plugin */
export const strikeThrough = ViewPlugin.fromClass(
  class {
    decorations: DecorationSet

    constructor(view: EditorView) {
      this.decorations = this.build(view)
    }

    update(update: ViewUpdate) {
      if (update.docChanged || update.viewportChanged || update.selectionSet) {
        this.decorations = this.build(update.view)
      }
    }

    build(view: EditorView): DecorationSet {
      const builder = new RangeSetBuilder<Decoration>()
      const doc = view.state.doc
      const cursor = view.state.selection.main.head

      for (let i = 1; i <= doc.lines; i++) {
        const line = doc.line(i)
        const deco = findStrikethrough(line.text, line.from, cursor)

        // сортируем обязательно!
        deco.sort((a, b) => {
          if (a.from !== b.from) return a.from - b.from
          return (a.deco.spec.side || 0) - (b.deco.spec.side || 0)
        })

        for (const { from, to, deco: d } of deco) {
          builder.add(from, to, d)
        }
      }

      return builder.finish()
    }
  },
  {
    decorations: (plugin) => plugin.decorations
  }
)
