import request from '@/utils/request2'

// 查询模板提示词管理列表
export function queryTemplateList(params) {
  return request({
    url: '/cloud/hok-assistant/ai-hint-language_template/page',
    method: 'GET',
    params
  })
}

// 修改模板提示词管理列表
export function updateTemplateList(data) {
  return request({
    url: '/cloud/hok-assistant/ai-hint-language_template/update',
    method: 'PUT',
    data
  })
}

// 删除模板提示词管理列表
export function deleteTemplateList(params) {
  return request({
    url: '/cloud/hok-assistant/ai-hint-language_template/delete',
    method: 'DELETE',
    params
  })
}

// 新增模板提示词管理列表
export function addTemplateList(data) {
  return request({
    url: '/cloud/hok-assistant/ai-hint-language_template/create',
    method: 'POST',
    data
  })
}

// 根据ID查询模板提示词管理列表
export function queryTemplateListById(params, type) {
  return request({
    url: `/cloud/hok-assistant/ai-hint-language_template/get-${type}`,
    method: 'GET',
    params
  })
}

// 根据用户Id和模版标题获得AI提示语模版详细
export function queryTemplateDetailByTitleAndId(params) {
  return request({
    url: '/cloud/hok-assistant/ai-hint-language_template/get-by-user-id-and-template-title',
    method: 'GET',
    params
  })
}

// 新增模板提示词分类管理列表
export function addTemplateCategoryList(params) {
  return request({
    url: '/cloud/hok-assistant/ai-hint-language_template-classify/create',
    method: 'POST',
    params
  })
}

// 修改模板提示词分类管理列表
export function updateTemplateCategoryList(params) {
  return request({
    url: `/cloud/hok-assistant/ai-hint-language_template-classify/update/${params.id}`,
    method: 'PUT',
    params
  })
}

// 删除模板提示词分类管理列表
export function deleteTemplateCategoryList(params) {
  return request({
    url: '/cloud/hok-assistant/ai-hint-language_template-classify/delete',
    method: 'DELETE',
    params
  })
}

// 查询模板提示词分类管理列表
export function queryTemplateCategoryList(params) {
  return request({
    url: '/cloud/hok-assistant/ai-hint-language_template-classify/page',
    method: 'GET',
    params
  })
}

// 根据ID查询模板提示词分类管理列表
export function queryTemplateCategoryListById(params) {
  return request({
    url: '/cloud/hok-assistant/ai-hint-language_template-classify/get',
    method: 'GET',
    params
  })
}

// 根据提示语模版分类名称获得AI提示语模版分类详细
export function queryTemplateCategoryDetailByName(params) {
  return request({
    url: '/cloud/hok-assistant/ai-hint-language_template-classify/get-by-classify-name',
    method: 'GET',
    params
  })
}

// 点赞/取消点赞
export function templateLike(params) {
  return request({
    url: '/cloud/hok-assistant/ai-hint-language_template/like',
    method: 'PUT',
    params
  })
}

// 收藏/取消收藏
export function templateCollection(params) {
  return request({
    url: '/cloud/hok-assistant/ai-hint-language_template/collection',
    method: 'PUT',
    params
  })
}
