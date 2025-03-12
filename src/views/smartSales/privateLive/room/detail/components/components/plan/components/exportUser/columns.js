const columns = [
  {
    prop: 'userName',
    label: '学员昵称'
  },
  {
    prop: 'phone',
    type: 'slot',
    label: '手机号码'
  },
  {
    prop: 'email',
    type: 'slot',
    label: '邮箱'
  },
  {
    prop: 'isAttendance',
    type: 'slot',
    label: '是否到课'
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
    keywordVal: undefined, //
    keyword: 'phone', //   学员昵称,手机号，邮箱
    isAttendance: 2, //  	是否到课
    userId: '',
    userName: ''
  },
  operatorSpan: 6,
  optionsObj: {
    isAttendance: [
      {
        value: 2,
        label: '全部'
      },
      {
        value: 1,
        label: '是'
      },
      {
        value: 0,
        label: '否'
      }
    ]
  },
  fieldList: [
    {
      prop: 'keyword',
      label: '',
      slotName: 'keyword',
      className: ['children-ml0']
    },
    {
      prop: 'isAttendance',
      label: '是否到课',
      cpn: 'el-select',
      bind: { clearable: false },
      eventHandler: {},
      selectOption: {
        label: 'label',
        value: 'value'
      },
      className: ['children-ml0']
    }
  ]
}
export { columns, formConfig }
