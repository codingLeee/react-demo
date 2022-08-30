import * as http from "./request/fetch";
import mock from '../mock';

// 获得菜单
export const getMenus = param => http.get("/menus", param);

// 大屏
export const getAllPoint = param => http.get("/bigScreenApi/monitorPoint/getAll", param);
// export const getAllPoint = param => http.get("http://192.168.18.180:1003/monitorPoint/getAll", param);
// 点位最新信息
export const getLatestCalInfo = param => http.get("/bigScreenApi/monitorPoint/getLatestCalInfo", param);
// 字典表
export const getDataByType = param => http.get("/bigScreenApi/medadata/getByType", param);
// 获得所有街道
export const getAllSubdistrict = param => http.get("/bigScreenApi/drainageHousehold/getAllSubdistrict", param);
// 获得所有排水户
export const getDrainageHousehold = param => http.get("/bigScreenApi/drainageHousehold/getAll", param);
// 获得所有运维人员
export const getAllOperationPerson = param => http.get("/bigScreenApi/operationPerson/getAll", param);
// A面
// 基本情况一览表
export const getDrainageHouseholdInfo = param => http.get("/bigScreenApi/drainageHousehold/alalysisPshType", param);

// 实时监测
// 点位监测参数趋势图
export const getPonitParaTrend = param => http.get("/bigScreenApi/monitorPoint/getPonitParaTrend", param);

// 因子查询
export const getPonitParaNoUnit = param => http.get("/bigScreenApi/monitorPoint/getPonitParaNoUnit", param);

// 获得所有河流
export const getAllRiver = param => http.get("/bigScreenApi/river/getAll", param);
