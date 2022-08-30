<template>
  <!--设备报警统计分析-->
  <div class="equipStatistics-container system-container">
    <div class="equipSta-footer system-footer">
      <div class="rain1" v-show="!isFullScreen">
        <systemPanel
          :title="alarmNumsBoxConCode.indexOf('1') != -1 && areaLevel == '4' ? `${streetName}构筑物基本信息` : '金牛区构筑物基本信息'"
        >
          <div class="rain-item rain1-content">
            <div>
              <p>{{basicInfoData.drainageNum}}</p>
              <p>排水户数量</p>
            </div>
            <div>
              <p>{{basicInfoData.structuresNum}}</p>
              <p>内部构筑物总个数</p>
            </div>
            <div>
              <p>{{basicInfoData.normalNum}}</p>
              <p>正常构筑物</p>
            </div>
            <div>
              <p>{{basicInfoData.problemNum}}</p>
              <p>问题构筑物</p>
            </div>
          </div>
        </systemPanel>
      </div>
      <div
        class="rain2"
        id="echart"
        :class="{'fullScreenBox': alarmNumsBoxConCode.indexOf('3') != -1}"
        v-show="!isFullScreen || (isFullScreen && alarmNumsBoxConCode.indexOf('3') != -1)"
      >
        <systemPanel title="内部构筑物数量">
          <!-- 关联地图 -->
          <!-- <span class="icon_1" :class="{'active': alarmNumsBoxRelationCode == '1'}" @click="alarmNumsBoxRelationCodeFun('1')"></span> -->
          <ul class="card_box_contorl">
            <li
              class="icon_1"
              v-show="alarmNumsBoxConCode.indexOf('4') == -1"
              :class="{'active': alarmNumsBoxConCode.indexOf('1') != -1}"
              @click="contorlFun('alarmNumsBox','1')"
            ></li>
            <!-- 地图下钻 -->
            <li
              class="icon_2"
              v-show="alarmNumsBoxConCode.indexOf('4') == -1"
              :class="{'active': alarmNumsBoxConCode.indexOf('2') != -1}"
              @click="contorlFun('alarmNumsBox','2')"
            ></li>
            <!-- 放大 -->
            <li
              class="icon_3"
              :class="{'active': alarmNumsBoxConCode.indexOf('3') != -1}"
              @click="contorlFun('alarmNumsBox','3')"
            ></li>
            <!-- 切换列表 -->
            <li
              class="icon_4"
              :class="{'active': alarmNumsBoxConCode.indexOf('4') != -1}"
              @click="contorlFun('alarmNumsBox','4')"
            ></li>
            <!-- 下载导出 -->
            <li
              class="icon_5"
              :class="{'active': alarmNumsBoxConCode.indexOf('5') != -1}"
              @click="contorlFun('alarmNumsBox','5')"
            ></li>
          </ul>
          <div class="rain-map-item">
            <div v-show="alarmNumsBoxConCode.indexOf('4') == -1" class="alarmNumsBox_map">
              <Map
                :conCodeList="alarmNumsBoxConCode"
                :streetData="streetData"
                @func="getStreetName"
                :mapColorCardinality="mapColorCardinality"
              ></Map>
              <div class="alarm_num_legend_content">
                <p>内部构筑物个数</p>
                <p class="alarm_num_legend">
                  <span>0</span>
                  <span>{{mapColorCardinality == 0 ? 100 : mapColorCardinality*4}}</span>
                </p>
              </div>
            </div>
            <div v-show="alarmNumsBoxConCode.indexOf('4') != -1" class="analysis_table">
              <el-table
                id="alarmTable34"
                class="statistical_analysis_table"
                :data="streetData"
                :cell-style="{ padding: '0px', color: '#C5D0D4' }"
                :header-cell-style="{ padding: '0px', color: '#C5D0D4', backgroundColor: 'rgba(28,178,255,.2) !important' }"
              >
                <el-table-column prop="areaName" label="街道名称" align="center"></el-table-column>
                <el-table-column prop="alramNum" label="构筑物数量" align="center"></el-table-column>
              </el-table>
            </div>
          </div>
        </systemPanel>
      </div>
      <div class="rain3" v-show="!isFullScreen">
        <systemPanel title="内部构筑物类型分析">
          <radar
            :id="'pipeline-analysis-radar'"
            :radarChartData="radarChartData"
            :showLegend="false"
            v-show="JSON.stringify(radarChartData) !== '{}'"
          ></radar>
          <no-data v-show="JSON.stringify(radarChartData) == '{}'"></no-data>
        </systemPanel>
      </div>
      <div class="rain4" v-show="!isFullScreen">
        <systemPanel title="正常/异常构筑物占比">
          <div class="build-schedule-bar" v-show="buildScheduleBarData.length !== 0">
            <div>
              <div>
                <buildScheduleBar
                  :id="'build-schedule-bar1'"
                  :data="buildScheduleBarData[0] ? buildScheduleBarData[0]['value'] : null"
                ></buildScheduleBar>
                <div class="des">
                  <p>{{buildScheduleBarData[0] ? buildScheduleBarData[0]['name'] : '--'}}</p>
                  <div></div>
                </div>
              </div>
              <div>
                <buildScheduleBar
                  :id="'build-schedule-bar2'"
                  :data="buildScheduleBarData[1] ? buildScheduleBarData[1]['value'] : null"
                ></buildScheduleBar>
                <div class="des">
                  <p>{{buildScheduleBarData[1] ? buildScheduleBarData[1]['name'] : '--'}}</p>
                  <div></div>
                </div>
              </div>
              <div>
                <buildScheduleBar
                  :id="'build-schedule-bar3'"
                  :data="buildScheduleBarData[2] ? buildScheduleBarData[2]['value'] : null"
                ></buildScheduleBar>
                <div class="des">
                  <p>{{buildScheduleBarData[2] ? buildScheduleBarData[2]['name'] : '--'}}</p>
                  <div></div>
                </div>
              </div>
            </div>
            <div>
              <div>
                <buildScheduleBar
                  :id="'build-schedule-bar4'"
                  :data="buildScheduleBarData[3] ? buildScheduleBarData[3]['value'] : null"
                ></buildScheduleBar>
                <div class="des">
                  <p>{{buildScheduleBarData[3] ? buildScheduleBarData[3]['name'] : '--'}}</p>
                  <div></div>
                </div>
              </div>
              <div>
                <buildScheduleBar
                  :id="'build-schedule-bar5'"
                  :data="buildScheduleBarData[4] ? buildScheduleBarData[4]['value'] : null"
                ></buildScheduleBar>
                <div class="des">
                  <p>{{buildScheduleBarData[4] ? buildScheduleBarData[4]['name'] : '--'}}</p>
                  <div></div>
                </div>
              </div>
            </div>
          </div>
          <no-data v-show="buildScheduleBarData.length == 0"></no-data>
        </systemPanel>
      </div>
      <div class="rain5" v-show="!isFullScreen">
        <systemPanel
          :title="alarmNumsBoxConCode.indexOf('1') != -1 && areaLevel == '4' ? '排水户异常构筑物数量排名（TOP5）' : '街道异常构筑物数量排名（TOP5）'"
        >
          <rainTop5Chart
            :id="'pipeline-analysis-rainTop5Chart'"
            :data="rankEchartData"
            v-show="rankEchartData.length !== 0"
          ></rainTop5Chart>
          <no-data v-show="rankEchartData.length == 0"></no-data>
        </systemPanel>
      </div>
      <div class="rain6" v-show="!isFullScreen">
        <systemPanel title="构筑物异常原因">
          <buildGraph
            :id="'build-graph'"
            :data="buildGraphData"
            v-show="buildGraphData.length !== 0"
          ></buildGraph>
          <no-data v-show="buildGraphData.length == 0"></no-data>
        </systemPanel>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
