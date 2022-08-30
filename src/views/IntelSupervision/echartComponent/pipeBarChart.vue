<template>
  <div :id="id" class="pipeBarChart"></div>
</template>
<script>
import { chartFontSize } from "@/lib";
export default {
  name: "echart",
  props: {
    id: {
      type: String
    },
    data: {
      type: Object,
      default() {
        return {
          xAxis:[],
          yAxisSewage:[],
          yAxisWater:[]
        };
      }
    }
  },
  data() {
    return {
      stationNumberChart: {}
    };
  },
  methods: {
    resizeCharts() {
      const _this = this;
      _this.$nextTick(() => {
        _this.stationNumberChart.resize();
      });
    },
    renderChart() {
      const _this = this;
      let option = {
        tooltip: {
          //提示框组件
          trigger: "axis",
          formatter: "{b}<br />{a0}: {c0}<br />{a1}: {c1}",
          axisPointer: {
            type: "shadow",
            label: {
              backgroundColor: "#6a7985"
            }
          },
          textStyle: {
            color: "#fff",
            fontStyle: "normal",
            fontFamily: "微软雅黑",
            fontSize: chartFontSize(12)
          }
        },
        grid: {
          left: "10%",
          right: "10%",
          bottom: "10%",
          top: '20%',
          containLabel: true
        },
        legend: {
          //图例组件，颜色和名字
          right: chartFontSize(50),
          top: 0,
          itemGap: 16,
          itemWidth: chartFontSize(18),
          itemHeight: chartFontSize(10),
          data: [
            {
              name: "雨水管"
              //icon:'image://../wwwroot/js/url2.png', //路径
            },
            {
              name: "污水管"
            }
          ],
          textStyle: {
            color: "#a8aab0",
            fontStyle: "normal",
            fontFamily: "微软雅黑",
            fontSize: chartFontSize(12)
          }
        },
        xAxis: [
          {
            type: "category",
            boundaryGap: true, //坐标轴两边留白
            data: this.data.xAxis,
            axisLabel: {
              //坐标轴刻度标签的相关设置。
              interval: 0, //设置为 1，表示『隔一个标签显示一个标签』
              margin: chartFontSize(15),
              textStyle: {
                color: "#a8aab0",
                fontStyle: "normal",
                fontFamily: "微软雅黑",
                fontSize: chartFontSize(12)
              }
            },
            axisTick: {
              //坐标轴刻度相关设置。
              show: false
            },
            axisLine: {
              //坐标轴轴线相关设置
              lineStyle: {
                color: "#fff",
                opacity: 0.2
              }
            },
            splitLine: {
              //坐标轴在 grid 区域中的分隔线。
              show: false
            }
          }
        ],
        yAxis: [
          {
            type: "value",
            splitNumber: 5,
            axisLabel: {
              textStyle: {
                color: "#a8aab0",
                fontStyle: "normal",
                fontFamily: "微软雅黑",
                fontSize: chartFontSize(12)
              }
            },
            axisLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            splitLine: {
              show: true,
              lineStyle: {
                color: ["#fff"],
                opacity: 0.06
              }
            }
          }
        ],
        series: [
          {
            name: "雨水管",
            type: "bar",
            data: this.data.yAxisWater,
            barWidth: chartFontSize(10),
            barGap: 0, //柱间距离
            label: {
              //图形上的文本标签
              normal: {
                show: false
              }
            },
            itemStyle: {
              //图形样式
              normal: {
                barBorderRadius: [5, 5, 0, 0],
                color: "rgba(255, 156, 0, .6)"
              }
            }
          },
          {
            name: "污水管",
            type: "bar",
            data: this.data.yAxisSewage,
            barWidth: chartFontSize(10),
            barGap: chartFontSize(0.2), //柱间距离
            label: {
              //图形上的文本标签
              normal: {
                show: false
              }
            },
            itemStyle: {
              //图形样式
              normal: {
                barBorderRadius: [5, 5, 0, 0],
                color: "rgba(0, 150, 255, .6)"
              }
            }
          }
        ]
      };
      _this.stationNumberChart.setOption(option, true);
    }
  },
  watch: {
    data: {
      handler: function() {
        const _this = this;
        _this.$nextTick(() => {
          _this.stationNumberChart = _this.$echarts.init(
            document.getElementById(this.id)
          );
          _this.renderChart();
          window.addEventListener("resize", _this.resizeCharts);
        });
      },
      deep: true
    }
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.resizeCharts);
  }
};
</script>
<style scoped>
.pipeBarChart {
  width: 100%;
  height: 100%;
}
</style>
