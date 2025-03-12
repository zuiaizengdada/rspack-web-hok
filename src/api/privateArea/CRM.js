import request from '@/utils/request2'

// 新增销售任务
export function saleTaskAdd(data) {
  return request({
    url: '/cloud/edata-sale/sale/task/add',
    method: 'POST',
    data
  })
}

// 销售任务详情
export function saleTaskdetail(taskId) {
  return request({
    url: `/cloud/edata-sale/sale/task/detail/${taskId}`,
    method: 'GET'
  })
}

// 复制销售任务
export function saleTaskdetailCopy(taskId) {
  return request({
    url: `/cloud/edata-sale/sale/task/copy/${taskId}`,
    method: 'GET'
  })
}
// 退款状态下拉列表
export function getClueRefundStatus(taskId) {
  return request({
    url: `/cloud/edata-sale/clue/selectRefundStatus`,
    method: 'GET'
  })
}
// 获取更进状态下拉
export function getFollowType(params) {
  return request({
    url: `/cloud/edata-sale/clue/follow/type/selectList`,
    method: 'GET',
    params
  })
}
// 删除线下表格数据
export function deleteSaleTaskOffline(id) {
  return request({
    url: `/cloud/edata-sale/sale/task/offline/delete/${id}`,
    method: 'DELETE'
  })
}

// 上传线下表格
export function saleTaskOfflineImport(data) {
  return request({
    url: '/cloud/edata-sale/sale/task/offline/import',
    method: 'POST',
    data
  })
}

// 上传线下表格
export function saleTaskOfflineImportByTaskId(taskId, data) {
  return request({
    url: `/cloud/edata-sale/sale/task/offline/import/${taskId}`,
    method: 'POST',
    data
  })
}

// 线下表格数据列表
export function getSaleTaskOfflinePage(params) {
  return request({
    url: '/cloud/edata-sale/sale/task/offline/page',
    method: 'GET',
    params
  })
}

// 销售任务列表
export function getSaleTaskPage(params) {
  return request({
    url: '/cloud/edata-sale/sale/task/page',
    method: 'GET',
    params
  })
}

// 修改销售任务
export function editSaleTask(data) {
  return request({
    url: '/cloud/edata-sale/sale/task/update',
    method: 'PUT',
    data
  })
}

// 修改销售任务运行时间状态
export function updateRunTime(data) {
  return request({
    url: '/cloud/edata-sale/sale/task/update/runTime',
    method: 'PUT',
    data
  })
}

// 修改销售任务状态
export function editSaleTaskStatus(data) {
  return request({
    url: '/cloud/edata-sale/sale/task/update/status',
    method: 'PUT',
    data
  })
}

// 新增标签
export function addSaleTaskTag(data) {
  return request({
    url: '/cloud/edata-sale/sale/tag/add',
    method: 'POST',
    data
  })
}

// 标签列表
export function getSaleTaskList(params) {
  return request({
    url: '/cloud/edata-sale/sale/tag/page',
    method: 'get',
    params
  })
}

// 获取订单标签列表(新增任务-数据设置)
export function getOrderTagList() {
  return request({
    url: '/cloud/edata-sale/order/tag/list',
    method: 'get'
  })
}

// 获取企业微信配置
export function getWechatSetting() {
  return request({
    url: '/cloud/edata-sale/biz/wechat/get',
    method: 'GET'
  })
}

// 修改企业微信配置
export function editWechatSetting(data) {
  return request({
    url: '/cloud/edata-sale/biz/wechat/update',
    method: 'PUT',
    data
  })
}

// 导出线索列表
export function exportCluePageList(data) {
  return request({
    url: '/cloud/edata-sale/clue/export',
    method: 'post',
    data
  })
}

// 获取导出线索列表
export function exportUrlId(id) {
  return request({
    url: `/cloud/edata-sale/clue/export/url/id/${id}`,
    method: 'GET'
  })
}

// 任务线索统计-列表
export function getTaskClueStat(data) {
  return request({
    url: '/cloud/edata-sale/clueStat/taskClueStat',
    method: 'POST',
    data
  })
}

// 任务线索统计-合计
export function getTaskClueStatCollect(data) {
  return request({
    url: '/cloud/edata-sale/clueStat/taskClueStatCollect',
    method: 'POST',
    data
  })
}

