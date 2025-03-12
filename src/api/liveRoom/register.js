import request from '@/utils/request2'

// 获取报名页详情
export function applyConfigDetailAjax(params) {
  return request({
    url: '/cloud/edata-live/liveRoomApply/applyConfigDetail',
    method: 'get',
    params
  })
}

// 直播间报名列表查询
export function applyRecordPageAjax(data) {
  return request({
    url: '/cloud/edata-live/liveRoomApply/applyRecordPage',
    method: 'POST',
    data
  })
}

// 编辑直播间报名设置
export function editApplyConfigAjax(data) {
  return request({
    url: '/cloud/edata-live/liveRoomApply/editApplyConfig',
    method: 'POST',
    data
  })
}

// 直播间报名列表导出
export function exportApplyRecordAjax(data) {
  return request({
    url: `/cloud/edata-live/liveRoomApply/exportApplyRecord`,
    method: 'post',
    data
  })
}

// 查询公众号二维码
export function officialListAjax(params) {
  return request({
    url: `/cloud/edata-sale/biz/official/list`,
    method: 'get',
    params
  })
}

// 消息模版列表
export function liveMsgTemplatesAjax(data) {
  return request({
    url: `/cloud/edata-live/liveRoomApply/msgTemplates`,
    method: 'post',
    data
  })
}

// 生成邀课链接--新
export function buildInviteUrlAjax(params) {
  return request({
    url: `/cloud/edata-live/liveRoom/buildInviteUrl`,
    method: 'get',
    params
  })
}

// 发送预约直播间弹窗
export function liveSendSubscribeAjax(data) {
  return request({
    url: `/cloud/edata-live/im/operation/send/subscribe/liveRoom`,
    method: 'post',
    data
  })
}

