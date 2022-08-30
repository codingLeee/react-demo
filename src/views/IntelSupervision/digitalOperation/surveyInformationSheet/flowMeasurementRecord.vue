<!-- 流量测定记录表 -->
<template>
    <div class="flow_measurement_record">
        <el-form class="base_info_form" ref="form" :inline="true" :model="baseInfoForm">
            <el-form-item label="所属系统：">
                <el-input v-model="baseInfoForm.belongSystem" :disabled="!isUpdateForm"></el-input>
            </el-form-item>
            <el-form-item label="填表时间：">
                <el-input v-model="baseInfoForm.fillTime" disabled></el-input>
            </el-form-item>
            <el-form-item>
                <el-button @click="updateForm">{{isUpdateForm ? "保存" : "编辑"}}</el-button>
            </el-form-item>
            <el-button class="add_info_button" type="primary" @click="addTable">新增</el-button>
        </el-form>
        <el-table max-height="500px" :data="tableData">
            <el-table-column prop="serveyWellNum" label="测定井(点)号码">
                <template slot-scope="scope">
                <el-input v-if="currUpdateIndex == scope.$index" v-model="scope.row.serveyWellNum"></el-input>
                <span v-else>{{scope.row.serveyWellNum}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="upDownWellNum" label="上(下)游井(点)号码">
                <template slot-scope="scope">
                <el-input v-if="currUpdateIndex == scope.$index" v-model="scope.row.upDownWellNum"></el-input>
                <span v-else>{{scope.row.upDownWellNum}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="testTime" label="时间">
                <template slot-scope="scope">
                <el-input v-if="currUpdateIndex == scope.$index" v-model="scope.row.testTime"></el-input>
                <span v-else>{{scope.row.testTime}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="weather" label="天气">
                <template slot-scope="scope">
                <el-input v-if="currUpdateIndex == scope.$index" v-model="scope.row.weather"></el-input>
                <span v-else>{{scope.row.weather}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="measurementMethod" label="测量方法">
                <template slot-scope="scope">
                <el-input v-if="currUpdateIndex == scope.$index" v-model="scope.row.measurementMethod"></el-input>
                <span v-else>{{scope.row.measurementMethod}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="diameterSection" label="管径(mm)">
                <template slot-scope="scope">
                <el-input v-if="currUpdateIndex == scope.$index" v-model="scope.row.diameterSection"></el-input>
                <span v-else>{{scope.row.diameterSection}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="waterLevel" label="水位(mm)">
                <template slot-scope="scope">
                <el-input v-if="currUpdateIndex == scope.$index" v-model="scope.row.waterLevel"></el-input>
                <span v-else>{{scope.row.waterLevel}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="flowRate" label="流速(m/d)">
                <template slot-scope="scope">
                <el-input v-if="currUpdateIndex == scope.$index" v-model="scope.row.flowRate"></el-input>
                <span v-else>{{scope.row.flowRate}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="flow" label="流量(m³/d)">
                <template slot-scope="scope">
                <el-input v-if="currUpdateIndex == scope.$index" v-model="scope.row.flow"></el-input>
                <span v-else>{{scope.row.flow}}</span>
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
  getFlowMeasurement,
  updateFlowMeasurement,
  delFlowMeasurement,
  saveFlowMeasurement,
  updateFlowMeasurementHeader
} from "@/api/IntelSupervision";
import { awaitWrap, checkNotNull } from "@/lib";

export default {
  data() {
    return {
      currUpdateIndex: -1,
      tableData: [],
      currRowData: {},
      isHasAdd: false,
      baseInfoForm: {},
      baseInfoInitData: {},
      isUpdateForm: false
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
        if (val == "flowMeasurementRecord") {
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
        (await awaitWrap(getFlowMeasurement({ ..._this.currRowData })))[1] || [];

      if (checkNotNull(tableInfo) && checkNotNull(tableInfo["data"])) {
        _this.tableData = tableInfo["data"] || [];
        _this.baseInfoForm = _this.baseInfoInitData = JSON.parse(
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
          await saveFlowMeasurement({
            ..._this.baseInfoInitData,
            ...row,
            pshCode: _this.currRowData["pshCode"]
          }).then(res => {
            _this.isHasAdd = false;
            _this.currUpdateIndex = -1;
          });
        } else {
          // 修改- 保存
          await updateFlowMeasurement({ ...row }).then(res => {
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
          serveyWellNum: "",
          upDownWellNum: "",
          testTime: "",
          weather: "",
          measurementMethod: "",
          diameterSection: "",
          waterLevel: "",
          flowRate: "",
          flow: "",
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
            delFlowMeasurement({ id: row["id"] }).then(() => {
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
    // 编辑form表单
    updateForm() {
      const _this = this;
      // 修改 - 保存
      if (_this.isUpdateForm) {
        updateFlowMeasurementHeader({ ..._this.baseInfoForm })
          .then(res => {
            _this.getTableData();
          })
          .catch(err => {
            _this.isUpdateForm = JSON.parse(
              JSON.stringify(_this.baseInfoInitData)
            );
          });
      }
      _this.isUpdateForm = !_this.isUpdateForm;
    }
  }
};
</script>

<style lang="scss" scoped>
.flow_measurement_record {
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
