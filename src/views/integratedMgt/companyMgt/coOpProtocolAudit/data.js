export const finishTableJson = [
  { prop: 'agreementName', type: 'text', label: '协议名称', disable: false, visible: true, minWidth: 142 },
  { prop: 'agreementCode', type: 'text', label: '协议编号', disable: false, visible: true, minWidth: 142 },
  { prop: 'supplierOrgName', type: 'text', label: '供应机构', disable: false, visible: true, minWidth: 142 },
  { prop: 'cpOrgName', type: 'text', label: '合作机构', disable: false, visible: true, minWidth: 142 },
  { prop: 'coopScopeList', type: 'slot', label: '合作范围', disable: false, visible: true, minWidth: 142 },
  { prop: 'startDate', type: 'slot', label: '协议日期', disable: false, visible: true, minWidth: 182 },
  { prop: 'statusName', type: 'text', label: '状态', disable: false, visible: true, minWidth: 140 },
  { prop: 'createUserName', type: 'text', label: '提交人', disable: false, visible: true, minWidth: 140 },
  { prop: 'submitAuditTime', type: 'text', label: '提交审核时间', disable: false, visible: true, minWidth: 150 },
  { prop: 'action', type: 'slot', label: '操作', disable: false, visible: true, minWidth: 80, fixed: 'right' }
]

export const finishedTableJson = [
  { prop: 'agreementName', type: 'text', label: '协议名称', disable: false, visible: true, minWidth: 142 },
  { prop: 'agreementCode', type: 'text', label: '协议编号', disable: false, visible: true, minWidth: 142 },
  { prop: 'supplierOrgName', type: 'text', label: '供应机构', disable: false, visible: true, minWidth: 102 },
  { prop: 'cpOrgName', type: 'text', label: '合作机构', disable: false, visible: true, minWidth: 100 },
  { prop: 'coopScopeList', type: 'slot', label: '合作范围', disable: false, visible: true, minWidth: 142 },
  { prop: 'startDate', type: 'slot', label: '协议日期', disable: false, visible: true, minWidth: 180 },
  { prop: 'statusName', type: 'text', label: '状态', disable: false, visible: true, minWidth: 100 },
  { prop: 'createUserName', type: 'text', label: '提交人', disable: false, visible: true, minWidth: 100 },
  { prop: 'submitAuditTime', type: 'text', label: '提交审核时间', disable: false, visible: true, minWidth: 150 },
  { prop: 'submitAuditUserName', type: 'text', label: '审核人', disable: false, visible: true, minWidth: 142 },
  { prop: 'auditTime', type: 'text', label: '审核时间', disable: false, visible: true, minWidth: 150 },
  { prop: 'action', type: 'slot', label: '操作', disable: false, visible: true, minWidth: 142, fixed: 'right' }
]

export const detailsTableJson = [
  { prop: 'assetCode', type: 'text', label: '审批人员名称', disable: false, visible: true, minWidth: 142 },
  { prop: 'assetCode', type: 'text', label: '所在部门', disable: false, visible: true, minWidth: 142 },
  { prop: 'assetCode', type: 'text', label: '部门范围', disable: false, visible: true, minWidth: 142 },
  { prop: 'assetCode', type: 'text', label: '抄送人员', disable: false, visible: true, minWidth: 142 },
  { prop: 'assetCode', type: 'text', label: '抄送群', disable: false, visible: true, minWidth: 142 },
  { prop: 'action', type: 'slot', label: '操作', disable: false, visible: true, minWidth: 142 }
]
export const statusTansforIcon = [
  {
  },
  {
    text: '草稿',
    icon: 'cg',
    detailIcon: 'cg',
    bgColor: '#F7F7F7',
    color: '#78ACFA'
  },
  {
    text: '待审核',
    icon: 'dsh',
    bgColor: '#FFF5ED',
    color: '#FCA368'
  },
  {
    text: '审核通过',
    icon: 'shtg',
    bgColor: '#EFFFED',
    color: '#00D435'
  },
  {
    text: '审核驳回',
    icon: 'shbh',
    bgColor: '#FFEDED',
    color: '#FF7575'
  },
  {
    text: '待签署',
    icon: 'dqs',
    bgColor: '#EDF6FF',
    color: '#6F68FC'
  },
  {
    text: '已拒绝',
    icon: 'yjj',
    bgColor: '#FFEDED',
    color: '#F74545'
  },
  {
    text: '已签署',
    icon: 'yqs',
    bgColor: '#F8FFED',
    color: '#71D400'
  },
  {
    text: '待终止',
    icon: 'dzz',
    bgColor: '#FFF5ED',
    color: '#FCA368'
  },
  {
    text: '已终止',
    icon: 'yzz',
    bgColor: '#FFEDED',
    color: '#FF2020'
  },
  {
    text: '已失效',
    icon: 'ysx',
    bgColor: '#FFEDED',
    color: '#FF2020'
  }
]
export const homeFormSearchInfo = {
  agreementCode: undefined, // 协议编号
  agreementName: undefined, // 协议名称
  cpOrgId: undefined, //	合作机构ID
  supplierOrgId: undefined, // 供应机构ID
  time: [], // [开始日期， 结束日期]
  coopScope: undefined // 合作范围
}

export const tabsToStatus = {
  finish: 1,
  finished: 2,
  unfinish: 3
}
