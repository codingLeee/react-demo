<template>
  <!--设备报警统计分析-->
  <div class="equipStatistics-container system-container">
    <div class="equipSta-footer system-footer">
      <div class="rain1" v-show="!isFullScreen">
        <systemPanel
          :title="alarmNumsBoxConCode.indexOf('1') != -1 && areaLevel == '4' ? `${streetName}管道基本信息` : '金牛区管道基本信息'"
        >
          <div class="rain-item rain1-content">
            <div>
              <p>{{basicInfoData.drainageNum}}</p>
              <p>排水户数量</p>
            </div>
            <div>
              <p>{{basicInfoData.totalLenght}}</p>
              <p>雨污管线总长</p>
            </div>
            <div>
              <p>{{basicInfoData.rainLenght}}</p>
              <p>雨水管总长</p>
            </div>
            <div>
              <p>{{basicInfoData.sewageLenght}}</p>
              <p>污水管总长</p>
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
        <systemPanel title="雨污水长度">
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
                :type="'2'"
                :conCodeList="alarmNumsBoxConCode"
                :streetData="streetData"
                @func="getStreetName"
                :mapColorCardinality="mapColorCardinality"
                :mapColorCardinalityYs="mapColorCardinalityYs"
              ></Map>
              <div class="alarm_num_legend_content ysFloat">
                <p>雨水长度</p>
                <p class="alarm_num_legend">
                  <span>0</span>
                  <span>{{mapColorCardinality == 0 ? 100 : mapColorCardinality*4}}</span>
                </p>
              </div>
              <div class="alarm_num_legend_content">
                <p>污水长度</p>
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
                <el-table-column prop="alramNum" label="雨污水长度" align="center"></el-table-column>
              </el-table>
            </div>
          </div>
        </systemPanel>
      </div>
      <div class="rain3" v-show="!isFullScreen">
        <systemPanel title="管道水位情况">
          <pipeBarChart
            :id="'pipeline-analysis-pipeBarChart'"
            :data="pipeLevelData"
            v-show="pipeLevelData.xAxis.length !== 0"
          ></pipeBarChart>
          <no-data v-show="pipeLevelData.xAxis.length == 0"></no-data>
        </systemPanel>
      </div>
      <div class="rain4" v-show="!isFullScreen">
        <systemPanel title="无法预处理管道长度">
          <div class="rain8-psh-type" v-show="rainPieTypeChartData.length !== 0">
            <div>
              <rainPieForTypeChart
                :id="'pipeline-analysis-rainPieForTypeChart1'"
                :data="rainPieTypeChartData[0]"
                :type="1"
              ></rainPieForTypeChart>
            </div>
            <div>
              <rainPieForTypeChart
                :id="'pipeline-analysis-rainPieForTypeChart2'"
                :data="rainPieTypeChartData[1]"
                :type="2"
              ></rainPieForTypeChart>
            </div>
          </div>
          <no-data v-show="rainPieTypeChartData.length == 0"></no-data>
        </systemPanel>
      </div>
      <div class="rain5" v-show="!isFullScreen">
        <systemPanel
          :title="alarmNumsBoxConCode.indexOf('1') != -1 && areaLevel == '4' ? '排水户无法预处理情况数量排名（TOP5）' : '街道无法预处理情况数量排名（TOP5）'"
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
        <systemPanel title="无法预处理数量情况">
          <radar :id="'pipeline-analysis-radar'" :radarChartData="radarChartData" v-show="JSON.stringify(radarChartData) !== '{}'"></radar>
          <no-data v-show="JSON.stringify(radarChartData) == '{}'"></no-data>
        </systemPanel>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
import { awaitWrap, checkNotNull, exportToExcel, exportPic } from "@/lib";
import funnle from "./echartComponent/funnle.vue";
import radar from "./echartComponent/radar.vue";
import wordCloud from "./echartComponent/wordCloud.vue";
import rainPieChart from "./echartComponent/rainPieChart.vue";
import rainTop5Chart from "./echartComponent/rainTop5Chart.vue";
import rainPieForTypeChart from "./echartComponent/rainPieForTypeChart.vue";
import pipeBarChart from "./echartComponent/pipeBarChart.vue";

import Map from "./map.vue";
import {
  findPipeBasicInfo,
  findPipeLenghtGroup,
  findPipeLevel,
  findProblemPipeLenght,
  findProblemPipeNumAnalysis,
  findProblemPipeNumRanking
} from "@/api/IntelSupervision";

