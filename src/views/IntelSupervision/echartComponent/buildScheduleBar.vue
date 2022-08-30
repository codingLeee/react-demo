<template>
  <div :id="id" class="buildSchedule"></div>
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
      type: Number,
      default() {
        return 0;
      }
    },
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
        title: {
          text: `${_this.data}%`,
          textStyle: {
            color: "rgba(255,255,255,.8)",
            fontSize: chartFontSize(16)
          },
          x: "center",
          y: "40%"
        },
        tooltip: {
          formatter: "{a} <br/>{b} : {c}%"
        },

        series: [
          {
            min: 0,
            max: 100,
            center: ['50%','50%'],
            radius: "90%", // 位置
            startAngle: 180,
            endAngle: 0,
            name: "通讯合格率",
            type: "gauge",
            axisLine: {
              lineStyle: {
                width: chartFontSize(8),
                color: [
                  [
                    _this.data / 100,
                    new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                      {
                        offset: 0,
                        color: "rgba(60, 195, 255, 1)"
                      },
                      {
                        offset: 1,
                        color: "rgba(51, 192, 255, 0.5)"
                      }
                    ])
                  ],
                  [
                    1,
                    new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                      {
                        offset: 0,
                        color: "rgba(0, 63, 152, 1)"
                      },
                      {
                        offset: 1,
                        color: "rgba(0, 63, 152, 1)"
                      }
                    ])
                  ]
                ]
              }
            },
            detail: {
              show: false
            },
            pointer: {
              show: false
            },
            itemStyle: {
              color: "#bbb"
            },
            axisTick: {
              show: false
            },
            splitLine: {
              show: false
            },
            splitNumber: 1,
            axisLabel: {
              formatter: function(value, index) {
                return "\n\n" + value + '%';
              },
              align: "center",
              distance: -30,
              show: true,
              textStyle: {
                color: "rgba(255,255,255,.7)",
                fontSize: "12"
              }
            },
            data: [
              {
                value: _this.data
              }
            ]
          } //外面的大圆圈和0，100两个刻度
        ]
      };
      console.log(option);
      _this.stationNumberChart.setOption(option, true);
    }
  },
  watch: {
    data: {
      handler: function() {
        const _this = this;
        _this.$nextTick(() => {
          setTimeout(() => {
            _this.stationNumberChart = _this.$echarts.init(
              document.getElementById(this.id)
            );
            _this.renderChart();
            window.addEventListener("resize", _this.resizeCharts);
          },500);
        });
      }
    }
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.resizeCharts);
  }
};
</script>
<style scoped lang="scss">
.buildSchedule {
  width: 100%;
  height: 100%;
  > div {
    width: 100% !important;
  }
}
</style>
