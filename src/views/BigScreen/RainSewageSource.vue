<!--雨污混排溯源分析(重点排水户)-->
<template>
    <div class="rain_sewage_source toggle_content toggle_right_3">
        <div class="panel_title">雨污混排溯源分析(重点排水户)</div>
        <div id="rain_sewage_source_chart"></div>
    </div>
</template>

<script>
import { chartFontSize } from "@/lib";
export default {
  name: "RainSewageSource",
  data() {
    return {
      rainSewageSourceChart: {},
      rainSewageSourceOption: {
        color: ["#A334F4", "#01F792", "#37A2FF"],
        legend: {
          data: ["商铺倾倒", "污水冒溢", "其他"],
          right: 0,
          textStyle: {
            fontWeight: 400,
            color: "#D3DFEB",
            fontSize: chartFontSize(14),
            lineHeight: chartFontSize(35)
          },
          selectedMode: false,
          icon: "circle",
          pageIconSize: chartFontSize(8)
        },
        grid:{
            containLabel:true,
            right: 0,
            top:"16%",
            left:"2%",
            bottom:"15%"
        },
        tooltip: {
          trigger: 'axis'
        },
        xAxis: [
          {
            axisLabel: {
              fontWeight: 400,
              color: "#D3DFEB",
              fontSize: chartFontSize(14)
            },
            axisLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            type: "category",
            boundaryGap: false,
            data: [
              "1月",
              "2月",
              "3月",
              "4月",
              "5月",
              "6月",
              "7月",
              "8月",
              "9月",
              "10月",
              "11月",
              "12月"
            ]
          }
        ],
        yAxis: [
          {
            axisLabel: {
              fontWeight: 400,
              color: "#D3DFEB",
              fontSize: chartFontSize(14)
            },
            axisLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            splitLine: {
              show: false
            }
          }
        ],
        series: [
          {
            name: "商铺倾倒",
            type: "line",
            // stack: "Total",
            //smooth: true,
            lineStyle: {
              width: 3,
              color: "#A334F4"
            },
            showSymbol: false,
            areaStyle: {
              opacity: 0.8,
              color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: "rgba(163, 52, 244, 0.5)"
                },
                {
                  offset: 0.8,
                  color: "rgba(163, 52, 244, 0)"
                }
              ])
            },
            emphasis: {
              focus: "series"
            },
            data: [120, 112, 81, 144, 115, 100, 130, 103, 125, 133, 147, 137]
          },
          {
            name: "污水冒溢",
            type: "line",
            // stack: "Total",
            //smooth: true,
            lineStyle: {
              width: 3,
              color: "#01F792"
            },
            showSymbol: false,
            areaStyle: {
              opacity: 0.8,
              color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: "rgba(1, 247, 146, 0.4)"
                },
                {
                  offset: 0.8,
                  color: "rgba(1, 247, 146, 0)"
                }
              ])
            },
            emphasis: {
              focus: "series"
            },
            data: [120, 132, 121, 164, 120, 140, 160, 125, 134, 112, 156, 145]
          },
          {
            name: "其他",
            type: "line",
            // stack: "Total",
            //smooth: true,
            lineStyle: {
              width: 3,
              color: "#37A2FF"
            },
            showSymbol: false,
            areaStyle: {
              opacity: 0.8,
              color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: "rgba(55,162,255,0.4)"
                },
                {
                  offset: 0.8,
                  color: "rgba(55,162,255,0)"
                }
              ])
            },
            emphasis: {
              focus: "series"
            },
            data: [80, 92, 71, 94, 110, 90, 80, 92, 102, 85, 95, 108]
          }
        ]
      }
    };
  },
  methods: {
    resizeCharts() {
      const _this = this;
      _this.$nextTick(() => {
        _this.rainSewageSourceChart.resize();
      });
    }
  },
  mounted() {
    const _this = this;
    _this.$nextTick(() => {
      _this.rainSewageSourceChart = _this.$echarts.init(
        document.getElementById("rain_sewage_source_chart")
      );
      _this.rainSewageSourceChart.setOption(_this.rainSewageSourceOption);
      window.addEventListener("resize", _this.resizeCharts);
    });
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.resizeCharts);
  }
};
</script>

<style lang="scss" scoped>
.rain_sewage_source {
  height: 29.15%;

  #rain_sewage_source_chart {
    height: 90%;
  }
}
</style>
