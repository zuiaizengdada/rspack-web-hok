const columns = [
  {
    prop: 'orgName',
    label: '机构名称',
    width: 160
  },
  {
    prop: 'orderNo',
    label: '订单号'
  },
  {
    prop: 'payTotalMap',
    label: '充值金额'
  },
  {
    prop: 'orderTypeName',
    label: '类型'
  },
  {
    prop: 'orderStatus',
    type: 'slot',
    label: '订单状态'
  },
  {
    prop: 'identifier',
    label: '识别码'
  },
  {
    prop: 'content',
    width: 160,
    label: '内容',
    attrs: {
      'show-overflow-tooltip': true
    }
  },
  {
    prop: 'createUser',
    label: '充值人'
  },
  {
    prop: 'createTime',
    label: '订单创建时间'
  },
  {
    prop: 'confirmUser',
    label: '确认人'
  },
  {
    prop: 'confirmTime',
    label: '确认时间'
  },
  {
    prop: 'operate',
    type: 'slot',
    width: 160,
    label: '操作'
  }
]
const formConfig = {
  ref: null,
  formData: {
    orgId: undefined, // 机构名称
    orderNo: undefined, // 订单号
    identifier: undefined, // 识别码
    orderStatus: undefined, // 订单状态
    times: undefined // 订单时间
  },
  operatorSpan: 24,
  optionsObj: {},
  fieldList: [
    {
      prop: 'orgId',
      label: '机构',
      slotName: 'orgId',
      className: ['children-ml0']
    },
    {
      prop: 'identifier',
      label: '识别码',
      cpn: 'el-input',
      className: ['children-ml0']
    },
    {
      prop: 'orderNo',
      label: '订单号',
      cpn: 'el-input',
      className: ['children-ml0']
    },
    {
      prop: 'orderStatus',
      label: '订单状态',
      slotName: 'orderStatus',
      className: ['children-ml0']
    },
    {
      prop: 'times',
      label: '订单时间',
      cpn: 'el-date-picker',
      bind: {
        type: 'datetimerange',
        rangeSeparator: '至',
        startPlaceholder: '请输入',
        'default-time': ['00:00:00', '23:59:59'],
        format: 'yyyy-MM-dd HH:mm:ss',
        'value-format': 'yyyy-MM-dd HH:mm:ss',
        endPlaceholder: '请输入'
      },
      className: ['children-ml0']
    }
  ]
}
export { columns, formConfig }
