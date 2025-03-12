const columns = [
  {
    prop: 'orgName',
    label: '机构名称',
    width: 160
  },
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
    prop: 'remark',
    label: '备注',
    width: 160,
    attrs: {
      'show-overflow-tooltip': true
    }
  },
  {
    prop: 'createUser',
    label: '操作人'
  }
]
const formConfig = {
  ref: null,
  formData: {
    orgId: undefined, // 机构名称
    remark: undefined, // 备注
    times: undefined // 消费时间
  },
  optionsObj: {},
  fieldList: [
    {
      prop: 'orgId',
      label: '机构名称',
      slotName: 'orgId',
      className: ['children-ml0']
    },
    {
      prop: 'remark',
      label: '备注',
      cpn: 'el-input',
      className: ['children-ml0']
    },
    {
      prop: 'times',
      label: '消费时间',
      cpn: 'el-date-picker',
      bind: {
        type: 'datetimerange',
        rangeSeparator: '至',
        startPlaceholder: '请输入',
        'default-time': ['00:00:00', '23:59:59'],
        format: 'yyyy-MM-dd HH:mm',
        'value-format': 'yyyy-MM-dd HH:mm',
        endPlaceholder: '请输入'
      },
      className: ['children-ml0']
    }
  ]
}
export { columns, formConfig }
