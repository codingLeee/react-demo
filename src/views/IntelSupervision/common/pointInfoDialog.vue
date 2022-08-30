<template>
    <div class="pointInfo_dialog">
        <div class="pointInfo_title">{{pointBaseInfo["pointName"]}}</div>
        <div>排水户：{{pointBaseInfo["pshName"]}}</div>
        <div>位置：{{pointBaseInfo["pshAddr"]}}</div>
        <div>点位状态：{{
            pointBaseInfo["pointState"] 
        }}</div>
        <div>设备状态：{{
            pointBaseInfo["deviceState"]
        }}</div>
        <div v-for="item in pointBaseInfo['factorRecordList']" :key="item['factorName']">
            监测因子：{{item["factorName"] || "-"}} 
            监测值：<span style='color:'>{{item["factorValue"] || "-"}}</span> 
            阈值：{{item["factorName"] == "pH 值"
              ? (item["factorThreshold"]).toString().slice(0, 1) +
                "-" +
                (item["factorThreshold"]).toString().slice(1, (item["factorThreshold"]).toString().length)
              : item["factorThreshold"] || "--"}}
        </div>
        <ul v-if="pointProperties['deviceType'] == 'bz'">
            <li>液位：{{pointBaseInfo["testLevel"] || "-"}}m</li>
            <li>高液位阈值：{{pointBaseInfo["hlevelThreshold"] || "-"}}m</li>
            <li>低液位阈值：{{pointBaseInfo["llevelThreshold"] || "-"}}m</li>
            <li>管径：{{pointBaseInfo["calibre"] || "-"}}m</li>
        </ul>
        <ul>
            <li v-for="item in pointBaseInfo['deviceParamVoList']" :key="item['name']">
                {{item["name"]}}：{{item["value"] || "-"}}
            </li>
        </ul>
        <ul>
            <li v-for="item in pointBaseInfo['deviceParamVoList']" :key="item['switcher']">
                泵{{item['switcher']}}：{{
                    item["switcherFlag"] == 0 ? "开启"
                    : item["switcherFlag"] == 1 ? "关闭" : ""}}
            </li>
        </ul>
        <div v-if="pointProperties['deviceType'] == 'ys' || pointProperties['deviceType'] == 'ws'">
            <el-date-picker
                v-model="liquidLevelTrendTime"
                type="datetimerange"
                align="right"
                unlink-panels
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :picker-options="pickerOptions"
                @change="getLiquidLevelTrend"
                format="yyyy-MM-dd HH:mm:ss"
                value-format="yyyy-MM-dd HH:mm:ss"
            >
            </el-date-picker>
            <div id="liquidLevelTrendChart"></div>
        </div>
    </div>
</template>

<script>
import { getLatestCalInfo, getPonitParaTrend } from "@/api";
import { awaitWrap, checkNotNull } from "@/lib";
import { mapState } from "vuex";

export default {
  name: "pointInfoDialog",
  data() {
    return {
      pointBaseInfo: {},
      liquidLevelTrendChart: {},
      liquidLevelTrendOption: {
        xAxis: {
          type: "category",
          data: []
        },
        yAxis: {
          type: "value"
        },
        series: [
          {
            data: [],
            type: "line"
          }
        ]
      },
      liquidLevelTrendTime: [],
      pickerOptions: {
        shortcuts: [
          {
            text: "今天",
            onClick(picker) {
              const end = new Date();
              const start = new Date(
                new Date(new Date().toLocaleDateString()).getTime()
              );
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      }
    };
  },
  props: {
    pointProperties: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  computed: {
    ...mapState({
      dataStateOptions: state => state.IntelSupervison.dataStateOptions,
      equipStatusOptions: state => state.IntelSupervison.equipStatusOptions
    })
  },
  watch: {
    pointProperties: {
      immediate: true,
      deep: true,
      handler() {
        this.initPop();
      }
    }
  },
  methods: {
    async initPop() {
      const _this = this;
      let pointNewData =
        (await awaitWrap(
          getLatestCalInfo({
            pointCode: _this.pointProperties["pointCode"] || ""
          })
        ))[1] || {};

      if (checkNotNull(pointNewData) && checkNotNull(pointNewData["data"])) {
        _this.pointBaseInfo = { ...pointNewData["data"] };
      } else {
        _this.pointBaseInfo = {};
      }
      if (
        _this.pointProperties["deviceType"] == "ys" ||
        _this.pointProperties["deviceType"] == "ws"
      ) {
        _this.getLiquidLevelTrend();
      }
    },
    async getLiquidLevelTrend() {
      const _this = this;
      // 液位趋势变化分析(雨水井 污水井)

      let liquidLevelTrendData =
        (await awaitWrap(
          getPonitParaTrend({
            pointCode: _this.pointProperties["pointCode"] || "",
            factor: "w99691",
            startTime: _this.liquidLevelTrendTime[0],
            endTime: _this.liquidLevelTrendTime[1]
          })
        ))[1] || {};

      if (
        checkNotNull(liquidLevelTrendData) &&
        checkNotNull(liquidLevelTrendData["data"])
      ) {
        liquidLevelTrendData = liquidLevelTrendData["data"];
      } else {
        liquidLevelTrendData = {};
      }

      _this.$nextTick(() => {
        if (_this.liquidLevelTrendChart) {
          _this.liquidLevelTrendChart = _this.$echarts.init(
            document.getElementById("liquidLevelTrendChart")
          );
        }

        _this.liquidLevelTrendOption.series[0]["data"] =
          liquidLevelTrendData["valueList"] || [];
        _this.liquidLevelTrendOption.xAxis["data"] =
          liquidLevelTrendData["timeList"] || [];

        _this.liquidLevelTrendChart.setOption(
          _this.liquidLevelTrendOption,
          true
        );
      });
    },
    // 根据类型筛选名称
    getNameByType(data, type) {
      if (checkNotNull(data) && checkNotNull(type)) {
        let filterList = this[data].find(m => {
          return m["code"] == type;
        });
        return checkNotNull(filterList) ? filterList["name"] : "";
      }
    }
  },
  mounted() {
    const _this = this;
    _this.liquidLevelTrendTime = [
      _this.$moment(new Date(new Date(new Date().toLocaleDateString()).getTime())).format("YYYY-MM-DD HH:mm:ss"),
      _this.$moment(new Date()).format("YYYY-MM-DD HH:mm:ss")
    ];
  },
  beforeDestroy() {}
};
</script>


<style lang="scss" scoped>
.pointInfo_dialog {
}

#liquidLevelTrendChart {
  height: 200px;
}
</style>
