# ActuarialPlayground.com

Source code for [Actuarial Playground](https://actuarialplayground.com).

- calculang model code is in [./src/cul](./src/cul)

- Visualization, arquero transformations, and codemirror editor pieces are in [./src/components](./src/components).

- Notebook/reactive JS in `index.md` and TEMPLATE_x.md`.

Also includes testcases in [./test](./test), including static bundle build
  - some tests track bundles: will probably remove this
  - other test compares BasicTerm output; the outputs match the Python model and this must always pass (but is a spot check rather than complete check)

## uses..

- calculang standalone compiler in calculangs `all_cul` branch.
- calcudata API from same branch

## 

## calculang model

Some technical notes in the Actuarial Playground UI under '?' tab. (TODO: make this link-able)

## license

Code in this repository is free software licensed under the [GNU Affero General Public License Version 3](LICENSE).