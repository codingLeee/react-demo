<template>
  <!--设备报警统计分析-->
  <div class="equipStatistics-container system-container">
    <div class="equipSta-footer system-footer">
      <div class="curTimeBox card-box">
        <systemPanel title="设备状态（今日）">
          <div class="equip-top-con">
            <div class="equip-top-item">
              <div class="equip-top-item-icon">
                <div class="equip-top-item-icon-radius">
                  <img
                    src="/static/ManageSystem/img/monitoringEquipment-icon1.png"
                    alt=""
                  />
                </div>
              </div>
              <div class="equip-top-item-des">
                <div class="equip-top-item-des-num">
                  {{ deviceStateObj.deviceNum }}
                </div>
                <div class="equip-top-item-des-text">设备总数</div>
              </div>
            </div>
            <div class="equip-top-item">
              <div class="equip-top-item-icon">
                <div class="equip-top-item-icon-radius">
                  <img
                    src="/static/ManageSystem/img/monitoringEquipment-icon2.png"
                    alt=""
                  />
                </div>
              </div>
              <div class="equip-top-item-des">
                <div class="equip-top-item-des-num">
                  {{ deviceStateObj.normalNum }}
                </div>
                <div class="equip-top-item-des-text">正常</div>
              </div>
            </div>
            <div class="equip-top-item">
              <div class="equip-top-item-icon">
                <div class="equip-top-item-icon-radius">
                  <img
                    src="/static/ManageSystem/img/monitoringEquipment-icon3.png"
                    alt=""
                  />
                </div>
              </div>
              <div class="equip-top-item-des">
                <div class="equip-top-item-des-num">
                  {{ deviceStateObj.probleNum }}
                </div>
                <div class="equip-top-item-des-text">故障</div>
              </div>
            </div>
            <div class="equip-top-item">
              <div class="equip-top-item-icon">
                <div class="equip-top-item-icon-radius">
                  <img
                    src="/static/ManageSystem/img/monitoringEquipment-icon4.png"
                    alt=""
                  />
                </div>
              </div>
              <div class="equip-top-item-des">
                <div class="equip-top-item-des-num">
                  {{ deviceStateObj.outNum }}
                </div>
                <div class="equip-top-item-des-text">离线</div>
              </div>
            </div>
            <div class="equip-top-item">
              <div class="equip-top-item-icon">
                <div class="equip-top-item-icon-radius">
                  <img
                    src="/static/ManageSystem/img/monitoringEquipment-icon5.png"
                    alt=""
                  />
                </div>
              </div>
              <div class="equip-top-item-des">
                <div class="equip-top-item-des-num">
                  {{ deviceStateObj.checkNum }}
                </div>
                <div class="equip-top-item-des-text">维护</div>
              </div>
            </div>
          </div>
        </systemPanel>
      </div>
      <div class="sbgzlx card-box">
        <systemPanel title="设备故障类型（今日）">
          <div class="echart-div">
            <pie-chart
              v-show="deviceTypePieData.length !== 0"
              :id="'device-pie'"
              :data="deviceTypePieData"
            ></pie-chart>
            <no-data v-show="deviceTypePieData.length == 0"></no-data>
          </div>
        </systemPanel>
      </div>
      <div class="sbgzlx-con card-box">
        <systemPanel title="设备处理情况（今日）">
          <div
            class="device-echart-div"
            v-show="eventSituationData.length !== 0"
          >
            <div>
              <piejd-chart
                :id="'device-gz-pie1'"
                :color="'#147AD6'"
                :subtext="
                  eventSituationData[0] &&
                  eventSituationData[0]['eventSituation']
                    ? eventSituationData[0]['eventSituation']
                    : ''
                "
                :value="
                  eventSituationData[0] && eventSituationData[0]['per']
                    ? eventSituationData[0]['per']
                    : 0
                "
              ></piejd-chart>
            </div>
            <div>
              <piejd-chart
                :id="'device-gz-pie2'"
                :color="'#EC6666'"
                :subtext="
                  eventSituationData[1] &&
                  eventSituationData[1]['eventSituation']
                    ? eventSituationData[1]['eventSituation']
                    : ''
                "
                :value="
                  eventSituationData[1] && eventSituationData[1]['per']
                    ? eventSituationData[1]['per']
                    : 0
                "
              ></piejd-chart>
            </div>
            <div>
              <piejd-chart
                :id="'device-gz-pie3'"
                :color="'#78D2DD'"
                :subtext="
                  eventSituationData[2] &&
                  eventSituationData[2]['eventSituation']
                    ? eventSituationData[2]['eventSituation']
                    : ''
                "
                :value="
                  eventSituationData[2] && eventSituationData[2]['per']
                    ? eventSituationData[2]['per']
                    : 0
                "
              ></piejd-chart>
            </div>
          </div>
          <div
            class="device-echart-div"
            v-show="eventSituationData.length == 0"
          >
            <no-data></no-data>
          </div>
        </systemPanel>
      </div>
      <div class="sbjk card-box">
        <systemPanel title="设备健康率">
          <div class="health-echart-div">
            <piemeter-chart
              :id="'device-gz-pie4'"
              v-show="JSON.stringify(deviceHealthyData) !== '{}'"
              :value="deviceHealthyData.healthy"
            ></piemeter-chart>
            <no-data
              v-show="JSON.stringify(deviceHealthyData) == '{}'"
            ></no-data>
          </div>
        </systemPanel>
      </div>
      <div class="dwgz card-box">
        <systemPanel title="点位故障排名（本月）">
          <div class="health-echart-div rate-scroll">
            <div class="point-con" v-if="deviceFaultTopData.length !== 0">
              <div
                class="point-item"
                v-for="(t, i) in deviceFaultTopData"
                :key="i"
              >
                <div class="point-item-rate">{{ i + 1 }}</div>
                <el-tooltip class="item" effect="dark" :content="t.addr" placement="top">
                    <div class="point-item-address">{{ t.addr }}</div>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" :content="t.pointName" placement="top">
                    <div class="point-item-nm">{{ t.pointName }}</div>
                </el-tooltip>
                <div class="point-item-number">{{ t.num }}次</div>
                <div class="point-item-echart">
                  <el-progress
                    :percentage="t.per"
                    :color="
                      i == 0
                        ? '#ef7a27'
                        : i == 1
                        ? '#e0ba25'
                        : i == 2
                        ? '#13c159'
                        : '#139cd2'
                    "
                  ></el-progress>
                </div>
              </div>
            </div>
            <no-data v-if="deviceFaultTopData.length == 0"></no-data>
          </div>
        </systemPanel>
      </div>
      <div class="sbgztj card-box">
        <systemPanel title="设备故障统计（本月）">
          <div class="health-echart-div">
            <line-chart
              :id="'device-gz-pie6'"
              v-show="deviceFaultStaData.xData.length !== 0"
              :data="deviceFaultStaData"
            ></line-chart>
            <no-data v-if="deviceFaultStaData.xData.length == 0"></no-data>
          </div>
        </systemPanel>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
