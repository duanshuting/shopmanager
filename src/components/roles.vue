<template>
  <el-card class="card">
    <!-- 面包屑 -->
    <my-bread level1="权限管理" level2="角色列表"></my-bread>

    <!-- 添加按钮 -->
    <el-row>
      <el-col>
        <el-button type="primary" class="btn">添加角色</el-button>
      </el-col>
    </el-row>

    <!-- 表格 -->
    <el-table height="450px" :data="roles">
      <el-table-column type="expand" width="150">
        <template slot-scope="scope">
          <!-- 展开之后的内容 -->
          <el-row v-for="(item1,i) in scope.row.children" :key="i">
            <el-col :span="4">
              <el-tag
                type="success"
                @close="deleRights(scope.row,item1)"
                closable
                class="level1"
              >{{item1.authName}}</el-tag>
              <i class="el-icon-arrow-right"></i>
            </el-col>
            <el-col :span="20">
              <el-row v-for="(item2,i) in item1.children" :key="i">
                <el-col :span="4">
                  <el-tag
                    @close="deleRights(scope.row,item2)"
                    type="info"
                    closable
                    class="level2"
                  >{{item2.authName}}</el-tag>
                  <i class="el-icon-arrow-right"></i>
                </el-col>
                <el-col :span="20">
                  <el-tag
                    @close="deleRights(scope.row,item3)"
                    closable
                    class="level3"
                    type="warning"
                    v-for="(item3,i) in item2.children"
                    :key="i"
                  >{{item3.authName}}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <el-row v-if="scope.row.children.length===0">
            <el-col>
              <span>该角色未分配权限</span>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column type="index" label="#" width="120"></el-table-column>
      <el-table-column prop="roleName" label="角色名称" width="260"></el-table-column>
      <el-table-column prop="roleDesc" label="角色描述" width="300"></el-table-column>
      <el-table-column label="操作" width="260">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" circle size="mini" plain></el-button>
          <el-button type="danger" icon="el-icon-delete" circle size="mini" plain></el-button>
          <el-button type="success" icon="el-icon-check" circle size="mini" plain @click="showDiaRights(scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分配权限的对话框 -->
    <el-dialog title="提示" :visible.sync="dialogVisibleRights" width="50%">
      <!-- 树形结构 
        data 树形结构绑定的数据
        show-checkbox 是否支持选中
        node-key 每个节点唯一标识
        default-expanded-keys 默认展开 [想要展开的节点的id值]
        default-checked-keys  默认选中 [被选中的节点的id值]
        props  配置选项 {label,children}
        default-expand-all 默认展开所有节点
      -->
      <el-tree
        ref="tree"
        :data="treeData"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="checkedArr"
        :props="defaultProps"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleRights = false">取 消</el-button>
        <el-button type="primary" @click="setRights()">确 定</el-button>
      </span>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      roles: [],
      treeData: [],
      dialogVisibleRights: false,
      defaultProps: {
        // label 和 children 的值来源于树形结构绑定数据key名
        // label 指的是文本信息
        // children 指的是树形结构的子节点的数据的key名
        label: "authName",
        children: "children"
      },
      checkedArr: [],
      currentRoleId: -1
    };
  },
  created() {
    this.getRoles();
  },
  methods: {
    // 分配权限 - 发送请求
    async setRights() {
      // roleId: 角色id
      // rids: 权限id列表
      // 权限id列表 -> 1. 全选的节点  2. 半选的节点

      // 获取树形结构全选节点
      // vue中操作dom
      const arr1 = this.$refs.tree.getCheckedKeys();
      // console.log(arr1);
      // 获取树形结构半选节点
      const arr2 = this.$refs.tree.getHalfCheckedKeys();
      // console.log(arr2);

      const arr = [...arr1, ...arr2];

      const res = await this.$http.post(`roles/${this.currentRoleId}/rights`, {
        rids: arr.join(",")
      });
      // console.log(res);

      // 刷新表格
      this.getRoles();
      // 关闭对话框
      this.dialogVisibleRights = false;
    },

    // 设置/分配权限
    async showDiaRights(rights) {
      // 角色id
      this.currentRoleId = rights.id;

      // 获取树形结构的权限数据
      const res = await this.$http.get(`rights/tree`);
      this.treeData = res.data.data;

      // 取出当前角色所拥有的权限
      const tempArr = [];
      rights.children.forEach(item1 => {
        tempArr.push(item1.id);
        item1.children.forEach(item2 => {
          tempArr.push(item2.id);
          item2.children.forEach(item3 => {
            tempArr.push(item3.id);
          })
        })
      });
      // console.log(tempArr);
      this.checkedArr = tempArr;

      // 点击展开对话框
      this.dialogVisibleRights = true;
    },

    // 删除权限
    async deleRights(role, rights) {
      const res = await this.$http.delete(
        `roles/${role.id}/rights/${rights.id}`
      );
      // 刷新当前角色的权限（ res.data.data 当前角色的剩余权限 ）
      role.children = res.data.data;

      // 刷新整个表格
      // this.getRoles();
    },

    // 获取所有角色数据
    async getRoles() {
      const res = await this.$http.get(`roles`);
      // console.log(res);
      this.roles = res.data.data;
    }
  }
};
</script>

<style scoped>
.card {
  height: 100%;
}
.btn {
  margin-top: 20px;
}
.level1,
.level2,
.level3 {
  margin-top: 10px;
}
</style>
