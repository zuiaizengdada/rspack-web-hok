/** 交易管理 */
import request from '@/utils/request'
import request2 from '@/utils/request2'
import request4 from '@/utils/request4'
import { edataUserApi } from '@/utils/http/index.js'
import qs from 'qs'
import { method } from 'lodash'
/** 订单管理 */

/** 分页查询 */
export function getOrderPage(params) {
  return request({
    url: '/goods/order/page',
    method: 'post',
    data: params
  })
}

export function getOrderFeignPage(params) {
  return request({
    url: '/goods/order/sale/feign/page',
    method: 'post',
    data: params
  })
}
/** 我的订单分页查询 */
export function getMyOrderPage(params) {
  return request({
    url: '/goods/order/page/my',
    method: 'get',
    params
  })
}

/** 订单详情 */
export function getOrderDetail(orderNo) {
  return request({
    url: `/goods/order/detail/${orderNo}`,
    method: 'get'
  })
}
/** 订单成员信息 */
export function getStudentList(params) {
  return request({
    url: '/student/list',
    method: 'get',
    params
  })
}
/** 订单退款记录 */
export function goodsAfterSaleList(params) {
  return request({
    url: '/goods/after/sale/list',
    method: 'get',
    params
  })
}
/** 售后维权接口 */
// 分页
export function getGoodsAfterSalePage(params) {
  return request({
    url: '/goods/after/sale/page',
    method: 'get',
    params
  })
}

// 售后订单详情
export function getSaleDetail(params) {
  return request({
    url: '/goods/after/sale/detail',
    method: 'get',
    params
  })
}
// 售后订单详情 套餐课 交付单详情
export function getDeliveryInfoApi(params) {
  return request({
    url: '/refund/detail',
    method: 'get',
    params
  })
}

// 确认退款
export function sureGoodsAfterSale(data) {
  return request({
    url: '/goods/after/sale',
    method: 'post',
    data
  })
}
// 确认退款
export function goodsOrderPriceReject(data) {
  return request({
    url: '/goods/after/sale/reject',
    method: 'post',
    data
  })
}
// 拒绝退款
export function rejectRefund(data) {
  return request({
    url: '/goods/after/sale/hok/rejectRefund',
    method: 'post',
    data
  })
}
// 确认改价
export function goodsOrderPrice(data) {
  return request({
    url: '/goods/order/price',
    method: 'post',
    data
  })
}

// 导出
export function goodsOrderExport(params) {
  return request({
    url: '/goods/order/export',
    method: 'post',
    data: params
  })
}

// 手动发送短信
export function goodsSendSMS(data) {
  return request({
    url: '/goods/order/send',
    method: 'POST',
    data
  })
}
// 激活订单手动发送短信
export function goodActivesSendSMS(data) {
  return request({
    url: '/goods/order/active/send',
    method: 'POST',
    data
  })
}
// 分页查询预警订单
export function orderWarning(params) {
  return request({
    url: '/goods/order/warning/page',
    method: 'get',
    params
  })
}

// 分页查询我的预警订单
export function myOrderWarning(params) {
  return request({
    url: '/goods/order/warning/page/my',
    method: 'get',
    params
  })
}

// 关闭预警订单
export function orderWarningClose(data) {
  return request({
    url: '/goods/order/warning/close',
    method: 'PUT',
    data
  })
}

// 关闭抖店预警订单
export function orderWarningCloseDoudian(data) {
  return request({
    url: '/goods/order/warning/close/doudian',
    method: 'PUT',
    data
  })
}

// 新增跟进人员
export function addFollowSave(data) {
  return request({
    url: '/user/follow/save',
    method: 'POST',
    data
  })
}

// 手动解密接口
export function orderManual(data) {
  return request({
    url: `/goods/order/manual?${qs.stringify(data)}`,
    method: 'POST',
    data
  })
}

// 开通售后卡
export function goodsAfterSaleCard(id) {
  return request({
    url: `/goods/after/sale/card/${id}`,
    method: 'post'
  })
}

// 开通售后卡
export function getDeliveryText(params) {
  return request({
    url: `/goods/after/sale/get/delivery`,
    method: 'get',
    params
  })
}

// 查询全部订单类型
export function findTypeList(params) {
  return request({
    url: '/orderTypeConfig/findList',
    method: 'get',
    params
  })
}

