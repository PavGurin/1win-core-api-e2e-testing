module.exports = {
    env: {
        browser: true,
        es6: true,
        jest: true
    },
    extends: 'airbnb-base',
    globals: {
        socket: true,
        defaultCountry: true,
        defaultPassword: true,
        defaultPartnerKey: true,
        defaultVisitDomain: true,
        transferExpirationTime: true,
        Atomics: 'readonly',
        SharedArrayBuffer: 'readonly'
    },
    parserOptions: {
        ecmaVersion: 2018,
        sourceType: 'module'
    },
    rules: {
        'no-plusplus': 'off',
        camelcase: 'off',
        'import/prefer-default-export': 'off',
        'no-unused-vars': 'off',
        'no-unused-expressions': 'off',
    }
};
