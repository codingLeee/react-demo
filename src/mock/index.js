const Mock = require("mockjs");


// 菜单
Mock.mock("/menus", "get", {
  code: 200,
  msg: "成功",
  data: {
    menus: [{
      title: "金牛区智慧排水一张图",
      router: "BigScreenContainer",
      parent: "/BigScreen",
      children: []
    }, {
      title: "排水户智慧监管系统",
      router: "intelSupervision",
      parent: "/IntelSupervision",
      children: [{
          title: "实时监测",
          router: "realTimeMonitorMap",
          parent: "/IntelSupervision",
          children: []
        },
        {
          title: "数据查询",
          router: "dataQuery",
          parent: "/IntelSupervision",
          children: [{
              title: "实时监测数据查询",
              router: "realTimeMonitoring",
              parent: "/IntelSupervision",
              children: []
            },
            {
              title: "历史监测数据查询",
              router: "historicalMonitoring",
              parent: "/IntelSupervision",
              children: []
            }
          ]
        },
        {
          title: "报警管理",
          router: "reportManagement",
          parent: "/IntelSupervision",
          children: [{
              title: "报警管理",
              router: "alarmManage",
              parent: "/IntelSupervision",
              children: []
            },
            {
              title: "监测指标报警统计分析",
              router: "monitoringIndicators",
              parent: "/IntelSupervision",
              children: []
            },
            {
              title: "监测设备报警统计分析",
              router: "monitoringEquipment",
              parent: "/IntelSupervision",
              children: []
            }
          ]
        },
        {
          title: "统计分析",
          router: "sewageOverflow",
          parent: "/IntelSupervision",
          children: [{
            title: "液位变化分析",
            router: "levelChange",
            parent: "/IntelSupervision",
            children: []
          }]
        },
        {
          title: "数字化运营",
          router: "digitalOperation",
          parent: "/IntelSupervision",
          children: [{
            title: "排水户数字化管理",
            router: "digitalManagement",
            parent: "/IntelSupervision/digitalOperation",
            children: []
          }, {
            title: "档案管理",
            router: "fileManagement",
            parent: "/IntelSupervision",
            children: []
          }]
        },
        {
          title: "排水户智能分析",
          router: "drainersOperation",
          parent: "/IntelSupervision",
          children: [{
              title: "雨污混接智能分析",
              router: "rainAnalysis",
              parent: "/IntelSupervision",
              children: []
            },
            {
              title: "管道预处理问题智能分析",
              router: "pipelineAnalysis",
              parent: "/IntelSupervision",
              children: []
            },
            {
              title: "内部附属构筑物智能分析",
              router: "buildAnalysis",
              parent: "/IntelSupervision",
              children: []
            }
          ]
        }
      ]
    }, {
      title: "排水运维调度管理系统",
      router: "drainageOperation",
      parent: "/DrainageOperation",
      children: [{
          title: "事件确认",
          router: "eventConfirm",
          parent: "/DrainageOperation",
          children: []
        },
        {
          title: "事件分发",
          router: "eventDistribution",
          parent: "/DrainageOperation",
          children: []
        },
        {
          title: "事件办结",
          router: "eventClose",
          parent: "/DrainageOperation",
          children: []
        },
        {
          title: "事件管理",
          router: "eventDetails",
          parent: "/DrainageOperation",
          children: []
        },
        {
          title: "事件统计",
          router: "eventStatistics",
          parent: "/DrainageOperation",
          children: []
        }
      ]
    }, {
      title: "防汛监管系统",
      router: "floodControl",
      parent: "/FloodControl",
      children: [{
          title: "防汛一张图",
          router: "floodPic",
          parent: "/FloodControl",
          children: []
        },
        {
          title: "水雨情监测",
          router: "waterRain",
          parent: "/FloodControl",
          url: "http://221.237.107.122:29022/prevention",
          children: []
        },
        {
          title: "公告发布",
          router: "announcement",
          parent: "/FloodControl",
          children: []
        }
      ]
    }, {
      title: "沿河排口智能监管系统",
      router: "alongRiverOutlet",
      parent: "/AlongRiverOutlet",
      children: [
        {
          title: "实时监测",
          router: "riverMonitor",
          parent: "/AlongRiverOutlet",
          children: []
        },
        {
          title: "报警管理",
          router: "outletAlarmManagement",
          parent: "/AlongRiverOutlet",
          children: [{
              title: "历史报警事件查询",
              router: "outletHistoricalAlarmEvent",
              parent: "/AlongRiverOutlet/AlarmManagement",
              children: []
            },
            {
              title: "监测指标报警统计分析",
              router: "outletMonitoringIndicators",
              parent: "/AlongRiverOutlet/AlarmManagement",
              children: []
            },
            {
              title: "监测设备报警统计分析",
              router: "outletMonitoringEquipment",
              parent: "/AlongRiverOutlet/AlarmManagement",
              children: []
            }
          ]
        },
        {
          title: "数据查询",
          router: "outletDataQuery",
          parent: "/AlongRiverOutlet",
          children: [{
              title: "实时监测数据查询",
              router: "outletRealTimeMonitoring",
              parent: "/AlongRiverOutlet/DataQuery",
              children: []
            },
            {
              title: "历史监测数据查询",
              router: "outletHistoricalMonitoring",
              parent: "/AlongRiverOutlet/DataQuery",
              children: []
            },
            {
              title: "监测报表",
              router: "monitoringList",
              parent: "/AlongRiverOutlet/DataQuery",
              children: []
            }
          ]
        },
        {
          title: "统计分析",
          router: "outletStatisticAnalysis",
          parent: "/AlongRiverOutlet/StatisticAnalysis",
          children: []
        }
      ]
    }]
  }
})
