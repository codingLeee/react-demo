<!-- 管段检测与评估成果表详情 -->
<template>
    <div class="evaluation_table_details">
        <el-button class="add_info_button" type="primary" @click="addTable">新增</el-button>
        <el-table max-height="500px" :data="tableData">
            <el-table-column prop="distance" label="距离(m)">
                <template slot-scope="scope">
                <el-input v-if="currUpdateIndex == scope.$index" v-model="scope.row.distance"></el-input>
                <span v-else>{{scope.row.distance}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="name" label="缺陷名称代码">
                <template slot-scope="scope">
                <el-input v-if="currUpdateIndex == scope.$index" v-model="scope.row.name"></el-input>
                <span v-else>{{scope.row.name}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="score" label="分值">
                <template slot-scope="scope">
                <el-input v-if="currUpdateIndex == scope.$index" v-model="scope.row.score"></el-input>
                <span v-else>{{scope.row.score}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="level" label="等级">
                <template slot-scope="scope">
                <el-input v-if="currUpdateIndex == scope.$index" v-model="scope.row.level"></el-input>
                <span v-else>{{scope.row.level}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="innerCondition" label="管道内部状况描述">
                <template slot-scope="scope">
                <el-input v-if="currUpdateIndex == scope.$index" v-model="scope.row.innerCondition"></el-input>
                <span v-else>{{scope.row.innerCondition}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="picUrl" label="照片">
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
                        <span class="file_content">{{scope.row.picUrl}}</span>
                    </el-upload>
                    <span class="file_content" v-else @click="previewpicUrl(scope.row.picUrl)">{{scope.row.picUrl}}</span>
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
        <!-- 查看 -->
        <el-image-viewer v-if="showpicUrlVisible" :on-close="closeImgViewer" :url-list="[picUrl]" />
    </div>    
</template>

<script>
import {
  getPipeEvaAchiveDetail,
  updatePipeEvaAchiveDetail,
  delPipeEvaAchiveDetail,
  savePipeEvaAchiveDetail,
  uploadFile,
  previewUrl
} from "@/api/IntelSupervision";
import { awaitWrap, checkNotNull } from "@/lib";
import ElImageViewer from "element-ui/packages/image/src/image-viewer";

export default {
  components: { ElImageViewer },
  data() {
    return {
      currUpdateIndex: -1,
      tableData: [],
      isHasAdd: false,
      showpicUrlVisible: false,
      picUrl: ""
    };
  },
  props: ["data"],
  watch: {
    data: {
      immediate: true,
      handler(val) {
        if (val) {
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
          getPipeEvaAchiveDetail({ achievementId: _this.data["id"] })
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
          await savePipeEvaAchiveDetail({
            achievementId: _this.data["id"],
            ...row
          }).then(res => {
            _this.isHasAdd = false;
            _this.currUpdateIndex = -1;
          });
        } else {
          // 修改- 保存
          await updatePipeEvaAchiveDetail({ ...row }).then(res => {
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
          picUrl: "点击上传",
          distance: "",
          name: "",
          score: "",
          level: "",
          innerCondition: "",
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
            delPipeEvaAchiveDetail({ id: row["id"] }).then(() => {
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
    // 上传
    async uploadFile(item) {
      const fileObj = item.file;
      let fileData = new FormData();
      fileData.append("multipartFile", fileObj);
      fileData.append("bucketName", "drainage-data");
      let uploadData = (await awaitWrap(uploadFile(fileData)))[1] || {};

      if (checkNotNull(uploadData) && checkNotNull(uploadData["data"])) {
        this.tableData[this.currUpdateIndex]["picUrl"] = uploadData["data"][
          "fileNameStr"
        ].split(",")[0];
      }
    },
    // 查看
    async previewpicUrl(fileName) {
      let urlData =
        (await awaitWrap(
          previewUrl({
            bucketName: "drainage-data",
            fileName: fileName
          })
        ))[1] || [];

      if (checkNotNull(urlData) && checkNotNull(urlData["data"])) {
        this.picUrl = urlData["data"] || "";
        this.showpicUrlVisible = true;
      }
    },
    closeImgViewer(){
        this.showpicUrlVisible = false;
    }
  },
  created() {},
  mounted() {}
};
</script>

<style lang="scss" scoped>
.evaluation_table_details {
  padding: 0 20px;
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
