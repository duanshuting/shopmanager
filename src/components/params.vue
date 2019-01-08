<template>
  <el-card class="card">
    <!-- 面包屑 -->
    <my-bread level1="商品管理" level2="分类参数"></my-bread>
    <!-- 提示消息 -->
    <el-row class="alert">
      <el-col>
        <el-alert title="注意只允许为第三级分类设置参数" :closable="false" type="warning" show-icon></el-alert>
      </el-col>
    </el-row>
    <!-- 级联选择器 -->
    <el-form :model="form">
      <el-form-item label="请选择商品分类">
        <el-cascader
          :show-all-levels="false"
          expand-trigger="hover"
          :options="options"
          clearable
          :props="defaultProp"
          v-model="selectedOptions"
          @change="handleChange"
        ></el-cascader>
      </el-form-item>
    </el-form>
    <!-- tabs -->
    <el-tabs v-model="active" @tab-click="changeTab()">
      <el-tab-pane label="动态参数" name="1">
        <el-button type="primary" :disabled="selectedOptions.length===0">设置动态参数</el-button>
        <!-- 表格 -->
        <el-table height="300px" :data="arrDy" style="width: 80%">
          <el-table-column type="expand">
            <template slot-scope="scope">
              <!-- 动态 el-tag 编辑 -->
              <el-tag
                :key="item.attr_id"
                v-for="(item, i) in scope.row.attr_vals"
                closable
                :disable-transitions="false"
                @close="handleClose(scope.row, item)"
              >{{item}}</el-tag>
              <el-input
                class="input-new-tag"
                v-if="inputVisible"
                v-model="inputValue"
                ref="saveTagInput"
                size="small"
                @keyup.enter.native="handleInputConfirm(scope.row)"
                @blur="handleInputConfirm(scope.row)"
              ></el-input>
              <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="attr_name" label="属性名称" width="200px"></el-table-column>
          <el-table-column label="操作" width="300px">
            <template slot-scope="scope">
              <el-button type="primary" icon="el-icon-edit" circle size="mini" plain></el-button>
              <el-button type="danger" icon="el-icon-delete" circle size="mini" plain></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>

      <el-tab-pane label="静态参数" name="2">
        <el-button type="primary" :disabled="selectedOptions.length===0">设置静态参数</el-button>
        <!-- 表格 -->
        <el-table height="300px" :data="arrStatic" style="width: 100%">
          <el-table-column type="index" width="200" label="#"></el-table-column>
          <el-table-column prop="attr_name" label="属性名称" width="200"></el-table-column>
          <el-table-column prop="attr_vals" label="属性值" width="200"></el-table-column>
          <el-table-column label="操作" width="400">
            <template slot-scope="scope">
              <el-button type="primary" icon="el-icon-edit" circle size="mini" plain></el-button>
              <el-button type="danger" icon="el-icon-delete" circle size="mini" plain></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      // 级联选择器所用数据
      options: [],
      defaultProp: {
        label: "cat_name",
        value: "cat_id",
        children: "children"
      },
      selectedOptions: [1, 3, 6],
      form: {},
      active: "1",
      arrDy: [],
      arrStatic: [],
      // 动态tag编辑的数据
      inputVisible: false,
      inputValue: ''
    };
  },
  created() {
    this.getGoodsCate();
  },
  methods: {
    // 动态tag相关的方法
    async handleClose(attr,item) {
      // 从attr_vals中移除当前item
      attr.attr_vals.splice(attr.attr_vals.indexOf(item),1);

      const putData = {
        attr_name: attr.attr_name,
        attr_sel: attr.attr_sel,
        // 数组转字符串
        attr_vals: attr.attr_vals.join(',')
      }      
      // 发送请求
      const res = this.$http.put(`categories/${this.selectedOptions[2]}/attributes/${attr.attr_id}`,putData);
      // console.log(res);
    },
    showInput() {
      this.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    handleInputConfirm(attr) {
      let inputValue = this.inputValue;
      if (inputValue) {
        attr.attr_vals.push(inputValue);
        const putData = {
        attr_name: attr.attr_name,
        attr_sel: attr.attr_sel,
        // 数组转字符串
        attr_vals: attr.attr_vals.join(',')
      }      
      // 发送请求
      const res = this.$http.put(`categories/${this.selectedOptions[2]}/attributes/${attr.attr_id}`,putData);
      // console.log(res);
      }
      this.inputVisible = false;
      this.inputValue = "";
    },

    // 选中tab时会触发
    changeTab() {
      if (this.selectedOptions.length === 3 && this.active === "1") {
        this.getDyparams();
      }
      if (this.selectedOptions.length === 3 && this.active === "2") {
        this.getStaticparams();
      }
    },

    handleChange() {
      if (this.selectedOptions.length === 3 && this.active === "1") {
        // 动态获取参数
        this.getDyparams();
      }
      if (this.selectedOptions.length === 3 && this.active === "2") {
        // 动态获取参数
        this.getStaticparams();
      }
    },

    // 获取静态参数数据
    async getStaticparams() {
      const res = await this.$http.get(`categories/${this.selectedOptions[2]}/attributes?sel=only`);
      const {
        meta: { msg, status },
        data
      } = res.data;
      if (status === 200) {
        this.arrStatic = res.data.data;
        console.log(this.arrStatic);
      } else {
        this.$message.warning(msg);
      }
    },

    // 获取动态参数数据
    async getDyparams() {
      const res = await this.$http.get(
        `categories/${this.selectedOptions[2]}/attributes?sel=many`
      );
      const {
        meta: { msg, status },
        data
      } = res.data;
      if (status === 200) {
        this.arrDy = res.data.data;
        // console.log(this.arrDy);

        this.arrDy.forEach(item => {
          if (item.attr_vals.length === 0) {
            item.attr_vals = [];
          }
          item.attr_vals = item.attr_vals.trim().split(",");
        });
      } else {
        this.$message.warning(msg);
      }
    },

    // 获取三级分类
    async getGoodsCate() {
      const res = await this.$http.get(`categories?type=3`);
      this.options = res.data.data;
      // console.log(this.options);
    }
  }
};
</script>

<style>
.card {
  height: 100%;
}
.alert {
  margin-top: 20px;
  margin-bottom: 20px;
}
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
