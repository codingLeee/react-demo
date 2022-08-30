<template>
    <!-- 沿河排口智能监管系统/报警管理/监测指标报警统计分析/事件统计 -->
    <div class="extremesStatistics">
        <!-- outletRiver_MonitPoints_bg.png -->
        <el-row :gutter="20">
            <el-col :span="8">
                <systemPanel title="沿河排口监测点位">
                    <div class="outletMonitPoints">
                        <span>{{thousandSignNumber(allMonitSite)}}</span>
                    </div>
                    <div class="outletMonitPoints_title">沿河排口监测点位数量</div>
                </systemPanel>                
            </el-col>
            <el-col :span="8">
                <systemPanel title="累计报警情况">
                  <alarmDisplay :data="timeRange" />
                  <!-- alarm_situation_icon.png -->
                </systemPanel>     
            </el-col>
            <el-col :span="8">
                <systemPanel title="近两小时报警情况">
                  <alarmDisplay :data="twoHours" title="近两小时内报警数量" />
                </systemPanel>     
            </el-col>
        </el-row>
        
      <el-table 
        id="historicalAlarmEventTable" 
        ref="historicalAlarmEventTable" 
        :data="tableData" 
      >
          <el-table-column type="index" label="序号" align="center" fixed="left" width="60"></el-table-column>
          <el-table-column prop="pointCode" label="点位编号" align="center" minWidth="220px" show-overflow-tooltip></el-table-column>
          <el-table-column prop="pointName" label="点位名称" align="center" width="100px"></el-table-column>
          <el-table-column prop="subtype" label="点位类型" align="center" filter-placement="bottom-end" minWidth="120px" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="addr" label="点位位置" align="center" minWidth="140px" show-overflow-tooltip></el-table-column>
          <el-table-column prop="areaName" label="所属街道" align="center" minWidth="120px" show-overflow-tooltip></el-table-column>
          <el-table-column prop="riverName" label="所属河流" align="center" minWidth="120px" show-overflow-tooltip></el-table-column>
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
          <el-table-column prop="dataState" label="点位状态" align="center" minWidth="120px" show-overflow-tooltip>
            <template slot-scope="scope">
              <span :style="{ color: scope.row.dataState == '告警' ? '#EC808D' : scope.row.dataState == '异常' ? 'D9001B' : '#fff' }">{{scope.row.dataState}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="eventState" label="处理状态" align="center" minWidth="120px" show-overflow-tooltip>
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
    </div>
</template>

<script>
import { thousandSignNumber, awaitWrap, checkNotNull } from "@/lib";
import { getAlarmEventInfo } from "@/api/alongRiverOutlet";
import alarmDisplay from "./alarmDisplay.vue";
export default {
  data() {
    return {
      pageData: {
        current: 1,
        pageSize: 4,
        total: 0
      },
      allMonitSite: 0,
      twoHours: [],
      timeRange: [],
      tableData: []
    };
  },
  components: { alarmDisplay },
  methods: {
    thousandSignNumber,
    // 查询
    async getTableData(pageVal) {
      const _this = this;
      _this.pageData.current = pageVal || _this.pageData.current;

      let tableList;
      tableList =
        (await awaitWrap(getAlarmEventInfo({ ..._this.pageData })))[1] || {};

      if (checkNotNull(tableList) && checkNotNull(tableList["data"])) {
        _this.allMonitSite = tableList["data"]["total"];
        _this.twoHours = tableList["data"]["twoHours"];
        _this.timeRange = tableList["data"]["timeRange"];
        _this.tableData = tableList["data"]["alarmInfo"]["records"] || [];
        _this.pageData.total = tableList["data"]["alarmInfo"]["total"] || 0;
      } else {
        _this.tableData = [];
      }
    },
    // 因子色值
    getFactorStateColor(row, code) {
      return row[code + "Status"] == 2
        ? "#EC808D"
        : row[code + "Status"] == 3 ? "#D9001B" : "#fff";
    }
  },
  mounted() {
    this.getTableData(1);
  }
};
</script>


<style lang="scss" scoped>
.extremesStatistics {
  /deep/ .el-row {
    height: 372px;
    margin-bottom: 20px;
    .el-col {
      height: 100%;
    }
  }

  .outletMonitPoints {
    height: 270px;
    text-align: center;
    background: url(~static/ManageSystem/img/outletRiver_MonitPoints_bg.png)
      no-repeat center center;
    background-size: 324px 100%;
    padding-top: 40px;
    box-sizing: border-box;

    span {
      background-image: -webkit-linear-gradient(
        bottom,
        rgba(30, 194, 255, 1),
        rgba(255, 255, 255, 1)
      );
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;

      font-size: 44px;
      font-weight: bold;
    }
  }

  .outletMonitPoints_title {
    text-align: center;
    font-size: 24px;
    color: rgba(255, 255, 255, 0.78);
  }
}
</style>

