<!-- 小区排水系统存在问题登记表 -->
<template>
    <div class="drainage_system_problems">
        <el-row :gutter="20">
            <el-col :span="16">
                <el-form class="base_info_form details_form" ref="form" :inline="true" :model="baseForm">
                    <div>
                        <el-form-item label="小区名称：" class="first_form_item">
                            <el-input v-model="baseForm.communityName" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="地址：">
                            <el-input v-model="baseForm.communityAddr" :disabled="isUpdate"></el-input>
                        </el-form-item>
                    </div>
                    <el-form-item label="物业管理单位名称：" class="first_form_item">
                        <el-input v-model="baseForm.propertyCompany" :disabled="isUpdate"></el-input>
                    </el-form-item>
                    <el-form-item label="联系人：">
                        <el-input v-model="baseForm.propertyPerson" :disabled="isUpdate"></el-input>
                    </el-form-item>
                    <el-form-item label="联系人电话：">
                        <el-input v-model="baseForm.propertyTel" :disabled="isUpdate"></el-input>
                    </el-form-item>
                    <el-form-item label="调查单位名称：" class="first_form_item">
                        <el-input v-model="baseForm.investigationUnit" :disabled="isUpdate"></el-input>
                    </el-form-item>
                    <el-form-item label="联系人：">
                        <el-input v-model="baseForm.investigationPerson" :disabled="isUpdate"></el-input>
                    </el-form-item>
                    <el-form-item label="联系人电话：">
                        <el-input v-model="baseForm.investigationTel" :disabled="isUpdate"></el-input>
                    </el-form-item>
                    <el-form-item label="小区排水存在问题说明：" class="base-info_item first_form_item">
                        <el-input type="textarea" v-model="baseForm.problemDescription" :disabled="isUpdate"></el-input>
                    </el-form-item>
                </el-form>
            </el-col>
            <el-col :span="8">
                小区排水系统简图：
                <img class="sewage_systems" :src="imgUrl" alt="" srcset="">
            </el-col>
        </el-row>
        
    </div>
</template>


<script>
import {
  getSystemProblems,
  updateDrainageProblem,
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
        if (val == "drainageSystemProblems") {
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
      // 保存修改
      if (flag) {
        await updateDrainageProblem({ ..._this.baseForm });
        _this.getBaseInfo();
      }
    },
    // 获取基本信息
    async getBaseInfo() {
      const _this = this;
      let infoData =
        (await awaitWrap(getSystemProblems({ ..._this.currRowData })))[1] || [];

      if (checkNotNull(infoData) && checkNotNull(infoData["data"])) {
        _this.baseForm = { ..._this.baseForm, ...(infoData["data"][0] || {}) };
        _this.getImgsSrc(_this.baseForm["sketchUrl"]);
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
.drainage_system_problems {
  /deep/ .el-collapse-item__wrap {
    padding: 0 23px 0 0;
  }

  .sewage_systems {
    width: 70%;
    height: 325px;
    vertical-align: top;
  }

  /deep/ .el-form-item {
    .el-form-item__label {
      width: 120px;
    }

    &.base-info_item {
      .el-form-item__content {
        width: calc(100% - 230px);
      }
    }
  }

  .first_form_item {
    /deep/ .el-form-item__label {
      width: 200px;
    }
  }
}
</style>
