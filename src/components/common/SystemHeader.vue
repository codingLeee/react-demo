<template>
  <div class="system_header">
    <div class="system_logo">
      <img src="/static/Common/img/logo.png" alt="" />
      {{ projectName }}
    </div>
    <div class="system_operation">
      <div class="system_operation_icon">
        <div>
          <el-badge :value="xcNum" class="item">
            <img
              src="/static/BigScreen/img/dbsx.png"
              alt=""
              @click="showDialog"
            />
          </el-badge>
        </div>
        <div>
          <el-badge :value="totolAlarm" class="item">
            <el-popover placement="bottom" trigger="hover">
              <div class="remind-con">
                <div>
                  <div>监测指标</div>
                  <div class="zb-red">{{ alarms.factorAlarmNum }}</div>
                </div>
                <div>
                  <div>设备故障</div>
                  <div class="zb-red">{{ alarms.deviceAlarmNum }}</div>
                </div>
                <div>
                  <div>视频识别</div>
                  <div class="zb-red">{{ alarms.ipcAlarmNum }}</div>
                </div>
                <div class="show-all" @click="toEventConfirm">查看全部</div>
              </div>
              <img
                src="/static/BigScreen/img/message.png"
                alt=""
                slot="reference"
              />
            </el-popover>
          </el-badge>
        </div>
        <div>
          <img
            src="/static/BigScreen/img/fhdp.png"
            alt=""
            @click="returnHome"
          />
        </div>
        <div>
          <img src="/static/BigScreen/img/head1.png" alt="" />
        </div>
        <!-- <el-button type="text" @click="returnHome">返回</el-button> -->
      </div>
    </div>
    <el-dialog
      title="最新待办"
      :visible.sync="dialogDetailsVisible"
      append-to-body
      width="35%"
    >
      <div class="problem-scroll">
        <div class="problem-item" v-for="(t, k) in checkList" :key="k">
          <div class="problem-item-type">{{ '巡查' }}</div>
          <div class="problem-item-des">
            <div class="problem-item-tip">{{ t.alarmInfo }}</div>
            <div class="problem-item-info">
              <img src="/static/BigScreen/img/voiter.png" alt="" />
              <span class="person-info">{{ t.reportPerson }}</span>
              <span>{{ t.testTime }}</span>
            </div>
          </div>
          <div class="problem-item-fire">
            <span :style="{'color':t.eventUrgency == '1' ? 'red' : '#fff'}">{{t.eventUrgency == '1' ? '紧急' : '日常'}}</span>
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="toDetail()">查看详情</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getAlarmBell } from "@/api/drainageOperation";
import bus from "./bus";
import {
  getProblemTodo
} from "@/api/drainageOperation";
export default {
  data() {
    return {
      collapse: false,
      dialogDetailsVisible: false,
      alarms: {
        deviceAlarmNum: 0,
        factorAlarmNum: 0,
        ipcAlarmNum: 0,
      },
      xcNum:0,
      checkList: [
      ],
    };
  },
  props: {
    projectName: {
      type: String,
      default: "",
    },
  },
  computed: {
    totolAlarm() {
      const _this = this;
      return (
        _this.alarms.deviceAlarmNum +
        _this.alarms.factorAlarmNum +
        _this.alarms.ipcAlarmNum
      );
    },
  },
  methods: {
    // 侧边栏折叠
    collapseChage() {
      this.collapse = !this.collapse;
      bus.$emit("collapse", this.collapse);
    },
    returnHome() {
      this.$router.push("/");
    },
    showDialog() {
      this.dialogDetailsVisible = true;
      this.getXcList();
    },
    async getXcList(){
      let res = await getProblemTodo();
      this.checkList = res.data;
      this.xcNum = res.data.length;
    },
    toDetail(){
      this.dialogDetailsVisible = false;
      let params = [];
      this.checkList.map((t) => {
        params.push(t.alarmId)
      })
      this.$router.push({
        name: 'eventConfirm',
        query: {
          id: params.join(',')
        }
      })
    },
    toEventConfirm() {
        this.$router.push({name:"eventConfirm"})
    },
    async getAlarms() {
      const res = await getAlarmBell();
      this.alarms = res.data;
    },
  },
  created() {
    this.getAlarms();
    this.getXcList();
  },
};
</script>
<style lang="scss" scoped>
@mixin systemHeaderStyle($backgroundDeg: 90deg, $borderImageDeg: 90deg) {
  background: linear-gradient(
    $backgroundDeg,
    rgba(34, 55, 161, 0.5) 0%,
    rgba(57, 26, 125, 0) 100%
  );

  border-image: linear-gradient(
      $borderImageDeg,
      rgba(73, 92, 228, 1) 0%,
      rgba(68, 35, 141, 0) 100%
    )
    1;
}

