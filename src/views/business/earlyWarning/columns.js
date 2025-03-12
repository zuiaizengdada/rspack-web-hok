// import { getOptionsValue } from '@/filters/index'
export const channelSourceType = {
  1: '抖店',
  2: '快手',
  3: '获客',
  4: '微店'
}
export const afterSalestatusType = {
  1: '未处理',
  2: '退款中',
  3: '已退款',
  4: '已关闭'
}
export const warningOrderStatusType = {
  1: '预警中',
  2: '已关闭'
}
export function getColumns() {
  return [
    {
      prop: 'orderNo',
      label: '订单号',
      type: 'slot',
      visible: true
    },
    {
      prop: 'channelSource',
      width: '60px',
      label: '渠道',
      type: 'slot',
      visible: true
    },
    {
      prop: 'userPhone',
      width: '180px',
      label: '手机号码',
      type: 'slot',
      visible: true
    },
    {
      prop: 'goodsName',
      width: '300px',
      label: '获课课程名称',
      type: 'text',
      visible: true
    },
    {
      prop: 'payerTotal',
      label: '订单金额',
      type: 'text',
      visible: true,
      slotFn: (row) => (row.payerTotal / 100).toFixed(2)
    },
    {
      prop: 'afterSalestatus',
      label: '售后状态',
      visible: true,
      slotFn: (row) => afterSalestatusType[row.afterSalestatus]
    },
    {
      prop: 'warningReason',
      label: '预警原因',
      type: 'text',
      visible: true
    },
    {
      prop: 'followers',
      label: '跟进人',
      type: 'slot',
      visible: true
    },
    {
      prop: 'warningOrderStatus',
      label: '状态',
      visible: true,
      slotFn: (row) => warningOrderStatusType[row.warningOrderStatus]
    },
    {
      prop: 'action',
      label: '操作',
      type: 'slot',
      width: '160px'
    }
  ]
}
