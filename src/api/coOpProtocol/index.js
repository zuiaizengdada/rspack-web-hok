// import request from '@/utils/request'
import request2 from '@/utils/request2'

/** 接受协议 */
export function agreementAcceptApi(data) {
  return request2({
    url: '/cloud/edata-user/agreement/accept',
    method: 'post',
    data
  })
}
/** 接受终止协议 */
export function acceptTerminationApi(data) {
  return request2({
    url: '/cloud/edata-user/agreement/acceptTermination',
    method: 'post',
    data
  })
}
/** 新增合作协议 */
export function agreementAcceptAddApi(data) {
  return request2({
    url: '/cloud/edata-user/agreement/add',
    method: 'post',
    data
  })
}

/** 审核通过 */
export function agreementApprovedApi(data) {
  return request2({
    url: '/cloud/edata-user/agreement/approved',
    method: 'post',
    data
  })
}

/** 删除合作协议 */
export function agreementDeleteApi(data) {
  return request2({
    url: '/cloud/edata-user/agreement/delete',
    method: 'post',
    data
  })
}

/** 查询合作协议详情 */
export function agreementDetailApi(data) {
  return request2({
    url: '/cloud/edata-user/agreement/detail',
    method: 'post',
    data
  })
}
/** 编辑合作协议 */
export function agreementEditApi(data) {
  return request2({
    url: '/cloud/edata-user/agreement/edit',
    method: 'post',
    data
  })
}

/** 审核不通过 审核驳回 */
export function agreementNotApprovedApi(data) {
  return request2({
    url: '/cloud/edata-user/agreement/notApproved',
    method: 'post',
    data
  })
}

/** 分页查询合作协议审核列表 */
export function agreementPageAuditListApi(data) {
  return request2({
    url: '/cloud/edata-user/agreement/pageAuditList',
    method: 'post',
    data
  })
}

/** 分页查询合作协议列表 */
export function agreementPageListApi(data) {
  return request2({
    url: '/cloud/edata-user/agreement/pageList',
    method: 'post',
    data
  })
}

/** 驳回协议 */
export function agreementRejectApi(data) {
  return request2({
    url: '/cloud/edata-user/agreement/reject',
    method: 'post',
    data
  })
}

/** 驳回终止协议 */
export function agreementRejectTerminationApi(data) {
  return request2({
    url: '/cloud/edata-user/agreement/rejectTermination',
    method: 'post',
    data
  })
}

/** 发送协议 */
export function agreementSendApi(data) {
  return request2({
    url: '/cloud/edata-user/agreement/send',
    method: 'post',
    data
  })
}

/** 提交审核 */
export function agreementSubmitApi(data) {
  return request2({
    url: '/cloud/edata-user/agreement/submit',
    method: 'post',
    data
  })
}

/** 终止协议 */
export function agreementTerminationApi(data) {
  return request2({
    url: '/cloud/edata-user/agreement/termination',
    method: 'post',
    data
  })
}
/** 撤回协议 */
export function agreementWithdrawApi(data) {
  return request2({
    url: '/cloud/edata-user/agreement/withdraw',
    method: 'post',
    data
  })
}

/** 撤回审核 */
export function agreementWithdrawApprovedApi(data) {
  return request2({
    url: '/cloud/edata-user/agreement/withdrawApproved',
    method: 'post',
    data
  })
}

/** 合作范围树列表 */
export function agreementCoopScopeTreeApi(data) {
  return request2({
    url: '/cloud/edata-user/agreement/coopScopeTree',
    method: 'post',
    data
  })
}
/** 审核列表-供应机构列表 */
export function auditCountListApi(data) {
  return request2({
    url: '/cloud/edata-user/agreement/auditCountList',
    method: 'post',
    data
  })
}

/** 供应机构列表 */
export function agreementCpOrgListTreeApi(data) {
  return request2({
    url: '/cloud/edata-user/agreement/cpOrgList',
    method: 'post',
    data
  })
}
/** 合作范围列表 */
export function coopScopeListApi(data) {
  return request2({
    url: '/cloud/edata-user/agreement/coopScopeList',
    method: 'post',
    data
  })
}
/** 合作机构列表 */
export function agreementSupplierListApi(data) {
  return request2({
    url: '/cloud/edata-user/agreement/supplierList',
    method: 'post',
    data
  })
}

/** 审核列表-供应机构列表 */
export function agreementSupplierAuditListApi(data) {
  return request2({
    url: '/cloud/edata-user/agreement/supplierAuditList',
    method: 'post',
    data
  })
}
/** 审核列表-合作机构列表 */
export function agreementCpOrgAuditListtApi(data) {
  return request2({
    url: '/cloud/edata-user/agreement/cpOrgAuditList',
    method: 'post',
    data
  })
}

/** 审核列表-供应机构列表 */
export function agreementCoopScopeAuditListApi(data) {
  return request2({
    url: '/cloud/edata-user/agreement/coopScopeAuditList',
    method: 'post',
    data
  })
}

// 合作协议审核相关
/** 删除审批人员 */
export function approvalDelApi(data) {
  return request2({
    url: '/cloud/edata-user/approval/config/delete',
    method: 'post',
    data
  })
}
/** 查询通知开关配置 */
export function getSwitchApi() {
  return request2({
    url: '/cloud/edata-user/approval/config/getSwitch',
    method: 'get'
  })
}
/** 审批列表查询 */
export function getListApi() {
  return request2({
    url: '/cloud/edata-user/approval/config/list',
    method: 'get'
  })
}
/** 编辑(添加-修改)审批人员 */
export function saveOrUpdateApi(data) {
  return request2({
    url: '/cloud/edata-user/approval/config/saveOrUpdate',
    method: 'post',
    data
  })
}
/** 设置通知开关 */
export function setSwitchApi(data) {
  return request2({
    url: '/cloud/edata-user/approval/config/setSwitch',
    method: 'post',
    data
  })
}
/** 查询已签约的合作协议机构 */
export function getEffectiveOrgListApi(data) {
  return request2({
    url: '/cloud/edata-user/agreement/getEffectiveOrgList',
    method: 'post',
    data
  })
}
/** 分页查询合作协议审核列表 */
export function pageOperationLogListApi(data) {
  return request2({
    url: '/cloud/edata-user/agreement/pageOperationLogList',
    method: 'post',
    data
  })
}
/** 查询合作协议机构 */
export function getOrgListApi(params) {
  return request2({
    url: '/cloud/edata-user/agreement/getOrgList',
    method: 'post',
    params
  })
}
/** 协议状态列表接口 */
export function statusListApi(data) {
  return request2({
    url: '/cloud/edata-user/agreement/statusList',
    method: 'post',
    data
  })
}

