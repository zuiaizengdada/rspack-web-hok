
import { goodsType } from '@/utils/enum'
export function getColumns() {
  return [
    {
      prop: 'action',
      label: '操作',
      type: 'slot',
      visible: true
    },
    {
      prop: 'contentName',
      label: '商品名称',
      type: 'slot',
      width: '240',
      visible: true
    },
    {
      prop: 'salePrice',
      label: '商品价格',
      slotFn: (row) => (row.salePrice / 100)?.toFixed(2),
      type: 'text',
      visible: true
    },
    {
      prop: 'shelveFlag',
      label: '上架状态',
      type: 'slot',
      visible: true
    },
    {
      prop: 'goodsType',
      slotFn: (row) => goodsType[row.goodsType],
      label: '类型',
      type: 'text',
      visible: true
    },
    {
      prop: 'sort',
      label: '排序',
      width: '250',
      type: 'slot',
      visible: true
    },
    {
      prop: 'commissionRate',
      label: '商品佣金比例',
      width: '250',
      type: 'slot',
      visible: true
    }
  ]
}
