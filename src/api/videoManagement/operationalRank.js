import request from '@/utils/request2'

// 获取账号排名列表
export function getPublishAccountList(params) {
  return request({
    url: '/cloud/edata-wemedia/operate/ranking/getPublishAccountList',
    method: 'get',
    params
  })
}

// 获取作品排名列表
export function getPublishWorkList(params) {
  return request({
    url: '/cloud/edata-wemedia/operate/ranking/getPublishWorkList',
    method: 'get',
    params
  })
}

// 导出作品排名列表
export function exportPublishWorkList(params) {
  return request({
    url: '/cloud/edata-wemedia/operate/ranking/exportPublishWorkList',
    method: 'get',
    params,
    responseType: 'blob'
  })
}

// 导出账号排名列表
export function exportPublishAccountList(params) {
  return request({
    url: '/cloud/edata-wemedia/operate/ranking/exportPublishAccountList',
    method: 'get',
    params,
    responseType: 'blob'
  })
}
