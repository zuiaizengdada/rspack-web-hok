const columns = [
  {
    attrs: {
      type: 'selection'
    }
  },
  {
    prop: 'organizationId',
    label: '机构ID',
    width: 160,
    attrs: {
      'show-overflow-tooltip': true
    }
  },
  {
    prop: 'name',
    label: '名称'
  },
  {
    prop: 'companyAbbreviation',
    label: '简称',
    width: 160,
    attrs: {
      'show-overflow-tooltip': true
    }
  },
  {
    prop: 'type',
    label: '类型'
  },
  {
    prop: 'packageName',
    label: '入驻模块',
    width: 180,
    attrs: {
      'show-overflow-tooltip': true
    }
  },
  {
    prop: 'administratorName',
    label: '管理员姓名'
  },
  {
    prop: 'administratorPhone',
    label: '手机号'
  },
  {
    prop: 'applicationTime',
    label: '申请时间'
  },
  {
    prop: 'createTime',
    label: '入驻时间'
  }
]
const formConfig = {
  ref: null,
  formData: {
    companyName: undefined, // 名称
    companyAbbreviation: undefined // 简称
  },
  operatorSpan: 12,
  optionsObj: {},
  fieldList: [
    {
      prop: 'companyName',
      label: '名称',
      cpn: 'el-input',
      className: ['children-ml0']
    },
    {
      prop: 'companyAbbreviation',
      label: '状态',
      cpn: 'el-input',
      className: ['children-ml0']
    }
  ]
}
export { columns, formConfig }
