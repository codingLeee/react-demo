<template>
  <div class="event_confirm_details">
    <el-button @click="returnEventConfirm">返回</el-button>
    <div class="details_top">
      <el-row :gutter="20" class="details_top_row">
        <!-- 基本信息 -->
        <el-col :span="12">
          <systemPanel title="基本信息" class="base_info">
            <el-row>
              <el-col :span="12">
                <span>报警类型:</span>
                <span>{{baseInfo.alarmType | alarmTypeFilter}}</span>
              </el-col>
              <el-col :span="12">
                <span>所属排水户:</span>
                <span>{{baseInfo.pshName}}</span>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <span>报警点位名称:</span>
                <span>{{baseInfo.pointName}}</span>
              </el-col>
              <el-col :span="12">
                <span>排水户类型:</span>
                <span>{{baseInfo.pshType | houseHoldTypeFilter}}</span>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <span>位置:</span>
                <span>{{baseInfo.addr}}</span>
              </el-col>
              <el-col :span="12">
                <span>所属街道:</span>
                <span>{{baseInfo.street}}</span>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <span>报警状态:</span>
                <span>{{baseInfo.alarmStatus | alarmStatusFilter}}</span>
              </el-col>
              <el-col :span="12">
                <span>报警时间:</span>
                <span>{{baseInfo.testTime}}</span>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <span>报警内容:</span>
                <span>{{baseInfo.alarmInfo}}</span>
              </el-col>
            </el-row>
          </systemPanel>
        </el-col>
        <el-col :span="12">
          <systemPanel title="监测信息" class="monitor_info">
            <template v-if="checkNotNull(monitorFactorList)">
              <div class="update_time">更新时间: {{monitorUpdateTime}}</div>
              <!-- 监测因子 -->
              <ul class="monitor_factor">
                <li v-for="item in monitorFactorList" :key="item.factorCode" @click="factorChange(item)" :class="{active: activeFactor['factorCode'] == item.factorCode}">
                  {{item["factorName"]}}: {{item["factorValue"]}} {{item["factorUnit"]}}
                </li>
              </ul>
              <div class="monitor_factor_threshold">
                <span>阈值</span>
                <el-switch v-model="monitorFactorThreshold" active-color="#101F70" inactive-color="#101F70" @change="monitorFactorThresholdChange">
                </el-switch>
              </div>
              <div v-if="activeFactor['factorUnit']" class="factor_unit">
                单位: {{activeFactor["factorUnit"]}}
              </div>
              <!-- 图表 -->
              <div id="monitor_chart"></div>
            </template>
            <no-data v-else></no-data>
          </systemPanel>
        </el-col>
      </el-row>
    </div>
    <div class="details_bottom">
      <el-row :gutter="20" class="details_top_row">
        <el-col :span="12">
          <systemPanel title="设备信息">
            <div class="deviceInfo_table_content">
              <el-table class="deviceInfo_table" ref="deviceInfoTable" :data="deviceInfoTableData" height="100%">
                <el-table-column type="index" width="60" label="序号" align="center"></el-table-column>
                <el-table-column prop="alarmTime" min-width="180" label="报警时间" align="center"></el-table-column>
                <el-table-column prop="alarmInfo" :formatter="alarmInfoFormat" min-width="180" show-overflow-tooltip="" label="报警内容" align="center"></el-table-column>
                <el-table-column prop="dealState" width="120" label="处理状态" align="center"></el-table-column>
              </el-table>
            </div>
          </systemPanel>
        </el-col>
        <el-col :span="12">
          <systemPanel title="视频信息">
            <no-data></no-data>
          </systemPanel>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import {
  getdetailInfoBase,
  getdetailInfoMonitorHead,
  getPonitParaTrend,
  getDeviceStateOfToday
} from "@/api/drainageOperation";
import { awaitWrap, checkNotNull, alarmInfoFormat } from "@/lib";
import { async } from "q";

