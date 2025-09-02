// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt({
  rules: {
    '@stylistic/comma-dangle': 'off',
    '@stylistic/quote-props': 'off',
    '@stylistic/arrow-parens': 'off',
    '@stylistic/member-delimiter-style': 'off',
    '@stylistic/brace-style': 'off',
    '@stylistic/operator-linebreak': 'off',
    '@stylistic/indent-binary-ops': 'off',

    // Vue specific rules
    'vue/comma-dangle': 'off',
    'vue/max-attributes-per-line': 'off',
    'vue/component-name-in-template-casing': ['error', 'PascalCase'],
    'vue/multi-word-component-names': 'off',
    'vue/no-multiple-template-root': 'off',
    'vue/no-reserved-component-names': 'off',
    'vue/no-v-html': 'off',
    'vue/singleline-html-element-content-newline': 'off',
    'vue/attribute-hyphenation': ['error', 'always'],
    'vue/v-on-event-hyphenation': ['error', 'always'],
    'vue/html-self-closing': 'off',

    // Import rules
    'import/order': [
      'error',
      {
        groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'object', 'type'],
        'newlines-between': 'always',
        alphabetize: {
          order: 'asc',
          caseInsensitive: true
        }
      }
    ],
    'import/no-extraneous-dependencies': 'off',
    'import/no-unresolved': 'off',
    'import/newline-after-import': ['error', { count: 1 }],

    // Environment specific rules
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',

    // General rules
    'no-underscore-dangle': 'off',
    'require-await': 'error'
  }
})
