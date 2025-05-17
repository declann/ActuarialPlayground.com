// Not comprehensive testing: todo

import { expect, describe, it } from 'vitest';
import { resolve } from 'node:path';

import { compile } from '@calculang/standalone/index.js';

import { readFile } from 'fs/promises';

const cwd = import.meta.dirname;

describe('basicterm.cul.js testing', async () => {
  const m = await compile({
    entrypoint: 'entry.cul.js',
    fs: {
      'entry.cul.js': await readFile('./src/cul/basicterm.cul.js', 'utf8'),
      './basicterm-tables.cul.js': await readFile('./src/cul/basicterm-tables.cul.js', 'utf8')
    },
    memo: true
  });

  it('compiles to a tracked JS bundle', async () => {
    await expect(m.bundle).toMatchFileSnapshot('./bundles/basicterm.bundle.js');
  });

  it('and values for first basicterm model point matches lifelib results', async () => {
    let cursor = {
      duration_mth_in: 1,
      age_at_entry_in: 47,
      sex_in: 'M',
      policy_term_in: 10,
      sum_assured_in: 622000,
      policy_count_in: 86,
      t_in: 0,
      timing_in: 'BEF_NB',
    }

    await expect({
      pv_fut_net_cf: m.js.pv_fut_net_cf(cursor),
      pv_fut_premiums: m.js.pv_fut_premiums(cursor),
      pv_fut_claims: m.js.pv_fut_claims(cursor),
      pv_fut_expenses: m.js.pv_fut_expenses(cursor),
      pv_fut_commissions: m.js.pv_fut_commissions(cursor)
    }).toMatchFileSnapshot('./results/basicterm-mp-1.result.json');

    // 3rd model point (first female)
    cursor = {
      duration_mth_in: 15,
      age_at_entry_in: 51,
      sex_in: 'F',
      policy_term_in: 10,
      sum_assured_in: 799000,
      policy_count_in: 83,
      t_in: 0,
      timing_in: 'BEF_NB',
    }

    await expect({
      pv_fut_net_cf: m.js.pv_fut_net_cf(cursor),
      pv_fut_premiums: m.js.pv_fut_premiums(cursor),
      pv_fut_claims: m.js.pv_fut_claims(cursor),
      pv_fut_expenses: m.js.pv_fut_expenses(cursor),
      pv_fut_commissions: m.js.pv_fut_commissions(cursor)
    }).toMatchFileSnapshot('./results/basicterm-mp-3.result.json');
  });
})
