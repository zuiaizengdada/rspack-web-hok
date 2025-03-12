// 订单状态： 1:未支付 2:支付成功 3:超时已关闭 4:用户已取消 5:退款中 6:部分退款 7:全部退款 8:交易结束 9:没有向第三方发起支付请求 10:退款金额异常
const orderStatus = [
  // { label: '未支付', value: 1 },
  { label: '支付成功', value: 2 },
  // { label: '超时已关闭', value: 3 },
  // { label: '用户已取消', value: 4 },
  // { label: '退款中', value: 5 },
  { label: '部分退款', value: 6 },
  { label: '全部退款', value: 7 }
  // { label: '交易结束', value: 8 },
  // { label: '没有向第三方发起支付请求', value: 9 },
  // { label: '退款金额异常', value: 10 }
]
// 订单渠道：1:抖店 2:快手小店 4:微店 7:小鹅通 10:视频号小店 11:枫叶小店 12:抖音小程序 13:直播间 14:平台自营 15:微信小程序 16:小红书 17:线下录单 18:B站 20:百度小店
const orderChannels = [
  // { label: '抖店', value: 1 },
  // { label: '快手小店', value: 2 },
  // { label: '微店', value: 4 },
  // { label: '小鹅通', value: 7 },
  // { label: '视频号小店', value: 10 },
  // { label: '枫叶小店', value: 11 },
  { label: '抖音小程序', value: 12 },
  { label: '直播间', value: 13 },
  { label: '平台自营', value: 14 },
  { label: '微信小程序', value: 15 }
  // { label: '小红书', value: 16 },
  // { label: '线下录单', value: 17 },
  // { label: 'B站', value: 18 },
  // { label: '百度小店', value: 20 }
]
// 结算状态：1、待结算| 2、结算中| 3、已结算| 4、分账失败| 5、结算失败
const settleStatuss = [
  { label: '待结算', value: 1 },
  { label: '结算中', value: 2 },
  { label: '已结算', value: 3 },
  { label: '分账失败', value: 4 },
  { label: '结算失败', value: 5 }
]
// 结算类型：1、普通结算|2、结算前退款|3、结算后退款|4、补缴保证金
const settleTypes = [
  { label: '普通结算', value: 1 },
  { label: '结算前退款', value: 2 },
  { label: '结算后退款', value: 3 },
  { label: '补缴保证金', value: 4 }
]
// 结算账户类型：1、银行账户|2、资金帐户
const settleAccountTypes = [
  { label: '银行账户', value: 1 },
  { label: '资金帐户', value: 2 },
  { label: '抖音可提现账户', value: 3 }
]
const bizTypes = [
  { label: '充值', value: 1 },
  { label: '结算后退款', value: 2 },
  { label: '提现', value: 3 },
  { label: '订单结算', value: 4 }
]
const mapSettleTypes = val => {
  return settleTypes.find(item => item.value === val)?.label || '-'
}
const mapSettleStatuss = val => {
  return settleStatuss.find(item => item.value === val)?.label || '-'
}
const mapSettleAccountTypes = val => {
  return settleAccountTypes.find(item => item.value === val)?.label || '-'
}
const mapOrderChannel = val => {
  return orderChannels.find(item => item.value === val)?.label || '-'
}
const mapOrderStatus = val => {
  return orderStatus.find(item => item.value === val)?.label || '-'
}
const mapbizTypes = val => {
  return bizTypes.find(item => item.value === val)?.label || '-'
}

// 映射金额为元且保留两位小数，千进制以,分隔
const mapAmount = val => {
  return val
    ? (val / 100).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    : '0.00'
}
export {
  mapAmount,
  orderStatus,
  orderChannels,
  settleAccountTypes,
  settleStatuss,
  settleTypes,
  bizTypes,
  mapOrderChannel,
  mapOrderStatus,
  mapSettleAccountTypes,
  mapSettleStatuss,
  mapSettleTypes,
  mapbizTypes
}
