import eslintPluginAstro from 'eslint-plugin-astro';

export default [
  // -------------------
  // 除外ファイル
  // -------------------
  {
    ignores: ['.astro/**', 'dist/**'],
  },

  // -------------------
  // Astro
  // -------------------
  // add more generic rule sets here, such as:
  // js.configs.recommended,
  ...eslintPluginAstro.configs.recommended,
  {
    rules: {
      // override/add rules settings here, such as:
      // "astro/no-set-html-directive": "error"
    },
  },
];
