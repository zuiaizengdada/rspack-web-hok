export const tableColumns = [
  {
    prop: 'accountName',
    label: '账号',
    type: 'text',
    visible: true,
    disable: true
  },
  {
    prop: 'platformName',
    label: '平台',
    type: 'text',
    visible: true,
    disable: true
  },
  {
    prop: 'type',
    label: '审批类型',
    type: 'slot',
    visible: true
  },
  {
    prop: 'reason',
    label: '原因',
    type: 'text',
    width: 200,
    visible: true
  },
  {
    prop: 'teacherName',
    label: 'IP',
    type: 'slot',
    visible: true
  },
  {
    prop: 'fans',
    label: '粉丝数',
    type: 'text',
    visible: true
  },
  {
    prop: 'operatorName',
    label: '运营者',
    type: 'text',
    visible: true
  },
  {
    prop: 'applicantName',
    label: '申请者',
    type: 'text',
    visible: true
  },
  {
    prop: 'applicantTime',
    label: '申请时间',
    type: 'text',
    visible: true
  },
  {
    prop: 'action',
    label: '操作',
    width: 190,
    type: 'slot',
    visible: true,
    disable: true
  }
]
export const tableColumns1 = [
  {
    prop: 'accountName',
    label: '账号',
    type: 'text',
    visible: true,
    disable: true
  },
  {
    prop: 'platformName',
    label: '平台',
    type: 'text',
    visible: true,
    disable: true
  },
  {
    prop: 'type',
    label: '审批类型',
    type: 'slot',
    visible: true
  },
  {
    prop: 'reason',
    label: '原因',
    type: 'text',
    width: 200,
    visible: true
  },
  {
    prop: 'teacherName',
    label: 'IP',
    type: 'slot',
    visible: true
  },
  {
    prop: 'fans',
    label: '粉丝数',
    type: 'text',
    visible: true
  },
  {
    prop: 'operatorName',
    label: '运营者',
    type: 'text',
    visible: true
  },
  {
    prop: 'applicantName',
    label: '申请者',
    type: 'text',
    visible: true
  },
  {
    prop: 'applicantTime',
    label: '申请时间',
    type: 'text',
    visible: true
  },
  {
    prop: 'examineUserName',
    label: '审批者',
    type: 'text',
    visible: true
  },
  {
    prop: 'examineTime',
    label: '审批时间',
    type: 'text',
    visible: true
  },
  {
    prop: 'action',
    label: '操作',
    width: 190,
    type: 'slot',
    visible: true,
    disable: true
  }
]
export const configList = [
  {
    name: '待审批',
    nums: 0,
    authority: 'system:desensition:approval',
    approveStatus: 1
  },
  {
    name: '审批通过',
    nums: 0,
    authority: 'system:desensition:pass',
    approveStatus: 2
  },
  {
    name: '审批驳回',
    nums: 0,
    authority: 'system:desensition:reject',
    approveStatus: 3
  }
]
export const approveArray = [
  {
    approveId: 1,
    approveName: '停更'
  },
  {
    approveId: 2,
    approveName: '转号'
  },
  {
    approveId: 3,
    approveName: '变更运营'
  },
  {
    approveId: 4,
    approveName: '移交老师'
  },
  {
    approveId: 5,
    approveName: '注销'
  }
]
