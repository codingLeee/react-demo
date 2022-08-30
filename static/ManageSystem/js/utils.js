//格式化
function dataStateFormatter(row) {
  //点位状态
  switch (row.dataState) {
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

function deviceStateFormatter(row) {
    if (row.deviceState == 0) {
        return "正常";
    } else if (row.deviceState == 1) {
        return "故障";
    } else if (row.deviceState == 2) {
        return "掉线";
    }
}

function pshTypeFomatter(row) {
  switch (row.pshType) {
    case 0:
      return "全部";
    case 1:
      return "住宅类排水户";
    case 2:
      return "非住宅类排水户";
  }
}

export default {
    dataStateFormatter,
    deviceStateFormatter,
    pshTypeFomatter

}
