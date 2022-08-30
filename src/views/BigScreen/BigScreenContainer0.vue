<template>
  <div class="bigScreen_container">
    <!-- 头部 -->
    <div class="bigScreen_header">
      <h2>金牛区智慧排水一张图</h2>
      <div class="bigScreen_header_tips">
        <span>{{currDate}}</span>
        <span class="split_line"></span>
        <span>成都</span>
        <span class="split_line"></span>
        <!-- <div>晴天</div> -->
        <!-- <div>{{currDate}}</div> -->
      </div>
    </div>
    <!-- 主体 -->
    <div class="">
      <monitor-map></monitor-map>
    </div>
  </div>
</template>

<script>
import MonitorMap from "./MonitorMap";
export default {
  data() {
    return {
      currDate: ""
    };
  },
  components: { MonitorMap },
  mounted() {
    const _this = this;
    _this.$nextTick(() => {
      _this.currDate = _this.$moment(new Date()).format("hh:mm:ss");
    });
  }
};
</script>


<style lang="scss" scoped>
.bigScreen_container {
  width: 100%;
  height: 100%;
  // background-color: #101121;

  background: linear-gradient(
    90deg,
    #101121 0%,
    rgba(16, 17, 33, 0.07) 44%,
    #101121 100%
  );

  .bigScreen_header {
    padding: 0 34px 0 66px;
    position: relative;
    z-index: 2;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #fff;

    &::before {
      content: "";
      width: 90%;
      position: absolute;
      z-index: 1;
      top: 0;
      left: -20%;
      height: 368px;
      transform: translateY(-50%);
      width: 140%;
      background-image: radial-gradient(#2a88d0 0%, rgba(16, 17, 33, 0) 50%);
    }

    h2 {
      font-size: 34px;
      background: linear-gradient(0deg, #c2c7de 0%, #ffffff 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      padding: 31px 0 28px;
    }

    .bigScreen_header_tips {
      font-size: 25px;

      span {
        display: inline-flex;
        vertical-align: middle;
        padding: 0 12px;
      }

      .split_line {
        opacity: 0.44;
        height: 22px;
        width: 2px;
        padding: 0;
        background-color: #fff;
        margin-top: 2px;
      }
    }
  }
}
</style>
