
/**
 * 6*** 6开头标识资源不存在，
 * 6003 视频分组id不存在
 * 401 没有权限
 * 2002 2001 2003 登录过期，未登录
 * 1001 版本冲突
 */
import axios from 'axios'
// import {
//   filterNull
// } from '@/utils/index'
// const ifNoToken = false
// create an axios instance
const service = axios.create({
  // withCredentials: true, // send cookies when cross-domain requests
  // timeout: 20000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  (config) => {
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
    return response.data
  },
  (error) => {
    return Promise.reject(error)
  }
)

export default service
