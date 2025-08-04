
<script type="module" src="./cookieconsent-config.js"></script>
<script defer type="text/plain" data-category="analytics" data-domain="actuarialplayground.com">
// modified from https://plausible.io/js/script.outbound-links.pageview-props.tagged-events.js
!function(){"use strict";var i=window.location,o=window.document,l=o.currentScript,u=l.getAttribute("data-api")||/*DN new URL(t.src).origin*/"https://plausible.io"+"/api/event",s=l.getAttribute("data-domain");function p(t,e,n){e&&console.warn("Ignoring Event: "+e),n&&n.callback&&n.callback()}function e(t,e){if(/^localhost$|^127(\.[0-9]+){0,2}\.[0-9]+$|^\[::1?\]$/.test(i.hostname)||"file:"===i.protocol)return p(0,"localhost",e);if((window._phantom||window.__nightmare||window.navigator.webdriver||window.Cypress)&&!window.__plausible)return p(0,null,e);try{if("true"===window.localStorage.plausible_ignore)return p(0,"localStorage flag",e)}catch(t){}var n,a={},t=(a.n=t,a.u=i.href,a.d=s,a.r=o.referrer||null,e&&e.meta&&(a.m=JSON.stringify(e.meta)),e&&e.props&&(a.p=e.props),l.getAttributeNames().filter(function(t){return"event-"===t.substring(0,6)})),r=a.p||{};t.forEach(function(t){var e=t.replace("event-",""),t=l.getAttribute(t);r[e]=r[e]||t}),a.p=r,t=u,a=a,n=e,window.fetch&&fetch(t,{method:"POST",headers:{"Content-Type":"text/plain"},keepalive:!0,body:JSON.stringify(a)}).then(function(t){n&&n.callback&&n.callback({status:t.status})})}var t=window.plausible&&window.plausible.q||[];window.plausible=e;for(var n,a=0;a<t.length;a++)e.apply(this,t[a]);function r(t){t&&n===i.pathname||(n=i.pathname,e("pageview"))}function c(){r(!0)}var f,d=window.history;function v(t){return t&&t.tagName&&"a"===t.tagName.toLowerCase()}d.pushState&&(f=d.pushState,d.pushState=function(){f.apply(this,arguments),c()},window.addEventListener("popstate",c)),"prerender"===o.visibilityState?o.addEventListener("visibilitychange",function(){n||"visible"!==o.visibilityState||r()}):r();var h=1;function m(t){var e,n;if("auxclick"!==t.type||t.button===h)return(e=function(t){for(;t&&(void 0===t.tagName||!v(t)||!t.href);)t=t.parentNode;return t}(t.target))&&e.href&&e.href.split("?")[0],!function t(e,n){if(!e||g<n)return!1;if(k(e))return!0;return t(e.parentNode,n+1)}(e,0)&&(n=e)&&n.href&&n.host&&n.host!==i.host?w(t,e,{name:"Outbound Link: Click",props:{url:e.href}}):void 0}function w(t,e,n){var a,r=!1;function i(){r||(r=!0,window.location=e.href)}!function(t,e){if(!t.defaultPrevented)return e=!e.target||e.target.match(/^_(self|parent|top)$/i),t=!(t.ctrlKey||t.metaKey||t.shiftKey)&&"click"===t.type,e&&t}(t,e)?(a={props:n.props},plausible(n.name,a)):(a={props:n.props,callback:i},plausible(n.name,a),setTimeout(i,5e3),t.preventDefault())}function b(t){var t=k(t)?t:t&&t.parentNode,e={name:null,props:{}},n=t&&t.classList;if(n)for(var a=0;a<n.length;a++){var r,i=n.item(a).match(/plausible-event-(.+)(=|--)(.+)/);i&&(r=i[1],i=i[3].replace(/\+/g," "),"name"==r.toLowerCase()?e.name=i:e.props[r]=i)}return e}o.addEventListener("click",m),o.addEventListener("auxclick",m);var g=3;function y(t){if("auxclick"!==t.type||t.button===h){for(var e,n,a,r,i=t.target,o=0;o<=g&&i;o++){if((a=i)&&a.tagName&&"form"===a.tagName.toLowerCase())return;v(i)&&(e=i),k(i)&&(n=i),i=i.parentNode}n&&(r=b(n),e?(r.props.url=e.href,w(t,e,r)):((t={}).props=r.props,plausible(r.name,t)))}}function k(t){var e=t&&t.classList;if(e)for(var n=0;n<e.length;n++)if(e.item(n).match(/plausible-event-name(=|--)(.+)/))return!0;return!1}o.addEventListener("submit",function(t){var e,n=t.target,a=b(n);function r(){e||(e=!0,n.submit())}a.name&&(t.preventDefault(),e=!1,setTimeout(r,5e3),t={props:a.props,callback:r},plausible(a.name,t))}),o.addEventListener("click",y),o.addEventListener("auxclick",y)}();//window.plausible = window.plausible
window.plausible = window.plausible || function() { (window.plausible.q = window.plausible.q || []).push(arguments) }
</script>
<!--<script>window.plausible = window.plausible || function() { (window.plausible.q = window.plausible.q || []).push(arguments) }</script>-->

