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
  WidgetType,
} from '@codemirror/view';
import {
  StateField,
  EditorState,
  RangeSetBuilder
} from '@codemirror/state';

class CalloutWidget extends WidgetType {
  constructor(
    private readonly tag: string,
    private readonly header: string,
    private readonly body: string
  ) {
    super();
  }

  toDOM(): HTMLElement {
    const box = document.createElement('div');
    box.className = `cm-callout callout-${this.tag.toLowerCase()}`;

    const headerEl = document.createElement('div');
    headerEl.className = 'callout-header';
    headerEl.textContent = this.header || this.tag;

    const bodyEl = document.createElement('div');
    bodyEl.className = 'callout-body';
    bodyEl.textContent = this.body;

    box.appendChild(headerEl);
    box.appendChild(bodyEl);
    return box;
  }

  ignoreEvent(): boolean {
    return false;
  }
}

function parseCallouts(state: EditorState): {
  from: number;
  to: number;
  tag: string;
  header: string;
  body: string;
}[] {
  const lines = state.doc.toString().split('\n');
  const result = [];
  let i = 0;

  const headerRegex = /^>\s*\[!(?<tag>[A-Z]+)\](?<header>.*)/;
  const bodyRegex = /^>\s(?!\[)(?<body>.*)/;

  while (i < lines.length) {
    const headerMatch = lines[i].match(headerRegex);
    if (!headerMatch?.groups) {
      i++;
      continue;
    }

    const tag = headerMatch.groups.tag;
    const header = headerMatch.groups.header.trim();
    const bodyLines = [];
    const fromLine = i;
    let toLine = i;

    for (let j = i + 1; j < lines.length; j++) {
      const bodyMatch = lines[j].match(bodyRegex);
      if (!bodyMatch?.groups) break;
      bodyLines.push(bodyMatch.groups.body);
      toLine = j;
    }

    const from = state.doc.line(fromLine + 1).from;
    const to = state.doc.line(toLine + 1).to;

    result.push({
      from,
      to,
      tag,
      header,
      body: bodyLines.join('\n')
    });

    i = toLine + 1;
  }

  return result;
}

function buildCalloutDecorations(state: EditorState): DecorationSet {
  const builder = new RangeSetBuilder<Decoration>();
  const callouts = parseCallouts(state);
  const sel = state.selection.main;

  for (const { from, to, tag, header, body } of callouts) {
    const inside = sel.from >= from && sel.from <= to;
    if (!inside) {
      builder.add(from, to, Decoration.replace({
        widget: new CalloutWidget(tag, header, body),
        side: 1
      }));
    }
  }

  return builder.finish();
}

const calloutDecorationField = StateField.define<DecorationSet>({
  create: buildCalloutDecorations,
  update(deco, tr) {
    if (tr.docChanged || tr.selection) {
      return buildCalloutDecorations(tr.state);
    }
    return deco;
  },
  provide: f => EditorView.decorations.from(f)
});

export const calloutPlugin = [
  calloutDecorationField,
];
