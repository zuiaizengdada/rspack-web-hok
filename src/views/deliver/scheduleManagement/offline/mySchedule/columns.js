import moment from 'moment'
// 成本核算状态
export const costCheckStatus = {
  1: '待录入',
  2: '待确认',
  3: '已确认'
}
// 班期状态
export const scheduleStatus = {
  1: '未开班',
  2: '已开班',
  3: '已完结'
}
export function getColumns() {
  return [
    {
      prop: 'goodsNameList',
      label: '课程名称',
      type: 'slot',
      width: '270px',
      visible: true
    },
    {
      prop: 'scheduleNum',
      label: '班期',
      type: 'slot',
      width: '200px',
      visible: true
    },
    {
      prop: 'capacity',
      label: '容纳人数',
      type: 'text',
      visible: true
    },
    {
      prop: 'sessionCount',
      label: '场次',
      type: 'text',
      visible: true
    },
    {
      prop: 'scheduleStatus',
      label: '班期状态',
      type: 'slot',
      visible: true
    },
    {
      prop: 'enrollNum',
      label: '报名人数',
      type: 'text',
      visible: true
    },
    {
      prop: 'deleveryedNum',
      label: '交付人数',
      type: 'text',
      visible: true
    },
    {
      prop: 'totalCost',
      label: '班期成本',
      type: 'slot',
      visible: true
    },
    {
      prop: 'expectProfit',
      label: '预期利润',
      type: 'slot',
      visible: true
    },
    {
      prop: 'costCheckStatus',
      label: '成本核算状态',
      type: 'slot',
      width: '120px',
      visible: true
    },
    {
      prop: 'deliveryEndTime',
      label: '交付日期',
      width: 290,
      type: 'text',
      slotFn: (h) => {
        if (h.deliveryStartTime) {
          return moment(h.deliveryStartTime).format('YYYY-MM-DD') + '~' + moment(h.deliveryEndTime).format('YYYY-MM-DD')
        } else {
          return ''
        }
      },
      visible: true
    },
    {
      fixed: 'right',
      width: '220px',
      prop: 'action',
      label: '操作',
      type: 'slot'
    }
  ]
}
