import request from '@/utils/request'
import request2 from '@/utils/request2'
import request3 from '@/utils/request3'
import { edataUserApi, edataCustomerAdminApi } from '@/utils/http/index.js'

import qs from 'qs'
// 用户管理
// 分页查询
export function GetMemberList(params) {
  // return request({
  return edataCustomerAdminApi({
    url: '/pf/user/page',
    method: 'get',
    params: params,
    paramsSerializer: function (params) {
      return qs.stringify(params, { arrayFormat: 'repeat' })
    }
  })
}

// 新增用户
export function userAdd(data) {
  // return request({
  return edataCustomerAdminApi({
    url: '/user/user',
    method: 'post',
    data
  })
}
// 新增用户 new
export function pfUserAdd(data) {
  // return request({
  return edataCustomerAdminApi({
    url: '/pf/user/add',
    method: 'post',
    data
  })
}
// 客服发送验证码
export function sendCode(data) {
  return request2({
    url: '/cloud/edata-cms/phone/send/code/pf',
    method: 'post',
    data
  })
}
// 修改手机号记录列表
export function getPhoneRecord(params) {
  return request2({
    url: `/cloud/edata-cms/phone/record/page`,
    method: 'get',
    params
  })
}
// 详情
export function Detail(userId) {
  // return request({
  return edataCustomerAdminApi({
    url: `/pf/user/detail/${userId}`,
    method: 'get'
  })
}
// 获取用户学习进度
export function getUserProgress(params) {
  return request2({
    url: '/cloud/admin/user/progress/listByPlatformUserId',
    method: 'get',
    params
  })
}
// 编辑用户资料
export function userEdit(data) {
  // return request({
  return edataCustomerAdminApi({
    url: '/pf/user',
    method: 'PUT',
    data
  })
}
// 批量贴标签
export function userLabelBatch(data) {
  // return request({
  return edataCustomerAdminApi({
    url: '/pf/user/batch',
    method: 'post',
    data
  })
}
// 取消标签关联
export function userLabelDisassociate(data) {
  // return request({
  return edataCustomerAdminApi({
    url: '/relation/label/disassociate/batch',
    method: 'post',
    data
  })
}

// 分页查询用户跟进记录
export function userFollow(params) {
  return request({
    url: '/user/follow/record/page/info',
    method: 'get',
    params
  })
}

// 新增用户跟进记录
export function addUserFollow(data) {
  return request({
    url: '/user/follow/record/insert',
    method: 'post',
    data
  })
}

// 新增订单跟进记录
export function addFollowByOrderNo(data) {
  return request({
    url: '/user/follow/record/order/save',
    method: 'POST',
    data
  })
}

// 下载模板
export function downLoadStudent() {
  return request({
    url: '/student/download',
    method: 'get'
  })
}
// 导入用户信息
export function studentImport(data) {
  return request({
    url: '/student/import',
    method: 'post',
    data
  })
}
// 分页查询订单用户列表
export function studentList(params) {
  return request({
    url: '/pf/user/order/user/page',
    method: 'get',
    params
  })
}

// 分页查询订单用户(直播专栏)
export function getUserLivePage(params) {
  return request({
    url: '/pf/user/order/live/page',
    method: 'GET',
    params
  })
}

// 赠送课程
export function studentGiveCourse(data) {
  return request({
    url: '/student/give/course',
    method: 'POST',
    data
  })
}

// 订单的学员失效接口
export function orderExpired(data) {
  return request({
    url: '/goods/order/expired',
    method: 'PUT',
    data
  })
}

// 获取学员的列表
export function GetUserMemberList(params) {
  return request({
    url: '/pf/user/material/user/page',
    method: 'get',
    params: params,
    paramsSerializer: function (params) {
      return qs.stringify(params, { arrayFormat: 'repeat' })
    }
  })
}

// 导入用户
export function exportUser(data) {
  // return request({
  return edataCustomerAdminApi({
    url: '/user/import',
    method: 'post',
    data
  })
}
// 导入用户下载模板
export function downLoadUser(data, onUploadProgress) {
  // return request({
  return edataCustomerAdminApi({
    url: '/user/download',
    method: 'get',
    onUploadProgress
  })
}

// 直播专栏下获取用户信息统计
export function getQuestionnaireAnswerPage(params) {
  return request({
    url: '/questionnaire-answer-do/page',
    method: 'get',
    params
  })
}

// 直播专栏下导出excel
export function excelQuestionnaireAnswer(params) {
  return request({
    url: '/questionnaire-answer-do/export',
    method: 'GET',
    params
  })
}

// 直播专栏学员延期学习
export function delayStudy(data) {
  return request({
    url: '/student/delay/study',
    method: 'POST',
    data
  })
}

// 中国地区编码-列表
export function getAreaCodeList(params) {
  return request({
    url: '/china/areaCode/list',
    method: 'GET',
    params
  })
}

// 中国地区编码-下级列表
export function getAreaCode(params) {
  return request({
    url: '/china/areaCode/sub/list',
    method: 'get',
    params
  })
}

// 修改手机号
export function userModifyUserPhone(data) {
  return request2({
    url: '/cloud/edata-cms/phone/modify/pf',
    method: 'POST',
    data
  })
}

// 用户学习记录【分页】
export function getUserProgressDeliverypage(params) {
  return request({
    url: '/user/progress/delivery/page',
    method: 'get',
    params
  })
}

// 获取手机号详情
export function getPhoneDetail(userId) {
  // return request({
  return edataCustomerAdminApi({
    url: `/pf/user/phone/detail/${userId}`,
    method: 'GET'
  })
}

