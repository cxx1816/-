<template>
  <div class="login-setting">
    <el-form
      ref="userForm"
      :model="userInfo"
      :rules="rules"
      label-width="120px"
      style=" margin-top: 30px;margin-left: 120px"
    >
      <el-form-item label="姓名:" prop="username">
        <el-input v-model="userInfo.username" style="width:300px" />
      </el-form-item>

      <el-form-item label="密码:" prop="password">
        <el-input v-model="userInfo.password" type="password" style="width:300px" />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="updateFn">更新</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getUserPhotoAPI, updateEmployeesAPI } from '@/api'
export default {
  name: 'LoginSetting',
  data() {
    return {
      userInfo: {
        username: '',
        password: ''
      },
      rules: {
        username: [{ required: true, message: '用户名不能为空', trigger: 'blur' }],
        password: [{ required: true, message: '密码不能为空', trigger: 'blur' }]
      }
    }
  },
  created() {
    // 获取用户信息
    this.getUserInfoFn()
  },
  methods: {
    async getUserInfoFn() {
    // this.$route拿到的是当前路由页面的信息对象
    // 此组件嵌入在detail页面的，所以可以拿到detail页面路由信息对象
      const res = await getUserPhotoAPI(this.$route.query.id)
      this.userInfo = res.data
    },
    // 更新按钮
    updateFn() {
      this.$refs.userForm.validate(async valid => {
        if (valid) {
          const res = await updateEmployeesAPI(this.userInfo)
          this.$message.success(res.message)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped></style>
