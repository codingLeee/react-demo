<template>
  <div class="wrapper">
    <system-header :projectName="projectName"></system-header>
    <div class="wrapper_layout">
      <system-sidebar />
      <div class="wrapper_content">
        <el-breadcrumb
          separator="/"
          v-show="$route.name != 'realTimeMonitorMap'"
        >
          <el-breadcrumb-item v-for="(item, index) in breadList" :key="index">{{
            item.meta.title
          }}</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="wrapper_content_view">
          <transition name="move" mode="out-in">
            <router-view></router-view>
          </transition>
        </div>
      </div>
      <bottom-menu :menuData="btMenuData" v-show="$route.name != 'realTimeMonitorMap'"/>
      <!-- :activeName.sync="activeBtMenuName" -->
    </div>
  </div>
</template>

<script>
import { awaitWrap, checkNotNull } from "@/lib";
import { getStreetsData } from "@/api/IntelSupervision";

export default {
  data() {
    return {
      breadList: [],
      collapse: false,
      projectName: "排水户智慧监管系统",
      btMnues: [
        {
          code: "realTimeMonitorMap",
          name: "实时监测",
          children: [],
        },
        {
          code: "alarmManage",
          name: "报警管理",
          children: [
            {
              name: "监测指标报警管理",
              code: "indicators",
            },
            {
              name: "监测设备故障管理",
              code: "equipment",
            },
          ],
        },
        {
          code: "monitoringEquipment",
          name: "监测指标报警统计分析",
          children: [
            {
              name: "污水井设备统计分析",
              code: "ws",
            },
            {
              name: "雨水井设备统计分析",
              code: "ys",
            },
          ],
        },
        {
          code: "monitoringIndicators",
          name: "监测设备报警统计分析",
          children: [
            {
              name: "污水井统计分析",
              code: "ws",
            },
            {
              name: "雨水井统计分析",
              code: "ys",
            },
          ],
        },
        {
          code: "levelChange",
          name: "液位变化分析",
          children: [],
        },
        {
          code: "fileManagement",
          name: "档案管理",
          children: [],
        },
      ],
      btMenuData: [],
      // activeBtMenuName: ""
    };
  },
  watch: {
    $route(val) {
      this.getBreadcrumb();
    },
  },
  methods: {
    getBreadcrumb() {
      let currMenu = this.btMnues.filter((m) => m.code == this.$route.name)[0];

      if (checkNotNull(currMenu)) {
        this.btMenuData = currMenu["children"] || [];
        // this.activeBtMenuName = this.btMenuData[0]["code"];
      } else {
        this.btMenuData = [];
      }

      if (Object.keys(this.$route.matched[0].meta).length > 0) {
        this.breadList = this.$route.matched;
      } else {
        this.breadList = [];
      }
    },
    //获取街道列表
    async getStreets() {
      const res = await getStreetsData();
      let list = [];
      let obj = res.data;
      for (var i in obj) {
        var o = {
          value: i,
          label: obj[i],
          };
        if (o.label !== '成都市' && o.label !== '金牛区') {
          list.push(o);
        }
      }
      //this.streesOptions = list;

      this.$store.commit("SET_streesOptions", list);
    },
  },
  created() {
    this.getBreadcrumb();
    this.$store.commit("SET_SYSTEM_ROUTER", "intelSupervision");

    this.getStreets();
  },
};
</script>
<style lang="scss" scoped>
</style>
