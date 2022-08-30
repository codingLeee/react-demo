// 公用方法
import XLSX from 'xlsx';
import FileSaver from 'file-saver';
import html2Canvas from 'html2canvas';

/**
 * 存储localStorage
 */
export const setStorage = (name, content) => {
  if (!name) return;
  if (typeof content !== "string") {
    content = JSON.stringify(content);
  }
  window.localStorage.setItem(name, content);
};

/**
 * 获取localStorage
 */
export const getStorage = (name) => {
  if (!name) return;
  return window.localStorage.getItem(name);
};

/**
 * 删除localStorage
 */
export const removeStorage = (name) => {
  if (!name) return;
  window.localStorage.removeItem(name);
};

/**
 * 清空localStorage
 */
export const clearStorage = () => {
  for (var key in localStorage) {
    // 剔除 记住密码
    if (key != "checked") {
      window.localStorage.removeItem(key);
    }
  }
};

/**
 * 数字分段
 */
export const thousandSignNumber = (val) => {
  return val.toString().replace(/(\d)(?=(?:\d{3}[+]?)+$)/g, '$1,')
}

/**
 * 对象判空
 */
export const checkNotNull = (obj) => {
  if (typeof (obj) == "number") {
    return true;
  } else {
    return !(
      obj == null ||
      Object.keys(obj).length == 0 ||
      obj == "null" ||
      obj == undefined ||
      obj === "" ||
      obj.length < 1 ||
      obj === "undefined" ||
      obj === "NaN"
    );
  }
};

/**
 * 导出
 */
export const exportMethods = (url, data) => {
  let paramsStr = "";
  Object.keys(data).forEach((key) => {
    paramsStr += key + "=" + data[key] + "&";
  });
  paramsStr += `aiidc-token=${getStorage('token')}`;
  let apiUrl = "http://" + location.host;
  location.href = `${apiUrl}/${url}?${paramsStr}`;
};

// 下载echarts为图片
export const downloadChart = (echarts, chartId, chartName) => {
  let myChart = echarts.getInstanceByDom(document.getElementById(chartId));
  let url = myChart.getConnectedDataURL({
    pixelRatio: 5, //导出的图片分辨率比率,默认是1
    backgroundColor: "#fff", //图表背景色
    excludeComponents: [
      //保存图表时忽略的工具组件,默认忽略工具栏
      "toolbox",
    ],
    type: "png", //图片类型支持png和jpeg
  });
  let $a = document.createElement("a");
  let type = "png";
  $a.download = (chartName || "download") + "." + type;
  $a.target = "_blank";
  $a.href = url;
  // Chrome and Firefox
  if (typeof MouseEvent === "function") {
    let evt = new MouseEvent("click", {
      view: window,
      bubbles: true,
      cancelable: false,
    });
    $a.dispatchEvent(evt);
  }
  // IE
  else {
    let html = "";

    ('<body style="margin:0;">');
    "![](" + url + ")";
    ("</body>");
    let tab = window.open();
    tab.document.write(html);
  }
};

// 水质类别
export const getWaterCategory = (code) => {
  switch (code) {
    case 1:
    case "1":
      return "I类";
    case 2:
    case "2":
      return "Ⅱ类";
    case 3:
    case "3":
      return "Ⅲ类";
    case 4:
    case "4":
      return "Ⅳ类";
    case 5:
    case "5":
      return "Ⅴ类";
    case 6:
    case "6":
      return "劣Ⅴ类";
    default:
      return "";
  }
};

// 图例计算
export const calculateLegend = (data) => {
  if (!checkNotNull(data.beginData)) {
    return data.endData + "以下";
  } else if (!checkNotNull(data.endData)) {
    return data.beginData + "以上";
  } else {
    return data.beginData + '-' + data.endData;
  }
}

// 图表自适应 字体
export const chartFontSize = (val, initWidth = 1920) => {
  // return val*Number(window.document.documentElement.style.fontSize.slice(0,-2));
  let nowClientWidth = document.documentElement.clientWidth;
  return val * (nowClientWidth / initWidth);
  // return val * (2816/initWidth);
}

