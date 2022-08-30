<!--点位设备状态-->
<template>
    <div class="point_equipment_status">
        <div class="status_top toggle_content toggle_left_7">
            <div class="panel_title">点位设备状态</div>
            <ul class="drops_content">
              <li>
                <div class="drops_left"></div>
                <div class="drops_right">
                  <p>污水井掉线率</p>
                  <p>{{fliterStatusData("dataStaticsPercent","ws")["disconnectedPercent"] || 0}} <span>%</span></p>
                </div>
              </li>
              <li>
                <div class="drops_left"></div>
                <div class="drops_right">
                  <p>雨水井掉线率</p>
                  <p>{{fliterStatusData("dataStaticsPercent","ys")["disconnectedPercent"] || 0}} <span>%</span></p>
                </div>
              </li>
              <li>
                <div class="drops_left"></div>
                <div class="drops_right">
                  <p>排口掉线率</p>
                  <p>{{fliterStatusData("dataStaticsPercent","pk")["disconnectedPercent"] || 0}} <span>%</span></p>
                </div>
              </li>
              <li>
                <div class="drops_left"></div>
                <div class="drops_right">
                  <p>泵站掉线率</p>
                  <p>{{fliterStatusData("dataStaticsPercent","bz")["disconnectedPercent"] || 0}} <span>%</span></p>
                </div>
              </li>
            </ul>
        </div>
        <div class="status_center toggle_content toggle_left_8">
          <div class="status_center_left" id="fault_chart"></div>
          <ul class="fault_content">
            <li>
              <div>污水井</div>
              <div>
                <div :style='"width:"+(fliterStatusData("dataStatics","ws")["faultNum"]/fliterStatusData("dataStatics","ws")["total"] * 100)+"%"'></div>
              </div>
              <div>{{fliterStatusData("dataStatics","ws")["faultNum"] || 0}}/{{fliterStatusData("dataStatics","ws")["total"] || 0}}</div>
            </li>
            <li>
              <div>雨水井</div>
              <div>
                <div :style='"width:"+(fliterStatusData("dataStatics","ys")["faultNum"]/fliterStatusData("dataStatics","ys")["total"] * 100)+"%"'></div>
              </div>
              <div>{{fliterStatusData("dataStatics","ys")["faultNum"] || 0}}/{{fliterStatusData("dataStatics","ys")["total"] || 0}}</div>
            </li>
            <li>
              <div>排口</div>
              <div>
                <div :style='"width:"+(fliterStatusData("dataStatics","pk")["faultNum"]/fliterStatusData("dataStatics","pk")["total"] * 100)+"%"'></div>
              </div>
              <div>{{fliterStatusData("dataStatics","pk")["faultNum"] || 0}}/{{fliterStatusData("dataStatics","pk")["total"] || 0}}</div>
            </li>
            <li>
              <div>泵站</div>
              <div>
                <div :style='"width:"+(fliterStatusData("dataStatics","bz")["faultNum"]/fliterStatusData("dataStatics","bz")["total"] * 100)+"%"'></div>
              </div>
              <div>{{fliterStatusData("dataStatics","bz")["faultNum"] || 0}}/{{fliterStatusData("dataStatics","bz")["total"] || 0}}</div>
            </li>
          </ul>
        </div>
        <div class="status_bottom toggle_content toggle_left_9">
          <scroll-table 
            class="equipmentStatusTable"
            :listData="deviceStatusInfo['data'] || []" 
            :columnData="equipmentStatusColumnData"
          >
          </scroll-table>
        </div>
    </div>
</template>

<script>
import {
  CreateSocket
  // createSocket,
  // onmessageWS,
  // closeWs,
  // sendWSPush
} from "@/lib/websocket";
import { chartFontSize, checkNotNull } from "@/lib";

