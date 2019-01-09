<template>
  <el-card class="card">
    <!-- 面包屑 导航 -->
    <my-bread level1="用户管理" level2="用户列表"></my-bread>

    <!-- 搜索框 + 添加按钮 -->
    <el-row>
      <el-col>
        <el-input @clear="getAllUsers()" placeholder="请输入用户名" v-model="query" class="input-with-select" clearable>
          <el-button slot="append" icon="el-icon-search"
          @click="searchUsers()"></el-button>
        </el-input>
        <el-button type="primary" @click="showDiaAdd()">添加用户</el-button>
      </el-col>
    </el-row>
    
    <!-- 表格 
        el-table 需要通过data属性提供数据源 tableData
        每一列 el-table-column 中 label是表头文字，prop是该列中每一行的数据名
        prop 的数据来源是 el-table 的data属性值 [{prop要用的数据名name：值}] name
    -->
    <el-table height=300px :data="tableData">
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
            @change="changeUserState(scope.row)"
            v-model="scope.row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-row>
            <el-button type="primary" icon="el-icon-edit" circle size="mini" plain @click="showEditDia(scope.row)"></el-button>
            <el-button type="danger" icon="el-icon-delete" circle size="mini" plain @click="showDeleConfirm(scope.row)"></el-button>
            <el-button type="success" icon="el-icon-check" circle size="mini" plain @click="showDiaRole(scope.row)"></el-button>
          </el-row> 
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <!-- 
      @size-change    每页显示条数改变时
      @current-change 当前页码改变时
      current-page    当前页码
      page-sizes      控制每页显示条数所在的数组[2,4,6,8]
      layout          分页组件的小功能
      total           数组总个数
     -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[2, 4, 6, 8]"
      :page-size="2"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>

    <!-- 添加用户对话框 -->
    <el-dialog title="添加用户" :visible.sync="dialogFormVisibleAdd">
      <el-form :model="form">
        <el-form-item label="用户名" :label-width="formLabelWidth">
          <el-input v-model="form.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" :label-width="formLabelWidth">
          <el-input v-model="form.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" :label-width="formLabelWidth">
          <el-input v-model="form.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" :label-width="formLabelWidth">
          <el-input v-model="form.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleAdd = false">取 消</el-button>
        <el-button type="primary" @click="addUser()">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 编辑用户对话框 -->
    <el-dialog title="编辑用户" :visible.sync="dialogFormVisibleEdit">
      <el-form :model="form">
        <el-form-item label="用户名" :label-width="formLabelWidth">
          <el-input disabled v-model="form.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" :label-width="formLabelWidth">
          <el-input v-model="form.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" :label-width="formLabelWidth">
          <el-input v-model="form.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleEdit = false">取 消</el-button>
        <el-button type="primary" @click="editUser()">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 分配角色对话框 -->
    <el-dialog title="分配角色" :visible.sync="dialogFormVisibleRole">
      <el-form :model="form">
        <el-form-item label="用户名" :label-width="formLabelWidth">
          {{curUserName}}
        </el-form-item>
        <el-form-item label="角色" :label-width="formLabelWidth">
          <!-- 
            1. v-model 绑定数据
            2. v-model 绑定的数据如果和option的value值一样 -> 默认选项option
            3. 点击不同的option时，v-model绑定的值就会变化 -> 变成了点击的option的value
           -->
           {{curUserRoleId}}
          <el-select v-model="curUserRoleId">
            <!-- 请选择 -->
            <el-option label="请选择" :value="-1" disabled></el-option>
            <!-- v-for遍历 -->
            <el-option v-for="(v,i) in roles" :key="i" :label="v.roleName" :value="v.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleRole = false">取 消</el-button>
        <el-button type="primary" @click="setRole()">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      query: "",
      tableData: [],
      pagenum: 1,
      pagesize: 2,
      total: -1,
      form: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      formLabelWidth: "100px",
      // 添加对话框的显示与隐藏
      dialogFormVisibleAdd: false,
      dialogFormVisibleEdit: false,
      dialogFormVisibleRole: false,
      curUserRoleId: -1,
      roles: [],
      curUserName: "",
      curUserId: -1
    };
  },
  created() {
    // 获取数据
    this.getTableData()
  },
  methods: {
    // 分配角色 - 发送请求
    async setRole() {
      const res = await this.$http.put(`users/${this.curUserId}/role`, {
        rid:this.curUserRoleId
      })
      // console.log(res);
      this.dialogFormVisibleRole = false;
    } ,

    // 分配角色 - 显示对话框
    async showDiaRole(user) {
      // console.log(user);  // 没有当前用户的角色id
      this.curUserName = user.username; 
      this.curUserId = user.id;

      // 获取所有的角色
      const res = await this.$http.get(`roles`);
      this.roles = res.data.data;
      // console.log(this.roles);

      // 要的是当前user用户的角色id -> 30
      const res2 = await this.$http.get(`users/${user.id}`);
      // console.log(res2)
      this.curUserRoleId = res2.data.data.rid;

      // 打开对话框
      this.dialogFormVisibleRole = true;
    },

    // 修改用户状态
    async changeUserState(user) {
      const res = await this.$http.put(`users/${user.id}/state/${user.mg_state}`)
      // console.log(res);
    },

    // 编辑用户 - 发送请求
    async editUser() {
      const res = await this.$http.put(`users/${this.form.id}`,{
        email:this.form.email,
        mobile:this.form.mobile
      });
      // console.log(res);
      const {meta:{msg,status}} = res.data
      if(status === 200) {
        // 关闭对话框
        this.dialogFormVisibleEdit = false;
        // 刷新表格
        this.getTableData();
      }else {
        thi.$message.warning(msg);
      }
    },

    // 编辑用户 - 打开对话框
    showEditDia(user) {
      this.form = user;
      this.dialogFormVisibleEdit = true
    },

    // 点击删除用户 - 打开提示框
    showDeleConfirm(user) {
      // console.log(user)
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        // 发送删除的请求
        const res = await this.$http.delete(`users/${user.id}`)
        const {meta:{msg,status}} = res.data
        if (status === 200) {
          this.$message.success(msg)
          this.pagenum = 1
          this.getTableData()
        }
      }).catch(() => {
        this.$message.warning("取消删除") 
      }); 
    },

    // 添加用户 - 发送请求
    async addUser() {
      // 1. 发送请求
      const res = await this.$http.post(`users`, this.form)
      const {meta:{msg,status}} = res.data
      // console.log(res)
      if (status === 201) {
        // 2. 关闭对话框
        this.dialogFormVisibleAdd = false
        // 3. 刷新表格
        this.getTableData()
      } else {
        // 提示框警告
        this.$message.warning(msg)
      }
    },

    // 点击添加用户按钮 - 显示对话框
    showDiaAdd() {
      // 打开对话框时，清空表单
      this.form = {}
      this.dialogFormVisibleAdd = true
    },

    // 分页组件相关的代码
    /**
     * 1. 当前页码改变时，按照新页码pagenum重新发请求
     * 2. 当每页条数改变时，按照新pagesize重新发请求
     */
     handleSizeChange(val) {
        console.log(`每页 ${val} 条`)
        this.pagesize = val
        this.pagenum = 1
        this.getTableData()
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`)
        this.pagenum = val
        this.getTableData()
      },

    // 请求表格数据
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
        this.total = total
        // console.log(this.tableData)
        
        // 4. 提示框
        this.$message.success(msg)
      }
    },

    // 搜索用户
    searchUsers() {
      this.pagenum = 1
      this.getTableData()
    },

    // 点击清空按钮时，重新获取数据
    getAllUsers() {
      this.getTableData()
    }
  }
};
</script>

<style scoped>
.card {
  height: 100%;
}
.input-with-select {
  margin-top: 20px;
  width: 350px;
}
</style>
