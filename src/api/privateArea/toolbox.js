import request from '@/utils/request2'
import qs from 'qs'
// 客服列表
export function getCluePageList() {
  return request({
    url: '/cloud/edata-sale/yxt/customerList',
    method: 'GET'
  })
}

// 添加客服
export function addCustomer(data) {
  return request({
    url: '/cloud/edata-sale/yxt/addCustomer',
    method: 'POST',
    data
  })
}

// 编辑客服
export function editCustomer(data) {
  return request({
    url: '/cloud/edata-sale/yxt/editCustomer',
    method: 'POST',
    data
  })
}

// 落地页列表
export function getlandingPagelist() {
  return request({
    url: '/cloud/edata-sale/yxt/landingPageList',
    method: 'get'
  })
}

// 生成落地页链接
export function createLandingPageLink(data) {
  return request({
    url: '/cloud/edata-sale/yxt/buildLandingPageUrl',
    method: 'POST',
    data
  })
}

// 域名列表
export function getDomainList() {
  return request({
    url: '/cloud/edata-sale/yxt/domainList',
    method: 'get'
  })
}

// 落地页列表
export function getLandingPageList() {
  return request({
    url: '/cloud/edata-sale/yxt/landingPageList',
    method: 'get'
  })
}

// 设为兜底人员
export function setIsDefault(data) {
  return request({
    url: '/cloud/edata-sale/yxt/setIsDefault',
    method: 'POST',
    data
  })
}

// 客服二维码点击生成
export function createQrCode(data) {
  return request({
    url: '/cloud/edata-sale/yxt/uploadQrCode',
    method: 'POST',
    data
  })
}

// 获客助手
export function gethkPage(params) {
  return request({
    url: '/cloud/edata-sale/hk/page',
    method: 'GET',
    params
  })
}
// 设为兜底
export function setlsHKDefault(data) {
  return request({
    url: '/cloud/edata-sale/hk/setIsDefault',
    method: 'POST',
    data
  })
}

// 查询公众号
export function bizOfficialList(params) {
  return request({
    url: '/cloud/edata-sale/biz/official/list',
    method: 'GET',
    params
  })
}

// 分页查询公众号
export function bizOfficialPageList(data) {
  return request({
    url: '/cloud/edata-sale/biz/official/pageList',
    method: 'POST',
    data
  })
}

// 添加或修改公众号
export function bizOfficialAddOrUpdate(data) {
  return request({
    url: '/cloud/edata-sale/biz/official/addOrUpdate',
    method: 'POST',
    data
  })
}

// 获取公众号
export function bizOfficialInitAddInfo(params) {
  return request({
    url: '/cloud/edata-sale/biz/official/initAddInfo',
    method: 'GET',
    params
  })
}

// 模板任务列表
export function groupPage(params) {
  return request({
    url: '/cloud/edata-sale/template/group/page',
    method: 'GET',
    params
  })
}

// 获取总粉丝量
export function getTotal(params) {
  return request({
    url: '/cloud/edata-sale/user/get/total',
    method: 'GET',
    params
  })
}

// 欢迎语详情
export function replyDetail(params) {
  return request({
    url: '/cloud/edata-sale/reply/detail',
    method: 'GET',
    params
  })
}

// 欢迎语修改
export function replySave(data) {
  return request({
    url: '/cloud/edata-sale/reply/save',
    method: 'POST',
    data
  })
}

// 助手链接列表
export function hkPage(params) {
  return request({
    url: '/cloud/edata-sale/hk/page',
    method: 'get',
    params
  })
}

// 助手链接
export function hkUsageInfo(params) {
  return request({
    url: '/cloud/edata-sale/hk/usageInfo',
    method: 'get',
    params
  })
}

// 修改剩余量飞书提醒
export function editBalanceFeishu(data) {
  return request({
    url: '/cloud/edata-sale/hk/editBalanceFeishu',
    method: 'POST',
    data
  })
}

// 同步公众号列表-新增模板任务下拉时使用
export function templateList(params) {
  return request({
    url: '/cloud/edata-sale/template/list',
    method: 'get',
    params
  })
}

// 模板任务-新增
export function groupCreate(data) {
  return request({
    url: '/cloud/edata-sale/template/group/create',
    method: 'POST',
    data
  })
}

