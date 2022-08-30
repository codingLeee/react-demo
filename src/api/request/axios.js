// 请求处理
import axios from "axios";
import router from "@/router";
import { getStorage, setStorage, removeStorage, checkNotNull } from "../../lib";
// import { MessageBox, Message } from "element-ui";
// import NProgress from 'nprogress'
// import 'nprogress/nprogress.css'
import store from "@/store";
var http = axios.create({
    headers: {
        // "content-type": "application/x-www-form-urlencoded",
        "aiidc-token": getStorage("token")
    }
});

// 请求拦截
http.interceptors.request.use(
  config => {
    // console.log("进入请求", config)
    // 过滤大屏请求
    // if(config['url'].indexOf("/data") != 0){
    //   // 如果存在token 则在请求头中添加
    //   if (getStorage("token")) {
    //     config.params = Object.assign({}, config.params, {
    //       token: `${getStorage("token")}`
    //     });
    //   }
    // }

    // else if(config['url'].indexOf("/videoApi") == 0){
    //   config.params = Object.assign({}, config.params, {
    //     APPkey: '20299682',
    //     APPsecret:'nTMcwIoI7UovCPoVbuMu'
    //   });
    // }

    return config;
  },
  err => {
    return Promise.reject(err);
  }
);

// 响应拦截
http.interceptors.response.use(
  response => {
    if (response.status == 200) {
        return Promise.resolve(response);
    } else {
      return Promise.reject(error.response);
    }
  },
  error => {
    return Promise.reject(error.response);
  }
);

export default http;
