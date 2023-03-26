import Layout from '@/layout'
export default {
  path: '/social', // 社保
  component: Layout,
  children: [
    {
      path: '',
      name: 'social_securitys',
      component: () => import('@/views/social'),
      meta: { title: '社保', icon: 'table' }
    }
  ]
}

