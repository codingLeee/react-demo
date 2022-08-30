import * as http from "./request/fetch";

// 文件查看
export const previewUrl = param => http.get("/bigScreenApi/minio/previewUrl", param);
// 文件下载
export const downloadFile = param => http.downloadExcel("/bigScreenApi/minio/download", param);
// 文件上传
export const uploadFile = param => http.filePost("/bigScreenApi/minio/upload", param);

// 数据查询-实时监测
export const getRealTimeData = param => http.get("/intelSupervisonApi/dataQuery/getRealTimeData", param);
//数据查询-历史数据
export const getHistoryData = param => http.get("/intelSupervisonApi/dataQuery/getHistoryData", param);
//历史数据-导出excel
export const getexcelExportData = (param, fileName) => http.downloadExcel("/intelSupervisonApi/dataQuery/excelExport", param, fileName);

//查询点位状态
export const getDataByType = param => http.get("/bigScreenApi/medadata/getByType", param);
//获取街道和街道编码
export const getStreetsData = param => http.get("/intelSupervisonApi/area/getAll", param);
//监测指标报警管理 
export const getAlarmIndexInfo = param => http.get("/intelSupervisonApi/alarm/getAlarmIndexInfo", param);
//监测设备故障管理
export const getDeviceAlarm = param => http.get("/intelSupervisonApi/alarm/getDeviceAlarm", param);
//运维人员
export const getPersonByAlarmId = param => http.get("/intelSupervisonApi/alarm/getPersonByAlarmId", param);
//监测指标统计 - 当前时刻的数据
export const getNowTimeData = param => http.get("/intelSupervisonApi/indexAlarmStats/getNowTimeData", param);
//当月报警
export const getMonthAlarm = param => http.get("/intelSupervisonApi/indexAlarmStats/getMonthAlarm", param);
//街道排名
export const getSubPsh = param => http.get("/intelSupervisonApi/indexAlarmStats/getSubPsh", param);
//时段统计分析
export const getAlarmTimeInterval = param => http.get("/intelSupervisonApi/indexAlarmStats/getAlarmTimeInterval", param);
//日历
export const getAlarmCal = param => http.get("/intelSupervisonApi/indexAlarmStats/getAlarmCal", param);
//报警数量
export const getStreetAlarmNum = param => http.get("/intelSupervisonApi/indexAlarmStats/getStreetAlarmNum", param);
//当日top5
export const getAlarmPointTop5 = param => http.get("/intelSupervisonApi/indexAlarmStats/getAlarmPointTop5", param);

//获取设备今日处理情况
export const getDeviceEventSituation = param => http.get("/intelSupervisonApi/deviceAlarmStats/getDeviceEventSituation", param);
//设备故障统计,当月
export const getDeviceFaultSta = param => http.get("/intelSupervisonApi/deviceAlarmStats/getDeviceFaultSta", param);
//点位故障排名
export const getDeviceFaultTop = param => http.get("/intelSupervisonApi/deviceAlarmStats/getDeviceFaultTop", param);
//获取设备健康率
export const getDeviceHealthy = param => http.get("/intelSupervisonApi/deviceAlarmStats/getDeviceHealthy", param);
//获取今日设备状态
export const getDeviceState = param => http.get("/intelSupervisonApi/deviceAlarmStats/getDeviceState", param);
//获取故障设备类型
export const getDeviceType = param => http.get("/intelSupervisonApi/deviceAlarmStats/getDeviceType", param);

//污水液位统计分析
export const getLevelChange = param => http.get("/intelSupervisonApi/over/getLevelChange", param);