// 精准根据订单号查询
export function findOrderNo(params) {
  return request({
    url: '/goods/order/findOrderNo',
    method: 'get',
    params
  })
}

// 根据商品名称查询
export function getMaterialGoodsByNameList(params) {
  return request({
    url: '/material/goods/getMaterialGoodsByNameList',
    method: 'get',
    params
  })
}

// 根据商品ID查询商品规格
export function findGoodsIdByList(params) {
  return request({
    url: '/material/spec/findGoodsIdByList',
    method: 'get',
    params
  })
}

// 录入订单
export function addOrderAndUpdate(data) {
  return request({
    url: '/goods/order/addOrderAndUpdate',
    method: 'POST',
    data
  })
}

// 查询招生老师
export function findUserByRealName(params) {
  return request({
    url: '/goods/order/findUserByRealName',
    method: 'get',
    params
  })
}

// 订单认领
export function orderAdopt(data) {
  return request({
    url: '/goods/order/orderClaim',
    method: 'POST',
    data
  })
}

// 订单全额退款
export function orderListRefund(data) {
  return request({
    url: '/goods/order/refund',
    method: 'POST',
    data
  })
}

// 订单部分退款
export function orderListPartRefund(data) {
  return request({
    url: '/goods/order/partRefund',
    method: 'POST',
    data
  })
}

// 审核驳回接口
export function orderReject(data) {
  return request({
    url: '/audit/records/reject',
    method: 'POST',
    data
  })
}

// 审核通过接口
export function orderPass(data) {
  return request({
    url: '/audit/records/addAuditRecords',
    method: 'POST',
    data
  })
}

/** 订单获取子订单信息 */
export function getChildOrderNoList(params) {
  return request({
    url: '/goods/order/subOrder/by/orderNo',
    method: 'get',
    params
  })
}

// 获取部门
export function getDept(params) {
  return request2({
    url: '/cloud/data-center/tran/data/get/dept',
    method: 'get',
    params
  })
}
// 获取价格
export function getGoodsPrices(params) {
  return request2({
    url: '/cloud/admin/material/goods/getGoodsPrices',
    method: 'get',
    params
  })
}

// 获取最新更新时间
export function getDataNewTime(params) {
  return request2({
    url: '/cloud/data-center/tran/data/get/data/time',
    method: 'get',
    params
  })
}

// 获取当前用户部门
export function getDeptId(params) {
  return request2({
    url: '/cloud/data-center/tran/data/get/user/deptId',
    method: 'get',
    params
  })
}

// 检查是否签订过协议
export function checkSign(params) {
  return request2({
    url: '/cloud/edata-oa/protocol/checkSign',
    method: 'get',
    params
  })
}

// 内容带货销售净额
export function getExpertSales(data) {
  return request2({
    url: '/cloud/data-center/tran/data/expertSales',
    method: 'POST',
    data
  })
}
// 内容带货销售净额当天
export function getExpertSales1(data) {
  return request2({
    url: '/cloud/data-center/tran/data/expertSales/hour',
    method: 'POST',
    data
  })
}

// 成交额
export function getQmv(data) {
  return request2({
    url: '/cloud/data-center/tran/data/gmv',
    method: 'POST',
    data
  })
}
// 成交额当天
export function getQmv1(data) {
  return request2({
    url: '/cloud/data-center/tran/data/gmv/hour',
    method: 'POST',
    data
  })
}
// 成交订单
export function getQmvOrder(data) {
  return request2({
    url: '/cloud/data-center/tran/data/gmv/order',
    method: 'POST',
    data
  })
}
// 直播带货销售净额
export function getLiveBroadcast(data) {
  return request2({
    url: '/cloud/data-center/tran/data/liveBroadcast',
    method: 'POST',
    data
  })
}
// 直播带货销售净额
export function getLiveBroadcast1(data) {
  return request2({
    url: '/cloud/data-center/tran/data/liveBroadcast/hour',
    method: 'POST',
    data
  })
}
// 销售净额
export function getProfitSale(data) {
  return request2({
    url: '/cloud/data-center/tran/data/profitSale',
    method: 'POST',
    data
  })
}
// 退款金额
export function getRefundAmount(data) {
  return request2({
    url: '/cloud/data-center/tran/data/refund/amount',
    method: 'POST',
    data
  })
}
// 退款金额
export function getRefundAmount1(data) {
  return request2({
    url: '/cloud/data-center/tran/data/refund/amount/hour',
    method: 'POST',
    data
  })
}
// 退款订单
export function getRefundOrder(data) {
  return request2({
    url: '/cloud/data-center/tran/data/refund/order',
    method: 'POST',
    data
  })
}
// 自然成交销售净额
export function getUnexpertSale(data) {
  return request2({
    url: '/cloud/data-center/tran/data/unexpert/sale',
    method: 'POST',
    data
  })
}
// 自然成交销售净额
export function getUnexpertSale1(data) {
  return request2({
    url: '/cloud/data-center/tran/data/unexpert/sale/hour',
    method: 'POST',
    data
  })
}
// 渠道售卖报表
export function getSellTotalData(data) {
  return request2({
    url: '/cloud/data-center/orderData/sellTotalData',
    method: 'POST',
    data
  })
}

