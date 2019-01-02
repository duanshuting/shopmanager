<template>
  <el-card class="card">
    <!-- 面包屑 导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>活动管理</el-breadcrumb-item>
      <el-breadcrumb-item>活动列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索框 + 添加按钮 -->
    <el-row>
      <el-col>
        <el-input placeholder="请输入内容" v-model="query" class="input-with-select">
          <el-button slot="append" icon="el-icon-search"></el-button>
        </el-input>
        <el-button type="primary">添加用户</el-button>
      </el-col>
    </el-row>
    <!-- 表格 
        el-table 需要通过data属性提供数据源 tableData
        每一列 el-table-column 中 label是表头文字，prop是该列中每一行的数据名
        prop 的数据来源是 el-table 的data属性值 [{prop要用的数据名name：值}] name
    -->
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="id" label="#" width="120"></el-table-column>
      <el-table-column prop="username" label="姓名" width="160"></el-table-column>
      <el-table-column prop="email" label="邮箱" width="200"></el-table-column>
      <el-table-column prop="mobile" label="电话" width="200"></el-table-column>
      
      <!-- 
        1. template  如果单元格内容不是简单字符串
        2. template 属性 slot-scope="值" 值会自动锁定外层数据源  scope其实就是 tableData
        3. scope.row 就是数组中的每个对象 (自动取出数据源中的每个数据)
        4. scope.row.create-time 就是想要用的数据
          slot-scope 作用：上下级传递数据
       -->
      <el-table-column label="创建日期" width="180">
        <template slot-scope="scope">{{scope.row.create_time | fmtDate}}</template>
      </el-table-column>
      
      <el-table-column label="用户状态" width="160">
        <!-- 该单元格中的数据不是prop的值 true -->
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-row>
            <el-button type="primary" icon="el-icon-edit" circle size="mini" plain></el-button>
            <el-button type="danger" icon="el-icon-delete" circle size="mini" plain></el-button>
            <el-button type="success" icon="el-icon-check" circle size="mini" plain></el-button>
          </el-row> 
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      query: "",
      tableData: [],
      query: "",
      pagenum: 1,
      pagesize: 2
    };
  },
  created() {
    // 获取数据
    this.getTableData()
  },
  methods: {
    async getTableData() {
    
      // 在发起请求(除了登录之外)之前，都需要授权 -> 设置请求头(axios文档)
      // 1. 设置请求头
      const AUTH_TOKEN = localStorage.getItem("token")
      this.$http.defaults.headers.common['Authorization'] = AUTH_TOKEN

      // 2. 发起请求
      const res = await this.$http.get(`users?query=${this.query}&pagenum=${this.pagenum}&pagesize=${this.pagesize}`)
      // console.log(res)
      const {data:{data:{total, users},meta:{status,msg}}} = res
      if (status === 200) {
        // 3. 给表格数据赋值
        this.tableData = users
        // console.log(this.tableData)
        
        // 4. 提示框
        this.$message.success(msg)
      }
    }
  }
};
</script>

<style>
.card {
  height: 100%;
}
.input-with-select {
  margin-top: 20px;
  width: 350px;
}
</style>