// --------------------- 数字化管理
// 列表
export const getDrainageList = param => http.get("/intelSupervisonApi/digitization/getDrainageList", param);
// 所属街道/社区
export const getAreaBySub = param => http.get("/intelSupervisonApi/area/getAreaBySub", param);
// 新增
export const saveDrainageBasic = param => http.post("/intelSupervisonApi/digitization/saveDrainageBasic", param);
// 编辑
export const updateDrainageBasic = param => http.put("/intelSupervisonApi/digitization/updateDrainageBasic", param);
// 删除
export const deleteDrainageBasic = param => http.dataDelete("/intelSupervisonApi/digitization/deleteDrainageBasic", param);
// 批量删除
export const batchDelDrainageBasic = param => http.jsonDataDelete("/intelSupervisonApi/digitization/batchDelDrainageBasic", param);
// 导出
export const downLoadDrainageBasic = param => http.downloadExcel("/intelSupervisonApi/digitization/drainageBasicExport", param);
// 上传
export const drainageImport = param => http.filePost("/intelSupervisonApi/digitization/drainageImport", param);
// 导入
export const batchDrainageBasic = param => http.post("/intelSupervisonApi/digitization/batchDrainageBasic", param);
// 模板下载
export const downloadDrainageTemplate = param => http.downloadExcel("/bigScreenApi/minio/download?bucketName=template&fileName=%E6%8E%92%E6%B0%B4%E6%88%B7%E7%AE%A1%E7%90%86%E6%A8%A1%E6%9D%BF.xlsx", param);
// 禁用
export const getDrainageState = param => http.get("/intelSupervisonApi/digitization/getDrainageState", param);
// 普查详情-调查信息资料表-排水户基本信息汇表
export const getDrainageBasic = param => http.get("/intelSupervisonApi/survey/getDrainageBasic", param);
// 修改
export const updateDrainageBaseInfo = param => http.put("/intelSupervisonApi/update/updateDrainageBasic", param);
// 普查详情-调查信息资料表-排水户混接点情况
export const getMixedInfo = param => http.get("/intelSupervisonApi/survey/getMixedInfo", param);
// 图片上传
export const mixedUploadPic = param => http.filePost("/intelSupervisonApi/survey/mixedUploadPic", param);
// 图片删除
export const removeMixedPic = param => http.dataDelete("/intelSupervisonApi/survey/removeObject", param);
// 修改
export const updateDrainageMixed = param => http.put("/intelSupervisonApi/update/updateDrainageMixed", param);
// 删除
export const delDrainageMixed = param => http.dataDelete("/intelSupervisonApi/update/delDrainageMixed", param);
// 新增
export const saveDrainageMixed = param => http.post("/intelSupervisonApi/update/saveDrainageMixed", param);
// 普查详情-调查信息资料表-建筑物内部阳台排水情况调查表
// 查询
export const getBalconyInfo = param => http.get("/intelSupervisonApi/survey/getBalconyInfo", param);
// 新增
export const saveDrainageBalcony = param => http.post("/intelSupervisonApi/update/saveDrainageBalcony", param);
// 修改
export const updateDrainageBalcony = param => http.put("/intelSupervisonApi/update/updateDrainageBalcony", param);
// 删除
export const delDrainageBalcony = param => http.dataDelete("/intelSupervisonApi/update/delDrainageBalcony", param);
// 修改form
export const updateDrainageBalconyHeader = param => http.put("/intelSupervisonApi/update/updateDrainageBalconyHeader", param);
// 普查详情-调查信息资料表-小区排水系统存在问题登记表
// 查询
export const getSystemProblems = param => http.get("/intelSupervisonApi/survey/getSystemProblems", param);
// 修改
export const updateDrainageProblem = param => http.put("/intelSupervisonApi/update/updateDrainageProblem", param);
// 普查详情-调查信息资料表-排水户内部检查井（雨水口）调查表
// 查询
export const getInsideWells = param => http.get("/intelSupervisonApi/survey/getInsideWells", param);
// 新增
export const saveDrainageWell = param => http.post("/intelSupervisonApi/update/saveDrainageWell", param);
// 修改
export const updateDrainageWell = param => http.put("/intelSupervisonApi/update/updateDrainageWell", param);
// 删除
export const delDrainageWell = param => http.dataDelete("/intelSupervisonApi/update/delDrainageWell", param);
// 普查详情-调查信息资料表-混接点统计表
// 查询
export const getMixedStatistics = param => http.get("/intelSupervisonApi/survey/getMixedStatistics", param);
// 新增
export const saveMixedStatistics = param => http.post("/intelSupervisonApi/update/saveMixedStatistics", param);
// 修改
export const updateMixedStatistics = param => http.put("/intelSupervisonApi/update/updateMixedStatistics", param);
// 删除
export const delMixedStatistics = param => http.dataDelete("/intelSupervisonApi/update/delMixedStatistics", param);
// 修改form
export const updateMixedStatisticsHeader = param => http.put("/intelSupervisonApi/update/updateMixedStatisticsHeader", param);
// 普查详情-调查信息资料表-流量测定记录表
// 查询
export const getFlowMeasurement = param => http.get("/intelSupervisonApi/survey/getFlowMeasurement", param);
// 新增
export const saveFlowMeasurement = param => http.post("/intelSupervisonApi/update/saveFlow", param);
// 修改
export const updateFlowMeasurement = param => http.put("/intelSupervisonApi/update/updateFlow", param);
// 删除
export const delFlowMeasurement = param => http.dataDelete("/intelSupervisonApi/update/delFlow", param);
// 修改form
export const updateFlowMeasurementHeader = param => http.put("/intelSupervisonApi/update/updateFlowHeader", param);
// 普查详情-调查信息资料表-水质检测记录表
// 查询
export const getWaterQuality = param => http.get("/intelSupervisonApi/survey/getWaterQuality", param);
// 新增
export const saveWaterQuality = param => http.post("/intelSupervisonApi/update/saveWaterQuality", param);
// 修改
export const updateWaterQuality = param => http.put("/intelSupervisonApi/update/updateWaterQuality", param);
// 删除
export const delWaterQuality = param => http.dataDelete("/intelSupervisonApi/update/delWaterQuality", param);
// 修改form
export const updateWaterQualityHeader = param => http.put("/intelSupervisonApi/update/updateWaterQualityHeader", param);
// 普查详情-调查信息资料表-排水户管道预处理作业前现场记录表
// 查询
export const getPretreatmentOperation = param => http.get("/intelSupervisonApi/survey/getPretreatmentOperation", param);
// 图片上传
export const sceneUploadPic = param => http.filePost("/intelSupervisonApi/survey/sceneUploadPic", param);
// 图片删除
export const delScenePic = param => http.dataDelete("/intelSupervisonApi/survey/delScenePic", param);
// 修改
export const updateScene = param => http.put("/intelSupervisonApi/update/updateScene", param);
// 删除
export const delScene = param => http.dataDelete("/intelSupervisonApi/update/delScene", param);
// 新增
export const saveScene = param => http.post("/intelSupervisonApi/update/saveScene", param);
// 修改form
export const updateSceneHeader = param => http.put("/intelSupervisonApi/update/updateSceneHeader", param);
// 普查详情-调查信息资料表-排水户暂无法预处理作业设施现场记录表
// 查询
export const getNotPretreatmentOperation = param => http.get("/intelSupervisonApi/survey/getNotPretreatmentOperation", param);
// 修改
export const updateSceneProblem = param => http.put("/intelSupervisonApi/update/updateSceneProblem", param);
// 删除
export const delSceneProblem = param => http.dataDelete("/intelSupervisonApi/update/delSceneProblem", param);
// 新增
export const saveSceneProblem = param => http.post("/intelSupervisonApi/update/saveSceneProblem", param);
// 修改form
export const updateSceneProblemHeader = param => http.put("/intelSupervisonApi/update/updateSceneProblemHeader", param);
// 普查详情-调查信息资料表-排水户内部排水附属构筑物清单
// 查询
export const getAncillary = param => http.get("/intelSupervisonApi/survey/getAncillary", param);
// 修改
export const updateAncillary = param => http.put("/intelSupervisonApi/update/updateAncillary", param);
// 删除
export const delAncillary = param => http.dataDelete("/intelSupervisonApi/update/delAncillary", param);
// 新增
export const saveAncillary = param => http.post("/intelSupervisonApi/update/saveAncillary", param);
// 普查详情-测绘成果-工作量
// 查询
export const getMapWorkload = param => http.get("/intelSupervisonApi/achievements/getMapWorkload", param);
// 修改大类
export const updateMapWorkPipeType = param => http.put("/intelSupervisonApi/achievements/updateMapWorkPipeType", param);
// 修改小类
export const updateMapWork = param => http.put("/intelSupervisonApi/achievements/updateMapWork", param);
// 新增大类
export const saveMapWorkPicType = param => http.post("/intelSupervisonApi/achievements/saveMapWorkPicType", param);
// 新增小类
export const saveMapWork = param => http.post("/intelSupervisonApi/achievements/saveMapWork", param);
// 删除大类
export const delMapWorkPipeType = param => http.dataDelete("/intelSupervisonApi/achievements/delMapWorkPipeType", param);
// 删除小类
export const delMapWork = param => http.dataDelete("/intelSupervisonApi/achievements/delMapWork", param);
// 普查详情-测绘成果-管线点成果表
// 查询
export const getPipeline = param => http.get("/intelSupervisonApi/achievements/getPipeline", param);
// 修改
export const updateMapAchievement = param => http.put("/intelSupervisonApi/achievements/updateMapAchievement", param);
// 删除
export const delMapAchievement = param => http.dataDelete("/intelSupervisonApi/achievements/delMapAchievement", param);
// 新增
export const saveMapAchievement = param => http.post("/intelSupervisonApi/achievements/saveMapAchievement", param);
// 普查详情-检测报告及评估-工程概况
export const getProjectInfo = param => http.get("/intelSupervisonApi/reportAndEvaluation/getProjectInfo", param);
// 修改
export const updateProject = param => http.put("/intelSupervisonApi/updateProject", param);
// 普查详情-检测报告及评估-主要工程量表
// 查询
export const getProjectScale = param => http.get("/intelSupervisonApi/reportAndEvaluation/getProjectScale", param);
// 修改
export const updateProjectScale = param => http.put("/intelSupervisonApi/updateProjectScale", param);
// 删除
export const delProjectScale = param => http.dataDelete("/intelSupervisonApi/delProjectScale", param);
// 新增
export const saveProjectScale = param => http.post("/intelSupervisonApi/saveProjectScale", param);
// 普查详情-检测报告及评估-检查井检查情况汇总表
// 查询
export const getWellEvaluate = param => http.get("/intelSupervisonApi/reportAndEvaluation/getWellEvaluate", param);
// 修改
export const updateEvaluateSummary = param => http.put("/intelSupervisonApi/updateEvaluateSummary", param);
// 删除
export const delEvaluateSummary = param => http.dataDelete("/intelSupervisonApi/delEvaluateSummary", param);
// 新增
export const saveEvaluateSummary = param => http.post("/intelSupervisonApi/saveEvaluateSummary", param);
// 普查详情-检测报告及评估-检查井缺陷汇总一览表
// 查询
export const getWellDefect = param => http.get("/intelSupervisonApi/reportAndEvaluation/getWellDefect", param);
// 修改
export const updateDefectSummary = param => http.put("/intelSupervisonApi/updateDefectSummary", param);
// 删除
export const delDefectSummary = param => http.dataDelete("/intelSupervisonApi/delDefectSummary", param);
// 新增
export const saveDefectSummary = param => http.post("/intelSupervisonApi/saveDefectSummary", param);
// 普查详情-检测报告及评估-管道缺陷汇总一览表
// 查询
export const getPipeDefect = param => http.get("/intelSupervisonApi/reportAndEvaluation/getPipeDefect", param);
// 修改
export const updatePipeDefectSummary = param => http.put("/intelSupervisonApi/updatePipeDefectSummary", param);
// 删除
export const delPipeDefectSummary = param => http.dataDelete("/intelSupervisonApi/delPipeDefectSummary", param);
// 新增
export const savePipeDefectSummary = param => http.post("/intelSupervisonApi/savePipeDefectSummary", param);
// 普查详情-检测报告及评估-管段状况评估表
// 查询
export const getPipeSituation = param => http.get("/intelSupervisonApi/reportAndEvaluation/getPipeSituation", param);
// 修改
export const updatePipeSituation = param => http.put("/intelSupervisonApi/updatePipeSituation", param);
// 删除
export const delPipeSituation = param => http.dataDelete("/intelSupervisonApi/delPipeSituation", param);
// 新增
export const savePipeSituation = param => http.post("/intelSupervisonApi/savePipeSituation", param);
// 普查详情-检测报告及评估-管段检测与评估成果表
// 查询
export const getPipeAchievement = param => http.get("/intelSupervisonApi/reportAndEvaluation/getPipeAchievement", param);
// 修改
export const updatePipeEvaAchievement = param => http.put("/intelSupervisonApi/updatePipeEvaAchievement", param);
// 删除
export const delPipeEvaAchievement = param => http.dataDelete("/intelSupervisonApi/delPipeEvaAchievement", param);
// 新增
export const savePipeEvaAchievement = param => http.post("/intelSupervisonApi/savePipeEvaAchievement", param);
// 普查详情-检测报告及评估-管段检测与评估成果表-详情
// 查询
export const getPipeEvaAchiveDetail = param => http.get("/intelSupervisonApi/reportAndEvaluation/getPipeEvaAchiveDetail", param);
// 修改
export const updatePipeEvaAchiveDetail = param => http.put("/intelSupervisonApi/updatePipeEvaAchiveDetail", param);
// 删除
export const delPipeEvaAchiveDetail = param => http.dataDelete("/intelSupervisonApi/delPipeEvaAchiveDetail", param);
// 新增
export const savePipeEvaAchiveDetail = param => http.post("/intelSupervisonApi/savePipeEvaAchiveDetail", param);
// 普查详情-检测报告及评估-单体排水源评估及建议
// 查询
export const getEvaDrainage = param => http.get("/intelSupervisonApi/reportAndEvaluation/getEvaDrainage", param);
// 修改
export const updateEvaDrainage = param => http.put("/intelSupervisonApi/updateEvaDrainage", param);
// 删除
export const delEvaDrainage = param => http.dataDelete("/intelSupervisonApi/delEvaDrainage", param);
// 新增
export const saveEvaDrainage = param => http.post("/intelSupervisonApi/saveEvaDrainage", param);
// 普查详情-检测视频/照片
// 文件上传
export const uploadDrainageFile = param => http.filePost("/intelSupervisonApi/testVideo/uploadDrainageFile", param);
// 普查详情-检测报告及评估-附属设施运行情况评估及建议
// 查询
export const getAppendageRunning = param => http.get("/intelSupervisonApi/reportAndEvaluation/getAppendageRunning", param);
// 修改
export const updateAppendageRunning = param => http.put("/intelSupervisonApi/updateAppendageRunning", param);
// 删除
export const delAppendageRunning = param => http.dataDelete("/intelSupervisonApi/delAppendageRunning", param);
// 新增
export const saveAppendageRunning = param => http.post("/intelSupervisonApi/saveAppendageRunning", param);
// 普查详情-检测报告及评估-排水户内部错接混接评估及建议
// 查询
export const getWrongConnect = param => http.get("/intelSupervisonApi/reportAndEvaluation/getWrongConnect", param);
// 修改
export const updateWrongConnect = param => http.put("/intelSupervisonApi/updateWrongConnect", param);
// 删除
export const delWringConnect = param => http.dataDelete("/intelSupervisonApi/delWringConnect", param);
// 新增
export const saveWrongConnect = param => http.post("/intelSupervisonApi/saveWrongConnect", param);
// 普查详情-检测报告及评估-管网运行情况评估及建议
// 查询
export const getPipeRunning = param => http.get("/intelSupervisonApi/reportAndEvaluation/getPipeRunning", param);
// 修改
export const updatePipeRunning = param => http.put("/intelSupervisonApi/updatePipeRunning", param);
// 删除
export const delPipeRunning = param => http.dataDelete("/intelSupervisonApi/delPipeRunning", param);
// 新增
export const savePipeRunning = param => http.post("/intelSupervisonApi/savePipeRunning", param);
// 普查详情-重大缺陷统计-存在重大缺陷的排水户记录表
// 查询
export const getMajorDefect = param => http.get("/intelSupervisonApi/majorDefect/getMajorDefect", param);
// 图片上传
export const uploadMajorDefectPic = param => http.filePost("/intelSupervisonApi/majorDefect/uploadMajorDefectPic", param);
// 图片删除
export const delMajorDefectPic = param => http.dataDelete("/intelSupervisonApi/majorDefect/delMajorDefectPic", param);
// 修改
export const updateMajorDefect = param => http.put("/intelSupervisonApi/majorDefect/updateMajorDefect", param);
// 删除
export const delMajorDefect = param => http.dataDelete("/intelSupervisonApi/majorDefect/delMajorDefect", param);
// 新增
export const saveMajorDefect = param => http.post("/intelSupervisonApi/majorDefect/saveMajorDefect", param);



