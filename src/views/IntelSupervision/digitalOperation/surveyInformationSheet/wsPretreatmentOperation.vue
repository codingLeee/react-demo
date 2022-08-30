<!-- 排水户管道预处理作业前现场记录表 - 污水 -->
<template>
    <div class="ws_pretreatment_operation">
    <el-form class="base_info_form" ref="form" :inline="true" :model="baseInfoForm">
        <el-form-item label="填表时间：">
            <el-input v-model="baseInfoForm.fillTime" disabled></el-input>
        </el-form-item>
        <el-form-item label="行政区：">
            <el-input v-model="baseInfoForm.administrativeArea" :disabled="!isUpdateForm"></el-input>
        </el-form-item>
        <el-form-item label="测区：">
            <el-input v-model="baseInfoForm.monitorArea" :disabled="!isUpdateForm"></el-input>
        </el-form-item>
        <el-form-item label="排水户名称：">
            <el-input v-model="baseInfoForm.pshName" disabled></el-input>
        </el-form-item>
        <el-form-item label="雨水长度(m)：">
            <el-input v-model="baseInfoForm.waterPipeLength" :disabled="!isUpdateForm"></el-input>
        </el-form-item>
        <div>
            <el-form-item label="污水长度(m)："></el-form-item>
            <el-form-item label="水位≥20CM：">
                <el-input v-model="baseInfoForm.sewagePipeHlength" :disabled="!isUpdateForm"></el-input>
            </el-form-item>
            <el-form-item label="水位≤20CM：">
                <el-input v-model="baseInfoForm.sewagePipeLlength" :disabled="!isUpdateForm"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button @click="updateForm">{{isUpdateForm ? "保存" : "编辑"}}</el-button>
            </el-form-item>
            <el-button class="add_info_button" type="primary" @click="addTable">新增</el-button>
        </div>
    </el-form>
    <el-table max-height="500px" :data="tableData" class="digitalManagement_table">
      <el-table-column type="expand">
        <template slot-scope="props">
          <tableExpandImg ref="tableImg" 
            :imgsSrc="props.row.scenePicUrl" 
            :isAdd="props.row.isAdd"
            @updateImg="updateImg($event,props.row)" 
            @deleteImg="deleteImg($event,props.row)" 
          />
        </template>
      </el-table-column>
      <el-table-column prop="wellNum" label="污水井号">
        <template slot-scope="scope">
          <el-input v-if="currUpdateIndex == scope.$index" v-model="scope.row.wellNum"></el-input>
          <span v-else>{{scope.row.wellNum}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="diameterSection" label="污水井管径(DN)">
        <template slot-scope="scope">
          <el-input v-if="currUpdateIndex == scope.$index" v-model="scope.row.diameterSection"></el-input>
          <span v-else>{{scope.row.diameterSection}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="waterLevel" label="污水井水位(cm)">
        <template slot-scope="scope">
          <el-input v-if="currUpdateIndex == scope.$index" v-model="scope.row.waterLevel"></el-input>
          <span v-else>{{scope.row.waterLevel}}</span>
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
    <div class="note">注：水位包含水深和泥深，雨水找出水位刚好是 600-1000 管径 20%或≥1000 管径 20CM 的井号，污水找出水位刚好是 20CM 的井号。</div>        
    </div>    
</template>

<script>
import tableExpandImg from "../../common/tableExpandImg.vue";
import {
  sceneUploadPic,
  delScenePic,
  updateScene,
  delScene,
  saveScene,
  updateSceneHeader
} from "@/api/IntelSupervision";
import { awaitWrap, checkNotNull } from "@/lib";

export default {
  components: { tableExpandImg },
  data() {
    return {
      currUpdateIndex: -1,
      tableData: [],
      testSrcList: [],
      isHasAdd: false,
      baseInfoForm: {},
      isUpdateForm: false,
      baseInfoInitData: {}
    };
  },
  props: {
    tableInfoData: [],
    currRowData: {}
  },
  watch: {
    tableInfoData: {
      immediate: true,
      deep: true,
      handler(val) {
        const _this = this;
        if (checkNotNull(val)) {
          _this.tableData = val || [];
          _this.baseInfoForm = _this.baseInfoInitData = JSON.parse(
            JSON.stringify(val[0] || {})
          );
        }
      }
    }
  },
  methods: {
    // 修改
    async updateTable({ row, $index }) {
      const _this = this;
      // 保存
      if (_this.currUpdateIndex == $index) {
        // 新增- 保存
        if (row["isAdd"]) {
          await saveScene({
            ..._this.baseInfoInitData,
            ...row,
            pshCode: _this.currRowData["pshCode"],
            pipeType: 2
          }).then(res => {
            _this.isHasAdd = false;
            _this.currUpdateIndex = -1;
          });
        } else {
          // 修改- 保存
          await updateScene({ ...row, pipeType: 2 }).then(res => {
            _this.isHasAdd = false;
            _this.currUpdateIndex = -1;
          });
        }

        _this.$emit("getTableData");
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
          wellNum: "",
          diameterSection: "",
          waterLevel: "",
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
            delScene({ id: row["id"] }).then(() => {
              _this.$message({
                type: "success",
                message: "删除成功！"
              });

              _this.$emit("getTableData");
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
    // 图片上传
    async updateImg(fileObj, row) {
      const _this = this;
      fileObj.append("id", row["id"]);
      sceneUploadPic(fileObj)
        .then(() => {
          _this.$message({
            type: "success",
            message: "上传成功！"
          });

          _this.$refs.tableImg.cancelUpload();
          _this.$emit("getTableData");
        })
        .catch(() => {
          _this.$refs.tableImg.cancelUpload();
        });
    },
    // 图片删除
    async deleteImg(fileName, row) {
      const _this = this;
      _this
        .$confirm(`确定要删除该图片?`, "", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          delScenePic({ id: row["id"], objectName: fileName }).then(() => {
            _this.$message({
              type: "success",
              message: "删除成功！"
            });

            _this.$emit("getTableData");
          });
        })
        .catch(() => {
          _this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // 编辑form表单
    updateForm() {
      const _this = this;
      // 修改 - 保存
      if (_this.isUpdateForm) {
        updateSceneHeader({ ..._this.baseInfoForm, pipeType: 2 })
          .then(res => {
            _this.$emit("getTableData");
          })
          .catch(err => {
            _this.isUpdateForm = JSON.parse(
              JSON.stringify(_this.baseInfoInitData)
            );
          });
      }
      _this.isUpdateForm = !_this.isUpdateForm;
    }
  },
  created() {},
  mounted() {},
  beforeDestroy() {}
};
</script>

<style lang="scss" scoped>
.ws_pretreatment_operation {
  margin-top: 30px;
  .add_info_button {
    float: right;
    margin-bottom: 15px;
  }

  .base_info_form {
    /deep/ .el-form-item {
      margin-right: 20px;
    }
  }

  .note {
    font-size: 14px;
    color: #ff3f3f;
    line-height: 52px;
  }
}
</style>
