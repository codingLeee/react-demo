<!--  排水户数字化管理  -->
<template>
  <div class="digital_management system-container">
    <div class="eventConfirm-header query-header">
      <div class="queryBox">
        <div class="box">
          <span class="">所属街道：</span>
          <el-cascader v-model="formData.sub" :options="streesOptions" :props="streesProps"></el-cascader>
        </div>
        <div class="box">
          <span class="">排水户名称：</span>
          <el-input v-model="formData.pshName" autocomplete="off" placeholder="请输入"></el-input>
        </div>
        <div class="box">
          <span class="">现状排水体制：</span>
          <el-select clearable v-model="formData.drainageSystem" placeholder="请选择">
            <el-option label="全部" value=""></el-option>
            <el-option label="雨污分流" value="雨污分流"></el-option>
            <el-option label="合流制" value="合流制"></el-option>
          </el-select>
        </div>
        <div class="box">
          <el-button type="primary" @click="getTableData(1)">搜索</el-button>
        </div>
      </div>
      <div class="btnBox">
        <el-button size="small" @click="updateTable(1)">新增</el-button>
        <el-button size="small" @click="deleteTable(1)">批量删除</el-button>
        <el-button size="small" @click="downloadTemplate">模板下载</el-button>
        <el-button size="small" @click="importVisible = true">导入</el-button> 
        <!-- importData -->
        <el-button size="small" @click="exportTable">导出</el-button>
      </div>
    </div>

    <el-table :data="tableData" height="80%" @selection-change="handleSelectionChange">
      <el-table-column type="selection" align="center" width="40" fixed="left"></el-table-column>
      <el-table-column type="index" width="60" label="序号" align="center" fixed="left"></el-table-column>
      <el-table-column prop="pshCode" label="编号" width="100" align="center"></el-table-column>
      <el-table-column prop="pshName" label="排水户名称" align="center" min-width="200" show-overflow-tooltip></el-table-column>
      <el-table-column prop="subdistrictStr" label="所属街道" align="center" width="160"></el-table-column>
      <el-table-column prop="community" label="所属社区" align="center" width="160"></el-table-column>
      <el-table-column prop="addr" label="排水户位置" align="center" min-width="160" show-overflow-tooltip></el-table-column>
      <el-table-column prop="pshTypeStr" label="排水户类型" align="center" min-width="160" show-overflow-tooltip></el-table-column>
      <el-table-column prop="pshArea" label="占地面积(公顷)" align="center" width="140"></el-table-column>
      <el-table-column prop="houseNum" label="建筑物幢数" align="center" width="120"></el-table-column>
      <el-table-column prop="drainageSystem" label="现状排水体制" align="center" width="160"></el-table-column>
      <el-table-column fixed="right" label="操作" align="center" width="240">
        <template slot-scope="scope">
          <el-button type="text" size="small" style="color:#fff" @click="updateTable(0, scope.row)">编辑</el-button>
          <el-button type="text" size="small" style="color:#f00" @click="deleteTable(0, scope.row)">删除</el-button>
          <el-button type="text" size="small" @click="showCensusDetails(scope.row)">普查详情</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="paginationContent">
      <el-pagination 
        layout="total,prev, pager, next" 
        :page-size="pageData.pageSize" 
        :current-page="pageData.current" 
        :total="pageData.total" 
        @current-change="getTableData">
      </el-pagination>
    </div>
    
    <!-- 新增、编辑 -->
    <el-dialog class="updateDialog" :title="updateTitle" :visible.sync="updateVisible" @close="cancelUpdate">
      <!-- :inline="true"  -->
      <el-form ref="updateForm" :model="updateForm" class="dialog_form" label-width="160px">
        <el-form-item label="编号：" prop="pshCode" :rules="requiredRules">
          <el-input v-model="updateForm.pshCode" :disabled="updateType == 0"></el-input>
        </el-form-item>
        <el-form-item label="排水户名称：" prop="pshName" :rules="requiredRules">
          <el-input v-model="updateForm.pshName" :disabled="updateType == 0"></el-input>
        </el-form-item>
        <el-form-item label="所属街道：" prop="subdistrict" :rules="requiredRules">
          <el-cascader v-model="updateForm.subdistrict" :options="streesOptions" :props="streesProps"></el-cascader>
        </el-form-item>
        <el-form-item label="排水户位置：" prop="addr" :rules="requiredRules">
          <el-input v-model="updateForm.addr"></el-input>
        </el-form-item>
        <el-form-item label="排水户类型：" prop="pshType">
          <el-select v-model="updateForm.pshType" placeholder="请选择">
            <el-option label="住宅类" :value="1"></el-option>
            <el-option label="非住宅类" :value="2"></el-option>
            <el-option label="其他" :value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="占地面积(公顷)：" prop="pshArea">
          <el-input v-model="updateForm.pshArea"></el-input>
        </el-form-item>
        <el-form-item label="建筑物幢数：" prop="houseNum">
          <el-input v-model="updateForm.houseNum"></el-input>
        </el-form-item>
        <el-form-item label="现状排水体制：" prop="drainageSystem" :rules="requiredRules">
          <el-select v-model="updateForm.drainageSystem" placeholder="请选择">
            <el-option label="雨污分流" value="雨污分流"></el-option>
            <el-option label="合流制" value="合流制"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelUpdate">取 消</el-button>
        <el-button type="primary" @click="confirmUpdate">确 认</el-button>
      </div>
    </el-dialog>

    <!-- 导入 -->
    <el-dialog class="importDialog" title="数据导入" :visible.sync="importVisible" @close="closeImport">
      <el-steps :active="importActive" align-center>
        <el-step title="上传文件"></el-step>
        <el-step title="导入数据"></el-step>
        <el-step title="导入完成"></el-step>
      </el-steps>
      <div class="import_info import_info_1" v-if="importActive == 1">
        <div class="info_1">上传填好的信息表</div>
        <div class="info_2">文件后缀名必须为xls或者为xlxs(即Excel格式)，文件大小不得大于10M，最多支持导入3000条数据。</div>
        <div class="info_3">
          <el-upload
            class="upload-demo"
            action=""
            :multiple='false'
            :limit="1"
            :http-request="uploadFile" 
          >
            <el-button size="small" type="text">点击上传</el-button>
          </el-upload>
        </div>
        <div class="info_4">特别提示</div>
        <div class="info_5">导入过程中如发现同名排水户，且对该排水户数据有更新权限，则更新这条排水户数据</div>
      </div>
      <div class="import_info import_info_2" v-if="importActive == 2">
        <template v-if="!importingData">
          <div>正常数据{{importInfo["normal"]["length"]}}条</div>
          <div class="info_1">异常数据{{importInfo["abnormal"]["length"]}}条</div>

          <template v-if="checkNotNull(importInfo['abnormal'])">
            <div class="info_4">异常提示</div>
            <div class="info_5">已存在
              <span 
                v-for="(item,index) in importInfo['abnormal']" 
                :key="item.pshCode"
              >
                编号为{{item["pshCode"]}}名称为{{item["pshName"]}}
                <span v-if="index != (importInfo['abnormal']['length'] - 1)">，</span>
              </span>
              的排水户，如果继续导入将会更新以上排水户的数据。
            </div>
          </template>
        </template> 
        <template v-if="importingData">
          <div class="import_progress">
            <div></div>
          </div>
          <div>正在导入数据...</div>
        </template>
      </div>
      <div class="import_info import_info_3" v-if="importActive == 3">
        
      </div>
      <div slot="footer" class="dialog-footer" v-if="importActive != 3">
        <el-button v-if="checkNotNull(importInfo['abnormal'])" @click="importActive = 1">重新上传</el-button>
        <el-button type="primary" @click="importNextstep">下一步</el-button>
      </div>
    </el-dialog>

    <!-- 普查详情 -->
    <div class="census_details" v-if="censusDetailsVisible">
      <div class="census_details_top">
        <el-radio-group class="statistical_analysis_radio" v-model="currDetail" @change="censusDetailsChange">
          <el-radio 
            v-for="item in censusDetailList" 
            :label="item['route']" 
            :key="item['route']" 
            border
            :disabled="detailsStateInfo[item['code']] == 1"
          >{{item['name']}}</el-radio>
        </el-radio-group>
        <div>
          <el-button v-if="whetherParsing" @click="toParse">解析</el-button>
          <el-button @click="returnDigitalManagement">返回</el-button>
        </div>
      </div>

      <div class="census_details_bottom">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>
