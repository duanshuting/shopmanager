<template>
  <el-card class="card">
    <!-- 面包屑 -->
    <my-bread level1="商品管理" level2="商品列表"></my-bread>

    <!-- 消息提示 -->
    <el-row class="alert">
      <el-col>
        <el-alert title="添加商品信息" :closable="false" type="info" center show-icon></el-alert>
      </el-col>
    </el-row>

    <!-- 步骤条 -->
    <el-steps :active="1*active" align-center>
      <el-step title="商品信息"></el-step>
      <el-step title="商品参数"></el-step>
      <el-step title="商品属性"></el-step>
      <el-step title="商品图片"></el-step>
      <el-step title="商品内容"></el-step>
    </el-steps>

    <!-- 当选中某个tab时，v-model绑定的数据active就是被选中的name值 -->
    <!-- tab标签页 -->
    <el-form class="formTab" label-position="top" :model="form" label-width="80px">
      <el-tabs @tab-click="changeTab()" tab-position="left" v-model="active">
        <el-tab-pane name="1" label="基本信息">
          <el-form-item label="商品名称">
            <el-input v-model="form.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格">
            <el-input v-model="form.goods_price"></el-input>
          </el-form-item>
          <el-form-item label="商品重量">
            <el-input v-model="form.goods_weight"></el-input>
          </el-form-item>
          <el-form-item label="商品数量">
            <el-input v-model="form.goods_number"></el-input>
          </el-form-item>
          <el-form-item label="商品分类">
            <!-- 级联选择器(表单元素)
                options  数据源
                selectedOptions  [被选中的label的value值]
                props  配置选项 = {label/value/children}  赋值来源都是options数据源中的key名
                clearable  清除
                @change  改变label
            -->
            <!-- {{selectedOptions}} -->
            <el-cascader
              expand-trigger="hover"
              :options="options"
              clearable
              :props="defaultProp"
              v-model="selectedOptions"
              @change="handleChange"
            ></el-cascader>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane name="2" label="商品参数">
          <!-- 动态参数属性名  attr_name 
            复选框组 - 返回attr_vals
            v-model="item1.attr_vals"  默认全选中
          -->
          <el-form-item :label="item1.attr_name" v-for="(item1,i) in arrDy" :key="item1.attr_id">
            <el-checkbox-group v-model="item1.attr_vals">
              <el-checkbox border :label="item2" v-for="(item2,i) in item1.attr_vals" :key="i"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane name="3" label="商品属性">
          <el-form-item :label="item.attr_name" v-for="(item,i) in arrStatic" :key="item.attr_id">
            <el-input v-model="item.attr_vals"></el-input>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane name="4" label="商品图片">
          <el-form-item label="图片上传">
            <!-- 
              action  上传地址
              headers 设置图片上传的头部
              :on-remove  移除图片时
             -->
            <el-upload
              class="upload-demo"
              action="http://localhost:8888/api/private/v1/upload"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :on-success="handleSuccess"
              :headers="headers"
              list-type="picture">
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane name="5" label="商品内容">
          <el-form-item>
            <el-button type="primary" @click="addGoods()">添加商品</el-button>
            <!-- 富文本编辑器 -->
            <quill-editor v-model="form.goods_introduce"></quill-editor>
          </el-form-item>
        </el-tab-pane>
      </el-tabs>
    </el-form>
  </el-card>
</template>

<script>
// 引入富文本编辑器所需样式和包 (全局引入 和 局部引入)
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import { quillEditor } from 'vue-quill-editor'

