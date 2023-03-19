<template>
  <div class="navbar">
    <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <div class="app-breadcrumb">
      江苏传智播客教育科技股份有限公司
      <span class="bread-btn">体验版</span>
    </div>

    <div class="right-menu">
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <img src="avatar" class="user-avatar">
          <span class="name">{{ name }}</span>
          <i class="el-icon-caret-bottom" style="color:#fff" />
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <router-link to="/">
            <el-dropdown-item>
              首页
            </el-dropdown-item>
          </router-link>
          <a target="_blank" href="https://gitee.com/shuiruohanyu/hrsaas53">
            <el-dropdown-item>
              项目地址
            </el-dropdown-item>
          </a>
          <el-dropdown-item divided @click.native="logout">
            <span style="display:block;">退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
// 知识点：在逻辑页面里，使用vuex中getters值方式
// 方式1：$store.getters.变量名(如果用模块内getters:$store.getters['模块名/变量名'])
// 方式2：映射的方式(vuex里值复制到组件内)
// (1):拿到vuex提供的辅助函数mapGetters(固定名)
import { mapGetters } from 'vuex'
// (2):调用函数，传入要映射过来的getters里变量名
// 辅助函数在原地返回对象
// { name: mappedGetters函数 }
// 简单看源码内后面函数内其实还是this.$store.getters[val] ->去取name对应的值并返回
import Hamburger from '@/components/Hamburger'

export default {
  components: {
    Hamburger
  },
  computed: {
    // (3) 展开放到组件内
    // name:function(){
    //   return this.$store.getters.name
    // }
    // 下面运行时，就会变成上面这种样子
    // 原地留下3个同名计算属性和来自vuex中getters对应名字的值
    ...mapGetters([
      'sidebar',
      'avatar',
      'name'
    ])
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    // 退出登录->点击事件
    logout() {
      // 为了提高用户体验，给用户一个确认框
      this.$confirm('是否退出登录?', '提示', {
        confirmButtonText: '是',
        cancelButtonText: '否',
        type: 'warning'
      }).then(async() => {
        await this.$store.dispatch('user/logoutActions')
        // this.$router.path ->路由地址 列如'/info'
        // this.$router.fullPath ->路由地址和参数 列如'/info?a=10&b=20'
        this.$router.push(`/login?redirect=${this.$route.fullPath}`)
        this.$message({
          type: 'success',
          message: '退出登录-成功'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作'
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  position: relative;
  height: 50px;
  overflow: hidden;
  background-image: linear-gradient(to left, #3d6df8, #5b8cff);
  box-shadow: 0 1px 4px rgb(0 21 41 / 8%);

  .hamburger-container {
    float: left;
    height: 100%;

    // color只能影响文字的颜色/字体图标颜色，影响不了svg图形
    // svg标签身上设置fill填充颜色
    color: white;
    line-height: 46px;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgb(0 0 0 / 2.5%)
    }
  }

  .app-breadcrumb {
    display: inline-block;
    margin-left: 10px;
    color: #fff;
    font-size: 18px;
    line-height: 50px;
    cursor: text;

    .bread-btn {
      display: inline-block;
      height: 30px;
      margin-left: 15px;
      padding: 0 10px;
      font-size: 14px;
      line-height: 30px;
      background: #84a9fe;
      border-radius: 10px;
    }
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      height: 100%;
      padding: 0 8px;
      color: #5a5e66;
      font-size: 18px;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgb(0 0 0 / 2.5%)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        // margin-top: 5px;
        position: relative;

        // 头像
        .user-avatar {
          width: 30px;
          height: 30px;
          margin-right: 10px;
          vertical-align: middle;
          border-radius: 15px;
          cursor: pointer;
        }

        // name
        .name {
          margin-left:5px;
          color: #fff;
          vertical-align: middle;
        }

        .user-dropdown {
          color: #fff;
        }

        // 下拉 icon 图标位置
        .el-icon-caret-bottom {
          position: absolute;
          top: 20px;
          right: -20px;
          font-size: 12px;
          cursor: pointer;
        }
      }
    }
  }
}
</style>
