import request from '@/utils/request2'
// 获取分组列表
export function getAccountGroupList(params) {
  return request({
    url: '/cloud/edata-wemedia/media/account/groupList',
    method: 'post',
    data: params
  })
}

// 查询账号列表
export function getAccountList(params) {
  return request({
    url: '/cloud/edata-wemedia/media/account/accountList',
    method: 'post',
    data: params
  })
}

// 查询异常账号列表
export function getAbnormalAccountList(params) {
  return request({
    url: '/cloud/edata-wemedia/media/exception/account/accountList',
    method: 'post',
    data: params
  })
}

// 查询平台信息
export function getPlatform() {
  return request({
    url: '/cloud/edata-wemedia/media/account/qryPlatform',
    method: 'get'
  })
}

// 账号停更
export function stopAccount(params) {
  return request({
    url: '/cloud/edata-wemedia/media/account/accountStopRenew',
    method: 'post',
    data: params
  })
}

// 账号申请
export function examineAccount(params) {
  return request({
    url: '/cloud/edata-wemedia/account/examine/submit',
    method: 'post',
    data: params
  })
}

// 恢复更新
export function resumeAccount(params) {
  return request({
    url: '/cloud/edata-wemedia/media/account/accountRestoreRenew',
    method: 'post',
    data: params
  })
}

// 转号
export function transferAccount(params) {
  return request({
    url: '/cloud/edata-wemedia/media/account/transferAccount',
    method: 'post',
    data: params
  })
}

// 移交老师
export function transferTeacher(params) {
  return request({
    url: '/cloud/edata-wemedia/media/account/transferTeacher',
    method: 'post',
    data: params
  })
}

// 恢复账号
export function recoverAccount(params) {
  return request({
    url: '/cloud/edata-wemedia/media/exception/account/restore',
    method: 'post',
    data: params
  })
}

// 变更运营者
export function changeOperator(params) {
  return request({
    url: '/cloud/edata-wemedia/media/account/editOperate',
    method: 'post',
    data: params
  })
}

// 账号注销
export function logoffAccount(params) {
  return request({
    url: '/cloud/edata-wemedia/media/account/accountLogOff',
    method: 'post',
    data: params
  })
}

// 日志记录
export function getLogList(params) {
  return request({
    url: '/cloud/edata-wemedia/media/account/accountLog',
    method: 'post',
    data: params
  })
}

// 查询平台信息1
export function getMyPlatform(data) {
  return request({
    url: `/cloud/edata-wemedia/media/account/qryMyPlatform?type=${data.type}`,
    method: 'get'

  })
}

//
export function qryAccountPlatform(data) {
  return request({
    url: '/cloud/edata-wemedia/media/account/qryAccountPlatform',
    method: 'get',
    data
  })
}

// 查询登录平台信息
export function getPlatformLogin(params) {
  return request({
    url: '/cloud/edata-wemedia/media/account/qryLoginMerchant',
    method: 'get',
    params
  })
}

// 获取当前登录人是否为负责人的状态
export function getLoginInfo() {
  return request({
    url: '/cloud/edata-wemedia/media/account/qryLoginInfo',
    method: 'get'
  })
}

// 添加分组
export function addAccountGroup(params) {
  return request({
    url: '/cloud/edata-wemedia/media/account/addGroup',
    method: 'post',
    data: params
  })
}

// 添加账号
export function addAccountMedia(params) {
  return request({
    url: '/cloud/edata-wemedia/media/account/add',
    method: 'post',
    data: params
  })
}

// 删除分组
export function deleteGroup(params) {
  return request({
    url: '/cloud/edata-wemedia/media/account/delGroup',
    method: 'post',
    params
  })
}

// 根据平台id查询所有账号
export function getAccountByPlatform(params) {
  return request({
    url: '/cloud/edata-wemedia/media/account/qryAccountByPlatformId',
    method: 'get',
    params
  })
}

// 编辑分组
export function editForGroup(params) {
  return request({
    url: '/cloud/edata-wemedia/media/account/updateGroup',
    method: 'post',
    data: params
  })
}

// 删除账号
export function deleteAccount(params) {
  return request({
    url: '/cloud/edata-wemedia/media/account/delete',
    method: 'post',
    data: params
  })
}

// 校验账号唯一绑定
export function checkAccount(params) {
  return request({
    url: '/cloud/edata-wemedia/media/account/checkAccount',
    method: 'get',
    params
  })
}

// 校验登录账号是否一致
export function checkLogin(params) {
  return request({
    url: '/cloud/edata-wemedia/media/account/checkLogin',
    method: 'get',
    params
  })
}

