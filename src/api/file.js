/** 文件上传 */
import request from '@/utils/request'
import request2 from '@/utils/request2'

/** 单个图片上传 */
export function uploadImg(data, onUploadProgress, cancelToken) {
  return request({
    url: '/upload/img',
    method: 'post',
    data,
    onUploadProgress,
    cancelToken
  })
}

/** 单个视频上传 */
export function uploadvideo(data, onUploadProgress, cancelToken) {
  return request({
    url: '/upload/video',
    method: 'post',
    data,
    onUploadProgress,
    cancelToken
  })
}

/** 单个音频上传 */
export function uploadAudio(data, onUploadProgress, cancelToken) {
  return request({
    url: '/upload/audio',
    method: 'post',
    data,
    onUploadProgress,
    cancelToken
  })
}

/** 单个音频上传amr版 */
export function uploadAudioAmr(data, onUploadProgress, cancelToken) {
  return request({
    url: '/recall/task/upload/mp3/amr',
    method: 'post',
    data,
    onUploadProgress,
    cancelToken
  })
}

export function uploadFile(data, onUploadProgress, cancelToken) {
  return request({
    url: '/upload/file',
    method: 'post',
    data,
    onUploadProgress,
    cancelToken
  })
}

// 获取音视频上传地址和凭证
export function getOssToken(params) {
  return request({
    url: '/audio/token',
    method: 'get',
    params
  })
}
// 刷新音/视频上传凭证
export function refreshVideo(videoId) {
  return request({
    url: `/refresh/${videoId}`,
    method: 'get'
  })
}

// 获取观看地址函数
export function getVideoUrl(params) {
  return request({
    url: `/play/list`,
    method: 'get',
    params
  })
}

// 获取源文件
export function getSourceFileUrl(params) {
  return request({
    url: '/vod/source/file',
    method: 'get',
    params
  })
}

// 前端上传文件-获取oss配置
export function getOssConfig() {
  return request2({
    url: '/cloud/file/upload/file/ossConfig',
    method: 'GET'
  })
}
