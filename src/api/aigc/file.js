import request from '@/utils/request2'

// 文件上传
export function fileUpload(data) {
  return request({
    url: '/cloud/hok-assistant/document-process-assistant/file-upload',
    method: 'POST',
    data
  })
}

// 根据任务ID获取文件上传绑定信息
export function getUploadStatusInfoByTaskId(params) {
  return request({
    url: '/cloud/hok-assistant/ai-file-upload-binding-model-config/get-by-task-id',
    method: 'GET',
    params
  })
}
