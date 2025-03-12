function getNameByList(list, key) {
  if (list && list.length) {
    return list.map(i => i[key]).join('、')
  }
  return ''
}
export function getColumns() {
  return [
    {
      prop: 'adChannel',
      label: '渠道',
      type: 'text',
      visible: true
    },
    {
      prop: 'adAccount',
      label: '投放账号',
      type: 'text',
      visible: true
    },
    {
      prop: 'adAccountId',
      label: '投放账号id',
      type: 'text',
      visible: true
    },
    {
      prop: 'adPlan',
      label: '投放计划',
      type: 'text',
      'show-overflow-tooltip': true,
      width: 200,
      visible: true,
      slotFn: (row) => {
        return row.planType === 1 ? '全部计划' : getNameByList(row.planExtendDoList, 'adPlan')
      }
    },
    {
      prop: 'city',
      label: '城市',
      type: 'text',
      visible: true,
      'show-overflow-tooltip': true,
      width: 200,
      slotFn: (row) => {
        return row.cityType === 1 ? '全部城市' : getNameByList(row.cituExtendDoList, 'city')
      }
    },
    {
      prop: 'action',
      label: '操作',
      fixed: 'right',
      width: '90',
      type: 'slot',
      visible: true
    }
  ]
}
