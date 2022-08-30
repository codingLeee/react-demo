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
    color: {
      type: String,
      default() {
        return "";
      },
    },
    subtext: {
      type: String,
      default() {
        return "";
      },
    },
    value: {
      type: Number,
      default() {
        return 0;
      },
    },
  },
  watch: {
    value: {
      handler: function () {
        this.refreshChart();
      },
    },
  },
  methods: {
    refreshChart() {
      var datas = {
        value: this.value,
        company: "%",
      };
      const option = {
        title: [
          {
            text: datas.value + datas.company,
            x: "center",
            y: "center",
            textStyle: {
              fontWeight: "normal",
              color: "#fff",
              fontSize: chartFontSize(14),
            },
          },
          {
            subtext: this.subtext,
            x: "center",
            bottom: "10%",
            subtextStyle: {
              fontWeight: "normal",
              color: this.color,
              fontSize: chartFontSize(14),
            },
          },
        ],
        color: ["#282c40"],
        legend: {
          show: false,
          data: [],
        },

        series: [
          {
            name: "Line 1",
            type: "pie",
            clockWise: true,
            radius: ["50%", "60%"],
            itemStyle: {
              normal: {
                label: {
                  show: false,
                },
                labelLine: {
                  show: false,
                },
              },
            },
            hoverAnimation: false,
            data: [
              {
                value: datas.value,
                name: "",
                itemStyle: {
                  normal: {
                    color: this.color,
                    label: {
                      show: false,
                    },
                    labelLine: {
                      show: false,
                    },
                  },
                },
              },
              {
                name: "",
                value: 100 - datas.value
              },
            ],
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
