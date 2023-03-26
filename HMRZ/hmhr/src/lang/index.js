import Vue from 'vue'
import VueI18n from 'vue-i18n'
// ElementUI的中英文语言包引入
// 语言包：对象
// 相同的key(键)名，对应的对象(值，不同的语言包，对应值不同)
import enLocale from 'element-ui/lib/locale/lang/en'
import zhLocale from 'element-ui/lib/locale/lang/zh-CN'

Vue.use(VueI18n)

// 通过选项创建 VueI18n 实例
const i18n = new VueI18n({
  locale: 'zh', // 设置地区
  messages: { // 设置地区信息
    en: {
      navbar: {
        companyName: 'Jiangsu Chuanzhi podcast Education Technology Co., Ltd',
        name: '{name}'
      },
      sidebar: {
        dashboard: 'Dashboard',
        approvals: 'Approvals',
        departments: 'Departments',
        employees: 'employees',
        permissions: 'Permissions',
        attendances: 'Attendances',
        salarys: 'Salarys',
        settings: 'Company-Settings',
        social_securitys: 'Social'
      },
      ...enLocale,
      message: {
        hello: 'hello world'
      }
    },
    zh: {
      navbar: {
        companyName: '江苏传智播客教育科技股份有限公司',
        name: '{name}'
      },
      sidebar: {
        dashboard: '首页',
        approvals: '审批',
        departments: '组织架构',
        employees: '员工',
        permissions: '权限',
        attendances: '考勤',
        salarys: '工资',
        settings: '公司设置',
        social_securitys: '社保'
      },
      ...zhLocale,
      message: {
        hello: '你好、世界'
      }
    }
  }
})

// vueI18n内部的工作原理
// 1.会给vue原型上添加$t方法
// 2.我们自己业务vue文件中，文字部分都要换成$t方法，然后在方法中传入要获取的对象的属性值路径字符串
// 3.$t方法内，会根据locale的值，去message里面取出对应环境的语言对象，然后再拼接本次寻找值对象属性的路径，找到对应的值返回到$t函数位置

export default i18n
