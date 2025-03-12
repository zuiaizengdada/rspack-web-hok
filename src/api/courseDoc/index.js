import request from '@/utils/request2'

/* 产品中心 */

// 文件夹目录列表
export function catalogPage(params) {
  return request({
    url: '/cloud/product/catalog/list',
    method: 'GET',
    params
  })
}

// 目录id展开下级目录
export function catalogIDPage(params) {
  return request({
    url: `/cloud/product/catalog/list/${params}`,
    method: 'GET'
  })
}

// 新增目录
export function addCatalog(data) {
  return request({
    url: '/cloud/product/catalog',
    method: 'POST',
    data
  })
}

// 修改目录
export function editCatalog(data) {
  return request({
    url: '/cloud/product/catalog',
    method: 'PUT',
    data
  })
}

// 删除目录
export function delCatalog(params) {
  return request({
    url: `/cloud/product/catalog/${params}`,
    method: 'DELETE'
  })
}

// 选中目录详情
export function detailCatalog(params) {
  return request({
    url: `/cloud/product/catalog/detail/${params}`,
    method: 'GET'
  })
}

// 文件列表
export function documentPage(params) {
  return request({
    url: '/cloud/product/document/page',
    method: 'GET',
    params
  })
}
// 上传素材
export function uploadDocument(data) {
  return request({
    url: '/cloud/product/document',
    method: 'POST',
    data
  })
}
// 覆盖
export function coverDocument(data) {
  return request({
    url: '/cloud/product/document/cover',
    method: 'PUT',
    data
  })
}
// 公开状态切换
export function statusDocument(data) {
  return request({
    url: '/cloud/product/document/status',
    method: 'PUT',
    data
  })
}
// 更改名称
export function updateDocument(data) {
  return request({
    url: '/cloud/product/document/update',
    method: 'PUT',
    data
  })
}
// 删除
export function delDocument(data) {
  return request({
    url: '/cloud/product/document/batch',
    method: 'DELETE',
    data
  })
}
// 复制
export function copyDocument(data) {
  return request({
    url: '/cloud/product/document/batch/copy',
    method: 'PUT',
    data
  })
}
// 移动
export function moveDocument(data) {
  return request({
    url: '/cloud/product/document/batch/move',
    method: 'PUT',
    data
  })
}
// 查询选中数据是否被引用接口
export function batchList(data) {
  return request({
    url: '/cloud/product/document/list/batch',
    method: 'POST',
    data
  })
}

/* 回收站 */

// 回收站分页查询
export function recyclePage(params) {
  return request({
    url: '/cloud/product/recycle/bin/page',
    method: 'GET',
    params
  })
}

// 根据文件ID查询目录是否存在
export function recycleQueryDocId(params) {
  return request({
    url: '/cloud/product/recycle/bin/catalog/docid',
    method: 'GET',
    params
  })
}

// 单个还原记录
export function recycleReduction(data) {
  return request({
    url: '/cloud/product/recycle/bin/reduction',
    method: 'POST',
    data
  })
}

// 批量还原记录
export function recycleReductions(data) {
  const params = data.catalogId !== '' ? `?catalogId=${data.catalogId}` : ''
  const url = '/cloud/product/recycle/bin/batch/reduction' + params
  return request({
    url,
    method: 'POST',
    data: data.ids
  })
}

// 单个彻底删除
export function recycleDel(data) {
  return request({
    url: '/cloud/product/recycle/bin/completely/delete',
    method: 'POST',
    data
  })
}

// 批量彻底删除
export function recycleDels(data) {
  return request({
    url: '/cloud/product/recycle/bin/completely/batch/delete',
    method: 'POST',
    data
  })
}

// 查询课程文件列表-素材中心调用
export function documentMaterialPage(params) {
  return request({
    url: '/cloud/product/document/page/material',
    method: 'GET',
    params
  })
}

// 查询列表(引用查询)
export function quotePage(data) {
  return request({
    url: '/cloud/product/document/list/quote',
    method: 'POST',
    data
  })
}

// 校验文件是否已经存在接口
export function checkFile(params) {
  return request({
    url: '/cloud/product/document/detail/name',
    method: 'GET',
    params
  })
}
