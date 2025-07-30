const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ['dist/*'],
  },
  {
    // Enable Jest env only for test files (any file inside __tests__ or ending with .test.js or .spec.js)
    files: ['**/__tests__/**/*.js', '**/*.test.js', '**/*.spec.js'],
    env: {
      jest: true,
    },
    // Optional: You can add jest plugin here for jest-specific linting rules
    plugins: ['jest'],
    extends: ['plugin:jest/recommended'],
  },
]);