import PieChart from "@/views/IntelSupervision/echartComponent/pieChart.vue";
import piejdChart from "@/views/IntelSupervision/echartComponent/piejdChart.vue";
import piemeterChart from "@/views/IntelSupervision/echartComponent/piemeterChart.vue";
import lineChart from "@/views/IntelSupervision/echartComponent/lineChart.vue";
import {
  getDeviceEventSituation,
  getDeviceFaultSta,
  getDeviceFaultTop,
  getDeviceHealthy,
  getDeviceState,
  getDeviceType,
} from "@/api/IntelSupervision";
import { awaitWrap, checkNotNull } from "@/lib";
export default {
  components: {
    PieChart,
    piejdChart,
    piemeterChart,
    lineChart,
  },
  data() {
    return {
      curTimeTableData: [],
      curTimeInfo: {},
      currentPage: 1,
      pageSize: 5,
      total: 0,
      deviceType: "ws",
      deviceStateObj: {
        normalNum: 0,
        probleNum: 0,
        outNum: 0,
        checkNum: 0,
        deviceNum: 0,
      },
      equipStatusOptions: [],
      deviceState: [],
      deviceTypePieData: [],
      eventSituationData: [],
      deviceHealthyData: {},
      deviceFaultTopData: [],
      deviceFaultStaData: {
        xData: [],
        yData: [],
      },
    };
  },
  created() {
    this.refreshEchartData();
  },
  computed: {
    ...mapState({
      activeTabName: (state) => state.IntelSupervison.activeTabName,
    }),
  },
  methods: {
    //切换当前页的容量
    handleSizeChange(val) {
      this.pageSize = val;
    },
    //翻页
    handleCurrentChange(val) {
      this.currentPage = val;

      //this.initCurTime();
    },
    async refreshEchartData() {
      this.equipStatusOptions =
        this.$store.state.IntelSupervison.equipStatusOptions;
      let param = {
        deviceType: this.deviceType,

      };

      //设备状态（今日）数据获取处理
      let deviceState = (await awaitWrap(getDeviceState(param)))[1] || {};
      if (checkNotNull(deviceState) && checkNotNull(deviceState["data"])) {
        deviceState = deviceState["data"];
      } else {
        deviceState = [];
      }
      for (let i = 0; i < deviceState.length; i++) {
        if (deviceState[i]["deviceNum"]) {
          this.deviceStateObj.deviceNum = deviceState[i]["deviceNum"];
        }
        if (deviceState[i]["deviceState"]) {
          for (let j = 0; j < this.equipStatusOptions.length; j++) {
            if (
              this.equipStatusOptions[j]["code"] ==
              deviceState[i]["deviceState"]
            ) {
              if (this.equipStatusOptions[j]["name"] == "正常") {
                this.deviceStateObj.normalNum = deviceState[i]["num"];
              }
              if (this.equipStatusOptions[j]["name"] == "故障") {
                this.deviceStateObj.probleNum = deviceState[i]["num"];
              }
              if (this.equipStatusOptions[j]["name"] == "掉线") {
                this.deviceStateObj.outNum = deviceState[i]["num"];
              }
            }
          }
        }
      }

      //设备故障类型数据处理
      let deviceType = (await awaitWrap(getDeviceType(param)))[1] || {};
      if (checkNotNull(deviceType) && checkNotNull(deviceType["data"])) {
        deviceType = deviceType["data"];
      } else {
        deviceType = [];
      }
      deviceType.map((t) => {
        t.name = t.alarmInfo;
        t.value = t.num;
        delete t.alarmInfo;
        delete t.num;
      });
      this.deviceTypePieData = deviceType;

      //设备处理情况数据处理
      let eventSituation =
        (await awaitWrap(getDeviceEventSituation(param)))[1] || {};
      if (
        checkNotNull(eventSituation) &&
        checkNotNull(eventSituation["data"])
      ) {
        eventSituation = eventSituation["data"];
      } else {
        eventSituation = [];
      }
      this.eventSituationData = eventSituation;

      //设备健康率
      let deviceHealthy = (await awaitWrap(getDeviceHealthy(param)))[1] || {};
      if (checkNotNull(deviceHealthy) && checkNotNull(deviceHealthy["data"])) {
        deviceHealthy = deviceHealthy["data"];
      } else {
        deviceHealthy = [];
      }
      this.deviceHealthyData = deviceHealthy;

      //故障排名
      let deviceFaultTop = (await awaitWrap(getDeviceFaultTop(param)))[1] || {};
      if (
        checkNotNull(deviceFaultTop) &&
        checkNotNull(deviceFaultTop["data"])
      ) {
        deviceFaultTop = deviceFaultTop["data"];
      } else {
        deviceFaultTop = [];
      }
      this.deviceFaultTopData = deviceFaultTop;

      //设备故障统计
      let deviceFaultSta = (await awaitWrap(getDeviceFaultSta(param)))[1] || {};
      if (
        checkNotNull(deviceFaultSta) &&
        checkNotNull(deviceFaultSta["data"])
      ) {
        deviceFaultSta = deviceFaultSta["data"];
      } else {
        deviceFaultSta = [];
      }
      let xData = [],
        yData = [];
      deviceFaultSta.map((t) => {
        xData.push(t.faultTime);
        yData.push(t.num);
      });
      this.deviceFaultStaData = {
        xData,
        yData,
      };
    },
  },
  watch: {
    activeTabName(val) {
      if (val) {
        this.deviceType = "pk";
        this.refreshEchartData();
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.equipStatistics-container {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  .tabsBox {
    width: 100%;
    height: 30px;
    // padding-bottom: 20px;
    .tab {
      width: 150px;
      height: 30px;
      border-radius: 4px;
      border: 1px solid;
      text-align: center;
      line-height: 30px;
      display: inline-block;
      cursor: pointer;
    }
    .active {
      background-color: #02a7f0;
    }
  }
  .equipSta-footer {
    width: 100%;
    height: calc(100% - 30px);
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    .curTimeBox {
      width: 100%;
      height: 250px;
      margin-bottom: 15px;
    }
    .sbgzlx {
      width: calc(25% - 10px);
      margin-right: 15px;
      height: 393px;
      margin-bottom: 15px;
    }
    .sbgzlx-con {
      width: calc(50% - 10px);
      margin-right: 15px;
      height: 393px;
      margin-bottom: 15px;
    }
    .sbjk {
      width: calc(25% - 10px);
      height: 393px;
      margin-bottom: 15px;
    }
    .sbgztj,
    .dwgz {
      width: calc(50% - 8px);
      height: 426px;
      margin-bottom: 30px;
    }
    .dwgz {
      margin-right: 15px;
    }
  }
}
.equip-top-con {
  height: 120px;
  width: 100%;
  margin-top: 50px;
  display: flex;
}
.equip-top-item {
  overflow: hidden;
  flex: 1;
  > div {
    float: left;
  }
}
.equip-top-item-icon {
  width: 120px;
  height: 120px;
  background: #101f70;
  box-shadow: inset 0px 0px 15px 1px rgba(54, 182, 225, 0.6000000238418579);
  opacity: 1;
  border: 1px solid #4320da;
  border-radius: 50%;
  box-sizing: border-box;
  margin-right: 20px;
  margin-left: 40px;
}
.equip-top-item-icon-radius {
  width: 90px;
  height: 90px;
  background: #2141a9;
  opacity: 1;
  border-radius: 50%;
  margin: 0 auto;
  margin-top: 15px;
  text-align: center;
  > img {
    width: 40px;
    height: 40px;
    margin: 25px auto;
  }
}
.equip-top-item-des-num {
  font-size: 30px;
  margin-bottom: 8px;
}
.equip-top-item-des {
  margin-top: 15px;
}

.echart-div {
  height: 100%;
  width: 100%;
}
.device-echart-div {
  height: 100%;
  width: 100%;
  display: flex;
  > div {
    flex: 1;
  }
}
.rate-scroll {
  overflow-y: scroll;
  overflow-x: hidden;
}
.health-echart-div {
  height: 100%;
  width: 100%;
  .point-item:nth-child(1) {
    > .point-item-rate {
      background: #ef7a27;
    }
  }
  .point-item:nth-child(2) {
    > .point-item-rate {
      background: #e0ba25;
    }
  }
  .point-item:nth-child(3) {
    > .point-item-rate {
      background: #13c159;
    }
  }
  > .point-con {
    float: left;
    width: 100%;
    margin-top: 20px;
  }
}

.point-item {
  overflow: hidden;
  height: 20px;
  margin-bottom: 20px;
  > div {
    height: 20px;
    line-height: 20px;
    float: left;
  }
  > .point-item-rate {
    width: 20px;
    height: 20px;
    background: #139cd2;
    border-radius: 4px 4px 4px 4px;
    opacity: 1;
    text-align: center;
    line-height: 20px;
    margin-right: 40px;
    margin-left: 60px;
  }
  > .point-item-address {
    width: 100px;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-right: 40px;
    white-space: nowrap;
  }
  > .point-item-nm {
    width: 100px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin-right: 40px;
  }
  > .point-item-number {
    width: 40px;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-right: 20px;
  }
  > .point-item-echart {
    width: calc(100% - 500px);
    /deep/ .el-progress__text {
      display: none;
    }
  }
}
</style>