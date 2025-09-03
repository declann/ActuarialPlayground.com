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


import { premium_rate, mort_rate, zero_spot } from './basicterm-tables.cul.js'


// time in months, >=0 is future, <0 is past
export const t = () => t_in

// 'model point' inputs
export const age_at_entry = () => age_at_entry_in
export const sex = () => sex_in
export const policy_term = () => policy_term_in
export const policy_count = () => policy_count_in ?? 1
export const sum_assured = () => sum_assured_in


// duration_mth_in is a model point input: the duration "now" since policy started (or 0 for a New Business projection)
// but duration_mth() is the duration at t since policy started
export const duration_mth = () => duration_mth_in + t();

// duration "now" since policy started, just for convenience:
export const duration_mth_0 = () => duration_mth({ t_in: 0 })

// duration since policy started, in years:
export const duration = () => Math.floor(duration_mth() / 12);

export const age = () => age_at_entry() + duration()

// AMOUNT TO PAY ON CLAIM is determed by claim_pp formula

// It's used to project claims cashflows And in the claims projection to calculate premiums (see playground.cul.js `premium_rate_per_mille`)

// for level term assurance, we use a flat sum assured:
export const claim_pp = () => sum_assured()

// for reducing term assurance, switch to this for a straight-line reduction:
//export const claim_pp = () => sum_assured() * (1 - duration() / policy_term())

// For a mortgage protection-type decrease, we can directly import from a simple-loan calculang model

//import { balance } from "https://calculang.dev/models/simple-loan/simple-loan.cul.js"
//export const claim_pp = () => balance({ principal_in: sum_assured(), i_in: 10 /100, year_in: duration(), term_in: policy_term() })

// This is an example of model composition: calculang models can use other models
// and an every-day URL is an effective way to share and re-use models and logic (also workings)



// mortality rates, using mort_rate() from basicterm-tables.cul.js

export const mort_rate_select_index = () => Math.max(0, Math.min(5, duration())) // used to lookup mort_rate table

// I can hoist this change to playground.cul.js, but it provides context for pols_if_at behaviour here
export const zero_decrement_experience = () => zero_decrement_experience_in ?? true // todo consider without this?

export const mort_rate_mth = () => {
  if (t() < 0 && zero_decrement_experience()) return 0;
  return 1 - (1 - mort_rate()) ** (1 / 12)
}

// lapse rates
// tihs formula can get updated in the UI:
export const lapse_rate = () => Math.max(0.1 - 0.02 * duration(), 0.02)

export const lapse_rate_mth = () => { // factored from pols_lapse
  if (t() < 0 && zero_decrement_experience()) return 0;
  return (1 - (1 - lapse_rate()) ** (1 / 12))
}


// policy survival/decrement projections

export const timing = () => timing_in

export const pols_if_init = () => policy_count()

// BasicTerm_SE wants to project in force data at some date, into the future: it doesn't care about past cashflows.
// In the Playground I want to show past cashflows.
// So I disable a condition below that inits policies in BasicTerm_SE
// The condition that inits policies here is the one that adds pols_new_biz()
// TODO paramaterise this behaviour incl. checks and illustrate pols_if_at timing and logic

export const pols_if_at = () => {
  if (is_active() == 0) return 0
  if (timing() == 'BEF_MAT') {
    if (t() == 0 && pols_if_init() && 0 /* DN: disabling */)
      return pols_if_init();
    return pols_if_at({ t_in: t() - 1, timing_in: 'BEF_DECR' }) - pols_lapse({ t_in: t() - 1 }) - pols_death({ t_in: t() - 1 })
  }
  if (timing() == 'BEF_NB') {
    return pols_if_at({ timing_in: 'BEF_MAT' }) - pols_maturity()
  }
  if (timing() == 'BEF_DECR') return pols_if_at({ timing_in: 'BEF_NB' }) + pols_new_biz()
  return console.error('bad timing_in !')
}

export const pols_lapse = () => is_active() ? (pols_if_at({ timing_in: 'BEF_DECR' }) - pols_death()) * lapse_rate_mth() : 0


// refactor for stress and experience logic


export const pols_maturity = () => {
  if (duration_mth() == policy_term() * 12)
    return pols_if_at({ timing_in: 'BEF_MAT' })
  else return 0
}

export const pols_new_biz = () => {
  if (duration_mth() == 0)
    return policy_count()
  else return 0
}

export const pols_death = () => is_active() ? pols_if_at({ timing_in: 'BEF_DECR' }) * mort_rate_mth() : 0;

// monthly
export const premium_pp = () => Math.round(sum_assured() / 1000 * premium_rate_per_mille() * 100) / 100 // round 2 decimal places


export const expense_acq = () => 300
export const expense_maint = () => 60