export default {
  components: {
    Map,
    funnle,
    radar,
    wordCloud,
    rainPieChart,
    rainTop5Chart,
    rainPieForTypeChart,
    pipeBarChart
  },
  data() {
    return {
      alarmNumsBoxConCode: [],
      mapColorCardinality: 0,
      mapColorCardinalityYs: 0,
      streetData: [],
      typeEchartData: [],
      rainTop5ChartData: [],
      rainPieTypeChartData: [],
      isFullScreen: false,
      basicInfoData: {},
      drainageGradeData: [],
      drainageGrade: {},
      rankEchartData: [],
      areaCode: "510106",
      areaLevel: "3",
      streetName: "",
      pipeBarChartData: [],
      pipeLevelData: {
        xAxis: [],
        yAxisSewage: [],
        yAxisWater: []
      },
      radarChartData: {
        legendData: [],
        indicator: [],
        data: []
      }
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
          this.findPipeLevelData();
          this.findProblemPipeLenghtData();
          this.findProblemPipeNumRankingData();
          this.findProblemPipeNumAnalysisData();
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
          exportToExcel("雨污水长度", "alarmTable34");
        }
      }
    },

    getStreetName(city, code) {
      if (city !== "金牛区" && code) {
        this.areaCode = code;
        this.areaLevel = "4";
        this.streetName = city;
        this.findBasicInfoData();
        this.findPipeLevelData();
        this.findProblemPipeLenghtData();
        this.findProblemPipeNumRankingData();
        this.findProblemPipeNumAnalysisData();
      }
    },

    // 基本信息
    async findBasicInfoData() {
      let param = {
        areaCode: this.areaCode,
        areaLevel: this.areaLevel
      };
      let r = (await awaitWrap(findPipeBasicInfo(param)))[1] || {};
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
      const res = await findPipeLenghtGroup(params);
      let maxValue = 0;
      let maxValueYs = 0;
      let dataNew = [];
      let rankData = [];
      res.data.map((item, i) => {
        let obj = {
          alramNum: item.sewagePipeLength,
          areaCode: item.code,
          areaName: item.name,
          alramNum1: item.waterPipeLength
        };
        dataNew.push(obj);
        if (i < 5) {
          rankData.push({
            name: item["name"],
            rate: item["percent"],
            code: item["code"]
          });
        }
      });
      this.streetData = dataNew || [];
      this.streetData.forEach(m => {
        maxValue = Math.max(maxValue, m["alramNum"]);
        maxValueYs = Math.max(maxValue, m["alramNum1"]);
      });
      this.mapColorCardinality = Math.ceil(maxValue / 4);
      this.mapColorCardinalityYs = Math.ceil(maxValueYs / 4);
    },

    // 管道水位情况
    async findPipeLevelData() {
      let param = {
        areaCode: this.areaCode,
        areaLevel: this.areaLevel
      };
      let r = (await awaitWrap(findPipeLevel(param)))[1] || {};
      if (checkNotNull(r) && checkNotNull(r["data"])) {
        r = r["data"];
      } else {
        this.pipeLevelData = {
          xAxis: [],
          yAxisSewage: [],
          yAxisWater: []
        };
      }
      this.pipeLevelData = r;
    },

    // 管道长度
    async findProblemPipeLenghtData() {
      let param = {
        areaCode: this.areaCode,
        areaLevel: this.areaLevel
      };
      let r = (await awaitWrap(findProblemPipeLenght(param)))[1] || {};
      if (checkNotNull(r) && checkNotNull(r["data"])) {
        r = r["data"];
        this.rainPieTypeChartData = [
          {
            name: "雨水管",
            num: r.waterPipeLeng,
            percent: r.waterPercent
          },
          {
            name: "污水管",
            num: r.sewageLenght,
            percent: r.sewagePercent
          }
        ];
      } else {
        this.rainPieTypeChartData = [];
      }
    },

    //排名
    async findProblemPipeNumRankingData() {
      let params = {
        areaCode: this.areaCode,
        areaLevel: this.areaLevel
      };
      const res = await findProblemPipeNumRanking(params);
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

    // 预处理数量情况
    async findProblemPipeNumAnalysisData() {
      let param = {
        areaCode: this.areaCode,
        areaLevel: this.areaLevel
      };
      let r = (await awaitWrap(findProblemPipeNumAnalysis(param)))[1] || {};
      if (checkNotNull(r) && checkNotNull(r["data"])) {
        r = r["data"];
        let indicator = [],
          ws = [],
          ys = [];
        if (r["1"]) {
          r["1"].map(t => {
            if (!indicator.includes(t.name)) {
              indicator.push(t.name);
            }
          });
        }
        if (r["2"]) {
          r["2"].map(t => {
            if (!indicator.includes(t.name)) {
              indicator.push(t.name);
            }
          });
        }
        let reson = [],
          engR = ["A", "B", "C", "D", "E"];
        if (indicator.length < 5) {
          for (let i = 0; i < 5 - indicator.length; i++) {
            reson.push(`原因${engR[i]}`);
          }
        }
        indicator = [...indicator, ...reson];
        indicator.map(t => {
          if (r["1"]) {
            let u = r["1"].filter(y => {
              return t == y.name;
            });
            if (u.length == 1) {
              ys.push(u[0]["num"]);
            } else {
              ys.push(0);
            }
          } else {
            ys.push(0);
          }

          if (r["2"]) {
            let o = r["2"].filter(y => {
              return t == y.name;
            });
            if (o.length == 1) {
              ws.push(u[0]["num"]);
            } else {
              ws.push(0);
            }
          } else {
            ws.push(0);
          }
        });
        this.radarChartData = {
          legendData: ["污水管", "雨水管"],
          indicator,
          data: [[...ws], [...ys]]
        };
      } else {
        this.radarChartData = {};
      }
    }
  },
  watch: {},
  created() {
    this.initMap();
    this.findBasicInfoData();
    this.findPipeLevelData();
    this.findProblemPipeLenghtData();
    this.findProblemPipeNumRankingData();
    this.findProblemPipeNumAnalysisData();
    setTimeout(() => {
      this.pipeBarChartData = [2];
    }, 500);
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
</style>