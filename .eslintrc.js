module.exports = {
    root: true,
    env: {
        browser: true,
        es2021: true,
        jest: true,
        node: true,
    },
    extends: [
        'eslint:recommended',
        'plugin:react/recommended',
        'plugin:react-hooks/recommended',
        'plugin:jsx-a11y/recommended',
    ],
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
        ecmaVersion: 'latest',
        sourceType: 'module',
    },
    plugins: [
        'react',
        'react-hooks',
        'jsx-a11y',
    ],
    rules: {
        // Reglas generales
        'no-console': ['warn', { allow: ['warn', 'error'] }],
        'no-unused-vars': 'warn',
        'prefer-const': 'warn',

        // Reglas de React
        'react/prop-types': 'off', // Desactivamos PropTypes ya que usaremos TypeScript en el futuro
        'react/react-in-jsx-scope': 'off', // No es necesario en React 17+
        'react/jsx-filename-extension': ['warn', { extensions: ['.jsx'] }],
        'react/jsx-uses-react': 'off',

        // Reglas de hooks
        'react-hooks/rules-of-hooks': 'error',
        'react-hooks/exhaustive-deps': 'warn',

        // Reglas de accesibilidad
        'jsx-a11y/anchor-is-valid': 'warn',
    },
    settings: {
        react: {
            version: 'detect',
        },
    },
};
