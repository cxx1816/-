import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
// if (process.env.NODE_ENV === 'production') {
//   const { mockXHR } = require('../mock')
//   mockXHR()
// }

// set ElementUI lang to EN
// Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
Vue.use(ElementUI)

// 全局注册，所有的页面都可以使用PageTools这个组件
// import PageTools from '@/components/PageTools'
// Vue.component('PageTools', PageTools)

// Vue.use()执行对象里install方法，在方法内使用vue.component注册了全局组件
// 问题：为何用use里包裹component方法，而不在外面写
// 原因：可以直接引入后，调用内置准备好的方法+全部注册的代码(使用者方便)

import GlobalComponentObj from '@/components'
Vue.use(GlobalComponentObj)

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
