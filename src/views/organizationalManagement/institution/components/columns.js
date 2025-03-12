export const statusOption = [
  {
    label: '全部',
    value: ''
  },
  {
    label: '待审核',
    value: 0
  },
  {
    label: '机构开通中',
    value: 1
  }
  // {
  //   label: '已入驻',
  //   value: 2
  // }
]

export const typeOption = [
  {
    label: '全部',
    value: ''
  },
  {
    label: '企业',
    value: 1
  },
  {
    label: '个人',
    value: 2
  }
]
export const signOption = [
  {
    label: '全部',
    value: ''
  },
  {
    label: '未签署',
    value: 0
  },
  {
    label: '已签署',
    value: 1
  }
]

export function getColumns() {
  return [
    { prop: 'companyName', label: '名称', type: 'text' },
    { prop: 'companyAbbreviation', label: '简称', type: 'text' },
    { prop: 'typeName', label: '类型', type: 'text' },
    { prop: 'packageName', label: '入驻模块', type: 'text', width: '300px' },
    { prop: 'statusName', label: '状态', type: 'text' },
    { prop: 'logo', label: '企业Logo', type: 'slot' },
    { prop: 'name', label: '姓名', type: 'text' },
    { prop: 'phone', label: '手机号', type: 'slot' },
    { prop: 'businessLicense', label: '营业执照', type: 'slot' },
    { prop: 'enterpriseCode', label: '企业代码', type: 'text' },
    { prop: 'createTime', label: '申请时间', type: 'text' },
    { prop: 'approvedTime', label: '审核时间', type: 'text' },
    { prop: 'action', label: '操作', type: 'slot', width: '150px' }
  ]
}

export function getColumns2() {
  return [
    { prop: 'organizationId', label: '机构ID', type: 'text' },
    { prop: 'name', label: '名称', type: 'text' },
    { prop: 'companyAbbreviation', label: '简称', type: 'text' },
    { prop: 'typeName', label: '类型', type: 'text' },
    { prop: 'packageName', label: '入驻模块', type: 'text', width: '300px' },
    { prop: 'administratorName', label: '管理员姓名', type: 'text', width: '130px' },
    { prop: 'phone', label: '手机号', type: 'slot', width: '130px' },
    { prop: 'applicationTime', label: '申请时间', type: 'text', width: '130px' },
    { prop: 'createTime', label: '入驻时间', type: 'text', width: '130px' },
    { prop: 'signContractStatus', label: '是否签署合同', type: 'slot', width: '130px' }, // 机构合同状态：1、未生效|2、合作中|3、已过期|4、合同已终止
    { prop: 'contractStatus', label: '机构状态', type: 'slot' }, // 是否签署合同：0、未签署|1、已签署
    { prop: 'accountStatus', label: '账号状态', type: 'slot' }, // 机构账号状态：0、使用中|1、已关停
    { prop: 'action', label: '操作', type: 'slot', fixed: 'right', width: '180px' }
  ]
}
export function getHistorPage() {
  return {
    columns: [
      { prop: 'contractStartTime', label: '合同起止时间', type: 'slot', width: '180px' },
      { prop: 'contractMonth', label: '合同有效期', type: 'slot', width: '110px' },
      { prop: 'status', label: '合同状态', type: 'slot', width: '110px' },
      { prop: 'attachmentUrl', label: '合同附件', type: 'slot' },
      { prop: 'settlePeriod', label: '结算周期', type: 'slot', width: '110px' },
      { prop: 'createTime', label: '上传时间', type: 'text', width: '120px' },
      { prop: 'createName', label: '上传账号', type: 'text', width: '120px' },
      { prop: 'action', label: '操作', type: 'slot', width: '80px' }
    ],
    slotArr: ['contractStartTime', 'contractMonth', 'status', 'attachmentUrl', 'settlePeriod', 'action']
  }
}

const validatePhone = (rule, value, callback) => {
  if (!/^[0-9]{11}$/.test(value)) {
    callback(new Error('请输入正确的手机号'))
  } else {
    callback()
  }
}
export const rules = () => ({
  type: [
    { required: true, message: '请选择入驻类型', trigger: 'change' }
  ],
  companyName: [
    { required: true, message: '请输入公司姓名', trigger: 'blur' }
  ],
  companyAbbreviation: [
    { required: true, message: '请输入公司简称', trigger: 'blur' }
  ],
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  phone: [{ required: true, trigger: 'blur', validator: validatePhone }],
  businessLicense: [
    { required: true, message: '请选择营业执照', trigger: 'change' }
  ],
  bigLogo: [{ required: true, message: '请选择LOGO', trigger: 'change' }],
  smallLogo: [
    { required: true, message: '请选择小LOGO', trigger: 'change' }
  ],
  enterpriseCode: [
    { required: true, message: '请选择企业代码', trigger: 'blur' }
  ],
  companyEnglishAbbreviation: [
    { required: true, message: '请输入机构标识', trigger: 'blur' }
  ],
  abbreviation: [
    { required: true, message: '请输入机构标识', trigger: 'blur' }
  ],
  administratorName: [
    { required: true, message: '请输入管理员姓名', trigger: 'blur' }
  ],
  packageId: [
    { required: true, message: '请选择入驻模块', trigger: 'change' }
  ],
  administratorPhone: [
    {
      required: true,
      trigger: 'blur',
      validator: validatePhone
    }
  ]
})
