
const columns = [
  {
    prop: 'teacherName',
    label: 'IP姓名',
    attrs: {
      'show-overflow-tooltip': true
    }
  },
  {
    prop: 'projectName',
    label: '文件名称',
    // type: 'slot',
    attrs: {
      'show-overflow-tooltip': true
    }
  },
  {
    prop: 'projectExportedDatetime',
    type: 'slot',
    label: '导出日期'
  },
  {
    prop: 'downloadCounted',
    label: '下载次数'
  },
  {
    prop: 'projectSize',
    label: '文件大小',
    type: 'slot'
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
    projectName: undefined,
    teacherId: undefined,
    time1ortime2: 'time1',
    time1ortime2Val: ['', ''],
    time1: ''
  },
  operatorSpan: 24,
  fieldList: [
    {
      prop: 'teacherId',
      label: 'IP姓名',
      slotName: 'teacherId',
      className: ['children-ml0']
    },
    {
      prop: 'projectName',
      label: '文件名称',
      cpn: 'el-input',
      className: ['children-ml0']
    },
    {
      prop: 'time1ortime2',
      slotName: 'time1ortime2',
      className: ['children-ml0']
    }
  ]
}
export { columns, formConfig }
