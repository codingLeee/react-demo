<template>
  <div :id="id" class="rainTop5Chart"></div>
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
      type: Array,
      default() {
        return [];
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
    contains(arr, dst) {
      var i = arr.length;
      while ((i -= 1)) {
        if (arr[i] == dst) {
          return i;
        }
      }
      return false;
    },
    attackSourcesDataFmt(sData) {
      var sss = [];
      var attackSourcesColor = [
        new this.$echarts.graphic.LinearGradient(0, 1, 1, 1, [
          { offset: 0, color: "#08B1FF" },
          { offset: 1, color: "#6BFFF3" }
        ])
      ];
      sData.forEach(function(item, i) {
        let itemStyle = {
          color: attackSourcesColor[0]
        };
        sss.push({
          value: item,
          itemStyle: itemStyle
        });
      });
      return sss;
    },
    renderChart() {
      const _this = this;
      var data = this.data;

      var attackSourcesColor1 = [
        "#EB3B5A",
        "#FA8231",
        "#F7B731",
        "#3860FC",
        "#1089E7",
        "#F57474",
        "#56D0E3",
        "#1089E7",
        "#F57474",
        "#1089E7",
        "#F57474",
        "#F57474"
      ];
      var attaData = [];
      var attaName = [];
      var topName = [];
      data.forEach((it, index) => {
        attaData[index] = parseFloat(it.rate).toFixed(2);
        attaName[index] = it.rate;
        topName[index] = `${it.name}`;
      });
      var salvProMax = []; //背景按最大值
      for (let i = 0; i < attaData.length; i++) {
        salvProMax.push(100);
      }
      let option = {
        color: ["#F7B731"],
        grid: {
          left: "-5%",
          right: "5%",
          width: "95%",
          bottom: "5%",
          top: "8%",
          containLabel: true
        },
        xAxis: {
          type: "value",

          splitLine: {
            show: false
          },
          axisLabel: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLine: {
            show: false
          }
        },
        yAxis: [
          {
            type: "category",
            inverse: true,
            axisLine: {
              show: true,
              lineStyle: {
                type: "dashed",
                color: "rgba(255,255,255,0.2)"
              }
            },
            axisTick: {
              show: false
            },
            axisPointer: {
              label: {
                show: true
                //margin: 30
              }
            },
            padding: [5, 0, 0, 0],
            postion: "right",
            data: attaName,
            axisLabel: {
              margin: 20,
              padding: [2, 0, 0, 0],
              color: "#000",
              rich: {
                nt1: {
                  color: attackSourcesColor1[0],
                  width: 13,
                  height: 13,
                  fontSize: 16,
                  align: "center",
                  lineHeight: "5",
                  padding: [0, 1, 2, 1]
                  // padding:[0,0,2,0],
                },
                nt2: {
                  color: attackSourcesColor1[1],
                  width: 13,
                  height: 13,
                  fontSize: 16,
                  align: "center",
                  padding: [0, 1, 2, 1]
                },
                nt3: {
                  color: attackSourcesColor1[2],
                  width: 13,
                  height: 13,
                  fontSize: 16,
                  align: "center",
                  padding: [0, 1, 2, 1]
                },
                nt: {
                  color: attackSourcesColor1[3],
                  width: 13,
                  height: 13,
                  fontSize: 16,
                  align: "center",
                  lineHeight: 3,
                  padding: [0, 1, 2, 1],
                  lineHeight: 5
                }
              },
              formatter: function(value, index) {
                index = index + 1;
                if (index - 1 < 3) {
                  return ["{nt" + index + "|" + "No." + index + "}"].join("\n");
                } else {
                  return ["{nt|" + "No." + index + "}"].join("\n");
                }
              }
            }
          },
          {
            type: "category",
            inverse: true,
            axisTick: "none",
            axisLine: "true",
            show: true,
            axisLabel: {
              show: true,
              textStyle: {
                color: "#fff",
                fontSize: chartFontSize(14)
              },
              formatter: function (value, index) {
                  return value + '%';
              }
            },
            axisLine: {
              show: true,
              lineStyle: {
                type: "dashed"
              }
            },
            data: _this.attackSourcesDataFmt(attaName)
          },
          {
            //名称
            type: "category",
            offset: -10,
            position: "left",
            axisLabel: {
              color: `#fff`,
              fontSize: chartFontSize(14)
            },
            axisLine: {
              show: false
            },
            inverse: true,
            axisTick: {
              show: false
            },
            axisLabel: {
              interval: 0,
              color: ["#fff"],
              align: "left",
              verticalAlign: "bottom",
              lineHeight: chartFontSize(32),
              fontSize: chartFontSize(14)
            },
            data: topName
          }
        ],
        series: [
          {
            zlevel: 1,
            name: "个人所得(亿元)",
            type: "bar",
            barWidth: chartFontSize(10),
            animationDuration: 1500,
            data: _this.attackSourcesDataFmt(attaData),
            align: "center",
            roundCap: true,
            itemStyle: {
              normal: {
                barBorderRadius: chartFontSize(10)
              }
            },
            label: {
              show: false,
              fontSize: chartFontSize(18),
              color: "#fff",
              textBorderWidth: chartFontSize(2),
              padding: [chartFontSize(2), 0, 0, 0]
            }
          },
          {
            name: "个人所得(亿元)",
            type: "bar",
            barWidth: 10,
            barGap: "-100%",
            margin: "20",
            roundCap: true,
            data: salvProMax,
            itemStyle: {
              normal: {
                color: "#05325F",
                //width:"100%",
                fontSize: chartFontSize(18),
                barBorderRadius: chartFontSize(30)
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
.rainTop5Chart {
  width: 100%;
  height: 100%;
}
</style>
