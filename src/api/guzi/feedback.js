import request2 from '@/utils/request2'

/** 意见反馈分页 */
export function feedbackList(data) {
  return request2({
    url: '/cloud/guzi-content/admin/feedback/page',
    method: 'post',
    data
  })
}

/** 处理 */
export function feedbackUpdate(data) {
  return request2({
    url: '/cloud/guzi-content/admin/feedback/update',
    method: 'post',
    data
  })
}

/** 导出 */
export function feedbackExport(data) {
  return request2({
    url: '/cloud/guzi-content/admin/feedback/export',
    method: 'post',
    responseType: 'blob',
    data
  })
}

/** 获取意见反馈问题类型 */
export function getFeedTypeList(data) {
  return request2({
    url: '/cloud/guzi-content/feedback/getFeedTypeList',
    method: 'post',
    data
  })
}
