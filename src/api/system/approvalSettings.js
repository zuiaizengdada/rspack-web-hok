import request from '@/utils/request2'

// 账号审批设置列表
export function getExamineSetUpList(params) {
  return request({
    url: '/cloud/edata-wemedia/account/examine/ExamineSetUpList',
    method: 'post',
    params
  })
}

// 脱敏审批设置列表
export function getDesensitizedExamineSetUpList(params) {
  return request({
    url: '/cloud/product/desensitized/examine/ExamineSetUpList',
    method: 'post',
    params
  })
}

// 添加账号审批设置
export function addExamineAccount(data) {
  return request({
    url: '/cloud/edata-wemedia/account/examine/add',
    method: 'post',
    data
  })
}

// 添加脱敏审批设置
export function addDesensitizedExamineAccount(data) {
  return request({
    url: '/cloud/product/desensitized/examine/add',
    method: 'post',
    data
  })
}

// 删除账号审批设置
export function deleteExamineAccount(data) {
  return request({
    url: '/cloud/edata-wemedia/account/examine/delete',
    method: 'post',
    data
  })
}

// 删除脱敏审批设置
export function deleteDesensitizedExamineAccount(data) {
  return request({
    url: '/cloud/product/desensitized/examine/delete',
    method: 'post',
    data
  })
}

// 修改账号审批设置
export function editExamineAccount(data) {
  return request({
    url: '/cloud/edata-wemedia/account/examine/edit',
    method: 'post',
    data
  })
}

// 修改脱敏审批设置
export function editDesensitizedExamineAccount(data) {
  return request({
    url: '/cloud/product/desensitized/examine/edit',
    method: 'post',
    data
  })
}

// 修改账号审批设置发送飞书状态
export function editStatus(data) {
  return request({
    url: '/cloud/edata-wemedia/account/examine/editStatus',
    method: 'post',
    data
  })
}

// 修改脱敏审批设置发送飞书状态
export function editDesensitizedStatus(data) {
  return request({
    url: '/cloud/product/desensitized/examine/editStatus',
    method: 'post',
    data
  })
}

// 获取复审设置列表
export function reexaminationList(data) {
  return request({
    url: '/cloud/edata-wemedia/account/examine/reexaminationList',
    method: 'post',
    data
  })
}

// 新增或修改复审设置
export function addOrUpdateReexamination(data) {
  return request({
    url: '/cloud/edata-wemedia/account/examine/addOrUpdateReexamination',
    method: 'post',
    data
  })
}
