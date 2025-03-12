import request from '@/utils/request2'
// 分页查询
export const getProductlistAjax = params => {
  return request({
    url: '/cloud/product/product/list',
    method: 'GET',
    params
  })
}
// 编辑产品
export const productEditAjax = data => {
  return request({
    url: '/cloud/product/product/edit',
    method: 'POST',
    data
  })
}
// 产品制作完成
export const productMadeDown = data => {
  return request({
    url: '/cloud/product/product/completed',
    method: 'POST',
    data
  })
}

// 产品分配
export const productAllocation = data => {
  return request({
    url: '/cloud/product/product/allocation',
    method: 'POST',
    data
  })
}

// 产品备注
export const productBeizhu = data => {
  return request({
    url: '/cloud/product/product/remark',
    method: 'POST',
    data
  })
}

// 产品宣发周知
export const productDispersing = data => {
  return request({
    url: '/cloud/product/product/dispersing',
    method: 'POST',
    data
  })
}

// 产品更新
export const productUpdating = data => {
  return request({
    url: '/cloud/product/product/update',
    method: 'POST',
    data
  })
}

// 产品下架
export const productOffine = data => {
  return request({
    url: '/cloud/product/product/offShelf',
    method: 'POST',
    data
  })
}

// 产品详情查询
export const productDetailByIdAjax = params => {
  return request({
    url: '/cloud/product/product/detailById',
    method: 'GET',
    params
  })
}
// 删除产品
export const productDeleteAjax = data => {
  return request({
    url: '/cloud/product/product/delete',
    method: 'POST',
    data
  })
}
// 新增产品
export const productAddAjax = data => {
  return request({
    url: '/cloud/product/product/add',
    method: 'POST',
    data
  })
}

// 根据产品ID查询店铺商品信息
export const goodListByProductId = params => {
  return request({
    url: '/cloud/product/product/goodListByProductId',
    method: 'GET',
    params
  })
}

// 产品上架
export const productShelf = data => {
  return request({
    url: '/cloud/product/product/shelf',
    method: 'POST',
    data
  })
}

// 店铺列表查询
export const shopThirdList = params => {
  return request({
    url: '/cloud/admin/shop/third/shopList',
    method: 'GET',
    params
  })
}

// 查看上架详情
export const getShelfDetail = params => {
  return request({
    url: '/cloud/product/product/shelfDetail',
    method: 'GET',
    params
  })
}