// 档案管理
//新建文件夹
export const createDir = param => http.post("/intelSupervisonApi/archivesManage/createDir", param);
//文件查看
export const detailObject = param => http.get("/intelSupervisonApi/archivesManage/detailObject", param);
//下载
export const downloadObjects = (param) => http.downloadExcel("/intelSupervisonApi/archivesManage/downloadObjects", param);
//根据文件前置查询
export const getAllObjectsByPrefix = param => http.get("/intelSupervisonApi/archivesManage/getAllObjectsByPrefix", param);
//文件分类查询
export const getAllObjectsByType = param => http.get("/intelSupervisonApi/archivesManage/getAllObjectsByType", param);
//移动
export const moveObject = param => http.post("/intelSupervisonApi/archivesManage/moveObject", param);
//删除
export const removeObjects = param => http.post("/intelSupervisonApi/archivesManage/removeObjects", param);
//重命名
export const renameObject = param => http.post("/intelSupervisonApi/archivesManage/renameObject", param);
//文件搜索
export const searchObjects = param => http.get("/intelSupervisonApi/archivesManage/searchObjects", param);
//上传
export const uploadObjects = param => http.filePost("/intelSupervisonApi/archivesManage/uploadObjects", param);
//解析
export const analysis = param => http.post("/persistenceApi/document/analysis", param);
//解析记录
export const analysisLogPage = param => http.post("/intelSupervisonApi/archivesManage/analysisLogPage", param);


