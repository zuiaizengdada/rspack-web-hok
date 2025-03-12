import request from '@/utils/request2'
import request3 from '@/utils/request3'

// 师资合同档案

// 新增讲师合同档案
export function addTeacherContract(data) {
  return request({
    url: '/cloud/teacher/contract/add',
    method: 'POST',
    data
  })
}
// 新增讲师合同档案时下拉选择合同回显横线以下
export function teacherContarctBasic(data) {
  return request({
    url: '/cloud/teacher/contract/basic',
    method: 'POST',
    data
  })
}
// 师资合同档案详情查询
export function getTeacherContractDetail(data) {
  return request({
    url: '/cloud/teacher/contract/info',
    method: 'POST',
    data
  })
}
// 合同到期设置
export function teacherContarctExpireSave(data) {
  return request({
    url: '/cloud/teacher/contract/expire/save',
    method: 'POST',
    data
  })
}
// 合同到期设置规则详情
export function getRuleInfo() {
  return request({
    url: '/cloud/teacher/contract/rule/info',
    method: 'GET'
  })
}

// 师资合同档案列表查询
export function teacherContarctList(params) {
  return request({
    url: '/cloud/teacher/contract/page',
    method: 'GET',
    params
  })
}
// 新增讲师合同档案时点击续签讲师对应合同名称回显
export function teacherContarctName(data) {
  return request({
    url: '/cloud/teacher/contract/name',
    method: 'POST',
    data
  })
}
// 解除师资合同档案详情查询
export function getTeacherContarctTerminateDetail(data) {
  return request({
    url: '/cloud/teacher/contract/terminate/info',
    method: 'POSt',
    data
  })
}
// 解除师资合同档案保存
export function teacherContarctTerminateSave(data) {
  return request({
    url: '/cloud/teacher/contract/terminate',
    method: 'POST',
    data
  })
}
// 编辑讲师
export function teacherContarctUpdate(data) {
  return request({
    url: '/cloud/teacher/contract/update',
    method: 'POST',
    data
  })
}

// 师资授权
// 师资授权新增接口
export function authorizeAdd(data) {
  return request({
    url: '/cloud/teacher/authorize/add',
    method: 'POST',
    data
  })
}
// 师资授权详情
export function authorizeInfo(id) {
  return request({
    url: `/cloud/teacher/authorize/info/${id}`,
    method: 'GET'
  })
}
// 分页师资授权列表
export function getAuthorizePage(params) {
  return request({
    url: '/cloud/teacher/authorize/page',
    method: 'get',
    params
  })
}
// 师资授权修改接口
export function authorizeUpdate(data) {
  return request({
    url: '/cloud/teacher/authorize/update',
    method: 'PUT',
    data
  })
}

// 数据看板
// 讲师累计评估数据
export function teacherReportAssess(params) {
  return request({
    url: '/cloud/teacher/report/assess',
    method: 'GET',
    params
  })
}
// 师资评估情况表统计
export function teacherReportUserAssess(params) {
  return request({
    url: '/cloud/teacher/report/asseess/user/teacher',
    method: 'GET',
    params
  })
}

// 师资档案
// 新增讲师
export function teacherAdd(data) {
  return request({
    url: '/cloud/teacher/teacher/add',
    method: 'POST',
    data
  })
}
// 收藏视频至师资档案
export function teacherCollect(data) {
  return request({
    url: '/cloud/teacher/teacher/collect',
    method: 'POST',
    data
  })
}
// 师资档案明细查询
export function getTeacherDetail(params) {
  return request({
    url: '/cloud/teacher/teacher/detail',
    method: 'GET',
    params
  })
}
// 师资档案列表查询
export function getTeacherList(params) {
  return request({
    url: '/cloud/teacher/teacher/list',
    method: 'GET',
    params
  })
}
// 通过老师模糊查询老师
export function teacherQueryByName(params) {
  return request({
    url: '/cloud/teacher/teacher/queryByName',
    method: 'GET',
    params
  })
}
// 查询最近成品视频选择的老师
export function qryRecentlyTeacher(params) {
  return request({
    url: '/cloud/product/finish/video/qryRecentlyTeacher',
    method: 'GET',
    params
  })
}
// 删除最近成品视频选择的老师
export function delRecentlyTeacher(data) {
  return request({
    url: '/cloud/product/finish/video/delRecentlyTeacher/' + data.teacherId,
    method: 'POST'
  })
}

