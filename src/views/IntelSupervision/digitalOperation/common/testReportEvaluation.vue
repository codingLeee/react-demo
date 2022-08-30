<!-- 检测报告及评估 -->
<template>
    <div class="test_report_evaluation">
      <detailCollapse :collapseList="collapseList" />
    </div>
</template>

<script>
export default {
  data() {
    return {
      collapseList: [
        {
          tabName: "检测报告及评估",
          title: "工程概况",
          name: "projectProfile",
          isModifiable: true,
          isUpdate: false,
          component: "",
          path: "/IntelSupervision/digitalOperation/testReportEvaluation"
        },
        {
          tabName: "检测报告及评估",
          title: "主要工程量表",
          name: "principalQuantitiesBill",
          isModifiable: false,
          isUpdate: false,
          component: "",
          path: "/IntelSupervision/digitalOperation/testReportEvaluation"
        },
        {
          tabName: "检测报告及评估",
          title: "检查井检查情况汇总表",
          name: "inspectionWellSummary",
          isModifiable: false,
          isUpdate: false,
          component: "",
          path: "/IntelSupervision/digitalOperation/testReportEvaluation"
        },
        {
          tabName: "检测报告及评估",
          title: "检查井缺陷汇总一览表",
          name: "inspectionWellsDefectsSummary",
          isModifiable: false,
          isUpdate: false,
          component: "",
          path: "/IntelSupervision/digitalOperation/testReportEvaluation"
        },
        {
          tabName: "检测报告及评估",
          title: "管道缺陷汇总一览表",
          name: "pipeDefectsSummary",
          isModifiable: false,
          isUpdate: false,
          component: "",
          path: "/IntelSupervision/digitalOperation/testReportEvaluation"
        },
        {
          tabName: "检测报告及评估",
          title: "管段状况评估表",
          name: "pipeSectionConditionAssessment",
          isModifiable: false,
          isUpdate: false,
          component: "",
          path: "/IntelSupervision/digitalOperation/testReportEvaluation"
        },
        {
          tabName: "检测报告及评估",
          title: "管段检测与评估成果表",
          name: "pipeSectionInspectionEvaluationTable",
          isModifiable: false,
          isUpdate: false,
          component: "",
          path: "/IntelSupervision/digitalOperation/testReportEvaluation"
        },
        {
          tabName: "检测报告及评估",
          title: "单体排水源评估及建议",
          name: "singleDischargeAssessmentSuggestion",
          isModifiable: false,
          isUpdate: false,
          component: "",
          path: "/IntelSupervision/digitalOperation/testReportEvaluation"
        },
        {
          tabName: "检测报告及评估",
          title: "管网运行情况评估及建议",
          name: "pipeNetworkOperation",
          isModifiable: false,
          isUpdate: false,
          component: "",
          path: "/IntelSupervision/digitalOperation/testReportEvaluation"
        },
        {
          tabName: "检测报告及评估",
          title: "附属设施运行情况评估及建议",
          name: "auxiliaryFacilities",
          isModifiable: false,
          isUpdate: false,
          component: "",
          path: "/IntelSupervision/digitalOperation/testReportEvaluation"
        },
        {
          tabName: "检测报告及评估",
          title: "排水户内部错接混接评估及建议",
          name: "internalMisconnectionMixed",
          isModifiable: false,
          isUpdate: false,
          component: "",
          path: "/IntelSupervision/digitalOperation/testReportEvaluation"
        },
        {
          tabName: "检测报告及评估",
          title: "原始文档下载",
          name: "originalDocumentDownload",
          isModifiable: false,
          isUpdate: false,
          component: "",
          path: "/IntelSupervision/digitalOperation/common"
        },
      ]
    };
  },
  methods: {}
};
</script>
