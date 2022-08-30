<!--排水运维调度分析（当月）-->
<template>
    <div class="drainage_operation_analysis toggle_content toggle_right_6">
        <div class="panel_title">排水运维调度分析（当月）</div>
        <div id="drainage_operation_analysis_chart"></div>
    </div>
</template>

<script>
import { chartFontSize } from "@/lib";
export default {
  name: "DrainageOperationAnalysis",
  data() {
    return {
      drainageOperationChart: {},
      drainageOperationOption: {
        tooltip: {},
        color: ["#0E92C7", "#115DA3", "#2534A7", "#16764C", "#075A6F"],
        legend: {
          orient: "vertical",
          top: "center",
          right: "8%",
          icon: "circle",
          pageIconSize: chartFontSize(11),
          textStyle: {
            align: "left",
            verticalAlign: "middle",
            color: "#fff",
            fontSize: chartFontSize(14),
            fontFamily: "SourceHanSansCN-Normal",
            lineHeight: chartFontSize(30),
            fontweight: 400
          }
        },
        series: [
          {
            type: "pie",
            radius: ["50%", "65%"],
            center: ["30%", "50%"],
            data: [
              {
                name: "管网堵塞",
                value: "220"
              },
              {
                name: "井盖丢失",
                value: "120"
              },
              {
                name: "污水冒溢",
                value: "200"
              },
              {
                name: "泵站检修",
                value: "100"
              },
              {
                name: "排口排污",
                value: "152"
              }
            ],
            hoverAnimation: false,
            labelLine: {
              normal: {
                show: false
              }
            },
            label: {
              normal: {
                show: false
              }
            }
          }
        ]
      }
    };
  },
  methods: {
    resizeCharts() {
      const _this = this;
      _this.$nextTick(() => {
        _this.drainageOperationChart.resize();
      });
    }
  },
  mounted() {
    const _this = this;
    _this.$nextTick(() => {
      _this.drainageOperationChart = _this.$echarts.init(
        document.getElementById("drainage_operation_analysis_chart")
      );
      _this.drainageOperationChart.setOption(_this.drainageOperationOption);
      window.addEventListener("resize", _this.resizeCharts);
    });
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.resizeCharts);
  }
};
</script>

<style lang="scss" scoped>
.drainage_operation_analysis {
  height: 30.65%;

  #drainage_operation_analysis_chart {
    height: 90%;
  }
}
</style>
