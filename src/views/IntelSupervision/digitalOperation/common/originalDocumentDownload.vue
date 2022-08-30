<!-- 原始文档下载 -->
<template>
    <div class="original_document_download" title="原始文档下载">
        <ul>
            <li v-for="(item,index) in documentData" :key="'document'+index">
                <span class="document_name">{{item["objectName"]}}</span>
                <span class="document_size">{{byteConvert(item["size"])}}</span>
                <span class="document_download" @click="downloadDocument(item)">下载</span>
            </li>
        </ul>
    </div>
</template>

<script>
import { getAllObjectsByPrefix, downloadObjects } from "@/api/IntelSupervision";
import { awaitWrap, checkNotNull, byteConvert } from "@/lib";

export default {
  data() {
    return {
      documentData: []
    };
  },
  props: {
    tabName: {
      type: String
    },
    activeName: {
      type: String,
      default: ""
    }
  },
  watch: {
    changeVal: {
      immediate: true,
      handler(val) {
        if (val) {
          if (val["activeName"] == "originalDocumentDownload") {
            this.currRowData = this.$store.state.IntelSupervison.digitalManagement;
            this.getDocument();
          }
        }
      }
    }
  },
  computed: {
    changeVal() {
      const { tabName, activeName } = this;
      return { tabName, activeName };
    }
  },
  methods: {
    byteConvert,
    // 查询
    async getDocument() {
      const _this = this;
      let documentInfo =
        (await awaitWrap(
          getAllObjectsByPrefix({
            bucketName: "base-bucket",
            prefix: _this.currRowData["pshName"] + "/" + _this.tabName,
            recursive: false
          })
        ))[1] || [];

      if (checkNotNull(documentInfo) && checkNotNull(documentInfo["data"])) {
        _this.documentData = documentInfo["data"] || [];
      } else {
        _this.documentData = [];
      }
    },
    // 下载
    downloadDocument(data) {
      downloadObjects({
        bucketName: "base-bucket",
        objectNames: data["objectName"],
        prefix: data["prefix"]
      });
    }
  },
  created() {},
  mounted() {},
  beforeDestroy() {
  }
};
</script>

<style lang="scss" scoped>
.original_document_download {
  ul {
    padding: 0 20px;
    li {
      margin-bottom: 10px;

      span {
        display: inline-block;
        vertical-align: middle;
        color: #fff;
        font-size: 14px;

        &.document_size {
          margin: 0 40px 0 70px;
        }

        &.document_download {
          color: #3dc6ff;
          cursor: pointer;
        }
      }
    }
  }
}
</style>

