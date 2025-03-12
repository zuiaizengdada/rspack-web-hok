export function getColumns() {
  return [
    {
      prop: 'name',
      label: '公司名称',
      type: 'text',
      visible: true,
      disable: false
    },
    {
      prop: 'peopleCount',
      label: '人数',
      type: 'text',
      visible: true,
      disable: false,
      minWidth: 20
    },
    {
      prop: 'businessScope',
      label: '经营范围',
      type: 'text',
      visible: true,
      disable: false,
      'show-overflow-tooltip': true
    },
    {
      prop: 'status',
      label: '状态',
      type: 'slot',
      visible: true,
      disable: false,
      minWidth: 50
    },
    {
      prop: 'action',
      label: '操作',
      type: 'slot',
      visible: true,
      disable: true,
      minWidth: 30
    }
  ]
}
