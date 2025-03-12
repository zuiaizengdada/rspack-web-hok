const status = { 0: '关闭', 1: '开启' }
export function getColumns() {
  return [
    {
      prop: 'title',
      label: '专题页名称',
      type: 'text',
      formProps: {
        labelWidth: '90px'
      },
      showInSearch: true
    },
    {
      prop: 'startTime',
      label: '专题页有效期',
      width: 280,
      slotFn: (row) => `${row.startTime}  ${row.isFixed === 0 ? '起有效' : '至 ' + row.endTime}`,
      type: 'text'
    },
    {
      prop: 'status',
      label: '状态',
      slotFn: (row) => status[row.status],
      type: 'text'
    },
    {
      prop: 'userName',
      label: '创建人',
      type: 'text'
    },
    {
      prop: 'createTime',
      label: '创建时间',
      type: 'text'
    },
    {
      prop: 'action',
      label: '操作',
      fixed: 'right',
      type: 'slot',
      visible: true
    }
  ]
}
