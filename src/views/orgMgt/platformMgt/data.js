// 服务费用
export const serviceFees = {
  form: {
    ref: null,
    formData: {
      time: [new Date(), new Date()], //  	账期
      tenantId: '' // 	机构
    },
    operatorSpan: 6,
    optionsObj: {
      tenantId: []
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
        prop: 'chargesAmount',
        type: 'slot',
        label: '收费金额',
        minWidth: 142
      },
      {
        prop: 'createdByName',
        type: 'text',
        label: '操作人',
        minWidth: 142
      },
      {
        prop: 'createTime',
        type: 'text',
        label: '操作时间',
        minWidth: 150
      },
      { prop: 'action', type: 'slot', label: '操作', disable: false, visible: true, minWidth: 142, fixed: 'right' }
    ],
    slotArr: ['action', 'status', 'billNo', 'chargesAmount', 'discountAmount', 'payableAmount', 'paidAmount', 'settleTime']
  },
  addForm: {
    tenantId: '', // 机构id
    billCycle: '', // 账期（格式：yyyy-MM-dd
    type: '', // 收费项类型
    voucherUrl: '', // 凭证地址
    chargesAmount: '' // 金额，单位为分
  },
  addrules: {
    tenantId: [{ required: true, message: '请选择机构', trigger: 'blur' }],
    billCycle: [{ required: true, message: '请选择账单月份', trigger: 'blur' }],
    voucherUrl: [
      { required: true, message: '请上传凭证地址', trigger: 'blur' }
    ],
    chargesAmount: [
      { required: true, message: '请输入费用金额', trigger: 'blur' },
      {
        validator: (rule, value, callback) => {
          const number = Number(value)
          if (!(number >= 1 && number <= 999999)) {
            callback(new Error('请输入￥1-￥999,999'))
          } else if (!/^\d+(\.\d{1,2})?$/.test(number)) {
            callback(new Error('仅限输入2位小数'))
          } else {
            callback()
          }
        }, trigger: 'blur'
      }
    ],
    type: [{ required: true, message: '请选择明细收费项', trigger: 'blur' }]
  },
  codetranfer: {
    AIC0001: {
      name: 'AI外呼基础服务',
      form: { openTime: undefined, confirmor: undefined },
      rules: {
        openTime: [{ required: true, message: '请选择服务开通日期', trigger: 'blur' }],
        confirmor: [{ required: true, message: '请输入机构确认人', trigger: 'blur' }]
      },
      fileList: [
        { prop: 'openTime', label: '开通日期', cpn: 'el-date-picker', placeholder: '请选择服务开通日期', bind: { type: 'datetime' } },
        { prop: 'confirmor', label: '机构确认人', cpn: 'el-input', bind: { maxlength: 20 } }
      ]
    },
    AIC0002: {
      name: 'AI外呼电话认证',
      form: { phones: '', confirmor: undefined },
      rules: {
        phones: [{ required: true, message: '请至少添加一个月租账号（手机号码）', trigger: 'blur' }],
        confirmor: [{ required: true, message: '请输入机构确认人', trigger: 'blur' }]
      },
      fileList: [{ prop: 'phones', label: '认证账号', slotName: 'phoneTp' }, { prop: 'confirmor', label: '机构确认人', cpn: 'el-input', bind: { maxlength: 20 } }]
    },
    AIC0003: {
      name: 'AI外呼月租',
      form: { phones: '', confirmor: undefined },
      rules: {
        phones: [{ required: true, message: '请至少添加一个月租账号（手机号码）', trigger: 'blur' }],
        confirmor: [{ required: true, message: '请输入机构确认人', trigger: 'blur' }]
      },
      fileList: [{ prop: 'phones', label: '月租账号', slotName: 'phoneTp' }, {
        prop: 'confirmor', label: '机构确认人', cpn: 'el-input', bind: { maxlength: 20 }
      }]
    },
    DIG0001: {
      name: '数字人套餐',
      form: {
        openTime: undefined,
        confirmor: undefined,
        deliveryContent: undefined
      },
      rules: {
        openTime: [{ required: true, message: '请选择服务开通日期', trigger: 'blur' }],
        confirmor: [{ required: true, message: '请输入机构确认人', trigger: 'blur' }],
        deliveryContent: [{ required: true, message: '请输入数字人套餐交付内容', trigger: 'blur' }]
      },
      fileList: [
        {
          prop: 'deliveryContent', label: '交付内容', cpn: 'el-input', classArr: ['w100', 'flex'], bind: {
            type: 'textarea', maxlength: '300', 'show-word-limit': true,
            autosize: { minRows: 2, maxRows: 6 }
          }
        },
        { prop: 'openTime', label: '开通日期', cpn: 'el-date-picker', bind: { type: 'datetime' } },
        { prop: 'confirmor', label: '机构确认人', cpn: 'el-input', bind: { maxlength: 20 } }
      ]
    },
    DIG0004: {
      name: '数字人快速克隆套餐',
      form: {
        openTime: undefined,
        confirmor: undefined,
        deliveryContent: undefined
      },
      rules: {
        openTime: [{ required: true, message: '请选择服务开通日期', trigger: 'blur' }],
        confirmor: [{ required: true, message: '请输入机构确认人', trigger: 'blur' }],
        deliveryContent: [{ required: true, message: '请输入数字人快速克隆套餐交付内容', trigger: 'blur' }]
      },
      fileList: [
        {
          prop: 'deliveryContent', label: '交付内容', cpn: 'el-input', classArr: ['w100', 'flex'], bind: {
            type: 'textarea', maxlength: '300', 'show-word-limit': true,
            autosize: { minRows: 2, maxRows: 6 }
          }
        },
        { prop: 'openTime', label: '开通日期', cpn: 'el-date-picker', bind: { type: 'datetime' } },
        { prop: 'confirmor', label: '机构确认人', cpn: 'el-input', bind: { maxlength: 20 } }
      ]
    },
    DIG0002: {
      name: '数字人声音',
      form: {
        openTime: undefined,
        confirmor: undefined,
        deliveryContent: undefined
      },
      rules: {
        openTime: [{ required: true, message: '请选择服务开通日期', trigger: 'blur' }],
        confirmor: [{ required: true, message: '请输入机构确认人', trigger: 'blur' }],
        deliveryContent: [{ required: true, message: '请输入数字人声音交付内容', trigger: 'blur' }]
      },
      fileList: [
        {
          prop: 'deliveryContent', label: '交付内容', cpn: 'el-input', classArr: ['w100', 'flex'], bind: {
            type: 'textarea', maxlength: '300', 'show-word-limit': true,
            autosize: { minRows: 2, maxRows: 6 }
          }
        },
        { prop: 'openTime', label: '开通日期', cpn: 'el-date-picker', bind: { type: 'datetime' } },
        { prop: 'confirmor', label: '机构确认人', cpn: 'el-input', bind: { maxlength: 20 } }
      ]
    },
    DIG0003: {
      name: '数字人形象',
      form: {
        openTime: undefined,
        confirmor: undefined,
        deliveryContent: undefined

      },
      rules: {
        openTime: [{ required: true, message: '请选择服务开通日期', trigger: 'blur' }],
        confirmor: [{ required: true, message: '请输入机构确认人', trigger: 'blur' }],
        deliveryContent: [{ required: true, message: '请输入数字人形象交付内容', trigger: 'blur' }]
      },
      fileList: [
        {
          prop: 'deliveryContent', label: '交付内容', cpn: 'el-input', classArr: ['w100', 'flex'], bind: {
            type: 'textarea', maxlength: '300', 'show-word-limit': true,
            autosize: { minRows: 2, maxRows: 6 }
          }
        },
        { prop: 'openTime', label: '开通日期', cpn: 'el-date-picker', bind: { type: 'datetime' } },
        { prop: 'confirmor', label: '机构确认人', cpn: 'el-input', bind: { maxlength: 20 } }
      ]
    },
    SER0001: {
      name: '七鱼客服',
      form: {
        usedCount: undefined,
        confirmor: undefined
      },
      rules: {
        usedCount: [{ required: true, message: '请选择七鱼客服座席数', trigger: 'blur' }],
        confirmor: [{ required: true, message: '请输入机构确认人', trigger: 'blur' }]
      },
      fileList: [
        { prop: 'usedCount', label: '七鱼客服座席数', cpn: 'el-input', lableWidth: '130px', bind: { type: 'number' } },
        { prop: 'confirmor', label: '机构确认人', cpn: 'el-input', bind: { maxlength: 20 } }
      ]
    },
    AGG0001: {
      name: '聚合客服',
      form: {
        usedCount: undefined,
        confirmor: undefined
      },
      rules: {
        usedCount: [{ required: true, message: '请选择聚合客服座席数', trigger: 'blur', bind: { type: 'number' } }],
        confirmor: [{ required: true, message: '请输入机构确认人', trigger: 'blur' }]
      },
      fileList: [
        { prop: 'usedCount', label: '聚合客服座席数', cpn: 'el-input' },
        { prop: 'confirmor', label: '机构确认人', cpn: 'el-input', bind: { maxlength: 20 } }
      ]
    },
    WEC0001: {
      name: '企微会话存档服务费',
      form: {
        openTime: undefined,
        confirmor: undefined,
        content: undefined
      },
      rules: {
        openTime: [{ required: true, message: '请选择服务开通日期', trigger: 'blur' }],
        confirmor: [{ required: true, message: '请输入机构确认人', trigger: 'blur' }],
        content: [{ required: true, message: '请输入交付内容', trigger: 'blur' }]
      },
      fileList: [
        {
          prop: 'content', label: '交付内容', cpn: 'el-input', classArr: ['w100', 'flex'], bind: {
            type: 'textarea', maxlength: '300', 'show-word-limit': true,
            autosize: { minRows: 2, maxRows: 6 }
          }
        },
        { prop: 'openTime', label: '开通日期', cpn: 'el-date-picker', bind: { type: 'datetime' } },
        { prop: 'confirmor', label: '机构确认人', cpn: 'el-input', bind: { maxlength: 20 } }
      ]
    },
    WEC0002: {
      name: '企微互通账号',
      form: {
        openTime: undefined,
        confirmor: undefined,
        content: undefined
      },
      rules: {
        openTime: [{ required: true, message: '请选择服务开通日期', trigger: 'blur' }],
        confirmor: [{ required: true, message: '请输入机构确认人', trigger: 'blur' }],
        content: [{ required: true, message: '请输入交付内容', trigger: 'blur' }]
      },
      fileList: [
        {
          prop: 'content', label: '交付内容', cpn: 'el-input', classArr: ['w100', 'flex'], bind: {
            type: 'textarea', maxlength: '300', 'show-word-limit': true,
            autosize: { minRows: 2, maxRows: 6 }
          }
        },
        { prop: 'openTime', label: '开通日期', cpn: 'el-date-picker', bind: { type: 'datetime' } },
        { prop: 'confirmor', label: '机构确认人', cpn: 'el-input', bind: { maxlength: 20 } }
      ]
    },
    CUSTOM: {
      name: '自定义收费项',
      form: {
        openTime: undefined,
        confirmor: undefined,
        deliveryContent: undefined
      },
      rules: {
        openTime: [{ required: true, message: '请选择服务开通日期', trigger: 'blur' }],
        confirmor: [{ required: true, message: '请输入机构确认人', trigger: 'blur' }],
        deliveryContent: [{ required: true, message: '请输入交付内容', trigger: 'blur' }]
      },
      fileList: [
        {
          prop: 'deliveryContent', label: '交付内容', cpn: 'el-input', classArr: ['w100', 'flex'], bind: {
            type: 'textarea', maxlength: '300', 'show-word-limit': true,
            autosize: { minRows: 2, maxRows: 6 }
          }
        },
        { prop: 'openTime', label: '开通日期', cpn: 'el-date-picker', bind: { type: 'datetime' } },
        { prop: 'confirmor', label: '机构确认人', cpn: 'el-input', bind: { maxlength: 20 } }
      ]
    }
  },
  detailColumns: {
    //  AI外呼基础服务
    AIC0001: [
      { prop: 'productChargesName', label: '收费项' },
      { prop: 'productChargesItemName', label: '明细收费项' },
      { prop: 'openTime', label: '服务开通时间' },
      { prop: 'confirmor', label: '机构确认人' },
      { prop: 'voucherUrl', label: '费用凭证' },
      { prop: 'chargesAmount', label: '费用金额' }
    ],
    // AI电话认证
    AIC0002: [
      { prop: 'productChargesName', label: '收费项' },
      { prop: 'productChargesItemName', label: '明细收费项' },
      { prop: 'billCycle', label: '服务开通时间' },
      { prop: 'phones', label: '认证账号' },
      { prop: 'confirmor', label: '机构确认人' },
      { prop: 'voucherUrl', label: '费用凭证' },
      { prop: 'chargesAmount', label: '费用金额' }
    ],
    // AI外呼月租
    AIC0003: [
      { prop: 'productChargesName', label: '收费项' },
      { prop: 'productChargesItemName', label: '明细收费项' },
      { prop: 'phones', label: '月租账号' },
      { prop: 'billCycle', label: '服务开通时间' },
      { prop: 'confirmor', label: '机构确认人' },
      { prop: 'voucherUrl', label: '费用凭证' },
      { prop: 'chargesAmount', label: '费用金额' }
    ],
    // 数字人套餐
    DIG0001: [
      { prop: 'productChargesName', label: '收费项' },
      { prop: 'productChargesItemName', label: '明细收费项' },
      { prop: 'deliveryContent', label: '交付内容' },
      { prop: 'billCycle', label: '服务开通时间' },
      { prop: 'confirmor', label: '机构确认人' },
      { prop: 'voucherUrl', label: '费用凭证' },
      { prop: 'chargesAmount', label: '费用金额' }
    ],
    // 数字人声音
    DIG0002: [
      { prop: 'productChargesName', label: '收费项' },
      { prop: 'productChargesItemName', label: '明细收费项' },
      { prop: 'deliveryContent', label: '交付内容' },
      { prop: 'billCycle', label: '服务开通时间' },
      { prop: 'confirmor', label: '机构确认人' },
      { prop: 'voucherUrl', label: '费用凭证' },
      { prop: 'chargesAmount', label: '费用金额' }
    ],
    // 数字人形象
    DIG0003: [
      { prop: 'productChargesName', label: '收费项' },
      { prop: 'productChargesItemName', label: '明细收费项' },
      { prop: 'deliveryContent', label: '交付内容' },
      { prop: 'billCycle', label: '服务开通时间' },
      { prop: 'confirmor', label: '机构确认人' },
      { prop: 'voucherUrl', label: '费用凭证' },
      { prop: 'chargesAmount', label: '费用金额' }
    ],
    // 七鱼客服
    SER0001: [
      { prop: 'productChargesName', label: '收费项' },
      { prop: 'productChargesItemName', label: '明细收费项' },
      { prop: 'usedCount', label: '七鱼客服座席数' },
      { prop: 'confirmor', label: '机构确认人' },
      { prop: 'voucherUrl', label: '费用凭证' },
      { prop: 'chargesAmount', label: '费用金额' }
    ],
    // 聚合客服
    AGG0001: [
      { prop: 'productChargesName', label: '收费项' },
      { prop: 'productChargesItemName', label: '明细收费项' },
      { prop: 'usedCount', label: '聚合客服座席数' },
      { prop: 'confirmor', label: '机构确认人' },
      { prop: 'voucherUrl', label: '费用凭证' },
      { prop: 'chargesAmount', label: '费用金额' }
    ],
    // 企微会话存档服务费
    WEC0001: [
      { prop: 'productChargesName', label: '收费项' },
      { prop: 'productChargesItemName', label: '明细收费项' },
      { prop: 'content', label: '交付内容' },
      { prop: 'billCycle', label: '服务开通时间' },
      { prop: 'confirmor', label: '机构确认人' },
      { prop: 'voucherUrl', label: '费用凭证' },
      { prop: 'chargesAmount', label: '费用金额' }
    ],
    // 企微互通账号
    WEC0002: [
      { prop: 'productChargesName', label: '收费项' },
      { prop: 'productChargesItemName', label: '明细收费项' },
      { prop: 'content', label: '交付内容' },
      { prop: 'billCycle', label: '服务开通时间' },
      { prop: 'confirmor', label: '机构确认人' },
      { prop: 'voucherUrl', label: '费用凭证' },
      { prop: 'chargesAmount', label: '费用金额' }
    ],
    // 自定义收费项
    CUSTOM: [
      { prop: 'productChargesName', label: '收费项' },
      { prop: 'productChargesItemName', label: '明细收费项' },
      { prop: 'deliveryContent', label: '交付内容' },
      { prop: 'billCycle', label: '服务开通时间' },
      { prop: 'confirmor', label: '机构确认人' },
      { prop: 'voucherUrl', label: '费用凭证' },
      { prop: 'chargesAmount', label: '费用金额' }
    ]
  }
}
