module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
  },
  extends: 'airbnb-base',
  overrides: [
    {
      env: {
        node: true,
      },
      files: [
        '.eslintrc.{js,cjs}',
      ],
      parserOptions: {
        sourceType: 'script',
      },
      rules: {
        'linebreak-style': 0,
      },
    },
  ],
  parserOptions: {
    ecmaVersion: 'latest',
  },
  rules: {
  },
};
