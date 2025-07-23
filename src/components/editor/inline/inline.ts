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
import { createUnifiedInlinePlugin } from '../inline-factory/factory';

export const inlinePlugin = createUnifiedInlinePlugin([
  {
    regex: /~~(.*?)~~/g,
    className: 'cm-strike',
    marker: 'strike',
    openingLength: 2,
    closingLength: 2
  },
  {
    regex: /__(.*?)__/g,
    className: 'cm-italic',
    marker: 'italic',
    openingLength: 2,
    closingLength: 2
  },
  {
    regex: /\*\*(.*?)\*\*/g,
    className: 'cm-bold',
    marker: 'bold',
    openingLength: 2,
    closingLength: 2
  },
  {
    regex: /\^\^(.*?)\^\^/g,
    className: 'cm-highlight',
    marker: 'highlight',
    openingLength: 2,
    closingLength: 2
  },
  {
    regex: /`([^`\n]+?)`/g,
    className: 'cm-inline-codeblock',
    marker: 'linecode',
    openingLength: 1,
    closingLength: 1,
  }
]);
