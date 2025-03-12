export function getColumns() {
  return [
    {
      prop: 'groupName',
      label: '分组名称',
      type: 'text',
      visible: true
    },
    {
      prop: 'userList',
      label: '分组人员',
      slotFn: (row) => row.userList?.map(i => i.userName)?.join('、') ?? '',
      type: 'text',
      visible: true
    },
    {
      prop: 'groupDesc',
      label: '分组说明',
      type: 'text',
      visible: true
    },
    {
      prop: 'createUserName',
      label: '创建人',
      type: 'text',
      visible: true
    },
    {
      prop: 'createTime',
      label: '创建时间',
      type: 'text',
      visible: true
    },
    {
      prop: 'action',
      label: '操作',
      fixed: 'right',
      width: '120',
      type: 'slot',
      visible: true
    }
  ]
}
