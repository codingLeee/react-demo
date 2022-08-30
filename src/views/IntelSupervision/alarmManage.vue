<!-- 报警管理 -->
<template>
  <div class="alarmMng-container system-container">
    <div class="alarmMng-header query-header">
      <div class="queryBox">
        <div class="box">
          <span class="">时间：</span>
          <el-date-picker v-model="dateValue" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd">
          </el-date-picker>
        </div>
        <div class="box">
          <span class="">所属街道：</span>
          <el-select v-model="streesValue" placeholder="请选择" clearable>
            <el-option v-for="item in streesOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </div>
        <!-- <div class="box">
          <span class="">排水户类型：</span>
          <el-select
            v-model="houseHoldTypeValue"
            placeholder="请选择"
            clearable
          >
            <el-option
              v-for="item in houseHoldTypeOptions"
              :key="item.id"
              :label="item.name"
              :value="item.code"
            >
            </el-option>
          </el-select>
        </div> -->
        <div class="box">
          <span class="">点位类型：</span>
          <el-select v-model="pointTypeValue" placeholder="请选择">
            <el-option v-for="item in pointTypeOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </div>

        <div class="box">
          <span class="">排水户名称：</span>
          <el-input v-model="houseHoldName" autocomplete="off" placeholder="请输入"></el-input>
        </div>
      </div>
      <div class="btnBox">
        <el-button type="primary" @click="queryEvent">搜索</el-button>
        <el-button type="primary" @click="exportData()">数据导出</el-button>
      </div>
    </div>
    <el-table id="alarmMngTable1" ref="alarmMngTable1" :data="tableData" @filter-change="filterChange" v-if="activeTabName == 'indicators'">
      <el-table-column type="index" label="序号" align="center" fixed="left" width="60">
      </el-table-column>
      <el-table-column prop="subdistrict" label="所属街道" align="center" width="120" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="pshType" label="排水户类型" align="center" column-key="houseHoldTypeValue" :filter-multiple="false" :formatter="pshTypeFomatter" :filters="houseHoldTypeOptions" filter-placement="bottom-end" minWidth="120px" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="pshName" label="排水户名称" align="center" min-width="160" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="pointName" label="点位名称" align="center" width="140" show-overflow-tooltip>
      </el-table-column>

      <el-table-column prop="addr" label="排水户位置" width="140" align="center" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="alarmTime" label="报警时间" align="center" minWidth="140px" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="testValue" label="液位（m）" align="center" v-if="pointTypeFlag == 'ws'" show-overflow-tooltip>
        <template slot-scope="scope">
          <span :style="{ color: isLevelExceed(scope.row.testValue) }">{{
            scope.row.testValue
          }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="levelValue" label="液位（m）" align="center" v-if="pointTypeFlag == 'ys'" show-overflow-tooltip>
        <template slot-scope="scope">
          <span :style="{ color: isLevelExceed(scope.row.levelValue) }">{{
            scope.row.levelValue
          }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="phValue" key="pH" label="pH" align="center" v-if="pointTypeFlag == 'ys'" show-overflow-tooltip>
        <template slot-scope="scope">
          <span :style="{ color: isPhExceed(scope.row.phValue) }">{{
            scope.row.phValue
          }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="usValue" key="uS" label="电导率（uS/cm）" width="140" align="center" v-if="pointTypeFlag == 'ys'" show-overflow-tooltip>
        <template slot-scope="scope">
          <span :style="{ color: isConductanceExceed(scope.row.usValue) }">{{
            scope.row.usValue
          }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="dataState" label="点位状态" align="center" column-key="pointStatusValue" :filters="pointStatusOptions" :filter-multiple="false" filter-placement="bottom-end" show-overflow-tooltip>
        <template slot-scope="scope">
          <span :style="{ color: getStateColor(scope.row) }">{{
            dataStateFormatter(scope.row)
          }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="eventState" label="处理状态" align="center" column-key="handleStatusValue" :formatter="eventStateFomatter" :filters="handleStatusOptions" :filter-multiple="false" filter-placement="bottom-end" show-overflow-tooltip>
      </el-table-column>
      <el-table-column fixed="right" label="操作" align="center">
        <template slot-scope="scope">
          <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-table id="alarmMngTable2" ref="alarmMngTable2" :data="tableData" @filter-change="filterChange" v-else-if="activeTabName == 'equipment'">
      <el-table-column type="index" label="序号" align="center" fixed="left" width="60">
      </el-table-column>
      <el-table-column prop="subdistrict" label="所属街道" align="center" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="pshType" label="排水户类型" align="center" column-key="houseHoldTypeValue" :filter-multiple="false" :formatter="pshTypeFomatter" :filters="houseHoldTypeOptions" filter-placement="bottom-end" minWidth="120px" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="pshName" label="排水户名称" align="center" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="pointName" label="点位名称" align="center" show-overflow-tooltip>
      </el-table-column>

      <el-table-column prop="addr" label="排水户位置" align="center" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="alarmTime" label="故障时间" align="center" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="faultType" label="故障类型" align="center" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="eventState" label="处理状态" align="center" column-key="handleStatusValue" :formatter="eventStateFomatter" :filters="handleStatusOptions" :filter-multiple="false" filter-placement="bottom-end" show-overflow-tooltip>
      </el-table-column>
      <el-table-column fixed="right" label="操作" align="center">
        <template slot-scope="scope">
          <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="paginationContent">
      <el-pagination layout="prev, pager, next" :page-size="pageSize" :current-page="currentPage" :total="total" @size-change="handleSizeChange" @current-change="handleCurrentChange">
      </el-pagination>
      <span>共{{ total }}条</span>
    </div>

    <el-dialog width="75%" :visible.sync="dialogDetailsVisible" class="tile-dialog" :destroy-on-close="true" title="查看详情">
      <div class="tile-dialog-body">
        <div class="process_status_content">
          <ul class="circle-container">
            <li class="circle_0" :class="{ active: dialogInfo.eventState == 0 }">
              <p></p>
              <p>
                {{ activeTabName == "indicators" ? "点位报警" : "设备故障" }}
              </p>
            </li>
            <li class="circle_1" :class="{ active: dialogInfo.eventState == 1 }">
              <p></p>
              <p>事件确认</p>
            </li>
            <li class="circle_2" v-if="dialogInfo.eventState == -1 || dialogInfo.eventState < -1" :class="{ active: dialogInfo.eventState == -1 }">
              <p></p>
              <p>事件已忽略</p>
            </li>
            <template v-else>
              <li class="circle_3" :class="{ active: dialogInfo.eventState == 2 }">
                <p></p>
                <p>事件分发</p>
              </li>
              <li class="circle_4" :class="{ active: dialogInfo.eventState == 3 }">
                <p></p>
                <p>待处理</p>
              </li>
              <li class="circle_5" :class="{ active: dialogInfo.eventState == 4 }">
                <p></p>
                <p>处理中</p>
              </li>
              <li class="circle_6" :class="{ active: dialogInfo.eventState == 5 }">
                <p></p>
                <p>已完成</p>
              </li>
            </template>
          </ul>
        </div>

        <div class="tile-dialog-box" v-if="activeTabName == 'indicators'">
          <div class="info-container">
            <el-descriptions :column="4" :labelStyle="{
                'text-align': 'right;',
                width: '30%;',
                display: 'inline-block;',
              }">
              <el-descriptions-item label="报警时间">
                <div class="desc">
                  <el-tooltip class="item" effect="dark" :content="dialogInfo.alarmTime" placement="top">
                      <div>{{ dialogInfo.alarmTime }}</div>
                  </el-tooltip>
                </div>
              </el-descriptions-item>
              <el-descriptions-item label="点位状态">
                <div class="desc">
                  <el-tooltip class="item" effect="dark" :content="dataStateFormatter({dataState:dialogInfo.dataState})" placement="top">
                      <div>{{ dataStateFormatter({dataState:dialogInfo.dataState}) }}</div>
                  </el-tooltip>
                </div>
              </el-descriptions-item>
              <el-descriptions-item label="处理状态">
                <div class="desc">
                  <el-tooltip class="item" effect="dark" :content="eventStateFomatter({eventState:dialogInfo.eventStateName})" placement="top">
                      <div>{{ eventStateFomatter({eventState:dialogInfo.eventStateName}) }}</div>
                  </el-tooltip>
                </div>
              </el-descriptions-item>
              <el-descriptions-item label="是否短信提示">
                <div class="desc">
                  <el-tooltip class="item" effect="dark" :content="dialogInfo.isPushMsg" placement="top">
                      <div>{{ dialogInfo.isPushMsg }}</div>
                  </el-tooltip>
                </div>
              </el-descriptions-item>
            </el-descriptions>
            <el-descriptions :column="4" v-if="pointTypeFlag == 'ws'">
              <el-descriptions-item label="数据项">
                <div class="desc">液位</div>
              </el-descriptions-item>
              <el-descriptions-item label="监测值">
                <div class="desc">
                  <el-tooltip class="item" effect="dark" :content="dialogInfo.testValue" placement="top">
                      <div>{{ dialogInfo.testValue }}</div>
                  </el-tooltip>
                </div>
              </el-descriptions-item>
              <el-descriptions-item label="阈值">
                <div class="desc">
                  <el-tooltip class="item" effect="dark" :content="dialogInfo.threshold" placement="top">
                      <div>{{ dialogInfo.threshold }}</div>
                  </el-tooltip>
                </div>
              </el-descriptions-item>
              <el-descriptions-item label="数据状态">
                <div class="desc">
                  <el-tooltip class="item" effect="dark" :content="levelStateFormatter(dialogInfo.dataState)" placement="top">
                      <div>{{ levelStateFormatter(dialogInfo.dataState) }}</div>
                  </el-tooltip>
                </div>
              </el-descriptions-item>
            </el-descriptions>
            <el-descriptions :column="4" v-for="(item, index) in dialogInfo.dataList" :key="index">
              <el-descriptions-item label="数据项">
                <div class="desc">
                  <el-tooltip class="item" effect="dark" :content="item.dataType" placement="top">
                      <div>{{ item.dataType }}</div>
                  </el-tooltip>
                </div>
              </el-descriptions-item>
              <el-descriptions-item label="监测值">
                <div class="desc">
                  <el-tooltip class="item" effect="dark" :content="item.levelValue" placement="top">
                      <div>{{ item.levelValue }}</div>
                  </el-tooltip>
                </div>
              </el-descriptions-item>
              <el-descriptions-item label="阈值">
                <div class="desc">
                  <el-tooltip class="item" effect="dark" :content="getYz(item)" placement="top">
                      <div>{{ getYz(item) }}</div>
                  </el-tooltip>
                </div>
              </el-descriptions-item>
              <el-descriptions-item label="数据状态">
                <div class="desc">
                  <el-tooltip class="item" effect="dark" :content="item.dataState" placement="top">
                      <div>{{ item.dataState }}</div>
                  </el-tooltip>
                </div>
              </el-descriptions-item>
            </el-descriptions>
            <el-descriptions :column="2" style="width: 50%" v-for="(item, index) in dialogInfo.personInfo" :key="index">
              <el-descriptions-item label="处理人">
                <div class="desc">
                  <el-tooltip class="item" effect="dark" :content="item.personName" placement="top">
                      <div>{{ item.personName }}</div>
                  </el-tooltip>
                </div>
              </el-descriptions-item>
              <el-descriptions-item label="联系方式">
                <div class="desc">
                  <el-tooltip class="item" effect="dark" :content="item.phone" placement="top">
                      <div>{{ item.phone }}</div>
                  </el-tooltip>
                </div>
              </el-descriptions-item>
            </el-descriptions>
          </div>
        </div>

        <div class="tile-dialog-box" v-if="activeTabName == 'equipment'">
          <div class="info-container">
            <el-descriptions :column="4">
              <el-descriptions-item label="故障时间">
                <div class="desc">
                  <el-tooltip class="item" effect="dark" :content="dialogInfo.alarmTime" placement="top">
                      <div>{{ dialogInfo.alarmTime }}</div>
                  </el-tooltip>
                </div>
              </el-descriptions-item>
              <el-descriptions-item label="故障状态">
                <div class="desc">
                  <el-tooltip class="item" effect="dark" :content="dialogInfo.faultType" placement="top">
                      <div>{{ dialogInfo.faultType }}</div>
                  </el-tooltip>
                </div>
              </el-descriptions-item>
              <el-descriptions-item label="故障原因">
                <div class="desc">
                  <el-tooltip class="item" effect="dark" :content="dialogInfo.alarmReason" placement="top">
                      <div>{{ dialogInfo.alarmReason }}</div>
                  </el-tooltip>
                </div>
              </el-descriptions-item>
            </el-descriptions>
            <el-descriptions :column="2" style="width: 50%">
              <el-descriptions-item label="处理状态">
                <div class="desc">
                  <el-tooltip class="item" effect="dark" :content="eventStateFomatter({eventState:dialogInfo.eventStateName})" placement="top">
                      <div>{{ eventStateFomatter({eventState:dialogInfo.eventStateName}) }}</div>
                  </el-tooltip>
                </div>
              </el-descriptions-item>
              <el-descriptions-item label="是否短信提示">
                <div class="desc">
                  <el-tooltip class="item" effect="dark" :content="dialogInfo.isPushMsg" placement="top">
                      <div>{{ dialogInfo.isPushMsg }}</div>
                  </el-tooltip>
                </div>
              </el-descriptions-item>
            </el-descriptions>
            <el-descriptions :column="2" style="width: 50%" v-for="(item, index) in dialogInfo.personInfo" :key="index">
              <el-descriptions-item label="处理人">
                <div class="desc">
                  <el-tooltip class="item" effect="dark" :content="item.personName" placement="top">
                      <div>{{ item.personName }}</div>
                  </el-tooltip>
                </div>
              </el-descriptions-item>
              <el-descriptions-item label="联系方式">
                <div class="desc">
                  <el-tooltip class="item" effect="dark" :content="item.phone" placement="top">
                      <div>{{ item.phone }}</div>
                  </el-tooltip>
                </div>
              </el-descriptions-item>
            </el-descriptions>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  getAlarmIndexInfo,
  getDeviceAlarm,
  getPersonByAlarmId,
} from "@/api/IntelSupervision";
import {
  isPhExceed,
  isLevelExceed,
  isConductanceExceed,
  levelStateFormatter,
  pshTypeFomatter,
  dataStateFormatter,
  eventStateFomatter
} from "@/lib";
import { mapState } from "vuex";
export default {
  data() {
    return {
      tableData: [],
      streesOptions: [],
      houseHoldTypeOptions: [],
      pointTypeOptions: [
        {
          value: "ws",
          label: "污水井",
        },
        {
          value: "ys",
          label: "雨水井",
        },
      ],
      pointStatusOptions: [],
      handleStatusOptions: [
        {
          text: "已分发",
          value: 2,
        },
        {
          text: "已反馈",
          value: 5,
        },
        {
          text: "已忽略",
          value: -1,
        },
        {
          text: "已审核",
          value: 4,
        },
        {
          text: "已退回",
          value: -2,
        },
        {
          text: "处理中",
          value: 3,
        },
        {
          text: "已确认",
          value: 1,
        },
        {
          text: "点位报警",
          value: 0,
        },
      ],

      dateValue: "",
      streesValue: "",
      houseHoldTypeValue: "",
      pointTypeValue: "ws",
      houseHoldName: "",
      pointStatusValue: "",
      handleStatusValue: "",
      currentPage: 1,
      pageSize: 10,
      total: 0,
      pages: 0,
      pointTypeFlag: "ws",
      dialogDetailsVisible: false,
      dialogInfo: {
        //personInfo:[]
      }, //弹出框信息
    };
  },
  methods: {
    isPhExceed,
    isLevelExceed,
    isConductanceExceed,
    levelStateFormatter,
    pshTypeFomatter,
    dataStateFormatter,
    eventStateFomatter,
    filterChange(e) {
      if (e.houseHoldTypeValue) {
        this.houseHoldTypeValue = e.houseHoldTypeValue[0];
      }
      if (e.pointStatusValue) {
        this.pointStatusValue = e.pointStatusValue[0];
      }
      if (e.handleStatusValue) {
        this.handleStatusValue = e.handleStatusValue[0];
      }
      this.queryEvent();
    },
    cellStyle(row, column, rowIndex, columnIndex) { },
    initAlarmPage() {
      let queryParams = {
        pointType: this.pointTypeValue, //点位类型
        current: this.currentPage,
        pageSize: this.pageSize,
      };

      //   this.dateValue = "";
      //   this.streesValue = "";
      //   this.houseHoldTypeValue = "";
      //   this.pointTypeValue = "ws";
      //   this.houseHoldName = "";
      //   this.pointStatusValue = "";
      //   this.handleStatusValue = "";
      //   this.pointTypeFlag = "ws";
      //   this.dialogInfo = {};

      this.getTableData(queryParams);
    },
    //获取表格数据
    async getTableData(params) {
      //指标
      let res;
      if (this.activeTabName == "indicators") {
        res = await getAlarmIndexInfo(params);
      } else if (this.activeTabName == "equipment") {
        res = await getDeviceAlarm(params);
      }

      this.tableData = res.data.records;
      this.total = res.data.total;
      this.pages = res.data.pages;
    },

    //查看
    handleClick(data) {
      this.dialogInfo.dataState = data.dataState;
      this.dialogInfo.alarmTime = data.alarmTime;
      this.dialogInfo.testValue = data.testValue;
      this.dialogInfo.threshold = data.threshold;
      this.dialogInfo.eventState = parseInt(data.eventState);
      this.dialogInfo.eventStateName = data.eventState;
      this.dialogInfo.isPushMsg = data.isPushMsg;
      this.dialogInfo.dataList = data.dataList;
      this.dialogInfo.faultType = data.faultType;
      this.dialogInfo.alarmReason = data.alarmReason;
      this.getPersonInfo(data.alarmId);
    },
    //查看 运维人员信息

    async getPersonInfo(id) {
      let param = {
        alarmId: id,
      };
      const res = await getPersonByAlarmId(param);
      console.log(res);
      let data = res.data;
      let handleData = [];
      for (let i = 0; i < data.length; i++) {
        if (data[i]) {
          handleData.push(data[i])
        }
      }
      if (handleData[0] != null) {
        this.dialogInfo.personInfo = handleData;
      } else {
        this.dialogInfo.personInfo = [];
      }

      this.dialogDetailsVisible = true;
      console.log(this.dialogInfo.personInfo);
    },
    //查询
    queryEvent() {
      this.pointTypeFlag = this.pointTypeValue; //表格分情况显示
      this.currentPage = 1;
      let queryParams = {
        startTimeStr: this.dateValue ? this.dateValue[0] : "", //开始时间
        endTimeStr: this.dateValue ? this.dateValue[1] : "", //结束时间
        subdistrict: this.streesValue, //街道
        pshType: this.houseHoldTypeValue, //排水户类型
        pointType: this.pointTypeValue, //点位类型
        dataState: this.pointStatusValue, //点位状态
        eventState: this.handleStatusValue, //处理状态
        pshName: this.houseHoldName, //排水户名称
        current: this.currentPage,
        pageSize: this.pageSize,
      };
      this.getTableData(queryParams);
    },
    getYz(data) {
      if (data.dataType.includes('ph')) {
        let str = data.levelThreshold;
        return `${str.substring(0, 1)}-${str.substring(1, str.length)}`
      } else {
        return data.levelThreshold
      }
    },

    getStateColor(row) {
      //点位状态
      switch (row.dataState) {
        case 1:
          return "#FF0000";
        case 2:
          return "#e6a23c";
        case 3:
          return "#e6a23c";
      }
    },

    //切换当前页的容量
    handleSizeChange(val) {
      this.pageSize = val;
    },
    //翻页
    handleCurrentChange(val) {
      this.currentPage = val;
      this.initAlarmPage();
    },

    //导出功能
    exportData() {
      let name, id;
      if (this.activeTabName == "equipment") {
        name = "监测设备故障管理";
        id = "alarmMngTable2";
      } else {
        name = "监测指标报警管理";
        id = "alarmMngTable1";
      }
      let excelName = name + ".xlsx";
      var xlsxParam = { raw: true }; //转换成excel时，使用原始的格式
      // 克隆节点
      let tables = document.getElementById(id).cloneNode(true);
      // 判断是否为固定列，解决（为固定列时，会重复生成表格）
      if (tables.querySelector(".el-table__fixed") !== null) {
        tables.removeChild(tables.querySelector(".el-table__fixed"));
      }
      //去掉操作
      if (tables.querySelector(".el-table__fixed-right") !== null) {
        tables.removeChild(tables.querySelector(".el-table__fixed-right"));
      }
      let tableHeader = tables.querySelector(".el-table__header-wrapper");
      let headerDom = tableHeader.childNodes[0].querySelectorAll("th");
      for (let key in headerDom) {
        if (headerDom[key].innerText === "操作") {
          headerDom[key].remove();
        }
      }

      let table_book = this.$XLSX.utils.table_to_book(tables, xlsxParam);
      var table_write = this.$XLSX.write(table_book, {
        bookType: "xlsx",
        bookSST: true,
        type: "array",
      });
      try {
        this.$FileSaver.saveAs(
          new Blob([table_write], { type: "application/octet-stream" }),
          excelName
        );
      } catch (e) {
        if (typeof console !== "undefined") console.log(e, table_write);
      }
      return table_write;
    },
  },
  created() {
    this.streesOptions = this.$store.state.IntelSupervison.streesOptions;
    this.pointStatusOptions =
      this.$store.state.IntelSupervison.pointStatusOptions;
    let option = [];
    this.pointStatusOptions.map((t) => {
      if (t.name !== "正常" && t.name !== "设备故障") {
        option.push({
          value: t.code,
          text: t.name,
        });
      }
    });
    this.pointStatusOptions = option;
    this.houseHoldTypeOptions =
      this.$store.state.IntelSupervison.houseHoldTypeOptions;
    this.houseHoldTypeOptions.forEach((m) => {
      m["value"] = m["code"];
      m["text"] = m["name"];
    });
    this.equipStatusOptions =
      this.$store.state.IntelSupervison.equipStatusOptions;
    // this.handleStatusOptions = this.$store.state.IntelSupervison.dealStateOptions;
    // this.handleStatusOptions.forEach(m=>{
    //     m["value"] = m["code"];
    //     m["text"] = m["name"];
    // })
    if (this.activeTabName) {
      this.initAlarmPage();
    }
  },
  computed: {
    ...mapState({
      activeTabName: (state) => state.IntelSupervison.activeTabName,
    }),
  },
  watch: {
    activeTabName(val) {
      if (val) {
        this.pointTypeValue = "ws";
        this.queryEvent()
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.alarmMng-container {
  height: 100%;
  position: relative;

  .tile-dialog {
    // 步骤条
    .process_status_content {
      width: 100%;
      display: flex;
      justify-content: center;
      padding: 23px 0 35px;

      ul {
        display: flex;
        position: relative;
        &::after {
          content: "";
          height: 16px;
          width: 100%;
          position: absolute;
          background: #1b47bf;
          border-radius: 8px 8px 8px 8px;
          top: 29px;
          left: 0;
          z-index: -1;
        }

        li {
          width: 74px;
          margin: 0 33px;
          text-align: center;

          font-size: 16px;
          color: rgba(255, 255, 255, 0.6);

          p {
            &:nth-child(1) {
              height: 74px;
              border-radius: 50%;
              background: #1b47bf;
              position: relative;

              &::after {
                content: "";
                position: absolute;
                width: 58px;
                height: 58px;
                border-radius: 50%;
                top: 8px;
                left: 8px;
              }
            }

            &:nth-child(2) {
              height: 34px;
              line-height: 34px;
            }
          }

          &.active {
            color: #fff;

            @for $i from 0 through 6 {
              &.circle_#{$i} {
                p {
                  &:nth-child(1) {
                    &::after {
                      background: url(/static/ManageSystem/img/process_status_#{$i}_1_icon.png)
                        #2b63e7
                        no-repeat
                        center
                        center;
                      background-size: 32px 32px;
                    }
                  }
                }
              }
            }
          }
        }

        @for $i from 0 through 6 {
          .circle_#{$i} {
            p {
              &:nth-child(1) {
                &::after {
                  background: url(/static/ManageSystem/img/process_status_#{$i}_icon.png)
                    #2b63e7
                    no-repeat
                    center
                    center;
                  background-size: 32px 32px;
                }
              }
            }
          }
        }
      }
    }

    .tile-dialog-box {
      /deep/ .el-descriptions {
        .el-descriptions__body {
          font-size: 16px;
          color: #fff;

          background-color: transparent;
          border: 0;

          .el-descriptions-item__container {
            height: 40px;
            line-height: 40px;
            .el-descriptions-item__label {
              width: 135px;
              display: inline-block;
              text-align: right;
            }
            .el-descriptions-item__content {
              width: 210px;
              border-radius: 2px 2px 2px 2px;
              border: 1px solid #5867f0;
              padding: 0;
              box-sizing: border-box;
              .desc {
                text-indent: 10px;
                width: calc(100% - 10px);
                >div{
                  width: 100%;
                  height: 100%;
                  white-space: nowrap;
                  overflow: hidden;
                  text-overflow: ellipsis;
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>
