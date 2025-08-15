let model = {}; 



////////////// cul scope id 0 //////////

// for a high-level overview, see the '?' tab

// To make the playground model reducing term assurance product types
// see comments surrounding `claim_pp` in basicterm.cul.js



// PARAMETERS FOR CONTROLS AND STRESSES

// in basicterm.cul.js some things are hardcoded,
// in the Playground we want to change them:

export const s0_commission_mths$ = ({ commission_mths_in }) => commission_mths_in;
export const s0_commission_pc$ = ({ commission_pc_in }) => commission_pc_in;

// there are other new inputs below that are also stressed

// experience functionality for mortality and lapses is in basicterm.cul.js
// see mort_rate_mth and lapse_rate_mth


export const s0_lapse_rate_factor_delay$ = ({ stress_delay_in }) => s0_stress_delay({ stress_delay_in });
export const s0_lapse_rate_factor$ = ({ lapse_rate_factor_in }) => lapse_rate_factor_in ?? 1;

// we use this optionally for pricing basis, see premium_rate_per_mille
export const s0_original_lapse_rates$ = ({ original_lapse_rates_in }) => original_lapse_rates_in ?? false;

export const s0_lapse_rate$ = ({ t_in, stress_delay_in, original_lapse_rates_in, duration_mth_in, lapse_rate_factor_in }) => {
  if (s1_t({ t_in }) < s0_lapse_rate_factor_delay({ stress_delay_in })) return s0_original_lapse_rates({ original_lapse_rates_in }) ? Math.max(0.1 - 0.02 * s1_duration({ duration_mth_in, t_in }), 0.02) : s1_lapse_rate_({ duration_mth_in, t_in });else
  return s0_lapse_rate_factor({ lapse_rate_factor_in }) * (s0_original_lapse_rates({ original_lapse_rates_in }) ? Math.max(0.1 - 0.02 * s1_duration({ duration_mth_in, t_in }), 0.02) : s1_lapse_rate_({ duration_mth_in, t_in }));
};

export const s0_inflation_rate_addition$ = ({ inflation_rate_addition_in }) => inflation_rate_addition_in ?? 0;

export const s0_inflation_rate$ = ({ t_in, stress_delay_in, inflation_rate_in, inflation_rate_addition_in }) => {
  if (s1_t({ t_in }) < s0_stress_delay({ stress_delay_in })) return inflation_rate_in;else
  return inflation_rate_in + s0_inflation_rate_addition({ inflation_rate_addition_in });
};

export const s0_expenses_factor$ = ({ expenses_factor_in }) => expenses_factor_in ?? 1;

// incl. configurable expenses
export const s0_expense_maint$ = ({ t_in, stress_delay_in, expense_maint_in, expenses_factor_in }) => {
  if (s1_t({ t_in }) < s0_stress_delay({ stress_delay_in })) return expense_maint_in;else
  return expense_maint_in * s0_expenses_factor({ expenses_factor_in }); // additives can go here
};
export const s0_expense_acq$ = ({ t_in, stress_delay_in, expense_acq_in, expenses_factor_in }) => {
  if (s1_t({ t_in }) < s0_stress_delay({ stress_delay_in })) return expense_acq_in;else
  return expense_acq_in * s0_expenses_factor({ expenses_factor_in });
};



// stressing mortality and lapse rates

export const s0_stress_delay$ = ({ stress_delay_in }) => stress_delay_in ?? 0;

export const s0_mort_rate_factor_delay$ = ({ stress_delay_in }) => s0_stress_delay({ stress_delay_in });
export const s0_mort_rate_factor$ = ({ mort_rate_factor_in }) => mort_rate_factor_in ?? 1;

export const s0_mort_rate_Y1_add_per_mille$ = ({ mort_rate_Y1_add_per_mille_in }) => mort_rate_Y1_add_per_mille_in ?? 0;

export const s0_mort_rate_addition$ = ({ t_in, stress_delay_in, mort_rate_Y1_add_per_mille_in }) => {
  if (s1_t({ t_in }) < 12 + s0_stress_delay({ stress_delay_in }))
  return s0_mort_rate_Y1_add_per_mille({ mort_rate_Y1_add_per_mille_in }) / 1000;else
  return 0;
};


// PRICING

export const s0_loading_prem$ = ({ loading_prem_in }) => loading_prem_in ?? 0.5;

export const s0_gender_neutral_pricing$ = ({ gender_neutral_pricing_in }) => gender_neutral_pricing_in ?? true;

export const s0_update_pricing_lapse_rates$ = ({ update_pricing_lapse_rates_in }) => update_pricing_lapse_rates_in ?? false;

export const s0_pricing_projection$ = ({ pricing_projection_in }) => pricing_projection_in ?? false;

export const s0_net_premium_pp$ = ({ pricing_projection_in, policy_term_in, sum_assured_in, timing_in, policy_count_in, zero_decrement_experience_in, stress_delay_in, original_lapse_rates_in, lapse_rate_factor_in, age_at_entry_in, sex_in, mort_rate_factor_in, mort_rate_Y1_add_per_mille_in, discounting_on_in, zero_spot_year_in, premium_payment_frequency_in, update_pricing_lapse_rates_in, gender_neutral_pricing_in }) => {
  if (s0_pricing_projection({ pricing_projection_in }))
  return s1_net_premium_pp_({ policy_term_in, policy_count_in, zero_decrement_experience_in, age_at_entry_in, zero_spot_year_in, premium_payment_frequency_in, /* 1000e sum assured projection with pricing config and no stresses, and discounting always on */sum_assured_in: 1000, original_lapse_rates_in: !s0_update_pricing_lapse_rates({ update_pricing_lapse_rates_in }), discounting_on_in: true, sex_in: s0_gender_neutral_pricing({ gender_neutral_pricing_in }) ? 'F' : s1_sex({ sex_in }), timing_in: 'BEF_DECR', stress_delay_in: 12 * 120, lapse_rate_factor_in: 1, mort_rate_factor_in: 1, mort_rate_Y1_add_per_mille_in: 0 });else

  return s1_net_premium_pp_({ policy_term_in, sum_assured_in, timing_in, policy_count_in, zero_decrement_experience_in, stress_delay_in, original_lapse_rates_in, lapse_rate_factor_in, age_at_entry_in, sex_in, mort_rate_factor_in, mort_rate_Y1_add_per_mille_in, discounting_on_in, zero_spot_year_in, premium_payment_frequency_in });
};

export const s0_premium_rate_per_mille$ = ({ loading_prem_in, policy_term_in, sum_assured_in, timing_in, policy_count_in, zero_decrement_experience_in, stress_delay_in, original_lapse_rates_in, lapse_rate_factor_in, age_at_entry_in, sex_in, mort_rate_factor_in, mort_rate_Y1_add_per_mille_in, discounting_on_in, zero_spot_year_in, premium_payment_frequency_in, update_pricing_lapse_rates_in, gender_neutral_pricing_in }) =>
(1 + s0_loading_prem({ loading_prem_in })) *
s0_net_premium_pp({ policy_term_in, sum_assured_in, timing_in, policy_count_in, zero_decrement_experience_in, stress_delay_in, original_lapse_rates_in, lapse_rate_factor_in, age_at_entry_in, sex_in, mort_rate_factor_in, mort_rate_Y1_add_per_mille_in, discounting_on_in, zero_spot_year_in, premium_payment_frequency_in, update_pricing_lapse_rates_in, gender_neutral_pricing_in, pricing_projection_in: true });


export const s0_pv_pols_if$ = ({ duration_mth_in, t_in, policy_term_in, timing_in, policy_count_in, zero_decrement_experience_in, stress_delay_in, age_at_entry_in, sex_in, mort_rate_factor_in, mort_rate_Y1_add_per_mille_in, original_lapse_rates_in, lapse_rate_factor_in, discounting_on_in, premium_payment_frequency_in }) => s1_pv_pols_if_({ duration_mth_in, t_in, policy_term_in, timing_in, policy_count_in, zero_decrement_experience_in, stress_delay_in, age_at_entry_in, sex_in, mort_rate_factor_in, mort_rate_Y1_add_per_mille_in, original_lapse_rates_in, lapse_rate_factor_in, discounting_on_in }) * s0_premium_due({ premium_payment_frequency_in, t_in, duration_mth_in }); // used by net_premium_pp via pv_fut_pols_if


// DIFFERENT PREMIUM FREQUENCIES

export const s0_premium_payment_frequency$ = ({ premium_payment_frequency_in }) => premium_payment_frequency_in ?? "M"; // or "single"

export const s0_premium_period$ = ({ premium_payment_frequency_in }) => {
  switch (s0_premium_payment_frequency({ premium_payment_frequency_in })) {
    case "Y":
      return 12;
    case "Q":
      return 3;
    case "H":
      return 6;
    default:
      return 1;
  }
};

export const s0_premium_due$ = ({ premium_payment_frequency_in, t_in, duration_mth_in }) => {
  if (s0_premium_payment_frequency({ premium_payment_frequency_in }) == "single")
  return s1_t({ t_in }) == -s1_duration_mth_0({ duration_mth_in });
  if (s1_duration({ duration_mth_in, t_in }) != s1_duration({ duration_mth_in, t_in: s1_t({ t_in }) - 1 })) return 1;
  if (s1_duration_mth({ duration_mth_in, t_in }) % s0_premium_period({ premium_payment_frequency_in }) == 0) return 1;else
  return 0;
};

// NOT annualized
export const s0_premium_pp$ = ({ premium_payment_frequency_in, t_in, duration_mth_in, sum_assured_in, loading_prem_in, policy_term_in, timing_in, policy_count_in, zero_decrement_experience_in, stress_delay_in, original_lapse_rates_in, lapse_rate_factor_in, age_at_entry_in, sex_in, mort_rate_factor_in, mort_rate_Y1_add_per_mille_in, discounting_on_in, zero_spot_year_in, update_pricing_lapse_rates_in, gender_neutral_pricing_in }) => {
  if (!s0_premium_due({ premium_payment_frequency_in, t_in, duration_mth_in })) return 0;
  return s1_premium_pp_({ sum_assured_in, loading_prem_in, policy_term_in, timing_in, policy_count_in, zero_decrement_experience_in, stress_delay_in, original_lapse_rates_in, lapse_rate_factor_in, age_at_entry_in, sex_in, mort_rate_factor_in, mort_rate_Y1_add_per_mille_in, discounting_on_in, zero_spot_year_in, premium_payment_frequency_in, update_pricing_lapse_rates_in, gender_neutral_pricing_in });
};

// MORTALITY RATE RECALC

export const s0_a$ = ({}) => 0.0002;
export const s0_b$ = ({}) => 0.00025;
export const s0_c$ = ({}) => 2.2;


// parameterised mortality formula from https://github.com/lifelib-dev/lifelib/blob/main/lifelib/libraries/basiclife/basic_term_sample.xlsx
// Male mortality uplift added for Playground (basicterm does't have M/F rates) (but not necessarily used in premium projection: see `gender_neutral_pricing`)
export const s0_mort_rate_recalc$ = ({ age_at_entry_in, duration_mth_in, t_in, sex_in }) => Math.min(1, Math.min(1, s0_a({}) * Math.exp(s0_b({}) * Math.pow(s1_age({ age_at_entry_in, duration_mth_in, t_in }), s0_c({})))) * Math.pow(1.1, s1_mort_rate_select_index({ duration_mth_in, t_in })) * (s1_sex({ sex_in }) == 'M' ? 1.2 : 1));

export const s0_mort_rate$ = ({ t_in, stress_delay_in, age_at_entry_in, duration_mth_in, sex_in, mort_rate_factor_in, mort_rate_Y1_add_per_mille_in }) => {
  if (s1_t({ t_in }) < s0_mort_rate_factor_delay({ stress_delay_in })) return s0_mort_rate_recalc({ age_at_entry_in, duration_mth_in, t_in, sex_in });else
  return s0_mort_rate_recalc({ age_at_entry_in, duration_mth_in, t_in, sex_in }) * s0_mort_rate_factor({ mort_rate_factor_in }) + s0_mort_rate_addition({ t_in, stress_delay_in, mort_rate_Y1_add_per_mille_in }); // note: added after factor on overall assumption
};





// DISCOUNTING CONTROL

export const s0_discounting_on$ = ({ discounting_on_in }) => discounting_on_in ?? true;

export const s0_disc_rate_ann$ = ({ discounting_on_in, t_in }) => {
  if (!s0_discounting_on({ discounting_on_in })) return 0;else
  return s1_disc_rate_ann_({ t_in });
};



// MISCEL

export const s0_premium_pp_0$ = ({ premium_payment_frequency_in, duration_mth_in, sum_assured_in, loading_prem_in, policy_term_in, timing_in, policy_count_in, zero_decrement_experience_in, stress_delay_in, original_lapse_rates_in, lapse_rate_factor_in, age_at_entry_in, sex_in, mort_rate_factor_in, mort_rate_Y1_add_per_mille_in, discounting_on_in, zero_spot_year_in, update_pricing_lapse_rates_in, gender_neutral_pricing_in }) => s0_premium_pp({ premium_payment_frequency_in, duration_mth_in, sum_assured_in, loading_prem_in, policy_term_in, timing_in, policy_count_in, zero_decrement_experience_in, stress_delay_in, original_lapse_rates_in, lapse_rate_factor_in, age_at_entry_in, sex_in, mort_rate_factor_in, mort_rate_Y1_add_per_mille_in, discounting_on_in, zero_spot_year_in, update_pricing_lapse_rates_in, gender_neutral_pricing_in, t_in: -s1_duration_mth_0({ duration_mth_in }) }); // to show the premium
export const s0_status$ = ({ duration_mth_in }) => s1_duration_mth_0({ duration_mth_in }) == 0 ? 'New Business' : 'In Force';





// PLACEHOLDER CASHFLOWS FOR PLAYGROUND CUSTOMIZATION:

// spares let you add new cashflows: they are 0, but you can change them below
// careful: manipulation in net_cf not captured in Playground outputs!
export const s0_net_cf$ = ({ premium_payment_frequency_in, t_in, duration_mth_in, sum_assured_in, loading_prem_in, policy_term_in, timing_in, policy_count_in, zero_decrement_experience_in, stress_delay_in, original_lapse_rates_in, lapse_rate_factor_in, age_at_entry_in, sex_in, mort_rate_factor_in, mort_rate_Y1_add_per_mille_in, discounting_on_in, zero_spot_year_in, update_pricing_lapse_rates_in, gender_neutral_pricing_in, expense_acq_in, expenses_factor_in, expense_maint_in, inflation_rate_in, inflation_rate_addition_in, commission_mths_in, commission_pc_in }) => s1_net_cf_({ premium_payment_frequency_in, t_in, duration_mth_in, sum_assured_in, loading_prem_in, policy_term_in, timing_in, policy_count_in, zero_decrement_experience_in, stress_delay_in, original_lapse_rates_in, lapse_rate_factor_in, age_at_entry_in, sex_in, mort_rate_factor_in, mort_rate_Y1_add_per_mille_in, discounting_on_in, zero_spot_year_in, update_pricing_lapse_rates_in, gender_neutral_pricing_in, expense_acq_in, expenses_factor_in, expense_maint_in, inflation_rate_in, inflation_rate_addition_in, commission_mths_in, commission_pc_in }) + s0_placeholder({}) + s0_placeholder2({});

export const s0_placeholder$ = ({}) => 0; // placeholder1 will be visualized green
export const s0_placeholder2$ = ({}) => 0; // placeholder2 will be visualized purpley


// we must have PVs to visualize. Even if discounting is off, this is what the visualization uses
// (when discounting)
export const s0_pv_placeholder$ = ({ discounting_on_in, t_in }) => s1_disc_factor({ discounting_on_in, t_in }) * s0_placeholder({});
export const s0_pv_placeholder2$ = ({ discounting_on_in, t_in }) => s1_disc_factor({ discounting_on_in, t_in }) * s0_placeholder2({});


// policy value is present value of future cashflows, at t_in=0
export const s0_policy_value$ = ({ policy_term_in, duration_mth_in, premium_payment_frequency_in, sum_assured_in, loading_prem_in, pricing_projection_in, timing_in, policy_count_in, zero_decrement_experience_in, stress_delay_in, original_lapse_rates_in, lapse_rate_factor_in, age_at_entry_in, sex_in, mort_rate_factor_in, mort_rate_Y1_add_per_mille_in, discounting_on_in, zero_spot_year_in, update_pricing_lapse_rates_in, gender_neutral_pricing_in, expense_acq_in, expenses_factor_in, expense_maint_in, inflation_rate_in, inflation_rate_addition_in, commission_mths_in, commission_pc_in }) => s1_pv_fut_net_cf({ policy_term_in, duration_mth_in, premium_payment_frequency_in, sum_assured_in, loading_prem_in, pricing_projection_in, timing_in, policy_count_in, zero_decrement_experience_in, stress_delay_in, original_lapse_rates_in, lapse_rate_factor_in, age_at_entry_in, sex_in, mort_rate_factor_in, mort_rate_Y1_add_per_mille_in, discounting_on_in, zero_spot_year_in, update_pricing_lapse_rates_in, gender_neutral_pricing_in, expense_acq_in, expenses_factor_in, expense_maint_in, inflation_rate_in, inflation_rate_addition_in, commission_mths_in, commission_pc_in, t_in: 0 });



////////////// cul scope id 1 //////////

// the following is based on the lifelib BasicTerm_SE model
// documented @ https://lifelib.io/libraries/basiclife/BasicTerm_SE.html
// code @ https://lifelib.io/_modules/basiclife/BasicTerm_SE/Projection.html

// Most Playground developments are in playground.cul.js

// Notable differences made here:

// BasicTerm uses data from a model point table, here model point fields are inputs
// I also made commission features depend on new inputs.

// I tweaked initial conditions in pols_if_at to allow me to show past calculated cashflows
// Along with this I use zero_decrement_experience_in to control 0 vs. expected decrements for t<0 (past cashflows)
// And I split the calculation of PVs:

// About Present Value formulas:
// - In lifelib `pv_premiums` is present value of future premiums
// - Here, `pv_premiums` is the present value of premium cashflows in month t_in.
// Use `pv_fut_premiums` here for present value of future premiums.

// An old check that tied back for 10k of lifelib simulated policies :
// https://x.com/calculang/status/1811044584207560929





// time in months, >=0 is future, <0 is past
export const s1_t$ = ({ t_in }) => t_in;

// 'model point' inputs
export const s1_age_at_entry$ = ({ age_at_entry_in }) => age_at_entry_in;
export const s1_sex$ = ({ sex_in }) => sex_in;
export const s1_policy_term$ = ({ policy_term_in }) => policy_term_in;
export const s1_policy_count$ = ({ policy_count_in }) => policy_count_in;
export const s1_sum_assured$ = ({ sum_assured_in }) => sum_assured_in;


// duration_mth_in is a model point input: the duration "now" since policy started (or 0 for a New Business projection)
// but duration_mth() is the duration at t since policy started
export const s1_duration_mth$ = ({ duration_mth_in, t_in }) => duration_mth_in + s1_t({ t_in });

// duration "now" since policy started, just for convenience:
export const s1_duration_mth_0$ = ({ duration_mth_in }) => s1_duration_mth({ duration_mth_in, t_in: 0 });

// duration since policy started, in years:
export const s1_duration$ = ({ duration_mth_in, t_in }) => Math.floor(s1_duration_mth({ duration_mth_in, t_in }) / 12);

export const s1_age$ = ({ age_at_entry_in, duration_mth_in, t_in }) => s1_age_at_entry({ age_at_entry_in }) + s1_duration({ duration_mth_in, t_in });

// AMOUNT TO PAY ON CLAIM is determed by claim_pp formula

// It's used to project claims cashflows And in the claims projection to calculate premiums (see playground.cul.js `premium_rate_per_mille`)

// for level term assurance, we use a flat sum assured:
export const s1_claim_pp$ = ({ sum_assured_in }) => s1_sum_assured({ sum_assured_in });

// for reducing term assurance, switch to this for a straight-line reduction:
//export const claim_pp = () => sum_assured() * (1 - duration() / policy_term())

// For a mortgage protection-type decrease, we can directly import from a simple-loan calculang model

//import { balance } from "https://calculang.dev/models/simple-loan/simple-loan.cul.js"
//export const claim_pp = () => balance({ principal_in: sum_assured(), i_in: 10 /100, year_in: duration(), term_in: policy_term() })

// This is an example of model composition: calculang models can use other models
// and an every-day URL is an effective way to share and re-use models and logic (also workings)



// mortality rates, using mort_rate() from basicterm-tables.cul.js

export const s1_mort_rate_select_index$ = ({ duration_mth_in, t_in }) => Math.max(0, Math.min(5, s1_duration({ duration_mth_in, t_in }))); // used to lookup mort_rate table

// I can hoist this change to playground.cul.js, but it provides context for pols_if_at behaviour here
export const s1_zero_decrement_experience$ = ({ zero_decrement_experience_in }) => zero_decrement_experience_in ?? true; // todo consider without this?

export const s1_mort_rate_mth$ = ({ t_in, zero_decrement_experience_in, stress_delay_in, age_at_entry_in, duration_mth_in, sex_in, mort_rate_factor_in, mort_rate_Y1_add_per_mille_in }) => {
  if (s1_t({ t_in }) < 0 && s1_zero_decrement_experience({ zero_decrement_experience_in })) return 0;
  return 1 - (1 - s0_mort_rate({ t_in, stress_delay_in, age_at_entry_in, duration_mth_in, sex_in, mort_rate_factor_in, mort_rate_Y1_add_per_mille_in })) ** (1 / 12);
};

// lapse rates
// tihs formula can get updated in the UI:
export const s1_lapse_rate_$ = ({ duration_mth_in, t_in }) => Math.max(0.1 - 0.02 * s1_duration({ duration_mth_in, t_in }), 0.02);

export const s1_lapse_rate_mth$ = ({ t_in, zero_decrement_experience_in, stress_delay_in, original_lapse_rates_in, duration_mth_in, lapse_rate_factor_in }) => {// factored from pols_lapse
  if (s1_t({ t_in }) < 0 && s1_zero_decrement_experience({ zero_decrement_experience_in })) return 0;
  return 1 - (1 - s0_lapse_rate({ t_in, stress_delay_in, original_lapse_rates_in, duration_mth_in, lapse_rate_factor_in })) ** (1 / 12);
};


// policy survival/decrement projections

export const s1_timing$ = ({ timing_in }) => timing_in;

export const s1_pols_if_init$ = ({ policy_count_in }) => s1_policy_count({ policy_count_in });

// BasicTerm_SE wants to project in force data at some date, into the future: it doesn't care about past cashflows.
// In the Playground I want to show past cashflows.
// So I disable a condition below that inits policies in BasicTerm_SE
// The condition that inits policies here is the one that adds pols_new_biz()
// TODO paramaterise this behaviour incl. checks and illustrate pols_if_at timing and logic

export const s1_pols_if_at$ = ({ duration_mth_in, t_in, policy_term_in, timing_in, policy_count_in, zero_decrement_experience_in, stress_delay_in, age_at_entry_in, sex_in, mort_rate_factor_in, mort_rate_Y1_add_per_mille_in, original_lapse_rates_in, lapse_rate_factor_in }) => {
  if (s1_is_active({ duration_mth_in, t_in, policy_term_in }) == 0) return 0;
  if (s1_timing({ timing_in }) == 'BEF_MAT') {
    if (s1_t({ t_in }) == 0 && s1_pols_if_init({ policy_count_in }) && 0 /* DN: disabling */)
    return s1_pols_if_init({ policy_count_in });
    return s1_pols_if_at({ duration_mth_in, policy_term_in, policy_count_in, zero_decrement_experience_in, stress_delay_in, age_at_entry_in, sex_in, mort_rate_factor_in, mort_rate_Y1_add_per_mille_in, original_lapse_rates_in, lapse_rate_factor_in, t_in: s1_t({ t_in }) - 1, timing_in: 'BEF_DECR' }) - s1_pols_lapse({ duration_mth_in, policy_term_in, policy_count_in, zero_decrement_experience_in, stress_delay_in, age_at_entry_in, sex_in, mort_rate_factor_in, mort_rate_Y1_add_per_mille_in, original_lapse_rates_in, lapse_rate_factor_in, t_in: s1_t({ t_in }) - 1 }) - s1_pols_death({ duration_mth_in, policy_term_in, policy_count_in, zero_decrement_experience_in, stress_delay_in, original_lapse_rates_in, lapse_rate_factor_in, age_at_entry_in, sex_in, mort_rate_factor_in, mort_rate_Y1_add_per_mille_in, t_in: s1_t({ t_in }) - 1 });
  }
  if (s1_timing({ timing_in }) == 'BEF_NB') {
    return s1_pols_if_at({ duration_mth_in, t_in, policy_term_in, policy_count_in, zero_decrement_experience_in, stress_delay_in, age_at_entry_in, sex_in, mort_rate_factor_in, mort_rate_Y1_add_per_mille_in, original_lapse_rates_in, lapse_rate_factor_in, timing_in: 'BEF_MAT' }) - s1_pols_maturity({ duration_mth_in, t_in, policy_term_in, policy_count_in, zero_decrement_experience_in, stress_delay_in, age_at_entry_in, sex_in, mort_rate_factor_in, mort_rate_Y1_add_per_mille_in, original_lapse_rates_in, lapse_rate_factor_in });
  }
  if (s1_timing({ timing_in }) == 'BEF_DECR') return s1_pols_if_at({ duration_mth_in, t_in, policy_term_in, policy_count_in, zero_decrement_experience_in, stress_delay_in, age_at_entry_in, sex_in, mort_rate_factor_in, mort_rate_Y1_add_per_mille_in, original_lapse_rates_in, lapse_rate_factor_in, timing_in: 'BEF_NB' }) + s1_pols_new_biz({ duration_mth_in, t_in, policy_count_in });
  return console.error('bad timing_in !');
};

