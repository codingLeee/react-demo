<template>
  <el-dialog
    width="45%"
    :visible.sync="visible"
    v-if="visible"
    :class="deviceType == 'ws' ? 'ws-dialog' : 'ys-dialog'"
    :destroy-on-close="true"
    :title="deviceType == 'ws' ? '污水井' : '雨水井'"
    v-dialogDrag
    @close="close"
  >
    <div class="handle" @click="handle()">立即处理</div>
    <div class="bigScreen-dialog">
      <div class="bigScreen-dialog-info">
        <div>
          <div class="bigScreen-dialog-info-head">
            <div>基本信息</div>
            <div></div>
          </div>
          <div class="bigScreen-dialog-info-base">
            <div>排水户</div>
            <div>{{ latestCalInfo.pshName }}</div>
          </div>
          <div class="bigScreen-dialog-info-base">
            <div>位置</div>
            <div>{{ latestCalInfo.pshAddr }}</div>
          </div>
          <div class="bigScreen-dialog-info-head">
            <div>设备情况</div>
            <div></div>
          </div>
          <div class="bigScreen-dialog-info-base">
            <div>设备状态</div>
            <div :style="{ color: getStateColor(latestCalInfo.deviceState) }">
              {{ deviceStateFormatter(latestCalInfo.deviceState) }}
            </div>
          </div>
        </div>
        <div>
          <div class="bigScreen-dialog-info-head">
            <div>实时监测信息</div>
            <div></div>
          </div>
          <div class="bigScreen-dialog-info-base">
            <div>监测时间</div>
            <div>{{ latestCalInfo.testTime }}</div>
          </div>
          <div class="bigScreen-dialog-info-base">
            <div>点位状态</div>
            <div :style="{ color: getStateColor(latestCalInfo.pointState) }">
              {{ dataStateFormatter(latestCalInfo.pointState) }}
            </div>
          </div>
          <div class="bigScreen-dialog-info-base">
            <div>液位</div>
            <div>{{ latestCalInfo.testLevel }}m</div>
          </div>
          <template v-if="deviceType == 'ys'">
            <div
              class="bigScreen-dialog-info-base"
              v-for="(t, i) in latestCalInfo.factorRecordList"
              :key="i"
            >
              <div>{{ t.factorName }}</div>
              <div>监测值:{{ t.factorValue }}阈值:{{ getFactorRes(t) }}</div>
            </div>
          </template>
          <!-- <div class="bigScreen-dialog-info-base">
            <div>电导率</div>
            <div>监测指:{{latestCalInfo.testLevel}}阈值:{{latestCalInfo.factorThreshold}}</div>
          </div> -->
          <div class="bigScreen-dialog-info-base">
            <div>管径</div>
            <div>{{ latestCalInfo.calibre }}m</div>
          </div>
          <div class="bigScreen-dialog-info-des">
            高液位阈值({{ latestCalInfo.hlevelThreshold }})m,低液位阈值({{
              latestCalInfo.llevelThreshold
            }})m
          </div>
        </div>
      </div>
      <div class="bigScreen-dialog-level">
        <div class="bigScreen-dialog-level-head">液位趋势变化分析</div>
        <div class="bigScreen-dialog-level-filter">
          <div>
            <!-- <el-date-picker
                v-model="dateValue"
                type="datetime"
                size="mini"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd"
            >
            </el-date-picker> -->
            <el-date-picker
              v-model="dateValue"
              @change="dateChange"
              type="datetimerange"
              size="mini"
              append-to-body
              range-separator="至"
              start-placeholder="开始日期"
              value-format="yyyy-MM-dd HH:mm:ss"
              end-placeholder="结束日期"
            >
            </el-date-picker>
          </div>
          <div class="level-tab">
            <div
              :class="t.value == activeTab ? 'active' : ''"
              v-for="(t, i) in tabData"
              :key="i"
              @click="clickTab(t.value)"
            >
              {{ t.name }}
            </div>
          </div>
        </div>
        <div class="bigScreen-dialog-chart">
          <more-linechart :id="'more-line1'" :data="chartTrendData">
          </more-linechart>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import { awaitWrap, checkNotNull } from "@/lib";
