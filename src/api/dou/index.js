import request from '@/utils/request'
import request2 from '@/utils/request2'

export function douClassSubmit(data) {
  return request({
    url: '/dou-class-submit-record',
    method: 'post',
    data
  })
}

export function douRecordPage(params) {
  return request({
    url: '/dou-class-submit-record/page',
    method: 'get',
    params
  })
}

export function douResult(goodsId) {
  return request({
    url: `/dou-class-submit-record/result/${goodsId}`,
    method: 'get'
  })
}

export function lastSubmitLog(goodsId) {
  return request({
    url: `/dou-class-submit-record/lastSubmitLog/${goodsId}`,
    method: 'get'
  })
}

export function getClassOneSelectData() {
  return request2({
    url: `/cloud/admin/dou/first/class/config`,
    method: 'get'
  })
}

export function getClassTwoSelectData(id) {
  return request2({
    url: `/cloud/admin/dou/second/class/config?pid=${id}`,
    method: 'get'
  })
}
