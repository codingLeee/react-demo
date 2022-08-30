<template>
  <div :id="id" class="rainPieChart"></div>
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
    formatNumber(num) {
        let reg = /(?=(\B)(\d{3})+$)/g;
        return num.toString().replace(reg, ',');
    },
    renderChart() {
      const _this = this;
      let img = './../../../../static/Common/img/rain-chart.png'
      let data = [];
      let color = [
        "rgba(3, 128, 255, 1)",
        "rgba(255, 152, 41, 1)",
        "rgba(61, 183, 206, 1)",
        "rgba(255, 99, 99, 1)",
        "rgba(143, 223, 254, 1)",
        "#ff5b00",
        "#ff3000"
      ];
      let total = 0;
      for (let i = 0; i < _this.data.length; i++) {
        data.push(
          {
            value: _this.data[i].value,
            name: _this.data[i].name,
          }
        );
        total += _this.data[i].value;
      }
      let seriesOption = [
        {
          name: "",
          type: "pie",
          clockWise: false,
          radius: [chartFontSize(105), chartFontSize(115)],
          hoverAnimation: false,
          itemStyle: {
            normal: {
              label: {
                show: true,
                position: "outside",
                color: "#ddd",
                formatter: params => {
                    return (
                        '{icon|●}{name|' + params.name + '}\n{value|' +
                        _this.formatNumber(params.value) + '个' + '}'
                    );
                },
                rich: {
                    icon: {
                        fontSize: chartFontSize(16),
                        padding:[0,chartFontSize(5),0,0]
                    },
                    name: {
                        fontSize: chartFontSize(16),
                        color: '#fff'
                    },
                    value: {
                        fontSize: chartFontSize(14),
                        fontWeight: 'bold',
                        color: 'rgba(3, 211, 255, 1)',
                        padding:chartFontSize(4)
                    }
                }
              },
              labelLine: {
                length: chartFontSize(20),
                length2: chartFontSize(20),
                show: false,
                color: "#00ffff"
              }
            },
            borderWidth:chartFontSize(3),
            borderColor:'#00264d'
          },
          data: data
        }
      ];
      let option = {
        color: color,
        title: {
          text: total,
          x: "center",
          y: "center",
          textStyle: {
            color: 'rgba(255,255,255,.8)',
            fontSize:chartFontSize(30),
          }
        },
        graphic: {
          elements: [
            {
              type: "image",
              z: 3,
              style: {
                image: img,
                width: chartFontSize(178),
                height: chartFontSize(178)
              },
              left: "center",
              top: "center",
              position: [chartFontSize(100), chartFontSize(100)]
            }
          ]
        },
        tooltip: {
          show: false
        },
        toolbox: {
          show: false
        },
        series: seriesOption
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
              document.getElementById(_this.id)
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
.rainPieChart {
  width: 100%;
  height: 100%;
}
</style>
