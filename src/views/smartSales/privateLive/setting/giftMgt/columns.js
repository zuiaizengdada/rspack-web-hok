const columns = [
  {
    prop: 'id',
    label: '赠品ID'
  },
  {
    prop: 'giveawayType',
    label: '赠品类型',
    type: 'slot'
  },
  {
    prop: 'giveawayPrice',
    type: 'slot',
    label: '价格'
  },
  {
    prop: 'updateTime',
    type: 'slot',
    label: '操作时间'
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
    giveawayId: undefined,
    giveawayType: undefined
  },
  optionsObj: {
    giveawayType: [
      {
        value: 1,
        label: '虚拟奖品'
      },
      {
        value: 2,
        label: '实物奖品'
      },
      {
        value: 3,
        label: '优惠券'
      }
    ]
  },
  operatorSpan: 12,
  fieldList: [
    {
      prop: 'giveawayId',
      label: '赠品ID',
      cpn: 'el-input',
      className: ['children-ml0']
    },
    {
      prop: 'giveawayType',
      label: '奖品类型',
      eventHandler: {},
      cpn: 'el-select',
      selectOption: {
        label: 'label',
        value: 'value'
      },
      className: ['children-ml0']
    }
  ]
}
export { columns, formConfig }
