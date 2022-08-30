<!-- 排水户混接点情况 -->
<template>
    <div class="drainageHousehold_mixed_contact">
    <el-button class="add_info_button" type="primary" @click="addTable">新增</el-button>
    <el-table max-height="500px" :data="tableData" class="digitalManagement_table">
      <el-table-column type="expand">
        <template slot-scope="props">
          <tableExpandImg ref="tableImg" 
            :imgsSrc="props.row.imgsUrl" 
            :isAdd="props.row.isAdd"
            @updateImg="updateImg($event,props.row)" 
            @deleteImg="deleteImg($event,props.row)" 
          />
        </template>
      </el-table-column>
      <el-table-column prop="belongUnit" label="所属单元">
        <template slot-scope="scope">
          <el-input v-if="currUpdateIndex == scope.$index" v-model="scope.row.belongUnit"></el-input>
          <span v-else>{{scope.row.belongUnit}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="belongBlock" label="所属区块">
        <template slot-scope="scope">
          <el-input v-if="currUpdateIndex == scope.$index" v-model="scope.row.belongBlock"></el-input>
          <span v-else>{{scope.row.belongBlock}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="pictureNum" label="图幅编号">
        <template slot-scope="scope">
          <el-input v-if="currUpdateIndex == scope.$index" v-model="scope.row.pictureNum"></el-input>
          <span v-else>{{scope.row.pictureNum}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="investTime" label="调查时间">
        <template slot-scope="scope">
          <el-input v-if="currUpdateIndex == scope.$index" v-model="scope.row.investTime"></el-input>
          <span v-else>{{scope.row.investTime}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="nodeCode" label="编号">
        <template slot-scope="scope">
          <el-input v-if="currUpdateIndex == scope.$index" v-model="scope.row.nodeCode"></el-input>
          <span v-else>{{scope.row.nodeCode}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="nodeNum" label="混接点点号">
        <template slot-scope="scope">
          <el-input v-if="currUpdateIndex == scope.$index" v-model="scope.row.nodeNum"></el-input>
          <span v-else>{{scope.row.nodeNum}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="nodeAddr" label="混接地点">
        <template slot-scope="scope">
          <el-input v-if="currUpdateIndex == scope.$index" v-model="scope.row.nodeAddr"></el-input>
          <span v-else>{{scope.row.nodeAddr}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="nodeLevel" label="混接等级">
        <template slot-scope="scope">
          <el-input v-if="currUpdateIndex == scope.$index" v-model="scope.row.nodeLevel"></el-input>
          <span v-else>{{scope.row.nodeLevel}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="nodeType" label="混接类型">
        <template slot-scope="scope">
          <el-input v-if="currUpdateIndex == scope.$index" v-model="scope.row.nodeType"></el-input>
          <span v-else>{{scope.row.nodeType}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="nodeCause" label="混接原因">
        <template slot-scope="scope">
          <el-input v-if="currUpdateIndex == scope.$index" v-model="scope.row.nodeCause"></el-input>
          <span v-else>{{scope.row.nodeCause}}</span>
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
import tableExpandImg from "../../common/tableExpandImg.vue";
import {
  getMixedInfo,
  mixedUploadPic,
  removeMixedPic,
  updateDrainageMixed,
  delDrainageMixed,
  saveDrainageMixed
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
        if (val == "drainageHouseholdMixedContact") {
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
        (await awaitWrap(getMixedInfo({ ..._this.currRowData })))[1] || [];

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
          await saveDrainageMixed({
            ...row,
            pshCode: _this.currRowData["pshCode"]
          }).then(res => {
            _this.isHasAdd = false;
            _this.currUpdateIndex = -1;
          });
        } else {
          // 修改- 保存
          await updateDrainageMixed({ ...row }).then(res => {
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
          belongUnit: "",
          belongBlock: "",
          pictureNum: "",
          investTime: "",
          nodeCode: "",
          nodeNum: "",
          nodeAddr: "",
          nodeLevel: "",
          nodeType: "",
          nodeCause: "",
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
            delDrainageMixed({ id: row["id"] }).then(() => {
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
      mixedUploadPic(fileObj)
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
          removeMixedPic({ id: row["id"], objectName: fileName }).then(() => {
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
};
</script>

<style lang="scss" scoped>
.drainageHousehold_mixed_contact {
  .add_info_button {
    float: right;
    margin-bottom: 15px;
  }
}
</style>
