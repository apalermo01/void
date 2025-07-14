/**
Copyright 2025 The VOID Authors. All Rights Reserved.

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/
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
      builder.add(start, end, Decoration.replace({ inclusive: false }))

      builder.add(
        end,
        end,
        Decoration.widget({
          widget: new MarkdownHeaderWidget(level, content),
          side: 1,
          block: true
        })
      )
    }
  }

  return builder.finish()
}

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
