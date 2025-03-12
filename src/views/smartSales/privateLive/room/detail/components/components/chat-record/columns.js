const columns = [
  {
    prop: 'fromUserName',
    label: '用户昵称',
    type: 'slot',
    width: 160
  },
  {
    prop: 'msgTime',
    label: '聊天时间',
    type: 'slot',
    width: 180,
    attrs: {
      sortable: true
    }
  },
  {
    prop: 'msgBody',
    type: 'slot',
    label: '聊天内容'
  }
]
const formConfig = {
  ref: null,
  formData: {
    userName: undefined, // 用户昵称
    inviter: undefined // 查询内容
  },
  operatorSpan: 12,
  fieldList: [
    {
      prop: 'userName',
      label: '学员昵称',
      cpn: 'el-input',
      className: ['children-ml0']
    },
    {
      prop: 'content',
      label: '查询内容',
      cpn: 'el-input',
      className: ['children-ml0']
    }
  ]
}
export { columns, formConfig }