import { mapState } from "vuex";
import moreLinechart from "./../echartComponent/moreLinechart.vue";
import { getLatestCalInfo, getPonitParaNoUnit, getPonitParaTrend } from "@/api";
export default {
  name: "pointInfoDialog",
  components: {
    moreLinechart,
  },
  data() {
    return {
      dateValue: [],
      deviceFaultStaData: {
        xData: [],
        yData: [],
      },
      visible: false,
      tabData: [
        {
          name: "今日",
          value: 1,
        },
        {
          name: "7天",
          value: 7,
        },
        {
          name: "30天",
          value: 30,
        },
      ],
      activeTab: 7,
      latestCalInfo: {},
      trendData: { xData: [], yData: [] },
      chartTrendData: { xData: [], yData: [] },
    };
  },
  props: {
    pointCode: {
      type: String,
      default() {
        return "";
      },
    },
    show: {
      type: Boolean,
      default() {
        return false;
      },
    },
    deviceType: {
      type: String,
      default() {
        return "ws";
      },
    },
  },
  computed: {
    ...mapState({
      dataStateOptions: (state) => state.IntelSupervison.dataStateOptions,
      equipStatusOptions: (state) => state.IntelSupervison.equipStatusOptions,
    }),
  },
  watch: {
    pointCode: {
      immediate: true,
      handler() {
        if (this.pointCode) {
          this.refresInfo();
          this.getPonit();
        }
      },
    },
    show: {
      immediate: true,
      handler() {
        this.visible = this.show;
      },
    },
  },
  methods: {
    handle() {
      this.$router.push({ path: '/drainageOperation/eventConfirm' });
    },
    close(e) {
      this.$emit("close");
    },
    clickTab(v) {
      this.activeTab = v;
      this.getPonit();
      this.dateValue = [];
    },
    dateChange(e) {
      console.log(e);
      this.activeTab = "";
      this.getPonit();
    },
    dataStateFormatter(dataState) {
      //点位状态
      switch (parseInt(dataState)) {
        case 0:
          return "正常";
        case 1:
          return "预警";
        case 2:
          return "超标";
        case 3:
          return "异常";
      }
    },
    getStateColor(state) {
      //故障状态
      switch (parseInt(state)) {
        case 0:
          return "#06b2f1";
        case 1:
          return "#FF0000";
        case 2:
          return "#e6a23c";
        case 3:
          return "#e6a23c";
      }
    },
    //设备状态
    deviceStateFormatter(state) {
      switch (parseInt(state)) {
        case 0:
          return "正常";
        case 1:
          return "故障";
        case 2:
          return "掉线";
      }
    },
    getFactorRes(t) {
      let m = t.factorName.toLowerCase();
      if (m.includes("ph")) {
        let str = t.factorThreshold.toString();
        return `${str.substring(0, 1)}-${str.substring(1, str.length)}`;
      } else {
        return t.factorThreshold;
      }
    },
    async refresInfo() {
      let param = {
        pointCode: this.pointCode,
      };
      //基础信息数据获取
      let latestCalInfo = (await awaitWrap(getLatestCalInfo(param)))[1] || {};
      if (checkNotNull(latestCalInfo) && checkNotNull(latestCalInfo["data"])) {
        latestCalInfo = latestCalInfo["data"];
      } else {
        latestCalInfo = [];
      }
      this.latestCalInfo = latestCalInfo;
    },

    // 因子获取
    async getPonit() {
      let param = {
        pointCode: this.pointCode,
      };
      //因子数据获取
      let PonitPara = (await awaitWrap(getPonitParaNoUnit(param)))[1] || {};
      if (checkNotNull(PonitPara) && checkNotNull(PonitPara["data"])) {
        PonitPara = PonitPara["data"];
      } else {
        PonitPara = [];
      }
      this.trendData = { xData: [], yData: [] };
      for (let i = 0; i < PonitPara.length; i++) {
        this.getTrend(PonitPara[i], i + 1, PonitPara.length);
      }
    },

    // 趋势获取
    async getTrend(data, start, end) {
      let param = {
        days: this.activeTab,
        pointCode: this.pointCode,
        startTime: this.dateValue ? this.dateValue[0] : "",
        endTime: this.dateValue ? this.dateValue[1] : "",
        factor: data.key,
      };
      //因子数据获取
      let m = (await awaitWrap(getPonitParaTrend(param)))[1] || {};
      if (checkNotNull(m) && checkNotNull(m["data"])) {
        m = m["data"];
      } else {
        m = [];
      }
      this.trendData.xData = m.timeList;
      this.trendData.yData.push({
        name: data.name,
        data: m.valueList,
      });
      if (start == end) {
        this.chartTrendData = this.trendData;
      }
    },
  },
  created() {
  },
  mounted() {},
  beforeDestroy() {},
};
</script>


