<template>
  <!-- 沿河排口智能监管系统/报警管理/监测指标报警统计分析/信息分析 -->
  <div :class="['informationAnalysis', { fullScreen: isFullScreen }]">
    <ul class="informationAnalysis_top">
      <li>
        <systemPanel
          title="当月报警次数排名"
          :boxContorl="['3', '4', '5']"
          :activeBoxContorl.sync="alarmRankActiveContorl"
          @contorlFun="alarmRankContorlFun"
        >
          <template v-if="alarmRankActiveContorl.indexOf('4') == -1">
            <div
              v-if="alarmRankActiveContorl.indexOf('3') == -1"
              class="alarmRankForm"
            >
              排口选择:
              <el-select
                v-model="outletForm1.pointCode"
                placeholder="请选择"
                clearable
                @change="getCurrentMonthAlarmRank(1)"
              >
                <el-option
                  v-for="item in outletData"
                  :key="item.pointCode"
                  :label="item.pointName"
                  :value="item.pointCode"
                ></el-option>
              </el-select>
            </div>
            <el-form
              v-else
              class="base_info_form chartForm"
              ref="form"
              :inline="true"
              :model="outletForm2"
            >
              <el-form-item label="所属街道：">
                <el-select
                  v-model="outletForm2.areaCode"
                  placeholder="请选择"
                  clearable
                >
                  <el-option
                    v-for="item in streesOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="所属河流：">
                <el-select
                  v-model="outletForm2.riverCode"
                  placeholder="请选择"
                  clearable
                >
                  <el-option
                    v-for="item in allRiverOptions"
                    :key="item.value"
                    :label="item.text"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="点位类型：">
                <el-select
                  v-model="outletForm2.subtype"
                  placeholder="请选择"
                  clearable
                >
                  <el-option
                    v-for="item in pointTypeOptions"
                    :key="item.value"
                    :label="item.text"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="getCurrentMonthAlarmRank(2)"
                  >查询</el-button
                >
              </el-form-item>
            </el-form>
            <ul
              v-if="checkNotNull(alarmRankData)"
              id="alarmRankChart"
              :class="[
                'alarmRankContent',
                {
                  alarmRankFullContent:
                    alarmRankActiveContorl.indexOf('3') != -1,
                },
              ]"
            >
              <li v-for="item in alarmRankData" :key="item.pointName">
                <div
                  :class="{ active: currPointCode == item.pointCode }"
                  @click="getCurrPointCode(item.pointCode)"
                >
                  <p class="rank">NO.{{ item.rank }}</p>
                  <p class="name textOmit" :title="item.pointName">
                    {{ item.pointName }}
                  </p>
                  <p
                    class="progress"
                    :style="`width: ${(item.num / alarmRankMax) * 60}%`"
                  ></p>
                  <p class="num">{{ item.num }}次</p>
                </div>
              </li>
            </ul>
            <no-data v-else></no-data>
          </template>
          <template v-else>
            <el-table
              id="alarmRankTable"
              :data="alarmRankData"
              class="statistical_analysis_table chartTable"
              :row-style="{ height: '33px' }"
              height="calc(100% - 40px)"
              :header-row-style="{ height: '33px' }"
              :cell-style="{ padding: '0px', color: '#C5D0D4' }"
              :header-cell-style="{
                padding: '0px',
                color: '#C5D0D4',
                backgroundColor: 'rgba(28,178,255,.2) !important',
              }"
            >
              <el-table-column prop="rank" label="排名" align="center">
              </el-table-column>
              <el-table-column prop="pointName" label="名称" align="center">
              </el-table-column>
              <el-table-column prop="num" label="报警次数" align="center">
              </el-table-column>
            </el-table>
          </template>
        </systemPanel>
      </li>
      <li>
        <systemPanel title="当月报警信息统计" :boxContorl="['5']">
          <progressCircle
            id="monthlyAlarm"
            color="#25c7fb"
            data="50"
            height="70%"
          />
        </systemPanel>
      </li>
      <li>
        <systemPanel
          title="当月报警指标统计"
          :boxContorl="['4', '5']"
          :activeBoxContorl.sync="alarmIndicatorActiveContorl"
          @contorlFun="alarmIndicatorContorlFun"
        >
          <circlePie
            v-if="alarmIndicatorActiveContorl.indexOf('4') == -1"
            id="alarmIndicatorChart"
            :data="alarmIndicatorData"
            :total="alarmIndicatorTotal"
            height="100%"
          />
          <template v-else>
            <el-table
              id="alarmIndicatorTable"
              :data="alarmIndicatorTableData"
              class="statistical_analysis_table chartTable"
              :row-style="{ height: '33px' }"
              height="calc(100% - 40px)"
              :header-row-style="{ height: '33px' }"
              :cell-style="{ padding: '0px', color: '#C5D0D4' }"
              :header-cell-style="{
                padding: '0px',
                color: '#C5D0D4',
                backgroundColor: 'rgba(28,178,255,.2) !important',
              }"
            >
              <el-table-column prop="name" label="因子" align="center">
              </el-table-column>
              <el-table-column prop="value" label="报警次数" align="center">
              </el-table-column>
            </el-table>
          </template>
        </systemPanel>
      </li>
    </ul>
    <ul class="informationAnalysis_bottom">
      <li>
        <systemPanel
          title="报警时段统计分析"
          :boxContorl="['3', '4', '5']"
          :activeBoxContorl.sync="alarmTimeActiveContorl"
          @contorlFun="alarmTimeContorlFun"
        >
          <el-radio-group
            v-show="alarmTimeActiveContorl.indexOf('4') == -1"
            class="statistical_analysis_radio"
            v-model="timeType"
            size="small"
            @change="getAlarmTimeInterval"
          >
            <el-radio label="yyyy-mm-dd HH24:MI:ss" border>小时</el-radio>
            <el-radio label="yyyy-mm-dd" border>日</el-radio>
            <el-radio label="yyyy-mm" border>月</el-radio>
          </el-radio-group>
          <lineChart
            height="80%"
            ref="alarmTimeChart"
            id="alarmTimeChart"
            :data="alarmTimeTableData"
            :dataOption="{ name: 'testTime', value: 'num' }"
          ></lineChart>
          <el-table
            v-show="alarmTimeActiveContorl.indexOf('4') != -1"
            id="alarmTimeTable"
            :data="alarmTimeTableData"
            class="statistical_analysis_table chartTable"
            :row-style="{ height: '33px' }"
            height="calc(100% - 40px)"
            :header-row-style="{ height: '33px' }"
            :cell-style="{ padding: '0px', color: '#C5D0D4' }"
            :header-cell-style="{
              padding: '0px',
              color: '#C5D0D4',
              backgroundColor: 'rgba(28,178,255,.2) !important',
            }"
          >
            <el-table-column
              type="index"
              width="60"
              label="序号"
              align="center"
            >
            </el-table-column>
            <el-table-column prop="testTime" label="时间" align="center">
            </el-table-column>
            <el-table-column prop="num" label="报警数量" align="center">
            </el-table-column>
          </el-table>
        </systemPanel>
      </li>
      <li>
        <systemPanel
          :title="top5Flag ? '报警点位top5日排名' : '当月报警日历'"
          class="calendarBox"
        >
          <div v-show="top5Flag" class="return_calendar">
            <img
              @click="top5Flag = false"
              src="/static/ManageSystem/img/return_icon.png"
              alt=""
              srcset=""
            />
          </div>
          <el-calendar
            v-show="!top5Flag"
            v-model="calendarValue"
            class="calendarBoxCalendar"
            :first-day-of-week="7"
          >
            <template slot="dateCell" slot-scope="{ data }">
              <template v-if="filterCalendarInfo(data.day)">
                <el-popover
                  popper-class="calendar_popover"
                  placement="top-start"
                  trigger="hover"
                  :content="'报警数:' + filterCalendarInfo(data.day)['num']"
                >
                  <div
                    slot="reference"
                    @click="getAlarmPointTop5Data(data.day)"
                    :style="
                      'cursor: pointer;color:' +
                      filterCalendarInfo(data.day)['color']
                    "
                  >
                    {{ data.day.split("-").slice(2).join("-") }}
                  </div>
                </el-popover>
              </template>
              <template v-else>
                <div slot="reference">
                  {{ data.day.split("-").slice(2).join("-") }}
                </div>
              </template>
            </template>
          </el-calendar>
          <stackBarChart
            v-show="top5Flag"
            height="100%"
            id="top5Container"
            :seriesData="top5SeriesData"
            :xAxisData="top5xAxisData"
            :legendData="top5LegendData"
          ></stackBarChart>
          <div class="calendarBox_content_bt" v-show="!top5Flag">
            <div class="calendarBox_content_bt_1">报警次数较上月同比</div>
            <div class="calendarBox_content_bt_2">{{ yearOnYearInfo }}</div>
            <div class="calendarBox_content_bt_3 alarm_num_legend_content">
              <p>报警数量</p>
              <p class="alarm_num_legend">
                <span>0</span>
                <span>{{ colorCardinality * 4 }}</span>
              </p>
            </div>
          </div>
        </systemPanel>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { getAllPoint } from "@/api";
