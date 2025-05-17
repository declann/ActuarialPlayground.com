// Not comprehensive testing: todo

import { expect, describe, it } from 'vitest';
import { resolve } from 'node:path';

import { compile } from '@calculang/standalone/index.js';

import { readFile } from 'fs/promises';

const cwd = import.meta.dirname;

describe('playground.cul.js testing', async () => {
  const m = await compile({
    entrypoint: 'entry.cul.js',
    fs: {
      'entry.cul.js': await readFile('./src/cul/playground.cul.js', 'utf8'),
      './basicterm.cul.js': await readFile('./src/cul/basicterm.cul.js', 'utf8'),
      './basicterm-tables.cul.js': await readFile('./src/cul/basicterm-tables.cul.js', 'utf8')
    },
    memo: true
  });

  it('compiles to a tracked JS bundle', async () => {
    await expect(m.bundle).toMatchFileSnapshot('./bundles/playground.bundle.js');
  });

  // todo more tests
})
