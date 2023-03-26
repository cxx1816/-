<template>
  <!-- action:上传地址(此属性必须写)
    show-file-list：文件上传的列表(标签下出现已上传成功的文件名等) false不要
    on-success:文件上传成功的钩子(回调右侧的函数执行，组件内会给我们传值)
        前端->后端action地址(成功)
    before-upload：文件上传之前的钩子(函数内return false或者reject拒绝Promise对象)
    upload组件内就会停止往后端上传文件(主要作用：上传前的一个判断)
 -->
  <el-upload
    class="avatar-uploader"
    action="https://jsonplaceholder.typicode.com/posts/"
    :show-file-list="false"
    :on-success="handleAvatarSuccess"
    :before-upload="beforeAvatarUpload"
    :http-request="customRequestFn"
  >
    <!-- 看imageUrl里有图片地址了，就显示图片，否则显示+号 -->
    <img v-if="imageUrl" :src="imageUrl" class="avatar">
    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
    <el-progress v-show="showProgress" type="circle" :percentage="percentage" class="progress"></el-progress>
  </el-upload>
</template>

<script>
var COS = require('cos-js-sdk-v5')
var cos = new COS({
  SecretId: '腾讯云存储桶ID',
  SecretKey: '腾讯云存储桶key'
})
// 明确目标：找组件，用组件，读组件，改组件
export default {
  data() {
    return {
      imageUrl: '', // 上传成功的图片地址(外链)
      showProgress: false, // 环形进度条
      percentage: 0 // 上传进度(0~100数字)
    }
  },
  methods: {
    // 文件上传成功到后台，后的回调函数
    handleAvatarSuccess(res, file) {
    // res:后端返回的响应数据(upload内部自带Ajax请求，不会走你的request.js(axios))
    // file:前端本地磁盘里，上传到浏览器里的这个文件对象信息
    // Object URL Array Map Set 等等都是JS内置的对象(无需声明直接使用)
    // URL.createObjectURL()方法，此方法会把文件数据，转成blob：临时前端地址
    // 可以用于img临时加载此前端的文件在浏览器上img标签中显示
    // 文件 -> 图片本地临时地址

      // 知识点1：img标签的src属性(值：图片的base64字符串，外链地址，相对地址，blob临时地址)
      // 知识点2：想要做图片的预览
      //   思路1：上传文件到服务器端，让后端返回图片在服务端外链地址，加载给img标签src做图片预览(必须上传成功)
      //   思路2：纯前端(无需上传到服务器)，图片文件显示到页面上(URL.createObjectURL())
      this.imageUrl = URL.createObjectURL(file.raw)
    },
    // upload上传图片到后台，前的一个判断函数
    beforeAvatarUpload(file) {
    // file 本地上传到浏览器上文件对象
    // file.type 传递的这个文件类型(值有几种固定格式，mime媒体类型)
    // 'image/jpeg' -> jpeg结尾的文件图片 'image/png' -> png结尾的文件图片
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    // upload自定义上传过程
    customRequestFn(obj) {
      this.showProgress = true
      cos.putObject({
        Bucket: 'cuixinxin-1317335468', /* 填写自己的 bucket，必须字段 */
        Region: 'ap-nanjing', /* 存储桶所在地域，必须字段 */
        Key: obj.file.name, /* 必须(图片本身的名字，存储桶里面文件名-唯一标识)*/
        StorageClass: 'STANDARD', // 存储的类型(标准)
        Body: obj.file, // 上传文件对象
        onProgress: (progressData) => { // 进度
          // progressData.percent -> 进度(0-1)数字
          this.percentage = parseInt(progressData.percent * 100)
        }
      }, (err, data) => {
        if (err) {
          console.log('上传失败', err)
        } else {
          console.log('上传成功')
        }
        this.imageUrl = 'http://' + data.Location
        setTimeout(() => {
          this.showProgress = false
        }, 1000)
      })
    }
  }
}
</script>

<style>
.avatar-uploader .el-upload {
  position: relative;
  overflow: hidden;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
}

.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}

.avatar-uploader-icon {
  width: 178px;
  height: 178px;
  color: #8c939d;
  font-size: 28px;
  line-height: 178px;
  text-align: center;
}

.avatar {
  display: block;
  width: 178px;
  height: 178px;
}

.progress {
  position: absolute;
  top: 50%;
  left: 50%;
  display: flex;
  background: #e4e4e4;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  opacity: 0.9;
}
</style>
