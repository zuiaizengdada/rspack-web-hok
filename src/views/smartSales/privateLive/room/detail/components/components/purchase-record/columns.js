const columns = [
  {
    prop: 'studentName',
    type: 'slot',
    label: '学员昵称',
    width: 120
  },
  {
    prop: 'studentPhone',
    type: 'slot',
    label: '手机号码',
    width: 180
  },
  {
    prop: 'email',
    type: 'slot',
    label: '邮箱',
    width: 240
  },
  {
    prop: 'teacherName',
    label: '邀请人'
  },
  {
    prop: 'goodsName',
    attrs: {
      'show-overflow-tooltip': true
    },
    label: '购买课程'
  },
  {
    prop: 'goodsPrice',
    label: '商品总价'
  },
  {
    prop: 'discountsFee',
    label: '优惠金额'
  },
  {
    prop: 'payMoney',
    label: '实付金额'
  },
  {
    prop: 'orderNo',
    label: '下单单号'
  },
  {
    prop: 'orderTime',
    label: '下单时间',
    width: 180
  },
  {
    prop: 'orderStatus',
    type: 'slot',
    label: '订单状态',
    width: 120
  },
  {
    prop: 'payTime',
    label: '支付时间',
    width: 180
  },
  {
    prop: 'paymentType',
    label: '支付方式'
  },
  {
    prop: 'transactionId',
    label: '流水号'
  }
]
const formConfig = {
  ref: null,
  formData: {
    type1: 'studentPhone',
    time: '',
    orderStatus: '',
    teacherId: '',
    existInviteTeacher: true
  },
  optionsObj: {},
  operatorSpan: 21,
  fieldList: [
    {
      prop: 'type1',
      label: '',
      slotName: 'type1',
      className: ['children-ml0']
    },
    {
      prop: 'time',
      label: '下单时间',
      cpn: 'el-date-picker',
      eventHandler: {},
      span: 7,
      bind: {
        type: 'datetimerange',
        size: 'mini',
        rangeSeparator: '至',
        startPlaceholder: '请输入',
        'default-time': ['00:00:00', '23:59:59'],
        format: 'yyyy-MM-dd HH:mm:ss',
        'value-format': 'yyyy-MM-dd HH:mm:ss',
        endPlaceholder: '请输入'
      },
      className: ['children-ml0']
    },
    {
      prop: 'orderStatus',
      label: '订单状态',
      slotName: 'orderStatus',
      className: ['children-ml0']
    },
    {
      prop: 'teacherId',
      label: '邀请人',
      span: 5,
      slotName: 'teacherId',
      className: ['children-ml0']
    },
    {
      prop: 'existInviteTeacher',
      label: '仅查看邀约学员',
      cpn: 'el-checkbox',
      eventHandler: {},
      span: 3,
      className: ['children-ml0', 'not-bd']
    }
  ]
}
const orderStatusObj = {
  1: {
    type: 'error',
    name: '未支付'
  },
  2: {
    type: 'success',
    name: '支付成功'
  },
  3: {
    type: 'error',
    name: '超时已关闭'
  },
  4: {
    type: 'error',
    name: '用户已取消'
  },
  5: {
    type: 'warning',
    name: '退款中'
  },
  6: {
    type: 'warning',
    name: '部分退款'
  },
  7: {
    type: 'success',
    name: '全部退款'
  },
  8: {
    type: 'success',
    name: '交易结束'
  },
  9: {
    type: 'warning',
    name: '没有向第三方发起支付请求'
  },
  10: {
    type: 'error',
    name: '退款金额异常'
  },
  11: {
    type: 'success',
    name: '部分付款'
  },
  12: {
    type: 'error',
    name: '转课关闭'
  }
}
export { columns, formConfig, orderStatusObj }