import { awaitWrap, checkNotNull, exportToExcel, exportPic } from "@/lib";
import radar from "./echartComponent/radar.vue";
import rainTop5Chart from "./echartComponent/rainTop5Chart.vue";
import rainPieForTypeChart from "./echartComponent/rainPieForTypeChart.vue";
import buildScheduleBar from "./echartComponent/buildScheduleBar.vue";
import buildGraph from "./echartComponent/buildGraph.vue";
import Map from "./map.vue";
import {
  findBuildBasicInfo,
  findStructuresNumRanking,
  findStructuresNumByType,
  findStructuresNumByPercent,
  findStructuresNumByReason
} from "@/api/IntelSupervision";

export default {
  components: {
    Map,
    radar,
    rainTop5Chart,
    rainPieForTypeChart,
    buildScheduleBar,
    buildGraph
  },
  data() {
    return {
      alarmNumsBoxConCode: [],
      mapColorCardinality: 0,
      mapColorCardinalityYs: 0,
      streetData: [],
      typeEchartData: [],
      rainTop5ChartData: [],
      isFullScreen: false,
      basicInfoData: {},
      drainageGradeData: [],
      drainageGrade: {},
      rankEchartData: [],
      areaCode: "510106",
      areaLevel: "3",
      streetName: "",
      buildScheduleBarData: [],
      pipeLevelData: {
        xAxis: [],
        yAxisSewage: [],
        yAxisWater: []
      },
      radarChartData: {
        legendData: [],
        indicator: [],
        data: []
      },
      buildGraphData: []
    };
  },
  computed: {
    ...mapState({
      activeTabName: state => state.IntelSupervison.activeTabName
    })
  },
  methods: {
    contorlFun(boxname, concode) {
      if (boxname == "alarmNumsBox" && concode != 2) {
        this.alarmNumsBoxRelationCode = "";
      }

      let codeIndex = this[boxname + "ConCode"].indexOf(concode);
      if (codeIndex == -1) {
        if (concode != 5) {
          this[boxname + "ConCode"].push(concode);
        }
        this.boxName = boxname;
        if (boxname == "alarmNumsBox") {
          this.alarmNumsBoxContorlFun(concode);
        }
      } else {
        if (concode == 1) {
          this.areaCode = "510106";
          this.areaLevel = "3";
          this.streetName = "";
          this.findBasicInfoData();
          this.findStructuresNumByTypeData();
          this.findStructuresNumByPercentData();
          this.findStructuresNumRankingData();
          this.findStructuresNumByReasonData();
        }
        this[boxname + "ConCode"].splice(codeIndex, 1);
      }
      if (concode == 3) {
        // 全屏
        this.fullScreenBox(boxname);
      }
      // this.resizeCharts();
    },
    fullScreenBox(boxname) {
      this.isFullScreen = !this.isFullScreen;
      if (this.isFullScreen) {
        this.fullScreenBoxName = boxname;
      } else {
        this.fullScreenBoxName = "";
      }
    },
    alarmNumsBoxContorlFun(concode) {
      // 切换为表格
      if (concode == 4) {
        // 取消 关联和下钻
        let index1 = this.alarmNumsBoxConCode.indexOf("1");
        if (index1 != -1) {
          this.alarmNumsBoxConCode.splice(index1, 1);
        }
        let index2 = this.alarmNumsBoxConCode.indexOf("2");
        if (index1 != -1) {
          this.alarmNumsBoxConCode.splice(index2, 1);
        }
      }
      // 导出
      if (concode == 5) {
        if (this.alarmNumsBoxConCode.indexOf("4") == -1) {
          exportPic("echart", "截图");
        } else {
          exportToExcel("排水户构筑物数量", "alarmTable34");
        }
      }
    },

    getStreetName(city, code) {
      if (city !== "金牛区" && code) {
        this.areaCode = code;
        this.areaLevel = "4";
        this.streetName = city;
        this.findBasicInfoData();
        this.findStructuresNumByTypeData();
        this.findStructuresNumByPercentData();
        this.findStructuresNumRankingData();
        this.findStructuresNumByReasonData();
      }
    },

    // 基本信息
    async findBasicInfoData() {
      let param = {
        areaCode: this.areaCode,
        areaLevel: this.areaLevel
      };
      let r = (await awaitWrap(findBuildBasicInfo(param)))[1] || {};
      if (checkNotNull(r) && checkNotNull(r["data"])) {
        r = r["data"];
      } else {
        r = {
          drainageNum: 0,
          rainLenght: 0,
          sewageLenght: 0,
          totalLenght: 0
        };
      }
      this.basicInfoData = r;
    },

    //地图
    async initMap() {
      let params = {
        areaCode: "510106",
        areaLevel: "3"
      };
      const res = await findStructuresNumRanking(params);
      let maxValue = 0;
      let dataNew = [];
      res.data.map((item, i) => {
        let obj = {
          alramNum: item.num,
          areaCode: item.code,
          areaName: item.name
        };
        dataNew.push(obj);
      });
      this.streetData = dataNew || [];
      this.streetData.forEach(m => {
        maxValue = Math.max(maxValue, m["alramNum"]);
      });
      this.mapColorCardinality = Math.ceil(maxValue / 4);
    },

    // 内部构筑物类型分析
    async findStructuresNumByTypeData() {
      let param = {
        areaCode: this.areaCode,
        areaLevel: this.areaLevel
      };
      let r = (await awaitWrap(findStructuresNumByType(param)))[1] || {};
      if (checkNotNull(r) && checkNotNull(r["data"])) {
        r = r["data"];
        let indicator = [],
          ws = [];
        if (r) {
          r.map(t => {
            indicator.push(t.name);
          });
        }
        let reson = [],
          engR = ["A", "B", "C", "D", "E"];
        if (indicator.length < 5) {
          for (let i = 0; i < 5 - indicator.length; i++) {
            reson.push(`类型${engR[i]}`);
          }
        }
        indicator = [...indicator, ...reson];
        indicator.map(t => {
          if (r) {
            let u = r.filter(y => {
              return t == y.name;
            });
            if (u.length == 1) {
              ws.push(u[0]["num"]);
            } else {
              ws.push(0);
            }
          } else {
            ws.push(0);
          }
        });
        this.radarChartData = {
          legendData: ["1"],
          indicator,
          data: [[...ws]]
        };
      } else {
        this.radarChartData = {};
      }
    },

    // 构筑物占比
    async findStructuresNumByPercentData() {
      let param = {
        areaCode: this.areaCode,
        areaLevel: this.areaLevel
      };
      let r = (await awaitWrap(findStructuresNumByPercent(param)))[1] || {};
      if (checkNotNull(r) && checkNotNull(r["data"])) {
        r = r["data"];
        let data = [];
        r.map(t => {
          data.push({
            name: t.name,
            value: t.normalPercent
          });
        });
        let reson = [],
          engR = ["A", "B", "C", "D", "E"];
        if (data.length < 5) {
          for (let i = 0; i < 5 - data.length; i++) {
            reson.push({
              name: `设施${engR[i]}`,
              value: 0
            });
          }
        }
        this.buildScheduleBarData = [...data, ...reson];
      } else {
        this.buildScheduleBarData = [];
      }
    },

    //排名
    async findStructuresNumRankingData() {
      let params = {
        areaCode: this.areaCode,
        areaLevel: this.areaLevel
      };
      const res = await findStructuresNumRanking(params);
      let rankData = [];
      res.data.map((item, i) => {
        if (i < 5) {
          rankData.push({
            name: item["name"],
            rate: item["percent"],
            code: item["code"]
          });
        }
      });
      this.rankEchartData = rankData;
    },

    // 构筑物异常原因
    async findStructuresNumByReasonData() {
      let param = {
        areaCode: this.areaCode,
        areaLevel: this.areaLevel
      };
      let r = (await awaitWrap(findStructuresNumByReason(param)))[1] || {};
      if (checkNotNull(r) && checkNotNull(r["data"])) {
        r = r["data"];
        let d = [];
        r.map(t => {
          d.push({
            name: t.name,
            value: t.num
          });
        });
        this.buildGraphData = d;
      } else {
        this.buildGraphData = [];
      }
    }
  },

  watch: {},
  created() {
    this.initMap();
    this.findBasicInfoData();
    this.findStructuresNumByTypeData();
    this.findStructuresNumByPercentData();
    this.findStructuresNumRankingData();
    this.findStructuresNumByReasonData();
  }
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
    .rain1,
    .rain2,
    .rain3,
    .rain4,
    .rain5,
    .rain6 {
      height: 500px;
      width: calc(33.3% - 10px);
      margin-bottom: 15px;
    }
    .rain1,
    .rain2,
    .rain4,
    .rain5 {
      margin-right: 15px;
    }
    .rain7,
    .rain8 {
      height: 400px;
      width: calc(50% - 7.5px);
    }
    .fullScreenBox {
      width: 100% !important;
      height: calc(100% - 45px) !important;
    }
  }
}
.rain-item {
  height: 100%;
  width: 100%;
}
.rain-map-item {
  height: calc(100% - 30px);
  margin-top: 30px;
  width: 100%;
  overflow-y: scroll;
}
.rain1-content {
  > div {
    width: 50%;
    height: 50%;
    float: left;
    background: url("/static/ManageSystem/img/rain-item.png") center center
      no-repeat;
    background-size: 70% 70%;
    text-align: center;
    > p:nth-child(1) {
      color: #ffe616;
      font-size: 32px;
      margin-top: 60px;
    }
  }
}
.card_box_contorl {
  display: flex;
  position: absolute;
  top: 40px;
  right: 0;

  li {
    width: 22px;
    height: 22px;
    margin-right: 12px;
    cursor: pointer;

    @for $i from 1 through 6 {
      &.icon_#{$i} {
        background: url(/static/ManageSystem/img/monitoringIndicators_con_icon_#{$i}.png)
          no-repeat
          center
          center;
        background-size: contain;
        &.active {
          background: url(/static/ManageSystem/img/monitoringIndicators_con_active_icon_#{$i}.png)
            no-repeat
            center
            center;
          background-size: contain;
        }
      }
    }
  }
}
.alarmNumsBox_map {
  width: 100%;
  height: 100%;
}
.alarm_num_legend_content {
  font-size: 14px;
  color: #d6dee7;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-right: 20px;
  .alarm_num_legend {
    margin-left: 12px;
    width: 100px;
    height: 12px;
    background: linear-gradient(90deg, #18c3ff, #d3cb40, #ff8c1b, #d30717);

    span {
      display: inline-block;
      vertical-align: middle;
      margin-top: 12px;
      &:nth-child(1) {
        float: left;
      }
      &:nth-child(2) {
        float: right;
      }
    }
  }
}
.ysFloat {
  float: left;
  margin-left: 20px;
}
.rain8-psh-type {
  width: 100%;
  height: 100%;
  > div {
    float: left;
    width: 50%;
    height: 100%;
  }
}
.hjdjzb {
  position: relative;
  .rain-level {
    position: absolute;
    right: 40px;
    top: 100px;
    > div {
      overflow: hidden;
      height: 50px;
      line-height: 50px;
      margin-bottom: 20px;
      > div {
        float: left;
      }
      > div:nth-child(2) {
        width: 100px;
        background: linear-gradient(90deg, rgba(6, 48, 90, 0) 0%, #0e6dcc 100%);
        opacity: 0.8;
        text-align: center;
        font-size: 20px;
      }
      > div:nth-child(1) {
        font-size: 16px;
        color: #ffffff;
      }
      .level1 {
        color: rgba(240, 255, 24, 1);
      }
      .level2 {
        color: rgba(11, 255, 114, 1);
      }
      .level3 {
        color: rgba(0, 212, 255, 1);
      }
      .level4 {
        color: rgba(64, 100, 222, 1);
      }
    }
  }
}
.analysis_table {
  margin: 20px;
}
.build-schedule-bar {
  overflow: hidden;
  height: 70%;
  padding-top: 15%;
  > div {
    height: 50%;
    width: 100%;
    > div {
      width: 33.3%;
      height: 100%;
      float: left;
      position: relative;
    }
  }
  > div:nth-child(2) {
    > div:nth-child(1) {
      margin-left: 16.5%;
    }
  }
  .des {
    width: 100px;
    position: absolute;
    bottom: 15%;
    left: 50%;
    transform: translate(-50%, 0);
    text-align: center;
    > div {
      width: 40px;
      height: 2px;
      background: rgba(13, 151, 235, 1);
      margin: 0 auto;
      margin-top: 4px;
    }
  }
}
</style>