import request from '@/utils/request2'
// 模版列表
export function guziGetVideoModelList(params) {
  return request({
    url: `/cloud/guzi-content/admin/prompt/list`,
    method: 'GET',
    params
  })
}

// 模版标签
export function guziGetTagList() {
  return request({
    url: '/cloud/guzi-content/admin/template/tags',
    method: 'get'
  })
}

// 分页查询
export function guziModelList(params) {
  return request({
    url: '/cloud/guzi-content/admin/template/page',
    method: 'get',
    params
  })
}

// 删除模版
export function deleTemplate(params) {
  return request({
    url: '/cloud/guzi-content/admin/template',
    method: 'DELETE',
    params
  })
}
// 修改模版
export function updateTemplate(data) {
  return request({
    url: '/cloud/guzi-content/admin/template',
    method: 'PUT',
    data
  })
}

// 增加模版
export function addTemplate(data) {
  return request({
    url: '/cloud/guzi-content/admin/template',
    method: 'post',
    data
  })
}

// 修改状态
export function statusTemplate(templateId, isOnline) {
  return request({
    url: `/cloud/guzi-content/admin/template/online?templateId=${templateId}&isOnline=${isOnline}`,
    method: 'put'
  })
}
