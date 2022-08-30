<template>
  <div class="outletStatisticAnalysis">
    <ul class="outletStatisticAnalysisContent">
      <li>
        <systemPanel
          title="超标总次数分析"
          :boxContorl="['4', '5']"
          :activeBoxContorl.sync="alarmIndicatorActiveContorl"
          @contorlFun="alarmIndicatorContorlFun"
        >
          <el-form
            class="base_info_form chartForm"
            ref="form"
            :inline="true"
            :model="alarmIndicatorForm"
          >
            <el-form-item label="时间：">
              <el-date-picker
                v-model="alarmDateDaterange"
                type="daterange"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd"
                @change="getSameMonthAlarmIndex"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item label="排口：">
              <el-select
                v-model="alarmIndicatorForm.pointCode"
                placeholder="请选择"
                clearable
                @change="getSameMonthAlarmIndex"
              >
                <el-option
                  v-for="item in outletData"
                  :key="item.pointCode"
                  :label="item.pointName"
                  :value="item.pointCode"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-form>

          <circlePie
            v-if="alarmIndicatorActiveContorl.indexOf('4') == -1"
            id="alarmIndicatorChart"
            ref="alarmIndicatorChart"
            :data="alarmIndicatorData"
            :total="alarmIndicatorTotal"
            height="80%"
          >
          </circlePie>

          <template v-else>
            <el-table
              id="alarmIndicatorTable"
              :data="alarmIndicatorTableData"
              class="statistical_analysis_table chartTable"
              :row-style="{ height: '33px' }"
              height="80%"
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
      <li>
        <systemPanel
          title="监测值趋势分析"
          :boxContorl="['3', '5']"
          :activeBoxContorl.sync="valueTrendAnalysisActiveContorl"
          @contorlFun="valueTrendAnalysisContorlFun"
        >
          <el-form
            class="base_info_form chartForm"
            ref="form"
            :inline="true"
            :model="valueTrendAnalysisForm"
          >
            <el-form-item label="时间：">
              <el-radio-group
                v-model="valueTrendAnalysisForm.timeType"
                size="small"
                @change="timeTypeChange"
              >
                <el-radio label="1">小时</el-radio>
                <el-radio label="2">日</el-radio>
                <el-radio label="3">月</el-radio>
              </el-radio-group>
              <el-date-picker
                v-model="valueTrendAnalysisDateDaterange"
                :type="valueTrendAnalysisDaterangeType"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :value-format="valueTrendAnalysisDateType"
                :format="valueTrendAnalysisDateType"
                @change="getTestValueAnalysis"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item label="排口：">
              <el-select
                class="multipleSelect"
                v-model="valueTrendAnalysisPointCode"
                placeholder="请选择"
                :multiple="dataShowType == 2"
                collapse-tags
                @change="getTestValueAnalysis"
              >
                <el-option
                  v-for="item in outletData"
                  :key="item.pointCode"
                  :label="item.pointName"
                  :value="item.pointCode"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="因子：">
              <el-select
                class="multipleSelect"
                v-model="valueTrendAnalysisFactors"
                placeholder="请选择"
                :multiple="dataShowType == 1"
                collapse-tags
                @change="getTestValueAnalysis"
              >
                <el-option
                  v-for="item in factorList"
                  :key="item.code"
                  :label="item.name"
                  :value="item.code"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-checkbox
                v-model="valueTrendAnalysisForm.threshold"
                v-if="dataShowType == 2"
                @change="getTestValueAnalysis"
                >阈值</el-checkbox
              >
            </el-form-item>
            <el-form-item class="dataShowType">
              <span
                @click="dataShowTypeChange(1)"
                :class="{ active: dataShowType == 1 }"
                >单排口多因子</span
              >
              <span
                @click="dataShowTypeChange(2)"
                :class="{ active: dataShowType == 2 }"
                >单因子多排口</span
              >
            </el-form-item>
          </el-form>
          <lineChart
            lineType="2"
            height="88%"
            ref="valueTrendAnalysisChart"
            id="valueTrendAnalysisChart"
            :data="valueTrendAnalysisData"
          ></lineChart>
        </systemPanel>
      </li>
      <li>
        <systemPanel
          title="监测值同比分析"
          :boxContorl="['3', '5']"
          :activeBoxContorl.sync="yearAnalysisActiveContorl"
          @contorlFun="yearAnalysisContorlFun"
        >
          <el-form
            class="base_info_form chartForm"
            ref="form"
            :inline="true"
            :model="yearAnalysisForm"
          >
            <el-form-item label="排口：">
              <el-select
                v-model="yearAnalysisForm.pointCode"
                placeholder="请选择"
                @change="getYearAnalysisData"
              >
                <el-option
                  v-for="item in outletData"
                  :key="item.pointCode"
                  :label="item.pointName"
                  :value="item.pointCode"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="因子：">
              <el-select
                v-model="yearAnalysisForm.factor"
                placeholder="请选择"
                @change="getYearAnalysisData"
              >
                <el-option
                  v-for="item in factorList"
                  :key="item.code"
                  :label="item.name"
                  :value="item.code"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="基准年">
              <el-date-picker
                v-model="yearAnalysisForm.year"
                type="year"
                placeholder="选择年"
                format="yyyy"
                value-format="yyyy"
                @change="getYearAnalysisData"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item label="对比年">
              <el-date-picker
                v-model="yearAnalysisForm.contrastYear"
                type="year"
                placeholder="选择年"
                format="yyyy"
                value-format="yyyy"
                @change="getYearAnalysisData"
              >
              </el-date-picker>
            </el-form-item>
          </el-form>
          <barChart
            id="yearAnalysisChart"
            ref="yearAnalysisChart"
            height="88%"
            :seriesData="yearAnalysisSeriesData"
            :xAxisData="yearAnalysisxAxisData"
            :maxValue="yearAnalysisMaxValue"
            :unit="yearAnalysisUnit"
          />
        </systemPanel>
      </li>
      <li>
        <systemPanel
          title="监测值环比分析"
          :boxContorl="['4', '5']"
          :activeBoxContorl.sync="sequentialAnalysisActiveContorl"
          @contorlFun="sequentialAnalysisContorlFun"
        >
          <el-form
            class="base_info_form chartForm"
            ref="form"
            :inline="true"
            :model="sequentialAnalysisForm"
          >
            <el-form-item label="排口：">
              <el-select
                v-model="sequentialAnalysisForm.pointCode"
                placeholder="请选择"
                @change="getsequentialAnalysisData"
              >
                <el-option
                  v-for="item in outletData"
                  :key="item.pointCode"
                  :label="item.pointName"
                  :value="item.pointCode"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="基准月">
              <el-date-picker
                v-model="sequentialAnalysisForm.month"
                type="month"
                placeholder="选择月"
                format="yyyy-MM"
                value-format="yyyy-MM"
                @change="getsequentialAnalysisData"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item label="对比月">
              <el-date-picker
                v-model="sequentialAnalysisForm.contrastMonth"
                type="month"
                placeholder="选择月"
                format="yyyy-MM"
                value-format="yyyy-MM"
                @change="getsequentialAnalysisData"
              >
              </el-date-picker>
            </el-form-item>
          </el-form>
          <el-row
            v-show="sequentialAnalysisActiveContorl.indexOf('4') == -1"
            class="sequentialAnalysisRow"
            id="sequentialAnalysisChart"
          >
            <el-col :span="6" v-for="item in factorList" :key="item.code">
              <barChart
                :id="`${item.code}Chart`"
                height="100%"
                :seriesData="sequentialAnalysisSeriesData[item.code]"
                :xAxisData="[item.name]"
                :maxValue="sequentialAnalysisMaxValue[item.code]"
                :unit="item.unit"
                :legendShow="false"
              />
            </el-col>
          </el-row>
          <el-table
            v-show="sequentialAnalysisActiveContorl.indexOf('4') != -1"
            id="sequentialAnalysisTable"
            :data="sequentialAnalysisTableData"
            class="statistical_analysis_table chartTable"
            :row-style="{ height: '33px' }"
            height="80%"
            :header-row-style="{ height: '33px' }"
            :cell-style="{ padding: '0px', color: '#C5D0D4' }"
            :header-cell-style="{
              padding: '0px',
              color: '#C5D0D4',
              backgroundColor: 'rgba(28,178,255,.2) !important',
            }"
          >
            <el-table-column prop="pointName" label="排口" align="center">
            </el-table-column>
            <el-table-column prop="testTime" label="时间" align="center">
            </el-table-column>
            <el-table-column prop="w01001" label="PH" align="center">
            </el-table-column>
            <el-table-column prop="w01018" label="COD" align="center">
            </el-table-column>
            <el-table-column prop="w21003" label="氨氮" align="center">
            </el-table-column>
            <el-table-column prop="w99266" label="流量" align="center">
            </el-table-column>
          </el-table>
        </systemPanel>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { getAllPoint } from "@/api";
