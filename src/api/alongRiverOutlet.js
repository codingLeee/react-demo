import * as http from "./request/fetch";

// 报警管理-历史报警事件查询-监测指标
// 查询
export const getTestIndexAlarm = param => http.get("/alongRiverOutletApi/historyAlarm/testIndexAlarm", param);
// 导出
export const exportTestIndex = (param, fileName) => http.downloadExcel("/alongRiverOutletApi/historyAlarm/exportTestIndex", param, fileName);
// 报警管理-历史报警事件查询-监测设备
// 查询
export const getTestDeviceAlarm = param => http.get("/alongRiverOutletApi/historyAlarm/testDeviceAlarm", param);
// 导出
export const exportTestDevice = (param, fileName) => http.downloadExcel("/alongRiverOutletApi/historyAlarm/exportTestDevice", param, fileName);
// 报警管理-监测指标报警统计分析-报警事件信息统计
// 查询
export const getAlarmEventInfo = param => http.get("/alongRiverOutletApi/testIndex/getAlarmEventInfo", param);
// 报警管理-监测指标报警统计分析-信息分析
// 当月报警次数排名
export const getSameMonthNum = param => http.get("/alongRiverOutletApi/testIndex/getSameMonthNum", param);
// 当月报警指标统计
export const getSameMonthAlarmIndex = param => http.get("/alongRiverOutletApi/testIndex/getSameMonthAlarmIndex", param);
// 报警时段统计分析
export const getAlarmTimeInterval = param => http.get("/alongRiverOutletApi/testIndex/getAlarmTimeInterval", param);
// 报警日历
export const getAlarmCal = param => http.get("/alongRiverOutletApi/testIndex/getAlarmCal", param);
export const getDateAlarmNum = param => http.get("/alongRiverOutletApi/testIndex/getDateAlarmNum", param);
// 数据查询
// 查询
export const getRealTimeData = param => http.get("/alongRiverOutletApi/realTime/getRealTime", param);
// 导出
export const exportRealTime = (param, fileName) => http.downloadExcel("/alongRiverOutletApi/realTime/exportRealTime", param, fileName);
// 统计分析
// 监测值同比分析
export const getTestValueYoY = param => http.get("/alongRiverOutletApi/statisticalAnalysis/getTestValueYoY", param);
// 监测值环比分析
export const getTestValueRR = param => http.get("/alongRiverOutletApi/statisticalAnalysis/getTestValueRR", param);
// 监测值趋势分析
export const  getTestValueAnalysis = param => http.get("/alongRiverOutletApi/statisticalAnalysis/testValueAnalysis", param);
// 获得阈值
export const  getFatorsStandards = param => http.get("/alongRiverOutletApi/statisticalAnalysis/getStandards", param);

// 自动监测查询
export const autoMonitoringReport = param => http.get("/alongRiverOutletApi/bzRiverOutletData/autoMonitoringReport", param);
// 自动监测导出
export const autoMonitoringReportExport = (param, fileName) => http.downloadExcel("/alongRiverOutletApi/bzRiverOutletData/autoMonitoringReportExport", param, fileName);