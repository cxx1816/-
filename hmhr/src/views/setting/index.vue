<template>
  <div class="setting-container">
    <div class="app-container">
      <!-- 卡片组件 -->
      <el-card class="box-card">
        <!-- 使用 Tabs 组件完成标签页布局 -->
        <el-tabs v-model="activeName">
          <el-tab-pane label="角色管理" name="first" class="tab-pane">
            <!-- 新增角色按钮 -->
            <el-row style="height:60px">
              <el-button
                icon="el-icon-plus"
                size="small"
                type="primary"
                @click="addRoleBtnFn"
              >新增角色</el-button>
            </el-row>
            <!-- 使用 Table 组件实现用户角色的渲染 -->
            <el-table :data="rolesList" border style="width: 100%">
              <el-table-column type="index" label="序号" width="120" />
              <el-table-column prop="name" label="角色名" width="240" />
              <el-table-column prop="description" label="描述" />
              <el-table-column label="操作">
                <!-- vue2.6之前作用域插槽写法:slot-scope="scope" (vue向下兼容，以前的可以使用) -->
                <!-- vue2.6新写法 v-slot="scope变量名"
                作用域插槽scope变量值，来自于哪里呢？table-column里slot占位标签身上的属性<slot row="行数据对象"></slot>
                scope变量值：{ row：行数据对象}
                也可以写成 v-slot="scope" 或者 v-="{row}"
                为什么这里是row，之前的页面里是data，因为组件内绑定slot身上属性名不一样(具体查文档)
                 -->
                <template slot-scope="scope">
                  <el-button size="small" type="success" @click="setRoles(scope.row)">分配权限</el-button>
                  <el-button size="small" type="primary" @click="editRoles(scope.row)">编辑</el-button>
                  <el-button size="small" type="danger" @click="delRoles(scope.row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>

            <!-- 分页区域
            pagination组件，默认不关联数据，你要检测pagination组件事件，自己关联数据
            current-page：(单向)设置当前高亮页数(你赋予给他一个数字，页面上默认高亮分页数字对应)
            page-sizes：选择每页显示的条数(选择器下拉菜单)
            page-size：(单向)设置每页显示的条数
            layout：控制每个小组件是否需要，以及左右排列顺序(影响到页面)
            total：(必须)告诉分页组件，我现在有多少条数据(他内部会帮你计算页码，渲染页码标签)

            size-change：每页显示多少条，切换
            current-change：当前页码，切换
            pagination在组件源码内检测标签的点击事件/改变事件 ->回调你绑定的自定义事件处理函数执行
            -->
            <el-pagination
              :current-page="query.page"
              :page-sizes="[5, 10, 15, 20, 25]"
              :page-size="query.pagesize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            />
          </el-tab-pane>
          <el-tab-pane label="公司信息" class="tab-pane">
            <el-alert
              title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改"
              type="info"
              show-icon
              :closable="false"
            />
            <el-form label-width="120px" style="margin-top:50px">
              <el-form-item label="公司名称">
                <el-input v-model="companyObj.name" disabled style="width:400px" />
              </el-form-item>
              <el-form-item label="公司地址">
                <el-input v-model="companyObj.companyAddress" disabled style="width:400px" />
              </el-form-item>
              <el-form-item label="邮箱">
                <el-input v-model="companyObj.mailbox" disabled style="width:400px" />
              </el-form-item>
              <el-form-item label="备注">
                <el-input v-model="companyObj.remarks" type="textarea" :rows="3" disabled style="width:400px" />
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </el-card>

      <!-- 新增角色 - 弹框 -->
      <el-dialog
        :title="isEdit ?'编辑角色':'新增角色'"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :visible.sync="showDialog"
        @close="roleDialogCloseFn"
      >
        <el-form ref="roleForm" :model="roleForm" :rules="roleRules" label-width="100px">
          <el-form-item label="角色名称" prop="name">
            <el-input v-model="roleForm.name" />
          </el-form-item>
          <el-form-item label="角色描述" prop="description">
            <el-input v-model="roleForm.description" />
          </el-form-item>
        </el-form>

        <!-- 底部 -->
        <el-row slot="footer" type="flex" justify="center">
          <el-col :span="6">
            <el-button size="small" @click="cancelRoles">取消</el-button>
            <el-button size="small" type="primary" @click="roleSubmit">确定</el-button>
          </el-col>
        </el-row>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getRoleListAPI, getCompanyInfoAPI, addRoleAPI, getRoleDetailAPI, getProfileAPI, updateRoleAPI, deleteRoleAPI } from '@/api'