```js
import { introspection as getIntrospection, compile_new, bundleIntoOne, packageCalculang_new, calls_fromDefinition } from "https://cdn.jsdelivr.net/gh/calculang/calculang@db0582b/packages/standalone/index.js" //"https://raw.githack.com/calculang/calculang/all_cul/packages/standalone/index.js"//"https://cdn.jsdelivr.net/gh/calculang/calculang@dev/packages/standalone/index.js"


const compiled = compilations

//const esm = compiled[0]
```


```js
const scrollIntoViewOpts = {behaviour:'smooth', block:'center'}

```



```js
display(html`<style>

/*.vega-embed {
  width: 100%;
  height: 100%;
}*/
  
  .answer {
    color: blue !important;
    font-weight: bold;
    font-size: 1.2em !important;
    left: 80px !important;
    top: 6px;
}
  .answer .tooltiptext  {
    /*border: 2px dashed black;*/
    background: #af5;
    padding: 0px 5px;
    border-radius: 10px;
    border: 1px solid darkgreen;
  
  }

  .answer .tooltiptext::after {
    /*color: red;*/
    border: none;
  }
  
.answer:hover {
  /*font-size:2em !important;*/
}
  
  

pre {
  line-height: 25px;
}

.calculang_tooltip {
  color: red;
  position: relative;

}

.tooltiptext {
  position: absolute;
  bottom: calc(100% - 1em);
  left: anchor(center);
  transform: translateX(-50%);
  width: max-content;
  font-size:smaller;

 background-color:rgb(100 202 255 / 5%);/*background color and opacity together*/
    font-weight: bold;
  border: none; /*1px solid lightgrey;*/
  /*padding: 4px;*/
  border-radius:5px;
  /*overflow-wrap: break-word*/
  text-wrap: nowrap;

}

.tooltiptext {
  /*cursor: zoom-in;*/
}


.calculang_tooltip.answer .tooltiptext {
  bottom: 0;
} 

calculang_tooltip.answer {
    background-color: lightorange;
}


pre {
  cursor:default
}
  </style>
  `)

display(html`<style></style>` ?? html`<style>/* DN DISABLED NAVIGATION STYLES */

.inputs {
  padding: 20px;
}

button.btn {
  background-color: antiquewhite;
  color: blue;
  padding:0;
}

.calculang {
  line-height: 40px;
    -webkit-transition: all 0.2s linear;
    -moz-transition: all 0.2s linear;
    -o-transition: all 0.2s linear;
    transition: all 0.2s linear;
  
}
div.calculang.cm-line:has(span.calculang_title) {
  margin-top:20px;
}

.calculang.calculang_overwritten { /* not getting picked up ? */
  text-decoration: line-through;
  font-weight: bold;
}

${formulae_hidden.length ? `.calculang {
    background: #aaf3;
}` : ''}


${formulae_hidden.map(d => `.calculang_f_${d} + .calculang_f_${d}`).join(', ')} {
  filter: blur(7px);
  line-height: 5px;
  opacity: 0.5;
} /* + selector to exclude first! https://coderwall.com/p/uugurw/css-selector-trick-select-all-elements-except-the-first */
${formulae_hidden.map(d => `.calculang_f_${d}`).join(', ')} {
  opacity: 0.5;
  background: white;
}${formulae_hidden.map(d => `.calculang_f_${d} .calculang_tooltip`).join(', ')} {
  opacity: 0.1;
  background: white;
}
${formulae_hidden.map(d => `.calculang_f_${d} > .calculang_title`).join(', ')} {
  background-color: lightgreen;
  font-size: 0.5em;
}



