<!-- 管道缺陷汇总一览表 -->
<template>
    <div class="pipe_defects_summary" title="管道缺陷汇总一览表">
        <el-button class="add_info_button" type="primary" @click="addTable">新增</el-button>
        <div class="table_info">{{checkNotNull(tableData) ? tableData[0]["text"] : ""}}</div>
        <el-table max-height="500px" :data="tableData">
            <el-table-column type="index" label="序号" width="80px"></el-table-column>
            <el-table-column prop="pipeNum" label="管道编号">
                <template slot-scope="scope">
                    <el-input v-if="currUpdateIndex == scope.$index" v-model="scope.row.pipeNum"></el-input>
                    <span v-else>{{scope.row.pipeNum}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="diameterSection" label="管径(mm)">
                <template slot-scope="scope">
                <el-input v-if="currUpdateIndex == scope.$index" v-model="scope.row.diameterSection"></el-input>
                <span v-else>{{scope.row.diameterSection}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="material" label="管段材质">
                <template slot-scope="scope">
                <el-input v-if="currUpdateIndex == scope.$index" v-model="scope.row.material"></el-input>
                <span v-else>{{scope.row.material}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="length" label="管段长度(m)">
                <template slot-scope="scope">
                <el-input v-if="currUpdateIndex == scope.$index" v-model="scope.row.length"></el-input>
                <span v-else>{{scope.row.length}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="inspectLength" label="检测长度(m)">
                <template slot-scope="scope">
                <el-input v-if="currUpdateIndex == scope.$index" v-model="scope.row.inspectLength"></el-input>
                <span v-else>{{scope.row.inspectLength}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="structDetect" label="结构性缺陷">
                <template slot-scope="scope">
                <el-input v-if="currUpdateIndex == scope.$index" v-model="scope.row.structDetect"></el-input>
                <span v-else>{{scope.row.structDetect}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="funcDetect" label="功能性缺陷">
                <template slot-scope="scope">
                <el-input v-if="currUpdateIndex == scope.$index" v-model="scope.row.funcDetect"></el-input>
                <span v-else>{{scope.row.funcDetect}}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                    <el-button type="text" size="small" style="color:#f00" @click="deleteTable(scope)">删除</el-button>
                    <el-button type="text" size="small" style="color:#fff" @click="updateTable(scope)">
                        {{currUpdateIndex == scope.$index ? "保存" : "修改"}}
                    </el-button>
                </template>
            </el-table-column>    
        </el-table>        
    </div>    
</template>

<script>
import {
  getPipeDefect,
  updatePipeDefectSummary,
  delPipeDefectSummary,
  savePipeDefectSummary
} from "@/api/IntelSupervision";
import { awaitWrap, checkNotNull } from "@/lib";

export default {
  data() {
    return {
      currUpdateIndex: -1,
      tableData: [],
      currRowData: {},
      isHasAdd: false
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
        if (val == "pipeDefectsSummary") {
          this.currRowData = this.$store.state.IntelSupervison.digitalManagement;
          this.getTableData();
        }
      }
    }
  },
  methods: {
    checkNotNull,
    // 查询
    async getTableData() {
      const _this = this;
      _this.isHasAdd = false;

      let tableInfo =
        (await awaitWrap(getPipeDefect({ ..._this.currRowData })))[1] || [];

      if (checkNotNull(tableInfo) && checkNotNull(tableInfo["data"])) {
        _this.tableData = tableInfo["data"] || [];
      } else {
        _this.tableData = [];
      }
    },
    // 修改
    async updateTable({ row, $index }) {
      const _this = this;
      // 保存
      if (_this.currUpdateIndex == $index) {
        // 新增- 保存
        if (row["isAdd"]) {
          await savePipeDefectSummary({
            ..._this.baseInfoInitData,
            ...row,
            pshCode: _this.currRowData["pshCode"]
          }).then(res => {
            _this.isHasAdd = false;
            _this.currUpdateIndex = -1;
          });
        } else {
          // 修改- 保存
          await updatePipeDefectSummary({ ...row }).then(res => {
            _this.currUpdateIndex = -1;
          });
        }

        _this.getTableData();
      } else {
        // 修改
        _this.currUpdateIndex = $index;
      }
    },
    // 新增
    addTable() {
      const _this = this;
      if (_this.isHasAdd) {
        _this.$message({
          type: "warning",
          message: "有尚未完成的新增项目！"
        });
      } else {
        _this.tableData.push({
          pipeNum: "",
          diameterSection: "",
          material: "",
          length: "",
          inspectLength: "",
          structDetect: "",
          funcDetect: "",
          isAdd: true
        });

        _this.isHasAdd = true;
        _this.currUpdateIndex = _this.tableData.length - 1;
      }
    },
    // 删除
    deleteTable({ row, $index }) {
      const _this = this;
      // 未完成新增的行
      if (row["isAdd"]) {
        _this.tableData.splice($index, 1);
        _this.isHasAdd = false;
        _this.currUpdateIndex = -1;
      } else {
        _this
          .$confirm(`确定要删除该条信息?`, "", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
          .then(() => {
            delPipeDefectSummary({ id: row["id"] }).then(() => {
              _this.$message({
                type: "success",
                message: "删除成功！"
              });

              _this.getTableData();
            });
          })
          .catch(() => {
            _this.$message({
              type: "info",
              message: "已取消删除"
            });
          });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.pipe_defects_summary {
  .add_info_button {
    float: right;
    margin-bottom: 15px;
  }

  .base_info_form {
    /deep/ .el-form-item {
      margin-right: 20px;
    }
  }
}
</style>
