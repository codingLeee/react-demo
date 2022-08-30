<!--  事件确认  -->
<template>
  <div class="eventConfirm-container system-container">
    <div class="eventConfirm-header query-header">
      <div class="queryBox" v-show="showQueryBox">
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
        <el-button size="small" type="primary" @click="openConfirmBox(select, 'oneclick')">一键确认</el-button>
        <el-button size="small" @click="openRemoveBox(select, 'oneclick')">一键忽略</el-button>
      </div>
    </div>

    <el-table ref="multipleTable" :data="tableData" height="80%" :cell-style="cellStyle" :header-cell-class-name="cellClass" @selection-change="handleSelectionChange">
      >
      <el-table-column type="selection" align="center" width="40" fixed="left">
      </el-table-column>
      <el-table-column type="index" width="60" label="序号" align="center" fixed="left">
      </el-table-column>
      <el-table-column prop="id" width="100" label="事件编码" align="center">
      </el-table-column>
      <el-table-column prop="alarmType" label="报警类型" width="100" align="center" :formatter="alarmTypeFormat">
      </el-table-column>
      <el-table-column prop="pointName" label="报警点位名称" min-width="180" show-overflow-tooltip align="center">
      </el-table-column>
      <el-table-column prop="addr" label="位置" min-width="180" show-overflow-tooltip align="center">
      </el-table-column>
      <el-table-column prop="testTime" label="报警时间" width="180" align="center">
      </el-table-column>
      <el-table-column prop="alarmStatus" label="报警状态" width="100" align="center" :formatter="alarmStatusFormat">
      </el-table-column>
      <el-table-column prop="alarmInfo" label="报警内容" width="160" show-overflow-tooltip align="center">
        <!--  :formatter="alarmInfoFormat"-->
        <template slot-scope="scope">
          <span v-if="scope.row.alarmType == 2">
            <span v-for="(item, index) in JSON.parse(scope.row.alarmInfo)" :key="index">
              <span v-if="item.factorStatus > 0" :class="myClass(item.factorStatus)">
                <span>{{ item.factorName }}</span>
                <span>{{ item.factorValue }}</span>
                <span>(</span><span>{{ getFactorRes(item) }}</span><span>);</span>
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
          <span v-if="scope.row.alarmType == 5">
            <span>{{ scope.row.alarmInfo }}</span>
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="pshName" label="所属排水户" width="160" show-overflow-tooltip align="center">
      </el-table-column>
      <el-table-column prop="pshType" label="排水户类型" align="center" width="160" :formatter="pshTypeFomatter">
      </el-table-column>
      <el-table-column prop="street" width="160" label="所属街道" align="center">
      </el-table-column>
      <el-table-column fixed="right" label="操作" align="center" width="170" class-name="actionColumn">
        <template slot-scope="scope">
          <el-button @click="handleClick(scope.row)" type="text" size="small">详情</el-button>
          <el-button type="text" size="small" @click="openConfirmBox(scope.row, 'primary')">确认</el-button>
          <el-button type="text" size="small" @click="openRemoveBox(scope.row, 'primary')">解除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="paginationContent">
      <el-pagination layout="total,prev, pager, next" :page-size="pageSize" :current-page="currentPage" :total="total" @size-change="handleSizeChange" @current-change="handleCurrentChange">
      </el-pagination>
    </div>

    <!-- 确认报警 -->
    <el-dialog :title="alarmDiaTitle" :visible.sync="openConfirmDialog" class="alarm_dialog">
      <el-form :model="alarmDiaForm" ref="alarmDiaForm">
        <el-form-item label="确认原因:" prop="reason">
          <el-input v-model="alarmDiaForm.reason" autocomplete="off" type="textarea" placeholder="请输入报警原因，可不填！"></el-input>
        </el-form-item>
        <el-form-item label="处置建议:" prop="advise">
          <el-input v-model="alarmDiaForm.advise" autocomplete="off" type="textarea" placeholder="请输入处置建议，可不填！"></el-input>
        </el-form-item>
        <el-form-item label="是否派单:" prop="dispatchRadio">
          <el-radio v-model="alarmDiaForm.dispatchRadio" label="1">是</el-radio>
          <el-radio v-model="alarmDiaForm.dispatchRadio" label="2">否</el-radio>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="openConfirmDialog = false">取 消</el-button>
        <el-button type="primary" @click="alarmConfirmEvent">完成</el-button>
        <el-button type="primary" @click="dispatchContinue" :disabled="alarmDiaForm.dispatchRadio == 2">继续派单</el-button>
      </div>
    </el-dialog>

    <!-- 解除报警 -->
    <el-dialog :title="remDiaTitle" :visible.sync="openRemoveDialog" class="alarm_dialog">
      <el-form :model="remAlarmDiaForm" ref="remAlarmDiaForm">
        <el-form-item label="消除报警原因:" prop="reason">
          <el-input v-model="remAlarmDiaForm.reason" autocomplete="off" type="textarea" placeholder="请输入消除报警原因，可不填！"></el-input>
        </el-form-item>
        <el-form-item label="处置建议:" prop="advise">
          <el-input v-model="remAlarmDiaForm.advise" autocomplete="off" type="textarea" placeholder="请输入处置建议，可不填！"></el-input>
        </el-form-item>
        <el-form-item label="是否派单:" v-show="oneClickRemBtn" prop="dispatchRadio">
          <el-radio v-model="remAlarmDiaForm.dispatchRadio" label="1">是</el-radio>
          <el-radio v-model="remAlarmDiaForm.dispatchRadio" label="2">否</el-radio>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="openRemoveDialog = false">取 消</el-button>
        <el-button type="primary" @click="alarmRemoveEvent">完成</el-button>
      </div>
    </el-dialog>
    <router-view></router-view>
  </div>
