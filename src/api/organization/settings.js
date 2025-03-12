import request2 from '@/utils/request2'

//  入驻前 获得机构申请分页
export function beforeGetOrganizationList(params) {
  return request2({
    url: '/cloud/edata-user/institutional-apply/page',
    method: 'get',
    params
  })
}

// 入驻前 更新机构申请
export function beforeUpdateOrganization(data) {
  return request2({
    url: '/cloud/edata-user/institutional-apply/update',
    method: 'PUT',
    data
  })
}

// 入驻前 完成开通确认
export function beforeOpenComplete(id) {
  return request2({
    url: `/cloud/edata-user/institutional-apply/openComplete?id=${id}`,
    method: 'post'
  })
}

// 入驻前 审核通过
export function beforeApproved(data) {
  return request2({
    url: '/cloud/edata-user/institutional-apply/approved',
    method: 'post',
    data
  })
}

//  入驻前  根据申请Id获得机构申请详细
export function beforeGetOrganizationDetail(id) {
  return request2({
    url: `/cloud/edata-user/institutional-apply/get?id=${id}`,
    method: 'get'
  })
}

// 入驻后 获得机构分页
export function getOrganizationList(params) {
  return request2({
    url: '/cloud/edata-user/organization/page',
    method: 'get',
    params
  })
}

// 入驻后 根据申请Id获得机构申请详细
export function getOrganizationDetail(id) {
  return request2({
    url: `/cloud/edata-user/organization/get?organizationId=${id}`,
    method: 'get'
  })
}

// 入驻后 更新机构申请
export function updateOrganization(data) {
  return request2({
    url: '/cloud/edata-user/organization/update',
    method: 'PUT',
    data
  })
}

// 入驻前 查询机构配置列表（根据机构申请ID）
export function listByApplyId(institutionalApplyId) {
  return request2({
    url: `/cloud/edata-user/organization/settings/listByApplyId?institutionalApplyId=${institutionalApplyId}`,
    method: 'get'
  })
}
// 入驻后 查询机构配置列表（根据入驻机构ID）
export function listByOrganizationId(organizationId) {
  return request2({
    url: `/cloud/edata-user/organization/settings/listByOrganizationId?organizationId=${organizationId}`,
    method: 'get'
  })
}
// 校验配置
export function verifySetting(data) {
  return request2({
    url: '/cloud/edata-user/organization/settings/verify',
    method: 'post',
    data
  })
}
// 保存配置
export function saveSetting(data) {
  return request2({
    url: '/cloud/edata-user/organization/settings/save',
    method: 'post',
    data
  })
}
// 获取模块数据
export function listPackages(data) {
  return request2({
    url: `/cloud/edata-user/sys-package/listPackages`,
    method: 'post',
    data
  })
}

// 机构合同

// 新增机构合同
export function orgContractAddApi(data) {
  return request2({
    url: '/cloud/edata-user/org-contract/add',
    method: 'post',
    data
  })
}
// 分页查询机构合同列表
export function orgContractPageApi(params) {
  return request2({
    url: `/cloud/edata-user/org-contract/page`,
    method: 'get',
    params
  })
}
// 通过机构ID获取最新合同详情
export function orgContractDetailApi(organizationId) {
  return request2({
    url: `/cloud/edata-user/org-contract/detailByOrgId/${organizationId}`,
    method: 'get'
  })
}
// 入驻后 查询机构配置列表（根据入驻机构ID）
export function orgContractTerminateApi(params) {
  return request2({
    url: `/cloud/edata-user/org-contract/terminate`,
    method: 'get',
    params
  })
}
// 保存或更新合同提醒设置
export function orgContractNoticeSaveApi(data) {
  return request2({
    url: '/cloud/edata-user/org-contract-notice/save',
    method: 'post',
    data
  })
}
// 获取机构的合同提醒设置
export function orgContractNoticeDetailApi(organizationId) {
  return request2({
    url: `/cloud/edata-user/org-contract-notice/detail/${organizationId}`,
    method: 'get'
  })
}
// 启用-关停机构所有账号状态
export function odealTenantAccountStatusApi(params) {
  return request2({
    url: `/cloud/edata-user/sysUser/dealTenantAccountStatus`,
    method: 'get',
    params
  })
}

/** 获取机构账单配置 */
export function tenantBillGetApi(params) {
  return request2({
    url: '/cloud/edata-bill/tenant/config/get',
    method: 'get',
    params
  })
}
/** 保存机构账单配置 */
export function tenantBillUpdApi(data) {
  return request2({
    url: '/cloud/edata-bill/tenant/config/save',
    method: 'post',
    data
  })
}

/** 根据申请Id获得机构管理员手机号 */
export function institutionalGetPhoneApi(id) {
  return request2({
    url: '/cloud/edata-user/institutional-apply/getPhone',
    method: 'get',
    params: { id }
  })
}
/** 根据机构id管理员手机号 */
export function organizationGetPhoneApi(organizationId) {
  return request2({
    url: '/cloud/edata-user/organization/getPhone',
    method: 'get',
    params: { organizationId }
  })
}