import {
  getSameMonthAlarmIndex,
  getTestValueYoY,
  getTestValueRR,
  getTestValueAnalysis,
  getFatorsStandards,
} from "@/api/alongRiverOutlet";
import { awaitWrap, checkNotNull, exportPic, exportToExcel } from "@/lib";
import circlePie from "../charts/circlePie.vue";
import barChart from "../charts/barChart.vue";
import lineChart from "../charts/lineChart.vue";
import qs from "qs";

export default {
  components: { circlePie, barChart, lineChart },
  data() {
    return {
      overproofAnalysisActiveContorl: [],
      alarmIndicatorActiveContorl: [],
      alarmIndicatorData: [],
      alarmIndicatorTotal: [],
      alarmIndicatorTableData: [],
      alarmIndicatorForm: {
        pointCode: "",
        startTime: "",
        endTime: "",
      },
      alarmDateDaterange: [],
      outletData: [],
      valueTrendAnalysisForm: {
        endTime: "",
        factors: [],
        pks: [],
        startTime: "",
        timeType: "3",
        threshold: false,
      },
      valueTrendAnalysisPointCode: "",
      valueTrendAnalysisFactors: ["w01001"],
      valueTrendAnalysisDateDaterange: [],
      valueTrendAnalysisDateType: "yyyy-MM",
      valueTrendAnalysisDaterangeType: "monthrange",
      factorList: [
        { name: "PH", code: "w01001", unit: "" },
        { name: "COD", code: "w01018", unit: "mg/L" },
        { name: "氨氮", code: "w21003", unit: "mg/L" },
        { name: "流量", code: "w99266", unit: "m³/s" },
      ],
      valueTrendAnalysisActiveContorl: [],
      dataShowType: "1",
      yearAnalysisForm: {
        contrastYear: "",
        factor: "w01001",
        pointCode: "",
        year: "",
      },
      yearAnalysisActiveContorl: [],
      yearAnalysisSeriesData: {},
      yearAnalysisxAxisData: [],
      yearAnalysisMaxValue: 0,
      yearAnalysisUnit: "",
      sequentialAnalysisForm: {
        contrastMonth: "",
        month: "",
        pointCode: "",
      },
      sequentialAnalysisActiveContorl: [],
      sequentialAnalysisSeriesData: {},
      sequentialAnalysisMaxValue: {},
      sequentialAnalysisTableData: [],
      valueTrendAnalysisData: {},
      standardData: [],
    };
  },
  methods: {
    async getBaseInfo() {
      await this.getFatorsStandards();
      await this.getOutletData();
    },
    // 获得阈值
    async getFatorsStandards() {
      let standardList =
        (await awaitWrap(getFatorsStandards({ deviceType: "pk" })))[1] || {};
      if (checkNotNull(standardList) && checkNotNull(standardList["data"])) {
        this.standardData = standardList["data"];
      } else {
        this.standardData = [];
      }
    },
    // 获得排口数据
    async getOutletData() {
      let outletList =
        (await awaitWrap(getAllPoint({ deviceTypeStr: "pk" })))[1] || {};
      if (checkNotNull(outletList) && checkNotNull(outletList["data"])) {
        this.outletData = outletList["data"];
        this.yearAnalysisForm.pointCode =
          this.sequentialAnalysisForm.pointCode =
          this.valueTrendAnalysisPointCode =
            this.outletData[0]["pointCode"];
      }
    },
    //   超标总次数分析
    alarmIndicatorContorlFun() {
      let exportIndex = this.alarmIndicatorActiveContorl.indexOf("5");
      if (exportIndex != -1) {
        // 图表下载
        if (this.alarmIndicatorActiveContorl.indexOf("4") == -1) {
          exportPic("alarmIndicatorChart", "超标总次数分析");
        } else {
          // 表格下载
          exportToExcel("超标总次数分析", "alarmIndicatorTable");
        }
        this.alarmIndicatorActiveContorl.splice(exportIndex, 1);
      }
    },
    overproofAnalysisContorlFun() {},
    // 当月报警指标统计
    async getSameMonthAlarmIndex() {
      const _this = this;
      _this.alarmIndicatorForm.startTime = _this.alarmDateDaterange[0] || "";
      _this.alarmIndicatorForm.endTime = _this.alarmDateDaterange[1] || "";

      let alarmInfo =
        (
          await awaitWrap(
            getSameMonthAlarmIndex({ ..._this.alarmIndicatorForm })
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
    // 监测值趋势分析
    async getTestValueAnalysis() {
      const _this = this;
      _this.valueTrendAnalysisForm.startTime =
        _this.valueTrendAnalysisDateDaterange[0];
      _this.valueTrendAnalysisForm.endTime =
        _this.valueTrendAnalysisDateDaterange[1];

      // 单排口多因子
      if (_this.dataShowType == 1) {
        _this.valueTrendAnalysisForm.pks = [_this.valueTrendAnalysisPointCode];
        _this.valueTrendAnalysisForm.factors = [
          ..._this.valueTrendAnalysisFactors,
        ];
      } else {
        _this.valueTrendAnalysisForm.pks = [
          ..._this.valueTrendAnalysisPointCode,
        ];
        _this.valueTrendAnalysisForm.factors = [
          _this.valueTrendAnalysisFactors,
        ];
      }

      // 传数组
      const valueTrendAnalysisFormData = qs.stringify(
        { ..._this.valueTrendAnalysisForm },
        {
          arrayFormat: "comma",
        }
      );

      let valueTrendAnalysisInfo =
        (
          await awaitWrap(
            getTestValueAnalysis(qs.parse(valueTrendAnalysisFormData))
          )
        )[1] || {};
      if (
        checkNotNull(valueTrendAnalysisInfo) &&
        checkNotNull(valueTrendAnalysisInfo["data"])
      ) {
        valueTrendAnalysisInfo = valueTrendAnalysisInfo["data"];
      }

      // 单排口多因子
      if (checkNotNull(valueTrendAnalysisInfo)) {
        let seriesData = [],
          seriesItem = {},
          factorName = "";
        if (_this.dataShowType == 1) {
          _this.valueTrendAnalysisForm.factors.forEach((n) => {
            factorName = _this.factorList.filter((i) => i["code"] == n)[0][
              "name"
            ];
            seriesItem = {
              name: factorName,
              type: "line",
              symbol: "circle",
              data: [],
            };
            valueTrendAnalysisInfo[0].forEach((m) => {
              seriesItem["data"] = [
                ...seriesItem["data"],
                [m["testTime"], m[n] || null],
              ];
            });

            seriesData.push(seriesItem);
          });
        } else {
          valueTrendAnalysisInfo.forEach((item) => {
            seriesItem = {
              name: "",
              type: "line",
              symbol: "circle",
              data: [],
            };

            item.forEach((m) => {
              seriesItem["name"] = m["pointName"];
              seriesItem["data"] = [
                ...seriesItem["data"],
                [m["testTime"], m[_this.valueTrendAnalysisFactors]] || null,
              ];
            });

            seriesData.push(seriesItem);
          });
        }

        // 阈值
        if (_this.valueTrendAnalysisForm.threshold) {
          let standardValue = _this.standardData
            .filter(
              (m) => m["factorCode"] == _this.valueTrendAnalysisFactors
            )[0]
            ["standardValue"].toString();

          // PH
          if (_this.valueTrendAnalysisFactors == "w01001") {
            seriesData.push(
              {
                type: "line",
                data: [],
                symbol: "line",
                markLine: {
                  data: [
                    {
                      yAxis: standardValue.slice(0, 1),
                      lineStyle: {
                        normal: {
                          color: "#FF0000",
                          width: 2,
                          type: "dotted",
                        },
                      },
                    },
                  ],
                },
              },
              {
                type: "line",
                data: [],
                symbol: "line",
                markLine: {
                  data: [
                    {
                      yAxis: standardValue.slice(1, standardValue.length),
                      lineStyle: {
                        normal: {
                          color: "#FF0000",
                          width: 2,
                          type: "dotted",
                        },
                      },
                    },
                  ],
                },
              }
            );
          } else {
            seriesData.push({
              type: "line",
              data: [],
              symbol: "line",
              markLine: {
                data: [
                  {
                    yAxis: standardValue,
                    lineStyle: {
                      normal: {
                        color: "#FF0000",
                        width: 2,
                        type: "dotted",
                      },
                    },
                  },
                ],
              },
            });
          }
        }

        _this.valueTrendAnalysisData = seriesData;
      }
    },
    valueTrendAnalysisContorlFun() {
      if (this.$refs.valueTrendAnalysisChart) {
        this.$refs.valueTrendAnalysisChart.resizeCharts();
      }

      let exportIndex = this.valueTrendAnalysisActiveContorl.indexOf("5");
      if (exportIndex != -1) {
        // 图表下载
        // if (this.valueTrendAnalysisActiveContorl.indexOf("4") == -1) {
          exportPic("valueTrendAnalysisChart", "监测值趋势分析");
        // }
        //  else {
        //   // 表格下载
        //   exportToExcel("监测值趋势分析", "valueTrendAnalysisTable");
        // }
        this.valueTrendAnalysisActiveContorl.splice(exportIndex, 1);
      }
    },
    timeTypeChange(val) {
      const _this = this;
      let dateType = "";
      if (val == 1) {
        _this.valueTrendAnalysisDateType = "yyyy-MM-dd HH";
        _this.valueTrendAnalysisDaterangeType = "datetimerange";
        dateType = "YYYY-MM-DD HH";
      } else if (val == 2) {
        _this.valueTrendAnalysisDateType = "yyyy-MM-dd";
        _this.valueTrendAnalysisDaterangeType = "daterange";
        dateType = "YYYY-MM-DD";
      } else if (val == 3) {
        _this.valueTrendAnalysisDateType = "yyyy-MM";
        _this.valueTrendAnalysisDaterangeType = "monthrange";
        dateType = "YYYY-MM";
      }

      _this.valueTrendAnalysisForm.startTime =
        _this.valueTrendAnalysisDateDaterange[0] =
        _this.valueTrendAnalysisForm.endTime =
        _this.valueTrendAnalysisDateDaterange[1] =
          _this.$moment(new Date()).format(dateType);

      _this.getTestValueAnalysis();
    },
    dataShowTypeChange(code) {
      this.dataShowType = code;
      // 单排口多因子
      if (code == 1) {
        this.valueTrendAnalysisForm.threshold = false;
        this.valueTrendAnalysisPointCode = this.outletData[0]["pointCode"];
        this.valueTrendAnalysisFactors = [this.factorList[0]["code"]];
      } else {
        // 多排口单因子
        this.valueTrendAnalysisPointCode = [this.outletData[0]["pointCode"]];
        this.valueTrendAnalysisFactors = this.factorList[0]["code"];
      }

      this.getTestValueAnalysis();
    },
    // 监测值同比分析
    async getYearAnalysisData() {
      const _this = this;
      let yearAnalysisInfo =
        (await awaitWrap(getTestValueYoY({ ..._this.yearAnalysisForm })))[1] ||
        [];
      if (
        checkNotNull(yearAnalysisInfo) &&
        checkNotNull(yearAnalysisInfo["data"])
      ) {
        yearAnalysisInfo = yearAnalysisInfo["data"] || [];
      } else {
        yearAnalysisInfo = [];
      }

      let contrastYear = _this.yearAnalysisForm["contrastYear"];
      let year = _this.yearAnalysisForm["year"];

      let seriesData = {
        [_this.yearAnalysisForm["contrastYear"]]: [],
        [_this.yearAnalysisForm["year"]]: [],
      };
      let xAxisData = [];
      yearAnalysisInfo.forEach((m) => {
        xAxisData.push(m["testTime"] + "月");
        seriesData[contrastYear].push(m["contrastValue"]);
        seriesData[year].push(m["yearValue"]);
      });

      _this.yearAnalysisxAxisData = xAxisData;
      _this.yearAnalysisSeriesData = seriesData;
      _this.yearAnalysisMaxValue =
        Math.ceil(
          Math.max.apply(null, [
            ...seriesData[contrastYear],
            ...seriesData[year],
          ])
        ) * 1.2;
      _this.yearAnalysisUnit = _this.factorList.filter(
        (m) => m["code"] == _this.yearAnalysisForm["factor"]
      )[0]["unit"];
    },
    yearAnalysisContorlFun() {
      if (this.$refs.yearAnalysisChart) {
        this.$refs.yearAnalysisChart.resizeCharts();
      }

      let exportIndex = this.yearAnalysisActiveContorl.indexOf("5");
      if (exportIndex != -1) {
        // 图表下载
        // if (this.yearAnalysisActiveContorl.indexOf("4") == -1) {
        exportPic("yearAnalysisChart", "监测值同比分析");
        this.yearAnalysisActiveContorl.splice(exportIndex, 1);
        // } else {
        //   // 表格下载
        //   exportToExcel("超标总次数分析", "alarmIndicatorTable");
        // }
      }
    },
    // 监测值环比分析
    async getsequentialAnalysisData() {
      const _this = this;
      let sequentialAnalysisInfo =
        (
          await awaitWrap(getTestValueRR({ ..._this.sequentialAnalysisForm }))
        )[1] || [];
      if (
        checkNotNull(sequentialAnalysisInfo) &&
        checkNotNull(sequentialAnalysisInfo["data"])
      ) {
        _this.sequentialAnalysisTableData = sequentialAnalysisInfo =
          sequentialAnalysisInfo["data"] || [];
      } else {
        _this.sequentialAnalysisTableData = sequentialAnalysisInfo = [];
      }

      let maxValue = 0;
      let seriesData = {},
        maxValueList = {};
      _this.factorList.forEach((m) => {
        if (!checkNotNull(seriesData[m["code"]])) {
          seriesData[m["code"]] = {};
        }

        maxValue = 0;
        sequentialAnalysisInfo.forEach((n) => {
          seriesData[m["code"]][n["testTime"]] = [n[m["code"]]];
          maxValue = Math.max(maxValue, n[m["code"]]);
        });

        maxValueList[m["code"]] = maxValue * 1.2;
      });

      _this.sequentialAnalysisSeriesData = seriesData;
      _this.sequentialAnalysisMaxValue = maxValueList;
    },
    sequentialAnalysisContorlFun() {
      let exportIndex = this.sequentialAnalysisActiveContorl.indexOf("5");
      if (exportIndex != -1) {
        // 图表下载
        if (this.sequentialAnalysisActiveContorl.indexOf("4") == -1) {
          exportPic("sequentialAnalysisChart", "监测值环比分析");
          this.sequentialAnalysisActiveContorl.splice(exportIndex, 1);
        } else {
          // 表格下载
          exportToExcel("监测值环比分析", "sequentialAnalysisTable");
        }
      }
    },
  },
  mounted() {
    const _this = this;
    _this.yearAnalysisForm.year = this.yearAnalysisForm.contrastYear = _this
      .$moment(new Date())
      .format("YYYY");

    let currMonth = _this.$moment(new Date()).format("YYYY-MM");
    _this.valueTrendAnalysisForm.endTime =
      _this.valueTrendAnalysisForm.startTime =
      _this.sequentialAnalysisForm.contrastMonth =
      _this.sequentialAnalysisForm.month =
        currMonth;

    _this.valueTrendAnalysisDateDaterange = [currMonth, currMonth];

    _this.getBaseInfo().then(() => {
      _this.getSameMonthAlarmIndex();
      _this.getYearAnalysisData();
      _this.getsequentialAnalysisData();
      _this.getTestValueAnalysis();
    });
  },
};
</script>

<style lang="scss">
.outletStatisticAnalysis {
  height: calc(100% - 20px);
  position: relative;

  .outletStatisticAnalysisContent {
    display: flex;
    flex-wrap: wrap;
    overflow-y: auto;
    height: 100%;
  }

  /deep/ .fullScreenPanel {
    height: 100% !important;
  }

  li {
    margin-bottom: 20px;
    &:nth-child(1) {
      width: calc(32.5% - 10px);
      margin-right: 20px;
      height: 372px;
    }
    &:nth-child(2) {
      width: calc(67.5% - 10px);
      height: 372px;
    }
    &:nth-child(3) {
      width: calc(60% - 10px);
      margin-right: 20px;
      height: 452px;
    }
    &:nth-child(4) {
      width: calc(40% - 10px);
      height: 452px;
    }
  }

  .dataShowType {
    float: right;
    span {
      cursor: pointer;
      color: #1f9ecc;
      display: inline-block;
      vertical-align: middle;
      height: 30px;
      line-height: 30px;
      width: 115px;
      text-align: center;
      border: 1px solid #1f9ecc;
      background: rgba(31, 158, 204, 0.2);
      &:nth-child(1) {
        margin-right: 12px;
      }

      &.active {
        color: #fff;
      }
    }
  }

  .sequentialAnalysisRow {
    margin: 0 20px;
    width: calc(100% - 40px);
    height: 88%;

    /deep/ .el-col {
      height: 100%;
    }
  }
}
</style>