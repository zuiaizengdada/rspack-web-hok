
const tagTypeMap = [
  {
    value: 0,
    label: '系统标签'
  },
  {
    value: 2,
    label: '业绩统计专用标签'
  },
  {
    value: 5,
    label: '直播可用'
  },
  {
    value: 6,
    label: '录单可用'
  },
  {
    value: 7,
    label: '企微侧边栏可用'
  },
  {
    value: 99,
    label: '自定义标签'
  }
]
const columns = [
  {
    prop: 'tagName',
    label: '标签名称',
    attrs: {
      'show-overflow-tooltip': true
    }
  },
  // {
  //   prop: 'tagType',
  //   label: '标签类型',
  //   type: 'slot'
  // },
  {
    prop: 'status',
    type: 'slot',
    label: '标签状态'
  },
  {
    prop: 'sort',
    label: '排序值'
  },
  {
    prop: 'createBy',
    label: '创建人'
  },
  {
    prop: 'createTime',
    type: 'slot',
    label: '创建时间'
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
    tagName: undefined
  },
  operatorSpan: 24,
  fieldList: [
    {
      prop: 'tagName',
      label: '标签名称',
      cpn: 'el-input',
      className: ['children-ml0']
    }
  ]
}
export { columns, formConfig, tagTypeMap }
