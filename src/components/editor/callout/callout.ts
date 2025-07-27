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
import { Decoration, DecorationSet, EditorView, ViewPlugin, ViewUpdate, WidgetType } from '@codemirror/view';

class CalloutWidget extends WidgetType {
  constructor(private readonly tag: string, private readonly body: string, private readonly header: string) {
    super();
  }
  toDOM(view: EditorView): HTMLElement {
    let el = document.createElement('div');
    el.classList.add('cm-callout');
    el.classList.add(`cm-callout-${this.tag.toLowerCase()}`)
    let header = document.createElement('div');
    header.classList.add('cm-callout-tag');
    if (this.header != '') {
      header.textContent = this.header;
    }
    else {
      header.textContent = this.tag;
    }
    let body = document.createElement('div');
    body.classList.add('cm-callout-body');
    body.textContent = this.body;
    el.appendChild(header);
    el.appendChild(body);
    return el;
  }
}

export const calloutPlugin = ViewPlugin.fromClass(
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
      console.log('[callout] building');
      const doc = view.state.doc;
      const cursor = view.state.selection.main.head;

      const headerRegexp = /^>\s*\[!(?<tag>[A-Z]+)\](?<header>.*)/;
      const bodyRegexp = /^>\s(?!\[)(?<body>.*)/;

      const decorations = [];

      let i = 1;
      while (i <= doc.lines) {
        const line = doc.line(i);
        const headerMatch = line.text.match(headerRegexp);

        if (headerMatch?.groups) {
          const tag = headerMatch.groups.tag;
          const header = headerMatch.groups.header.trim();
          const from = line.from;
          let to = line.to;

          let body = '';
          let j = i + 1;

          while (j <= doc.lines) {
            const bodyLine = doc.line(j);
            const bodyMatch = bodyLine.text.match(bodyRegexp);

            if (bodyMatch?.groups) {
              body += bodyMatch.groups.body + '\n';
              to = bodyLine.to;
              j++;
            } else {
              break;
            }
          }

          if (cursor >= from && cursor <= to) {
            i = j;
            continue;
          }

          decorations.push(
            Decoration.widget({
              widget: new CalloutWidget(tag, body.trim(), header),
              side: -1,
            }).range(from)
          );

          for (let k = i; k < j; k++) {
            const lineToHide = doc.line(k);
            decorations.push(
              Decoration.line({ class: 'cm-callout-hidden-line' }).range(lineToHide.from)
            );
          }

          i = j;
        } else {
          i++;
        }
      }

      return Decoration.set(decorations, true);
    }
  }, { decorations: v => v.decorations });
