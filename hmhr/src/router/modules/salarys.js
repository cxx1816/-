import Layout from '@/layout'
export default {
  path: '/salarys', // 薪资
  component: Layout,
  children: [
    {
      path: '',
      name: 'Salarys',
      component: () => import('@/views/salarys'),
      meta: { title: '薪资', icon: 'money' }
    }
  ]
}

