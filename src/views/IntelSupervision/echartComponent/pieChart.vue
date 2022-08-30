<template>
  <div :id="id" class="pie-container"></div>
</template>
<script>
import * as echarts from "echarts";
import { chartFontSize } from "@/lib";
export default {
  name: "echart",
  props: {
    //接受父组件传递来的数据
    data: {
      type: Array,
      default() {
        //默认数据，没有数剧的情况下启用
        return [];
      },
    },
    id: {
      type: String,
    },
  },
  watch: {
    data: {
      handler: function () {
        this.refreshChart();
      },
      deep: true,
    },
  },
  methods: {
    refreshChart() {
      const option = {
        color: ["#147AD6", "#EC6666", "#78D2DD"],
        tooltip: {
          trigger: "item",
          backgroundColor: "rgba(0,0,0,0.6)", //设置背景图片 rgba格式
          color: "black",
          borderWidth: chartFontSize(1), //边框宽度设置1
          borderColor: "gray", //设置边框颜色
          textStyle: {
            color: "#fff", //设置文字颜色
          },
        },

        legend: {
          orient: "horizontal",
          bottom: "5%",
          icon: "circle",
          textStyle: {
            color: "rgb(255,255,255,0.9)",
            fontSize: chartFontSize(10),
          },
        },

        series: [
          {
            name: "",
            type: "pie",
            radius: "60%",
            center: ["50%", "50%"],
            data: this.data,
            label: {
              normal: {
                show: false,
              },
            },
            labelLine: {
              normal: {
                show: false,
              },
            },
          },
        ],
      };
      //初始化
      const chartObj = echarts.init(document.getElementById(this.id));
      chartObj.setOption(option);
      chartObj.resize();
      window.addEventListener("resize", function () {
        chartObj.resize();
      });
    },
  },
};
</script>
<style scoped>
.pie-container {
  width: 100%;
  height: 100%;
}
</style>
