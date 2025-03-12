export const columns = [
  {
    prop: 'employeeName',
    label: '员工',
    type: 'slot'
  },
  {
    prop: 'freePerformance',
    label: '免费业绩(单量)',
    type: 'slot',
    sortable: true
  },
  {
    prop: 'directAmount',
    label: '直接付费(单量)',
    type: 'slot',
    sortable: true
  },
  {
    prop: 'indirectAmount',
    label: '间接付费(单量)',
    type: 'slot',
    sortable: true
  },
  {
    prop: 'totalPerformance',
    label: '总业绩(单量)',
    type: 'slot',
    sortable: true
  },
  {
    prop: 'currentMonthPerformance',
    label: '本月业绩',
    type: 'slot'
  },
  {
    prop: 'linkMonthPerformance',
    label: '上月业绩',
    type: 'slot'
  },
  {
    prop: 'linkRatio',
    label: '增长',
    type: 'slot'
  }
]
