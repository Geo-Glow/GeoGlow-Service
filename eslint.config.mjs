import globals from 'globals';
import pluginJs from '@eslint/js';
import pluginPrettier from 'eslint-plugin-prettier';
import configPrettier from 'eslint-config-prettier';

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
    {
        files: ['**/*.js'],
        languageOptions: {
            sourceType: 'commonjs',
        },
        rules: {
            // Additional custom rules can be added here
        },
    },
    {
        languageOptions: {
            globals: globals.node,
        },
    },
    pluginJs.configs.recommended,
    {
        plugins: {
            prettier: pluginPrettier,
        },
        rules: {
            // Enable Prettier as an ESLint rule
            'prettier/prettier': 'error',
        },
    },
    // Disable rules conflicting with Prettier
    configPrettier,
];
