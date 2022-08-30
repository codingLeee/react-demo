<template>
    <div class="majorDefect_statistics">
        <detailCollapse :collapseList="collapseList" />
    </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      collapseList: [
        {
          tabName: "重大缺陷统计",
          title: "存在重大缺陷的排水户记录表",
          name: "majorDefectsRecords",
          isModifiable: false,
          isUpdate: false,
          component: "",
          path: "/IntelSupervision/digitalOperation/majorDefectStatistics"
        },
        {
          tabName: "重大缺陷统计",
          title: "原始文档下载",
          name: "originalDocumentDownload",
          isModifiable: false,
          isUpdate: false,
          component: "",
          path: "/IntelSupervision/digitalOperation/common"
        }
      ]
    };
  },
  methods: {}
};
</script>