</template>
<script>
import {
  getRecentTable,
  getDataByType,
  getCurrentAlarmPeriod,
  getConfirmAlarm,
  getIgnoreAlarm,
  getBatchConfirmAlarm,
  getBatchIgnoreAlarm
} from "@/api/drainageOperation";
import { alarmTypeFormat, alarmStatusFormat, pshTypeFomatter, myClass } from "@/lib";

export default {
  data() {
    return {
      dateValue: [],
      tableData: [],
      select: [], //选中项
      selectedIDs: "", //选中ID
      checked: false, //是否全选
      showQueryBox: true,
      alarmTypeValue: "",
      alarmStatusValue: "",
      alarmTypeOptions: [],
      alarmStatusOptions: [],

      openConfirmDialog: false,
      openRemoveDialog: false,
      //确认弹框
      alarmDiaForm: {
        alarmDiaTypeValue: "",
        alarmDiaStatusValue: "",
        reason: "",
        advise: "",
        dispatchRadio: "1" //是否派单
      },
      //消除弹框
      remAlarmDiaForm: {
        remDiaTypeValue: "",
        remDDiaStatusValue: "",
        reason: "",
        advise: "",
        dispatchRadio: "" //是否派单
      },
      oneClickComfirmBtn: false, //一键确认
      oneClickRemBtn: false, //一键忽略
      alarmDiaTitle: "",
      remDiaTitle: "",
      dialogDetailsVisible: false,
      currentPage: 1,
      pageSize: 10,
      total: 0,
      pages: 0,
      alarmId: "",
      baseInfo: {}
    };
  },

  methods: {

    alarmTypeFormat,
    alarmStatusFormat,
    pshTypeFomatter,
    myClass,
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
    getFactorRes(t) {
      let m = t.factorName.toLowerCase();
      if(m.includes('ph')){
        let str = t.factorThreshold.toString();
        return `${str.substring(0, 1)}-${str.substring(1, str.length)}`
      }else {
        return t.factorThreshold
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
      if(this.$route.query.id){
        params.ids = this.$route.query.id
      }
      if (this.dateValue != null) {
        (params.startTime = this.dateValue[0]), //开始时间
          (params.endTime = this.dateValue[1]); //结束时间
      }
      const res = await getRecentTable(params);
      this.tableData = res.data.records;
      this.total = res.data.total;
      this.pages = res.data.pages;

      this.$nextTick(() => {
        if (this.$refs.multipleTable && this.$refs.multipleTable.doLayout) {
          this.$refs.multipleTable.doLayout();
        }
      });
    },

    //查看详情
    handleClick(val) {
      this.$router.push({
        name: "eventConfirmDetails",
        params: {
          alarmId: val.id
        }
      });
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
    //查询事件
    queryEvent() {
      this.getTableData();
    },

    //打开确认弹窗
    openConfirmBox(data, type) {
      if (type == "primary") {
        this.openConfirmDialog = this.openConfirmDialog == false ? true : false;
        this.oneClickComfirmBtn = false;
        this.alarmDiaTitle = "确认报警";
        this.alarmId = data.id;
      } else if (type == "oneclick") {
        //一键确认
        this.alarmId = this.selectedIDs;
        if (this.alarmId == "") {
          this.$message({
            message: "请选择确认事件",
            type: "warning"
          });
        } else {
          this.openConfirmDialog = true;
          this.oneClickComfirmBtn = true;
          this.alarmDiaTitle = "一键确认";
        }
      }
    },

    //打开解除弹窗
    openRemoveBox(data, type) {
      if (type == "primary") {
        this.openRemoveDialog = this.openRemoveDialog == false ? true : false;
        this.oneClickRemBtn = false;
        this.remDiaTitle = "解除报警";
        this.alarmId = data.id;
      } else if (type == "oneclick") {
        //一键确认
        this.alarmId = this.selectedIDs;
        if (this.alarmId == "") {
          this.$message({
            message: "请选择忽略事件",
            type: "warning"
          });
        } else {
          this.openRemoveDialog = true;
          this.oneClickRemBtn = true;
          this.remDiaTitle = "一键解除";
        }
      }
    },

    //确认报警
    async alarmConfirmEvent(type) {
      let params = {
        confirmReason: this.alarmDiaForm.reason,
        dealAdvice: this.alarmDiaForm.advise
      };
      let res;
      if (this.alarmDiaTitle == "确认报警") {
        (params.alarmId = this.alarmId), (res = await getConfirmAlarm(params));
      } else {
        (params.alarmIdStr = this.alarmId),
          (res = await getBatchConfirmAlarm(params));
      }

      if (res.code == 0) {
        this.openConfirmDialog = false;
        //继续派单，先完成再跳转
        if (type) {
          this.$router.push({ name: "eventDistribution" })
        } else {
          this.$message({
            message: "确认报警成功！",
            type: "success"
          });
          this.getTableData();
        }
      } else {
        this.$message.error("确认报警失败");
      }
    },

    //解除报警
    async alarmRemoveEvent() {
      let params = {
        ignoreReason: this.remAlarmDiaForm.reason,
        dealAdvice: this.remAlarmDiaForm.advise
      };
      let res;
      if (this.alarmDiaTitle == "确认报警") {
        (params.alarmId = this.alarmId), (res = await getIgnoreAlarm(params));
      } else {
        (params.alarmIdStr = this.alarmId),
          (res = await getBatchIgnoreAlarm(params));
      }
      if (res.code == 0) {
        this.$message({
          message: "解除报警成功！",
          type: "success"
        });
        this.openRemoveDialog = false;
        this.getTableData();
      } else {
        this.$message.error("解除报警失败");
      }
    },

    //继续派单
    dispatchContinue() {
      this.alarmConfirmEvent('sureDispatch')
    }
  },
  created() {
    this.initEventComfirmPage();
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
<style lang="scss">
.eventConfirm-container {
  position: relative;
  height: 100%;

  .alarm_dialog {
    .el-dialog {
      width: 800px;
      // height: 520px;

      .el-dialog__body {
        padding: 44px 44px 0;
      }

      .el-form-item__label {
        color: #96bef9;
        font-size: 16px;
      }
    }
  }
}
</style>