.tooltiptext {/* not all tooltiptexts go under a calculang call span! (single-length ones dont) */
  /*color: red;*/
  font-weight: bold;

}

.calculang .calculang_title span {
  padding: 3px;
  background: #af54;
  font-size: 1.5em;
  font-weight: bold;
  border: 1px solid grey;
    -webkit-transition: all 0.2s linear;
    -moz-transition: all 0.2s linear;
    -o-transition: all 0.2s linear;
    transition: all 0.2s linear;

}
</style>
`)
```

<style>
.calculang_overwritten {
  text-decoration: line-through;
  font-weight: normal;
}
.calculang_title span {
  background: lightblue;
  border-bottom: 1px solid blue;
}
.calculang_title.calculang_title_input span {
  background: pink;
  border-bottom: 1px solid hotpink;
}

span.calculang_call { 
  white-space:nowrap;
  /*cursor: zoom-in;*/
  background-color: lightblue;
}

.calculang_call.calculang_call_input {
  /*cursor: none;*/
  background-color: pink;
}

.calculang_call.calculang_call_input .tooltiptext {
  color: #f53 !important;;
}


.calculang_title.calculang_title_renamed {
  text-decoration: line-through;
  text-decoration-style: dashed;
}
</style>

```js
const optimize_perf = true // when flipping this, add sourcemap stuff:

/*
import { SourceMapConsumer } from 'npm:source-map-js';

const map = new SourceMapConsumer(esm.map);




const maps = compiled.map(d => d.map)
const mapsc = maps.map(d => new SourceMapConsumer(d))
*/
```

```js
const maps = [] // set as empty while optimize_perf = true
const mapsc = [] // 
```

```js


// AMAZING THIS ENTIRE THING RUNS ON CURSOR CHANGE (update: conditioning on optimize_perf): NOT JUST THE selection_fn
// THIS MUST EXPLAIN A LOT OF SLOWNESS AND CONSOLE ERRORS
// CAN I USE inputs FROM cul_input_map?
// AND REMOVE THIS DEPENDENCY?
const calls_annotations = optimize_perf ? [] :
  calls_fromDefinition(introspection).filter(d => d.reason == 'call' && d.from != '0_undefined')
  .map (d => ({...d, cul_scope_id: +d.from/*from/to are consistent due to bringing everything into common scope*/.split('_')[0], name: d.from.split('_').slice(1).join('_')}))
        .map((d) => ({
        ...d,
        mjs_loc: {
          start: mapsc[d.cul_scope_id].generatedPositionFor({
            ...d.loc.start,
            source: maps[d.cul_scope_id].sources[0] //`${only_entrypoint_no_cul_js}-nomemo.cul.js` // todo update !
          }),
          end: mapsc[d.cul_scope_id].generatedPositionFor({
            ...d.loc.end,
            source: maps[d.cul_scope_id].sources[0] //`${only_entrypoint_no_cul_js}-nomemo.cul.js`
          })
        }
      }))
      .map((d) => ({
        ...d,
        mjs: compiled[d.cul_scope_id].code
          .split("\n")
        [d.mjs_loc.start.line - 1].substring(
          d.mjs_loc.start.column,
          d.mjs_loc.end.column
        )
      })) // assuming completely on one line
      .map(d => ({...d, mjs: d.mjs.slice(-1) == ')' ? d.mjs : d.mjs+')'}))/*issue for simple-loan final call for some reason??*/
      //.map(d => ({...d, mjs: `s${d.cul_scope_id}_${d.mjs}`}))
       .map(d => {
//         if (!(CONFIG.USE_HIGHLIGHTING || 0)) return d;
//         //return d; I did stop this for some reason? DOESNT WORK FOR LIFE
//debugger
   const selection_fn = new Function("model", "{"+Object.keys(cursor).join(",")+"}", `Object.assign(window, model); try { return ({value:s${d.fromDefinition}${d.mjs.slice(d.name.length)}, cursor: ${d.mjs.slice(d.from.length-2)}}) } catch(e) { console.error('trap2', e)}`) // using hacky way to get cursor, for calculang-at-fosdem I used babel: `is` function
  return {...d, ...selection_fn(model, cursor)} // try important due to cursor often not setup initially (e.g. awaiting)
 })
```

