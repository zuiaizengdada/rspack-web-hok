export default [
  {
    prop: 'goodsId',
    label: '商品ID',
    visible: true,
    showInSearch: true,
    formProps: {
      formAliasName: 'goodsId'
    }
  },
  {
    prop: 'goodsTypeName',
    label: '课程类型',
    visible: true
  },
  {
    prop: 'goodsName',
    label: '商品名称',
    type: 'text',
    visible: true,
    showInSearch: true
  },
  {
    prop: 'createTime',
    label: '加入时间',
    type: 'text',
    visible: true
  },
  {
    width: 90,
    fixed: 'right',
    prop: 'action',
    label: '操作',
    type: 'slot',
    visible: true
  }
]
