import request from '@/utils/request2'

// 直播视频在线剪辑-视频列表
export function projectVideoList(query) {
  return request({
    url: '/cloud/product/operateClips/projectVideoList',
    method: 'get',
    params: query
  })
}

// 贴图素材上传
export function uploadStickerMateria(data) {
  return request({
    url: '/cloud/product/video/stickerMateria/upload',
    method: 'post',
    data
  })
}

// 贴图素材列表
export function listStickerMateria(data) {
  return request({
    url: '/cloud/product/video/stickerMateria/list',
    method: 'get',
    params: data
  })
}

// 贴图素材改名
export function editStickerMateria(data) {
  return request({
    url: '/cloud/product/video/stickerMateria/edit',
    method: 'post',
    data
  })
}

// 贴图素材删除
export function deleteStickerMateria(data) {
  return request({
    url: '/cloud/product/video/stickerMateria/delete',
    method: 'post',
    data
  })
}

// 视频贴图列表
export function listSticker(data) {
  return request({
    url: '/cloud/product/video/sticker/stickerList',
    method: 'get',
    params: data
  })
}

// 视频贴图新增
export function addSticker(data) {
  return request({
    url: '/cloud/product/video/sticker/sticker',
    method: 'post',
    data
  })
}
// 视频贴图删除
export function deleteSticker(data) {
  return request({
    url: '/cloud/product/video/sticker/delete',
    method: 'post',
    data
  })
}

// 修改贴图
export function updateSticker(data) {
  return request({
    url: '/cloud/product/video/sticker/updateSticker',
    method: 'post',
    data
  })
}

// 运营在线剪辑-视频列表
export function operateClipsProjectVideoList(query) {
  return request({
    url: '/cloud/product/operateClips/projectVideoList',
    method: 'get',
    params: query
  })
}

// 视频帧定格列表
export function frameHoldList(query) {
  return request({
    url: '/cloud/product/video/frameHold/frameHoldList',
    method: 'get',
    params: query
  })
}

// 视频帧定格
export function frameHold(data) {
  return request({
    url: '/cloud/product/video/frameHold/frameHold',
    method: 'post',
    data
  })
}

// 删除视频帧定格
export function deleteframeHold(data) {
  return request({
    url: '/cloud/product/video/frameHold/deleteframeHold',
    method: 'post',
    data
  })
}

// 直播视频在线剪辑-视频切割列表
export function operateClipsCuttingInfos(data) {
  return request({
    url: '/cloud/product/operateClips/cuttingInfos',
    method: 'get',
    params: data
  })
}
// 直播视频在线剪辑-批量新增修改切割
export function operateClipsVideoCutting(data) {
  return request({
    url: '/cloud/product/operateClips/videoCutting',
    method: 'post',
    data
  })
}

// 在线剪辑-视频合成
export function operateClipsVideoCompose(data) {
  return request({
    url: '/cloud/product/video/project/composeVideo',
    method: 'post',
    data
  })
}

// 修改视频名称
export function updateVideoName(data) {
  return request({
    url: '/cloud/product/video/project/updateVideoName',
    method: 'post',
    data
  })
}
// 删除视频
export function deleteVideo(data) {
  return request({
    url: '/cloud/product/video/project/deleteVideo',
    method: 'post',
    data
  })
}