export const s1_pols_lapse$ = ({ duration_mth_in, t_in, policy_term_in, policy_count_in, zero_decrement_experience_in, stress_delay_in, age_at_entry_in, sex_in, mort_rate_factor_in, mort_rate_Y1_add_per_mille_in, original_lapse_rates_in, lapse_rate_factor_in }) => s1_is_active({ duration_mth_in, t_in, policy_term_in }) ? (s1_pols_if_at({ duration_mth_in, t_in, policy_term_in, policy_count_in, zero_decrement_experience_in, stress_delay_in, age_at_entry_in, sex_in, mort_rate_factor_in, mort_rate_Y1_add_per_mille_in, original_lapse_rates_in, lapse_rate_factor_in, timing_in: 'BEF_DECR' }) - s1_pols_death({ duration_mth_in, t_in, policy_term_in, policy_count_in, zero_decrement_experience_in, stress_delay_in, original_lapse_rates_in, lapse_rate_factor_in, age_at_entry_in, sex_in, mort_rate_factor_in, mort_rate_Y1_add_per_mille_in })) * s1_lapse_rate_mth({ t_in, zero_decrement_experience_in, stress_delay_in, original_lapse_rates_in, duration_mth_in, lapse_rate_factor_in }) : 0;


// refactor for stress and experience logic


export const s1_pols_maturity$ = ({ duration_mth_in, t_in, policy_term_in, policy_count_in, zero_decrement_experience_in, stress_delay_in, age_at_entry_in, sex_in, mort_rate_factor_in, mort_rate_Y1_add_per_mille_in, original_lapse_rates_in, lapse_rate_factor_in }) => {
  if (s1_duration_mth({ duration_mth_in, t_in }) == s1_policy_term({ policy_term_in }) * 12)
  return s1_pols_if_at({ duration_mth_in, t_in, policy_term_in, policy_count_in, zero_decrement_experience_in, stress_delay_in, age_at_entry_in, sex_in, mort_rate_factor_in, mort_rate_Y1_add_per_mille_in, original_lapse_rates_in, lapse_rate_factor_in, timing_in: 'BEF_MAT' });else
  return 0;
};

export const s1_pols_new_biz$ = ({ duration_mth_in, t_in, policy_count_in }) => {
  if (s1_duration_mth({ duration_mth_in, t_in }) == 0)
  return s1_policy_count({ policy_count_in });else
  return 0;
};

export const s1_pols_death$ = ({ duration_mth_in, t_in, policy_term_in, policy_count_in, zero_decrement_experience_in, stress_delay_in, original_lapse_rates_in, lapse_rate_factor_in, age_at_entry_in, sex_in, mort_rate_factor_in, mort_rate_Y1_add_per_mille_in }) => s1_is_active({ duration_mth_in, t_in, policy_term_in }) ? s1_pols_if_at({ duration_mth_in, t_in, policy_term_in, policy_count_in, zero_decrement_experience_in, stress_delay_in, age_at_entry_in, sex_in, mort_rate_factor_in, mort_rate_Y1_add_per_mille_in, original_lapse_rates_in, lapse_rate_factor_in, timing_in: 'BEF_DECR' }) * s1_mort_rate_mth({ t_in, zero_decrement_experience_in, stress_delay_in, age_at_entry_in, duration_mth_in, sex_in, mort_rate_factor_in, mort_rate_Y1_add_per_mille_in }) : 0;

// monthly
export const s1_premium_pp_$ = ({ sum_assured_in, loading_prem_in, policy_term_in, timing_in, policy_count_in, zero_decrement_experience_in, stress_delay_in, original_lapse_rates_in, lapse_rate_factor_in, age_at_entry_in, sex_in, mort_rate_factor_in, mort_rate_Y1_add_per_mille_in, discounting_on_in, zero_spot_year_in, premium_payment_frequency_in, update_pricing_lapse_rates_in, gender_neutral_pricing_in }) => Math.round(s1_sum_assured({ sum_assured_in }) / 1000 * s0_premium_rate_per_mille({ loading_prem_in, policy_term_in, sum_assured_in, timing_in, policy_count_in, zero_decrement_experience_in, stress_delay_in, original_lapse_rates_in, lapse_rate_factor_in, age_at_entry_in, sex_in, mort_rate_factor_in, mort_rate_Y1_add_per_mille_in, discounting_on_in, zero_spot_year_in, premium_payment_frequency_in, update_pricing_lapse_rates_in, gender_neutral_pricing_in }) * 100) / 100; // round 2 decimal places


export const s1_expense_acq_$ = ({}) => 300;
export const s1_expense_maint_$ = ({}) => 60;

export const s1_inflation_rate_$ = ({}) => 0.01;
export const s1_inflation_rate_mth$ = ({ t_in, stress_delay_in, inflation_rate_in, inflation_rate_addition_in }) => (1 + s0_inflation_rate({ t_in, stress_delay_in, inflation_rate_in, inflation_rate_addition_in })) ** (1 / 12) - 1;

export const s1_inflation_factor$ = ({ t_in, stress_delay_in, inflation_rate_in, inflation_rate_addition_in }) => (1 + s0_inflation_rate({ t_in, stress_delay_in, inflation_rate_in, inflation_rate_addition_in })) ** (s1_t({ t_in }) / 12); // in playground.cul.js adding support for inflation rates that vary over time: e.g. when we delay/stress the rate, and starting inflation at policy start rather than t=0 or "now"

// cashflows:

export const s1_premiums$ = ({ premium_payment_frequency_in, t_in, duration_mth_in, sum_assured_in, loading_prem_in, policy_term_in, timing_in, policy_count_in, zero_decrement_experience_in, stress_delay_in, original_lapse_rates_in, lapse_rate_factor_in, age_at_entry_in, sex_in, mort_rate_factor_in, mort_rate_Y1_add_per_mille_in, discounting_on_in, zero_spot_year_in, update_pricing_lapse_rates_in, gender_neutral_pricing_in }) => s0_premium_pp({ premium_payment_frequency_in, t_in, duration_mth_in, sum_assured_in, loading_prem_in, policy_term_in, timing_in, policy_count_in, zero_decrement_experience_in, stress_delay_in, original_lapse_rates_in, lapse_rate_factor_in, age_at_entry_in, sex_in, mort_rate_factor_in, mort_rate_Y1_add_per_mille_in, discounting_on_in, zero_spot_year_in, update_pricing_lapse_rates_in, gender_neutral_pricing_in }) * s1_pols_if_at({ duration_mth_in, t_in, policy_term_in, policy_count_in, zero_decrement_experience_in, stress_delay_in, age_at_entry_in, sex_in, mort_rate_factor_in, mort_rate_Y1_add_per_mille_in, original_lapse_rates_in, lapse_rate_factor_in, timing_in: 'BEF_DECR' });
export const s1_claims$ = ({ sum_assured_in, duration_mth_in, t_in, policy_term_in, policy_count_in, zero_decrement_experience_in, stress_delay_in, original_lapse_rates_in, lapse_rate_factor_in, age_at_entry_in, sex_in, mort_rate_factor_in, mort_rate_Y1_add_per_mille_in }) => -s1_claim_pp({ sum_assured_in }) * s1_pols_death({ duration_mth_in, t_in, policy_term_in, policy_count_in, zero_decrement_experience_in, stress_delay_in, original_lapse_rates_in, lapse_rate_factor_in, age_at_entry_in, sex_in, mort_rate_factor_in, mort_rate_Y1_add_per_mille_in });
export const s1_expenses$ = ({ t_in, stress_delay_in, expense_acq_in, expenses_factor_in, duration_mth_in, policy_count_in, policy_term_in, zero_decrement_experience_in, age_at_entry_in, sex_in, mort_rate_factor_in, mort_rate_Y1_add_per_mille_in, original_lapse_rates_in, lapse_rate_factor_in, expense_maint_in, inflation_rate_in, inflation_rate_addition_in }) => -(s0_expense_acq({ t_in, stress_delay_in, expense_acq_in, expenses_factor_in }) * s1_pols_new_biz({ duration_mth_in, t_in, policy_count_in }) + s1_pols_if_at({ duration_mth_in, t_in, policy_term_in, policy_count_in, zero_decrement_experience_in, stress_delay_in, age_at_entry_in, sex_in, mort_rate_factor_in, mort_rate_Y1_add_per_mille_in, original_lapse_rates_in, lapse_rate_factor_in, timing_in: 'BEF_DECR' }) * s0_expense_maint({ t_in, stress_delay_in, expense_maint_in, expenses_factor_in }) / 12 * s1_inflation_factor({ t_in, stress_delay_in, inflation_rate_in, inflation_rate_addition_in }));
export const s1_commissions$ = ({ duration_mth_in, t_in, commission_mths_in, premium_payment_frequency_in, sum_assured_in, loading_prem_in, policy_term_in, timing_in, policy_count_in, zero_decrement_experience_in, stress_delay_in, original_lapse_rates_in, lapse_rate_factor_in, age_at_entry_in, sex_in, mort_rate_factor_in, mort_rate_Y1_add_per_mille_in, discounting_on_in, zero_spot_year_in, update_pricing_lapse_rates_in, gender_neutral_pricing_in, commission_pc_in }) => s1_duration_mth({ duration_mth_in, t_in }) < s0_commission_mths({ commission_mths_in }) ? -s1_premiums({ premium_payment_frequency_in, t_in, duration_mth_in, sum_assured_in, loading_prem_in, policy_term_in, timing_in, policy_count_in, zero_decrement_experience_in, stress_delay_in, original_lapse_rates_in, lapse_rate_factor_in, age_at_entry_in, sex_in, mort_rate_factor_in, mort_rate_Y1_add_per_mille_in, discounting_on_in, zero_spot_year_in, update_pricing_lapse_rates_in, gender_neutral_pricing_in }) * s0_commission_pc({ commission_pc_in }) / 100 : 0;

export const s1_commission_mths_$ = ({}) => 12;
export const s1_commission_pc_$ = ({}) => 100;

// careful: manipulation in net_cf not captured in Playground outputs!
export const s1_net_cf_$ = ({ premium_payment_frequency_in, t_in, duration_mth_in, sum_assured_in, loading_prem_in, policy_term_in, timing_in, policy_count_in, zero_decrement_experience_in, stress_delay_in, original_lapse_rates_in, lapse_rate_factor_in, age_at_entry_in, sex_in, mort_rate_factor_in, mort_rate_Y1_add_per_mille_in, discounting_on_in, zero_spot_year_in, update_pricing_lapse_rates_in, gender_neutral_pricing_in, expense_acq_in, expenses_factor_in, expense_maint_in, inflation_rate_in, inflation_rate_addition_in, commission_mths_in, commission_pc_in }) => s1_premiums({ premium_payment_frequency_in, t_in, duration_mth_in, sum_assured_in, loading_prem_in, policy_term_in, timing_in, policy_count_in, zero_decrement_experience_in, stress_delay_in, original_lapse_rates_in, lapse_rate_factor_in, age_at_entry_in, sex_in, mort_rate_factor_in, mort_rate_Y1_add_per_mille_in, discounting_on_in, zero_spot_year_in, update_pricing_lapse_rates_in, gender_neutral_pricing_in }) + s1_claims({ sum_assured_in, duration_mth_in, t_in, policy_term_in, policy_count_in, zero_decrement_experience_in, stress_delay_in, original_lapse_rates_in, lapse_rate_factor_in, age_at_entry_in, sex_in, mort_rate_factor_in, mort_rate_Y1_add_per_mille_in }) + s1_expenses({ t_in, stress_delay_in, expense_acq_in, expenses_factor_in, duration_mth_in, policy_count_in, policy_term_in, zero_decrement_experience_in, age_at_entry_in, sex_in, mort_rate_factor_in, mort_rate_Y1_add_per_mille_in, original_lapse_rates_in, lapse_rate_factor_in, expense_maint_in, inflation_rate_in, inflation_rate_addition_in }) + s1_commissions({ duration_mth_in, t_in, commission_mths_in, premium_payment_frequency_in, sum_assured_in, loading_prem_in, policy_term_in, timing_in, policy_count_in, zero_decrement_experience_in, stress_delay_in, original_lapse_rates_in, lapse_rate_factor_in, age_at_entry_in, sex_in, mort_rate_factor_in, mort_rate_Y1_add_per_mille_in, discounting_on_in, zero_spot_year_in, update_pricing_lapse_rates_in, gender_neutral_pricing_in, commission_pc_in });


export const s1_proj_len$ = ({ policy_term_in, duration_mth_in }) => Math.max(12 * s1_policy_term({ policy_term_in }) - s1_duration_mth({ duration_mth_in, t_in: 0 }) + 1, 0);

// todo think re actuals (new)
export const s1_is_active$ = ({ duration_mth_in, t_in, policy_term_in }) => !(s1_duration_mth({ duration_mth_in, t_in }) < 0 || s1_duration_mth({ duration_mth_in, t_in }) > s1_policy_term({ policy_term_in }) * 12);

export const s1_pols_if$ = ({ duration_mth_in, t_in, policy_term_in, timing_in, policy_count_in, zero_decrement_experience_in, stress_delay_in, age_at_entry_in, sex_in, mort_rate_factor_in, mort_rate_Y1_add_per_mille_in, original_lapse_rates_in, lapse_rate_factor_in }) => s1_pols_if_at({ duration_mth_in, t_in, policy_term_in, timing_in, policy_count_in, zero_decrement_experience_in, stress_delay_in, age_at_entry_in, sex_in, mort_rate_factor_in, mort_rate_Y1_add_per_mille_in, original_lapse_rates_in, lapse_rate_factor_in }) /*{ timing_in: 'BEF_MAT' }*/;
// pols_if in lifelib BasicTerm_S uses BEF_MAT timing, but there pols_if isn't actually used.
// Where pols_if is used is in the premium calculation (via net_premium_pp), and I want Playground premium calculations to reconcile precisely to basicterm premium rates.
// Those premium rates are documented in this notebook: https://lifelib.io/libraries/basiclife/create_premium_table.html
// which uses the BasicTerm_M model. (M models *seem* to be less intentional about timing)
// In Playground, using BEF_DECR timing gets me to reconcile premium rates precisely.
// Leaving timing free here: I specify the timing in premium_rate_per_mille formula in playground.cul.js

export const s1_net_premium_pp_$ = ({ policy_term_in, sum_assured_in, timing_in, policy_count_in, zero_decrement_experience_in, stress_delay_in, original_lapse_rates_in, lapse_rate_factor_in, age_at_entry_in, sex_in, mort_rate_factor_in, mort_rate_Y1_add_per_mille_in, discounting_on_in, zero_spot_year_in, premium_payment_frequency_in }) => {
  return -s1_pv_fut_claims({ policy_term_in, sum_assured_in, timing_in, policy_count_in, zero_decrement_experience_in, stress_delay_in, original_lapse_rates_in, lapse_rate_factor_in, age_at_entry_in, sex_in, mort_rate_factor_in, mort_rate_Y1_add_per_mille_in, discounting_on_in, zero_spot_year_in, t_in: 0, duration_mth_in: 0 }) / s1_pv_fut_pols_if({ policy_term_in, timing_in, policy_count_in, zero_decrement_experience_in, stress_delay_in, age_at_entry_in, sex_in, mort_rate_factor_in, mort_rate_Y1_add_per_mille_in, original_lapse_rates_in, lapse_rate_factor_in, discounting_on_in, zero_spot_year_in, premium_payment_frequency_in, t_in: 0, duration_mth_in: 0 });
};

export const s1_premium_rate_per_mille_$ = ({ age_at_entry_in, policy_term_in }) =>
s2_premium_rate({ age_at_entry_in, policy_term_in }) * 1000; // uses table from basicterm-tables.cul.js



// Discounting factor calculation
// derived from zero_spot() from basicterm-tables.cul.js

export const s1_disc_rate_ann_$ = ({ t_in }) => {
  if (s1_t({ t_in }) <= 0) return 0;else
  return s2_zero_spot({ zero_spot_year_in: Math.floor(s1_t({ t_in }) / 12) });
};

export const s1_disc_rate_mth$ = ({ discounting_on_in, t_in }) => (1 + s0_disc_rate_ann({ discounting_on_in, t_in })) ** (1 / 12) - 1;

export const s1_disc_factor$ = ({ discounting_on_in, t_in }) => (1 + s1_disc_rate_mth({ discounting_on_in, t_in })) ** -s1_t({ t_in });


// Present Value calculations
// In 2 parts so that pv_x can conveniently visualise discounted cashflows over time
// (or not discounted depending on switch in playground.cul.js)
// Future cashflows accumulated in pv_fut_x

// This code is repetitive but it's easily generated.
// It's unsightly but it can be separated from other modelling logic.

// 1. pv_x is the present value is month t
export const s1_pv_claims$ = ({ sum_assured_in, duration_mth_in, t_in, policy_term_in, policy_count_in, zero_decrement_experience_in, stress_delay_in, original_lapse_rates_in, lapse_rate_factor_in, age_at_entry_in, sex_in, mort_rate_factor_in, mort_rate_Y1_add_per_mille_in, discounting_on_in }) => s1_claims({ sum_assured_in, duration_mth_in, t_in, policy_term_in, policy_count_in, zero_decrement_experience_in, stress_delay_in, original_lapse_rates_in, lapse_rate_factor_in, age_at_entry_in, sex_in, mort_rate_factor_in, mort_rate_Y1_add_per_mille_in }) * s1_disc_factor({ discounting_on_in, t_in });
export const s1_pv_premiums$ = ({ premium_payment_frequency_in, t_in, duration_mth_in, sum_assured_in, loading_prem_in, policy_term_in, timing_in, policy_count_in, zero_decrement_experience_in, stress_delay_in, original_lapse_rates_in, lapse_rate_factor_in, age_at_entry_in, sex_in, mort_rate_factor_in, mort_rate_Y1_add_per_mille_in, discounting_on_in, zero_spot_year_in, update_pricing_lapse_rates_in, gender_neutral_pricing_in }) => s1_premiums({ premium_payment_frequency_in, t_in, duration_mth_in, sum_assured_in, loading_prem_in, policy_term_in, timing_in, policy_count_in, zero_decrement_experience_in, stress_delay_in, original_lapse_rates_in, lapse_rate_factor_in, age_at_entry_in, sex_in, mort_rate_factor_in, mort_rate_Y1_add_per_mille_in, discounting_on_in, zero_spot_year_in, update_pricing_lapse_rates_in, gender_neutral_pricing_in }) * s1_disc_factor({ discounting_on_in, t_in });
export const s1_pv_expenses$ = ({ t_in, stress_delay_in, expense_acq_in, expenses_factor_in, duration_mth_in, policy_count_in, policy_term_in, zero_decrement_experience_in, age_at_entry_in, sex_in, mort_rate_factor_in, mort_rate_Y1_add_per_mille_in, original_lapse_rates_in, lapse_rate_factor_in, expense_maint_in, inflation_rate_in, inflation_rate_addition_in, discounting_on_in }) => s1_expenses({ t_in, stress_delay_in, expense_acq_in, expenses_factor_in, duration_mth_in, policy_count_in, policy_term_in, zero_decrement_experience_in, age_at_entry_in, sex_in, mort_rate_factor_in, mort_rate_Y1_add_per_mille_in, original_lapse_rates_in, lapse_rate_factor_in, expense_maint_in, inflation_rate_in, inflation_rate_addition_in }) * s1_disc_factor({ discounting_on_in, t_in });
export const s1_pv_commissions$ = ({ duration_mth_in, t_in, commission_mths_in, premium_payment_frequency_in, sum_assured_in, loading_prem_in, policy_term_in, timing_in, policy_count_in, zero_decrement_experience_in, stress_delay_in, original_lapse_rates_in, lapse_rate_factor_in, age_at_entry_in, sex_in, mort_rate_factor_in, mort_rate_Y1_add_per_mille_in, discounting_on_in, zero_spot_year_in, update_pricing_lapse_rates_in, gender_neutral_pricing_in, commission_pc_in }) => s1_commissions({ duration_mth_in, t_in, commission_mths_in, premium_payment_frequency_in, sum_assured_in, loading_prem_in, policy_term_in, timing_in, policy_count_in, zero_decrement_experience_in, stress_delay_in, original_lapse_rates_in, lapse_rate_factor_in, age_at_entry_in, sex_in, mort_rate_factor_in, mort_rate_Y1_add_per_mille_in, discounting_on_in, zero_spot_year_in, update_pricing_lapse_rates_in, gender_neutral_pricing_in, commission_pc_in }) * s1_disc_factor({ discounting_on_in, t_in });
export const s1_pv_net_cf$ = ({ premium_payment_frequency_in, t_in, duration_mth_in, sum_assured_in, loading_prem_in, policy_term_in, timing_in, policy_count_in, zero_decrement_experience_in, stress_delay_in, original_lapse_rates_in, lapse_rate_factor_in, age_at_entry_in, sex_in, mort_rate_factor_in, mort_rate_Y1_add_per_mille_in, discounting_on_in, zero_spot_year_in, update_pricing_lapse_rates_in, gender_neutral_pricing_in, expense_acq_in, expenses_factor_in, expense_maint_in, inflation_rate_in, inflation_rate_addition_in, commission_mths_in, commission_pc_in }) => s0_net_cf({ premium_payment_frequency_in, t_in, duration_mth_in, sum_assured_in, loading_prem_in, policy_term_in, timing_in, policy_count_in, zero_decrement_experience_in, stress_delay_in, original_lapse_rates_in, lapse_rate_factor_in, age_at_entry_in, sex_in, mort_rate_factor_in, mort_rate_Y1_add_per_mille_in, discounting_on_in, zero_spot_year_in, update_pricing_lapse_rates_in, gender_neutral_pricing_in, expense_acq_in, expenses_factor_in, expense_maint_in, inflation_rate_in, inflation_rate_addition_in, commission_mths_in, commission_pc_in }) * s1_disc_factor({ discounting_on_in, t_in });
export const s1_pv_pols_if_$ = ({ duration_mth_in, t_in, policy_term_in, timing_in, policy_count_in, zero_decrement_experience_in, stress_delay_in, age_at_entry_in, sex_in, mort_rate_factor_in, mort_rate_Y1_add_per_mille_in, original_lapse_rates_in, lapse_rate_factor_in, discounting_on_in }) => s1_pols_if({ duration_mth_in, t_in, policy_term_in, timing_in, policy_count_in, zero_decrement_experience_in, stress_delay_in, age_at_entry_in, sex_in, mort_rate_factor_in, mort_rate_Y1_add_per_mille_in, original_lapse_rates_in, lapse_rate_factor_in }) * s1_disc_factor({ discounting_on_in, t_in }); // BasicTerm_M, for pricing table calc reconciliation

// 2. pv_fut_x is sum of future present values >= t:
export const s1_pv_fut_claims$ = ({ t_in, policy_term_in, duration_mth_in, sum_assured_in, timing_in, policy_count_in, zero_decrement_experience_in, stress_delay_in, original_lapse_rates_in, lapse_rate_factor_in, age_at_entry_in, sex_in, mort_rate_factor_in, mort_rate_Y1_add_per_mille_in, discounting_on_in, zero_spot_year_in }) => {
  if (s1_t({ t_in }) >= s1_proj_len({ policy_term_in, duration_mth_in })) return 0;
  return s1_pv_fut_claims({ policy_term_in, duration_mth_in, sum_assured_in, timing_in, policy_count_in, zero_decrement_experience_in, stress_delay_in, original_lapse_rates_in, lapse_rate_factor_in, age_at_entry_in, sex_in, mort_rate_factor_in, mort_rate_Y1_add_per_mille_in, discounting_on_in, zero_spot_year_in, t_in: s1_t({ t_in }) + 1 }) + s1_pv_claims({ sum_assured_in, duration_mth_in, t_in, policy_term_in, policy_count_in, zero_decrement_experience_in, stress_delay_in, original_lapse_rates_in, lapse_rate_factor_in, age_at_entry_in, sex_in, mort_rate_factor_in, mort_rate_Y1_add_per_mille_in, discounting_on_in });
};

export const s1_pv_fut_premiums$ = ({ t_in, policy_term_in, duration_mth_in, premium_payment_frequency_in, sum_assured_in, loading_prem_in, pricing_projection_in, timing_in, policy_count_in, zero_decrement_experience_in, stress_delay_in, original_lapse_rates_in, lapse_rate_factor_in, age_at_entry_in, sex_in, mort_rate_factor_in, mort_rate_Y1_add_per_mille_in, discounting_on_in, zero_spot_year_in, update_pricing_lapse_rates_in, gender_neutral_pricing_in }) => {
  if (s1_t({ t_in }) >= s1_proj_len({ policy_term_in, duration_mth_in })) return 0;
  return s1_pv_fut_premiums({ policy_term_in, duration_mth_in, premium_payment_frequency_in, sum_assured_in, loading_prem_in, pricing_projection_in, timing_in, policy_count_in, zero_decrement_experience_in, stress_delay_in, original_lapse_rates_in, lapse_rate_factor_in, age_at_entry_in, sex_in, mort_rate_factor_in, mort_rate_Y1_add_per_mille_in, discounting_on_in, zero_spot_year_in, update_pricing_lapse_rates_in, gender_neutral_pricing_in, t_in: s1_t({ t_in }) + 1 }) + s1_pv_premiums({ premium_payment_frequency_in, t_in, duration_mth_in, sum_assured_in, loading_prem_in, policy_term_in, timing_in, policy_count_in, zero_decrement_experience_in, stress_delay_in, original_lapse_rates_in, lapse_rate_factor_in, age_at_entry_in, sex_in, mort_rate_factor_in, mort_rate_Y1_add_per_mille_in, discounting_on_in, zero_spot_year_in, update_pricing_lapse_rates_in, gender_neutral_pricing_in });
};

export const s1_pv_fut_expenses$ = ({ t_in, policy_term_in, duration_mth_in, stress_delay_in, expense_acq_in, expenses_factor_in, policy_count_in, timing_in, zero_decrement_experience_in, age_at_entry_in, sex_in, mort_rate_factor_in, mort_rate_Y1_add_per_mille_in, original_lapse_rates_in, lapse_rate_factor_in, expense_maint_in, inflation_rate_in, inflation_rate_addition_in, discounting_on_in, zero_spot_year_in }) => {
  if (s1_t({ t_in }) >= s1_proj_len({ policy_term_in, duration_mth_in })) return 0;
  return s1_pv_fut_expenses({ policy_term_in, duration_mth_in, stress_delay_in, expense_acq_in, expenses_factor_in, policy_count_in, timing_in, zero_decrement_experience_in, age_at_entry_in, sex_in, mort_rate_factor_in, mort_rate_Y1_add_per_mille_in, original_lapse_rates_in, lapse_rate_factor_in, expense_maint_in, inflation_rate_in, inflation_rate_addition_in, discounting_on_in, zero_spot_year_in, t_in: s1_t({ t_in }) + 1 }) + s1_pv_expenses({ t_in, stress_delay_in, expense_acq_in, expenses_factor_in, duration_mth_in, policy_count_in, policy_term_in, zero_decrement_experience_in, age_at_entry_in, sex_in, mort_rate_factor_in, mort_rate_Y1_add_per_mille_in, original_lapse_rates_in, lapse_rate_factor_in, expense_maint_in, inflation_rate_in, inflation_rate_addition_in, discounting_on_in });
};

