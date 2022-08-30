<!--沿河排口统计分析-->
<template>
    <div class="overflow_drainage_rank toggle_content toggle_right_5">
        <div class="panel_title">沿河排口统计分析</div>
        <el-tabs v-model="activeName">
            <el-tab-pane label="流量" name="1"></el-tab-pane>
            <el-tab-pane label="COD" name="2"></el-tab-pane>
            <el-tab-pane label="氨氮" name="3"></el-tab-pane>
            <el-tab-pane label="PH" name="4"></el-tab-pane>
        </el-tabs>
        <div id="overflow_drainage_rank_chart"></div>
    </div>
</template>

<script>
import { chartFontSize } from "@/lib";
export default {
  name: "OverflowDrainageRank",
  data() {
    return {
      activeName: "1",
      overflowDrainageRankOption: {
        color:["#45C6CB"],
        tooltip: {
          trigger: "axis"
        },
        grid:{
            containLabel:true,
            right: 0,
            top:"16%",
            left:0,
            bottom:"15%"
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
              "点位1",
              "点位2",
              "点位3",
              "点位4",
              "点位5",
              "点位6",
              "点位7",
              "点位8"
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
            },
            type: "value"
          }
        ],
        series: [
          {
            type: "line",
            smooth: true,
            lineStyle: {
              width: 3,
              color: "#45C6CB"
            },
            showSymbol: false,
            areaStyle: {
              opacity: 0.8,
              color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: "rgba(69, 198, 203, 0.5)"
                },
                {
                  offset: 1,
                  color: "rgba(69, 198, 203, 0)"
                }
              ])
            },
            data: [16, 22, 23, 24, 21, 25, 22, 21, 20, 22]
          }
        ]
      },
      overflowDrainageRankChart: {}
    };
  },
  methods: {
    resizeCharts() {
      const _this = this;
      _this.$nextTick(() => {
        _this.overflowDrainageRankChart.resize();
      });
    }
  },
  mounted() {
    const _this = this;
    _this.$nextTick(() => {
      _this.overflowDrainageRankChart = _this.$echarts.init(
        document.getElementById("overflow_drainage_rank_chart")
      );
      _this.overflowDrainageRankChart.setOption(
        _this.overflowDrainageRankOption
      );
      window.addEventListener("resize", _this.resizeCharts);
    });
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.resizeCharts);
  }
};
</script>

<style lang="scss" scoped>
.overflow_drainage_rank {
  height: 38.7%;
  padding-top: 61px;

  /deep/ .el-tabs {
    margin-top: 5px;
    .el-tabs__nav-wrap {
      &::after {
        display: none;
      }
    }

    .el-tabs__item {
      color: #d3dfeb;
      font-size: 14px;
      height: 35px;
      line-height: 40px;
      padding: 0 20px;

      &.is-active {
        color: #45c6cb;
      }
    }

    .el-tabs__header {
      width: 80%;
      margin: 0 auto;
    }

    .el-tabs__active-bar {
      height: 4px;
      background-color: #45c6cb;
      border-radius: 3px;
    }
  }

  #overflow_drainage_rank_chart {
    height: calc(90% - 40px);
  }
}
</style>
