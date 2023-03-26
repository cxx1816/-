module.exports = {
  extends: [
    'stylelint-config-standard',
    'stylelint-config-standard-scss',
    'stylelint-config-rational-order'
  ],
  overrides: [
    // 扫描.vue/html文件中的<style>标签内的样式
    {
      files: ['**/*.{vue,html}'],
      customSyntax: 'postcss-html'
    }
  ],
  // 覆盖配置（优先级大于config-standard）
  rules: {
     //配置空格数
    indentation: 2,
    "selector-class-pattern": null,
    "scss/dollar-variable-pattern": null,
    "no-empty-source": null,
    "no-descending-specificity": null,
    "scss/at-mixin-pattern": null,
    "no-duplicate-selectors": null,
    "scss/double-slash-comment-empty-line-before": null,
    "selector-pseudo-class-no-unknown": null,
    "scss/dollar-variable-empty-line-before": null,
    "property-no-unknown": null,
    "keyframes-name-pattern":null,
  }
}