```js

//console.log('fns_annotations1')

const run_renamed_fns = true // more important for showing workings; Actuarial Playground doesn't. Mitigates some console errors for s1_pv_fut_pols_if_ sometimes


//debugger
const fns_annotations = [...introspection.cul_functions.values()].filter(d => (optimize_perf == false) || ([/* todo prepend the class that fn_annots updates so that i can easier search for them for this optimization */"status", "premium_pp_0", "premium_rate_per_mille", "sum_assured", "duration_mth", "expense_acq", "expense_maint", "commission_pc", "commission_mths", "inflation_rate", "stress_delay", "mort_rate_Y1_add_per_mille", "expenses_factor", "inflation_rate_addition", "loading_prem"].includes(d.name))).filter(
        (d) =>
          d.reason == "definition" || (d.reason == 'definition (renamed)' && run_renamed_fns) /*&&
          d.cul_scope_id == cul_scope_id*/
      )
      .map(d => {
        //if (d.name == 'leftness') debugger;
        //debugger;
        const dd = {...d}
        //debugger;
        dd.inputs = [...introspection.cul_input_map.get(d.cul_scope_id+'_'+d.name)]

        // I don't call model[]() directly because the cursor wouldn't be the actual cursor the code calls (we must evaluate cursor changes like {t_in:t()-1} )
        const selection_fn = new Function("model", "{"+dd.inputs.join(",")+"}", `Object.assign(window, model); try { return s${dd.cul_scope_id}_${d.name}({${dd.inputs.join(",")}}) } catch(e) { console.error('trap', e) }`)

        dd.v = selection_fn(model, cursor)

        return dd //return selection_fn(model, c)
      })

window.fns_annotations = fns_annotations;
```

```js


// F9-eval? see https://www.youtube.com/watch?v=uXUd_-xrycs&t=2s
//const selection_start = map.generatedPositionFor({...selection.from, source:"unknown"})
//const selection_end = map.generatedPositionFor({...selection.to, source:"unknown"})

//const esm_split = esm.code.split('\n')
```

```js
const formulae_all = [...introspection.cul_functions.values()].filter(d => d.reason == 'definition').map(d => d.name)

const formulae_hidden = formulae_all.filter((d) => !formulae_visible.includes(d))


```



```js
/*cul_scope_id;
console.log('CUL SCOPE ID', cul_scope_id); // 
*/

//console.log('fns_annotations')

// DOM not updated at this point in scope change !!
fns_annotations.forEach((d,i) => {
  // error => breaks follow ups
  if (0) { // TEMP Answers instead of tooltips
  if (document.getElementById(d.name)) // TODO replace with fmt?
  document.getElementById(d.name).innerHTML = JSON.stringify(d.v) /*d3.format(',.2f')(d.v)*/ + "<div class='cm-tooltip-arrow' />"
  }
  else {
    //debugger;
    let e = document.getElementById('a-'+i)
    if (e)
    e.textContent = fmt(d.name, d.v)//fmt(v);
  }
});
```

```js
window.calls_annotations = calls_annotations;

calls_annotations.forEach((d, i) => {
  // error => breaks follow ups
  if (document.getElementById('w-'+i))
  document.getElementById('w-'+i).textContent = fmt(/*d.from.split('_').slice(1).join('_')*/d.name, d.value)//JSON.stringify(d.v) /*d3.format(',.2f')(d.v)*/ + "<div class='cm-tooltip-arrow' />"
});
```

```js
const cursor = {...cursor0} // TODO add extra when I do reactive

window.cursor = cursor
```

<details id="opts" style="opacity:0.3; font-size:0.4em"><summary>opts</summary>

```js
const fmt_default = view(Inputs.text({value:",.4f", label: 'fallback format string (if used)'}))
const actions = view(Inputs.toggle({label:'vega actions', value: false}))
```

</details>



<style>

  body {margin: 0}

  #tabs-container {
    /*border: 4px dotted rgba(200,0,0,0.2);
    border-radius: 40px;
    background: rgba(0,100,100,0.01);*/
    /*border-right: 5px solid red;*/
    display: flex;
    /*flex-wrap: nowrap;*/
  }

  #tabs-container input[type="radio"] {
    display: none;
  }

  #tabs-container label {
    padding: 8px 12px;
    margin: 2px;
    border: 1px solid gray;
  }

  #tabs-container .tab {
    width: 100%;
    /*background: gray;*/
    /*border: 1px solid grey;*/
    border-top: none;
    order: 0;
    /*display: none;*/ /* OPTIONAL */
  }

  #tabs-container input[type="radio"] + label:hover {
    /*font-size: 1.3em;*/
