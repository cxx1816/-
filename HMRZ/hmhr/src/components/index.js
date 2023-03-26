import PageTools from '@/components/PageTools'
import UploadImg from '@/components/UploadImg'
import ImageHolder from '@/components/ImageHolder'
import Lang from '@/components/Lang'
import ScreenFull from '@/components/ScreenFull'

export default { // 导出插件对象
  install(Vue) {
    Vue.component('PageTools', PageTools)
    Vue.component('UploadImg', UploadImg)
    Vue.component('ImageHolder', ImageHolder)
    Vue.component('Lang', Lang)
    Vue.component('ScreenFull', ScreenFull)
  }
}

// 导出的方式
// export 变量声明 -> import { 名一致 }

// export default 导出
// import 变量名
