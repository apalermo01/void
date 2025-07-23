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
  EditorView,
  WidgetType,
  keymap
} from '@codemirror/view';
import {
  StateField,
  RangeSetBuilder,
  EditorState
} from '@codemirror/state';

import { headingPlugin } from '@/components/editor/headers/headers';
import { pageBreaker } from '@/components/editor/page-breaker/page-breaker';
import { inlinePlugin } from '@/components/editor/inline/inline';
import { quotePlugin } from '@/components/editor/quote/quote';
import { todoPlugin } from '@/components/editor/todo/todo';

class CalloutWidget extends WidgetType {
  constructor(
    private readonly tag: string,
    private readonly body: string,
    private readonly level: number = 0
  ) {
    super();
  }

  toDOM(): HTMLElement {
    const outer = document.createElement('div');
    outer.className = `callout callout-${this.tag.toLowerCase()} callout-level-${this.level}`;

    const header = document.createElement('div');
    header.className = 'callout-header';
    header.textContent = this.tag;
    outer.appendChild(header);

    const nestedState = EditorState.create({
      doc: this.body,
      extensions: [
        EditorView.editable.of(false),
        EditorView.lineWrapping,
        calloutPlugin,
        quotePlugin,
        headingPlugin,
        pageBreaker,
        inlinePlugin,
        todoPlugin
      ]
    });

    new EditorView({
      state: nestedState,
      parent: outer
    });

    return outer;
  }

  ignoreEvent(): boolean {
    return false;
  }
}

function parseCallout(state: EditorState): {
  from: number;
  to: number;
  tag: string;
  body: string;
  level: number;
}[] {
  const lines = state.doc.toString().split('\n');
  const result = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const match = line.match(/^(\s*)> \[!(\w+)]/);
    if (!match) {
      i++;
      continue;
    }

    const indent = match[1];
    const tag = match[2];
    const level = indent.length / 2;
    const fromLine = i;
    let toLine = i;
    const bodyLines: string[] = [];

    for (let j = i + 1; j < lines.length; j++) {
      const nextLine = lines[j];
      if (!nextLine.startsWith(indent + '> ')) break;

      bodyLines.push(nextLine.slice(indent.length + 2));
      toLine = j;
    }

    const from = state.doc.line(fromLine + 1).from;
    const to = state.doc.line(toLine + 1)?.to ?? state.doc.length;

    result.push({
      from,
      to,
      tag,
      body: bodyLines.join('\n'),
      level
    });

    i = toLine + 1;
  }

  return result;
}

function buildCalloutDecorations(state: EditorState) {
  const builder = new RangeSetBuilder<Decoration>();
  const callouts = parseCallout(state);
  const sel = state.selection.main;

  for (const { from, to, tag, body, level } of callouts) {
    const inside = sel.from >= from && sel.from <= to;
    if (!inside) {
      builder.add(from, to, Decoration.replace({
        widget: new CalloutWidget(tag, body, level),
        side: 1
      }));
    }
  }

  return builder.finish();
}

const calloutDecorationField = StateField.define({
  create: buildCalloutDecorations,
  update(deco, tr) {
    if (tr.docChanged || tr.selection) {
      return buildCalloutDecorations(tr.state);
    }
    return deco;
  },
  provide: f => EditorView.decorations.from(f)
});

function getCalloutLevel(state: EditorState, pos: number): number {
  const line = state.doc.lineAt(pos);
  const match = line.text.match(/^(\s*)> /);
  return match ? match[1].length / 2 : 0;
}

const continueCalloutOnEnter = keymap.of([{
  key: 'Enter',
  run(view) {
    const { state, dispatch } = view;
    const { from } = state.selection.main;
    const line = state.doc.lineAt(from);
    const trimmed = line.text.trim();

    if (trimmed.startsWith('>')) {
      if (/^(\s*)>\s*$/.test(trimmed)) {
        const level = getCalloutLevel(state, from);
        const indent = '  '.repeat(Math.max(0, level - 1));
        const newPrefix = level > 0 ? `${indent}> ` : '';

        dispatch(state.update({
          changes: { from: line.from, to: line.to, insert: newPrefix },
          selection: { anchor: line.from + newPrefix.length },
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

    return false;
  }
}]);

export const calloutPlugin = [
  calloutDecorationField,
  continueCalloutOnEnter,
];
