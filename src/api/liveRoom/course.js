import request from '@/utils/request2'

// 获取班期课程详情
export function getCourseDetail(id) {
  return request({
    url: `/cloud/delivery/schedule/course/${id}`,
    method: 'get'
  })
}

// 新增班期章节
export function addCourseChapter(data) {
  return request({
    url: '/cloud/delivery/schedule/course/chapter',
    method: 'post',
    data
  })
}

// 更新班期章节
export function updateCourseChapter(data) {
  return request({
    url: `/cloud/delivery/schedule/course/chapter/update`,
    method: 'post',
    data
  })
}

// 获取班期详情
export function getScheduleDetail(params) {
  return request({
    url: `/cloud/delivery/schedule/detail/${params.id}`,
    method: 'get'
  })
}
// 获取班期章节
export function getScheduleCourse(params) {
  return request({
    url: `/cloud/delivery/schedule/course/${params.id}`,
    method: 'get'
  })
}

// 删除班期章节
export function deleteCourseChapter(params) {
  return request({
    url: `/cloud/delivery/schedule/course/chapter/delete`,
    method: 'get',
    params
  })
}

// 新增班期
export function addClass(data) {
  return request({
    url: '/cloud/delivery/schedule/course/class',
    method: 'post',
    data
  })
}

// 获取临时班期ID
export function getTempClassId() {
  return request({
    url: '/cloud/delivery/schedule/course/class/id',
    method: 'get'
  })
}

// 直播课可绑定直播间查询
export function getLiveRoomList(data) {
  return request({
    url: '/cloud/edata-live/liveRoom/v2/liveClassLiveRoomPage',
    method: 'post',
    data
  })
}

// 班期章节导入专栏课程
export function importCourseToChapter(data) {
  return request({
    url: '/cloud/delivery/schedule/course/chapter/import',
    method: 'post',
    data
  })
}

// 复制班期
export function copyClass(params) {
  return request({
    url: '/cloud/delivery/schedule/course/class/copy',
    method: 'get',
    params
  })
}

// 更改章节排序
export function updateChapterSort(data) {
  return request({
    url: '/cloud/delivery/schedule/course/batch/sort',
    method: 'post',
    data
  })
}
