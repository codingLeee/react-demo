<!-- 沿河排口-报警管理-历史报警事件查询 -->
<template>
    <div class="historicalAlarmEvent system-container">
      <div class="query-header">
          <div class="queryBox">
              <div class="box">
                  <span class="">时间：</span>
                  <el-date-picker 
                    v-model="dateDaterange" 
                    type="daterange" 
                    range-separator="-" 
                    start-placeholder="开始日期" 
                    end-placeholder="结束日期" 
                    value-format="yyyy-MM-dd"
                    @change="dateDaterangeChange"
                  >
                  </el-date-picker>
              </div>
              <div class="box">
                  <span class="">点位编号：</span>
                  <el-input v-model="formData.pointCode" autocomplete="off" placeholder="请输入"></el-input>
              </div>
              <div class="box">
                  <span class="">点位名称：</span>
                  <el-input v-model="formData.pointName" autocomplete="off" placeholder="请输入"></el-input>
              </div>
          </div>
          
          <div class="btnBox">
              <el-button type="primary" @click="getTableData(1)">搜索</el-button>
              <el-button type="primary" @click="exportData()">数据导出</el-button>
          </div>
      </div>

      <el-table 
        id="historicalAlarmEventTable" 
        ref="historicalAlarmEventTable" 
        :data="tableData" 
        @filter-change="tableFilterChange"
      >
          <el-table-column type="index" label="序号" align="center" fixed="left" width="60"></el-table-column>
          <el-table-column prop="pointCode" label="点位编号" align="center" minWidth="220px" show-overflow-tooltip></el-table-column>
          <el-table-column prop="pointName" label="点位名称" align="center" width="100px"></el-table-column>
          <el-table-column prop="subtype" label="点位类型" align="center" filter-placement="bottom-end" :filter-multiple="false" minWidth="120px" show-overflow-tooltip
              :filters="pointTypeOptions" 
              column-key="subtype" 
          >
          </el-table-column>
          <el-table-column prop="addr" label="点位位置" align="center" minWidth="140px" show-overflow-tooltip=""></el-table-column>
          <el-table-column prop="areaName" label="所属街道" align="center" :filter-multiple="false" filter-placement="bottom-end" minWidth="120px" show-overflow-tooltip
              :filters="streesOptions" 
              column-key="areaCode" 
          >
          </el-table-column>
          <el-table-column prop="riverName" label="所属河流" align="center" :filter-multiple="false" filter-placement="bottom-end" minWidth="120px" show-overflow-tooltip
              :filters="allRiverOptions" 
              column-key="riverCode" 
          >
          </el-table-column>
          <template v-if="activeTabName == 'indicators'">
            <el-table-column prop="testTime" sortable label="报警时间" align="center" minWidth="120px" show-overflow-tooltip></el-table-column>
            <el-table-column prop="w01001" sortable label="PH" align="center" width="120px">
              <template slot-scope="scope">
                <span :style="{ color: getFactorStateColor(scope.row, 'w01001') }">{{scope.row["w01001"]}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="w01018" sortable label="COD(mg/L)" align="center" width="140px">
              <template slot-scope="scope">
                <span :style="{ color: getFactorStateColor(scope.row, 'w01018') }">{{scope.row["w01018"]}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="w21003" sortable label="氨氮(mg/L)" align="center" width="140px">
              <template slot-scope="scope">
                <span :style="{ color: getFactorStateColor(scope.row, 'w21003') }">{{scope.row["w21003"]}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="w99266" sortable label="流量(m/s)" align="center" width="140px">
              <template slot-scope="scope">
                <span :style="{ color: getFactorStateColor(scope.row, 'w99266') }">{{scope.row["w99266"]}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="dataState" label="点位状态" align="center" :filter-multiple="false" filter-placement="bottom-end" minWidth="120px" show-overflow-tooltip
                :filters="pointStatusOptions" 
                column-key="dataState" 
            >
              <template slot-scope="scope">
                <span :style="{ color: scope.row.dataState == '告警' ? '#EC808D' : scope.row.dataState == '异常' ? 'D9001B' : '#fff' }">{{scope.row.dataState}}</span>
              </template>
            </el-table-column>
          </template>
          <template v-if="activeTabName == 'equipment'">
            <el-table-column prop="testTime" sortable label="故障时间" align="center" width="120px" show-overflow-tooltip></el-table-column>
            <el-table-column prop="alarmReason" label="故障类型" align="center" width="140px"></el-table-column>
          </template>          
          <el-table-column prop="eventState" label="处理状态" align="center" :filter-multiple="false" filter-placement="bottom-end" minWidth="120px" show-overflow-tooltip
              :filters="dealStateOptions" 
              column-key="eventState" 
          >
          </el-table-column>
          <el-table-column fixed="right" label="操作" align="center">
              <template slot-scope="scope">
                  <el-button @click="showTable(scope.row)" type="text" size="small">查看</el-button>
              </template>
          </el-table-column>
      </el-table>
        
      <!-- 分页 -->
      <div class="paginationContent">
        <el-pagination 
          layout="total,prev, pager, next" 
          :page-size="pageData.pageSize" 
          :current-page="pageData.current" 
          :total="pageData.total" 
          @current-change="getTableData">
        </el-pagination>
      </div>

      <!-- 查看详情 -->
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
                      <div>{{ dialogInfo.testTime }}</div>
                  </el-tooltip>
                </div>
              </el-descriptions-item>
              <el-descriptions-item label="点位状态">
                <div class="desc">
                  <el-tooltip class="item" effect="dark" :content="dialogInfo.dataState" placement="top">
                      <div>{{ dialogInfo.dataState }}</div>
                  </el-tooltip>
                </div>
              </el-descriptions-item>
              <el-descriptions-item label="处理状态">
                <div class="desc">
                  <el-tooltip class="item" effect="dark" :content="eventStateFomatter({eventState:dialogInfo.eventState})" placement="top">
                      <div>{{ eventStateFomatter({eventState:dialogInfo.eventState}) }}</div>
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
            <el-descriptions :column="4" v-for="item in factorList" :key="item.code">
              <el-descriptions-item label="数据项">
                <div class="desc">
                  <el-tooltip class="item" effect="dark" :content="item.name" placement="top">
                      <div>{{ item.name }}</div>
                  </el-tooltip>
                </div>
              </el-descriptions-item>
              <el-descriptions-item label="监测值">
                <div class="desc">
                  <el-tooltip class="item" effect="dark" :content="dialogInfo[item.code]" placement="top">
                      <div>{{ dialogInfo[item.code] }}</div>
                  </el-tooltip>
                </div>
              </el-descriptions-item>
              <el-descriptions-item label="阈值">
                <div class="desc">
                  <el-tooltip class="item" effect="dark" :content="dialogInfo[item.code+'Standard']" placement="top">
                      <div>{{ dialogInfo[item.code+'Standard'] }}</div>
                  </el-tooltip>
                </div>
              </el-descriptions-item>
              <el-descriptions-item label="数据状态">
                <div class="desc">
                  <el-tooltip class="item" effect="dark" :content="dialogInfo[item.code+'Status']" placement="top">
                      <div>{{ dialogInfo[item.code+'Status'] }}</div>
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
import { mapState } from "vuex";
import { awaitWrap, checkNotNull,eventStateFomatter } from "@/lib";
import {
  getTestIndexAlarm,
  getTestDeviceAlarm,
  exportTestIndex,
  exportTestDevice
} from "@/api/alongRiverOutlet";

export default {
  data() {
    return {
      dateDaterange: "",
      formData: {
        pointCode: "",
        pointName: "",
        subtype: "",
        areaCode: "",
        riverCode: "",
        dataState: "",
        eventState: "",
        startTime: "",
        endTime: ""
      },
      pageData: {
        pageSize: 10,
        current: 1,
        total: 0
      },
      tableData: [],
      pointTypeOptions: [
        {
          value: "1",
          text: "污水排口"
        },
        {
          value: "2",
          text: "雨水排口"
        }
      ],
      factorList: [
        { name: "PH", code: "w01001", unit: "" },
        { name: "COD", code: "w01018", unit: "mg/L" },
        { name: "氨氮", code: "w21003", unit: "mg/L" },
        { name: "流量", code: "w99266", unit: "m³/s" },
      ],
    };
  },
  methods: {
    eventStateFomatter,
    // 表格查询
    async getTableData(pageVal) {
      const _this = this;
      _this.pageData.current = pageVal || _this.pageData.current;

      let tableList;
      if (_this.activeTabName == "indicators") {
        tableList =
          (await awaitWrap(
            getTestIndexAlarm({ ..._this.formData, ..._this.pageData })
          ))[1] || {};
      } else if (_this.activeTabName == "equipment") {
        tableList =
          (await awaitWrap(
            getTestDeviceAlarm({ ..._this.formData, ..._this.pageData })
          ))[1] || {};
      }

      if (checkNotNull(tableList) && checkNotNull(tableList["data"])) {
        _this.tableData = tableList["data"]["records"] || [];
        _this.pageData.total = tableList["data"]["total"] || 0;
      } else {
        _this.tableData = [];
      }
    },
    // 导出
    exportData() {
      if (this.activeTabName == "indicators") {
        exportTestIndex({ ...this.formData });
      } else if (this.activeTabName == "equipment") {
        exportTestDevice({ ...this.formData });
      }
    },
    // 查看
    showTable() {},
    // 表格筛选
    tableFilterChange(e) {
      if (e.subtype) {
        this.formData.subtype = e.subtype[0];
      }
      if (e.areaCode) {
        this.formData.areaCode = e.areaCode[0];
      }
      if (e.riverCode) {
        this.formData.riverCode = e.riverCode[0];
      }
      if (e.dataState) {
        this.formData.dataState = e.dataState[0];
      }
      if (e.eventState) {
        this.formData.eventState = e.eventState[0];
      }
      this.getTableData(1);
    },
    dateDaterangeChange() {
      this.formData.startTime = this.dateDaterange[0];
      this.formData.endTime = this.dateDaterange[1];
    },
    // 因子色值
    getFactorStateColor(row, code) {
      return row[code + "Status"] == 2
        ? "#EC808D"
        : row[code + "Status"] == 3 ? "#D9001B" : "#fff";
    }
  },
  computed: {
    ...mapState({
      activeTabName: state => state.IntelSupervison.activeTabName,
      streesOptions: state => {
        let val = state.IntelSupervison.streesOptions;
        val.forEach(m => {
          m["text"] = m["label"];
        });
        return val;
      },
      pointStatusOptions: state => {
        let val = state.IntelSupervison.pointStatusOptions;
        val.forEach(m => {
          m["value"] = m["code"];
          m["text"] = m["name"];
        });
        return val;
      },
      dealStateOptions: state => {
        let val = state.IntelSupervison.dealStateOptions;
        val.forEach(m => {
          m["value"] = m["code"];
          m["text"] = m["name"];
        });
        return val;
      },
      allRiverOptions: state => state.IntelSupervison.allRiverOptions
    })
  },
  watch: {
    activeTabName: {
      immediate: true,
      handler(val) {
        if (val) {
          this.getTableData(1);
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.historicalAlarmEvent {
  height: 100%;
  position: relative;
}
</style>
