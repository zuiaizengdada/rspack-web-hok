
export function getColumns() {
  return [
    {
      prop: 'suitableTeachers',
      label: '渠道',
      type: 'text',
      visible: true
    },
    {
      prop: 'put',
      label: '投放账号',
      type: 'text',
      visible: true
    },
    {
      prop: 'put',
      label: '投放计划',
      type: 'text',
      visible: true
    },
    {
      prop: 'put',
      label: '城市',
      type: 'text',
      visible: true
    },
    {
      prop: 'action',
      label: '操作',
      fixed: 'right',
      width: '90',
      type: 'slot',
      visible: true
    }
  ]
}
