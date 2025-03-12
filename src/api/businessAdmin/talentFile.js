import request2 from '@/utils/request2'
// import request from '@/utils/request'
import { edataUserApi } from '@/utils/http/index.js'

// 公司主体分页查询
export function queryCompanyPageList(data) {
  return request2({
    url: `/cloud/edata-oa/organizational/structure/company/pageList`,
    method: 'POST',
    data
  })
}
// tab列头数据统计
export function queryTabList() {
  return request2({
    url: `/cloud/edata-oa/talentFile/personnelDetail/tabDataStatic`,
    method: 'GET'
  })
}

// 人才档案 简历库 查询
export function queryTalentFilePageList(data) {
  return request2({
    url: `/cloud/edata-oa/talentFile/personnelResumeLibrary/pageList`,
    method: 'POST',
    data
  })
}

// 人才档案 简历库 新增
export function addTalentFile(data) {
  return request2({
    url: `/cloud/edata-oa/talentFile/personnelResumeLibrary/add`,
    method: 'POST',
    data
  })
}

// 人才档案 简历库 修改
export function editTalentFile(data) {
  return request2({
    url: `/cloud/edata-oa/talentFile/personnelResumeLibrary/update`,
    method: 'POST',
    data
  })
}

// 人才档案 简历库 根据简历库ID查询查询简历库相关信息
export function queryCandidateInfo(params) {
  return request2({
    url: `/cloud/edata-oa/talentFile/personnelResumeLibrary/getResumeLibraryInfo`,
    method: 'GET',
    params
  })
}

// 人才档案 简历库 面试成功
export function approveInterview(data) {
  return request2({
    url: `/cloud/edata-oa/talentFile/personnelResumeLibrary/interviewSuccess`,
    method: 'POST',
    data
  })
}
// 人才档案 简历库 移入黑名单
export function moveToBlackList(data) {
  return request2({
    url: `/cloud/edata-oa/talentFile/personnelResumeLibrary/moveToBlacklist`,
    method: 'POST',
    data
  })
}

// 人才档案 应聘人员 分页查询
export function queryApplicantPageList(data) {
  return request2({
    url: `/cloud/edata-oa/talentFile/recruitCandidate/pageList`,
    method: 'POST',
    data
  })
}

// 人才档案 应聘人员 新增
export function addApplicant(data) {
  return request2({
    url: `/cloud/edata-oa/talentFile/recruitCandidate/add`,
    method: 'POST',
    data
  })
}

// 人才档案 应聘人员 修改
export function updateApplicant(data) {
  return request2({
    url: `/cloud/edata-oa/talentFile/recruitCandidate/update`,
    method: 'POST',
    data
  })
}

// 人才档案 应聘人员 修改面试官
export function updateInterviewer(data) {
  return request2({
    url: `/cloud/edata-oa/talentFile/recruitCandidate/updateInterviewer`,
    method: 'POST',
    data
  })
}

// 人才档案 应聘人员 查询应聘人员信息
export function getCandidateInfo(params) {
  return request2({
    url: `/cloud/edata-oa/talentFile/recruitCandidate/getCandidateInfo`,
    method: 'GET',
    params
  })
}

// 人才档案 应聘人员 撤回审批
export function withdrawApproval(params) {
  return request2({
    url: `/cloud/edata-oa/talentFile/recruitCandidate/withdrawApproval`,
    method: 'GET',
    params
  })
}

// 人才档案 应聘人员 审批
export function approval(data) {
  return request2({
    url: `/cloud/edata-oa/talentFile/recruitCandidate/approval`,
    method: 'POST',
    data
  })
}

// 人才档案-应聘人员 面试记录分页查询
export function queryInterviewRecordPageList(data) {
  return request2({
    url: `/cloud/edata-oa/talentFile/recruitCandidate/interviewRecordPageList`,
    method: 'POST',
    data
  })
}

// 人才档案-应聘人员 根据公司Id查询部门树
export function queryDeptTree(params) {
  // return request({
  return edataUserApi({
    url: `/dept/tree/companyId`,
    method: 'GET',
    params
  })
}