import {
  getSameMonthNum,
  getSameMonthAlarmIndex,
  getAlarmTimeInterval,
  getAlarmCal,
  getDateAlarmNum,
} from "@/api/alongRiverOutlet";
import { awaitWrap, checkNotNull, exportPic, exportToExcel } from "@/lib";
import progressCircle from "../charts/progressCircle.vue";
import circlePie from "../charts/circlePie.vue";
import lineChart from "../charts/lineChart.vue";
import stackBarChart from "../charts/stackBarChart.vue";

export default {
  components: { progressCircle, circlePie, lineChart, stackBarChart },
  data() {
    return {
      outletData: [],
      outletPointCode: "",
      outletForm1: {
        pointCode: "",
        deviceType: "pk",
      },
      outletForm2: {
        areaCode: "",
        riverCode: "",
        subtype: "",
        deviceType: "pk",
      },
      alarmRankData: [],
      alarmRankMax: 1,
      currPointCode: "",
      alarmRankActiveContorl: [],
      alarmIndicatorData: [],
      alarmIndicatorTotal: [],
      alarmIndicatorTableData: [],
      alarmIndicatorActiveContorl: [],
      timeType: "yyyy-mm",
      alarmTimeTableData: [],
      alarmTimeActiveContorl: [],
      isFullScreen: false,
      top5Flag: false,
      calendarValue: new Date(),
      yearOnYearInfo: "无变化",
      colorCardinality: 0,
      calendarInfo: [],
      top5SeriesData: [],
      top5xAxisData: [],
      top5LegendData: [],
    };
  },
  computed: {
    ...mapState({
      streesOptions: (state) => state.IntelSupervison.streesOptions,
      allRiverOptions: (state) => state.IntelSupervison.allRiverOptions,
      pointTypeOptions: (state) => state.IntelSupervison.pointTypeOptions,
    }),
    // changeVal() {
    //   const {
    //     alarmRankActiveContorl,
    //     alarmIndicatorActiveContorl,
    //     alarmTimeActiveContorl
    //   } = this;

    //   return {
    //     alarmRankActiveContorl,
    //     alarmIndicatorActiveContorl,
    //     alarmTimeActiveContorl
    //   };
    // }
  },
  // watch: {
  //   changeVal: {
  //     deep: true,
  //     immediate: true,
  //     handler(val) {
  //       console.log(val);
  //       this.isFullScreen = false;
  //       for (let i in val) {
  //         if (val[i].indexOf("3" != -1)) {
  //           this.isFullScreen = true;
  //         }
  //       }
  //     }
  //   }
  // },
  methods: {
    checkNotNull,
    // 获得排口数据
    async getOutletData() {
      let outletList =
        (await awaitWrap(getAllPoint({ deviceTypeStr: "pk" })))[1] || {};
      if (checkNotNull(outletList) && checkNotNull(outletList["data"])) {
        this.outletData = outletList["data"];
      }
    },
    // 当月报警次数排名
    async getCurrentMonthAlarmRank(code) {
      const _this = this;
      let formData = _this["outletForm" + code];
      let alarmRankList =
        (await awaitWrap(getSameMonthNum({ ...formData })))[1] || {};

      if (checkNotNull(alarmRankList) && checkNotNull(alarmRankList["data"])) {
        _this.alarmRankData = alarmRankList["data"];
        _this.alarmRankMax = _this.alarmRankData[0]["num"];
      } else {
        _this.alarmRankData = [];
        _this.alarmRankMax = 1;
      }
    },
    // 点击报警排名 获得当前点位code
    getCurrPointCode(code) {
      this.currPointCode = this.currPointCode == code ? "" : code;

      this.initData();
    },
    // 报警排名操作按钮
    alarmRankContorlFun(code) {
      if (this.alarmRankActiveContorl.indexOf("3") == -1) {
        this.isFullScreen = false;
        this.getCurrentMonthAlarmRank(1);
      } else {
        this.isFullScreen = true;
        this.getCurrentMonthAlarmRank(2);
      }

      let exportIndex = this.alarmRankActiveContorl.indexOf("5");
      if (exportIndex != -1) {
        // 图表下载
        if (this.alarmRankActiveContorl.indexOf("4") == -1) {
          exportPic("alarmRankChart", "当月报警次数排名");
        } else {
          // 表格下载
          exportToExcel("当月报警次数排名", "alarmRankTable");
        }

        this.alarmRankActiveContorl.splice(exportIndex, 1);
      }
    },
    // 当月报警指标统计
    async getSameMonthAlarmIndex() {
      const _this = this;
      let alarmInfo =
        (
          await awaitWrap(
            getSameMonthAlarmIndex({ pointCode: _this.currPointCode })
          )
        )[1] || {};
      if (checkNotNull(alarmInfo) && checkNotNull(alarmInfo["data"])) {
        alarmInfo = alarmInfo["data"];
      }

      let alarmData = [],
        alarmData1 = [];
      for (let i in alarmInfo) {
        if (i == "total") {
          _this.alarmIndicatorTotal = alarmInfo[i];
        } else {
          alarmData1.push({
            name: i,
            value: alarmInfo[i],
          });

          alarmData.push(
            {
              name: i,
              value: alarmInfo[i],
            },
            {
              value: 2,
              name: "",
              itemStyle: {
                normal: {
                  label: {
                    show: false,
                  },
                  labelLine: {
                    show: false,
                  },
                  color: "rgba(0, 0, 0, 0)",
                  borderColor: "rgba(0, 0, 0, 0)",
                  borderWidth: 0,
                },
              },
            }
          );
        }
      }

      _this.alarmIndicatorData = alarmData;
      _this.alarmIndicatorTableData = alarmData1;
    },
    alarmIndicatorContorlFun(code) {
      let exportIndex = this.alarmIndicatorActiveContorl.indexOf("5");
      if (exportIndex != -1) {
        // 图表下载
        if (this.alarmIndicatorActiveContorl.indexOf("4") == -1) {
          exportPic("alarmIndicatorChart", "当月报警指标统计");
        } else {
          // 表格下载
          exportToExcel("当月报警指标统计", "alarmIndicatorTable");
        }
        this.alarmIndicatorActiveContorl.splice(exportIndex, 1);
      }
    },
    // 报警时段统计分析
    async getAlarmTimeInterval() {
      const _this = this;
      let alarmInfo =
        (
          await awaitWrap(
            getAlarmTimeInterval({
              pointCode: _this.currPointCode,
              timeType: _this.timeType,
            })
          )
        )[1] || {};
      if (checkNotNull(alarmInfo) && checkNotNull(alarmInfo["data"])) {
        _this.alarmTimeTableData = alarmInfo["data"] || [];
      } else {
        _this.alarmTimeTableData = [];
      }
    },
    alarmTimeContorlFun() {
      const _this = this;
      _this.$nextTick(() => {
        if (_this.$refs.alarmTimeChart) {
          _this.$refs.alarmTimeChart.resizeCharts();
        }
      });
      if (_this.alarmTimeActiveContorl.indexOf("3") == -1) {
        _this.isFullScreen = false;
      } else {
        _this.isFullScreen = true;
      }

      let exportIndex = _this.alarmTimeActiveContorl.indexOf("5");
      if (exportIndex != -1) {
        // 图表下载
        if (_this.alarmTimeActiveContorl.indexOf("4") == -1) {
          exportPic("alarmTimeChart", "报警时段统计分析");
        } else {
          // 表格下载
          exportToExcel("报警时段统计分析", "alarmTimeTable");
        }
        this.alarmIndicatorActiveContorl.splice(exportIndex, 1);
      }
    },
    //报警日历
    async initCalendarChart() {
      const _this = this;
      const res = await getAlarmCal({ pointCode: _this.currPointCode });
      let calArr = [],
        lastMonth = 0,
        currMonthTotal = 0,
        maxValue = 0;
      if (checkNotNull(res) && checkNotNull(res["data"])) {
        calArr = res["data"]["alarmNum"] || [];
        lastMonth = res["data"]["lastMonth"] || 0;
        currMonthTotal = res["data"]["sameMonth"] || 0;
      }

      _this.calendarInfo = calArr;
      calArr.forEach((m) => {
        maxValue = Math.max(maxValue, m["num"]);
      });

      if (currMonthTotal > lastMonth) {
        _this.yearOnYearInfo = "上升";
      } else if (lastMonth > currMonthTotal) {
        _this.yearOnYearInfo = "下降";
      } else {
        _this.yearOnYearInfo = "无变化";
      }

      _this.colorCardinality = Math.ceil(maxValue / 4);
    },
    filterCalendarInfo(date) {
      let currInfo = this.calendarInfo.filter((m) => m["testTime"] == date);

      if (checkNotNull(currInfo)) {
        currInfo = currInfo[0];
        currInfo["color"] = "rgba(255,255,255,0.6)";
        if (currInfo["num"] > 0 && this.colorCardinality > currInfo["num"]) {
          currInfo["color"] = "#18C3FF";
        }
        if (
          currInfo["num"] >= this.colorCardinality &&
          this.colorCardinality * 2 > currInfo["num"]
        ) {
          currInfo["color"] = "#D3CB40";
        }
        if (
          currInfo["num"] >= this.colorCardinality * 2 &&
          this.colorCardinality * 3 > currInfo["num"]
        ) {
          currInfo["color"] = "#FF8C1B";
        }
        if (currInfo["num"] >= this.colorCardinality * 3) {
          currInfo["color"] = "#D30717";
        }

        return currInfo;
      } else {
        return "";
      }
    },
    //当日top5
    async getAlarmPointTop5Data(time) {
      const _this = this;
      _this.currTime = time;
      _this.top5Flag = true;

      const res = await getDateAlarmNum({ date: time });
      let top5Data = [];
      if (checkNotNull(res) && checkNotNull(res["data"])) {
        top5Data = res["data"] || [];
      }

      (_this.top5xAxisData = []),
        (_this.top5SeriesData = {}),
        (_this.top5LegendData = []);

      if (checkNotNull(top5Data)) {
        let baseInfo = JSON.parse(JSON.stringify(top5Data[0]));
        delete baseInfo.pointName;
        _this.top5LegendData = Object.keys(baseInfo);

        top5Data.forEach((n) => {
          _this.top5xAxisData.push(n.pointName);

          _this.top5LegendData.forEach((m) => {
            if (!checkNotNull(_this.top5SeriesData[m])) {
              _this.top5SeriesData[m] = [];
            }

            _this.top5SeriesData[m].push(n[m]);
          });
        });
      }
    },
    initData() {
      const _this = this;
      _this.$nextTick(() => {
        _this.getCurrentMonthAlarmRank(1);
        _this.getSameMonthAlarmIndex();
        _this.getAlarmTimeInterval();
        _this.initCalendarChart();
      });
    },
  },
  mounted() {
    this.getOutletData();
    this.initData();
  },
};
</script>


