export default [
  {
    prop: 'orderPlatform',
    label: '渠道',
    visible: true

  },
  {
    prop: 'shopName',
    label: '店铺',
    visible: true,
    showInSearch: true,
    valueType: 'cascader',
    formProps: {
      labelWidth: '50px',
      options: [],
      filterable: true,
      formAliasName: 'shopList',
      props: {
        checkStrictly: false,
        emitPath: true

      }
    }
  },
  {
    prop: 'productId',
    label: '商品ID',
    type: 'text',
    visible: true,
    showInSearch: true
  },
  {
    prop: 'orderName',
    label: '商品名称',
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
