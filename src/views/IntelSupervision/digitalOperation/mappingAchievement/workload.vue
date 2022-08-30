<!-- 工作量 -->
<template>
    <div class="workload">
        <el-button class="add_info_button" type="primary" @click="addTable">新增</el-button>
        <!-- show-summary -->
        <el-table 
            max-height="500px" 
            :data="tableData" 
            border
            :span-method="tableSpanMethod" 
            ref="workloadTable"
        >
            <el-table-column width="60" label="选择">
                <template slot-scope="scope">
                    <el-radio 
                        v-if="scope.row['rowType'] != 2 && 
                        !(checkNotNull(currUpdatePipeType) && scope.row.isAddPipeType === true)" 
                        class="radio" 
                        @click.native.prevent="changeTableSelectionType(scope)" 
                        v-model="tableSelectionType" 
                        :label="scope.row.pipeType"
                    >&nbsp;</el-radio>
                </template>
            </el-table-column>
            <el-table-column prop="pipeType" label="管线种类">
                <template slot-scope="scope">
                    <el-select v-if="scope.row.isAddPipeType" v-model="scope.row.pipeType">
                        <template v-for="item in pipeTypeList">
                            <el-option
                                v-if="existencePipeType.indexOf(item['code']) == -1" 
                                :key="item['code']"
                                :label="item['name']"
                                :value="item['code']"
                            ></el-option>
                        </template>
                    </el-select>
                    <span v-else>
                        {{  
                            scope.row.pipeType == 1 ? "雨水管" : 
                            scope.row.pipeType == 2 ? "污水管" : 
                            scope.row.pipeType == 3 ? "雨污合流管" : 
                            "合计"
                        }}
                    </span>
                </template>
            </el-table-column>
            <el-table-column prop="pipeLength" label="长度(m)">
                <template slot-scope="scope">
                    <el-input v-if="currUpdateIndex == scope.$index || (checkNotNull(currUpdatePipeType) && scope.row.isAddPipeType === true)" v-model="scope.row.pipeLength"></el-input>
                    <span v-else>{{scope.row.pipeLength}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="diameterSection" label="管径(mm)">
                <template slot-scope="scope">
                    <el-input v-if="currUpdateIndex == scope.$index || (checkNotNull(currUpdatePipeType) && scope.row.isAddPipeType === true)" v-model="scope.row.diameterSection"></el-input>
                    <span v-else>{{scope.row.diameterSection}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="material" label="材质">
                <template slot-scope="scope">
                    <el-input v-if="currUpdateIndex == scope.$index || (checkNotNull(currUpdatePipeType) && scope.row.isAddPipeType === true)" v-model="scope.row.material"></el-input>
                    <span v-else>{{scope.row.material}}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center">
                <template slot-scope="scope" v-if="scope.row['rowType'] != 2 && !(checkNotNull(currUpdatePipeType) && scope.row.isAddPipeType === true)">
                    <el-button type="text" size="small" style="color:#f00" @click="deletePipeInfoData(scope)">删除</el-button>
                    <el-button type="text" size="small" style="color:#fff" @click="updatePipeInfoData(scope)">
                        {{currUpdateIndex == scope.$index ? "保存" : "修改"}}
                    </el-button>
                </template>
            </el-table-column>   
            <el-table-column prop="obviousPoint" label="明显点">
                <template slot-scope="scope">
                    <el-input v-if="currUpdatePipeType == scope.row.pipeType || (checkNotNull(currUpdatePipeType) && scope.row.isAddPipeType === true)" v-model="scope.row.obviousPoint"></el-input>
                    <span v-else>{{scope.row.obviousPoint}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="hiddenPoint" label="隐蔽点">
                <template slot-scope="scope">
                    <el-input v-if="currUpdatePipeType == scope.row.pipeType || (checkNotNull(currUpdatePipeType) && scope.row.isAddPipeType === true)" v-model="scope.row.hiddenPoint"></el-input>
                    <span v-else>{{scope.row.hiddenPoint}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="totalPoint" label="点数合计"></el-table-column>
            <el-table-column label="操作" align="center">
                <template slot-scope="scope" v-if="scope.row['rowType'] != 2">
                    <el-button type="text" size="small" style="color:#f00" @click="deletePipeTypeData(scope)">删除</el-button>
                    <el-button type="text" size="small" style="color:#fff" @click="updatePipeTypeData(scope)">
                        {{currUpdatePipeType == scope.row.pipeType || (checkNotNull(currUpdatePipeType) && scope.row.isAddPipeType === true) ? "保存" : "修改"}}
                    </el-button>
                </template>
            </el-table-column>   
        </el-table>
    </div>   
</template>

<script>
import {
  getMapWorkload,
  updateMapWorkPipeType,
  updateMapWork,
  saveMapWorkPicType,
  saveMapWork,
  delMapWorkPipeType,
  delMapWork
} from "@/api/IntelSupervision";
import {
  awaitWrap,
  checkNotNull,
  filterTableRowSpanList,
  setTableRowSpan
} from "@/lib";

export default {
  data() {
    return {
      currUpdatePipeType: -1,
      currUpdateIndex: -1,
      tableData: [],
      currRowData: {},
      isHasAdd: false,
      tableSelectionType: "-1",
      //   tableSelectData: "",
      existencePipeType: [],
      pipeTypeList: [
        { name: "雨水管", code: "1" },
        { name: "污水管", code: "2" },
        { name: "雨污合流管", code: "3" }
      ]
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
        if (val == "workload") {
          this.currRowData = this.$store.state.IntelSupervison.digitalManagement;
          this.getTableData();
        }
      }
    }
  },
  methods: {
    checkNotNull,
    // 选择
    changeTableSelectionType({ row }) {
      if (this.tableSelectionType == row.pipeType) {
        this.tableSelectionType = "";
        this.tableSelectData = "";
      } else {
        this.tableSelectionType = row.pipeType;
        this.tableSelectData = { ...row };
      }
    },
    // 查询
    async getTableData() {
      const _this = this;
      _this.isHasAdd = false;
      _this.currUpdateIndex = -1;
      _this.currUpdatePipeType = -1;

      let tableInfo =
        (await awaitWrap(getMapWorkload({ ..._this.currRowData })))[1] || [];

      if (checkNotNull(tableInfo) && checkNotNull(tableInfo["data"])) {
        _this.tableData = tableInfo["data"] || [];
        let pipeTypeData = _this.tableData.map(m => {
          return m["pipeType"];
        });
        _this.existencePipeType = [...new Set(pipeTypeData)];

        _this.doLayoutTable();
      } else {
        _this.tableData = [];
      }
    },
    // 跨行合并
    tableSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (
        columnIndex === 0 ||
        columnIndex === 1 ||
        columnIndex === 6 ||
        columnIndex === 7 ||
        columnIndex === 8 ||
        columnIndex === 9
      ) {
        return setTableRowSpan(this.tableSpanList, rowIndex);
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
        // 新增小类
        if (
          checkNotNull(_this.tableSelectionType) &&
          _this.tableSelectionType != -1
        ) {
          let dataIndex =
            _this.tableData
              .map(m => m["pipeType"])
              .lastIndexOf(_this.tableSelectionType) + 1;
          _this.tableData.splice(dataIndex, 0, {
            ..._this.tableSelectData,
            ...{
              pipeLength: "",
              diameterSection: "",
              material: "",
              isAdd: true
            }
          });

          _this.currUpdateIndex = dataIndex;
          //   _this.$nextTick(() => {
          //     _this.$refs.workloadTable.doLayout();
          //   });
        } else {
          // 新增大类
          _this.tableData.splice(_this.tableData.length - 1, 0, {
            rowType: "1",
            pipeType: "",
            pipeLength: "",
            diameterSection: "",
            material: "",
            obviousPoint: "",
            hiddenPoint: "",
            totalPoint: "",
            isAddPipeType: true
          });
        }
      }

      _this.doLayoutTable();
      _this.isHasAdd = true;
    },
    // 调整表格
    doLayoutTable() {
      this.tableSpanList = filterTableRowSpanList({
        tableData: this.tableData,
        code: "pipeType",
        calculatNumber: false
      });
    },
    // 修改大类
    async updatePipeTypeData({ row, $index }) {
      const _this = this;
      // 保存
      if (_this.currUpdatePipeType == row.pipeType) {
        // 新增- 保存
        if (row["isAddPipeType"]) {
          await saveMapWorkPicType({
            ...row,
            pshCode: _this.currRowData["pshCode"]
          }).then(res => {
            _this.isHasAdd = false;
            _this.currUpdatePipeType = -1;
          });
        } else {
          // 修改- 保存
          await updateMapWorkPipeType({ ...row, ..._this.currRowData }).then(
            res => {
              _this.currUpdatePipeType = -1;
            }
          );
        }

        _this.getTableData();
      } else {
        // 修改
        _this.currUpdatePipeType = row.pipeType;
      }
    },
    // 修改小类
    async updatePipeInfoData({ row, $index }) {
      const _this = this;
      // 保存
      if (_this.currUpdateIndex == $index) {
        // 新增- 保存
        if (row["isAdd"]) {
          await saveMapWork({
            ...row,
            pshCode: _this.currRowData["pshCode"]
          }).then(res => {
            _this.isHasAdd = false;
            _this.currUpdateIndex = -1;
          });
        } else {
          // 修改- 保存
          await updateMapWork({ ...row }).then(res => {
            _this.currUpdateIndex = -1;
          });
        }

        _this.getTableData();
      } else {
        // 修改
        _this.currUpdateIndex = $index;
      }
    },
    // 删除大类
    deletePipeTypeData({ row, $index }) {
      const _this = this;
      // 新增 - 删除
      if (row.isAddPipeType) {
        _this.tableData.splice($index, 1);
        _this.doLayoutTable();
        _this.isHasAdd = false;
      } else {
        _this
          .$confirm(`确定要删除该条信息?`, "", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
          .then(() => {
            delMapWorkPipeType({
              ...row,
              pshCode: _this.currRowData["pshCode"]
            }).then(() => {
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
    },
    // 删除小类
    deletePipeInfoData({ row, $index }) {
      const _this = this;
      // 新增 - 删除
      if (row.isAdd) {
        _this.tableData.splice($index, 1);
        _this.doLayoutTable();
        _this.isHasAdd = false;
        _this.currUpdateIndex = "";
      } else {
        _this
          .$confirm(`确定要删除该条信息?`, "", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
          .then(() => {
            delMapWork({
              ...row
            }).then(() => {
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
.workload {
  margin-top: 0 !important;
  .add_info_button {
    float: right;
    margin-bottom: 15px;
  }
}
</style>
