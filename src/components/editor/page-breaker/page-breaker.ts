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
  ViewUpdate,
  WidgetType,
} from '@codemirror/view';
import { RangeSetBuilder } from '@codemirror/state';

function findPageBreaker(line: string, offset: number, cursor: number) {
  const decorations: { from: number; to: number }[] = [];
  const regexp = /^---\s*$/;

  if (regexp.test(line) && (cursor < offset || cursor > offset + line.length)) {
    decorations.push({
      from: offset,
      to: offset + line.length,
    });
  }

  return decorations;
}

export const pageBreaker = ViewPlugin.fromClass(
  class {
    decorations: DecorationSet;

    constructor(view: EditorView) {
      this.decorations = this.build(view);
    }

    update(update: ViewUpdate) {
      if (update.docChanged || update.selectionSet || update.viewportChanged) {
        this.decorations = this.build(update.view);
      }
    }

    build(view: EditorView): DecorationSet {
      const builder = new RangeSetBuilder<Decoration>();
      const doc = view.state.doc;
      const cursor = view.state.selection.main.head;

      if (doc.length === 0) return Decoration.none;

      for (let i = 1; i <= doc.lines; i++) {
        const line = doc.line(i);
        const matches = findPageBreaker(line.text, line.from, cursor);

        for (const match of matches) {
          builder.add(
            match.from,
            match.to,
            Decoration.replace({ widget: new PageBreakerWidget(), inclusive: false })
          );
        }
      }

      return builder.finish();
    }
  },
  {
    decorations: (v) => v.decorations,
  }
);

class PageBreakerWidget extends WidgetType {
  toDOM(): HTMLElement {
    const el = document.createElement('div');
    el.classList.add('md-pagebreaker');
    return el;
  }

  ignoreEvent(): boolean {
    return false;
  }
}
