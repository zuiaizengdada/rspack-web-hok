import moment from 'moment'

export const statusOption = [
  { label: '启动', value: 1 },
  { label: '禁用', value: 2 }
]

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
      prop: 'fileName',
      label: '文件名称',
      type: 'slot',
      visible: true,
      disable: false
    },
    {
      prop: 'companyList',
      label: '关联公司',
      type: 'slot',
      visible: true,
      disable: false
    },
    {
      prop: 'deptChainNameList',
      label: '关联部门',
      type: 'slot',
      visible: true,
      disable: false,
      minWidth: 122
    },
    {
      prop: 'positionList',
      label: '关联岗位',
      type: 'slot',
      visible: true,
      disable: false
    },
    {
      prop: 'electronicSealList',
      label: '关联印章名称',
      type: 'slot',
      visible: true,
      disable: false
    },
    {
      prop: 'canDownload',
      label: '员工是否可下载',
      type: 'slot',
      visible: true,
      disable: false
    },

    {
      prop: 'uploadTime',
      label: '上传时间',
      type: 'text',
      visible: true,
      disable: false,
      render: row =>
        row.uploadTime ? moment(row.uploadTime).format('YYYY-MM-DD') : ''
    },
    {
      prop: 'uploadName',
      label: '操作人',
      type: 'text',
      visible: true,
      disable: false
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
      minWidth: 140
    }
  ]
}