export default {
  data() {
    return {
      activeName: 'first',
      query: {
        page: 1, // 当前页面
        pagesize: 10 // 页面显示的条数
      },
      rolesList: [], // 角色列表
      total: 0, // 角色数据总条数
      companyObj: {}, // 公司信息
      // ...其他选项
      showDialog: false, // 控制弹框的隐藏和展示
      // 添加角色
      roleForm: {
        name: '',
        description: ''
      },
      // 添加角色验证
      roleRules: {
        name: [
          { required: true, message: '角色名称不能为空', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '角色描述不能为空', trigger: 'blur' }
        ]
      },
      isEdit: false
    }
  },
  created() {
    // 获取所有角色列表
    this.getRoleListFn()
    // 获取公司详情
    this.getCompanyDetailFn()
  },
  methods: {
    // 获取->角色所有列表
    async getRoleListFn() {
      const res = await getRoleListAPI(this.query)
      this.rolesList = res.data.rows
      this.total = res.data.total
    },
    // 获取公司详情
    async getCompanyDetailFn() {
      // 因为刷新网页，用户信息获取是在路由跳转以后，可能会让这里先执行，vuex获取信息后执行
      // 多发一次请求，自己专门获取公司的id
      const { data: { companyId }} = await getProfileAPI()
      const res = await getCompanyInfoAPI(companyId)
      this.companyObj = res.data
    },
    // 每页显示的条数发生改变时触发
    handleSizeChange(size) {
      this.query.pagesize = size
      this.getRoleListFn()
    },

    // 当前页码发生改变时触发
    handleCurrentChange(page) {
      this.query.page = page // 修改参数对象
      this.getRoleListFn() // 再次请求列表query里页码是改变后的
    },

    // 设置角色
    setRoles() {},

    // 编辑角色->点击事件
    // roleObj->行角色对象
    async editRoles(roleObj) {
      this.isEdit = true
      this.showDialog = true
      const res = await getRoleDetailAPI(roleObj.id)
      this.roleForm = res.data // 多可以，页面只用两个(其余的在变量里存着)
    },

    // 删除角色
    async delRoles(roleObj) {
      await deleteRoleAPI(roleObj.id)
      if (this.rolesList.length === 1) {
        this.query.page--
        // 假设：后台要求传递的page最小只能是1
        // 解决：判断只剩最后一条数据时，强制改回成1
        if (this.query.page === 0) {
          this.query.page = 1
        }
      }
      // 删除成功，刷新列表
      this.getRoleListFn()

      // bug:最后一页最后一个数据删除的时候，会出现问题
      // 问题：导致pagination标签页码往前走1，但是数据没有获取到前一页的
      // 原因：删除最后一条，但是调用刷新列表的query.page还是之前的页码数(后台没有这页的数据返回空数组，导致表格里暂无数据)
      // 解决：删除后，判断数组里剩余的个数，做js里page参数的修改
    },
    // 角色弹框-> 确定按钮
    roleSubmit() {
      this.$refs.roleForm.validate(async valid => {
        if (valid) {
          if (this.isEdit) { // 编辑
            await updateRoleAPI(this.roleForm) // 5对key+value
          } else { // 新增
            await addRoleAPI(this.roleForm) // 2对key+value
          }
          this.getRoleListFn()
          this.showDialog = false
        }
      })
    },
    // 角色弹框-> 取消按钮
    cancelRoles() {
      this.showDialog = false
    },
    // 新增角色->按钮点击事件
    addRoleBtnFn() {
      this.showDialog = true
    },
    // 角色弹框->关闭事件方法
    roleDialogCloseFn() {
      this.$refs.roleForm.resetFields() // resetFields表单内置的方法
    }
  }
}
</script>

<style lang="scss" scoped>
.box-card {
  padding: 10px 30px;
}

.tab-pane {
  padding: 20px;
}

.el-pagination {
  margin-top: 20px;
  text-align: center;
}
</style>