// 根据渠道获取商店报表
export function getShopDataTotal(data) {
  return request2({
    url: '/cloud/data-center/orderData/getShopDataTotal',
    method: 'POST',
    data
  })
}
// 根据渠道获取商店报表折线图
export function getShopDataDayTotal(data) {
  return request2({
    url: '/cloud/data-center/orderData/getShopDataDayTotal',
    method: 'POST',
    data
  })
}
// 渠道售卖明细报表
export function getSellDetailTotalData(data) {
  return request2({
    url: '/cloud/data-center/orderData/sellDetailTotalData',
    method: 'POST',
    data
  })
}
// 渠道售卖报表(右侧折线图)
export function getSellTotalDayData(data) {
  return request2({
    url: '/cloud/data-center/orderData/sellTotalDayData',
    method: 'POST',
    data
  })
}
// 部门数据报表
export function getDeptTotalData(data) {
  return request2({
    url: '/cloud/data-center/orderData/deptTotalData',
    method: 'POST',
    data
  })
}
// 部门数据折线图
export function getDeptTotalDayData(data) {
  return request2({
    url: '/cloud/data-center/orderData/deptTotalDayData',
    method: 'POST',
    data
  })
}

// 成员业绩报表
export function getPersonTotalData(data) {
  return request2({
    url: '/cloud/data-center/orderData/personTotalData',
    method: 'POST',
    data
  })
}

// 成员退款业绩报表
export function getPersonRefundTotalData(data) {
  return request2({
    url: '/cloud/data-center/orderData/personTotalData/refund',
    method: 'POST',
    data
  })
}

// 成员业绩统计
export function getPersonTotalCount(data) {
  return request2({
    url: '/cloud/data-center/orderData/personTotalCount',
    method: 'POST',
    data
  })
}

// 人员业绩明细报表
export function getPersonTotalDetailData(data) {
  return request2({
    url: '/cloud/data-center/orderData/personTotalDetailData',
    method: 'POST',
    data
  })
}
// 操作日志
export function getLogsList(params) {
  // return request2({
  return edataUserApi({
    url: '/system/logs/list',
    method: 'get',
    params
  })
}

// 查询订单补齐数据
export function getComplementOrderPage(params) {
  return request2({
    url: '/cloud/center/complement/order/page',
    method: 'post',
    data: params
  })
}

export function getLxUrl(params) {
  return request({
    url: '/goods/order/getExportTaskDTO',
    method: 'get',
    params
  })
}

// 订单校验
export function checkOrderComplement(params) {
  return request2({
    url: '/cloud/center/complement/order/check',
    method: 'get',
    params
  })
}

// 提交漏单补单
export function submitComplement(params) {
  return request2({
    url: '/cloud/center/complement/order/confirm',
    method: 'post',
    data: params
  })
}

// 订单未关联列表
export function orderUnAssociateList(params) {
  return request2({
    url: '/cloud/admin/product/unassociated/page',
    method: 'get',
    params
  })
}

// 渠道退款金额
export function getTabRefundAmount(data) {
  return request2({
    url: 'cloud/data-center/orderData/sellTotalData/channel/refund',
    method: 'POST',
    data
  })
}

// 渠道占比退款金额
export function sellTotalDataRefundUsingPOST(data) {
  return request2({
    url: 'cloud/data-center/order-data-board-controller/sellTotalDataRefundUsingPOST',
    method: 'POST',
    data
  })
}

// 渠道业绩
export function getChannelData(data) {
  return request2({
    url: '/cloud/data-center/orderData/sellTotalData/channel/pay/amount',
    method: 'POST',
    data
  })
}

