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
      prop: 'scheduleNum',
      label: '班级名称',
      type: 'text',
      width: '270px',
      visible: true
    },
    {
      prop: 'goodsNameList',
      label: '课程名称',
      type: 'slot',
      visible: true
    },
    {
      prop: 'capacity',
      label: '计划人数',
      type: 'text',
      visible: true,
      width: '100px'
    },
    {
      prop: 'scheduleStatus',
      label: '班级状态',
      type: 'text',
      visible: true,
      // 班期状态，1未开班，2已开班，3已完结
      slotFn: h => {
        if (h.scheduleStatus) {
          return scheduleStatus[h.scheduleStatus]
        } else {
          return ''
        }
      }
    },
    {
      prop: 'enrollNum',
      label: '入班人数',
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
      prop: 'deliveryStartTime',
      label: '开班时间',
      type: 'text',
      width: '200px',
      visible: true
    },
    {
      prop: 'createByName',
      label: '创建人',
      type: 'text',
      visible: true
    },
    {
      prop: 'createTime',
      label: '创建时间',
      type: 'text',
      width: '200px',
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
