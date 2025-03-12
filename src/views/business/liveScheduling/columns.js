import moment from 'moment'
export const liveTypeOption = {
  1: '运营直播',
  2: '老师直播',
  3: '主播直播'
}

export const liveRoomOption = [
  { label: '01', value: '01' },
  { label: '02', value: '02' },
  { label: '03', value: '03' },
  { label: '04', value: '04' },
  { label: '05', value: '05' },
  { label: '06', value: '06' },
  { label: '07', value: '07' },
  { label: '08', value: '08' },
  { label: '09', value: '09' },
  { label: '10', value: '10' },
  { label: '11', value: '11' },
  { label: '12', value: '12' },
  { label: '13', value: '13' },
  { label: '14', value: '14' },
  { label: '15', value: '15' }
]

export function getColumns() {
  return [
    { prop: 'liveCode', label: '直播编号', type: 'text', visible: true, 'min-width': '118x' },
    { prop: 'liveTimeFrom', label: '直播时间', type: 'text', visible: true, width: '265px',
      render: (row) => {
        return `${moment(row.liveTimeFrom).format('MM-DD HH:mm:ss')} 至 ${moment(row.liveTimeTo).format('MM-DD HH:mm:ss')}`
      }
    },
    // { prop: 'liveRoomId', label: '直播间', type: 'text', visible: true, width: '150px' },
    { prop: 'liveType', label: '直播类型', type: 'slot', visible: true, width: '150px', render: (row) => { return liveTypeOption[row.liveType] } },
    { prop: 'liveAccount', label: '直播账号', type: 'slot', visible: true, width: '200px' },
    { prop: 'accountOperateName', label: '账号运营', type: 'text', visible: true, width: '150px', render: (row) => { return row.accountOperateName || '暂无' } },
    { prop: 'anchorName', label: '主播', type: 'text', visible: true, width: '150px', render: (row) => { return row.anchorName || '暂无' } },
    { prop: 'controlName', label: '中控', type: 'text', visible: true, width: '150px', render: (row) => { return row.controlName || '暂无' } },
    { prop: 'liveOperateName', label: '直播运营', type: 'text', visible: true, width: '150px', render: (row) => { return row.liveOperateName || '暂无' } },
    { prop: 'advertiseName', label: '投手', type: 'text', visible: true, width: '150px', render: (row) => { return row.advertiseName || '暂无' } },
    { prop: 'liveUrl', label: '直播大屏截图', width: '120px', type: 'slot', visible: true },
    { prop: 'gmv', label: 'GMV', align: 'center', type: 'slot', visible: true },
    { prop: 'refundAmount', label: '退款金额', align: 'center', type: 'slot', visible: true },
    { prop: 'revenue', label: '营收', align: 'center', type: 'slot', visible: true },
    { prop: 'payForData', label: '付费数据', align: 'center', type: 'slot', visible: true },
    { prop: 'createdName', label: '创建者', type: 'text', visible: true, width: '150px' },
    { prop: 'createdAt', label: '创建时间', width: '180px', type: 'text', visible: true },
    { prop: 'lastModifiedAt', label: '修改时间', width: '180px', type: 'text', visible: true },
    // { prop: 'lecturerName', label: '直播老师', type: 'text', visible: true, width: '150px', render: (row) => { return row.lecturerName || '暂无' } },
    // { prop: 'liveChannel', label: '直播渠道', type: 'slot', visible: true, width: '150px' },
    { prop: 'action', width: '146px', label: '操作', type: 'slot', visible: true, fixed: 'right' }
  ]
}