// 根据userId查询系统用户信息
export function getInfoByUserId(params) {
  // return request({
  return edataUserApi({
    url: `/system/user/getInfoByUserId`,
    method: 'GET',
    params: {
      userId: params
    }
  })
}

// 绑定列表查询
export function getUserBindList() {
  // return request({
  return edataUserApi({
    url: '/system/user/bind/list',
    method: 'GET'
  })
}
// 根据手机号获取企微信息
export function getWeChatByPhone(phone) {
  // return request({
  return edataUserApi({
    url: `/system/user/bizwechat/${phone}`,
    method: 'GET'
  })
}
// 解绑企微
export function unbindCheckAjax(sysUserId) {
  return request2({
    url: `/cloud/edata-sale/sysuser/unbind/check/${sysUserId}`,
    method: 'GET'
  })
}

// 根据用户的uid 获取用户的手机号码
export function queryPhoneNumberByUid(data) {
  // return request2({
  return edataCustomerAdminApi({
    url: '/pf/user/phone/plain/query',
    method: 'post',
    data: data
  })
}

// 根据线索id 查询电话号码
export function queryPhoneNumberByClueId(clueId) {
  return request2({
    url: `/cloud/edata-clue/clue/phone?clueId=${clueId}`,
    method: 'GET'
  })
}

// 没有用户id的订单详情页面中的调用
export function getPhoneByOrderNo(orderNo) {
  return request2({
    url: `/cloud/admin/goods/order/get/phone/${orderNo}`,
    method: 'GET'
  })
}

export function getUserPhoneByOrderNo(orderNo) {
  return request2({
    url: `/cloud/admin/goods/order/get/sourceUser/phone/${orderNo}`,
    method: 'GET'
  })
}

// 没有用户id的订单详情页面中的调用
export function getPhoneByOrderEmail(orderNo) {
  return request2({
    url: `/cloud/admin/goods/order/get/email/${orderNo}`,
    method: 'GET'
  })
}

export function getEmailByOrderNo(orderNo) {
  return request2({
    url: `/cloud/admin/goods/order/get/email/${orderNo}`,
    method: 'GET'
  })
}

// 权限管理v1.0.0接口
// 1.发送手机验证码
export function sendPhoneCode(params) {
  return request3({
    url: `/cloud/edata-user/sysUser/sendPhoneCode`,
    method: 'GET',
    params
  })
}
// 2.校验手机验证码
export function checkPhoneCode(params) {
  return request3({
    url: `/cloud/edata-user/sysUser/checkPhoneCode`,
    method: 'GET',
    params
  })
}
// 根据机构Id登录地址获取飞书appId
export function getOrganizationIdByAppId(params) {
  return request3({
    url: `/cloud/edata-user/organization/getOrganizationIdByAppId`,
    method: 'GET',
    params
  })
}
// 根据机构Id获取企微appId
export function orgToWecomAppIdApi(params) {
  return request3({
    url: `/cloud/edata-user/enterprise/wechat/getOrganizationWechatAgentId`,
    method: 'GET',
    params
  })
}
// 获取企微用户信息 判断是否绑定企微
export function wechatUserInfoApi(params) {
  return request3({
    url: `/cloud/edata-user/enterprise/wechat/getWechatUserInfo`,
    method: 'GET',
    params
  })
}
// 飞书绑定用户
export function saveBindUser(data) {
  return request3({
    url: '/cloud/edata-user/feishu/saveBindUser',
    method: 'post',
    data
  })
}
// 飞书解绑用户
export function unBindUser(data) {
  return request3({
    url: `/cloud/edata-user/feishu/unBindUser`,
    method: 'POST',
    data
  })
}
// 企微绑定用户
export function saveBindWechatUser(data) {
  return request3({
    url: '/cloud/edata-user/enterprise/wechat/saveBindUser',
    method: 'post',
    data
  })
}
// 企微解绑用户
export function unBindWechatUser(data) {
  return request3({
    url: `/cloud/edata-user/enterprise/wechat/unBindUser`,
    method: 'POST',
    data
  })
}
// 获取根据企微code获取详情
export function wecomToTenantId(params) {
  return request3({
    url: `/cloud/edata-user/enterprise/wechat/authorization/backByTenantId`,
    method: 'GET',
    params
  })
}
// 获取根据飞书code获取详情
export function callbackByTenantId(params) {
  return request3({
    url: `/cloud/edata-user/feishu/callbackByTenantId`,
    method: 'GET',
    params
  })
}
// 查询该账号是否绑定了飞书
export function getUserInfoByUserId(params) {
  return request3({
    url: '/cloud/edata-user/feishu/getUserInfoByUserId',
    method: 'GET',
    params
  })
}

// 获取用户绑定信息集合
export function getBindUserInfoApi(params) {
  return request3({
    url: `/cloud/edata-user/enterprise/wechat/getBindUserInfo`,
    method: 'GET',
    params
  })
}

// 详情 平台用户管理页面调用
export function PlatformDetail(id) {
  // return request({
  return edataCustomerAdminApi({
    url: `/pf/user/detailByPlatformUserId/${id}`,
    method: 'get'
  })
}
// 订单详情获取客户收货手机号API
export function getReceiverPhone(orderNo) {
  return request3({
    url: `/cloud/admin/goods/order/get/receiver/phone/${orderNo}`,
    method: 'get'
  })
}

// 用户换绑企微
export function changBindWechat(data) {
  return request3({
    url: `/cloud/edata-user/system/user/changBindWechat`,
    method: 'post',
    data
  })
}

// 中国地区编码-列表 不含香港
export function getFilterAreaCodeList(params) {
  return request({
    url: '/china/areaCode/list/filterAddresses',
    method: 'GET',
    params
  })
}
