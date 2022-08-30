<!--当前时刻告警统计-->
<template>
    <div class="current_alarm_statistics">
        <div class="alarm_top toggle_content toggle_left_3">
            <div class="panel_title">当前时刻告警统计</div>
            <div class="alarm_top_content">
                <div id="alarm_chart"></div>
                <ul class="alarm_content">
                    <li v-for="item in (equipmentStatusInfo['deviceStatics'] || [])" :key="item['deviceTypeTs']">
                        <div>{{item["deviceTypeTs"]}}</div>
                        <div>
                            <div :style='"width:"+(item["deviceAlarms"]/item["deviceAmount"] * 100)+"%"'></div>
                        </div>
                        <div>{{item["deviceAlarms"] || 0}}/{{item["deviceAmount"] || 0}}</div>
                    </li>
                </ul>
            </div>
        </div>
        <div class="alarm_bottom toggle_content toggle_left_4">
            <scroll-table 
                class="alarmTable"
                :listData="alarmTableData" 
                :columnData="equipmentStatusColumnData"
            >
            </scroll-table>
        </div>
    </div>
</template>

<script>
import { CreateSocket } from "@/lib/websocket";
import { chartFontSize, checkNotNull } from "@/lib";

export default {
  name: "CurrentAlarmStatistics",
  data() {
    return {
      alarmChart: {},
      sccketObj: {},
      alarmTableData:[],
      alarmOption: {
        series: [
          {
            name: "告警总数",
            type: "pie",
            clockWise: false,
            radius: ["86%", "94%"],
            itemStyle: {
              normal: {
                color: "#01F7B4",
                label: {
                  show: false
                },
                labelLine: {
                  show: false
                }
              }
            },
            hoverAnimation: false,
            center: ["50%", "36.5%"],
            grid: {
              top: 0
            },
            data: [
              {
                value: 100,
                name: "invisible",
                itemStyle: {
                  normal: {
                    color: "rgba(255,255,255,0.2)"
                  }
                }
              },
              {
                value: 0,
                label: {
                  normal: {
                    formatter: function(params) {
                      return "{a|" + params.value + "}{b|%}\n{x|告警总数}";
                    },
                    textStyle: {
                      rich: {
                        a: {
                          fontSize: chartFontSize(27),
                          fontWeight: "400",
                          color: "#fff",
                          fontFamily: "GothicThirteenStd"
                        },
                        x: {
                          fontSize: chartFontSize(12),
                          color: "#A4ACBF"
                        },
                        b: {
                          fontSize: chartFontSize(27),
                          fontWeight: "400",
                          color: "#fff",
                          fontFamily: "DINCondBlackAlternate"
                        }
                      }
                    },
                    position: "center",
                    show: true
                  }
                }
              }
            ]
          }
        ]
      },
      equipmentStatusColumnData: [
        {
          name: "点位名称",
          field: "pointName"
        },
        {
          name: "时间",
          field: "testTime"
        },
        {
          name: "告警信息",
          field: "alarmInfo"
        }
      ],
      equipmentStatusInfo: [],
      wsUrl: process.env.WEBSOCKET_API + "/dataAlarm/2"
    };
  },
  methods: {
    getsocketData(data) {
      this.equipmentStatusInfo = JSON.parse(data) || {};
      this.alarmTableData =JSON.parse(JSON.stringify(this.equipmentStatusInfo["alarmList"] || []));
      this.alarmTableData.forEach(m=>{
          m["alarmInfo"] = m["factorName"]+"("+m["alarmValue"]+")";
      })
      this.renderAlarmChart();
    },
    resizeCharts() {
      const _this = this;
      _this.$nextTick(() => {
        _this.alarmChart.resize();
      });
    },
    renderAlarmChart() {
      let seriesData = 0;
      if (checkNotNull(this.equipmentStatusInfo)) {
        seriesData = this.equipmentStatusInfo["totalStatics"]["alarmsPercent"];
      }

      this.alarmOption["series"][0]["data"][1]["value"] = seriesData * 100;
      this.alarmChart.setOption(this.alarmOption, true);
    }
  },
  mounted() {
    const _this = this;
    _this.$nextTick(() => {
      _this.alarmChart = _this.$echarts.init(
        document.getElementById("alarm_chart")
      );
      _this.alarmChart.setOption(_this.alarmOption);
      window.addEventListener("resize", _this.resizeCharts);

      let websocketApi = 'ws://192.168.18.240:19003';
      if (location.hostname == "171.221.172.25") {
        websocketApi = "ws://172.24.179.164:19003";
      } else if (location.hostname == "192.168.18.240") {
        websocketApi = "ws://192.168.18.240:19003";
      }

      _this.wsUrl = websocketApi + "/deviceAlarm/2";
      // 实时数据 注册ws建立连接
      _this.sccketObj = new CreateSocket(_this.wsUrl);
      _this.sccketObj.Socket.onmessage = function(e) {
        console.log(e);
        _this.getsocketData(e.data);
      };
    });
  },
  beforeDestroy() {
    if(this.sccketObj.Socket){
      this.sccketObj.Socket.close();
      this.sccketObj = null;
    }
  }
};
</script>

<style lang="scss" scoped>
.current_alarm_statistics {
  height: 54.15%;

  .alarm_top {
    height: 36.38%;

    .alarm_top_content {
      height: calc(90% - 20px);
      margin-top: 20px;
      display: flex;

      #alarm_chart {
        width: 98px;
        height: 100%;
      }

      .alarm_content {
        width: calc(100% - 98px);

        li {
          display: flex;
          align-items: center;
          margin-bottom: 5px;

          div {
            font-size: 15px;
            &:nth-child(1) {
              width: 63px;
              text-align: right;
              color: #d3d9d9;
            }

            &:nth-child(3) {
              width: 47px;
            }

            &:nth-child(2) {
              flex: 1;
              margin: 0 5px;
              background-color: rgba(255, 255, 255, 0.2);
              height: 5px;

              div {
                width: 0;
                height: 100%;
                background-color: #01f792;
              }
            }
          }

          &:nth-child(1) {
            div {
              &:nth-child(2) {
                div {
                  background-color: #45c6cb;
                }
              }
            }
          }

          &:nth-child(3),
          &:nth-child(4) {
            div {
              &:nth-child(2) {
                div {
                  background-color: #e0fffd;
                }
              }
            }
          }
        }
      }
    }
  }

  .alarm_bottom {
    height: 63.62%;

    .alarmTable {
      height: calc(100% - 60px);
    }
  }
}
</style>
