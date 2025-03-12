import request from '@/utils/request2'

// 查询版本记录列表
export function getFxyVersionList(params) {
  return request({
    url: '/cloud/edata-wemedia/yixiaoer/version/getList',
    method: 'get',
    params
  })
}

// 根据版本号查询版本信息
export function getByVersion(params) {
  return request({
    url: '/cloud/edata-wemedia/open/getByVersion',
    method: 'get',
    params
  })
}

// 添加版本记录
export function fxyVersionAdd(data) {
  return request({
    url: '/cloud/edata-wemedia/yixiaoer/version/add',
    method: 'post',
    data
  })
}

// 修改版本记录
export function fxyVersionEdit(data) {
  return request({
    url: '/cloud/edata-wemedia/yixiaoer/version/edit',
    method: 'post',
    data
  })
}
