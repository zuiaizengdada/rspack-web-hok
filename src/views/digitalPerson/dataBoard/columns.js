const columns = [
  {
    prop: 'orderNo',
    label: '订单号'
  },
  {
    prop: 'payTotal',
    label: '充值金额'
  },
  {
    prop: 'orderTypeName',
    label: '类型'
  },
  {
    prop: 'orderStatus',
    label: '订单状态',
    type: 'slot'
  },
  {
    prop: 'content',
    label: '内容'
  },
  {
    prop: 'createUser',
    label: '创建人'
  },
  {
    prop: 'createTime',
    label: '订单创建时间'
  },
  {
    prop: 'operate',
    type: 'slot',
    label: '操作'
  }
]
const columns2 = [
  {
    prop: 'consumeTypeName',
    label: '消费类型'
  },
  {
    prop: 'consumeCount',
    label: '计量'
  },
  {
    prop: 'consumeContent',
    label: '消费内容'
  },
  {
    prop: 'consumeId',
    label: '消费ID'
  },
  {
    prop: 'consumeTime',
    label: '消费时间'
  },
  {
    prop: 'createUser',
    label: '操作人'
  }
]
export { columns, columns2 }
