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
    prop: 'auditStatus',
    label: '审核状态',
    width: 180,
    type: 'slot'
  },
  {
    prop: 'operate',
    type: 'slot',
    label: '操作'
  }
]
const formConfig = {
  ref: null,
  formData: {
    orderLabel: 'couponName',
    orderValue: undefined,
    couponType: undefined
  },
  optionsObj: {
    couponType: [
      { label: '全部', value: '' },
      { label: '商品券', value: 1 },
      { label: '直播专享券', value: 3 }
    ]
  },
  operatorSpan: 6,
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
      prop: 'createdBy',
      label: '创建人',
      slotName: 'createdBy',
      className: ['children-ml0']
    }
  ]
}
export { columns, formConfig }
