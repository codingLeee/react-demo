<!-- 管网运行情况评估及建议 -->
<template>
    <div class="pipeNetwork_operation_table">
        <div v-if="wellType == 1" class="table_info">{{checkNotNull(tableData) ? tableData[0]["header"] : ""}}</div>
        <div class="fix info_content">
            <div class="info_left">{{wellType == 1 ? "雨水：" : wellType == 2 ? "污水：" : ""}}</div>
            <el-button class="add_info_button" type="primary" @click="addTable">新增</el-button>
        </div>
        <el-table max-height="500px" :data="tableData">
            <el-table-column type="index" label="序号" width="80px"></el-table-column>
            <el-table-column prop="startNum" label="起始井">
                <template slot-scope="scope">
                <el-input v-if="currUpdateIndex == scope.$index" v-model="scope.row.startNum"></el-input>
                <span v-else>{{scope.row.startNum}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="endNum" label="终止井">
                <template slot-scope="scope">
                <el-input v-if="currUpdateIndex == scope.$index" v-model="scope.row.endNum"></el-input>
                <span v-else>{{scope.row.endNum}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="defectName" label="缺陷名称">
                <template slot-scope="scope">
                <el-input v-if="currUpdateIndex == scope.$index" v-model="scope.row.defectName"></el-input>
                <span v-else>{{scope.row.defectName}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="portraitPosition" label="纵向位置(距离m)">
                <template slot-scope="scope">
                    <el-input v-if="currUpdateIndex == scope.$index" v-model="scope.row.portraitPosition"></el-input>
                    <span v-else>{{scope.row.portraitPosition}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="horizontalPosition" label="环向位置(距离m)">
                <template slot-scope="scope">
                    <el-input v-if="currUpdateIndex == scope.$index" v-model="scope.row.horizontalPosition"></el-input>
                    <span v-else>{{scope.row.horizontalPosition}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="defectLevel" label="缺陷等级">
                <template slot-scope="scope">
                    <el-input v-if="currUpdateIndex == scope.$index" v-model="scope.row.defectLevel"></el-input>
                    <span v-else>{{scope.row.defectLevel}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="suggest" label="处理建议">
                <template slot-scope="scope">
                    <el-input v-if="currUpdateIndex == scope.$index" v-model="scope.row.suggest"></el-input>
                    <span v-else>{{scope.row.suggest}}</span>
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
  getPipeRunning,
  updatePipeRunning,
  delPipeRunning,
  savePipeRunning
} from "@/api/IntelSupervision";
import { awaitWrap, checkNotNull } from "@/lib";

export default {
  data() {
    return {
      currUpdateIndex: -1,
      tableData: [],
      currRowData: {},
      isHasAdd: false,
      isUpdateForm: false
    };
  },
  props: {
    activeName: {
      type: String,
      default: ""
    },
    wellType: {}
  },
  watch: {
    activeName: {
      immediate: true,
      handler(val) {
        if (val == "pipeNetworkOperation") {
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
        (await awaitWrap(
          getPipeRunning({
            ..._this.currRowData,
            wellType: _this.wellType
          })
        ))[1] || [];

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
          await savePipeRunning({
            ...row,
            pshCode: _this.currRowData["pshCode"],
            wellType: _this.wellType
          }).then(res => {
            _this.isHasAdd = false;
            _this.currUpdateIndex = -1;
          });
        } else {
          // 修改- 保存
          await updatePipeRunning({ ...row }).then(res => {
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
          startNum: "",
          endNum: "",
          defectName: "",
          portraitPosition: "",
          horizontalPosition: "",
          defectLevel: "",
          suggest: "",
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
            delPipeRunning({ id: row["id"] }).then(() => {
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
.pipeNetwork_operation_table {
  .info_content {
    margin-top: 15px;
    .info_left {
      float: left;
      line-height: 40px;
    }
    .add_info_button {
      float: right;
      margin-bottom: 15px;
    }
  }
}
</style>
