import Layout from '@/layout'
export default {
  path: '/permissions', // 权限
  component: Layout,
  children: [
    {
      path: '',
      name: 'Permissions',
      component: () => import('@/views/permissions'),
      meta: { title: '权限管理', icon: 'lock' }
    }
  ]
}

