<!-- 排水户内部排水附属构筑物清单 -->
<template>
    <div class="ancillary_structures">
        <el-form class="base_info_form" ref="form" :inline="true" :model="baseInfoInitData">
            <el-form-item label="填表时间：">
                <el-input v-model="baseInfoInitData.fileTime" disabled></el-input>
            </el-form-item>
            <el-button class="add_info_button" type="primary" @click="addTable">新增</el-button>
        </el-form>
        <el-table max-height="500px" :data="tableData">
            <el-table-column type="index" label="序号" width="80px"></el-table-column>
            <el-table-column prop="pshName" label="排水户名称">
                <template slot-scope="scope">
                <el-input v-if="currUpdateIndex == scope.$index" v-model="scope.row.pshName"></el-input>
                <span v-else>{{scope.row.pshName}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="belongStreet" label="所属街道">
                <template slot-scope="scope">
                <el-input v-if="currUpdateIndex == scope.$index" v-model="scope.row.belongStreet"></el-input>
                <span v-else>{{scope.row.belongStreet}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="facilityName" label="设施名称">
                <template slot-scope="scope">
                <el-input v-if="currUpdateIndex == scope.$index" v-model="scope.row.facilityName"></el-input>
                <span v-else>{{scope.row.facilityName}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="facilityScale" label="设施规模">
                <template slot-scope="scope">
                <el-input v-if="currUpdateIndex == scope.$index" v-model="scope.row.facilityScale"></el-input>
                <span v-else>{{scope.row.facilityScale}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="maintenanceInfo" label="使用维护情况">
                <template slot-scope="scope">
                <el-input v-if="currUpdateIndex == scope.$index" v-model="scope.row.maintenanceInfo"></el-input>
                <span v-else>{{scope.row.maintenanceInfo}}</span>
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
  getAncillary,
  updateAncillary,
  delAncillary,
  saveAncillary
} from "@/api/IntelSupervision";
import { awaitWrap, checkNotNull } from "@/lib";

export default {
  data() {
    return {
      currUpdateIndex: -1,
      tableData: [],
      currRowData: {},
      isHasAdd: false,
      baseInfoInitData: {}
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
        if (val == "ancillaryStructures") {
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
        (await awaitWrap(getAncillary({ ..._this.currRowData })))[1] || [];

      if (checkNotNull(tableInfo) && checkNotNull(tableInfo["data"])) {
        _this.tableData = tableInfo["data"] || [];
        _this.baseInfoInitData = JSON.parse(
          JSON.stringify(_this.tableData[0] || {})
        );
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
          await saveAncillary({
            ..._this.baseInfoInitData,
            ...row,
            pshCode: _this.currRowData["pshCode"]
          }).then(res => {
            _this.isHasAdd = false;
            _this.currUpdateIndex = -1;
          });
        } else {
          // 修改- 保存
          await updateAncillary({ ...row }).then(res => {
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
          pshName: "",
          belongStreet: "",
          facilityName: "",
          facilityScale: "",
          maintenanceInfo: "",
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
            delAncillary({ id: row["id"] }).then(() => {
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
.ancillary_structures {
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
