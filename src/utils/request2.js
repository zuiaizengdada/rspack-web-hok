/**
 * 6*** 6开头标识资源不存在，
 * 6003 视频分组id不存在
 * 401 没有权限
 * 2002 2001 2003 登录过期，未登录
 * 1001 版本冲突
 */
import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
// import delModel from '@/components/delModal/index.js'
import { MessageBox } from 'element-ui'
import router from '@/router'
// import {
//   filterNull
// } from '@/utils/index'
const version = require('../../public/version.json')
// const ifNoToken = false
// create an axios instance
const service = axios.create({
  baseURL: '/newApi' // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  // timeout: 20000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent
    if (getToken()) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['Authorization'] = getToken()
      config.headers['versionCode'] = version.version
    }
    console.log('service.interceptors.request.use----', config)
    // config.timeout = config.timeout || 10000
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data
    // if the custom code is not 20000, it is judged as an error.
    if (res.code !== 1 && res.code !== 60002) {
      if (res.code === 2002 || res.code === 2001 || res.code === 2003) {
        return store.dispatch('user/resetToken').then(() => {
          location.reload()
        })
      }
      /** 业务逻辑6003视频id不存在需要返回到列表页面 */
      if (res.code === 6003) {
        MessageBox.confirm(res.error || res.message, '提示', {
          confirmButtonText: '我知道了',
          showCancelButton: false,
          type: 'warning',
          showClose: false,
          closeOnClickModal: false,
          closeOnPressEscape: false
        }).then(() => {
          // location.reload()
          router.replace({
            path: '/videoManagement/desensitized?tab=1'
          })
        })
        return Promise.reject()
      }
      if (res.code === 7003) {
        return Promise.reject()
      }
      // oa异常报错显示弹窗
      if (
        /edata-oa/.test(response.config?.url) &&
        [5113, 5145].includes(res.code)
      ) {
        return res
      }
      if (res.code === 707100 || res.code === 707101 || res.code === 707102) {
        return res
      }
      if ((res.code >= 6000 && res.code < 7000) || res.code === 1001) {
        MessageBox.confirm(res.error || res.message, '提示', {
          confirmButtonText: '我知道了',
          showCancelButton: false,
          type: 'warning'
        }).then(() => {
          // location.reload()
          router.replace({
            path: '/refresh' + window.location.href.split('#')[1]
          })
        })
        return Promise.reject()
      }
      // 返回文件流直接处理
      if (response.config && response.config.responseType === 'blob') {
        return res
      }
      Message({
        message: res.message || res.msg || 'Error',
        type: 'error',
        customClass: 'amap-sug-result',
        duration: 5 * 1000
      })
      return Promise.reject(new Error(res.message || res.msg || 'Error'))
    } else {
      return res
    }
  },
  error => {
    if (error.message && error.message === 'cancel') {
      return Promise.reject(error)
    }
    // console.log('err' + error) // for debug\
    // console.log(error.response)
    if (error.response) {
      const { status, data } = error.response
      if (status !== 200) {
        Message({
          message: data.msg || data.message || '系统错误',
          type: 'error',
          customClass: 'amap-sug-result',
          duration: 5 * 1000
        })
      } else {
        Message({
          message: error.msg || '系统错误',
          type: 'error',
          customClass: 'amap-sug-result',
          duration: 5 * 1000
        })
      }
    } else {
      Message({
        message: '网络错误',
        type: 'error',
        customClass: 'amap-sug-result',
        duration: 5 * 1000
      })
    }
    return Promise.reject(error)
  }
)

export default service
