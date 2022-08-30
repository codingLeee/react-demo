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
      projectName: "防汛监管系统",
      btMnues: [
        {
          code: "realTimeMonitorMap",
          name: "防汛一张图",
          children: [],
        },
        {
          code: "alarmManage",
          name: "水雨情监测",
          children: [],
        },
        {
          code: "monitoringEquipment",
          name: "公告发布",
          children: [],
        }
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
  },
  created() {
    this.getBreadcrumb();
    this.$store.commit("SET_SYSTEM_ROUTER", "floodControl");
  },
};
</script>
<style lang="scss" scoped>
</style>
