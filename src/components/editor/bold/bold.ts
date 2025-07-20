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
  ViewPlugin,
  ViewUpdate
} from '@codemirror/view'
import { RangeSetBuilder } from '@codemirror/state'

function findBold(line: string, offset: number, cursor: number) {
  const decorations: { from: number; to: number; deco: Decoration }[] = [];
  const regex = /\*\*(.+?)\*\*/g;
  let match;

  while ((match = regex.exec(line)) !== null) {
    const start = offset + match.index;
    const end = start + match[0].length;
    const contentStart = start + 2;
    const contentEnd = end - 2;

    const cursorInside = cursor >= start && cursor <= end;

    if (!cursorInside) {
      decorations.push({
        from: start,
        to: start + 2,
        deco: Decoration.replace({ inclusive: false })
      });

      decorations.push({
        from: contentEnd,
        to: end,
        deco: Decoration.replace({ inclusive: false })
      });
    } else {
    }

    decorations.push({
      from: contentStart,
      to: contentEnd,
      deco: Decoration.mark({ class: 'cm-bold' })
    });
  }

  return decorations
}

export const boldPlugin = ViewPlugin.fromClass(
  class {
    decorations: DecorationSet

    constructor(view: EditorView) {
      this.decorations = this.build(view);
    }

    update(update: ViewUpdate) {
      if (update.docChanged || update.viewportChanged || update.selectionSet) {
        this.decorations = this.build(update.view);
      }
    }

    build(view: EditorView): DecorationSet {
      const builder = new RangeSetBuilder<Decoration>()
      const doc = view.state.doc;
      const cursor = view.state.selection.main.head;

      for (let i = 1; i <= doc.lines; i++) {
        const line = doc.line(i);
        const deco = findBold(line.text, line.from, cursor);

        deco.sort((a, b) => {
          if (a.from !== b.from) return a.from - b.from;
          return (a.deco.spec.side || 0) - (b.deco.spec.side || 0);
        })

        for (const { from, to, deco: d } of deco) {
          builder.add(from, to, d);
        }
      }

      return builder.finish();
    }
  },
  {
    decorations: (plugin) => plugin.decorations
  }
)
