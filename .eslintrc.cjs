module.exports = { // from declann/calculang-miscellaneous-models
    env: {
      browser: true,
      es2021: true,
      node: true,
    },
    //"extends": "eslint:recommended",
    parserOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    //ignorePatterns: ['**/*.cul.js'], // how to ignore bundles? or just add define as a global?
    rules: {
      'no-undef': ['error'/*, { "globals": { "define": "readonly" } }*/], // some version of eslint don't like the global define !
      'no-restricted-syntax': [
        'error',
        {
          message: "calculang: don't pollute the _ namespace",
          selector:
            'ImportDeclaration[source.value=/cul_scope_/] > ImportSpecifier[local.name=/_$/]',
          // converted to esm => match cul_scope_x rather than .cul
        },
      ],
    },
  };
  