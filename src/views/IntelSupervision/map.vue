<template>
  <div class="map">
    <div id="mapContainer"></div>
  </div>
</template>
<script>
import { getStreetsData } from "@/api/IntelSupervision";
import {
  getStreetLocation
} from "@/lib";
export default {
  data() {
    return {
      datas: [],
      city: "",
      jinniuData: "",
      streets: [],
      streetMap: [],
      curStreet: "",
      mapOption: {
        geo: [
          {
            bottom: "22%",
            left: "10%",
            right: "15%",
            top: "5%",
            map: "jinniu",
            label: {
              show: false,
              color: "#eee"
            },
            itemStyle: {
              color: "#2b4784"
            },
            tooltip: {
              show: false
            },
            select: {
              disabled: false
            },
            silent: true
          },
          {
            selectedMode: "single",
            bottom: "25%",
            left: "10%",
            right: "15%",
            top: "5%",
            map: "jinniu",
            // zlevel: 1,
            label: {
              show: false,
              color: "#eee",
              fontSize: 14
            },
            itemStyle: {
              color: "#fff",
              areaColor: "#18C3FF",
              borderWidth: "1",
              borderColor: "#2b4784"
              // shadowBlur: 5,
              // shadowOffsetX: -2,
              // shadowOffsetY: 2,
              // shadowColor:"#2b4784"
            },
            emphasis: {
              label: {
                color: "#fff",
                fontSize: 14
              },
              itemStyle: {
                areaColor: "#1b64d8"
              }
            },
            select: {
              disabled: true,
              label: {
                show: true,
                color: "#fff",
                fontSize: 14
              },
              itemStyle: {
                areaColor: "#1b64d8"
              }
            }
            // nameProperty :"XZQDM",
            // nameMap:{}
          }
        ],
        visualMap: [
          {
            show: false,
            seriesIndex:0,
            min: 0,
            max: 100,
            realtime: false,
            calculable: true,
            inRange: {
              color: ["#18C3FF", "#D3CB40", "#FF8C1B", "#D30717"]
            },
            textStyle: {
              color: "#fff"
            },
            right: 40,
            // bottom:-100,
            orient: "horizontal"
          },
          {
            show: false,
            seriesIndex:1,
            min: 0,
            max: 100,
            realtime: false,
            calculable: true,
            inRange: {
              color: ["#18C3FF", "#D3CB40", "#FF8C1B", "#D30717"]
            },
            textStyle: {
              color: "#fff"
            },
            right: 40,
            // bottom:-100,
            orient: "horizontal"
          },
        ],
        tooltip: {
          trigger: "item",
          show: true
        },
        series: [
          {
            name: "地图",
            type: "map",
            roam: false,
            // zoom: 1.2,
            geoIndex: 1,
            map: "jinniu",
            selectedMode: "single",
            showLegendSymbol: false,
            tooltip: {
              show: false
            },
            itemStyle: {
              backgroundColor: "#18C3FF",
              color: "#18C3FF"
              // //地图区域下的多边形图形样式
              // normal: {
              //   color: "#fff",
              //   borderWidth: 0.5,
              //   label: {
              //     show: true,
              //     textStyle: {
              //       color: "#fff",
              //     },
              //   },
              // },
            }

            // data: this.datas,
          }
        ]
      },
      mapStack: []
    };
  },
  props: {
    streetData: {
      type: Array,
      default: () => []
    },
    type: {
      type: String,
      default: () => ""
    },
    conCodeList: {},
    mapColorCardinality: {},
    mapColorCardinalityYs: {}
  },
  watch: {
    conCodeList: {
      handler(val) {
        const _this = this;
        // 控制按钮
        // 缩放地图
        _this.resizeCharts();

        // 取消下钻 返回金牛区
        if (val.indexOf("2") == -1) {
          clearTimeout(_this.timeFn);
          _this.mapStack = [];
          _this.city = _this.jinniuData = require("../../data/mapData/510106.json");
          _this.$echarts.registerMap("jinniu", _this.city);

          _this.mapChart.setOption(_this.mapOption);
        }

        // 取消关联
        if (val.indexOf("1") == -1) {
          _this.$emit("func", "金牛区", "");
        }
      }
    },
    streetData: {
      handler(newValue) {
        const _this = this;

        newValue.forEach(m => {
          m["name"] = m["areaName"];
          m["value"] = m["alramNum"];
        });

        _this.mapOption.geo[1]["label"]["formatter"] = _this.mapOption.geo[1][
          "select"
        ]["label"]["formatter"] = _this.mapOption.geo[1]["emphasis"]["label"][
          "formatter"
        ] = function(params) {
          let showArea =
            newValue.filter(m => m["areaName"] == params.name)[0] || {};
          return params.name + "(" + (showArea["alramNum"] || 0) + ")";
        };
        _this.renderChart();
      }
    }
  },
  methods: {
    async getStreetData() {
      const res = await getStreetsData();
      this.streetMap = res.data;
      // this.mapOption.geo[1]["nameMap"] = res.data
    },
    renderChart() {
      const _this = this;
      _this.mapOption.series[0]["data"] = _this.streetData;
      if (_this.type == "2") {
        let data = [];
        _this.streetData.map((t) => {
          if(t.alramNum1 !== 0){
            data.push({
              name:t.name,
              value:[...getStreetLocation(t.name),t.alramNum1]
            })
          }
        })
        _this.mapOption.series[1] = {
          // 水波纹
          type: "effectScatter",
          coordinateSystem: "geo",
          geoIndex: 1,
          data,
          showEffectOn: "render",
          tooltip: {
            trigger: "item",
            show: true,
            formatter: p => {
              let txtCon =
                "<div style='text-align:left'>" +
                p.name +
                ":<br />雨水管长度：" +
                p.value[2] +
                "</div>";
              return txtCon;
            }
          },
          // symbolOffset: [-10, 10], //偏移
          rippleEffect: {
            period: 10, // 动画时间，值越小速度越快
            scale: 2, // 波纹圆环最大限制，值越大波纹越大
            brushType: "fill" // 波纹绘制方式 stroke, fill
          },
          zlevel: 2
        };
        _this.mapOption.visualMap[1]["max"] =
        _this.mapColorCardinalityYs == 0 ? 100 : _this.mapColorCardinalityYs * 4;
      }
      console.log(_this.mapOption);
      _this.mapOption.visualMap[0]["max"] =
        _this.mapColorCardinality == 0 ? 100 : _this.mapColorCardinality * 4;
      _this.mapChart.setOption(_this.mapOption, true);

      _this.mapStack = [];
      _this.mapStack.push(this.city);
    },
    // 下钻
    cityDataUpdate() {
      const _this = this;
      _this.mapChart.on("click", params => {
        clearTimeout(_this.timeFn);
        if (_this.conCodeList.indexOf("2") == -1) {
          // 关联
          if (_this.conCodeList.indexOf("1") == -1) {
            _this.$emit("func", "金牛区", "");
          } else {
            for (let key in _this.streetMap) {
              if (_this.streetMap[key] === params.name) {
                // 关联
                _this.$emit("func", _this.streetMap[key], key);
              }
            }
          }
        } else {
          // 下钻
          _this.timeFn = setTimeout(() => {
            if (_this.mapStack.length == 1) {
              _this.city = _this.jinniuData;
            } else if (_this.mapStack.length == 2) {
              _this.city = _this.mapStack[_this.mapStack.length - 1];
            }

            var city1 = _this.city;
            for (let key in _this.streetMap) {
              if (_this.streetMap[key] === params.name) {
                _this.city = _this.changeCity(key);
                // 关联
                if (_this.conCodeList.indexOf("1") != -1) {
                  _this.$emit("func", _this.streetMap[key], key);
                } else {
                  _this.$emit("func", "金牛区", "");
                }
              }
            }

            if (_this.mapStack.length < 3) {
              _this.mapStack.push(_this.city);
            }

            _this.$echarts.registerMap("jinniu", _this.city);
            _this.mapChart.setOption(_this.mapOption, true);
          }, 250);
        }
      });

      // 双击事件
      // _this.mapChart.on("dblclick", () => {
      // });
    },
    changeCity(name) {
      //动态获取点击的城市数据
      return require("../../data/mapData/" + name + ".json");
    },
    resizeCharts() {
      const _this = this;
      _this.$nextTick(() => {
        _this.mapChart.resize();
      });
    }
  },
  created() {},
  mounted() {
    const _this = this;
    _this.$nextTick(function() {
      // 初始化地图
      _this.mapChart = _this.$echarts.init(
        document.getElementById("mapContainer")
      );
      window.addEventListener("resize", _this.resizeCharts);

      _this.city = _this.jinniuData = require("../../data/mapData/510106.json");
      _this.$echarts.registerMap("jinniu", _this.city);
      _this.mapChart.setOption(this.mapOption);
      _this.cityDataUpdate();
      _this.getStreetData();
    });
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.resizeCharts);
  }
};
</script>
<style lang="scss">
.map {
  width: 100%;
  height: 88%;
  background: url(/static/ManageSystem/img/ind_map_bg.png) no-repeat center
    bottom 20px;
  margin: 0 auto;
}
#mapContainer {
  height: 90%;
}
</style>
