<template>
  <div :id="id" class="buildGraph"></div>
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
    renderChart() {
      const _this = this;
      const colorList = [
        [
          "#ff7f50",
          "#87cefa",
          "#da70d6",
          "#32cd32",
          "#6495ed",
          "#ff69b4",
          "#ba55d3",
          "#cd5c5c",
          "#ffa500",
          "#40e0d0",
          "#1e90ff",
          "#ff6347",
          "#7b68ee",
          "#d0648a",
          "#ffd700",
          "#6b8e23",
          "#4ea397",
          "#3cb371",
          "#b8860b",
          "#7bd9a5"
        ],
        [
          "#ff7f50",
          "#87cefa",
          "#da70d6",
          "#32cd32",
          "#6495ed",
          "#ff69b4",
          "#ba55d3",
          "#cd5c5c",
          "#ffa500",
          "#40e0d0",
          "#1e90ff",
          "#ff6347",
          "#7b68ee",
          "#00fa9a",
          "#ffd700",
          "#6b8e23",
          "#ff00ff",
          "#3cb371",
          "#b8860b",
          "#30e0e0"
        ],
        [
          "#929fff",
          "#9de0ff",
          "#ffa897",
          "#af87fe",
          "#7dc3fe",
          "#bb60b2",
          "#433e7c",
          "#f47a75",
          "#009db2",
          "#024b51",
          "#0780cf",
          "#765005",
          "#e75840",
          "#26ccd8",
          "#3685fe",
          "#9977ef",
          "#f5616f",
          "#f7b13f",
          "#f9e264",
          "#50c48f"
        ]
      ][2];
      let seriesData = [];
      let minSymbolSize = 50,
        maxSymbolSize = 150,
        maxData = 0,
        dAry = [];

      _this.data.map(t => {
        dAry.push(t.value);
      });
      maxData = Math.max(...dAry);
      _this.data.map(t => {
        let size
        if((maxSymbolSize / maxData).toFixed(2) * t.value < minSymbolSize){
          size = minSymbolSize
        }else{
          size = (maxSymbolSize / maxData).toFixed(2) * t.value
        }
        let colorIndex = Math.floor(Math.random()*20+1);
        seriesData.push({
          name: t.name,
          value: 1,
          symbolSize: chartFontSize(size),
          draggable: true,
          itemStyle: {
            normal: {
              shadowBlur: chartFontSize(4),
              shadowColor: colorList[colorIndex],
              borderColor: colorList[colorIndex],
              borderWidth: chartFontSize(1),
              color: "rgba(55, 24, 213, .1)"
            }
          }
        });
      });
      let option = {
        tooltip: {},
        animationDurationUpdate: function(idx) {
          // 越往后的数据延迟越大
          return idx * 100;
        },
        animationEasingUpdate: "bounceIn",
        series: [
          {
            type: "graph",
            layout: "force",
            force: {
              repulsion: 200,
              edgeLength: 10
            },
            roam: true,
            label: {
              normal: {
                show: true
              }
            },
            data: seriesData
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
          setTimeout(() => {
            _this.stationNumberChart = _this.$echarts.init(
              document.getElementById(this.id)
            );
            _this.renderChart();
            window.addEventListener("resize", _this.resizeCharts);
          }, 500);
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
.buildGraph {
  width: 100%;
  height: 100%;
  > div {
    width: 100% !important;
  }
}
</style>
