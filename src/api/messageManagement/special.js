import request from '@/utils/request2'
import qs from 'qs'
// 分页查询
export function specialPage(params) {
  return request({
    url: '/cloud/edata-cms/special/page',
    method: 'GET',
    params
  })
}
// 创建专题页
export function specialCreate(data) {
  return request({
    url: '/cloud/edata-cms/special/page/create',
    method: 'POST',
    data
  })
}

// 批量删除留言
export function specialDetail(params) {
  return request({
    url: '/cloud/edata-cms/special/page/detail',
    method: 'GET',
    params
  })
}
// 编辑专题页
export function specialEdit(data) {
  return request({
    url: '/cloud/edata-cms/special/page/edit',
    method: 'POST',
    data
  })
}

// 获取课程详情(批量)
export function specialGetGoods(params) {
  return request({
    url: '/cloud/edata-cms/special/page/get/goods',
    method: 'get',
    params,
    paramsSerializer: function (params) {
      return qs.stringify(params, { arrayFormat: 'repeat' })
    }
  })
}

// 获取讲师详情(批量)
export function specialGetTeacher(params) {
  return request({
    url: '/cloud/edata-cms/special/page/get/teacher',
    method: 'get',
    params,
    paramsSerializer: function (params) {
      return qs.stringify(params, { arrayFormat: 'repeat' })
    }
  })
}
// 检验课程或者讲师
export function specialPageCheck(data) {
  return request({
    url: '/cloud/edata-cms/special/page/batch/check',
    method: 'post',
    data
  })
}
// 删除专题页
export function specialPageDelete(data) {
  return request({
    url: '/cloud/edata-cms/special/page/delete',
    method: 'post',
    data
  })
}