// 获得范围内的所有日期
// start,end : yyyy/yyyy-MM/yyyy-MM-dd
// type: year/month/date
export const getTimeHorizon = (start, end, type) => {
  // const getDate = datestr => {
  //   let temp = datestr.split("-");
  //   let date = type == "year" ? new Date(temp[0]) : (type == "month" ? new Date(temp[0],temp[1]) : new Date(temp[0],temp[1],temp[2]));
  //   return date;
  // }

  let dateArr = [];
  var startTime = new Date(start);
  var endTime = new Date(end);

  while ((endTime.getTime() - startTime.getTime()) >= 0) {
    if (type == "year") {
      let year = startTime.getFullYear();
      dateArr.push(year);
      startTime.setFullYear(startTime.getFullYear() + 1);
    } else if (type == "month") {
      let year = startTime.getFullYear();
      let month = (startTime.getMonth().toString().length === 1 && startTime.getMonth() + 1 !== 10) ? "0" + (parseInt(startTime.getMonth().toString(), 10) + 1) : (startTime.getMonth() + 1);
      dateArr.push(year + "-" + month);
      startTime.setMonth(startTime.getMonth() + 1);
    } else if (type == "date") {
      let year = startTime.getFullYear();
      let month = (startTime.getMonth().toString().length === 1 && startTime.getMonth() + 1 !== 10) ? "0" + (parseInt(startTime.getMonth().toString(), 10) + 1) : (startTime.getMonth() + 1);
      let day = startTime.getDate().toString().length == 1 ? "0" + startTime.getDate() : startTime.getDate();
      dateArr.push(year + "-" + month + "-" + day);
      startTime.setDate(startTime.getDate() + 1);
    }
  }

  return dateArr;
}

// 处理异步错误 
export const awaitWrap = (promise) => {
  // [err, data]
  return promise
    .then(res => [null, res])
    .catch(err => [err, null])
}

/**
 * 字节转换为"B", "KB", "MB", "GB", "TB"
 * @param  {Number} bytes   [字节数：B]
 * @param  {Number} decimal [小数位数]
 * @return {Number}         [适当单位的字节数]
 */
export const byteConvert = (bytes, decimal = 2) => {
  var units = ["B", "KB", "MB", "GB", "TB"];
  for (var i = 1; Number(bytes) / Math.pow(1024, i) >= 1; i++) {}
  return (Number(bytes) / Math.pow(1024, i - 1)).toFixed(decimal) + units[i - 1];
}

// 国控 市控
export const pointControlType = (val) => {
  switch (val) {
    case 1:
    case "1":
      // 国 圆形
      return 'point_circular_icon';
    case 3:
    case "3":
      // 市 菱形
      return 'point_diamond_icon';
    case 4:
    case "4":
      // 区县 三角形
      return 'point_triangle_icon';
    case 0:
    case "0":
      // 其他 正方形
      return 'point_square_icon';
    default:
      return 'point_square_icon';
  }
}

export const rgb = (val) => {
  var r,
    g,
    b,
    flag = true;
  while (flag) {
    r = Math.round(Math.random() * 255);
    g = Math.round(Math.random() * 255);
    b = Math.round(Math.random() * 255);

    if ((r + g + b) / 3 > 128) {
      flag = false;
    }
  }

  return r + "," + g + "," + b;
}


// 扁平数据结构转化为树结构
export const buildTree = (list, params) => {
  let temp = {};
  let tree = {};
  for (let i in list) {
    temp[list[i][params["id"]]] = list[i];
  }
  for (let i in temp) {
    if (temp[i][params["parentId"]]) {
      if (!temp[temp[i][params["parentId"]]].children) {
        temp[temp[i][params["parentId"]]].children = new Object();
      }
      temp[temp[i][params["parentId"]]].children[temp[i][params["id"]]] = temp[i];
    } else {
      tree[temp[i][params["id"]]] = temp[i];
    }
  }
  return tree;
}

// 筛选表格跨行数组
export const filterTableRowSpanList = ({
  tableData,
  code,
  parentCode,
  calculatNumber = false
}) => {
  let spanList = []
  let spanItme = {}

  tableData.forEach((ele, index) => {
    let firstIndex = tableData.findIndex(item => {
      if (checkNotNull(parentCode)) {
        return (item[code] === ele[code]) && (item[parentCode] === ele[parentCode])
      } else {
        return item[code] === ele[code]
      }
    })

    if (spanList.findIndex(item => {
        return item.firstIndex === firstIndex
      }) === -1) {

      spanItme = {
        length: tableData.filter(item => {
          if (checkNotNull(parentCode)) {
            return (item[code] === ele[code]) && (item[parentCode] === ele[parentCode])
          } else {
            return item[code] === ele[code]
          }
        }).length,
        firstIndex: firstIndex
      }

      spanList.push(spanItme)
      ele['rowspan'] = spanItme['length'];

      // 计算序号
      if (calculatNumber) {
        if (index == 0) {
          ele["rowIndex"] = 1;
        } else {
          ele["rowIndex"] = tableData[spanList[spanList.length - 2]['firstIndex']]["rowIndex"] + 1;
        }
      }
    }
  })

  return spanList;
}

