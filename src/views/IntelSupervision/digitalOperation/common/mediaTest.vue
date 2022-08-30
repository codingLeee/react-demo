<template>
    <div class="media_test">
        <ul class="media_content">
            <li v-for="item in mediaSrcs" :key="item['mediaName']">
                <el-tooltip class="item" effect="dark" placement="top-start">
                    <div slot="content">
                        <p>{{mediaTypeName}}格式：{{item["contentType"]}}</p>
                        <p>大小：{{byteConvert(item["size"])}}</p>
                        <p>修改日期：{{item["time"]}}</p>
                    </div>
                    <div class="img_content">
                        <el-image v-if="mediaType == 'img'" :src="item['mediaUrl']"></el-image>
                        <video v-else-if="mediaType == 'video'" :src="item['mediaUrl']"></video>
                        <div class="image_operation">
                            <!-- 查看 -->
                            <span @click="handlerShowMedia(item['mediaUrl'])">
                                <i class="el-icon-zoom-in"></i>
                            </span>
                            <!-- 下载 -->
                            <span @click="handlerDownloadMedia(item)">
                                <i class="el-icon-download"></i>
                            </span>
                            <!-- 删除 -->
                            <span @click="handlerDeleteMedia(item)">
                                <i class="el-icon-delete"></i>
                            </span>
                        </div>
                    </div>
                </el-tooltip>
                <p class="img_title textOmit" :title="item['mediaName']">{{item['mediaName']}}</p>
            </li>
            <li @click="addMedia">
              <div class="img_content upload_botton">
                <i class="el-icon-plus avatar-uploader-icon"></i>
              </div>
            </li>
        </ul>
        <!-- 查看 -->
        <template v-if="mediaType == 'img'">
            <el-image-viewer v-if="showMediaViewer" :on-close="closeMediaViewer" :url-list="[currMediaUrl]" />
        </template>
        <template v-else>
            <showVideo :showVideoVisible.sync="showMediaViewer" :videoUrl="currMediaUrl" />
        </template>
        <!-- 上传 -->
        <el-dialog width="30%" 
          :title="`上传${mediaTypeName}`" 
          :visible.sync="uploadVisible" 
          append-to-body
          :close-on-click-modal="false"
          class="upload_dialog"
          @close="cancelUpload"
        >
          <el-form class="base_info_form details_form" ref="form">
            <el-form-item :label="`上传${mediaTypeName}：`">
              <el-upload
                class="upload-demo"
                action="#"
                :multiple='false'
                :show-file-list='false'
                :limit="1"
                :http-request="uploadFile" 
                ref="uploadImg"
              >
                <el-button v-if="!isHasFile" type="text">点击上传</el-button>
                <span v-else class="file_content">{{addFileName}}</span>
              </el-upload>
            </el-form-item>
            <el-form-item :label="`${mediaTypeName}名称：`">
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
import { checkNotNull, awaitWrap, byteConvert } from "@/lib";
import {
  getAllObjectsByPrefix,
  downloadObjects,
  uploadDrainageFile,
  previewUrl,
  removeObjects
} from "@/api/IntelSupervision";
import showVideo from "../../common/showVideo.vue";

