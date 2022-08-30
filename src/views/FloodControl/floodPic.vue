<template>
  <div class="realTime_monitor_map">
    <iframe
      id="floodPic"
      v-bind:src="floodUrl"
    ></iframe>
    <div class="iframe-url">
      <el-tooltip popper-class="map_menus_tooltip" class="item" effect="dark" :content="'气象预报'" placement="top">
         <div @click="qxyb()" class="flood-div"><img :src="`../../../../static/ManageSystem/img/tqyb.png`"/></div>
      </el-tooltip>
      <el-tooltip popper-class="map_menus_tooltip" class="item" effect="dark" :content="'卫星云图'" placement="top">
         <div @click="wxyt()" class="flood-div"><img :src="`../../../static/ManageSystem/img/wxyt.png`"></div>
      </el-tooltip>
    </div>
  </div>
</template>


<script>
export default {
  data() {
    return {
      floodUrl: process.env.FLOOD_API
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
  methods:{
    qxyb(){
      window.open('http://www.nmc.cn/publish/precipitation/1-day.html')
    },
    wxyt(){
      window.open('http://www.nmc.cn/publish/satellite/FY4A-true-color.htm')
    }
  }
};
</script>

<style lang="scss" scoped>
.realTime_monitor_map {
  width: 100%;
  height: 100%;
  position: fixed;
  left: 0;
  top: 0;

  iframe{
    width: 100%;
    height: 100%;
    border: none;
  }

  .iframe-url{
    position: absolute;
    bottom: 60px;
    right: 150px;
    overflow: hidden;
    .flood-div{
      width: 60px;
      height: 60px;
      margin-right: 20px;
      float: left;
      cursor: pointer;
      >img{
        width: 60px;
        height: 60px;
      }
    }
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
