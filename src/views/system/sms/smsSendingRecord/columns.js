// 模板搜索
export const searchTemOptions = [
  { label: '手机号码', value: 'phone' },
  { label: '发送短信内容', value: 'content' }
]

export const receiveStatusOption = {
  1: '未知',
  2: '未送达',
  3: '已送达'
}

export function getColumns() {
  return [
    {
      width: '150px',
      prop: 'channelName',
      label: '渠道商名称',
      type: 'text',
      visible: true,
      disable: true
    },
    {
      width: '150px',
      prop: 'smsTypeName',
      label: '模板类型',
      type: 'text',
      visible: true
    },
    {
      width: '150px',
      prop: 'phone',
      label: '手机号码',
      type: 'text',
      isPhone: true,
      phoneType: 'sms',
      visible: true
    },
    { prop: 'content', label: '发送短信内容', type: 'slot', visible: true },
    {
      width: '150px',
      prop: 'receiveStatus',
      label: '到达状态',
      type: 'slot',
      visible: true
    },
    {
      width: '200px',
      prop: 'sendTime',
      label: '发送时间',
      type: 'text',
      visible: true
    }
  ]
}
