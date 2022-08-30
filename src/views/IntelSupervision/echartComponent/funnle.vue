<template>
  <div :id="id" class="funnel"></div>
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
      stationNumberChart: {},
      stationStateChart: {},
      stationOption: {
        color: ['rgba(240,255,24,0.7)', 'rgba(11,255,109,0.7)', 'rgba(10,218,255,0.7)', 'rgba(66,103,226,0.7)'],
        series: [
          {
            width: "40%",
            height:'50%',
            type: "funnel",
            sort: "ascending",
            gap: chartFontSize(10),
            data: [],
            left: "20%",
            top:'30%',
          }
        ]
      }
    };
  },
  methods: {
    resizeCharts() {
      const _this = this;
      _this.$nextTick(() => {
        _this.stationNumberChart.resize();
      });
    },
    cauData(data) {
      const _this = this;
      var sum = 0;
      data.forEach(item => {
        sum += item.value;
      });

      var color = ['rgba(240,255,24,0.9)', 'rgba(11,255,109,0.9)', 'rgba(10,218,255,0.9)', 'rgba(66,103,226,0.9)'];
      var addUp = 0;
      var minHeight = 2;
      var top = 5;
      data = data.map((item, index) => {
        let itemValue = 0;
        if ((item.value / sum) * 250 < minHeight)
          itemValue = minHeight;
        else itemValue = (item.value / sum) * 250;
        top += itemValue;
        console.log(itemValue)
        return {
          value: (addUp += itemValue),
          name: item.name,
          realValue: item.value,

          label: {
            show: true,
            color: color[index],
            position: "left",
            fontSize: chartFontSize(12),
            formatter: () => {
              return `${item.name} ${item.value / 2} %`;
            }
          },
          labelLine: {
            length: chartFontSize(15),
            lineStyle: {
              width: 1,
              type: "solid"
            }
          },
          itemStyle: {
            height: chartFontSize(itemValue),
            borderWidth: 0,
            shadowBlur: chartFontSize(20),
            shadowOffsetX: 0,
            shadowOffsetY: chartFontSize(10),
            shadowColor: 'rgba(0, 0, 0, 0.5)',
            // normal: {
            //       borderColor: 'transparent',
            //       color: function(param) {
            //           return colorList[param.dataIndex]
            //       }
            // }
          }
        };
      });

      return data;
    },
    renderChart() {
      let seriesData1 = this.cauData(this.data);
      this.stationOption.series[0]["data"] = seriesData1;
      this.stationNumberChart.setOption(this.stationOption, true);
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
.funnel {
  width: 100%;
  height: 100%;
}
</style>