export const s1_pv_fut_commissions$ = ({ t_in, policy_term_in, duration_mth_in, commission_mths_in, premium_payment_frequency_in, sum_assured_in, loading_prem_in, pricing_projection_in, timing_in, policy_count_in, zero_decrement_experience_in, stress_delay_in, original_lapse_rates_in, lapse_rate_factor_in, age_at_entry_in, sex_in, mort_rate_factor_in, mort_rate_Y1_add_per_mille_in, discounting_on_in, zero_spot_year_in, update_pricing_lapse_rates_in, gender_neutral_pricing_in, commission_pc_in }) => {
  if (s1_t({ t_in }) >= s1_proj_len({ policy_term_in, duration_mth_in })) return 0;
  return s1_pv_fut_commissions({ policy_term_in, duration_mth_in, commission_mths_in, premium_payment_frequency_in, sum_assured_in, loading_prem_in, pricing_projection_in, timing_in, policy_count_in, zero_decrement_experience_in, stress_delay_in, original_lapse_rates_in, lapse_rate_factor_in, age_at_entry_in, sex_in, mort_rate_factor_in, mort_rate_Y1_add_per_mille_in, discounting_on_in, zero_spot_year_in, update_pricing_lapse_rates_in, gender_neutral_pricing_in, commission_pc_in, t_in: s1_t({ t_in }) + 1 }) + s1_pv_commissions({ duration_mth_in, t_in, commission_mths_in, premium_payment_frequency_in, sum_assured_in, loading_prem_in, policy_term_in, timing_in, policy_count_in, zero_decrement_experience_in, stress_delay_in, original_lapse_rates_in, lapse_rate_factor_in, age_at_entry_in, sex_in, mort_rate_factor_in, mort_rate_Y1_add_per_mille_in, discounting_on_in, zero_spot_year_in, update_pricing_lapse_rates_in, gender_neutral_pricing_in, commission_pc_in });
};

export const s1_pv_fut_net_cf$ = ({ t_in, policy_term_in, duration_mth_in, premium_payment_frequency_in, sum_assured_in, loading_prem_in, pricing_projection_in, timing_in, policy_count_in, zero_decrement_experience_in, stress_delay_in, original_lapse_rates_in, lapse_rate_factor_in, age_at_entry_in, sex_in, mort_rate_factor_in, mort_rate_Y1_add_per_mille_in, discounting_on_in, zero_spot_year_in, update_pricing_lapse_rates_in, gender_neutral_pricing_in, expense_acq_in, expenses_factor_in, expense_maint_in, inflation_rate_in, inflation_rate_addition_in, commission_mths_in, commission_pc_in }) => {
  if (s1_t({ t_in }) >= s1_proj_len({ policy_term_in, duration_mth_in })) return 0;
  return s1_pv_fut_net_cf({ policy_term_in, duration_mth_in, premium_payment_frequency_in, sum_assured_in, loading_prem_in, pricing_projection_in, timing_in, policy_count_in, zero_decrement_experience_in, stress_delay_in, original_lapse_rates_in, lapse_rate_factor_in, age_at_entry_in, sex_in, mort_rate_factor_in, mort_rate_Y1_add_per_mille_in, discounting_on_in, zero_spot_year_in, update_pricing_lapse_rates_in, gender_neutral_pricing_in, expense_acq_in, expenses_factor_in, expense_maint_in, inflation_rate_in, inflation_rate_addition_in, commission_mths_in, commission_pc_in, t_in: s1_t({ t_in }) + 1 }) + s1_pv_net_cf({ premium_payment_frequency_in, t_in, duration_mth_in, sum_assured_in, loading_prem_in, policy_term_in, timing_in, policy_count_in, zero_decrement_experience_in, stress_delay_in, original_lapse_rates_in, lapse_rate_factor_in, age_at_entry_in, sex_in, mort_rate_factor_in, mort_rate_Y1_add_per_mille_in, discounting_on_in, zero_spot_year_in, update_pricing_lapse_rates_in, gender_neutral_pricing_in, expense_acq_in, expenses_factor_in, expense_maint_in, inflation_rate_in, inflation_rate_addition_in, commission_mths_in, commission_pc_in });
};

export const s1_pv_fut_pols_if$ = ({ t_in, policy_term_in, duration_mth_in, timing_in, policy_count_in, zero_decrement_experience_in, stress_delay_in, age_at_entry_in, sex_in, mort_rate_factor_in, mort_rate_Y1_add_per_mille_in, original_lapse_rates_in, lapse_rate_factor_in, discounting_on_in, zero_spot_year_in, premium_payment_frequency_in }) => {
  if (s1_t({ t_in }) >= s1_proj_len({ policy_term_in, duration_mth_in })) return 0;
  return s1_pv_fut_pols_if({ policy_term_in, duration_mth_in, timing_in, policy_count_in, zero_decrement_experience_in, stress_delay_in, age_at_entry_in, sex_in, mort_rate_factor_in, mort_rate_Y1_add_per_mille_in, original_lapse_rates_in, lapse_rate_factor_in, discounting_on_in, zero_spot_year_in, premium_payment_frequency_in, t_in: s1_t({ t_in }) + 1 }) + s0_pv_pols_if({ duration_mth_in, t_in, policy_term_in, timing_in, policy_count_in, zero_decrement_experience_in, stress_delay_in, age_at_entry_in, sex_in, mort_rate_factor_in, mort_rate_Y1_add_per_mille_in, original_lapse_rates_in, lapse_rate_factor_in, discounting_on_in, premium_payment_frequency_in });
};

// not ported: check_pv_net_cf



////////////// cul scope id 2 //////////


// Tables for Premium rates, Mortality rates and Discounting rates, and lookup formulas.
// The Playground recalculates Premium and Mortality rates, so those aren't used by default.
// (see playground.cul.js `premium_rate_per_mille` and `mort_rate_recalc`)

// This isn't the only way to get tables or data into calculang models.
// But it works for the Playground and makes the model self-contained.

// Table values reflect tables from lifelibs BasicTerm model.


//////////////////////////////////// premium rates: ////////////////////////////////////


export const s2_age_at_entry_$ = ({ age_at_entry_in }) => age_at_entry_in;
export const s2_policy_term_$ = ({ policy_term_in }) => policy_term_in;

export const s2_premium_rate$ = ({ age_at_entry_in, policy_term_in }) =>
s2_premium_table({}).
find((d) => d.age_at_entry == s1_age_at_entry({ age_at_entry_in }) && d.policy_term == s1_policy_term({ policy_term_in })).
premium_rate;

export const s2_premium_table$ = ({}) => [{ "age_at_entry": 20, "policy_term": 10, "premium_rate": 0.00004640975421603339 }, { "age_at_entry": 20, "policy_term": 15, "premium_rate": 0.00005201420694840453 }, { "age_at_entry": 20, "policy_term": 20, "premium_rate": 0.00005741624099114488 }, { "age_at_entry": 21, "policy_term": 10, "premium_rate": 0.00004765849499272342 }, { "age_at_entry": 21, "policy_term": 15, "premium_rate": 0.00005358752486189249 }, { "age_at_entry": 21, "policy_term": 20, "premium_rate": 0.00005935047535670417 }, { "age_at_entry": 22, "policy_term": 10, "premium_rate": 0.0000490032814567946 }, { "age_at_entry": 22, "policy_term": 15, "premium_rate": 0.00005528101089876454 }, { "age_at_entry": 22, "policy_term": 20, "premium_rate": 0.00006143326193219769 }, { "age_at_entry": 23, "policy_term": 10, "premium_rate": 0.00005045080829105788 }, { "age_at_entry": 23, "policy_term": 15, "premium_rate": 0.00005710353472545799 }, { "age_at_entry": 23, "policy_term": 20, "premium_rate": 0.0000636761717776956 }, { "age_at_entry": 24, "policy_term": 10, "premium_rate": 0.0000520083922978608 }, { "age_at_entry": 24, "policy_term": 15, "premium_rate": 0.00005906480804491657 }, { "age_at_entry": 24, "policy_term": 20, "premium_rate": 0.0000660919023530468 }, { "age_at_entry": 25, "policy_term": 10, "premium_rate": 0.00005368403467116616 }, { "age_at_entry": 25, "policy_term": 15, "premium_rate": 0.00006117547132249184 }, { "age_at_entry": 25, "policy_term": 20, "premium_rate": 0.00006869439708624116 }, { "age_at_entry": 26, "policy_term": 10, "premium_rate": 0.0000554864901121709 }, { "age_at_entry": 26, "policy_term": 15, "premium_rate": 0.00006344719033845301 }, { "age_at_entry": 26, "policy_term": 20, "premium_rate": 0.00007149897886927038 }, { "age_at_entry": 27, "policy_term": 10, "premium_rate": 0.00005742534363175818 }, { "age_at_entry": 27, "policy_term": 15, "premium_rate": 0.00006589276379298864 }, { "age_at_entry": 27, "policy_term": 20, "premium_rate": 0.00007452249924573117 }, { "age_at_entry": 28, "policy_term": 10, "premium_rate": 0.00005951109598973362 }, { "age_at_entry": 28, "policy_term": 15, "premium_rate": 0.00006852624334943163 }, { "age_at_entry": 28, "policy_term": 20, "premium_rate": 0.00007778350528859693 }, { "age_at_entry": 29, "policy_term": 10, "premium_rate": 0.00006175525884088717 }, { "age_at_entry": 29, "policy_term": 15, "premium_rate": 0.00007136306768231619 }, { "age_at_entry": 29, "policy_term": 20, "premium_rate": 0.00008130242643210992 }, { "age_at_entry": 30, "policy_term": 10, "premium_rate": 0.00006417046079764408 }, { "age_at_entry": 30, "policy_term": 15, "premium_rate": 0.00007442021230544037 }, { "age_at_entry": 30, "policy_term": 20, "premium_rate": 0.00008510178382687644 }, { "age_at_entry": 31, "policy_term": 10, "premium_rate": 0.00006677056577697491 }, { "age_at_entry": 31, "policy_term": 15, "premium_rate": 0.0000777163571920156 }, { "age_at_entry": 31, "policy_term": 20, "premium_rate": 0.00008920642513381684 }, { "age_at_entry": 32, "policy_term": 10, "premium_rate": 0.00006957080517997386 }, { "age_at_entry": 32, "policy_term": 15, "premium_rate": 0.00008127207447015372 }, { "age_at_entry": 32, "policy_term": 20, "premium_rate": 0.00009364378806899729 }, { "age_at_entry": 33, "policy_term": 10, "premium_rate": 0.00007258792566005471 }, { "age_at_entry": 33, "policy_term": 15, "premium_rate": 0.00008511003878772994 }, { "age_at_entry": 33, "policy_term": 20, "premium_rate": 0.00009844419646385912 }, { "age_at_entry": 34, "policy_term": 10, "premium_rate": 0.00007584035447163578 }, { "age_at_entry": 34, "policy_term": 15, "premium_rate": 0.00008925526329463727 }, { "age_at_entry": 34, "policy_term": 20, "premium_rate": 0.0001036411931211431 }, { "age_at_entry": 35, "policy_term": 10, "premium_rate": 0.00007934838466214738 }, { "age_at_entry": 35, "policy_term": 15, "premium_rate": 0.00009373536459700033 }, { "age_at_entry": 35, "policy_term": 20, "premium_rate": 0.0001092719143360424 }, { "age_at_entry": 36, "policy_term": 10, "premium_rate": 0.0000831343826810708 }, { "age_at_entry": 36, "policy_term": 15, "premium_rate": 0.00009858086050304437 }, { "age_at_entry": 36, "policy_term": 20, "premium_rate": 0.0001153775116245448 }, { "age_at_entry": 37, "policy_term": 10, "premium_rate": 0.00008722302133269966 }, { "age_at_entry": 37, "policy_term": 15, "premium_rate": 0.0001038255049114134 }, { "age_at_entry": 37, "policy_term": 20, "premium_rate": 0.0001220036269662881 }, { "age_at_entry": 38, "policy_term": 10, "premium_rate": 0.00009164154140950132 }, { "age_at_entry": 38, "policy_term": 15, "premium_rate": 0.0001095066648045053 }, { "age_at_entry": 38, "policy_term": 20, "premium_rate": 0.0001292009287445022 }, { "age_at_entry": 39, "policy_term": 10, "premium_rate": 0.00009642004580758621 }, { "age_at_entry": 39, "policy_term": 15, "premium_rate": 0.0001156657450070503 }, { "age_at_entry": 39, "policy_term": 20, "premium_rate": 0.0001370257165595064 }, { "age_at_entry": 40, "policy_term": 10, "premium_rate": 0.000101591830464382 }, { "age_at_entry": 40, "policy_term": 15, "premium_rate": 0.0001223486671729518 }, { "age_at_entry": 40, "policy_term": 20, "premium_rate": 0.0001455406042260016 }, { "age_at_entry": 41, "policy_term": 10, "premium_rate": 0.0001071937570736272 }, { "age_at_entry": 41, "policy_term": 15, "premium_rate": 0.0001296064103818052 }, { "age_at_entry": 41, "policy_term": 20, "premium_rate": 0.0001548152915509206 }, { "age_at_entry": 42, "policy_term": 10, "premium_rate": 0.0001132666732429493 }, { "age_at_entry": 42, "policy_term": 15, "premium_rate": 0.0001374956217817426 }, { "age_at_entry": 42, "policy_term": 20, "premium_rate": 0.0001649274369503891 }, { "age_at_entry": 43, "policy_term": 10, "premium_rate": 0.0001198558865743043 }, { "age_at_entry": 43, "policy_term": 15, "premium_rate": 0.0001460793069241879 }, { "age_at_entry": 43, "policy_term": 20, "premium_rate": 0.0001759636446186007 }, { "age_at_entry": 44, "policy_term": 10, "premium_rate": 0.0001270117000871093 }, { "age_at_entry": 44, "policy_term": 15, "premium_rate": 0.0001554276108231779 }, { "age_at_entry": 44, "policy_term": 20, "premium_rate": 0.0001880205818310051 }, { "age_at_entry": 45, "policy_term": 10, "premium_rate": 0.0001347900174869537 }, { "age_at_entry": 45, "policy_term": 15, "premium_rate": 0.0001656187023631692 }, { "age_at_entry": 45, "policy_term": 20, "premium_rate": 0.0002012062440701338 }, { "age_at_entry": 46, "policy_term": 10, "premium_rate": 0.0001432530280294765 }, { "age_at_entry": 46, "policy_term": 15, "premium_rate": 0.0001767397765012511 }, { "age_at_entry": 46, "policy_term": 20, "premium_rate": 0.0002156413880238684 }, { "age_at_entry": 47, "policy_term": 10, "premium_rate": 0.0001524699821696503 }, { "age_at_entry": 47, "policy_term": 15, "premium_rate": 0.0001888881907989901 }, { "age_at_entry": 47, "policy_term": 20, "premium_rate": 0.0002314611551436565 }, { "age_at_entry": 48, "policy_term": 10, "premium_rate": 0.0001625180708482426 }, { "age_at_entry": 48, "policy_term": 15, "premium_rate": 0.000202172755209273 }, { "age_at_entry": 48, "policy_term": 20, "premium_rate": 0.0002488169113761276 }, { "age_at_entry": 49, "policy_term": 10, "premium_rate": 0.0001734834231861385 }, { "age_at_entry": 49, "policy_term": 15, "premium_rate": 0.0002167151967767361 }, { "age_at_entry": 49, "policy_term": 20, "premium_rate": 0.0002678783319032106 }, { "age_at_entry": 50, "policy_term": 10, "premium_rate": 0.0001854622395745686 }, { "age_at_entry": 50, "policy_term": 15, "premium_rate": 0.0002326518240306415 }, { "age_at_entry": 50, "policy_term": 20, "premium_rate": 0.000288835763236824 }, { "age_at_entry": 51, "policy_term": 10, "premium_rate": 0.0001985620797120826 }, { "age_at_entry": 51, "policy_term": 15, "premium_rate": 0.0002501354194057051 }, { "age_at_entry": 51, "policy_term": 20, "premium_rate": 0.0003119028987913396 }, { "age_at_entry": 52, "policy_term": 10, "premium_rate": 0.0002129033281007992 }, { "age_at_entry": 52, "policy_term": 15, "premium_rate": 0.0002693373920686173 }, { "age_at_entry": 52, "policy_term": 20, "premium_rate": 0.0003373198080469786 }, { "age_at_entry": 53, "policy_term": 10, "premium_rate": 0.0002286208629422971 }, { "age_at_entry": 53, "policy_term": 15, "premium_rate": 0.0002904502281129727 }, { "age_at_entry": 53, "policy_term": 20, "premium_rate": 0.0003653563635323774 }, { "age_at_entry": 54, "policy_term": 10, "premium_rate": 0.0002458659583320497 }, { "age_at_entry": 54, "policy_term": 15, "premium_rate": 0.0003136902802596004 }, { "age_at_entry": 54, "policy_term": 20, "premium_rate": 0.0003963161139423359 }, { "age_at_entry": 55, "policy_term": 10, "premium_rate": 0.0002648084542346584 }, { "age_at_entry": 55, "policy_term": 15, "premium_rate": 0.0003393009450197514 }, { "age_at_entry": 55, "policy_term": 20, "premium_rate": 0.0004305406555474387 }, { "age_at_entry": 56, "policy_term": 10, "premium_rate": 0.0002856392340165261 }, { "age_at_entry": 56, "policy_term": 15, "premium_rate": 0.0003675562817795503 }, { "age_at_entry": 56, "policy_term": 20, "premium_rate": 0.0004684145573042794 }, { "age_at_entry": 57, "policy_term": 10, "premium_rate": 0.000308573055431566 }, { "age_at_entry": 57, "policy_term": 15, "premium_rate": 0.0003987651354736413 }, { "age_at_entry": 57, "policy_term": 20, "premium_rate": 0.0005103708972541907 }, { "age_at_entry": 58, "policy_term": 10, "premium_rate": 0.0003338517880231378 }, { "age_at_entry": 58, "policy_term": 15, "premium_rate": 0.000433275832433038 }, { "age_at_entry": 58, "policy_term": 20, "premium_rate": 0.0005568974682123849 }, { "age_at_entry": 59, "policy_term": 10, "premium_rate": 0.0003617481180585639 }, { "age_at_entry": 59, "policy_term": 15, "premium_rate": 0.0004714815275718422 }, { "age_at_entry": 59, "policy_term": 20, "premium_rate": 0.0006085437084252229 }];



//////////////////////////////////// mortality rates: ////////////////////////////////////

export const s2_age_$ = ({ age_in }) => age_in;

export const s2_mort_rate_select_index_$ = ({ mort_rate_select_index_in }) => mort_rate_select_index_in;

export const s2_mort_rate_$ = ({ age_at_entry_in, duration_mth_in, t_in }) => s2_mort_table({}).find((d) => d.Age == s1_age({ age_at_entry_in, duration_mth_in, t_in }))[s1_mort_rate_select_index({ duration_mth_in, t_in })];

