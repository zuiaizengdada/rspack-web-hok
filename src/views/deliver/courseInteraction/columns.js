const partCondOptions = [
  {
    value: '',
    label: '全部'
  },
  {
    value: 0,
    label: '任何人'
  },
  {
    value: 1,
    label: '购买课程'
  }
]
const statusOptions = [
  {
    value: '',
    label: '全部'
  },
  {
    value: 0,
    label: '未发布'
  },
  {
    value: 1,
    label: '已发布'
  }
]
const columns = [
  {
    prop: 'title',
    label: '打卡标题',
    attrs: {
      'show-overflow-tooltip': true
    }
  },
  {
    prop: 'taskCount',
    label: '作业数'
  },
  {
    prop: 'userCount',
    type: 'slot',
    label: '打卡人数/次数'
  },
  {
    prop: 'partCond',
    type: 'slot',
    label: '参与条件'
  },
  {
    prop: 'isPublish',
    type: 'slot',
    label: '状态'
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
    title: undefined,
    time1ortime2: 'time1',
    isPublish: '',
    partCond: '',
    time1ortime2Val: ['', ''],
    time1: ''
  },
  operatorSpan: 24,
  optionsObj: {
    partCond: partCondOptions,
    isPublish: statusOptions
  },
  fieldList: [
    {
      prop: 'title',
      label: '打卡标题',
      cpn: 'el-input',
      className: ['children-ml0']
    },
    {
      prop: 'partCond',
      label: '参与条件',
      cpn: 'el-select',
      eventHandler: {},
      selectOption: {
        label: 'label',
        value: 'value'
      },
      className: ['children-ml0']
    },
    {
      prop: 'isPublish',
      label: '状态',
      cpn: 'el-select',
      eventHandler: {},
      selectOption: {
        label: 'label',
        value: 'value'
      },
      className: ['children-ml0']
    }
    // {
    //   prop: 'time1ortime2',
    //   slotName: 'time1ortime2',
    //   className: ['children-ml0']
    // }
  ]
}
const certificateColumns = [
  {
    prop: 'name',
    label: '证书名称',
    attrs: {
      'show-overflow-tooltip': true
    }
  },
  {
    prop: 'type',
    type: 'slot',
    label: '证书类型'
  },
  {
    prop: 'status',
    type: 'slot',
    label: '证书状态'
  },
  {
    prop: 'scheduleName',
    label: '关联内容'
  },
  {
    prop: 'count',
    label: '领取人数'
  },
  {
    prop: 'createdAt',
    type: 'slot',
    label: '创建时间'
  },
  {
    prop: 'operate',
    type: 'slot',
    label: '操作'
  }
]
const certificateTypeOptions = [
  {
    value: '',
    label: '全部'
  },
  {
    value: 1,
    label: '班级证书'
  }
]
const certificateStatusOptions = [
  {
    value: '',
    label: '全部'
  },
  {
    value: 0,
    label: '未启用'
  },
  {
    value: 1,
    label: '已启用'
  }
]
const certificateFrom = {
  ref: null,
  refText: 'fm',
  formData: {
    name: undefined,
    status: undefined,
    type: undefined
  },
  operatorSpan: 24,
  optionsObj: {
    type: certificateTypeOptions,
    status: certificateStatusOptions
  },
  fieldList: [
    {
      prop: 'name',
      label: '证书名称',
      cpn: 'el-input',
      className: ['children-ml0']
    },
    {
      prop: 'type',
      label: '证书类型',
      cpn: 'el-select',
      eventHandler: {},
      selectOption: {
        label: 'label',
        value: 'value'
      },
      className: ['children-ml0']
    },
    {
      prop: 'status',
      label: '证书状态',
      cpn: 'el-select',
      eventHandler: {},
      selectOption: {
        label: 'label',
        value: 'value'
      },
      className: ['children-ml0']
    }
  ]
}
export {
  columns,
  formConfig,
  certificateColumns,
  certificateFrom,
  partCondOptions,
  statusOptions,
  certificateStatusOptions,
  certificateTypeOptions
}
