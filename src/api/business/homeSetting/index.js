import request from '@/utils/request2'

// 首页配置-轮播图/金刚区 -详情
export function getHomepageDetail(id) {
  return request({
    url: `/cloud/admin/homepage/${id}`,
    method: 'GET'
  })
}

// 首页配置-轮播图/金刚区 -排序
export function sortHomepage(data) {
  return request({
    url: `/cloud/admin/homepage/type/sort`,
    method: 'POST',
    data
  })
}

// 首页配置-轮播图/金刚区 -保存
export function saveHomepage(data) {
  return request({
    url: `/cloud/admin/homepage/type/save`,
    method: 'POST',
    data
  })
}

// 首页配置-轮播图/金刚区 -删除
export function delHomepage(id) {
  return request({
    url: `/cloud/admin/homepage/type/del/${id}`,
    method: 'DELETE'
  })
}

// 获取猜你喜欢数据
export function getLikeData(params) {
  return request({
    url: '/cloud/admin/homepage/v1/freshness',
    method: 'GET',
    params
  })
}

// 获取爆款推荐得分组列表
export function getGroupingList(params) {
  return request({
    url: `/cloud/admin/grouping/list`,
    method: 'GET',
    params
  })
}

// 获取爆款推荐得分组详情数据
export function getpopularityList(params) {
  return request({
    url: '/cloud/admin/homepage/v1/popularity',
    method: 'GET',
    params
  })
}

export function getHomepageGrouping(type) {
  return request({
    url: `/cloud/admin/homepage/grouping/${type}`,
    method: 'GET'
  })
}

// 首页-轮播图-金刚区-通过id获取详情
export function getHomepageDetailById(params) {
  return request({
    url: '/cloud/admin/homepage/detail',
    method: 'GET',
    params
  })
}
