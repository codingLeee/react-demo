<template>
    <div class="survey_information_sheet">
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
          tabName: "调查信息资料表",
          title: "排水户基本信息汇表",
          name: "baseInfo",
          isModifiable: true,
          isUpdate: false,
          component: "",
          path: "/IntelSupervision/digitalOperation/surveyInformationSheet"
        },
        {
          tabName: "调查信息资料表",
          title: "排水户混接点情况",
          name: "drainageHouseholdMixedContact",
          isModifiable: false,
          isUpdate: false,
          component: "",
          path: "/IntelSupervision/digitalOperation/surveyInformationSheet"
        },
        {
          tabName: "调查信息资料表",
          title: "建筑物内部阳台排水情况调查表",
          name: "balconyDrainage",
          isModifiable: false,
          isUpdate: false,
          component: "",
          path: "/IntelSupervision/digitalOperation/surveyInformationSheet"
        },
        {
          tabName: "调查信息资料表",
          title: "混接点统计表",
          name: "mixingPointsStatisticalTable",
          isModifiable: false,
          isUpdate: false,
          component: "",
          path: "/IntelSupervision/digitalOperation/surveyInformationSheet"
        },
        {
          tabName: "调查信息资料表",
          title: "小区排水系统存在问题登记表",
          name: "drainageSystemProblems",
          isModifiable: true,
          isUpdate: false,
          component: "",
          path: "/IntelSupervision/digitalOperation/surveyInformationSheet"
        },
        {
          tabName: "调查信息资料表",
          title: "排水户内部检查井（雨水口）调查表",
          name: "internalCheckWell",
          isModifiable: false,
          isUpdate: false,
          component: "",
          path: "/IntelSupervision/digitalOperation/surveyInformationSheet"
        },
        {
          tabName: "调查信息资料表",
          title: "流量测定记录表",
          name: "flowMeasurementRecord",
          isModifiable: false,
          isUpdate: false,
          component: "",
          path: "/IntelSupervision/digitalOperation/surveyInformationSheet"
        },
        {
          tabName: "调查信息资料表",
          title: "水质检测记录表",
          name: "waterQualityTestRecord",
          isModifiable: false,
          isUpdate: false,
          component: "",
          path: "/IntelSupervision/digitalOperation/surveyInformationSheet"
        },
        {
          tabName: "调查信息资料表",
          title: "排水户管道预处理作业前现场记录表",
          name: "pretreatmentOperation",
          isModifiable: false,
          isUpdate: false,
          component: "",
          path: "/IntelSupervision/digitalOperation/surveyInformationSheet"
        },
        {
          tabName: "调查信息资料表",
          title: "排水户暂无法预处理作业设施现场记录表",
          name: "notPretreatmentOperation",
          isModifiable: false,
          isUpdate: false,
          component: "",
          path: "/IntelSupervision/digitalOperation/surveyInformationSheet"
        },
        {
          tabName: "调查信息资料表",
          title: "排水户内部排水附属构筑物清单",
          name: "ancillaryStructures",
          isModifiable: false,
          isUpdate: false,
          component: "",
          path: "/IntelSupervision/digitalOperation/surveyInformationSheet"
        },
        {
          tabName: "调查信息资料表",
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