<style lang="scss" scoped>
/deep/ .el-dialog {
  background-image: url(./../../../../static/BigScreen/img/monitor_map_bac.png);
  background-repeat: repeat;
  background-position: center center;
  background-size: 100% 100%;
  background-color: transparent !important;
  border: none !important;
  color: #fff;
  .el-dialog__header {
    background: none;
    margin-top: 30px;
    float: left;
    overflow: hidden;
    padding-left: 20px;
    width: 100%;
    margin-bottom: 0;
    padding-bottom: 0;
    .el-dialog__title {
      margin-left: 10px;
      font-size: 22px;
      font-family: Microsoft YaHei;
      font-weight: bold;
      color: #ffffff;
      height: 36px;
      line-height: 36px;
      background: linear-gradient(0deg, #76c0ff 0%, #ffffff 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      
    }
    .el-dialog__headerbtn{
      top: 50px;
    }
    .el-dialog__close {
      color: #76c0ff;
    }
  }
  .handle {
    top: -20px;
    position: absolute;
    right:80px;
    top:50px;
    color:#06b2f1;
    cursor: pointer;
  }
}
.bigScreen-dialog {
  padding: 0 20px;
}
.bigScreen-dialog-info {
  overflow: hidden;
  color: rgba(255, 255, 255, 0.9);
  > div {
    width: 45%;
    float: left;
  }
  > div:nth-child(1) {
    margin-right: 10%;
  }
  .bigScreen-dialog-info-head {
    overflow: hidden;
    margin-bottom: 10px;
    > div:nth-child(1) {
      float: left;
      width: 120px;
      font-size: 20px;
    }
    > div:nth-child(2) {
      float: right;
      width: calc(100% - 120px);
      height: 20px;
      margin-top: 5px;
      background-image: url(./../../../../static/BigScreen/img/big_screen_dialog_head_bac.png);
      background-repeat: repeat;
      background-position: center center;
      background-size: 100% 100%;
    }
  }
  .bigScreen-dialog-info-base {
    overflow: hidden;
    height: 26px;
    position: relative;
    margin-bottom: 10px;

    > div:nth-child(1) {
      float: left;
      width: 120px;
      height: 100%;
      color: rgba(255, 255, 255, 0.7);
      margin-left: 10px;
    }
    > div:nth-child(2) {
      float: right;
      color: #06b2f1;
      margin-right: 10px;
    }
    ::before {
      width: 100%;
      height: 100%;
      content: "";
      /* 一定要加定位，这样z-index才起作用 */
      position: absolute;
      top: 0;
      left: 0;
      z-index: -1;
      opacity: 0.1;
      border-radius: 12px;
      background: #094878;
    }
  }
}
.level-tab {
  overflow: hidden;
  line-height: 26px;
  text-align: center;
  margin-left: 10px;
  > div {
    float: left;
    margin-right: 10px;
    width: 80px;
    border-radius: 5px;
    background: rgba(31, 158, 204, 0.22);
    border: 1px solid #2099c5;
    color: #5bd3ff;
  }
  > div:nth-child(3) {
    margin-right: 0px;
  }
  .active {
    color: #fff;
  }
  > div:hover {
    color: #fff;
    cursor: pointer;
  }
}
.bigScreen-dialog-level-filter {
  overflow: hidden;
  float: right;
  > div {
    float: left;
  }
  .el-input__inner {
    background: rgba(31,158,204,0.22) !important;
    border: 1px solid #2099c5 !important;
  }
}
/deep/ .el-input__inner .el-input__icon{
  color:#fff !important;
}
.bigScreen-dialog-level-head {
  font-size: 20px;
  color: rgba(255, 255, 255, 0.9);
}
/deep/ .el-input__inner {
  width: 100% !important;
}
/deep/ .el-date-editor {
  width: 300px !important;
}
/deep/ .el-date-editor .el-date-range-picker__editor {
  width: 120px !important;
}
.bigScreen-dialog-chart {
  height: 260px;
  width: 100%;
  margin-top: 30px;
}

</style>
