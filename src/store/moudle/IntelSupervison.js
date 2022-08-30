export default {
  state: {
    // 存放状态
    streesOptions: [],
    houseHoldTypeOptions: [], //排水户类型
    pointStatusOptions: [], // 点位状态
    equipStatusOptions: [], //设备状态
    dealStateOptions: [], //处理状态
    deviceTypeOptions: [], //设备类型
    dataStateOptions: [], //数据状态
    alarmTypeOptions: [], //报警类型
    alarmStatusOptions: [], //报警状态
    activeTabName: "", // 被选中的tab标签
    digitalManagement: "", // 数字化管理行信息
    bulletinTypeOptions: [], // 公告类型
    bulletinUrgencyOptions: [], // 公告紧急度
    allRiverOptions: [], // 所有河流
    pointTypeOptions: [{ // 点位类型
        value: "1",
        text: "污水排口"
      },
      {
        value: "2",
        text: "雨水排口"
      }
    ]
  },
  getters: {
    // state的计算属性
    pointDisplayType(state) {
      let _arr = [];
      for (let i = 0; i < state.deviceTypeOptions.length; i++) {
        for (let j = 0; j < state.pointStatusOptions.length; j++) {
          _arr.push(state.deviceTypeOptions[i]["code"] + "_" + state.pointStatusOptions[j]["code"])
        }
      }

      return _arr;
    }
  },
  mutations: {
    SET_activeTabName: (state, data) => {
      state.activeTabName = data;
    },
    SET_streesOptions: (state, data) => {
      state.streesOptions = data;
    },
    SET_allRiverOptions: (state, data) => {
      state.allRiverOptions = data;
    },
    SET_houseHoldTypeOptions: (state, data) => {
      state.houseHoldTypeOptions = data;
    },
    SET_pointStatusOptions: (state, data) => {
      state.pointStatusOptions = data;
    },
    SET_equipStatusOptions: (state, data) => {
      state.equipStatusOptions = data;
    },
    SET_dealStateOptions: (state, data) => {
      state.dealStateOptions = data;
    },
    SET_deviceTypeOptions: (state, data) => {
      state.deviceTypeOptions = data;
    },
    SET_dataStateOptions: (state, data) => {
      state.dataStateOptions = data;
    },
    SET_alarmTypeOptions: (state, data) => {
      state.alarmTypeOptions = data;
    },
    SET_alarmStatusOptions: (state, data) => {
      state.alarmStatusOptions = data;
    },
    SET_levelStateOptions: (state, data) => {
      state.levelStateOptions = data;
    },
    SET_digitalManagement: (state, data) => {
      state.digitalManagement = data;
    },
    SET_bulletinTypeOptions: (state, data) => {
      state.bulletinTypeOptions = data;
    },
    SET_bulletinUrgencyOptions: (state, data) => {
      state.bulletinUrgencyOptions = data;
    },
  },
  actions: {
    // 提交mutation，异步操作
  },

};
