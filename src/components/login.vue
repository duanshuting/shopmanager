<template>
  <div class="login-wrap">
    <el-form label-position="top" label-width="80px" :model="formdata" class="form">
      <h2>用户登录</h2>
      <el-form-item label="用户名">
        <el-input v-model="formdata.username"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="formdata.password"></el-input>
      </el-form-item>
      <el-button @click.prevent="handleLogin()" type="primary" class="btn">登录</el-button>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      formdata: {
        username: "",
        password: ""
      }
    }
  },
  methods: {
    /*
      目的：不想看到层层嵌套的{} (不想在内部获取异步操作的结果)
          -> ES7 async + await
        1. 在异步操作方法的前面加 await
        2. 在距离异步操作方法最近的外层函数前面加 async      
    */
    async handleLogin() {
      // 异步操作
      const res = await this.$http.post("login", this.formdata)
      //  console.log(res)
      const {data: {data,meta: { msg, status }}} = res
      if (status === 200) {
        // 保存token值(将来写其他功能时会用到)
        localStorage.setItem('token', data.token)

        // 登录成功后，渲染home组件
        this.$router.push({
          name: "home"
        })
      } else {
        this.$message.warning(msg)
      }
    }
  }
}
</script>

<style>
.login-wrap {
  height: 100%;
  background-color: #324152;
  display: flex;
  justify-content: center;
  align-items: center;
}
.form {
  width: 450px;
  background-color: #fff;
  padding: 30px;
  border-radius: 5px;
}
.btn {
  width: 100%;
}
</style>
