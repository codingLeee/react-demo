<!-- 排水户管道预处理作业前现场记录表 -->
<template>
    <div class="pretreatment_operation" title="排水户管道预处理作业前现场记录表">
        <ysPretreatmentOperation :tableInfoData="tableData['ysScene']" @getTableData="getTableData" :currRowData="currRowData" />
        <wsPretreatmentOperation :tableInfoData="tableData['wsScene']" @getTableData="getTableData" :currRowData="currRowData"/>
    </div> 
</template>

<script>
import { getPretreatmentOperation } from "@/api/IntelSupervision";
import { awaitWrap, checkNotNull } from "@/lib";
import wsPretreatmentOperation from "./wsPretreatmentOperation.vue";
import ysPretreatmentOperation from "./ysPretreatmentOperation.vue";
export default {
  components: { wsPretreatmentOperation, ysPretreatmentOperation },
  data() {
    return {
      tableData: {},
      currRowData:{}
    };
  },
  props: {
    activeName: {
      type: String,
      default: ""
    }
  },
  watch: {
    activeName: {
      immediate: true,
      handler(val) {
        if (val == "pretreatmentOperation") {
          this.currRowData = this.$store.state.IntelSupervison.digitalManagement;
          this.getTableData();
        }
      }
    }
  },
  methods: {
    // 查询
    async getTableData() {
      const _this = this;

      let tableInfo =
        (await awaitWrap(
          getPretreatmentOperation({ ..._this.currRowData })
        ))[1] || [];

      if (checkNotNull(tableInfo) && checkNotNull(tableInfo["data"])) {
        _this.tableData = tableInfo["data"] || {};
      } else {
        _this.tableData = {};
      }
    }
  }
};
</script>
