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
  keymap
} from '@codemirror/view';
import {
  RangeSetBuilder,
  Extension,
} from '@codemirror/state';
import { insertNewlineAndIndent, indentMore, indentLess } from '@codemirror/commands';

class TodoCheckboxInline extends WidgetType {
  constructor(
    private readonly checked: boolean,
    private readonly onToggle: () => void
  ) {
    super();
  }

  toDOM(): HTMLElement {
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = this.checked;
    checkbox.className = 'cm-todo-checkbox';

    checkbox.onclick = this.onToggle;

    return checkbox;
  }
}

const todoExtension = ViewPlugin.fromClass(
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
      const cursorPos = view.state.selection.main.head;

      for (const { from, to } of view.visibleRanges) {
        let pos = from;

        while (pos <= to) {
          const line = view.state.doc.lineAt(pos);
          const match = /([-*]\s\[( |x)])\s/.exec(line.text);

          if (match && match.index !== undefined) {
            const checked = match[2] === 'x';
            const offset = match.index;
            const prefixStart = line.from + offset;
            const prefixEnd = prefixStart + match[1].length;

            const cursorInside = cursorPos >= prefixStart && cursorPos <= prefixEnd;

            if (!cursorInside) {
              builder.add(
                prefixStart,
                prefixEnd,
                Decoration.replace({
                  widget: new TodoCheckboxInline(checked, () => {
                    const doc = view.state.doc;
                    const oldText = doc.sliceString(prefixStart, prefixEnd);
                    const newText = oldText.replace(
                      checked ? '[x]' : '[ ]',
                      checked ? '[ ]' : '[x]'
                    );
                    view.dispatch({
                      changes: {
                        from: prefixStart,
                        to: prefixEnd,
                        insert: newText
                      }
                    });
                  }),
                  inclusive: false
                })
              );
            }
          }

          pos = line.to + 1;
        }
      }

      return builder.finish();
    }
  },
  {
    decorations: v => v.decorations
  }
);

function handleEnter(view: EditorView): boolean {
  const { state } = view;
  const { head } = state.selection.main;
  const line = state.doc.lineAt(head);
  const match = /^([ \t]*)([-*]\s\[[ x]])\s(.*)$/.exec(line.text);

  if (match) {
    const indent = match[1];
    const prefix = match[2];
    const content = match[3];

    if (content.trim() === '') {
      if (indent.length > 0) {
        return indentLess(view);
      } else {
        const removeEnd = line.from + match[0].length;
        view.dispatch({
          changes: {
            from: line.from,
            to: removeEnd,
            insert: ''
          },
          selection: { anchor: line.from },
          scrollIntoView: true
        });
        return true;
      }
    }

    const insertText = `\n${indent}${prefix} `;
    const cursorPos = head + insertText.length;

    view.dispatch({
      changes: {
        from: head,
        to: head,
        insert: insertText
      },
      selection: { anchor: cursorPos },
      scrollIntoView: true
    });
    return true;
  }
  return insertNewlineAndIndent(view);
}

function handleTab(view: EditorView): boolean {
  return indentMore(view);
}

function handleShiftTab(view: EditorView): boolean {
  return indentLess(view);
}

const todoKeymap = keymap.of([
  { key: 'Enter', run: handleEnter },
  { key: 'Tab', run: handleTab },
  { key: 'Shift-Tab', run: handleShiftTab },
]);

export const todoPlugin: Extension = [
  todoExtension,
  todoKeymap
];
