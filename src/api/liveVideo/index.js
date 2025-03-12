import request from '@/utils/request2'
// 计算userSig
export function getliveVideoList(params) {
  return request({
    url: '/cloud/edata-live/video/list',
    method: 'GET',
    params
  })
}
export const getSignature = (data) => {
  return request({
    url: '/cloud/edata-live/video/signature',
    method: 'POST',
    data
  })
}
export const getLabels = (params) => {
  return request({
    url: '/cloud/edata-live/video/labels',
    method: 'GET',
    params
  })
}

export const getVideoDetail = (detail) => {
  return request({
    url: `/cloud/edata-live/video/detail/${detail}`,
    method: 'GET'
  })
}
// 视频标签
export const getVideoLabels = (detail) => {
  return request({
    url: `/cloud/edata-live/video/labels`,
    method: 'GET'
  })
}
export const saveVideoModify = (data) => {
  return request({
    url: '/cloud/edata-live/video/modify',
    method: 'POST',
    data
  })
}

export const videoIsExist = (params) => {
  return request({
    url: '/cloud/edata-live/video/videoIsExist',
    method: 'GET',
    params
  })
}

export const videoNameIsExist = (params) => {
  return request({
    url: '/cloud/edata-live/video/videoNameIsExist',
    method: 'GET',
    params
  })
}
export const videoDelete = (data) => {
  return request({
    url: '/cloud/edata-live/video/delete',
    method: 'POST',
    data
  })
}
export const setVideoStatus = (data) => {
  return request({
    url: '/cloud/edata-live/video/modifyStatus',
    method: 'POST',
    data
  })
}
