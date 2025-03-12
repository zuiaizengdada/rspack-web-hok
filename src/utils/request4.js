
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
import { MessageBox } from 'element-ui'
import router from '@/router'
const version = require('../../public/version.json')
const service = axios.create({
  baseURL: '/newApi' // url = base url + request url
})
// 接口白名单: 未带token不跳转登录页
const whiteList = [
  '/newApi/cloud/edata-user/organization/getOrganizationAppId',
  '/newApi/cloud/edata-user/organization/getUserOrganizationListUsing',
  '/newApi/cloud/edata-user/sysUser/sendPhoneCode',
  '/newApi/cloud/edata-user/sysUser/checkPhoneCode',
  '/newApi/cloud/edata-user/feishu/saveBindUser',
  '/newApi/cloud/edata-user/organization/getOrganizationIdByAppId',
  '/cloud/edata-user/enterprise/wechat/getOrganizationWechatAgentId',
  '/newApi/cloud/edata-user/feishu/getUserAccountList',
  '/newApi/cloud/hok-assistant/assistant/sharing',
  '/newApi/cloud/hok-assistant/my/assistant/use',
  '/newApi/cloud/edata-clue/cyxTest/post_test'
]

service.interceptors.request.use(
  (config) => {
    if (getToken()) {
      config.headers['Authorization'] = getToken()
      config.headers['versionCode'] = version.version
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

service.interceptors.response.use(
  (response) => {
    const res = response.data
    if (res.code !== 1 && res.code !== 60002) {
      if (res.code === 2002 || res.code === 2001 || res.code === 2003) {
        console.log(response, 'response+++++++++++')
        if (!whiteList.includes(response.config.url)) {
          return store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        }
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
      if (res.code === 707100 || res.code === 707101) {
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
        const fileName = '订单补齐' + Date.now() + '.xls'
        const fileBytes = res
        const url = window.URL.createObjectURL(new Blob([fileBytes], { type: 'application/vnd.ms-excel;charset=utf-8' }))
        const link = document.createElement('a')
        link.style.display = 'none'
        link.href = url
        link.setAttribute('download', fileName)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)
        res.code = 1
        return res
      }
      return Promise.reject(res)
    } else {
      return res
    }
  },
  (error) => {
    if (error.message && error.message === 'cancel') {
      return Promise.reject(error)
    }
    return Promise.reject(error)
  }
)

const http = (options, throwError, throwCode) => {
  return new Promise((resolve, reject) => {
    service({ ...options }).then(res => {
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
        if (res.code === 707100 || res.code === 707101) {
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
        !throwError && Message({
          message: res.message || res.msg || 'Error',
          type: 'error',
          customClass: 'amap-sug-result',
          duration: 5 * 1000
        })
        console.log('1`11111')
        return reject(new Error(res.message || res.msg || 'Error'))
      } else {
        return resolve(res)
      }
    }).catch((err) => {
      if (throwCode) {
        return reject(err)
      } else {
        const error = err.message || err.msg || 'Error'
        console.log(error, 'error123123123', throwCode)
        if (error.response) {
          const { status, data } = error.response
          if (status !== 200) {
            !throwError && Message({
              message: data.msg || data.message || '系统错误',
              type: 'error',
              customClass: 'amap-sug-result',
              duration: 5 * 1000
            })
            return reject(data.msg || data.message || '系统错误')
          } else {
            !throwError && Message({
              message: error.msg || '系统错误',
              type: 'error',
              customClass: 'amap-sug-result',
              duration: 5 * 1000
            })
            return reject(error.msg || '系统错误')
          }
        } else {
          console.log(typeof error)
          !throwError && Message({
            message: typeof error === 'object' ? '网络错误' : error,
            type: 'error',
            customClass: 'amap-sug-result',
            duration: 5 * 1000
          })
          return reject(typeof error === 'object' ? '网络错误' : error)
        }
      }
    })
  })
}
export default http