.system_header {
  box-sizing: border-box;
  height: 76px;
  display: flex;
  justify-content: space-between;
  color: #fff;
  position: relative;
  z-index: 1;

  > div {
    width: 615px;
    height: 60px;
    line-height: 60px;
    border-bottom: 1px solid #fff;
  }

  .system_logo {
    @include systemHeaderStyle();

    > img {
      width: 62px;
      height: 72px;
      float: left;
      margin-right: 11px;
    }

    font-family: FZZongYi-M05S;
    color: #e6f3ff;
    text-shadow: 2px 0px 3px rgba(0, 0, 0, 0.4);
    font-size: 30px;
  }

  .system_operation {
    @include systemHeaderStyle($backgroundDeg: -90deg, $borderImageDeg: -90deg);
    text-align: right;
    padding-right: 20px;
    overflow: hidden;

    .system_operation_icon {
      overflow: hidden;
      float: right;
      height: 100%;
      > div {
        float: left;
        height: 100%;
        margin-left: 24px;
        display: flex;
        align-items: center;
        .el-badge {
          display: flex;
          align-items: center;
          /deep/ .el-popover__reference-wrapper {
            display: flex;
            align-items: center;
            height: 100%;
          }
        }

        img {
          width: 30px;
          height: 30px;
          cursor: pointer;
        }
      }
    }
  }
}
.problem-scroll {
  max-height: 400px;
  overflow-y: scroll;
  overflow-x: hidden;
  width: 100%;
}
.problem-item {
  height: 60px;
  width: 100%;
  margin-bottom: 30px;
  > div {
    float: left;
    margin-right: 20px;
  }
  > div:nth-child(2) {
    margin-right: 40px;
    width: 300px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
}
.problem-item-type {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  line-height: 60px;
  text-align: center;
  color: #fff;
  font-size: 16px;
  background: #547dff;
}
.problem-item-info{
  height: 30px;
  line-height: 30px;
}
.problem-item-info > img {
  height: 16px;
  width: 14px;
  margin-right: 10px;
  margin-top: 5px;
  float: left;
}
.problem-item-info > span {
  margin-right: 40px;
}
.problem-item-des {
  font-size: 16px;
  color: #fff;
  > .problem-item-info {
    font-size: 14px;
    color: #c9caca;
    margin-top: 6px;
  }
}
.problem-item-fire {
  margin-right: 0;
  margin-top: 14px;
}
.remind-con > div {
  overflow: hidden;
  margin-bottom: 10px;
  > div:nth-child(1) {
    float: left;
  }
  > div:nth-child(2) {
    float: right;
  }
}
.show-all {
  text-align: center;
  color: #96bef9;
  cursor: pointer;
}
.zb-red {
  color: #e02c2c;
}
.problem-item-tip{
  max-width: 100%;
  overflow:hidden;
  white-space:nowrap;
  text-overflow:ellipsis;
}
.person-info{
  width: 100px;
  overflow:hidden;
  white-space:nowrap;
  text-overflow:ellipsis;
}
</style>
