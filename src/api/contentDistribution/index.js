// import request from '@/utils/request'
import request2 from '@/utils/request2'

/** 脱敏视频合作机构列表 */
export function desensitizedVideoCpOrgListApi(data) {
  return request2({
    url: '/cloud/product/contentDelivery/desensitizedVideoCpOrgList',
    method: 'post',
    data
  })
}
/** 脱敏视频分发人列表 */
export function desensitizedVideoCreateUserListApi(data) {
  return request2({
    url: '/cloud/product/contentDelivery/desensitizedVideoCreateUserList',
    method: 'post',
    data
  })
}
/** n内容分发中心 脱敏详情 */
export function desensitizedDetailApi(data) {
  return request2({
    url: '/cloud/product/contentDelivery/desensitizedDetail',
    method: 'post',
    data
  })
}
/** 脱敏视频详情 */
export function desensitizedVideoDetailApi(data) {
  return request2({
    url: '/cloud/product/contentDelivery/desensitizedVideoDetail',
    method: 'post',
    data
  })
}
/** 脱敏视频IP列表 */
export function desensitizedVideoIpListApi(data) {
  return request2({
    url: '/cloud/product/contentDelivery/desensitizedVideoIpList',
    method: 'post',
    data
  })
}
/** 脱敏视频分页列表 */
export function desensitizedVideoPageListApi(data) {
  return request2({
    url: '/cloud/product/contentDelivery/desensitizedVideoPageList',
    method: 'post',
    data
  })
}

/** -脱敏视频供应机构列表 */
export function desensitizedVideoSupplierOrgListApi(data) {
  return request2({
    url: '/cloud/product/contentDelivery/desensitizedVideoSupplierOrgList',
    method: 'post',
    data
  })
}

/** 成品视频供应机构列表 */
export function finishSupplierOrgListApi(data) {
  return request2({
    url: '/cloud/product/contentDelivery/finishSupplierOrgList',
    method: 'post',
    data
  })
}

/** 成品视频指派 */
export function finishVideoAssignApi(data) {
  return request2({
    url: '/cloud/product/contentDelivery/finishVideoAssign',
    method: 'post',
    data
  })
}

/** 成品视频合作机构列表 */
export function finishVideoCpOrgListApi(data) {
  return request2({
    url: '/cloud/product/contentDelivery/finishVideoCpOrgList',
    method: 'post',
    data
  })
}

/** 成品视频分发人列表 */
export function finishVideoCreateUserListApi(data) {
  return request2({
    url: '/cloud/product/contentDelivery/finishVideoCreateUserList',
    method: 'post',
    data
  })
}

/** 成品视频详情 */
export function finishVideoDetailApi(data) {
  return request2({
    url: '/cloud/product/contentDelivery/finishVideoDetail',
    method: 'post',
    data
  })
}

/** 成品视频IP列表 */
export function finishVideoIpListApi(data) {
  return request2({
    url: '/cloud/product/contentDelivery/finishVideoIpList',
    method: 'post',
    data
  })
}

/** 成品视频分页列表 */
export function finishVideoPageListApi(data) {
  return request2({
    url: '/cloud/product/contentDelivery/finishVideoPageList',
    method: 'post',
    data
  })
}

/** 获取合作机构列表 */
export function getCpOrgListApi(params) {
  return request2({
    url: '/cloud/product/contentDelivery/getCpOrgList',
    method: 'get',
    params
  })
}

/** 获取分发合作机构记录列表 */
export function getDeliveryCpOrgListApi(params) {
  return request2({
    url: '/cloud/product/contentDelivery/getDeliveryCpOrgList',
    method: 'get',
    params
  })
}

/** 获取供应机构列表 */
export function getSupplierOrgListApi(params) {
  return request2({
    url: '/cloud/product/contentDelivery/getSupplierOrgList',
    method: 'get',
    params
  })
}
/** 获取成品视频关联的Ip列表 */
export function getVideoIpListApi(params) {
  return request2({
    url: '/cloud/product/contentDelivery/getVideoIpList',
    method: 'get',
    params
  })
}

