export const statusOption = {
  1: '禁用',
  2: '启用'
}

// 用途 / 模板类型
export const smsTypeOption = [
  { label: '验证码', value: 1 },
  { label: '通知', value: 2 },
  { label: '营销推广', value: 3 }
]

export function getColumns() {
  return [
    { prop: 'name', label: '渠道商名称', type: 'text' },
    { prop: 'activeFlag', label: '状态', type: 'slot' },
    { prop: 'weight', label: '权重', type: 'text', render: (row) => { return row.weight + '%' } },
    { prop: 'smsTypeVos', label: '用途', type: 'text', render: (row) => { return renderSmsTypeVos(row.smsTypeVos) } },
    { width: '150px', prop: 'action', label: '操作', type: 'slot' }
  ]
}

function renderSmsTypeVos(arr) {
  if (!arr || arr.length === 0) {
    return ''
  }
  return arr.reduce((pre, next, index) => {
    pre += `${index === 0 ? '' : '/'}${next.name}`
    return pre
  }, '')
}
