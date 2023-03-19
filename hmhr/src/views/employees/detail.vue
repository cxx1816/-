<template>
  <div class="employees-container">
    <div class="app-container">
      <el-card>
        <el-tabs>
          <el-tab-pane label="登录账户设置">
            <login-setting></login-setting>
          </el-tab-pane>
          <el-tab-pane label="个人详情">
            <user-info></user-info>
          </el-tab-pane>
          <el-tab-pane label="岗位信息">
            <job-info></job-info>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
  </div>
</template>

<script>
import LoginSetting from './detail/login-setting.vue'
import UserInfo from './detail/user-info.vue'
import JobInfo from './detail/job-info.vue'
export default {
  components: {
    LoginSetting,
    UserInfo,
    JobInfo
  }
}
</script>
