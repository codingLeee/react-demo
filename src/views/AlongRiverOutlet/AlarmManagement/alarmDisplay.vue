<template>
    <div class="alarmDisplay">
        <div class="alarmDisplay_top">
            <div class="title">{{title}}</div>
            <div class="total">{{total}}<span>个</span></div>
            <ul class="alarmDisplay_top_content">
                <li><div>待处理</div><div>{{alarmDisplayData["pending"]}}个</div></li>
                <li><div>处理中</div><div>{{alarmDisplayData["processed"]}}个</div></li>
                <li><div>已办结</div><div>{{alarmDisplayData["ending"]}}个</div></li>
            </ul>
        </div>
        <ul class="alarmDisplay_bottom">
            <li>
                <div class="title">待处理</div>
                <div class="progress"><span :style="`width:${alarmDisplayData['pendingPercent']}%`"></span></div>
                <div class="value">{{alarmDisplayData['pendingPercent']}}%</div>
            </li>
            <li>
                <div class="title">处理中</div>
                <div class="progress"><span :style="`width:${alarmDisplayData['processedPercent']}%`"></span></div>
                <div class="value">{{alarmDisplayData['processedPercent']}}%</div>
            </li>
            <li>
                <div class="title">已办结</div>
                <div class="progress"><span :style="`width:${alarmDisplayData['endingPercent']}%`"></span></div>
                <div class="value">{{alarmDisplayData['endingPercent']}}%</div>
            </li>
        </ul>
    </div>
</template>

<script>
export default {
  data() {
    return {
      total: 0,
      alarmDisplayData: {
        pending: 0,
        pendingPercent: 0,
        processed: 0,
        processedPercent: 0,
        ending: 0,
        endingPercent: 0
      }
    };
  },
  props: {
    data: {
      type: Array,
      default() {
        return [];
      }
    },
    title: {
      type: String,
      default: "累计报警数量"
    }
  },
  watch: {
    data: {
      immediate: true,
      deep: true,
      handler(val) {
        const _this = this;
        val.forEach(m => {
          _this.total += m["num"];
          if (m["eventState"] == "待处理") {
            _this.alarmDisplayData.pending = m["num"];
          } else if (m["eventState"] == "处理中") {
            _this.alarmDisplayData.processed = m["num"];
          } else if (m["eventState"] == "已办结") {
            _this.alarmDisplayData.ending = m["num"];
          }
        });

        _this.alarmDisplayData.pendingPercent = (
          _this.alarmDisplayData.pending /
          (_this.total||1) *
          100
        ).toFixed(2);
        _this.alarmDisplayData.processedPercent = (
          _this.alarmDisplayData.processed /
          (_this.total||1) *
          100
        ).toFixed(2);
        _this.alarmDisplayData.endingPercent = (
          _this.alarmDisplayData.ending /
          (_this.total||1) *
          100
        ).toFixed(2);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.alarmDisplay {
  width: 60%;
  margin: 0 auto;

  .alarmDisplay_top {
    margin: 28px 0 23px;
    height: 176px;
    background: url(~static/ManageSystem/img/alarm_situation_bg.png) no-repeat
      center center;
    background-size: 100% auto;
    position: relative;

    .title {
      font-size: 16px;
      position: absolute;
      right: 0;
      top: 10px;
    }

    .total {
      font-size: 25px;
      position: absolute;
      left: 22%;
      top: 50%;
      transform: translate(0, -50%);
      span {
        font-size: 14px;
      }
    }

    .alarmDisplay_top_content {
      position: absolute;
      right: 0;
      top: 28%;

      li {
        display: flex;
        justify-content: space-between;
        width: 150px;
        height: 35px;
        line-height: 35px;
        padding: 0 25px 0 18px;
        box-sizing: border-box;
        font-size: 12px;
        background: url(~static/ManageSystem/img/alarmDisplay_bg.png) no-repeat
          center center;
        background-size: 100% 100%;
        margin-bottom: 5px;

        > div {
          &:nth-child(2) {
            font-size: 14px;
            color: rgba(253, 0, 83, 1);
          }
        }

        &:nth-child(2) {
          > div {
            &:nth-child(2) {
              color: rgba(252, 105, 53, 1);
            }
          }
        }

        &:nth-child(3) {
          > div {
            &:nth-child(2) {
              color: rgba(27, 202, 255, 1);
            }
          }
        }
      }
    }
  }

  .alarmDisplay_bottom {
    font-size: 12px;
    li {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
      .title {
        width: 60px;
        padding-left: 6px;
      }
      .progress {
        flex: 1;
        height: 9px;
        background-color: rgba(53, 115, 252, 0.2);
        position: relative;
        span {
          display: inline-block;
          vertical-align: middle;
          height: 100%;
          position: absolute;
          z-index: 1;
          left: 0;
          top: 0;
          background-color: rgba(0, 183, 238, 1);
        }
      }
      .value {
        width: 60px;
        text-align: right;
      }

      &:nth-child(2) {
        .progress {
          span {
            background-color: rgba(53, 115, 252, 1);
          }
        }
      }

      &:nth-child(3) {
        .progress {
          span {
            background-color: rgba(128, 194, 105, 1);
          }
        }
      }
    }
  }
}
</style>