<script>
import {
  getDrainageList,
  getAreaBySub,
  saveDrainageBasic,
  updateDrainageBasic,
  deleteDrainageBasic,
  batchDelDrainageBasic,
  downLoadDrainageBasic,
  drainageImport,
  batchDrainageBasic,
  downloadDrainageTemplate,
  getDrainageState
} from "@/api/IntelSupervision";
import { awaitWrap, checkNotNull, exportMethods } from "@/lib";
import qs from "qs";

export default {
  data() {
    let updateBaseForm = {
      pshCode: "",
      addr: "",
      drainageSystem: "",
      houseNum: "",
      pshArea: "",
      pshName: "",
      pshType: "",
      subdistrict: ""
    };

    return {
      requiredRules: [{ required: true, message: "必填" }],
      tableData: [],
      formData: {
        sub: "",
        pshName: "",
        drainageSystem: ""
      },
      pageData: {
        total: 0,
        pageSize: 11,
        current: 1
      },
      streesOptions: [],
      streesProps: {
        value: "areaCode",
        label: "areaName",
        emitPath: false,
        checkStrictly: true
      },
      updateTitle: "新增",
      updateVisible: false,
      updateForm: { ...updateBaseForm },
      updateBaseForm: { ...updateBaseForm },
      updateType: 1,
      exportUrl: "/intelSupervisonApi/digitization/drainageBasicExport",
      multipleSelection: [],
      importVisible: false,
      importActive: 1,
      fileList: [],
      importingData: false,
      importInfo: { abnormal: [], normal: [] },
      censusDetailsVisible: false,
      currDetail: "surveyInformationSheet",
      censusDetailList: [
        {
          name: "调查信息资料表",
          route: "surveyInformationSheet",
          code: "basicState"
        },
        {
          name: "测绘成果",
          route: "mappingAchievement",
          code: "mappingState"
        },
        {
          name: "检测报告及评估",
          route: "testReportEvaluation",
          reportState: "reportState"
        },
        {
          name: "检测视频",
          route: "mediaInfo"
        },
        {
          name: "检测照片",
          route: "detectionPhotos"
        },
        {
          name: "重大缺陷统计",
          route: "majorDefectStatistics",
          code: "defectState"
        }
      ],
      currRowData: {},
      detailsStateInfo: {}
    };
  },
  computed: {
    whetherParsing() {
      return (
        this.detailsStateInfo["mappingState"] == 1 ||
        this.detailsStateInfo["reportState"] == 1 ||
        this.detailsStateInfo["basicState"] == 1 ||
        this.detailsStateInfo["defectState"] == 1
      );
    }
  },
  methods: {
    checkNotNull,
    // 表格
    async getTableData(pageVal) {
      const _this = this;
      _this.pageData.current = pageVal || _this.pageData.current;
      let tableList =
        (await awaitWrap(
          getDrainageList({ ..._this.formData, ..._this.pageData })
        ))[1] || {};

      if (checkNotNull(tableList) && checkNotNull(tableList["data"])) {
        _this.tableData = tableList["data"]["records"] || [];
        _this.pageData.total = tableList["data"]["total"] || 0;
      } else {
        _this.tableData = [];
      }
    },
    // 新增、编辑
    updateTable(code, row) {
      const _this = this;
      _this.updateVisible = true;
      _this.updateType = code;
      // 新增
      if (code == 1) {
        _this.updateTitle = "新增";
      } else if (code == 0) {
        // 编辑
        _this.updateTitle = "编辑";
        _this.updateForm = { ...row };
      }
    },
    // 删除
    deleteTable(code, row) {
      const _this = this;
      let deleteIds = [];
      if (code == 1) {
        if (checkNotNull(_this.multipleSelection)) {
          deleteIds = _this.multipleSelection.map(m => {
            return m.pshCode;
          });
        } else {
          _this.$message({
            message: "请选择排水户！",
            type: "warning"
          });

          return;
        }
      }

      _this
        .$confirm(`确定要删除已选择排水户信息?`, "", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          // 单个删除
          if (code == 0) {
            deleteDrainageBasic({ ...row }).then(res => {
              _this.$message({
                type: "success",
                message: "删除成功！"
              });
              _this.getTableData(1);
            });
          } else {
            // 批量删除
            batchDelDrainageBasic({ pshCodes: deleteIds }).then(res => {
              _this.$message({
                type: "success",
                message: "删除成功！"
              });
              _this.getTableData(1);
            });
          }
        })
        .catch(() => {
          _this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // 导出
    exportTable() {
      downLoadDrainageBasic();
      // exportMethods(this.exportUrl, this.formData);
    },
    // 区、街道
    async getAreaBySub() {
      const _this = this;
      let streeList = (await awaitWrap(getAreaBySub()))[1] || [];

      if (checkNotNull(streeList) && checkNotNull(streeList["data"])) {
        streeList = streeList["data"] || [];
      }

      _this.streesOptions = streeList || [];
    },
    // 选择表格
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 取消 新增、编辑表格
    cancelUpdate() {
      this.updateForm = { ...this.updateBaseForm };
      this.resetForm("updateForm");
      this.updateVisible = false;
    },
    // 确认 新增、编辑表格
    confirmUpdate() {
      const _this = this;
      _this.$refs["updateForm"].validate(valid => {
        if (valid) {
          if (_this.updateType == 1) {
            // 新增
            saveDrainageBasic({
              ..._this.updateForm
            }).then(res => {
              _this.cancelUpdate();
              _this.$message({
                type: "success",
                message: "成功！"
              });
              _this.getTableData(1);
            });
          } else if (_this.updateType == 0) {
            // 编辑
            updateDrainageBasic({
              ..._this.updateForm
            }).then(res => {
              _this.cancelUpdate();
              _this.$message({
                type: "success",
                message: "成功！"
              });
              _this.getTableData(1);
            });
          }
        }
      });
    },
    // 重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    // 导入 下一步
    async importNextstep() {
      var _this = this;

      // 上传
      if (_this.importActive == 1) {
        if (_this.isFileData) {
          let importData =
            (await awaitWrap(drainageImport(_this.fileData)))[1] || {};
          if (checkNotNull(importData) && checkNotNull(importData["data"])) {
            _this.importInfo = importData["data"] || {
              abnormal: [],
              normal: []
            };
          } else {
            _this.importInfo = { abnormal: [], normal: [] };
          }
          _this.importActive = 2;
        } else {
          _this.$message.error("请上传文件！！！");
          return;
        }
      } else if (_this.importActive == 2) {
        let { normal, abnormal } = _this.importInfo;

        batchDrainageBasic({
          abnormalJson: JSON.stringify(abnormal),
          normalJson: JSON.stringify(normal)
        })
          .then(res => {
            _this.importingData = true;
            let timer = setTimeout(() => {
              _this.importActive = 3;
              clearTimeout(timer);
              // _this.importVisible = false;
              _this.getTableData(1);
            }, 2000);
          })
          .catch(() => {});
      }
    },
    closeImport() {
      this.importActive = 1;
      this.importVisible = false;
    },
    // 上传
    uploadFile(item) {
      const fileObj = item.file;
      this.fileData = new FormData();
      this.fileData.append("multipartFile", fileObj);
      this.isFileData = true;
    },
    // 模板下载
    downloadTemplate() {
      downloadDrainageTemplate();
    },
    // 普查详情
    async showCensusDetails(row) {
      const _this = this;

      let stateData =
        (await awaitWrap(getDrainageState({ pshCode: row["pshCode"] })))[1] ||
        {};
      if (checkNotNull(stateData) && checkNotNull(stateData["data"])) {
        _this.detailsStateInfo = stateData["data"] || {};
      }

      if (_this.detailsStateInfo["drainageState"] == 0) {
        _this.currRowData = { ...row };
        _this.$store.commit("SET_digitalManagement", this.currRowData);
        _this.currDetail = "surveyInformationSheet";
        _this.censusDetailsVisible = true;
        _this.$nextTick(() => {
          _this.censusDetailsChange();
        });
      } else {
        _this.$message({
          message: "该条信息文件尚未解析，请前往档案管理进行解析！",
          type: "warning"
        });
      }
    },
    censusDetailsChange() {
      this.$router.push({ name: this.currDetail });
    },
    // 返回数字化管理
    returnDigitalManagement() {
      this.censusDetailsVisible = false;
      this.currDetail = "digitalManagement";
      this.censusDetailsChange();
    },
    // 解析
    toParse() {
      this.$router.push({ name: "fileManagement" });
    }
  },
  created() {
    this.getAreaBySub();
    this.getTableData(1);
  },
  watch: {},
  beforeDestroy() {
    console.log("销毁");
  }
};
</script>
<style lang="scss" scoped>
.digital_management {
  height: 100%;
  position: relative;
  .box {
    margin-right: 35px !important;
    /deep/ .el-input,
    /deep/ .el-input__inner {
      width: 170px !important;
    }
  }
  .btnBox {
    /deep/ .el-button {
      width: 78px;
    }
  }

  // 编辑弹框
  /deep/ .updateDialog {
    .el-dialog {
      width: 580px;
    }
    .el-input,
    .el-select,
    .el-cascader {
      width: 90% !important;

      .el-input {
        width: 100% !important;
      }
    }

    .el-input__inner {
      width: 100% !important;
    }
  }

  // 导入
  .importDialog {
    /deep/ .el-dialog {
      width: 650px;
      height: 450px;

      .el-dialog__body {
        padding: 30px 0 10px;
      }
    }

    /deep/ .el-steps {
      .el-step__icon-inner {
        display: none;
      }

      .el-step {
        .el-step__icon {
          background-image: url(~static/ManageSystem/img/digitalManagementImport_icon_0.png);
          background-position: center center;
          background-repeat: no-repeat;
          background-size: 14px 14px;
        }

        &:nth-child(2) {
          .el-step__icon {
            background-image: url(~static/ManageSystem/img/digitalManagementImport_icon_1.png);
          }
        }

        &:nth-child(3) {
          .el-step__icon {
            background-image: url(~static/ManageSystem/img/digitalManagementImport_icon_2.png);
          }
        }
      }

      .el-step__description {
        display: none;
      }
    }

    // 导入信息
    .import_info {
      padding: 28px calc(15% - 14px) 0;
      font-size: 14px;
      color: #fff;
      .info_4 {
        margin-top: 20px;
        color: #ea545f;
      }
      .info_5 {
        font-size: 12px;
        color: #ea545f;
      }
      &.import_info_1 {
        .info_1 {
          font-size: 18px;
        }
        .info_3 {
          /deep/ .upload-demo {
            .el-button {
              span {
                font-size: 16px;
                color: #1da6cd;
              }
            }

            .el-upload-list__item {
              margin: 0;
              &:hover {
                background-color: transparent;
              }
            }
            .el-upload-list__item-name,
            .el-icon-document,
            .el-icon-close {
              color: #fff;
            }
          }
        }
      }

      &.import_info_2 {
        color: #fff;
        .info_1 {
          color: #ea545f;
        }
        .import_progress {
          margin-top: 30px;
          height: 11px;
          background-color: #101f70;
          border-radius: 5px;
          margin-bottom: 7px;

          & > div {
            width: 0;
            height: 11px;
            background-color: #2f4fd6;
            border-radius: 5px;
            // transform: translateX(-100%);
            animation: progressAnimat 2.5s;
            animation-fill-mode: forwards;

            @keyframes progressAnimat {
              from {
                width: 0;
              }
              to {
                width: 100%;
              }
            }
          }
        }
      }

      &.import_info_3 {
        height: calc(100% - 60px);
        box-sizing: border-box;
        background: url(~static/ManageSystem/img/digitalManagementImport_complete_icon.png)
          no-repeat center bottom;
      }
    }
  }

  // 普查详情
  .census_details {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 3;
    background-color: #101f70;

    .census_details_top {
      display: flex;
      justify-content: space-between;

      /deep/ .el-button {
        width: 78px;
      }

      /deep/ .el-radio-group {
        .el-radio {
          width: 148px;
          padding: 0;
          text-align: center;
          border-color: #2f4fd6;
          background-color: transparent;
          margin-right: 10px;
          .el-radio__label {
            color: #a7bef7;
          }
          &.is-checked {
            background-color: #2f4fd6;
            .el-radio__label {
              color: #fff;
            }
          }
        }
      }
    }

    .census_details_bottom {
      height: calc(100% - 110px);
      overflow-y: auto;
      margin-top: 50px;
    }
  }
}
</style>