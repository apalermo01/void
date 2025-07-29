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
  StateField,
  EditorState,
  RangeSetBuilder,
} from '@codemirror/state';
import { EditorView, DecorationSet, Decoration } from '@codemirror/view';

const colors = [
  '#F472B6',
  '#60A5FA',
  '#34D399',
  '#FBBF24',
  '#A78BFA',
  '#F87171',
  '#4ADE80',
  '#FB923C'
];

function hashTag(tag: string): number {
  let hash = 0;
  for (let i = 0; i < tag.length; i++) {
    hash = (hash << 5) - hash + tag.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function buildHashtagDecorations(state: EditorState): DecorationSet {
  const builder = new RangeSetBuilder<Decoration>();
  const regex = /(^|\s)(#[\p{L}\p{N}_-]+)/gu;

  for (let i = 1; i <= state.doc.lines; i++) {
    const line = state.doc.line(i);
    let match: RegExpExecArray | null;

    while ((match = regex.exec(line.text)) !== null) {
      const tag = match[2];
      const start = line.from + match.index + match[1].length;
      const end = start + tag.length;

      const color = colors[hashTag(tag) % colors.length];

      builder.add(start, end, Decoration.mark({
        attributes: {
          style: `color: ${color}; background-color: ${color}20; border-radius: 4px; padding: 0 2px;`
        }
      }));
    }
  }

  return builder.finish();
}

export const hashtagField = StateField.define<DecorationSet>({
  create: buildHashtagDecorations,
  update(deco, tr) {
    if (tr.docChanged || tr.selection) {
      return buildHashtagDecorations(tr.state);
    }
    return deco;
  },
  provide: f => EditorView.decorations.from(f)
});
