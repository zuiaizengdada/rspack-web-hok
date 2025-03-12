import moment from 'moment'
export function getColumns() {
  return [
    {
      prop: 'phone',
      label: '手机号码',
      type: 'text',
      visible: true
    },
    {
      prop: 'pushSMS',
      label: '推送短信/二维码/添加企微',
      width: 200,
      type: 'slot',
      visible: true
    },
    {
      prop: 'corpUserName',
      label: '企微昵称(助教)',
      type: 'text',
      visible: true
    },
    {
      prop: 'callTime',
      label: '调用API时间',
      width: 140,
      type: 'text',
      visible: true,
      slotFn: (row) => row.callTime ? moment(row.callTime).format('YYYY-MM-DD HH:mm') : ''
    },
    {
      prop: 'qrCodeSendTime',
      label: '推送二维码时间',
      width: 140,
      type: 'text',
      visible: true,
      slotFn: (row) => row.qrCodeSendTime ? moment(row.qrCodeSendTime).format('YYYY-MM-DD HH:mm') : ''
    },
    {
      prop: 'addContactTime',
      label: '添加企微时间',
      width: 140,
      type: 'text',
      visible: true,
      slotFn: (row) => row.addContactTime ? moment(row.addContactTime).format('YYYY-MM-DD HH:mm') : ''
    }
  ]
}

