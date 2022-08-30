<!-- 存在重大缺陷的排水户记录表 -->
<template>
    <div class="majorDefects_records">
    <el-button class="add_info_button" type="primary" @click="addTable">新增</el-button>
    <el-table max-height="500px" :data="tableData" class="digitalManagement_table">
      <el-table-column type="expand">
        <template slot-scope="props">
          <tableExpandImg ref="tableImg" 
            :imgsSrc="props.row.pic" 
            :isAdd="props.row.isAdd"
            @updateImg="updateImg($event,props.row)" 
            @deleteImg="deleteImg($event,props.row)" 
          />
        </template>
      </el-table-column>
      <el-table-column type="index" label="序号" width="80px"></el-table-column>
      <el-table-column prop="discoverTime" label="时间">
        <template slot-scope="scope">
          <el-input v-if="currUpdateIndex == scope.$index" v-model="scope.row.discoverTime"></el-input>
          <span v-else>{{scope.row.discoverTime}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="pshName" label="排水户名称">
        <template slot-scope="scope">
          <el-input v-if="currUpdateIndex == scope.$index" v-model="scope.row.pshName"></el-input>
          <span v-else>{{scope.row.pshName}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="houseNum" label="门牌号">
        <template slot-scope="scope">
          <el-input v-if="currUpdateIndex == scope.$index" v-model="scope.row.houseNum"></el-input>
          <span v-else>{{scope.row.houseNum}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="road" label="所在道路">
        <template slot-scope="scope">
          <el-input v-if="currUpdateIndex == scope.$index" v-model="scope.row.road"></el-input>
          <span v-else>{{scope.row.road}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="street" label="所属街道">
        <template slot-scope="scope">
          <el-input v-if="currUpdateIndex == scope.$index" v-model="scope.row.street"></el-input>
          <span v-else>{{scope.row.street}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="leadUnit" label="牵头单位">
        <template slot-scope="scope">
          <el-input v-if="currUpdateIndex == scope.$index" v-model="scope.row.leadUnit"></el-input>
          <span v-else>{{scope.row.leadUnit}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="problem" label="存在的主要问题">
        <template slot-scope="scope">
          <el-input v-if="currUpdateIndex == scope.$index" v-model="scope.row.problem"></el-input>
          <span v-else>{{scope.row.problem}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="suggest" label="建议">
        <template slot-scope="scope">
          <el-input v-if="currUpdateIndex == scope.$index" v-model="scope.row.suggest"></el-input>
          <span v-else>{{scope.row.suggest}}</span>
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
    <div class="note_content">
        <div class="note">备注：存在重大缺陷的排水户。</div>
        <ul class="note_details">
            <li>（1）支管暗接，异物穿入，缺陷等级3级以上的破裂、变形、腐蚀、错口、起伏、脱节、接口材料脱落、渗漏及其他可能导致管道垮塌的缺陷；</li>
            <li>（2）缺陷等级3级以上的结垢、障碍物、树根，残墙、坝根，以及短期内难以处理的沉积（水泥砂浆或混凝土）；</li>
            <li>（3）连接井、覆盖检查井、暗井、限流墙、截流闸堰、截流井及连通管、限流管等。</li>
            <li>（4）没有化粪池直排的院落。</li>
            <li>（5）无雨水沟、雨水管，只有单独的一条管线的和合流小区；</li>
            <li>（6）污水进入雨水，直接下河的；</li>
            <li>（7）管道塌陷的，写明管段位置、管径大小、埋深、材质、塌陷部分的长度，同时将塌陷管道的视频发送至我司；</li>
            <li>（8）排水户无水源出口，无法正常排水。</li>
        </ul>
    </div>        
    </div>    
</template>

<script>
import tableExpandImg from "../../common/tableExpandImg.vue";
import {
  getMajorDefect,
  uploadMajorDefectPic,
  delMajorDefectPic,
  updateMajorDefect,
  delMajorDefect,
  saveMajorDefect
} from "@/api/IntelSupervision";
import { awaitWrap, checkNotNull } from "@/lib";

export default {
  components: { tableExpandImg },
  data() {
    return {
      currUpdateIndex: -1,
      tableData: [],
      testSrcList: [],
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
        if (val == "majorDefectsRecords") {
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

      let mixedInfo =
        (await awaitWrap(getMajorDefect({ ..._this.currRowData })))[1] || [];

      if (checkNotNull(mixedInfo) && checkNotNull(mixedInfo["data"])) {
        _this.tableData = mixedInfo["data"] || [];
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
          await saveMajorDefect({
            ...row,
            pshCode: _this.currRowData["pshCode"]
          }).then(res => {
            _this.isHasAdd = false;
            _this.currUpdateIndex = -1;
          });
        } else {
          // 修改- 保存
          await updateMajorDefect({ ...row }).then(res => {
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
          discoverTime: "",
          pshName: "",
          houseNum: "",
          road: "",
          street: "",
          leadUnit: "",
          problem: "",
          suggest: "",
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
            delMajorDefect({ id: row["id"] }).then(() => {
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
    // 图片上传
    async updateImg(fileObj, row) {
      const _this = this;
      fileObj.append("id", row["id"]);
      uploadMajorDefectPic(fileObj)
        .then(() => {
          _this.$message({
            type: "success",
            message: "上传成功！"
          });

          _this.$refs.tableImg.cancelUpload();
          _this.getTableData();
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
          delMajorDefectPic({ id: row["id"], fileName: fileName }).then(
            () => {
              _this.$message({
                type: "success",
                message: "删除成功！"
              });

              _this.getTableData();
            }
          );
        })
        .catch(() => {
          _this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.majorDefects_records {
  .add_info_button {
    float: right;
    margin-bottom: 15px;
  }

  .note_content {
    font-size: 14px;
    color: #ff3f3f;
    .note {
      line-height: 52px;
    }
  }
}
</style>
