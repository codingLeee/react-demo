import * as http from "./request/fetch";
import mock from '../mock';

// 获取token
export const oauth2LocalCallBack = param => http.get("/sysUser/sysUser/oauth2LocalCallBack", param);
// 登录
export const sysLogin = param => http.post("/sysUser/sysUser/login", param);
