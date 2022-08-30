<template>
    <div :id="id" :style="`height:${height}`"></div>
</template>

<script>
import { chartFontSize, checkNotNull } from "@/lib";
export default {
  data() {
    return {
      option: {
        title: {
          text: "",
          textStyle: {
            color: "#fff",
            fontSize: chartFontSize(27)
          },
          itemGap: chartFontSize(20),
          left: "center",
          top: "center"
        },
        angleAxis: {
          max: 100,
          clockwise: true, // 逆时针
          // 隐藏刻度线
          show: false
        },
        radiusAxis: {
          type: "category",
          show: true,
          axisLabel: {
            show: false
          },
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          }
        },
        polar: {
          center: ["50%", "50%"],
          radius: "80%" //图形大小
        },
        series: [
          {
            stack: "1",
            type: "bar",
            data: [],
            showBackground: true,
            backgroundStyle: {
              color: "#14408c",
              borderColor: "#14408c",
              borderWidth: 0
            },
            coordinateSystem: "polar",
            roundCap: true,
            barWidth: chartFontSize(20),
            silent: true,
            itemStyle: {}
          },
          // {
          //   stack: "1",
          //   type: "bar",
          //   data: [],
          //   showBackground: true,
          //   backgroundStyle: {
          //     color: "#14408c"
          //   },
          //   coordinateSystem: "polar",
          //   roundCap: true,
          //   barWidth: chartFontSize(20),
          //   itemStyle: {
          //     color: "#fff"
          //   }
          // }
        ]
      }
    };
  },
  props: {
    id: {
      type: String,
      default: ""
    },
    data: {},
    color: {},
    height: {}
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

          _this.option.text = val + "%";
          // _this.option.series[0]["data"] = [val];
          _this.option.series[0]["data"] = [70];
          // _this.option.series[1]["data"] = [val];
          _this.option.series[0]["itemStyle"] = {
            normal: {
              opacity: 1,
              color: _this.color,
              //   new _this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
              //   {
              //     offset: 0,
              //     color: _this.color
              //   },
              //   {
              //     offset: 0.2,
              //     color: "#14408c"
              //   },
              //   {
              //     offset: 0.8,
              //     color: "#14408c"
              //   },
              //   {
              //     offset: 1,
              //     color: _this.color
              //   }
              // ]),
              // borderWidth: 0
            }
          };

          _this.chart.setOption(_this.option, true);
        });
      }
    }
  },
  methods: {
    initChart() {
      console.log(1);
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
