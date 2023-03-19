<template>
  <div>
    <!-- dialog组件(内给相应标签/按键-绑定了事件和一些代码)
        组件关闭方式
        1.  点击遮罩层上, 会导致弹窗关闭
        2.  按下esc键。会导致弹窗关闭
        3.  点击右上角的X按钮。会导致弹窗关闭
        4.  点击确认和取消, 可以自己写弹窗关闭(留下)
        怎么关闭dialog呢？不是直接隐藏标签，而是改变visible对应的变量为false
        内部检测visible属性值变为false，才隐藏dialog标签的
        组件通信：子->父范围的dialogVisible变量
        以前的技术：
            (1)子组件内恰当时机，this.$emit('自定义事件名'，值)
            (2)父组件内，给子组件标签@自定义事件名="事件处理函数"
                在事件处理函数中，接到子传出的值，赋予给父变量

        .sync语法糖：本质上还是用上面的技术，但是语法上有些简化
            (1)子组件内恰当时机，this.$emit('update:props变量名'，值)
            (2)父组件内，给子组件对应props变量名.sync="父范围变量名"

            .sync作用：他会在运行时，给当前标签绑定自定义事件名和事件处理函数
            @update:visible="val =>dialogVisible = val"
            :visible="dialogVisible"还在

            .sync场景：子->父快速传值并赋予给父范围内的变量
            如果子->父执行逻辑代码很多，这个.sync不能用了，还用我们自己绑定的事件

        问题：为何dialog组件内不直接改变visible这个props变量，而是要传递出来给dialogVisible变量赋值，然后再流回到visible影响组件显示/隐藏？
        知识点：props是只读的，不能直接重新赋值(vue会报警告的)
        原因：Vue设计上，父如果重新渲染，会给props里变量重复赋值，你原来在子组件内给props赋予的值将会被覆盖丢失
        解决：
            方式1：用data/computed代替
            方式2：快速改变父范围的变量(双向绑定)->让父把值改完在流回给props影响组件内(单项数据流)
            单项数据流：劲量让父改变值，重新给props赋值(父->子)
     -->
    <el-dialog
      :title="isEdit ? '编辑部门' : '添加子部门'"
      :visible.sync="dialogVisible"
      width="50%"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      :before-close="handleClose"
      @update:visible="val =>$emit('update:dialogVisible',false)"
      @close="dialogCloseFn"
    >
      <el-form ref="deptForm" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="部门名称" prop="name">
          <el-input v-model="form.name" style="width:80%" placeholder="2-10个字符" />
        </el-form-item>
        <el-form-item label="部门编码" prop="code">
          <el-input v-model="form.code" style="width:80%" placeholder="1-20个字符" />
        </el-form-item>
        <el-form-item label="部门负责人" prop="manager">
          <el-select v-model="form.manager" style="width:80%" placeholder="请选择">
            <el-option v-for="item in employeesSimpleList" :key="item.id" :value="item.username" />
          </el-select>
        </el-form-item>
        <el-form-item label="部门介绍" prop="introduce">
          <el-input v-model="form.introduce" style="width:80%" placeholder="1-300个字符" type="textarea" :rows="3" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelFn">取 消</el-button>
        <el-button type="primary" @click="confirmFn">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    // 页面上控制dialog是否显示
    dialogVisible: {
      type: Boolean
    },
    employeesSimpleList: {
      type: Array,
      default: () => [] //eslint 要求引用类型必须要有默认值
    },
    // 部门列表数组(扁平结构)
    originList: {
      type: Array,
      default: () => []
    },
    // 编辑/新增状态
    isEdit: {
      type: Boolean,
      default: false
    },
    // 当前编辑部门id
    clickDepartId: {
      type: String,
      default: () => ''
    }
  },
  data() {
    const validCode = (rule, value, callback) => {
      // 新增部门：code部门编码，不能和所有人相同
      let codeList = this.originList.map(item => item.code) // ['RSB','ZCB',...]
      if (this.isEdit) {
      // 编辑部门：
      // 问题：自己编码和自己冲突了，正确效果是，编辑时，自己的部门编码可以直接用
      // 原因：value和所有部门对比了
      // 解决：把自己从所有人里淘汰出去，留下剩下(过滤filter方法)
        const newArr = this.originList.filter(item => item.id !== this.clickDepartId)
        codeList = newArr.map(item => item.code)
      }
      codeList.includes(value) ? callback(new Error(`部门编码${value}已经存在了`)) : callback()
    }
    const validName = (rule, value, callback) => {
      // 新增部门名字：(先找到统计部门对象)
      // 数据规律：子部门pid = 父部门id
      let nameList = this.originList.filter(item => item.pid === this.clickDepartId).map(item => item.name) // ['人事部','行政部',。。。]
      if (this.isEdit) {
        // 先找到正在编辑的部门对象
        // find()方法，找到符合函数体里判断条件的那个对象
        const obj = this.originList.find(item => item.id === this.clickDepartId)
        // 找到编辑对象，才能拿到pid
        const pid = obj.pid
        // 拿到pid，才能继续从所有部门列表中，找到pid值相同的对象们
        nameList = this.originList.filter(item => item.pid === pid && item.id !== this.clickDepartId).map(item => item.name)
      }
      nameList.includes(value) ? callback(new Error(`部门名字${value}已经存在了`)) : callback()
    }
    return {
      form: {
        name: '', // 部门名称
        code: '', // 部门编码
        manager: '', // 部门管理者
        introduce: '' // 部门介绍
      },
      rules: {
        name: [
          { required: true, message: '部门名称不能为空', trigger: 'blur' },
          { min: 2, max: 10, message: '部门名称要求2-10个字符', trigger: 'blur' },
          { validator: validName, trigger: 'blur' }

        ],
        code: [
          { required: true, message: '部门编码不能为空', trigger: 'blur' },
          { min: 1, max: 20, message: '部门编码要求1-20个字符', trigger: 'blur' },
          { validator: validCode, trigger: 'blur' }
        ],
        manager: [
          // trigger是form表单触发检验的动作
          // 'blur'(失焦)，'change'(内容改变)
          { required: true, message: '部门负责人不能为空', trigger: 'change' }
        ],
        introduce: [
          { required: true, message: '部门介绍不能为空', trigger: 'blur' },
          { min: 1, max: 300, message: '部门介绍要求1-300个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 添加子部门dialog->关闭前的回调函数
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {})
    },
    // 取消-点击事件
    cancelFn() {
      this.$emit('update:dialogVisible', false)
    },
    // 确定->点击事件
    confirmFn() {
      // 防止它上来点击按钮，不走blur校验
      this.$refs.deptForm.validate(valid => {
        if (valid) {
          // 拷贝一个新的对象给父级axios使用
          // 子组件内我们会把form的值置空可能会影响axios的发送使用
          this.$emit('addDepartEV', { ...this.form })
          this.$emit('update:dialogVisible', false)
        }
      })
    },
    // 关闭后触发的回调函数
    dialogCloseFn() {
      // 不用resetFields方法，自己清除表单绑定值
      this.form = {
        name: '', // 部门名称
        code: '', // 部门编码
        manager: '', // 部门管理者
        introduce: '' // 部门介绍
      }
      // 清除校验提示
      this.$refs.deptForm.resetFields()
    }
  }
}
</script>

<style>

</style>
