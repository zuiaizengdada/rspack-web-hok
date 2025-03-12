import request from '@/utils/request'

// 分页查询
export function messageTplList(data) {
  return request({
    url: '/msg-template/page',
    method: 'POST',
    data
  })
}

// 添加模板
export function addTpl(data) {
  return request({
    url: '/msg-template/save',
    method: 'POST',
    data
  })
}

// 修改模板
export function editTpl(data) {
  return request({
    url: '/msg-template/update',
    method: 'POST',
    data
  })
}

// 批量删除
export function deleteTpl(data) {
  return request({
    url: '/msg-template/delete/batch',
    method: 'DELETE',
    data
  })
}

// 测试删除
export function testTpl(data) {
  return request({
    url: '/msg/send/test',
    method: 'POST',
    data
  })
}
