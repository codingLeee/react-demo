<template>
    <div class="detection_photos">
        <detailCollapse :collapseList="collapseList" />
    </div>
</template>

<script>
export default {
  data() {
    return {
      collapseList: [
        {
          tabName: "检测照片",
          title: "暗井和井盖无法打开",
          name: "mediaTest",
          isModifiable: false,
          isUpdate: false,
          component: "",
          path: "/IntelSupervision/digitalOperation/common",
          properties: {
            prefix: "检测照片/暗井和井盖无法打开/",
            panelName: "mediaTest1",
            type:"img"
          }
        },
        {
          tabName: "检测照片",
          title: "工作照片",
          name: "mediaTest",
          isModifiable: false,
          isUpdate: false,
          component: "",
          path: "/IntelSupervision/digitalOperation/common",
          properties: {
            prefix: "检测照片/工作照片/",
            panelName: "mediaTest2",
            type:"img"
          }
        },
        {
          tabName: "检测照片",
          title: "混接点照片",
          name: "mediaTest",
          isModifiable: false,
          isUpdate: false,
          component: "",
          path: "/IntelSupervision/digitalOperation/common",
          properties: {
            prefix: "检测照片/混接点照片/",
            panelName: "mediaTest3",
            type:"img"
          }
        },
        {
          tabName: "检测照片",
          title: "监测井照片",
          name: "mediaTest",
          isModifiable: false,
          isUpdate: false,
          component: "",
          path: "/IntelSupervision/digitalOperation/common",
          properties: {
            prefix: "检测照片/监测井照片/",
            panelName: "mediaTest4",
            type:"img"
          }
        },
        {
          tabName: "检测照片",
          title: "无法预处理照片",
          name: "mediaTest",
          isModifiable: false,
          isUpdate: false,
          component: "",
          path: "/IntelSupervision/digitalOperation/common",
          properties: {
            prefix: "检测照片/无法预处理照片/",
            panelName: "mediaTest5",
            type:"img"
          }
        },
        {
          tabName: "检测照片",
          title: "预处理照片",
          name: "mediaTest",
          isModifiable: false,
          isUpdate: false,
          component: "",
          path: "/IntelSupervision/digitalOperation/common",
          properties: {
            prefix: "检测照片/预处理照片/",
            panelName: "mediaTest6",
            type:"img"
          }
        },
        {
          tabName: "检测照片",
          title: "其他照片",
          name: "mediaTest",
          isModifiable: false,
          isUpdate: false,
          component: "",
          path: "/IntelSupervision/digitalOperation/common",
          properties: {
            prefix: "检测照片/其他照片/",
            panelName: "mediaTest7",
            type:"img"
          }
        }
      ]
    };
  }
};
</script>


<style lang="scss" scoped>
.detection_photos {
}
</style>