export default {
  data() {
    return {
      alarmId: "",
      baseInfo: {},
      monitorFactorList: [],
      monitorUpdateTime: "",
      monitorFactorThreshold: false,
      activeFactor: {},
      monitorChart: {},
      monitorOption: {
        color: ["#16FAD3", "#EA0013", "#EA0013"],
        tooltip: {
          trigger: "axis"
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: [],
          axisLabel: {
            color: "#fff",
            fontSize: 14,
            margin: 10
          },
          axisLine: {
            lineStyle: {
              color: "#054EA9"
            }
          },
          axisTick: {
            inside: true
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: "#4BDFFF",
              type: "dashed"
            }
          }
        },
        grid: {
          bottom: 15,
          left: 10,
          right: 10,
          top: 10,
          containLabel: true
        },
        yAxis: {
          name: "",
          type: "value",
          axisLabel: {
            color: "rgba(112, 197, 255, 0.61)",
            fontSize: 20,
            margin: 25
          },
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: "#112B89",
              width: 2
            }
          }
        },
        series: [
          {
            name: "监测值",
            data: [],
            type: "line",
            smooth: true,
            areaStyle: {
              // opacity: 0.8,
              color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: "rgba(0, 255, 192, 0.83)"
                },
                {
                  offset: 1,
                  color: "rgba(0, 10, 59, 0.33)"
                }
              ])
            }
          },
          {
            name: "阈值",
            data: [],
            type: "line",
            smooth: true
          },
          {
            name: "阈值",
            data: [],
            type: "line",
            smooth: true
          }
        ]
      },
      deviceInfoTableData: []
    };
  },
  methods: {
    alarmInfoFormat,
    // 判空
    checkNotNull(val) {
      return checkNotNull(val);
    },

    // 返回事件确认
    returnEventConfirm() {
      this.$router.go(-1);
    },

    // 因子改变
    factorChange(data) {
      this.activeFactor = data;
      this.getMonitorCharInfo();
    },

    //获取基本信息
    async getBaseInfo() {
      const _this = this;

      let detailInfo = (await awaitWrap(
        getdetailInfoBase({ alarmId: _this.alarmId })
      ))[1];

      if (checkNotNull(detailInfo) && checkNotNull(detailInfo["data"])) {
        _this.baseInfo = detailInfo["data"];
        _this.baseInfo.alarmInfo = alarmInfoFormat(_this.baseInfo);
      } else {
        _this.baseInfo = {};
      }
    },

    // 监测信息
    async getMonitorInfo() {
      const _this = this;

      // 监测因子 更新时间
      let headInfo = (await awaitWrap(
        getdetailInfoMonitorHead({ alarmId: _this.alarmId })
      ))[1];

      if (checkNotNull(headInfo) && checkNotNull(headInfo["data"])) {
        _this.monitorFactorList = headInfo["data"]["factorList"];
        _this.activeFactor = _this.monitorFactorList[0];
        _this.monitorUpdateTime = headInfo["data"]["updateTime"];
      }

      // 图表
      _this.getMonitorCharInfo();
      // 设备信息表格
      _this.deviceInfoTable();
    },

    // 监测信息图表
    async getMonitorCharInfo() {
      const _this = this;
      let paraTrendInfo = (await awaitWrap(
        getPonitParaTrend({
          alarmId: _this.alarmId,
          days: 1,
          factor: _this.activeFactor["factorCode"]
        })
      ))[1];

      if (checkNotNull(paraTrendInfo) && checkNotNull(paraTrendInfo["data"])) {
        paraTrendInfo = paraTrendInfo["data"] || {};
      } else {
        paraTrendInfo = {};
      }

      let xAxisData = paraTrendInfo["timeList"] || [];
      let seriesData = paraTrendInfo["valueList"] || [];

      _this.monitorOption.xAxis.data = xAxisData;
      _this.monitorOption.series[0].data = seriesData;

      _this.monitorFactorThresholdChange();
    },

    async deviceInfoTable() {
      const _this = this;
      let deviceInfo = (await awaitWrap(
        getDeviceStateOfToday({
          alarmId: _this.alarmId //_this.alarmId
        })
      ))[1];

      if (checkNotNull(deviceInfo) && checkNotNull(deviceInfo["data"])) {
        _this.deviceInfoTableData = deviceInfo["data"] || [];
      } else {
        _this.deviceInfoTableData = [];
      }
    },

    // 阈值
    monitorFactorThresholdChange() {
      const _this = this;
      let seriesData1 = [],
        seriesData2 = [];
      let factorThreshold = _this.activeFactor["factorThreshold"];
      let dateLen = _this.monitorOption.series[0].data.length;

      // 选中
      if (_this.monitorFactorThreshold) {
        if (_this.activeFactor["factorCode"] == "w01001") {
          seriesData1 = new Array(dateLen).fill(factorThreshold.slice(0, 1));
          seriesData2 = new Array(dateLen).fill(
            factorThreshold.slice(1, factorThreshold.length)
          );
        } else {
          seriesData1 = new Array(dateLen).fill(factorThreshold);
        }
      }

      _this.monitorOption.series[1].data = seriesData1;
      _this.monitorOption.series[2].data = seriesData2;
      _this.monitorChart.setOption(_this.monitorOption, true);
    },


    // 图表自适应
    resizeCharts() {
      const _this = this;
      _this.$nextTick(() => {
        _this.monitorChart.resize();
      });
    },

    // 表格滚动
    deviceInfoTableScroll() {
      // 拿到表格挂载后的真实DOM
      const table = this.$refs.deviceInfoTable;
      // 拿到表格中承载数据的div元素
      const divData = table.bodyWrapper;
      // 拿到元素后，对元素进行定时增加距离顶部距离，实现滚动效果(此配置为每100毫秒移动1像素)
      setInterval(() => {
        // 元素自增距离顶部1像素
        divData.scrollTop += 1;
        // 判断元素是否滚动到底部(可视高度+距离顶部=整个高度)
        if (divData.clientHeight + divData.scrollTop == divData.scrollHeight) {
          // 重置table距离顶部距离
          divData.scrollTop = 0;
        }
      }, 100);
    }
  },
  mounted() {
    const _this = this;

    if (checkNotNull(_this.$route.params)) {
      _this.alarmId = _this.$route.params.alarmId;
      _this.getBaseInfo();
      _this.getMonitorInfo().then(res => {
        // 初始化监测信息图表
        _this.$nextTick(() => {
          _this.monitorChart = _this.$echarts.init(
            document.getElementById("monitor_chart")
          );
          _this.monitorChart.setOption(_this.monitorOption);
          window.addEventListener("resize", _this.resizeCharts);
        });
      });
    } else {
      _this.$router.push({ name: "eventConfirm" });
    }

    // 表格滚动
    _this.deviceInfoTableScroll();
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.resizeCharts);
  }
};
</script>

