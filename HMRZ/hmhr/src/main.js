import Vue from 'vue'

import 'normalize.css/normalize.css' // 清除默认css样式的包

import ElEMENT from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import '@/styles/index.scss' // 全局 css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // 路由守卫

Vue.use(
  ElEMENT,
  // 配置Element语言转换关系
  // 每个组件都会调用一次
  { i18n: (key, value) => i18n.t(key, value) }
  // 组件内容处，使用的相关参数和值
  // key:el.pagination.total(好比是要查找语言包的属性路径)
  // value:对应要传入的值{total:10}
  // i18n.t 好比Vue组件$t
  // key就是去语言包环境找到对应的中文，value就是要传入的值，会替换掉{}位置，换成对应值在原地显示
) // 只是为了注册ElementUI组件(语言一会和Vuei18n集成)

// 全局注册，所有的页面都可以使用PageTools这个组件
// import PageTools from '@/components/PageTools'
// Vue.component('PageTools', PageTools)

// Vue.use()执行对象里install方法，在方法内使用vue.component注册了全局组件
// 问题：为何用use里包裹component方法，而不在外面写
// 原因：可以直接引入后，调用内置准备好的方法+全部注册的代码(使用者方便)

// 全局自定义组件
import GlobalComponentObj from '@/components'
Vue.use(GlobalComponentObj)

// 引入语言对象
import i18n from '@/lang'

// 注册全局指令
import powerObj from '@/directives/power.js'
Vue.directive('power', powerObj)

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App)
})
