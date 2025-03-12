import request from '@/utils/request2'

// 查询个人工具箱
export function getPersonalKit(params) {
  return request({
    url: '/cloud/edata-sale/ibox/get',
    method: 'GET',
    params
  })
}

// 修改个人工具箱
export function setPersonalKit(data) {
  return request({
    url: '/cloud/edata-sale/ibox/save',
    method: 'POST',
    data
  })
}

// 个人工具箱-个人标签
export function getHistoryPersonTag(params) {
  return request({
    url: '/cloud/edata-sale/ibox/historyPersonTag/get',
    method: 'GET',
    params
  })
}
