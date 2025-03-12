import { operateTypes, statuss } from '@/utils/enum'

import { parseTime } from '@/utils/index'
export function getColumns() {
  return [
    {
      prop: 'id',
      label: 'ID',
      type: 'text',
      visible: true
    },
    {
      prop: 'nickName',
      width: '200px',
      label: '用户',
      type: 'slot',
      visible: true
    },
    {
      prop: 'phoneNumber',
      type: 'text',
      label: '用户手机',
      width: '145px',
      visible: true,
      isPhone: true,
      phoneType: 'platformUserId'
    },
    {
      prop: 'email',
      width: '220px',
      label: '用户邮箱',
      type: 'slot'
    },
    {
      prop: 'operateType',
      label: '类型',
      width: '60px',
      type: 'text',
      visible: true,
      slotFn: (row) => operateTypes[row.operateType]
    },
    {
      prop: 'operateAmount',
      label: '金额',
      type: 'slot',
      visible: true
    },
    {
      prop: 'operateHokAmount',
      label: '获课币',
      type: 'slot',
      visible: true
    },
    {
      prop: 'status',
      label: '状态',
      type: 'text',
      visible: true,
      slotFn: (row) => statuss[row.status]
    },
    {
      prop: 'remark',
      label: '备注',
      type: 'text',
      'show-overflow-tooltip': true,
      width: '170px',
      visible: true
    },
    {
      prop: 'createTime',
      label: '操作时间',
      visible: true,
      width: '150px',
      slotFn: (row) => parseTime(row.createTime)
    },
    {
      prop: 'checkTime',
      label: '审核时间',
      width: '150px',
      slotFn: (row) => parseTime(row.checkTime)
    }
  ]
}
