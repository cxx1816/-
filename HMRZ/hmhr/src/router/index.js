import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'
import dashboard from './modules/dashboard'
import approvalsRouter from './modules/approvals'
import departmentsRouter from './modules/departments'
import employeesRouter from './modules/employees'
import permissionRouter from './modules/permissions'
import attendancesRouter from './modules/attendances'
import salarysRouter from './modules/salarys'
import settingRouter from './modules/settings'
import socialRouter from './modules/social'

// 动态路由表，项目中不同的用户可以访问不同的功能
export const asyncRoutes = [
  dashboard,
  departmentsRouter,
  settingRouter,
  employeesRouter,
  permissionRouter,
  approvalsRouter,
  attendancesRouter,
  salarysRouter,
  socialRouter
]

export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: 'dashboard' }
    }]
  },
  {
    path: '/excel',
    component: Layout,
    children: [
      {
        path: '',
        component: () => import('@/views/excel')
      }
    ]
  }

  // { path: '*', redirect: '/404', hidden: true }

]

const createRouter = () =>
  new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    // routes: [...asyncRoutes, ...constantRoutes]
    routes: [...constantRoutes]
  })

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
  // 重置的是路由对象内部match方法(匹配routes选项中的路由规则的)
  // match里会使用newRouter里routes一起代替掉了
}

export default router
