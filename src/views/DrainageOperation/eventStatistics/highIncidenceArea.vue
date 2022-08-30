<template>
    <div class="high_incidence_area" id="highIncidenceArea">
    </div>
</template>
<script>
import { getEventHigh } from "@/api/drainageOperation";
import { awaitWrap, checkNotNull, chartFontSize } from "@/lib";

export default {
  name: "highIncidenceArea",
  data() {
    return {
      eventHighChart: {},
      eventHighOption: {
        grid: {
          left: "5%",
          right: "5%",
          top: "5%",
          bottom: "5%"
        },
        xAxis: {
          show: false
        },
        yAxis: {
          show: false
        },
        visualMap: {
          show: false,
          //   min: 0,
          //   max: 40000,
          pieces: [],
          inRange: {
            color: ["#50a3ba", "#eac736", "#d94e5d"]
          }
        },

        geo: {
          // aspectScale: 0.75, 长宽比
          silent: true,
          zoom: 1.1,
          map: "jinniu",
          itemStyle: {
            borderWidth: 4,
            borderColor: "#0A5AAF",
            shadowColor: "rgba(68, 118, 247, 0.5)",
            shadowOffsetX: -2,
            shadowOffsetY: 2,
            shadowBlur: 10,
          }
        },

        series: [
          {
            type: "map",
            map: "jinniu",
            zoom: 1.1,
            label: {
              show: false
            },
            silent: true,
            roam: false,
            itemStyle: {
              normal: {
                areaColor: "#0D277B",
                borderWidth: 1,
                borderColor: "#0A5AAF"
              }
            }
          },
          {
            name: "热图",
            type: "heatmap",
            coordinateSystem: "geo",
            data: []
          }
        ]
      }
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

        if (!checkNotNull(_this.eventHighChart)) {
          _this.$nextTick(() => {
            _this.eventHighChart = _this.$echarts.init(
              document.getElementById("highIncidenceArea")
            );

            let jinniuData = require("../../../data/mapData/510106.json");
            _this.$echarts.registerMap("jinniu", jinniuData);
            window.addEventListener("resize", _this.resizeCharts);
          });
        }

        _this.renderEventHigh();
      }
    }
  },
  methods: {
    async renderEventHigh() {
      const _this = this;
      let eventHighData = (await awaitWrap(getEventHigh(_this.formData)))[1];

      if (checkNotNull(eventHighData) && checkNotNull(eventHighData["data"])) {
        eventHighData = eventHighData["data"] || [];
      } else {
        eventHighData = [];
      }

      let maxVal = -Infinity,
        minVal = Infinity;
      eventHighData.forEach((m, i) => {
        m["name"] = m["pointName"];
        m["value"] = [m["longitude"], m["latitude"], m["num"]];

        maxVal = Math.max(maxVal, m["num"]);
        minVal = Math.min(minVal, m["num"]);
      });

      let baseVal = Math.ceil((maxVal - minVal) / 6);
      _this.eventHighOption.visualMap.pieces = [
        // {
        //   min: maxVal
        // },
        {
          min: minVal + baseVal * 5
          // max: maxVal
        },
        {
          min: minVal + baseVal * 4,
          max: minVal + baseVal * 5
        },
        {
          min: minVal + baseVal * 3,
          max: minVal + baseVal * 4
        },
        {
          min: minVal + baseVal * 2,
          max: minVal + baseVal * 3
        },
        {
          min: minVal + baseVal,
          max: minVal + baseVal * 2
        },
        {
          min: minVal,
          max: minVal + baseVal
        },
        {
          max: minVal
        }
      ];
      _this.eventHighOption.series[1]["data"] = eventHighData;
      _this.eventHighChart.setOption(_this.eventHighOption, true);
    },
    resizeCharts() {
      const _this = this;
      _this.$nextTick(() => {
        if (checkNotNull(_this.eventHighChart)) {
          _this.eventHighChart.resize();
        }
      });
    },
    mounted() {},
    beforeDestroy() {
      window.removeEventListener("resize", this.resizeCharts);
    }
  }
};
</script>

<style lang="scss" scoped>
.high_incidence_area {
  height: calc(100% - 40px);
}
</style>

