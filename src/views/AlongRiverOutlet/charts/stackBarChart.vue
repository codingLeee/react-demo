
<template>
    <div :id="id" :style="`height:${height}`"></div>
</template>

<script>
import { chartFontSize, checkNotNull } from "@/lib";

export default {
  data() {
    return {
      colors: [
        { borderColor: "#3681FF", color1: "#101F70", color2: "#00A8FF" },
        { borderColor: "#FFD200", color1: "#2d2603", color2: "#ffb637" },
        { borderColor: "#15D8D1", color1: "#064442", color2: "#15D8D1" }
      ],
      option: {
        grid: {
          containLabel: true,
          top: "20%",
          left: "8%",
          bottom: "5%",
          right: "8%"
        },
        tooltip: {
          trigger: "axis"
        },
        legend: {
          right: "8%",
          top: "5%",
          itemGap: chartFontSize(20),
          textStyle: {
            color: "#fff",
            fontSize: chartFontSize(16)
          },
          data: []
        },
        xAxis: {
          type: "category",
          data: [], //xData,
          axisLine: {
            lineStyle: {
              color: "#999"
            }
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            color: "#fff",
            fontSize: chartFontSize(16),
            margin: chartFontSize(20)
          },
          splitLine: {
            show: false
          }
        },
        yAxis: {
          type: "value",
          axisLine: {
            show: false
          },
          axisLabel: {
            textStyle: {
              color: "#fff",
              fontSize: chartFontSize(16)
            }
          },
          axisTick: {
            show: false
          },
          splitLine: {
            lineStyle: {
              color: "rgba(153, 153, 153, .3)",
              type: "dashed"
            }
          }
        },
        series: []
      }
    };
  },
  props: {
    id: {
      type: String,
      default: ""
    },
    seriesData: {},
    xAxisData: {},
    legendData: {},
    height: {},
    dataOption: {}
  },
  watch: {
    seriesData: {
      deep: true,
      immediate: true,
      handler(val) {
        if (checkNotNull(val)) {
          const _this = this;
          _this.$nextTick(() => {
            if (!_this.chart) {
              _this.initChart();
            }

            let series = [];
            let dataIndex = 0;
            for (let i in val) {
              series.push({
                name: i,
                data: val[i],
                type: "bar",
                stack: "1",
                barWidth: chartFontSize(20),
                symbol: "circle",
                itemStyle: {
                  borderWidth: 1,
                  borderColor: _this.colors[dataIndex%3]["borderColor"],
                  color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    {
                      offset: 0,
                      color: _this.colors[dataIndex%3]["color1"]
                    },
                    {
                      offset: 1,
                      color: _this.colors[dataIndex%3]["color2"]
                    }
                  ])
                }
              });
              dataIndex++;
            }

            _this.option.xAxis["data"] = _this.xAxisData;
            _this.option.legend["data"] = _this.legendData;
            _this.option.series = series;
            _this.chart.setOption(_this.option, true);
          });
        }
      }
    }
  },
  methods: {
    initChart() {
      const _this = this;
      _this.chart = _this.$echarts.init(document.getElementById(_this.id));
      window.addEventListener("resize", _this.resizeCharts);
    },
    resizeCharts() {
      const _this = this;
      _this.$nextTick(() => {
        _this.chart.resize();
      });
    }
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.resizeCharts);
  }
};
</script>

<style lang="scss" scoped>
</style>
