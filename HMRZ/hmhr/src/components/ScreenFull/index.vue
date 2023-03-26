<template>
  <!-- 放置一个图标 -->
  <div>
    <!-- fullscreen 箭头向外
         exit-fullscreen 箭头向内
     -->
    <svg-icon :icon-class="isFullScreen ? 'exit-fullscreen':'fullscreen'" class="fullscreen" @click="toggleScreenFullFn" />
  </div>
</template>

<script>
import screenFull from 'screenfull'
export default {
  name: 'ScreenFull',
  data() {
    return {
      isFullScreen: false // false未进入全屏状态
    }
  },
  created() {
    // 检测全屏状态
    screenFull.on('change', () => {
      // screenFull.FullScreen拿到当前全屏状态，进入true，没有进入false
      this.isFullScreen = screenFull.isFullscreen
    })

    // F11按键跟这个没有关系
  },
  methods: {
    // 全屏svg图形->点击事件
    toggleScreenFullFn() {
    //   this.isFullScreen = !this.isFullScreen
      screenFull.toggle() // 如果当前是全屏就退出，如果不是全屏就进入
    }
  }
}
</script>

<style lang="scss" scoped>
.fullscreen {
  width: 20px;
  height: 20px;
  color: #fff;
  cursor: pointer;
}
</style>
