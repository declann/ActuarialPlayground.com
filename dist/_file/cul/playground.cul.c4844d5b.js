// for a high-level overview, see the '?' tab

import {
  all_cul,
  mort_rate_ as mort_rate_orig,
  lapse_rate_ as lapse_rate_orig,
  disc_rate_ann_ as disc_rate_ann_orig,
  premium_pp_ as premium_pp_orig,
  net_cf_ as net_cf_orig,
  pv_pols_if_ as pv_pols_if_orig,
  duration_mth
} from './basicterm.cul.js';


// PARAMETERS FOR CONTROLS AND STRESSES

// in basicterm.cul.js some things are hardcoded,
// in the Playground we want to change them:

export const commission_mths = () => commission_mths_in
export const commission_pc = () => commission_pc_in

// there are other new inputs below that are also stressed

// experience functionality for mortality and lapses is in basicterm.cul.js
// see mort_rate_mth and lapse_rate_mth


export const lapse_rate_factor_delay = () => stress_delay()
export const lapse_rate_factor = () => lapse_rate_factor_in ?? 1

// we use this optionally for pricing basis, see premium_rate_per_mille
export const original_lapse_rates = () => original_lapse_rates_in ?? false

export const lapse_rate = () => {
  if (t() < lapse_rate_factor_delay()) return original_lapse_rates() ? Math.max(0.1 - 0.02 * duration(), 0.02) : lapse_rate_orig();
  else return lapse_rate_factor() * (original_lapse_rates() ? Math.max(0.1 - 0.02 * duration(), 0.02) : lapse_rate_orig());
}

export const inflation_rate_addition = () => inflation_rate_addition_in ?? 0;

export const inflation_rate = () => {
  if (t() < stress_delay()) return inflation_rate_in;
  else return inflation_rate_in + inflation_rate_addition()
}

export const expenses_factor = () => expenses_factor_in ?? 1

// incl. configurable expenses
export const expense_maint = () => {
  if (t() < stress_delay()) return expense_maint_in;
  else return expense_maint_in * expenses_factor() // additives can go here
}
export const expense_acq = () => {
  if (t() < stress_delay()) return expense_acq_in;
  else return expense_acq_in * expenses_factor()
}



// stressing mortality and lapse rates

export const stress_delay = () => stress_delay_in ?? 0

export const mort_rate_factor_delay = () => stress_delay()
export const mort_rate_factor = () => mort_rate_factor_in ?? 1;

export const mort_rate_Y1_add_per_mille = () => mort_rate_Y1_add_per_mille_in ?? 0

export const mort_rate_addition = () => {
  if (t() < (12 + stress_delay()))
    return mort_rate_Y1_add_per_mille() / 1000
  else return 0
}


// INFLATION BEHAVIOUR

// inflation factor
// basicterm.cul.js starts inflation at t=0 i.e. "now".
// Playground starts inflation from the start of the policy (t=-duration_mth_0())
// Unlike lapses and mortality no experience effect (b/c =expected basis for t<0)
export const inflation_factor = () => {
  if (t() < -duration_mth_0()) return inflation_factor({ t_in: t() + 1 }) / (1 + inflation_rate_mth())
  if (t() == -duration_mth_0()) return 1;
  else return inflation_factor({ t_in: t() - 1 }) * (1 + inflation_rate_mth())
}




// PRICING

export const loading_prem = () => loading_prem_in ?? 0.5

export const gender_neutral_pricing = () => gender_neutral_pricing_in ?? true

export const update_pricing_lapse_rates = () => update_pricing_lapse_rates_in ?? false

export const premium_rate_per_mille = () =>
   (1 + loading_prem())
        * net_premium_pp({ /* 1000e sum assured projection with pricing config and no stresses, and discounting always on */ sum_assured_in: 1000, original_lapse_rates_in: !update_pricing_lapse_rates(), discounting_on_in: true, sex_in: gender_neutral_pricing() ? 'F' : sex(), timing_in: 'BEF_DECR',  stress_delay_in: 12 * 120, lapse_rate_factor_in: 1, mort_rate_factor_in:1, mort_rate_Y1_add_per_mille_in:0 });


export const pv_pols_if = () => pv_pols_if_orig() * premium_due() // used by net_premium_pp via pv_fut_pols_if


// DIFFERENT PREMIUM FREQUENCIES

export const premium_payment_frequency = () => premium_payment_frequency_in ?? "M" // or "single"

export const premium_period = () => {
  switch (premium_payment_frequency()) {
    case "Y":
      return 12
    case "Q":
      return 3
    case "H":
      return 6
    default:
      return 1
  }
}

export const premium_due = () => {
  if (premium_payment_frequency() == "single")
    return t() == -duration_mth_0()
  if (duration() != duration({ t_in: t() - 1 })) return 1
  if (duration_mth() % premium_period() == 0) return 1
  else return 0
}

export const premium_pp = () => {
  if (!premium_due()) return 0
  return premium_pp_orig()
}

// MORTALITY RATE RECALC

export const a = () => 0.0002
export const b = () => 0.00025
export const c = () => 2.2


// parameterised mortality formula from https://github.com/lifelib-dev/lifelib/blob/main/lifelib/libraries/basiclife/basic_term_sample.xlsx
// Male mortality uplift added for Playground (basicterm does't have M/F rates) (but not necessarily used in premium projection: see `gender_neutral_pricing`)
export const mort_rate_recalc = () => Math.min(1, Math.min(1, a() * Math.exp(b() * Math.pow(age(), c()))) * Math.pow(1.1, mort_rate_select_index())) * (sex() == 'M' ? 1.2 : 1)

export const mort_rate = () => {
  if (t() < mort_rate_factor_delay()) return mort_rate_recalc()
  else return mort_rate_recalc() * mort_rate_factor() + mort_rate_addition() // note: added after factor on overall assumption
}





// DISCOUNTING CONTROL

export const discounting_on = () => discounting_on_in ?? true

export const disc_rate_ann = () => {
  if (!discounting_on()) return 0
  else return disc_rate_ann_orig()
}



// MISCEL

export const premium_pp_0 = () => premium_pp({ t_in: -duration_mth_0() }) // to show the premium
export const status = () => duration_mth_0() == 0 ? 'New Business' : 'In Force'





// PLACEHOLDER CASHFLOWS FOR PLAYGROUND CUSTOMIZATION:

// spares let you add new cashflows: they are 0, but you can change them below
// careful: manipulation in net_cf not captured in Playground outputs!
export const net_cf = () => net_cf_orig() + placeholder() + placeholder2();

export const placeholder = () => 0 // placeholder1 will be visualized green
export const placeholder2 = () => 0 // placeholder2 will be visualized purpley


// we must have PVs to visualize. Even if discounting is off, this is what the visualization uses
// (when discounting)
export const pv_placeholder = () => disc_factor() * placeholder()
export const pv_placeholder2 = () => disc_factor() * placeholder2()