export const inflation_rate = () => 0.01
export const inflation_rate_mth = () => (1 + inflation_rate()) ** (1 / 12) - 1

export const inflation_factor = () => (1 + inflation_rate()) ** (t() / 12)

// cashflows:

export const premiums = () => premium_pp() * pols_if_at({ timing_in: 'BEF_DECR' })
export const claims = () => -claim_pp() * pols_death()

// acquisition expenses are not affected by inflation (questionable but consistent with BasicTerm_S https://lifelib.io/_modules/basiclife/BasicTerm_S/Projection.html#expenses)
export const expenses = () => -(expense_acq() * pols_new_biz() + pols_if_at({ timing_in: 'BEF_DECR' }) * expense_maint() / 12 * inflation_factor())
export const commissions = () => (duration_mth() < commission_mths()) ? (-premiums() * commission_pc() / 100) : 0

export const commission_mths = () => 12
export const commission_pc = () => 100

// careful: manipulation in net_cf not captured in Playground outputs!
export const net_cf = () => premiums() + claims() + expenses() + commissions()


export const proj_len = () => Math.max(12 * policy_term() - duration_mth({ t_in: 0 }) + 1, 0)

// todo think re actuals (new)
export const is_active = () => !(duration_mth() < 0 || duration_mth() > policy_term() * 12)

export const pols_if = () => pols_if_at(/*{ timing_in: 'BEF_MAT' }*/);
// pols_if in lifelib BasicTerm_S uses BEF_MAT timing, but there pols_if isn't actually used.
// Where pols_if is used is in the premium calculation (via net_premium_pp), and I want Playground premium calculations to reconcile precisely to basicterm premium rates.
// Those premium rates are documented in this notebook: https://lifelib.io/libraries/basiclife/create_premium_table.html
// which uses the BasicTerm_M model. (M models *seem* to be less intentional about timing)
// In Playground, using BEF_DECR timing gets me to reconcile premium rates precisely.
// Leaving timing free here: I specify the timing in premium_rate_per_mille formula in playground.cul.js

export const net_premium_pp = () => {
  return -pv_fut_claims({ t_in: 0, duration_mth_in: 0 }) / pv_fut_pols_if({ t_in: 0, duration_mth_in: 0 })
}

export const premium_rate_per_mille = () =>
  premium_rate() * 1000; // uses table from basicterm-tables.cul.js



// Discounting factor calculation
// derived from zero_spot() from basicterm-tables.cul.js

export const disc_rate_ann = () => {
  if (t() <= 0) return 0;
  else return zero_spot({ zero_spot_year_in: Math.floor(t() / 12) })
}

export const disc_rate_mth = () => (1 + disc_rate_ann()) ** (1 / 12) - 1

export const disc_factor = () => (1 + disc_rate_mth()) ** (-t())


// Present Value calculations
// In 2 parts so that pv_x can conveniently visualise discounted cashflows over time
// (or not discounted depending on switch in playground.cul.js)
// Future cashflows accumulated in pv_fut_x

// This code is repetitive but it's easily generated.
// It's unsightly but it can be separated from other modelling logic.

// 1. pv_x is the present value is month t
export const pv_claims = () => claims() * disc_factor()
export const pv_premiums = () => premiums() * disc_factor()
export const pv_expenses = () => expenses() * disc_factor()
export const pv_commissions = () => commissions() * disc_factor()
export const pv_net_cf = () => net_cf() * disc_factor()
export const pv_pols_if = () => pols_if() * disc_factor() // BasicTerm_M, for pricing table calc reconciliation

// 2. pv_fut_x is sum of future present values >= t:
export const pv_fut_claims = () => {
  if (t() >= proj_len()) return 0
  return (pv_fut_claims({ t_in: t() + 1 }) + pv_claims())
}

export const pv_fut_premiums = () => {
  if (t() >= proj_len()) return 0
  return (pv_fut_premiums({ t_in: t() + 1 }) + pv_premiums())
}

export const pv_fut_expenses = () => {
  if (t() >= proj_len()) return 0
  return (pv_fut_expenses({ t_in: t() + 1 }) + pv_expenses())
}

export const pv_fut_commissions = () => {
  if (t() >= proj_len()) return 0
  return (pv_fut_commissions({ t_in: t() + 1 }) + pv_commissions())
}

export const pv_fut_net_cf = () => {
  if (t() >= proj_len()) return 0
  return (pv_fut_net_cf({ t_in: t() + 1 }) + pv_net_cf())
}

export const pv_fut_pols_if = () => {
  if (t() >= proj_len()) return 0
  return (pv_fut_pols_if({ t_in: t() + 1 }) + pv_pols_if())
}

// not ported: check_pv_net_cf