export const setTableRowSpan = (spanList, rowIndex) => {
  let index = spanList.findIndex(item => {
    return item.firstIndex === rowIndex
  })
  if (index > -1) {
    return {
      rowspan: spanList[index].length,
      colspan: 1
    }
  } else {
    return {
      rowspan: 0,
      colspan: 0
    }
  }
}


//导出excel功能
export const exportToExcel = (name, id) => {
  let excelName = name + '.xlsx';
  var xlsxParam = {
    raw: true
  }; //转换成excel时，使用原始的格式
  // 克隆节点
  let tables = document.getElementById(id).cloneNode(true);
  // 判断是否为固定列，解决（为固定列时，会重复生成表格）
  if (tables.querySelector('.el-table__fixed') !== null) {
    tables.removeChild(tables.querySelector('.el-table__fixed'))
  }
  let table_book = XLSX.utils.table_to_book(tables, xlsxParam);
  var table_write = XLSX.write(table_book, {
    bookType: "xlsx",
    bookSST: true,
    type: "array"
  });
  try {
    FileSaver.saveAs(
      new Blob([table_write], {
        type: "application/octet-stream"
      }),
      excelName
    );
  } catch (e) {
    if (typeof console !== "undefined") console.log(e, table_write);
  }
  return table_write;
}

// 通过div导出成图片
export const exportPic = (DivID, name, option = {
  backgroundColor: "#101f70"
}) => {
  html2Canvas(document.querySelector("#" + DivID), {
    ...option
  }).then(canvas => {
    let dataURL = canvas.toDataURL("image/png");
    if (dataURL !== "") {
      var a = document.createElement('a')
      a.download = name;
      a.href = dataURL;
      a.click()
    }
  })
}


// 报警内容处理
export const alarmInfoFormat = (row) => {
  var info = "";
  if (row.alarmType == 2) {
    if (typeof (row.alarmInfo) == "string" && checkNotNull(row.alarmInfo)) {
      row.alarmInfo = JSON.parse(row.alarmInfo);
    }
    for (var i = 0; i < row.alarmInfo.length; i++) {
      let factorThreshold = '';
      if (row.alarmInfo[i].factorStatus > 0) {
        if (row.alarmInfo[i].factor == 'w01001') {
          let str = row.alarmInfo[i].factorThreshold;
          factorThreshold = `${str.substring(0, 1)}-${str.substring(1, str.length)}`
        } else {
          factorThreshold = row.alarmInfo[i].factorThreshold
        }
        let itemInfo =
          row.alarmInfo[i].factorName +
          row.alarmInfo[i].factorValue +
          "(" +
          factorThreshold +
          ")；";
        info += itemInfo;
      }
    }
  } else if (row.alarmType == 1) {
    if (typeof (row.alarmInfo) == "string" && checkNotNull(row.alarmInfo)) {
      row.alarmInfo = JSON.parse(row.alarmInfo);
    }
    for (let i = 0; i < row.alarmInfo.length; i++) {
      let itemInfo =
        row.alarmInfo[i].deviceAlarmInfoTs +
        "；";
      info += itemInfo;
    }
  } else {
    info = row.alarmInfo;
  }

  return info;
}

// ph判断超标获取字体颜色
export const isPhExceed = (data) => {
  if (Number(data) < 6 || Number(data) > 9) {
    return '#FF0000'
  }
}

// 液位判断超标获取字体颜色
export const isLevelExceed = (data) => {
  if (Number(data) > 1.25) {
    return '#FF0000'
  }
}

// 电导率判断超标获取字体颜色
export const isConductanceExceed = (data) => {
  if (Number(data) > 1000) {
    return '#FF0000'
  }
}

