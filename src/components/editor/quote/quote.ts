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
  keymap
} from '@codemirror/view';
import {
  StateField,
  EditorState,
  RangeSetBuilder
} from '@codemirror/state';

class QuoteWidget extends WidgetType {
  constructor(private readonly body: string) {
    super();
  }

  toDOM(): HTMLElement {
    const block = document.createElement('blockquote');
    block.className = 'quote-block';
    block.textContent = this.body;
    return block;
  }

  ignoreEvent(): boolean {
    return false;
  }
}

function parseQuotes(state: EditorState): {
  from: number;
  to: number;
  body: string;
}[] {
  const lines = state.doc.toString().split('\n');
  const result = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const match = line.match(/^>\s?(.*)/);
    if (!match) {
      i++;
      continue;
    }

    const bodyLines = [match[1]];
    const fromLine = i;
    let toLine = i;

    for (let j = i + 1; j < lines.length; j++) {
      const next = lines[j].match(/^>\s?(.*)/);
      if (!next) break;
      bodyLines.push(next[1]);
      toLine = j;
    }

    const from = state.doc.line(fromLine + 1).from;
    const to = state.doc.line(toLine + 1).to;

    result.push({
      from,
      to,
      body: bodyLines.join('\n')
    });

    i = toLine + 1;
  }

  return result;
}

function buildQuoteDecorations(state: EditorState): DecorationSet {
  const builder = new RangeSetBuilder<Decoration>();
  const quotes = parseQuotes(state);
  const sel = state.selection.main;

  for (const { from, to, body } of quotes) {
    const inside = sel.from >= from && sel.from <= to;
    if (!inside) {
      builder.add(from, to, Decoration.replace({
        widget: new QuoteWidget(body),
        side: 1
      }));
    }
  }

  return builder.finish();
}

const quoteDecorationField = StateField.define<DecorationSet>({
  create: buildQuoteDecorations,
  update(deco, tr) {
    if (tr.docChanged || tr.selection) {
      return buildQuoteDecorations(tr.state);
    }
    return deco;
  },
  provide: f => EditorView.decorations.from(f)
});

const continueQuoteOnEnter = keymap.of([{
  key: 'Enter',
  run(view) {
    const { state, dispatch } = view;
    const { from } = state.selection.main;
    const line = state.doc.lineAt(from);
    const trimmed = line.text.trim();

    if (!/^>\s?/.test(line.text)) return false;

    if (/^>\s*$/.test(trimmed)) {
      dispatch(state.update({
        changes: { from: line.from, to: line.to, insert: '' },
        selection: { anchor: line.from },
        userEvent: 'input'
      }));
      return true;
    }

    const prefixMatch = line.text.match(/^(\s*> ?)/);
    const prefix = prefixMatch?.[1] ?? '> ';
    dispatch(state.update({
      changes: { from, to: from, insert: `\n${prefix}` },
      selection: { anchor: from + 1 + prefix.length },
      userEvent: 'input'
    }));
    return true;
  }
}]);

export const quotePlugin = [
  quoteDecorationField,
  continueQuoteOnEnter
];
