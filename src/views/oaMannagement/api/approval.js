import request from '@/utils/request2'
const baseOaUrl = '/cloud/edata-oa'
// 查询审批模版列表
export function templateList(data) {
  return request({
    url: baseOaUrl + '/approval/template/pageList',
    method: 'POST',
    data
  })
}

// 锁定编辑模版
export function templateLock(data) {
  return request({
    url: baseOaUrl + '/approval/template/lock',
    method: 'POST',
    data
  })
}

// 查询审批模版详情
export function templateDetail(id) {
  return request({
    url: baseOaUrl + `/approval/template/detail?approvalTemplateId=${id}`,
    method: 'get'
  })
}

// 修改节点信息
export function updateNode(data) {
  return request({
    url: baseOaUrl + '/approval/template/updateNode',
    method: 'POST',
    data
  })
}
// 修改模板基础数据
export function updateBasicData(data) {
  return request({
    url: baseOaUrl + '/approval/template/updateBasicData',
    method: 'POST',
    data
  })
}

// 锁定编辑模版
export function lockTemplate(id) {
  return request({
    url: baseOaUrl + `/approval/template/lock?approvalTemplateId=${id}`,
    method: 'get'
  })
}

// 解锁编辑模版
export function unLockTemplate(id) {
  return request({
    url: baseOaUrl + `/approval/template/unLock?approvalTemplateId=${id}`,
    method: 'get'
  })
}
