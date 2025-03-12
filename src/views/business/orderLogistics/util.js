
const channelSourceList = [
  { label: '直播间', value: 13 },
  { label: '平台自营', value: 14 },
  { label: '微信小程序', value: 15 },
  { label: '抖音小程序', value: 12 }
]
// 物流状态： -1:未付款, 0：订单审核，1:打单配货，2：验货，3：称重，4：待发货，5：财审，8：已发货，9：交易成功,11:异常结束,12:异常处理,13:配货中,14:预售,15:打包,16:待处理(待处理页面),10：交易关闭,19:拣货
const logisticsStatusList = [
  { label: '未付款', value: -1 },
  { label: '订单审核', value: 0 },
  { label: '打单配货', value: 1 },
  { label: '验货', value: 2 },
  { label: '称重', value: 3 },
  { label: '待发货', value: 4 },
  { label: '财审', value: 5 },
  { label: '已发货', value: 8 },
  { label: '交易成功', value: 9 },
  { label: '异常结束', value: 11 },
  { label: '异常处理', value: 12 },
  { label: '配货中', value: 13 },
  { label: '预售', value: 14 },
  { label: '打包', value: 15 },
  { label: '待处理', value: 16 },
  { label: '交易关闭', value: 10 },
  { label: '拣货', value: 19 }
]
// 订单状态(1:未支付 2:支付成功 3:超时已关闭 4:用户已取消 5:退款中 6:部分退款 7:全部退款 8:交易结束 9:没有向第三方发起支付请求 10:退款金额异常)
const orderStatusList = [
  { label: '未支付', value: 1 },
  { label: '支付成功', value: 2 },
  { label: '超时已关闭', value: 3 },
  { label: '用户已取消', value: 4 },
  { label: '退款中', value: 5 },
  { label: '部分退款', value: 6 },
  { label: '全部退款', value: 7 },
  { label: '交易结束', value: 8 },
  { label: '没有向第三方发起支付请求', value: 9 },
  { label: '退款金额异常', value: 10 }
]
// 映射金额为元且保留两位小数，千进制以,分隔
const mapAmount = val => {
  return val
    ? (val / 100).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    : '0.00'
}

export { logisticsStatusList, orderStatusList, mapAmount, channelSourceList }
