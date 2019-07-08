module.exports = {
    env: {
        browser: true,
        es6: true,
        mocha: true
    },
    extends: 'airbnb-base',
    globals: {
        socket: true,
        defaultCountry: true,
        defaultPassword: true,
        defaultPartnerKey: true,
        defaultVisitDomain: true,
        Atomics: 'readonly',
        SharedArrayBuffer: 'readonly'
    },
    parserOptions: {
        ecmaVersion: 2018,
        sourceType: 'module'
    },
    rules: {
        'no-plusplus': 'off',
        'no-unused-vars': 'off',
        'no-unused-expressions': 'off',
        'no-return-await': 'off',
        'no-await-in-loop': 'off',
        camelcase: 'warn',
        'import/prefer-default-export': 'off'
    }
};
