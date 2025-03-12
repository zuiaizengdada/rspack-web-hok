import request from '@/utils/request2'

// 删除工程下载
export function videoDownloadDel(params) {
  return request({
    url: '/cloud/product/video/project/download/delete',
    method: 'get',
    params
  })
}

// 运营视频导出工程列表
export function videoDownloadList(params) {
  return request({
    url: '/cloud/product/video/project/download/list',
    method: 'get',
    params
  })
}
// 获取下载签名URL
export function videoDownloadUrl(params) {
  return request({
    url: '/cloud/product/video/project/download/url',
    method: 'get',
    params
  })
}

// 编辑工程文件名称
export function videoDownloadUrlEdit(data) {
  return request({
    url: '/cloud/product/video/project/download/edit',
    method: 'post',
    data
  })
}
