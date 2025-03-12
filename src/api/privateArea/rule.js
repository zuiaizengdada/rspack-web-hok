import request from '@/utils/request2'

// 获取规则
export function getRulePage(data) {
  return request({
    url: '/cloud/edata-tag/rule/getRulePage',
    method: 'post',
    data
  })
}

// 获取规则详情
export function getDetail(params) {
  return request({
    url: '/cloud/edata-tag/rule/getDetail',
    method: 'get',
    params
  })
}

// 获取规则类型
export function getRuleType(params) {
  return request({
    url: '/cloud/edata-tag/ruleConfig/getRuleType',
    method: 'get',
    params
  })
}
// 获取规则类型
export function getRuleConditionType(data) {
  return request({
    url: '/cloud/edata-tag/ruleConfig/getRuleConditionType',
    method: 'post',
    data
  })
}

// 获取条件操作符号
export function getConditionOperatorSymbol(data) {
  return request({
    url: '/cloud/edata-tag/ruleConfig/getConditionOperatorSymbol',
    method: 'post',
    data
  })
}

// 获取标签
export function getRuleTagType(data) {
  return request({
    url: '/cloud/edata-tag/ruleConfig/getRuleTagType',
    method: 'post',
    data
  })
}

// 保存规则
export function ruleSave(data) {
  return request({
    url: '/cloud/edata-tag/rule/save',
    method: 'post',
    data
  })
}

// 删除规则
export function ruleDelete(params) {
  return request({
    url: '/cloud/edata-tag/rule/delete',
    method: 'get',
    params
  })
}

// 删除规则
export function getRoleLog(data) {
  return request({
    url: '/cloud/edata-tag/rule/getRoleLog',
    method: 'post',
    data
  })
}
