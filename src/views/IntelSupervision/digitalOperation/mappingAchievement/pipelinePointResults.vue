<!-- 管线点成果表 -->
<template>
    <div class="pipeline_point_results">
        <el-form class="base_info_form" ref="form" :inline="true" :model="baseInfoForm">
            <el-form-item label="管线种类：">
                <el-input :value="baseInfoForm.pipeType == 1 ? '雨水' : baseInfoForm.pipeType == 2 ? '污水' :'其他'" disabled></el-input>
            </el-form-item>
            <el-form-item label="权属单位：">
                <el-input v-model="baseInfoForm.belongUnit" disabled></el-input>
            </el-form-item>
            <el-form-item label="图幅编号：">
                <el-input v-model="baseInfoForm.frameNum" disabled></el-input>
            </el-form-item>
            <el-form-item label="日期：">
                <el-input v-model="baseInfoForm.fillTime" disabled></el-input>
            </el-form-item>
            <el-form-item label="制表单位：">
                <el-input v-model="baseInfoForm.tabulationUnit" disabled></el-input>
            </el-form-item>
            <el-form-item label="制表者：">
                <el-input v-model="baseInfoForm.tabulationPerson" disabled></el-input>
            </el-form-item>
            <el-form-item label="校核者：">
                <el-input v-model="baseInfoForm.tabulationChecker" disabled></el-input>
            </el-form-item>
            <el-button class="add_info_button" type="primary" @click="addTable">新增</el-button>
        </el-form>
        <el-table max-height="500px" :data="tableData">
            <el-table-column label="管线点号">
                <el-table-column prop="picturePoint" label="图上点号">
                    <template slot-scope="scope">
                        <el-input v-if="currUpdateIndex == scope.$index" v-model="scope.row.picturePoint"></el-input>
                        <span v-else>{{scope.row.picturePoint}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="geophyPoint" label="物探点号">
                    <template slot-scope="scope">
                        <el-input v-if="currUpdateIndex == scope.$index" v-model="scope.row.geophyPoint"></el-input>
                        <span v-else>{{scope.row.geophyPoint}}</span>
                    </template>
                </el-table-column>
            </el-table-column>
            <el-table-column prop="cennectPoint" label="连接点号">
                <template slot-scope="scope">
                <el-input v-if="currUpdateIndex == scope.$index" v-model="scope.row.cennectPoint"></el-input>
                <span v-else>{{scope.row.cennectPoint}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="meterial" label="管线材质">
                <template slot-scope="scope">
                <el-input v-if="currUpdateIndex == scope.$index" v-model="scope.row.meterial"></el-input>
                <span v-else>{{scope.row.meterial}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="diameterSection" label="管径或断面尺寸(mm)">
                <template slot-scope="scope">
                <el-input v-if="currUpdateIndex == scope.$index" v-model="scope.row.diameterSection"></el-input>
                <span v-else>{{scope.row.diameterSection}}</span>
                </template>
            </el-table-column>
            <el-table-column label="管线类别">
                <el-table-column prop="pipeFeature" label="特征">
                    <template slot-scope="scope">
                        <el-input v-if="currUpdateIndex == scope.$index" v-model="scope.row.pipeFeature"></el-input>
                        <span v-else>{{scope.row.pipeFeature}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="pipeAppendage" label="附属物">
                    <template slot-scope="scope">
                        <el-input v-if="currUpdateIndex == scope.$index" v-model="scope.row.pipeAppendage"></el-input>
                        <span v-else>{{scope.row.pipeAppendage}}</span>
                    </template>
                </el-table-column>
            </el-table-column>
            <el-table-column label="平面坐标(m)">
                <el-table-column prop="coordinateX" label="X">
                    <template slot-scope="scope">
                        <el-input v-if="currUpdateIndex == scope.$index" v-model="scope.row.coordinateX"></el-input>
                        <span v-else>{{scope.row.coordinateX}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="coordinateY" label="Y">
                    <template slot-scope="scope">
                        <el-input v-if="currUpdateIndex == scope.$index" v-model="scope.row.coordinateY"></el-input>
                        <span v-else>{{scope.row.coordinateY}}</span>
                    </template>
                </el-table-column>
            </el-table-column>
            <el-table-column label="高程(m)">
                <el-table-column prop="pipeGround" label="地面">
                    <template slot-scope="scope">
                        <el-input v-if="currUpdateIndex == scope.$index" v-model="scope.row.pipeGround"></el-input>
                        <span v-else>{{scope.row.pipeGround}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="pipeElevation" label="管线高程">
                    <template slot-scope="scope">
                        <el-input v-if="currUpdateIndex == scope.$index" v-model="scope.row.pipeElevation"></el-input>
                        <span v-else>{{scope.row.pipeElevation}}</span>
                    </template>
                </el-table-column>
            </el-table-column>
            <el-table-column prop="buryDeep" label="埋深(m)">
                <template slot-scope="scope">
                    <el-input v-if="currUpdateIndex == scope.$index" v-model="scope.row.buryDeep"></el-input>
                    <span v-else>{{scope.row.buryDeep}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="flowDirection" label="流向">
                <template slot-scope="scope">
                    <el-input v-if="currUpdateIndex == scope.$index" v-model="scope.row.flowDirection"></el-input>
                    <span v-else>{{scope.row.flowDirection}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="buryWay" label="埋设方式">
                <template slot-scope="scope">
                    <el-input v-if="currUpdateIndex == scope.$index" v-model="scope.row.buryWay"></el-input>
                    <span v-else>{{scope.row.buryWay}}</span>
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
  getPipeline,
  updateMapAchievement,
  delMapAchievement,
  saveMapAchievement
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
      isUpdateForm: false
    };
  },
  props: {
    activeName: {
      type: String,
      default: ""
    },
    properties: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  watch: {
    activeName: {
      immediate: true,
      handler(val) {
        if (val == this.properties["panelName"]) {
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
        (await awaitWrap(
          getPipeline({ ..._this.currRowData, pipeType: _this.properties.pipeType })
        ))[1] || [];

      if (checkNotNull(tableInfo) && checkNotNull(tableInfo["data"])) {
        _this.tableData = tableInfo["data"] || [];
        _this.baseInfoForm = JSON.parse(
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
          await saveMapAchievement({
            ..._this.baseInfoForm,
            ...row,
            pshCode: _this.currRowData["pshCode"],
            pipeType: _this.properties.pipeType
          }).then(res => {
            _this.isHasAdd = false;
            _this.currUpdateIndex = -1;
          });
        } else {
          // 修改- 保存
          await updateMapAchievement({ ...row }).then(res => {
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
          picturePoint: "",
          geophyPoint: "",
          cennectPoint: "",
          meterial: "",
          diameterSection: "",
          pipeFeature: "",
          pipeAppendage: "",
          coordinateX: "",
          coordinateY: "",
          pipeGround: "",
          pipeElevation: "",
          buryDeep: "",
          flowDirection: "",
          buryWay: "",
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
            delMapAchievement({ id: row["id"] }).then(() => {
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
.pipeline_point_results {
  .add_info_button {
    float: right;
    margin-bottom: 15px;
  }

  .base_info_form {
    /deep/ .el-form-item {
      margin-right: 20px;

      .el-form-item__label {
        width: 100px;
      }
    }
  }
}
</style>
