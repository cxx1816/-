<template>
  <!-- trigger 是下拉菜单的触发时机
    @command自定义事件(检测菜单项的点击行为)
-->

  <el-dropdown trigger="click" @command="changeLanguage">
    <!-- 第一个子标签是上来就显示的标签 -->
    <div>
      <svg-icon style="color:#fff;font-size:20px" icon-class="language" />
    </div>
    <!-- 就会出现真正的下拉菜单项 -->
    <el-dropdown-menu slot="dropdown">
      <!-- command点击时，传入给@command事件里参数
      $i18n是Vue.use(Vuei18n)添加给Vue原型的全局属性，通过它可以拿到i18n里locale环境的英文标识('zh'/'en')
       -->
      <el-dropdown-item command="zh" :disabled="'zh'=== $i18n.locale ">中文</el-dropdown-item>
      <el-dropdown-item command="en" :disabled="'en'=== $i18n.locale ">English</el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
export default {
  methods: {
    // 下拉菜单项点击事件
    // lang的值就是"zh" "en"
    changeLanguage(lang) {
      this.$i18n.locale = lang // 设置给本地的i18n插件
      this.$message.success('切换多语言成功')
    }
  }
}
</script>
