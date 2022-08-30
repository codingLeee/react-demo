<!--雨污泵站基本信息-->
<template>
    <div class="rainSewage_pumpingStation_baseInfo">
        <div class="baseInfo_top toggle_content toggle_left_5">
            <div class="panel_title">雨污泵站基本信息</div>
            <BaseInfoContatiner 
                title="提升泵房总数" 
                :total="366" 
                :rightWidth="62.93"
                firstTitle="雨水提升泵房"
                :firstNum="157"
                :firstTotal="366"
                secondTitle="污水提升泵房"
                :secondNum="109"
                :secondTotal="366"
            ></BaseInfoContatiner>
        </div>
        <div class="baseInfo_bottom toggle_content toggle_left_6">
            <div class="baseInfo_bottom_content">
                <p class="baseInfo_bottom_title">雨水提升站</p>
                <p class="baseInfo_bottom_num"><span>156</span><span>个</span></p>
            </div>
            <div class="line"></div>
            <div class="baseInfo_bottom_content">
                <p class="baseInfo_bottom_title">污水提升站</p>
                <p class="baseInfo_bottom_num"><span>156</span><span>个</span></p>
            </div>
        </div>
    </div>
</template>

<script>
import BaseInfoContatiner from "./components/BaseInfoContatiner";
export default {
  name: "RainSewagePumpingStationBaseInfo",
  components: { BaseInfoContatiner },
  data() {
    return {};
  }
};
</script>

<style lang="scss" scoped>
.rainSewage_pumpingStation_baseInfo {
  height: 29%;

  .baseInfo_top {
    height: 60.32%;
  }
  .baseInfo_bottom {
    height: 39.68%;
    display: flex;

    .baseInfo_bottom_content {
      // &:nth-child(1){
      //     border-right: 1PX solid #1E87C1;
      // }
      padding-left: 65px;

      &:nth-child(1) {
        background: url(~static/BigScreen/img/rainSewage_pumpingStation_baseInfo_left_icon.png)
          no-repeat left top;
        background-size: 55px 55px;
      }

      &:nth-child(3) {
        background: url(~static/BigScreen/img/rainSewage_pumpingStation_baseInfo_right_icon.png)
          no-repeat left top;
        background-size: 55px 55px;
      }

      .baseInfo_bottom_title {
        font-size: 16px;
        color: #d3d9d9;
        line-height: 13px;
      }

      .baseInfo_bottom_num {
        margin-top: 5px;
        span {
          color: #01f7b4;

          &:nth-child(1) {
            font-size: 29px;
            line-height: 42px;
            font-family: GothicThirteenStd;
            margin-right: 5px;
          }

          &:nth-child(2) {
            font-size: 12px;
            line-height: 13px;
          }
        }
      }
    }

    .line {
      width: 1px;
      background-color: #1e87c1;
      height: 58px;
      margin: 0 32px 0 17px;
    }
  }
}
</style>
