
import request from '@/utils/request'
import request2 from '@/utils/request2'
import request3 from '@/utils/request3'
import { edataUserApi } from '@/utils/http/index.js'
// 发送验证码
export function sendCode(query) {
  return request2({
    url: `/cloud/edata-user/login/send/code/${query}`,
    method: 'POST'
  })
}

// 验证码登录
export function login(data) {
  return request2({
    url: '/cloud/edata-user/login',
    method: 'post',
    data
  })
}

// 密码登录
export function loginByPassword(data) {
  return request2({
    url: '/cloud/edata-user/login/password',
    method: 'post',
    data
  })
}

// 登录方法-机构选择
export function loginSelectOrganization(data) {
  return request2({
    url: '/cloud/edata-user/login/select/organization',
    method: 'post',
    data
  })
}
// 修改密码
export function updatePassword(data) {
  return request({
    url: '/login/updatePassword',
    method: 'POST',
    data
  })
}

// 获取路由列表数据
export function getRouterList() {
  console.log('edataUserApi---------', edataUserApi)
  // return request({
  return edataUserApi({
    url: '/menu/getRouters',
    method: 'get'
  })
}
// 获取修改密码验证码
export function updatePwdCode(phone) {
  // return request({
  return edataUserApi({
    url: `/system/user/updatePwd/code/${phone}`,
    method: 'get'
  })
}

// 通过手机号获取用户的账号信息
export function qryMerchantByPhone(data) {
  return request2({
    url: `/cloud/edata-wemedia/open/qryMerchantByPhone?phone=${data.phone}`,
    method: 'get'
  })
}

// 通过手机号获取用户的账号信息（新版客户端）
export function qryMerchantByPhoneNew(data) {
  return request2({
    url: `/cloud/edata-wemedia/open/qryMerchantByPhoneNew?phone=${data.phone}`,
    method: 'get'
  })
}

// 修改登录cookie（防掉线）
export function yixiaoerCheckLogin(data) {
  return request2({
    url: `/cloud/edata-wemedia/open/yixiaoerCheckLogin`,
    method: 'post',
    data
  })
}

// 记录不需要token的接口访问日志
export function yixiaoerStat(data) {
  return request2({
    url: `/cloud/edata-wemedia/open/yixiaoerStat`,
    method: 'post',
    data
  })
}

// 校验修改密码验证码
export function updatePwdVerify(data) {
  // return request({
  return edataUserApi({
    url: `/system/user/updatePwd/verify`,
    method: 'POST',
    data
  })
}

// 校验修改密码验证码
export function loginV1UpdatePassword(data) {
  // return request({
  return edataUserApi({
    url: `/login/v1/updatePassword`,
    method: 'POST',
    data
  })
}

// 获取用户超级管理员身份
export function getUserInfo(phone) {
  // return request({
  return edataUserApi({
    url: `/system/user/feign/detail/phone/${phone}`,
    method: 'get'
  })
}

// 获取当前账号是否有未同步的数据
export function qryNonSyncAccountNum() {
  return request2({
    url: `/cloud/edata-wemedia/media/account/qryNonSyncAccountNum`,
    method: 'get'
  })
}

// 获取老师客户端跳转web用户信息
export function getTeacherClientForWordWebUserInfo(params) {
  return request2({
    url: '/cloud/edata-user/login/getTeacherClientForWordWebUserInfo',
    method: 'GET',
    params
  })
}

// 权限v1.0.0相关接口
// 根据当前用户
export function getUserAccountList(params) {
  return request3({
    url: '/cloud/edata-user/feishu/getUserAccountList',
    method: 'GET',
    params
  })
}

// 发送验证码
export function sendCode2(query) {
  return request3({
    url: `/cloud/edata-user/login/send/code/${query}`,
    method: 'POST'
  }, true)
}

// 验证码登录
export function login2(data) {
  return request3({
    url: '/cloud/edata-user/login',
    method: 'post',
    data
  }, true)
}

// 密码登录
export function loginByPassword2(data) {
  return request3({
    url: '/cloud/edata-user/login/password',
    method: 'post',
    data
  }, true)
}

// 根据登录地址获取飞书appId
export function getOrganizationAppId(params) {
  return request3({
    url: '/cloud/edata-user/organization/getOrganizationAppId',
    method: 'get',
    params
  }, true)
}
// 根据登录地址获取企微appId
export function getWecomAppIdApi(params) {
  return request3({
    url: '/cloud/edata-user/enterprise/wechat/getAppInfo',
    method: 'get',
    params
  }, true)
}

// 获取用户机构信息
export function getUserOrganizationListUsing(params) {
  return request3({
    url: '/cloud/edata-user/login/getUserOrganizationList',
    method: 'get',
    params
  })
}

// 根据飞书code获取用户信息(飞书登录)
export function feishuLoginApi(params) {
  return request3({
    url: '/cloud/edata-user/feishu/callback',
    method: 'get',
    params
  })
}
// 根据企微code获取用户信息(企微登录)
export function wecomLoginApi(params) {
  return request3({
    url: '/cloud/edata-user/enterprise/wechat/authorization/back',
    method: 'get',
    params
  })
}

// 保存绑定用户
export function saveBindUser(data) {
  return request3({
    url: '/cloud/edata-user/feishu/saveBindUser',
    method: 'post',
    data
  })
}

// 绑定后调用这个接口获取token
export function getUserByOrganizationAccount(data) {
  return request3({
    // url: '/cloud/edata-user/login/getUserByOrganizationAccount',
    url: '/cloud/edata-user/login/getOrganizationUserAccount',
    method: 'POST',
    data
  })
}
// 获取当前用户成功的发布记录信息
export function qryPublishSuccessInfo() {
  return request2({
    url: `/cloud/edata-wemedia/publishTask/qryPublishSuccessInfo`,
    method: 'get'
  })
}

// 测试接口
export function post_test(data) {
  return request3({
    url: `/cloud/edata-clue/cyxTest/post_test`,
    method: 'post',
    data
  })
}

// 发送邮箱验证码
export function sendEmailCode(query) {
  return request3({
    url: `/cloud/edata-user/login/send/email/code/${query}`,
    method: 'POST'
  }, true)
}

export function logoutForUser() {
  return request3({
    url: `/cloud/edata-user/login/logout`,
    method: 'POST'
  })
}
