<template>
    <div class="event_statistics system-container">
        <el-form :inline="true" class="search_content">
            <el-form-item>
                <el-radio-group v-model="selectType" @change="selectTypeChange">
                    <el-radio :label="1">时间范围</el-radio>
                    <el-radio :label="2">时间选项</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item v-show="selectType == 1">
                <el-date-picker
                    v-model="timeRange"
                    type="daterange"
                    range-separator="-"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期" 
                    @change="timeRangeChange"
                    format="yyyy-MM-dd"
                    :default-time="['00:00:00', '23:59:59']"
                    value-format="yyyy-MM-dd"
                >
                </el-date-picker>
            </el-form-item>
            <el-form-item v-show="selectType == 2">
                <el-radio-group class="statistical_analysis_radio" v-model="formData.dateType">
                    <el-radio label="day" border>日</el-radio>
                    <el-radio label="month" border>月</el-radio>
                    <el-radio label="year" border>年</el-radio>
                </el-radio-group>
            </el-form-item>
        </el-form>
        <div class="event_statistics_content">
            <el-row class="statistics_content_top" :gutter="20">
                <el-col :span="15">
                    <!-- 左上一 -->
                    <el-row class="statistics_content_left_top" :gutter="20">
                        <el-col :span="6">
                            <div class="statistics_total">
                                <div class="statistics_title">事件总数</div>
                                <div class="statistics_num">
                                    <p><span>{{eventNumInfo['all']['total']}}</span>件</p>
                                    <!-- <p>{{
                                        (((eventNumInfo[2] ? eventNumInfo[2]["per"] : 0) + 
                                        (eventNumInfo[1] ? eventNumInfo[1]["per"] : 0) + 
                                        (eventNumInfo[0] ? eventNumInfo[0]["per"] : 0) ) * 100).toFixed(2)
                                    }}%</p> -->
                                </div>
                            </div>
                        </el-col>                        
                        <el-col :span="6">
                            <div class="statistics_pending">
                                <div class="statistics_title">待处理</div>
                                <div class="statistics_num">
                                    <p><span>{{eventNumInfo['dcl']['num']}}</span>件</p>
                                    <p>{{(eventNumInfo['dcl']["per"]*100).toFixed(2)}}%</p>
                                </div>
                            </div>
                        </el-col>                        
                        <el-col :span="6">
                            <div class="statistics_inProcess">
                                <div class="statistics_title">处理中</div>
                                <div class="statistics_num">
                                    <p><span>{{eventNumInfo['clz']['num']}}</span>件</p>
                                    <p>{{(eventNumInfo['clz']["per"]*100).toFixed(2)}}%</p>
                                </div>
                            </div>
                        </el-col>                       
                        <el-col :span="6">
                            <div class="statistics_completed">
                                <div class="statistics_title">已完成</div>
                                <div class="statistics_num">
                                    <p><span>{{eventNumInfo['ywc']['num']}}</span>件</p>
                                    <p>{{(eventNumInfo['ywc']["per"]*100).toFixed(2)}}%</p>
                                </div>
                            </div>
                        </el-col>                              
                    </el-row>        
                    <!-- 左上二 -->
                    <el-row class="statistics_content_left_bt" :gutter="20">
                        <el-col :span="12">
                            <systemPanel title="事件来源统计">
                                <eventSourceStatistics :formData="formData"></eventSourceStatistics>
                            </systemPanel>
                        </el-col>                        
                        <el-col :span="12">
                            <systemPanel title="事件内容统计">
                                <eventContentStatistics :formData="formData"></eventContentStatistics>
                            </systemPanel>
                        </el-col>                      
                    </el-row>                    
                </el-col>
                <el-col :span="9">
                    <!-- 右上 -->
                    <systemPanel title="热点事件地区排名">
                        <hotEventRankHead :formData="formData"></hotEventRankHead>
                    </systemPanel>
                </el-col>
            </el-row>
            <el-row class="statistics_content_bt" :gutter="20">
                <el-col :span="12">
                    <systemPanel title="事件统计">
                        <streetEventStatistics :formData="formData"></streetEventStatistics>
                    </systemPanel>
                </el-col>                        
                <el-col :span="12">
                    <systemPanel title="事件高发地">
                        <highIncidenceArea :formData="formData"></highIncidenceArea>
                    </systemPanel>
                </el-col>                      
            </el-row>
        </div>
    </div>
</template>

<script>
import { getEventNum } from "@/api/drainageOperation";
import { awaitWrap, checkNotNull } from "@/lib";

import hotEventRankHead from "./eventStatistics/hotEventRankHead.vue";
import eventSourceStatistics from "./eventStatistics/eventSourceStatistics.vue";
import eventContentStatistics from "./eventStatistics/eventContentStatistics.vue";
import streetEventStatistics from "./eventStatistics/streetEventStatistics.vue";
import highIncidenceArea from "./eventStatistics/highIncidenceArea.vue";