background: linear-gradient(skyblue, lightgreen);    /*border-radius: 4px;*/
  }


  #tabs-container input[type="radio"] + label {
background: linear-gradient(skyblue, #9198e5);    /*border-radius: 4px;*/
    border-radius: 10px 10px 0 0;
    /*border: 1px solid black;*/
    border-bottom: none;
    /*display:flex;
    flex-direction: column;
    align-items: bottom;*/
    /*margin: auto 0;*/
    align-self: flex-end;
  }
  #tabs-container input[type="radio"]:checked + label {
    font-size: 1.5em;
    background:white;
    padding: 3px 14px;
    border: 2px solid black;
    border-bottom: none;
  }

  #tabs-container input[type="radio"]:checked + label + .tab {
    /*display: block;*/ /* OPTIONAL */
    /*background: white;*/
    
  }


</style>

```js
const tabs = true;

display(html`
<style>
${tabs && `#tabs-container input[type="radio"]:checked + label + .tab {
  display: block;
}
#tabs-container .tab {
  display: none;
}
#tabs-container .tab {
  order: 1;
}
#tabs-container {
  flex-wrap: wrap;
}

`}
</style>
`)
```

<style>
          /*.cm-editor { overflow: "auto" }*/



  .cm-changedText {
    /*background: linear-gradient(rgba(200,250,200,0.9), rgba(200,100,200,0.9)) bottom/100% 14px no-repeat !important*/
    background: lightgreen !important;
    color: blue;
    //background: linear-gradient(rgba(2,0,36,0) 0%, rgba(9,9,121,0.5) 35%, rgba(0,212,255,0.1) 100%)
 !important;

  }

  #c {
    /*border: 4px dotted rgba(200,0,0,0.2);
    border-radius: 40px;
    background: rgba(0,100,100,0.01);*/
  }

  #divB .cm-line {
    background-color: rgba(25,20,100,0.04) !important;
  }

  /*.cm-insertedLine > span:not(.cm-changedText) {
  }
  .cm-insertedLine {
    background: rgba(25,20,20,0.1);//opacity: 0.1;
  }
  .cm-line {
    background: rgba(25,20,20,0.1);//opacity: 0.1;
  }*/
</style>

<style>
  /* CODEMIRROR STYLES */
    .cm-changedLineGutter {
    display: none;
  }

  .cm-deletedChunk {
    opacity:0.5;
    display:none;
  }

  #module-relationships {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
   #module-relationships svg {
    border: 0.1px dotted gray;
    padding: 6px;
   }
   #module-relationships svg {
    width: 100px;

   }
</style>


<div class="container">

<div class="box-1">


```js
const cursor0 = Mutable({}) // every input should be in, but with what values?

const setCursor = (o) => {
  let new_cursor = {...cursor0.value}
  //if (k == 'ray_angle_in') debugger;
  //if (k == 'keys_stream_function_in') debugger;
  Object.entries(o).forEach(([k,v]) => {
  new_cursor[k] = v;
  })
  cursor0.value = {...new_cursor}
}
```


```js
const formula = Mutable("")

const setFormula = (v) => {
  formula.value = v
}
```


```js
import {ab} from './components/editor.js'

const selection = Mutable({from:{line:1,column:1}, to:{line:1,column:2}})


const formulae_visible = Mutable([]); // chg to all ? formulae_all
const hover = Mutable(""); // chg to all ? formulae_all

function set_formulae_visible (d) {
  formulae_visible.value = [...d]
}

function set_hover (d) {
  hover.value = d
}


const x = ab({entrypoint: 'playground.cul.js', defaultFS: default_fs /* optimisation: somehow this vs placeholder= 800ms in babel script (bottom up) vs 1600ms */, setModel, setIntrospection, setCompilations,
              set_formulae_visible, set_hover,
              setCursor,
              setFormula, fmt})

display(x)
```
```js
import { calcuvizspec } from "https://cdn.jsdelivr.net/gh/declann/calculang-js-browser-dev@main/helpers.js"

import {calcuvegadata} from './components/calcuvegadata.js'



```

```js
//x.compile();
//await x.setScope(0);
```

```js
const model = Mutable({});
const old_model = Mutable({});

function setModel(v) {
  old_model.value = model.value;
  model.value = v;
}
```

```js
const compilations = Mutable([]);

function setCompilations(v) {
  compilations.value = [...v];
}
```

