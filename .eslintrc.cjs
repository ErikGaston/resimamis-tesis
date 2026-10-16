/**
 * Config mínima y deliberada: el objetivo es atajar errores que el build de Vite
 * no ve —identificadores inexistentes, imports muertos, hooks mal usados— y no
 * imponer estilo. Formato y comillas quedan fuera a propósito: no hay Prettier.
 */
module.exports = {
  root: true,
  env: { browser: true, es2022: true, node: true },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    // @vitejs/plugin-react usa el runtime automático: no hace falta React en scope.
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
  ],
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  settings: { react: { version: 'detect' } },
  ignorePatterns: ['dist', 'node_modules', 'resimamis', '.eslintrc.cjs'],
  rules: {
    // Sin TypeScript ni PropTypes en el repo: validar props acá es solo ruido.
    'react/prop-types': 'off',
    // Textos en español con apóstrofes y comillas dentro del JSX.
    'react/no-unescaped-entities': 'off',
    // Con el runtime automático `import React` queda sin uso en ~78 archivos. Son
    // imports borrables, pero sacarlos es churn mecánico: se ignoran para que el
    // resto de los no-usados queden visibles.
    'no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^(_|React$)' }],
  },
};
