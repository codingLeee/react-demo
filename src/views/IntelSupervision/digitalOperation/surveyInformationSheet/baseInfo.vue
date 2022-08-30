<template>
    <div class="base_info">
        <el-row :gutter="20">
            <el-col :span="16">
                <el-form class="base_info_form details_form" ref="form" :inline="true" :model="baseForm">
                    <el-form-item label="所属单元：">
                        <el-input v-model="baseForm.belongUnit" :disabled="isUpdate"></el-input>
                    </el-form-item>
                    <el-form-item label="所属区块：">
                        <el-input v-model="baseForm.belongBlock" :disabled="isUpdate"></el-input>
                    </el-form-item>
                    <el-form-item label="街道(企业)名称：">
                        <el-input v-model="baseForm.steetName" :disabled="isUpdate"></el-input>
                    </el-form-item>
                    <el-form-item label="联系人：">
                        <el-input v-model="baseForm.cantactPerson" :disabled="isUpdate"></el-input>
                    </el-form-item>
                    <el-form-item label="联系电话：">
                        <el-input v-model="baseForm.contactTel" :disabled="isUpdate"></el-input>
                    </el-form-item>
                    <el-form-item label="调查日期：">
                        <el-input v-model="baseForm.investDate" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="编号：">
                        <el-input v-model="baseForm.pshCode" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="排水户名称：">
                        <el-input v-model="baseForm.pshName" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="占地面积(公顷)：">
                        <el-input v-model="baseForm.pshArea" :disabled="isUpdate"></el-input>
                    </el-form-item>
                    <el-form-item label="建设年代：">
                        <el-input v-model="baseForm.buildYear" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="建筑物幢数：">
                        <el-input v-model="baseForm.houseNum" :disabled="isUpdate"></el-input>
                    </el-form-item>
                    <el-form-item label="户数：">
                        <el-input v-model="baseForm.familyNum" :disabled="isUpdate"></el-input>
                    </el-form-item>
                    <el-form-item label="用水量：">
                        <el-input v-model="baseForm.waterConsumption" :disabled="isUpdate"></el-input>
                    </el-form-item>
                    <el-form-item label="现状排水体制：">
                        <el-input v-model="baseForm.drainageSystem" :disabled="isUpdate"></el-input>
                    </el-form-item>
                    <el-form-item label="排水出路：">
                        <el-input v-model="baseForm.drainageOutlet" :disabled="isUpdate"></el-input>
                    </el-form-item>
                    <el-form-item label="基本情况：" class="base-info_item">
                        <el-input type="textarea" v-model="baseForm.baseInfoProblems" :disabled="isUpdate"></el-input>
                    </el-form-item>
                </el-form>
            </el-col>
            <el-col :span="8">
                排水体制：
                <img class="sewage_systems" :src="imgUrl" alt="" srcset="">
            </el-col>
        </el-row>
    </div>
</template>


<script>
import {
  getDrainageBasic,
  updateDrainageBaseInfo,
  previewUrl
} from "@/api/IntelSupervision";
import { awaitWrap, checkNotNull } from "@/lib";

export default {
  data() {
    return {
      baseForm: {},
      isUpdate: true,
      imgUrl: ""
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
        if (val == "baseInfo") {
          this.currRowData = this.$store.state.IntelSupervison.digitalManagement;
          this.getBaseInfo();
        }
      }
    }
  },
  methods: {
    async updateCollapseInfo(flag) {
      const _this = this;
      _this.isUpdate = flag;
      //   保存修改
      if (flag) {
        await updateDrainageBaseInfo({ ..._this.baseForm });
        _this.getBaseInfo();
      }
    },
    // 获取基本信息
    async getBaseInfo() {
      const _this = this;
      let infoData =
        (await awaitWrap(getDrainageBasic({ ..._this.currRowData })))[1] || [];

      if (checkNotNull(infoData) && checkNotNull(infoData["data"])) {
        _this.baseForm = { ..._this.baseForm, ...(infoData["data"][0] || {}) };
        _this.getImgsSrc(_this.baseForm["drainageDiagramUrl"]);
      } else {
        _this.baseForm = {};
      }
    },
    // 查看图片
    async getImgsSrc(fileName) {
      let urlData =
        (await awaitWrap(
          previewUrl({
            bucketName: "drainage-data",
            fileName: fileName
          })
        ))[1] || [];

      if (checkNotNull(urlData) && checkNotNull(urlData["data"])) {
        this.imgUrl = urlData["data"] || "";
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.base_info {
  margin-top: 0 !important;
  /deep/ .el-collapse-item__wrap {
    padding: 0 23px 0 0;
  }

  .sewage_systems {
    width: 80%;
    height: 450px;
    vertical-align: top;
  }
}
</style>
