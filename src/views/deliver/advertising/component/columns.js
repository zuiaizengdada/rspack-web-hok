import { filtersMoneyByZero } from '@/filters/index'
export const refundFlagStatus = {
  1: '未退款',
  2: '已退款'
}
export function getColumns() {
  return [
    {
      disable: true,
      width: '240px',
      fixed: 'left',
      prop: 'transactionId',
      label: '支付流水号',
      type: 'text',
      visible: true
    },
    {
      prop: 'channelSourceName',
      width: '98px',
      label: '渠道',
      type: 'text',
      visible: true
    },
    {
      prop: 'adPlatformName',
      label: '投放平台',
      width: '126px',
      type: 'slot',
      visible: true
    },
    {
      prop: 'phone',
      label: '手机号码',
      width: '133px',
      type: 'slot',
      visible: true
    },
    {
      prop: 'payTime',
      label: '支付时间',
      width: '161px',
      type: 'text',
      visible: true
    },
    {
      prop: 'payerTotal',
      label: '支付金额',
      width: '98px',
      type: 'text',
      visible: true,
      slotFn: (row) => { return filtersMoneyByZero(row.payerTotal) }
    },
    {
      prop: 'refundFlag',
      label: '是否退款',
      width: '98px',
      type: 'slot',
      visible: true
    },
    {
      prop: 'refundTime',
      label: '退款时间',
      width: '161px',
      type: 'text',
      visible: true
    },
    {
      prop: 'orderNo',
      width: '240px',
      label: '获课订单ID',
      type: 'text',
      visible: true
    },
    {
      prop: 'goodsName',
      label: '课程名称',
      'min-width': '232px',
      type: 'text',
      visible: true
    },
    {
      width: '68px',
      visible: true,
      disable: true,
      fixed: 'right',
      prop: 'action',
      label: '操作',
      type: 'slot'
    }
  ]
}
