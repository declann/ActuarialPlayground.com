// this editor is from https://observablehq.observablehq.cloud/framework-example-codemirror/

import {javascript} from "../../_npm/@codemirror/lang-javascript@6.2.3/5180cf82.js";
import {EditorView, keymap} from "../../_npm/@codemirror/view@6.36.4/9426135b.js";
import {button} from "../../_observablehq/stdlib/inputs.c9e8879a.js";
import {basicSetup} from "../../_npm/codemirror@6.0.1/53082ac8.js";

export function Editor({
  value = "",
  style = "font-size: 18px;"
} = {}) {
  const parent = document.createElement("div");
  parent.className = 'lapse-rate'
  parent.style = style;
  parent.value = value;
  parent.default = value

  const run = () => {
    //debugger
    parent.value = String(editor.state.doc);
    parent.dispatchEvent(new InputEvent("input", {bubbles: true}));

    // TODO share the default formula in a file or move analytics to index.md
    if ((editor.state.doc != parent.default) && (editor.state.doc != "0")) {
      if (window.plausible) 
        window.plausible('lapses_custom_formula', {props: {lapses_custom_formula: editor.state.doc.length}}) // I think ok to record this, may change. Edit: moved to length capture only
    }
  };

  const reset = () => {
    editor.dispatch({
      changes: { from: 0, to: editor.state.doc.length, insert: value }
    });
    run()
    //parent.value = String(value);
    //parent.dispatchEvent(new InputEvent("input", {bubbles: true}));
  };

  const editor = new EditorView({
    parent,
    doc: value,
    extensions: [
      basicSetup,
      javascript(),
      keymap.of([
        {key: "Shift-Enter", preventDefault: true, run},
        {key: "Mod-s", preventDefault: true, run}
      ])
    ]
  });

  parent.addEventListener("input", (event) => event.isTrusted && event.stopImmediatePropagation());
  const f = document.createElement('div')
  f.style.display = 'flex'
  f.className = 'run-reset-buttons'
  f.appendChild(button([["Run (or use Ctrl-S)", run]]));
  //f.appendChild(button([["Reset", reset]]));
  parent.appendChild(f)

  parent.editor = editor
  parent.run = run

  return parent;
}