
<template>
  <div :id="id" :style="`height:${height}`"></div>
</template>

<script>
import { chartFontSize, checkNotNull } from "@/lib";

export default {
  data() {
    return {
      option: {
        color: ["#00D7E9", "#FF8B89", "#2EBAFF", "#1499FE", "#FFAD3C"],
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
          // data: [], //xData,
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
        },
        series: [
          {
            data: [], //yData,
            type: "line",
            // symbolSize: 10,
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
      },
    };
  },
  props: {
    id: {
      type: String,
      default: "",
    },
    data: {},
    height: {},
    dataOption: {},
    lineType: {
      type: String,
      default: "1",
    },
    legendShow: {
      type: Boolean,
      default: false,
    },
  },
  watch: {
    data: {
      deep: true,
      immediate: true,
      handler(val) {
        const _this = this;

        _this.$nextTick(() => {
          if (!_this.chart) {
            _this.initChart();
          }

          if (_this.lineType == 1) {
            let xAxisData = [];

            if (checkNotNull(val)) {
              val.forEach((m) => {
                m["value"] = m[_this.dataOption["value"]];
                m["name"] = m[_this.dataOption["name"]];
                xAxisData.push(m[_this.dataOption["name"]]);
              });
            }

            _this.option.xAxis["data"] = xAxisData;
            _this.option.series[0]["data"] = val;
            _this.option.legend["show"] = _this.legendShow;
          } else if (_this.lineType == 2 && checkNotNull(val)) {
            _this.option.grid.top = "15%";
            _this.option.series = val;
          }

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
