import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
import { filterNull } from '@/utils/index'
import { MessageBox } from 'element-ui'
import router from '@/router'
const version = require('../../public/version.json')
// const ifNoToken = false
// create an axios instance
const service = axios.create({
  baseURL: '/api' // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  // timeout: 20000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  (config) => {
    // do something before request is sent
    if (getToken()) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['Authorization'] = getToken()
      config.headers['versionCode'] = version.version
    }
    return config
  },
  (error) => {
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
  (response) => {
    const res = response.data
    // if the custom code is not 20000, it is judged as an error.
    if (res.code !== 1) {
      console.log(res.code, typeof res.code, res.code === 2001)
      if (res.code === 2002 || res.code === 2001 || res.code === 2003) {
        return store.dispatch('user/resetToken').then(() => {
          location.reload()
        })
      }
      if (res.code === 7003) {
        return Promise.reject()
      }
      if (res.code === 707100 || res.code === 707101 || res.code === 707102) {
        return res
      }
      if (res.code >= 6000 && res.code < 7000) {
        return MessageBox.confirm(res.error || res.message || res.msg, '提示', {
          confirmButtonText: '我知道了',
          showCancelButton: false,
          type: 'warning'
        }).then(() => {
          // location.reload()
          router.replace({
            path: '/refresh' + window.location.href.split('#')[1]
          })
        })
      }
      Message({
        message: res.msg || 'Error',
        type: 'error',
        duration: 5 * 1000
      })
      return Promise.reject(new Error(res.msg || 'Error'))
    } else {
      if (res.records) {
        res.records = filterNull(res.records)
      }
      if (res.data && Object.prototype.toString.call(res.data) === '[object Object]') {
        res.data = filterNull(res.data)
      }
      return res
    }
  },
  (error) => {
    if (error.message && error.message === 'cancel') {
      return Promise.reject(error)
    }
    console.log('err' + error) // for debug
    if (error.response) {
      const { status, data } = error.response
      if (status !== 200) {
        Message({
          message: data.msg || data.message || '系统错误',
          type: 'error',
          duration: 5 * 1000
        })
      } else {
        Message({
          message: error.msg || '系统错误',
          type: 'error',
          duration: 5 * 1000
        })
      }
    } else {
      Message({
        message: '网络错误',
        type: 'error',
        duration: 5 * 1000
      })
    }
    return Promise.reject(error)
  }
)

export default service
