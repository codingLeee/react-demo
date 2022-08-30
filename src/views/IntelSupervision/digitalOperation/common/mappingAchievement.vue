
<!-- 测绘成果 -->
<template>
    <div class="mapping_achievement">
        <detailCollapse :collapseList="collapseList" />
    </div>
</template>

<script>
export default {
  data() {
    return {
      collapseList: [
        {
          tabName: "测绘成果",
          title: "工作量",
          name: "workload",
          isModifiable: false,
          component: "",
          path: "/IntelSupervision/digitalOperation/mappingAchievement"
        },
        {
          tabName: "测绘成果",
          title: "管线点成果表",
          name: "pipelinePointResults",
          properties:{
            pipeType:"1",
            panelName:"pipelinePointResults1"
          },
          isModifiable: false,
          component: "",
          path: "/IntelSupervision/digitalOperation/mappingAchievement"
        },
        {
          tabName: "测绘成果",
          title: "管线点成果表",
          name: "pipelinePointResults",
          properties:{
            pipeType:"2",
            panelName:"pipelinePointResults2"
          },
          isModifiable: false,
          component: "",
          path: "/IntelSupervision/digitalOperation/mappingAchievement"
        },
        {
          tabName: "测绘成果",
          title: "原始文档下载",
          name: "originalDocumentDownload",
          isModifiable: false,
          component: "",
          path: "/IntelSupervision/digitalOperation/common"
        }
      ]
    };
  },
  methods: {}
};
</script>

<style lang="scss" scoped>
.mapping_achievement {
}
</style>
