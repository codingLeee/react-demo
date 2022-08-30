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
      var data = {
        name: "",
        value: [this.value.toFixed(2)],
        nAmount: 1566557.14,
      };

      var color = ["#00FDFA", "#00B1BF", "#00F7F8"];
      const option = {
        title: {
          text: data.value[0] + "%",
          textStyle: {
            color: color[2],
            fontSize: chartFontSize(16),
          },
          // subtext: data.name + '占比',
          // subtextStyle: {
          //     color: '#aaaaaa',
          //     fontSize: 30
          // },
          itemGap: chartFontSize(20),
          left: "center",
          top: "center",
        },
        graphic: [
          {
            type: "text",
            z: 100,
            left: "center",
            top: "86%",
            style: {
              fill: "#fff",
              text: data.name,
              font: "30px Microsoft YaHei",
            },
          },
        ],
        tooltip: {
          formatter: function (params) {
            return (
              '<span style="color: #fff;">占比：' + params.value + "%</span>"
            );
          },
        },
        angleAxis: {
          max: 100,
          clockwise: false, // 逆时针
          // 隐藏刻度线
          show: false,
          startAngle: 90,
        },
        radiusAxis: {
          type: "category",
          show: true,
          axisLabel: {
            show: false,
          },
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
        },
        polar: [
          {
            center: ["50%", "50%"], //中心点位置
            radius: "80%", //图形大小
          },
        ],
        series: [
          {
            name: "小环",
            type: "gauge",
            splitNumber: 20,
            radius: "50%",
            center: ["50%", "50%"],
            startAngle: 0,
            endAngle: 359.9999,
            axisLine: {
              show: false,
            },
            axisTick: {
              show: true,
              lineStyle: {
                color: color[1],
                width: chartFontSize(1),
                shadowBlur: chartFontSize(1),
                shadowColor: color[1],
              },
              length: 5,
              splitNumber: 3,
            },
            splitLine: {
              show: false,
            },
            axisLabel: {
              show: false,
            },
            detail: {
              show: false,
            },
          },
          {
            type: "bar",
            z: 10,
            data: data.value,
            showBackground: false,
            backgroundStyle: {
              color: color[1],
              borderWidth: chartFontSize(1),
              width: chartFontSize(1),
            },
            coordinateSystem: "polar",
            roundCap: true,
            barWidth: chartFontSize(5),
            itemStyle: {
              normal: {
                opacity: 1,
                color: new echarts.graphic.LinearGradient(0, 0, 1, 1, [
                  {
                    offset: 0,
                    color: color[0],
                  },
                  {
                    offset: 1,
                    color: color[1],
                  },
                ]),
                shadowBlur: chartFontSize(5),
                shadowColor: "#2A95F9",
              },
            },
          },
          {
            type: "pie",
            name: "内层细圆环",
            radius: ["41%", "40%"],
            startAngle: 110,
            hoverAnimation: false,
            clockWise: true,
            itemStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 1, 1, [
                  {
                    offset: 0,
                    color: color[0],
                  },
                  {
                    offset: 1,
                    color: color[1],
                  },
                ]),
              },
            },
            tooltip: {
              show: false,
            },
            label: {
              show: false,
            },
            data: [100],
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
