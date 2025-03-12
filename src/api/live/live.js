import request from '@/utils/request'

// 获取直播列表
export function liveRoomList(params) {
  return request({
    url: '/live/manage/list',
    method: 'get',
    params
  })
}

// 主播-助教列表
export function getAnchorList(params) {
  return request({
    url: '/anchor/list',
    method: 'get',
    params
  })
}

// 讲师-助教手机号添加
export function addAnchorListByPhone(data) {
  return request({
    url: '/anchor',
    method: 'post',
    data
  })
}

// 新建直播间
export function addLiveRoom(data) {
  return request({
    url: '/live/manage',
    method: 'post',
    data
  })
}

// 编辑直播间
export function editLiveRoom(data) {
  return request({
    url: '/live/manage',
    method: 'put',
    data
  })
}

// 获取直播详情
export function getLiveDetail(params) {
  return request({
    url: '/live/manage/detail/byId',
    method: 'GET',
    params
  })
}

// 直播间上下架
export function liveRoomEnable(data) {
  return request({
    url: '/live/manage/enable',
    method: 'PUT',
    data
  })
}

