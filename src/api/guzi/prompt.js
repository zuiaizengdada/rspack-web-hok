import request from '@/utils/request2'

// 提示词
// 提示词列表
export function guziPromptGetApi(params) {
  return request({
    url: `/cloud/guzi-content/admin/prompt/list`,
    method: 'GET',
    params
  })
}

// 添加提示词
export function guziPromptAddApi(data) {
  return request({
    url: '/cloud/guzi-content/admin/prompt/add',
    method: 'POST',
    data
  })
}
// 修改提示词
export function guziPromptPutApi(data) {
  return request({
    url: '/cloud/guzi-content/admin/prompt/update',
    method: 'PUT',
    data
  })
}
// 删除提示词
export function guziPromptDelApi(params) {
  return request({
    url: '/cloud/guzi-content/admin/prompt/remove',
    method: 'DELETE',
    params
  })
}
// 查询详情
export function guziPromptDetailApi(params) {
  return request({
    url: `cloud/guzi-content/admin/prompt/${params.id}`,
    method: 'GET'
  })
}
