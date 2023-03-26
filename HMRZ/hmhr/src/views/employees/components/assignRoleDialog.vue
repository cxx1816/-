<template>
  <div>
    <!-- 渲染角色列表 -->
    <!--checkbox标签内容如果无，就用label属性值作为按钮后介绍
        当checkbox选中时，会把label的值添加到v-model数组里，如果未选中，就会从数组里移除

        问题：怎么让checkbox默认勾选
        答案：v-model对应数组里有一些值，(这些值会跟循环checkbox的label值配对) 配对成功，影响checkbox勾选状态
     -->
    <el-checkbox-group v-model="roleIdsList">
      <el-checkbox v-for="item in allRoleList" :key="item.id" :label="item.id">
        <span>{{ item.name }}</span>
      </el-checkbox>
    </el-checkbox-group>

    <el-row class="footer" type="flex" justify="center">
      <el-col :span="6">
        <el-button type="primary" size="small" @click="enterFn">确定</el-button>
        <el-button size="small" @click="cancelFn">取消</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'AssignRole',
  props: {
    // 所有角色列表
    allRoleList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      roleIdsList: [] // 收集选中的角色ID
    }
  },
  methods: {
    // 取消弹框
    cancelFn() {
      this.$emit('update:show', false)
    },
    // 确定弹框
    enterFn() {
      this.$emit('addRoleEV', this.roleIdsList)
      this.$emit('update:show', false)
    }
  }
}
</script>

<style lang="scss" scoped>
.footer {
  margin-top: 30px;
}
</style>
