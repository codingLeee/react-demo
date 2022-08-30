<!--  事件管理 -->
<template>
  <div class="eventDetails-container system-container">
    <div class="eventDetails-header query-header">
      <div class="queryBox">
        <div class="box">
          <span class="">时间查询：</span>
          <el-date-picker v-model="dateValue" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" width="200" :default-time="['00:00:00', '23:59:59']" value-format="yyyy-MM-dd HH:mm:ss">
          </el-date-picker>
        </div>
        <div class="box">
          <span class="">报警类型：</span>
          <el-select v-model="alarmTypeValue" placeholder="请选择" clearable>
            <el-option v-for="item in alarmTypeOptions" :key="item.id" :label="item.name" :value="item.code">
            </el-option>
          </el-select>
        </div>
        <div class="box">
          <span class="">报警状态：</span>
          <el-select v-model="alarmStatusValue" placeholder="请选择" clearable>
            <el-option v-for="item in alarmStatusOptions" :key="item.id" :label="item.name" :value="item.code">
            </el-option>
          </el-select>
        </div>
        <div class="box">
          <span class="">事件状态：</span>
          <el-select v-model="eventStateValue" placeholder="请选择" clearable>
            <el-option v-for="item in eventStateOptions" :key="item.id" :label="item.name" :value="item.code">
            </el-option>
          </el-select>
        </div>
      </div>
      <div class="btnBox">
        <el-button type="primary" @click="queryEvent">搜索</el-button>
      </div>
    </div>
    <el-table ref="multipleTable" :data="tableData" height="80%">
      >
      <el-table-column type="index" width="60" label="序号" align="center" fixed="left">
      </el-table-column>
      <el-table-column prop="id" width="100" label="事件编码" align="center" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="alarmType" label="报警类型" width="120" align="center" :formatter="alarmTypeFormat" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="pointName" width="160" label="报警点位名称" align="center" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="addr" width="140" label="事件位置" align="center" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="testTime" width="180" label="报警时间" align="center" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="alarmInfo" min-width="160" show-overflow-tooltip label="事件内容" align="center">
        <!--  :formatter="alarmInfoFormat"-->
        <template slot-scope="scope">
          <span v-if="scope.row.alarmType == 2">
            <span v-for="(item, index) in JSON.parse(scope.row.alarmInfo)" :key="index">
              <span v-if="item.factorStatus > 0" :class="myClass(item.factorStatus)">
                <span>{{ item.factorName }}</span>
                <span>{{ item.factorValue }}</span>
                <span>(</span><span>{{ item.factorThreshold }}</span><span>);</span>
              </span>
            </span>
          </span>
          <span v-if="scope.row.alarmType == 1">
            <span v-for="(item, index) in JSON.parse(scope.row.alarmInfo)" :key="index">
              <span style="color:red">{{ item.deviceAlarmInfoTs }}</span>
            </span>
          </span>
          <span v-if="scope.row.alarmType == 4 || scope.row.alarmType == 5">
            <span>{{ scope.row.alarmInfo }}</span>
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="eventState" label="任务状态" width="120" align="center" :formatter="eventStateFomatter">
      </el-table-column>

      <el-table-column prop="pshName" min-width="180" show-overflow-tooltip label="所属排水户" align="center">
      </el-table-column>
      <el-table-column prop="pshType" label="排水户类型" align="center" width="140" :formatter="pshTypeFomatter">
      </el-table-column>
      <el-table-column prop="street" width="120" label="所属街道" align="center" show-overflow-tooltip>
      </el-table-column>
      <el-table-column fixed="right" label="操作" align="center" width="80">
        <template slot-scope="scope">
          <el-button @click="handleClick(scope.row)" type="text" size="small">详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="paginationContent">
      <el-pagination layout="total,prev, pager, next" :page-size="pageSize" :current-page="currentPage" :total="total" @size-change="handleSizeChange" @current-change="handleCurrentChange">
      </el-pagination>
    </div>
    <el-dialog title="查看详情" :visible.sync="dialogDetailsVisible" :style="`--height:${browserHeight}px`">
      <div class="event_detail">
        <div class="event_detail_base_info">
          <!-- 事件信息 -->
          <div class="event_info_content">
            <!-- 运维上报 -->
            <template v-if="baseInfo.alarmType == 4">
              <el-row>
                <el-col :span="12"><span>事件编码: </span>{{baseInfo.id}}</el-col>
                <el-col :span="12"><span>上报时间: </span>{{baseInfo.testTime}}</el-col>
              </el-row>
              <el-row>
                <el-col :span="12"><span>是否短信提醒: </span>{{baseInfo.isPushMsg}}</el-col>
                <el-col :span="12"><span>上报人: </span>{{baseInfo.reportPerson}}</el-col>
              </el-row>
              <el-row>
                <el-col :span="24"><span>事件内容: </span>{{baseInfo.alarmInfo}}</el-col>
              </el-row>
            </template>
            <!-- 其他 -->
            <template v-else>
              <el-row>
                <el-col :span="12"><span>事件编码: </span>{{baseInfo.id}}</el-col>
                <el-col :span="12"><span>报警类型: </span>{{baseInfo.alarmStatus | alarmTypeFilter}}</el-col>
              </el-row>
              <el-row>
                <el-col :span="12"><span>报警点位名称: </span>{{baseInfo.pointName}}</el-col>
                <el-col :span="12"><span>报警时间: </span>{{baseInfo.testTime}}</el-col>
              </el-row>
              <el-row>
                <el-col :span="12"><span>所属排水户: </span>{{baseInfo.pshName}}</el-col>
                <el-col :span="12"><span>排水户类型: </span>{{pshTypeFomatter(baseInfo)}}</el-col>
              </el-row>
              <el-row>
                <el-col :span="12"><span>所属街道: </span>{{baseInfo.street}}</el-col>
                <el-col :span="12"><span>事件位置: </span>{{baseInfo.addr}}</el-col>
              </el-row>
              <el-row>
                <el-col :span="24"><span>事件内容: </span>{{baseInfo.alarmInfo}}</el-col>
              </el-row>
            </template>

            <!-- 图片 运维上报、视频-->
            <template v-if="baseInfo.alarmType == 4 || baseInfo.alarmType == 3">
              <el-row>
                <el-col :span="24"><span>照片: </span></el-col>
              </el-row>
              <imgCarousel :img="baseInfo.alarmImgUrl"></imgCarousel>
            </template>
          </div>
        </div>

        <div class="event_log_content" v-if="checkNotNull(logoInfo)">
          <p class="event_log_content_tit">处理日志</p>
          <el-timeline class="event_log">
            <el-timeline-item v-for="(info, index) in logoInfo" :key="index" placement="top">
              <div class="event_log_time">{{info.createTime.split(" ")[0]}} <br /> {{info.createTime.split(" ")[1]}}</div>
              <div class="event_log_info">
                <p>上报人：{{ info.fromPerson }}</p>
                <p>{{ eventStateFomatter(info) }}</p>
              </div>
            </el-timeline-item>
          </el-timeline>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getDataByType, getEventDetails, getdetailInfoBase, getDispatchDetailInfoLog } from "@/api/drainageOperation";
