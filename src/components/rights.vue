<template>
  <el-card class="card">
    <!-- 面包屑 -->
    <!-- 多个位置出现一样的页面结构，封装组件 -->
    <my-bread level1="权限管理" level2="权限列表"></my-bread>

    <!-- 表格 -->
    <el-table height="500px" :data="rights" border style="width: 100%" class="table">
      <el-table-column type="index" label="#" width="80"></el-table-column>
      <el-table-column prop="authName" label="权限名称" width="180"></el-table-column>
      <el-table-column prop="path" label="路径"></el-table-column>
      <el-table-column prop="level" label="层级">
        <template slot-scope="scope">
          <span v-if="scope.row.level==='0'">一级</span>
          <span v-if="scope.row.level==='1'">二级</span>
          <span v-if="scope.row.level==='2'">三级</span>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      rights: []
    };
  },
  created() {
    this.getRights();
  },
  methods: {
    // 获取权限列表数据
    async getRights() {
      // 在发送请求之前 设置头部信息 -> axios文档 -> 拦截所有请求 处理头部信息
      const res = await this.$http.get(`rights/list`);
      // console.log(res);
      const {
        data,
        meta: { msg, status }
      } = res.data;
      if (status === 200) {
        this.rights = data;
      } else {
        this.$message.warning(msg);
      }
    }
  }
};
</script>

<style>
.card {
  height: 100%;
}
.table {
  margin-top: 30px;
}
</style>
