module.exports = {
    extends: "amex",
    ignorePatterns: [
        "build/",
    ],
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
    },
    rules: {
        'unicorn/prevent-abbreviations': 'off',
    },
};
