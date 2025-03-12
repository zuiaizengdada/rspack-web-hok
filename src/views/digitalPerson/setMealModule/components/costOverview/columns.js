const columns = [
  {
    prop: 'orgName',
    label: '机构名称'
  },
  {
    prop: 'payTotalMap',
    label: '充值总金额'
  },
  {
    prop: 'characterPurchaseSum',
    label: '形象克隆（充值/赠送/消费）'
  },
  {
    prop: 'voiceTrainingSum',
    label: '声音克隆（充值/赠送/消费）'
  },
  {
    prop: 'videoDurationSum',
    width: 260,
    label: '视频时长（充值/赠送/消费）分钟'
  },
  {
    prop: 'lastTime',
    label: '最近一次充值时间'
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
    orgId: undefined, // 机构
    times: undefined // 日期
  },
  optionsObj: {},
  operatorSpan: 12,
  fieldList: [
    {
      prop: 'orgId',
      label: '机构',
      slotName: 'orgId',
      className: ['children-ml0']
    },
    {
      prop: 'times',
      label: '时间',
      cpn: 'el-date-picker',
      bind: {
        type: 'daterange',
        clearable: true,
        rangeSeparator: '至',
        startPlaceholder: '请输入',
        format: 'yyyy-MM-dd',
        'value-format': 'yyyy-MM-dd',
        endPlaceholder: '请输入'
      },
      className: ['children-ml0']
    }
  ]
}
export { columns, formConfig }