<style lang="scss" scoped>
.event_confirm_details {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background-color: #101f70;
  z-index: 3;

  /deep/ .el-button {
    position: absolute;
    right: 0;
    bottom: calc(100% + 14px);
  }

  // 详情上部分
  .details_top {
    height: 45%;
    padding-bottom: 20px;
    box-sizing: border-box;

    .details_top_row {
      height: 100%;
      .el-col {
        height: 100%;
      }

      // 基本信息
      .base_info {
        font-size: 16px;

        .el-row {
          margin-top: 23px;

          .el-col {
            & > span {
              &:first-child {
                color: #96bef9;
                display: inline-block;
                vertical-align: middle;
                width: 180px;
                text-align: right;
                margin-right: 15px;
              }
            }
          }
        }
      }

      // 监测信息
      .monitor_info {
        padding: 0 40px;
        font-size: 14px;

        .monitor_info_content {
          width: 100%;
          height: 100%;
        }

        .update_time {
          color: #96bef9;
          float: right;
          margin-top: -10px;
        }

        // 因子
        .monitor_factor {
          width: 100%;
          display: flex;
          justify-content: center;

          li {
            padding: 6px 15px;
            text-align: center;
            margin: 10px 14px;
            border: 1px solid #1d47d0;
            border-radius: 4px;
            background: #101f70;
            cursor: pointer;
            box-shadow: 1px 0 10px 2px rgba(29, 71, 208, 0.5) inset;

            &.active {
              color: #96bef9;
            }
          }
        }

        // 阈值选择
        .monitor_factor_threshold {
          height: 32px;
          line-height: 32px;
          float: right;
          margin-top: -45px;

          > span {
            font-size: 16px;
          }
          .el-switch {
            margin-left: 15px;
          }
        }

        .factor_unit {
          float: left;
          margin-top: -30px;
        }

        // 图表
        #monitor_chart {
          height: calc(100% - 110px);
        }
      }
    }
  }

  // 详情下
  .details_bottom {
    @extend .details_top;
    height: 55%;

    // 设备信息
    .deviceInfo_table_content {
      height: calc(100% - 40px);
      padding: 15px 30px 20px;
      box-sizing: border-box;

      /deep/ .el-table {
        border: 0 !important;
      }
    }
  }
}
</style>