// 渠道店铺业绩
export function getShopData(data) {
  return request2({
    url: '/cloud/data-center/orderData/sellTotalData/shop/pay/amount',
    method: 'POST',
    data
  })
}

// 渠道店铺业绩
export function getShopDataRefund(data) {
  return request2({
    url: '/cloud/data-center/orderData/sellTotalData/shop/refund',
    method: 'POST',
    data
  })
}

// 店铺订单来源
export function getOrderSourceData(data) {
  return request2({
    url: '/cloud/data-center/orderData/sellTotalData/shop/orderSource/pay/amount',
    method: 'POST',
    data
  })
}

// 店铺退款订单来源
export function getOrderSourceRefundData(data) {
  return request2({
    url: '/cloud/data-center/orderData/sellTotalData/shop/orderSource/refund',
    method: 'POST',
    data
  })
}

// 查询是否企业管理员或者部门管理员
export function getSystemUserRole() {
  // return request2({
  return edataUserApi({
    url: '/system/user/manger/role',
    method: 'GET'
  })
}
// 认领订单
export function addClueByManuallyOrder(data) {
  return request2({
    url: '/cloud/edata-sale/clue/addClueByManuallyOrder',
    method: 'POST',
    data
  })
}

// 删除自己的订单
export function deleteMyOrder(params) {
  return request2({
    url: '/cloud/admin/goods/order/delOrder',
    method: 'POST',
    data: params
  })
}

// 订单补齐列表导出
export function getComplementOrderPageExport(params) {
  return request4({
    url: '/cloud/center/export/complement/order/export',
    method: 'post',
    responseType: 'blob',
    data: params
  })
}

// 订单补齐模板下载接口
export function getModalOrderExport() {
  return request2({
    url: '/cloud/center/export/complement/order/download',
    method: 'get'
  })
}

// 订单补齐导入接口
export function importComOrder(params) {
  return request2({
    url: '/cloud/center/export/complement/order/importComOrder',
    method: 'post',
    data: params
  })
}

// 导出伏羲云发货商品发货单
export function exportDouAppGiftOrder(params) {
  return request2({
    url: '/cloud/admin/goods/order/exportDouAppGiftOrder',
    method: 'GET',
    params
  })
}

// 订单详情查询客户收货信息，物流动态
export function orderDetailLogistics(params) {
  return request2({
    url: '/cloud/admin/goods/order/detail/logistics',
    method: 'GET',
    params
  })
}

// 前沿一键审批接口
export function postToReviewAll(params) {
  return request2({
    url: '/cloud/admin/audit/records/addAuditRecordsBatches',
    method: 'post',
    data: params
  })
}

/** 查询扫码预支付单列表 */
export function getQrcodeOrderPage(params) {
  return request2({
    url: '/cloud/edata-order/offline-qrcode-order/page',
    method: 'get',
    params
  })
}

/** 补充扫码预支付单的用户信息 */
export function qrcodeOrderConfirmUser(params) {
  return request2({
    url: '/cloud/edata-order/offline-qrcode-order/confirm-user-info',
    method: 'post',
    data: params
  })
}

/** 搜索用户信息 */
export function searchUser(params) {
  return request2({
    url: '/cloud/edata-user/sysUser/searchUser',
    method: 'get',
    params
  })
}

/** 修改预存订单备注商品 */
export function modifyPrestore(params) {
  return request2({
    url: '/cloud/admin/order-deposit-goods/modify',
    method: 'post',
    data: params
  })
}

/** 转让订单 */
export function transferQrcode(params) {
  return request2({
    url: '/cloud/edata-order/offline-qrcode-order/transfer',
    method: 'post',
    data: params
  })
}
/** 订单转让配置 */
export function transferCfonfig(params) {
  return request2({
    url: '/cloud/edata-order/offline-qrcode-order/transfer-config',
    method: 'get',
    params
  })
}
/** 修改线下扫码录单的优惠原因 */
export function modifyDiscount(params) {
  return request2({
    url: '/cloud/edata-order/offline-qrcode-order/modify-discount-reason',
    method: 'post',
    data: params
  })
}

/** 订单认领（批量） */
export function orderClaims(params) {
  return request({
    url: '/goods/order/orderClaims',
    method: 'post',
    data: params
  })
}
