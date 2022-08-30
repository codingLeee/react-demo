<template>
  <!--设备报警统计分析-->
  <div class="equipStatistics-container system-container">
    <div class="equipSta-footer system-footer">
      <div class="rain1" v-show="!isFullScreen">
        <systemPanel :title="alarmNumsBoxConCode.indexOf('1') != -1 && areaLevel == '4' ? `${streetName}检查井基本信息` : '金牛区检查井基本信息'">
          <div class="rain-item rain1-content">
            <div>
              <p>{{basicInfoData.drainageNum}}</p>
              <p>排水户数量</p>
            </div>
            <div>
              <p>{{basicInfoData.pipeLength}}</p>
              <p>雨污管线总长</p>
            </div>
            <div>
              <p>{{basicInfoData.wellheadsNum}}</p>
              <p>检查井进水口</p>
            </div>
            <div>
              <p>{{basicInfoData.mixedNum}}</p>
              <p>混接点数量</p>
            </div>
          </div>
        </systemPanel>
      </div>
      <div class="rain2" id="echart" :class="{'fullScreenBox': alarmNumsBoxConCode.indexOf('3') != -1}" v-show="!isFullScreen || (isFullScreen && alarmNumsBoxConCode.indexOf('3') != -1)">
        <systemPanel title="排水户混接点数量">
          <!-- 关联地图 -->
          <!-- <span class="icon_1" :class="{'active': alarmNumsBoxRelationCode == '1'}" @click="alarmNumsBoxRelationCodeFun('1')"></span> -->
          <ul class="card_box_contorl">
            <li class="icon_1" v-show="alarmNumsBoxConCode.indexOf('4') == -1" :class="{'active': alarmNumsBoxConCode.indexOf('1') != -1}" @click="contorlFun('alarmNumsBox','1')"></li>
            <!-- 地图下钻 -->
            <li class="icon_2" v-show="alarmNumsBoxConCode.indexOf('4') == -1" :class="{'active': alarmNumsBoxConCode.indexOf('2') != -1}" @click="contorlFun('alarmNumsBox','2')"></li>
            <!-- 放大 -->
            <li class="icon_3" :class="{'active': alarmNumsBoxConCode.indexOf('3') != -1}" @click="contorlFun('alarmNumsBox','3')"></li>
            <!-- 切换列表 -->
            <li class="icon_4" :class="{'active': alarmNumsBoxConCode.indexOf('4') != -1}" @click="contorlFun('alarmNumsBox','4')"></li>
            <!-- 下载导出 -->
            <li class="icon_5" :class="{'active': alarmNumsBoxConCode.indexOf('5') != -1}" @click="contorlFun('alarmNumsBox','5')"></li>

          </ul>
          <div class="rain-map-item">
            <div v-show="alarmNumsBoxConCode.indexOf('4') == -1" class="alarmNumsBox_map">
              <Map
                :type="'1'"
                :conCodeList="alarmNumsBoxConCode"
                :streetData="streetData"
                @func="getStreetName"
                :mapColorCardinality="mapColorCardinality"
              ></Map>
              <div class="alarm_num_legend_content">
                <p>混接数量</p>
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
                <el-table-column
                  prop="areaName"
                  label="街道名称"
                  align="center"
                >
                </el-table-column>
                <el-table-column
                  prop="alramNum"
                  label="混接点数量"
                  align="center"
                >
                </el-table-column>
              </el-table>
            </div>
          </div>
        </systemPanel>
      </div>
      <div class="rain3" v-show="!isFullScreen">
        <systemPanel title="排水户混接等级占比">
          <div class="rain-item hjdjzb" v-show="drainageGradeData.length !== 0">
            <funnle :id="'rain-analysis-funnle'" :data="drainageGradeData"></funnle>
            <div class="rain-level">
              <div>
                <div>一级</div>
                <div class="level1">{{drainageGrade.level1 ? drainageGrade.level1 + '%' : '0%'}}</div>
              </div>
              <div>
                <div>二级</div>
                <div class="level2">{{drainageGrade.level2 ? drainageGrade.level2 + '%' : '0%'}}</div>
              </div>
              <div>
                <div>三级</div>
                <div class="level3">{{drainageGrade.level3 ? drainageGrade.level3 + '%' : '0%'}}</div>
              </div>
              <div>
                <div>四级</div>
                <div class="level4">{{drainageGrade.level4 ? drainageGrade.level4 + '%' : '0%'}}</div>
              </div>
            </div>
          </div>
          <no-data v-show="drainageGradeData.length == 0"></no-data>
        </systemPanel>
      </div>
      <div class="rain4" v-show="!isFullScreen">
        <systemPanel title="排水户混接类型分析">
          <rainPieForTypeChart1
            :id="'rain-analysis-rainPieForTypeChart4'"
            :data="rainPieTypeChart1Data"
             v-show="rainPieTypeChart1Data.length !== 0"
          ></rainPieForTypeChart1>
          <no-data v-show="rainPieTypeChart1Data.length == 0"></no-data>
        </systemPanel>
      </div>
      <div class="rain5" v-show="!isFullScreen">
        <systemPanel title="排水户混接原因">
          <wordCloud :id="'rain-analysis-wordCloud'" :data="wordCloudEchartData" v-show="wordCloudEchartData.length !== 0"></wordCloud>
          <no-data v-show="wordCloudEchartData.length == 0"></no-data>
        </systemPanel>
      </div>
      <div class="rain6" v-show="!isFullScreen">
        <systemPanel title="排水户混接评估建议">
          <rainPieChart :id="'rain-analysis-rainPieChart'" :data="rainPieChartData" v-show="rainPieChartData.length !== 0"></rainPieChart>
          <no-data v-show="rainPieChartData.length == 0"></no-data>
        </systemPanel>
      </div>
      <div class="rain7" v-show="!isFullScreen">
        <systemPanel :title="alarmNumsBoxConCode.indexOf('1') != -1 && areaLevel == '4' ? '排水户混接排名（TOP5）' : '街道混接排名（TOP5）'">
          <rainTop5Chart :id="'rain-analysis-rainTop5Chart'" :data="rankEchartData" v-show="rankEchartData.length !== 0"></rainTop5Chart>
          <no-data v-show="rankEchartData.length == 0"></no-data>
        </systemPanel>
      </div>
      <div class="rain8" v-show="!isFullScreen">
        <systemPanel title="排水户类型分析">
          <div class="rain8-psh-type" v-show="rainPieTypeChartData.length !== 0">
            <div v-show="rainPieTypeChartData.length !== 0">
              <rainPieForTypeChart
                :id="'rain-analysis-rainPieForTypeChart1'"
                :data="rainPieTypeChartData[0]"
                :type="1"
              ></rainPieForTypeChart>
            </div>
            <div>
              <rainPieForTypeChart
                :id="'rain-analysis-rainPieForTypeChart2'"
                :data="rainPieTypeChartData[1]"
                :type="2"
              ></rainPieForTypeChart>
            </div>
            <div>
              <rainPieForTypeChart
                :id="'rain-analysis-rainPieForTypeChart3'"
                :data="rainPieTypeChartData[2]"
                :type="3"
              ></rainPieForTypeChart>
            </div>
          </div>
          <no-data v-show="rainPieTypeChartData.length == 0"></no-data>
        </systemPanel>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
