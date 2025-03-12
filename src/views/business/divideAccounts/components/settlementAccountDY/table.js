const columns = [
  {
    prop: 'tradeTime',
    label: '动账时间'
  },
  {
    prop: 'paymentNo',
    label: '流水号'
  },
  {
    prop: 'inOutTypeName',
    label: '收支类型'
  },
  {
    prop: 'bizType',
    label: '动账类型'
  },
  {
    prop: 'amount',
    label: '动账金额（元）'
  },
  {
    prop: 'amountBefore',
    label: '期初余额（元）'
  },
  {
    prop: 'balance',
    label: '期末余额（元）'
  },
  {
    prop: 'orderNo',
    label: '关联订单号',
    type: 'slot'
  },
  {
    prop: 'remark',
    label: '备注'
  }
]
export { columns }
