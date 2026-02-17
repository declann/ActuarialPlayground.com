// AGPL DN

import { MergeView, unifiedMergeView, updateOriginalDoc, originalDocChangeEffect, getOriginalDoc } from "@codemirror/merge"
import { EditorView  } from 'codemirror'
import { EditorView as  EditorView_old } from 'codemirror' // needed for merge view ?!
import { basicSetup } from "codemirror"
// I tried to remove basicSetup to turn off lineNumbers, but this broke Enter key for some reason - versions of imports?
//import { basicSetup } from "codemirror"


import { highlightActiveLineGutter, highlightSpecialChars, drawSelection, dropCursor, highlightActiveLine, keymap } from '@codemirror/view';

import { highlightSelectionMatches, searchKeymap } from '@codemirror/search';
import { closeBrackets, autocompletion, closeBracketsKeymap, completionKeymap } from '@codemirror/autocomplete';
import { history, defaultKeymap, historyKeymap } from '@codemirror/commands';





import { EditorState } from "@codemirror/state"
import { linter, lintGutter, lintKeymap } from "@codemirror/lint"
import { ChangeSet } from "@codemirror/state"

import { Text } from "@codemirror/state"

import * as eslint from "eslint-linter-browserify";
import { javascript, esLint, javascriptLanguage } from "@codemirror/lang-javascript";
import { foldGutter, indentOnInput, syntaxHighlighting, defaultHighlightStyle, bracketMatching, foldKeymap, syntaxTree, foldAll } from '@codemirror/language';
import globals from "globals";

// f9535c0 is latest all_cul commit:

import { introspection as getIntrospection, compile_new, bundleIntoOne } from "https://cdn.jsdelivr.net/gh/calculang/calculang@db0582b/packages/standalone/index.js" //"https://raw.githack.com/calculang/calculang/all_cul/packages/standalone/index.js"//
import {pre_fetch} from "https://cdn.jsdelivr.net/gh/calculang/calculang@db0582b/packages/standalone/pre_fetch.mjs"


import { instance } from "@viz-js/viz";  //Playground: optimize: lose this dep >1MB
import {html} from "htl";

import snippetbuilder from 'codemirror-6-snippetbuilder';

import jssnippetarray from './snippetarray.js'

// Alt? import {Inspector} from "observablehq:runtime";
// https://github.com/observablehq/framework/blob/main/src/client/inspect.js#L3
import { Inspector } from "@observablehq/inspector"


const actuarial_playground = true // disable some things that aren't presentable for AP yet


// alternative patterns?
// see e.g. doimport https://observablehq.com/@kreijstal/import-global-as-esm

export const packageCalculang_new = async (bundledIntoOne) => {

  let compiled = URL.createObjectURL(
    new Blob(
      [bundledIntoOne],
      { type: "text/javascript" }
    )
  )
  
  let ret = await import(compiled)
  URL.revokeObjectURL(compiled)
  return ret
}




const lintConfig = ({
  // 'config' in editor.mjs: direct copy
  // eslint configuration
  languageOptions: {
    parserOptions: {
      ecmaVersion: 2022, // ?  2022 here: https://github.com/UziTech/eslint-linter-browserify/blob/4844787ed5fe4f9173fc694d7df9bc161b15fb46/example/script.js
      sourceType: "module"
    },
    /*env: {
      // ?
      browser: true,
      node: true
    },*/
    globals: { ...globals.node }
  },
  rules: {
    //semi: ["warn", "always"],
    // TODO make lint aware of all_cul replacements, then no-undef becomes a big help
    //"no-undef": ["warn"], // this is a key rule for calculang, but is easier to use on JS (because of intentional undefined inputs in _in convention)
    "func-style": ["error", "expression"],
    "consistent-return": ["error"], // not as good as forcing a return ..
    // no-unused-expressions works in some cases but not others?
    // bug whenever a = () => {b()}, but b()*3 works
    "no-unused-expressions": ["error"], // doesn't catch when there are calls because doesn't know about purity ..
    "prefer-const": "warn",
    "no-restricted-syntax": [
      // docs https://eslint.org/docs/latest/rules/no-restricted-syntax
      "error",
      {
        message: "calculang: don't pollute the _ namespace",
        selector:
          "ImportDeclaration[source.value=/cul_scope_/] > ImportSpecifier[local.name=/_$/]"
        // converted to esm => match cul_scope_x rather than .cul
      } // test with import {create as confetti_} from "https://cdn.jsdelivr.net/npm/canvas-confetti/+esm?cul_scope_id=3";
    ]

  }
  // "extends": "eslint:recommended" not working; not sure I want
})


