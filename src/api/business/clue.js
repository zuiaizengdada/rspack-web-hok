import request from '@/utils/request2'

// 分页投放账号查询
export function getAccountPage(params) {
  return request({
    url: `/cloud/edata-clue/account/page`,
    method: 'GET',
    params
  })
}

// 新增账号
export function addAccount(data) {
  return request({
    url: '/cloud/edata-clue/account/add',
    method: 'POST',
    data
  })
}

// 编辑账号
export function editAccount(data) {
  return request({
    url: '/cloud/edata-clue/account/edit',
    method: 'POST',
    data
  })
}

// 删除账号
export function delAccount(businessId) {
  return request({
    url: `/cloud/edata-clue/account/delete/${businessId}`,
    method: 'POST'
  })
}

// 分页线索管理查询
export function getCluePage(params) {
  return request({
    url: '/cloud/edata-clue/clue/page',
    method: 'GET',
    params
  })
}

// 线索列表数据导出
export function clueListExport(params) {
  return request({
    url: '/cloud/edata-clue/clue/list/export',
    method: 'GET',
    params
  })
}

// 线索列表数据导出任务
export function clueListTaskToExport(params) {
  return request({
    url: '/cloud/edata-clue/clue/list/export',
    method: 'GET',
    params
  })
}

export function getLxUrl(params) {
  return request({
    url: '/cloud/edata-clue/clue/getExportTaskDTO',
    method: 'get',
    params
  })
}

// 数据看板
// 线索数量查询
export function clueBasicSum(params) {
  return request({
    url: '/cloud/edata-clue/statistic/basic/sum',
    method: 'get',
    params
  })
}
// 部门数据
export function clueDeptData(params) {
  return request({
    url: '/cloud/edata-clue/statistic/dept/data',
    method: 'get',
    params
  })
}

// 线索数量折线图查询
export function getLineChartData(params) {
  return request({
    url: '/cloud/edata-clue/statistic/lineChart/sum',
    method: 'GET',
    params
  })
}

// 线索来源、漏斗模型
export function getClueSource(params) {
  return request({
    url: '/cloud/edata-clue/statistic/source',
    method: 'GET',
    params
  })
}

// 分配团队查询
export function getDistributeGroup(params) {
  return request({
    url: '/cloud/edata-clue/clue/distribute/group',
    method: 'GET',
    params
  })
}

// 意向上课地点查询
export function getLikelyAddress(params) {
  return request({
    url: '/cloud/edata-clue/clue/likely/address',
    method: 'GET',
    params
  })
}

// 线索姓名查询
export function getClueNameBlur(params) {
  return request({
    url: '/cloud/edata-clue/clue/name/blur',
    method: 'GET',
    params
  })
}

// 成交课程价格查询
export function getTransactionPrice(params) {
  return request({
    url: '/cloud/edata-clue/clue/transaction/price',
    method: 'GET',
    params
  })
}

// 下单商品名称模糊查询
export function getClueGoodsNameBlur(params) {
  return request({
    url: '/cloud/edata-clue/clue/goodsName/blur',
    method: 'GET',
    params
  })
}

// 员工数据
export function getClueStaffData(params) {
  return request({
    url: '/cloud/edata-clue/statistic/staff/data',
    method: 'GET',
    params
  })
}

// 部门链数据
export function getDeptTree(params) {
  return request({
    url: '/cloud/edata-clue/statistic/dept/tree',
    method: 'GET',
    params
  })
}

/**
 * 账号授权管理列表
 * @param {*} params
 * @returns Promise
 */
export function getOauthUserList(params) {
  return request({
    url: '/cloud/ad-data-board/ad/oauth/user/list',
    method: 'GET',
    params
  })
}

// 解密数据
export function jmData(data) {
  return request({
    url: `/cloud/data-center/decrypt/board/data?startDate=${data.startDate}&endDate=${data.endDate}&showProduct=${data.showProduct}&tenantId=${data.tenantId}&orderSource=${data.orderSource}`,
    method: 'get'
  })
}

// 查询机构
export function getJGid() {
  return request({
    url: '/cloud/data-center/decrypt/board/orgin/list',
    method: 'get'
  })
}
export function getXsuoData() {
  return request({
    url: '/form/clue/queryChannelList',
    method: 'GET'
  })
}
export function decryptExport(params) {
  return request({
    url: '/cloud/data-center/decrypt/board/export',
    method: 'GET',
    params,
    responseType: 'blob'
  })
}
