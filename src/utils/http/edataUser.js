import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
import { filterNull } from '@/utils/index'
import { MessageBox } from 'element-ui'
import router from '@/router'
const version = require('../../../public/version.json')
const service = axios.create({
  baseURL: 'newApi/cloud/edata-user'
})

service.interceptors.request.use(
  (config) => {
    if (getToken()) {
      config.headers['Authorization'] = getToken()
      config.headers['versionCode'] = version.version
    }
    return config
  },
  (error) => {
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  (response) => {
    const res = response.data
    if (res.code !== 1) {
      console.log(res.code, typeof res.code, res.code === 2001)
      if (res.code === 2002 || res.code === 2001 || res.code === 2003) {
        return store.dispatch('user/resetToken').then(() => {
          location.reload()
        })
      }
      if ([7003].includes(res.code)) {
        return Promise.reject()
      }
      if ([7005].includes(res.code)) {
        return Promise.reject(res)
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
