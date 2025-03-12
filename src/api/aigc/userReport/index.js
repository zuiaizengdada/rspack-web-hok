import request from '@/utils/request2'
/**
 * ai助手举报处理记录查询
 * @export
 * @param {string} aiUserReportsId 举报用户账号
 * @return {Promise}
 */
export function aiUserReportRecordsGet(params) {
  return request({
    url: `/cloud/hok-assistant/ai-user-reports/handle/records`,
    method: 'get',
    params
  })
}

/**
 *
 * ai助手举报列表查询
 * @export
 * @param {string} aiUserReportsId 举报用户账号
 * @param {number} pageIndex 页数,示例值(1)
 * @param {number} pageSize 分页数量,示例值(10)
 * @param {number} reportsType 	举报类型：1-有害/不安全，2-涉政不当言论，3-色情低俗，4-谩骂攻击，5-违反犯罪，99-其他
 * @return {*}
 */
export function aiUserReportListGet(data) {
  return request({
    url: `/cloud/hok-assistant/ai-user-reports/page`,
    method: 'POST',
    data
  })
}

/**
 * ai助手举报处理
 *
 * @export
 * @param {string} aiUserReportsId 举报用户账号
 * @param {number} handleDesc 	处理内容
 * @param {number} pageIndex 页数,示例值(1)
 * @param {number} pageSize 分页数量,示例值(10)
 * @return {*}
 */
export function aiUserReportHandlePost(data) {
  return request({
    url: `/cloud/hok-assistant/ai-user-reports/handle`,
    method: 'POST',
    data
  })
}

/**
 * 获取真实手机号
 *
 * @export
 * @param {string} operationType 操作类型 1-B端直播间学员详情查看手机号
 * @param {number} userId	B端用户userId
 * @return {*}
 */
export function getUserRealPhone(data) {
  return request({
    url: `/cloud/hok-assistant/ai-user-reports/write`,
    method: 'POST',
    data
  })
}
