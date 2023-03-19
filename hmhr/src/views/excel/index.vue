<template>
  <div class="app-container">
    <!-- UploadExcelComponent是大佬封装的真正的表格上传组件(带虚线) -->
    <upload-excel-component :on-success="handleSuccess" :before-upload="beforeUpload" />
    <!-- 展示读取的表格数据的 -->
    <el-table :data="tableData" border highlight-current-row style="width: 100%;margin-top:20px;">
      <el-table-column v-for="item of tableHeader" :key="item" :prop="item" :label="item" />
    </el-table>
  </div>
</template>

<script>
// 导入src/components下，表格上传组件
import UploadExcelComponent from '@/components/UploadExcel/index.vue'
import { importEmployeeAPI } from '@/api'
import { formatExcelDate } from '@/utils'

export default {
  name: 'UploadExcel',
  components: { UploadExcelComponent },
  data() {
    return {
      tableData: [], // 表格数据
      tableHeader: [] // 表格头部数据
    }
  },
  methods: {
    // 在上传excel文件后，做一个判断(小于1MB文件)
    beforeUpload(file) {
      // file -> 上传的文件对象(excel文件对象) -> size的单位是Byte
      // 知识点：1Byte(字节)计算机里保存一个字母/数字需要的二进制位个数(1Byte=8bit)
      // 1kb=1024b(字节)
      // 1MB=1024kB
      const isLt1M = file.size / 1024 / 1024 < 1

      if (isLt1M) {
        return true // 通过
      }

      this.$message({
        message: 'Please do not upload files larger than 1m in size.',
        type: 'warning'
      })
      return false // 不通过返回false，并提示
    },
    async handleSuccess({ results, header }) {
      this.tableData = results
      this.tableHeader = header
      // results里，就是表格的所有数据
      // results是数组套对象
      // 每个对象对应一行数据

      // header里，第一行(作为列标题字符串数组)

      // 注意：我们不能直接把results直接发送给后台
      // 原因：后台要求传递的数据数组里对象(是英文的key名)
      // 解决：不要去改源码(改不懂的)，做一个后置处理
      // xlsx读中文的数据对象，拿到以后我们遍历做一个转换(映射)
      // 思路：遍历出每个对象，把值取出来，添加到一个英文的新的对象里
      // 1.准备中文换英文的映射关系(枚举对象)
      // 我们现在有的数据是中文的key，去这个对象取值，得知道那个key名(所以中文在前，不能颠倒)
      const userRelations = {
        '入职日期': 'timeOfEntry',
        '手机号': 'mobile',
        '姓名': 'username',
        '转正日期': 'correctionTime',
        '工号': 'workNumber',
        '部门': 'departmentName',
        '聘用形式': 'formOfEmployment'
      }
      // 2.遍历数组里每个对象
      // 遍历一次，产生一个英文key的新对象，想要收集成一个新数组
      const newArr = results.map(obj => {
        const newObj = {}
        // 3.拿到对象里所有key名(Object.keys(对象) ->返回对象里所有key字符串数组)
        const keyArr = Object.keys(obj) // ['入职日期','姓名','工号','手机号','转正日期']顺序不确定
        // 4.遍历每个中文的key，换成对应的英文字符串
        keyArr.forEach(zhKey => {
          const enKey = userRelations[zhKey] // 英文字符串key
          // 5.为新对象，添加英文key,和对应的值
          if (enKey === 'timeOfEntry' || enKey === 'correctionTime') {
            newObj[enKey] = formatExcelDate(obj[zhKey])
          } else {
            newObj[enKey] = obj[zhKey]
          }
        })
        // 新对象里上面forEach遍历很多次，新对象里有了很多英文key+value，再返回处理好的这个英文对象
        return newObj
      })
      const res = await importEmployeeAPI(newArr)
      this.$message.success(res.message)
      this.$router.back()
    }
  }
}
</script>