// 编辑讲师
export function teacherUpdate(data) {
  return request({
    url: '/cloud/teacher/teacher/update',
    method: 'POST',
    data
  })
}

// 师资用户评估
// 师资评估
export function assessUserAdd(params) {
  return request({
    url: '/cloud/teacher/assess/user/add',
    method: 'GET',
    params
  })
}
// 师资评估
export function assessUserSave(data) {
  return request({
    url: '/cloud/teacher/assess/user/save',
    method: 'POST',
    data
  })
}

// 师资评估
// 新增师资评估
export function assessAdd(teacherId) {
  return request({
    url: `/cloud/teacher/assess/add/${teacherId}`,
    method: 'POST'
  })
}
// 师资评估详情
export function assessInfoTeacherId(teacherId) {
  return request({
    url: `/cloud/teacher/assess/info/${teacherId}`,
    method: 'GET'
  })
}
// 分页师资评估列表
export function assessPage(params) {
  return request({
    url: '/cloud/teacher/assess/page',
    method: 'GET',
    params
  })
}

// 排班
// 新增日程
export function schedulingCreate(data) {
  return request({
    url: '/cloud/teacher/scheduling/create',
    method: 'POST',
    data
  })
}
// 编辑日程
export function schedulingEdit(data) {
  return request({
    url: '/cloud/teacher/scheduling/edit',
    method: 'POST',
    data
  })
}
// 查询月份排班
export function schedulingMonth(params) {
  return request({
    url: '/cloud/teacher/scheduling/month',
    method: 'GET',
    params
  })
}
// 排班设置
export function schedulingSettings(data) {
  return request({
    url: '/cloud/teacher/scheduling/settings',
    method: 'POST',
    data
  })
}

// 行业管理
// 行业列表
export function getTradeList(params) {
  return request({
    url: '/cloud/teacher/trade/list',
    method: 'GET',
    params
  })
}
// 行业修改
export function tradeListEdit(data) {
  return request({
    url: '/cloud/teacher/trade/update',
    method: 'POST',
    data
  })
}
// 行业新增
export function tradeAdd(data) {
  return request({
    url: '/cloud/teacher/trade/add',
    method: 'POST',
    data
  })
}
// 行业删除
export function tradeDel(data) {
  return request({
    url: '/cloud/teacher/trade/delete',
    method: 'POST',
    data
  })
}

// 领域管理
// 新增领域
export function addDomain(data) {
  return request({
    url: '/cloud/teacher/domain/add',
    method: 'POST',
    data
  })
}
// 领域列表
export function getDomainList(params) {
  return request({
    url: '/cloud/teacher/domain/list',
    method: 'get',
    params
  })
}
// 修改
export function editDomain(data) {
  return request({
    url: `/cloud/teacher/domain/update`,
    method: 'POST',
    data
  })
}
// 删除
export function delDomain(data) {
  return request({
    url: '/cloud/teacher/domain/delete',
    method: 'POST',
    data
  })
}

// 老师排班列表
export function getScheduleList(params) {
  return request({
    url: '/cloud/teacher/schedule/list',
    method: 'GET',
    params
  })
}

// 公司主体列表e
export function getCompanyList() {
  return request({
    url: '/cloud/teacher/company/list',
    method: 'GET'
  })
}

// 老师排班保存
export function teacherScheduleSave(data) {
  return request({
    url: '/cloud/teacher/schedule/save',
    method: 'POST',
    data
  })
}

// 老师排班设置查询
export function teacherSchduleSettingInfo() {
  return request({
    url: '/cloud/teacher/scheduling/settingsInfo',
    method: 'GET'
  })
}

// 讲师数据对比
export function teacherReportContrast(params) {
  return request({
    url: '/cloud/teacher/report/contrast',
    method: 'GET',
    params
  })
}

// 老师综合得分排行榜
export function teacherOverallRating(params) {
  return request({
    url: '/cloud/teacher/report/overallRating',
    method: 'GET',
    params
  })
}
// 已评估讲师排行榜
export function teacherAssessedOverallRating(params) {
  return request({
    url: '/cloud/teacher/report/assessed/overallRating',
    method: 'GET',
    params
  })
}
// 讲师合作状态累计数据统计
export function teacherStatusSum(params) {
  return request({
    url: '/cloud/teacher/teacher/status/sum',
    method: 'GET',
    params
  })
}

