<!-- 沿河排口-数据查询-实时监测数据查询 -->
<template>
    <div class="historicalMonitoring system-container">
      <div class="query-header">
          <div class="queryBox">
            <div class="box">
                  <span class="">报表周期：</span>
                  <el-select v-model="formData.timeType">
                      <el-option label="日报" :value="'d'"></el-option>
                      <el-option label="月报" :value="'m'"></el-option>
                  </el-select>
              </div>
              <div class="box">
                  <span class="">站点选择：</span>
                  <el-select v-model="formData.pointCode" multiple @change="pointChange">
                      <el-option v-for="item in dataTypeList" :key="item.pointCode" :label="item.pointName" :value="item.pointCode"></el-option>
                  </el-select>
              </div>
              <div class="box">
                  <span class="">查询方式：</span>
                  <el-select v-model="formData.sort">
                      <el-option label="按时间查询" :value="'1'"></el-option>
                      <el-option label="按排口查询" :value="'2'"></el-option>
                  </el-select>
              </div>
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
          </div>
          
          <div class="btnBox">
              <el-button type="primary" @click="getTableData()">搜索</el-button>
              <el-button type="primary" @click="exportData()">数据导出</el-button>
          </div>
      </div>

      <el-table 
        id="historicalMonitoringTable" 
        ref="historicalMonitoringTable" 
        :data="tableData" 
      >
        <el-table-column type="index" label="序号" align="center" fixed="left" width="60"></el-table-column>
        <el-table-column prop="time" label="时间" align="center"></el-table-column>
        <el-table-column prop="pointName" label="站点" align="center"></el-table-column>
        <el-table-column prop="ph" label="pH" align="center"></el-table-column>
        <el-table-column prop="cod" label="COD (mg/L)" align="center"></el-table-column>
        <el-table-column prop="nh3n" label="氨氮（mg/L）" align="center"></el-table-column>
        <el-table-column prop="flow" label="流量（m/s）" align="center"></el-table-column>
      </el-table>
    </div>
</template>

<script>
import { mapState } from "vuex";
import { awaitWrap, checkNotNull } from "@/lib";
import { autoMonitoringReport , autoMonitoringReportExport } from "@/api/alongRiverOutlet";
import { getAllPoint } from "@/api";
export default {
  data() {
    return {
      dateDaterange: [],
      formData: {
        pointCode:[],
        timeType:"d",
        sort:'1',
        startTime:"",
        endTime:""
      },
      tableData: [],
      dataTypeList:[]
    };
  },
  methods: {
    // 表格查询
    async getTableData() {
      const _this = this;
      let pointCode = _this.formData.pointCode.join(',')
      if(!pointCode){
        this.$message.info("请选择站点！");
        return false;
      }
      let tableList;
      tableList =
        (await awaitWrap(
          autoMonitoringReport({ ..._this.formData, pointCode })
        ))[1] || {};

      if (checkNotNull(tableList) && checkNotNull(tableList["data"])) {
        _this.tableData = tableList["data"];
      } else {
        _this.tableData = [];
      }
    },
    // 导出
    exportData() {
      let pointCode = this.formData.pointCode.join(',')
      if(!pointCode){
        this.$message.info("请选择站点！");
        return false;
      }
      autoMonitoringReportExport({ ...this.formData, pointCode });
    },
    dateDaterangeChange() {
      this.formData.startTime = this.dateDaterange[0];
      this.formData.endTime = this.dateDaterange[1];
    },
    // 获得排口数据
    async getOutletData() {
      let outletList =
        (await awaitWrap(getAllPoint({ deviceTypeStr: "pk",dataSource:'auto' })))[1] || {};
      if (checkNotNull(outletList) && checkNotNull(outletList["data"])) {
        this.dataTypeList = outletList["data"];
        this.formData.pointCode = [this.dataTypeList[0]['pointCode']];
      }
      this.getTableData();
    },
    pointChange(v){
      console.log(v)
    }
  },
  computed: {
  },
  mounted() {
    this.getOutletData();
  }
};
</script>

<style lang="scss" scoped>
.historicalMonitoring {
  height: 100%;
  position: relative;
}
</style>
