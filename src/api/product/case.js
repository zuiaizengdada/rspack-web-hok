import request from '@/utils/request2'
import { edataUserApi } from '@/utils/http/index.js'

export function caseList(data) {
  return request({
    url: '/cloud/product/case/list',
    method: 'post',
    data
  })
}

export function caseAdd(data) {
  return request({
    url: '/cloud/product/case/add',
    method: 'post',
    data
  })
}

export function findUserOrigin(userId) {
  // return request({
  return edataUserApi({
    url: `/dept/get/userId/${userId}`,
    method: 'get'
  })
}

export function caseEdit(data) {
  return request({
    url: '/cloud/product/case/edit',
    method: 'post',
    data
  })
}

export function caseDetail(params) {
  return request({
    url: '/cloud/product/case/detail',
    method: 'get',
    params
  })
}

export function checkTitle(params) {
  return request({
    url: '/cloud/product/case/check/title',
    method: 'get',
    params
  })
}

export function uploadFile(params) {
  return request({
    url: '/cloud/admin/upload/word/file',
    method: 'post',
    data: params
  })
}

export function caseDelete(id) {
  return request({
    url: `/cloud/product/case/delete/${id}`,
    method: 'DELETE'
  })
}

export function casePlatformAccountList(data) {
  return request({
    url: '/cloud/product/case/platform/account/list',
    method: 'post',
    data
  })
}

export function caseLoadVideoList(data) {
  return request({
    url: '/cloud/product/case/load/video',
    method: 'post',
    data
  })
}

export function statisticsFindCase(data) {
  return request({
    url: '/cloud/product/statistics/findcase/save',
    method: 'post',
    data
  })
}

export function casePlatformList(params) {
  return request({
    url: '/cloud/product/case/platform/list/platform',
    method: 'get',
    params
  })
}
