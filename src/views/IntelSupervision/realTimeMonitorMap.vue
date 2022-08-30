<template>
  <div class="realTime_monitor_map">
    <iframe
      v-bind:src="realTimeUrl"
    ></iframe>
  </div>
</template>


<script>
export default {
  data() {
    return {
      realTimeUrl: process.env.REALTTIME_API
    };
  },
  mounted(){
    const _this = this;
    window.addEventListener('message', function (msg) {
        if(msg.data.type == 'passDataBack'){
            _this.$router.push({ path: '/drainageOperation/eventConfirm' });
        }
    })
  },
};
</script>

<style lang="scss" scoped>
.realTime_monitor_map {
  width: 100%;
  height: 100%;
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;

  iframe{
    width: 100%;
    height: 100%;
    border: none;
  }
}
/deep/ .mapboxgl-popup-content {
    color: #fff;
    width: 300px;
    background: linear-gradient(51deg, rgba(4, 32, 55, 0.6), rgba(4, 71, 118, 0.6), rgba(7, 125, 207, 0.6));
    padding: 14px 16px 19px;
    font-size: 15px;
    font-family: SourceHanSansCN-Regular;
    line-height: 25px;
    border-radius: 4px;
    border: 1px solid #1881C3;
    position: relative;

    // 泵站 运行情况
    .pointPumpInfo {
      // border: 1px solid #1881C3;

      li {
        width: 33.33333%;
        float: left;
        padding: 5px 0;
        box-sizing: border-box;
      }
    }
  }
/deep/ .mapboxgl-popup-tip{
  display: none;
}
</style>
