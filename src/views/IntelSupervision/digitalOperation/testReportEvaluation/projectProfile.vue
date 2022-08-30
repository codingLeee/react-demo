<!-- 工程概况 -->
<template>
    <div class="project_profile">
        <el-row :gutter="20">
            <el-col :span="14">
                <el-form class="project_profile_form details_form" ref="form" :inline="true" :model="baseForm">
                    <el-form-item label="工程名称：">
                        <el-input v-model="baseForm.name" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="工程地点：">
                        <el-input v-model="baseForm.addr" :disabled="isUpdate"></el-input>
                    </el-form-item>
                    <el-form-item label="建设单位：">
                        <el-input v-model="baseForm.buildUnit" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="设计单位：">
                        <el-input v-model="baseForm.designUnit" :disabled="isUpdate"></el-input>
                    </el-form-item>
                    <el-form-item label="施工单位：">
                        <el-input v-model="baseForm.constructUnit" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="监理单位：">
                        <el-input v-model="baseForm.supervisionUnit" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="委托单位：">
                        <el-input v-model="baseForm.entrustUnit" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="管道段数/长度(m)：">
                        <el-input v-model="baseForm.pipeNumLength" :disabled="isUpdate"></el-input>
                    </el-form-item>
                    <el-form-item label="监测段数/长度(m)：">
                        <el-input v-model="baseForm.detectNumLength" :disabled="isUpdate"></el-input>
                    </el-form-item>
                </el-form>
            </el-col>
            <el-col :span="10">
                管道位置示意图：
                <img class="sewage_systems" :src="imgUrl" alt="" srcset="">
            </el-col>
        </el-row>
    </div>
</template>


<script>
import {
  getProjectInfo,
  updateProject,
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
        if (val == "projectProfile") {
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
        await updateProject({ ..._this.baseForm });
        _this.getBaseInfo();
      }
    },
    // 获取基本信息
    async getBaseInfo() {
      const _this = this;
      let infoData =
        (await awaitWrap(getProjectInfo({ ..._this.currRowData })))[1] || [];

      if (checkNotNull(infoData) && checkNotNull(infoData["data"])) {
        _this.baseForm = { ..._this.baseForm, ...(infoData["data"] || {}) };
        _this.getImgsSrc(_this.baseForm["pipeLocationDiagram"]);
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
.project_profile {
  margin-top: 0 !important;
  /deep/ .el-form {
    .el-form-item__label {
      width: 180px !important;
    }
    .el-input {
      width: 240px !important;
      .el-input__inner {
        width: 100% !important;
      }
    }
  }

  .sewage_systems {
    width: 80%;
    height: 320px;
    vertical-align: top;
  }
}
</style>
