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
      projectName: "排水运维调度管理系统",
      btMnues: [
        {
          code: "eventDistribution",
          name: "事件分发",
          children: [
            {
              name: "待分发事件",
              code: "distribute",
              icon: ""
            },
            {
              name: "退回事件",
              code: "back",
              icon: ""
            }
          ]
        }
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
    this.$store.commit("SET_SYSTEM_ROUTER", "drainageOperation");
    this.getBreadcrumb();
  }
};
</script>
<style lang="scss" scoped>

</style>
