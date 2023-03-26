import router, { asyncRoutes } from './router'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar styles
import store from '@/store'
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration
const whiteList = ['/login', '/404'] // 白名单：无需登录，可以跳转查看的路由地址(在路由表里)

// 问题：为何动态路由添加后，在动态路由地址上会刷新404？
// 前提1：刷新时，所有代码重新执行，回归初始化
// 前提2：刷新时，路由会从/跳转到浏览器地址栏所在路由地址(走一次路由守卫代码)
// 动态的还未添加，所以404了

// 问题：右上角退出登录+重新登录，进入到首页时，网页刷新不?
// 网页本身不刷新的，完全依赖路由业务场景的切换(单页面应用好处：用户的体验更好，切换业务场景更快)
// 内存路由表，之前添加的筛选后路由规则对象还在不?(在)
// 问题2：为何重新登录，路由定义重复了?
// 退出登录的时候把token和用户信息清除了
// 登录的时候，先获取到token保存到vuex和本地，然后才是路由跳转，才执行路由守卫(所以判断token有值)
// 但是用户信息没有，重新请求，再添加一遍筛选后的路由对象，所以导致了路由重复

// 解决：退出登录的时候，让路由也回归初始化

// 问题：什么是路由(导航)守卫?
// 答案：当路由发生跳转的时候，会触发有一个钩子"函数"，在函数中可以通过跳转或取消或强制切换跳转地址来守卫导航
// 路由守卫里必须要有一个next()调用，出口，让路由页面跳转
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
      if (!store.getters.name) {
        const menus = await store.dispatch('user/getUserInfoActions')
        // 用menus权限点英文字符串，和路由规则对象name匹配
        // 把所有准备好的8个路由规则对象，取出，看看名字和menus里是否匹配，匹配就证明
        // 此登录的用户有这个页面的访问权限，让filter收集此路由规则对象到新数组里
        const filterList = asyncRoutes.filter(routeObj => {
          const routeName = routeObj.children[0].name.toLowerCase()
          return menus.includes(routeName)
        })

        filterList.push({ path: '*', redirect: '/404', hidden: true })

        // 始终都动态路由先添加8个路由规则对象
        // 知识点:路由切换匹配的路由规则对象数组存在于内存中
        // new Router时，有一些初始的路由规则对象
        // addRoutes，会给路由表，再额外的增加一个规则对象
        // 现象：路由规则对象添加成功，但是左侧的导航不见了
        router.addRoutes(filterList)

        // 给vuex里也同步一份
        store.commit('permission/setRoutes', filterList)

        // 路由在跳转一次，因为上面next()会导致白屏(因为放行时，动态路由还没有加入到内存中路由表里)
        // 添加完，立刻在跳转一次
        next({
          path: to.path,
          replace: true // 不让回退，类似this.$router.replace()
        })
      }
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