// 更改登录状态
export function updateUnLogin(data) {
  return request({
    url: '/cloud/edata-wemedia/media/account/updateUnLogin',
    method: 'post',
    data
  })
}

// 记录登录错误日志
export function saveErrorInfo(data) {
  return request({
    url: '/cloud/edata-wemedia/yixiaoer/errorInfo/saveErrorInfo',
    method: 'post',
    data
  })
}

// 修改账户数据
export function updateAccount(params) {
  return request({
    url: '/cloud/edata-wemedia/media/account/update',
    method: 'post',
    data: params
  })
}

// 修改账户的登录状态
export function updateLoginStatus(params) {
  return request({
    url: '/cloud/edata-wemedia/media/account/updateStatus',
    method: 'post',
    data: params
  })
}

// 查询当前用户是否负责人接口
export function getIsChanger() {
  return request({
    url: '/cloud/edata-wemedia/media/account/qryLoginInfo',
    method: 'get'
  })
}

// 发布列表记录list
export function getReleaseRecord(params) {
  return request({
    url: '/cloud/edata-wemedia/publishTask/publishTaskPageList',
    method: 'post',
    data: params
  })
}

// 发布记录详情数据
export function getReleaseRecordDetail(params) {
  return request({
    url: '/cloud/edata-wemedia/publishTask/publishTaskRecordList',
    method: 'get',
    params
  })
}

// 分组列表查询（列表搜索块）
export function getGroupList() {
  return request({
    url: '/cloud/edata-wemedia/media/account/groupAccount',
    method: 'get'
  })
}

// 查询当前用户是否有账号及账号列表
export function getHasAccountAndList() {
  return request({
    url: '/cloud/edata-wemedia/media/account/qryAccountByUserId',
    method: 'get'
  })
}

// 根据平台id查询该用户的账号
export function getMyAccountList(data) {
  return request({
    url: `/cloud/edata-wemedia/media/account/qryMyAccountByPlatformId?platformId=${data.platformId}&type=${data.type}`,
    method: 'get'
  })
}

// 删除发布任务记录
export function delTaskRecord(taskRecordId) {
  return request({
    url: `/cloud/edata-wemedia/publishTask/delTaskRecord?taskRecordId=` + taskRecordId,
    method: 'post'
    //  data: taskRecordId
  })
}

// 获取设置信息
export function syncCheckGetInfo(params) {
  return request({
    url: `/cloud/edata-wemedia/syncCheck/getInfo`,
    method: 'get',
    params
  })
}

// 获取设置信息
export function syncCheckSave(data) {
  return request({
    url: `/cloud/edata-wemedia/syncCheck/save`,
    method: 'post',
    data
  })
}

// 数据同步检测
export function syncCheck(params) {
  return request({
    url: `/cloud/edata-wemedia/syncCheck/check`,
    method: 'get',
    params
  })
}

// 账号列表粉丝数
export function getAccountListFansNum(data) {
  return request({
    url: `/cloud/edata-wemedia/media/account/accountListFansNum`,
    method: 'post',
    data
  })
}

// 插入账号同步数据状态
export function insertSyncStatus(data) {
  return request({
    url: `/cloud/edata-wemedia/account/insertSyncStatus`,
    method: 'post',
    data
  })
}

// 查询账号同步状态
export function qrySyncStatus(data) {
  return request({
    url: `/cloud/edata-wemedia/account/qrySyncStatus`,
    method: 'post',
    data
  })
}

// 获取自媒体上报问题列表
export function qryMediaProblemList(data) {
  return request({
    url: `/cloud/edata-wemedia/account/qryMediaProblemList`,
    method: 'post',
    data
  })
}

// 获取模拟调用接配置
export function getMediaImitateConfig(params) {
  return request({
    url: `/cloud/edata-wemedia/media/account/getMediaImitateConfig`,
    method: 'get',
    params
  })
}

// 导出账号列表
export function exportAccountList(data) {
  return request({
    url: `/cloud/edata-wemedia/media/account/exportAccountList`,
    method: 'post',
    responseType: 'blob',
    data
  })
}

// 根据自媒体账号id获取用户最新token
export function qryCookieByPlatformAccountId(params) {
  return request({
    url: `/cloud/edata-wemedia/media/account/qryCookieByPlatformAccountId`,
    method: 'get',
    params
  })
}

// 保存用户伏羲云版本号
export function saveUserVersion(data) {
  return request({
    url: `/cloud/edata-wemedia/open/saveUserVersion`,
    method: 'post',
    data
  })
}
