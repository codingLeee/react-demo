<!-- 报警管理 -->
<template>
  <div class="level-container system-container">
  <!-- <div style="{'width':'100%','height':'400px'}">
    <vedio :flvId="'vedio'" :src="'https://sf1-hscdn-tos.pstatp.com/obj/media-fe/xgplayer_doc_video/flv/xgplayer-demo-720p.flv'"></vedio>
  </div> -->
    <div class="level-header query-header">
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
          <span class="">点位名称：</span>
          <el-input
            v-model="pointName"
            autocomplete="off"
            placeholder="请输入"
          ></el-input>
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
      </div>
      <div class="btnBox">
        <el-button type="primary" @click="refresh">搜索</el-button>
      </div>
    </div>
    <div class="level-echart">
      <systemPanel title="液位变化趋势分析">
        <div class="level-tab">
          <div
            :class="t.value == activeTab ? 'active' : ''"
            v-for="(t, i) in tabData"
            :key="i"
            @click="clickTab(t.value)"
          >
            {{ t.name }}
          </div>
        </div>
        <div class="echart-div">
          <level-line
            :id="'level-echart-line'"
            :data="deviceFaultStaData"
            v-show="deviceFaultStaData.xData.length !== 0"
          ></level-line>
          <no-data v-if="deviceFaultStaData.xData.length == 0"></no-data>
        </div>
      </systemPanel>
    </div>
    <el-table id="levelTable1" ref="levelTable1" :data="tableData">
      <el-table-column type="index" label="序号" align="center" fixed="left" width="60">
      </el-table-column>
      <el-table-column
        prop="subdistrict"
        label="所属街道"
        align="center"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="pshType"
        label="排水户类型"
        align="center"
        :formatter="pshTypeFomatter"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="pointName"
        label="点位名称"
        align="center"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="testTime"
        label="监测时间"
        minWidth="140px"
        align="center"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="w99691"
        label="液位（m）"
        align="center"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="addr"
        label="站点位置"
        align="center"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="calibre"
        label="管径"
        align="center"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="hhLevel"
        label="高高液位（m）"
        minWidth="120px"
        align="center"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="hlevel"
        label="高液位（m）"
        minWidth="100px"
        align="center"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="llLevel"
        label="低低液位（m）"
        minWidth="120px"
        align="center"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="llevel"
        label="低液位（m）"
        minWidth="100px"
        align="center"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="pointState"
        label="点位状态"
        align="center"
        :formatter="dataStateFormatter"
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
      <span>共{{ total }}条</span>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
import levelLine from "./echartComponent/levelLine.vue";
import { getLevelChange } from "@/api/IntelSupervision";
import { awaitWrap, checkNotNull, pshTypeFomatter } from "@/lib";
import Vedio from "@/components/common/Vedio.vue";
export default {
  components: {
    levelLine,
    Vedio
  },
  data() {
    return {
      tableData: [],
      tabData: [
        {
          name: "近7日",
          value: "-7",
        },
        {
          name: "近15日",
          value: "-15",
        },
        {
          name: "近30日",
          value: "-30",
        },
      ],
      activeTab: "-7",
      deviceFaultStaData: {
        xData: [],
        yData: [],
      },
      streesOptions: [],
      dateValue: "", //时间
      streesValue: "", //所属街道
      pointName: "", //点位名称
      currentPage: 1,
      pageSize: 10,
      total: 0,
      pages: 0,
      levelStateOptions: [],
    };
  },
    methods: {
      pshTypeFomatter,
    //切换当前页的容量
    handleSizeChange(val) {
      this.pageSize = val;
    },
    //翻页
    handleCurrentChange(val) {
      this.currentPage = val;
      this.refreshList();
    },
    //格式化
    dataStateFormatter(row) {
      //点位状态
      let resStatus = this.levelStateOptions.filter((t) => {
        return t.code == row.pointState;
      });
      if (resStatus.length == 1) {
        return resStatus[0]["name"];
      }
    },
    clickTab(v) {
      this.activeTab = v;
      this.dateValue = "";
      this.currentPage = 1;
      this.refreshList();
    },
    refresh() {
      this.currentPage = 1;
      this.refreshList();
    },
    async refreshList() {
      const _this = this;
      if (_this.dateValue) _this.activeTab = "";
      let param = {
        subdistrict: this.streesValue, //所属街道
        pointName: this.pointName, //点位名称
        starTime: this.dateValue ? this.dateValue[0] : "", //开始时间
        endTime: this.dateValue ? this.dateValue[1] : "", //结束时间
        current: this.currentPage,
        pageSize: this.pageSize,
        timeType: this.dateValue ? "" : this.activeTab,
      };
      if (!this.dateValue) {
        delete param.starTime;
        delete param.endTime;
      }
        let t = (await awaitWrap(getLevelChange(param)))[1] || {};
      if (checkNotNull(t) && checkNotNull(t["data"])) {
        _this.total = t.data.total;
        _this.pages = t.data.pages;
        t = t["data"]["records"];
      } else {
        t = [];
      }
      _this.tableData = t;
      let xData = [],
        yData = [];
      for (let i = 0; i < t.length; i++) {
        xData.push(t[i]["testTime"]);
        yData.push(t[i]["w99691"]);
      }
      this.deviceFaultStaData = {
        xData,
        yData,
      };
    },
  },
  created() {
    this.streesOptions = this.$store.state.IntelSupervison.streesOptions;
    this.levelStateOptions =
      this.$store.state.IntelSupervison.levelStateOptions;
    this.refreshList();
  },
  computed: {},
  watch: {},
};
</script>
<style lang="scss" scoped>
.level-container {
  height: 100%;
  position: relative;
  overflow-y: auto;
  overflow-x: hidden;
  .btnBox {
    width: 15%;
  }
  .level-echart {
    height: 410px;
    width: 100%;
    margin-bottom: 10px;
    .level-tab {
      float: right;
      overflow: hidden;
      margin-right: 40px;
      line-height: 32px;
      text-align: center;
      margin-top: -32px;
      > div {
        float: left;
        margin-right: 10px;
        width: 80px;
        background: rgba(31, 158, 204, 0.22);
        border: 1px solid #2099c5;
        color: #5bd3ff;
      }
      .active {
        color: #fff;
      }
      > div:hover {
        color: #fff;
        cursor: pointer;
      }
    }
    .echart-div {
      height: 330px;
      margin-top: 20px;
    }
  }

  /deep/ .el-table__fixed::before {
    display: none;
  }
}
</style>
