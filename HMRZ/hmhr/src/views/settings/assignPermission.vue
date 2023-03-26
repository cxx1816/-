<template>
  <div>
    <!-- tree组件内，默认会使用数组里对象label属性的值，作为每行节点内容渲染
    但是我们permissionList里对象name才是名字，所以用props配合label，告诉
    tree组件内，使用对象的name属性的值，作为每行节点的渲染内容
    default-checked-keys:设置默认选中的id(但是仅仅局限于数组里上来就有值的，如果后续赋值，不会影响默认选中)
    node-key设置每行唯一标识(用的data里数组里对象的某个字段的值)，告诉tree用对象id的值，作为每行的标识
    -->
    <el-tree
      ref="theTree"
      :data="permissionList"
      :props="{ label: 'name'}"
      show-checkbox
      default-expand-all
      check-strictly
      node-key="id"
    ></el-tree>

    <el-row class="footer" type="flex" justify="center">
      <el-col :span="6">
        <el-button size="small" type="primary" @click="setRolesBtn">确 定</el-button>
        <el-button size="small" @click="cancelButton">取 消</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'AssignPermission',
  props: {
    // 所有权限点数据(树形结构)
    permissionList: {
      type: Array,
      default: _ => []
    },
    // 此角色现有权限点id值数组
    permIds: {
      type: Array,
      default: () => []
    }
    // roleId: {
    //   type: [Number, String],
    //   required: true
    // }
  },
  data() {
    return {}
  },
  watch: {
    permIds() {
      this.$refs.theTree.setCheckedKeys(this.permIds)
    }
  },
  created() {
    console.log(this.roleId)
  },
  methods: {
    // 取消按钮
    cancelButton() {
    // 方式1：普通事件名
    // 方式2：update:props变量名(多次)
    // 方式3：input事件(Vue2，每个组件身上只能用一次)
      this.$emit('input', false)
    },

    // 设置权限按钮
    setRolesBtn() {
      // this.$refs.theTree.getCheckedKeys()
      // 获取现在已选的key对应值形成的数组(权限点id组成的数组)
      this.$emit('addPerEv', this.$refs.theTree.getCheckedKeys())
      this.$emit('input', false)
    }
  }
}
</script>

<style lang="scss" scoped>
.footer {
  margin-top: 30px;
}
</style>
