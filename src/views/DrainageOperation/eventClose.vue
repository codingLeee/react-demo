<!--  事件确认  -->
<template>
  <div class="eventClose-container system-container">
    <div class="eventClose-header query-header">
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
          <el-button type="primary" @click="queryEvent">搜索</el-button>
        </div>
      </div>
      <div class="btnBox">
        <el-button size="small" type="primary" @click="openCloseBox()">
          一键结案
        </el-button>
      </div>
    </div>
    <el-table ref="multipleTable" :data="tableData" height="80%" :cell-style="cellStyle" :header-cell-class-name="cellClass" @selection-change="handleSelectionChange">
      >
      <el-table-column type="selection" align="center" fixed="left">
      </el-table-column>
      <el-table-column type="index" label="序号" width="60" align="center" fixed="left">
      </el-table-column>
      <el-table-column prop="id" width="100" label="事件编码" align="center" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="alarmType" label="报警类型" align="center" width="100" :formatter="alarmTypeFormat">
      </el-table-column>
      <el-table-column prop="pointName" label="报警点位名称" min-width="180" show-overflow-tooltip align="center">
      </el-table-column>
      <el-table-column prop="addr" label="位置" min-width="180" show-overflow-tooltip align="center">
      </el-table-column>
      <el-table-column prop="testTime" label="报警时间" min-width="180" align="center">
      </el-table-column>
      <el-table-column prop="alarmStatus" label="报警状态" align="center" width="140" :formatter="alarmStatusFormat">
      </el-table-column>
      <el-table-column prop="alarmInfo" label="报警内容" min-width="180" show-overflow-tooltip align="center">
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
          <span v-if="scope.row.alarmType == 4">
            <span>{{ scope.row.alarmInfo }}</span>
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="pshName" label="所属排水户" min-width="160" show-overflow-tooltip align="center">
      </el-table-column>
      <el-table-column prop="pshType" label="排水户类型" align="center" width="160" :formatter="pshTypeFomatter" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="street" label="所属街道" width="160" align="center" show-overflow-tooltip>
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

    <el-dialog title="一键结案" :visible.sync="openCloseDialog" width="450px">
      <el-form ref="form" class="dialog_form">
        <el-form-item label="请输入结案理由：">
          <el-input type="textarea" :rows="4" placeholder="请输入内容" v-model="batchDealReason">
          </el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="openCloseDialog = false">取 消</el-button>
        <el-button type="primary" @click="batchDealEvent">确认</el-button>
      </div>
    </el-dialog>

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

          <!-- 处理信息 -->
          <div class="process_info_content">
            <el-row>
              <el-col :span="12"><span>处理人: </span>{{dealInfo.fromPerson}}</el-col>
              <el-col :span="12"><span>处理时间: </span>{{dealInfo.createTime}}</el-col>
            </el-row>
            <el-row>
              <el-col :span="12"><span>处理状态: </span>已办结</el-col>
            </el-row>
            <el-row>
              <el-col :span="24"><span>处理结果: </span>{{dealInfo.handlerResult}}</el-col>
            </el-row>
            <el-row>
              <el-col :span="24"><span>照片: </span></el-col>
            </el-row>
            <imgCarousel :img="dealInfo.handlerImgStr"></imgCarousel>
          </div>
        </div>

        <!-- 处理日志 -->
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

      <el-dialog title="办结" :visible.sync="closeBoxVisible" append-to-body width="450px">
        <el-form ref="form" class="dialog_form">
          <el-form-item label="请输入结案理由：">
            <el-input type="textarea" :rows="4" placeholder="请输入内容" v-model="dealReason">
            </el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="closeBoxVisible = false">取 消</el-button>
          <el-button type="primary" @click="dealEvent">确认</el-button>
        </div>
      </el-dialog>

      <el-dialog title="退回" :visible.sync="backBoxVisible" append-to-body width="450px">
        <el-form ref="form" class="dialog_form">
          <el-form-item label="请输入退回理由：">
            <el-input type="textarea" :rows="4" placeholder="请输入内容" v-model="backReason">
            </el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="backBoxVisible = false">取 消</el-button>
          <el-button type="primary" @click="backEvent">确认</el-button>
        </div>
      </el-dialog>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogDetailsVisible = false">取 消</el-button>
        <el-button type="primary" @click="backBoxVisible = true">退回</el-button>
        <el-button type="primary" @click="closeBoxVisible = true">结束</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  getEventClose,
  getDataByType,
  getCurrentAlarmPeriod,
  postEventReturn,
  postBatchDealEvent,
  postDealEvent,
  getDealDetailEventInfo,
  getDealDetailInfo,
  getDealDetailInfoLog
} from "@/api/drainageOperation";
import { alarmTypeFormat, alarmStatusFormat, pshTypeFomatter, checkNotNull, alarmInfoFormat, eventStateFomatter, myClass } from "@/lib";
export default {
  data() {
    return {
      dateValue: [],
      tableData: [],
      select: [], //选中项
      selectedIDs: "", //选中ID
      checked: false, //是否全选

      alarmTypeValue: "",
      alarmStatusValue: "",
      alarmTypeOptions: [],
      alarmStatusOptions: [],

      openCloseDialog: false,
      batchDealReason: "", //一键结案理由
      backReason: "", //退回理由
      dealReason: "", //结案理由
      formLabelWidth: "100px",

      dialogDetailsVisible: false,
      closeBoxVisible: false,
      backBoxVisible: false,
      currentPage: 1,
      pageSize: 10,
      total: 0,
      pages: 0,
      alarmId: "",
      baseInfo: {},
      dealInfo: {},
      logoInfo: [], //时间线
      browserHeight: 0
    };
  },
  methods: {
    alarmTypeFormat, alarmStatusFormat, pshTypeFomatter, alarmInfoFormat, eventStateFomatter, myClass,
    //设置表头
    cellClass(row) {
      if (row.columnIndex == 0) {
        return "disableSelection";
      }
    },
    cellStyle(row, column, rowIndex, columnIndex) {
      //根据级别处理颜色
      if (row.column.label == "报警状态" && row.row.alarmStatus == "预警") {
        return "color:#F59A23";
      } else if (
        row.column.label == "报警状态" &&
        row.row.alarmStatus == "报警"
      ) {
        return "color:#D9001B";
      } else if (
        row.column.label == "报警状态" &&
        row.row.alarmStatus == "异常"
      ) {
        return "color:#6D000E";
      }
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

    //获取当前报警时段
    async getCurrentAlarm() {
      const res = await getCurrentAlarmPeriod();
      this.dateValue = [res.data.startTime, res.data.endTime];
    },

    //获取基本信息
    async getBaseInfo(id) {
      //事件信息
      const res = await getDealDetailEventInfo({ alarmId: id });
      //处理信息
      const deal = await getDealDetailInfo({ alarmId: id });
      //处理日志
      const log = await getDealDetailInfoLog({ alarmId: id });

      this.baseInfo = res.data;
      this.baseInfo.alarmInfo = this.alarmInfoFormat(res.data);

      this.dealInfo = deal.data;
      this.logoInfo = log.data;
      this.dialogDetailsVisible = true;
    },

    //初始化页面
    initEventComfirmPage() {
      this.getAlarmType();
      this.getAlarmStatus();
      this.getCurrentAlarm();

      this.getTableData();
    },

    //获取表格数据
    async getTableData() {
      let params = {
        alarmStatus: this.alarmStatusValue,
        alarmType: this.alarmTypeValue,
        pageCurrent: this.currentPage,
        pageSize: this.pageSize
      };
      if (this.dateValue != null) {
        (params.startTime = this.dateValue[0]), //开始时间
          (params.endTime = this.dateValue[1]); //结束时间
      }
      const res = await getEventClose(params);
      this.tableData = res.data.records;
      this.total = res.data.total;
      this.pages = res.data.pages;
    },

    //查看详情
    handleClick(val) {
      this.alarmId = val.id;
      this.getBaseInfo(val.id);
    },

    //一键结案
    async batchDealEvent() {
      let params = {
        alarmIdStr: this.alarmId,
        handlerResult: this.batchDealReason
      };
      const res = await postBatchDealEvent(params);
      if (res.code == 0) {
        this.$message({
          message: "结案成功！",
          type: "success"
        });
        this.openCloseDialog = false;
        this.getTableData();
      } else {
        this.$message.error("结案失败");
      }
    },
    //结案
    async dealEvent() {
      let params = {
        alarmId: this.alarmId,
        handlerResult: this.dealReason
      };
      const res = await postDealEvent(params);
      if (res.code == 0) {
        this.$message({
          message: "结案成功！",
          type: "success"
        });

        this.closeBoxVisible = false;
        this.dialogDetailsVisible = false;
        this.getTableData();
      } else {
        this.$message.error("结案失败");
      }
    },
    //退回
    async backEvent() {
      let params = {
        alarmId: this.alarmId,
        fromOperationPersonId: 1, //没token 先写死
        handlerRemark: this.backReason
      };
      const res = await postEventReturn(params);
      if (res.code == 0) {
        this.$message({
          message: "退回成功！",
          type: "success"
        });

        this.backBoxVisible = false;
        this.dialogDetailsVisible = false;
        this.getTableData();
      } else {
        this.$message.error("退回失败");
      }
    },

    handleSelectionChange(val) {
      this.select = val;
      let ids = [];
      this.select.map(item => {
        ids.push(item.id);
      });
      this.selectedIDs = ids.toString();
    },

    // 独立全选
    toggleSelection(val) {
      val
        ? this.$refs.multipleTable.toggleAllSelection()
        : this.$refs.multipleTable.clearSelection();
      this.checked = val;
    },
    changeShowQueryBox() {
      this.showQueryBox = this.showQueryBox ? false : true;
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

    checkNotNull(val) {
      return checkNotNull(val);
    },

    //查询事件
    queryEvent() {
      this.getTableData();
    },

    //打开确认弹窗
    openCloseBox() {
      //一键结案
      this.alarmId = this.selectedIDs;

      if (this.alarmId == "") {
        this.$message({
          message: "请选择结案事件",
          type: "warning"
        });
      } else {
        this.openCloseDialog = true;
      }
    }
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
    //清空弹框
    openConfirmDialog(val) {
      if (val == false) {
        this.$refs.alarmDiaForm.resetFields();
      }
    },
    openRemoveDialog(val) {
      if (val == false) {
        this.$refs.remAlarmDiaForm.resetFields();
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.eventClose-container {
  height: 100%;

  /deep/ .el-dialog__body {
    max-height: var(--height);
  }
}
</style>