<template>
  <div id="bigScreenMap">
    <!-- 头部 -->
    <div class="top_content">
      <div class="bigScreen_header">
        <h2>金牛区智慧排水一张图</h2>
        <div class="bigScreen_header_tips">
          <span>{{currDate}}</span>
          <span class="split_line"></span>
          <span>成都</span>
          <span class="split_line"></span>
          <span class="alarm_tips"></span>
          <span class="system_management" @click="returnHome"></span>
        </div>
      </div>
    </div>
    <!-- 左侧 -->
    <div class="left_content_bg"></div>
    <!--  @mouseover="stopToggle" @mouseleave="startToggle" -->
    <div :class="['left_content', {'showB' : toggleFlag, 'showA' : !toggleFlag}]" @mouseover="stopToggle" @mouseleave="startToggle">
      <!-- 基本情况一览表 -->
      <BasicInfo></BasicInfo>
      <!-- 管道情况统计 -->
      <PipelineStatistics></PipelineStatistics>
      <!-- 当前时刻告警统计 -->
      <CurrentAlarmStatistics></CurrentAlarmStatistics>
      <!-- 雨污泵站基本信息 -->
      <RainSewagePumpingStationBaseInfo></RainSewagePumpingStationBaseInfo>
      <!-- 点位设备状态 -->
      <PointEquipmentStatus></PointEquipmentStatus>
    </div>
    <!-- 右侧 -->
    <div class="right_content_bg"></div>
     <!-- @mouseover="stopToggle" @mouseleave="startToggle" -->
    <div :class="['right_content', {'showB' : toggleFlag, 'showA' : !toggleFlag}]" @mouseover="stopToggle" @mouseleave="startToggle">
      <!-- 污水井冒溢分析 -->
      <SewageWellOverflow></SewageWellOverflow>
      <!-- 雨污混排溯源分析(重点排水户) -->
      <RainSewageSource></RainSewageSource>
      <!-- 冒溢排水户统计排名(当月） -->
      <OverflowDrainageRank></OverflowDrainageRank>
      <!-- 沿河排口统计分析 -->
      <OutletAnalysis></OutletAnalysis>
      <!-- 排水运维调度分析（当月） -->
      <DrainageOperationAnalysis></DrainageOperationAnalysis>
      <!-- 运维事件来源 -->
      <OperationEventSource></OperationEventSource>
    </div>
    <!-- 中间 -->
    <!-- 右下角小菜单 -->
    <div :class="['map_menus_content',{'map_menus_hide': !mapMenusShow,'map_menus_show': mapMenusShow}]">
      <div class="map_menus_button" @click="mapMenusShow = !mapMenusShow"></div>
      <!-- 上面菜单 -->
      <div class="menus_top_content">
        <ul class="menus_top">
          <li v-for="item in 5" :key="item" @click="getCurrMapMenu(item)">
            <el-tooltip popper-class="map_menus_tooltip" class="item" effect="dark" :content="`${item == 2 ? '排口' : item == 3 ? '泵站' : item == 4 ? '污水井' : item == 5 ? '雨水井' : ''}`" placement="left">
              <div :class="['menus_div',{'map_menu_active': currActiveMenus.indexOf(item) != -1}]">
                <p class="map_menu_img_content">
                  <img :src="'static/BigScreen/img/map_menu_'+item+'_0_icon.png'" alt="">
                </p>
              </div>
            </el-tooltip>
          </li>
        </ul>
      </div>
      <!-- 下面菜单 -->
      <div class="menus_bottom_content">
        <ul class="menus_bottom">
          <li v-for="item in 3" :key="item" @click="getCurrMapBottomMenu(item)">
            <el-tooltip popper-class="map_menus_tooltip" class="item" effect="dark" :content="`${item == 1 ? '视频' : item == 2 ? '运维人员' : item == 3 ? '标注' : ''}`" placement="top">
              <div :class="['menus_div',{'map_menu_active': currActiveBottomMenus.indexOf(item) != -1}]">
                <p class="map_menu_img_content">
                  <img :src="'static/BigScreen/img/map_menu_'+(5+item)+'_0_icon.png'" alt="">
                </p>
              </div>
            </el-tooltip>
          </li>
        </ul>
      </div>
    </div>
    <!-- 左下角按钮 -->
    <ul class="map_menus_content_left">
      <li @click="toggleSubdistrictSelect">
        <el-tooltip popper-class="map_menus_tooltip" class="item" effect="dark" content="街道定位" placement="right">
          <div class="menus_div">
            <p class="map_menu_img_content">
              <img :src="'static/BigScreen/img/map_menu_location_0_icon.png'" alt="">
            </p>
          </div>
        </el-tooltip>
        <el-select @change="subdistrictChange" filterable v-if="showSubdistrictSelect" v-model="subdistrict" placeholder="请选择街道">
          <el-option
            v-for="item in subdistrictData"
            :key="item.code"
            :label="item.name"
            :value="item.code">
          </el-option>
        </el-select>
      </li>
      <li @click="toggleDrainageHouseholdSelect">
        <el-tooltip popper-class="map_menus_tooltip" class="item" effect="dark" content="排水户定位" placement="right">
          <div class="menus_div">
            <p class="map_menu_img_content">
              <img :src="'static/BigScreen/img/map_menu_search_0_icon.png'" alt="">
            </p>
          </div>
        </el-tooltip>
        <el-select @change="drainageHouseholdChange" v-if="showDrainageHouseholdSelect" filterable v-model="drainageHousehold" placeholder="请选择排水户">
          <el-option
            v-for="item in drainageHouseholdData"
            :key="item.pshCode"
            :label="item.pshName"
            :value="item.pshCode">
          </el-option>
        </el-select>
      </li>
    </ul>
    <!-- 播放动画按钮 -->
    <ul class="map_animation">
      <el-tooltip popper-class="map_menus_tooltip" class="item" effect="dark" content="地图旋转" placement="top">
        <li @click="mapRotateToggle(1)">
        </li>
      </el-tooltip>
      <el-tooltip popper-class="map_menus_tooltip" class="item" effect="dark" content="暂停地图旋转" placement="top">
        <li @click="mapRotateToggle(0)">
        </li>
      </el-tooltip>
    </ul>
    <wsYsDialog :show="dialogDetailsVisible" :pointCode="pointCode" :deviceType="dialogDeviceType" @close="dialogDetailsVisible = false"/>
    <vedioDialog :show="dialogVedioVisible" :ipcId="ipcId" @close="dialogVedioVisible = false"/>
  </div>
</template>
 
<script>
import jinniubuildinggeojson from "@/data/jinniubuilding.geo.json";
import pipelineJson from "@/data/Pipeline.geo";

import BasicInfo from "./BasicInfo";
import PipelineStatistics from "./PipelineStatistics";
import CurrentAlarmStatistics from "./CurrentAlarmStatistics";
import SewageWellOverflow from "./SewageWellOverflow";
import RainSewageSource from "./RainSewageSource";
import OverflowDrainageRank from "./OverflowDrainageRank";
import RainSewagePumpingStationBaseInfo from "./RainSewagePumpingStationBaseInfo";
import PointEquipmentStatus from "./PointEquipmentStatus";
import OutletAnalysis from "./OutletAnalysis";
import DrainageOperationAnalysis from "./DrainageOperationAnalysis";
import OperationEventSource from "./OperationEventSource";
import { lineString, lineChunk } from "@turf/turf";
import wsYsDialog from "./../IntelSupervision/common/wsYsDialog.vue";
import vedioDialog from "./../IntelSupervision/common/vedioDialog.vue";
import {
  getAllPoint,
  getLatestCalInfo,
  getDataByType,
  getAllSubdistrict,
  getDrainageHousehold,
  getAllOperationPerson
} from "@/api";
import { awaitWrap, checkNotNull, chartFontSize } from "@/lib";
import ColorUitl from "@/lib/colorUtil";

export default {
  name: "MonitorMap",
  components: {
    BasicInfo,
    PipelineStatistics,
    CurrentAlarmStatistics,
    SewageWellOverflow,
    RainSewageSource,
    OverflowDrainageRank,
    RainSewagePumpingStationBaseInfo,
    PointEquipmentStatus,
    OutletAnalysis,
    DrainageOperationAnalysis,
    OperationEventSource,
    wsYsDialog,
    vedioDialog
  },
  data() {
    return {
      pointPopup: null,
      currDate: "",
      updateDateTimer: null,
      rotateMapTimer: null,
      mapMenusShow: true,
      currHoverMenu: 0,
      currActiveMenus: [1],
      currActiveBottomMenus: [],
      toggleFlag: false,
      pointData: [],
      dataStateData: [],
      deviceStateData: [],
      deviceTypeData: [],
      pointStateData: [],
      menuList: [
        {
          name: "全部",
          code: ""
        },
        {
          name: "排口",
          code: "pk"
        },
        {
          name: "泵站",
          code: "bz"
        },
        {
          name: "污水",
          code: "ws"
        },
        {
          name: "雨水",
          code: "ys"
        },
        {
          name: "视频",
          code: "sp"
        }
      ],
      subdistrictData: [],
      subdistrict: "",
      showSubdistrictSelect: false,
      drainageHouseholdData: [],
      drainageHousehold: "",
      showDrainageHouseholdSelect: false,
      alarmCanvasSize: Math.ceil(chartFontSize(148)),
      alarmCanvasRadius: Math.ceil(chartFontSize(20)),
      temporaryPointPopup: null,
      operationPersonData: [],
      dialogDetailsVisible: false,
      dialogVedioVisible:false,
      pointCode:'',
      dialogDeviceType:'ws'
    };
  },
  created() {},
  computed: {},
  methods: {
    // 显示隐藏街道选择框
    toggleSubdistrictSelect() {
      this.showSubdistrictSelect = !this.showSubdistrictSelect;

      // 清空单独排水户的选择
      this.drainageHousehold = "";
      this.showDrainageHouseholdSelect = false;

      // todo
      // 地图上选择的排水户取消选择状态
    },
    toggleDrainageHouseholdSelect() {
      this.showDrainageHouseholdSelect = !this.showDrainageHouseholdSelect;

      this.showSubdistrictSelect = false;
      this.subdistrict = "";
    },
    // 选择街道
    async subdistrictChange() {
      const _this = this;
      let currSubdistrict = Number(_this.subdistrict);
      // 高亮街道内所有排水户
      _this.map.setFilter("entity_layer_Highlight", [
        "in",
        "xzqh_code",
        currSubdistrict
      ]);

      let currSubData = _this.subdistrictData.find(
        m => m.code == currSubdistrict
      );
      _this.map.flyTo({
        center: [currSubData["longitude"], currSubData["latitude"]],
        zoom: 14.681566533880506,
        bearing: -36.77256094821888,
        pitch: 70.23255407010667
      });
    },
    // 排水户选择
    drainageHouseholdChange() {
      const _this = this;
      let currDrainageHousehold = Number(_this.drainageHousehold);
      // 高亮排水户
      _this.map.setFilter("entity_layer_Highlight", [
        "in",
        "id",
        currDrainageHousehold
      ]);

      const subdistrictTimer = setInterval(function() {
        if (_this.map.isSourceLoaded("entity_source")) {
          //判断资源是否加载完毕
          clearInterval(subdistrictTimer); //取消循环监听

          // setTimeout(function() {
          // 定位排水户
          let drainageHouseholdFeature = _this.map.querySourceFeatures(
            "entity_source",
            {
              sourceLayer: "entity_layer_Highlight",
              filter: ["in", "id", currDrainageHousehold]
            }
          );

          if (checkNotNull(drainageHouseholdFeature)) {
            let coordinates = drainageHouseholdFeature[0]["properties"];

            _this.map.flyTo({
              center: [coordinates["center_x"], coordinates["center_y"]],
              zoom: 16.748662579291043,
              bearing: -40.77256094821905,
              pitch: 50.73255407010666
            });
          } else {
            _this.map.flyTo({
              center: [104.06249471503816, 30.703296516582313],
              zoom: 13.480647318352341,
              bearing: -36.77256094821888,
              pitch: 70.23255407010667
            });

            _this.drainageHouseholdChange();
          }
          // }, 500);
        }
      });

      setTimeout(function() {
        //如果下面长时间不触发"取消循环监听"，5秒后自动取消循环监听
        clearInterval(subdistrictTimer); //取消循环监听
      }, 5000);
    },
    // 获得当前点位类型菜单（上）
    getCurrMapMenu(code) {
      let allIndex = this.currActiveMenus.indexOf(1);
      let menuIndex = this.currActiveMenus.indexOf(code);

      // 判断当前菜单是否被选中
      if (this.currActiveMenus.indexOf(code) == -1) {
        // 没有被在选中状态
        // 如果当前选择的是“全部”
        if (code == 1) {
          this.currActiveMenus = [1];
        } else {
          // 如果当前选中不是“全部”
          this.currActiveMenus.push(code);

          // 剔除“全部”
          if (allIndex != -1) {
            this.currActiveMenus.splice(allIndex, 1);
          }
        }
      } else {
        // 当前菜单正在选中状态
        if (code != 1) {
          // 去除取消菜单
          this.currActiveMenus.splice(menuIndex, 1);

          if (this.currActiveMenus.length == 0) {
            this.currActiveMenus = [1];
          }
        }
      }

      let activePointType = "";
      this.currActiveMenus.forEach(m => {
        activePointType += this.menuList[m - 1]["code"] + ",";
      });

      activePointType = activePointType.slice(0, activePointType.length - 1);
      this.getPoint(activePointType);
      if (checkNotNull(this.pointPopup)) {
        this.pointPopup.remove();
      }
    },
    // 获得地图上菜单（下）
    getCurrMapBottomMenu(code) {
      const _this = this;
      let menuIndex = _this.currActiveBottomMenus.indexOf(code);
      // 当前选则的菜单 为未选中菜单
      if (menuIndex == -1) {
        _this.currActiveBottomMenus.push(code);
        // 运维人员
        if (code == 2) {
          _this.operationPerson();
        }
      } else {
        // 取消选中当前菜单
        _this.currActiveBottomMenus.splice(menuIndex, 1);
        if (code == 2 && _this.map.getLayer("operationPersonLayer")) {
          _this.map.setLayoutProperty(
            "operationPersonLayer",
            "visibility",
            "none"
          );
        }
      }

      _this.renderPointAnnotations();
    },
    // 运维人员
    async operationPerson() {
      const _this = this;
      let operationPersonList = (await awaitWrap(getAllOperationPerson()))[1];

      if (
        checkNotNull(operationPersonList) &&
        checkNotNull(operationPersonList["data"])
      ) {
        _this.operationPersonData = operationPersonList["data"];
      } else {
        _this.operationPersonData = [];
      }

      let operationPersonFeatures = [];
      _this.operationPersonData.forEach(m => {
        operationPersonFeatures.push({
          id: "operationPerson_" + m["personCode"],
          type: "Feature",
          properties: {
            ...m
          },
          geometry: {
            type: "Point",
            coordinates: [m.pointLongitude, m.pointLatitude]
          }
        });
      });

      if (_this.map.getLayer("operationPersonLayer")) {
        _this.map.setLayoutProperty(
          "operationPersonLayer",
          "visibility",
          "visible"
        );
        _this.map.getSource("operationPersonSource").setData({
          type: "FeatureCollection",
          features: [...operationPersonFeatures]
        });
      } else {
        // 否则新建图层
        _this.map.addSource("operationPersonSource", {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: [...operationPersonFeatures]
          }
        });

        _this.map.addLayer({
          id: "operationPersonLayer",
          type: "symbol",
          source: "operationPersonSource",
          layout: {
            "icon-image": "point_ywry",
            "icon-size": 1,
            "icon-offset": [0, -53],
            "icon-size": chartFontSize(56) / 56 * 0.6785,
            "icon-allow-overlap": true,
            "icon-ignore-placement": true
          }
        });
      }

      _this.map.on(
        "click",
        "operationPersonLayer",
        _this.getOperationPersonInfo
      );

      // 添加鼠标悬浮事件
      _this.map.on(
        "mousemove",
        "operationPersonLayer",
        _this.pointShowNamePopup
      );
      _this.map.on(
        "mouseleave",
        "operationPersonLayer",
        _this.pointHideNamePopup
      );

      // 添加点位标注
      _this.renderPointAnnotations();
    },
    // 获得运维人员信息
    getOperationPersonInfo(e) {
      const _this = this;
      let feature = e.features[0];
      let coordinates = feature.geometry.coordinates;
      let properties = feature["properties"];

      let description = `<div>姓名：${properties["personName"] ||
        "--"}</div><div>联系方式：${properties["phone"] || "--"}</div>`;

      _this.pointPopup = new mapboxgl.Popup({
        offset: [
          chartFontSize(300) / 2 +
            chartFontSize(56) * 0.6785 +
            chartFontSize(8),
          0
        ],
        closeButton: false
      });
      _this.pointPopup
        .setLngLat(coordinates)
        .setHTML(description)
        .addTo(_this.map);
    },
    stopToggle() {
      // 停止切换
      clearInterval(this.togglePageTimer);
    },
    startToggle() {
      const _this = this;
      _this.togglePageTimer = setInterval(() => {
        _this.toggleFlag = !_this.toggleFlag;
      }, 6000);
    },
    // 自动选转
    rotateCamera(timestamp) {
      this.map.rotateTo((timestamp / 100) % 360, { duration: 0 });
      this.mapAnimation = requestAnimationFrame(this.rotateCamera);
    },
    mapRotateToggle(flag) {
      cancelAnimationFrame(this.mapAnimation);

      if (flag == 1) {
        this.rotateCamera(0);
      }
    },
    // 初始化地图
    initmap() {
      const _this = this;

      var tdtVec = {
        //类型为栅格瓦片
        type: "raster",
        tiles: [
          "http://t0.tianditu.gov.cn/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=94c8fdaa0318f9fa88cbbaf2145186e5"
        ],
        //分辨率
        tileSize: 256
      };
      var tdtCva = {
        type: "raster",
        tiles: [
          "http://t0.tianditu.gov.cn/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=ebf64362215c081f8317203220f133eb"
        ],
        tileSize: 256
      };

      var zwww = {
        type: "raster",
        tiles: [
          // "http://10.1.228.132:6080/arcgis/rest/services/BaseMap/CDVector_QSX_CGCS2000/MapServer/WMTS?"
          // "http://10.1.228.132:6080/arcgis/rest/services/BaseMap/CDVector_QSX_CGCS2000/MapServer/WMTS??REQUEST=GetTile&SERVICE=WMTS&VERSION=1.0.0&LAYER=BaseMap_CDVector_QSX_CGCS2000&STYLE=default&TILEMATRIXSET=default&TILEMATRIX=z&TILEROW=y&TILECOL=x"

          // "http://10.1.228.132:6080/arcgis/rest/services/BaseMap/CDVector_QSX_CGCS2000/MapServer/WMTS/tile/1.0.0/BaseMap_CDVector_QSX_CGCS2000/default/default/{z}/{y}/{x}.png",
          "http://10.1.228.132:6080/arcgis/rest/services/BaseMap/CDVector_SSX_CGCS2000/MapServer/WMTS/tile/1.0.0/BaseMap_CDVector_SSX_CGCS2000/default/default/{z}/{y}/{x}.png"
        ],
        tileSize: 256
        // "bounds": [106.61304, -85, 120, 85]
      };

      _this.$mapboxgl.accessToken =
        "pk.eyJ1IjoiYWlpZGNtYXBib3giLCJhIjoiY2t5MmwxNTkzMGx6cjJ3cnNlbmkxejJ3dyJ9.uOjkh9kNooS-mqvSo3wS_A";

      _this.map = new _this.$mapboxgl.Map({
        container: "bigScreenMap",
        style: "mapbox://styles/examples/cj68bstx01a3r2rndlud0pwpv",
        zoom: 17,
        // center: [104.0515816071207, 30.702937112155528],
        center: [104.03333945194237, 30.682346462956062],
        pitch: 60
        // style: {
        //   version: 8,
        // sources: {
        //   tdtVec: tdtVec,
        //   tdtCva: tdtCva
        // },
        // layers: [
        //   {
        //     //图层id，要保证唯一性
        //     id: "tdtVec",
        //     //图层类型
        //     type: "raster",
        //     //数据源
        //     source: "tdtVec",
        //     //图层最小缩放级数
        //     minzoom: 0,
        //     //图层最大缩放级数
        //     maxzoom: 18
        //   },
        //   {
        //     id: "tdtCva",
        //     type: "raster",
        //     source: "tdtCva",
        //     minzoom: 0,
        //     maxzoom: 18
        //   }
        // ]
        // }
        // style: {
        //   version: 8,
        //   sources: {
        //     zwww: zwww
        //   },
        //   layers: [
        //     {
        //       //图层id，要保证唯一性
        //       id: "zwww",
        //       //图层类型
        //       type: "raster",
        //       //数据源
        //       source: "zwww",
        //       //图层最小缩放级数
        //       minzoom: 0,
        //       //图层最大缩放级数
        //       maxzoom: 18
        //     }
        //   ]
        // }
      });

      // 加载三维建筑
      _this.map.on("style.load", function(e) {
        // 示范区
        _this.renderDemonstrationPlot();
        // 管道
        _this.renderPipeline();
        // 白膜建筑
        _this.renderGeojson3D();

        // // 测试 添加obj
        // let Threebox = window.Threebox;
        // _this.map.addLayer({
        //   id: "custom_layer",
        //   type: "custom",
        //   renderingMode: "3d",
        //   onAdd: function(map, mbxContext) {
        //     _this.tb = new Threebox(map, mbxContext, { defaultLights: true });
        //     var options = {
        //       obj: "/src/data/test",
        //       mtl: "/src/data/test",
        //       scale: 10
        //     };
        //     _this.tb.loadObj(options, function(model) {
        //       let truck = model.setCoords([104.03876606830755,30.683300575440427]);
        //       _this.tb.add(truck);
        //     });
        //   },
        //   render: function(gl, matrix) {
        //     _this.tb.update();
        //   }
        // });

        // 旋转
        // _this.rotateMapTimer = setTimeout(function() {
        _this.map.flyTo({
          center: [104.03657539918424, 30.68370428596259],
          zoom: 15,
          bearing: -36.77256094821888,
          pitch: 70.23255407010667,
          speed: 0.25
        });

        // 自动旋转
        // _this.rotateCamera(0);
        // }, 1500);
      });

      _this.map.on("click", function(e) {
        var coordinates = e.lngLat;
        // console.log(coordinates);
        // console.log(_this.map.getCenter());
        // console.log(_this.map.getZoom());
        // console.log(_this.map.getBearing());
        // console.log(_this.map.getPitch());
      });
    },
    // 示范区
    renderDemonstrationPlot() {
      const _this = this;
      _this.map.addSource(
        "demoArea_source",
        _this.createGeoJSONCircle([104.03333945194237, 30.682346462956062], 0.5)
      );

      _this.map.addLayer({
        id: "demoArea_layer",
        type: "fill",
        source: "demoArea_source",
        layout: {},
        paint: {
          "fill-color": "#00aeff",
          "fill-opacity": 0.4
        }
      });
    },
    renderPipeline() {
      const _this = this;
      // 添加数据源
      //   _this.map.addSource("pipeLineSource", {
      //     type: "geojson",
      //     lineMetrics: true,
      //     data: pipelineJson
      //   });
      //   // 添加外轮廓的线
      //  _this.map.addLayer({
      //     id: "pipeLineLayer",
      //     source: "pipeLineSource",
      //     type: "line",
      //     layout: {
      //       visibility: "visible",
      //       "line-join": "round",
      //       "line-cap": "round"
      //     },
      //     paint: {
      //       "line-color": "#fef091",
      //       "line-width": 5
      //     }
      //   });

      // 流线图层
      const chunkSourceData = {
        type: "FeatureCollection",
        features: []
      };
      _this.map.addSource("chunkSource", {
        type: "geojson",
        lineMetrics: true, // 线渐变必须条件
        data: chunkSourceData
      });
      _this.map.addLayer({
        id: "chunkLayer",
        source: "chunkSource",
        type: "line",
        layout: {
          visibility: "visible",
          "line-join": "round",
          "line-cap": "round"
        },
        paint: {
          "line-color": ["get", "color"],
          "line-width": 4
        }
      });

      let colorLen = 50;
      let transparentColorList = [];
      for (let i = 0; i < colorLen; i++) {
        transparentColorList.push("rgba(255,255,255,0)");
        // transparentColorList.push("#ff0000");
      }
      // 渐变色值数组
      // let chunkColorList1 = ColorUitl.getGradientColor(
      //   "#29f19c", // 2
      //   "#02a1f9", // 1
      //   colorLen / 2
      // );
      // let chunkColorList2 = ColorUitl.getGradientColor(
      //   "#fef091", // 4
      //   "#29f19c", // 3
      //   colorLen / 2
      // );
      let chunkColorList0 = ColorUitl.getGradientColor(
        "#434343", // 4
        "#fe9d15", // 3
        colorLen
      );

      let chunkColorList = [
        // ...chunkColorList2,
        // ...chunkColorList1,
        ...chunkColorList0,
        ...transparentColorList
      ];

      let chunkColorNum = 0;
      pipelineJson["features"].forEach((m, n) => {
        if (m["geometry"]["type"] == "LineString") {
          // 获得渐变线段
          let lineCount = lineString(m["geometry"]["coordinates"]);
          let chunk = lineChunk(lineCount, 0.01, { units: "miles" });

          for (let i = 0; i < chunk.features.length; i++) {
            chunkSourceData.features.push({
              type: "Feature",
              geometry: chunk.features[i].geometry,
              properties: {
                name: `chunk_line_${n}_${i}`,
                color: chunkColorList[i % chunkColorList.length]
              }
            });
          }
        }

        if (m["geometry"]["type"] == "MultiLineString") {
          // 获得渐变线段
          for (let j = 0; j < m["geometry"]["coordinates"].length; j++) {
            let lineCount = lineString(m["geometry"]["coordinates"][j]);
            let chunk = lineChunk(lineCount, 0.01, { units: "miles" });

            for (let i = 0; i < chunk.features.length; i++) {
              chunkSourceData.features.push({
                type: "Feature",
                geometry: chunk.features[i].geometry,
                properties: {
                  name: `chunk_line_${n}__${j}_${i}`,
                  color: chunkColorList[i % chunkColorList.length]
                }
              });
            }
          }
        }
      });

      _this.map.getSource("chunkSource").setData(chunkSourceData);

      const updateChunkSource = function() {
        chunkColorNum++;
        for (let i = 0; i < chunkSourceData.features.length; i++) {
          const countNumShow = chunkColorNum % chunkColorList.length;
          const pageNum = i % chunkColorList.length;
          const totalNum = pageNum - countNumShow;
          if (totalNum <= 0) {
            chunkSourceData.features[i].properties.color =
              chunkColorList[chunkColorList.length - 1 - Math.abs(totalNum)];
          }
          if (totalNum > 0) {
            chunkSourceData.features[i].properties.color =
              chunkColorList[totalNum - 1];
          }
        }
        _this.map.getSource("chunkSource").setData(chunkSourceData);
        // 触发一个显示框的渲染。使用自定义图层时，当图层发生改变，使用此方法去重渲染。在下一个显示框渲染前多次调用此方法也只会渲染一次
        _this.map.triggerRepaint();

        requestAnimationFrame(updateChunkSource);
      };

      requestAnimationFrame(updateChunkSource);
    },
    // metersToPixelsAtMaxZoom(meters, latitude) {
    //   return meters / 0.075 / Math.cos(latitude * Math.PI / 180);
    // },
    //绘制圆形区域的函数
    createGeoJSONCircle(center, radiusInKm, points) {
      if (!points) points = 64;

      var coords = {
        latitude: center[1],
        longitude: center[0]
      };

      var km = radiusInKm;

      var ret = [];
      var distanceX = km / (111.32 * Math.cos(coords.latitude * Math.PI / 180));
      var distanceY = km / 110.574;

      var theta, x, y;
      for (var i = 0; i < points; i++) {
        theta = i / points * (2 * Math.PI);
        x = distanceX * Math.cos(theta);
        y = distanceY * Math.sin(theta);

        ret.push([coords.longitude + x, coords.latitude + y]);
      }
      ret.push(ret[0]);

      return {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: [
            {
              id: "demonstration_area_Circle",
              type: "Feature",
              geometry: {
                type: "Polygon",
                coordinates: [ret]
              }
            }
          ]
        }
      };
    },
    // 载入各点位类型图标
    loadImage(type, state) {
      const _this = this;
      _this.map.loadImage(
        "/static/BigScreen/pointIcon/point_" + type + "_" + state + "_icon.png",
        function(err, image) {
          if (err) throw err;
          _this.map.addImage("point_" + type + "_" + state, image);
        }
      );
    },
    // 渲染建筑物
    renderGeojson3D() {
      const _this = this;

      jinniubuildinggeojson.features.forEach(item => {
        let he; //默认建筑物高度
        if (item.properties.height === "") {
          he = "5";
        } else {
          he = item.properties.height;
        }
        //模拟数据
        //item.properties.pkid = parseInt(item.properties.xh)
        item.properties.height = parseInt(he);
        item.properties.base_height = parseInt(0);
      });

      if (_this.map.getSource("entity_source")) {
        _this.map.getSource("entity_source").setData(jinniubuildinggeojson);
      } else {
        _this.map.addSource("entity_source", {
          type: "geojson",
          data: jinniubuildinggeojson
        });

        // 建筑加载图层
        _this.map.addLayer({
          id: "entity_layer",
          source: "entity_source",
          // type: "fill-extrusion",
          type: "fill-extrusion",
          // filter: ['==', 'extrude', 'true'],
          layout: {},
          minzoom: 10,
          paint: {
            // "fill-extrusion-color": "#0166b6",
            "fill-extrusion-color": "#123984",
            // "fill-extrusion-color": "#0a102b",
            // 'fill-extrusion-pattern': 'buildingMap',
            "fill-extrusion-height": ["to-number", ["get", "height"]],
            // "fill-extrusion-height": [
            //   "interpolate",
            //   ["linear"],
            //   ["zoom"],
            //   14,
            //   0,
            //   14.05,
            //   ["get", "height"]
            // ],
            "fill-extrusion-base": 0,
            // "fill-extrusion-opacity": 1
            "fill-extrusion-opacity": 0.8
          }
        });

        // 建筑拾取图层
        _this.map.addLayer({
          id: "entity_layer_Highlight",
          source: "entity_source",
          type: "fill-extrusion",
          layout: {},
          minzoom: 10,
          paint: {
            // "fill-extrusion-color": "#0166b6",
            "fill-extrusion-color": "#0ff",
            // "fill-extrusion-color": "#52e0ff",
            "fill-extrusion-height": ["to-number", ["get", "height"]],
            "fill-extrusion-base": 0,
            // "fill-extrusion-height": [
            //   "interpolate",
            //   ["linear"],
            //   ["zoom"],
            //   14,
            //   0,
            //   14.05,
            //   ["get", "height"]
            // ],
            // "fill-extrusion-base": [
            //   "interpolate",
            //   ["linear"],
            //   ["zoom"],
            //   14,
            //   0,
            //   14.05,
            //   ["get", "base_height"]
            // ],
            // "fill-extrusion-base": 0,
            "fill-extrusion-opacity": 0.8
          },
          filter: ["in", "id", ""]
        });

        // _this.map.addLayer({
        //   id: "entity_layer_top",
        //   source: "entity_source",
        //   type: "fill-extrusion",
        //   layout: {},
        //   minzoom: 10,
        //   paint: {
        //     "fill-extrusion-color": "#32373b",
        //     'fill-extrusion-height': ["to-number",["get", "height"]],
        //     'fill-extrusion-base': ["to-number",["get", "height"]],
        //     "fill-extrusion-opacity": 1,
        //   }
        // });

        // _this.map.setLayoutProperty('entity_layer', 'visibility', 'none');

        // 添加图层点击事件
        _this.map.on("click", "entity_layer", function(e) {
          let properties = e.features[0]["properties"];
          // 高亮点击的排水户
          _this.map.setFilter("entity_layer_Highlight", [
            "in",
            "id",
            properties.id
          ]);

          if (checkNotNull(properties["Name"])) {
            // 显示点击的排水户名称
            let drainHouseholdPopup = new mapboxgl.Popup({
              anchor: "bottom-right",
              // 正左负右 正上负下
              offset: [0, -chartFontSize(properties["height"])],
              className: "pointAnnotations",
              closeButton: false
            });

            drainHouseholdPopup
              .setLngLat([properties["center_x"], properties["center_y"]])
              .setHTML(
                checkNotNull(properties["Name"]) ? properties["Name"] : ""
              )
              .addTo(_this.map);
          }
        });
      }
    },
    // 更新当前时间
    updateCurrDate() {
      const _this = this;
      _this.updateDateTimer = setInterval(function() {
        _this.currDate = _this.$moment(new Date()).format("HH:mm:ss");
      }, 1000);
    },
    // 获得点位
    async getPoint(deviceTypeStr) {
      const _this = this;

      // 处理点位数据
      let pointList = (await awaitWrap(
        getAllPoint({ deviceTypeStr: deviceTypeStr || "" })
      ))[1];
      
      if (checkNotNull(pointList) && checkNotNull(pointList["data"])) {
        _this.pointData = pointList["data"];
      } else {
        _this.pointData = [];
      }

      let pointFeatures = [],
        deviceState = "",
        alarmPointFeatures = [];

      _this.pointData.forEach(m => {
        // 告警
        if (m["pointState"] == 1) {
          alarmPointFeatures.push({
            id: "point_alarm_" + m["pointCode"],
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [m.pointLongitude, m.pointLatitude]
            }
          });
        }

        pointFeatures.push({
          id: "point_" + m["pointCode"],
          type: "Feature",
          properties: {
            ...m
          },
          geometry: {
            type: "Point",
            coordinates: [m.pointLongitude, m.pointLatitude]
          }
        });
      });

      // 报警点位
      _this.addAlarmPoint(alarmPointFeatures);

      // 如果图层存在 则更新数据
      if (_this.map.getLayer("pointLayer")) {
        _this.map.getSource("pointSource").setData({
          type: "FeatureCollection",
          features: [...pointFeatures]
        });
      } else {
        // 否则新建图层
        _this.map.addSource("pointSource", {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: [...pointFeatures]
          }
        });

        _this.map.addLayer({
          id: "pointLayer",
          type: "symbol",
          source: "pointSource",

          layout: {
            "icon-image": "point_{deviceType}_{pointState}",
            "icon-size": 1,
            "icon-offset": [0, -53],
            "icon-size": chartFontSize(56) / 56 * 0.6785,
            // 'text-field': ['get', 'Name'],
            // 'text-font': [
            //   'SourceHanSansCN-Regular'
            // ],
            // "icon-rotation-alignment": 'map',
            "icon-allow-overlap": true,
            "icon-ignore-placement": true
          }
        });
        // 添加图层点击事件
        // _this.map.off("click", "pointLayer", _this.getLatestCalInfo);
        _this.map.on("click", "pointLayer", _this.getLatestCalInfo);

        let temporaryPointPopup1;
        // 添加鼠标悬浮事件
        _this.map.on("mousemove", "pointLayer", _this.pointShowNamePopup);
        _this.map.on("mouseleave", "pointLayer", _this.pointHideNamePopup);
      }

      // 添加点位标注
      _this.renderPointAnnotations();
    },
    pointShowNamePopup(e) {
      const _this = this;
      _this.map.getCanvas().style.cursor = "pointer";

      let feature = e.features[0];
      let coordinates = feature.geometry.coordinates;
      let properties = feature["properties"];
      let pointAnnotationsEle = document.getElementsByClassName(
        `pointAnnotations_${properties["pointCode"] ||
          properties["personCode"]}`
      );

      if (
        !checkNotNull(_this.temporaryPointPopup) &&
        !checkNotNull(pointAnnotationsEle)
      ) {
        _this.temporaryPointPopup = new mapboxgl.Popup({
          anchor: "bottom-right",
          // 正左负右 正上负下
          offset: [
            chartFontSize(10),
            -chartFontSize(106) * 0.6785 - chartFontSize(10)
          ],
          className: "pointAnnotations",
          closeButton: false,
          closeOnClick: false
        });

        _this.temporaryPointPopup
          .setLngLat([
            properties["pointLongitude"],
            properties["pointLatitude"]
          ])
          .setHTML(properties["pointName"] || properties["personName"])
          .addTo(_this.map);
      }
    },
    pointHideNamePopup(e) {
      const _this = this;
      _this.map.getCanvas().style.cursor = "";

      if (checkNotNull(_this.temporaryPointPopup)) {
        _this.temporaryPointPopup.remove();
        _this.temporaryPointPopup = null;
      }
    },
    // 移除点位标注
    removePointAnnotations() {
      var domObj = document.getElementsByClassName("pointAnnotations");
      for (var i = domObj.length - 1; i > -1; i--) {
        domObj[i].remove();
      }
    },
    // 点位标注
    renderPointAnnotations() {
      const _this = this;
      _this.removePointAnnotations();

      // 如果没有选择“标注”菜单则不显示点位标注
      if (this.currActiveBottomMenus.indexOf(3) == -1) {
        return false;
      }

      _this.pointData.forEach(m => {
        new mapboxgl.Popup({
          anchor: "bottom-right",
          // 正左负右 正上负下
          offset: [
            chartFontSize(10),
            -chartFontSize(106) * 0.6785 - chartFontSize(10)
          ],
          // offset: marker.offset,
          className: `pointAnnotations pointAnnotations_${m["pointCode"]}`,
          closeButton: false,
          closeOnClick: false
        })
          .setLngLat([m["pointLongitude"], m["pointLatitude"]])
          .setHTML(m["pointName"])
          .addTo(_this.map);
      });

      // 运维人员
      _this.operationPersonData.forEach(m => {
        new mapboxgl.Popup({
          anchor: "bottom-right",
          // 正左负右 正上负下
          offset: [
            chartFontSize(10),
            -chartFontSize(106) * 0.6785 - chartFontSize(10)
          ],
          // offset: marker.offset,
          className: `pointAnnotations pointAnnotations_${m["personCode"]}`,
          closeButton: false,
          closeOnClick: false
        })
          .setLngLat([m["pointLongitude"], m["pointLatitude"]])
          .setHTML(m["personName"])
          .addTo(_this.map);
      });
    },
    // 点位弹框
    async getLatestCalInfo(e) {
      const _this = this;
        let feature = e.features[0];
      console.log(feature)
      // 新添加弹窗start
      if(feature &&
        feature["properties"] && 
        feature["properties"]["deviceType"] && 
            (feature["properties"]["deviceType"] == 'ws' || feature["properties"]["deviceType"] == 'ys')
        ){
            _this.dialogDetailsVisible = true;
            _this.pointCode = feature["properties"]["pointCode"]
            _this.dialogDeviceType = feature["properties"]["deviceType"]
        } else if(feature["properties"]["deviceType"] == 'sp'){
            _this.dialogVedioVisible = true;
            _this.ipcId = feature["properties"]["ipcId"]
            _this.dialogDeviceType = feature["properties"]["deviceType"]
        }
      // 新添加弹窗 end
      else {
        let coordinates = feature.geometry.coordinates;
        let properties = feature["properties"];
        let pointNewData =
            (await awaitWrap(
            getLatestCalInfo({ pointCode: properties["pointCode"] || "" })
            ))[1] || {};

        if (checkNotNull(pointNewData) && checkNotNull(pointNewData["data"])) {
            pointNewData = pointNewData["data"];
        } else {
            pointNewData = {};
        }

        // 因子
        let factorDescription = "";
        if (checkNotNull(pointNewData["factorRecordList"])) {
            pointNewData["factorRecordList"].forEach(m => {
            factorDescription += `<div>监测因子：${m["factorName"] ||
                "--"} 监测值：<span style='color:'>${m["factorValue"] ||
                "--"}</span> 阈值：${
                m["factorName"] == "pH 值"
                ? m["factorThreshold"].toString().slice(0, 1) +
                    "-" +
                    m["factorThreshold"]
                    .toString()
                    .slice(1, m["factorThreshold"].toString().length)
                : m["factorThreshold"] || "--"
            }</div>`;
            });
        }

        // 液位
        let liquidLevelData = `
        <div>液位：${pointNewData["testLevel"] ||
            (pointNewData["testLevel"] == 0
            ? 0
            : "--")}m</div><div>高液位阈值：${pointNewData["hlevelThreshold"] ||
            "--"}m</div><div>低液位阈值：${pointNewData["llevelThreshold"] ||
            "--"}m</div><div>管径：${pointNewData["calibre"] || "--"}m</div><div>`;

        // 设备参数
        let deviceParams = "";
        if (checkNotNull(pointNewData["deviceParamVoList"])) {
            pointNewData["deviceParamVoList"].forEach(m => {
            deviceParams += `<div>${m["name"]}：${m["value"] || "--"} </div>`;
            });
        }

        // 泵站运行情况
        let pumpInfo = "<ul class='pointPumpInfo fix'>";
        if (checkNotNull(pointNewData["switcherVoList"])) {
            pointNewData["switcherVoList"].forEach(m => {
            pumpInfo += `<li>泵${m["switcher"]}：${
                m["switcherFlag"] == 0
                ? "开启"
                : m["switcherFlag"] == 1 ? "关闭" : ""
            } </li>`;
            });
        }
        pumpInfo += "</ul>";

        let description = `<div>${pointNewData["pointName"] ||
            "--"}</div><div>排水户：${pointNewData["pshName"] ||
            "--"}</div><div>位置：${pointNewData["pshAddr"] ||
            "--"}</div><div>点位状态：${_this.getNameByType(
            _this.dataStateData,
            pointNewData["pointState"]
        ) || "--"}</div>设备状态：${_this.getNameByType(
            _this.deviceStateData,
            pointNewData["deviceState"]
        ) || "--"}</div>${factorDescription}${
            properties["deviceType"] == "bz" ? "" : liquidLevelData
        }<div>${deviceParams}</div>${pumpInfo}`;
        console.log(pointNewData)
        _this.pointPopup = new mapboxgl.Popup({
            offset: [
            chartFontSize(300) / 2 +
                chartFontSize(56) * 0.6785 +
                chartFontSize(8),
            0
            ],
            closeButton: false
        });
        _this.pointPopup
            .setLngLat(coordinates)
            .setHTML(description)
            .addTo(_this.map);
      }
    },
    // 渲染报警点位（样式）
    renderAlarmPoint() {
      const _this = this;
      var size = _this.alarmCanvasSize;
      var pulsingDot = {
        width: size,
        height: size,
        data: new Uint8Array(size * size * 4),
        radius1: _this.alarmCanvasRadius,
        radius2: _this.alarmCanvasRadius,
        radius3: _this.alarmCanvasRadius,

        onAdd: function() {
          const $this = this;
          var canvas = document.createElement("canvas");
          canvas.width = $this.width;
          canvas.height = $this.height;
          $this.context = canvas.getContext("2d");

          function drawCircle(radius, color) {
            $this.context.beginPath();
            $this.context.arc(
              $this.width / 2,
              $this.width / 2,
              radius,
              0,
              Math.PI * 2
            );
            $this.context.closePath();
            $this.context.lineWidth = 4;
            $this.context.strokeStyle = color; //"rgba(255, 0, 0, 1)";
            $this.context.stroke();
          }

          function render(radius, color) {
            var prev = $this.context.globalCompositeOperation;
            $this.context.globalCompositeOperation = "destination-in";
            $this.context.globalAlpha = 0.9;
            $this.context.fillRect(0, 0, $this.width, $this.height);
            $this.context.globalCompositeOperation = prev;

            drawCircle(radius, color);
          }

          setInterval(function() {
            // setTimeout(function() {
            // 红色
            render($this.radius1, "rgba(255, 0, 0, 1)");

            $this.radius1 += 2;
            if ($this.radius1 > $this.width / 2) {
              $this.radius1 = 0;
            }
            // }, 100);

            // setTimeout(function() {
            //   // 蓝色
            //   // render($this.radius2, "rgba(255, 0, 0, 1)");
            //   render($this.radius2, "rgba(0,0,255, 1)");

            //   $this.radius2 += 2;
            //   if ($this.radius2 > $this.width / 2) {
            //     $this.radius2 = 0;
            //   }
            // }, 1000);

            // setTimeout(function() {
            //   // 绿色
            //   // render($this.radius3, "rgba(255, 0, 0, 1)");
            //   render($this.radius3, "rgba(0,128,0, 1)");

            //   $this.radius3 += 2;
            //   if ($this.radius3 > $this.width / 2) {
            //     $this.radius3 = 0;
            //   }
            // }, 2000);
          }, 0);

          // clearTimeout(_this.secondAlarmTimer);
          // _this.secondAlarmTimer =
          // setTimeout(function() {
          //   // 蓝色
          //   render($this.radius2, "rgba(255, 0, 0, 1)");
          //   // render($this.radius2, "rgba(0,0,255, 1)");

          //   $this.radius2 += 1;
          //   if ($this.radius2 > $this.width / 2) {
          //     $this.radius2 = 0;
          //   }
          // }, 2000);

          // // clearTimeout(_this.threeAlarmTimer);
          // // _this.threeAlarmTimer =
          // setTimeout(function() {
          //   // 绿色
          //   render($this.radius3, "rgba(255, 0, 0, 1)");
          //   // render($this.radius3, "rgba(0,128,0, 1)");

          //   $this.radius3 += 1;
          //   if ($this.radius3 > $this.width / 2) {
          //     $this.radius3 = 0;
          //   }
          // }, 4500);
        },

        render: function() {
          this.data = this.context.getImageData(
            0,
            0,
            this.width,
            this.height
          ).data;

          // keep the map repainting
          _this.map.triggerRepaint();

          // return `true` to let the map know that the image was updated
          return true;
        }
      };

      _this.map.addImage("alarmPointIcon", pulsingDot, { pixelRatio: 2 });

      // 图标
      for (let i = 0; i < _this.deviceTypeData.length; i++) {
        for (let j = 0; j < _this.pointStateData.length; j++) {
          _this.loadImage(
            _this.deviceTypeData[i]["code"],
            _this.pointStateData[j]["code"]
          );
        }
      }

      // 添加建筑图片
      _this.map.loadImage("static/BigScreen/img/gao.png", (err, image) => {
        if (err) throw err;
        _this.map.addImage("buildingMap", image);
      });

      // 运维人员
      _this.map.loadImage(
        "/static/BigScreen/pointIcon/point_ywry_icon.png",
        function(err, image) {
          if (err) throw err;
          _this.map.addImage("point_ywry", image);
        }
      );
    },
    // 添加报警点位
    addAlarmPoint(alarmPointFeatures) {
      const _this = this;

      if (_this.map.getLayer("point_alarm_Layer")) {
        _this.map.getSource("point_alarm_source").setData({
          type: "FeatureCollection",
          features: alarmPointFeatures
        });
      } else {
        _this.map.addSource("point_alarm_source", {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: alarmPointFeatures
          }
        });

        _this.map.addLayer({
          id: "point_alarm_Layer",
          type: "symbol",
          source: "point_alarm_source",
          layout: {
            "icon-image": "alarmPointIcon",
            "icon-rotation-alignment": "map",
            "icon-allow-overlap": true,
            "icon-ignore-placement": true
          }
        });
      }
    },
    async getMapBaseType() {
      const _this = this;

      // 设备类型
      let deviceTypeList = (await awaitWrap(
        getDataByType({ type: "device_type" })
      ))[1];

      if (
        checkNotNull(deviceTypeList) &&
        checkNotNull(deviceTypeList["data"])
      ) {
        _this.deviceTypeData = deviceTypeList["data"];
      } else {
        _this.deviceTypeData = [];
      }

      // 点位状态
      let pointStateList = (await awaitWrap(
        getDataByType({ type: "point_state" })
      ))[1];

      if (
        checkNotNull(pointStateList) &&
        checkNotNull(pointStateList["data"])
      ) {
        _this.pointStateData = pointStateList["data"];
      } else {
        _this.pointStateData = [];
      }
    },
    // 获得基础类型数据
    async getBaseTypeData() {
      const _this = this;
      // 数据状态
      let dataStateList = (await awaitWrap(
        getDataByType({ type: "data_state" })
      ))[1];

      if (checkNotNull(dataStateList) && checkNotNull(dataStateList["data"])) {
        _this.dataStateData = dataStateList["data"];
      } else {
        _this.dataStateData = [];
      }

      // 设备状态
      let deviceStateList = (await awaitWrap(
        getDataByType({ type: "device_state" })
      ))[1];

      if (
        checkNotNull(deviceStateList) &&
        checkNotNull(deviceStateList["data"])
      ) {
        _this.deviceStateData = deviceStateList["data"];
      } else {
        _this.deviceStateData = [];
      }

      // 获得所有街道
      let subdistrictList = (await awaitWrap(getAllSubdistrict()))[1];

      if (
        checkNotNull(subdistrictList) &&
        checkNotNull(subdistrictList["data"])
      ) {
        _this.subdistrictData = subdistrictList["data"];
      } else {
        _this.subdistrictData = [];
      }

      // 获得所有排水户
      let drainageHouseholdList = (await awaitWrap(getDrainageHousehold()))[1];

      if (
        checkNotNull(drainageHouseholdList) &&
        checkNotNull(drainageHouseholdList["data"])
      ) {
        _this.drainageHouseholdData = drainageHouseholdList["data"];
      } else {
        _this.drainageHouseholdData = [];
      }
    },
    // 根据类型筛选名称
    getNameByType(data, type) {
      let filterList = data.find(m => {
        return m["code"] == type;
      });
      return checkNotNull(filterList) ? filterList["name"] : "";
    },
    // 改变地图手势
    changeMapCursor() {
      // const layers = map.getStyle().layers;
      // layers.forEach(layer => {
      //   const layerId = layer.id;
      //   if (layerId.includes("layer_geojson")) {
      //     map.on("mousemove", layerId, function() {
      //       map.getCanvas().style.cursor = "pointer";
      //     });
      //     map.on("mouseleave", layerId, function(e) {
      //       map.getCanvas().style.cursor = "";
      //     });
      //   }
      // });
    },
    returnHome() {
      this.$router.push("/");
    }
  },
  mounted() {
    const _this = this;
    _this.$nextTick(() => {
      _this.initmap();
      _this.getBaseTypeData();
      _this.getMapBaseType().then(() => {
        // // 加载三维建筑
        // _this.map.on("style.load", function(e) {
        // 图标/告警样式
        _this.renderAlarmPoint();
        // 点位
        _this.getPoint();
        // });
      });
      _this.startToggle();
      _this.updateCurrDate();
    });
  },
  beforeDestroy() {
    clearInterval(this.updateDateTimer);
    clearTimeout(this.rotateMapTimer);
  },
  beforeRouteLeave(to, from, next) {
    this.map.remove();
    next();
  }
};
</script>

<style lang="scss" scoped>
// 大屏布局样式表
@import "static/BigScreen/style/index.scss";
#bigScreenMap {
  height: 100%;
  position: relative;
}
</style>