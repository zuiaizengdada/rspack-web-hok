const columns = [
  {
    prop: 'couponNo',
    label: '优惠券ID'
  },
  {
    prop: 'couponName',
    label: '优惠券名称'
  },
  {
    prop: 'discountMethod',
    label: '券类型',
    type: 'slot'
  },
  {
    prop: 'issueCount',
    label: '发放数量'
  },
  {
    prop: 'useStartTime',
    label: '券有效期',
    type: 'slot'
  },
  {
    prop: 'claimStartTime',
    label: '领取时间',
    type: 'slot'
  },
  {
    prop: 'couponContent',
    label: '优惠内容',
    type: 'slot'
  },
  {
    prop: 'operate',
    type: 'slot',
    label: '操作'
  }
]
const formConfig = {
  ref: null
}
export { columns, formConfig }
