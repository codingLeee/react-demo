<template>
    <div :class="['system_panel',{'fullScreenPanel': checkNotNull(boxContorl) && (activeBoxContorl.indexOf('3') != -1)}]">
        <div class="panel_tit_content">
            <div class="panel_tit">{{title}}</div>
        </div>
        <div class="panel_content">
          <ul class="card_box_contorl" v-if="checkNotNull(boxContorl)">
            <!-- 地图关联 -->
            <li class="icon_1" v-show="boxContorl.indexOf('1') != -1 && activeBoxContorl.indexOf('4') == -1" :class="{'active': activeBoxContorl.indexOf('1') != -1}" @click="contorlFun('1')"></li>
            <!-- 地图下钻 -->
            <li class="icon_2" v-show="boxContorl.indexOf('2') != -1 && activeBoxContorl.indexOf('4') == -1" :class="{'active': activeBoxContorl.indexOf('2') != -1}" @click="contorlFun('2')"></li>
            <!-- 放大 -->
            <li class="icon_3" v-show="boxContorl.indexOf('3') != -1" :class="{'active': activeBoxContorl.indexOf('3') != -1}" @click="contorlFun('3')"></li>
            <!-- 切换列表 -->
            <li class="icon_4" v-show="boxContorl.indexOf('4') != -1" :class="{'active': activeBoxContorl.indexOf('4') != -1}" @click="contorlFun('4')"></li>
            <!-- 下载导出 -->
            <li class="icon_5" v-if="boxContorl.indexOf('5') != -1" :class="{'active': activeBoxContorl.indexOf('5') != -1}" @click="contorlFun('5')"></li>
          </ul>
          <div class="panel_content_div">
            <slot></slot>
          </div>
        </div>
    </div>
</template>

<script>
import { checkNotNull } from "@/lib";
export default {
  props: {
    title: {
      type: String,
      default: "标题"
    },
    boxContorl: {
      type: Array,
      default() {
        return [];
      }
    },
    activeBoxContorl: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  methods: {
    checkNotNull,
    contorlFun(code) {
      const _this = this;
      let codeIndex = _this.activeBoxContorl.indexOf(code);

      let newActiveBoxContorl = JSON.parse(
        JSON.stringify(_this.activeBoxContorl)
      );
      if (codeIndex == -1) {
        newActiveBoxContorl.push(code);
        _this.$emit("update:activeBoxContorl", newActiveBoxContorl);
      } else {
        newActiveBoxContorl.splice(codeIndex, 1);
        _this.$emit("update:activeBoxContorl", newActiveBoxContorl);
      }
      _this.$emit("contorlFun", code);
    }
  }
};
</script>

<style lang="scss" scoped>
.system_panel {
  height: 100%;
  border: 1px solid #3718d5;
  background-color: #101f70;
  box-shadow: 1px 0px 15px 5px rgba(68, 118, 247, 0.28) inset;
  color: #fff;
  position: relative;

  &.fullScreenPanel {
    position: absolute;
    z-index: 1;
    top: 0;
    left: 0;
    width: 100%;
    height: calc(100% - 55px);

    .fullScreenRow {
      height: 100%;
    }
  }

  .panel_tit_content {
    height: 38px;
    line-height: 38px;
    display: flex;
    justify-content: center;

    .panel_tit {
      text-align: center;
      padding: 0 60px;
      background: url(/static/Common/img/panel_bg.png) no-repeat center center;
      background-size: 100% 100%;
      font-size: 18px;
    }
  }

  .panel_content {
    height: calc(100% - 40px);
    .panel_content_div {
      width: 100%;
      height: 100%;
    }
  }

  .card_box_contorl {
    display: flex;
    position: absolute;
    top: 12px;
    right: 0;

    li {
      width: 22px;
      height: 22px;
      margin-right: 12px;
      cursor: pointer;

      @for $i from 1 through 6 {
        &.icon_#{$i} {
          background: url(/static/ManageSystem/img/monitoringIndicators_con_icon_#{$i}.png)
            no-repeat
            center
            center;
          background-size: contain;
          &.active {
            background: url(/static/ManageSystem/img/monitoringIndicators_con_active_icon_#{$i}.png)
              no-repeat
              center
              center;
            background-size: contain;
          }
        }
      }
    }
  }
}
</style>