//报警类型格式化
export const alarmTypeFormat = (row) => {
  if (row.alarmType == 1) {
    return "设备故障";
  } else if (row.alarmType == 2) {
    return "监测指标";
  } else if (row.alarmType == 3) {
    return "视频识别";
  } else if (row.alarmType == 4) {
    return "运维上报";
  } else if (row.alarmType == 5) {
    return "问题上报";
  }
}

//报警状态格式化
export const alarmStatusFormat = (row) => {
  if (row.alarmStatus == 1) {
    return "预警";
  } else if (row.alarmStatus == 2) {
    return "告警";
  } else if (row.alarmStatus == 3) {
    return "异常";
  } else if (row.alarmStatus == 4) {
    return "运维上报";
  } else if (row.alarmStatus == 5) {
    return "问题上报";
  }
}

//排水户类型
export const pshTypeFomatter = (row) => {
  switch (row.pshType) {
    case 1:
      return "住宅类排水户";
    case 2:
      return "非住宅类排水户";
    default:
      return "其他";
  }
}

//处理状态
export const eventStateFomatter = (row) => {
  if (row.eventState) {
    switch (parseInt(row.eventState)) {
      case 2:
        return "已分发";
      case 5:
        return "已反馈";
      case -1:
        return "已忽略";
      case 4:
        return "已审核";
      case -2:
        return "已退回";
      case 3:
        return "处理中";
      case 1:
        return "已确认";
      case 0:
        return "点位报警";
    }
  } else {
    switch (parseInt(row)) {
      case 2:
        return "已分发";
      case 5:
        return "已反馈";
      case -1:
        return "已忽略";
      case 4:
        return "已审核";
      case -2:
        return "已退回";
      case 3:
        return "处理中";
      case 1:
        return "已确认";
      case 0:
        return "点位报警";
    }
  }
}

//点位状态
export const dataStateFormatter = (row) => {
  switch (parseInt(row.dataState)) {
    case 0:
      return "正常";
    case 1:
      return "告警";
    case 2:
      return "异常";
    case 3:
      return "设备故障";
  }
}

// 设备状态
export const deviceStateFormatter = (row) => {
  switch (parseInt(row.deviceState)) {
    case 0:
      return "正常";
    case 1:
      return "故障";
    case 2:
      return "掉线";
  }
}

//液位
export const levelStateFormatter = (data) => {
  switch (parseInt(data)) {
    case 0:
      return "正常";
    case 1:
      return "高液位超标";
    case 2:
      return "高液位预警";
    case 3:
      return "低液位超标";
    case 4:
      return "低液位预警";
    case 5:
      return "异常";
  }
}

export const myClass = (val) => {
  if (val === 1) {
    return {
      "yellow": true
    };
  } else if (val === 2) {
    return {
      "red": true
    };
  } else if (val === 3) {
    return {
      "orange": true
    };
  }
}

// 根据街道获取中心经纬度
export const getStreetLocation = (street) => {
  switch (street) {
    case '荷花池街道':
      return [104.07093269600006, 30.69297973900007];
    case '茶店子街道':
      return [104.01924285100006, 30.695579628000028];
    case '驷马桥街道':
      return [104.08503628900004, 30.695133527000053];
    case '营门口街道':
      return [104.03568489600008, 30.705766345000034];
    case '九里堤街道':
      return [104.04835618500005, 30.708162984000064];
    case '西安路街道':
      return [104.04277406100005, 30.675089508000033];
    case '抚琴街道':
      return [104.04505576600007, 30.690370600000056];
    case '五块石街道':
      return [104.05839607300004, 30.711257981000065];
    case '金泉街道':
      return [103.99424234800006, 30.72274647100004];
    case '沙河源街道':
      return [104.04823962100007, 30.743619418000028];
    case '天回镇街道':
      return [104.08833525800009, 30.77821222100003];
    case '西华街道':
      return [104.01073662900004, 30.739632923000045];
    case '凤凰山街道':
      return [104.08271882100006, 30.737863170000026];
  }
}

//时间转换(js将 “2021-07-06T06:23:57.000+00:00” 转换为年月日时分秒)
export const transformTimestamp = (timestamp) => {
  let a = new Date(timestamp).getTime();
  const date = new Date(a);
  const Y = date.getFullYear() + '-';
  const M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
  const D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + '  ';
  const h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
  const m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes());
  const dateString = Y + M + D + h + m;
  return dateString;
}

const libList = {
  chartFontSize,
  getStreetLocation
}

export default libList