// 公众号
export function getTaskClueBizOfficialStatCollect(data) {
  return request({
    url: '/cloud/edata-sale/clueStat/taskClueBizOfficialStatCollect',
    method: 'POST',
    data
  })
}

// 任务汇总-直播间1
export function getTaskClueLiveStatCollect(data) {
  return request({
    url: '/cloud/edata-sale/clueStat/taskClueLiveStatCollect',
    method: 'POST',
    data
  })
}

// 任务汇总-直播间2
export function getTaskClueLiveStatCollect2(data) {
  return request({
    url: '/cloud/edata-sale/clueStat/taskClueLiveStatCollect2',
    method: 'POST',
    data
  })
}

// 加微阶段-合计
export function getTaskClueStatTotal(data) {
  return request({
    url: '/cloud/edata-sale/clueStat/taskClueStatTotal',
    method: 'POST',
    data
  })
}

// 公众号-合计
export function getTaskClueBizOfficialStatTotalCollect(data) {
  return request({
    url: '/cloud/edata-sale/clueStat/taskClueBizOfficialStatTotalCollect',
    method: 'POST',
    data
  })
}

// 任务汇总-直播间1-合计
export function getTaskClueLiveStatTotalCollect(data) {
  return request({
    url: '/cloud/edata-sale/clueStat/taskClueLiveStatTotalCollect',
    method: 'POST',
    data
  })
}

// 任务汇总-直播间2-合计
export function getTaskClueLiveStatTotalCollect2(data) {
  return request({
    url: '/cloud/edata-sale/clueStat/taskClueLiveStatTotalCollect2',
    method: 'POST',
    data
  })
}

// 认领订单--业绩归属人
export function getCustomerSelectList(taskId) {
  return request({
    url: `/cloud/edata-sale/sale/task/customer/selectList/${taskId}`,
    method: 'POST'
  })
}

// 认领订单--分页查询
export function getCustomerselectPage(data) {
  return request({
    url: `/cloud/edata-sale/sale/task/customer/selectPage`,
    method: 'POST',
    data
  })
}
// 认领订单--确认
export function saleCustomerConfirm(data) {
  return request({
    url: `/cloud/edata-sale/sale/task/customer/confirm`,
    method: 'POST',
    data
  })
}
// 兜底任务线索列表
export function getUndertakeClue(params) {
  return request({
    url: `/cloud/edata-sale/undertake/clue/page`,
    method: 'GET',
    params
  })
}

// 获取兜底任务详情
export function getDefaultTaskDetail(params) {
  return request({
    url: `/cloud/edata-sale/default/task/detail`,
    method: 'GET',
    params
  })
}

// 保存兜底任务
export function saveTaskDetail(data) {
  return request({
    url: `/cloud/edata-sale/default/task/save`,
    method: 'POST',
    data
  })
}

// 兜底线索 分页查询邀客链接记录
export function getHkLinkClue(data) {
  return request({
    url: `/cloud/edata-sale/hk/link/page`,
    method: 'POST',
    data
  })
}

// 兜底线索 修复链接
export function getHkLinkRepair(data) {
  return request({
    url: `/cloud/edata-sale/hk/link/repair`,
    method: 'POST',
    data
  })
}

// 通信列表
export function getCommunicationList(clueId) {
  return request({
    url: `/cloud/edata-sale/undertake/clue/communication/list/${clueId}`,
    method: 'GET'
  })
}

// 获取投放计划列表接口
export function queryAdPlanList(params) {
  return request({
    url: `/cloud/edata-sale/sale/saleTaskInfoFlowConditionDo/queryAdPlanList`,
    method: 'GET',
    params
  })
}

// 获取投流账号列表接口
export function queryAdvertiserList(params) {
  return request({
    url: `/cloud/edata-sale/sale/saleTaskInfoFlowConditionDo/queryAdvertiserList`,
    method: 'GET',
    params
  })
}

// 获取投流渠道接口
export function queryChannelList() {
  return request({
    url: `/cloud/edata-sale/sale/saleTaskInfoFlowConditionDo/queryChannelList`,
    method: 'GET'
  })
}

// 新增商品条件
export function saleTaskInfoFlowConditionDoAdd(data) {
  return request({
    url: `/cloud/edata-sale/sale/saleTaskInfoFlowConditionDo/add`,
    method: 'post',
    data
  })
}