export const s2_mort_table$ = ({}) => [{ "0": 0.0002310671048780701, "1": 0.0002541738153658771, "2": 0.0002795911969024648, "3": 0.0003075503165927113, "4": 0.0003383053482519825, "5": 0.0003721358830771808, "Age": 18 }, { "0": 0.0002353200126583699, "1": 0.000258852013924207, "2": 0.0002847372153166277, "3": 0.0003132109368482905, "4": 0.0003445320305331195, "5": 0.0003789852335864315, "Age": 19 }, { "0": 0.0002399363756770145, "1": 0.0002639300132447159, "2": 0.0002903230145691875, "3": 0.0003193553160261063, "4": 0.000351290847628717, "5": 0.0003864199323915887, "Age": 20 }, { "0": 0.000244937423152777, "1": 0.0002694311654680547, "2": 0.0002963742820148602, "3": 0.0003260117102163462, "4": 0.0003586128812379809, "5": 0.000394474169361779, "Age": 21 }, { "0": 0.0002503462740334557, "1": 0.0002753809014368013, "2": 0.0003029189915804814, "3": 0.0003332108907385296, "4": 0.0003665319798123826, "5": 0.0004031851777936208, "Age": 22 }, { "0": 0.0002561881183155183, "1": 0.0002818069301470701, "2": 0.0003099876231617771, "3": 0.0003409863854779549, "4": 0.0003750850240257504, "5": 0.0004125935264283255, "Age": 23 }, { "0": 0.0002624904157144116, "1": 0.0002887394572858528, "2": 0.0003176134030144381, "3": 0.0003493747433158819, "4": 0.0003843122176474701, "5": 0.0004227434394122172, "Age": 24 }, { "0": 0.0002692831139799757, "1": 0.0002962114253779732, "2": 0.0003258325679157706, "3": 0.0003584158247073477, "4": 0.0003942574071780824, "5": 0.0004336831478958907, "Age": 25 }, { "0": 0.0002765988893708184, "1": 0.0003042587783079002, "2": 0.0003346846561386903, "3": 0.0003681531217525593, "4": 0.0004049684339278153, "5": 0.0004454652773205969, "Age": 26 }, { "0": 0.0002844734120632121, "1": 0.0003129207532695333, "2": 0.0003442128285964867, "3": 0.0003786341114561354, "4": 0.000416497522601749, "5": 0.0004581472748619239, "Age": 27 }, { "0": 0.0002929456395766907, "1": 0.0003222402035343598, "2": 0.0003544642238877958, "3": 0.0003899106462765754, "4": 0.000428901710904233, "5": 0.0004717918819946564, "Age": 28 }, { "0": 0.0003020581416539583, "1": 0.0003322639558193541, "2": 0.0003654903514012896, "3": 0.0004020393865414186, "4": 0.0004422433251955605, "5": 0.0004864676577151166, "Age": 29 }, { "0": 0.0003118574604420908, "1": 0.0003430432064863, "2": 0.00037734752713493, "3": 0.000415082279848423, "4": 0.0004565905078332653, "5": 0.0005022495586165919, "Age": 30 }, { "0": 0.0003223945102916596, "1": 0.0003546339613208256, "2": 0.0003900973574529082, "3": 0.0004291070931981991, "4": 0.000472017802518019, "5": 0.000519219582769821, "Age": 31 }, { "0": 0.0003337250220279336, "1": 0.000367097524230727, "2": 0.0004038072766537997, "3": 0.0004441880043191797, "4": 0.0004886068047510977, "5": 0.0005374674852262075, "Age": 32 }, { "0": 0.0003459100371627477, "1": 0.0003805010408790224, "2": 0.0004185511449669247, "3": 0.0004604062594636172, "4": 0.000506446885409979, "5": 0.0005570915739509769, "Age": 33 }, { "0": 0.0003590164582175236, "1": 0.000394918104039276, "2": 0.0004344099144432036, "3": 0.0004778509058875241, "4": 0.0005256359964762765, "5": 0.0005781995961239042, "Age": 34 }, { "0": 0.0003731176621295971, "1": 0.0004104294283425568, "2": 0.0004514723711768126, "3": 0.0004966196082944939, "4": 0.0005462815691239433, "5": 0.0006009097260363377, "Age": 35 }, { "0": 0.0003882941846297993, "1": 0.0004271236030927793, "2": 0.0004698359634020572, "3": 0.000516819559742263, "4": 0.0005685015157164894, "5": 0.0006253516672881384, "Age": 36 }, { "0": 0.0004046344845257716, "1": 0.0004450979329783488, "2": 0.0004896077262761837, "3": 0.0005385684989038021, "4": 0.0005924253487941823, "5": 0.0006516678836736005, "Age": 37 }, { "0": 0.0004222357980220614, "1": 0.0004644593778242676, "2": 0.0005109053156066944, "3": 0.0005619958471673638, "4": 0.0006181954318841003, "5": 0.0006800149750725104, "Age": 38 }, { "0": 0.0004412050945770665, "1": 0.0004853256040347732, "2": 0.0005338581644382506, "3": 0.0005872439808820756, "4": 0.0006459683789702832, "5": 0.0007105652168673116, "Age": 39 }, { "0": 0.0004616601473642979, "1": 0.0005078261621007278, "2": 0.0005586087783108006, "3": 0.0006144696561418807, "4": 0.0006759166217560689, "5": 0.0007435082839316758, "Age": 40 }, { "0": 0.0004837307332014202, "1": 0.0005321038065215623, "2": 0.0005853141871737187, "3": 0.0006438456058910905, "4": 0.0007082301664801996, "5": 0.0007790531831282197, "Age": 41 }, { "0": 0.0005075599788701063, "1": 0.0005583159767571169, "2": 0.0006141475744328287, "3": 0.0006755623318761115, "4": 0.0007431185650637228, "5": 0.0008174304215700951, "Age": 42 }, { "0": 0.0005333058731135947, "1": 0.0005866364604249543, "2": 0.0006453001064674498, "3": 0.0007098301171141948, "4": 0.0007808131288256143, "5": 0.0008588944417081758, "Age": 43 }, { "0": 0.0005611429663144072, "1": 0.000617257262945848, "2": 0.0006789829892404329, "3": 0.0007468812881644762, "4": 0.0008215694169809239, "5": 0.0009037263586790164, "Age": 44 }, { "0": 0.0005912642829769909, "1": 0.00065039071127469, "2": 0.0007154297824021591, "3": 0.0007869727606423751, "4": 0.0008656700367066127, "5": 0.0009522370403772741, "Age": 45 }, { "0": 0.0006238834757334444, "1": 0.0006862718233067889, "2": 0.0007548990056374678, "3": 0.0008303889062012146, "4": 0.0009134277968213361, "5": 0.00100477057650347, "Age": 46 }, { "0": 0.0006592372537298736, "1": 0.000725160979102861, "2": 0.0007976770770131472, "3": 0.0008774447847144619, "4": 0.0009651892631859082, "5": 0.001061708189504499, "Age": 47 }, { "0": 0.0006975881230237241, "1": 0.0007673469353260965, "2": 0.0008440816288587063, "3": 0.000928489791744577, "4": 0.001021338770919035, "5": 0.001123472648010938, "Age": 48 }, { "0": 0.0007392274821309431, "1": 0.0008131502303440375, "2": 0.0008944652533784413, "3": 0.0009839117787162855, "4": 0.001082302956587914, "5": 0.001190533252246706, "Age": 49 }, { "0": 0.0007844791222255886, "1": 0.0008629270344481476, "2": 0.0009492197378929624, "3": 0.001044141711682259, "4": 0.001148555882850485, "5": 0.001263411471135533, "Age": 50 }, { "0": 0.0008337031888533204, "1": 0.0009170735077386526, "2": 0.001008780858512518, "3": 0.00110965894436377, "4": 0.001220624838800147, "5": 0.001342687322680162, "Age": 51 }, { "0": 0.0008873006705383532, "1": 0.0009760307375921886, "2": 0.001073633811351408, "3": 0.001180997192486548, "4": 0.001299096911735203, "5": 0.001429006602908724, "Age": 52 }, { "0": 0.0009457184895330499, "1": 0.001040290338486355, "2": 0.001144319372334991, "3": 0.00125875130956849, "4": 0.001384626440525339, "5": 0.001523089084577873, "Age": 53 }, { "0": 0.001009455281406362, "1": 0.001110400809546999, "2": 0.001221440890501699, "3": 0.001343584979551869, "4": 0.001477943477507056, "5": 0.001625737825257762, "Age": 54 }, { "0": 0.00107906796345734, "1": 0.001186974759803075, "2": 0.001305672235783382, "3": 0.00143623945936172, "4": 0.001579863405297893, "5": 0.001737849745827682, "Age": 55 }, { "0": 0.001155179207384984, "1": 0.001270697128123482, "2": 0.00139776684093583, "3": 0.001537543525029414, "4": 0.001691297877532355, "5": 0.001860427665285591, "Age": 56 }, { "0": 0.00123848594961408, "1": 0.001362334544575489, "2": 0.001498567999033038, "3": 0.001648424798936341, "4": 0.001813267278829976, "5": 0.001994594006712974, "Age": 57 }, { "0": 0.001329769093601377, "1": 0.001462746002961515, "2": 0.001609020603257667, "3": 0.001769922663583434, "4": 0.001946914929941777, "5": 0.002141606422935955, "Age": 58 }, { "0": 0.001429904582839669, "1": 0.001572895041123636, "2": 0.001730184545236, "3": 0.0019032029997596, "4": 0.00209352329973556, "5": 0.002302875629709116, "Age": 59 }, { "0": 0.001539876051743219, "1": 0.001693863656917541, "2": 0.001863250022609295, "3": 0.002049575024870224, "4": 0.002254532527357247, "5": 0.002479985780092972, "Age": 60 }, { "0": 0.00166078929485154, "1": 0.001826868224336694, "2": 0.002009555046770363, "3": 0.0022105105514474, "4": 0.00243156160659214, "5": 0.002674717767251354, "Age": 61 }, { "0": 0.001793888833675047, "1": 0.001973277717042552, "2": 0.002170605488746808, "3": 0.002387666037621488, "4": 0.002626432641383637, "5": 0.002889075905522001, "Age": 62 }, { "0": 0.001940576906029566, "1": 0.002134634596632523, "2": 0.002348098056295775, "3": 0.002582907861925353, "4": 0.002841198648117888, "5": 0.003125318512929678, "Age": 63 }, { "0": 0.002102435256054419, "1": 0.002312678781659861, "2": 0.002543946659825847, "3": 0.002798341325808432, "4": 0.003078175458389276, "5": 0.003385993004228204, "Age": 64 }, { "0": 0.002281250165694602, "1": 0.002509375182264062, "2": 0.002760312700490468, "3": 0.003036343970539515, "4": 0.003339978367593467, "5": 0.003673976204352814, "Age": 65 }, { "0": 0.002479041241928696, "1": 0.002726945366121566, "2": 0.002999639902733722, "3": 0.003299603893007094, "4": 0.003629564282307804, "5": 0.003992520710538585, "Age": 66 }, { "0": 0.002698094560439211, "1": 0.002967904016483132, "2": 0.003264694418131445, "3": 0.00359116385994459, "4": 0.003950280245939049, "5": 0.004345308270532955, "Age": 67 }, { "0": 0.002941000868128997, "1": 0.003235100954941897, "2": 0.003558611050436087, "3": 0.003914472155479696, "4": 0.004305919371027666, "5": 0.004736511308130433, "Age": 68 }, { "0": 0.003210699666725728, "1": 0.003531769633398301, "2": 0.003884946596738132, "3": 0.004273441256411946, "4": 0.004700785382053141, "5": 0.005170863920258455, "Age": 69 }, { "0": 0.003510530141071987, "1": 0.003861583155179186, "2": 0.004247741470697105, "3": 0.004672515617766815, "4": 0.005139767179543497, "5": 0.005653743897497847, "Age": 70 }, { "0": 0.003844290062620606, "1": 0.004228719068882667, "2": 0.004651590975770933, "3": 0.005116750073348027, "4": 0.00562842508068283, "5": 0.006191267588751114, "Age": 71 }, { "0": 0.004216303995988054, "1": 0.004637934395586859, "2": 0.005101727835145545, "3": 0.0056119006186601, "4": 0.00617309068052611, "5": 0.006790399748578721, "Age": 72 }, { "0": 0.004631502369963116, "1": 0.005094652606959428, "2": 0.005604117867655371, "3": 0.006164529654420908, "4": 0.006780982619863, "5": 0.007459080881849301, "Age": 73 }, { "0": 0.005095513251082814, "1": 0.005605064576191096, "2": 0.006165571033810205, "3": 0.006782128137191226, "4": 0.00746034095091035, "5": 0.008206375046001385, "Age": 74 }, { "0": 0.00561476898612035, "1": 0.006176245884732386, "2": 0.006793870473205625, "3": 0.007473257520526189, "4": 0.008220583272578809, "5": 0.00904264159983669, "Age": 75 }, { "0": 0.006196630269622466, "1": 0.006816293296584713, "2": 0.007497922626243185, "3": 0.008247714888867504, "4": 0.009072486377754254, "5": 0.00997973501552968, "Age": 76 }, { "0": 0.006849530656051229, "1": 0.007534483721656353, "2": 0.008287932093821988, "3": 0.009116725303204188, "4": 0.01002839783352461, "5": 0.01103123761687707, "Age": 77 }, { "0": 0.0075831450876836, "1": 0.008341459596451961, "2": 0.009175605556097158, "3": 0.01009316611170687, "4": 0.01110248272287756, "5": 0.01221273099516532, "Age": 78 }, { "0": 0.008408586666725113, "1": 0.009249445333397626, "2": 0.01017438986673739, "3": 0.01119182885341113, "4": 0.01231101173875224, "5": 0.01354211291262747, "Age": 79 }, { "0": 0.009338636684281934, "1": 0.01027250035271013, "2": 0.01129975038798114, "3": 0.01242972542677926, "4": 0.01367269796945719, "5": 0.01503996776640291, "Age": 80 }, { "0": 0.01038801385549308, "1": 0.01142681524104239, "2": 0.01256949676514663, "3": 0.01382644644166129, "4": 0.01520909108582742, "5": 0.01673000019441017, "Age": 81 }, { "0": 0.01157368983020542, "1": 0.01273105881322597, "2": 0.01400416469454857, "3": 0.01540458116400342, "4": 0.01694503928040377, "5": 0.01863954320844415, "Age": 82 }, { "0": 0.01291525938959877, "1": 0.01420678532855865, "2": 0.01562746386141452, "3": 0.01719021024755597, "4": 0.01890923127231157, "5": 0.02080015439954273, "Age": 83 }, { "0": 0.01443537534660213, "1": 0.01587891288126235, "2": 0.01746680416938859, "3": 0.01921348458632744, "4": 0.02113483304496019, "5": 0.02324831634945621, "Age": 84 }, { "0": 0.01616026009703804, "1": 0.01777628610674184, "2": 0.01955391471741603, "3": 0.02150930618915763, "4": 0.0236602368080734, "5": 0.02602626048888074, "Age": 85 }, { "0": 0.01812030808631169, "1": 0.01993233889494286, "2": 0.02192557278443714, "3": 0.02411813006288086, "4": 0.02652994306916895, "5": 0.02918293737608585, "Age": 86 }, { "0": 0.02035079624486606, "1": 0.02238587586935267, "2": 0.02462446345628793, "3": 0.02708690980191673, "4": 0.0297956007821084, "5": 0.03277516086031924, "Age": 87 }, { "0": 0.02289272280409473, "1": 0.0251819950845042, "2": 0.02770019459295462, "3": 0.03047021405225009, "4": 0.0335172354574751, "5": 0.03686895900322261, "Age": 88 }, { "0": 0.02579379895447039, "1": 0.02837317884991743, "2": 0.03121049673490918, "3": 0.0343315464084001, "4": 0.03776470104924012, "5": 0.04154117115416413, "Age": 89 }, { "0": 0.0291096226976437, "1": 0.03202058496740807, "2": 0.03522264346414888, "3": 0.03874490781056377, "4": 0.04261939859162015, "5": 0.04688133845078217, "Age": 90 }, { "0": 0.03290507015568574, "1": 0.03619557717125432, "2": 0.03981513488837975, "3": 0.04379664837721773, "4": 0.04817631321493951, "5": 0.05299394453643346, "Age": 91 }, { "0": 0.03725594675567852, "1": 0.04098154143124638, "2": 0.04507969557437102, "3": 0.04958766513180812, "4": 0.05454643164498894, "5": 0.06000107480948783, "Age": 92 }, { "0": 0.04225094937882418, "1": 0.0464760443167066, "2": 0.05112364874837726, "3": 0.05623601362321499, "4": 0.0618596149855365, "5": 0.06804557648409015, "Age": 93 }, { "0": 0.04799400108452031, "1": 0.05279340119297234, "2": 0.05807274131226958, "3": 0.06388001544349654, "4": 0.07026801698784621, "5": 0.07729481868663084, "Age": 94 }, { "0": 0.05460703280218726, "1": 0.06006773608240599, "2": 0.0660745096906466, "3": 0.07268196065971126, "4": 0.0799501567256824, "5": 0.08794517239825064, "Age": 95 }, { "0": 0.06223330193255692, "1": 0.06845663212581261, "2": 0.07530229533839389, "3": 0.08283252487223328, "4": 0.09111577735945661, "5": 0.1002273550954023, "Age": 96 }, { "0": 0.07104135673834143, "1": 0.07814549241217558, "2": 0.08596004165339315, "3": 0.09455604581873246, "4": 0.1040116504006057, "5": 0.1144128154406663, "Age": 97 }, { "0": 0.08122977849975568, "1": 0.08935275634973126, "2": 0.0982880319847044, "3": 0.1081168351831748, "4": 0.1189285187014923, "5": 0.1308213705716416, "Age": 98 }, { "0": 0.09303286161187924, "1": 0.1023361477730672, "2": 0.1125697625503739, "3": 0.1238267388054113, "4": 0.1362094126859524, "5": 0.1498303539545477, "Age": 99 }, { "0": 0.1067274262812674, "1": 0.1174001689093942, "2": 0.1291401858003336, "3": 0.142054204380367, "4": 0.1562596248184037, "5": 0.1718855873002441, "Age": 100 }, { "0": 0.1226410006907388, "1": 0.1349051007598127, "2": 0.1483956108357939, "3": 0.1632351719193733, "4": 0.1795586891113107, "5": 0.1975145580224417, "Age": 101 }, { "0": 0.1411616612443195, "1": 0.1552778273687514, "2": 0.1708056101056266, "3": 0.1878861711161893, "4": 0.2066747882278082, "5": 0.227342267050589, "Age": 102 }, { "0": 0.1627498830132505, "1": 0.1790248713145755, "2": 0.1969273584460331, "3": 0.2166200942906364, "4": 0.2382821037197001, "5": 0.2621103140916701, "Age": 103 }, { "0": 0.1879528305562259, "1": 0.2067481136118486, "2": 0.2274229249730334, "3": 0.2501652174703368, "4": 0.2751817392173705, "5": 0.3026999131391076, "Age": 104 }, { "0": 0.2174216153384464, "1": 0.2391637768722911, "2": 0.2630801545595202, "3": 0.2893881700154723, "4": 0.3183269870170196, "5": 0.3501596857187215, "Age": 105 }, { "0": 0.2519321643307321, "1": 0.2771253807638053, "2": 0.3048379188401859, "3": 0.3353217107242045, "4": 0.3688538817966249, "5": 0.4057392699762875, "Age": 106 }, { "0": 0.2924104904045808, "1": 0.3216515394450389, "2": 0.3538166933895428, "3": 0.3891983627284971, "4": 0.4281181990013468, "5": 0.4709300189014816, "Age": 107 }, { "0": 0.3399633355628309, "1": 0.373959669119114, "2": 0.4113556360310255, "3": 0.4524911996341281, "4": 0.4977403195975409, "5": 0.5475143515572951, "Age": 108 }, { "0": 0.3959153812539035, "1": 0.4355069193792939, "2": 0.4790576113172234, "3": 0.5269633724489458, "4": 0.5796597096938404, "5": 0.6376256806632244, "Age": 109 }, { "0": 0.4618544965251583, "1": 0.5080399461776742, "2": 0.5588439407954418, "3": 0.614728334874986, "4": 0.6762011683624847, "5": 0.7438212851987333, "Age": 110 }, { "0": 0.5396868377647932, "1": 0.5936555215412725, "2": 0.6530210736953999, "3": 0.7183231810649399, "4": 0.7901554991714339, "5": 0.8691710490885773, "Age": 111 }, { "0": 0.6317040398225142, "1": 0.6948744438047657, "2": 0.7643618881852423, "3": 0.8407980770037666, "4": 0.9248778847041433, "5": 1, "Age": 112 }, { "0": 0.7406652682100285, "1": 0.8147317950310314, "2": 0.8962049745341346, "3": 0.9858254719875481, "4": 1, "5": 1, "Age": 113 }, { "0": 0.8698975620835765, "1": 0.9568873182919342, "2": 1, "3": 1, "4": 1, "5": 1, "Age": 114 }, { "0": 1, "1": 1, "2": 1, "3": 1, "4": 1, "5": 1, "Age": 115 }, { "0": 1, "1": 1, "2": 1, "3": 1, "4": 1, "5": 1, "Age": 116 }, { "0": 1, "1": 1, "2": 1, "3": 1, "4": 1, "5": 1, "Age": 117 }, { "0": 1, "1": 1, "2": 1, "3": 1, "4": 1, "5": 1, "Age": 118 }, { "0": 1, "1": 1, "2": 1, "3": 1, "4": 1, "5": 1, "Age": 119 }, { "0": 1, "1": 1, "2": 1, "3": 1, "4": 1, "5": 1, "Age": 120 }];



///////////////////////////////// discounting zero spot rates: /////////////////////////////////

export const s2_zero_spot_year$ = ({ zero_spot_year_in }) => zero_spot_year_in; // year as formula conflicts with simple-loan.cul.js

export const s2_zero_spot$ = ({ zero_spot_year_in }) => s2_disc_rate_ann_table({})[s2_zero_spot_year({ zero_spot_year_in })]?.zero_spot ?? 0;

export const s2_disc_rate_ann_table$ = ({}) => [{ "year": 0, "zero_spot": 0 }, { "year": 1, "zero_spot": 0.00555 }, { "year": 2, "zero_spot": 0.006840000000000001 }, { "year": 3, "zero_spot": 0.00788 }, { "year": 4, "zero_spot": 0.00866 }, { "year": 5, "zero_spot": 0.00937 }, { "year": 6, "zero_spot": 0.00997 }, { "year": 7, "zero_spot": 0.0105 }, { "year": 8, "zero_spot": 0.01098 }, { "year": 9, "zero_spot": 0.01144 }, { "year": 10, "zero_spot": 0.01188 }, { "year": 11, "zero_spot": 0.01226 }, { "year": 12, "zero_spot": 0.01259 }, { "year": 13, "zero_spot": 0.01285 }, { "year": 14, "zero_spot": 0.01308 }, { "year": 15, "zero_spot": 0.0133 }, { "year": 16, "zero_spot": 0.01345 }, { "year": 17, "zero_spot": 0.01358 }, { "year": 18, "zero_spot": 0.01368 }, { "year": 19, "zero_spot": 0.01375 }, { "year": 20, "zero_spot": 0.01378 }, { "year": 21, "zero_spot": 0.01379 }, { "year": 22, "zero_spot": 0.01376 }, { "year": 23, "zero_spot": 0.01373 }, { "year": 24, "zero_spot": 0.01369 }, { "year": 25, "zero_spot": 0.01365 }, { "year": 26, "zero_spot": 0.01361 }, { "year": 27, "zero_spot": 0.01356 }, { "year": 28, "zero_spot": 0.01351 }, { "year": 29, "zero_spot": 0.01346 }, { "year": 30, "zero_spot": 0.0134 }, { "year": 31, "zero_spot": 0.01333 }, { "year": 32, "zero_spot": 0.01325 }, { "year": 33, "zero_spot": 0.01316 }, { "year": 34, "zero_spot": 0.01306 }, { "year": 35, "zero_spot": 0.01295 }, { "year": 36, "zero_spot": 0.01283 }, { "year": 37, "zero_spot": 0.01271 }, { "year": 38, "zero_spot": 0.0126 }, { "year": 39, "zero_spot": 0.0125 }, { "year": 40, "zero_spot": 0.01241 }, { "year": 41, "zero_spot": 0.01235 }, { "year": 42, "zero_spot": 0.01229 }, { "year": 43, "zero_spot": 0.01222 }, { "year": 44, "zero_spot": 0.01214 }, { "year": 45, "zero_spot": 0.01203 }, { "year": 46, "zero_spot": 0.0119 }, { "year": 47, "zero_spot": 0.01178 }, { "year": 48, "zero_spot": 0.01168 }, { "year": 49, "zero_spot": 0.01164 }, { "year": 50, "zero_spot": 0.01166 }, { "year": 51, "zero_spot": 0.01177 }, { "year": 52, "zero_spot": 0.01193 }, { "year": 53, "zero_spot": 0.01215 }, { "year": 54, "zero_spot": 0.01241 }, { "year": 55, "zero_spot": 0.0127 }, { "year": 56, "zero_spot": 0.01301 }, { "year": 57, "zero_spot": 0.01333 }, { "year": 58, "zero_spot": 0.01367 }, { "year": 59, "zero_spot": 0.01402 }, { "year": 60, "zero_spot": 0.01437 }, { "year": 61, "zero_spot": 0.01473 }, { "year": 62, "zero_spot": 0.01508 }, { "year": 63, "zero_spot": 0.01543 }, { "year": 64, "zero_spot": 0.01579 }, { "year": 65, "zero_spot": 0.01613 }, { "year": 66, "zero_spot": 0.01648 }, { "year": 67, "zero_spot": 0.01682 }, { "year": 68, "zero_spot": 0.01715 }, { "year": 69, "zero_spot": 0.01748 }, { "year": 70, "zero_spot": 0.0178 }, { "year": 71, "zero_spot": 0.01812 }, { "year": 72, "zero_spot": 0.01843 }, { "year": 73, "zero_spot": 0.01874 }, { "year": 74, "zero_spot": 0.01903 }, { "year": 75, "zero_spot": 0.01933 }, { "year": 76, "zero_spot": 0.01961 }, { "year": 77, "zero_spot": 0.01989 }, { "year": 78, "zero_spot": 0.02016 }, { "year": 79, "zero_spot": 0.02043 }, { "year": 80, "zero_spot": 0.02069 }, { "year": 81, "zero_spot": 0.02095 }, { "year": 82, "zero_spot": 0.0212 }, { "year": 83, "zero_spot": 0.02144 }, { "year": 84, "zero_spot": 0.02168 }, { "year": 85, "zero_spot": 0.02192 }, { "year": 86, "zero_spot": 0.02215 }, { "year": 87, "zero_spot": 0.02237 }, { "year": 88, "zero_spot": 0.02259 }, { "year": 89, "zero_spot": 0.0228 }, { "year": 90, "zero_spot": 0.02301 }, { "year": 91, "zero_spot": 0.02322 }, { "year": 92, "zero_spot": 0.02342 }, { "year": 93, "zero_spot": 0.02362 }, { "year": 94, "zero_spot": 0.02381 }, { "year": 95, "zero_spot": 0.024 }, { "year": 96, "zero_spot": 0.02419 }, { "year": 97, "zero_spot": 0.02437 }, { "year": 98, "zero_spot": 0.02455 }, { "year": 99, "zero_spot": 0.02472 }, { "year": 100, "zero_spot": 0.02489 }, { "year": 101, "zero_spot": 0.02506 }, { "year": 102, "zero_spot": 0.02522 }, { "year": 103, "zero_spot": 0.02539 }, { "year": 104, "zero_spot": 0.02554 }, { "year": 105, "zero_spot": 0.0257 }, { "year": 106, "zero_spot": 0.02585 }, { "year": 107, "zero_spot": 0.026 }, { "year": 108, "zero_spot": 0.02615 }, { "year": 109, "zero_spot": 0.02629 }, { "year": 110, "zero_spot": 0.02643 }, { "year": 111, "zero_spot": 0.02657 }, { "year": 112, "zero_spot": 0.02671 }, { "year": 113, "zero_spot": 0.02684 }, { "year": 114, "zero_spot": 0.02698 }, { "year": 115, "zero_spot": 0.02711 }, { "year": 116, "zero_spot": 0.02723 }, { "year": 117, "zero_spot": 0.02736 }, { "year": 118, "zero_spot": 0.02748 }, { "year": 119, "zero_spot": 0.0276 }, { "year": 120, "zero_spot": 0.02772 }, { "year": 121, "zero_spot": 0.02784 }, { "year": 122, "zero_spot": 0.02795 }, { "year": 123, "zero_spot": 0.02807 }, { "year": 124, "zero_spot": 0.02818 }, { "year": 125, "zero_spot": 0.02829 }, { "year": 126, "zero_spot": 0.0284 }, { "year": 127, "zero_spot": 0.0285 }, { "year": 128, "zero_spot": 0.02861000000000001 }, { "year": 129, "zero_spot": 0.02871000000000001 }, { "year": 130, "zero_spot": 0.02881 }, { "year": 131, "zero_spot": 0.02891 }, { "year": 132, "zero_spot": 0.02901 }, { "year": 133, "zero_spot": 0.02911000000000001 }, { "year": 134, "zero_spot": 0.0292 }, { "year": 135, "zero_spot": 0.0293 }, { "year": 136, "zero_spot": 0.02939 }, { "year": 137, "zero_spot": 0.02948000000000001 }, { "year": 138, "zero_spot": 0.02957 }, { "year": 139, "zero_spot": 0.02966 }, { "year": 140, "zero_spot": 0.02975 }, { "year": 141, "zero_spot": 0.02984 }, { "year": 142, "zero_spot": 0.02992 }, { "year": 143, "zero_spot": 0.03001 }, { "year": 144, "zero_spot": 0.03009 }, { "year": 145, "zero_spot": 0.03017 }, { "year": 146, "zero_spot": 0.03025 }, { "year": 147, "zero_spot": 0.03033000000000001 }, { "year": 148, "zero_spot": 0.03041000000000001 }, { "year": 149, "zero_spot": 0.03049 }, { "year": 150, "zero_spot": 0.03056000000000001 }];


export const s0_commission_mths$m = memoize(s0_commission_mths$, ({commission_mths_in}) => Object.values(({commission_mths_in})).toString()); 
export const s0_commission_mths = ({commission_mths_in}) => s0_commission_mths$m({commission_mths_in})
model['s0_commission_mths'] = s0_commission_mths

export const s0_commission_pc$m = memoize(s0_commission_pc$, ({commission_pc_in}) => Object.values(({commission_pc_in})).toString()); 
export const s0_commission_pc = ({commission_pc_in}) => s0_commission_pc$m({commission_pc_in})
model['s0_commission_pc'] = s0_commission_pc

export const s0_lapse_rate_factor_delay$m = memoize(s0_lapse_rate_factor_delay$, ({stress_delay_in}) => Object.values(({stress_delay_in})).toString()); 
export const s0_lapse_rate_factor_delay = ({stress_delay_in}) => s0_lapse_rate_factor_delay$m({stress_delay_in})
model['s0_lapse_rate_factor_delay'] = s0_lapse_rate_factor_delay

export const s0_lapse_rate_factor$m = memoize(s0_lapse_rate_factor$, ({lapse_rate_factor_in}) => Object.values(({lapse_rate_factor_in})).toString()); 
export const s0_lapse_rate_factor = ({lapse_rate_factor_in}) => s0_lapse_rate_factor$m({lapse_rate_factor_in})
model['s0_lapse_rate_factor'] = s0_lapse_rate_factor

export const s0_original_lapse_rates$m = memoize(s0_original_lapse_rates$, ({original_lapse_rates_in}) => Object.values(({original_lapse_rates_in})).toString()); 
export const s0_original_lapse_rates = ({original_lapse_rates_in}) => s0_original_lapse_rates$m({original_lapse_rates_in})
model['s0_original_lapse_rates'] = s0_original_lapse_rates

export const s0_lapse_rate$m = memoize(s0_lapse_rate$, ({t_in, stress_delay_in, original_lapse_rates_in, duration_mth_in, lapse_rate_factor_in}) => Object.values(({t_in, stress_delay_in, original_lapse_rates_in, duration_mth_in, lapse_rate_factor_in})).toString()); 
export const s0_lapse_rate = ({t_in, stress_delay_in, original_lapse_rates_in, duration_mth_in, lapse_rate_factor_in}) => s0_lapse_rate$m({t_in, stress_delay_in, original_lapse_rates_in, duration_mth_in, lapse_rate_factor_in})
model['s0_lapse_rate'] = s0_lapse_rate

export const s0_inflation_rate_addition$m = memoize(s0_inflation_rate_addition$, ({inflation_rate_addition_in}) => Object.values(({inflation_rate_addition_in})).toString()); 
export const s0_inflation_rate_addition = ({inflation_rate_addition_in}) => s0_inflation_rate_addition$m({inflation_rate_addition_in})
model['s0_inflation_rate_addition'] = s0_inflation_rate_addition