import { awaitWrap, checkNotNull,exportToExcel,exportPic } from "@/lib";
import funnle from "./echartComponent/funnle.vue";
import wordCloud from "./echartComponent/wordCloud.vue";
import rainPieChart from "./echartComponent/rainPieChart.vue";
import rainTop5Chart from "./echartComponent/rainTop5Chart.vue";
import rainPieForTypeChart from "./echartComponent/rainPieForTypeChart.vue";
import rainPieForTypeChart1 from "./echartComponent/rainPieForTypeChart1.vue";
import Map from "./map.vue";
import {
  findBasicInfo,
  findDrainageGradePercent,
  findDrainageGroupAssessmentProposal,
  findDrainageGroupMixReason,
  findDrainageGroupMixType,
  findDrainageGroupType,
  findDrainageNumRanking
} from "@/api/IntelSupervision";
export default {
  components: {
    Map,
    funnle,
    rainPieForTypeChart1,
    wordCloud,
    rainPieChart,
    rainTop5Chart,
    rainPieForTypeChart
  },
  data() {
    return {
      alarmNumsBoxConCode: [],
      mapColorCardinality: 0,
      streetData: [],
      hjEchartData: [],
      typeEchartData: [],
      wordCloudEchartData: [],
      rainPieChartData: [],
      rainTop5ChartData: [],
      rainPieTypeChartData: [],
      isFullScreen: false,
      basicInfoData:{},
      drainageGradeData:[],
      drainageGrade:{},
      rankEchartData:[],
      areaCode : '510106',
      areaLevel : '3',
      streetName: '',
      rainPieTypeChart1Data:[]
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
        if(concode == 1){
          this.areaCode = '510106';
          this.areaLevel = '3';
          this.streetName = '';
          this.findBasicInfoData();
          this.findDrainageGradePercentData();
          this.findDrainageGroupMixReasonData();
          this.findDrainageGroupMixTypeData();
          this.findDrainageGroupAssessmentProposalData();
          this.findDrainageNumRankingData();
          this.findDrainageGroupTypeData();
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
        if(this.alarmNumsBoxConCode.indexOf('4') == -1){
          exportPic('echart','截图')
        }else{
          exportToExcel("排水户混接点数量", "alarmTable34");
        }
      }
    },

    getStreetName(city, code) {
      if(city !== '金牛区' && code){
        this.areaCode = code;
        this.areaLevel = '4';
        this.streetName = city;
        this.findBasicInfoData();
        this.findDrainageGradePercentData();
        this.findDrainageGroupMixReasonData();
        this.findDrainageGroupMixTypeData();
        this.findDrainageGroupAssessmentProposalData();
        this.findDrainageNumRankingData();
        this.findDrainageGroupTypeData();
      }
    },
    
    // 基本信息
    async findBasicInfoData() {
      let param = {
        areaCode : this.areaCode,
        areaLevel : this.areaLevel
      };
      let r = (await awaitWrap(findBasicInfo(param)))[1] || {};
      if (checkNotNull(r) && checkNotNull(r["data"])) {
        r = r["data"];
      } else {
        r = {
          "wellheadsNum": 0,
          "mixedNum": 0,
          "pipeLength": 0,
          "drainageNum": 0
        };
      }
      this.basicInfoData = r
    },

    //地图
    async initMap() {
      let params = {
        areaCode : '510106',
        areaLevel : '3'
      };
      const res = await findDrainageNumRanking(params);
      let maxValue = 0;
      let dataNew = [];
      let rankData = [];
      res.data.map((item,i) => {
          let obj = {
              alramNum: item.num,
              areaCode: item.code,
              areaName: item.name
          }
          dataNew.push(obj);
          if(i<5){
            rankData.push({
              name: item['name'],
              rate: item['percent'],
              code: item['code'], 
            })
          }
      });
      this.streetData = dataNew || [];
      this.streetData.forEach(m => {
        maxValue = Math.max(maxValue, m["alramNum"]);
      });
      this.mapColorCardinality = Math.ceil(maxValue / 4);
    },

    // 等级占比
    async findDrainageGradePercentData() {
      let param = {
        areaCode : this.areaCode,
        areaLevel : this.areaLevel
      };
      this.drainageGradeData = [{
        value:100,
        name:'一级'
      }]
      let r = (await awaitWrap(findDrainageGradePercent(param)))[1] || {};
      if (checkNotNull(r) && checkNotNull(r["data"])) {
        r = r["data"];
      } else {
        r = [];
      }
      let data = [];
      for(let i = 0;i<r.length;i++){
        data.push({
          value:r[i]['percent'] * 2,
          name:r[i]['name'] == '1' ? '一级' : r[i]['name'] == '2' ? '二级' : r[i]['name'] == '3' ? '三级' : '四级'
        })
        this.drainageGrade[`level${r[i]['name']}`] = r[i]['percent']
      }
      this.drainageGradeData = data
      // setTimeout(() => {
      //   this.drainageGradeData = [{
      //     name:'一级',
      //     value:100,
      //   },
      //   {
      //     name:'二级',
      //     value:50,
      //   },
      //   {
      //     name:'三级',
      //     value:25,
      //   },
      //   {
      //     name:'四级',
      //     value:25,
      //   }]
      // },1000)
      // console.log(this.drainageGradeData)
    },

    // 混接类型分析
    async findDrainageGroupMixTypeData() {
      let param = {
        areaCode : this.areaCode,
        areaLevel : this.areaLevel
      };
      let r = (await awaitWrap(findDrainageGroupMixType(param)))[1] || {};
      if (checkNotNull(r) && checkNotNull(r["data"])) {
        r = r["data"];
      } else {
        r = [];
      }
      let data = [];
      for(let i = 0;i<r.length;i++){
        data.push({
            name: r[i]['name'],
            value: r[i]['num']
        })
      }
      this.rainPieTypeChart1Data = data
    },

    // 混接原因
    async findDrainageGroupMixReasonData() {
      let param = {
        areaCode : this.areaCode,
        areaLevel : this.areaLevel
      };
      let r = (await awaitWrap(findDrainageGroupMixReason(param)))[1] || {};
      if (checkNotNull(r) && checkNotNull(r["data"])) {
        r = r["data"];
      } else {
        r = [];
      }
      let data = [];
      for(let i = 0;i<r.length;i++){
        data.push({
            name: r[i]['name'],
            value: r[i]['num']
        })
      }
      this.wordCloudEchartData = data
    },

    // 评估建议
    async findDrainageGroupAssessmentProposalData() {
      let param = {
        areaCode : this.areaCode,
        areaLevel : this.areaLevel
      };
      let r = (await awaitWrap(findDrainageGroupAssessmentProposal(param)))[1] || {};
      if (checkNotNull(r) && checkNotNull(r["data"])) {
        r = r["data"];
      } else {
        r = [];
      }
      let data = [];
      for(let i = 0;i<r.length;i++){
        data.push({
            name: r[i]['name'],
            value: r[i]['num']
        })
      }
      this.rainPieChartData = data
    },

    //排名
    async findDrainageNumRankingData() {
      let params = {
        areaCode : this.areaCode,
        areaLevel : this.areaLevel
      };
      const res = await findDrainageNumRanking(params);
      let rankData = [];
      res.data.map((item,i) => {
          if(i<5){
            rankData.push({
              name: item['name'],
              rate: item['percent'],
              code: item['code'], 
            })
          }
      });
      this.rankEchartData = rankData;
    },

    // 排水户类型分析
    async findDrainageGroupTypeData() {
      let param = {
        areaCode : this.areaCode,
        areaLevel : this.areaLevel
      };
      let r = (await awaitWrap(findDrainageGroupType(param)))[1] || {};
      if (checkNotNull(r) && checkNotNull(r["data"])) {
        r = r["data"];
      } else {
        r = [];
      }
      this.rainPieTypeChartData = r
    },
  },
  watch: {},
  created() {
    this.initMap();
    this.findBasicInfoData();
    this.findDrainageGradePercentData();
    this.findDrainageGroupMixReasonData();
    this.findDrainageGroupMixTypeData();
    this.findDrainageGroupAssessmentProposalData();
    this.findDrainageNumRankingData();
    this.findDrainageGroupTypeData();
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
  font-size: 16px;
  color: #d6dee7;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-right: 20px;
  .alarm_num_legend {
    margin-left: 12px;
    width: 144px;
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
.rain8-psh-type {
  width: 100%;
  height: 100%;
  > div {
    float: left;
    width: 33.3%;
    height: 100%;
  }
}
.hjdjzb{
  position: relative;
  .rain-level{
    position: absolute;
    right: 40px;
    top: 100px;
    >div{
      overflow: hidden;
      height: 50px;
      line-height: 50px;
      margin-bottom: 20px;
      >div{
        float: left;
      }
      >div:nth-child(2){
        width: 100px;
        background: linear-gradient(90deg, rgba(6,48,90,0) 0%, #0E6DCC 100%);
        opacity: 0.8;
        text-align: center;
        font-size: 20px;
      }
       >div:nth-child(1){
        font-size: 16px;
        color: #FFFFFF;
      }
      .level1{
        color: rgba(240, 255, 24, 1);
      }
      .level2{
        color: rgba(11, 255, 114, 1);
      }
      .level3{
        color: rgba(0, 212, 255, 1);
      }
      .level4{
        color: rgba(64, 100, 222, 1);
      }
    }
  }
}
.analysis_table{
  margin: 20px;
}
</style>