// 审核状态
export const examineStatusOption = [
  { label: '未申请', value: 1, icon: 'audit_info', background: '#FAFAFA', color: '#717075' },
  { label: '申请中', value: 2, icon: 'audit_wait', background: '#FFF2E6', color: '#FF7D00' },
  { label: '未通过', value: 3, icon: 'audit_fail', background: '#FEECEC', color: '#F53F3F' },
  { label: '已通过', value: 4, icon: 'audit_success', background: '#E6F7EA', color: '#00B42A' }
]

// 模板搜索
export const searchTemOptions = [
  { label: '模板名称', value: 'templateName' },
  { label: '模板内容', value: 'templateContent' },
  { label: '渠道商模板ID', value: 'channelTemplateId' },
  { label: '标准模板ID', value: 'standardTemplateId' }
]

// 参数类型
export const paramTypeReqsOptions = [
  { value: 0, label: '仅数字', rules: [{ required: true, message: '不能为空', trigger: 'blur' }, { pattern: /^\d{4,6}$/, message: '请输入4-6位的数字', trigger: 'blur' }] },
  { value: 1, label: '电话号码', rules: [{ required: true, message: '不能为空', trigger: 'blur' }, { pattern: /^\d{11}$/, message: '手机号格式不正确', trigger: 'blur' }] },
  { value: 2, label: '其他号码（如订单号，密码等）', rules: [{ required: true, message: '不能为空', trigger: 'blur' }] },
  { value: 3, label: '时间', rules: [{ required: true, message: '不能为空', trigger: 'blur' }] },
  { value: 4, label: '金额', rules: [{ required: true, message: '不能为空', trigger: 'blur' }, { pattern: /\d+\.?\d{0,2}/, message: '请输入金额', trigger: 'blur' }] },
  { value: 5, label: '其他（如名称、账号、地址等）', rules: [{ required: true, message: '不能为空', trigger: 'blur' }] }
]

export function getColumns() {
  return [
    { 'width': '200px', prop: 'standardTemplateId', label: '标准模版ID', type: 'text', visible: true, disable: true },
    { prop: 'templateName', label: '模板名称', type: 'text', width: '150px', visible: true },
    { prop: 'channelName', label: '渠道商名称', type: 'text', width: '150px', visible: true },
    { prop: 'thirdPartyCode', label: '渠道商模板ID', type: 'text', width: '150px', visible: true },
    { prop: 'smsTypeName', label: '模板类型', type: 'text', visible: true },
    { prop: 'channelTemplateContent', label: '模板内容', type: 'slot', 'min-width': '350px', visible: true },
    { prop: 'tagList', label: '标签', type: 'text', width: '150px', visible: true, render: (row) => { return renderTagList(row.tagList).join('、') } },
    { prop: 'examineStatus', label: '审核状态', type: 'slot', width: '150px', visible: true },
    { prop: 'createTime', label: '创建时间', type: 'text', width: '150px', visible: true },
    { fixed: 'right', width: '150px', prop: 'action', label: '操作', type: 'slot', visible: true, disable: true }
  ]
}

function renderTagList(val) {
  if (!val || val.length === 0) {
    return []
  } else {
    return val.reduce((pre, next) => {
      pre.push(next.name)
      return pre
    }, [])
  }
}
