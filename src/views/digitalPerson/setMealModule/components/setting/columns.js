const columns = [
  {
    prop: 'packageName',
    label: '套餐名称',
    width: 160,
    attrs: {
      'show-overflow-tooltip': true
    }
  },
  {
    prop: 'packagePriceMap',
    label: '套餐价格'
  },
  {
    prop: 'packageContent',
    label: '套餐内容',
    width: 160,
    attrs: {
      'show-overflow-tooltip': true
    }
  },
  {
    prop: 'isDeleted',
    label: '状态'
  },
  {
    prop: 'availableName',
    label: '可用范围',
    width: 160,
    attrs: {
      'show-overflow-tooltip': true
    }
  },
  {
    prop: 'packageDesc',
    label: '套餐备注'
  },
  {
    prop: 'updateTime',
    label: '操作时间'
  },
  {
    prop: 'updateUser',
    label: '操作人'
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
    packageName: undefined, // 套餐名称
    isDeleted: undefined // 状态
  },
  operatorSpan: 12,
  optionsObj: {
    isDeleted: [
      {
        value: 0,
        label: '启用'
      },
      {
        value: 1,
        label: '停用'
      }
    ]
  },
  fieldList: [
    {
      prop: 'packageName',
      label: '套餐名称',
      cpn: 'el-input',
      className: ['children-ml0']
    },
    {
      prop: 'isDeleted',
      label: '状态',
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
