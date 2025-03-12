export const feesOpts = {
  form: {
    ref: null,
    formData: {
      status: '',
      time: ['', ''],
      user: 'userId',
      userValue: '',
      shareUserId: '',
      shareUserName: ''
    },
    operatorSpan: 6,
    optionsObj: {
      tenantId: [],
      status: [
        { label: '全部', value: '' },
        { label: '未支付', value: 1 },
        { label: '已支付', value: 2 }
      ],
      useOption: [
        { label: '用户昵称', value: 'userId' },
        { label: '手机号', value: 'phone' }
      ]
    },
    fieldList: [
      {
        prop: 'orderNo',
        label: '订单号',
        cpn: 'el-input',
        className: ['children-ml0']
      },
      {
        prop: 'status',
        label: '订单状态',
        cpn: 'el-select',
        className: ['children-ml0']
      },
      {
        prop: 'time',
        label: '支付时间',
        cpn: 'el-date-picker',
        bind: {
          type: 'daterange',
          rangeSeparator: '至',
          startPlaceholder: '开始月份',
          endPlaceholder: '结束月份'
        },
        className: ['children-ml0']
      },
      {
        prop: 'user',
        label: '选择',
        slotName: 'user',
        className: ['children-ml0']
      },
      {
        prop: 'goodsName',
        label: '商品名称',
        cpn: 'el-input',
        className: ['children-ml0']
      },
      {
        prop: 'shareUserId',
        label: '邀约用户',
        slotName: 'shareUserId',
        className: ['children-ml0']
      }
    ]
  },
  table: {
    columns: [
      {
        prop: 'orderNo',
        type: 'slot',
        label: '订单号',
        minWidth: 180
      },
      {
        prop: 'status',
        type: 'slot',
        label: '订单状态',
        minWidth: 142
      },
      {
        prop: 'productName',
        type: 'text',
        label: '商品名',
        minWidth: 260
      },
      {
        prop: 'payerTotal',
        type: 'slot',
        label: '支付金额',
        minWidth: 142
      },
      {
        prop: 'shareUser',
        type: 'slot',
        label: '邀约用户',
        minWidth: 142
      },
      {
        prop: 'createTime',
        type: 'text',
        label: '创建时间',
        minWidth: 150
      },
      {
        prop: 'payTime',
        type: 'text',
        label: '支付时间',
        minWidth: 150
      },
      {
        prop: 'userName',
        type: 'text',
        label: '用户昵称',
        minWidth: 150
      },
      { prop: 'action', type: 'slot', label: '操作', disable: false, visible: true, fixed: 'right' }
    ],
    slotArr: ['action', 'orderNo', 'payerTotal', 'status', 'shareUser']
  }
}
