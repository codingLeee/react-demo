<!--管道情况统计-->
<template>
    <div class="pipeline_statistics toggle_content toggle_left_2">
        <div class="panel_title">管道情况统计</div>
        <div class="pipeline_statistics_content">
            <ul>
                <li>
                    <p class="panel_title_second_level">管网总长</p>
                    <p class="pipeline_statistics_num"><span>2046</span> <span>KM</span></p>
                </li>
                <li>
                    <p class="panel_title_second_level">管网总长</p>
                    <p class="pipeline_statistics_num"><span>493.72</span> <span>KM</span></p>
                </li>
                <li>
                    <p class="panel_title_second_level">管网总长</p>
                    <p class="pipeline_statistics_num"><span>874.86</span> <span>KM</span></p>
                </li>
            </ul>

            <div id="pipeline_statistics_chart"></div>
        </div>
    </div>
</template>

<script>
import { chartFontSize } from "@/lib";
export default {
  name: "PipelineStatistics",
  data() {
    return {
      pipelineStatisticsOption: {
        color: [
          "#139DEC",
          "#0248C8",
          "#842CC5",
          "#B8E12E",
          "#1B9C9B",
          "#C37329"
        ],
        series: [
          {
            type: "pie",
            radius: ["60%", "68%"],
            center: ["55%", "45%"],
            data: [
              {
                name: "破裂",
                value: "220"
              },
              {
                name: "腐蚀",
                value: "120"
              },
              {
                name: "变形",
                value: "200"
              },
              {
                name: "障碍物",
                value: "100"
              },
              {
                name: "结垢",
                value: "152"
              },
              {
                name: "错接",
                value: "50"
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
                formatter: params => {
                  return "{name|" + params.name + "}";
                },
                padding: [0, -35, 0, -35],
                rich: {
                  name: {
                    fontSize: chartFontSize(14),
                    fontWeight: 400,
                    padding: [0, 10, 0, 4],
                    color: "#FFFFFF",
                    fontFamily: "SourceHanSansCN-Normal"
                    // lineHeight: "10px"
                  }
                }
              }
            }
          }
        ]
      },
      pipelineStatisticsChart: {}
    };
  },
  methods: {
    resizeCharts() {
      const _this = this;
      _this.$nextTick(() => {
        _this.pipelineStatisticsChart.resize();
      });
    }
  },
  mounted() {
    const _this = this;
    _this.$nextTick(() => {
      _this.pipelineStatisticsChart = _this.$echarts.init(
        document.getElementById("pipeline_statistics_chart")
      );
      _this.pipelineStatisticsChart.setOption(_this.pipelineStatisticsOption);
      window.addEventListener("resize", _this.resizeCharts);
    });
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.resizeCharts);
  }
};
</script>

<style lang="scss" scoped>
.pipeline_statistics {
  height: 28.8%;

  .pipeline_statistics_content {
    display: flex;
    height: 90%;

    > ul {
      width: 40%;
      height: 100%;
    }
    > div {
      width: 60%;
      height: 100%;
    }

    .pipeline_statistics_num {
      span {
        display: inline-block;
        // vertical-align: middle;
        color: #01f7b4;

        &:nth-child(1) {
          font-size: 25px;
          line-height: 42px;
          font-family: GothicThirteenStd;
        }

        &:nth-child(2) {
          font-size: 12px;
          line-height: 13px;
        }
      }
    }
  }
}
</style>
