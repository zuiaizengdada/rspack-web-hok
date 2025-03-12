import request from '@/utils/request2'

// 目标设置-目标业绩表
export function employeePerformance(data) {
  return request({
    url: '/cloud/edata-live/employeePerformance/employeePerformance',
    method: 'POST',
    data
  })
}

// 根据月份和部门id查询目标设置
export function getTargetSetupList(params) {
  return request({
    url: '/cloud/edata-live/stat/targetSetup/list',
    method: 'get',
    params
  })
}

// 删除员工每月业务目标设置表
export function delTargetSetup(params) {
  return request({
    url: '/cloud/edata-live/stat/targetSetup/remove',
    method: 'DELETE',
    params
  })
}

// 保存员工每月业务目标设置表
export function saveTargetSetup(data) {
  return request({
    url: '/cloud/edata-live/stat/targetSetup/save',
    method: 'POST',
    data
  })
}
