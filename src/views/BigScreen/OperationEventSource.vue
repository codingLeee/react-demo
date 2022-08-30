<!--运维事件来源-->
<template>
    <div class="operation_event_source toggle_content toggle_right_7">
        <div class="panel_title">运维事件来源</div>
        <div id="operation_event_source_chart"></div>
    </div>
</template>

<script>
import { chartFontSize } from "@/lib";
export default {
  name: "OperationEventSource",
  data() {
    return {
      operationEventSourceChart: {},
      operationEventSourceOption: {
        color: ["#01F7B4", "#009BE4", "#4E35B9"],
        grid:{
            containLabel:true,
            right: 0,
            top:"16%",
            left:"2%",
            bottom:"15%"
        },
        legend: {
          right: 0,
          data: ["排口排污", "12345", "微信公众号"],
          textStyle: {
            fontWeight: 400,
            color: "#fff",
            fontSize: chartFontSize(14),
            lineHeight: chartFontSize(15),
            fontFamily: "SourceHanSansCN-Normal"
          },
          selectedMode: false,
          icon: "circle",
          pageIconSize: chartFontSize(10)
        },
        tooltip: {
          trigger: "axis"
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
            name: "排口排污",
            type: "bar",
            barMaxWidth: chartFontSize(20),
            stack: "Total",
            showSymbol: false,
            data: [140, 132, 101, 164, 135, 120, 150, 123, 145, 153, 167, 157]
          },
          {
            name: "12345",
            type: "bar",
            barWidth: 10,
            stack: "Total",
            //smooth: true,
            lineStyle: {
              width: 4,
              color: "#009BE4"
            },
            showSymbol: false,
            data: [120, 132, 121, 164, 120, 140, 160, 125, 134, 112, 156, 145]
          },
          {
            name: "微信公众号",
            type: "bar",
            barWidth: 10,
            stack: "Total",
            lineStyle: {
              width: 4,
              color: "#4E35B9"
            },
            showSymbol: false,
            data: [120, 132, 111, 134, 150, 130, 120, 132, 142, 125, 135, 148]
          }
        ]
      }
    };
  },
  methods: {
    resizeCharts() {
      const _this = this;
      _this.$nextTick(() => {
        _this.operationEventSourceChart.resize();
      });
    }
  },
  mounted() {
    const _this = this;
    _this.$nextTick(() => {
      _this.operationEventSourceChart = _this.$echarts.init(
        document.getElementById("operation_event_source_chart")
      );
      _this.operationEventSourceChart.setOption(_this.operationEventSourceOption);
      window.addEventListener("resize", _this.resizeCharts);
    });
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.resizeCharts);
  }
};
</script>

<style lang="scss" scoped>
.operation_event_source {
  height: 30.65%;

  #operation_event_source_chart {
    height: 90%;
  }
}
</style>