export const s0_inflation_rate$m = memoize(s0_inflation_rate$, ({t_in, stress_delay_in, inflation_rate_in, inflation_rate_addition_in}) => Object.values(({t_in, stress_delay_in, inflation_rate_in, inflation_rate_addition_in})).toString()); 
export const s0_inflation_rate = ({t_in, stress_delay_in, inflation_rate_in, inflation_rate_addition_in}) => s0_inflation_rate$m({t_in, stress_delay_in, inflation_rate_in, inflation_rate_addition_in})
model['s0_inflation_rate'] = s0_inflation_rate

export const s0_expenses_factor$m = memoize(s0_expenses_factor$, ({expenses_factor_in}) => Object.values(({expenses_factor_in})).toString()); 
export const s0_expenses_factor = ({expenses_factor_in}) => s0_expenses_factor$m({expenses_factor_in})
model['s0_expenses_factor'] = s0_expenses_factor

export const s0_expense_maint$m = memoize(s0_expense_maint$, ({t_in, stress_delay_in, expense_maint_in, expenses_factor_in}) => Object.values(({t_in, stress_delay_in, expense_maint_in, expenses_factor_in})).toString()); 
export const s0_expense_maint = ({t_in, stress_delay_in, expense_maint_in, expenses_factor_in}) => s0_expense_maint$m({t_in, stress_delay_in, expense_maint_in, expenses_factor_in})
model['s0_expense_maint'] = s0_expense_maint

export const s0_expense_acq$m = memoize(s0_expense_acq$, ({t_in, stress_delay_in, expense_acq_in, expenses_factor_in}) => Object.values(({t_in, stress_delay_in, expense_acq_in, expenses_factor_in})).toString()); 
export const s0_expense_acq = ({t_in, stress_delay_in, expense_acq_in, expenses_factor_in}) => s0_expense_acq$m({t_in, stress_delay_in, expense_acq_in, expenses_factor_in})
model['s0_expense_acq'] = s0_expense_acq

export const s0_stress_delay$m = memoize(s0_stress_delay$, ({stress_delay_in}) => Object.values(({stress_delay_in})).toString()); 
export const s0_stress_delay = ({stress_delay_in}) => s0_stress_delay$m({stress_delay_in})
model['s0_stress_delay'] = s0_stress_delay

export const s0_mort_rate_factor_delay$m = memoize(s0_mort_rate_factor_delay$, ({stress_delay_in}) => Object.values(({stress_delay_in})).toString()); 
export const s0_mort_rate_factor_delay = ({stress_delay_in}) => s0_mort_rate_factor_delay$m({stress_delay_in})
model['s0_mort_rate_factor_delay'] = s0_mort_rate_factor_delay

export const s0_mort_rate_factor$m = memoize(s0_mort_rate_factor$, ({mort_rate_factor_in}) => Object.values(({mort_rate_factor_in})).toString()); 
export const s0_mort_rate_factor = ({mort_rate_factor_in}) => s0_mort_rate_factor$m({mort_rate_factor_in})
model['s0_mort_rate_factor'] = s0_mort_rate_factor

export const s0_mort_rate_Y1_add_per_mille$m = memoize(s0_mort_rate_Y1_add_per_mille$, ({mort_rate_Y1_add_per_mille_in}) => Object.values(({mort_rate_Y1_add_per_mille_in})).toString()); 
export const s0_mort_rate_Y1_add_per_mille = ({mort_rate_Y1_add_per_mille_in}) => s0_mort_rate_Y1_add_per_mille$m({mort_rate_Y1_add_per_mille_in})
model['s0_mort_rate_Y1_add_per_mille'] = s0_mort_rate_Y1_add_per_mille

export const s0_mort_rate_addition$m = memoize(s0_mort_rate_addition$, ({t_in, stress_delay_in, mort_rate_Y1_add_per_mille_in}) => Object.values(({t_in, stress_delay_in, mort_rate_Y1_add_per_mille_in})).toString()); 
export const s0_mort_rate_addition = ({t_in, stress_delay_in, mort_rate_Y1_add_per_mille_in}) => s0_mort_rate_addition$m({t_in, stress_delay_in, mort_rate_Y1_add_per_mille_in})
model['s0_mort_rate_addition'] = s0_mort_rate_addition

export const s0_loading_prem$m = memoize(s0_loading_prem$, ({loading_prem_in}) => Object.values(({loading_prem_in})).toString()); 
export const s0_loading_prem = ({loading_prem_in}) => s0_loading_prem$m({loading_prem_in})
model['s0_loading_prem'] = s0_loading_prem

export const s0_gender_neutral_pricing$m = memoize(s0_gender_neutral_pricing$, ({gender_neutral_pricing_in}) => Object.values(({gender_neutral_pricing_in})).toString()); 
export const s0_gender_neutral_pricing = ({gender_neutral_pricing_in}) => s0_gender_neutral_pricing$m({gender_neutral_pricing_in})
model['s0_gender_neutral_pricing'] = s0_gender_neutral_pricing

export const s0_update_pricing_lapse_rates$m = memoize(s0_update_pricing_lapse_rates$, ({update_pricing_lapse_rates_in}) => Object.values(({update_pricing_lapse_rates_in})).toString()); 
export const s0_update_pricing_lapse_rates = ({update_pricing_lapse_rates_in}) => s0_update_pricing_lapse_rates$m({update_pricing_lapse_rates_in})
model['s0_update_pricing_lapse_rates'] = s0_update_pricing_lapse_rates

export const s0_pricing_projection$m = memoize(s0_pricing_projection$, ({pricing_projection_in}) => Object.values(({pricing_projection_in})).toString()); 
export const s0_pricing_projection = ({pricing_projection_in}) => s0_pricing_projection$m({pricing_projection_in})
model['s0_pricing_projection'] = s0_pricing_projection

export const s0_net_premium_pp$m = memoize(s0_net_premium_pp$, ({pricing_projection_in, policy_term_in, sum_assured_in, timing_in, policy_count_in, zero_decrement_experience_in, stress_delay_in, original_lapse_rates_in, lapse_rate_factor_in, age_at_entry_in, sex_in, mort_rate_factor_in, mort_rate_Y1_add_per_mille_in, discounting_on_in, zero_spot_year_in, premium_payment_frequency_in, update_pricing_lapse_rates_in, gender_neutral_pricing_in}) => Object.values(({pricing_projection_in, policy_term_in, sum_assured_in, timing_in, policy_count_in, zero_decrement_experience_in, stress_delay_in, original_lapse_rates_in, lapse_rate_factor_in, age_at_entry_in, sex_in, mort_rate_factor_in, mort_rate_Y1_add_per_mille_in, discounting_on_in, zero_spot_year_in, premium_payment_frequency_in, update_pricing_lapse_rates_in, gender_neutral_pricing_in})).toString()); 
export const s0_net_premium_pp = ({pricing_projection_in, policy_term_in, sum_assured_in, timing_in, policy_count_in, zero_decrement_experience_in, stress_delay_in, original_lapse_rates_in, lapse_rate_factor_in, age_at_entry_in, sex_in, mort_rate_factor_in, mort_rate_Y1_add_per_mille_in, discounting_on_in, zero_spot_year_in, premium_payment_frequency_in, update_pricing_lapse_rates_in, gender_neutral_pricing_in}) => s0_net_premium_pp$m({pricing_projection_in, policy_term_in, sum_assured_in, timing_in, policy_count_in, zero_decrement_experience_in, stress_delay_in, original_lapse_rates_in, lapse_rate_factor_in, age_at_entry_in, sex_in, mort_rate_factor_in, mort_rate_Y1_add_per_mille_in, discounting_on_in, zero_spot_year_in, premium_payment_frequency_in, update_pricing_lapse_rates_in, gender_neutral_pricing_in})
model['s0_net_premium_pp'] = s0_net_premium_pp

export const s0_premium_rate_per_mille$m = memoize(s0_premium_rate_per_mille$, ({loading_prem_in, policy_term_in, sum_assured_in, timing_in, policy_count_in, zero_decrement_experience_in, stress_delay_in, original_lapse_rates_in, lapse_rate_factor_in, age_at_entry_in, sex_in, mort_rate_factor_in, mort_rate_Y1_add_per_mille_in, discounting_on_in, zero_spot_year_in, premium_payment_frequency_in, update_pricing_lapse_rates_in, gender_neutral_pricing_in}) => Object.values(({loading_prem_in, policy_term_in, sum_assured_in, timing_in, policy_count_in, zero_decrement_experience_in, stress_delay_in, original_lapse_rates_in, lapse_rate_factor_in, age_at_entry_in, sex_in, mort_rate_factor_in, mort_rate_Y1_add_per_mille_in, discounting_on_in, zero_spot_year_in, premium_payment_frequency_in, update_pricing_lapse_rates_in, gender_neutral_pricing_in})).toString()); 
export const s0_premium_rate_per_mille = ({loading_prem_in, policy_term_in, sum_assured_in, timing_in, policy_count_in, zero_decrement_experience_in, stress_delay_in, original_lapse_rates_in, lapse_rate_factor_in, age_at_entry_in, sex_in, mort_rate_factor_in, mort_rate_Y1_add_per_mille_in, discounting_on_in, zero_spot_year_in, premium_payment_frequency_in, update_pricing_lapse_rates_in, gender_neutral_pricing_in}) => s0_premium_rate_per_mille$m({loading_prem_in, policy_term_in, sum_assured_in, timing_in, policy_count_in, zero_decrement_experience_in, stress_delay_in, original_lapse_rates_in, lapse_rate_factor_in, age_at_entry_in, sex_in, mort_rate_factor_in, mort_rate_Y1_add_per_mille_in, discounting_on_in, zero_spot_year_in, premium_payment_frequency_in, update_pricing_lapse_rates_in, gender_neutral_pricing_in})
model['s0_premium_rate_per_mille'] = s0_premium_rate_per_mille

export const s0_pv_pols_if$m = memoize(s0_pv_pols_if$, ({duration_mth_in, t_in, policy_term_in, timing_in, policy_count_in, zero_decrement_experience_in, stress_delay_in, age_at_entry_in, sex_in, mort_rate_factor_in, mort_rate_Y1_add_per_mille_in, original_lapse_rates_in, lapse_rate_factor_in, discounting_on_in, premium_payment_frequency_in}) => Object.values(({duration_mth_in, t_in, policy_term_in, timing_in, policy_count_in, zero_decrement_experience_in, stress_delay_in, age_at_entry_in, sex_in, mort_rate_factor_in, mort_rate_Y1_add_per_mille_in, original_lapse_rates_in, lapse_rate_factor_in, discounting_on_in, premium_payment_frequency_in})).toString()); 
export const s0_pv_pols_if = ({duration_mth_in, t_in, policy_term_in, timing_in, policy_count_in, zero_decrement_experience_in, stress_delay_in, age_at_entry_in, sex_in, mort_rate_factor_in, mort_rate_Y1_add_per_mille_in, original_lapse_rates_in, lapse_rate_factor_in, discounting_on_in, premium_payment_frequency_in}) => s0_pv_pols_if$m({duration_mth_in, t_in, policy_term_in, timing_in, policy_count_in, zero_decrement_experience_in, stress_delay_in, age_at_entry_in, sex_in, mort_rate_factor_in, mort_rate_Y1_add_per_mille_in, original_lapse_rates_in, lapse_rate_factor_in, discounting_on_in, premium_payment_frequency_in})
model['s0_pv_pols_if'] = s0_pv_pols_if

export const s0_premium_payment_frequency$m = memoize(s0_premium_payment_frequency$, ({premium_payment_frequency_in}) => Object.values(({premium_payment_frequency_in})).toString()); 
export const s0_premium_payment_frequency = ({premium_payment_frequency_in}) => s0_premium_payment_frequency$m({premium_payment_frequency_in})
model['s0_premium_payment_frequency'] = s0_premium_payment_frequency

export const s0_premium_period$m = memoize(s0_premium_period$, ({premium_payment_frequency_in}) => Object.values(({premium_payment_frequency_in})).toString()); 
export const s0_premium_period = ({premium_payment_frequency_in}) => s0_premium_period$m({premium_payment_frequency_in})
model['s0_premium_period'] = s0_premium_period

export const s0_premium_due$m = memoize(s0_premium_due$, ({premium_payment_frequency_in, t_in, duration_mth_in}) => Object.values(({premium_payment_frequency_in, t_in, duration_mth_in})).toString()); 
export const s0_premium_due = ({premium_payment_frequency_in, t_in, duration_mth_in}) => s0_premium_due$m({premium_payment_frequency_in, t_in, duration_mth_in})
model['s0_premium_due'] = s0_premium_due

export const s0_premium_pp$m = memoize(s0_premium_pp$, ({premium_payment_frequency_in, t_in, duration_mth_in, sum_assured_in, loading_prem_in, policy_term_in, timing_in, policy_count_in, zero_decrement_experience_in, stress_delay_in, original_lapse_rates_in, lapse_rate_factor_in, age_at_entry_in, sex_in, mort_rate_factor_in, mort_rate_Y1_add_per_mille_in, discounting_on_in, zero_spot_year_in, update_pricing_lapse_rates_in, gender_neutral_pricing_in}) => Object.values(({premium_payment_frequency_in, t_in, duration_mth_in, sum_assured_in, loading_prem_in, policy_term_in, timing_in, policy_count_in, zero_decrement_experience_in, stress_delay_in, original_lapse_rates_in, lapse_rate_factor_in, age_at_entry_in, sex_in, mort_rate_factor_in, mort_rate_Y1_add_per_mille_in, discounting_on_in, zero_spot_year_in, update_pricing_lapse_rates_in, gender_neutral_pricing_in})).toString()); 
export const s0_premium_pp = ({premium_payment_frequency_in, t_in, duration_mth_in, sum_assured_in, loading_prem_in, policy_term_in, timing_in, policy_count_in, zero_decrement_experience_in, stress_delay_in, original_lapse_rates_in, lapse_rate_factor_in, age_at_entry_in, sex_in, mort_rate_factor_in, mort_rate_Y1_add_per_mille_in, discounting_on_in, zero_spot_year_in, update_pricing_lapse_rates_in, gender_neutral_pricing_in}) => s0_premium_pp$m({premium_payment_frequency_in, t_in, duration_mth_in, sum_assured_in, loading_prem_in, policy_term_in, timing_in, policy_count_in, zero_decrement_experience_in, stress_delay_in, original_lapse_rates_in, lapse_rate_factor_in, age_at_entry_in, sex_in, mort_rate_factor_in, mort_rate_Y1_add_per_mille_in, discounting_on_in, zero_spot_year_in, update_pricing_lapse_rates_in, gender_neutral_pricing_in})
model['s0_premium_pp'] = s0_premium_pp

export const s0_a$m = memoize(s0_a$, ({}) => Object.values(({})).toString()); 
export const s0_a = ({}) => s0_a$m({})
model['s0_a'] = s0_a

export const s0_b$m = memoize(s0_b$, ({}) => Object.values(({})).toString()); 
export const s0_b = ({}) => s0_b$m({})
model['s0_b'] = s0_b

export const s0_c$m = memoize(s0_c$, ({}) => Object.values(({})).toString()); 
export const s0_c = ({}) => s0_c$m({})
model['s0_c'] = s0_c

export const s0_mort_rate_recalc$m = memoize(s0_mort_rate_recalc$, ({age_at_entry_in, duration_mth_in, t_in, sex_in}) => Object.values(({age_at_entry_in, duration_mth_in, t_in, sex_in})).toString()); 
export const s0_mort_rate_recalc = ({age_at_entry_in, duration_mth_in, t_in, sex_in}) => s0_mort_rate_recalc$m({age_at_entry_in, duration_mth_in, t_in, sex_in})
model['s0_mort_rate_recalc'] = s0_mort_rate_recalc

export const s0_mort_rate$m = memoize(s0_mort_rate$, ({t_in, stress_delay_in, age_at_entry_in, duration_mth_in, sex_in, mort_rate_factor_in, mort_rate_Y1_add_per_mille_in}) => Object.values(({t_in, stress_delay_in, age_at_entry_in, duration_mth_in, sex_in, mort_rate_factor_in, mort_rate_Y1_add_per_mille_in})).toString()); 
export const s0_mort_rate = ({t_in, stress_delay_in, age_at_entry_in, duration_mth_in, sex_in, mort_rate_factor_in, mort_rate_Y1_add_per_mille_in}) => s0_mort_rate$m({t_in, stress_delay_in, age_at_entry_in, duration_mth_in, sex_in, mort_rate_factor_in, mort_rate_Y1_add_per_mille_in})
model['s0_mort_rate'] = s0_mort_rate

export const s0_discounting_on$m = memoize(s0_discounting_on$, ({discounting_on_in}) => Object.values(({discounting_on_in})).toString()); 
export const s0_discounting_on = ({discounting_on_in}) => s0_discounting_on$m({discounting_on_in})
model['s0_discounting_on'] = s0_discounting_on

export const s0_disc_rate_ann$m = memoize(s0_disc_rate_ann$, ({discounting_on_in, t_in}) => Object.values(({discounting_on_in, t_in})).toString()); 
export const s0_disc_rate_ann = ({discounting_on_in, t_in}) => s0_disc_rate_ann$m({discounting_on_in, t_in})
model['s0_disc_rate_ann'] = s0_disc_rate_ann

export const s0_premium_pp_0$m = memoize(s0_premium_pp_0$, ({premium_payment_frequency_in, duration_mth_in, sum_assured_in, loading_prem_in, policy_term_in, timing_in, policy_count_in, zero_decrement_experience_in, stress_delay_in, original_lapse_rates_in, lapse_rate_factor_in, age_at_entry_in, sex_in, mort_rate_factor_in, mort_rate_Y1_add_per_mille_in, discounting_on_in, zero_spot_year_in, update_pricing_lapse_rates_in, gender_neutral_pricing_in}) => Object.values(({premium_payment_frequency_in, duration_mth_in, sum_assured_in, loading_prem_in, policy_term_in, timing_in, policy_count_in, zero_decrement_experience_in, stress_delay_in, original_lapse_rates_in, lapse_rate_factor_in, age_at_entry_in, sex_in, mort_rate_factor_in, mort_rate_Y1_add_per_mille_in, discounting_on_in, zero_spot_year_in, update_pricing_lapse_rates_in, gender_neutral_pricing_in})).toString()); 
export const s0_premium_pp_0 = ({premium_payment_frequency_in, duration_mth_in, sum_assured_in, loading_prem_in, policy_term_in, timing_in, policy_count_in, zero_decrement_experience_in, stress_delay_in, original_lapse_rates_in, lapse_rate_factor_in, age_at_entry_in, sex_in, mort_rate_factor_in, mort_rate_Y1_add_per_mille_in, discounting_on_in, zero_spot_year_in, update_pricing_lapse_rates_in, gender_neutral_pricing_in}) => s0_premium_pp_0$m({premium_payment_frequency_in, duration_mth_in, sum_assured_in, loading_prem_in, policy_term_in, timing_in, policy_count_in, zero_decrement_experience_in, stress_delay_in, original_lapse_rates_in, lapse_rate_factor_in, age_at_entry_in, sex_in, mort_rate_factor_in, mort_rate_Y1_add_per_mille_in, discounting_on_in, zero_spot_year_in, update_pricing_lapse_rates_in, gender_neutral_pricing_in})
model['s0_premium_pp_0'] = s0_premium_pp_0

export const s0_status$m = memoize(s0_status$, ({duration_mth_in}) => Object.values(({duration_mth_in})).toString()); 
export const s0_status = ({duration_mth_in}) => s0_status$m({duration_mth_in})
model['s0_status'] = s0_status

export const s0_net_cf$m = memoize(s0_net_cf$, ({premium_payment_frequency_in, t_in, duration_mth_in, sum_assured_in, loading_prem_in, policy_term_in, timing_in, policy_count_in, zero_decrement_experience_in, stress_delay_in, original_lapse_rates_in, lapse_rate_factor_in, age_at_entry_in, sex_in, mort_rate_factor_in, mort_rate_Y1_add_per_mille_in, discounting_on_in, zero_spot_year_in, update_pricing_lapse_rates_in, gender_neutral_pricing_in, expense_acq_in, expenses_factor_in, expense_maint_in, inflation_rate_in, inflation_rate_addition_in, commission_mths_in, commission_pc_in}) => Object.values(({premium_payment_frequency_in, t_in, duration_mth_in, sum_assured_in, loading_prem_in, policy_term_in, timing_in, policy_count_in, zero_decrement_experience_in, stress_delay_in, original_lapse_rates_in, lapse_rate_factor_in, age_at_entry_in, sex_in, mort_rate_factor_in, mort_rate_Y1_add_per_mille_in, discounting_on_in, zero_spot_year_in, update_pricing_lapse_rates_in, gender_neutral_pricing_in, expense_acq_in, expenses_factor_in, expense_maint_in, inflation_rate_in, inflation_rate_addition_in, commission_mths_in, commission_pc_in})).toString()); 
export const s0_net_cf = ({premium_payment_frequency_in, t_in, duration_mth_in, sum_assured_in, loading_prem_in, policy_term_in, timing_in, policy_count_in, zero_decrement_experience_in, stress_delay_in, original_lapse_rates_in, lapse_rate_factor_in, age_at_entry_in, sex_in, mort_rate_factor_in, mort_rate_Y1_add_per_mille_in, discounting_on_in, zero_spot_year_in, update_pricing_lapse_rates_in, gender_neutral_pricing_in, expense_acq_in, expenses_factor_in, expense_maint_in, inflation_rate_in, inflation_rate_addition_in, commission_mths_in, commission_pc_in}) => s0_net_cf$m({premium_payment_frequency_in, t_in, duration_mth_in, sum_assured_in, loading_prem_in, policy_term_in, timing_in, policy_count_in, zero_decrement_experience_in, stress_delay_in, original_lapse_rates_in, lapse_rate_factor_in, age_at_entry_in, sex_in, mort_rate_factor_in, mort_rate_Y1_add_per_mille_in, discounting_on_in, zero_spot_year_in, update_pricing_lapse_rates_in, gender_neutral_pricing_in, expense_acq_in, expenses_factor_in, expense_maint_in, inflation_rate_in, inflation_rate_addition_in, commission_mths_in, commission_pc_in})
model['s0_net_cf'] = s0_net_cf

export const s0_placeholder$m = memoize(s0_placeholder$, ({}) => Object.values(({})).toString()); 
export const s0_placeholder = ({}) => s0_placeholder$m({})
model['s0_placeholder'] = s0_placeholder

export const s0_placeholder2$m = memoize(s0_placeholder2$, ({}) => Object.values(({})).toString()); 
export const s0_placeholder2 = ({}) => s0_placeholder2$m({})
model['s0_placeholder2'] = s0_placeholder2

export const s0_pv_placeholder$m = memoize(s0_pv_placeholder$, ({discounting_on_in, t_in}) => Object.values(({discounting_on_in, t_in})).toString()); 
export const s0_pv_placeholder = ({discounting_on_in, t_in}) => s0_pv_placeholder$m({discounting_on_in, t_in})
model['s0_pv_placeholder'] = s0_pv_placeholder

export const s0_pv_placeholder2$m = memoize(s0_pv_placeholder2$, ({discounting_on_in, t_in}) => Object.values(({discounting_on_in, t_in})).toString()); 
export const s0_pv_placeholder2 = ({discounting_on_in, t_in}) => s0_pv_placeholder2$m({discounting_on_in, t_in})
model['s0_pv_placeholder2'] = s0_pv_placeholder2

export const s0_policy_value$m = memoize(s0_policy_value$, ({policy_term_in, duration_mth_in, premium_payment_frequency_in, sum_assured_in, loading_prem_in, pricing_projection_in, timing_in, policy_count_in, zero_decrement_experience_in, stress_delay_in, original_lapse_rates_in, lapse_rate_factor_in, age_at_entry_in, sex_in, mort_rate_factor_in, mort_rate_Y1_add_per_mille_in, discounting_on_in, zero_spot_year_in, update_pricing_lapse_rates_in, gender_neutral_pricing_in, expense_acq_in, expenses_factor_in, expense_maint_in, inflation_rate_in, inflation_rate_addition_in, commission_mths_in, commission_pc_in}) => Object.values(({policy_term_in, duration_mth_in, premium_payment_frequency_in, sum_assured_in, loading_prem_in, pricing_projection_in, timing_in, policy_count_in, zero_decrement_experience_in, stress_delay_in, original_lapse_rates_in, lapse_rate_factor_in, age_at_entry_in, sex_in, mort_rate_factor_in, mort_rate_Y1_add_per_mille_in, discounting_on_in, zero_spot_year_in, update_pricing_lapse_rates_in, gender_neutral_pricing_in, expense_acq_in, expenses_factor_in, expense_maint_in, inflation_rate_in, inflation_rate_addition_in, commission_mths_in, commission_pc_in})).toString()); 
export const s0_policy_value = ({policy_term_in, duration_mth_in, premium_payment_frequency_in, sum_assured_in, loading_prem_in, pricing_projection_in, timing_in, policy_count_in, zero_decrement_experience_in, stress_delay_in, original_lapse_rates_in, lapse_rate_factor_in, age_at_entry_in, sex_in, mort_rate_factor_in, mort_rate_Y1_add_per_mille_in, discounting_on_in, zero_spot_year_in, update_pricing_lapse_rates_in, gender_neutral_pricing_in, expense_acq_in, expenses_factor_in, expense_maint_in, inflation_rate_in, inflation_rate_addition_in, commission_mths_in, commission_pc_in}) => s0_policy_value$m({policy_term_in, duration_mth_in, premium_payment_frequency_in, sum_assured_in, loading_prem_in, pricing_projection_in, timing_in, policy_count_in, zero_decrement_experience_in, stress_delay_in, original_lapse_rates_in, lapse_rate_factor_in, age_at_entry_in, sex_in, mort_rate_factor_in, mort_rate_Y1_add_per_mille_in, discounting_on_in, zero_spot_year_in, update_pricing_lapse_rates_in, gender_neutral_pricing_in, expense_acq_in, expenses_factor_in, expense_maint_in, inflation_rate_in, inflation_rate_addition_in, commission_mths_in, commission_pc_in})
model['s0_policy_value'] = s0_policy_value