// 雨污混接
// 雨污混接分析-基本信息
export const findBasicInfo = param => http.get("/intelSupervisonApi/intelligentAnalysis/mixSewageRain/findBasicInfo", param);
// 雨污混接分析-排水户混接等级占比
export const findDrainageGradePercent = param => http.get("/intelSupervisonApi/intelligentAnalysis/mixSewageRain/findDrainageGradePercent", param);
// 雨污混接分析-排水户混接评估建议
export const findDrainageGroupAssessmentProposal = (param) => http.get("/intelSupervisonApi/intelligentAnalysis/mixSewageRain/findDrainageGroupAssessmentProposal", param);
// 雨污混接分析-排水户混接原因
export const findDrainageGroupMixReason = param => http.get("/intelSupervisonApi/intelligentAnalysis/mixSewageRain/findDrainageGroupMixReason", param);
// 雨污混接分析-排水户混接类型分析
export const findDrainageGroupMixType = param => http.get("/intelSupervisonApi/intelligentAnalysis/mixSewageRain/findDrainageGroupMixType", param);
// 雨污混接分析-排水户类型分析
export const findDrainageGroupType = param => http.get("/intelSupervisonApi/intelligentAnalysis/mixSewageRain/findDrainageGroupType", param);
// 雨污混接分析-排水户混接点数量(2.地图,7.排名)
export const findDrainageNumRanking = param => http.get("/intelSupervisonApi/intelligentAnalysis/mixSewageRain/findDrainageNumRanking", param);

