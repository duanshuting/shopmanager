<template>
  <el-container class="container">
    <!-- 头部 -->
    <el-header class="header">
      <el-row>
        <el-col :span="4">
          <img src="@/assets/logo.png" alt>
        </el-col>
        <el-col :span="17" class="middle">
          <h2>电商后台管理系统</h2>
        </el-col>
        <el-col :span="1">
          <a href="#" class="logout" @click.prevent="handleLogout()">退出</a>
        </el-col>
      </el-row>
    </el-header>
    <el-container>
      <!-- 侧边栏 -->
      <el-aside width="200px" class="aside">
        <el-menu default-active="2" unique-opened router>
          <el-submenu :index="''+item1.order" v-for="(item1) in menus" :key="item1.id">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>{{item1.authName}}</span>
            </template>
            <el-menu-item :index="item2.path" v-for="(item2) in item1.children" :key="item2.id">
              <i class="el-icon-tickets"></i>
              {{item2.authName}}
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 主要展示内容 -->
      <el-main class="main">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  // 在组件渲染之前 -> if token -> new Vue之前
  // 必须保证先登录才能让其看见home页 (进入首页的权限验证)
  beforeCreate() {
    // if(!localStorage.getItem("token")) {
    //   // 回到登录页
    //   this.$router.push({
    //     name: "login"
    //   })
    //   // 提示
    //   this.$message.warning("请先登录")
    // }
  },
  created() {
    this.getMenus();
  },
  data() {
    return {
      menus: []
    }
  },
  methods: {
    // 点击退出功能
    handleLogout() {
      // 1. 清除token
      localStorage.clear()
      // 2. 回到登录页
      this.$router.push({
        name:"login"
      })
      // 3. 退出成功
      this.$message.success("退出成功")
    },

    // 左侧菜单权限
    async getMenus() {
      const res = await this.$http.get(`menus`);
      // console.log(res);
      this.menus = res.data.data;
    }
  }
};
</script>

<style>
.container {
  height: 100%;
  background-color: #b3c0d1;
}
.aside {
  background-color: #fff;
}
.main {
  background-color: #fff;
}
.middle {
  text-align: center;
  line-height: 60px;
  color: #fff;
}
.logout {
  line-height: 60px;
  text-decoration: none;
  color: #000;
}
</style>
