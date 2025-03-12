export function getColumns() {
  return [
    {
      fixed: 'left',
      'min-width': '200px',
      prop: 'eip',
      label: '云桌面IP',
      type: 'slot',
      'show-overflow-tooltip': true,
      visible: true,
      disable: true
    },
    {
      prop: 'ecsUserName',
      width: '145px',
      label: '云桌面账号',
      type: 'slot',
      visible: true
    },
    {
      prop: 'ecsPassword',
      width: '145px',
      label: '云桌面密码',
      type: 'slot',
      visible: true
    },
    {
      prop: 'ecsStatus',
      width: '145px',
      label: '当前状态',
      type: 'slot',
      visible: true
    },
    {
      prop: 'phoneNumber',
      width: '145px',
      label: '获课账号',
      type: 'slot',
      visible: true
    },
    {
      prop: 'nickName',
      width: '145px',
      label: '姓名',
      type: 'text',
      visible: true
    },
    {
      prop: 'staffStatus',
      width: '145px',
      label: '员工状态',
      type: 'text',
      visible: true,
      render: (row) => {
        return { 0: '在职', 1: '离职' }[row.staffStatus]
      }
    },
    {
      prop: 'dept',
      width: '145px',
      label: '部门',
      type: 'text',
      visible: true
    },
    {
      prop: 'useTime',
      width: '145px',
      label: '使用时长',
      sortable: 'custom',
      type: 'text',
      render: (row) => {
        return filterTime(row.useTime)
      },
      visible: true
    },
    {
      prop: 'useCount',
      width: '145px',
      label: '使用次数',
      sortable: 'custom',
      type: 'text',
      align: 'center',
      render: (row) => {
        return row.useCount ? row.useCount : 0
      },
      visible: true
    },
    {
      prop: 'lastUseTime',
      width: '160px',
      label: '最近使用时间',
      type: 'text',
      // render: (row) => {
      //   return moment(row.lastUseTime).format('YYYY-MM-DD hh:mm:ss')
      // },
      visible: true
    },
    {
      prop: 'createTime',
      width: '160px',
      label: '创建时间',
      type: 'text',
      // render: (row) => {
      //   return moment(row.createTime).format('YYYY-MM-DD hh:mm:ss')
      // },
      visible: true
    },
    {
      fixed: 'right',
      visible: true,
      width: '180px',
      prop: 'action',
      disable: true,
      label: '操作',
      type: 'slot'
    }
  ]
}

export function filterTime(value) {
  if (!value || typeof value !== 'number') {
    return '0秒'
  } else {
    const result = parseInt(value)
    const h = Math.floor(result / 3600) < 10 ? '0' + Math.floor(result / 3600) : Math.floor(result / 3600)
    const m = Math.floor((result / 60 % 60)) < 10 ? '0' + Math.floor((result / 60 % 60)) : Math.floor((result / 60 % 60))
    const s = Math.floor((result % 60)) < 10 ? '0' + Math.floor((result % 60)) : Math.floor((result % 60))
    return h + '时' + m + '分' + s + '秒'
  }
}
