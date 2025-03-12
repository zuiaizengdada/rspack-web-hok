import moment from 'moment'
const renderTearch = (row) => {
  if (!row) return
  if (row.liveModel === 'PERSON_LIVE') {
    const arr = row.teacherInfoDtoList
    if (!arr) {
      return ''
    }
    const value = arr.filter(v => v.teacherRole === 0).reduce((pre, next) => {
      next && (pre = `${pre}${pre ? '、' : ''}${next.teacherName}`)
      return pre
    }, '')
    return value
  } else if (row.liveModel === 'AI_LIVE') {
    return row.videoTeacherName
  } else {
    return ''
  }
}

export function getColumns() {
  return [
    {
      prop: 'name',
      label: '直播名称',
      width: 140
    },
    {
      prop: 'videoTeacherName',
      label: '主讲老师',
      width: 180,
      slotFn: (row) => renderTearch(row)
    },
    {
      prop: 'liveModel',
      label: '直播模式',
      type: 'slot',
      width: 120
    },
    {
      prop: 'teacherNames',
      label: '助教',
      slotFn: (row) => row.teacherInfoDtoList?.filter(i => i.teacherRole === 1).map(i => i.teacherName).join('、')
    },
    {
      prop: 'startTime',
      label: '开播时间',
      width: 160,
      slotFn: (row) => moment(row.startTime).format('YYYY-MM-DD HH:mm:ss')
    },
    {
      prop: 'createTime',
      label: '加入时间',
      width: 160,
      visible: true
    },
    {
      width: 90,
      prop: 'action',
      fixed: 'right',
      label: '操作',
      type: 'slot',
      visible: true
    }
  ]
}