export default {
  components: {
    quillEditor
  },
  data() {
    return {
      active: "1",
      form: {
        goods_name: "",
        goods_price: "",
        goods_number: "",
        goods_weight: "",
        goods_introduce: "",
        // 商品分类 -> 级联选择器的商品分类(以 , 分割)
        goods_cat: "",
        // 图片 -> 图片上传 -> 图片临时路径
        pics: [],
        // 商品参数 -> 动态参数数据+静态参数数据
        attrs: []
      },
      options: [],
      selectedOptions: [1, 3, 6],
      defaultProp: {
        label: "cat_name",
        value: "cat_id",
        children: "children"
      },
      // 动态参数数组
      arrDy: [],
      // 静态参数数组
      arrStatic: [],
      headers: {
        Authorization:localStorage.getItem('token')
      }
    };
  },
  created() {
    this.getGoodsCate();
  },
  methods: {

    // 添加商品
    async addGoods() {
      // 处理数据
      // 商品分类
      this.form.goods_cat = this.selectedOptions.join(",");

      // 商品参数 -> 来源于 动态参数数组 和 静态参数数据 (attr_id 和 attr_vals)
      // 1. 动态参数
      // attrs: [{attr_id:?, attr_values:?}]
      const arr1 = this.arrDy;
      // 1. 遍历  2. 返回return  3. 返回新数组
      const arr1New = arr1.map((item) => {
        return {attr_id:item.attr_id, attr_values: item.attr_vals}
      });
      // console.log(arr1New);

      // 2. 静态参数
      const arr2 = this.arrStatic;
      const arr2New = arr2.map((item) => {
        return {attr_id:item.attr_id, attr_values: item.attr_vals}
      });
      // console.log(arr2New);

      const arr = [...arr1New, ...arr2New];
      this.form.attrs = arr;

      // 发送请求
      const res = await this.$http.post(`goods`, this.form);
      // console.log(res);

      // 回到商品列表页 goodslist.vue
      this.$router.push({
        name: 'goods'
      });
    },

    // 图片上传时的方法
    handlePreview(file) {},
    handleRemove(file, fileList) {
      // 从 this.form.pics 中移除当前X掉的图片
      // findIndex 
      // 1. 数组方法  
      // 2. 遍历  
      // 3. return条件  
      // 4. 把条件成立的元素的索引进行返回
      // 5. 形参是 cb函数
      const INDEX = this.form.pics.findIndex((item) => {
        return item.pic === file.response.data.tmp_path;
      });
      this.form.pics.splice(INDEX,1);
      // console.log(this.form.pics);
    },
    handleSuccess(response, file) {
      // response.data.tmp_path  图片临时上传路径
      this.form.pics.push({
        pic:response.data.tmp_path
      });
    },

    // 商品参数(动态数据) 和 商品属性(静态数据)
    async changeTab() {
      // 如果点的是第二个tab
      if (this.active === "2") {
        // 获取商品参数-动态参数数据
        // id 是 分类ID -> 第三级分类的id -> cat_id -> this.selectedOptions[2]
        if (this.selectedOptions.length === 3) {
          const res = await this.$http.get(
            `categories/${this.selectedOptions[2]}/attributes?sel=many`
          );
          this.arrDy = res.data.data;
          // console.log(this.arrDy);

          this.arrDy.forEach(item => {
            // console.log(item.attr_vals);
            // 把字符串变成以 , 分割的数组
            if (item.attr_vals.length === 0) {
              item.attr_vals = [];
            }
            item.attr_vals = item.attr_vals.trim().split(",");
          });
        } else {
          this.$message.warning("请先选择三级分类");
        }
      }

      // 如果点的是第三个tab
      if (this.active === "3") {
        // 获取商品参数-静态参数数据
        if (this.selectedOptions.length === 3) {
          const res = await this.$http.get(
            `categories/${this.selectedOptions[2]}/attributes?sel=only`
          );
          this.arrStatic = res.data.data;
          // console.log(this.arrStatic);
        } else {
          this.$message.warning("请先选择三级分类");
        }
      }
    },

    // 级联选择器触发时的方法
    handleChange() {},

    // 获取三级分类数据
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
.formTab {
  height: 400px;
  overflow: auto;
}
.ql-editor {
  min-height: 200px;
}
</style>
