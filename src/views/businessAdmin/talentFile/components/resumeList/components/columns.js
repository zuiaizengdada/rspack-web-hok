import moment from 'moment'

export function getColumns() {
  return [
    {
      prop: 'name',
      label: '姓名',
      type: 'text',
      visible: true,
      disable: false
    },
    {
      prop: 'phone',
      label: '手机号',
      type: 'slot',
      visible: true,
      disable: false
    },
    {
      prop: 'source',
      label: '来源',
      type: 'slot',
      visible: true,
      disable: false,
      minWidth: 50
    },
    {
      prop: 'positionName',
      label: '岗位',
      type: 'text',
      visible: true,
      disable: false
    },
    {
      prop: 'resumeUrl',
      label: '简历',
      type: 'slot',
      visible: true,
      disable: false,
      minWidth: 40
    },
    {
      prop: 'hrbpId',
      label: 'HRBPID',
      type: 'text',
      visible: false,
      disable: false
    },
    {
      prop: 'hrbpName',
      label: 'HRBP',
      type: 'text',
      visible: true,
      disable: false
    },
    {
      prop: 'storageTime',
      label: '入库时间',
      type: 'text',
      visible: true,
      disable: false,
      render: row => {
        return moment(row.storageTime).format('YYYY-MM-DD HH:mm:ss')
      },
      minWidth: 80
    },
    {
      prop: 'moveInReason',
      label: '移入原因',
      type: 'text',
      visible: true,
      disable: false
    },
    {
      prop: 'action',
      label: '操作',
      type: 'slot',
      visible: true,
      disable: true,
      minWidth: 100
    }
  ]
}
