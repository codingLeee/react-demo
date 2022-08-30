<template>
  <div :id="id" class="wordCloud"></div>
</template>
<script>
import * as echarts from "echarts";
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
      causesChart: {},
      causesOption: {
        tooltip: {
          show: true,
          backgroundColor: "rgba(255, 255, 255, 0)",
          textStyle: {
            color: "#fff"
          }
          // extraCssText: 'box-shadow: 0 4px 20px -4px rgba(199, 206, 215, .7); border-radius: 4px;'
        },
        series: [
          {
            type: "wordCloud",
            shape: "rectangle",
            left: "center",
            top: "center",
            width: "100%",
            height: "100%",
            right: 0,
            left: 0,
            top: 0,
            bottom: 0,
            sizeRange: [
              chartFontSize(16),
              chartFontSize(33)
            ],
            rotationRange: [0, 0],
            rotationStep: 0,
            gridSize: chartFontSize(20),
            drawOutOfBound: false,
            layoutAnimation: true,
            textStyle: {
              normal:{
                fontFamily: "SourceHanSansCN-Normal",
              color: function(params) {
                let colors = [
                  "#8B70F5",
                  "#19DC7C",
                  "#0179FE",
                  "#46A5E7",
                  "#01E4FF",
                  "#6146E7",
                  "#FEE17B",
                  "#FE8A35"
                ];
                return colors[parseInt(Math.random() * 8)];
              }
              }
              
            },
            emphasis: {
              focus: "none"
            },
            data: []
          }
        ]
      }
    };
  },
  // watch: {
  //   data: {
  //     handler: function () {
  //       const _this = this;
  //        _this.$nextTick(() => {
  //           _this.causesChart = _this.$echarts.init(document.getElementById(this.id))
  //           _this.causesChart.setOption(_this.causesOption)
  //           window.addEventListener('resize', _this.resizeCharts)
  //       })
  //     },
  //   }
  //   },
  methods: {
    resizeCharts() {
      const _this = this;
      _this.$nextTick(() => {
        _this.causesChart.resize();
      });
    }
  },
  watch: {
    data: {
      handler: function() {
        const _this = this;
        _this.$nextTick(() => {
          _this.causesChart = _this.$echarts.init(
            document.getElementById(_this.id)
          );
            _this.causesOption.series[0]['data'] = this.data;
            _this.causesChart.setOption(_this.causesOption);
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
.wordCloud {
  width: 100%;
  height: 100%;
}
</style>