export const s1_t$m = memoize(s1_t$, ({t_in}) => Object.values(({t_in})).toString()); 
export const s1_t = ({t_in}) => s1_t$m({t_in})
model['s1_t'] = s1_t

export const s1_age_at_entry$m = memoize(s1_age_at_entry$, ({age_at_entry_in}) => Object.values(({age_at_entry_in})).toString()); 
export const s1_age_at_entry = ({age_at_entry_in}) => s1_age_at_entry$m({age_at_entry_in})
model['s1_age_at_entry'] = s1_age_at_entry

export const s1_sex$m = memoize(s1_sex$, ({sex_in}) => Object.values(({sex_in})).toString()); 
export const s1_sex = ({sex_in}) => s1_sex$m({sex_in})
model['s1_sex'] = s1_sex

export const s1_policy_term$m = memoize(s1_policy_term$, ({policy_term_in}) => Object.values(({policy_term_in})).toString()); 
export const s1_policy_term = ({policy_term_in}) => s1_policy_term$m({policy_term_in})
model['s1_policy_term'] = s1_policy_term

export const s1_policy_count$m = memoize(s1_policy_count$, ({policy_count_in}) => Object.values(({policy_count_in})).toString()); 
export const s1_policy_count = ({policy_count_in}) => s1_policy_count$m({policy_count_in})
model['s1_policy_count'] = s1_policy_count

export const s1_sum_assured$m = memoize(s1_sum_assured$, ({sum_assured_in}) => Object.values(({sum_assured_in})).toString()); 
export const s1_sum_assured = ({sum_assured_in}) => s1_sum_assured$m({sum_assured_in})
model['s1_sum_assured'] = s1_sum_assured

export const s1_duration_mth$m = memoize(s1_duration_mth$, ({duration_mth_in, t_in}) => Object.values(({duration_mth_in, t_in})).toString()); 
export const s1_duration_mth = ({duration_mth_in, t_in}) => s1_duration_mth$m({duration_mth_in, t_in})
model['s1_duration_mth'] = s1_duration_mth

export const s1_duration_mth_0$m = memoize(s1_duration_mth_0$, ({duration_mth_in}) => Object.values(({duration_mth_in})).toString()); 
export const s1_duration_mth_0 = ({duration_mth_in}) => s1_duration_mth_0$m({duration_mth_in})
model['s1_duration_mth_0'] = s1_duration_mth_0

export const s1_duration$m = memoize(s1_duration$, ({duration_mth_in, t_in}) => Object.values(({duration_mth_in, t_in})).toString()); 
export const s1_duration = ({duration_mth_in, t_in}) => s1_duration$m({duration_mth_in, t_in})
model['s1_duration'] = s1_duration

export const s1_age$m = memoize(s1_age$, ({age_at_entry_in, duration_mth_in, t_in}) => Object.values(({age_at_entry_in, duration_mth_in, t_in})).toString()); 
export const s1_age = ({age_at_entry_in, duration_mth_in, t_in}) => s1_age$m({age_at_entry_in, duration_mth_in, t_in})
model['s1_age'] = s1_age

export const s1_claim_pp$m = memoize(s1_claim_pp$, ({sum_assured_in}) => Object.values(({sum_assured_in})).toString()); 
export const s1_claim_pp = ({sum_assured_in}) => s1_claim_pp$m({sum_assured_in})
model['s1_claim_pp'] = s1_claim_pp

export const s1_mort_rate_select_index$m = memoize(s1_mort_rate_select_index$, ({duration_mth_in, t_in}) => Object.values(({duration_mth_in, t_in})).toString()); 
export const s1_mort_rate_select_index = ({duration_mth_in, t_in}) => s1_mort_rate_select_index$m({duration_mth_in, t_in})
model['s1_mort_rate_select_index'] = s1_mort_rate_select_index

export const s1_zero_decrement_experience$m = memoize(s1_zero_decrement_experience$, ({zero_decrement_experience_in}) => Object.values(({zero_decrement_experience_in})).toString()); 
export const s1_zero_decrement_experience = ({zero_decrement_experience_in}) => s1_zero_decrement_experience$m({zero_decrement_experience_in})
model['s1_zero_decrement_experience'] = s1_zero_decrement_experience

export const s1_mort_rate_mth$m = memoize(s1_mort_rate_mth$, ({t_in, zero_decrement_experience_in, stress_delay_in, age_at_entry_in, duration_mth_in, sex_in, mort_rate_factor_in, mort_rate_Y1_add_per_mille_in}) => Object.values(({t_in, zero_decrement_experience_in, stress_delay_in, age_at_entry_in, duration_mth_in, sex_in, mort_rate_factor_in, mort_rate_Y1_add_per_mille_in})).toString()); 
export const s1_mort_rate_mth = ({t_in, zero_decrement_experience_in, stress_delay_in, age_at_entry_in, duration_mth_in, sex_in, mort_rate_factor_in, mort_rate_Y1_add_per_mille_in}) => s1_mort_rate_mth$m({t_in, zero_decrement_experience_in, stress_delay_in, age_at_entry_in, duration_mth_in, sex_in, mort_rate_factor_in, mort_rate_Y1_add_per_mille_in})
model['s1_mort_rate_mth'] = s1_mort_rate_mth

export const s1_lapse_rate_$m = memoize(s1_lapse_rate_$, ({duration_mth_in, t_in}) => Object.values(({duration_mth_in, t_in})).toString()); 
export const s1_lapse_rate_ = ({duration_mth_in, t_in}) => s1_lapse_rate_$m({duration_mth_in, t_in})
model['s1_lapse_rate_'] = s1_lapse_rate_

export const s1_lapse_rate_mth$m = memoize(s1_lapse_rate_mth$, ({t_in, zero_decrement_experience_in, stress_delay_in, original_lapse_rates_in, duration_mth_in, lapse_rate_factor_in}) => Object.values(({t_in, zero_decrement_experience_in, stress_delay_in, original_lapse_rates_in, duration_mth_in, lapse_rate_factor_in})).toString()); 
export const s1_lapse_rate_mth = ({t_in, zero_decrement_experience_in, stress_delay_in, original_lapse_rates_in, duration_mth_in, lapse_rate_factor_in}) => s1_lapse_rate_mth$m({t_in, zero_decrement_experience_in, stress_delay_in, original_lapse_rates_in, duration_mth_in, lapse_rate_factor_in})
model['s1_lapse_rate_mth'] = s1_lapse_rate_mth

export const s1_timing$m = memoize(s1_timing$, ({timing_in}) => Object.values(({timing_in})).toString()); 
export const s1_timing = ({timing_in}) => s1_timing$m({timing_in})
model['s1_timing'] = s1_timing

export const s1_pols_if_init$m = memoize(s1_pols_if_init$, ({policy_count_in}) => Object.values(({policy_count_in})).toString()); 
export const s1_pols_if_init = ({policy_count_in}) => s1_pols_if_init$m({policy_count_in})
model['s1_pols_if_init'] = s1_pols_if_init

export const s1_pols_if_at$m = memoize(s1_pols_if_at$, ({duration_mth_in, t_in, policy_term_in, timing_in, policy_count_in, zero_decrement_experience_in, stress_delay_in, age_at_entry_in, sex_in, mort_rate_factor_in, mort_rate_Y1_add_per_mille_in, original_lapse_rates_in, lapse_rate_factor_in}) => Object.values(({duration_mth_in, t_in, policy_term_in, timing_in, policy_count_in, zero_decrement_experience_in, stress_delay_in, age_at_entry_in, sex_in, mort_rate_factor_in, mort_rate_Y1_add_per_mille_in, original_lapse_rates_in, lapse_rate_factor_in})).toString()); 
export const s1_pols_if_at = ({duration_mth_in, t_in, policy_term_in, timing_in, policy_count_in, zero_decrement_experience_in, stress_delay_in, age_at_entry_in, sex_in, mort_rate_factor_in, mort_rate_Y1_add_per_mille_in, original_lapse_rates_in, lapse_rate_factor_in}) => s1_pols_if_at$m({duration_mth_in, t_in, policy_term_in, timing_in, policy_count_in, zero_decrement_experience_in, stress_delay_in, age_at_entry_in, sex_in, mort_rate_factor_in, mort_rate_Y1_add_per_mille_in, original_lapse_rates_in, lapse_rate_factor_in})
model['s1_pols_if_at'] = s1_pols_if_at

export const s1_pols_lapse$m = memoize(s1_pols_lapse$, ({duration_mth_in, t_in, policy_term_in, policy_count_in, zero_decrement_experience_in, stress_delay_in, age_at_entry_in, sex_in, mort_rate_factor_in, mort_rate_Y1_add_per_mille_in, original_lapse_rates_in, lapse_rate_factor_in}) => Object.values(({duration_mth_in, t_in, policy_term_in, policy_count_in, zero_decrement_experience_in, stress_delay_in, age_at_entry_in, sex_in, mort_rate_factor_in, mort_rate_Y1_add_per_mille_in, original_lapse_rates_in, lapse_rate_factor_in})).toString()); 
export const s1_pols_lapse = ({duration_mth_in, t_in, policy_term_in, policy_count_in, zero_decrement_experience_in, stress_delay_in, age_at_entry_in, sex_in, mort_rate_factor_in, mort_rate_Y1_add_per_mille_in, original_lapse_rates_in, lapse_rate_factor_in}) => s1_pols_lapse$m({duration_mth_in, t_in, policy_term_in, policy_count_in, zero_decrement_experience_in, stress_delay_in, age_at_entry_in, sex_in, mort_rate_factor_in, mort_rate_Y1_add_per_mille_in, original_lapse_rates_in, lapse_rate_factor_in})
model['s1_pols_lapse'] = s1_pols_lapse

export const s1_pols_maturity$m = memoize(s1_pols_maturity$, ({duration_mth_in, t_in, policy_term_in, policy_count_in, zero_decrement_experience_in, stress_delay_in, age_at_entry_in, sex_in, mort_rate_factor_in, mort_rate_Y1_add_per_mille_in, original_lapse_rates_in, lapse_rate_factor_in}) => Object.values(({duration_mth_in, t_in, policy_term_in, policy_count_in, zero_decrement_experience_in, stress_delay_in, age_at_entry_in, sex_in, mort_rate_factor_in, mort_rate_Y1_add_per_mille_in, original_lapse_rates_in, lapse_rate_factor_in})).toString()); 
export const s1_pols_maturity = ({duration_mth_in, t_in, policy_term_in, policy_count_in, zero_decrement_experience_in, stress_delay_in, age_at_entry_in, sex_in, mort_rate_factor_in, mort_rate_Y1_add_per_mille_in, original_lapse_rates_in, lapse_rate_factor_in}) => s1_pols_maturity$m({duration_mth_in, t_in, policy_term_in, policy_count_in, zero_decrement_experience_in, stress_delay_in, age_at_entry_in, sex_in, mort_rate_factor_in, mort_rate_Y1_add_per_mille_in, original_lapse_rates_in, lapse_rate_factor_in})
model['s1_pols_maturity'] = s1_pols_maturity

export const s1_pols_new_biz$m = memoize(s1_pols_new_biz$, ({duration_mth_in, t_in, policy_count_in}) => Object.values(({duration_mth_in, t_in, policy_count_in})).toString()); 
export const s1_pols_new_biz = ({duration_mth_in, t_in, policy_count_in}) => s1_pols_new_biz$m({duration_mth_in, t_in, policy_count_in})
model['s1_pols_new_biz'] = s1_pols_new_biz

export const s1_pols_death$m = memoize(s1_pols_death$, ({duration_mth_in, t_in, policy_term_in, policy_count_in, zero_decrement_experience_in, stress_delay_in, original_lapse_rates_in, lapse_rate_factor_in, age_at_entry_in, sex_in, mort_rate_factor_in, mort_rate_Y1_add_per_mille_in}) => Object.values(({duration_mth_in, t_in, policy_term_in, policy_count_in, zero_decrement_experience_in, stress_delay_in, original_lapse_rates_in, lapse_rate_factor_in, age_at_entry_in, sex_in, mort_rate_factor_in, mort_rate_Y1_add_per_mille_in})).toString()); 
export const s1_pols_death = ({duration_mth_in, t_in, policy_term_in, policy_count_in, zero_decrement_experience_in, stress_delay_in, original_lapse_rates_in, lapse_rate_factor_in, age_at_entry_in, sex_in, mort_rate_factor_in, mort_rate_Y1_add_per_mille_in}) => s1_pols_death$m({duration_mth_in, t_in, policy_term_in, policy_count_in, zero_decrement_experience_in, stress_delay_in, original_lapse_rates_in, lapse_rate_factor_in, age_at_entry_in, sex_in, mort_rate_factor_in, mort_rate_Y1_add_per_mille_in})
model['s1_pols_death'] = s1_pols_death

export const s1_premium_pp_$m = memoize(s1_premium_pp_$, ({sum_assured_in, loading_prem_in, policy_term_in, timing_in, policy_count_in, zero_decrement_experience_in, stress_delay_in, original_lapse_rates_in, lapse_rate_factor_in, age_at_entry_in, sex_in, mort_rate_factor_in, mort_rate_Y1_add_per_mille_in, discounting_on_in, zero_spot_year_in, premium_payment_frequency_in, update_pricing_lapse_rates_in, gender_neutral_pricing_in}) => Object.values(({sum_assured_in, loading_prem_in, policy_term_in, timing_in, policy_count_in, zero_decrement_experience_in, stress_delay_in, original_lapse_rates_in, lapse_rate_factor_in, age_at_entry_in, sex_in, mort_rate_factor_in, mort_rate_Y1_add_per_mille_in, discounting_on_in, zero_spot_year_in, premium_payment_frequency_in, update_pricing_lapse_rates_in, gender_neutral_pricing_in})).toString()); 
export const s1_premium_pp_ = ({sum_assured_in, loading_prem_in, policy_term_in, timing_in, policy_count_in, zero_decrement_experience_in, stress_delay_in, original_lapse_rates_in, lapse_rate_factor_in, age_at_entry_in, sex_in, mort_rate_factor_in, mort_rate_Y1_add_per_mille_in, discounting_on_in, zero_spot_year_in, premium_payment_frequency_in, update_pricing_lapse_rates_in, gender_neutral_pricing_in}) => s1_premium_pp_$m({sum_assured_in, loading_prem_in, policy_term_in, timing_in, policy_count_in, zero_decrement_experience_in, stress_delay_in, original_lapse_rates_in, lapse_rate_factor_in, age_at_entry_in, sex_in, mort_rate_factor_in, mort_rate_Y1_add_per_mille_in, discounting_on_in, zero_spot_year_in, premium_payment_frequency_in, update_pricing_lapse_rates_in, gender_neutral_pricing_in})
model['s1_premium_pp_'] = s1_premium_pp_

export const s1_expense_acq_$m = memoize(s1_expense_acq_$, ({}) => Object.values(({})).toString()); 
export const s1_expense_acq_ = ({}) => s1_expense_acq_$m({})
model['s1_expense_acq_'] = s1_expense_acq_

export const s1_expense_maint_$m = memoize(s1_expense_maint_$, ({}) => Object.values(({})).toString()); 
export const s1_expense_maint_ = ({}) => s1_expense_maint_$m({})
model['s1_expense_maint_'] = s1_expense_maint_

export const s1_inflation_rate_$m = memoize(s1_inflation_rate_$, ({}) => Object.values(({})).toString()); 
export const s1_inflation_rate_ = ({}) => s1_inflation_rate_$m({})
model['s1_inflation_rate_'] = s1_inflation_rate_

export const s1_inflation_rate_mth$m = memoize(s1_inflation_rate_mth$, ({t_in, stress_delay_in, inflation_rate_in, inflation_rate_addition_in}) => Object.values(({t_in, stress_delay_in, inflation_rate_in, inflation_rate_addition_in})).toString()); 
export const s1_inflation_rate_mth = ({t_in, stress_delay_in, inflation_rate_in, inflation_rate_addition_in}) => s1_inflation_rate_mth$m({t_in, stress_delay_in, inflation_rate_in, inflation_rate_addition_in})
model['s1_inflation_rate_mth'] = s1_inflation_rate_mth

export const s1_inflation_factor$m = memoize(s1_inflation_factor$, ({t_in, stress_delay_in, inflation_rate_in, inflation_rate_addition_in}) => Object.values(({t_in, stress_delay_in, inflation_rate_in, inflation_rate_addition_in})).toString()); 
export const s1_inflation_factor = ({t_in, stress_delay_in, inflation_rate_in, inflation_rate_addition_in}) => s1_inflation_factor$m({t_in, stress_delay_in, inflation_rate_in, inflation_rate_addition_in})
model['s1_inflation_factor'] = s1_inflation_factor

export const s1_premiums$m = memoize(s1_premiums$, ({premium_payment_frequency_in, t_in, duration_mth_in, sum_assured_in, loading_prem_in, policy_term_in, timing_in, policy_count_in, zero_decrement_experience_in, stress_delay_in, original_lapse_rates_in, lapse_rate_factor_in, age_at_entry_in, sex_in, mort_rate_factor_in, mort_rate_Y1_add_per_mille_in, discounting_on_in, zero_spot_year_in, update_pricing_lapse_rates_in, gender_neutral_pricing_in}) => Object.values(({premium_payment_frequency_in, t_in, duration_mth_in, sum_assured_in, loading_prem_in, policy_term_in, timing_in, policy_count_in, zero_decrement_experience_in, stress_delay_in, original_lapse_rates_in, lapse_rate_factor_in, age_at_entry_in, sex_in, mort_rate_factor_in, mort_rate_Y1_add_per_mille_in, discounting_on_in, zero_spot_year_in, update_pricing_lapse_rates_in, gender_neutral_pricing_in})).toString()); 
export const s1_premiums = ({premium_payment_frequency_in, t_in, duration_mth_in, sum_assured_in, loading_prem_in, policy_term_in, timing_in, policy_count_in, zero_decrement_experience_in, stress_delay_in, original_lapse_rates_in, lapse_rate_factor_in, age_at_entry_in, sex_in, mort_rate_factor_in, mort_rate_Y1_add_per_mille_in, discounting_on_in, zero_spot_year_in, update_pricing_lapse_rates_in, gender_neutral_pricing_in}) => s1_premiums$m({premium_payment_frequency_in, t_in, duration_mth_in, sum_assured_in, loading_prem_in, policy_term_in, timing_in, policy_count_in, zero_decrement_experience_in, stress_delay_in, original_lapse_rates_in, lapse_rate_factor_in, age_at_entry_in, sex_in, mort_rate_factor_in, mort_rate_Y1_add_per_mille_in, discounting_on_in, zero_spot_year_in, update_pricing_lapse_rates_in, gender_neutral_pricing_in})
model['s1_premiums'] = s1_premiums

export const s1_claims$m = memoize(s1_claims$, ({sum_assured_in, duration_mth_in, t_in, policy_term_in, policy_count_in, zero_decrement_experience_in, stress_delay_in, original_lapse_rates_in, lapse_rate_factor_in, age_at_entry_in, sex_in, mort_rate_factor_in, mort_rate_Y1_add_per_mille_in}) => Object.values(({sum_assured_in, duration_mth_in, t_in, policy_term_in, policy_count_in, zero_decrement_experience_in, stress_delay_in, original_lapse_rates_in, lapse_rate_factor_in, age_at_entry_in, sex_in, mort_rate_factor_in, mort_rate_Y1_add_per_mille_in})).toString()); 
export const s1_claims = ({sum_assured_in, duration_mth_in, t_in, policy_term_in, policy_count_in, zero_decrement_experience_in, stress_delay_in, original_lapse_rates_in, lapse_rate_factor_in, age_at_entry_in, sex_in, mort_rate_factor_in, mort_rate_Y1_add_per_mille_in}) => s1_claims$m({sum_assured_in, duration_mth_in, t_in, policy_term_in, policy_count_in, zero_decrement_experience_in, stress_delay_in, original_lapse_rates_in, lapse_rate_factor_in, age_at_entry_in, sex_in, mort_rate_factor_in, mort_rate_Y1_add_per_mille_in})
model['s1_claims'] = s1_claims

export const s1_expenses$m = memoize(s1_expenses$, ({t_in, stress_delay_in, expense_acq_in, expenses_factor_in, duration_mth_in, policy_count_in, policy_term_in, zero_decrement_experience_in, age_at_entry_in, sex_in, mort_rate_factor_in, mort_rate_Y1_add_per_mille_in, original_lapse_rates_in, lapse_rate_factor_in, expense_maint_in, inflation_rate_in, inflation_rate_addition_in}) => Object.values(({t_in, stress_delay_in, expense_acq_in, expenses_factor_in, duration_mth_in, policy_count_in, policy_term_in, zero_decrement_experience_in, age_at_entry_in, sex_in, mort_rate_factor_in, mort_rate_Y1_add_per_mille_in, original_lapse_rates_in, lapse_rate_factor_in, expense_maint_in, inflation_rate_in, inflation_rate_addition_in})).toString()); 
export const s1_expenses = ({t_in, stress_delay_in, expense_acq_in, expenses_factor_in, duration_mth_in, policy_count_in, policy_term_in, zero_decrement_experience_in, age_at_entry_in, sex_in, mort_rate_factor_in, mort_rate_Y1_add_per_mille_in, original_lapse_rates_in, lapse_rate_factor_in, expense_maint_in, inflation_rate_in, inflation_rate_addition_in}) => s1_expenses$m({t_in, stress_delay_in, expense_acq_in, expenses_factor_in, duration_mth_in, policy_count_in, policy_term_in, zero_decrement_experience_in, age_at_entry_in, sex_in, mort_rate_factor_in, mort_rate_Y1_add_per_mille_in, original_lapse_rates_in, lapse_rate_factor_in, expense_maint_in, inflation_rate_in, inflation_rate_addition_in})
model['s1_expenses'] = s1_expenses

export const s1_commissions$m = memoize(s1_commissions$, ({duration_mth_in, t_in, commission_mths_in, premium_payment_frequency_in, sum_assured_in, loading_prem_in, policy_term_in, timing_in, policy_count_in, zero_decrement_experience_in, stress_delay_in, original_lapse_rates_in, lapse_rate_factor_in, age_at_entry_in, sex_in, mort_rate_factor_in, mort_rate_Y1_add_per_mille_in, discounting_on_in, zero_spot_year_in, update_pricing_lapse_rates_in, gender_neutral_pricing_in, commission_pc_in}) => Object.values(({duration_mth_in, t_in, commission_mths_in, premium_payment_frequency_in, sum_assured_in, loading_prem_in, policy_term_in, timing_in, policy_count_in, zero_decrement_experience_in, stress_delay_in, original_lapse_rates_in, lapse_rate_factor_in, age_at_entry_in, sex_in, mort_rate_factor_in, mort_rate_Y1_add_per_mille_in, discounting_on_in, zero_spot_year_in, update_pricing_lapse_rates_in, gender_neutral_pricing_in, commission_pc_in})).toString()); 
export const s1_commissions = ({duration_mth_in, t_in, commission_mths_in, premium_payment_frequency_in, sum_assured_in, loading_prem_in, policy_term_in, timing_in, policy_count_in, zero_decrement_experience_in, stress_delay_in, original_lapse_rates_in, lapse_rate_factor_in, age_at_entry_in, sex_in, mort_rate_factor_in, mort_rate_Y1_add_per_mille_in, discounting_on_in, zero_spot_year_in, update_pricing_lapse_rates_in, gender_neutral_pricing_in, commission_pc_in}) => s1_commissions$m({duration_mth_in, t_in, commission_mths_in, premium_payment_frequency_in, sum_assured_in, loading_prem_in, policy_term_in, timing_in, policy_count_in, zero_decrement_experience_in, stress_delay_in, original_lapse_rates_in, lapse_rate_factor_in, age_at_entry_in, sex_in, mort_rate_factor_in, mort_rate_Y1_add_per_mille_in, discounting_on_in, zero_spot_year_in, update_pricing_lapse_rates_in, gender_neutral_pricing_in, commission_pc_in})
model['s1_commissions'] = s1_commissions

export const s1_commission_mths_$m = memoize(s1_commission_mths_$, ({}) => Object.values(({})).toString()); 
export const s1_commission_mths_ = ({}) => s1_commission_mths_$m({})
model['s1_commission_mths_'] = s1_commission_mths_

export const s1_commission_pc_$m = memoize(s1_commission_pc_$, ({}) => Object.values(({})).toString()); 
export const s1_commission_pc_ = ({}) => s1_commission_pc_$m({})
model['s1_commission_pc_'] = s1_commission_pc_

export const s1_net_cf_$m = memoize(s1_net_cf_$, ({premium_payment_frequency_in, t_in, duration_mth_in, sum_assured_in, loading_prem_in, policy_term_in, timing_in, policy_count_in, zero_decrement_experience_in, stress_delay_in, original_lapse_rates_in, lapse_rate_factor_in, age_at_entry_in, sex_in, mort_rate_factor_in, mort_rate_Y1_add_per_mille_in, discounting_on_in, zero_spot_year_in, update_pricing_lapse_rates_in, gender_neutral_pricing_in, expense_acq_in, expenses_factor_in, expense_maint_in, inflation_rate_in, inflation_rate_addition_in, commission_mths_in, commission_pc_in}) => Object.values(({premium_payment_frequency_in, t_in, duration_mth_in, sum_assured_in, loading_prem_in, policy_term_in, timing_in, policy_count_in, zero_decrement_experience_in, stress_delay_in, original_lapse_rates_in, lapse_rate_factor_in, age_at_entry_in, sex_in, mort_rate_factor_in, mort_rate_Y1_add_per_mille_in, discounting_on_in, zero_spot_year_in, update_pricing_lapse_rates_in, gender_neutral_pricing_in, expense_acq_in, expenses_factor_in, expense_maint_in, inflation_rate_in, inflation_rate_addition_in, commission_mths_in, commission_pc_in})).toString()); 
export const s1_net_cf_ = ({premium_payment_frequency_in, t_in, duration_mth_in, sum_assured_in, loading_prem_in, policy_term_in, timing_in, policy_count_in, zero_decrement_experience_in, stress_delay_in, original_lapse_rates_in, lapse_rate_factor_in, age_at_entry_in, sex_in, mort_rate_factor_in, mort_rate_Y1_add_per_mille_in, discounting_on_in, zero_spot_year_in, update_pricing_lapse_rates_in, gender_neutral_pricing_in, expense_acq_in, expenses_factor_in, expense_maint_in, inflation_rate_in, inflation_rate_addition_in, commission_mths_in, commission_pc_in}) => s1_net_cf_$m({premium_payment_frequency_in, t_in, duration_mth_in, sum_assured_in, loading_prem_in, policy_term_in, timing_in, policy_count_in, zero_decrement_experience_in, stress_delay_in, original_lapse_rates_in, lapse_rate_factor_in, age_at_entry_in, sex_in, mort_rate_factor_in, mort_rate_Y1_add_per_mille_in, discounting_on_in, zero_spot_year_in, update_pricing_lapse_rates_in, gender_neutral_pricing_in, expense_acq_in, expenses_factor_in, expense_maint_in, inflation_rate_in, inflation_rate_addition_in, commission_mths_in, commission_pc_in})
model['s1_net_cf_'] = s1_net_cf_

