
/**
 * Copyright 2025 The VOID Authors. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { Node, mergeAttributes } from '@tiptap/core'

const allowedTypes = ['info', 'warning', 'danger', 'success', 'tip', 'quote'] as const
type CalloutType = typeof allowedTypes[number]

const Icons: Record<CalloutType, string> = {
  info: 'ℹ️',
  warning: '⚠️',
  danger: '🚨',
  success: '✅',
  tip: '💡',
  quote: '💬',
}

function isValidCalloutType(value: unknown): value is CalloutType {
  return typeof value === 'string' && allowedTypes.includes(value as CalloutType)
}

export const Callout = Node.create({
  name: 'callout',
  group: 'block',
  content: 'block+',
  defining: true,

  addAttributes() {
    return {
      type: {
        default: 'info',
        parseHTML: el => {
          const raw = el.getAttribute('data-callout-type') || 'info'
          return isValidCalloutType(raw) ? raw : 'info'
        },
        renderHTML: attrs => ({
          'data-callout-type': attrs.type,
        }),
      },
    }
  },

  parseHTML() {
    return [{ tag: 'div[data-callout-type]' }]
  },

  renderHTML({ HTMLAttributes, node }) {
    const raw = node.attrs.type
    const type: CalloutType = isValidCalloutType(raw) ? raw : 'info'
    const icon = Icons[type]

    return [
      'div',
      mergeAttributes(HTMLAttributes, {
        class: `callout callout-${type}`,
      }),
      ['div', { class: 'callout-icon' }, icon],
      ['div', { class: 'callout-content' }, 0],
    ]
  },

  addKeyboardShortcuts() {
    return {
      Enter: () => {
        const { state } = this.editor
        const { $from } = state.selection

        // ⛔️ Прерываем, если не внутри codeBlock
        if ($from.parent.type.name !== 'codeBlock') return false

        const text = $from.parent.textContent.trim()
        const match = text.match(/^(?:([a-z]+))?$/i)

        if (!match) return false

        let type = match[1] as CalloutType || 'info'
        if (!isValidCalloutType(type)) type = 'info'

        return this.editor.commands.command(({ tr, dispatch }) => {
          const from = $from.before()
          const to = $from.after()

          const node = this.type.create(
            { type },
            this.editor.schema.nodes.paragraph.create()
          )

          tr.replaceRangeWith(from, to, node)
          dispatch?.(tr.scrollIntoView())
          return true
        })
      },
    }
  }
})