<style lang="scss" scoped>
.informationAnalysis {
  height: calc(100% - 55px);
  // position: relative;
  overflow-y: auto;
  overflow-x: hidden;

  &.fullScreen {
    overflow: hidden;
    top: 0;
    left: 0;
  }

  .informationAnalysis_top {
    height: 372px;
    display: flex;
    > li {
      width: calc(33.3333% - 13.3333px);
      &:nth-child(2) {
        margin: 0 20px;
      }
    }
  }

  .informationAnalysis_bottom {
    height: 452px;
    display: flex;
    margin-top: 20px;

    > li {
      &:nth-child(1) {
        width: calc(60% - 10px);
        margin-right: 20px;
      }
      &:nth-child(2) {
        width: calc(40% - 10px);
      }
    }

    .statistical_analysis_radio {
      position: absolute;
      right: 50px;
      top: 60px;
      z-index: 1;
    }

    #alarmTimeChart {
      padding-top: 80px;
    }
  }

  .alarmRankForm {
    font-size: 12px;
    position: absolute;
    top: 15px;
    left: 25px;

    /deep/ .el-select,
    /deep/ .el-input,
    /deep/ .el-input__inner {
      width: 60px !important;
      height: 21px !important;
      line-height: 21px !important;
      font-size: 12px;

      .el-input__suffix {
        right: 0;
        .el-input__icon {
          color: #fff;
          font-size: 10px;
          width: 20px;
          height: 21px;
          line-height: 21px;
        }
      }
    }

    /deep/ .el-input__inner {
      box-sizing: border-box;
      padding: 4px 20px 4px 10px;
    }
  }

  .alarmRankContent {
    padding: 20px;
    height: 100%;
    box-sizing: border-box;
    &.alarmRankFullContent {
      height: calc(100% - 65px);
    }

    li {
      width: 100%;
      display: flex;
      font-size: 16px;
      height: 20%;
      align-items: center;
      > div {
        cursor: pointer;
        display: flex;
        width: 100%;
        align-items: center;

        &.active {
          .rank {
            color: rgba(37, 227, 255, 1);
          }
          .progress {
            background: linear-gradient(
              90deg,
              rgba(20, 98, 247, 0) 0%,
              #ffd200 100%
            );
          }
        }
      }

      .rank {
        width: 50px;
      }
      .name {
        width: 100px;
        padding-right: 15px;
        box-sizing: border-box;
      }
      .progress {
        height: 12px;
        background: linear-gradient(
          90deg,
          rgba(20, 98, 247, 0) 0%,
          #00e1ff 100%
        );
        position: relative;
        margin-right: 10px;

        &::after {
          content: "";
          position: absolute;
          right: -6px;
          top: 0;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background-color: #fff;
          z-index: 1;
          box-shadow: 0 0 5px 1px rgba(255, 255, 255, 1);
        }
      }
    }
  }
}
</style>