```js
const introspection = Mutable({});

function setIntrospection(v) {
  introspection.value = v;
}
```

```js
//echos;

// wrap echoed source code by details tag
// this causes problems in FF mobile??
/*document.querySelectorAll('.observablehq-pre-container:has(> pre[data-language="js"])').forEach(el => {
  // no echos on dev server:
  if (window.location.origin.includes('127.0.0.1')) {
    el.remove();
    return;
  }
  let wrapper = document.createElement('details');
  wrapper.className = 'code'
  let summary = document.createElement('summary')
  summary.textContent = "code 👀"
  wrapper.appendChild(summary)
  el.parentNode.insertBefore(wrapper, el);
  wrapper.appendChild(el);
});*/
```

</div>

<div class="box-2" id ="aa">

```js

// these need more thought in a modular world
// or i am overthinking it
const inputs = [...introspection.cul_functions.values()].filter(d => d.reason == 'input definition' /* Breaks show demand curve && d.cul_scope_id == 0*/).map(d => d.name).sort()

//display(Object.values(introspection.cul_functions))
//display([...introspection.cul_functions.values()])

const formulae = [...introspection.cul_functions.values()].filter(d => d.reason == 'definition').map(d => d.name)


const formulae_not_inputs = [...introspection.cul_functions.values()].filter(d => d.reason == 'definition' && inputs.indexOf(d.name+'_in') == -1).map(d => d.name)
//display(formulae_not_inputs)



```

```js
window.dragged = false;
```


```js
function draggable_input({input, value=13, step=1}) {
  const ff = input//.slice(0,-3)
  const el = document.createElement('span')
  el.type = "number"
  el.value = value
  el.dataset.value = value
  el.textContent = fmt(ff.slice(0,-3), value)
  el.pattern = "[0-9]+"
  el.classList.add('input-scrubbable-number')
  el.classList.add('f')
  el.classList.add('input')
  el.classList.add(ff)
  el.oninput = (e) => {
    //setCursor(f, input.valueAsNumber)
    set(+el.dataset.value)
    console.log(e)
  }

  function set(v) {
    //debugger
    ///setCursor(f, v)
    value = v
  }

  let state = {
    eventToCoordinates(event) { return {x: event.clientX, y: event.clientY}; },
    dragging: null,
    get pos() {//debugger
        return {x: /*el.dataset.value*/window.cursor[input]/* this covers when an input appears twice: dont reset when the dragged one is switched *//step ?? 0, y: 0};
    },
    set pos(p) { 
        if (!window.dragged) {
          if (window.plausible) window.plausible('dragged')
          window.dragged = true
        }
        // This is a constrained drag that ignores the
        // y value. The x value gets turned into the
        // number.
        //el.value = el.valueAsNumber = Math.round(clamp(p.x, 0, 1000));
        el.dataset.value = /*Math.round(*//*p.dx*step+p.oldx*/Math.max(p.x*step,0)//)//Math.round(clamp(p.x, 0, 1000));
        // when zoomed out, the x change is fractional. For integer steps we usually don't want this, and should round instead
        el.textContent = fmt(ff.slice(0,-3), Number.isInteger(step) ? Math.round(el.dataset.value) : el.dataset.value)
    },
  }
  makeDraggable(state, el, step, input);


  return Object.defineProperty(el, "value", {get: () => value, set});
}

function clamp(x, lo, hi) { return x < lo ? lo : x > hi ? hi : x; }

function makeDraggable(state, el, step, input) {
    // from https://www.redblobgames.com/making-of/draggable/
    function start(event) {
        if (event.button !== 0) return; // left button only
        let {x, y} = state.eventToCoordinates(event);
        state.dragging = {dx: state.pos.x - x, dy: state.pos.y - y};
        el.setPointerCapture(event.pointerId);
        event.stopPropagation()
        event.preventDefault()
    }

    function end(_event) {
        state.dragging = null;
        _event.stopImmediatePropagation();
        _event.stopPropagation()
        _event.preventDefault()
    }

    function move(event) {
        if (!state.dragging) return;
        let {x, y} = state.eventToCoordinates(event);
        state.pos = {x: x + state.dragging.dx, y: y + state.dragging.dy, dx: state.dragging.dx, oldx:x, state};
        setCursor({[input]: Number.isInteger(step) ? (Math.round(+el.dataset.value)) : (+el.dataset.value)})
        //setCursor(input, Number.isInteger(step) ? (Math.round(+el.dataset.value)) : (+el.dataset.value))
        event.stopPropagation()
        event.preventDefault()
    }

    el.addEventListener('pointerdown', start);
    el.addEventListener('pointerup', end);
    el.addEventListener('pointercancel', end);
    el.addEventListener('pointermove', move)
    el.addEventListener('touchstart', (e) => {e.preventDefault(); e.stopPropagation});

    // add these to stop collapsing details when inside <summary>
    el.addEventListener('click', function(event) {
      event.stopPropagation();
      event.preventDefault();
    });
    el.addEventListener('mousedown', function(event) {
      event.stopPropagation();
    });

}
```



