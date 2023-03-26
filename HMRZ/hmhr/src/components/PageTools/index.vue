<template>
  <el-card>
    <div class="page-tools">
      <!-- 左侧 -->
      <div class="left">
        <div class="tips">
          <i class="el-icon-info" />
          <slot name="slot-left">
            <span>文字区域</span>
          </slot>
        </div>
      </div>

      <div class="right">
        <!-- 右侧 -->
        <slot name="slot-right">
          <span>按钮区域</span>
        </slot>
      </div>
    </div>
  </el-card>
</template>

<script>
export default {}
</script>

<style lang="scss" scoped>
.page-tools {
  display: flex;
  align-items: center;
  justify-content: space-between;

  .tips {
    padding: 0 15px;
    line-height: 34px;
    background: rgb(230 247 255 / 100%);
    border: 1px solid rgb(145 213 255 / 100%);
    border-radius: 5px;

    i {
      margin-right: 10px;
      color: #409eff;
    }
  }
}
</style>