// 模板任务-修改
export function groupUpdate(data) {
  return request({
    url: '/cloud/edata-sale/template/group/update',
    method: 'POST',
    data
  })
}

// 模板任务状态更新
export function groupUpdateStatus(data) {
  return request({
    url: `/cloud/edata-sale/template/group/update/status/${data.id}/${data.status}`,
    method: 'POST'
  })
}

// 获取企业微信临时素材mediaId
export function wechatUploadMedia(data) {
  return request({
    url: `/cloud/edata-sale/biz/wechat/upload/media`,
    method: 'POST',
    data
  })
}
// 新增接待员工-临时新增
export function receptionAdd(data) {
  return request({
    url: `/cloud/edata-sale/sale/task/reception/staff/add/temp`,
    method: 'POST',
    data
  })
}
// 更换兜底人员
export function receptionSet(data) {
  return request({
    url: `/cloud/edata-sale/sale/task/reception/staff/change/default`,
    method: 'POST',
    data
  })
}

// 接待员工列表
export function receptionPage(params) {
  return request({
    url: `/cloud/edata-sale/sale/task/reception/staff/page`,
    method: 'get',
    params
  })
}

// 修改接待员工分配状态
export function receptionUpdateStatus(data) {
  return request({
    url: `/cloud/edata-sale/sale/task/reception/staff/update/status`,
    method: 'put',
    data
  })
}

// 公众号模板列表
export function templatePage(params) {
  return request({
    url: `/cloud/edata-sale/template/page`,
    method: 'get',
    params
  })
}

// 上传素材，并返回素材id
export function materialUpload(params) {
  return request({
    url: `/cloud/edata-sale/material/upload`,
    method: 'GET',
    params
  })
}

// 模板任务详情
export function groupDetail(params) {
  return request({
    url: '/cloud/edata-sale/template/group/detail',
    method: 'get',
    params
  })
}

// 移除接待员工
export function receptionStaffRemove(data) {
  return request({
    url: '/cloud/edata-sale/sale/task/reception/staff/remove',
    method: 'DELETE',
    data
  })
}

// 新增分配规则库
export function receptionStaffWarehouseAdd(data) {
  return request({
    url: '/cloud/edata-sale/sale/task/reception/staff/warehouse/add',
    method: 'POST',
    data
  })
}

// 新增分配规则库
export function receptionStaffWarehousePage(params) {
  return request({
    url: '/cloud/edata-sale/sale/task/reception/staff/warehouse/page',
    method: 'GET',
    params
  })
}

// 创建欢迎语
export function replyCreate(data) {
  return request({
    url: '/cloud/edata-sale/reply/create',
    method: 'POST',
    data
  })
}

// 模板任务-推送详情列表
export function templatePullNum(params) {
  return request({
    url: '/cloud/edata-sale/template/group/pull/num',
    method: 'GET',
    params
  })
}

// 分配规则详情
export function receptionWarehouseGetId(id) {
  return request({
    url: `/cloud/edata-sale/sale/task/reception/staff/warehouse/get/${id}`,
    method: 'GET'
  })
}

// 分配规则接待员工列表
export function receptionWarehousePage(params) {
  return request({
    url: `/cloud/edata-sale/sale/task/reception/staff/warehouse/staff/page`,
    method: 'GET',
    params
  })
}

// 分配规则接待兜底员工
export function receptionWarehouseDefault(id) {
  return request({
    url: `/cloud/edata-sale/sale/task/reception/staff/warehouse/get/default/staff/${id}`,
    method: 'GET'
  })
}

// 使用规则库
export function receptionByWarehouse(data) {
  return request({
    url: '/cloud/edata-sale/sale/task/reception/staff/add/byWarehouse',
    method: 'POST',
    data
  })
}

// 兜底员工
export function receptionStaffDefault(taskId) {
  return request({
    url: `/cloud/edata-sale/sale/task/reception/staff/default/${taskId}`,
    method: 'GET'
  })
}

// 直播间列表
export function saleTaskPage(params) {
  return request({
    url: `/cloud/edata-sale/sale/task/live/page`,
    method: 'GET',
    params
  })
}

// 新增接待员工
export function receptionStaffAdd(data) {
  return request({
    url: `/cloud/edata-sale/sale/task/reception/staff/add`,
    method: 'POST',
    data
  })
}

