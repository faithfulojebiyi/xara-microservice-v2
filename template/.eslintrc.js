module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true
  },
  extends: [
    'standard'
  ],
  globals: {
    logger: 'readonly',
    describe: 'readonly',
    it: 'readonly',
    before: 'readonly'
  },
  parserOptions: {
    ecmaVersion: 12
  },
  rules: {
    camelcase: 0,
    'valid-jsdoc': [
      'error',
      {
        requireReturn: true,
        requireReturnType: true,
        requireParamDescription: false,
        requireReturnDescription: true
      }
    ],
    'require-jsdoc': [
      'error',
      {
        require: {
          FunctionDeclaration: true,
          MethodDefinition: true,
          ClassDeclaration: true
        }
      }
    ]
  }
}
