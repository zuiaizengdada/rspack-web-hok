export function getColumns() {
  return [
    {
      prop: 'deptName',
      label: '部门名称',
      width: 180,
      visible: true
    },
    {
      prop: 'followUserName',
      label: '跟进人姓名',
      width: 120,
      visible: true
    },
    {
      prop: 'jobStatus',
      label: '在职状态',
      type: 'slot',
      width: 120,
      visible: true
    },
    {
      prop: 'receptionStatus',
      label: '分配状态',
      type: 'slot',
      width: 120,
      visible: true
    },
    {
      prop: 'curClueNum',
      label: '已分配人数',
      width: 160,
      visible: true
    },
    {
      prop: 'maxClueNum',
      label: '分配最大线索数',
      type: 'slot',
      width: 160
    },
    {
      prop: 'createTime',
      label: '加入时间',
      width: 160,
      visible: true
    },
    {
      prop: 'updateTime',
      label: '更新时间',
      visible: true
    },
    {
      width: 90,
      fixed: 'right',
      prop: 'action',
      label: '操作',
      type: 'slot',
      visible: true
    }
  ]
}
