
<template>
  <div :id="id" :style="`height:${height}`"></div>
</template>

<script>
import { chartFontSize, checkNotNull } from "@/lib";

export default {
  data() {
    return {
      colors: [
        { color1: "#182980", color2: "#E3B80B" },
        { color1: "#182980", color2: "#14DACA" },
      ],
      option: {
        grid: {
          containLabel: true,
          top: "20%",
          left: "8%",
          bottom: "5%",
          right: "8%",
        },
        tooltip: {
          trigger: "axis",
        },
        legend: {
          right: "8%",
          top: "5%",
          itemGap: chartFontSize(20),
          textStyle: {
            color: "#fff",
            fontSize: chartFontSize(16),
          },
        },
        xAxis: {
          type: "category",
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
            fontSize: chartFontSize(16),
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
              fontSize: chartFontSize(16),
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
          nameTextStyle: {
            color: "#fff",
            fontSize: chartFontSize(14),
            padding: chartFontSize(10),
          },
        },
        series: [],
      },
    };
  },
  props: {
    id: {
      type: String,
      default: "",
    },
    seriesData: {
      type: Object,
      default() {
        return {};
      },
    },
    xAxisData: {
      type: Array,
      default() {
        return [];
      },
    },
    legendData: {},
    height: {},
    dataOption: {},
    maxValue: {},
    unit: {},
    legendShow: {
      type: Boolean,
      default: true,
    },
  },
  watch: {
    seriesData: {
      deep: true,
      immediate: true,
      handler(val) {
        const _this = this;
        let series = [];

        _this.$nextTick(() => {
          if (!_this.chart) {
            _this.initChart();
          }

          if (checkNotNull(val)) {
            let dataIndex = 0;
            for (let i in val) {
              series.push(
                {
                  stack: i,
                  name: i,
                  type: "bar",
                  barWidth: chartFontSize(12),
                  itemStyle: {
                    normal: {
                      color: new _this.$echarts.graphic.LinearGradient(
                        1,
                        1,
                        0,
                        0,
                        [
                          {
                            offset: 0,
                            color: _this.colors[dataIndex % 2]["color1"],
                          },
                          {
                            offset: 1,
                            color: _this.colors[dataIndex % 2]["color2"],
                          },
                        ]
                      ),
                    },
                  },
                  data: val[i],
                },
                {
                  stack: i,
                  type: "bar",
                  barWidth: chartFontSize(12),
                  itemStyle: {
                    normal: {
                      color: "rgba(24, 41, 128, 0.8)",
                    },
                  },
                  tooltip: {
                    show: false,
                  },
                  data: new Array(val[i].length).fill(_this.maxValue),
                }
              );

              dataIndex++;
            }
          }

          _this.option.xAxis["data"] = _this.xAxisData;
          _this.option.legend["show"] = _this.legendShow;
          _this.option.yAxis["name"] = _this.unit;
          _this.option.yAxis["max"] = _this.maxValue;
          _this.option.series = series;
          _this.chart.setOption(_this.option, true);
        });
      },
    },
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
    },
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.resizeCharts);
  },
};
</script>

<style lang="scss" scoped>
</style>
