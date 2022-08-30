<!-- 主要工程量表 -->
<template>
    <div class="principal_quantities_bill" title="主要工程量表">
        <el-button class="add_info_button" type="primary" @click="addTable">新增</el-button>
        <el-table max-height="500px" :data="tableData">
            <el-table-column type="index" label="序号" width="80px">
                <template slot-scope="scope">
                    <span>{{scope.row.rowType == 1 ? scope.$index + 1 : ''}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="name" label="名称">
                <template slot-scope="scope">
                    <span v-if="scope.row.rowType == 2">合计</span>
                    <el-input v-else-if="currUpdateIndex == scope.$index" v-model="scope.row.name"></el-input>
                    <span v-else>{{scope.row.name}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="diameterSection" label="管径(mm)">
                <template slot-scope="scope">
                <el-input v-if="currUpdateIndex == scope.$index" v-model="scope.row.diameterSection"></el-input>
                <span v-else>{{scope.row.diameterSection}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="pipeLength" label="管段长度(m)">
                <template slot-scope="scope">
                <el-input v-if="currUpdateIndex == scope.$index" v-model="scope.row.pipeLength"></el-input>
                <span v-else>{{scope.row.pipeLength}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="detectLength" label="检测长度(m)">
                <template slot-scope="scope">
                <el-input v-if="currUpdateIndex == scope.$index" v-model="scope.row.detectLength"></el-input>
                <span v-else>{{scope.row.detectLength}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="remark" label="备注">
                <template slot-scope="scope">
                <el-input v-if="currUpdateIndex == scope.$index" v-model="scope.row.remark"></el-input>
                <span v-else>{{scope.row.remark}}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center">
                <template slot-scope="scope" v-if="scope.row.rowType == 1">
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
  getProjectScale,
  updateProjectScale,
  delProjectScale,
  saveProjectScale
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
        if (val == "principalQuantitiesBill") {
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
      _this.isHasAdd = false;

      let tableInfo =
        (await awaitWrap(getProjectScale({ ..._this.currRowData })))[1] || [];

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
          await saveProjectScale({
            ..._this.baseInfoInitData,
            ...row,
            pshCode: _this.currRowData["pshCode"]
          }).then(res => {
            _this.isHasAdd = false;
            _this.currUpdateIndex = -1;
          });
        } else {
          // 修改- 保存
          await updateProjectScale({ ...row }).then(res => {
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
        _this.tableData.splice(_this.tableData.length - 1, 0, {
          name: "",
          diameterSection: "",
          pipeLength: "",
          detectLength: "",
          remark: "",
          isAdd: true
        });

        _this.isHasAdd = true;
        _this.currUpdateIndex = _this.tableData.length - 2;
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
            delProjectScale({ id: row["id"] }).then(() => {
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
.principal_quantities_bill {
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
