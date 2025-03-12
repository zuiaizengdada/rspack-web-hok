// import request2 from '@/utils/request2'
import { edataUserApi } from '@/utils/http/index.js'
// 获取岗位列表
export function jobPageList(data) {
  // return request2({
  return edataUserApi({
    url: '/job/pageList',
    method: 'get',
    params: data
  })
}
// 获取岗位不分页
export function jobNoPageList(data) {
  // return request2({
  return edataUserApi({
    url: '/job/list',
    method: 'get',
    params: data
  })
}

// 新增岗位
export function jobAdd(data) {
  // return request2({
  return edataUserApi({
    url: '/job',
    method: 'post',
    data
  })
}

// 修改岗位
export function jobUpdate(data) {
  // return request2({
  return edataUserApi({
    url: '/job',
    method: 'put',
    data
  })
}

// 删除岗位
export function jobDelete(jobIds) {
  // return request2({
  return edataUserApi({
    url: `/cloud/admin/job/${jobIds}`,
    method: 'delete'
  })
}

