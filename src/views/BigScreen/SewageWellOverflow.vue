<!--污水井冒溢分析-->
<template>
    <div class="sewageWell_overflow">
        <div class="sewageWell_overflow_top toggle_content toggle_right_1">
            <div class="panel_title">污水井冒溢分析</div>
            <ul class="sewageWell_overflow_content">
                <li>
                    <p class="panel_title_second_level">当前冒溢次数</p>
                    <p class="decline_num">▼ 18</p>
                </li>
                <li>
                    <p class="panel_title_second_level">今日冒溢次数</p>
                    <p class="rise_num">▲ 36</p>
                </li>
                <li>
                    <p class="panel_title_second_level">本月冒溢次数</p>
                    <p class="decline_num">▼ 22</p>
                </li>
            </ul>
        </div>

        <div class="sewageWell_overflow_bottom  toggle_content toggle_right_2" id="sewageWell_overflow_chart"></div>
    </div>
</template>

<script>
import { chartFontSize } from "@/lib";

export default {
  name: "SewageWellOverflow",
  data() {
    return {
      sewageWellChart: {},
      sewageWellOption: {
        series: [
          {
            name: "当前冒溢",
            type: "pie",
            clockWise: false,
            radius: ["56%", "64%"],
            itemStyle: {
              normal: {
                color: "#01F7B4",
                label: {
                  show: false
                },
                labelLine: {
                  show: false
                }
              }
            },
            hoverAnimation: false,
            center: ["14%", "35%"],
            data: [
              {
                value: 46,
                name: "invisible",
                itemStyle: {
                  normal: {
                    color: "rgba(255,255,255,0.2)"
                  }
                }
              },
              {
                value: 54,
                label: {
                  normal: {
                    formatter: function(params) {
                      return "{a|" + params.value + "}{b|%}\n{x|占比}";
                    },
                    textStyle: {
                      rich: {
                        a: {
                          fontSize: chartFontSize(27),
                          fontWeight: "400",
                          color: "#fff",
                          fontFamily: "GothicThirteenStd"
                        },
                        x: {
                          fontSize: chartFontSize(14),
                          color: "#A4ACBF"
                        },
                        b:{
                          fontSize: chartFontSize(27),
                          fontWeight: "400",
                          color: "#fff",
                          fontFamily: "DINCondBlackAlternate",
                        },
                      }
                    },
                    position: "center",
                    show: true
                  }
                }
              }
            ]
          },
          {
            name: "今日冒溢",
            type: "pie",
            clockWise: false,
            radius: ["56%", "64%"],
            itemStyle: {
              normal: {
                color: "#01F7B4",
                label: {
                  show: false
                },
                labelLine: {
                  show: false
                }
              }
            },
            hoverAnimation: false,
            center: ["50%", "35%"],
            data: [
              {
                value: 56,
                name: "invisible",
                itemStyle: {
                  normal: {
                    color: "rgba(255,255,255,0.2)"
                  }
                }
              },
              {
                value: 44,
                label: {
                  normal: {
                    formatter: function(params) {
                      return "{a|" + params.value + "}{b|%}\n{x|占比}";
                    },
                    textStyle: {
                      rich: {
                        a: {
                          fontSize: chartFontSize(27),
                          fontWeight: "400",
                          color: "#fff",
                          fontFamily: "GothicThirteenStd"
                        },
                        x: {
                          fontSize: chartFontSize(14),
                          color: "#A4ACBF"
                        },
                        b:{
                          fontSize: chartFontSize(27),
                          fontWeight: "400",
                          color: "#fff",
                          fontFamily: "DINCondBlackAlternate",
                        },
                      }
                    },
                    position: "center",
                    show: true
                  }
                }
              }
            ]
          },
          {
            name: "本月冒溢",
            type: "pie",
            clockWise: false,
            radius: ["56%", "64%"],
            itemStyle: {
              normal: {
                color: "#01F7B4",
                label: {
                  show: false
                },
                labelLine: {
                  show: false
                }
              }
            },
            hoverAnimation: false,
            center: ["85%", "35%"],
            data: [
              {
                value: 65,
                name: "invisible",
                itemStyle: {
                  normal: {
                    color: "rgba(255,255,255,0.2)"
                  }
                }
              },
              {
                value: 35,
                label: {
                  normal: {
                    formatter: function(params) {
                      return "{a|" + params.value + "}{b|%}\n{x|占比}";
                    },
                    textStyle: {
                      rich: {
                        a: {
                          fontSize: chartFontSize(27),
                          fontWeight: "400",
                          color: "#fff",
                          fontFamily: "GothicThirteenStd"
                        },
                        x: {
                          fontSize: chartFontSize(14),
                          color: "#A4ACBF"
                        },
                        b:{
                          fontSize: chartFontSize(27),
                          fontWeight: "400",
                          color: "#fff",
                          fontFamily: "DINCondBlackAlternate",
                        },
                      }
                    },
                    position: "center",
                    show: true
                  }
                }
              }
            ]
          },
        ]
      }
    };
  },
  methods: {
    resizeCharts() {
      const _this = this;
      _this.$nextTick(() => {
        _this.sewageWellChart.resize();
      });
    }
  },
  mounted() {
    const _this = this;
    _this.$nextTick(() => {
      _this.sewageWellChart = _this.$echarts.init(
        document.getElementById("sewageWell_overflow_chart")
      );
      _this.sewageWellChart.setOption(_this.sewageWellOption);
      window.addEventListener("resize", _this.resizeCharts);
    });
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.resizeCharts);
  }
};
</script>

<style lang="scss" scoped>
.sewageWell_overflow {
  height: 34.68%;
  padding-top: 61px;

  .sewageWell_overflow_top {
    height: 42.5%;
    .sewageWell_overflow_content {
      display: flex;

      li {
        text-align: center;

        &:nth-child(2) {
          flex: 1;
        }

        p {
          &:nth-child(2) {
            line-height: 42px;
            font-size: 27px;
            font-family: GothicThirteenStd;

            &.decline_num {
              color: #01f7b4;
            }

            &.rise_num {
              color: #e95c2b;
            }
          }
        }
      }
    }
  }

  #sewageWell_overflow_chart {
    height: 57.5%;
  }
}
</style>