let doc = `
// PLACEHOLDER`

let inhibit = false


const readonly = false;
const decorations = false;// just messy and not setup right, but useful for navigation and illustrating flex, turn back on soon




//////////////////


// https://codemirror.net/try/?example=Merge%20View
export const a = ({ parent, div, set_formulae_visible, set_hover, setCursor, setFormula, fmt }) => {
  return new EditorView({
  //a: {
  doc: div.fs[div.entrypoint],
  extensions: [
    //lineNumbers(), //chk https://www.npmjs.com/package/codemirror?activeTab=code replacing basicSetup removing lineNumebrs mainly
    //highlightActiveLineGutter(),
    /*highlightSpecialChars(),
    history(),
    foldGutter(),
    drawSelection(),
    dropCursor(),
    EditorState.allowMultipleSelections.of(true),
    indentOnInput(),
    syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
    bracketMatching(),
    closeBrackets(),
    autocompletion(),
    //rectangularSelection(),//crosshairCursor(),
    highlightActiveLine(),
    highlightSelectionMatches(),
    keymap.of([
        ...closeBracketsKeymap,
        ...defaultKeymap,
        ...searchKeymap,
        ...historyKeymap,
        ...foldKeymap,
        ...completionKeymap,
        ...lintKeymap
    ]),*/ // some reason can't press enter

    basicSetup, // todo turn off line numbers
    //EditorView.lineWrapping, conflicts with hardcoded tables 
    javascript(),

    //DNOFFoverlay_workings(div, set_formulae_visible, setCursor, setFormula, fmt),
    //DNOFFoverlay_answers(div, fmt),

    lintGutter(),
    javascriptLanguage.data.of({
      autocomplete: snippetbuilder({
        source: jssnippetarray
      })
    }),
    linter(view => {
      let o = esLint(new eslint.Linter(), lintConfig)(view).filter(d => !(d.source == 'eslint:no-undef' && d.message.includes("_in'")));
      console.log('linting (must have empty array of errors:', o)
      if (o.filter(d => d.severity =='error').length == 0) {
        //div.fs = ({...div.fs, [div.filename]: view.state.doc.toString() })
        
        console.log('LINTED')
        div.compile()
        
      }
      // TODO also put introspection update in linter pass (or o/w debounced)?
      return o;
    }),
    EditorView.updateListener.of(view => {
      if (view.docChanged) {
        console.log('change!')
        //if (inhibit == false)
          div.fs = ({...div.fs, [div.filename]: view.state.doc.toString() })
          div.old_fs = ({...div.fs})// Breaks all_cul00 fix - but only way to keep state and permit browsing URL imports
          // I need a far better formula update API
        // COMPILE HERE INSTEAD OF IN LINT WORKS, BUT IS PROBABLY WASTEFUL. GOOD FOR DEMONSTRATION? MAKE CONFIGURABLE?
        //div.compile() // WORKS: OK for demos, but move to lint for perf for larger models
          //div.setFS({ "entrypoint.cul.js": view.state.doc.toString() })
        //inhibit = false
      }
    })
  ],
  parent
})}


export const b = ({ parent }) => new EditorView_old({
  //a: {
  doc: '',
  extensions: [
    //basicSetup,
    highlightActiveLineGutter(),
    highlightSpecialChars(),
    history(),
    foldGutter(),
    drawSelection(),
    dropCursor(),
    EditorState.allowMultipleSelections.of(true),
    indentOnInput(),
    syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
    bracketMatching(),
    closeBrackets(),
    autocompletion(),
    //rectangularSelection(),//crosshairCursor(),
    highlightActiveLine(),
    highlightSelectionMatches(),
    keymap.of([
        ...closeBracketsKeymap,
        ...defaultKeymap,
        ...searchKeymap,
        ...historyKeymap,
        ...foldKeymap,
        ...completionKeymap,
        ...lintKeymap
    ]),
    //EditorView.lineWrapping,
    javascript(),
    lintGutter(), // just for less jank on tab switch
    unifiedMergeView({ original: doc, mergeControls: false, gutter:false, diffConfig:{ scanLimit: 50000} })
  ],
  /*},
  b: {
    doc: doc,//.replace(/t/g, "T") + "\nSix",
    extensions: [
      basicSetup,
      //EditorView.editable.of(false),
      //EditorState.readOnly.of(true)
    ]
  },*/
  parent//: document.body
})

