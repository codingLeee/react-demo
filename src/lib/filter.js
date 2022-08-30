import store from "@/store";
import Vue from 'vue';

import {
  awaitWrap,
  checkNotNull,
  getStorage,
  setStorage
} from "@/lib";
import {
  getStreetsData,
  getDataByType
} from "@/api/IntelSupervision";
import {
  getAllRiver
} from "@/api";

async function getBaseTypeInfo() {
  // 数据状态
  getDataInfoByType({
    type: "data_state",
    typeName: "dataState"
  })

  // 点位状态
  getDataInfoByType({
    type: "point_state",
    typeName: "pointStatus"
  })

  // 设备状态
  getDataInfoByType({
    type: "device_state",
    typeName: "equipStatus"
  })

  // 排水户类型
  getDataInfoByType({
    type: "psh_type",
    typeName: "houseHoldType"
  })

  // 处理状态
  getDataInfoByType({
    type: "deal_state",
    typeName: "dealState"
  })

  // 设备类型
  getDataInfoByType({
    type: "device_type",
    typeName: "deviceType"
  })

  // 数据状态
  getDataInfoByType({
    type: "data_state",
    typeName: "dataState"
  })

  // 报警类型
  getDataInfoByType({
    type: "alarm_type",
    typeName: "alarmType"
  })

  // 报警状态
  getDataInfoByType({
    type: "alarm_status",
    typeName: "alarmStatus"
  })

  //设备点位状态
  getDataInfoByType({
    type: "level_state",
    typeName: "levelState"
  })

  //公告类型
  getDataInfoByType({
    type: "bulletin_type",
    typeName: "bulletinType"
  })

  //公告紧急度
  getDataInfoByType({
    type: "bulletin_urgency",
    typeName: "bulletinUrgency"
  })
}

async function getDataInfoByType({
  type,
  typeName
}) {
  let dataList = (await awaitWrap(
    getDataByType({
      type: type
    })
  ))[1];

  if (checkNotNull(dataList) && checkNotNull(dataList["data"])) {
    dataList = dataList["data"];
  } else {
    dataList = [];
  }

  store.commit("SET_" + typeName + "Options", dataList);
  Vue.filter(typeName + 'Filter', value => {
    let dataInfo = dataList.filter(m => {
      return m["code"] == value;
    })[0] || {};

    return dataInfo["name"];
  })
}

getBaseTypeInfo()


// 所属街道
async function getStreets() {
  const res = await getStreetsData();
  let list = [];
  let obj = res.data;
  for (var i in obj) {
    var o = {
      value: i,
      label: obj[i],
    };
    if (o.label !== '成都市' && o.label !== '金牛区') {
      list.push(o);
    }
  }

  store.commit("SET_streesOptions", list);
}
getStreets();

// 所有河流
async function getRiver() {
  const res = (await getAllRiver())["data"] || {};
  let list = [];
  for(let i in res){
    list.push({
      text: res[i],
      value: i
    });
  }
  store.commit("SET_allRiverOptions", list);
}
getRiver();


console.log(1);