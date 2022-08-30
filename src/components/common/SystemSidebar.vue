<template>
  <div class="sidebar" :class="{'sidebar_hide': menuHide}">
    <div class="menu_content">
      <!--  :class="{'menuHide': menuHide, 'menuShow': !menuHide}" -->
      <el-menu 
        :default-active="$route.name" 
        :collapse="true"
        unique-opened
        :router="true"
        :menuTrigger="'click'"
        :mode="'horizontal'"
      >
        <template v-for="item in systemMenus">
            <el-submenu v-if="checkNotNull(item.children) && !item.isPage" :index="item.router" :key="item.router">
                <template slot="title">
                    <el-tooltip class="item" effect="dark" :content="item.title" placement="right">
                        <div class="menu_img" :style="`--img: url(/static/ManageSystem/img/${item.router}_icon.png);--activeImg:url(/static/ManageSystem/img/${item.router}_active_icon.png)`"></div>
                    </el-tooltip>
                    <span slot="title">{{ item.title }}</span>
                </template>
                <el-menu-item v-for="item2 in item.children" :key="item2.router" :index="item2.router" :route="{name: item2.router}">
                    {{item2.title}}
                </el-menu-item>
            </el-submenu>
            <el-menu-item v-if="!(checkNotNull(item.children) && !item.isPage) && !item.url" :index="item.router" :key="item.router" :route="{name: item.router}">
              <div class="menu_img" :style="`--img: url(/static/ManageSystem/img/${item.router}_icon.png);--activeImg:url(/static/ManageSystem/img/${item.router}_active_icon.png)`"></div>
              <span slot="title">{{ item.title }}</span>
            </el-menu-item>
            <el-menu-item v-if="item.url" :index="item.router" :key="item.router" @click="openUrl(item.url)">
              <div class="menu_img" :style="`--img: url(/static/ManageSystem/img/${item.router}_icon.png);--activeImg:url(/static/ManageSystem/img/${item.router}_active_icon.png)`"></div>
              <span slot="title">{{ item.title }}</span>
            </el-menu-item>
        </template>
      </el-menu>
    </div>
    
    <!-- 折叠按钮 -->
    <div class="menu_switch" @click="menuHide = !menuHide"></div>
    <!--  @click="menuHide = !menuHide" -->
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { checkNotNull } from "@/lib";
export default {
  data() {
    return {
      menuHide: false
    };
  },
  computed: {
    ...mapGetters(["systemMenus"])
  },
  methods: {
    checkNotNull(val) {
      return checkNotNull(val);
    },
    openUrl(url){
      window.open(url);
    }
  },
  created(){
    console.log(this.systemMenus)
  }
};
</script>

<style lang="scss" scoped>
.sidebar {
  height: calc(100% - 40px);
  background-color: transparent;
  box-sizing: border-box;
  position: relative;
  z-index: 99;
  overflow: hidden;

  width: 0px;
  animation: sidebarShow 0.5s linear 0s;
  animation-fill-mode: forwards;

  // 缩放
  &.sidebar_hide {
    animation: sidebarHide 0.5s linear 0s;
    animation-fill-mode: forwards;

    .menu_content {
      animation: menuHide 0.5s linear 0s;
      animation-fill-mode: forwards;
    }
  }

  @keyframes sidebarHide {
    from {
      width: 120px;
    }
    to {
      width: 0px;
    }
  }

  @keyframes sidebarShow {
    from {
      width: 0px;
    }

    to {
      width: 120px;
    }
  }

  @keyframes menuHide {
    from {
      top: 0;
    }

    to {
      top: 100%;
    }
  }

  @keyframes menuShow {
    from {
      top: 100%;
    }

    to {
      top: 0;
    }
  }

  .menu_content {
    height: calc(100% - 60px);
    width: 100%;
    position: relative;
    top: 0;
    left: 0;
    z-index:999;
    display: flex;
    flex-direction: column-reverse;
    justify-content: flex-start;

    animation: menuShow 0.5s linear 0s;
    animation-fill-mode: forwards;
    
  }

  // 菜单
  /deep/ .el-menu {
    position: absolute;
    background-color: transparent !important;
    border-right: 0;
    width: 88px;
    border:none;
    .el-menu-item,
    .el-submenu__title {
      background-color: transparent !important;
    }

    .el-menu-item,
    .el-submenu {
      width: 88px;
      height: 88px;
      margin-bottom: 10px;
      padding: 0 !important;

      > div {
        padding: 0 !important;
        width: 100%;
        height: 100%;

        img {
          width: 100%;
          height: 100%;
        }
      }

      &.is-active,
      &:hover {
        .menu_img {
          background-image: var(--activeImg);
        }
      }
      .menu_img {
        width: 100%;
        height: 100%;
        background-image: var(--img);
        background-repeat: repeat;
        background-position: center center;
        background-size: 100% 100%;
      }
    }
  }

  // 菜单开关
  .menu_switch {
    width: 88px;
    height: 88px;
    background: url(/static/Common/img/menu_switch_icon.png) no-repeat center
      center;
    background-size: 100% 100%;
    cursor: pointer;
    position: fixed;
    bottom: 7px;
  }
}

</style>
