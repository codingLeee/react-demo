<!-- 排水户内部检查井（雨水口）调查表 -->
<template>
    <div class="balcony_drainage">
        <el-button class="add_info_button" type="primary" @click="addTable">新增</el-button>
        <el-table max-height="500px" :data="tableData">
            <el-table-column prop="surveyWellCode" label="调查井(口)编号">
                <template slot-scope="scope">
                <el-input v-if="currUpdateIndex == scope.$index" v-model="scope.row.surveyWellCode"></el-input>
                <span v-else>{{scope.row.surveyWellCode}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="connectionWellCode" label="连接井(口、点)编号">
                <template slot-scope="scope">
                <el-input v-if="currUpdateIndex == scope.$index" v-model="scope.row.connectionWellCode"></el-input>
                <span v-else>{{scope.row.connectionWellCode}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="pipeShape" label="管道形状">
                <template slot-scope="scope">
                <el-input v-if="currUpdateIndex == scope.$index" v-model="scope.row.pipeShape"></el-input>
                <span v-else>{{scope.row.pipeShape}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="diameterSection" label="管径/断面(mm)">
                <template slot-scope="scope">
                <el-input v-if="currUpdateIndex == scope.$index" v-model="scope.row.diameterSection"></el-input>
                <span v-else>{{scope.row.diameterSection}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="flowDirection" label="流向">
                <template slot-scope="scope">
                <el-input v-if="currUpdateIndex == scope.$index" v-model="scope.row.flowDirection"></el-input>
                <span v-else>{{scope.row.flowDirection}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="pipeProperties" label="管道属性">
                <template slot-scope="scope">
                <el-input v-if="currUpdateIndex == scope.$index" v-model="scope.row.pipeProperties"></el-input>
                <span v-else>{{scope.row.pipeProperties}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="connectivity" label="连通状况">
                <template slot-scope="scope">
                    <el-radio-group v-if="currUpdateIndex == scope.$index" v-model="scope.row.connectivity">
                        <el-radio label="1">是</el-radio>
                        <el-radio label="0">否</el-radio>
                    </el-radio-group>
                    <span v-else>{{scope.row.connectivity == 1 ? "是" : "否"}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="mixedConnectivity" label="混接状况">
                <template slot-scope="scope">
                    <el-radio-group v-if="currUpdateIndex == scope.$index" v-model="scope.row.mixedConnectivity">
                        <el-radio label="1">是</el-radio>
                        <el-radio label="0">否</el-radio>
                    </el-radio-group>
                    <span v-else>{{scope.row.mixedConnectivity == 1 ? "是" : "否"}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="remark" label="备注">
                <template slot-scope="scope">
                <el-input v-if="currUpdateIndex == scope.$index" v-model="scope.row.remark"></el-input>
                <span v-else>{{scope.row.remark}}</span>
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
  getInsideWells,
  updateDrainageWell,
  delDrainageWell,
  saveDrainageWell
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
        if (val == "internalCheckWell") {
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
        (await awaitWrap(getInsideWells({ ..._this.currRowData })))[1] || [];

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
          await saveDrainageWell({
            ...row,
            pshCode: _this.currRowData["pshCode"]
          }).then(res => {
            _this.isHasAdd = false;
            _this.currUpdateIndex = -1;
          });
        } else {
          // 修改- 保存
          await updateDrainageWell({ ...row }).then(res => {
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
          surveyWellCode: "",
          connectionWellCode: "",
          pipeShape: "",
          diameterSection: "",
          flowDirection: "",
          pipeProperties: "",
          connectivity: "",
          mixedConnectivity: "",
          remark: "",
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
            delDrainageWell({ id: row["id"] }).then(() => {
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
.balcony_drainage {
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
