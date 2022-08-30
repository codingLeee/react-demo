<!--  数据查询-历史监测数据查询  -->
<template>
  <div class="historical-container system-container">
    <div class="historical-header query-header">
      <div class="queryBox">
        <div class="box" v-if="pointTypeFlag == 'ws'">
          <span class="">时间段：</span>
          <el-select v-model="timeSlotValue1" placeholder="请选择">
            <el-option
              v-for="item in timeSlotOptions1"
              :key="item.id"
              :label="item.name"
              :value="item.code"
            >
            </el-option>
          </el-select>
        </div>
        <div class="box" v-if="pointTypeFlag == 'ys'">
          <span class="">时间段：</span>
          <el-select v-model="timeSlotValue2" placeholder="请选择">
            <el-option
              v-for="item in timeSlotOptions2"
              :key="item.id"
              :label="item.name"
              :value="item.code"
            >
            </el-option>
          </el-select>
        </div>
        <div class="box">
          <span class="">时间：</span>
          <el-date-picker
            v-model="dateValue"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
          >
          </el-date-picker>
        </div>

        <div class="box">
          <span class="">所属街道：</span>
          <el-select
            clearable
            v-model="streesValue"
            placeholder="请选择"
          >
            <el-option
              v-for="item in streesOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
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
          <span class="">排水户名称：</span>
          <el-input
            v-model="houseHoldName"
            autocomplete="off"
            placeholder="请输入"
          ></el-input>
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
      </div>
      <div class="btnBox">
        <el-button type="primary" @click="queryEvent"
          >搜索</el-button
        >
        <el-button type="primary" @click="exportData()"
          >数据导出</el-button
        >
      </div>
    </div>
      <el-table
        id="historyTable"
        ref="multipleTable"
        :data="tableData"
        :cell-style="cellStyle"
        @filter-change="filterChange"
      >
        <el-table-column type="index" label="序号" width="60" align="center">
        </el-table-column>
        <el-table-column prop="subdistrict" label="所属街道" align="center" show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="pshType"
          label="排水户类型"
          align="center"
          :formatter="pshTypeFomatter"
          column-key="houseHoldTypeValue"
          :filter-multiple="false"
          :filters="houseHoldTypeOptions"
          filter-placement="bottom-end"
          minWidth="100px"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column prop="pshName" label="排水户名称" align="center" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="pointName" label="点位名称" align="center" show-overflow-tooltip>
        </el-table-column>
        <el-table-column
        prop="pointName" 
        label="点位类型" 
        align="center" 
        :formatter="deviceTypeFomatter"
        column-key="pointTypeValue"
        :class-name="'pointName'"
        minWidth="100px"
        >
        </el-table-column>

        <el-table-column prop="addr" label="排水户位置" align="center" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="testTime" label="监测时间" align="center" minWidth="140px" show-overflow-tooltip>
        </el-table-column>

        <el-table-column
          prop="testLevel"
          label="液位（m）"
          align="center"
          v-if="pointTypeFlag == 'ws'"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          prop="levelValue"
          label="液位（m）"
          align="center"
          v-if="pointTypeFlag == 'ys'"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          prop="phvalue"
          key="pH"
          label="pH"
          align="center"
          v-if="pointTypeFlag == 'ys'"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          prop="usvalue"
          key="uS"
          label="电导率（uS/cm）"
          align="center"
          minWidth="100px"
          v-if="pointTypeFlag == 'ys'"
          show-overflow-tooltip
        >
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
        <span>共{{total}}条</span>
      </div>
  </div>
