<!-- 管段检测与评估成果表 -->
<template>
    <div class="pipeSection_inspection_evaluation_table" title="管段检测与评估成果表">
        <el-button class="add_info_button" type="primary" @click="addTable">新增</el-button>
        <el-table max-height="500px" :data="tableData">
            <el-table-column type="expand">
                <template slot-scope="props"  v-if="!props.row.isAdd">
                    <evaluationTableDetails :data="props.row" />
                </template>
            </el-table-column>
            <el-table-column prop="video" label="录像文件">
                <template slot-scope="scope">
                    <el-upload
                        v-if="currUpdateIndex == scope.$index"
                        class="upload-demo"
                        action=""
                        :multiple='false'
                        :show-file-list='false'
                        :limit="1"
                        :http-request="uploadFile" 
                    >
                        <span class="file_content">{{scope.row.video}}</span>
                    </el-upload>
                    <span class="file_content" v-else @click="previewVideo(scope.row.video)">{{scope.row.video}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="startWellNum" label="起始井号">
                <template slot-scope="scope">
                <el-input v-if="currUpdateIndex == scope.$index" v-model="scope.row.startWellNum"></el-input>
                <span v-else>{{scope.row.startWellNum}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="endWellNum" label="终止井号">
                <template slot-scope="scope">
                <el-input v-if="currUpdateIndex == scope.$index" v-model="scope.row.endWellNum"></el-input>
                <span v-else>{{scope.row.endWellNum}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="layingYear" label="敷设年代">
                <template slot-scope="scope">
                <el-input v-if="currUpdateIndex == scope.$index" v-model="scope.row.layingYear"></el-input>
                <span v-else>{{scope.row.layingYear}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="startBury" label="起点埋深">
                <template slot-scope="scope">
                <el-input v-if="currUpdateIndex == scope.$index" v-model="scope.row.startBury"></el-input>
                <span v-else>{{scope.row.startBury}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="endBury" label="终点埋深">
                <template slot-scope="scope">
                <el-input v-if="currUpdateIndex == scope.$index" v-model="scope.row.endBury"></el-input>
                <span v-else>{{scope.row.endBury}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="pipeType" label="管段类型">
                <template slot-scope="scope">
                <el-input v-if="currUpdateIndex == scope.$index" v-model="scope.row.pipeType"></el-input>
                <span v-else>{{scope.row.pipeType}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="material" label="管段材质">
                <template slot-scope="scope">
                <el-input v-if="currUpdateIndex == scope.$index" v-model="scope.row.material"></el-input>
                <span v-else>{{scope.row.material}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="diameterSection" label="管段直径">
                <template slot-scope="scope">
                <el-input v-if="currUpdateIndex == scope.$index" v-model="scope.row.diameterSection"></el-input>
                <span v-else>{{scope.row.diameterSection}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="detectFlow" label="检测方向">
                <template slot-scope="scope">
                <el-input v-if="currUpdateIndex == scope.$index" v-model="scope.row.detectFlow"></el-input>
                <span v-else>{{scope.row.detectFlow}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="length" label="管段长度">
                <template slot-scope="scope">
                <el-input v-if="currUpdateIndex == scope.$index" v-model="scope.row.length"></el-input>
                <span v-else>{{scope.row.length}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="detectLength" label="检测长度">
                <template slot-scope="scope">
                <el-input v-if="currUpdateIndex == scope.$index" v-model="scope.row.detectLength"></el-input>
                <span v-else>{{scope.row.detectLength}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="ri" label="修复指数">
                <template slot-scope="scope">
                <el-input v-if="currUpdateIndex == scope.$index" v-model="scope.row.ri"></el-input>
                <span v-else>{{scope.row.ri}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="mi" label="养护指数">
                <template slot-scope="scope">
                <el-input v-if="currUpdateIndex == scope.$index" v-model="scope.row.mi"></el-input>
                <span v-else>{{scope.row.mi}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="detectPerson" label="检测人员">
                <template slot-scope="scope">
                <el-input v-if="currUpdateIndex == scope.$index" v-model="scope.row.detectPerson"></el-input>
                <span v-else>{{scope.row.detectPerson}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="detectAddr" label="检测地点">
                <template slot-scope="scope">
                <el-input v-if="currUpdateIndex == scope.$index" v-model="scope.row.detectAddr"></el-input>
                <span v-else>{{scope.row.detectAddr}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="detectDate" label="检测日期">
                <template slot-scope="scope">
                <el-input v-if="currUpdateIndex == scope.$index" v-model="scope.row.detectDate"></el-input>
                <span v-else>{{scope.row.detectDate}}</span>
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
        <showVideo :showVideoVisible.sync="showVideoVisible" :videoUrl="videoUrl" />
    </div>    
</template>

<script>
import {
  getPipeAchievement,
  updatePipeEvaAchievement,
  delPipeEvaAchievement,
  savePipeEvaAchievement,
  uploadFile,
  previewUrl
} from "@/api/IntelSupervision";
import { awaitWrap, checkNotNull } from "@/lib";
import evaluationTableDetails from "./evaluationTableDetails.vue";
import showVideo from "../../common/showVideo.vue";

export default {
  components: { evaluationTableDetails, showVideo },
  data() {
    return {
      currUpdateIndex: -1,
      tableData: [],
      currRowData: {},
      isHasAdd: false,
      showVideoVisible: false,
      videoUrl: ""
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
        if (val == "pipeSectionInspectionEvaluationTable") {
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
        (await awaitWrap(getPipeAchievement({ ..._this.currRowData })))[1] ||
        [];

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
          await savePipeEvaAchievement({
            ...row,
            pshCode: _this.currRowData["pshCode"]
          }).then(res => {
            _this.isHasAdd = false;
            _this.currUpdateIndex = -1;
          });
        } else {
          // 修改- 保存
          await updatePipeEvaAchievement({ ...row }).then(res => {
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
          video: "点击上传",
          startWellNum: "",
          endWellNum: "",
          layingYear: "",
          startBury: "",
          endBury: "",
          startBury: "",
          pipeType: "",
          material: "",
          diameterSection: "",
          detectFlow: "",
          length: "",
          detectLength: "",
          ri: "",
          mi: "",
          detectPerson: "",
          detectAddr: "",
          detectDate: "",
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
            delPipeEvaAchievement({ id: row["id"] }).then(() => {
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
    // 上传视频
    async uploadFile(item) {
      const fileObj = item.file;
      let fileData = new FormData();
      fileData.append("multipartFile", fileObj);
      fileData.append("bucketName", "drainage-data");
      let uploadData = (await awaitWrap(uploadFile(fileData)))[1] || {};

      if (checkNotNull(uploadData) && checkNotNull(uploadData["data"])) {
        this.tableData[this.currUpdateIndex]["video"] = uploadData["data"][
          "fileNameStr"
        ].split(",")[0];
      }
    },
    // 查看视频
    async previewVideo(fileName) {
      let urlData =
        (await awaitWrap(
          previewUrl({
            bucketName: "drainage-data",
            fileName: fileName
          })
        ))[1] || [];

      if (checkNotNull(urlData) && checkNotNull(urlData["data"])) {
        this.videoUrl = urlData["data"] || "";
        this.showVideoVisible = true;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.pipeSection_inspection_evaluation_table {
  .add_info_button {
    float: right;
    margin-bottom: 15px;
  }

  .base_info_form {
    /deep/ .el-form-item {
      margin-right: 20px;
    }
  }

  .file_content {
    color: #409eff;
    cursor: pointer;
  }
}
</style>
