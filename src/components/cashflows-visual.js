// SPDX-License-Identifier: AGPL-3.0-only
// Declan Naughton


// perf notes: Populate a detail and summary dataset is better? Do mean aggregation in arquero?
// highlighting doubles vega update time, push some transforms up to arquero?
// but issue also in # marks with highlighting: area marks slow
// and the simple keep/add/subtract filter also slow
// but BIGGEST THING BY FAR IS SIZE OF DATA (e.g. try 10 years)
// check how much panOffset signal affects perf?

// ideas: summary dataset AND no A in detail dataset (lose before/after functionality: but can add in fut.)
// Then reduce # marks (at least to two; but one if I can use existing colour scale with green/red overrides or HSL offsets)

// additional datasets:
//   - summary (2x sets)
//   - detail, but split into:
//       - B
//       - highlighting = keep/add/subtract  []
// area mark/s on B+highlighting, but highlighting empty if not enabled

// TODO figure out when not to calc A at all: == cursors?

// I broke fixed scale for NL, see BROKE

/* 
  SINGULAR:FALSE IS BUGGY !! CHECK FILTERS - FIXED
  GRADIENT FILTERS IS BUGGERY
*/

import _ from "https://cdn.jsdelivr.net/npm/lodash/+esm" //"npm:lodash";
import * as aq from "https://cdn.jsdelivr.net/npm/arquero/+esm" // "npm:arquero";

export const a = "hello"

const mm = -100 -30 -20

const yScale = {domain: {expr: "[-premiums*1,premiums*1]"}, nice:false}

const y2 = 0; // =1 for "diagonal" gradient highlight

export function cashflows_spec_patch({disable_legend = false, domain = [-60, 18 * 12]} = {}) {
  return (spec) => {
    spec = JSON.parse(JSON.stringify(spec).replaceAll('"description"','"descriptionOFF"').replaceAll('"aria', '"ariaOFF')) // bad
    //debugger
    spec.legends[0].encode.symbols.update.shape = { value: "square" };
    spec.legends[0].encode.symbols.update.stroke = null;
    spec.legends[0].encode.symbols.update.opacity = { value: 1 };
    spec.legends[0].encode.legend = {update: { padding: {value: 10},fill : { value: 'white' }, opacity: {value: 0.4}}};
    if (disable_legend) spec.legends = null;
    //const grid = spec.signals.findIndex((d) => d.name == "grid_t_in");
    spec.signals.push({ name: "panOffset", value: 0 });
    spec.marks[0].marks[0].signals;

    const a = spec.marks[0].marks[0].signals.findIndex(
      (d) => d.name == "grid_t_in"
    );
    const g = spec.signals.findIndex(
      (d) => d.name == "grid_t_in"
    );
    const b = spec.marks[0].marks[0].signals.findIndex(
      (d) => d.name == "grid_translate_anchor"
    );
    const y = spec.marks[0].marks[0].signals.findIndex(
      (d) => d.name == "grid_translate_delta"
    );
    const c = spec.marks[0].marks[0].signals.findIndex(
      (d) => d.name == "grid_zoom_anchor"
    );
    const e = spec.marks[0].marks[0].marks.findIndex(
      (d) => d.name == "concat_0_concat_0_layer_4_pathgroup"
    );
    spec.marks[0].marks[0].marks[e].marks[0].encode.update.opacity = [
      {"test": "!length(data(\"selected_cashflow_store\")) || vlSelectionTest(\"selected_cashflow_store\", datum)", value:1},
      {"test": "1", value:0.5},
      {value: 1}
    ]
    spec.marks[0].marks[0].signals.push(    {"name": "shift", "value": false, "on": [{
      "events": [{"type": "keydown", "filter": "event.shiftKey", "source": "window"}], "update": "!shift"
    },{
      "events": [{"type": "keyup", "source": "window"}], "update": "false"
    }
    ]})

    spec.marks[0].marks[0].marks[e].marks[0].encode.update.opacity = {signal:
      "if(highlighting, 0.3, 1) * if(!length(data(\"selected_cashflow_store\")) || vlSelectionTest(\"selected_cashflow_store\", datum), 1, 0.2)"}
      //"if (!length(data(\"selected_cashflow_store\")) || vlSelectionTest(\"selected_cashflow_store\", datum), 1, highlighting ? 0.5 : 0.1)"}    



    const d = spec.scales.findIndex((d) => d.name == "concat_0_concat_0_x");
    spec.scales[d].domainRaw.signal =
      'grid["t_in"] ? [grid["t_in"][0]+panOffset,grid["t_in"][1]+panOffset] : null';
    // grid undefined => ???
    // do panOffsetDelta?

    spec.signals[2].on = [] // ex         {"events": "pointermove", "update": "isTuple(group()) ? group() : unit"}


    spec.signals[g].value = [domain[0],domain[1]] // this is needed so that pan can work without needing to be dragged first

    spec.marks[0].marks[0].signals[a].on[0] /*should paramaterise*/.update = `[${domain[0]},${domain[1]}]`
    //spec.marks[0].marks[0].signals[a].value = `[${domain[0]},${domain[1]}]`
    spec.marks[0].marks[0].signals[a].on[2] /*should paramaterise*/.update =
      'zoomLinear([domain("concat_0_concat_0_x")[0]-panOffset,domain("concat_0_concat_0_x")[1]-panOffset], grid_zoom_anchor.x, if(shift,1,grid_zoom_delta))'; // 2x changes here: shift and panOffset

      // change Window to scope so that I can control when the dataflow runs!!!
      // done for minimal2-to-OJS not tested elsewhere
      spec.marks[0].marks[0].signals[y].on[0] /*should paramaterise*/.events[0].source = "scope"
      spec.marks[0].marks[0].signals[y].on[0] /*should paramaterise*/.events[0].between[1].source = "scope"

    spec.marks[0].marks[0].signals[b].on[0] /*should paramaterise*/.update =
      '{x: x(unit), y: y(unit), extent_x: [domain("concat_0_concat_0_x")[0]-panOffset,domain("concat_0_concat_0_x")[1]-panOffset], extent_y: domain("concat_0_concat_0_y")}';
    spec.marks[0].marks[0].signals[c].on[0] /*should paramaterise*/.update =
      '{x: invert("concat_0_concat_0_x", x(unit))-panOffset, y: invert("concat_0_concat_0_y", y(unit))}';

    /*spec.scales[s].domainRaw = {
      signal:
        'grid["t_in"] ? [grid["t_in"][0]+panOffset,grid["t_in"][1]+panOffset] : null'
    };*/
    /*spec.signals[grid].on = [
      {
        events: { signal: "panOffset" },
        update:
          "grid_t_in ? [grid_t_in[0]+panOffset, grid_t_in[1]+panOffset] : [x_domain[0]+panOffset,x_domain[1]+panOffset]"
      }
    ];*/
    //'{"t_in": grid_t_in ? [grid_t_in[0]+panOffset,grid_t_in[1]+panOffset] : null, "value": grid_value}'; //'{"t_in": [grid_t_in[0],grid_t_in[1]], "value": grid_value}';
    return spec;
  };
}

