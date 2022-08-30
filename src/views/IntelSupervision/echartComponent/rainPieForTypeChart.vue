<template>
  <div :id="id" class="rainPieForType"></div>
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
        return {};
      }
    },
    type: {
      type: Number,
      default() {
        return 1;
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
      let color1 = [
        "rgba(30, 243, 190, 1)",
        "rgba(79, 183, 255, 1)",
        "rgba(255, 225, 154, 1)"
      ];
      let color2 = [
        "rgba(36, 220, 247, 1)",
        "rgba(28, 138, 195, 1)",
        "rgba(228, 171, 34, 1)"
      ];
      let color3 = [
        "rgba(30, 243, 190, .4)",
        "rgba(79, 183, 255,.4)",
        "rgba(228, 171, 34, .4)"
      ];
      let titleColor = [
        "rgba(55, 254, 247, 1)",
        "rgba(44, 142, 227, 1)",
        "rgba(226, 166, 23, 1)"
      ];
      let value = this.data.percent;
      let option = {
        title: {
          text: this.data.num,
          x: "center",
          y: "center",
          subtext :this.data.name,
          textStyle: {
            color: titleColor[this.type - 1],
            fontSize:chartFontSize(30),
          },
          subtextStyle: {
            color: '#F3FFFF'
          }
        },
        series: [
          {
            name: "1",
            type: "pie",
            radius: ["58%", "47%"],
            silent: true,
            clockwise: true,
            startAngle: 90,
            z: 0,
            zlevel: 0,
            label: {
              normal: {
                position: "center"
              }
            },
            data: [
              {
                value: value,
                name: "",
                itemStyle: {
                  normal: {
                    color: {
                      // 完成的圆环的颜色
                      colorStops: [
                        {
                          offset: 0,
                          color: color1[this.type - 1] // 0% 处的颜色
                        },
                        {
                          offset: 1,
                          color: color2[this.type - 1] // 100% 处的颜色
                        }
                      ]
                    }
                  }
                }
              },
              {
                value: 100 - value,
                name: "",
                label: {
                  normal: {
                    show: false
                  }
                },
                itemStyle: {
                  normal: {
                    color: "#173164"
                  }
                }
              }
            ]
          },

          {
            name: "",
            type: "gauge",
            radius: "58%",
            center: ["50%", "50%"],
            startAngle: 0,
            endAngle: 359.9,
            splitNumber: 15,
            hoverAnimation: true,
            axisTick: {
              show: false
            },
            splitLine: {
              length: chartFontSize(18),
              lineStyle: {
                width: 1,
                color: "rgba(0,0,0,0.4)"
              }
            },
            axisLabel: {
              show: false
            },
            pointer: {
              show: false
            },
            axisLine: {
              lineStyle: {
                opacity: 0
              }
            },
            detail: {
              show: false
            },
            data: [
              {
                value: 0,
                name: ""
              }
            ]
          },

          {
            type: "pie",
            name: "内层细圆环",
            radius: ["62%", "64%"],
            hoverAnimation: false,
            clockWise: false,
            itemStyle: {
              normal: {
                color: color3[this.type - 1]
              }
            },
            label: {
              show: false
            },
            data: [100]
          },
          {
            type: "pie",
            name: "内层环",
            radius: [0, "43%"],
            hoverAnimation: false,
            clockWise: false,
            itemStyle: {
              normal: {
                color: "#02163F"
              }
            },
            label: {
              show: false
            },
            data: [{
                value: 100,
                itemStyle: {
                    color: {
                        type: 'radial',
                        x: 0.5,
                        y: 0.5,
                        r: 0.5,
                        colorStops: [{
                            offset: 0,
                            color: 'rgba(0, 0, 0, .1)' // 0% 处的颜色
                        }, {
                            offset: .8,
                            color: 'rgba(2, 49, 108, .1)' // 50% 处的颜色
                        }, {
                            offset: 1,
                            color: 'rgba(30, 243, 190, .1)' // 100% 处的颜色
                        }],
                        global: false // 缺省为 false
                    }
                }
            }]
          }
        ]
      };
      this.stationNumberChart.setOption(option, true);
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
.rainPieForType {
  width: 100%;
  height: 100%;
}
</style>
