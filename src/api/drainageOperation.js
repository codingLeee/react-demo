import * as http from "./request/fetch";


//事件确认列表
export const getRecentTable = param => http.get("/drainageApi/eventConfirm/getTable", param);
//元数据
export const getDataByType = param => http.get("/bigScreenApi/medadata/getByType", param);
//获取当前报警时段
export const getCurrentAlarmPeriod = param => http.get("/drainageApi/eventConfirm/currentAlarmPeriod", param);
//确认报警
export const getConfirmAlarm = param => http.post("/drainageApi/eventConfirm/confirmAlarm", param);
//解除报警
export const getIgnoreAlarm = param => http.post("/drainageApi/eventConfirm/ignoreAlarm", param);
//一键确认
export const getBatchConfirmAlarm = param => http.post("/drainageApi/eventConfirm/batchConfirmAlarm", param);
//一键解除
export const getBatchIgnoreAlarm = param => http.post("/drainageApi/eventConfirm/batchIgnoreAlarm", param);
//查看详情 - 基本信息
export const getdetailInfoBase = param => http.get("/drainageApi/eventConfirm/detailInfoBase", param); 
//查看详情 - 监测信息
export const getdetailInfoMonitorHead = param => http.get("/drainageApi/eventConfirm/detailInfoMonitorHead", param); 
export const getPonitParaTrend = param => http.get("/drainageApi/eventConfirm/getPonitParaTrend", param); 
// 设备信息
export const getDeviceStateOfToday = param => http.get("/drainageApi/eventConfirm/getDeviceStateOfToday", param); 
//事件分发列表
export const getDispatchTable = param => http.get("/drainageApi/eventDispatch/getTable", param);
//事件分发-退回事件列表
export const getReturnTable = param => http.get("/drainageApi/eventReturn/getTable", param);
//事件分发-查看详情
export const getDispatchDetailInfo = param => http.get("/drainageApi/eventDispatch/detailInfo", param);
//事件分发 - 日志
export const getDispatchDetailInfoLog = param => http.get("/drainageApi/eventDispatch/detailInfoLog", param);
//事件分发 - 退回 - 查看详情 - 事件信息
export const getDispatchBackDetailInfo = param => http.get("/drainageApi/eventReturn/detailEventInfo", param);
//事件分发 - 退回- 查看详情 - 处理信息
export const getDispatcBackProcessInfo = param => http.get("/drainageApi/eventReturn/detailInfo", param);
//事件分发 - 退回- 日志
export const getDispatcBackDetailInfoLog = param => http.get("/drainageApi/eventReturn/detailInfoLog", param);
//运维人员-查询所有单位
export const getAllDept = param => http.get("/bigScreenApi/operationPerson/getAllDept", param);
//运维人员-查询单位所属人员
export const getByUnit = param => http.get("/bigScreenApi/operationPerson/getByUnit", param);
//事件分发操作
export const dispatchAlarm = param => http.post("/drainageApi/eventDispatch/dispatchAlarm", param);
//事件管理
export const getEventDetails = param => http.get("/drainageApi/eventQuery/getTable", param);
//事件结案列表
export const getEventClose = param => http.get("/drainageApi/eventAudit/getTable", param);
//一键结案
export const postBatchDealEvent = param => http.post("/drainageApi/eventAudit/batchDealEvent", param);
//结案
export const postDealEvent = param => http.post("/drainageApi/eventAudit/dealEvent", param);
//事件结案 -- 事件信息
export const getDealDetailEventInfo = param => http.get("/drainageApi/eventAudit/detailEventInfo", param);
//事件结案 -- 处理信息
export const getDealDetailInfo = param => http.get("/drainageApi/eventAudit/detailInfo", param);
//事件结案 - 日志
export const getDealDetailInfoLog = param => http.get("/drainageApi/eventAudit/detailInfoLog", param);
//事件退回
export const postEventReturn = param => http.post("/drainageApi/eventReturn/confirmAlarm", param);

//警报小铃铛
export const getAlarmBell = param => http.get("/drainageApi/eventConfirm/getAlarmBell", param);

//事件统计
// 事件总个数
export const getEventNum = param => http.get("/drainageApi/eventSta/getEventNum", param);
// 事件来源
export const getEventSource = param => http.get("/drainageApi/eventSta/getEventSource", param);
// 事件内容
export const getEventContent = param => http.get("/drainageApi/eventSta/getEventContent", param);
// 热点事件排名
export const getHotspotEvent = param => http.get("/drainageApi/eventSta/getHotspotEvent", param);
// 事件统计
export const getEventSub = param => http.get("/drainageApi/eventSta/getEventSub", param);
// 事件高发地
export const getEventHigh = param => http.get("/drainageApi/eventSta/getEventHigh", param);



//获取视频地址
export const getFlvAddr = param => http.get("/bigScreenApi/ipc/getFlvAddr", param);

// 防汛公告列表
export const getFloodPreNotice = param => http.get("/drainageApi/floodPreNotice/getFloodPreNotice", param);
// 公告新增
export const saveFloodPreNotice = param => http.post("/drainageApi/floodPreNotice/saveFloodPreNotice", param);

// 待办
export const getProblemTodo = param => http.get("/drainageApi/problem/getProblemTodo", param);

//防汛公告运维人员
export const getOperationUser = param => http.get("/drainageApi/floodPreNotice/getOperationUser", param);