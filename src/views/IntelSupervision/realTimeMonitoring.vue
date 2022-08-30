<!--  数据查询-实时监测数据查询  -->
<template>
  <div class="realTime-container system-container">
    <div class="realTime-header query-header">
      <div class="queryBox">
        <div class="box">
          <span class="">所属街道：</span>
          <el-select v-model="streesValue" placeholder="请选择" clearable>
            <el-option
              v-for="item in streesOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </div>
        <div class="box">
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
        </div>
        <div class="box">
          <span class="">点位类型：</span>
          <el-select v-model="pointTypeValue" placeholder="请选择">
            <el-option
              v-for="item in pointTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </div>
        <div class="box">
          <span class="">排水户名称：</span>
          <el-input
            v-model="houseHoldName"
            autocomplete="off"
            placeholder="请输入"
          ></el-input>
        </div>
        <!-- <div class="box">
          <span class="">点位状态：</span>
          <el-select
            v-model="pointStatusValue"
            placeholder="请选择"
            clearable
          >
            <el-option
              v-for="item in pointStatusOptions"
              :key="item.id"
              :label="item.name"
              :value="item.code"
            >
            </el-option>
          </el-select>
        </div>
        <div class="box">
          <span class="">设备状态：</span>
          <el-select
            v-model="equipStatusValue"
            placeholder="请选择"
            clearable
          >
            <el-option
              v-for="item in equipStatusOptions"
              :key="item.id"
              :label="item.name"
              :value="item.code"
            >
            </el-option>
          </el-select>
        </div> -->
      </div>
      <div class="btnBox">
        <el-button type="primary" @click="queryEvent">搜索</el-button>
        <el-button
          type="primary"
          @click="exportData('实时监测数据', 'realTimeTable')"
          >数据导出</el-button
        >
      </div>
    </div>
    <!-- <div class="realTime-content system-footer"> -->

    <!-- height="70%" -->
    <el-table
      id="realTimeTable"
      ref="multipleTable"
      :data="tableData"
      @filter-change="filterChange"
    >
      <el-table-column
        type="index"
        width="60"
        label="序号"
        align="center"
        fixed="left"
      >
      </el-table-column>
      <el-table-column
        prop="subdistrict"
        label="所属街道"
        align="center"
        width="140"
        :show-overflow-tooltip="true"
      >
      </el-table-column>
      <el-table-column
        prop="pshType"
        label="排水户类型"
        align="center"
        width="180"
        :formatter="pshTypeFomatter"
      >
      </el-table-column>
      <el-table-column
        prop="pshName"
        label="排水户名称"
        align="center"
        width="180"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="pointName"
        width="140"
        label="点位名称"
        align="center"
        show-overflow-tooltip
      >
      </el-table-column>

      <el-table-column
        prop="addr"
        width="160"
        label="排水户位置"
        align="center"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="testTime"
        width="200"
        label="监测时间"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="dataState"
        label="点位状态"
        min-width="110px"
        align="center"
        column-key="pointStatusValue"
        :filter-multiple="false"
        :filters="pointStatusOptions"
        filter-placement="bottom-end"
      >
        <template slot-scope="scope">
          <span :style="{ color: getStateColor(scope.row) }">{{
            dataStateFormatter(scope.row)
          }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="deviceState"
        label="设备状态"
        min-width="110px"
        align="center"
        column-key="equipStatusValue"
        :filter-multiple="false"
        :formatter="deviceStateFormatter"
        :filters="equipStatusOptions"
        filter-placement="bottom-end"
      >
      </el-table-column>
      <el-table-column
        prop="testLevel"
        label="液位（m）"
        align="center"
        sortable
        v-if="pointTypeFlag == 'ws'"
        width="140"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <span :style="{ color: isLevelExceed(scope.row.testLevel) }">{{
            scope.row.testLevel
          }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column
          label="阈值（m）"
          align="center"
          v-if="pointTypeFlag == 'ws'"
        > -->
      <template v-if="pointTypeFlag == 'ws'">
        <el-table-column
          prop="hhLevel"
          label="告警高高液位"
          align="center"
          width="140"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          prop="hlevel"
          label="预警高液位"
          align="center"
          width="140"
        >
        </el-table-column>
        <el-table-column
          prop="llevel"
          label="预警低液位"
          align="center"
          width="140"
        >
        </el-table-column>
        <el-table-column
          prop="llLevel"
          label="告警低低液位"
          align="center"
          width="140"
        >
        </el-table-column>
      </template>
      <!-- </el-table-column> -->

      <el-table-column
        label="液位（m）"
        key="testLevel"
        align="center"
        v-if="pointTypeFlag == 'ys'"
      >
        <el-table-column
          prop="testLevel"
          label="监测值"
          align="center"
          width="100"
          sortable
        >
        </el-table-column>
        <el-table-column
          prop="hhLevel"
          label="告警阈值"
          align="center"
          width="100"
        >
        </el-table-column>
      </el-table-column>

      <el-table-column
        label="pH"
        key="pH"
        align="center"
        v-if="pointTypeFlag == 'ys'"
      >
        <el-table-column
          prop="phValue"
          label="监测值"
          align="center"
          width="100"
          sortable
        >
        </el-table-column>
        <el-table-column
          prop="phThreshold"
          label="告警阈值"
          align="center"
          width="100"
        >
        </el-table-column>
      </el-table-column>

      <el-table-column
        label="电导率（uS/cm）"
        key="uS"
        align="center"
        v-if="pointTypeFlag == 'ys'"
      >
        <el-table-column
          prop="usValue"
          label="监测值"
          align="center"
          width="100"
          sortable
        >
        </el-table-column>
        <el-table-column
          prop="usThreshold"
          label="告警阈值"
          align="center"
          width="100"
        >
        </el-table-column>
      </el-table-column>
    </el-table>
    <div class="paginationContent">
      <el-pagination
        layout="prev, pager, next"
        :page-size="pageSize"
        :current-page="currentPage"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      >
      </el-pagination>
      <span>共{{ total }}条</span>
    </div>
    <!-- </div> -->
  </div>
</template>
<script>
import { getRealTimeData } from "@/api/IntelSupervision";
import {
pshTypeFomatter,
dataStateFormatter,
deviceStateFormatter,
isLevelExceed
} from "@/lib";
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
      equipStatusOptions: [],

      streesValue: "",
      houseHoldTypeValue: "",
      pointTypeValue: "ws",
      houseHoldName: "",
      pointStatusValue: "",
      equipStatusValue: "",
      currentPage: 1,
      pageSize: 10,
      total: 0,
      pages: 0,
      pointTypeFlag: "ws",
    };
  },

    methods: {
    pshTypeFomatter,
    dataStateFormatter,
    deviceStateFormatter,
    isLevelExceed,
    filterChange(e) {
      if (e.pointStatusValue) {
        this.pointStatusValue = e.pointStatusValue[0];
      }
      if (e.equipStatusValue) {
        this.equipStatusValue = e.equipStatusValue[0];
      }
      this.queryEvent();
    },
    cellStyle(row, column, rowIndex, columnIndex) {
      //console.log(row)
      //根据级别处理颜色
      // if (row.column.label == "液位（m）"){
      //     if( (row.row.testLevel<row.row.llevel&& row.row.testLevel>row.row.llLevel) ||  (row.row.testLevel<row.row.hhLevel&& row.row.testLevel>row.row.hlevel)){
      //         return "color:#F59A23";
      //     }else if(row.row.testLevel<row.row.llLevel || row.row.testLevel>row.row.hhLevel){
      //         return "color:#D9001B";
      //     }
      // }
      // } && row.row.alarmStatus == "预警") {
      //   return "color:#F59A23";
      // } else if (
      //   row.column.label == "报警状态" &&
      //   row.row.alarmStatus == "报警"
      // ) {
      //   return "color:#D9001B";
      // } else if (
      //   row.column.label == "报警状态" &&
      //   row.row.alarmStatus == "异常"
      // ) {
      //   return "color:#6D000E";
      // }
    },

    //初始化页面
    initRealTimePage() {
      this.streesOptions = this.$store.state.IntelSupervison.streesOptions;
      this.pointStatusOptions =
            this.$store.state.IntelSupervison.pointStatusOptions;
      let option = [];
        this.pointStatusOptions.map((t) => {
        if (t.name !== "设备故障") {
            option.push({
            value: t.code,
            text: t.name,
            });
        }
        });
      this.pointStatusOptions = option
      this.houseHoldTypeOptions =
        this.$store.state.IntelSupervison.houseHoldTypeOptions;
      this.equipStatusOptions =
        this.$store.state.IntelSupervison.equipStatusOptions;
      this.equipStatusOptions.forEach((m) => {
        m["value"] = m["code"];
        m["text"] = m["name"];
      });
      var queryParams = {
        pointType: this.pointTypeValue,
        current: this.currentPage,
        pageSize: this.pageSize,
      };
      this.getTableData(queryParams);
      //   this.getStreets();
      //   this.getPointStatus();
      //   this.getEquipStatus();
      //   this.getHouseHoldType();
    },
    // //获取街道列表
    // async getStreets() {
    //   const res = await getStreetsData();
    //   let list = [];
    //   let obj = res.data;
    //   for (var i in obj) {
    //     var o = {
    //       value: obj[i],
    //       label: i,
    //     };
    //     list.push(o);
    //   }
    //   this.streesOptions = list;
    // },
    // //获取点位状态列表
    // async getPointStatus() {
    //   // 点位状态
    //   const res = await getDataByType({ type: "point_state" });
    //   this.pointStatusOptions = res.data;
    // },
    // //设备状态
    // async getEquipStatus() {
    //   const res = await getDataByType({ type: "device_state" });
    //   this.equipStatusOptions = res.data;
    // },
    // //排水户类型
    // async getHouseHoldType() {
    //   const res = await getDataByType({ type: "psh_type" });
    //   this.houseHoldTypeOptions = res.data;
    // },
    //获取表格数据
    async getTableData(params) {
      const res = await getRealTimeData(params);
      this.tableData = res.data.records;
      this.total = res.data.total;
      this.pages = res.data.pages;
    },

    //查询
    queryEvent() {
      this.pointTypeFlag = this.pointTypeValue; //表格分情况显示
      this.currentPage = 1;

      let queryParams = {
        pointType: this.pointTypeValue, //点位类型
        current: this.currentPage,
        pageSize: this.pageSize,
        subdistrict: this.streesValue, //街道
        pshType: this.houseHoldTypeValue, //排水户类型
        pshName: this.houseHoldName, //排水户名称
        dataState: this.pointStatusValue, //点位状态
        deviceState: this.equipStatusValue, //设备状态
      };

      this.getTableData(queryParams);
    },

    //切换当前页的容量
    handleSizeChange(val) {
      this.pageSize = val;
    },
    //翻页
    handleCurrentChange(val) {
      this.currentPage = val;
      let queryParams = {
        pointType: this.pointTypeValue, //点位类型
        current: this.currentPage,
        pageSize: this.pageSize,
        subdistrict: this.streesValue, //街道
        pshType: this.houseHoldTypeValue, //排水户类型
        pshName: this.houseHoldName, //排水户名称
        dataState: this.pointStatusValue, //点位状态
        deviceState: this.equipStatusValue, //设备状态
      };

      this.getTableData(queryParams);
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

    // exportEvent(name, id) {
    //   exportData(name, id);
    // },
    //导出功能
    exportData(name, id) {
      let excelName = name + ".xlsx";
      var xlsxParam = { raw: true }; //转换成excel时，使用原始的格式
      // 克隆节点
      let tables = document.getElementById(id).cloneNode(true);
      // 判断是否为固定列，解决（为固定列时，会重复生成表格）
      if (tables.querySelector(".el-table__fixed") !== null) {
        tables.removeChild(tables.querySelector(".el-table__fixed"));
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
    this.initRealTimePage();
  },
};
</script>
<style lang="scss" scoped>
.realTime-container {
  height: 100%;
  position: relative;
  /deep/ .el-table__fixed::before {
    display: none;
  }
}
</style>