export function cashflows_spec({ orient="top", partition = false, partitionDefault=1, singular = false/* I prefer true for default here? */, premiums, highlighting = true, domain = [-60, 18 * 12], width, height = 300, uis = true, formatType= "number", xTitle="months from now", pastExpr = "extent(pluck(data('data_0'), 't_in'))[0]<0", formulaScale = {}, varying = 'input_cursor_id', highlightOpacity = 0.8 }) {
  return {
    // todo
    width,
    background: 'transparent',
    params: [
      { name: 'w', value: 1000},
      { name: 'premiums', value: 100},
      // use aq outside?
      { name: 'format', expr: 'abs(pv_fut_net_cf_fut_A) < 1 ? ",.2f" : ",.0f"'}, // shared with stresses but OK
      { name: 'pv_fut_net_cf_fut_A', value: null},
      { name: 'pv_fut_net_cf_fut_B', value: null},
      { name: 'pv_fut_net_cf_past', value: null},
      { name: 'partition', value: partitionDefault, [partition ? "bind": "bindOFF"]: { "input": "range", "min": 1, "max": 4, "step": 1} },
      { name: 'show_stress_rule', value: false },
      { name: 'show_summary', value: true },
      { name: "marker", value: -1000 },
      { name: "x_range", expr: 'range("concat_0_concat_0_x")' },
      { name: "x_one", expr: 'scale("concat_0_concat_0_x",1)' },
      { name: "x_domain", expr: 'domain("concat_0_concat_0_x")' },
      { name: "y_domain", expr: 'domain("concat_0_concat_0_y")' },
      {
        name: "x_diff",
        expr: 'scale("concat_0_concat_0_x",1)-scale("concat_0_concat_0_x",0)'
      },
      { name: "x_one2", expr: "unit" },
      {
        name: "highlighting",
        value: false,
        [highlighting ? "bind" : "off"]: { input: "checkbox" }
      },
      {
        name: "A_OR_B", // TODO make this A, B, B-A ? (but needs to be different?)
        value: 'B',
        [uis ? 'bind' : 'OFF']: {input: 'radio', options: ['A','B']}
        //[highlighting ? "bindOFF" : "off"]: { input: "checkbox" }
      },
      {
        name: "past",
        //expr: "indata('data_0','point_id_in',19)"
        expr: pastExpr
        //bind: { input: "checkbox" }
      }
    ],
    //data: { name:'B_keep_add_subtract', values: [{}] },
    datasets: {B_or_keep_add_subtract: [{}], keep_add_subtract: [{}]}, // is it better to split and have marks pick diff
    data: {name: 'B_or_keep_add_subtract'},
    hconcat: [
      {
        vconcat: [
          {
            //title: 'amounts are AVERAGES PER MONTH',
            width: width - 70,
            height,
            encoding: {},

            layer: [
              // RECTS BREAKING ZOOM ON Y
              {
                mark: { type: "rect", clip: true }, // TODO find extents, or clip? (extents = SUM of CFs)
                data: { name: 'unit_array', values: [{}] },
                encoding: {
                  y: { datum: 0 }, // can't use datum: what scale?
                  x: { value: 0 },
                  //y2:{datum:10},
                  //y2: {},
                  y2: { value: -1000 },
                  //y2: {value: {expr: "scale('concat_0_concat_0_y', 1000)"}},
                  x2: { value: "width" },
                  fill: { value: "lightgreen" },
                  opacity: { value: 0.2 }
                }
              },

              {
                mark: { type: "rect", clip: true },
                data: { name: 'unit_array', values: [{}] },

                encoding: {
                  y: { datum: 0 }, // can't use datum: what scale?
                  x: { value: 0 },
                  //y2: {value: {expr: "scale('concat_0_concat_0_y', -1000)"}},
                  y2: { value: 1000 },
                  x2: { value: "width" },
                  fill: { value: "orange" },
                  opacity: { value: 0.2 }
                }
              },
              {
                mark: { type: "rule" },
                data: { name: 'unit_array', values: [{}] },
                encoding: {
                  y: { datum: 0 }, // for Q set to 0 (not string)
                  size: { value: 0.2 }, // remove, unnecessary?
                  color: { value: "gray" }
                  //x: {datum:'51', type:'quantitative', scale:null}
                }
              },
              {
                mark: { type: "rule", strokeDash: [10, 5] },
                data: { name: 'unit_array', values: [{}] },
                encoding: {
                  opacity: { value: { expr: "past ? 0.3 : 0" } },
                  x: {
                    datum: 0,
                    scale: {
                      zero: false,
                      padding: 10,
                      domain: /*[-10*12,23*12]}*/ {
                        param: "brush",
                        encoding: "x"
                      },
                      nice: false
                    }
                  }, // for Q set to 0 (not string)
                  size: { value: 1 }
                  //x: {datum:'51', type:'quantitative', scale:null}
                }
              },

              {

                params: [
                  { name: "grid", select: "interval", bind: "scales" },
                  {
                    name: "selected_cashflow",
                    select: { type: "point", fields: ["formula"] },
                    bind: "legend"
                  }
                ],

                data: {name: 'B_or_keep_add_subtract'},
                transform: [
                  {filter: `(datum.${varying} == partition) || ${singular}`},
                  {filter: `if(highlighting, datum.partition == "keep" || datum.partition == "add" || datum.partition == "subtract", (datum.partition == partition) || ${singular})`},
                  {
                    "calculate": "if(datum.formula == 'pres_maint_fee', 0, 1)",
                    "as": "formulaOrder"
                  },
                  ],

                mark: {
                  type: "area",
                  tooltip: true,
                  interpolate: "step-after"
                },
                encoding: {
                  x: {
                    field: "t_in",
                    //title: "months from now",
                    title: xTitle,
                    type: "quantitative",
                    scale: {
                      zero: false,
                      //padding: 10,
                      domain,//: [-60, 18 * 12],
                      nice: false
                    },
                    axis: {
                      values: [0, 60, 120, -60, -120, 180, 240, -180, -240],
                      //format: ".2e",
                      formatType //"dn"
                    }
                  },
                  y: {
                    field: "value",
                    type: "quantitative",
                    format:',.2f',
                    scale: yScale,
                    axis: {
                      grid: false,
                      title: "amount (€)",
                      labelAngle: -90,
                      //values: [0, 100, -100]
                    } /*, stack:'normalize'*/
                  },
                  color: {
                    field: "formula",
                    type: "nominal",

                    scale: formulaScale,

                    // BROKE this was good for NL
                    /*scale: {
                      domain: ["Premiums", "Claims", "Commissions", "Expenses"],
                      range: [
                        "steelblue",
                        "darkorange",
                        "brown",
                        "mediumvioletred"
                      ]
                    },*/
                    legend: {
                      direction: "horizontal",
                      orient,
                      strokeColor: "lightgray",
                      columns: 6,
                      title: "cashflows",
                      padding: 3
                    }
                  },
                  order: { // See transform needed to change sort: https://vega.github.io/vega-lite/docs/stack.html#sorting-stack-order
                    field: "formula" /* also partition */, // TODO use formulaOrder, but doesn't work for both layers?
                    sort: "descending",
                    //reverse: true
                  }, // I want expenses @ bottom
                  detail: { field: "partition" },
                  opacity: {
                    value: 0.1,
                    "condition": {"param": "selected_cashflow", "value": 1}
                  },
                }
              }, // BAD GUYS:
              {
                data: {name: 'keep_add_subtract'},
                //transform: [{filter: 'if(highlighting, datum.partition != "B", 0)'}],
                transform: [
                  {filter: "highlighting"},
                  {filter: `(datum.${varying} == partition) || ${singular}`},
                  //{filter: 'if(highlighting, (datum.partiton == "keep" || datum.partition == "add" || datum.partition == "subtract"), 0)'}
                  ,
                  {
                    "calculate": "if(datum.formula == 'pres_maint_fee', 0, 1)",
                    "as": "formulaOrder"
                  },
                  ],
                mark: {
                  type: "area",
                  tooltip: false,
                  interpolate: "step-after",
                  /*fill:*/ /*{
                    x1: 0,
                    y1: 0,
                    x2: 1,
                    y2,
                    gradient: "linear",
                    stops: stops(40, "red")
                  }*/ //"red"
                },
                encoding: {
                  x: {
                    field: "t_in",
                    title: xTitle,
                    type: "quantitative",
                    scale: {
                      zero: false,
                      //padding: 10,
                      domain,//: [-36, 18 * 12],
                      nice: false
                    },
                    axis: {
                      //values: [0, 60, 120, -60, -120, 180, 240, -180, -240]
                    }
                  },
                  y: {
                    field: "value",
                    type: "quantitative",
                    scale: yScale,
                    axis: {
                      grid: false,
                      title: "amount (€)",
                      labelAngle: -90,
                      tickCount:4,
                      //values: [0, 100, -100]
                    } /*, stack:'normalize'*/
                  },
                  order: {
                    field: "formula" /* also partition */,
                    sort: "descending",
                  }, // I want expenses @ bottom
                  detail: { field: "partition" },
                  opacity: {
                    value: {
                      expr: `if(datum.partition == "add" || datum.partition == "subtract", ${highlightOpacity}, 0)` // TODO TOFIX This should condition on selection? (different layer)
                    }
                  },

                  color: {
                    //field: "formula",
                    //type: "nominal"
                    value: {expr: 'if(datum.partition == "add", "green", if (datum.partition == "subtract", "red", scale("color", "pv_premiums")))'} // SACLE ISNT SET
                  },
                  strokeWidth: {value: 0},

                  stroke: {
                    value: "darkgreen",
                    condition: {
                      test: 'datum.partition == "subtract"',
                      value: "red"
                    }
                  }
                }
              },
              
              {
                mark: { type: "rect", clip: true },
                data: { name:'unit_array', values: [{}] },
                encoding: {
                  x: { datum: -10000 },
                  x2: { datum: 0 },
                  fill: { value: "purple" },
                  y: { value: -100 },
                  y2: { value: 1000 },
                  opacity: { value: { expr: "past ? 0.06 : 0" } }
                }
              },
              //  layers for summary dots: line, point, text (some are B only)
              {
                data: { name:'summary', values: [{}] },
                transform: [{filter: 'show_summary'},{filter: `(datum.partition == partition) || ${singular}`}],
                mark: {
                  type: "line",
                  tooltip: true,
                  //point: true,
                  interpolate: "monotone" // I also like natural
                },
                encoding: {
                  //opacity: {value: 0.8},
                  //size: { field: "1", scale: null }, // make dept on step size?
                  //fill: {value:'green', condition: {test: 'datum.sum_value<0', value: 'red'}},
                  strokeWidth: { value: 2.5 },
                  // remember: no grouping so many appeareances!!

                  opacity: {
                    value: 0.7
                  },
                  color: { value: "black" },
                  x: {
                    field: "t_in",
                    type: "quantitative",
                    scale: { zero: false, nice: false }
                  },
                  y: {
                    field: "sum_value",
                    type: "quantitative" /*, scale: {domain:{param:'b_extent'}}*/ /*, stack:'normalize'*/
                  },
                  detail: { field: "partition" }
                  //color: {field: 'formula', type:'nominal'},
                }
              },
              {
                data: { name:'summary', values: [{}] },
                transform: [{filter: 'show_summary'},{filter: `(datum.partition == partition || datum.partition ${/*"== partition-1"*/" != partition"}) || ${singular}`}],
                mark: {
                  type: "point",
                  tooltip: true
                },
                encoding: {
                  //opacity: {value: 0.8},
                  size: {value: {expr: "w > 600 ? 150 : 90"}},//"responsive" //{ field: "step_size", scale: null }, // make dept on step size?
                  fill: {
                    value: {
                      expr: `abs(datum.sum_value) < 0.001 ? "lightblue" : (datum.partition ${/*"== partition-1"*/" != partition"} ? "transparent" : (datum.sum_value >= 0 ? "green" : "red"))`
                    }
                    //value: "green",
                    //condition: { test: "datum.sum_value<0", value: "red" }
                  },
                  strokeWidth: { value: 2 },
                  // remember: no grouping so many appeareances!!
                  opacity: {
                    value: {
                      expr: 'if(highlighting, datum.partition == partition ? 0.9 : 0.2, datum.partition == partition ? 1 : 0.3)'
                    }
                    /*field: "partition",
                    type: "nominal",
                    scale: { domain: ["A", "B"], range: [0.3, 0.8] },
                    legend: null*/
                  },
                  color: { value: "black" },
                  x: {
                    field: "t_in",
                    type: "quantitative",
                    scale: {
                      zero: false,
                      //padding: 10,
                      domain,//: [-36, 18 * 12],
                      nice: false
                    }
                  },
                  y: {
                    field: "sum_value",
                    type: "quantitative" /*, scale: {domain:{param:'b_extent'}}*/ /*, stack:'normalize'*/
                  },
                  detail: { field: "partition" }
                  //color: {field: 'formula', type:'nominal'},
                }
              },
              {
                data: { name:'summary', values: [{}] },
                transform: [
                  {filter: 'show_summary'},
                  {filter: `(datum.partition == partition) || ${singular}`},
                  {filter: '(datum.duration_n +1) % 5 == 0 || datum.duration_n == 0'}],
                mark: {
                  type: "text",
                  tooltip: false,
                  point: true,
                  fontWeight: "bold"
                },
                encoding: {
                  opacity: {
                    value: {
                      expr: "if(highlighting, 0.5, 1)"
                    }
                  },
                  size: { value: 15 }, // make dept on step size?
                  //fill: {value:'green', condition: {test: 'datum.sum_value<0', value: 'red'}},
                  //strokeWidth: {value:0.1},
                  // remember: no grouping so many appeareances!!
                  //opacity: {field:'partition', type:'nominal', scale: {domain:['A','B'],range:[0.1,0.1]}, legend:null},
                  color: { value: "black" },
                  text: { value: { expr: "datum.duration_n+1" } },
                  x: {
                    field: "t_in",
                    type: "quantitative",
                    scale: {
                      zero: false,
                      //padding: 10,
                      domain,//: [-36, 18 * 12],
                      nice: false
                    }
                  },
                  y: {
                    field: "sum_value",
                    type: "quantitative" /*, scale: {domain:{param:'b_extent'}}*/ /*, stack:'normalize'*/
                  },
                  yOffset: { value: 15 },
                  detail: { field: "partition" }
                  //color: {field: 'formula', type:'nominal'},
                }
              },
              {
                mark: { type: "rule", strokeDash: [3, 3] },
                data: { name: 'unit_array', values: [{}] },
                transform: [{filter: 'show_stress_rule'}],
                encoding: {
                  color: { value: "orange" },
                  x: {
                    value: { expr: "scale('concat_0_concat_0_x',marker)" }
                    /*scale: {
                      zero: false,
                      padding: 10,
                      domain: {
                        param: "brush",
                        encoding: "x"
                      },
                      nice: false
                    }*/
                  } // for Q set to 0 (not string)
                  //x: {datum:'51', type:'quantitative', scale:null}
                }
              },

              {
                mark: { type: "text", interactive: false }, // why do these break params?
                data: { name: 'unit_array', values: [{}] },

                encoding: {
                  y: { datum: premiums * 1 }, // can't use datum: what scale?
                  x: { value: width - 130 },
                  text: { value: "➕" },
                  size: { value: 20 },
                  opacity: { value: 0.6 }
                }
              },
              {
                mark: { type: "text", interactive: false }, // why do these break params?
                data: { name: 'unit_array', values: [{}] },

                encoding: {
                  y: { datum: -premiums * 1 }, // can't use datum: what scale?
                  x: { value: width - 130 },
                  text: { value: "➖" },
                  size: { value: 20 },
                  opacity: { value: 0.6 }
                }
              },

              {
                mark: { type: "text", align: "right", font: "monospace", fontWeight:'bold' },
                data: { name: 'unit_array', values: [{}] },
                encoding: {
                  x: { datum: -1 },
                  y: { value: mm+180 },
                  opacity: {value :{expr: 'highlighting ? 0.4 : 1'}},
                  text: { value: { expr: "past ? 'past cfs ↤' : ''" } }
                }
              },
              
              {
                mark: { type: "text", align: "right", font: "monospace", fontWeight:'bold' },
                data: { name: 'unit_array', values: [{}] },
                encoding: {
                  x: { datum: -3 },
                  y: { value: mm+195 },
                  opacity: {value :{expr: 'highlighting ? 0.4 : 1'}},
                  fill: {value: {expr: 'pv_fut_net_cf_past > 0 ? (highlighting ? "blue" : "blue") : "red"'}},
                  text: { value: { expr: "past ? 'Σ = € ' + format(pv_fut_net_cf_past, format) : ''" } }
                }
              },

              {
                mark: { type: "text", align: "left", font: "monospace", fontWeight:'bold' },
                data: { name: 'unit_array', values: [{}] },
                name: 'ffff', // I could use this to create a handle and style a pointer cursor (ffff_marks)
                encoding: {
                  x: { datum: 1 },
                  y: { value: mm+180 },
                  opacity: {value :{expr: 'highlighting ? 0.4 : 1'}},
                  text: { value: "↦ future cfs" },
                }
              },

              {
                mark: { type: "text",align: "left", font: "monospace", fontWeight:'bold' },
                data: { name: 'unit_array', values: [{}] },
                encoding: {
                  x: { datum: 2 },
                  y: { value: mm+195 },
                  opacity: {value :{expr: 'highlighting ? 0.4 : 1'}},
                  fill: {value: {expr: 'pv_fut_net_cf_fut_A > 0 ? (highlighting ? "blue" : "blue") : "red"'}},
                  size: { value: { expr: "pv_fut_net_cf_fut_A == null ? 22 : 11" } },
                  text: { value: { expr: "pv_fut_net_cf_fut_A == null ? '⏳' :  'Σ = € ' + format(pv_fut_net_cf_fut_A, format)" } },
                  
                }
              },

              {
                mark: { type: "text", dx: 30,align: "left", font: "monospace", fontWeight:'bold' },
                data: { name: 'unit_array', values: [{}] },
                encoding: {
                  x: { datum: 2 },
                  y: { value: mm+208 },
                  fill: {value: {expr: '(pv_fut_net_cf_fut_B - pv_fut_net_cf_fut_A) > 0 ? (highlighting ? "blue" : "blue") : "red"'}},
                  text: { value: { expr: "if(abs(pv_fut_net_cf_fut_B-pv_fut_net_cf_fut_A)>0.01,'+ € ' + format(pv_fut_net_cf_fut_B - pv_fut_net_cf_fut_A, format), '')" } },
                  
                }
              },

              {
                mark: { type: "text", dx: 30,align: "left", font: "monospace", fontWeight:'bold' },
                data: { name: 'unit_array', values: [{}] },
                encoding: {
                  x: { datum: 2 },
                  y: { value: mm+222 },
                  opacity: {value :{expr: 'highlighting ? 0.4 : 1'}},
                  fill: {value: {expr: '(pv_fut_net_cf_fut_B) > 0 ? (highlighting ? "blue" : "blue") : "red"'}},
                  text: { value: { expr: "if(abs(pv_fut_net_cf_fut_B-pv_fut_net_cf_fut_A)>0.01,'= € ' + format(pv_fut_net_cf_fut_B, format),'')" } },
                  
                }
              }
              /*,

     {mark: {type:'text'},
                data: { name: 'unit_array', values: [{}] },

      encoding: {
        y: {datum:-40}, // can't use datum: what scale?
        x: {datum:100},
        text:{value:''},
        size: {value:20}
        //opacity: {value: 0.2}
      }
      }
    */
            ]
          } //,{
          //   title: '', // ex "zoom"

          //   width:width-50,
          //   height:100,
          //   transform: [          {
          //           filter:
          //             "datum.formula != 'profit' && (datum.partition == 'keep' || datum.partition == 'add' || datum.partition == 'subtract')"
          //         }],
          //      encoding: { x: {field: 't_in', type:'quantitative',nice:false, axis:null},
          //     y: {field: 'value',  type:'quantitative',  /*scale: {domain:bin_size <=12 ? [-100,60] : null},*/ axis:null},
          //   },
          //         layer:[
          //           {

          //   params: [{
          //     name: 'brush',
          //     value: {x: [-50,21*12], y:[-40,40]},//
          //     select: {type:'interval', encodings:['x','y']}
          //   },/*{
          //     name: 'brush2',
          //     select: {type:'interval', encodings:['y']}
          //   }*/],
          //   mark: {type:'bar', clip:false, tooltip: false}, // can I add rules? In Altair something about interactive, non-interactive layers?
          //   encoding: {
          //     color: {value:'gray'},
          //     //stroke: {}
          //     //color: {field: 'formula', type:'nominal', legend: {orient: 'top', title: 'cashflow', titleFontSize:20}},
          //     //order: {field: 'formula', type:'nominal'},
          //     opacity: {
          //       value: 0.6,
          //       condition: {
          //         test: 'datum.partition == "add" || datum.partition == "subtract"',
          //         value: 1
          //       }
          //     },
          //     strokeWidth: {
          //       value: 0,
          //       condition: {
          //         test: 'datum.partition == "add" || datum.partition == "subtract"',
          //         value: 0.5*(bin_size<= 2 ? .2 : bin_size == 12 ? 1 : 0.5) //  Scale down for bin size 1 month
          //       }
          //     },

          //           stroke: {
          //             value: "darkgreen",
          //             condition: { test: 'datum.partition == "subtract"', value: "red" }
          //           },
          //   }},{
          // "mark": {type:"rule", strokeDash: [10,10]},
          // "encoding": {
          //   "x": {"datum": 0},
          //   color: {value:'black'},
          //   size: {value:2}
          // }},
          //           {
          //     mark: {type :'rule'}, // why can't I get rules here ?!
          //     //interactive:false,
        //  data: { name: 'unit_array', values: [{}] },
          //     encoding: {
          //       x: {value:{expr:"0"}, scale:{padding:0, domain:[-10*12,23*12]}} // for Q set to 0 (not string)
          //       ,color: {value:'red'},
          //       //size:{value:10}
          //       //x: {datum:'51', type:'quantitative', scale:null}
          //     }
          //   }]}
        ]
      } /*{title:'Σ fut. cfs',layer: [{
    transform: [  { filter: "datum.t_in>=0"},        {
            filter:
              "datum.formula != 'profit' && (datum.partition == 'keep' || datum.partition == 'add' || datum.partition == 'subtract')"
          },{
            aggregate: [{op:'sum',field:'value',as:'value2'}],
            groupby: ['formula','partition']
          }],
    mark: {type:'bar', tooltip: true},
    encoding: {
      y: {field: 'value2',  type:'quantitative'},
      color: {field: 'formula', type:'nominal', legend: {orient: 'top', title: 'cashflow', titleFontSize:20}},
      //order: {field: 'formula', type:'nominal'},
      opacity: {
        //value: 0.6,
        condition: {
          test: 'datum.partition == "add" || datum.partition == "subtract"',
          value: 1
        }
      },
      strokeWidth: {
        value: 0,
        condition: {
          test: 'datum.partition == "add" || datum.partition == "subtract"',
          value: 2
        }
      },

            stroke: {
              value: "darkgreen",
              condition: { test: 'datum.partition == "subtract"', value: "red" }
            },
    }},
    {
    transform: [          { filter: "1 && (datum.partition == 'B' ||datum.partition == 'A' )" },],
    mark: {type:'point', tooltip: true},
    encoding: {
      opacity: {value: 0.8},
      size: {value: 190},
      strokeWidth: {value:4},
      color: {field:'partition', type:'nominal'},
      y: {field: 'value', aggregate:'sum', type:'quantitative', axis:{orient:'right', title: null, format:'s'}},
      detail: {field:'partition'},
      //color: {field: 'formula', type:'nominal'},
    }}
    ]}*/
    ],
    config: {
      scale: {
        padding: 0,
        paddingInner: 0,
        paddingOuter: 0
      }
    }
  };
}

