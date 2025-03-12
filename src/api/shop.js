/** 我的店铺 */
import request from '@/utils/request'
import request1 from '@/utils/request2'

/** 商品分类*/
// 查询列表
export function getCatalogueList(params) {
  return request({
    url: '/catalogue/list',
    method: 'get',
    params
  })
}
// 新增
export function addCatalogue(data) {
  return request({
    url: '/catalogue',
    method: 'POST',
    data
  })
}
// 批量删除
export function removeBatch(data) {
  return request({
    url: '/goods/grouping/remove/batch',
    method: 'POST',
    data
  })
}

// 排序
export function updateSortBatch(data) {
  return request1({
    url: '/cloud/admin/grouping/update/sort/batch',
    method: 'POST',
    data
  })
}
// 二级分组排序
export function updateCatalogueSort(data) {
  return request1({
    url: '/cloud/admin/catalogue/update/batch',
    method: 'POST',
    data
  })
}
// 删除
export function delCatalogue(params) {
  return request({
    url: `/catalogue/delete/${params}`,
    method: 'POST'
  })
}
// 修改
export function updateCatalogue(data) {
  return request({
    url: '/catalogue/update',
    method: 'POST',
    data
  })
}

/** 讲师管理 */
// 新增讲师
export function addTeacher(data) {
  return request({
    url: '/lecturer',
    method: 'POST',
    data
  })
}

// 讲师查询(未分页)
export function getTeacherList(params) {
  return request({
    url: '/lecturer/list',
    method: 'get',
    params
  })
}

// 分页查询
export function getTeacherPage(params) {
  return request({
    url: '/lecturer/page',
    method: 'get',
    params
  })
}

// 删除讲师
export function delTeacher(lecturerId) {
  return request({
    url: `/lecturer/delete/${lecturerId}`,
    method: 'DELETE'
  })
}

// 修改讲师
export function editTeacher(data) {
  return request({
    url: '/lecturer',
    method: 'PUT',
    data
  })
}

// 查询所有已关联师资中心的讲师
export function seeRelationAllTeacher() {
  return request({
    url: '/lecturer/teacher/list',
    method: 'GET'
  })
}
// 分组下的商品
// 分页查询
export function goodsGroupingPage(params) {
  return request({
    url: '/goods/grouping/page',
    method: 'GET',
    params
  })
}

// 获取水印配置
export function getWatermarkConfig(params) {
  return request1({
    url: '/cloud/admin/watermark/config',
    method: 'GET',
    params
  })
}
// 设置水印配置
export function setWatermarkConfig(data) {
  return request1({
    url: '/cloud/admin/watermark/config/set',
    method: 'POST',
    data
  })
}
// 移出分组
export function delGoodsGrouping(groupingId) {
  return request({
    url: `/goods/grouping/remove/${groupingId}`,
    method: 'post'
  })
}
// 排序
export function sortgoods(data) {
  return request({
    url: '/goods/grouping/sort',
    method: 'post',
    data
  })
}

// banner
// 查询
export function getBannerList(params) {
  return request({
    url: '/banner/list',
    method: 'get',
    params
  })
}

// banner管理页面
export function editBannerList(data) {
  return request({
    url: '/banner/batch',
    method: 'post',
    data
  })
}

// 分组详情接口
export function catalogueDetail(catalogueId) {
  return request({
    url: `/catalogue/detail/${catalogueId}`,
    method: 'get'
  })
}

// 批量添加商品
export function addGoodsGrouping(data) {
  return request({
    url: '/goods/grouping',
    method: 'post',
    data
  })
}

// 回收站
// 回收站分页查询
export function recyclePage(params) {
  return request({
    url: '/material/recycle/page',
    method: 'get',
    params
  })
}
// 回收站批量彻底删除
export function deleteMaterial(data) {
  return request({
    url: '/material/delete/completely',
    method: 'post',
    data
  })
}
// 回收站批量彻底还原
export function reductionMaterial(data) {
  return request({
    url: '/material/update/reduction',
    method: 'put',
    data
  })
}

// 商品分组列表
export function groupingList(params) {
  return request({
    url: '/grouping/list',
    method: 'GET',
    params
  })
}
// 商品分组新增
export function addGrouping(data) {
  return request({
    url: '/grouping',
    method: 'POST',
    data
  })
}
// 商品分组详情
export function groupingDetail(groupingId) {
  return request({
    url: `/grouping/detail/${groupingId}`,
    method: 'get'
  })
}
// 商品分组修改
export function groupingEdit(data) {
  return request({
    url: '/grouping/update',
    method: 'POST',
    data
  })
}
// 商品分组删除
export function groupingDel(groupingId) {
  return request({
    url: `/grouping/delete/${groupingId}`,
    method: 'DELETE'
  })
}
// 商品分组上下架
export function groupingShelf(groupingId, data) {
  return request({
    url: `/grouping/shelf/put/${groupingId}`,
    method: 'POST',
    data
  })
}

// 商品分组排序
export function groupingSort(data) {
  return request({
    url: '/grouping/relation/goods/sort',
    method: 'POST',
    data
  })
}

// 分组管理商品表
// 分页查询
export function groupingRelationPage(params) {
  return request({
    url: `/grouping/relation/goods/page`,
    method: 'GET',
    params
  })
}
// 批量添加商品
export function groupingRelationBatch(data) {
  return request({
    url: `/grouping/relation/goods/batch`,
    method: 'POST',
    data
  })
}
// 批量取消关联
export function groupingRelationDisassociate(data) {
  return request({
    url: `/grouping/relation/goods/disassociate/batch`,
    method: 'POST',
    data
  })
}

// 获取引用位置列表
export function materialGoodsList(params) {
  return request({
    url: '/material/goods/list',
    method: 'get',
    params
  })
}

// 获取文件是否重复上传 true 上传过 false 没有上传过
export function pdfCheck(params) {
  return request({
    url: '/pdf/check',
    method: 'get',
    params
  })
}

// PDF解析图片
export function pdfAnalysis(params) {
  return request({
    url: '/pdf/analysis',
    method: 'get',
    params
  })
}

// 获取PDF解析图片地址
export function pdfAnalysisGet(params) {
  return request({
    url: '/pdf/analysis/get',
    method: 'get',
    params
  })
}

// 商品主图片上传切割
export function materialUpload(data) {
  return request({
    url: '/material/goods/upload',
    method: 'post',
    data
  })
}

export function materialGifts(giftsCode) {
  return request({
    url: `/material-gifts-do/detail/${giftsCode}`,
    method: 'get'
  })
}

export function materialGoodsCopy(data) {
  return request({
    url: `/material/goods/copy`,
    method: 'post',
    data
  })
}

export function materialGoodsQueryCount(data) {
  return request({
    url: `/material/goods/copy/queryCount`,
    method: 'post',
    data
  })
}

export function materialGoodsCopyData(data) {
  return request({
    url: `/material/goods/copy/data`,
    method: 'post',
    data
  })
}

export function materialGoodsOfflineCopy(data) {
  return request({
    url: `/material/goods/offline/copy`,
    method: 'post',
    data
  })
}