// 排期汇总表
export function scheduleSummary(params) {
  return request({
    url: '/cloud/teacher/schedule/summary',
    method: 'GET',
    params
  })
}

// 首页讲师设置查询列表
export function teacherIndexList(params) {
  return request({
    url: '/cloud/teacher/index/list',
    method: 'GET',
    params
  })
}

export function teacherIndexSave(data) {
  return request({
    url: '/cloud/teacher/index/save',
    method: 'post',
    data
  })
}

// 通过老师模糊查询老师(查询合作中的老师)
export function teacherQueryByStatus(params) {
  return request({
    url: '/cloud/teacher/teacher/queryByStatus',
    method: 'GET',
    params
  })
}
// 讲师评估趋势图
export function teacherAssessTrend(params) {
  return request({
    url: '/cloud/teacher/report/assess/trend/web',
    method: 'GET',
    params
  })
}

// 评估提醒设置
export function teacherAssessSettings(data) {
  return request({
    url: '/cloud/teacher/assess/settings',
    method: 'POST',
    data
  })
}

// 评估提醒设置查询
export function teacherAssessSettingsInfo(params) {
  return request({
    url: '/cloud/teacher/assess/settingsInfo',
    method: 'GET',
    params
  })
}

// 合同文件导出
export function teacherContractFileToZip(data) {
  return request({
    url: '/cloud/teacher/contract/contractFileToZip',
    method: 'POST',
    data
  })
}

// 讲师导入-模板下载
export function teacherDownload(data) {
  return request({
    url: '/cloud/teacher/teacher/download',
    method: 'POST',
    data
  })
}

// 讲师导入
export function teacherImport({ data, params }) {
  return request({
    url: '/cloud/teacher/teacher/import',
    method: 'POST',
    data,
    params
  })
}

// 师资档案修改查询
export function teacherListName(params) {
  return request({
    url: '/cloud/teacher/teacher/listName',
    method: 'GET',
    params
  })
}

// 修改讲师名称
export function teacherUpdateName(data) {
  return request({
    url: '/cloud/teacher/teacher/updateName',
    method: 'POST',
    data
  })
}

// 师资档案查询日志
export function teacherLogDetail(params) {
  return request({
    url: '/cloud/teacher/teacher/log/detail',
    method: 'GET',
    params
  })
}

// 师资评估详情导出
export function teacherAssessInfoExport(params) {
  return request({
    url: '/cloud/teacher/assess/assessInfoExport',
    method: 'GET',
    params
  })
}
// 师资评估数据导出
export function teacherAssessExport(params) {
  return request({
    url: '/cloud/teacher/assess/assessExport',
    method: 'GET',
    params
  })
}

// 师资档案草稿列表查询
export function teacherDraftList(params) {
  return request({
    url: '/cloud/teacher/teacher/draft/list',
    method: 'GET',
    params
  })
}

// 新增讲师草稿
export function teacherDraftAdd(data) {
  return request({
    url: '/cloud/teacher/teacher/draft/add',
    method: 'post',
    data
  })
}

// 编辑讲师草稿
export function teacherDraftUpdate(data) {
  return request({
    url: '/cloud/teacher/teacher/draft/update',
    method: 'post',
    data
  })
}

// 删除讲师草稿
export function teacherDraftDel(teacherId) {
  return request({
    url: `/cloud/teacher/teacher/draft/delete/${teacherId}`,
    method: 'post'
  })
}

// 讲师导入
export function teacherDraftImport({ data, params }) {
  return request({
    url: `/cloud/teacher/teacher/draft/import`,
    method: 'post',
    data,
    params
  })
}

// 师资档案草稿明细查询
export function teacherDraftDetail(params) {
  return request({
    url: `/cloud/teacher/teacher/draft/detail`,
    method: 'get',
    params
  })
}
// 模糊查询老师-分页
export function teacherDraftQueryByName(params) {
  return request({
    url: `/cloud/teacher/teacher/draft/queryByName`,
    method: 'get',
    params
  })
}

// 讲师评估维度平均分
export function teacherAssessDimension(params) {
  return request({
    url: `/cloud/teacher/report/assess/dimension`,
    method: 'get',
    params
  })
}

