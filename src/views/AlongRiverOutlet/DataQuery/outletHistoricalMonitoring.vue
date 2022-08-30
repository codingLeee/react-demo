<!-- 沿河排口-数据查询-实时监测数据查询 -->
<template>
    <div class="historicalMonitoring system-container">
      <div class="query-header">
          <div class="queryBox">
              <div class="box">
                  <span class="">时间段：</span>
                  <el-select v-model="formData.dataType">
                      <el-option v-for="item in dataTypeList" :key="item.code" :label="item.name" :value="item.code"></el-option>
                  </el-select>
              </div>
              <div class="box">
                  <span class="">监测时间：</span>
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
        id="historicalMonitoringTable" 
        ref="historicalMonitoringTable" 
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
        <el-table-column prop="testTime" sortable label="监测时间" align="center" minWidth="120px" show-overflow-tooltip></el-table-column>
        <el-table-column prop="dataState" label="点位状态" align="center" :filter-multiple="false" filter-placement="bottom-end" minWidth="120px" show-overflow-tooltip
            :filters="pointStatusOptions" 
            column-key="dataState" 
        >
          <template slot-scope="scope">
            <span :style="{ color: scope.row.dataState == '告警' ? '#EC808D' : scope.row.dataState == '异常' ? 'D9001B' : '#fff' }">{{scope.row.dataState}}</span>
          </template>
        </el-table-column>
                 
        <el-table-column prop="deviceState" label="设备状态" align="center" :filter-multiple="false" filter-placement="bottom-end" minWidth="120px" show-overflow-tooltip
            :filters="dealStateOptions" 
            column-key="deviceState" 
        >
        </el-table-column>

        <el-table-column v-for="item in standardData" 
            :key="item.factorCode" 
            :prop="item.factorCode" 
            sortable 
            :label="`${item.factorName} 阈值${item.standardValue}`" 
            align="center" 
            width="260px"
        >
          <template slot-scope="scope">
            <span :style="{ color: getFactorStateColor(scope.row, item.factorCode) }">{{scope.row[item.factorCode]}}</span>
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

    </div>
</template>

<script>
import { mapState } from "vuex";
import { awaitWrap, checkNotNull } from "@/lib";
import { getRealTimeData, exportRealTime } from "@/api/alongRiverOutlet";

export default {
  data() {
    return {
      dateDaterange: [],
      formData: {
        areaCode: "",
        dataState: "",
        dataType: "1",
        deviceState: "",
        subtype: "",
        pointCode: "",
        pointName: "",
        riverCode: "",
        startTime:"",
        endTime:""
      },
      dataTypeList:[
          {
              name:"小时数据",
              code:"1"
          },
          {
              name:"日数据",
              code:"2"
          },
          {
              name:"月数据",
              code:"3"
          },
      ],
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
      standardData: []
    };
  },
  methods: {
    // 表格查询
    async getTableData(pageVal) {
      const _this = this;
      _this.pageData.current = pageVal || _this.pageData.current;

      let tableList;
      tableList =
        (await awaitWrap(
          getRealTimeData({ ..._this.formData, ..._this.pageData })
        ))[1] || {};

      if (checkNotNull(tableList) && checkNotNull(tableList["data"])) {
        _this.tableData = tableList["data"]["res"]["records"] || [];
        _this.standardData = tableList["data"]["standard"] || [];
        _this.pageData.total = tableList["data"]["res"]["total"] || 0;
      } else {
        _this.tableData = [];
      }
    },
    // 导出
    exportData() {
      exportRealTime({ ...this.formData });
    },
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
      if (e.deviceState) {
        this.formData.deviceState = e.deviceState[0];
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
  mounted() {
    this.getTableData(1);
  }
};
</script>

<style lang="scss" scoped>
.historicalMonitoring {
  height: 100%;
  position: relative;
}
</style>
