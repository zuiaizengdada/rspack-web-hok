import request from '@/utils/request2'
export function addLiveRoom(data) {
  return request({
    url: '/cloud/edata-live/liveRoom/v2/addLiveRoom',
    method: 'post',
    data
  })
}

// 计划看播用户预导入,用于解析exel文件
export function prepareImport(data) {
  console.log(data, 'data')
  return request({
    url: '/cloud/edata-live/liveRoom/planWatchUser/prepareImport',
    method: 'POST',
    data
  })
}
export function importLiveRoomUserLimit(data) {
  return request({
    url: '/cloud/edata-live/liveRoom/userLimit/import',
    method: 'POST',
    timeout: 60000,
    data
  })
}

// 直播回放设置-指定人员进入场景-获取直播间id
export function getLiveRoomIdV2() {
  return request({
    url: '/cloud/edata-live/liveRoom/v2/getLiveRoomId',
    method: 'get'
  })
}
