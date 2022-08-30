<template>
    <div class="street_event_statistics">
        <div v-show="showChart" id="streetEventStatistics"></div>
        <no-data v-show="!showChart"></no-data>
    </div>
</template>

<script>
import { getEventSub } from "@/api/drainageOperation";
import { getStreetsData } from "@/api/IntelSupervision";
import { awaitWrap, checkNotNull, chartFontSize } from "@/lib";

export default {
  name: "streetEventStatistics",
  data() {
    return {
      streetEventChart: {},
      streetEventOption: {
        color: ["#6C63F0", "#3AACFF", "#EDC058", "#FB6D46"],
        grid: {
          containLabel: true,
          top: "15%",
          left: "8%",
          bottom: "17%",
          right: "8%"
        },
        tooltip: {
          trigger: "axis"
        },
        dataZoom: [
          {
            type: "inside"
          }
        ],
        legend: {
          show: true,
          bottom: "4%",
          textStyle: {
            color: "rgba(255, 255, 255, 0.85)",
            fontSize: chartFontSize(12)
          },
          itemHeight: 10,
          itemWidth: 14,
          itemGap: 17,
          data: []
        },
        xAxis: {
          type: "category",
          data: [],
          axisLine: {
            lineStyle: {
              color: "#fff"
            }
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            color: "rgba(255, 255, 255, 0.85)",
            fontSize: chartFontSize(14),
            margin: 10
          },
          splitLine: {
            show: false
          }
        },
        yAxis: {
          type: "value",
          axisLine: {
            show: false
          },
          axisLabel: {
            textStyle: {
              color: "#ABE0EF",
              fontSize: chartFontSize(14)
            }
          },
          axisTick: {
            show: false
          },
          splitLine: {
            lineStyle: {
              color: "rgba(255,255,255, .2)",
              type: "dashed"
            }
          }
        },
        series: []
      },
      streetsData: {},
      showChart: true
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

        if (!checkNotNull(_this.streetEventChart)) {
          _this.getStreetData();
          _this.$nextTick(() => {
            _this.streetEventChart = _this.$echarts.init(
              document.getElementById("streetEventStatistics")
            );
            window.addEventListener("resize", _this.resizeCharts);
          });
        }
        _this.renderStreetEventSource();
      }
    }
  },
  methods: {
    async getStreetData() {
      const res = await getStreetsData();
      this.streetsData = res.data;
    },
    async renderStreetEventSource() {
      const _this = this;
      let xAxisData = [],
        seriesData = [],
        series = [],
        alarmList = [],
        legendData = [];
      let streetEventData = (await awaitWrap(getEventSub(_this.formData)))[1];

      if (
        checkNotNull(streetEventData) &&
        checkNotNull(streetEventData["data"])
      ) {
        streetEventData = streetEventData["data"] || [];
        if (checkNotNull(streetEventData)) {
          alarmList = streetEventData[0]["type"];
        }
      }

      let alarmData = [];
      alarmList.forEach((n, j) => {
        seriesData = [];
        streetEventData.forEach((m, i) => {
          alarmData =
            m["type"].filter(w => w["alarmType"] == n["alarmType"]) || [];
          seriesData.push(checkNotNull(alarmData) ? alarmData[0]["num"] : null);
          if (j == 0) {
            xAxisData.push(_this.streetsData[m["subdistrict"]]);
          }
        });

        legendData.push(n["alarmType"]);
        series.push({
          name: n["alarmType"],
          data: seriesData,
          type: "bar",
          barWidth: chartFontSize(24),
          stack: "1"
        });
      });

      _this.showChart =
        checkNotNull(alarmList) ||
        checkNotNull(legendData) ||
        checkNotNull(xAxisData);

      _this.streetEventOption.legend["data"] = legendData;
      _this.streetEventOption.xAxis["data"] = xAxisData;
      _this.streetEventOption.series = series;
      _this.streetEventChart.setOption(_this.streetEventOption, true);
    },
    resizeCharts() {
      const _this = this;
      _this.$nextTick(() => {
        if (checkNotNull(_this.streetEventChart)) {
          _this.streetEventChart.resize();
        }
      });
    }
  },
  mounted() {},
  beforeDestroy() {
    window.removeEventListener("resize", this.resizeCharts);
  }
};
</script>

<style lang="scss" scoped>
.street_event_statistics {
  height: calc(100% - 40px);
  #streetEventStatistics {
    height: 100%;
  }
}
</style>

