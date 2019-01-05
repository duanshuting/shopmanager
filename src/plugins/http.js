// 发送请求

import axios from 'axios'
const Http = {}
Http.install = function (Vue) {
  axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'

  // 在请求发起之前 -> 请求拦截器
  axios.interceptors.request.use(function (config) {
    // console.log(config);

    // 设置头部
    if (config.url !== "login") {
      const AUTH_TOKEN = localStorage.getItem("token");
      // this.$http.defaults.headers.common['Authorization'] = AUTH_TOKEN;
      config.headers.Authorization = AUTH_TOKEN;
    }

    // 在发送请求之前做些什么
    return config;
  }, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  });

  // 4. 添加实例方法
  Vue.prototype.$http = axios
}

export default Http
