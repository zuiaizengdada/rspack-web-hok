// import request from '@/utils/request'
import request2 from '@/utils/request2'

/** 查询机构待支付状态的账期 */
export function getAwaitingPaymentBillCycleApi(params) {
  return request2({
    url: '/cloud/edata-bill/bill/getToBeProcessedBillCycle',
    method: 'post',
    params
  })
}
/** 账单状态列表 */
export function billStatusApi(params) {
  return request2({
    url: '/cloud/edata-bill/bill/billStatus',
    method: 'get',
    params
  })
}
/** 查询总额项 - 平台机构 */
export function getBillAmountStatisticsApi(data) {
  return request2({
    url: '/cloud/edata-bill/bill/getBillAmountStatistics',
    method: 'post',
    data
  })
}
/** 查询总额项 - 非平台机构 */
export function getBillAmountStatisticsTenantApi(data) {
  return request2({
    url: '/cloud/edata-bill/tenant/bill/getBillAmountStatistics',
    method: 'post',
    data
  })
}
/** 分页查询账单信列表 - 平台机构 */
export function pageBillListApi(data) {
  return request2({
    url: '/cloud/edata-bill/bill/pageBillList',
    method: 'post',
    data
  })
}
/** 分页查询账单信列表 - 非平台机构 */
export function pageBillListTenantApi(data) {
  return request2({
    url: '/cloud/edata-bill/tenant/bill/pageBillList',
    method: 'post',
    data
  })
}
/** 机构搜索（用于条件查询下拉框） */
export function listOrganizationByParamApi(data) {
  return request2({
    url: '/cloud/edata-user/organization/organization/listOrganizationByParam',
    method: 'post',
    data
  })
}
/** 查询已签署机构ID */
export function getProtocolTenantIdsApi() {
  return request2({
    url: '/cloud/edata-bill/bill/getProtocolTenantIds',
    method: 'get'
  })
}

/** 查询账单详情 */
export function getBillDetailApi(params) {
  return request2({
    url: '/cloud/edata-bill/bill/getBillDetail',
    method: 'get',
    params
  })
}
/** 账单结算 */
export function billSettlementApi(data) {
  return request2({
    url: '/cloud/edata-bill/bill/billSettlement',
    method: 'post',
    data
  })
}
/** 查询账单结算信息 */
export function getBillSettlementRecordApi(params) {
  return request2({
    url: '/cloud/edata-bill/bill/getBillSettlementRecord',
    method: 'get',
    params
  })
}
/** 查询账单费用信息列表 */
export function listBillChargesApi(params) {
  return request2({
    url: '/cloud/edata-bill/bill/listBillCharges',
    method: 'get',
    params
  })
}
/** 查询账单优惠信息 */
export function listBillDiscountsApi(params) {
  return request2({
    url: '/cloud/edata-bill/bill/listBillDiscounts',
    method: 'get',
    params
  })
}
/** 查询手工录入费用信息列表 */
export function pageListBillManualChargesApi(data) {
  return request2({
    url: '/cloud/edata-bill/bill/pageListBillManualCharges',
    method: 'post',
    data
  })
}

// 用量明细
/** 聚合客服明细分页数据 */
export function aggregateCustomerApi(params) {
  return request2({
    url: '/cloud/edata-bill/detail/aggregateCustomer/page',
    method: 'get',
    params
  })
}
/** 聚合客服明细分页数据 */
export function aiPicPageApi(params) {
  return request2({
    url: '/cloud/edata-bill/detail/aiAssistant/aiPicPage',
    method: 'get',
    params
  })
}
/** 聚合客服明细分页数据 */
export function aiTokenPageApi(params) {
  return request2({
    url: '/cloud/edata-bill/detail/aiAssistant/aiTokenPage',
    method: 'get',
    params
  })
}
/** 聚合客服明细分页数据 */
export function certificateApi(params) {
  return request2({
    url: '/cloud/edata-bill/detail/aiCall/certificate',
    method: 'get',
    params
  })
}
/** 聚合客服明细分页数据 */
export function aiCallApi(params) {
  return request2({
    url: '/cloud/edata-bill/detail/aiCall/open',
    method: 'get',
    params
  })
}

// 产品收费项管理
/** 机构搜索（用于条件查询下拉框） */
export function chargesListApi(params) {
  return request2({
    url: '/cloud/edata-bill/product/charges/list',
    method: 'get',
    params
  })
}

/** 计价方式列表 */
export function billingMethodApi(params) {
  return request2({
    url: '/cloud/edata-bill/product/charges/billingMethod',
    method: 'get',
    params
  })
}

/** 消费类型列表 */
export function expenseTypeApi(params) {
  return request2({
    url: '/cloud/edata-bill/product/charges/expenseType',
    method: 'get',
    params
  })
}
/** 手动记费收费项列表查询 */
export function listManualChargesItemApi(params) {
  return request2({
    url: '/cloud/edata-bill/product/charges/listManualChargesItem',
    method: 'get',
    params
  })
}

/** 导出账单明细信息 */
export function billExportApi(params) {
  return request2({
    url: '/cloud/edata-bill/bill/export',
    method: 'get',
    timeout: 60000,
    params
  })
}

/** 删除收费项 */
export function chargesDelApi(id) {
  return request2({
    url: `/cloud/edata-bill/product/charges/delete/${id}`,
    method: 'get'
  })
}
/** 收费项更新 */
export function chargesUpdApi(data) {
  return request2({
    url: '/cloud/edata-bill/product/charges/update',
    method: 'post',
    data
  })
}
/** 新增收费项 */
export function chargesAddApi(data) {
  return request2({
    url: '/cloud/edata-bill/product/charges/add',
    method: 'post',
    data
  })
}

/** 新增收费项 */
export function confirmBillApi(params) {
  return request2({
    url: '/cloud/edata-bill/bill/confirmBill',
    method: 'get',
    params
  })
}