// 人才档案 详情 查询人员信息
export function queryPersonnelDetail(data) {
  return request2({
    url: `/cloud/edata-oa/talentFile/personnelDetail/query`,
    method: 'POST',
    data
  })
}

// 人才档案 待入职 分页查询
export function queryPersonnelEntryInfo(data) {
  return request2({
    url: `/cloud/edata-oa/talentFile/personnelEntryInfo/pageList`,
    method: 'POST',
    data
  })
}

// 人才档案 待入职 修改
export function updatePersonnelEntryInfo(data) {
  return request2({
    url: `/cloud/edata-oa/talentFile/personnelEntryInfo/update`,
    method: 'POST',
    data
  })
}

// 人才档案 待入职 信息查询
export function queryePersonnelEntryInfo(params) {
  return request2({
    url: `/cloud/edata-oa/talentFile/personnelEntryInfo/getInfo`,
    method: 'GET',
    params
  })
}

// 人才档案 应聘人员 新增面试记录
export function addAppInfo(data) {
  return request2({
    url: `/cloud/edata-oa/talentFile/recruitCandidate/addInterviewRecord`,
    method: 'POST',
    data
  })
}

// 人才档案 应聘人员 放弃面试
export function giveUpInterview(data) {
  return request2({
    url: `/cloud/edata-oa/talentFile/recruitCandidate/giveUpInterview`,
    method: 'POST',
    data
  })
}
// 人才档案 应聘人员 放弃面试
export function giveUpOffer(data) {
  return request2({
    url: `/cloud/edata-oa/talentFile/personnelEntryInfo/giveUpOffice`,
    method: 'POST',
    data
  })
}

// 人才档案 应聘人员 下载二维码
export function downloadQrCode() {
  return request2({
    url: `/cloud/edata-oa/talentFile/recruitCandidate/downloadQrCode`,
    method: 'GET'
  })
}
// 人才档案 应聘人员 面试官集合信息
export function queryInterviewerInfo(data) {
  return request2({
    url: `/cloud/edata-oa/talentFile/recruitCandidate/getInterviewerInfo`,
    method: 'POST',
    data
  })
}

// 人才档案 黑名单 分页查询
export function queryBlackList(data) {
  return request2({
    url: `/cloud/edata-oa/talentFile/personnelBlacklist/pageList`,
    method: 'POST',
    data
  })
}

// 人才档案 黑名单 删除
export function deleteBlackList(data) {
  return request2({
    url: `/cloud/edata-oa/talentFile/personnelBlacklist/delete?id=${data}`,
    method: 'DELETE'
  })
}

// 人才档案 公司主体 分页列表
export function querySubjectList(data) {
  return request2({
    url: `/cloud/edata-oa/organizational/structure/company/pageList`,
    method: 'POST',
    data
  })
}

// 人才档案 公司主体 修改状态
export function updateState(data) {
  return request2({
    url: `/cloud/edata-oa/organizational/structure/company/updateState`,
    method: 'POST',
    data
  })
}

// 人才档案 公司主体 修改公司主体
export function updateSubject(data) {
  return request2({
    url: `/cloud/edata-oa/organizational/structure/company/update`,
    method: 'POST',
    data
  })
}

// 人才档案 公司主体 添加公司主体
export function addCompany(data) {
  return request2({
    url: `/cloud/edata-oa/organizational/structure/company/add`,
    method: 'POST',
    data
  })
}

// 人才档案 详情 查看手机号
export function getPhone(params) {
  return request2({
    url: `/cloud/edata-oa/talentFile/personnelDetail/getPhone`,
    method: 'GET',
    params
  })
}

// 人才档案 详情 面试人员登记表基本信息
export function queryRegistrationBaseInfo(params) {
  return request2({
    url: `/cloud/edata-oa/talentFile/personnelDetail/interviewerRegistrationBaseInfoVo`,
    method: 'GET',
    params
  })
}