<style>

.input-scrubbable-number {
    font-size: 125%;
    width: 3em;
    border: none;
    border-bottom: 1px dashed hsl(0 50% 45%);
    border-radius: 4px;
    background: hsl(0 50% 50%);
    color: white;
    text-align: center;
    cursor: ew-resize;
    user-select: none;
    -webkit-user-select: none;
    /* mitigate safari mac context menu event? */
    -webkit-user-drag: none;
    -webkit-touch-callout: none; 
    pointer-events: all;
}

@keyframes fadeIn {
  0% { opacity: 0.5;background: #39ff14; }
  50% { background: #39ff14; opacity: 1; }
  80% { } /*dark theme should be black, but minor*/
  100% { opacity: 0.8; background:aliceblue /* not transparent, so borders never overlap */ }
}


@keyframes fadeIn-slow {
  0% {  }
  50% {  }
  80% { opacity: 1; background:aliceblue } /*dark theme should be black, but minor*/
  100% { opacity: 0.8; background:steelblue /* not transparent, so borders never overlap */ }
}

.introduce {
  animation: fadeIn ease 500ms;
  animation-fill-mode: forwards;  
}
.introduce.input-scrubbable-number, .introduce-negative.input-scrubbable-number, .introduce-neutral.input-scrubbable-number {
  animation: fadeIn-slow ease 500ms !important;
  animation-fill-mode: forwards;  
}


@keyframes fadeIn-negative {
  0% { opacity: 0.5;background: pink }
  50% { background: magenta; opacity: 1; }
  80% { } /*dark theme should be black, but minor*/
  100% { opacity: 0.8; background:aliceblue /* not transparent, so borders never overlap */ }
}

@keyframes fadeIn-neutral {
  0% { opacity: 0.5;background: aqua }
  50% { background: aqua; opacity: 1; }
  80% { } /*dark theme should be black, but minor*/
  100% { opacity: 0.8; background:aliceblue /* not transparent, so borders never overlap */ }
}

.introduce-negative {
  animation: fadeIn-negative ease 500ms;
  animation-fill-mode: forwards;  
}


.introduce-neutral {
  animation: fadeIn-neutral ease 500ms;
  animation-fill-mode: forwards;  
}

.input {
  background: steelblue !important;
  color: white;
  font-family: monospace;
}

.f {
  font-size: small;
  font-weight: bold;
  border: 1px solid lightgrey;
  padding: 7px;
  border-radius:5px;
  /*overflow-wrap: break-word*/
  text-wrap: nowrap;
  }
</style>


```js

//console.log('fns_annotations2')

//debugger

/*document.querySelectorAll('.tablet_cost').forEach(d => {
  d.textContent = model.tablet_cost(cursor) + Math.random()
  })*/
fns_annotations.forEach(d => {
  document.querySelectorAll('.'+d.name + ', .' + d.name+'_in').forEach(e => {
    //if (e.textContent != fmt(d.name, d.v)) { // LOST PRECISION for this comparison.....
    if (e.dataset.v != d.v) { // bad comparison?
      if (e.classList.contains('f')) { // flash off for workings because on code change all flash
        e.classList.remove('introduce')
        e.classList.remove('introduce-negative')
        e.classList.remove('introduce-neutral')
        e.focus()
      

      //if ((d.v - e.dataset.v) < -0.00001) e.classList.add('introduce-negative')
      const impact = d.v - e.dataset.v
      if (impact > 0.0000001) e.classList.add('introduce')
      else if (impact < 0.0000001) e.classList.add('introduce-negative')
      else e.classList.add('introduce-neutral') // neutral because d. pop impact on gigs
      }

      e.textContent = fmt(d.name,d.v)
      e.dataset.v = d.v
      e.value = d.v
    }
  })
});

```