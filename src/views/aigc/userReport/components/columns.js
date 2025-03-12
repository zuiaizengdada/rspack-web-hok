const reportsTypeMap = {
  1: '有害/不安全',
  2: '涉政不当言论',
  3: '色情低俗',
  4: '谩骂攻击',
  5: '违反犯罪',
  99: '其他'
}

export function getColumns() {
  return [
    { prop: 'userAccount', label: '举报用户账号', type: 'slot', visible: true },
    {
      prop: 'reportsType',
      label: '举报类型',
      type: 'text',
      visible: true,
      render: row => reportsTypeMap[row.reportsType]
    },
    {
      prop: 'content',
      label: '举报内容',
      type: 'text',
      visible: true
    },
    {
      prop: 'assistantName',
      label: '被举报助手',
      type: 'text',
      visible: true
    },
    {
      prop: 'originalContent',
      label: '消息原文',
      type: 'text',
      visible: true
    },
    {
      prop: 'createTime',
      label: '举报时间',
      type: 'text',
      visible: true
    },
    {
      prop: 'handleStatus',
      label: '处理状态',
      type: 'text',
      visible: true,
      render: row => (row.handleStatus ? '已处理' : '未处理')
    },
    {
      prop: 'action',
      width: '140px',
      label: '操作',
      type: 'slot',
      visible: true
    }
  ]
}