export const ab = ({entrypoint='entrypoint.cul.js', defaultFS, setModel, setIntrospection, setCompilations, set_formulae_visible, setCursor, setFormula, fmt}) => {
  const div = document.createElement('div')

  const d = div.appendChild(html.fragment`
    <input type="radio" class="plausible-event-name=Code+Tab" id="input-tab" name="tabs">
    <label for="input-tab">💬</label>
    <div class="tab" id="input-div"><p style="font-weight:bold;margin:0;font-size: small;font-style:italic"><a href="https://calculang.dev" target="_blank">calculang</a> formulas <span style="font-style:normal !important">🧙</span></p><select id="filename"><option>PLACEHOLDER</option></select><button id="add" style="margin-left:1em; font-size:smaller">➕</button></div>
    <input type="radio" id="interim-tab" name="tabs">
    <label for="interim-tab">⚡</label>
    <div class="tab" id="interim-div"><i id="scope">scope 0</i></div>
    <input type="radio" class="plausible-event-name=Output+Tab" id="output-tab" name="tabs">
    <label for="output-tab">🌟</label>
    <div class="tab" id="output-div"><h3 style="margin-top:1em; margin-bottom:1em">input/output permalinks</h3><p>calculang input: <a href="/_file/cul/playground.cul.js" target="_blank"><code>playground.cul.js</code></a> <span style="color:gray">|</span> <a title="The actuarial model on which the Playground actuarial model is based" href="/_file/cul/basicterm.cul.js" target="_blank"><code>basicterm.cul.js</code></a> <small style="font-style:italic"><code>basicterm.cul.js</code> <a href="https://x.com/calculang/status/1811044584207560929/photo/1" target="_blank">reconciles</a> to <a href="">lifelibs BasicTerm</a></small><p>compiled Javascript bundle: <a href="/playground.bundle.js" target="_blank"><code>playground.bundle.js</code></a> <small style="font-style:italic">or see browser devtools or <a href="https://github.com/calculang/calculang/tree/all_cul/packages/standalone" target="_blank">calculang compiler API</a></small></p></p></div>
    <input type="radio" class="plausible-event-name=Module+Relationships+Tab" id="module-relationships" name="tabs">
    <label for="module-relationships">♻️</label>
    <div class="tab" id="module-relationships-div"><div></div></div>
    <input type="radio" class="plausible-event-name=Question+Tab" id="help-tab" name="tabs">
    <label for="help-tab">❓</label>
    <div class="tab" id="help-div" style="padding: 1em; max-height: 300px">

<strong>Actuarial Playground</strong> applies visualization and interaction techniques to see and explore a simple actuarial cashflow model - using direct manipulation of model parameters. You can also see and change the calculang formulas that describe the calculations. Throughout, model outputs reactively update ⚡

<ul>
<li>calculations described by <a target="_blank" href="https://calculang.dev">calculang</a>: a language for calculations - designed for <strong>all calculations and models</strong> and <strong>not a black box</strong></li>
<li>calculations execute in Javascript - the language of the web and an <strong>already-ubiquitous</strong> platform for modelling: inside your organisation, in your browser, in the cloud, even on your mobile 🏢☁️</p>
</ul>

<h3>calculang formulas 🧱</h2>
<p>In calculang, formulas are the building blocks of calculations. You can <strong>see and change</strong> formula code under the '💬' tab.</p>

<p>The Playground calculang model (<code>playground.cul.js</code>) uses a <a target="_blank"  href="https://lifelib.io/libraries/basiclife/BasicTerm_SE.html">BasicTerm</a> calculang model that I migrated from the <a target="_blank" href="https://lifelib.io/">lifelib</a> project (<a target="_blank" href="https://x.com/calculang/status/1811044584207560929">reconciliation</a>) - with one key change to show 'past' calculated cashflows as well as future.</p>

<h3>Playground requirements</h3>

<p>For the Playground I had new requirements, especially:</p>

<ul>

<li>to <strong>recalculate premium rates</strong> directly within the model</li>
<ul><li><details class="plausible-event-name=Why+Premium+Rates" style="margin-bottom: 0.5em"><summary>Why?</summary>The BasicTerm model looks up premium rates in a table; but I want the Playground to be able to explore different pricing bases, and be robust to unseen product developments and to assumption tweaks</details></li></ul>
<li>to add some <strong>stress functionality for assumptions</strong></li>
<li>to set <strong>Playground-specific assumptions</strong> <small>(noteably an uplift for male mortality rates versus female mortality rates)</small></li>
<li>to recalculate BasicTerms parametric mortality rate model</li>
<ul><li><details class="plausible-event-name=Why+Mortality+Rates" style="margin-bottom: 0.5em"><summary>Why?</summary> The BasicTerm model looks up mortality rates in a table. Though I don't especially surface mortality rates in the Playground interface (now) I want <i>some place</i> where people can make parameter tweaks affecting mortality rates if they want to. In addition, I prefer numbers in this simple model to get traced to the formulas defining the parametric model - compared to an opaque table (a non-opaque table - the best of both worlds - would be better ⏳)</details></li></ul>
</ul>

<h3>model composition ♻️</h3>
<p>In calculang I am able to maintain new Playground requirements in a distinct file or module (<code>playground.cul.js</code>). This <strong>imports formulas</strong> directly from the <code>basicterm.cul.js</code> model, and specifies changes for premium rate calculation, assumption, and other formulas to meet the Playground requirements.</p><p>By systematically deleting formulas in <code>playground.cul.js</code>, you will have a Playground model that reconciles <strong><a target="_blank" href="https://x.com/calculang/status/1811044584207560929">exactly to BasicTerm</a></strong>.</p><p>This structure is an example of <strong>model composition</strong> that's possible using calculang.</p>
 
<p>The <strong>practical usecases</strong> for model composition are far more broad than what the Playground shows.</p>

<details class="plausible-event-name=More+Composition" style="margin-bottom:2em"><summary>More ℹ️</summary><p>In calculang models, model composition already informs approaches to isolate, reuse and test modelling logic in components, to perform reconciliations of models, calculate (and reconcile) multiple reporting bases, perform what-if analysis, scenario testing, and make ad-hoc/bespoke modelling changes.</p><p>It also prompts considerations for new development, restatement and model review practices which can take advantage of clearly isolated model changes and developments.</p></details>

<h3>multiple projections</h3>
<p>The premium recalculation (<code>premium_rate_per_mille</code> in <code>playground.cul.js</code>) is also particularly informative about calculang. It's based on a particular projection of claims: with one mille sum assured (€1,000) and other distinct details versus expected and stressed claims projections (e.g. conditional gender specified for optional gender-neutral rates).</p>
<p>In spite of multiple claims projections being needed to perform model calculations (including also actual/past claim calculations), there is <strong>only one single set</strong> of strictly claims-related formula code.</p>

<!--<p>Through only <a href="https://github.com/calculang/calculang?tab=readme-ov-file#design-principlesfeatures">a few</a> new concepts, these features of calculang promote developing formulas and models that are multi-purpose in an extreme way. The Playground model is a simple example. For more about calculang, see <a href="https://calculang.dev">calculang.dev</a> or get in touch.</p>-->

<h3>models as code</h3>
<p>calculang models are “code” and as such can integrate with already existing state-of-the-art tools and practices around auditability, version control and testing and development.</p>



    <div class="info" style="margin-bottom:0em; margin-left: 0.5em; margin-right: 0.5em; margin-top:3em;line-height:1.5em; border: 1px solid lightgrey; padding:3px; background: lightyellow">

<p>☎️ To provide feedback or else for customised/purpose-built models and modelling training/research access, <span class="active-button" style="display:inline-block"><strong><a href="mailto:dcnconsultingactuarial@gmail.com">get in touch</a></strong></span>.</p>

<p>📜 free and open source software licensed under the AGPLv3 <a target="_blank" href="https://github.com/declann/ActuarialPlayground.com">on GitHub</a> | <span><strong><a href="https://calcwithdec.dev">CalcWithDec.dev</a></strong></span></p>

</div>

<div class="info" style="margin-bottom:0em; margin-left: 0.5em; margin-right: 0.5em; margin-top:1.2em;line-height:1.5em; border: 1px solid lightgrey; padding:3px; background: lightyellow">

<p>⚠️ <strong>Disclaimer</strong>: The assumptions, methodology, limitations and issues of a model should be carefully considered for any purpose you apply it to.</p>

<p>I haven’t noted these for this Playground: which is presented for demonstration, education & applied research purposes. <strong>Use with caution</strong> 🙏</p>

</div>

      <div id="holder"><a target="_blank" href="https://github.com/declann/ActuarialPlayground.com"><img id="repo" width="25px" height="25px" src="/github-mark.png" /></a></div>


<p style="font-weight:bold; margin-top:2em">calculang-related tabs legend:</p>
      <p>💬 calculang formulas</p>
      <!--<p>⚡ manipulation by calculang compiler</p>-->
      <p>🌟 javascript module, and <a target="_blank" href="https://calculang.dev/#tools">introspection information</a> for developers and calculang tools</p>
      <p>♻️ calculang <a target="_blank" href="https://github.com/calculang/calculang?tab=readme-ov-file#design-principlesfeatures">modularity</a> graph</p>
      <p>❌ minimize</p>
      <!--<p>This website uses jsDelivr Content Delivery Networks to distribute resources</p>-->
    </div>
    <input type="radio" class="plausible-event-name=Minimize+Tab" checked="checked" id="minimize-tab" name="tabs">
    <label for="minimize-tab">❌</label><!-- ↑❎ -->
    
    <div class="tab" id="minimize-div"></div>
    `)

    div.append(d)

  div.querySelector('#filename').addEventListener('input', (e) => {div.setScope(+e.target.value)})

  div.querySelector('#add').addEventListener('click', async e => {
    if (window.plausible) window.plausible('calculang_add')
    // like a custom setFS, todo better apis
    let fs = {...div.fs}
    const newEntrypoint = `my-playground-${Math.floor(Math.random()*1000)}.cul.js`
    fs[newEntrypoint] = `
// make your own changes here! But be careful: this is experimental 🧪
// It's not intended to be a productive or validation/audit-friendly environment - it's a Playground!
// Ask me if you need such a thing.

//If you make something interesting, you can share it on GitHub Discussions:
//  https://github.com/declann/ActuarialPlayground.com/discussions

// ⚠️ Visual inspection and instant feedback that the Playground prompts are useful tools for validation,
//   but not a replacement for other appropriate validation and testing approaches.

// Never paste other peoples code unless you understand it!

// Here are some ideas:
// - override mort_rate_select_index to remove select mortality effect
// - override mort_rate_mth to reflect a uniform distribution of deaths assumption
//      How can you visualization to do some validation? (🧩 decrement controls and zoom with a mouse wheel is useful)
//                             (PS: hold shift to zoom on the vertical (amount) axis only)
// - simulate experience that includes deaths or lapses
//        always be careful about the complete projections you are affecting (notably including the premium calculation)
// - add some reserves, like the simple ones I described here: https://calcwithdec.dev/posts/actuarial-terms-i/
// - DTA and indexation
// - even annuities are possible - I built single premium pricing UI for this - what assumptions are important to adjust?

//   This specific environment doesn't offer a lot of help - but it's possible.
// You can ask me for recipes for all of these things.

import { all_cul } from '${div.entrypoint}';
// note: you might notice 0s being added to all_cul as you work: you can ignore them!

// NEW FORMULAS HERE:

// an unreasonable large expense on death
//export const placeholder = () => -50000 * pols_death()

// remove mortality select effect (all projections)
//export const mort_rate_select_index = () => 5


`
 //import { balance } from "https://calculang.dev/models/simple-loan/simple-loan.cul.js"
 //export const claim_pp = () => sum_assured()
 //export const claim_pp = () => balance({ year_in: duration(), principal_in: sum_assured(), d_i_year_in: -10, i_in: .1, d_i_in: 0, missed_repayment_year_in: -10, skip_interest_in: false, term_in: policy_term() })
 
 
    
    //div.entrypoint = './basicterm.cul.js'
    div.entrypoint = newEntrypoint
    //div.filename = 'my-playground.cul.js'
    //div.scope = 1
    //div.setFS(fs)
    div.fs = {...fs} // this is basicallty 
    await div.compile()
    div.setScope(0)
    div.aa.dispatch(//aa.state.update(
      {
        changes: { from: 0, to: div.aa.state.doc.length, insert: fs[div.entrypoint] }
      }
    )
    //
  })

  const g = div.querySelector('#module-relationships-div')

  div.filename = entrypoint//'entrypoint.cul.js'
  div.entrypoint = entrypoint
  div.scope = 0
  div.model = {}
  div.introspection = {}

  div.setFS = async (d) => {
    //debugger;
    inhibit = true;
    if (1) {
      //div.scope = 0
      if (div.scope) div.setScope(0) // fixes hang when change lapse formula with scope 1 navigated
      div.fs = d;//({"entrypoint.cul.js": d})
      div.old_fs = {...d}
      // recompile
      // update a, update ab
      div.aa.dispatch(//aa.state.update(
        {
          changes: { from: 0, to: div.aa.state.doc.length, insert: div.old_fs[div.entrypoint] }
        }
      )
    } inhibit = false

    await div.compile()
  }

  div.scope_change_count  = 0

  div.setScope = d => {
    if (window.plausible && [0,1,2,3,10,50].includes(div.scope_change_count)) 
      window.plausible('scope_count', {props: {scope_count: ++div.scope_change_count}})

    div.scope = d
    div.filename = [...div.introspection.cul_scope_ids_to_resource.values()][div.scope].split("?")[0]
    //document.getElementById('filename').textContent = div.filename
    document.getElementById('scope').textContent = 'scope ' + div.scope
    if (!actuarial_playground) // to see JS output look in devtools
    bb.dispatch(//aa.state.update(
      {
        changes: { from: 0, to: bb.state.doc.length, insert: div.compiled[div.scope].code }
      }
    )
    //debugger
    div.aa.dispatch(//aa.state.update(
      {
        changes: { from: 0, to: div.aa.state.doc.length, insert: div.fs[div.filename] }
      }
    )
    console.log('filename', div.filename)

    updateOriginal(div.fs[div.filename])

 


  }


  div.setFS(/*{'entrypoint.cul.js': doc}*/defaultFS)
  div.id = 'tabs-container'
  //div.fs = ({'entrypoint.cul.js': doc})
  //

  // I could group into a big html`` call if editor can go into  easily


  div.aa = a({ parent: div.querySelector('#input-div'), div, set_formulae_visible, setCursor, setFormula, fmt });
  const bb = b({ parent: div.querySelector('#interim-div') });


  div.count = -1; // due to automatic compiles. NOTE when streamline dataflow sync this

  div.compile = async () => {

    //debugger

    // counts scope change, lapse code change, etc.and code editing @ KEYPRESS level !
    if (window.plausible && [0,1,2,10,20,100,500,2000].includes(div.count)) {
      window.plausible('compile_count', {props: {compile_count: div.count}})
      //console.log('plausible compile_count', {props: {compile_count: div.count}})
    }
    div.count++

    updateOriginal(div.old_fs[div.filename]) // TODO take this out of hot compile path

    //debugger

    //div.old_fs = ({...div.fs})
    console.time('pre_fetch (network bound)');
    const new_fs0 = await pre_fetch(div.fs, div.entrypoint) // has all_cul -> all_cul0
    console.timeEnd('pre_fetch (network bound)');
    let new_fs = {...div.fs}
    Object.entries(new_fs0).forEach(([k,v]) => {
      if (new_fs[k] == undefined || new_fs[k].length == 0) {
        new_fs[k] = v
        console.log('added k', k)
      }
    })
    div.fs = {...new_fs0} // done ?
    //debugger;

    console.time('getIntrospection');
    div.introspection = await getIntrospection(div.entrypoint, new_fs)
    console.timeEnd('getIntrospection');
    //debugger
    div.inspector.fulfilled(div.introspection)
    setIntrospection(div.introspection)
    console.time('compile_new');
    div.compiled = await compile_new(div.entrypoint, div.introspection.fs0, div.introspection)
    console.timeEnd('compile_new');


    try {
      console.time('bundleIntoOne');
      const bundled = bundleIntoOne(div.compiled, div.introspection, true);
      console.timeEnd('bundleIntoOne');

      console.time('packageCalculang_new');
      div.model = await packageCalculang_new(bundled);
      console.timeEnd('packageCalculang_new');

      div.inspector_compiled.fulfilled(div.model)
      setModel(div.model)
      setCompilations(div.compiled)
      } catch(e) {console.error('ERR', e)}

      try {
      div.inspector_compiled2.fulfilled(/*await bundleIntoOne(div.compiled,div.introspection, true)*/ div.model.bundle) // playground: this inspector isn't shown (shown in metal or -foc only?)
      } catch(e) {console.error('ERR', e)}

    //debugger;

    const show_query_string = false;

    const scope_id_graph_links = [...div.introspection.cul_scope_ids_to_resource.entries()]
  .filter(([cul_scope_id]) => cul_scope_id != 0)
  .map(
    ([cul_scope_id, resource]) =>
      new URLSearchParams(resource.split("?").pop()).get("cul_scope_id") +
      " -> " +
      new URLSearchParams(resource).get("cul_parent_scope_id")
  )

  const selectElement = document.getElementById('filename');
  const currentValue = selectElement.value;

  //selectElement.innerHTML = '';

  const options = [...div.introspection.cul_scope_ids_to_resource.entries()]; // TODO, recreating all
  let optionsHTML = options.map(([cul_scope_id,filename]) => `<option ${cul_scope_id==div.scope ? 'selected' : ''} value="${cul_scope_id}">[${cul_scope_id}] ${cul_scope_id == 0 ? filename + ' (entrypoint)' : filename.slice(0,filename.indexOf('?'))}</option>`).join('');
  //debugger;
  selectElement.innerHTML = optionsHTML
  /*options.forEach(([cul_scope_id,filename]) => {
    const option = document.createElement('option');
    option.text = `[${cul_scope_id}] ${cul_scope_id == 0 ? filename + ' (entrypoint)' : filename.slice(0,filename.indexOf('?'))}`;
    option.value = cul_scope_id;
    selectElement.add(option);
  });*/

  //selectElement.value = div.scope;


    // viz-js is slow to load (1MB), playground optimize: disable

    const scope_id_graph_nodes = [
      ...div.introspection.cul_scope_ids_to_resource.entries()
    ].map(
      (d) =>
        `${d[0]} [${
          d[0] == 0
            ? 'color="green" style="filled" '
            : 'color="yellow" style="filled" '
        }label="[${d[0]}]: ${
          show_query_string
            ? d[1].replaceAll("-nomemo", "")
            : d[1].replaceAll("-nomemo", "").split("?")[0]
        }"]`
    )

    instance().then(viz => {
      g.firstChild.replaceWith(viz.renderSVGElement(`digraph {
        bgcolor="#90EE90"
        ${/*rankdir="RL"*/";"}
        rankdir="BT";
        node [shape="box"]
        ${scope_id_graph_nodes.join("\n")}
        ${scope_id_graph_links.join("\n")}
        }`))
    })


    // THIS OFF MASSIVELY IMPROVES PERF FOR LARGE DOCS LIKE LL
    // redundant?
    //bb.dispatch(//aa.state.update(
    //  {
    //    changes: { from: 0, to: bb.state.doc.length, insert: div.compiled[div.scope].code }
    //  }
    //)
  }






let view = bb;

function updateOriginal(newContent) {
  if (actuarial_playground) return; // OFF FOR PERF // THIS OFF MASSIVELY IMPROVES PERF, TOFIX
  const newDoc = Text.of(newContent.split("\n"));

  const changes = ChangeSet.of({
    from: 0,
    to: 0,//originalDoc.length, ????????
    insert: newContent
  });

  view.dispatch({
    effects: updateOriginalDoc.of({ doc: newDoc, changes })
  });
}

const n = document.createElement('div')
const n2 = document.createElement('div')
const n3 = document.createElement('div')
const n4 = document.createElement('div')

div.inspector = new Inspector(n);
div.inspector.fulfilled(div.introspection)
div.inspector_compiled = new Inspector(n2);
div.inspector_compiled.fulfilled(div.compiled)
div.inspector_compiled2 = new Inspector(n4);
div.inspector_compiled2.fulfilled(div.compiled)

n3.appendChild(html`<br/>ℹ️ <b><a target="_blank" href="https://calculang.dev/#tools">introspection object`)
n3.appendChild(n)
n3.appendChild(html`<br/>🇫 <b><a target="_blank" href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules">Javascript Module</a>`)
n3.appendChild(n2)

//n3.appendChild(html`<br/>📜 <b>Javascript Code`)
//n3.appendChild(n4)

const o = div.querySelector('#output-div')


o.prepend(n3)
//Inspector.into(n).fulfilled({hi: 'world'})


return div
}
