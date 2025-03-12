
const examineStatusOptions = [
  {
    value: 0,
    label: '待初审'
  },
  {
    value: 1,
    label: '待复审'
  },
  {
    value: 2,
    label: '审核失败'
  },
  {
    value: 3,
    label: '审核成功'
  }
]
const examineNodeOptions = [
  {
    value: 0,
    label: '发起审核'
  },
  {
    value: 1,
    label: '初审'
  },
  {
    value: 2,
    label: '复审'
  }
]
const columns = [
  {
    prop: 'id',
    label: '认领编号',
    width: '50px'
  },
  {
    prop: 'orderNo',
    label: '订单号',
    attrs: {
      'show-overflow-tooltip': true
    }
  },
  {
    prop: 'newTeacherName',
    label: '认领人'
  },
  {
    prop: 'createdAt',
    type: 'slot',
    label: '认领时间'
  },
  {
    prop: 'claimReason',
    label: '认领备注',
    attrs: {
      'show-overflow-tooltip': true
    }
  },
  {
    prop: 'examineStatus',
    label: '审批状态',
    width: '120px',
    type: 'slot'
  },
  {
    prop: 'operate',
    type: 'slot',
    width: '80px',
    label: '操作'
  }
]
const formConfig = {
  ref: null,
  refText: 'fm',
  formData: {
    orderNo: '',
    examineStatus: '',
    time1ortime2: 'time1',
    time1ortime2Val: ['', ''],
    time1: ''
  },
  operatorSpan: 24,
  optionsObj: {
    examineStatus: examineStatusOptions
  },
  fieldList: [
    {
      prop: 'orderNo',
      label: '订单号',
      cpn: 'el-input',
      className: ['children-ml0']
    },
    {
      prop: 'examineStatus',
      label: '审批状态',
      cpn: 'el-select',
      selectOption: {
        label: 'label',
        value: 'value'
      },
      className: ['children-ml0']
    },
    {
      prop: 'time1ortime2',
      minWidth: 400,
      slotName: 'time1ortime2',
      className: ['children-ml0']
    }
  ]
}
export { columns, formConfig, examineStatusOptions, examineNodeOptions }