// 人才档案 黑名单 移出黑名单
export function removeBlacklist(data) {
  return request2({
    url: `/cloud/edata-oa/talentFile/personnelBlacklist/removeBlacklist`,
    method: 'POST',
    data
  })
}

// 组织结构 根据岗位名称筛选角色组
export function queryRoleByJobId(data) {
  // return request2({
  return edataUserApi({
    url: `/role/select/byJobId`,
    method: 'POST',
    data
  })
}

// 组织结构 根据部门ID查询部门所属公司信息
export function queryCompanyByDeptId(data) {
  // return request2({
  return edataUserApi({
    url: `/dept/getCompanyByDeptId/${data.deptId}`,
    method: 'GET'
  })
}

// 删除公司主体
export function deleteCompany(data) {
  return request2({
    url: `/cloud/edata-oa/organizational/structure/company/delete?id=${data}`,
    method: 'DELETE'
  })
}

//人才档案-待入职 下载二维码
export function downloadQrCodeAjax() {
  return request2({
    url: `/cloud/edata-oa/talentFile/personnelEntryInfo/downloadQrCode`,
    method: 'GET'
  })
}

//人才档案-待入职 已到岗
export function arrivalAjax(data) {
  return request2({
    url: `/cloud/edata-oa/talentFile/personnelEntryInfo/arrival`,
    method: 'POST',
    data
  })
}

//入职登记表审核
export function entryInfoAuditAjax(data) {
  return request2({
    url: `/cloud/edata-oa/talentFile/personnelEntryInfo/entryInfoAudit`,
    method: 'POST',
    data
  })
}

//人才档案 - 入职人员登记表基本信息
export function onboardingRegistrationBaseInfoVoAjax(params) {
  return request2({
    url: `/cloud/edata-oa/talentFile/personnelDetail/onboardingRegistrationBaseInfoVo`,
    method: 'GET',
    params
  })
}
//人才档案 - 详情信息
export function detailBaseInfoAjax(params) {
  return request2({
    url: `/cloud/edata-oa/talentFile/personnelDetail/detailBaseInfo`,
    method: 'GET',
    params
  })
}

//获取员工基本信息id
export function getCurrentPersonnelBaseInfoIdAjax(params) {
  return request2({
    url: `/cloud/edata-oa/talentFile/personnelDetail/getCurrentPersonnelBaseInfoId`,
    method: 'GET',
    params
  })
}

//员工基础信息修改
export function editBaseInfoAjax(data) {
  return request2({
    url: `/cloud/edata-oa/talentFile/personnelDetail/editBaseInfo`,
    method: 'POST',
    data
  })
}

//人员基础信息当前薪资查看
export function personnelDetailSalaryAjax(params) {
  return request2({
    url: `/cloud/edata-oa/talentFile/personnelDetail/getSalary`,
    method: 'GET',
    params
  })
}

//人才档案 - 详情信息-修改亲属信息
export function modifyPersonnelKinshipAjax(data) {
  return request2({
    url: `/cloud/edata-oa/talentFile/personnelDetail/modifyPersonnelKinship`,
    method: 'POST',
    data
  })
}

//人才档案 - 详情信息-ocr识别
export function personnelDetailOcrRecognizeAjax(data) {
  return request2({
    url: `/cloud/edata-oa/talentFile/personnelDetail/ocr/recognize`,
    method: 'POST',
    data
  })
}
//修改入职资料信息
export function modifyEntryInfoAjax(data) {
  return request2({
    url: `/cloud/edata-oa/talentFile/personnelDetail/modifyEntryInfo`,
    method: 'POST',
    data
  })
}

//公司主体列表查询
export function getCompanyListAjax(data) {
  return request2({
    url: `/cloud/edata-oa/organizational/structure/company/list`,
    method: 'get',
    data
  })
}
//简历处理
export function resumeHandleAjax(data) {
  return request2({
    url: `/cloud/edata-oa/talentFile/personnelDetail/resume/handle`,
    method: 'POST',
    data
  })
}
