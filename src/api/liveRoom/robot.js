import request from '@/utils/request2'

// 机器人列表查询
export function getRobot(data) {
  return request({
    url: '/cloud/edata-live/im/robots/page',
    method: 'post',
    data
  })
}

// 模糊查询机器人用户
export function queryRobot(params) {
  return request({
    url: '/cloud/edata-live/im/robots/fuzzy/query',
    method: 'GET',
    params
  })
}

// 删除机器人
export function deleteRobot(params) {
  return request({
    url: '/cloud/edata-live/im/robots/delete',
    method: 'GET',
    params
  })
}

// 新增机器人
export function addRobot(data) {
  return request({
    url: '/cloud/edata-live/im/robots/add',
    method: 'POST',
    data
  })
}

// 模糊查询脚本下的用户
export function getRobotListByScriptId(params) {
  return request({
    url: '/cloud/edata-live/script/interact/robot/list',
    method: 'GET',
    params
  })
}

// 更换用户名
export function updateRobot(data) {
  return request({
    url: '/cloud/edata-live/script/interact/update/robot',
    method: 'POST',
    data
  })
}

// 脚本机器人替换新用户查询
export function getRobotsFuzzyExclude(params) {
  return request({
    url: '/cloud/edata-live/im/robots/fuzzy/query/exclude',
    method: 'GET',
    params
  })
}

// 修改机器人
export function editRobots(data) {
  return request({
    url: '/cloud/edata-live/im/robots/edit',
    method: 'POST',
    data
  })
}

// 真人直播机器人列表查询
export function liveRoomRobotsList(data) {
  return request({
    url: '/cloud/edata-live/im/operation/page',
    method: 'POST',
    data
  })
}

// 真人直播随机机器人
export function randomRobot(data) {
  return request({
    url: '/cloud/edata-live/im/robots/randomRobot',
    method: 'POST',
    data
  })
}
