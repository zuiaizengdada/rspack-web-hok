import request from '@/utils/request2'

// 获取用户信息
export function getUserInfoForName() {
  return request({
    url: '/cloud/product/sysuser/getSysUserInfo',
    method: 'get'
  })
}

// 课件查询接口
export function getCourseList(params) {
  return request({
    url: '/cloud/product/courseware/list',
    method: 'post',
    data: params
  })
}

// 课件编辑接口
export function updateForCourseObj(param) {
  return request({
    url: '/cloud/product/courseware/edit',
    method: 'PUT',
    data: param
  })
}

// 课件新增接口
export function insertCourseObj(param) {
  return request({
    url: 'cloud/product/courseware/add',
    method: 'post',
    data: param
  })
}

// 课件版本修改接口
export function updateVersion(param) {
  return request({
    url: '/cloud/product/courseware/updateVersion',
    method: 'post',
    data: param
  })
}

// 根据课件id查询课件详情内容
export function getCourseDetailById(id) {
  return request({
    url: `/cloud/product/courseware/detail?id=${id}`,
    method: 'get'
  })
}

// 根据课件id进行复制
export function copyCourseById(id) {
  return request({
    url: `/cloud/product/courseware/copy?id=${id}`,
    method: 'POST'
  })
}

// 数据看板 总问题数
export function allDataGetData(params) {
  return request({
    url: `/cloud/product/statistics/getData`,
    method: 'POST',
    data: params
  })
}

// 条件查询话题排行榜数据
export function getDemandDatas(param) {
  return request({
    url: '/cloud/product/statistics/rankingList/demand/getData',
    method: 'post',
    data: param
  })
}

// 条件查询行业选题排行榜榜数据
export function getAnliDatas(param) {
  return request({
    url: '/cloud/product/statistics/rankingList/case/getData',
    method: 'post',
    data: param
  })
}

// 话题关键词对比图数据接口
export function getCompariseonDiagram(param) {
  return request({
    url: '/cloud/product/statistics/comparisonDiagram/keyword/getData',
    method: 'post',
    data: param
  })
}

// 查询选题趋势图数据
export function getTrendChartData(param) {
  return request({
    url: '/cloud/product/statistics/trendChart/case/getData',
    method: 'post',
    data: param
  })
}

// 查询老师选题计划统计数据
export function getCasePlanTeacherData(param) {
  return request({
    url: 'cloud/product/statistics/casePlan/casePlan/getData',
    method: 'post',
    data: param
  })
}
