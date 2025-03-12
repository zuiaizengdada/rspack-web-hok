const columns = [
  {
    prop: 'title',
    label: '标题',
    attrs: {
      'show-overflow-tooltip': true
    }
  },
  {
    prop: 'startTime',
    label: '有效期',
    width: '350px',
    type: 'slot'
  },
  {
    prop: 'punchTimes',
    label: '打卡次数'
  },
  {
    prop: 'likeCount',
    label: '点赞数'
  },
  {
    prop: 'commentCount',
    label: '点评次数'
  },
  {
    prop: 'featureCount',
    label: '精选数'
  },
  {
    prop: 'operate',
    type: 'slot',
    label: '操作'
  }
]
const formConfig = {
  ref: null,
  refText: 'fm',
  formData: {
    title: undefined
  },
  operatorSpan: 24,
  optionsObj: {
  },
  fieldList: [
    {
      prop: 'title',
      label: '标题',
      cpn: 'el-input',
      className: ['children-ml0']
    }
  ]
}
export { columns, formConfig }
