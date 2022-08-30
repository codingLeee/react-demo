<template>
    <div class="event_content_statistics">
      <el-select
        v-model="alarmType"
        placeholder="请选择"
        class="statistics_select"
        @change="renderEventContent"
      >
        <el-option
          v-for="item in alarmTypeOptions"
          :key="item.id"
          :label="item.name"
          :value="item.code"
        >
        </el-option>
      </el-select>
      <div id="eventContentStatistics"></div>
    </div>
</template>

<script>
import { getEventContent, getDataByType } from "@/api/drainageOperation";
import { awaitWrap, checkNotNull, chartFontSize } from "@/lib";

export default {
  name: "eventSourceStatistics",
  data() {
    return {
      alarmType: "1",
      eventContentChart: {},
      eventContentOption: {
        color: ["#6C63F0", "#3AACFF", "#43E469", "#FDBD5E",'#ef7a27'],
        legend: {
          show: true,
          bottom: "10",
          textStyle: {
            color: "rgba(255, 255, 255,1)",
            fontSize: chartFontSize(13)
          },
          itemHeight: 14,
          itemWidth: 14,
          orient: "vertical",
          left: "64%",
          top: "40%",
          itemGap: 10
        },
        tooltip: {},
        // title: [
        //   {
        //     text: "",
        //     top: "center",
        //     left: "35%",
        //     textStyle: {
        //       rich: {
        //         name: {
        //           fontSize: chartFontSize(14),
        //           fontWeight: "normal",
        //           color: "#fff"
        //         },
        //         val: {
        //           fontSize: chartFontSize(32),
        //           fontWeight: "bold",
        //           color: "#fff"
        //         }
        //       }
        //     }
        //   }
        // ],
        series: [
          {
            type: "pie",
            radius: ["45%", "70%"],
            center: ["40%", "50%"],
            label: {
              normal: {
                position: "inside",
                formatter: params => {
                  return params.percent + "%";
                },
                fontSize: chartFontSize(13)
              }
            },
            data: []
          }
        ]
      },
      alarmTypeOptions: []
    };
  },
  props: {
    formData: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  watch: {
    formData: {
      deep: true,
      // immediate: true,
      handler(val) {
        const _this = this;
        if (!checkNotNull(_this.eventContentChart)) {
          _this.getAlarmType();
          _this.$nextTick(() => {
            _this.eventContentChart = _this.$echarts.init(
              document.getElementById("eventContentStatistics")
            );
            window.addEventListener("resize", _this.resizeCharts);
          });
          _this.renderEventContent();
        }
      }
    }
  },
  methods: {
    async renderEventContent() {
      const _this = this;
      let eventContentData = (await awaitWrap(
        getEventContent({ ..._this.formData, alarmType: _this.alarmType })
      ))[1];

      if (
        checkNotNull(eventContentData) &&
        checkNotNull(eventContentData["data"])
      ) {
        eventContentData = eventContentData["data"] || [];
      } else {
        eventContentData = [];
      }

      let sumData = 0;
      eventContentData.forEach(m => {
        m["name"] = m["type"];
        m["value"] = m["num"];

        sumData += m["num"];
      });

      // _this.eventContentOption.title[0]["text"] = ['{name|总数量}\n','{val|'+sumData+'}'].join('');
      _this.eventContentOption.series[0]["data"] = eventContentData;
      _this.eventContentChart.setOption(_this.eventContentOption, true);
    },
    resizeCharts() {
      const _this = this;
      _this.$nextTick(() => {
        if (checkNotNull(_this.eventContentChart)) {
          _this.eventContentChart.resize();
        }
      });
    },
    async getAlarmType() {
      const res = await getDataByType({ type: "alarm_type" });
      this.alarmTypeOptions = res.data;
    }
  },
  mounted() {},
  beforeDestroy() {
    window.removeEventListener("resize", this.resizeCharts);
  }
};
</script>

<style lang="scss" scoped>
.event_content_statistics {
  height: calc(100% - 40px);

  #eventContentStatistics {
    height: 100%;
  }

  .statistics_select {
    position: absolute;
    right: 20px;
    top: 50px;
    border: 0;
    z-index: 1;

    /deep/ .el-input,
    /deep/ .el-input__inner {
      width: 120px !important;
    }
  }
}
</style>

