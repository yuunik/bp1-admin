import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import pluginImport from 'eslint-plugin-import'
import pluginNode from 'eslint-plugin-node'
import pluginPrettier from 'eslint-plugin-prettier'
import configPrettier from 'eslint-config-prettier'
import vueParser from 'vue-eslint-parser'
import globals from 'globals'

export default [
  // 1. 全局忽略
  {
    ignores: ['dist/**', 'node_modules/**', 'public/**', '**/*.d.ts'],
  },

  // 2. JS 推荐配置
  js.configs.recommended,

  // 3. Vue 推荐配置
  ...pluginVue.configs['flat/recommended'],

  // 4. Prettier 配置 (关闭冲突规则)
  configPrettier,

  // 5. 通用配置
  {
    files: ['**/*.{js,mjs,cjs,vue}'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021,
      },
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    plugins: {
      import: pluginImport,
      node: pluginNode,
      prettier: pluginPrettier,
    },
    rules: {
      'prettier/prettier': 'error',
      'import/first': 'error',
      'import/no-duplicates': 'error',
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
      'node/no-unsupported-features/es-syntax': 'off',
      'node/no-missing-import': 'off',
      'vue/multi-word-component-names': 'off',
      'vue/no-v-html': 'off',
    },
  },

  // 6. Vue 文件解析器配置
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        // 移除 Babel，直接让 vue-parser 处理 script
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
  },
]
