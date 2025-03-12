import store from '@/store'

const renderLiveDuration = row => {
  if (!row) {
    return ''
  }
  if (row < 60000) {
    return '1分钟'
  }
  return Math.floor(row / 1000 / 60) + '分钟'
}

const $getdictName = (key, value) => {
  return (
    store?.getters?.dictList[key]?.find(item => item?.value === value)?.label ||
    ''
  )
}
export default [
  {
    prop: 'liveRoomName',
    label: '直播间名称',
    width: 140,
    'show-overflow-tooltip': true
  },
  {
    prop: 'liveRoomMode',
    label: '直播模式',
    type: 'text',
    width: 120,
    slotFn: row => $getdictName('liveRoomMode', row.liveRoomMode)
  },
  {
    prop: 'recordVideoName',
    label: '录制视频',
    type: 'text',
    width: 160,
    visible: true
  },
  {
    prop: 'liveRoomStartTime',
    label: '开播时间',
    width: 160,
    visible: true
  },
  {
    prop: 'liveRoomTime',
    label: '直播时长',
    width: 120,
    visible: true,
    slotFn: row => renderLiveDuration(row.liveRoomTime)
  },
  {
    prop: 'listenClassTime',
    label: '停留时间(分)',
    width: 120,
    visible: true,
    slotFn: row => renderLiveDuration(row.listenClassTime)
  }
]
