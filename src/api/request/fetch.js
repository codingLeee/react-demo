import http from "./axios";
import qs from "qs";

/**
 * get方法，对应get请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function get(url, params = {}, headers = {
  "content-type": "application/x-www-form-urlencoded"
}) {
  let abort;
  let request = new Promise((resolve, reject) => {
    http
      .get(url, {
        params: params
      }, {
        headers: headers
      })
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        reject(err.data);
      });

    abort = reject;
  });

  request.abort = abort;
  return request;
}


/**
 * post方法，对应post请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function post(url, params = {}, headers = {
  "content-type": "application/x-www-form-urlencoded"
}) {
  let abort;
  let request = new Promise((resolve, reject) => {
    http
      .post(url, qs.stringify(params), {
        headers: headers
      })
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        reject(err.data);
      });

    abort = reject;
  });

  request.abort = abort;
  return request;
}

/**
 * post方法，对应post请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function jsonPost(url, params = {}) {
  return new Promise((resolve, reject) => {
    http
      .post(url, params, {
        headers: {
          "content-type": "application/json"
        }
      })
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        reject(err.data);
      });
  });
}

export function filePost(url, data = {}, headers = {
  "Content-Type": "multipart/form-data"
}) {
  return new Promise((resolve, reject) => {
    http
      .post(url, data, {
        headers: headers
      })
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        reject(err.data);
      });
  });
}


// delete请求
export function jsonDataDelete(url, params) {
  const data = qs.stringify(params, {
    arrayFormat: 'comma'
  })
  return new Promise((resolve, reject) => {
    http
      .delete(url, {
        params: qs.parse(data)
      }, {
        headers: {
          "content-type": "application/json"
        }
      })
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        reject(err.data);
      });
  });
}

export function dataDelete(url, data, headers = {
  "content-type": "application/x-www-form-urlencoded"
}) {
  return new Promise((resolve, reject) => {
    http
      .delete(url, {
        params: data
      }, {
        headers: headers
      })
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        reject(err);
      });
  });
}

// rest风格get请求
export function restGet(url, params = {}, headers = {
  "content-type": "application/x-www-form-urlencoded"
}) {
  return new Promise((resolve, reject) => {
    http
      .get(url + params, {}, {
        headers: headers
      })
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        reject(err);
      });
  });
}

// put请求
export function put(url, params = {}, headers = {
  "content-type": "application/x-www-form-urlencoded"
}) {
  let abort;
  let request = new Promise((resolve, reject) => {
    http
      .put(url, qs.stringify(params), {
        headers: headers
      })
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        reject(err);
      });

    abort = reject;
  });

  request.abort = abort;
  return request;
}

// 导出Excel文件
export function downloadExcel(apiUrl, params, fileName) {
  http.get(apiUrl, {
        params: params,
        responseType: 'blob'
      },
    )
    .then((res) => {
      const {
        data,
        headers
      } = res
      const fileName = headers['content-disposition'].replace(/\w+;filename=(.*)/, '$1')
      // 此处当返回json文件时需要先对data进行JSON.stringify处理，其他类型文件不用做处理
      //const blob = new Blob([JSON.stringify(data)], ...)
      const blob = new Blob([data], 
        {
          type: headers['content-type']
        }
      )
      let dom = document.createElement('a')
      let url = window.URL.createObjectURL(blob)
      dom.href = url
      dom.download = decodeURI(fileName)
      dom.style.display = 'none'
      document.body.appendChild(dom)
      dom.click()
      dom.parentNode.removeChild(dom)
      window.URL.revokeObjectURL(url)
    }).catch((err) => {})
}
