<!--底部菜单-->
<template>
    <div class="bottom_menu">
        <ul class="tab_content" :class="{'tab_content_hide': tabContentShow}">
          <li 
            v-for="item in menuData" 
            :key="item['code']" 
            @click="tabClick(item['code'])" 
            :class="{active: activeName == item['code']}"
          >
            <img v-if="item['icon']" :src="`/static/ManageSystem/img/${item['icon']}`"/>
            {{item["name"]}}
          </li>
        </ul>
        <div class="bottom_menu_bg">
          <div v-show="checkNotNull(menuData)" class="tab_control" @click="tabContentShow = !tabContentShow"></div>
        </div>
    </div>
</template>

<script>
import {checkNotNull} from "@/lib";
export default {
  data() {
    return {
      tabContentShow: false,
      activeName:""
    };
  },
  props: {
    menuData: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  watch: {
    menuData: {
      deep: true,
      immediate: true,
      handler(val) {
        if(checkNotNull(val)){
          this.activeName = val[0]["code"]
        }else{
          this.activeName = "";
        }
        this.$store.commit("SET_activeTabName", this.activeName);
      }
    }
  },
  methods: {
    checkNotNull(val){
      return checkNotNull(val);
    },
    tabClick(e) {
      this.activeName = e;
      this.$store.commit("SET_activeTabName", e);
    }
  }
};
</script>

<style lang="scss" scoped>
.tabStyle {
  &::before {
    content: "";
    width: 0;
    height: 0;
    border-bottom: 32px solid #2238a7;
    border-left: 90px solid transparent;
    position: absolute;
    right: calc(100% - 3px);
    bottom: 0;
  }

  &::after {
    content: "";
    width: 0;
    height: 0;
    border-bottom: 33px solid rgba(123, 124, 204, 0.9);
    border-left: 93px solid transparent;
    position: absolute;
    right: calc(100% - 3px);
    bottom: 0;
    z-index: -1;
  }
}

.bottom_menu {
  position: fixed;
  width: 100%;
  bottom: 0;
  left: 0;

  .bottom_menu_bg {
    height: 40px;
    background-color: #152a87;
    border-top: 1px solid rgba(123, 124, 204, 0.6);
  }

  .tab_content {
    position: absolute;
    bottom: 100%;
    left: 50%;
    transform: translate(-50%, 0);
    z-index: -1;

    // tab显示隐藏
    animation: showTabContent 0.5s linear 0s;
    animation-fill-mode: forwards;

    &.tab_content_hide {
      animation: hideTabContent 0.5s linear 0s;
      animation-fill-mode: forwards;
    }

    @keyframes hideTabContent {
      from {
        bottom: 100%;
      }

      to {
        bottom: 0;
      }
    }

    @keyframes showTabContent {
      from {
        bottom: 0;
      }

      to {
        bottom: 100%;
      }
    }

    // tab
    li {
      float: left;
      cursor: pointer;
      color: rgba(255, 255, 255, 0.7);
      font-size: 16px;
      height: 32px;
      line-height: 32px;
      padding: 0 16px;
      border-top: 1px solid rgba(123, 124, 204, 0.9);
      margin: 0 2px;
      background-color: #2238a7;
      letter-spacing: 2px;

      &.active {
        color: rgba(255, 255, 255, 1);
        text-shadow: 0px 0px 20px rgba(76, 110, 255, 1);
        background-image: url(/static/Portal/img/tab_active_icon.png);
        background-repeat: no-repeat;
        background-position: center bottom -11px;
      }

      &:first-child {
        @extend .tabStyle;
      }

      &:last-child {
        @extend .tabStyle;

        &::before,
        &::after {
          transform: rotateY(-180deg);
          left: calc(100% - 3px);
          right: auto;
        }
      }
    }
  }

  // 切换tab按钮
  .tab_control {
    width: 26px;
    height: 26px;
    background: url(/static/Portal/img/tab_control_icon.png) no-repeat center
      center;
    background-size: 100% 100%;
    margin: 7px auto;
    cursor: pointer;

    &:hover {
      background: url(/static/Portal/img/tab_control_active_icon.png) no-repeat
        center center;
      background-size: 100% 100%;
    }
  }
}
</style>
