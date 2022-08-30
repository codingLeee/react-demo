
<template>
    <div class="chartContent" :id="id" :style="`height:${height}`"></div>
</template>

<script>
import { chartFontSize } from "@/lib";
// let circlePieBg = require("static/ManageSystem/img/circlePie_chart_bg.png");

export default {
  name:"circlePie",
  data() {
    return {
      option: {
        color: [
          "#FFAD3C",
          "#14D3D5",
          "#FF8B89",
          "#2EBAFF",
          "#1499FE",
          "#037DF9"
        ],
        title: {
          text: "",
          top: "40%",
          textAlign: "center",
          left: "49%",
          textStyle: {
            color: "#F0F2F5",
            fontSize: chartFontSize(29),
            fontWeight: "400"
          },
          subtext: "总数",
          subtextStyle: {
            color: "#F0F2F5",
            fontSize: chartFontSize(15),
            fontWeight: "400"
          }
        },
        // graphic: {
        //   elements: [
        //     {
        //       type: "image",
        //       z: 3,
        //       style: {
        //         image: circlePieBg,
        //         width: "80%", //chartFontSize(145),
        //         height: chartFontSize(145)
        //       },
        //       left: "center",
        //       top: "center"
        //     }
        //   ]
        // },
        tooltip: {
          show: false
        },
        series: [
          {
            name: "",
            type: "pie",
            clockWise: false,
            radius: ["48%", "52%"],
            hoverAnimation: false,
            itemStyle: {
              normal: {
                borderRadius: 20
              }
            },
            label: {
              show: true,
              position: "outside",
              // color: '#F0F2F5',
              fontSize: chartFontSize(16),
              formatter: function(params) {
                if (params.name !== "") {
                  let str =
                    `${params.name}` +
                    "\n\n" +
                    `{a|${params.percent}% ${params.value}次}`;
                  return str;
                } else {
                  return "";
                }
              },
              rich: {
                a: {
                  color: "#03D3FF"
                }
              }
            },
            labelLine: {
              length: chartFontSize(20),
              length2: chartFontSize(30),
              show: false
            },
            data: []
          }
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
    height: {},
    total: {}
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
          _this.option.title.text = _this.total;
          _this.option.series[0]["data"] = val;
          _this.chart.setOption(_this.option, true);
        });
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
.chartContent{
  width: 100%;
  background: url(~static/ManageSystem/img/circlePie_chart_bg.png) no-repeat center center;
  background-size: auto 42%;
}
</style>
