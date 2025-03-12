import moment from 'moment'

export function getColumns() {
  return [
    {
      fixed: 'left',
      width: '50px',
      prop: 'index',
      label: '序号',
      type: 'text',
      visible: true,
      disable: true
    },
    {
      prop: 'sealName',
      label: '印章名称',
      type: 'text',
      visible: true,
      fixed: 'left',
      disable: false
    },
    {
      prop: 'sealDesc',
      label: '印章说明',
      type: 'text',
      visible: true,
      disable: false
    },
    {
      prop: 'sealType',
      label: '印章类型',
      type: 'slot',
      visible: true,
      disable: false
    },

    {
      prop: 'companyName',
      label: '所属公司',
      type: 'text',
      visible: true,
      disable: false
    },
    {
      prop: 'createUserName',
      label: '上传人',
      type: 'text',
      visible: true,
      disable: false
    },
    {
      prop: 'createTime',
      label: '上传时间',
      type: 'text',
      visible: true,
      disable: false,
      render: row =>
        row.createTime ? moment(row.createTime).format('YYYY-MM-DD') : ''
    },
    {
      prop: 'status',
      label: '状态',
      type: 'slot',
      visible: true,
      disable: false
    },
    {
      prop: 'action',
      label: '操作',
      type: 'slot',
      visible: true,
      disable: true,
      minWidth: 100,
      fixed: 'right'
    }
  ]
}
