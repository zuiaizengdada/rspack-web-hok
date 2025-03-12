
export function getColumns() {
  return [
    {
      prop: 'index',
      label: '排行榜',
      type: 'text',
      visible: true
    },
    {
      prop: 'id',
      label: '问题关键词',
      type: 'text',
      visible: true
    },
    {
      prop: 'keywordCount',
      label: '相关问题总数',
      type: 'text',
      visible: true
    },
    {
      prop: 'action',
      label: '操作',
      type: 'slot',
      visible: true
    }
  ]
}