export default {
  components: {
    hotEventRankHead,
    eventSourceStatistics,
    eventContentStatistics,
    streetEventStatistics,
    highIncidenceArea
  },
  data() {
    return {
      selectType: 1,
      timeRange: [],
      formData: {
        dateType: "day",
        endTime: "",
        starTime: ""
      },
      eventNumInfo: {
          all:{
              total:0
          },
          dcl:{
              num: 0,
              per: 0
          },
          clz:{
              num: 0,
              per: 0
          },
          ywc:{
              num: 0,
              per: 0
          }
      }
    };
  },
  watch: {
    formData: {
      deep: true,
      handler(val) {
        this.renderEventNum();
      }
    }
  },
  methods: {
    // 时间类型选择改变
    selectTypeChange(val) {
      if (val == 1) {
        this.formData.dateType = "";
        this.initTimeRange();
      } else {
        this.formData.dateType = "day";
        this.formData.starTime = this.formData.endTime = "";
      }
    },
    // 时间范围改变
    timeRangeChange(val) {
      if (val) {
        this.formData.endTime = val[1];
        this.formData.starTime = val[0];
      } else {
        this.formData.starTime = this.formData.endTime = "";
      }
    },
    // 初始化时间范围
    initTimeRange() {
      this.formData.starTime = this.formData.endTime = this.$moment(
        new Date()
      ).format("YYYY-MM-DD");
      this.timeRange = [this.formData.starTime, this.formData.starTime];
    },
    // 事件总数
    async renderEventNum() {
      const _this = this;
      let eventNumData = (await awaitWrap(getEventNum(_this.formData)))[1];
      let resultData;
      if (checkNotNull(eventNumData) && checkNotNull(eventNumData["data"])) {
        resultData = eventNumData["data"] || [];
      } else {
        resultData = [];
        }
      this.eventNumInfo = {
          all:{
              total:0
          },
          dcl:{
              num: 0,
              per: 0
          },
          clz:{
              num: 0,
              per: 0
          },
          ywc:{
              num: 0,
              per: 0
          }
      }
      for(let i = 0;i<resultData.length;i++){
          if(resultData[i]['total'] !== undefined){
              _this.eventNumInfo.all = resultData[i]
          }
          if(resultData[i]['type'] == '待处理'){
              _this.eventNumInfo.dcl = resultData[i]
          }
          if(resultData[i]['type'] == '处理中'){
              _this.eventNumInfo.clz = resultData[i]
          }
          if(resultData[i]['type'] == '已完成'){
              _this.eventNumInfo.ywc = resultData[i]
          }
      }
    }
  },
  mounted() {
    this.initTimeRange();
  }
};
</script>

<style lang="scss" scoped>
.event_statistics {
  height: 100%;
  position: relative;

  .search_content {
    .el-form-item {
      margin: 0;

      &:nth-child(1) {
        margin-right: 22px;
      }
    }

    position: absolute;
    right: 0;
    bottom: calc(100% + 10px);
  }

  .event_statistics_content {
    height: 100%;
    overflow-x: hidden;
    overflow-y: auto;

    /deep/ .el-row {
      > .el-col {
        height: 100%;
      }
    }

    // 左上第一部分
    .statistics_content_left_top {
      height: 140px;
      margin-bottom: 20px;

      .el-col {
        & > div {
          height: 100%;
          background-color: #101f70;
          box-shadow: inset 0px 4px 21px 1px
            rgba(68, 118, 247, 0.3019607961177826);
          border-radius: 0px 0px 0px 0px;
          border: 1px solid #3718d5;
          color: #6597ef;
          font-size: 14px;
          padding: 13px 19px;
          box-sizing: border-box;

          &:not(.statistics_total) {
            display: flex;
            justify-content: space-between;
          }

          .statistics_num {
            p {
              &:nth-child(1) {
                span {
                  font-size: 30px;
                  color: #cdfdff;
                }
              }
              &:nth-child(2) {
                margin-top: -8px;
                font-size: 12px;
                color: #81c784;
                text-align: right;
                padding-right: 20px;

                background: url(/static/ManageSystem/img/eventStatistics_top_trend_icon.png)
                  no-repeat center right;
                background-size: 16px 16px;
              }
            }
          }

          &.statistics_total {
            .statistics_title {
              font-weight: bold;
              font-size: 12px;
            }
            .statistics_num {
              display: flex;
              align-items: baseline;

              p {
                margin-right: 8px;
              }
            }
          }
        }

        @for $i from 1 through 4 {
          &:nth-child(#{$i}) {
            > div {
              background: url(/static/ManageSystem/img/eventStatistics_top_#{$i}_icon.png)
                no-repeat
                center
                bottom;
            }
          }
        }
      }

      //   .statistics_total{
      //       background: url(/static/ManageSystem/img/eventStatistics_top_1_icon.png) no-repeat center bottom;
      //   }

      //   .statistics_pending{
      //       background: url(/static/ManageSystem/img/eventStatistics_top_2_icon.png) no-repeat center bottom;
      //   }

      //   .statistics_inProcess{
      //       background: url(/static/ManageSystem/img/eventStatistics_top_3_icon.png) no-repeat center bottom;
      //   }

      //   .statistics_completed{
      //       background: url(/static/ManageSystem/img/eventStatistics_top_4_icon.png) no-repeat center bottom;
      //   }
    }

    .statistics_content_left_bt {
      height: 393px;
    }

    .statistics_content_top {
      height: 554px;
      margin-bottom: 20px;
    }

    .statistics_content_bt {
      height: 535px;
    }
  }
}
</style>
