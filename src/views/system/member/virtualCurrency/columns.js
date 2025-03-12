
import { operateTypes, statuss } from '@/utils/enum'
import { parseTime } from '@/utils/index'
export function getColumns() {
  return [
    {
      prop: 'id',
      label: 'ID',
      width: '60px',
      type: 'text',
      visible: true
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
    },
    {
      prop: 'action',
      label: '操作',
      type: 'slot',
      width: '100px'
    }
  ]
}
