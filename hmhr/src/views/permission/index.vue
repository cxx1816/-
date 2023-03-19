<template>
  <div class="permission-container">
    <div class="app-container">
      <page-tools>
        <template #slot-right>
          <el-button type="primary" size="small" @click="addPermissionFn(1,'0')">添加权限</el-button>
        </template>
      </page-tools>

      <!-- 表格 -->
      <el-card class="card">
        <el-table border :data="allPermissionList" row-key="id">
          <el-table-column label="名称" prop="name" />
          <el-table-column label="标识" prop="code" />
          <el-table-column label="描述" prop="description" />
          <el-table-column label="操作">
            <template v-slot="{row}">
              <el-button v-if="row.type === 1" type="text" @click="addPermissionFn(2,row.id)">添加</el-button>
              <el-button type="text" @click="editPermissionFn(row.id)">编辑</el-button>
              <el-button type="text" @click="delPermissionFn(row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>

      <!-- 添加权限点弹窗 -->
      <per-dialog ref="perDialog" :is-edit="isEdit" :permission-list="permissionList" @addPerEv="addPerFn"></per-dialog>
    </div>
  </div>
</template>

<script>
import { getPermissionListAPI, addPermissionAPI, getPermissionDetailAPI, updatePermissionAPI, delPermissionAPI } from '@/api'
import { transTree } from '@/utils'
import PerDialog from './components/perDialog.vue'
export default {
  components: {
    PerDialog
  },
  data() {
    return {
      allPermissionList: [], // 所有权限点对象数组(树形的)
      permissionList: [], // 所有权限点(扁平的)
      isEdit: false // 添加/编辑权限点
    }
  },
  created() {
    // 获取所有权限点列表
    this.getPermissionListFn()
  },
  methods: {
    // 获取所有权限点列表
    async getPermissionListFn() {
      const res = await getPermissionListAPI()
      this.permissionList = res.data
      // transTree内部在查找的时候，参数2，要传递父级id(递归找子对象)
      // 目标：为了让pid为'0'的对象，在数组里第一层
      this.allPermissionList = transTree(res.data, '0')
    },

    // 点击添加->权限点弹窗出现
    // type:右上角按钮传下来1，页面权限点右侧添加，传下来2(type值作为新对象的type使用)
    // pid:右上角传下来'0',页面权限点右侧添加点击，传下来这行id值(pid也是要给新对象pid使用)
    addPermissionFn(type, pid) {
      this.isEdit = false
      this.$refs.perDialog.showDialog = true // 弹窗出现
      this.$refs.perDialog.formData.type = type
      this.$refs.perDialog.formData.pid = pid
      // 表单组件弹框里组件对象，添加2个值(其他4个值表单里用户输入)
    },

    // 执行添加权限点逻辑
    async addPerFn(formData) { // 编辑
      if (this.isEdit) {
        await updatePermissionAPI(formData)
      } else {
        await addPermissionAPI(formData)
      }
      this.getPermissionListFn()
    },

    // 编辑权限点 ->点击事件
    async editPermissionFn(perId) {
      this.isEdit = true
      this.$refs.perDialog.showDialog = true // 共用一个弹窗 出现
      const res = await getPermissionDetailAPI(perId)
      this.$refs.perDialog.formData = res.data
    },

    // 删除权限点->点击事件
    async delPermissionFn(perId) {
      await delPermissionAPI(perId)
      this.getPermissionListFn()
    }
  }
}
</script>

<style lang="scss" scoped>
.card{
  margin-top: 10px;
}
</style>
