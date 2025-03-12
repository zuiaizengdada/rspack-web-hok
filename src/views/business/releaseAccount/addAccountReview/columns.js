
import { parseTime } from '@/utils/index'
// 投放平台
export const discriminateOption = [
  { label: '未关联', value: 0 },
  { label: '关联账号', value: 1 },
  { label: '按广告组', value: 2 },
  { label: '广告计划', value: 3 }
]

export function getColumns() {
  return [
    {
      prop: 'advertiserName',
      label: '投放账号名称',
      type: 'text'
    },
    { prop: 'advertiserId', label: '投放账号ID', type: 'text' },
    {
      prop: 'discriminate',
      label: '业绩区分',
      type: 'text',
      render: row => {
        return getOptionsValue(row.discriminate, discriminateOption)
      }
    },
    {
      prop: 'staffName',
      label: '关联员工',
      type: 'text',
      render: row => {
        return row.staffRelations.map(m => m.staffName).join(',')
      }
    },
    { prop: 'modifiedByName', label: '最近操作人', type: 'text' },
    { prop: 'lastModified', label: '最近操作时间', type: 'text',
      slotFn: (row) => parseTime(row.lastModified) },
    { prop: 'action', label: '操作', type: 'slot' }
  ]
}

// option根据value取label
function getOptionsValue(value, arr) {
  // console.log(value, arr, 'value, arr')
  const obj = arr.find(v => v.value === value)
  if (obj) {
    return obj.label
  } else {
    return ''
  }
}
