<template>
  <el-card class="card">
    <!-- 面包屑 -->
    <my-bread level1="数据统计" level2="数据报表"></my-bread>
    <!-- 图标 -->
    <!-- 1. 提供容器 -->
    <div id="main" style="width: 800px;height:500px;"></div>
  </el-card>
</template>

<script>
import echarts from "echarts";
export default {
  mounted() {
    this.initEcharts();
  },
  methods: {
    async initEcharts() {
      // 基于准备好的dom，初始化echarts实例
      const myChart = echarts.init(document.getElementById("main"));

      // 获取图表所需数据
      const res = await this.$http.get(`reports/type/1`);
      // console.log(res);

      const option2 = res.data.data;
      // console.log(option2);

      const option1 = {
        title: {
          text: ""
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#6a7985"
            }
          }
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        yAxis: [
          {
            type: "value"
          }
        ]
      };
      const option = {...option1,...option2};
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option);
    }
  }
};
</script>

<style scoped>
.card {
  height: 100%;
}
</style>
