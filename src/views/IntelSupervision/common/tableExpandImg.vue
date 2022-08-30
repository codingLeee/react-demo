<template>
    <div class="table_expand_img">
        <ul class="table_expand_content">
            <li v-for="item in imgSrcObj" :key="item['code']">
                <div class="img_content">
                  <el-image :src="item['url']"></el-image>
                  <div class="image_operation">
                    <!-- 查看 -->
                    <span @click="handlerShowImg(item['url'])">
                        <i class="el-icon-zoom-in"></i>
                    </span>
                    <!-- 下载 -->
                    <span @click="handlerDownloadImg(item['code'])">
                        <i class="el-icon-download"></i>
                    </span>
                    <!-- 删除 -->
                    <span @click="handlerDeleteImg(item['code'])">
                        <i class="el-icon-delete"></i>
                    </span>
                  </div>
                </div>
                <p class="img_title">{{item['name']}}</p>
            </li>
            <li @click="addImg">
              <div class="img_content upload_botton">
                <i class="el-icon-plus avatar-uploader-icon"></i>
              </div>
            </li>
        </ul>
        <!-- 查看 -->
        <el-image-viewer v-if="showImgViewer" :on-close="closeImgViewer" :url-list="[currImgUrl]" />
        <!-- 上传 -->
        <el-dialog width="30%" 
          title="上传图片" 
          :visible.sync="uploadVisible" 
          append-to-body
          :close-on-click-modal="false"
          class="upload_dialog"
          @close="cancelUpload"
        >
          <el-form class="base_info_form details_form" ref="form">
            <el-form-item label="上传图片：">
              <el-upload
                action="#"
                list-type="picture-card"
                :http-request="uploadFile" 
                ref="uploadImg"
              >
                <div v-if="!isHasFile" slot="trigger" class="upload-img_icon">
                  <i class="el-icon-plus avatar-uploader-icon"></i>
                </div>
                <div slot="file" slot-scope="{file}">
                  <img class="el-upload-list__item-thumbnail" :src="file.url" alt="">
                </div>
              </el-upload>
            </el-form-item>
            <el-form-item label="图片名称：">
              <el-input v-model="fileName" placeholder="请输入"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="cancelUpload">取 消</el-button>
            <el-button type="primary" @click="confirmUpload">确 认</el-button>
          </div>
        </el-dialog>
    </div>
</template>

<script>
import ElImageViewer from "element-ui/packages/image/src/image-viewer";
import { checkNotNull, awaitWrap } from "@/lib";
import { previewUrl, downloadFile } from "@/api/IntelSupervision";

export default {
  components: { ElImageViewer },
  data() {
    return {
      showImgViewer: false,
      uploadVisible: false,
      fileName: "",
      uploadForm: {},
      isHasFile: false,
      imgSrcObj: {},
      currImgUrl: ""
    };
  },
  props: {
    imgsSrc: {
      type: String
    },
    isAdd: {}
  },
  watch: {
    imgsSrc: {
      immediate: true,
      handler(val) {
        this.getImgs(val);
      }
    }
  },
  methods: {
    checkNotNull,
    // 获得图片
    getImgs(val) {
      const _this = this;
      _this.imgSrcObj = {};
      if (checkNotNull(val)) {
        // 切割成list
        let srcData = val.split(",");
        let imgName = "",
          imgUrl = "";
        srcData.forEach(m => {
          if (checkNotNull(m)) {
            imgName = m.split("_");
            imgName = imgName.splice(0, imgName.length - 1).join("_");
            _this.imgSrcObj = {
              ..._this.imgSrcObj,
              [m]: {
                code: m,
                name: imgName,
                url: ""
              }
            };

            _this.getImgsSrc(m);
          }
        });
      }
    },
    // 上传图片
    uploadFile(item) {
      if (!checkNotNull(this.fileName)) {
        this.fileName = item["file"]["name"].split(".")[0] || "";
      }
      const fileObj = item.file;
      this.uploadForm = new FormData();
      this.uploadForm.append("multipartFile", fileObj);
      this.isHasFile = true;
    },
    // 关闭查看
    closeImgViewer() {
      this.showImgViewer = false;
    },
    // 查看
    handlerShowImg(url) {
      this.currImgUrl = url;
      this.showImgViewer = true;
    },
    // 删除
    handlerDeleteImg(fileName) {
      this.$emit("deleteImg", fileName);
    },
    // 下载
    handlerDownloadImg(fileName) {
      downloadFile({
        bucketName: "drainage-data",
        fileName: fileName
      });
    },
    // 确认上传图片
    confirmUpload() {
      if (checkNotNull(this.fileName) && this.isHasFile) {
        this.uploadForm.append("fileName", this.fileName);
        this.$emit("updateImg", this.uploadForm);
      } else {
        this.$message({
          type: "warning",
          message: "请上传图片且填写图片名称！"
        });
      }
    },
    // 取消上传
    cancelUpload() {
      this.$refs.uploadImg.clearFiles();
      this.uploadVisible = false;
      this.isHasFile = false;
      this.fileName = "";
      this.uploadForm = {};
    },
    // 获得图片预览地址
    async getImgsSrc(fileName) {
      let imgUrl = "";
      let urlData =
        (await awaitWrap(
          previewUrl({
            bucketName: "drainage-data",
            fileName: fileName
          })
        ))[1] || [];

      if (checkNotNull(urlData) && checkNotNull(urlData["data"])) {
        imgUrl = urlData["data"] || "";
      }

      this.imgSrcObj[fileName]["url"] = imgUrl;
    },
    // 新增
    addImg() {
      if (this.isAdd) {
        this.$message({
          type: "warning",
          message: "请完成表格行新增后再上传图片！"
        });
      } else {
        this.uploadVisible = true;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.table_expand_content {
  display: flex;
  flex-wrap: wrap;

  li {
    text-align: center;
    margin: 10px;

    .img_content {
      width: 245px;
      height: 152px;
      position: relative;

      .el-image {
        width: 100%;
        height: 100%;
      }

      &.upload_botton {
        border: 1px solid #394688;
        line-height: 152px;
        font-size: 50px;
        cursor: pointer;
      }
    }

    .img_title {
      margin-top: 15px;
    }

    &:hover {
      .image_operation {
        opacity: 1;
      }
    }

    .image_operation {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      opacity: 0;
      transition: opacity 0.3s;
      font-size: 20px;
      display: flex;
      justify-content: center;
      align-items: center;
      i {
        display: inline-block;
        margin: 0 5px;
        cursor: pointer;
        vertical-align: middle;
      }
    }
  }
}

.upload_dialog {
  /deep/ .el-upload--picture-card {
    width: auto;
    height: auto;
    background-color: transparent;
    border: 0;

    .upload-img_icon {
      width: 150px;
      height: 150px;
      border: 1px solid #5867f0;
      border-radius: 4px;
      color: #fff;
      i {
        color: rgba(255, 255, 255, 0.7);
      }
    }
  }

  /deep/ .el-upload-list--picture-card {
    .el-upload-list__item {
      border-color: #5867f0;
      background-color: transparent;

      > div,
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
}
</style>
