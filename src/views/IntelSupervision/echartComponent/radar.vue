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
    radarChartData: {
      type: Object,
      default() {
        return {
          legendData: [],
          indicator: [],
          data: []
        };
      }
    },
    showLegend: {
      type: Boolean,
      default() {
        return true;
      }
    },
  },
  watch: {
    radarChartData: {
      handler: function() {
        if(JSON.stringify(this.radarChartData) !== '{}'){
          this.refreshChart();
        }
      },
      deep: true
    }
  },
  methods: {
    refreshChart() {
      const _this = this;
      let color = ["rgba(0, 255, 255, 1)", "rgba(253, 179, 87, 1)"];
      let max;
      if(_this.radarChartData.data[1]){
        max = Math.max(
          ..._this.radarChartData.data[0],
          ..._this.radarChartData.data[1]
        );
      }else{
        max = Math.max(
          ..._this.radarChartData.data[0]
        );
      }
      let indicatorData = [];
      this.radarChartData.indicator.map(t => {
        indicatorData.push({
          text: t,
          max
        });
      });
      let dataArr = [];
      this.radarChartData.legendData.map((t, i) => {
        dataArr.push({
          value: this.radarChartData.data[i],
          name: _this.radarChartData.legendData[i],
          itemStyle: {
            normal: {
              lineStyle: {
                color: color[i]
                // shadowColor: '#4A99FF',
                // shadowBlur: 10,
              },
              shadowColor: color[i],
              shadowBlur: chartFontSize(10)
            }
          },
          label: {
            // 单个拐点文本的样式设置
            normal: {
              show: true, // 单个拐点文本的样式设置。[ default: false ]
              position: "top", // 标签的位置。[ default: top ]
              distance: 2, // 距离图形元素的距离。当 position 为字符描述值（如 'top'、'insideRight'）时候有效。[ default: 5 ]
              color: "#6692e2", // 文字的颜色。如果设置为 'auto'，则为视觉映射得到的颜色，如系列色。[ default: "#fff" ]
              fontSize: chartFontSize(14), // 文字的字体大小
              formatter: function(params) {
                return params.value;
              }
            }
          },
          areaStyle: {
            normal: {
              // 单项区域填充样式
              color: {
                type: "linear",
                x: 0, //右
                y: 0, //下
                x2: 1, //左
                y2: 1, //上
                colorStops: [
                  {
                    offset: 0,
                    color: color[i]
                  },
                  {
                    offset: 0.5,
                    color: "rgba(0,0,0,0)"
                  },
                  {
                    offset: 1,
                    color: color[i]
                  }
                ],
                globalCoord: false
              },
              opacity: 1 // 区域透明度
            }
          }
        });
      });
      const option = {
        color: color,
        legend: {
          show: _this.showLegend,
          // icon: 'circle',//图例形状
          bottom: chartFontSize(45),
          center: 0,
          itemWidth: chartFontSize(14), // 图例标记的图形宽度。[ default: 25 ]
          itemHeight: chartFontSize(14), // 图例标记的图形高度。[ default: 14 ]
          itemGap: chartFontSize(20), // 图例每项之间的间隔。[ default: 10 ]横向布局时为水平间隔，纵向布局时为纵向间隔。
          textStyle: {
            fontSize: chartFontSize(14),
            color: "#ade3ff"
          },
          data: this.radarChartData.legendData
        },
        radar: {
          radius: "55%",
          name: {
            textStyle: {
              color: "#fff",
              fontSize: chartFontSize(16)
            }
          },
          indicator: indicatorData,
          splitArea: {
            // 坐标轴在 grid 区域中的分隔区域，默认不显示。
            show: true,
            areaStyle: {
              // 分隔区域的样式设置。
              color: ["rgba(255,255,255,0)", "rgba(255,255,255,0)"] // 分隔区域颜色。分隔区域会按数组中颜色的顺序依次循环设置颜色。默认是一个深浅的间隔色。
            }
          },
          axisLine: {
            //指向外圈文本的分隔线样式
            lineStyle: {
              color: "#153269"
            }
          },
          splitLine: {
            lineStyle: {
              color: "#113865", // 分隔线颜色
              width: chartFontSize(1) // 分隔线线宽
            }
          }
        },
        series: [
          {
            type: "radar",

            symbolSize: chartFontSize(8),
            // symbol: 'angle',
            data: dataArr
          }
        ]
      };
      //初始化
      const chartObj = echarts.init(document.getElementById(this.id));
      chartObj.setOption(option);
      chartObj.resize();
      window.addEventListener("resize", function() {
        chartObj.resize();
      });
    }
  }
};
</script>
<style scoped>
.funnel {
  width: 100%;
  height: 100%;
}
</style>