export default {
  components: { ElImageViewer, showVideo },
  data() {
    return {
      mediaSrcs: [],
      mediaType: "",
      mediaTypeName: "",
      uploadVisible: false,
      isHasFile: false,
      fileName: "",
      prefix: "",
      uploadForm: {},
      addFileName: "",
      showMediaViewer: false,
      currMediaUrl: ""
    };
  },
  props: {
    activeName: {
      type: String,
      default: ""
    },
    properties: {}
  },
  watch: {
    activeName: {
      immediate: true,
      handler(val) {
        if (val == this.properties["panelName"]) {
          this.currRowData = this.$store.state.IntelSupervison.digitalManagement;
          //   this.mediaType = "video";
          this.mediaType = this.properties["type"];
          this.mediaTypeName = this.mediaType == "video" ? "视频" : "图片";
          this.getMedias();
        }
      }
    }
  },
  methods: {
    byteConvert,
    checkNotNull,
    // 获得图片
    async getMedias() {
      const _this = this;
      _this.mediaSrcs = [];
      _this.prefix =
        _this.currRowData["pshName"] + "/" + _this.properties["prefix"];
      let mediaInfo =
        (await awaitWrap(
          getAllObjectsByPrefix({
            bucketName: "base-bucket",
            prefix: _this.prefix
          })
        ))[1] || [];
      if (checkNotNull(mediaInfo) && checkNotNull(mediaInfo["data"])) {
        mediaInfo = mediaInfo["data"] || [];
      } else {
        mediaInfo = [];
      }

      mediaInfo.forEach(m => {
        _this.getMediasSrc(m);
      });
    },
    async getMediasSrc(data, index) {
      let imgUrl = "";
      let urlData =
        (await awaitWrap(
          previewUrl({
            bucketName: "base-bucket",
            fileName: data["prefix"] + data["objectName"]
          })
        ))[1] || [];

      if (checkNotNull(urlData) && checkNotNull(urlData["data"])) {
        imgUrl = urlData["data"] || "";
      }

      this.mediaSrcs.push({
        ...data,
        ...{
          mediaName: data["objectName"].split(".")[0],
          mediaUrl: imgUrl
        }
      });
    },
    // 上传
    uploadFile(item) {
      const _this = this;
      _this.addFileName = item["file"]["name"];
      if (!checkNotNull(_this.fileName)) {
        _this.fileName = _this.addFileName.split(".")[0] || "";
      }

      const fileObj = item.file;
      _this.uploadForm = new FormData();
      _this.uploadForm.append("multipartFile", fileObj);
      _this.uploadForm.append("bucketName", "base-bucket");
      _this.uploadForm.append("dirName", _this.prefix);
      _this.isHasFile = true;
    },
    // 取消上传
    cancelUpload() {
      this.$refs.uploadImg.clearFiles();
      this.uploadVisible = false;
      this.isHasFile = false;
      this.fileName = "";
      this.addFileName = "";
      this.uploadForm = {};
    },
    // 确认上传
    confirmUpload() {
      const _this = this;
      _this.uploadForm.append("fileName", _this.fileName);
      if (checkNotNull(_this.fileName) && _this.isHasFile) {
        uploadDrainageFile(_this.uploadForm).then(res => {
          _this.$message({
            type: "success",
            message: "上传成功"
          });
          _this.getMedias();
          _this.cancelUpload();
        });
      } else {
        _this.$message({
          type: "warning",
          message: `请上传${_this.mediaTypeName}且填写${
            _this.mediaTypeName
          }名称！`
        });
      }
    },
    // 查看
    handlerShowMedia(url) {
      this.currMediaUrl = url;
      this.showMediaViewer = true;
    },
    // 关闭查看
    closeMediaViewer() {
      this.showMediaViewer = false;
    },
    // 下载
    handlerDownloadMedia(data) {
      downloadObjects({
        bucketName: "base-bucket",
        objectNames: data["objectName"],
        prefix: data["prefix"]
      });
    },
    // 删除
    handlerDeleteMedia(data) {
      const _this = this;
      _this
        .$confirm(`确定要删除该${_this.mediaTypeName}?`, "", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          removeObjects({
            bucketName: "base-bucket",
            objectNames: data["objectName"],
            prefix: data["prefix"]
          }).then(() => {
            _this.$message({
              type: "success",
              message: "删除成功！"
            });

            _this.getMedias();
          });
        })
        .catch(() => {
          _this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // 新增
    addMedia() {
      this.uploadVisible = true;
    }
  }
};
</script>

<style lang="scss" scoped>
.media_content {
  display: flex;
  flex-wrap: wrap;
  color: rgba(255, 255, 255, 0.7);
  font-size: 16px;

  li {
    text-align: center;
    margin: 10px;
    width: 245px;

    .img_content {
      width: 100%;
      height: 152px;

      position: relative;

      .el-image,
      video {
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
</style>
