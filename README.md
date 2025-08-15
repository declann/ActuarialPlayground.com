# ActuarialPlayground.com

Source code for [Actuarial Playground](https://actuarialplayground.com).

- calculang model code is in [./src/cul](./src/cul)

- Visualization, arquero transformations, and codemirror editor pieces are in [./src/components](./src/components).

- Notebook/reactive JS in `index.md` and `TEMPLATE_x.md`.

Also includes testcases in [./test](./test), including static bundle build
  - some tests track bundles: will probably remove this
  - other test compares BasicTerm output; the outputs match the Python model and this must always pass (but is a spot check rather than complete check)

## uses..

- calculang standalone compiler in calculangs experimental branches
- [calcudata](https://github.com/calculang/calculang/blob/f9535c01c2421b0422178ea02f658f1b066c6b45/packages/calcudata/src/index.js#L61) API providing output in arquero format


## calculang model

Some technical notes in the Actuarial Playground UI under '?' tab. (TODO: make this link-able)

## Build Instructions

- `npm install`
- `npm run build`

## Test Instructions

`npm run test` - very minimal tests

## Benchmark Instructions

`npm run bench`

**Among other developments, I've tested very significant performance improvements relating to Actuarial modelling in calculang - feel free to reach out if this is of interest.**

## license

Code in this repository is free software licensed under the [GNU Affero General Public License Version 3](LICENSE).