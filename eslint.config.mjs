// eslint.config.mjs - Modern ESLint Flat Configuration
import reactPlugin from 'eslint-plugin-react';

export default [
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/build/**',
      '**/coverage/**',
      '**/.neon/**',
      '**/scratch/**',
      '**/output/**',
      '**/*.webm',
      '**/*.mp4'
    ]
  },
  {
    files: ['**/*.js', '**/*.jsx', '**/*.mjs'],
    plugins: {
      react: reactPlugin
    },
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        }
      }
    },
    settings: {
      react: {
        version: '18.3'
      }
    },
    rules: {
      'react/jsx-uses-vars': 'error',
      'react/jsx-uses-react': 'off',
      'react/react-in-jsx-scope': 'off',
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      'no-console': 'off',
      'eqeqeq': ['error', 'always'],
      'no-var': 'error',
      'prefer-const': 'error',
      'no-duplicate-imports': 'error'
    }
  }
];
