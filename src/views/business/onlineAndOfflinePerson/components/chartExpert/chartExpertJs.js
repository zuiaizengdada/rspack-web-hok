export const columns = [
  {
    prop: 'expertName',
    label: '达人',
    type: 'slot',
    width: 220
  },
  {
    prop: 'freeAmount',
    label: '免费营收(单量)',
    type: 'slot',
    sortable: true,
    width: 160
  },
  {
    prop: 'directAmount',
    label: '直接付费(单量)',
    type: 'slot',
    sortable: true,
    width: 160
  },
  {
    prop: 'indirectAmount',
    label: '间接付费(单量)',
    type: 'slot',
    sortable: true,
    width: 160
  },
  {
    prop: 'totalAmount',
    label: '总营收(单量)',
    type: 'slot',
    sortable: true,
    width: 160
  },
  {
    prop: 'refundAmount',
    label: '总退款(单量)',
    type: 'slot',
    sortable: true,
    width: 160
  },
  {
    prop: 'refundRate',
    label: '退款率',
    type: 'slot'
  },
  {
    prop: 'gmv',
    label: 'GMV',
    type: 'slot',
    sortable: true
  },
  {
    prop: 'currentMonthAmount',
    label: '本月营收',
    type: 'slot',
    sortable: true
  },
  {
    prop: 'lastMonthAmount',
    label: '上月营收'
  },
  {
    prop: 'growthPercent',
    label: '增长',
    type: 'slot'
  }
]

export const columnsOffline = [
  {
    prop: 'expertName',
    label: '达人',
    width: 220,
    type: 'slot'
  },
  {
    prop: 'freePerformance',
    label: '免费营收(单量)',
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
    type: 'slot',
    sortable: true
  },
  {
    prop: 'linkMonthPerformance',
    label: '上月业绩'
  },
  {
    prop: 'linkRatio',
    label: '增长',
    type: 'slot'
  }
]
