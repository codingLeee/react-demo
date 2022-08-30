<template>
  <div :id="id" class="pie-container"></div>
</template>
<script>
import * as echarts from "echarts";
import { chartFontSize } from "@/lib";
export default {
  name: "echart",
  props: {
    id: {
      type: String,
    },
    data: {
      type: Object,
      default() {
        return {xData:[],yData:[]};
      },
    },
  },
  watch: {
    data: {
        handler: function () {
            this.refreshChart();
        },
        deep:true 
    },
  },
  methods: {
      refreshChart() {
        const colors = ['#5793f3','rgba(119,61,190)','rgba(23, 255, 243)']
        let option = {
            color: ["#00D7E9"],
            grid: {
            containLabel: true,
            top: "40",
            left: "2%",
            bottom: "10",
            right: "50",
            },
            legend: {
                orient: 'horizontal',
                top: chartFontSize(10),
            textStyle:{
                    fontSize: chartFontSize(12),//字体大小
                    color: 'rgba(255,255,255,.7)'//字体颜色
            }
        },
            tooltip: {
            trigger: "axis",
            },
            xAxis: [
            {
                type: "category",
                data: this.data.xData,
                axisLine: {
                lineStyle: {
                    color: "#999",
                },
                },
                axisTick: {
                show: false,
                },
                axisLabel: {
                color: "#fff",
                fontSize: "12",
                margin: chartFontSize(10),
                },
                splitLine: {
                show: false,
                },
            },
            ],
            yAxis: [],
            series: [],
        };
          let data = this.data;
          for (let i = 0; i < data.yData.length; i++){
            option.yAxis.push(
                {
                    type: "value",
                    name: data.yData[i]['name'],
                    position: data.yData.length == 0 ? "left" : (i == 1 || i == 2) ? "right" : "left",
                    offset:i == 2 ? 50 : 0,
                    axisLine: {
                    show: true,
                    lineStyle: {
                    color: "rgba(255,255,255,0.8)",
                    },
                    },
                    axisLabel: {
                    textStyle: {
                        color: "#fff",
                        fontSize: "12",
                    },
                    },
                    axisTick: {
                    show: false,
                    },
                    splitLine: {
                    show: false,
                    lineStyle: {
                        color: "rgba(153, 153, 153, .3)",
                        type: "dashed",
                    },
                    },
                }
            )
            option.series.push(
                {
                name: data.yData[i]['name'],
                type: "line",
                symbol: "none",
                yAxisIndex: i,
                smooth: true,
                itemStyle: {
                normal: {
                    color: colors[i], //改变折线点的颜色
                    lineStyle: {
                    color: colors[i],
                    },
                },
                },
                data: [...data.yData[i]['data']],
            }
            )
         
          }
        //初始化
        const chartObj = echarts.init(document.getElementById(this.id));
        chartObj.setOption(option);
        chartObj.resize();
        window.addEventListener("resize", function () {
            chartObj.resize();
        });
    },
  },
};
</script>
<style scoped>
.pie-container {
  width: 100%;
  height: 100%;
}
</style>
