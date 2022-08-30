<template>
  <div :id="id" class="pie-container"></div>
</template>
<script>
import * as echarts from "echarts";
import { chartFontSize } from "@/lib";
export default {
  name: "echart",
  props: {
    id: {
      type: String,
    },
    data: {
      type: Object,
      default() {
        return {
          xData: [],
          yData: [],
        };
      },
    },
  },
  watch: {
    data: {
      handler: function () {
        this.refreshChart();
      },
    },
  },
  methods: {
    refreshChart() {
      const option = {
        color: ["#00D7E9"],
        grid: {
          containLabel: true,
          top: "5%",
          left: "8%",
          bottom: "5%",
          right: "8%",
        },
        tooltip: {
          trigger: "axis",
        },
        xAxis: {
          type: "category",
          data: this.data.xData,
          axisLine: {
            lineStyle: {
              color: "#999",
            },
          },
          axisTick: {
            show: false,
          },
          axisLabel: {
            color: "#fff",
            fontSize: "12",
            margin: chartFontSize(20),
          },
          splitLine: {
            show: false,
          },
        },
        yAxis: {
          type: "value",
          axisLine: {
            show: false,
          },
          axisLabel: {
            textStyle: {
              color: "#fff",
              fontSize: "12",
            },
          },
          axisTick: {
            show: false,
          },
          splitLine: {
            lineStyle: {
              color: "rgba(153, 153, 153, .3)",
              type: "dashed",
            },
          },
        },
        series: [
          {
            data: this.data.yData,
            type: "line",
            // symbolSize: 10,
            name: "液位",
            symbol: "circle",
            smooth: true,
            areaStyle: {
              color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: "rgba(0, 215, 233, 0.4)",
                },
                {
                  offset: 1,
                  color: "rgba(14, 27, 83, 0.4)",
                },
              ]),
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