export const s1_proj_len$m = memoize(s1_proj_len$, ({policy_term_in, duration_mth_in}) => Object.values(({policy_term_in, duration_mth_in})).toString()); 
export const s1_proj_len = ({policy_term_in, duration_mth_in}) => s1_proj_len$m({policy_term_in, duration_mth_in})
model['s1_proj_len'] = s1_proj_len

export const s1_is_active$m = memoize(s1_is_active$, ({duration_mth_in, t_in, policy_term_in}) => Object.values(({duration_mth_in, t_in, policy_term_in})).toString()); 
export const s1_is_active = ({duration_mth_in, t_in, policy_term_in}) => s1_is_active$m({duration_mth_in, t_in, policy_term_in})
model['s1_is_active'] = s1_is_active

export const s1_pols_if$m = memoize(s1_pols_if$, ({duration_mth_in, t_in, policy_term_in, timing_in, policy_count_in, zero_decrement_experience_in, stress_delay_in, age_at_entry_in, sex_in, mort_rate_factor_in, mort_rate_Y1_add_per_mille_in, original_lapse_rates_in, lapse_rate_factor_in}) => Object.values(({duration_mth_in, t_in, policy_term_in, timing_in, policy_count_in, zero_decrement_experience_in, stress_delay_in, age_at_entry_in, sex_in, mort_rate_factor_in, mort_rate_Y1_add_per_mille_in, original_lapse_rates_in, lapse_rate_factor_in})).toString()); 
export const s1_pols_if = ({duration_mth_in, t_in, policy_term_in, timing_in, policy_count_in, zero_decrement_experience_in, stress_delay_in, age_at_entry_in, sex_in, mort_rate_factor_in, mort_rate_Y1_add_per_mille_in, original_lapse_rates_in, lapse_rate_factor_in}) => s1_pols_if$m({duration_mth_in, t_in, policy_term_in, timing_in, policy_count_in, zero_decrement_experience_in, stress_delay_in, age_at_entry_in, sex_in, mort_rate_factor_in, mort_rate_Y1_add_per_mille_in, original_lapse_rates_in, lapse_rate_factor_in})
model['s1_pols_if'] = s1_pols_if

export const s1_net_premium_pp_$m = memoize(s1_net_premium_pp_$, ({policy_term_in, sum_assured_in, timing_in, policy_count_in, zero_decrement_experience_in, stress_delay_in, original_lapse_rates_in, lapse_rate_factor_in, age_at_entry_in, sex_in, mort_rate_factor_in, mort_rate_Y1_add_per_mille_in, discounting_on_in, zero_spot_year_in, premium_payment_frequency_in}) => Object.values(({policy_term_in, sum_assured_in, timing_in, policy_count_in, zero_decrement_experience_in, stress_delay_in, original_lapse_rates_in, lapse_rate_factor_in, age_at_entry_in, sex_in, mort_rate_factor_in, mort_rate_Y1_add_per_mille_in, discounting_on_in, zero_spot_year_in, premium_payment_frequency_in})).toString()); 
export const s1_net_premium_pp_ = ({policy_term_in, sum_assured_in, timing_in, policy_count_in, zero_decrement_experience_in, stress_delay_in, original_lapse_rates_in, lapse_rate_factor_in, age_at_entry_in, sex_in, mort_rate_factor_in, mort_rate_Y1_add_per_mille_in, discounting_on_in, zero_spot_year_in, premium_payment_frequency_in}) => s1_net_premium_pp_$m({policy_term_in, sum_assured_in, timing_in, policy_count_in, zero_decrement_experience_in, stress_delay_in, original_lapse_rates_in, lapse_rate_factor_in, age_at_entry_in, sex_in, mort_rate_factor_in, mort_rate_Y1_add_per_mille_in, discounting_on_in, zero_spot_year_in, premium_payment_frequency_in})
model['s1_net_premium_pp_'] = s1_net_premium_pp_

export const s1_premium_rate_per_mille_$m = memoize(s1_premium_rate_per_mille_$, ({age_at_entry_in, policy_term_in}) => Object.values(({age_at_entry_in, policy_term_in})).toString()); 
export const s1_premium_rate_per_mille_ = ({age_at_entry_in, policy_term_in}) => s1_premium_rate_per_mille_$m({age_at_entry_in, policy_term_in})
model['s1_premium_rate_per_mille_'] = s1_premium_rate_per_mille_

export const s1_disc_rate_ann_$m = memoize(s1_disc_rate_ann_$, ({t_in}) => Object.values(({t_in})).toString()); 
export const s1_disc_rate_ann_ = ({t_in}) => s1_disc_rate_ann_$m({t_in})
model['s1_disc_rate_ann_'] = s1_disc_rate_ann_

export const s1_disc_rate_mth$m = memoize(s1_disc_rate_mth$, ({discounting_on_in, t_in}) => Object.values(({discounting_on_in, t_in})).toString()); 
export const s1_disc_rate_mth = ({discounting_on_in, t_in}) => s1_disc_rate_mth$m({discounting_on_in, t_in})
model['s1_disc_rate_mth'] = s1_disc_rate_mth

export const s1_disc_factor$m = memoize(s1_disc_factor$, ({discounting_on_in, t_in}) => Object.values(({discounting_on_in, t_in})).toString()); 
export const s1_disc_factor = ({discounting_on_in, t_in}) => s1_disc_factor$m({discounting_on_in, t_in})
model['s1_disc_factor'] = s1_disc_factor

export const s1_pv_claims$m = memoize(s1_pv_claims$, ({sum_assured_in, duration_mth_in, t_in, policy_term_in, policy_count_in, zero_decrement_experience_in, stress_delay_in, original_lapse_rates_in, lapse_rate_factor_in, age_at_entry_in, sex_in, mort_rate_factor_in, mort_rate_Y1_add_per_mille_in, discounting_on_in}) => Object.values(({sum_assured_in, duration_mth_in, t_in, policy_term_in, policy_count_in, zero_decrement_experience_in, stress_delay_in, original_lapse_rates_in, lapse_rate_factor_in, age_at_entry_in, sex_in, mort_rate_factor_in, mort_rate_Y1_add_per_mille_in, discounting_on_in})).toString()); 
export const s1_pv_claims = ({sum_assured_in, duration_mth_in, t_in, policy_term_in, policy_count_in, zero_decrement_experience_in, stress_delay_in, original_lapse_rates_in, lapse_rate_factor_in, age_at_entry_in, sex_in, mort_rate_factor_in, mort_rate_Y1_add_per_mille_in, discounting_on_in}) => s1_pv_claims$m({sum_assured_in, duration_mth_in, t_in, policy_term_in, policy_count_in, zero_decrement_experience_in, stress_delay_in, original_lapse_rates_in, lapse_rate_factor_in, age_at_entry_in, sex_in, mort_rate_factor_in, mort_rate_Y1_add_per_mille_in, discounting_on_in})
model['s1_pv_claims'] = s1_pv_claims

export const s1_pv_premiums$m = memoize(s1_pv_premiums$, ({premium_payment_frequency_in, t_in, duration_mth_in, sum_assured_in, loading_prem_in, policy_term_in, timing_in, policy_count_in, zero_decrement_experience_in, stress_delay_in, original_lapse_rates_in, lapse_rate_factor_in, age_at_entry_in, sex_in, mort_rate_factor_in, mort_rate_Y1_add_per_mille_in, discounting_on_in, zero_spot_year_in, update_pricing_lapse_rates_in, gender_neutral_pricing_in}) => Object.values(({premium_payment_frequency_in, t_in, duration_mth_in, sum_assured_in, loading_prem_in, policy_term_in, timing_in, policy_count_in, zero_decrement_experience_in, stress_delay_in, original_lapse_rates_in, lapse_rate_factor_in, age_at_entry_in, sex_in, mort_rate_factor_in, mort_rate_Y1_add_per_mille_in, discounting_on_in, zero_spot_year_in, update_pricing_lapse_rates_in, gender_neutral_pricing_in})).toString()); 
export const s1_pv_premiums = ({premium_payment_frequency_in, t_in, duration_mth_in, sum_assured_in, loading_prem_in, policy_term_in, timing_in, policy_count_in, zero_decrement_experience_in, stress_delay_in, original_lapse_rates_in, lapse_rate_factor_in, age_at_entry_in, sex_in, mort_rate_factor_in, mort_rate_Y1_add_per_mille_in, discounting_on_in, zero_spot_year_in, update_pricing_lapse_rates_in, gender_neutral_pricing_in}) => s1_pv_premiums$m({premium_payment_frequency_in, t_in, duration_mth_in, sum_assured_in, loading_prem_in, policy_term_in, timing_in, policy_count_in, zero_decrement_experience_in, stress_delay_in, original_lapse_rates_in, lapse_rate_factor_in, age_at_entry_in, sex_in, mort_rate_factor_in, mort_rate_Y1_add_per_mille_in, discounting_on_in, zero_spot_year_in, update_pricing_lapse_rates_in, gender_neutral_pricing_in})
model['s1_pv_premiums'] = s1_pv_premiums

export const s1_pv_expenses$m = memoize(s1_pv_expenses$, ({t_in, stress_delay_in, expense_acq_in, expenses_factor_in, duration_mth_in, policy_count_in, policy_term_in, zero_decrement_experience_in, age_at_entry_in, sex_in, mort_rate_factor_in, mort_rate_Y1_add_per_mille_in, original_lapse_rates_in, lapse_rate_factor_in, expense_maint_in, inflation_rate_in, inflation_rate_addition_in, discounting_on_in}) => Object.values(({t_in, stress_delay_in, expense_acq_in, expenses_factor_in, duration_mth_in, policy_count_in, policy_term_in, zero_decrement_experience_in, age_at_entry_in, sex_in, mort_rate_factor_in, mort_rate_Y1_add_per_mille_in, original_lapse_rates_in, lapse_rate_factor_in, expense_maint_in, inflation_rate_in, inflation_rate_addition_in, discounting_on_in})).toString()); 
export const s1_pv_expenses = ({t_in, stress_delay_in, expense_acq_in, expenses_factor_in, duration_mth_in, policy_count_in, policy_term_in, zero_decrement_experience_in, age_at_entry_in, sex_in, mort_rate_factor_in, mort_rate_Y1_add_per_mille_in, original_lapse_rates_in, lapse_rate_factor_in, expense_maint_in, inflation_rate_in, inflation_rate_addition_in, discounting_on_in}) => s1_pv_expenses$m({t_in, stress_delay_in, expense_acq_in, expenses_factor_in, duration_mth_in, policy_count_in, policy_term_in, zero_decrement_experience_in, age_at_entry_in, sex_in, mort_rate_factor_in, mort_rate_Y1_add_per_mille_in, original_lapse_rates_in, lapse_rate_factor_in, expense_maint_in, inflation_rate_in, inflation_rate_addition_in, discounting_on_in})
model['s1_pv_expenses'] = s1_pv_expenses

export const s1_pv_commissions$m = memoize(s1_pv_commissions$, ({duration_mth_in, t_in, commission_mths_in, premium_payment_frequency_in, sum_assured_in, loading_prem_in, policy_term_in, timing_in, policy_count_in, zero_decrement_experience_in, stress_delay_in, original_lapse_rates_in, lapse_rate_factor_in, age_at_entry_in, sex_in, mort_rate_factor_in, mort_rate_Y1_add_per_mille_in, discounting_on_in, zero_spot_year_in, update_pricing_lapse_rates_in, gender_neutral_pricing_in, commission_pc_in}) => Object.values(({duration_mth_in, t_in, commission_mths_in, premium_payment_frequency_in, sum_assured_in, loading_prem_in, policy_term_in, timing_in, policy_count_in, zero_decrement_experience_in, stress_delay_in, original_lapse_rates_in, lapse_rate_factor_in, age_at_entry_in, sex_in, mort_rate_factor_in, mort_rate_Y1_add_per_mille_in, discounting_on_in, zero_spot_year_in, update_pricing_lapse_rates_in, gender_neutral_pricing_in, commission_pc_in})).toString()); 
export const s1_pv_commissions = ({duration_mth_in, t_in, commission_mths_in, premium_payment_frequency_in, sum_assured_in, loading_prem_in, policy_term_in, timing_in, policy_count_in, zero_decrement_experience_in, stress_delay_in, original_lapse_rates_in, lapse_rate_factor_in, age_at_entry_in, sex_in, mort_rate_factor_in, mort_rate_Y1_add_per_mille_in, discounting_on_in, zero_spot_year_in, update_pricing_lapse_rates_in, gender_neutral_pricing_in, commission_pc_in}) => s1_pv_commissions$m({duration_mth_in, t_in, commission_mths_in, premium_payment_frequency_in, sum_assured_in, loading_prem_in, policy_term_in, timing_in, policy_count_in, zero_decrement_experience_in, stress_delay_in, original_lapse_rates_in, lapse_rate_factor_in, age_at_entry_in, sex_in, mort_rate_factor_in, mort_rate_Y1_add_per_mille_in, discounting_on_in, zero_spot_year_in, update_pricing_lapse_rates_in, gender_neutral_pricing_in, commission_pc_in})
model['s1_pv_commissions'] = s1_pv_commissions

export const s1_pv_net_cf$m = memoize(s1_pv_net_cf$, ({premium_payment_frequency_in, t_in, duration_mth_in, sum_assured_in, loading_prem_in, policy_term_in, timing_in, policy_count_in, zero_decrement_experience_in, stress_delay_in, original_lapse_rates_in, lapse_rate_factor_in, age_at_entry_in, sex_in, mort_rate_factor_in, mort_rate_Y1_add_per_mille_in, discounting_on_in, zero_spot_year_in, update_pricing_lapse_rates_in, gender_neutral_pricing_in, expense_acq_in, expenses_factor_in, expense_maint_in, inflation_rate_in, inflation_rate_addition_in, commission_mths_in, commission_pc_in}) => Object.values(({premium_payment_frequency_in, t_in, duration_mth_in, sum_assured_in, loading_prem_in, policy_term_in, timing_in, policy_count_in, zero_decrement_experience_in, stress_delay_in, original_lapse_rates_in, lapse_rate_factor_in, age_at_entry_in, sex_in, mort_rate_factor_in, mort_rate_Y1_add_per_mille_in, discounting_on_in, zero_spot_year_in, update_pricing_lapse_rates_in, gender_neutral_pricing_in, expense_acq_in, expenses_factor_in, expense_maint_in, inflation_rate_in, inflation_rate_addition_in, commission_mths_in, commission_pc_in})).toString()); 
export const s1_pv_net_cf = ({premium_payment_frequency_in, t_in, duration_mth_in, sum_assured_in, loading_prem_in, policy_term_in, timing_in, policy_count_in, zero_decrement_experience_in, stress_delay_in, original_lapse_rates_in, lapse_rate_factor_in, age_at_entry_in, sex_in, mort_rate_factor_in, mort_rate_Y1_add_per_mille_in, discounting_on_in, zero_spot_year_in, update_pricing_lapse_rates_in, gender_neutral_pricing_in, expense_acq_in, expenses_factor_in, expense_maint_in, inflation_rate_in, inflation_rate_addition_in, commission_mths_in, commission_pc_in}) => s1_pv_net_cf$m({premium_payment_frequency_in, t_in, duration_mth_in, sum_assured_in, loading_prem_in, policy_term_in, timing_in, policy_count_in, zero_decrement_experience_in, stress_delay_in, original_lapse_rates_in, lapse_rate_factor_in, age_at_entry_in, sex_in, mort_rate_factor_in, mort_rate_Y1_add_per_mille_in, discounting_on_in, zero_spot_year_in, update_pricing_lapse_rates_in, gender_neutral_pricing_in, expense_acq_in, expenses_factor_in, expense_maint_in, inflation_rate_in, inflation_rate_addition_in, commission_mths_in, commission_pc_in})
model['s1_pv_net_cf'] = s1_pv_net_cf

export const s1_pv_pols_if_$m = memoize(s1_pv_pols_if_$, ({duration_mth_in, t_in, policy_term_in, timing_in, policy_count_in, zero_decrement_experience_in, stress_delay_in, age_at_entry_in, sex_in, mort_rate_factor_in, mort_rate_Y1_add_per_mille_in, original_lapse_rates_in, lapse_rate_factor_in, discounting_on_in}) => Object.values(({duration_mth_in, t_in, policy_term_in, timing_in, policy_count_in, zero_decrement_experience_in, stress_delay_in, age_at_entry_in, sex_in, mort_rate_factor_in, mort_rate_Y1_add_per_mille_in, original_lapse_rates_in, lapse_rate_factor_in, discounting_on_in})).toString()); 
export const s1_pv_pols_if_ = ({duration_mth_in, t_in, policy_term_in, timing_in, policy_count_in, zero_decrement_experience_in, stress_delay_in, age_at_entry_in, sex_in, mort_rate_factor_in, mort_rate_Y1_add_per_mille_in, original_lapse_rates_in, lapse_rate_factor_in, discounting_on_in}) => s1_pv_pols_if_$m({duration_mth_in, t_in, policy_term_in, timing_in, policy_count_in, zero_decrement_experience_in, stress_delay_in, age_at_entry_in, sex_in, mort_rate_factor_in, mort_rate_Y1_add_per_mille_in, original_lapse_rates_in, lapse_rate_factor_in, discounting_on_in})
model['s1_pv_pols_if_'] = s1_pv_pols_if_

export const s1_pv_fut_claims$m = memoize(s1_pv_fut_claims$, ({t_in, policy_term_in, duration_mth_in, sum_assured_in, timing_in, policy_count_in, zero_decrement_experience_in, stress_delay_in, original_lapse_rates_in, lapse_rate_factor_in, age_at_entry_in, sex_in, mort_rate_factor_in, mort_rate_Y1_add_per_mille_in, discounting_on_in, zero_spot_year_in}) => Object.values(({t_in, policy_term_in, duration_mth_in, sum_assured_in, timing_in, policy_count_in, zero_decrement_experience_in, stress_delay_in, original_lapse_rates_in, lapse_rate_factor_in, age_at_entry_in, sex_in, mort_rate_factor_in, mort_rate_Y1_add_per_mille_in, discounting_on_in, zero_spot_year_in})).toString()); 
export const s1_pv_fut_claims = ({t_in, policy_term_in, duration_mth_in, sum_assured_in, timing_in, policy_count_in, zero_decrement_experience_in, stress_delay_in, original_lapse_rates_in, lapse_rate_factor_in, age_at_entry_in, sex_in, mort_rate_factor_in, mort_rate_Y1_add_per_mille_in, discounting_on_in, zero_spot_year_in}) => s1_pv_fut_claims$m({t_in, policy_term_in, duration_mth_in, sum_assured_in, timing_in, policy_count_in, zero_decrement_experience_in, stress_delay_in, original_lapse_rates_in, lapse_rate_factor_in, age_at_entry_in, sex_in, mort_rate_factor_in, mort_rate_Y1_add_per_mille_in, discounting_on_in, zero_spot_year_in})
model['s1_pv_fut_claims'] = s1_pv_fut_claims

export const s1_pv_fut_premiums$m = memoize(s1_pv_fut_premiums$, ({t_in, policy_term_in, duration_mth_in, premium_payment_frequency_in, sum_assured_in, loading_prem_in, pricing_projection_in, timing_in, policy_count_in, zero_decrement_experience_in, stress_delay_in, original_lapse_rates_in, lapse_rate_factor_in, age_at_entry_in, sex_in, mort_rate_factor_in, mort_rate_Y1_add_per_mille_in, discounting_on_in, zero_spot_year_in, update_pricing_lapse_rates_in, gender_neutral_pricing_in}) => Object.values(({t_in, policy_term_in, duration_mth_in, premium_payment_frequency_in, sum_assured_in, loading_prem_in, pricing_projection_in, timing_in, policy_count_in, zero_decrement_experience_in, stress_delay_in, original_lapse_rates_in, lapse_rate_factor_in, age_at_entry_in, sex_in, mort_rate_factor_in, mort_rate_Y1_add_per_mille_in, discounting_on_in, zero_spot_year_in, update_pricing_lapse_rates_in, gender_neutral_pricing_in})).toString()); 
export const s1_pv_fut_premiums = ({t_in, policy_term_in, duration_mth_in, premium_payment_frequency_in, sum_assured_in, loading_prem_in, pricing_projection_in, timing_in, policy_count_in, zero_decrement_experience_in, stress_delay_in, original_lapse_rates_in, lapse_rate_factor_in, age_at_entry_in, sex_in, mort_rate_factor_in, mort_rate_Y1_add_per_mille_in, discounting_on_in, zero_spot_year_in, update_pricing_lapse_rates_in, gender_neutral_pricing_in}) => s1_pv_fut_premiums$m({t_in, policy_term_in, duration_mth_in, premium_payment_frequency_in, sum_assured_in, loading_prem_in, pricing_projection_in, timing_in, policy_count_in, zero_decrement_experience_in, stress_delay_in, original_lapse_rates_in, lapse_rate_factor_in, age_at_entry_in, sex_in, mort_rate_factor_in, mort_rate_Y1_add_per_mille_in, discounting_on_in, zero_spot_year_in, update_pricing_lapse_rates_in, gender_neutral_pricing_in})
model['s1_pv_fut_premiums'] = s1_pv_fut_premiums

export const s1_pv_fut_expenses$m = memoize(s1_pv_fut_expenses$, ({t_in, policy_term_in, duration_mth_in, stress_delay_in, expense_acq_in, expenses_factor_in, policy_count_in, timing_in, zero_decrement_experience_in, age_at_entry_in, sex_in, mort_rate_factor_in, mort_rate_Y1_add_per_mille_in, original_lapse_rates_in, lapse_rate_factor_in, expense_maint_in, inflation_rate_in, inflation_rate_addition_in, discounting_on_in, zero_spot_year_in}) => Object.values(({t_in, policy_term_in, duration_mth_in, stress_delay_in, expense_acq_in, expenses_factor_in, policy_count_in, timing_in, zero_decrement_experience_in, age_at_entry_in, sex_in, mort_rate_factor_in, mort_rate_Y1_add_per_mille_in, original_lapse_rates_in, lapse_rate_factor_in, expense_maint_in, inflation_rate_in, inflation_rate_addition_in, discounting_on_in, zero_spot_year_in})).toString()); 
export const s1_pv_fut_expenses = ({t_in, policy_term_in, duration_mth_in, stress_delay_in, expense_acq_in, expenses_factor_in, policy_count_in, timing_in, zero_decrement_experience_in, age_at_entry_in, sex_in, mort_rate_factor_in, mort_rate_Y1_add_per_mille_in, original_lapse_rates_in, lapse_rate_factor_in, expense_maint_in, inflation_rate_in, inflation_rate_addition_in, discounting_on_in, zero_spot_year_in}) => s1_pv_fut_expenses$m({t_in, policy_term_in, duration_mth_in, stress_delay_in, expense_acq_in, expenses_factor_in, policy_count_in, timing_in, zero_decrement_experience_in, age_at_entry_in, sex_in, mort_rate_factor_in, mort_rate_Y1_add_per_mille_in, original_lapse_rates_in, lapse_rate_factor_in, expense_maint_in, inflation_rate_in, inflation_rate_addition_in, discounting_on_in, zero_spot_year_in})
model['s1_pv_fut_expenses'] = s1_pv_fut_expenses

export const s1_pv_fut_commissions$m = memoize(s1_pv_fut_commissions$, ({t_in, policy_term_in, duration_mth_in, commission_mths_in, premium_payment_frequency_in, sum_assured_in, loading_prem_in, pricing_projection_in, timing_in, policy_count_in, zero_decrement_experience_in, stress_delay_in, original_lapse_rates_in, lapse_rate_factor_in, age_at_entry_in, sex_in, mort_rate_factor_in, mort_rate_Y1_add_per_mille_in, discounting_on_in, zero_spot_year_in, update_pricing_lapse_rates_in, gender_neutral_pricing_in, commission_pc_in}) => Object.values(({t_in, policy_term_in, duration_mth_in, commission_mths_in, premium_payment_frequency_in, sum_assured_in, loading_prem_in, pricing_projection_in, timing_in, policy_count_in, zero_decrement_experience_in, stress_delay_in, original_lapse_rates_in, lapse_rate_factor_in, age_at_entry_in, sex_in, mort_rate_factor_in, mort_rate_Y1_add_per_mille_in, discounting_on_in, zero_spot_year_in, update_pricing_lapse_rates_in, gender_neutral_pricing_in, commission_pc_in})).toString()); 
export const s1_pv_fut_commissions = ({t_in, policy_term_in, duration_mth_in, commission_mths_in, premium_payment_frequency_in, sum_assured_in, loading_prem_in, pricing_projection_in, timing_in, policy_count_in, zero_decrement_experience_in, stress_delay_in, original_lapse_rates_in, lapse_rate_factor_in, age_at_entry_in, sex_in, mort_rate_factor_in, mort_rate_Y1_add_per_mille_in, discounting_on_in, zero_spot_year_in, update_pricing_lapse_rates_in, gender_neutral_pricing_in, commission_pc_in}) => s1_pv_fut_commissions$m({t_in, policy_term_in, duration_mth_in, commission_mths_in, premium_payment_frequency_in, sum_assured_in, loading_prem_in, pricing_projection_in, timing_in, policy_count_in, zero_decrement_experience_in, stress_delay_in, original_lapse_rates_in, lapse_rate_factor_in, age_at_entry_in, sex_in, mort_rate_factor_in, mort_rate_Y1_add_per_mille_in, discounting_on_in, zero_spot_year_in, update_pricing_lapse_rates_in, gender_neutral_pricing_in, commission_pc_in})
model['s1_pv_fut_commissions'] = s1_pv_fut_commissions