</template>
<script>
import {
  getHistoryData,
  getDataByType,
  getexcelExportData,
} from "@/api/IntelSupervision";
import {
pshTypeFomatter
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
      dateValue: "",
      timeSlotValue1: "1",
      timeSlotValue2: "2",
      timeSlotOptions1: [
        { name: "分钟数据", code: "1" },
        { name: "日数据", code: "3" },
        { name: "月数据", code: "5" },
        { name: "年数据", code: "7" },
      ],
      timeSlotOptions2: [
        { name: "小时数据", code: "2" },
        { name: "日数据", code: "3" },
        { name: "月数据", code: "5" },
        { name: "年数据", code: "7" },
      ],
      streesValue: "",
      houseHoldTypeValue: "",
      pointTypeValue: "ws",
      houseHoldName: "",
      currentPage: 1,
      pageSize: 10,
      total: 0,
      pages:0,
      pointTypeFlag: "ws",
      exportForm: [],
      exportFields: {},
      exportTitle: "",
    };
  },

  methods: {
      pshTypeFomatter,
      filterChange(e) {
      if(e.houseHoldTypeValue) {
        this.houseHoldTypeValue = e.houseHoldTypeValue[0]
      }
      if(e.pointTypeValue) {
        this.pointTypeValue = e.pointTypeValue[0]
      }
      this.queryEvent();
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

    //获取点位状态列表
    async getPointStatus() {
      // 点位状态
      //const res = await getDataByType({ type: "date_type" });
      //this.timeSlotOptions = res.data;
    },

    async getTableData() {
      let timeSlotValue = "";
      if (this.pointTypeValue == "ws") {
        timeSlotValue = this.timeSlotValue1;
      } else if (this.pointTypeValue == "ys") {
        timeSlotValue = this.timeSlotValue2;
      }
      let queryParams = {
        dataType: timeSlotValue, //时间段
        startTimeStr: this.dateValue ? this.dateValue[0] : "", //开始时间
        endTimeStr: this.dateValue ? this.dateValue[1] : "", //结束时间
        deviceType: this.pointTypeValue ? this.pointTypeValue : '', //点位类型
        current: this.currentPage,
        pageSize: this.pageSize,
        subdistrict: this.streesValue, //街道
        pshType: this.houseHoldTypeValue, //排水户类型
        pshName: this.houseHoldName, //排水户名称
      };
        const res = await getHistoryData(queryParams);
      this.tableData = res.data.records;
      this.total = res.data.total;
      this.pages = res.data.pages;
    },

    queryEvent() {
      this.pointTypeFlag = this.pointTypeValue; //表格分情况显示
      this.currentPage = 1;

      this.getTableData();
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
    deviceTypeFomatter(row) {
      switch (row.deviceType) {
        case 'ws':
          return "污水井";
        case 'ys':
          return "雨水井";
      }
    },

    //设置默认⽇期
    defaultDate() {
      //获取新的时间
      let date = new Date();
      //获取当前时间的年份转为字符串
      let year = date.getFullYear().toString();
      //获取⽉份，由于⽉份从0开始，此处要加1，判断是否⼩于10，如果是在字符串前⾯拼接'0'
      let month =
        date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1).toString()
          : (date.getMonth() + 1).toString();
      //获取天，判断是否⼩于10，如果是在字符串前⾯拼接'0'
      let da =
        date.getDate() < 10
          ? "0" + date.getDate().toString()
          : date.getDate().toString();
      //字符串拼接，开始时间，结束时间
      let end = year + "-" + month + "-" + da; //当天
      let beg = year + "-" + month + "-01"; //当⽉第⼀天
      this.dateValue = [beg, end]; //将值设置给插件绑定的数据
    },

    //初始化页面
    initHistoricalPage() {
      this.streesOptions = this.$store.state.IntelSupervison.streesOptions;
      this.houseHoldTypeOptions =
        this.$store.state.IntelSupervison.houseHoldTypeOptions;
      this.houseHoldTypeOptions.forEach(m=>{
        m["value"] = m["code"];
        m["text"] = m["name"];
      })
      this.defaultDate();
      this.getPointStatus();
      this.getTableData();
    },

    //导出功能
    async exportData() {
      let timeSlotValue = "";
      if (this.pointTypeValue == "ws") {
        timeSlotValue = this.timeSlotValue1;
      } else if (this.pointTypeValue == "ys") {
        timeSlotValue = this.timeSlotValue2;
        }
      let queryParams = {
        dataType: timeSlotValue, //时间段
        startTimeStr: this.dateValue[0], //开始时间
        endTimeStr: this.dateValue[1], //结束时间
        deviceType: this.pointTypeValue ? this.pointTypeValue : '', //点位类型
        current: this.currentPage,
        pageSize: this.pageSize,
        subdistrict: this.streesValue, //街道
        pshType: this.houseHoldTypeValue, //排水户类型
        pshName: this.houseHoldName, //排水户名称
      };
      const res = await getexcelExportData(queryParams,'历史监测数据');

    },


  },
  created() {
    this.initHistoricalPage();
  },
};
</script>
<style lang="scss" scoped>
.historical-container {
  height: 100%;
  position: relative;
  .queryBox {
    display: flex;
    display: inline-block;
  }
  .btnBox {
    float: right;
  }
}
.box > span{
    display: inline-block;
    width:110px;
    text-align: right;
}
</style>