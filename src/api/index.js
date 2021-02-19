import axios from 'axios'
import qs from 'qs'
import store from '@/store'
import router from '@/router'
import Vue from 'vue'
import { Message } from 'element-ui' // 引用element-ui的加载和消息提示组件
import md5 from 'js-md5';

import config from '@/config'
let { APPKEY, APPSECERT } = config

let isRefreshing = false //是否正在刷新token
let requests = [] // 存储待重发请求的数组

const $axios = axios.create({
  // 设置超时时间
  timeout: 60000,
  // 基础url，会在请求url中自动添加前置链接 process.env.VUE_APP_AXIOS_API
  baseURL: process.env.VUE_APP_AXIOS_API,
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  responseEncoding: 'utf8',
  AcceptEncoding: 'gzip, deflate'
})



Vue.prototype.$http = axios // 并发请求
// 在全局请求和响应拦截器中添加请求状态

// 请求拦截器
$axios.interceptors.request.use(
  config => {
    // 固定参数
    let timestamp = Date.parse(new Date()) / 1000;
    let sign = md5(APPKEY + APPSECERT + timestamp);
    let { url, needToken, api } = config.headers

    //追加url参数
    let _params = {}
    _params[`${api}/${url}`] = ""
    config.params = Object.assign(_params, config.params)

    // 所有GET请求
    if (config.method == 'get') {
      let required = {}
      required.timestamp = timestamp    //时间戳
      required.sign = sign
      config.params = Object.assign(config.params, required)
      //token 最后在添加 assign会取第二个对象的值覆盖与第一个对象key相同的值，否则会导致仍然是未刷新的token
      if (needToken) {
        config.params.token = store.getters.token
      }
    }


    else if (config.method == 'post' && !config.headers.upload) {
      let data = config.data
      if(config.headers.fb){
        data = qs.parse(data)
      }
      data.timestamp = timestamp
      data.sign = sign
      if (needToken) {
        data.token = store.getters.token
      }
      //上传文件接口 不知道为什么file文件被过滤了 用formdata传递
      if(url=="uploadFile"){
        config.data = file(data)
      }else{
        config.data = qs.stringify(data)
      }
    }
    // console.log(config);
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

function file(data){
  let fromData = new FormData()
  for (const key in data) {
    const element = data[key];
    fromData.append(key, element)
  }
  return fromData
}
// 响应拦截器
$axios.interceptors.response.use(
  response => {
    const status = response.status
    if ((status >= 200 && status < 300) || status === 304) {
      /**
       * code说明
       * 0 成功
       * -1003 token不匹配
       * -1004 token已过期
       * <0 失败 可能返回msg错误信息
       */
      switch (response.data.code) {
        case 0:
          return Promise.resolve(response.data)
          break;
        case -1003:
          store.dispatch('user/_loginOut')
          break;
        case -1004: 
          if (response.config.headers.url != 'refreshToken') {
            if (!isRefreshing) {
              isRefreshing = true
              return refreshToken().then(res => {

                isRefreshing = false
                store.dispatch('user/_refresh', res.data)
                //执行所有等待的请求
                requests.map(fb => fb())
                //置空
                requests = []
                response.config.headers.fb = true
                return $axios(response.config)
              }).catch(err => {
                store.dispatch('user/_loginOut')
              })
            } else {
              return new Promise(resolve => {
                requests.push(() => {
                  resolve($axios(response.config))
                })
              })
            }

          } else {
            store.dispatch('user/_loginOut')
          }
          break;
        default:
          if (response.data.msg) {
            Message.error(response.data.msg)
          }
          return Promise.resolve(response.data)
      }
    } else {
      return Promise.reject(response)
    }
  },
  error => {
    console.log(error);
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // 返回401 清除token信息并跳转到登陆页面
          store.dispatch('user/_loginOut')
          router.replace({
            path: '/login',
            query: {
              redirect: router.currentRoute.fullPath
            }
          })
          break
        case 404:
          Message.error('网络请求不存在-404')
          break
        default:
          Message.error(error.response.data.msg)
      }
    } else {
      // 请求超时或者网络有问题
      if (error.message.includes('timeout')) {
        Message.error('请求超时！请检查网络是否正常')
      } else {
        Message.error('请求失败，请检查请求是否正确')
      }
    } 
    return Promise.reject(error)
  }
)
/**
 * 刷新token
 */
function refreshToken() {
  let refresh_token = localStorage.getItem('refresh_token')
  return get('refreshToken', { refresh_token }, "gm")
}

function post(url, data, api = 'gm') {
  // console.log(url,api);
  let needToken = true
  if (url == 'login' || url == 'refreshToken') {
    needToken = false
  }
  return $axios({
    method: 'post',
    data,
    headers: {
      needToken, url, api
    }
  })
}

function get(url, params = {}, api = 'gm') {
  let needToken = true
  if (url == 'login' || url == 'refreshToken') {
    needToken = false
  }
  return $axios({
    method: 'get',
    params,
    headers: { needToken, url, api },
    processData: false,// 告诉axios不要去处理发送的数据(重要参数)
    contentType: false
  })
}
// get，post请求方法
export default {
  post, get
}
