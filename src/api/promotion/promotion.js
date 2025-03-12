import request from '@/utils/request2'

// / 获取推广业绩分页
export function getPerformancePage(data) {
  return request({
    url: '/cloud/promotion/v1/promote/record/performance/page',
    method: 'post',
    data
  })
}

// 获取推广记录分页
export function getPromoteRecordpage(data) {
  return request({
    url: '/cloud/promotion/v1/promote/record/page',
    method: 'post',
    data
  })
}

// 推广业绩导出接口
export function exportPerformance(data) {
  return request({
    url: '/cloud/promotion/v1/promote/record/performance/export',
    method: 'POST',
    data
  })
}

// 推广记录导出接口
export function exportPromoteRecord(data) {
  return request({
    url: '/cloud/promotion/v1/promote/record/export',
    method: 'POST',
    data
  })
}
