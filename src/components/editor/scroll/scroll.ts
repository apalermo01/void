import { ViewPlugin, ViewUpdate, EditorView } from '@codemirror/view';

export const autoScrollOnInput = ViewPlugin.fromClass(class {
  constructor(private view: EditorView) { }

  update(update: ViewUpdate) {
    if (update.docChanged || update.selectionSet) {
      const head = this.view.state.selection.main.head;
      this.view.dispatch({
        effects: [],
        scrollIntoView: true,
        selection: { anchor: head }
      });
    }
  }
});
