const columns = [
  {
    prop: 'headImgUrl',
    label: '头像',
    type: 'slot'
  },
  {
    prop: 'teacherName',
    label: '员工姓名'
  },
  {
    prop: 'liveRoomAlias',
    label: '直播间名称'
  },
  {
    prop: 'teacherTel',
    type: 'slot',
    label: '手机号码'
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
    teacherId: undefined,
    teacherTel: undefined
  },
  operatorSpan: 12,
  fieldList: [
    {
      prop: 'teacherId',
      label: '员工姓名',
      slotName: 'teacherId',
      className: ['children-ml0']
    },
    {
      prop: 'teacherTel',
      label: '手机号码',
      cpn: 'el-input',
      className: ['children-ml0']
    }
  ]
}
export { columns, formConfig }
