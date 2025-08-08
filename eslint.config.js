import { defineConfig } from 'eslint/config'
import vue from 'eslint-plugin-vue'
import vueParser from 'vue-eslint-parser'
import js from '@eslint/js'
import importPlugin from 'eslint-plugin-import'
import nodePlugin from 'eslint-plugin-node'
import prettierPlugin from 'eslint-plugin-prettier'
import prettierConfig from 'eslint-config-prettier'
import globals from 'globals'
import babelParser from '@babel/eslint-parser'

export default defineConfig([
  // JS & Vue Script 部分
  {
    files: ['**/*.{js,mjs,cjs,vue}'],
    languageOptions: {
      parser: babelParser,
      parserOptions: {
        requireConfigFile: false,
        babelOptions: {
          presets: ['@babel/preset-env'],
        },
        sourceType: 'module',
        ecmaVersion: 'latest',
      },
      globals: globals.browser,
    },
    plugins: {
      js,
      import: importPlugin,
      node: nodePlugin,
      prettier: prettierPlugin,
    },
    extends: [
      'plugin:import/recommended',
      'plugin:node/recommended',
      'plugin:prettier/recommended',
      'js', // @eslint/js 的 recommended 设置
      prettierConfig,
    ],
    rules: {
      'prettier/prettier': 'error', // prettier 错误作为 ESLint 错误
      'import/order': [
        'warn',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index',
          ],
          'newlines-between': 'always',
        },
      ],
      'node/no-unsupported-features/es-syntax': 'off', // 允许 ESModules
    },
  },

  // Vue 文件部分
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
      globals: globals.browser,
    },
    plugins: {
      vue,
      prettier: prettierPlugin,
    },
    extends: [
      'plugin:vue/vue3-recommended',
      'plugin:prettier/recommended',
      prettierConfig,
    ],
    rules: {
      'vue/multi-word-component-names': 'off',
      'vue/no-v-html': 'off',
      'prettier/prettier': 'error',
    },
  },
])
