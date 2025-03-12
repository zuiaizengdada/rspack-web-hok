// 账单结算
export const billingsettlementOpts = {
  form: {
    ref: null,
    formData: {
      tenantId: '', //  	机构
      orderByType: 1, // 固定 收费金额
      orderBy: 0, // 固定 倒序
      billStatus: '' // 固定 待支付
    },
    operatorSpan: 6,
    optionsObj: {
      tenantId: [{ name: '全部', organizationId: '' }],
      billStatus: []
    },
    fieldList: [
      {
        prop: 'tenantId',
        label: '机构',
        cpn: 'el-select',
        selectOption: {
          label: 'name',
          value: 'organizationId'
        },
        className: ['children-ml0']
      },
      {
        prop: 'billStatus',
        label: '结算状态',
        cpn: 'el-select',
        ind: {
          clearable: false
        },
        selectOption: {
          label: 'message',
          value: 'code'
        },
        className: ['children-ml0']
      }
    ]
  },
  table: {
    columns: [
      {
        prop: 'billCycle',
        type: 'text',
        label: '账期',
        minWidth: 142
      },
      {
        prop: 'billNo',
        type: 'slot',
        label: '账单编号',
        minWidth: 260
      },
      {
        prop: 'tenantName',
        type: 'text',
        label: '机构名称',
        minWidth: 142
      },
      {
        prop: 'status',
        type: 'slot',
        label: '状态',
        minWidth: 142
      },
      {
        prop: 'totalAmount',
        type: 'slot',
        label: '收费金额',
        minWidth: 142
      },
      {
        prop: 'discountAmount',
        type: 'slot',
        label: '优惠金额',
        minWidth: 142
      },
      {
        prop: 'payableAmount',
        type: 'slot',
        label: '应付金额',
        minWidth: 142
      },
      {
        prop: 'paidAmount',
        type: 'slot',
        label: '实付金额',
        minWidth: 142
      },
      { prop: 'action', type: 'slot', label: '操作', disable: false, visible: true, minWidth: 142, fixed: 'right' }
    ],
    slotArr: ['action', 'status', 'billNo', 'totalAmount', 'discountAmount', 'payableAmount', 'paidAmount']
  },
  ptTotalTable: [
    {
      prop: 'totalAmount',
      label: '收费金额总计',
      labelTips: '当前选择时间段，各机构所有状态账单应付金额之和。'
    },
    {
      prop: 'settledAmount',
      label: '已结算金额',
      labelTips: '当前选择时间段，各机构【已结算】账单实付金额之和。'
    },
    {
      prop: 'unsettledAmount',
      label: '待结算金额',
      labelTips: '当前选择时间段，各机构【待支付】账单应付金额总计，不包含【待制单】账单应付金额。'
    }
  ],
  totalTable: [
    {
      prop: 'totalAmount',
      label: '收费金额总计',
      labelTips: '当前选择时间段，各机构所有状态账单应付金额之和。'
    },
    {
      prop: 'settledAmount',
      label: '已结算金额',
      labelTips: '当前选择时间段，各机构【已结算】账单实付金额之和。'
    },
    {
      prop: 'unsettledAmount',
      label: '待结算金额',
      labelTips: '当前选择时间段，各机构【待支付】账单应付金额总计，不包含【待制单】账单应付金额。'
    }
  ]
}
// 费用总览
export const feesOpts = {
  // 平台机构
  form: {
    ref: null,
    formData: {
      time: [new Date(), new Date()], //  	账期
      tenantId: '', // 	机构
      billStatus: '' // 结算状态
    },
    operatorSpan: 6,
    optionsObj: {
      tenantId: [],
      billStatus: [{
        code: '',
        message: '全部'
      }]
    },
    fieldList: [
      {
        prop: 'time',
        label: '账期',
        cpn: 'el-date-picker',
        bind: {
          type: 'monthrange',
          rangeSeparator: '至',
          startPlaceholder: '开始月份',
          endPlaceholder: '结束月份'
        },
        className: ['children-ml0']
      },
      {
        prop: 'tenantId',
        label: '机构',
        cpn: 'el-select',
        selectOption: {
          label: 'name',
          value: 'organizationId'
        },
        className: ['children-ml0']
      },
      {
        prop: 'billStatus',
        label: '结算状态',
        cpn: 'el-select',
        selectOption: {
          label: 'message',
          value: 'code'
        },
        className: ['children-ml0']
      }
    ]
  },
  // 非平台机构
  unform: {
    ref: null,
    formData: {
      time: [new Date(), new Date()], //  	账期
      billStatus: '' // 	机构
    },
    operatorSpan: 6,
    optionsObj: {
      tenantId: [],
      billStatus: [{
        code: '',
        message: '全部'
      }]
    },
    fieldList: [
      {
        prop: 'time',
        label: '账期',
        cpn: 'el-date-picker',
        bind: {
          type: 'monthrange',
          rangeSeparator: '至',
          startPlaceholder: '开始月份',
          endPlaceholder: '结束月份'
        },
        className: ['children-ml0']
      },
      {
        prop: 'billStatus',
        label: '结算状态',
        cpn: 'el-select',
        selectOption: {
          label: 'message',
          value: 'code'
        },
        className: ['children-ml0']
      }
    ]
  },
  table: {
    columns: [
      {
        prop: 'billCycle',
        type: 'text',
        label: '账期',
        minWidth: 142
      },
      {
        prop: 'billNo',
        type: 'slot',
        label: '账单编号',
        minWidth: 260
      },
      {
        prop: 'tenantName',
        type: 'text',
        label: '机构名称',
        minWidth: 142
      },
      {
        prop: 'isSignProtocol',
        type: 'slot',
        label: '是否签署协议',
        minWidth: 142
      },
      {
        prop: 'status',
        type: 'slot',
        label: '状态',
        minWidth: 142
      },
      {
        prop: 'totalAmount',
        type: 'slot',
        label: '收费金额',
        minWidth: 142
      },
      {
        prop: 'discountAmount',
        type: 'slot',
        label: '优惠金额',
        minWidth: 142
      },
      {
        prop: 'payableAmount',
        type: 'slot',
        label: '应付金额',
        minWidth: 142
      },
      {
        prop: 'paidAmount',
        type: 'slot',
        label: '实付金额',
        minWidth: 142
      },
      {
        prop: 'settleTime',
        type: 'slot',
        label: '结算日期',
        minWidth: 150
      },
      { prop: 'action', type: 'slot', label: '操作', disable: false, visible: true, minWidth: 142, fixed: 'right' }
    ],
    slotArr: ['action', 'status', 'billNo', 'isSignProtocol', 'totalAmount', 'discountAmount', 'payableAmount', 'paidAmount', 'settleTime']
  },
  ptTotalTable: [
    {
      prop: 'totalAmount',
      label: '收费金额总计',
      labelTips: '当前选择时间段，各机构所有状态账单应付金额之和。'
    },
    {
      prop: 'settledAmount',
      label: '已结算金额',
      labelTips: '当前选择时间段，各机构【已结算】账单实付金额之和。'
    },
    {
      prop: 'unsettledAmount',
      label: '待结算金额',
      labelTips: '当前选择时间段，各机构【待支付】账单应付金额总计，不包含【待制单】账单应付金额。'
    }
  ],
  totalTable: [
    {
      prop: 'totalAmount',
      label: '收费金额总计',
      labelTips: '当前选择时间段，所有状态账单应付金额之和。'
    },
    {
      prop: 'settledAmount',
      label: '已结算金额',
      labelTips: '当前选择时间段，【已结算】账单实付金额之和。'
    },
    {
      prop: 'unsettledAmount',
      label: '待结算金额',
      labelTips: '当前选择时间段，【待支付】账单应付金额总计，不包待制单账单应付金额'
    }
  ],
  detailTotalTable: [
    {
      prop: 'totalAmount',
      label: '收费金额',
      className: ['total-price'],
      type: 'price',
      labelTips: '当前选择时间段，所有状态账单应付金额之和。'
    },
    {
      prop: 'discountAmount',
      label: '优惠金额',
      className: ['total-price'],
      type: 'price',
      labelTips: '当前选择时间段，【已结算】账单实付金额之和。'
    },
    {
      prop: 'payableAmount',
      label: '应付金额',
      className: ['total-price'],
      type: 'price',
      labelTips: '当前机构账单应付金额总计。'
    }
  ]
}
// 账单信息 table
export const billtables = {
  feesColumns: [
    {
      prop: 'productChargesName',
      type: 'text',
      label: '收费项',
      minWidth: 142
    },
    {
      prop: 'productChargesItemName',
      type: 'text',
      label: '明细收费项',
      minWidth: 142
    },
    {
      prop: 'expenseType',
      type: 'option',
      label: '收费类型',
      optionConfig: {
        label: 'message',
        value: 'code'
      },
      minWidth: 142
    },
    {
      prop: 'remark',
      type: 'textHtml',
      label: '单价/收费比例',
      minWidth: 142
    },
    {
      prop: 'billingUnit',
      type: 'text',
      label: '单价单位',
      minWidth: 142
    },
    {
      prop: 'usage',
      type: 'text',
      label: '用量',
      minWidth: 142
    },
    {
      prop: 'useUnit',
      type: 'text',
      label: '用量单位',
      minWidth: 142
    },
    {
      prop: 'totalAmount',
      type: 'price',
      label: '收费金额',
      minWidth: 142
    },
    {
      prop: 'discountAmount',
      type: 'price',
      label: '优惠金额',
      minWidth: 142
    },
    {
      prop: 'chargesAmount',
      type: 'price',
      label: '应付金额',
      minWidth: 142
    }
  ],
  preColumns: [
    {
      prop: 'couponName',
      type: 'text',
      label: '优惠项名称',
      minWidth: 142
    },
    {
      prop: 'couponNo',
      type: 'text',
      label: '优惠券编号',
      minWidth: 142
    },
    {
      prop: 'couponRemark',
      type: 'text',
      label: '优惠说明',
      minWidth: 142
    },
    {
      prop: 'discountAmount',
      type: 'price',
      label: '优惠金额',
      minWidth: 142
    },
    {
      prop: 'createTime',
      type: 'text',
      label: '优惠券生效时间',
      minWidth: 142
    }
  ],
  payColumns: [
    {
      prop: 'paymentTime',
      type: 'text',
      label: '支付时间',
      minWidth: 142
    },
    {
      prop: 'createdByName',
      type: 'text',
      label: '结算财务',
      minWidth: 142
    },
    {
      prop: 'paymentVoucher',
      type: 'link',
      label: '费用凭证',
      minWidth: 142
    },
    {
      prop: 'invoiceVoucher',
      type: 'link',
      label: '发票凭证',
      minWidth: 142
    },
    {
      prop: 'settleAmount',
      type: 'price',
      label: '支付金额',
      minWidth: 142
    }
  ]
}

