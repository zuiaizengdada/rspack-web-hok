import request2 from '@/utils/request2'

export function getTeacherPhotoList(params) {
  return request2({
    url: '/cloud/teacher/teacher/image/query',
    method: 'GET',
    params
  })
}
export function addTeacherPhoto(data) {
  return request2({
    url: '/cloud/teacher/teacher/image/add',
    method: 'post',
    data
  })
}
export function delTeacherPhoto(id) {
  return request2({
    url: `/cloud/teacher/teacher/image/remove/${id}`,
    method: 'DELETE'
  })
}
export function updateTeacherPhoto(data) {
  return request2({
    url: '/cloud/teacher/teacher/image/update/name',
    method: 'PUT',
    data
  })
}

export function queryTeacherList(params) {
  return request2({
    url: '/cloud/teacher/teacher/image/queryTeacherList',
    method: 'GET',
    params
  })
}
export function batchDownload(data) {
  return request2({
    url: '/cloud/teacher/teacher/image/batch/download',
    method: 'post',
    data
  })
}
