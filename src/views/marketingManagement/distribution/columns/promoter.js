import { auditStatus, userStatus } from '@/utils/enum'

import { parseTime } from '@/utils/index'
export function getColumns() {
  return [
    {
      prop: 'action',
      label: '操作',
      type: 'slot',
      visible: true
    },
    {
      prop: 'promoteCode',
      label: '推广员码',
      type: 'text',
      width: '200',
      visible: true
    },
    {
      prop: 'name',
      label: '推广员',
      width: '200',
      type: 'slot',
      visible: true
    },
    {
      prop: 'auditStatus',
      slotFn: (row) => auditStatus[row.auditStatus],
      label: '审核状态',
      type: 'text',
      visible: true
    },
    {
      prop: 'realName',
      label: '姓名',
      type: 'text',
      visible: true
    },
    {
      prop: 'phone',
      label: '绑定手机号',
      width: '120',
      type: 'text',
      visible: true
    },
    {
      prop: 'bindUserNum',
      label: '累计用户',
      type: 'text',
      visible: true
    },
    {
      prop: 'userStatus',
      label: '状态',
      width: '80',
      slotFn: (row) => userStatus[row.userStatus],
      type: 'text',
      visible: true
    },
    {
      prop: 'createTime',
      label: '加入时间',
      width: '160',
      slotFn: (row) => parseTime(row.createTime),
      type: 'text',
      visible: true
    }

  ]
}
