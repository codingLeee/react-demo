import store from "../store";

let menus = [{
    title: "查看详情",
    router: "eventConfirmDetails",
    parent: "/DrainageOperation",
    upperLevel: "eventConfirm"
  },
  {
    title: "普查详情", // 调查信息资料表
    router: "surveyInformationSheet",
    parent: "/IntelSupervision/digitalOperation",
    upperLevel: "digitalManagement"
  },
  {
    title: "普查详情", // 测绘成果
    router: "mappingAchievement",
    parent: "/IntelSupervision/digitalOperation",
    upperLevel: "digitalManagement"
  },
  {
    title: "普查详情", // 检测报告及评估
    router: "testReportEvaluation",
    parent: "/IntelSupervision/digitalOperation",
    upperLevel: "digitalManagement"
  },
  {
    title: "普查详情", // 检测视频
    router: "mediaInfo",
    parent: "/IntelSupervision/digitalOperation",
    upperLevel: "digitalManagement"
  },
  {
    title: "普查详情", // 检测照片
    router: "detectionPhotos",
    parent: "/IntelSupervision/digitalOperation",
    upperLevel: "digitalManagement"
  },
  {
    title: "普查详情", // 重大缺陷统计
    router: "majorDefectStatistics",
    parent: "/IntelSupervision/digitalOperation",
    upperLevel: "digitalManagement"
  }
]



export const addNonMenuRoute = (accessedRoutes) => {
  menus.forEach(m => {
    updateRoute(accessedRoutes, m);
  })
  
  console.log(accessedRoutes);
  store.commit("SET_ROUTES", accessedRoutes);
  return accessedRoutes;
}

const updateRoute = (parentData, addData) => {
  parentData.forEach(n => {
    if (n["router"] == addData["upperLevel"]) {
      n["isPage"] = true;
      n.children = [
        ...n.children,
        {
          component: () => import(`@/views${addData["parent"]}/common/${addData["router"]}`),
          meta: {
            title: addData["title"]
          },
          title: addData["title"],
          name: addData["router"],
          path: addData["router"],
          router: addData["router"],
          parent: addData["parent"],
        }
      ]
    } else if (n.children) {
      updateRoute(n.children, addData);
    }
  })

  return parentData;
}