export default {
  name: "PointEquipmentStatus",
  data() {
    return {
      faultChart: {},
      sccketObj: {},
      faultOption: {
        series: [
          {
            name: "故障",
            type: "pie",
            clockWise: false,
            radius: ["86%", "94%"],
            itemStyle: {
              normal: {
                color: "#FA7A4E",
                label: {
                  show: false
                },
                labelLine: {
                  show: false
                }
              }
            },
            hoverAnimation: false,
            center: ["50%", "34.5%"],
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
                      return "{a|" + params.value + "}{b|%}\n{x|故障}";
                    },
                    textStyle: {
                      rich: {
                        a: {
                          fontSize: chartFontSize(27),
                          fontWeight: "400",
                          color: "#fff",
                          fontFamily: "GothicThirteenStd"
                        },
                        b: {
                          fontSize: chartFontSize(27),
                          fontWeight: "400",
                          color: "#fff",
                          fontFamily: "DINCondBlackAlternate"
                        },
                        x: {
                          fontSize: chartFontSize(12),
                          color: "#A4ACBF"
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
      deviceStatusInfo: {},
      equipmentStatusColumnData: [
        {
          name: "点位名称",
          field: "dnTs"
        },
        {
          name: "时间",
          field: "testTime"
        },
        {
          name: "故障原因",
          field: "alarmInfo"
        }
      ],
      wsUrl: process.env.WEBSOCKET_API + "/deviceAlarm/1"
    };
  },
  methods: {
    getsocketData(data) {
      this.deviceStatusInfo = JSON.parse(data) || {};
      this.renderFaultChart();
    },
    resizeCharts() {
      const _this = this;
      _this.$nextTick(() => {
        _this.faultChart.resize();
      });
    },
    fliterStatusData(dataField, type) {
      let currStatusData = [];
      if (checkNotNull(this.deviceStatusInfo)) {
        currStatusData = this.deviceStatusInfo[dataField].filter(m => {
          return m["deviceType"] == type;
        });
      }

      return checkNotNull(currStatusData) ? currStatusData[0] : {};
    },
    renderFaultChart() {
      let seriesData = 0;
      if (checkNotNull(this.deviceStatusInfo)) {
        seriesData = this.deviceStatusInfo["totalStaticsPercent"][0][
          "faultPercent"
        ];
      }

      this.faultOption["series"][0]["data"][1]["value"] = seriesData * 100;
      this.faultChart.setOption(this.faultOption, true);
    }
  },
  mounted() {
    const _this = this;
    _this.$nextTick(() => {
      // 故障图表
      _this.faultChart = _this.$echarts.init(
        document.getElementById("fault_chart")
      );
      _this.faultChart.setOption(_this.faultOption);
      window.addEventListener("resize", _this.resizeCharts);

      let websocketApi = 'ws://192.168.18.240:19003';
      if (location.hostname == "171.221.172.25") {
        websocketApi = "ws://172.24.179.164:19003";
      } else if (location.hostname == "192.168.18.240") {
        websocketApi = "ws://192.168.18.240:19003";
      }

      _this.wsUrl = websocketApi + "/deviceAlarm/1";
      _this.sccketObj = new CreateSocket(_this.wsUrl);
      _this.sccketObj.Socket.onmessage = function(e) {
        _this.getsocketData(e.data);
      };
    });
  },
  beforeDestroy() {
    if (this.sccketObj.Socket) {
      this.sccketObj.Socket.close();
      this.sccketObj = null;
    }
  }
};
</script>

<style lang="scss" scoped>
.point_equipment_status {
  height: 71%;

  .status_top {
    height: 29.58%;
    // 掉线率
    .drops_content {
      display: flex;
      flex-wrap: wrap;
      color: #fff;

      li {
        margin-top: 16px;
        display: flex;

        &:nth-child(1),
        &:nth-child(3) {
          width: calc(50% + 20px);
        }
        &:nth-child(2),
        &:nth-child(4) {
          width: calc(50% - 20px);
        }

        .drops_left {
          width: 51px;
          height: 51px;
          background: url(~static/BigScreen/img/drops_icon_1.png) no-repeat
            center center;
          background-size: 100%;
          margin-right: 12px;
        }

        .drops_right {
          p {
            &:nth-child(1) {
              padding: 6px 0 2px;
              font-size: 15px;
              color: #d3d9d9;
            }

            &:nth-child(2) {
              font-family: GothicThirteenStd;
              font-size: 27px;

              span {
                font-family: DINCondBlackAlternate;
                font-size: 20px;
                margin-left: -5px;
              }
            }
          }
        }
      }
    }
  }

  .status_center {
    height: 22.35%;
    display: flex;

    #fault_chart {
      width: 98px;
      height: 100%;
    }

    // 故障
    .fault_content {
      width: calc(100% - 98px);
      color: #fff;
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
  .status_bottom {
    height: 47.92%;
  }

  .equipmentStatusTable {
    height: calc(100% - 60px);
  }
}
</style>