// 管道预处理
// 基本信息
export const findPipeBasicInfo = param => http.get("/intelSupervisonApi/intelligentAnalysis/pipePretreatment/findBasicInfo", param);
// 地图数据
export const findPipeLenghtGroup = param => http.get("/intelSupervisonApi/intelligentAnalysis/pipePretreatment/findPipeLenghtGroup", param);
// 水位情况
export const findPipeLevel = param => http.get("/intelSupervisonApi/intelligentAnalysis/pipePretreatment/findPipeLevel", param);
// 管道长度
export const findProblemPipeLenght = param => http.get("/intelSupervisonApi/intelligentAnalysis/pipePretreatment/findProblemPipeLenght", param);
// 无法预处理数量情况
export const findProblemPipeNumAnalysis = param => http.get("/intelSupervisonApi/intelligentAnalysis/pipePretreatment/findProblemPipeNumAnalysis", param);
// 排名
export const findProblemPipeNumRanking = param => http.get("/intelSupervisonApi/intelligentAnalysis/pipePretreatment/findProblemPipeNumRanking", param);

// 构筑物
// 基本信息
export const findBuildBasicInfo = param => http.get("/intelSupervisonApi/intelligentAnalysis/internalAuxStructures/findBasicInfo", param);
// 地图数据
export const findStructuresNumRanking = param => http.get("/intelSupervisonApi/intelligentAnalysis/internalAuxStructures/findStructuresNumRanking", param);
// 构筑物类型分析
export const findStructuresNumByType = param => http.get("/intelSupervisonApi/intelligentAnalysis/internalAuxStructures/findStructuresNumByType", param);
// 构筑物占比
export const findStructuresNumByPercent = param => http.get("/intelSupervisonApi/intelligentAnalysis/internalAuxStructures/findStructuresNumByPercent", param);
// 构筑物异常原因
export const findStructuresNumByReason = param => http.get("/intelSupervisonApi/intelligentAnalysis/internalAuxStructures/findStructuresNumByReason", param);