// 新增销售任务
export function saleTaskAdd(data) {
  return request({
    url: `/cloud/edata-sale/sale/task/live/add`,
    method: 'POST',
    data
  })
}

// 移除直播间
export function saleTaskRemove(data) {
  return request({
    url: `/cloud/edata-sale/sale/task/live/remove`,
    method: 'DELETE',
    data
  })
}

// 同步公众号模板
export function templateSync(params) {
  return request({
    url: `/cloud/edata-sale/template/sync/template`,
    method: 'get',
    params
  })
}

// 接待员工操作日志列表
export function receptionStaffLogPage(params) {
  return request({
    url: `/cloud/edata-sale/sale/task/reception/staff/log/log/page`,
    method: 'get',
    params
  })
}

// 看板分页查询线索列表
export function cluePageList(data) {
  return request({
    url: `/cloud/edata-sale/clue/stat-cluePageList`,
    method: 'POST',
    data
  })
}

// 分页查询外呼列表
export function callPage(params) {
  return request({
    url: `/cloud/edata-sale/call/page`,
    method: 'get',
    params
  })
}

// 团队线索分配设置分页列表
export function getClueAssignList(data) {
  return request({
    url: `/cloud/edata-sale/clueAssignSet/page`,
    method: 'POST',
    data
  })
}
// 新增团队线索分配设置
export function addClueAssign(data) {
  return request({
    url: `/cloud/edata-sale/clueAssignSet/add`,
    method: 'POST',
    data
  })
}
// 修改团队线索分配设置
export function updateClueAssign(data) {
  return request({
    url: `/cloud/edata-sale/clueAssignSet/update`,
    method: 'PUT',
    data
  })
}
// 修改接待员工最大线索数
export function updateTaskMaxClueNum(data) {
  return request({
    url: `/cloud/edata-sale/sale/task/reception/staff/update/maxClueNum`,
    method: 'PUT',
    data
  })
}
// 新增商品条件
export function addTaskCondition(data) {
  return request({
    url: `/cloud/edata-sale/sale/task/Condition/add`,
    method: 'POST',
    data
  })
}
// 商品条件列表
export function getTaskCondition(params) {
  return request({
    url: `/cloud/edata-sale/sale/task/Condition/page`,
    method: 'GET',
    params
  })
}

// 线索接量方式按伏羲云商品分页查询
export function getTaskClueGoodsPage(params) {
  return request({
    url: `/cloud/edata-sale/sale-task-clue-goods/page`,
    method: 'GET',
    params
  })
}

// 添加伏羲云商品
export function addTaskClueGoodsPage(data) {
  return request({
    url: `/cloud/edata-sale/sale-task-clue-goods/add`,
    method: 'POST',
    data
  })
}

// 线索接量方式按伏羲云删除商品
export function deleteTaskClueGoodsPage(params) {
  return request({
    url: `/cloud/edata-sale/sale-task-clue-goods/${params.id}`,
    method: 'DELETE'
  })
}

// 线索接量方式伏羲云商品类型更新
export function updateTaskClueGoodsType(data) {
  return request({
    url: `/cloud/edata-sale/sale-task-clue-goods-type/update`,
    method: 'POST',
    data
  })
}
// 移除商品条件
export function deleteTaskCondition(data) {
  return request({
    url: `/cloud/edata-sale/sale/task/Condition/remove`,
    method: 'DELETE',
    data
  })
}
// 移除接待员工
export function deleteClueAssignSet(id) {
  return request({
    url: `/cloud/edata-sale/clueAssignSet/delete/${id}`,
    method: 'DELETE'
  })
}
// 外呼新增接口
export function callAdd(data) {
  return request({
    url: `/cloud/edata-sale/call/add`,
    method: 'POST',
    data
  })
}

// 外呼修改接口
export function callUpdate(data) {
  return request({
    url: `/cloud/edata-sale/call/update`,
    method: 'PUT',
    data
  })
}

// 外呼状态修改接口
export function callUpdateStatus(data) {
  return request({
    url: `/cloud/edata-sale/call/update/status`,
    method: 'PUT',
    data
  })
}

// 外呼状态接口
export function callInitialize(params) {
  return request({
    url: `/cloud/edata-sale/call/initialize`,
    method: 'GET',
    params
  })
}

