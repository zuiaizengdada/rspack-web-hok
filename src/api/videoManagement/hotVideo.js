import request from '@/utils/request2'

// 爆款视频列表
export function realHotSellingVideo(data) {
  return request({
    url: '/cloud/edata-wemedia/realHotSellingVideo/pageList',
    method: 'post',
    data
  })
}

// 爆款带货列表
export function hotSellingVideo(data) {
  return request({
    url: '/cloud/edata-wemedia/hotSellingVideo/pageList',
    method: 'post',
    data
  })
}