// 获取评估结果通知人员
export function teacherGetSendUser(params) {
  return request({
    url: `/cloud/teacher/assess/getSendUser`,
    method: 'get',
    params
  })
}

export function teacherSetSendUser(data) {
  return request({
    url: `/cloud/teacher/assess/setSendUser`,
    method: 'POST',
    data
  })
}

export function teacherAssessUserInfo(teacherId) {
  return request({
    url: `/cloud/teacher/assess/user/info/${teacherId}`,
    method: 'get',
    teacherId
  })
}

export function teacherUserUpdate(data) {
  return request({
    url: `/cloud/teacher/assess/user/update`,
    method: 'put',
    data
  })
}
// 模糊查询正式、草稿老师
export function teacherQueryAllByName(params) {
  return request({
    url: `/cloud/teacher/teacher/draft/queryAllByName`,
    method: 'get',
    params
  })
}

// 师资跟进记录列表查询
export function teacherFollowList(params) {
  return request({
    url: `/cloud/teacher/teacher/follow/list`,
    method: 'get',
    params
  })
}
// 新增讲师跟进记录
export function teacherFollowAdd(data) {
  return request3({
    url: `/cloud/teacher/teacher/follow/add`,
    method: 'POST',
    data
  }, true, true)
}

// 师资合作状态枚举查询
export function getTeacherCooperateStatus(data) {
  return request({
    url: `/cloud/teacher/teacher/getTeacherCooperateStatus`,
    method: 'get',
    data
  })
}

// 查询分组列表
export function getGroupList(params) {
  return request({
    url: `/cloud/teacher/teacher/group/list`,
    method: 'get',
    params
  })
}

// 新增分组
export function getGroupAdd(data) {
  return request({
    url: `/cloud/teacher/teacher/group/add`,
    method: 'POST',
    data
  })
}

// 删除分组
export function getGroupDel(groupId) {
  return request({
    url: `/cloud/teacher/teacher/group/delete/${groupId}`,
    method: 'POST'
  })
}

// 编辑分组
export function getGroupEdit(data) {
  return request({
    url: `/cloud/teacher/teacher/group/edit`,
    method: 'POST',
    data
  })
}

// 查询分组下拉列表（不分页）
export function getGroupNameList(params) {
  return request({
    url: `/cloud/teacher/teacher/group/groupName/list`,
    method: 'get',
    params
  })
}

// 根据分组ID查询分组详情
export function getGroupDetail(groupId) {
  return request({
    url: `/cloud/teacher/teacher/group/detail/${groupId}`,
    method: 'get'
  })
}

// 根据讲师ID查询最新跟进记录
export function getFollowNewest(params) {
  return request({
    url: `/cloud/teacher/teacher/follow/newest`,
    method: 'get',
    params
  })
}
// 师资档案列表数据导出
export function getTeacherListExport(params) {
  return request({
    url: `/cloud/teacher/teacher/list/export`,
    method: 'get',
    params
  })
}
// 师资最新跟进列表查询
export function getFollowList(params) {
  return request({
    url: '/cloud/teacher/teacher/follow/newest/list',
    method: 'get',
    params
  })
}

// 查询跟进结果通知人员
export function getFollowUsers(params) {
  return request({
    url: '/cloud/teacher/teacher/follow/notify/users',
    method: 'get',
    params
  })
}

// 更新跟进结果通知人员
export function getFollowUpdate(data) {
  return request({
    url: '/cloud/teacher/teacher/follow/update/followers',
    method: 'POST',
    data
  })
}

// 分页师资审核列表查询
export function getTeacherAudit(params) {
  return request({
    url: '/cloud/teacher/teacher/audit/page',
    method: 'get',
    params
  })
}

// 查询分组下拉列表（不分页）
export function auditListDelete(params) {
  return request({
    url: `/cloud/teacher/teacher/audit/delete`,
    method: 'get',
    params
  })
}

// 讲师初审结果枚举查询
export function getTeacherCheckResult(params) {
  return request({
    url: '/cloud/teacher/teacher/audit/getTeacherCheckResult',
    method: 'get',
    params
  })
}

// 通过老师模糊查询老师
export function teacherQueryByNameAudit(params) {
  return request({
    url: '/cloud/teacher/teacher/audit/queryByName/page',
    method: 'GET',
    params
  })
}

