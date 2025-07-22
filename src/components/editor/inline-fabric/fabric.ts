/*
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
} from '@codemirror/view';
import { RangeSetBuilder } from '@codemirror/state';

export type InlineStyleConfig = {
  regex: RegExp;
  className: string;
  marker: string;
  openingLength: number;
  closingLength: number;
};

export function createUnifiedInlinePlugin(styles: InlineStyleConfig[]) {
  return ViewPlugin.fromClass(
    class {
      decorations: DecorationSet;

      constructor(view: EditorView) {
        this.decorations = this.build(view);
      }

      update(update: ViewUpdate) {
        if (
          update.docChanged ||
          update.viewportChanged ||
          update.selectionSet
        ) {
          this.decorations = this.build(update.view);
        }
      }

      build(view: EditorView): DecorationSet {
        const builder = new RangeSetBuilder<Decoration>();
        const doc = view.state.doc;
        const cursor = view.state.selection.main.head;

        type Match = {
          from: number;
          to: number;
          contentFrom: number;
          contentTo: number;
          marker: string;
          className: string;
          openingLength: number;
          closingLength: number;
          parent?: Match;
        };

        const matches: Match[] = [];

        for (let i = 1; i <= doc.lines; i++) {
          const line = doc.line(i);

          for (const style of styles) {
            style.regex.lastIndex = 0;
            let match: RegExpExecArray | null;
            while ((match = style.regex.exec(line.text)) !== null) {
              const matchStart = line.from + match.index;
              const matchEnd = matchStart + match[0].length;
              const contentStart = matchStart + style.openingLength;
              const contentEnd = matchEnd - style.closingLength;

              matches.push({
                from: matchStart,
                to: matchEnd,
                contentFrom: contentStart,
                contentTo: contentEnd,
                marker: style.marker,
                className: style.className,
                openingLength: style.openingLength,
                closingLength: style.closingLength
              });
            }
          }
        }

        // Определение родителя для вложенности
        for (const m of matches) {
          m.parent = matches.find(
            (outer) =>
              outer !== m &&
              outer.from <= m.from &&
              outer.to >= m.to
          );
        }

        const decoRanges: { from: number; to: number; deco: Decoration }[] = [];

        for (const match of matches) {
          decoRanges.push({
            from: match.contentFrom,
            to: match.contentTo,
            deco: Decoration.mark({ class: match.className })
          });

          let outermost: Match = match;
          while (outermost.parent) outermost = outermost.parent;

          const cursorOutside = cursor < outermost.from || cursor > outermost.to;

          if (cursorOutside) {
            decoRanges.push({
              from: match.from,
              to: match.contentFrom,
              deco: Decoration.replace({ inclusive: false, side: -1 })
            });
            decoRanges.push({
              from: match.contentTo,
              to: match.to,
              deco: Decoration.replace({ inclusive: false, side: 1 })
            });
          }
        }

        decoRanges.sort((a, b) => {
          if (a.from !== b.from) return a.from - b.from;
          const aSide = a.deco.spec?.side ?? 0;
          const bSide = b.deco.spec?.side ?? 0;
          return aSide - bSide;
        });

        for (const { from, to, deco } of decoRanges) {
          builder.add(from, to, deco);
        }

        return builder.finish();
      }
    },
    {
      decorations: (plugin) => plugin.decorations
    }
  );
}