export function stops(n, color) {
  return _.range(0, n).map((d) => ({
    offset: d / n,
    color: !(d % 3) ? color : "transparent"
  }));
}

// I need to remove singular
// cfs is either an array of objects, or an Arrow table
// ASSUMES DATA DOENS'T NEED OT BE SUMMED

// should output a value even if there are only 0 cashflows e.g. Actuarial Playground SP TA no Expenses increase duration
export function cashflows_summary_and_keep_add_subtract({ cfs, singular, varying = 'input_cursor_id' }) {
  //console.log('cfs',cfs)
  //debugger
  //debugger;
  return (
    (((0 && (typeof cfs.reify === 'function') /* arquero */ ) || (typeof cfs.numCols === 'number' /* duckdb response, arrow */)) ? aq // https://github.com/uwdata/arquero/issues/49
      .from(cfs) : cfs)//
      //.filter(d => d.step_in == 0 || d.step_in == 1)
      //.orderby('step_in')
      //.params({ duration_mth_in: offset })
      .params({ singular })
      .params({ varying })
      .derive({ varying: (d, $) => d[$.varying] })
      //.filter(d => d.t_in < 0)
      // bin:
      //.groupby(["formula", {
      //  t_in: aq.bin('t_in', {step:bin_size,/*offset:0,*/ nice:false})
      //}, 'input_cursor_id'])
      //.rollup({value: d => aq.op.sum(d.value)})
      // nobin: .groupby(["t_in", "formula"])
      .orderby(["formula", "t_in", 'varying'])
      .derive({
        A: (d, $) => (($.singular || d.varying == 0) ? d.value : aq.op.lag(d.value, 1, 0)),
        B: (d) => d.value,
        t_in_step_end: (d) => Math.min(d.t_in + 12, 0) // EDITED DONT COPY
      })
      // need to develop A/B/B-A
      //.filter((d) => (d.input_cursor_id == singular ? 0 : 1)) // CHANGED HERE
      //.filter(d => d.v == 1) // how to control this??? or leave to vega?
      .derive({
        keep: (
          d // =IF(C6<0,MIN(0,MAX(D6,C6)),IF(C6>0,MAX(0,MIN(D6,C6))))
        ) => {
          if (d.A < 0) return Math.min(0, Math.max(d.A, d.B));
          return Math.max(0, Math.min(d.A, d.B));
        },
        add: (d) => Math.max(0, d.B - d.A) * (d.A < 0 ? -1 : 1),
        subtract: (d) => Math.max(0, d.A - d.B) * (d.A < 0 ? 1 : 1),
        // todo edge case for flips
        A_keep_gte_0: (d) => d.A >= 0
      })
      .fold(["A", "B", "keep", "add", "subtract"], {
        as: ["partition", "value"]
      })
      //.derive({'value': d => d.value})
      .derive({
        //duration_mth: (d) => Math.floor((d.t_in + duration_mth_in) / 1),
        duration_n: (d) => Math.floor((d.t_in + d.duration_mth_in) / 12)
      })
      .groupby("partition", "formula", 'varying', "duration_n")
      .derive({
        value_n: aq.rolling(aq.op.mean("value"), [-Infinity, Infinity], false),
        t_in_mean: aq.rolling(aq.op.mean("t_in"), [-Infinity, Infinity], false),
        value: d => (d.A_keep_gte_0 == false && d.partition == 'subtract') ? -d.value : d.value,
        formula: d => d.formula == "pv_premiums" ? "Premiums" : (d.formula == "pv_claims" ? "Claims" : (d.formula == "pv_expenses" ? "Expenses" : (d.formula == "pv_commissions" ? "Commissions" : d.formula)))

        //(datum.A_keep_gte_0 == false && datum.partition == 'subtract') ? -datum.value : datum.value
      })
      .filter(d => (d['varying'] == 1 || singular)) // TODO remove concept of varying? impacts of a step are within one thing?
      .filter(d => d.partition == 'B')
  );
}

