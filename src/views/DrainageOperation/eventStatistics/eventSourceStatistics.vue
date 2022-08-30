<template>
    <div class="event_source_statistics">
        <div v-show="showChart" id="eventSourceStatistics"></div>
        <no-data v-show="!showChart"></no-data>
    </div>
</template>

<script>
import { getEventSource } from "@/api/drainageOperation";
import { awaitWrap, checkNotNull, chartFontSize } from "@/lib";

export default {
  name: "eventSourceStatistics",
  data() {
    return {
      eventSourceChart: {},
      eventSourceOption: {
        color: ["#6C63F0", "#3AACFF", "#43E469", "#43E469", "#FDBD5E"],
        legend: {
          show: true,
          bottom: "8%",
          textStyle: {
            color: "rgba(255, 255, 255, 0.85)",
            fontSize: chartFontSize(12)
          },
          itemHeight: 10,
          itemWidth: 14,
          itemGap: 17
        },
        tooltip: {
          show: true
        },
        series: []
      },
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

        if (!checkNotNull(_this.eventSourceChart)) {
          _this.$nextTick(() => {
            _this.eventSourceChart = _this.$echarts.init(
              document.getElementById("eventSourceStatistics")
            );
            window.addEventListener("resize", _this.resizeCharts);
          });
        }
        _this.renderEventSource();
      }
    }
  },
  methods: {
    checkNotNull(val) {
      return checkNotNull(val);
    },
    async renderEventSource() {
      const _this = this;
      let legendData = [],
        seriesData = [],
        valueData = [],
        sumData = 0;
      let eventSourceData = (await awaitWrap(
        getEventSource(_this.formData)
      ))[1];

      if (
        checkNotNull(eventSourceData) &&
        checkNotNull(eventSourceData["data"])
      ) {
        eventSourceData = (eventSourceData["data"] || []).sort((m, n) => {
          return n.num - m.num;
        });

        legendData = eventSourceData.map(item => item.alarmType) || [];
        valueData = eventSourceData.map(item => item.num) || [];
        sumData = valueData.reduce((m, n) => {
          return m + n;
        });
      } else {
        eventSourceData = [];
      }

      _this.showChart = checkNotNull(eventSourceData) && sumData != 0;
      eventSourceData.forEach((m, i) => {
        m["name"] = m["alarmType"];
        m["value"] = m["num"];

        seriesData.push({
          name: "",
          type: "pie",
          clockWise: true,
          hoverAnimation: false,
          radius: [68 - i * 15 + "%", 58 - i * 15 + "%"],
          center: ["50%", "42%"],
          label: {
            show: false
          },
          itemStyle: {
            label: {
              show: false
            },
            labelLine: {
              show: false
            },
            borderWidth: 5
          },
          data: [
            {
              value: m["num"],
              name: m["alarmType"]
            },
            {
              value: sumData - m["num"],
              name: "",
              itemStyle: {
                color: "transparent"
              },
              tooltip: {
                show: false
              },
              hoverAnimation: false
            }
          ]
        });
      });

      _this.eventSourceOption.series = seriesData;
      _this.eventSourceOption.legend["data"] = legendData;
      _this.eventSourceChart.setOption(_this.eventSourceOption, true);
    },
    resizeCharts() {
      const _this = this;
      _this.$nextTick(() => {
        if (checkNotNull(_this.eventSourceChart)) {
          _this.eventSourceChart.resize();
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
.event_source_statistics {
  height: calc(100% - 40px);

  #eventSourceStatistics {
    height: 100%;
  }
}
</style>