// 查询外呼机构列表
export function companyList(params) {
  return request({
    url: `/cloud/edata-sale/call/company/list`,
    method: 'get',
    params
  })
}

// 查询外呼机构任务列表
export function companyTaskList(params) {
  return request({
    url: `/cloud/edata-sale/call/company/task/list`,
    method: 'get',
    params
  })
}

// 查询外呼列表
export function callList(params) {
  return request({
    url: `/cloud/edata-sale/call/list`,
    method: 'get',
    params,
    paramsSerializer: function (params) {
      return qs.stringify(params, { arrayFormat: 'repeat' })
    }
  })
}

// 查询外呼列表
export function callInfo(id) {
  return request({
    url: `/cloud/edata-sale/call/info/${id}`,
    method: 'get'
  })
}

// 更换ai
export function taskCallAI(data) {
  return request({
    url: `/cloud/edata-sale/sale/task/call/change/${data.taskId}/${data.callId}`,
    method: 'put'
  })
}

// 更换短信模板
export function taskCallSms(data) {
  return request({
    url: `/cloud/edata-sale/sale/task/sms/change`,
    method: 'put',
    data
  })
}

// 工具箱-短信-列表
export function getSmsPage(params) {
  return request({
    url: `/cloud/edata-sale/sms/page`,
    method: 'GET',
    params
  })
}

// 工具箱-短信-新增
export function addSms(data) {
  return request({
    url: `/cloud/edata-sale/sms/add`,
    method: 'POST',
    data
  })
}

// 工具箱-短信-删除
export function deleteSms(id) {
  return request({
    url: `/cloud/edata-sale/sms/delete/${id}`,
    method: 'DELETE'
  })
}

// 分页查询外呼列表(可以查所有机构)
export function callAdminPage(params) {
  return request({
    url: `/cloud/edata-sale/call/admin/page`,
    method: 'get',
    params
  })
}
// 外呼管理-机构信息
export function callOrgInfo(params) {
  return request({
    url: `/cloud/edata-sale/call/orgInfo`,
    method: 'get',
    params
  })
}

// 获取讲师信息
export function lecturerInfo(params) {
  return request({
    url: `/cloud/edata-sale/call/lecturerInfo`,
    method: 'get',
    params
  })
}

//  重新生成获客链接
export function regenerationUrl(data) {
  return request({
    url: '/cloud/edata-sale/hk/regenerationUrl',
    method: 'post',
    data
  })
}

// 重排 - 分页列表
export function getReachList(params) {
  return request({
    url: `/cloud/edata-sale/sorting-repeat-config-do/page`,
    method: 'get',
    params
  })
}

// 重排  - 列表删除
export function deleteReachList(id) {
  return request({
    url: `/cloud/edata-sale/sorting-repeat-config-do/delete/${id}`,
    method: 'DELETE'
  })
}

// 重排 - 详情弹窗 - 列表删除
export function removeReachConfig(data) {
  return request({
    url: `/cloud/edata-sale/sorting-repeat-config-do/remove/goods`,
    method: 'POST',
    data
  })
}
// 重排 - 详情弹窗 - 详情
export function ReachListDetails(params) {
  return request({
    url: `/cloud/edata-sale/sorting-repeat-relation-do/page`,
    method: 'get',
    params
  })
}

// 重排 - 详情弹窗 - 新增
export function addReachList(data) {
  return request({
    url: `/cloud/edata-sale/sorting-repeat-config-do/add`,
    method: 'POST',
    data
  })
}

// 重排 - 详情弹窗 - 编辑
export function updateReachList(data) {
  return request({
    url: `/cloud/edata-sale/sorting-repeat-config-do/update`,
    method: 'POST',
    data
  })
}

// 重排 - 详情弹窗 - 编辑
export function getReachDetail(id) {
  return request({
    url: `/cloud/edata-sale/sorting-repeat-config-do/detail/${id}`,
    method: 'get'
  })
}

// 操作记录列表
export function taskEditLog(params) {
  return request({
    url: `/cloud/edata-sale/task-edit-log/page`,
    method: 'get',
    params
  })
}

// 操作记录下拉列表
export function taskEditTypeList(params) {
  return request({
    url: `/cloud/edata-sale/task-edit-log/edit/type/list`,
    method: 'get',
    params
  })
}