// this is a wasted as a function? Removed in playg
export function cashflows_B({ cfs, singular, varying = 'input_cursor_id' }) {
  //console.log('cfs',cfs)
  //debugger
  return (
    (((0 && (typeof cfs.reify === 'function') /* arquero */ ) || (typeof cfs.numCols === 'number' /* duckdb response, arrow */)) ? aq // https://github.com/uwdata/arquero/issues/49
      .from(cfs) : cfs)//
      .params({ varying })
      .derive({
        varying: (d, $) => d[$.varying],
        partition: (d, $) => d[$.varying]
       })
      //.filter(d => d['varying'] == 1) // TODO remove concept of varying? impacts of a step are within one thing?
  );
}

// TODO make this robust to missing things (u) - if it doesn't affect interactive perf on most common usecases
export function cashflows_keep_add_subtract({ cfs, singular, varying = 'input_cursor_id' }) {
  //console.log('cfs',cfs)
  //debugger
  return (
    (((0 && (typeof cfs.reify === 'function') /* arquero */ ) || (typeof cfs.numCols === 'number' /* duckdb response, arrow */)) ? aq // https://github.com/uwdata/arquero/issues/49
      .from(cfs) : cfs)//
      //.filter(d => d.step_in == 0 || d.step_in == 1)
      //.orderby('step_in')
      //.params({ duration_mth_in: offset })
      .params({ singular })
      .params({ varying })
      .derive({ varying: (d, $) => d[$.varying] })
      //.filter(d => d.t_in < 0)
      // bin:
      //.groupby(["formula", {
      //  t_in: aq.bin('t_in', {step:bin_size,/*offset:0,*/ nice:false})
      //}, 'input_cursor_id'])
      //.rollup({value: d => aq.op.sum(d.value)})
      // nobin: .groupby(["t_in", "formula"])
      .orderby(["formula", "t_in", 'varying'])
      .derive({
        A: (d, $) => (($.singular || d.varying == 0) ? d.value : aq.op.lag(d.value, 1, 0)),
        B: (d) => d.value,
        //t_in_step_end: (d) => Math.min(d.t_in + 12, 0) // EDITED DONT COPY
      })
      // need to develop A/B/B-A
      //.filter((d) => (d.input_cursor_id == singular ? 0 : 1)) // CHANGED HERE
      //.filter(d => d.v == 1) // how to control this??? or leave to vega?
      .derive({
        keep: (
          d // =IF(C6<0,MIN(0,MAX(D6,C6)),IF(C6>0,MAX(0,MIN(D6,C6))))
        ) => { //if (d.A == undefined) debugger; if (d.A == null) debugger;
          //debugger;
          if (d.A < 0) return Math.min(0, Math.max(d.A, d.B));
          return Math.max(0, Math.min(d.A, d.B));
        },
        add: (d) => Math.max(0, d.B - d.A) * (d.A < 0 ? -1 : 1),
        subtract: (d) => Math.max(0, d.A - d.B) * (d.A < 0 ? 1 : 1),
        // todo edge case for flips
        A_keep_gte_0: (d) => d.A >= 0,
      })
      //.derive({d: aq.escape(d => {debugger})})
      .fold([/*"A", "B", */"keep", "add", "subtract"], {
        as: ["partition", "value"]
      })
      .derive({
        value: d => (d.A_keep_gte_0 == false && d.partition == 'subtract') ? -d.value : d.value,
      })
      //.groupby("partition", "formula", 'varying')
      //.filter(d => d['varying'] == 1) // TODO remove concept of varying? impacts of a step are within one thing?
      //.filter(d => d.partition == 'keep' || d.partition == 'add' || d.partition == 'subtract')
  );
}


// I need to remove singular
// cfs is either an array of objects, or an Arrow table
export function cashflows_summary({ cfs, varying = 'input_cursor_id' }) {
  //console.log('cfs',cfs)
  //debugger;
  //debugger
  return (
    (typeof cfs.reify === 'function' ? aq // https://github.com/uwdata/arquero/issues/49
      .from(cfs) : cfs)
      .params({ varying })
      .params({ first: cfs.rollup({ min: d => aq.op.min(d.t_in)}).objects()[0].min})
      .derive({ varying: (d, $) => d[$.varying], partition: (d, $) => d[$.varying] })
      .derive({
        duration_n: (d, $) => Math.floor((d.t_in - $.first) / 12)
      })
      .groupby("partition", varying, "duration_n")
      .rollup({
        value_n: d => aq.op.sum(d.value)/12, // TODO remove this 12
        t_in: d => aq.op.min(d.t_in)+6,
      })
      .derive({
        sum_value: d => d.value_n,
        value: d => d.value_n,
        step_size: d => 68*2
      })
  );
}