export const s1_pv_fut_net_cf$m = memoize(s1_pv_fut_net_cf$, ({t_in, policy_term_in, duration_mth_in, premium_payment_frequency_in, sum_assured_in, loading_prem_in, pricing_projection_in, timing_in, policy_count_in, zero_decrement_experience_in, stress_delay_in, original_lapse_rates_in, lapse_rate_factor_in, age_at_entry_in, sex_in, mort_rate_factor_in, mort_rate_Y1_add_per_mille_in, discounting_on_in, zero_spot_year_in, update_pricing_lapse_rates_in, gender_neutral_pricing_in, expense_acq_in, expenses_factor_in, expense_maint_in, inflation_rate_in, inflation_rate_addition_in, commission_mths_in, commission_pc_in}) => Object.values(({t_in, policy_term_in, duration_mth_in, premium_payment_frequency_in, sum_assured_in, loading_prem_in, pricing_projection_in, timing_in, policy_count_in, zero_decrement_experience_in, stress_delay_in, original_lapse_rates_in, lapse_rate_factor_in, age_at_entry_in, sex_in, mort_rate_factor_in, mort_rate_Y1_add_per_mille_in, discounting_on_in, zero_spot_year_in, update_pricing_lapse_rates_in, gender_neutral_pricing_in, expense_acq_in, expenses_factor_in, expense_maint_in, inflation_rate_in, inflation_rate_addition_in, commission_mths_in, commission_pc_in})).toString()); 
export const s1_pv_fut_net_cf = ({t_in, policy_term_in, duration_mth_in, premium_payment_frequency_in, sum_assured_in, loading_prem_in, pricing_projection_in, timing_in, policy_count_in, zero_decrement_experience_in, stress_delay_in, original_lapse_rates_in, lapse_rate_factor_in, age_at_entry_in, sex_in, mort_rate_factor_in, mort_rate_Y1_add_per_mille_in, discounting_on_in, zero_spot_year_in, update_pricing_lapse_rates_in, gender_neutral_pricing_in, expense_acq_in, expenses_factor_in, expense_maint_in, inflation_rate_in, inflation_rate_addition_in, commission_mths_in, commission_pc_in}) => s1_pv_fut_net_cf$m({t_in, policy_term_in, duration_mth_in, premium_payment_frequency_in, sum_assured_in, loading_prem_in, pricing_projection_in, timing_in, policy_count_in, zero_decrement_experience_in, stress_delay_in, original_lapse_rates_in, lapse_rate_factor_in, age_at_entry_in, sex_in, mort_rate_factor_in, mort_rate_Y1_add_per_mille_in, discounting_on_in, zero_spot_year_in, update_pricing_lapse_rates_in, gender_neutral_pricing_in, expense_acq_in, expenses_factor_in, expense_maint_in, inflation_rate_in, inflation_rate_addition_in, commission_mths_in, commission_pc_in})
model['s1_pv_fut_net_cf'] = s1_pv_fut_net_cf

export const s1_pv_fut_pols_if$m = memoize(s1_pv_fut_pols_if$, ({t_in, policy_term_in, duration_mth_in, timing_in, policy_count_in, zero_decrement_experience_in, stress_delay_in, age_at_entry_in, sex_in, mort_rate_factor_in, mort_rate_Y1_add_per_mille_in, original_lapse_rates_in, lapse_rate_factor_in, discounting_on_in, zero_spot_year_in, premium_payment_frequency_in}) => Object.values(({t_in, policy_term_in, duration_mth_in, timing_in, policy_count_in, zero_decrement_experience_in, stress_delay_in, age_at_entry_in, sex_in, mort_rate_factor_in, mort_rate_Y1_add_per_mille_in, original_lapse_rates_in, lapse_rate_factor_in, discounting_on_in, zero_spot_year_in, premium_payment_frequency_in})).toString()); 
export const s1_pv_fut_pols_if = ({t_in, policy_term_in, duration_mth_in, timing_in, policy_count_in, zero_decrement_experience_in, stress_delay_in, age_at_entry_in, sex_in, mort_rate_factor_in, mort_rate_Y1_add_per_mille_in, original_lapse_rates_in, lapse_rate_factor_in, discounting_on_in, zero_spot_year_in, premium_payment_frequency_in}) => s1_pv_fut_pols_if$m({t_in, policy_term_in, duration_mth_in, timing_in, policy_count_in, zero_decrement_experience_in, stress_delay_in, age_at_entry_in, sex_in, mort_rate_factor_in, mort_rate_Y1_add_per_mille_in, original_lapse_rates_in, lapse_rate_factor_in, discounting_on_in, zero_spot_year_in, premium_payment_frequency_in})
model['s1_pv_fut_pols_if'] = s1_pv_fut_pols_if

export const s2_age_at_entry_$m = memoize(s2_age_at_entry_$, ({age_at_entry_in}) => Object.values(({age_at_entry_in})).toString()); 
export const s2_age_at_entry_ = ({age_at_entry_in}) => s2_age_at_entry_$m({age_at_entry_in})
model['s2_age_at_entry_'] = s2_age_at_entry_

export const s2_policy_term_$m = memoize(s2_policy_term_$, ({policy_term_in}) => Object.values(({policy_term_in})).toString()); 
export const s2_policy_term_ = ({policy_term_in}) => s2_policy_term_$m({policy_term_in})
model['s2_policy_term_'] = s2_policy_term_

export const s2_premium_rate$m = memoize(s2_premium_rate$, ({age_at_entry_in, policy_term_in}) => Object.values(({age_at_entry_in, policy_term_in})).toString()); 
export const s2_premium_rate = ({age_at_entry_in, policy_term_in}) => s2_premium_rate$m({age_at_entry_in, policy_term_in})
model['s2_premium_rate'] = s2_premium_rate

export const s2_premium_table$m = memoize(s2_premium_table$, ({}) => Object.values(({})).toString()); 
export const s2_premium_table = ({}) => s2_premium_table$m({})
model['s2_premium_table'] = s2_premium_table

export const s2_age_$m = memoize(s2_age_$, ({age_in}) => Object.values(({age_in})).toString()); 
export const s2_age_ = ({age_in}) => s2_age_$m({age_in})
model['s2_age_'] = s2_age_

export const s2_mort_rate_select_index_$m = memoize(s2_mort_rate_select_index_$, ({mort_rate_select_index_in}) => Object.values(({mort_rate_select_index_in})).toString()); 
export const s2_mort_rate_select_index_ = ({mort_rate_select_index_in}) => s2_mort_rate_select_index_$m({mort_rate_select_index_in})
model['s2_mort_rate_select_index_'] = s2_mort_rate_select_index_

export const s2_mort_rate_$m = memoize(s2_mort_rate_$, ({age_at_entry_in, duration_mth_in, t_in}) => Object.values(({age_at_entry_in, duration_mth_in, t_in})).toString()); 
export const s2_mort_rate_ = ({age_at_entry_in, duration_mth_in, t_in}) => s2_mort_rate_$m({age_at_entry_in, duration_mth_in, t_in})
model['s2_mort_rate_'] = s2_mort_rate_

export const s2_mort_table$m = memoize(s2_mort_table$, ({}) => Object.values(({})).toString()); 
export const s2_mort_table = ({}) => s2_mort_table$m({})
model['s2_mort_table'] = s2_mort_table

export const s2_zero_spot_year$m = memoize(s2_zero_spot_year$, ({zero_spot_year_in}) => Object.values(({zero_spot_year_in})).toString()); 
export const s2_zero_spot_year = ({zero_spot_year_in}) => s2_zero_spot_year$m({zero_spot_year_in})
model['s2_zero_spot_year'] = s2_zero_spot_year

export const s2_zero_spot$m = memoize(s2_zero_spot$, ({zero_spot_year_in}) => Object.values(({zero_spot_year_in})).toString()); 
export const s2_zero_spot = ({zero_spot_year_in}) => s2_zero_spot$m({zero_spot_year_in})
model['s2_zero_spot'] = s2_zero_spot

export const s2_disc_rate_ann_table$m = memoize(s2_disc_rate_ann_table$, ({}) => Object.values(({})).toString()); 
export const s2_disc_rate_ann_table = ({}) => s2_disc_rate_ann_table$m({})
model['s2_disc_rate_ann_table'] = s2_disc_rate_ann_table
  // from https://cdn.jsdelivr.net/npm/underscore@1.13.6/underscore-esm.js

  // Memoize an expensive function by storing its results.
  function memoize(func, hasher) {
    var memoize = function(key) {
      var cache = memoize.cache;
      var address = (hasher ? hasher.apply(this, arguments) : key); // DN removed forced string coersion, undo?
      if (!has$1(cache, address)) cache[address] = func.apply(this, arguments);
      return cache[address];
    };
    memoize.cache = {};
    return memoize;
  }

  // Internal function to check whether `key` is an own property name of `obj`.
function has$1(obj, key) {
  return obj != null && Object.prototype.hasOwnProperty.call(obj, key);
}


export const s1_premium_rate = s2_premium_rate; model['s1_premium_rate'] = s1_premium_rate;
export const s1_mort_rate_ = s2_mort_rate_; model['s1_mort_rate_'] = s1_mort_rate_;
export const s1_zero_spot = s2_zero_spot; model['s1_zero_spot'] = s1_zero_spot


export const premium_rate = s1_premium_rate; model['premium_rate'] = premium_rate; ;
export const mort_ratew = s1_mort_rate_; model['mort_ratew'] = mort_ratew; ;
export const zero_spot = s1_zero_spot; model['zero_spot'] = zero_spot; ;
export const t = s1_t; model['t'] = t; ;
export const age_at_entry = s1_age_at_entry; model['age_at_entry'] = age_at_entry; ;
export const sex = s1_sex; model['sex'] = sex; ;
export const policy_term = s1_policy_term; model['policy_term'] = policy_term; ;
export const policy_count = s1_policy_count; model['policy_count'] = policy_count; ;
export const sum_assured = s1_sum_assured; model['sum_assured'] = sum_assured; ;
export const duration_mth = s1_duration_mth; model['duration_mth'] = duration_mth; ;
export const duration_mth_0 = s1_duration_mth_0; model['duration_mth_0'] = duration_mth_0; ;
export const duration = s1_duration; model['duration'] = duration; ;
export const age = s1_age; model['age'] = age; ;
export const claim_pp = s1_claim_pp; model['claim_pp'] = claim_pp; ;
export const mort_rate_select_index = s1_mort_rate_select_index; model['mort_rate_select_index'] = mort_rate_select_index; ;
export const zero_decrement_experience = s1_zero_decrement_experience; model['zero_decrement_experience'] = zero_decrement_experience; ;
export const mort_rate_mth = s1_mort_rate_mth; model['mort_rate_mth'] = mort_rate_mth; ;
export const lapse_ratew = s1_lapse_rate_; model['lapse_ratew'] = lapse_ratew; ;
export const lapse_rate_mth = s1_lapse_rate_mth; model['lapse_rate_mth'] = lapse_rate_mth; ;
export const timing = s1_timing; model['timing'] = timing; ;
export const pols_if_init = s1_pols_if_init; model['pols_if_init'] = pols_if_init; ;
export const pols_if_at = s1_pols_if_at; model['pols_if_at'] = pols_if_at; ;
export const pols_lapse = s1_pols_lapse; model['pols_lapse'] = pols_lapse; ;
export const pols_maturity = s1_pols_maturity; model['pols_maturity'] = pols_maturity; ;
export const pols_new_biz = s1_pols_new_biz; model['pols_new_biz'] = pols_new_biz; ;
export const pols_death = s1_pols_death; model['pols_death'] = pols_death; ;
export const premium_ppw = s1_premium_pp_; model['premium_ppw'] = premium_ppw; ;
export const expense_acqw = s1_expense_acq_; model['expense_acqw'] = expense_acqw; ;
export const expense_maintw = s1_expense_maint_; model['expense_maintw'] = expense_maintw; ;
export const inflation_ratew = s1_inflation_rate_; model['inflation_ratew'] = inflation_ratew; ;
export const inflation_rate_mth = s1_inflation_rate_mth; model['inflation_rate_mth'] = inflation_rate_mth; ;
export const inflation_factor = s1_inflation_factor; model['inflation_factor'] = inflation_factor; ;
export const premiums = s1_premiums; model['premiums'] = premiums; ;
export const claims = s1_claims; model['claims'] = claims; ;
export const expenses = s1_expenses; model['expenses'] = expenses; ;
export const commissions = s1_commissions; model['commissions'] = commissions; ;
export const commission_mthsw = s1_commission_mths_; model['commission_mthsw'] = commission_mthsw; ;
export const commission_pcw = s1_commission_pc_; model['commission_pcw'] = commission_pcw; ;
export const net_cfw = s1_net_cf_; model['net_cfw'] = net_cfw; ;
export const proj_len = s1_proj_len; model['proj_len'] = proj_len; ;
export const is_active = s1_is_active; model['is_active'] = is_active; ;
export const pols_if = s1_pols_if; model['pols_if'] = pols_if; ;
export const net_premium_ppw = s1_net_premium_pp_; model['net_premium_ppw'] = net_premium_ppw; ;
export const premium_rate_per_millew = s1_premium_rate_per_mille_; model['premium_rate_per_millew'] = premium_rate_per_millew; ;
export const disc_rate_annw = s1_disc_rate_ann_; model['disc_rate_annw'] = disc_rate_annw; ;
export const disc_rate_mth = s1_disc_rate_mth; model['disc_rate_mth'] = disc_rate_mth; ;
export const disc_factor = s1_disc_factor; model['disc_factor'] = disc_factor; ;
export const pv_claims = s1_pv_claims; model['pv_claims'] = pv_claims; ;
export const pv_premiums = s1_pv_premiums; model['pv_premiums'] = pv_premiums; ;
export const pv_expenses = s1_pv_expenses; model['pv_expenses'] = pv_expenses; ;
export const pv_commissions = s1_pv_commissions; model['pv_commissions'] = pv_commissions; ;
export const pv_net_cf = s1_pv_net_cf; model['pv_net_cf'] = pv_net_cf; ;
export const pv_pols_ifw = s1_pv_pols_if_; model['pv_pols_ifw'] = pv_pols_ifw; ;
export const pv_fut_claims = s1_pv_fut_claims; model['pv_fut_claims'] = pv_fut_claims; ;
export const pv_fut_premiums = s1_pv_fut_premiums; model['pv_fut_premiums'] = pv_fut_premiums; ;
export const pv_fut_expenses = s1_pv_fut_expenses; model['pv_fut_expenses'] = pv_fut_expenses; ;
export const pv_fut_commissions = s1_pv_fut_commissions; model['pv_fut_commissions'] = pv_fut_commissions; ;
export const pv_fut_net_cf = s1_pv_fut_net_cf; model['pv_fut_net_cf'] = pv_fut_net_cf; ;
export const pv_fut_pols_if = s1_pv_fut_pols_if; model['pv_fut_pols_if'] = pv_fut_pols_if; 






////////// defaults (imports above tho): ////

export const commission_mths = s0_commission_mths; model['commission_mths'] = commission_mths;
export const commission_pc = s0_commission_pc; model['commission_pc'] = commission_pc;
export const lapse_rate_factor_delay = s0_lapse_rate_factor_delay; model['lapse_rate_factor_delay'] = lapse_rate_factor_delay;
export const lapse_rate_factor = s0_lapse_rate_factor; model['lapse_rate_factor'] = lapse_rate_factor;
export const original_lapse_rates = s0_original_lapse_rates; model['original_lapse_rates'] = original_lapse_rates;
export const lapse_rate = s0_lapse_rate; model['lapse_rate'] = lapse_rate;
export const inflation_rate_addition = s0_inflation_rate_addition; model['inflation_rate_addition'] = inflation_rate_addition;
export const inflation_rate = s0_inflation_rate; model['inflation_rate'] = inflation_rate;
export const expenses_factor = s0_expenses_factor; model['expenses_factor'] = expenses_factor;
export const expense_maint = s0_expense_maint; model['expense_maint'] = expense_maint;
export const expense_acq = s0_expense_acq; model['expense_acq'] = expense_acq;
export const stress_delay = s0_stress_delay; model['stress_delay'] = stress_delay;
export const mort_rate_factor_delay = s0_mort_rate_factor_delay; model['mort_rate_factor_delay'] = mort_rate_factor_delay;
export const mort_rate_factor = s0_mort_rate_factor; model['mort_rate_factor'] = mort_rate_factor;
export const mort_rate_Y1_add_per_mille = s0_mort_rate_Y1_add_per_mille; model['mort_rate_Y1_add_per_mille'] = mort_rate_Y1_add_per_mille;
export const mort_rate_addition = s0_mort_rate_addition; model['mort_rate_addition'] = mort_rate_addition;
export const loading_prem = s0_loading_prem; model['loading_prem'] = loading_prem;
export const gender_neutral_pricing = s0_gender_neutral_pricing; model['gender_neutral_pricing'] = gender_neutral_pricing;
export const update_pricing_lapse_rates = s0_update_pricing_lapse_rates; model['update_pricing_lapse_rates'] = update_pricing_lapse_rates;
export const pricing_projection = s0_pricing_projection; model['pricing_projection'] = pricing_projection;
export const net_premium_pp = s0_net_premium_pp; model['net_premium_pp'] = net_premium_pp;
export const premium_rate_per_mille = s0_premium_rate_per_mille; model['premium_rate_per_mille'] = premium_rate_per_mille;
export const pv_pols_if = s0_pv_pols_if; model['pv_pols_if'] = pv_pols_if;
export const premium_payment_frequency = s0_premium_payment_frequency; model['premium_payment_frequency'] = premium_payment_frequency;
export const premium_period = s0_premium_period; model['premium_period'] = premium_period;
export const premium_due = s0_premium_due; model['premium_due'] = premium_due;
export const premium_pp = s0_premium_pp; model['premium_pp'] = premium_pp;
export const a = s0_a; model['a'] = a;
export const b = s0_b; model['b'] = b;
export const c = s0_c; model['c'] = c;
export const mort_rate_recalc = s0_mort_rate_recalc; model['mort_rate_recalc'] = mort_rate_recalc;
export const mort_rate = s0_mort_rate; model['mort_rate'] = mort_rate;
export const discounting_on = s0_discounting_on; model['discounting_on'] = discounting_on;
export const disc_rate_ann = s0_disc_rate_ann; model['disc_rate_ann'] = disc_rate_ann;
export const premium_pp_0 = s0_premium_pp_0; model['premium_pp_0'] = premium_pp_0;
export const status = s0_status; model['status'] = status;
export const net_cf = s0_net_cf; model['net_cf'] = net_cf;
export const placeholder = s0_placeholder; model['placeholder'] = placeholder;
export const placeholder2 = s0_placeholder2; model['placeholder2'] = placeholder2;
export const pv_placeholder = s0_pv_placeholder; model['pv_placeholder'] = pv_placeholder;
export const pv_placeholder2 = s0_pv_placeholder2; model['pv_placeholder2'] = pv_placeholder2;
export const policy_value = s0_policy_value; model['policy_value'] = policy_value


model['s0_commission_mths$'] = s0_commission_mths$;
model['s0_commission_pc$'] = s0_commission_pc$;
model['s0_lapse_rate_factor_delay$'] = s0_lapse_rate_factor_delay$;
model['s0_lapse_rate_factor$'] = s0_lapse_rate_factor$;
model['s0_original_lapse_rates$'] = s0_original_lapse_rates$;
model['s0_lapse_rate$'] = s0_lapse_rate$;
model['s0_inflation_rate_addition$'] = s0_inflation_rate_addition$;
model['s0_inflation_rate$'] = s0_inflation_rate$;
model['s0_expenses_factor$'] = s0_expenses_factor$;
model['s0_expense_maint$'] = s0_expense_maint$;
model['s0_expense_acq$'] = s0_expense_acq$;
model['s0_stress_delay$'] = s0_stress_delay$;
model['s0_mort_rate_factor_delay$'] = s0_mort_rate_factor_delay$;
model['s0_mort_rate_factor$'] = s0_mort_rate_factor$;
model['s0_mort_rate_Y1_add_per_mille$'] = s0_mort_rate_Y1_add_per_mille$;
model['s0_mort_rate_addition$'] = s0_mort_rate_addition$;
model['s0_loading_prem$'] = s0_loading_prem$;
model['s0_gender_neutral_pricing$'] = s0_gender_neutral_pricing$;
model['s0_update_pricing_lapse_rates$'] = s0_update_pricing_lapse_rates$;
model['s0_pricing_projection$'] = s0_pricing_projection$;
model['s0_net_premium_pp$'] = s0_net_premium_pp$;
model['s0_premium_rate_per_mille$'] = s0_premium_rate_per_mille$;
model['s0_pv_pols_if$'] = s0_pv_pols_if$;
model['s0_premium_payment_frequency$'] = s0_premium_payment_frequency$;
model['s0_premium_period$'] = s0_premium_period$;
model['s0_premium_due$'] = s0_premium_due$;
model['s0_premium_pp$'] = s0_premium_pp$;
model['s0_a$'] = s0_a$;
model['s0_b$'] = s0_b$;
model['s0_c$'] = s0_c$;
model['s0_mort_rate_recalc$'] = s0_mort_rate_recalc$;
model['s0_mort_rate$'] = s0_mort_rate$;
model['s0_discounting_on$'] = s0_discounting_on$;
model['s0_disc_rate_ann$'] = s0_disc_rate_ann$;
model['s0_premium_pp_0$'] = s0_premium_pp_0$;
model['s0_status$'] = s0_status$;
model['s0_net_cf$'] = s0_net_cf$;
model['s0_placeholder$'] = s0_placeholder$;
model['s0_placeholder2$'] = s0_placeholder2$;
model['s0_pv_placeholder$'] = s0_pv_placeholder$;
model['s0_pv_placeholder2$'] = s0_pv_placeholder2$;
model['s0_policy_value$'] = s0_policy_value$;
model['s1_t$'] = s1_t$;
model['s1_age_at_entry$'] = s1_age_at_entry$;
model['s1_sex$'] = s1_sex$;
model['s1_policy_term$'] = s1_policy_term$;
model['s1_policy_count$'] = s1_policy_count$;
model['s1_sum_assured$'] = s1_sum_assured$;
model['s1_duration_mth$'] = s1_duration_mth$;
model['s1_duration_mth_0$'] = s1_duration_mth_0$;
model['s1_duration$'] = s1_duration$;
model['s1_age$'] = s1_age$;
model['s1_claim_pp$'] = s1_claim_pp$;
model['s1_mort_rate_select_index$'] = s1_mort_rate_select_index$;
model['s1_zero_decrement_experience$'] = s1_zero_decrement_experience$;
model['s1_mort_rate_mth$'] = s1_mort_rate_mth$;
model['s1_lapse_rate_$'] = s1_lapse_rate_$;
model['s1_lapse_rate_mth$'] = s1_lapse_rate_mth$;
model['s1_timing$'] = s1_timing$;
model['s1_pols_if_init$'] = s1_pols_if_init$;
model['s1_pols_if_at$'] = s1_pols_if_at$;
model['s1_pols_lapse$'] = s1_pols_lapse$;
model['s1_pols_maturity$'] = s1_pols_maturity$;
model['s1_pols_new_biz$'] = s1_pols_new_biz$;
model['s1_pols_death$'] = s1_pols_death$;
model['s1_premium_pp_$'] = s1_premium_pp_$;
model['s1_expense_acq_$'] = s1_expense_acq_$;
model['s1_expense_maint_$'] = s1_expense_maint_$;
model['s1_inflation_rate_$'] = s1_inflation_rate_$;
model['s1_inflation_rate_mth$'] = s1_inflation_rate_mth$;
model['s1_inflation_factor$'] = s1_inflation_factor$;
model['s1_premiums$'] = s1_premiums$;
model['s1_claims$'] = s1_claims$;
model['s1_expenses$'] = s1_expenses$;
model['s1_commissions$'] = s1_commissions$;
model['s1_commission_mths_$'] = s1_commission_mths_$;
model['s1_commission_pc_$'] = s1_commission_pc_$;
model['s1_net_cf_$'] = s1_net_cf_$;
model['s1_proj_len$'] = s1_proj_len$;
model['s1_is_active$'] = s1_is_active$;
model['s1_pols_if$'] = s1_pols_if$;
model['s1_net_premium_pp_$'] = s1_net_premium_pp_$;
model['s1_premium_rate_per_mille_$'] = s1_premium_rate_per_mille_$;
model['s1_disc_rate_ann_$'] = s1_disc_rate_ann_$;
model['s1_disc_rate_mth$'] = s1_disc_rate_mth$;
model['s1_disc_factor$'] = s1_disc_factor$;
model['s1_pv_claims$'] = s1_pv_claims$;
model['s1_pv_premiums$'] = s1_pv_premiums$;
model['s1_pv_expenses$'] = s1_pv_expenses$;
model['s1_pv_commissions$'] = s1_pv_commissions$;
model['s1_pv_net_cf$'] = s1_pv_net_cf$;
model['s1_pv_pols_if_$'] = s1_pv_pols_if_$;
model['s1_pv_fut_claims$'] = s1_pv_fut_claims$;
model['s1_pv_fut_premiums$'] = s1_pv_fut_premiums$;
model['s1_pv_fut_expenses$'] = s1_pv_fut_expenses$;
model['s1_pv_fut_commissions$'] = s1_pv_fut_commissions$;
model['s1_pv_fut_net_cf$'] = s1_pv_fut_net_cf$;
model['s1_pv_fut_pols_if$'] = s1_pv_fut_pols_if$;
model['s2_age_at_entry_$'] = s2_age_at_entry_$;
model['s2_policy_term_$'] = s2_policy_term_$;
model['s2_premium_rate$'] = s2_premium_rate$;
model['s2_premium_table$'] = s2_premium_table$;
model['s2_age_$'] = s2_age_$;
model['s2_mort_rate_select_index_$'] = s2_mort_rate_select_index_$;
model['s2_mort_rate_$'] = s2_mort_rate_$;
model['s2_mort_table$'] = s2_mort_table$;
model['s2_zero_spot_year$'] = s2_zero_spot_year$;
model['s2_zero_spot$'] = s2_zero_spot$;
model['s2_disc_rate_ann_table$'] = s2_disc_rate_ann_table$;

