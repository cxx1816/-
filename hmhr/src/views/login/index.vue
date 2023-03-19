<template>
  <div class="login-container">
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left">
      <div class="title-container">
        <h3 class="title">
          <!-- 有的页面文字可能是图片(logo图片) -->
          <img src="@/assets/common/login-logo.png" alt="">
        </h3>
      </div>

      <el-form-item prop="mobile">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input ref="username" v-model="loginForm.mobile" placeholder="Mobile" name="mobile" type="text" tabindex="1" auto-complete="on" />
      </el-form-item>

      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input :key="passwordType" ref="password" v-model="loginForm.password" :type="passwordType" placeholder="Password" name="password" tabindex="2" auto-complete="on" @keyup.enter.native="handleLogin" />
        <span class="show-pwd" @click="showPwd">
          <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
        </span>
      </el-form-item>

      <el-button :loading="loading" type="primary" style="width: 100%; margin-bottom: 30px" class="login-btn" @click.native.prevent="handleLogin">登录 </el-button>

      <div class="tips">
        <span style="margin-right: 20px">mobile: 13800000002</span>
        <span> password: 123456</span>
      </div>

      <div>
        <button @click.prevent="testFn">测试</button>
      </div>
    </el-form>
  </div>
</template>

<script>
import { validMobile } from '@/utils/validate'
import { getUserProfileAPI } from '@/api'

export default {
  name: 'Login',
  data() {
    const validateMobile = (rule, value, callback) => {
      if (!validMobile(value)) {
        callback(new Error('请输入正确的手机号'))
      } else {
        callback()
      }
    }

    return {
      loginForm: {
        mobile: '13800000002',
        password: '123456'
      },
      loginRules: {
        mobile: [{ required: true, trigger: 'blur', validator: validateMobile }],
        password: [{ required: true, trigger: 'blur', min: 6, max: 16, message: '密码长度在6-16位之间' }]
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  methods: {
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      this.$refs.loginForm.validate(async valid => { // 表单校验
        if (valid) { // 通过 ->发起登录请求
        // 知识点1：await只能提取Promise对象成功的状态的值
        // 知识点2：await取代then()函数的，await可以把成功的值提取出来留在原地
        // 知识点3：如何捕获promise错误的状态呢？使用try+catch代码块
        // 知识点4：actions方法，无论何时都返回Promise对象(自定义的，非axios的)
        // 坑：不加await，调用登录接口的时候，这个登录异步任务无结果的时候，代码会往下走就跳转下去了(问题：密码错误了也能跳转)

          try { // 放入可能会报错的代码
            const res = await this.$store.dispatch('user/loginActions', this.loginForm)
            // await等待后面成功了，才会继续往下走
            this.$message.success(res.message)
            // 问题：拿到刚才退出登录时，回传的未遂地址的路径字符串呢？
            // 答案：this.$route.query(vue-router内会把?后面参数字符串转成对象挂载query属性上)
            // || 前面有地址就跳转回未遂页面，如果前面没有(证明是第一次登录，就用后面的值去跳转去首页)
            this.$router.replace(this.$route.query.redirect || '/')
          } catch (error) {
            // 一旦try大括号内的代码报错立刻停止try大括号里代码向下执行
            // 转而直接跳入catch大括号里执行，error形参接收的就是错误信息对象
            // 错误对象要用dir打印
            console.dir(error)
          }
        }
      })
    },
    // 测试接口
    async testFn() {
      const res = await getUserProfileAPI()
      console.log(res)
    }
  }
}
</script>

<style lang="scss">

.login-btn {
  height: 64px;
  font-size: 24px;
  line-height: 32px;
  background: #407ffe;
}

/* 修复input 背景不协调 和光标变色 */

/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #283443;
$light_gray: #68b0fe; // 将输入框颜色改成蓝色
$cursor: #68b0fe; // 将输入框光标改成蓝色

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  background-image: url('~@/assets/common/login.jpg'); // 设置背景图片
  background-position: center; // 将图片位置设置为充满整个屏幕
  .el-input {
    display: inline-block;
    width: 85%;
    height: 47px;

    input {
      height: 47px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      background: transparent;
      border: 0;
      border-radius: 0;
      appearance: none;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    color: #454545;
    background: rgb(0 0 0 / 10%);
    background: rgb(255 255 255 / 70%);
    border: 1px solid rgb(255 255 255 / 10%);
    border-radius: 5px;
  }
}

.el-form-item__error {
  font-size: 14px;
}
</style>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
  width: 100%;
  min-height: 100%;
  overflow: hidden;
  background-color: $bg;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    margin: 0 auto;
    padding: 160px 35px 0;
    overflow: hidden;
  }

  .tips {
    margin-bottom: 10px;
    color: #fff;
    font-size: 14px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    display: inline-block;
    width: 30px;
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
  }

  .title-container {
    position: relative;

    .title {
      margin: 0 auto 40px;
      color: $light_gray;
      font-weight: bold;
      font-size: 26px;
      text-align: center;
    }
  }

  .show-pwd {
    position: absolute;
    top: 7px;
    right: 10px;
    color: $dark_gray;
    font-size: 16px;
    cursor: pointer;
    user-select: none;
  }
}
</style>
