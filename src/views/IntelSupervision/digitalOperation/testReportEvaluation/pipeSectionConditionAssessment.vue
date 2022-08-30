<!-- 管段状况评估表 -->
<template>
    <div class="pipeSection_condition_assessment" title="管段状况评估表">
        <el-button class="add_info_button" type="primary" @click="addTable">新增</el-button>
        <el-table max-height="500px" :data="tableData">
            <el-table-column type="index" label="序号" width="80px"></el-table-column>
            <el-table-column prop="pipeNum" label="管段编号">
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
            <el-table-column prop="length" label="长度(m)">
                <template slot-scope="scope">
                <el-input v-if="currUpdateIndex == scope.$index" v-model="scope.row.length"></el-input>
                <span v-else>{{scope.row.length}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="material" label="材质">
                <template slot-scope="scope">
                <el-input v-if="currUpdateIndex == scope.$index" v-model="scope.row.material"></el-input>
                <span v-else>{{scope.row.material}}</span>
                </template>
            </el-table-column>
            <el-table-column label="埋深(m)">
                <el-table-column prop="buryStart" label="起点">
                    <template slot-scope="scope">
                        <el-input v-if="currUpdateIndex == scope.$index" v-model="scope.row.buryStart"></el-input>
                        <span v-else>{{scope.row.buryStart}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="buryEnd" label="终点">
                    <template slot-scope="scope">
                        <el-input v-if="currUpdateIndex == scope.$index" v-model="scope.row.buryEnd"></el-input>
                        <span v-else>{{scope.row.buryEnd}}</span>
                    </template>
                </el-table-column>
            </el-table-column>
            <el-table-column label="结构性缺陷">
                <el-table-column prop="contructDefectAvg" label="平均值">
                    <template slot-scope="scope">
                        <el-input v-if="currUpdateIndex == scope.$index" v-model="scope.row.contructDefectAvg"></el-input>
                        <span v-else>{{scope.row.contructDefectAvg}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="contructDefectMax" label="最大值">
                    <template slot-scope="scope">
                        <el-input v-if="currUpdateIndex == scope.$index" v-model="scope.row.contructDefectMax"></el-input>
                        <span v-else>{{scope.row.contructDefectMax}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="contructDefectLevel" label="缺陷等级">
                    <template slot-scope="scope">
                        <el-input v-if="currUpdateIndex == scope.$index" v-model="scope.row.contructDefectLevel"></el-input>
                        <span v-else>{{scope.row.contructDefectLevel}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="contructDefectDensity" label="缺陷密度">
                    <template slot-scope="scope">
                        <el-input v-if="currUpdateIndex == scope.$index" v-model="scope.row.contructDefectDensity"></el-input>
                        <span v-else>{{scope.row.contructDefectDensity}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="contructDefectRi" label="修复指数RI">
                    <template slot-scope="scope">
                        <el-input v-if="currUpdateIndex == scope.$index" v-model="scope.row.contructDefectRi"></el-input>
                        <span v-else>{{scope.row.contructDefectRi}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="contructCompEvaluation" label="综合状况评价">
                    <template slot-scope="scope">
                        <el-input v-if="currUpdateIndex == scope.$index" v-model="scope.row.contructCompEvaluation"></el-input>
                        <span v-else>{{scope.row.contructCompEvaluation}}</span>
                    </template>
                </el-table-column>
            </el-table-column>
            <el-table-column label="功能性缺陷">
                <el-table-column prop="funcDefectAvg" label="平均值">
                    <template slot-scope="scope">
                        <el-input v-if="currUpdateIndex == scope.$index" v-model="scope.row.funcDefectAvg"></el-input>
                        <span v-else>{{scope.row.funcDefectAvg}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="funcDefectMax" label="最大值">
                    <template slot-scope="scope">
                        <el-input v-if="currUpdateIndex == scope.$index" v-model="scope.row.funcDefectMax"></el-input>
                        <span v-else>{{scope.row.funcDefectMax}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="funcDefectLevel" label="缺陷等级">
                    <template slot-scope="scope">
                        <el-input v-if="currUpdateIndex == scope.$index" v-model="scope.row.funcDefectLevel"></el-input>
                        <span v-else>{{scope.row.funcDefectLevel}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="funcDefectDensity" label="缺陷密度">
                    <template slot-scope="scope">
                        <el-input v-if="currUpdateIndex == scope.$index" v-model="scope.row.funcDefectDensity"></el-input>
                        <span v-else>{{scope.row.funcDefectDensity}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="funcDefectMi" label="修复指数MI">
                    <template slot-scope="scope">
                        <el-input v-if="currUpdateIndex == scope.$index" v-model="scope.row.funcDefectMi"></el-input>
                        <span v-else>{{scope.row.funcDefectMi}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="funcCompEvaluation" label="综合状况评价">
                    <template slot-scope="scope">
                        <el-input v-if="currUpdateIndex == scope.$index" v-model="scope.row.funcCompEvaluation"></el-input>
                        <span v-else>{{scope.row.funcCompEvaluation}}</span>
                    </template>
                </el-table-column>
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
  getPipeSituation,
  updatePipeSituation,
  delPipeSituation,
  savePipeSituation
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
        if (val == "pipeSectionConditionAssessment") {
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
        (await awaitWrap(getPipeSituation({ ..._this.currRowData })))[1] || [];

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
          await savePipeSituation({
            ..._this.baseInfoInitData,
            ...row,
            pshCode: _this.currRowData["pshCode"]
          }).then(res => {
            _this.isHasAdd = false;
            _this.currUpdateIndex = -1;
          });
        } else {
          // 修改- 保存
          await updatePipeSituation({ ...row }).then(res => {
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
          length: "",
          material: "",
          buryEnd: "",
          buryStart: "",
          contructDefectAvg: "",
          contructDefectMax: "",
          contructDefectLevel: "",
          contructDefectDensity: "",
          contructDefectRi: "",
          contructCompEvaluation: "",
          funcDefectAvg: "",
          funcDefectMax: "",
          funcDefectLevel: "",
          funcDefectDensity: "",
          funcDefectMi: "",
          funcCompEvaluation: "",
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
            delPipeSituation({ id: row["id"] }).then(() => {
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
.pipeSection_condition_assessment {
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