// 初审/新增讲师
export function addAuditTeacher(data) {
  return request({
    url: '/cloud/teacher/teacher/audit/add',
    method: 'POST',
    data
  })
}

// 初审/编辑讲师
export function editAuditTeacher(data) {
  return request({
    url: '/cloud/teacher/teacher/audit/edit',
    method: 'POST',
    data
  })
}

// 初审/查询跟进结果通知人员
export function getFollowUsersAudit(params) {
  return request({
    url: '/cloud/teacher/teacher/audit/notify/users',
    method: 'get',
    params
  })
}

// 初审/更新跟进结果通知人员
export function getFollowUpdateAudit(data) {
  return request({
    url: '/cloud/teacher/teacher/audit/update/users',
    method: 'POST',
    data
  })
}

// 根据姓名模糊查询全局老师
export function getQueryAllByName(params) {
  return request({
    url: '/cloud/teacher/teacher/queryAllByName',
    method: 'get',
    params
  })
}

// 查询讲师初审记录详情
export function getAuditDetail(params) {
  return request({
    url: '/cloud/teacher/teacher/audit/detail',
    method: 'get',
    params
  })
}

// 新增/编辑评估维度管理
export function getDimensionOperate(data) {
  return request({
    url: '/cloud/teacher/assess/dimension/operate',
    method: 'POST',
    data
  })
}

// 查询评估维度管理
export function getDimensionManagement(params) {
  return request({
    url: '/cloud/teacher/assess/dimension/management',
    method: 'get',
    params
  })
}

// 讲师开发统计
export function getStatisticsTeacher(params) {
  return request({
    url: '/cloud/teacher/report/statistics/user/teacher',
    method: 'get',
    params
  })
}
// 根据讲师ID查询讲师评估维度
export function getUserDimension(teacherId) {
  return request({
    url: `/cloud/teacher/assess/user/dimension/${teacherId}`,
    method: 'get'
  })
}

// 老师相似度对比 搜索老师姓名
export function searchTeacherName(data) {
  return request({
    url: `/cloud/teacher/teacher/similarity/compare/searchTeacherName`,
    method: 'post',
    data
  })
}

// 老师相似度对比 搜索老师人脸
export function searchTeacherFace(data) {
  return request({
    url: `/cloud/teacher/teacher/similarity/compare/searchTeacherFace`,
    method: 'post',
    data
  })
}

// 搜索老师
export function searchTeacher(data) {
  return request({
    url: `/cloud/teacher/teacher/similarity/compare`,
    method: 'post',
    data
  })
}

// 查询机构师资共享配置

export function getSharingSettingOrgByType(data) {
  return request({
    url: `/cloud/teacher/sharing/getSharingSettingOrgByType`,
    method: 'post',
    data
  })
}

// 搜索老师新
export function searchTeacherNew(data) {
  return request({
    url: `/cloud/teacher/teacher/similarity/compare/pageList`,
    method: 'post',
    data
  })
}

// 师资转让
export function teacherTransferToOrg(data) {
  return request({
    url: `/cloud/teacher/teacher/transfer/teacherTransferToOrg`,
    method: 'post',
    data
  })
}

// 师资转出记录列表查询
export function teacherTransferList(params) {
  return request({
    url: `/cloud/teacher/teacher/transfer/list`,
    method: 'get',
    params
  })
}

// 添加机构师资共享配置

export function addSharingSettingOrgByType(data) {
  return request({
    url: `/cloud/teacher/sharing/addSharingSettingOrgByType`,
    method: 'post',
    data
  })
}

// 删除机构师资共享配置 1：可查看的企业 2：已共享给的企业

export function delSharingSettingOrgByType(data) {
  return request({
    url: `/cloud/teacher/sharing/delSharingSettingOrgByType`,
    method: 'post',
    data
  })
}

// 获取所有机构列表

export function getAllOrgans(data) {
  return request({
    url: `/cloud/teacher/sharing/getAllOrgans`,
    method: 'post',
    data
  })
}

// 据名称查询讲师数量
export function getCountByTeacherName(params) {
  return request({
    url: `/cloud/teacher/teacher/getCountByTeacherName`,
    method: 'get',
    params
  })
}
export function updateShare(data) {
  return request({
    url: `/cloud/teacher/teacher/updateShare`,
    method: 'post',
    data
  })
}
