import router from './router'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar styles
import store from '@/store'
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration
const whiteList = ['/login', '/404'] // 白名单：无需登录，可以跳转查看的路由地址(在路由表里)

router.beforeEach(async(to, from, next) => {
  NProgress.start()
  const token = store.getters.token
  // 登录了 ->不能去登录页
  // 非登录 ->只能去登录页
  if (token) { // 登录了
    if (to.path === '/login') {
      // 中断要跳转/login这次导航，重新跳转到/(首页)
      next('/')
      NProgress.done()
    } else { // 去别的页面
      next() // 如果手动让cookie里改错误刷新以后，vuex才会从本地取出错误的token
      // 刷新时，路由守卫会从/跳转到地址栏里路由地址，所以先让页面跳转进去
      // 执行下面请求会401，被动退出时，才能拿到跳转后的路由地址(未遂地址给登录页面，否则next在下面，未遂地址一直是/)
      if (!store.getters.name) { store.dispatch('user/getUserInfoActions') }
    }
  } else { // 没有登录
    if (whiteList.includes(to.path)) { // 要去的路由地址字符串是否在白名单数组里出现过，出现过就放行
      next()
    } else { // 去别的页面(内部项目，不登录别的页面不能去)
      next('/login')
      NProgress.done()
    }
  }
})
// 验证：把本地cookie里的token手动删除掉，刷新，看看是否走最后一个false内

router.afterEach((to, from) => {
  // 正常next()放行了跳转了，才会走后置守卫，关闭正常流程进度条
  document.title = getPageTitle(to.meta.title)
  NProgress.done()
})
