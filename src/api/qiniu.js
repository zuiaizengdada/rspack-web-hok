import request from '@/utils/request'
import request2 from '@/utils/request2'

export function getToken() {
  return request({
    url: '/qiniu/upload/token', // 假地址 自行替换
    method: 'get'
  })
}

export function getOssToken() {
  return request2({
    url: 'cloud/file/upload/file/ossConfig',
    method: 'get'
  })
}
