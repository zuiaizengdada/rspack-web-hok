const columns = [
  {
    prop: 'couponName',
    label: '优惠券信息',
    width: 240,
    type: 'slot'
  },
  {
    prop: 'couponContent',
    label: '优惠内容',
    width: 160,
    type: 'slot'
  },
  {
    prop: 'couponType',
    label: '优惠券类型',
    type: 'slot',
    width: 160
  },
  {
    prop: 'createdByName',
    label: '创建人'
  },
  {
    prop: 'issueCount',
    label: '领取量/发放量',
    width: 160,
    type: 'slot'
  },
  {
    prop: 'auditStatus',
    label: '审核状态',
    width: 180,
    type: 'slot'
  },
  {
    prop: 'useStatus',
    label: '状态',
    width: 80,
    type: 'slot'
  },
  {
    prop: 'claimStartTime',
    label: '领取/使用时间',
    width: 350,
    type: 'slot'
  },
  {
    prop: 'writeOffCount',
    label: '已使用'
  },
  {
    prop: 'operate',
    type: 'slot',
    width: 200,
    fixed: 'right',
    label: '操作'
  }
]
const formConfig = {
  ref: null,
  formData: {
    orderLabel: 'couponName',
    orderValue: undefined,
    couponType: undefined,
    useStatus: undefined,
    discountMethod: undefined,
    time1: undefined
  },
  optionsObj: {
    couponType: [
      { label: '全部', value: '' },
      { label: '商品券', value: 1 },
      { label: '直播专享券', value: 3 }
    ],
    discountMethod: [
      { label: '全部', value: '' },
      { label: '指定商品满减券', value: 1 },
      { label: '指定商品直减券', value: 2 },
      { label: '指定商品折扣券', value: 3 }
    ],
    useStatus: [
      { label: '全部', value: '' },
      { label: '待开始', value: 1 },
      { label: '生效中', value: 2 },
      { label: '已过期', value: 3 },
      { label: '已作废', value: 4 }
    ]
  },
  operatorSpan: 12,
  fieldList: [
    {
      prop: 'orderLabel',
      slotName: 'orderLabel',
      className: ['children-ml0']
    },
    {
      prop: 'couponType',
      label: '优惠券类型',
      cpn: 'el-select',
      placeholder: '请选择',
      eventHandler: {},
      selectOption: {
        label: 'label',
        value: 'value'
      },
      className: ['children-ml0']
    },
    {
      prop: 'discountMethod',
      label: '优惠方式',
      cpn: 'el-select',
      placeholder: '请选择',
      eventHandler: {},
      selectOption: {
        label: 'label',
        value: 'value'
      },
      className: ['children-ml0']
    },
    {
      prop: 'useStatus',
      label: '优惠券状态',
      cpn: 'el-select',
      placeholder: '请选择',
      eventHandler: {},
      selectOption: {
        label: 'label',
        value: 'value'
      },
      className: ['children-ml0']
    },
    {
      prop: 'time1',
      label: '领取时间',
      cpn: 'el-date-picker',
      eventHandler: {},
      bind: {
        type: 'datetimerange',
        rangeSeparator: '至',
        startPlaceholder: '请输入',
        format: 'yyyy-MM-dd HH:mm:ss',
        'value-format': 'yyyy-MM-dd HH:mm:ss',
        endPlaceholder: '请输入'
      },
      className: ['children-ml0']
    }
  ]
}
export { columns, formConfig }
