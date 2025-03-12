import request from '@/utils/request2'

// 兜底商品类型任务列表
export function getGoodsTypeTaskList(params) {
  return request({
    url: '/cloud/edata-sale/default-goods-type-task/list',
    method: 'GET',
    params
  })
}
// 兜底商品类型任务详情
export function getGoodsTypeTaskDetail(params) {
  return request({
    url: `/cloud/edata-sale/default-goods-type-task/detail/${params.goodsType}`,
    method: 'GET'
  })
}

// 兜底商品类型任务移除接待人员
export function deleteGoodsTypeTaskStaff(params) {
  return request({
    url: `/cloud/edata-sale/default-goods-type-task/reception/staff/${params.id}`,
    method: 'DELETE'
  })
}

// 添加接待任务人员
export function addTaskStaff(data) {
  return request({
    url: `/cloud/edata-sale/default-goods-type-task/staff/add`,
    method: 'POST',
    data
  })
}

// 改变接待人员顺序
export function setStaffChangeSort(data) {
  return request({
    url: `/cloud/edata-sale/default-goods-type-task/staff/change/sort`,
    method: 'POST',
    data
  })
}

// 保存修改兜底商品类型任务
export function addTask(data) {
  return request({
    url: `/cloud/edata-sale/default-goods-type-task/add`,
    method: 'POST',
    data
  })
}

// 兜底商品类型任务接待人员列表
export function getReceptionStaffPage(params) {
  return request({
    url: `/cloud/edata-sale/default-goods-type-task/reception/staff/page`,
    method: 'GET',
    params
  })
}

// 修改兜底分配模式
export function modelUpdate(data) {
  return request({
    url: `/cloud/edata-sale/defaultTaskAllocationModel/update`,
    method: 'POST',
    data
  })
}

// 查询兜底分配模式
export function modelQuery(params) {
  return request({
    url: `/cloud/edata-sale/defaultTaskAllocationModel/query`,
    method: 'GET',
    params
  })
}

// 兜底任务订单接量团队列表
export function receptionPage(params) {
  return request({
    url: `/cloud/edata-sale/defaultTaskOrderSourceDept/reception/dept/page`,
    method: 'GET',
    params
  })
}

// 添加订单接量团队
export function sourceDeptAdd(data) {
  return request({
    url: `/cloud/edata-sale/defaultTaskOrderSourceDept/dept/add`,
    method: 'post',
    data
  })
}

// 添加订单接量团队
export function sourceDeptDel(id) {
  return request({
    url: `/cloud/edata-sale/defaultTaskOrderSourceDept/reception/dept/${id}`,
    method: 'DELETE'
  })
}

// 订单来源团队列表
export function sourceDeptPage(params) {
  return request({
    url: `/cloud/edata-sale/defaultTaskOrderSourceDept/page`,
    method: 'get',
    params
  })
}

// 订单来源团队任务详情
export function sourceDeptDetail(id) {
  return request({
    url: `/cloud/edata-sale/defaultTaskOrderSourceDept/detail/${id}`,
    method: 'get'
  })
}

// 改变订单接量团队顺序
export function sourceDeptDeptChangeSort(data) {
  return request({
    url: `/cloud/edata-sale/defaultTaskOrderSourceDept/dept/change/sort`,
    method: 'POST',
    data
  })
}

// 添加任务接待部门
export function saleTaskDeptDoAdd(data) {
  return request({
    url: `/cloud/edata-sale/sale/saleTaskDeptDo/dept/add`,
    method: 'POST',
    data
  })
}

// 查询任务接待部门
export function saleTaskDeptDoQuery(taskId) {
  return request({
    url: `/cloud/edata-sale/sale/saleTaskDeptDo/dept/${taskId}`,
    method: 'get'
  })
}

// 删除接待部门
export function saleTaskDeptDoDel(id) {
  return request({
    url: `/cloud/edata-sale/sale/saleTaskDeptDo/dept/${id}`,
    method: 'delete'
  })
}

// 修改任务接待部门
export function saleTaskDeptDoUpdate(data) {
  return request({
    url: `/cloud/edata-sale/sale/saleTaskDeptDo/dept/update`,
    method: 'put',
    data
  })
}

// 保存修改团队兜底任务
export function orderSourceDeptAdd(data) {
  return request({
    url: `/cloud/edata-sale/defaultTaskOrderSourceDept/add`,
    method: 'post',
    data
  })
}

// 校验订单来源部门是否已经存在
export function orderSourceDeptCheck(data) {
  return request({
    url: `/cloud/edata-sale/defaultTaskOrderSourceDept/check`,
    method: 'post',
    data
  })
}

export function saleTaskDeptDoCheck(taskId) {
  return request({
    url: `/cloud/edata-sale/sale/saleTaskDeptDo/check/${taskId}`,
    method: 'get'
  })
}
export function saleTaskDeptDoDeptIdUpdate(data) {
  return request({
    url: `/cloud/edata-sale/sale/saleTaskDeptDo/deptId/update`,
    method: 'put',
    data
  })
}

export function saleTaskMaxNum(taskId) {
  return request({
    url: `/cloud/edata-sale/sale/task/max/clue/num/${taskId}`,
    method: 'get'
  })
}
