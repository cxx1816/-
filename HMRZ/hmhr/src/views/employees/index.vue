<template>
  <div class="employees-container">
    <div class="app-container">
      <!-- 通用工具栏组件使用 -->
      <page-tools>
        <!-- 自定义左侧内容 -->
        <template #slot-left>
          <span>共 19 条记录</span>
        </template>

        <!-- 自定义右侧内容 -->
        <template #slot-right>
          <el-button v-power="'import'" type="danger" size="small" @click="uploadBtnFn">导入excel</el-button>
          <el-button v-power="'export'" type="success" size="small" @click="exportBtnFn">导出excel</el-button>
          <el-button type="primary" size="small" @click="addEmpBtnFn">新增员工</el-button>
        </template>
      </page-tools>

      <!-- 员工列表+分页 -->
      <el-card style="margin-top: 10px;">
        <el-table border :data="employeesList">
          <el-table-column type="index" label="序号" />
          <el-table-column prop="username" label="姓名" />
          <el-table-column prop="staffPhoto" label="头像">
            <template v-slot="{ row }">
              <image-holder class="staffPhoto" :src="row.staffPhoto">
              </image-holder>
            </template>
          </el-table-column>
          <el-table-column prop="mobile" label="手机号" />
          <el-table-column prop="workNumber" label="工号" sortable :sort-method="workNumberSortFn" />
          <el-table-column prop="formOfEmployment" label="聘用形式">
            <!-- 使用插槽技术时，需要组件内变量->作用域插槽
            (1):在组件内，用<slot 属性名="组件内变量值"></slot>(table-column写好了内部叫row)
            (2):在插槽内，用template v-slot="变量名" (变量会收集slot身上属性和值形成对象)
             -->
            <template v-slot="scope">
              <span>
                {{ formatter(scope.row) }}
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="departmentName" label="部门" />
          <el-table-column prop="timeOfEntry" label="入职时间" :formatter="timeFormatter" />
          <el-table-column label="操作" width="280">
            <template v-slot="{ row }">
              <el-button type="text" size="small" @click="lookDetailFn(row.id,row.formOfEmployment)">查看</el-button>
              <el-button type="text" size="small" @click="assignRoleBtnFn(row)">分配角色</el-button>
              <el-button type="text" size="small">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页组件 -->
        <el-row type="flex" justify="center" align="middle" style="height: 60px">
          <!-- 分页区域 -->
          <el-pagination
            :current-page="query.page"
            :page-sizes="[5,10, 15, 20, 25]"
            :page-size="query.pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </el-row>
      </el-card>
    </div>

    <!-- 新增员工 -> 弹窗 -->
    <el-dialog title="新增员工" :visible.sync="showDialog" @close="closeFn">
      <emp-form ref="empForm" :show.sync="showDialog" :tree-data="treeData" @addEmpEv="addEmpFn"></emp-form>
    </el-dialog>

    <!-- 员工-分配角色权限 - 弹窗 -->
    <el-dialog title="分配角色" :visible.sync="showRoleDialog">
      <!-- 设置角色组件 -->
      <assign-role-dialog
        ref="assignRoleDialog"
        :show.sync="showRoleDialog"
        :all-role-list="allRoleList"
        @addRoleEV="addRoleFn"
      />
    </el-dialog>
  </div>
</template>

