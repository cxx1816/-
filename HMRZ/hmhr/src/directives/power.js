import store from '@/store'

export default { // 自定义指令规则对象
  inserted(el, binding) { // 自定义指令固定名字配置项inserted(指令所在标签，第一次被插入到真实DOM网页上的时候，此函数自动执行)
    // 参数1：指令所在的标签(原生)
    // 参数2：指令关联的信息对象(包含给指令传入的值)

    const points = store.state.user.userInfo.roles.points // 按钮权限点英文字符串数组['import','export',...]
    if (!points.includes(binding.value)) {
      // 标签传入的标记，在当前登录的这个用户按钮权限点数组里没有找到
      // 就要把这个标签移除掉
      el.parentNode.removeChild(el)
    }
  }
}
