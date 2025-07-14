import {
  Decoration,
  DecorationSet,
  EditorView,
  WidgetType
} from '@codemirror/view'
import {
  EditorState,
  RangeSetBuilder, StateField
} from '@codemirror/state'

/** Виджет заголовка */
class MarkdownHeaderWidget extends WidgetType {
  constructor(
    private readonly level: number,
    private readonly content: string
  ) {
    super()
  }

  toDOM(): HTMLElement {
    const el = document.createElement(`h${this.level}`)
    el.className = `cm-md-preview-header cm-md-h${this.level}`
    el.textContent = this.content
    return el
  }

  ignoreEvent(): boolean {
    return true
  }
}

/** Поиск заголовков и возврат декораций */
function buildDecorations(state: EditorState): DecorationSet {
  const builder = new RangeSetBuilder<Decoration>()
  const cursor = state.selection.main.head
  const doc = state.doc

  for (let i = 1; i <= doc.lines; i++) {
    const line = doc.line(i)
    const text = line.text
    const offset = line.from

    const match = text.match(/^(#{1,6})\s+(.*)/)
    if (!match) continue

    const [full, hashes, content] = match
    const level = hashes.length
    const start = offset
    const end = start + full.length
    const cursorInside = cursor >= start && cursor <= end

    if (!cursorInside) {
      // Удаляем оригинальный markdown
      builder.add(start, end, Decoration.replace({ inclusive: false }))

      // Вставляем <h1>-<h6> как виджет
      builder.add(
        end,
        end,
        Decoration.widget({
          widget: new MarkdownHeaderWidget(level, content),
          side: 1,
          block: true // ✅ теперь можно!
        })
      )
    }
  }

  return builder.finish()
}

/** StateField для декораций */
export const liveMarkdownHeaders = StateField.define<DecorationSet>({
  create(state) {
    return buildDecorations(state)
  },

  update(deco, tr) {
    if (tr.docChanged || tr.selection) {
      return buildDecorations(tr.state)
    }
    return deco.map(tr.changes)
  },

  provide: f => EditorView.decorations.from(f)
})