// 新增商品条件
export function saleTaskInfoFlowConditionDoPage(params) {
  return request({
    url: `/cloud/edata-sale/sale/saleTaskInfoFlowConditionDo/page`,
    method: 'get',
    params
  })
}

// 移除商品条件
export function saleTaskInfoFlowConditionDoRemove(data) {
  return request({
    url: `/cloud/edata-sale/sale/saleTaskInfoFlowConditionDo/remove`,
    method: 'delete',
    data
  })
}

// 列表查询条件
export function getSearchList(params) {
  return request({
    url: `/cloud/edata-sale/sale/saleTaskInfoFlowConditionDo/getSearchList`,
    method: 'get',
    params
  })
}

// 列表查询条件
export function queryAdPlanListByKeyword(data) {
  return request({
    url: `/cloud/edata-sale/sale/saleTaskInfoFlowConditionDo/queryAdPlanListByKeyword`,
    method: 'POST',
    data
  })
}

// 列表查询条件
export function queryAdvertiserListByKeyword(data) {
  return request({
    url: `/cloud/edata-sale/sale/saleTaskInfoFlowConditionDo/queryAdvertiserListByKeyword`,
    method: 'POST',
    data
  })
}

export function areaCodeList(params) {
  return request({
    url: `/cloud/edata-sale/sale/saleTaskInfoFlowConditionDo/china/areaCode/list`,
    method: 'get',
    params
  })
}

export function saleTaskUpdate(data) {
  return request({
    url: `/cloud/edata-sale/sale/task/update/tag`,
    method: 'put',
    data
  })
}

export function materialSearchName(params) {
  return request({
    url: `/cloud/admin/material/goods/search/name`,
    method: 'get',
    params
  })
}
// 获取执行配置列表
export function getActionConfigList(params) {
  return request({
    url: `/cloud/edata-sale/action/config/list`,
    method: 'get',
    params
  })
}

// 更换触达规则
export function putTaskOrderChange(data) {
  return request({
    url: `/cloud/edata-sale/sale/task/sms/order/change`,
    method: 'PUT',
    data
  })
}

export function userTagSave(data) {
  return request({
    url: `/cloud/edata-tag/user-tag/save`,
    method: 'post',
    data
  })
}

// 删除触达规则
export function removeTaskOrderChange(data) {
  return request({
    url: `/cloud/edata-sale/sale/task/sms/order/delete`,
    method: 'POST',
    data
  })
}

export function userTagList(platformUserId) {
  return request({
    url: `/cloud/edata-tag/user-tag/list/${platformUserId}`,
    method: 'get'
  })
}

export function userTagDelete(id) {
  return request({
    url: `/cloud/edata-tag/user-tag/delete/${id}`,
    method: 'delete'
  })
}

export function saleTaskUpdateFriendRemark(data) {
  return request({
    url: `/cloud/edata-sale/sale/task/update/friendRemark`,
    method: 'post',
    data
  })
}

export function ITaskWelcomeGet(params) {
  return request({
    url: `/cloud/edata-sale/ITaskWelcome/get`,
    method: 'get',
    params
  })
}

export function ITaskWelcomSaveOrUpdate(data) {
  return request({
    url: `/cloud/edata-sale/ITaskWelcome/saveOrUpdate`,
    method: 'post',
    data
  })
}

export function taskWelcomUpdateContent(data) {
  return request({
    url: `/cloud/edata-sale/sale/task/welcome/update/content`,
    method: 'put',
    data
  })
}

export function taskWelcomSave(data) {
  return request({
    url: `/cloud/edata-sale/sale/task/welcome/save`,
    method: 'post',
    data
  })
}

export function taskWelcomDel(id) {
  return request({
    url: `/cloud/edata-sale/sale/task/welcome/${id}`,
    method: 'DELETE'
  })
}

export function taskWelcomResort(data) {
  return request({
    url: `/cloud/edata-sale/sale/task/welcome/resort`,
    method: 'post',
    data
  })
}

// 历史搜索记录
export function queryTagInfoCache() {
  return request({
    url: `/cloud/edata-sale/clue/queryTagInfoCache`,
    method: 'GET'
  })
}
// 导出数据
export function exportData(data) {
  return request({
    url: `/cloud/data-center/liveRoom/data/clueStat/export`,
    method: 'post',
    data
  })
}
