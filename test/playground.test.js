// Not comprehensive testing: todo

import { expect, describe, it } from "vitest";
import { resolve } from "node:path";

import { compile } from "calculang/packages/standalone/index.js";
import { calcudata } from "calculang/packages/calcudata/src/index.js";

import { readFile } from "fs/promises";
import { range } from "underscore";

const cwd = import.meta.dirname;

describe("playground.cul.js testing", async () => {
  // in dev console in A-P you can grab this cursor by running JSON.stringify(cursor)

  const default_cursor = JSON.parse(
    '{"loading_prem_in":0.8,"gender_neutral_pricing_in":false,"duration_mth_in":0,"expenses_factor_in":1,"inflation_rate_addition_in":0,"mort_rate_Y1_add_per_mille_in":0,"expense_acq_in":300,"expense_maint_in":60,"inflation_rate_in":0.02,"commission_pc_in":50,"commission_mths_in":12,"stress_delay_in":0,"premium_payment_frequency_in":"M","update_pricing_lapse_rates_in":0,"original_lapse_rates_in":null,"data_version_in":0,"zero_decrement_experience_in":true,"discounting_on_in":false,"policy_count_in":1,"timing_in":"BEF_NB","age_at_entry_in":40,"sex_in":"M","policy_term_in":20,"sum_assured_in":300000,"mort_rate_factor_in":1,"lapse_rate_factor_in":1}'
  ); // t_in not specified

  const m = await compile({
    entrypoint: "entry.cul.js",
    fs: {
      "entry.cul.js": await readFile("./src/cul/playground.cul.js", "utf8"),
      "./basicterm.cul.js": await readFile(
        "./src/cul/basicterm.cul.js",
        "utf8"
      ),
      "./basicterm-tables.cul.js": await readFile(
        "./src/cul/basicterm-tables.cul.js",
        "utf8"
      ),
    },
    memo: true,
  });

  it("compiles to a tracked JS bundle", async () => {
    await expect(m.bundle).toMatchFileSnapshot(
      "./bundles/playground.bundle.js"
    );
  });

  it("single policy - track default projection cashflows", async () => {
    await expect(
      calcudata({
        type: "objects",
        models: [m.js],
        input_cursors: [default_cursor],
        input_domains: {
          t_in: [
            ...Array(21 * 12)
              .keys()
              .map((d) => d - 6),
          ],
        },
        outputs: [
          "pv_premiums",
          "pv_claims",
          "pv_commissions",
          "pv_expenses",
          "pv_placeholder",
          "pv_placeholder2",
        ],
      })
    ).toMatchFileSnapshot("./snapshot/single-policy.json");
  });
  // TODO check sum of cashflows for single policy, should =2,674, then check direct result from calling policy_value/pv_fut_net_cf

  it("many policy - track grid of results", async () => {
    await expect(
      calcudata({
        type: "objects",
        models: [m.js],
        input_cursors: [{ ...default_cursor, t_in: 0 }],
        input_domains: {
          age_at_entry_in: range(20, 60, 5),
          policy_term_in: range(10, 30, 5),
        },
        outputs: ["policy_value", "premium_rate_per_mille", "premium_pp"],
      })
    ).toMatchFileSnapshot("./snapshot/many-policy.json");
  });
  // todo check 2674 appears in grid (works)
});
