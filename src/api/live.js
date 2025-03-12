import request from '@/utils/request'

export function getListChat(query) {
  return request({
    url: '/vue-element-admin/article/detail',
    method: 'get',
    params: query
  })
}