<script>
import { getEmployeesListAPI, getDepartmentsListAPI, addEmployeesAPI, getRoleListAPI, getUserPhotoAPI, saveEmployeesRoleAPI } from '@/api'
import Employees from '@/api/constant' // 导入回来枚举值
import EmpForm from './components/empForm.vue'
import AssignRoleDialog from './components/assignRoleDialog.vue'
import { transTree } from '@/utils'
import dayjs from 'dayjs'
export default {
  name: 'Employees',
  components: {
    EmpForm,
    AssignRoleDialog
  },
  data() {
    return {
      query: {
        page: 1, // 页码
        pagesize: 10 // 每页条数
      },
      employeesList: [], // 员工列表
      total: 0, // 数据总条数
      // hireTypeList: Employees.hireType // 聘用形式-枚举数组
      showDialog: false, // 新增员工弹窗(显示/隐藏)
      treeData: [], // 部门列表(树形结构)
      allEmployeesList: [], // 所有员工列表
      showRoleDialog: false, // 分配角色弹窗(显示/隐藏)
      allRoleList: [], // 所有角色列表
      clickEmpId: '' // 点击分配角色时，选中员工id
    }
  },
  created() {
    // 获取员工列表数据
    this.getEmployeesListFn()
    // 获取部门列表数据
    this.getDepartmentsListFn()
    // 获取所有角色列表数据
    this.getRoleListFn()
  },
  methods: {
    // 请求-员工列表
    async getEmployeesListFn() {
      const res = await getEmployeesListAPI(this.query)
      this.employeesList = res.data.rows // 页面表格里当前页码条数的数据
      this.total = res.data.total

      // 第二次请求，拿到所有数据
      const allRes = await getEmployeesListAPI({
        page: 1,
        size: res.data.total // 上一个接口返回后台总数量
      })
      this.allEmployeesList = allRes.data.rows // 这个变量是为了给导出表格用的
    },
    // 请求-部门列表
    async getDepartmentsListFn() {
      const res = await getDepartmentsListAPI()
      this.treeData = transTree(res.data.depts, '')
    },
    // 请求-角色列表(所有)
    async getRoleListFn() {
      const res = await getRoleListAPI({
        page: 1,
        pagesize: 10
      })
      const allRes = await getRoleListAPI({
        page: 1,
        pagesize: res.data.total
      })
      this.allRoleList = allRes.data.rows
    },

    // 每页显示的条数发生改变时触发
    handleSizeChange(size) {
      this.query.pagesize = size
      this.getEmployeesListFn()
    },
    // 当前页面发生改变时触发
    handleCurrentChange(page) {
      this.query.page = page // 修改参数对象
      this.getEmployeesListFn() // 再次请求列表query里页码是改变后的
    },
    // 聘用形式->数据处理
    formatter(row) {
      // script范围内变量比如Employees，都可以访问到
      const obj = Employees.hireType.find(item => item.id === parseInt(row.formOfEmployment))
      return obj ? obj.value : '未知' // 所有obj值为undefined，返回'未知'
    },
    // 时间格式化
    timeFormatter(row) {
      return dayjs(row.timeOfEntry).format('YYYY-MM-DD')
    },
    // 工号排序方法
    workNumberSortFn(a, b) {
      return parseInt(a.workNumber) - parseInt(b.workNumber)
    },

    // 新增员工按钮点击方法->弹框出现
    addEmpBtnFn() {
      this.showDialog = true
    },
    // 新增员工->逻辑请求
    async addEmpFn(empObj) {
      await addEmployeesAPI(empObj)
      this.getEmployeesListFn()
    },
    // 新增员工弹窗->关闭事件
    closeFn() {
      // this -> employees当前组件对象
      // this.$refs.empForm -> empForm组件对象(好比empForm内this的值)
      // this.$refs.empForm.$refs.addForm -> 就是el-form组件对象了
      this.$refs.empForm.$refs.addForm.resetFields() // resetFields()表单内置方法
    },

    // 导入excel按钮->点击事件->为了跳转到Excel上传页面
    uploadBtnFn() {
      this.$router.push('/excel')
    },
    // 导出Excel按钮-点击事件-下载带数据的Excel文件(自动)
    exportBtnFn() {
      // import()方法，webpack提供的一种模块引入的方法(你也可以写到外面script下)
      // 类似于懒加载，点击导出按钮的时候，才去引入对应js
      // import()方法
      // 参数：要引入的包名/路由
      // 返回值：Promise对象
      import('@/vendor/Export2Excel').then(excel => {
        // excel：左侧模块内导出的对象
        const tHeader = ['序号', '姓名', '头像', '手机号', '工号', '聘用形式', '部门', '入职时间']
        // 核心：请求回来数组套对象的数据，转成只有值的二维数组
        // Object.values() ->传入对象，返回所有值的数组
        // 1.遍历数组里每个对象
        // const data = this.employeesList.map(obj =>{
        // 2.把对象里所有值收集成数组返回给map，再装入到大数组里
        //   return Object.values(Obj) //['2018-11-30','1',''管理员',...]10个值(tHeader也必须是10个)
        // })
        // 上面问题：数据和头部纵向对不上
        // 原因：object.values()取出的值是无序的，没办法和tHeader按顺序对应上
        // 解决：想尽一切办法，让我们的值数组里顺序和tHeader顺序对应上
        // 表格里和页面上列只用到了8个，而数组对象里有10对key+value
        // 1.中文 -> 英文的映射关系(枚举值)
        // 序号在遍历的时候就有索引值了，所以她的值不用去英文对象里获取，所以不用映射
        const zhAndEnObj = {
          '姓名': 'username',
          '头像': 'staffPhoto',
          '手机号': 'mobile',
          '工号': 'workNumber',
          '聘用形式': 'formOfEmployment',
          '部门': 'departmentName',
          '入职时间': 'timeOfEntry'
        }
        // 2.遍历每个英文对象
        const data = this.allEmployeesList.map((enObj, index) => {
          // 3.遍历每个中文key值
          const newArr = [] // 保存值
          tHeader.forEach(zhKey => {
            if (zhKey === '序号') {
              newArr.push(index + 1)
            } else {
              const enKey = zhAndEnObj[zhKey]
              const value = enObj[enKey]
              if (enKey === 'formOfEmployment') {
                const obj = Employees.hireType.find(item => item.id === parseInt(value))
                newArr.push(obj ? obj.value : '未知')
              } else {
                newArr.push(value)
              }
            }
          })
          // 4.把一行值数组return给map内
          return newArr
        })

        // export_json_to_excel()方法是vendor/Export2Excel.js文件内封装导出excel文件的方法
        excel.export_json_to_excel({
          // 表格文件列标题(数组)
          header: tHeader,
          // 表格里第二行开始的正文数据(二维数组)
          // 其中内层数组里直接写行的内容值
          data,
          // 导出时excel文件的名字(无需写后缀)
          filename: '文件名',
          // 单元格宽度自适应
          autoWidth: true,
          bookType: 'xlsx'
        })
        this.downloadLoading = false
      })
    },

    // 员工列表-点击查看详情
    lookDetailFn(empId, formOfEmploymentId) {
      console.log(empId, formOfEmploymentId)
      this.$router.push(`/employees/detail?id=${empId}&form=${formOfEmploymentId}`)
    },

    // 分配角色按钮->点击事件->分配角色弹窗出现
    async assignRoleBtnFn(empObj) {
      // 通过员工ID，换回来员工详细信息(roleIds数组)
      const res = await getUserPhotoAPI(empObj.id)
      this.clickEmpId = empObj.id
      this.showRoleDialog = true

      // 知识点：Vue更新DOM的动作是异步的
      // 上一句话同步代码，会把所有同步代码执行完毕
      // 才会更新真实DOM(弹框内组件才出现)
      // 假如立刻获取弹窗内容组件可能获取不到

      // 解决:用Vue提供的$nextTick()方法
      // 作用：等待异步DOM更新完毕后，vue会回调()里函数执行
      this.$nextTick(() => {
        this.$refs.assignRoleDialog.roleIdsList = res.data.roleIds
      })
    },

    // 调用接口保存，员工的最新角色id
    async addRoleFn(roleIdsList) {
      await saveEmployeesRoleAPI({
        id: this.clickEmpId,
        roleIds: roleIdsList
      })
      // console.log(res)
    }
  }
}
</script>

<style lang="scss" scoped>
.staffPhoto {
  width: 100px;
  height: 100px;
  border-radius: 50%;
}
</style>
