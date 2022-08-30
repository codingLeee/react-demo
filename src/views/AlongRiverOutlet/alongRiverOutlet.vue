<template>
  <div class="wrapper">
    <system-header :projectName="projectName"></system-header>
    <div class="wrapper_layout">
      <system-sidebar />
      <div class="wrapper_content">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item v-for="(item,index) in breadList" :key="index">{{item.meta.title}}</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="wrapper_content_view">
          <transition name="move" mode="out-in">
            <router-view></router-view>
          </transition>
        </div>
      </div>
      <bottom-menu :menuData="btMenuData" />
      <!--  :activeName.sync="activeBtMenuName" -->
    </div>
  </div>
</template>

<script>
import { checkNotNull } from "@/lib";

export default {
  data() {
    return {
      collapse: false,
      projectName: "沿河排口智能监管系统",
      btMnues: [
        {
          code: "outletHistoricalAlarmEvent",
          name: "历史报警事件查询",
          children: [
            {
              name: "监测指标报警管理",
              code: "indicators",
              icon: ""
            },
            {
              name: "监测设备故障管理",
              code: "equipment",
              icon: ""
            }
          ]
        },
        {
          code: "outletMonitoringIndicators",
          name: "监测指标报警统计分析",
          children: [
            {
              name: "事件统计",
              code: "statistics",
              icon: ""
            },
            {
              name: "信息分析",
              code: "analysis",
              icon: ""
            }
          ]
        },
      ],
      btMenuData: [],
      activeBtMenuName: ""
    };
  },
  watch: {
    $route() {
      this.getBreadcrumb();
    }
  },
  methods: {
    getBreadcrumb() {
      let currMenu = this.btMnues.filter(m => m.code == this.$route.name)[0];

      if (checkNotNull(currMenu)) {
        this.btMenuData = currMenu["children"] || [];
      } else {
        this.btMenuData = [];
      }

      if (Object.keys(this.$route.matched[0].meta).length > 0) {
        this.breadList = this.$route.matched;
      } else {
        this.breadList = [];
      }
    }
  },
  created() {
    this.$store.commit("SET_SYSTEM_ROUTER", "alongRiverOutlet");
    this.getBreadcrumb();
  }
};
</script>
<style lang="scss" scoped>

</style>