import { checkNotNull, alarmTypeFormat, alarmStatusFormat, pshTypeFomatter, eventStateFomatter, alarmInfoFormat, myClass } from "@/lib";

export default {
  data() {
    return {
      dateValue: [],
      tableData: [],
      alarmTypeValue: "",
      alarmStatusValue: "",
      eventStateValue: "",
      alarmTypeOptions: [],
      alarmStatusOptions: [],
      eventStateOptions: [],

      dialogDetailsVisible: false,
      currentPage: 1,
      pageSize: 10,
      total: 0,
      pages: 0,
      alarmId: "",
      baseInfo: {},
      logoInfo: [], //时间线
      browserHeight: 0
    };
  },
  methods: {
    alarmTypeFormat,
    alarmStatusFormat,
    pshTypeFomatter,
    eventStateFomatter,
    alarmInfoFormat,
    myClass,
    checkNotNull(val) {
      return checkNotNull(val);
    },
    //报警类型
    async getAlarmType() {
      const res = await getDataByType({ type: "alarm_type" });
      //this.$store.commit("SET_dealStateOptions", res.data);
      this.alarmTypeOptions = res.data;
    },
    //报警状态
    async getAlarmStatus() {
      const res = await getDataByType({ type: "alarm_status" });
      //this.$store.commit("SET_dealStateOptions", res.data);
      this.alarmStatusOptions = res.data;
    },

    //事件状态
    async getEventState() {
      const res = await getDataByType({ type: "event_state" });
      this.eventStateOptions = res.data;
    },

    //获取基本信息
    async getBaseInfo(id) {
      const res = await getdetailInfoBase({ alarmId: id });
      const log = await getDispatchDetailInfoLog({ alarmId: id });
      this.logoInfo = log.data;
      this.baseInfo = res.data;
      this.baseInfo.alarmInfo = alarmInfoFormat(res.data);
      this.baseInfo.eventState = alarmTypeFormat(res.data);
      this.dialogDetailsVisible = true;
    },

    //初始化页面
    initEventComfirmPage() {
      this.getAlarmType();
      this.getAlarmStatus();
      this.getEventState();

      this.getTableData();
    },

    //获取表格数据
    async getTableData() {
      let params = {
        alarmStatus: this.alarmStatusValue,
        alarmType: this.alarmTypeValue,
        pageCurrent: this.currentPage,
        pageSize: this.pageSize,
        eventState: this.eventStateValue,
      };
      if (this.dateValue != null) {
        (params.startTime = this.dateValue[0]), //开始时间
          (params.endTime = this.dateValue[1]); //结束时间
      }
      const res = await getEventDetails(params);
      this.tableData = res.data.records;
      this.total = res.data.total;
      this.pages = res.data.pages;
    },

    //查看详情
    handleClick(val) {
      this.getBaseInfo(val.id);
    },

    //切换当前页的容量
    handleSizeChange(val) {
      this.pageSize = val;
    },
    //翻页
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getTableData();
    },

    //查询事件
    queryEvent() {
      this.getTableData();
    },


  },
  created() {
    this.initEventComfirmPage();

    // 弹框高度
    this.browserHeight =
      window.innerHeight ||
      document.documentElement.clientHeight ||
      document.body.clientHeight;
    this.browserHeight = this.browserHeight * 0.7;
  },
  watch: {

  },
};
</script>
<style lang="scss" scoped>
.eventDetails-container {
  height: 100%;

  /deep/ .el-dialog__body {
    max-height: var(--height);
  }
}
</style>