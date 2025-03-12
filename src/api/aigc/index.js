import request from '@/utils/request2'
import request3 from '@/utils/request3'
import axios from 'axios'

/**
 * 添加收藏
 * @param {*} data
 * @return {Promise}
 */
export function addAiAssistant(data) {
  return request({
    url: `/cloud/hok-assistant/ai-assistant/add`,
    method: 'POST',
    data
  })
}

/**
 * 推荐提示词列表
 * @param {*} data
 * @return {Promise}
 */
export function getCueWordPage(data) {
  return request({
    url: `/cloud/hok-assistant/ai-assistant/cueWordPage`,
    method: 'POST',
    data
  })
}

/**
 * 收藏列表查询
 * @param {*} data
 * @return {Promise}
 */
export function getCollectPage(data) {
  return request({
    url: `/cloud/hok-assistant/collect/page`,
    method: 'POST',
    data
  })
}

/**
 * 点击次数统计
 * @param {*} data
 * @return {Promise}
 */
export function sumClickNum(data) {
  return request({
    url: `/cloud/hok-assistant/ai-assistant/sumClickNum`,
    method: 'POST',
    data
  })
}

/**
 * 取消收藏
 * @param {*} params
 * @return {Promise}
 */
export function cancelCollect(params) {
  return request({
    url: `/cloud/hok-assistant/collect/cancel`,
    method: 'GET',
    params
  })
}

/**
 * 查询推荐老师
 * @param {*} data
 * @return {Promise}
 */
export function qryHotTeacherInfo() {
  return request({
    url: `/cloud/hok-assistant/ai-assistant/qryHotTeacherInfo`,
    method: 'POST'
  })
}

/**
 * 查询历史对话接口
 * @param {*} data
 * @return {Promise}
 */
export function getHistory(params) {
  return request({
    url: `/cloud/hok-assistant/conversation/history`,
    method: 'GET',
    params
  })
}

/**
 * 生成内容-生成话题选题等
 * @param {*} data
 * @return {Promise}
 */
function generationContent(data) {
  return request({
    url: `/cloud/hok-assistant/generation/content/v2`,
    method: 'POST',
    data
  })
}

/**
 * 生成内容轮询结果
 * @param {*} data
 * @return {Promise}
 */
export function pollingGeneration(params) {
  return request({
    url: `/cloud/hok-assistant/generation/result`,
    method: 'GET',
    params
  })
}

/**
 * 拷贝反馈接口
 * @param {*} params
 * @return {Promise}
 */
export function copyConversation(params) {
  return request({
    url: `/cloud/hok-assistant/conversation/copy`,
    method: 'GET',
    params
  })
}

/**
 *  对话历史反馈接口
 * @param {Object} data
 *  @param {String} data.action liked:点赞 disliked:踩 starred:收藏 adopted:复制
 * @return {Promise}
 */
export function feedbackFeedback(data) {
  return request({
    url: `/cloud/hok-assistant/conversation/feedback`,
    method: 'POST',
    data
  })
}

// import { getToken } from '@/utils/auth'
// const version = require('../../../public/version.json')
/**
 *  敏感词检测
 * @param {Object} data
 *  @param {String} data.content
 * @return {Promise}
 */
export function sensitiveChecking(data) {
  return request({
    url: `/cloud/hok-assistant/sensitive/checking`,
    method: 'POST',
    data: data
  })
  // return axios.post(
  //   process.env.VUE_APP_BASE_API_NEW + '/cloud/hok-assistant/sensitive/checking', data, {
  //     headers: {
  //       'Content-Type': 'application/x-www-form-urlencoded',
  //       Authorization: getToken(),
  //       versionCode: version.version
  //     }
  //   })
}

export function getAIContent(params) {
  return new Promise((resolve, reject) => {
    generationContent(params).then(res => {
      if (res.code === 1) {
        const ii = setInterval(async () => {
          const data = await pollingGeneration({ generateId: res.data }).catch(
            () => {
              clearInterval(ii)
              reject()
            }
          )
          if (!data) {
            clearInterval(ii)
            reject()
          }
          if (data.code === 1) {
            if (data.data.status === 'SUCCESS') {
              resolve(data.data)
              clearInterval(ii)
            } else if (data.data.status === 'FAILED') {
              reject()
              clearInterval(ii)
            }
          } else {
            clearInterval(ii)
            reject()
          }
        }, 2000)
      }
    })
  })
}

/**
 * 查询可用LLM
 * @param {*} data
 * @return {Promise}
 */
export function getEnableModels() {
  return request({
    url: `/cloud/hok-assistant/ai-assistant/models`,
    method: 'GET'
  })
}

/**
 * 查询会话助手列表
 * @param {*} data
 * @return {Promise}
 */
export function getAISessionList() {
  return request({
    url: `/cloud/hok-assistant/ai-session-template/getList`,
    method: 'GET'
  })
}

/**
 * 设置全新会话接口
 * @param {*} data
 * @return {Promise}
 */
export function conversationNew(id) {
  return request({
    url: `/cloud/hok-assistant/conversation/new`,
    method: 'GET',
    params: { conversationId: id }
  })
}
/**
 * 获取抖音视频链接
 * @param {*} data
 * @return {Promise}
 */
export function getDouYinVideotApi(url, header) {
  return axios({
    url,
    method: 'get',
    header,
    timeout: 50000
  })
}

/**
 * 设置全新会话接口
 * @param {*} data
 * @return {Promise}
 */
export function imageGenerate(data) {
  return request({
    url: `/cloud/hok-assistant/generation/imageGenerate`,
    method: 'POST',
    data
  })
}

/**
 * 触发使用次数+1
 * @param {*} data
 * @return {Promise}
 */
export function triggerUsage(data) {
  return request({
    url: `/cloud/hok-assistant/ai-session-template/triggerUsage`,
    method: 'POST',
    data
  })
}

/**
 * 视频文案提取-轮询结果
 * @param {*} data
 * @return {Promise}
 */
export function queryResult(data) {
  return request({
    url:
      `/cloud/hok-assistant/generation/videoToText/queryResult?taskId=` +
      data.taskId,
    method: 'POST',
    data: data
  })
}

/**
 * 视频文案提取-提交任务
 * @param {*} data
 * @return {Promise}
 */
export function submitTask(data) {
  return request({
    url: `/cloud/hok-assistant/generation/videoToText/submitTask`,
    method: 'POST',
    data
  })
}

/**
 * 视频文案提取-获取Bilibili视频地址
 * @param {*} params
 * @return {Promise}
 */
export function getBilibiliPlayurl(params) {
  return request({
    url: `/cloud/hok-assistant/generation/videoToText/getBilibiliPlayurl`,
    method: 'GET',
    params
  })
}

/**
 * 根据链接解析视频下载地址
 * @param {*} data
 * @return {Promise}
 */
export function getExtract(data) {
  return request({
    url: `/cloud/hok-assistant/ai-assistant/extract`,
    method: 'POST',
    data
  })
}

// 获取助手中心
export function getAssistantCenter(params, cancelToken) {
  return request({
    url: `/cloud/hok-assistant/assistant/center`,
    method: 'get',
    params,
    cancelToken
  })
}

// 创建私人助手中心
export function createAssistantCenter(data) {
  return request({
    url: `/cloud/hok-assistant/assistant/create`,
    method: 'POST',
    data
  })
}

// 查询助手分类列表
export function assistantcategoryListApi(data) {
  return request({
    url: `/cloud/hok-assistant/assistant/category/list`,
    method: 'get'
  })
}

// 删除助手
export function deletedAssistantCenter(params) {
  return request({
    url: `/cloud/hok-assistant/assistant/deleted`,
    method: 'get',
    params
  })
}

// 获取助手详情
export function getAssistantDetails(params) {
  return request({
    url: `/cloud/hok-assistant/assistant/details`,
    method: 'get',
    params
  })
}

// 我的助手
export function getMyAssistantList(params, cancelToken) {
  return request({
    url: `/cloud/hok-assistant/assistant/me`,
    method: 'get',
    params,
    cancelToken
  })
}

// 修改助手权限
export function editAssistantPrivate(data) {
  return request({
    url: `/cloud/hok-assistant/assistant/private`,
    method: 'POST',
    data
  })
}

// 通过分享码获取助手详情
export function getAssistantBySharing(params) {
  return request3({
    url: `/cloud/hok-assistant/assistant/sharing`,
    method: 'get',
    params
  })
}

// 编辑私人助手中心
export function updateAssistant(data) {
  return request({
    url: `/cloud/hok-assistant/assistant/update`,
    method: 'POST',
    data
  })
}

// 查询我可以使用的助手
export function getMyAssistantUsedList(params, cancelToken) {
  return request({
    url: `/cloud/hok-assistant/my/assistant/used/list`,
    method: 'get',
    params,
    cancelToken
  })
}

// 使用助手
export function useAssistant(params) {
  return request3(
    {
      url: '/cloud/hok-assistant/my/assistant/use',
      method: 'get',
      params
    },
    true,
    true
  )
}

// 移除我使用的助手
export function removeAssistant(params) {
  return request({
    url: '/cloud/hok-assistant/my/assistant/remove',
    method: 'get',
    params
  })
}

// 置顶我的助手
export function topAssistant(params) {
  return request({
    url: '/cloud/hok-assistant/my/assistant/top',
    method: 'get',
    params
  })
}

// 视频提取组手权限
export function videoExtraction(params) {
  return request({
    url: '/cloud/hok-assistant/my/assistant/video/extraction',
    method: 'get',
    params
  })
}

// ws异常上报
export function wsOnErrorEvent(data) {
  return request({
    url: '/cloud/hok-assistant/ai-assistant/track/wsOnErrorEvent',
    method: 'POST',
    data
  })
}

// 取消置顶
export function assistantCancelTop(params) {
  return request({
    url: '/cloud/hok-assistant/my/assistant/cancel/top',
    method: 'get',
    params
  })
}

/**
 * 热点列表查询
 * @param {*} data
 * @returns {Promise}
 */
export function hotNewsPage(data) {
  return request({
    url: '/cloud/hok-assistant/hotNews/hotNewList',
    method: 'post',
    data
  })
}

/**
 * 选题历史记录列表
 * @param {*} data
 * @returns {Promise}
 */
export function hotNewsHistoryPage(data) {
  return request({
    url: '/cloud/hok-assistant/hotNews/historyPage',
    method: 'post',
    data
  })
}

// 热点分类列表查询
export function hotCategoryList(data) {
  return request({
    url: '/cloud/hok-assistant/hotNews/hotCategoryList',
    method: 'post',
    data
  })
}

// 获取IP列表
export function getDigitalhumanTeachers(params) {
  return request({
    url: '/cloud/edata-digitalhuman/tools/getDigitalhumanTeachers',
    method: 'get',
    params
  })
}

// 获取音频地址
// export function getAudioUrl(params) {
//   return request({
//     url: '/cloud/edata-digitalhuman/tools/voice/getAudioUrl',
//     method: 'get',
//     params
//   })
// }

// 查询视频生成结果
export function queryVideoTask(params) {
  return request({
    url: '/cloud/hok-assistant/ali-emo/query-task',
    method: 'get',
    params
  })
}

// 提交视频生成任务
export function submitImageVideoTask(data) {
  return request({
    url: '/cloud/hok-assistant/ali-emo/submit-image-video-task',
    method: 'post',
    data
  })
}

// 检测人脸
export function detectFace(data) {
  return request({
    url: '/cloud/hok-assistant/ali-emo/detect-face',
    method: 'post',
    data
  })
}

// 生成音频上传并获取地址
export function composeAudioForUrl(data) {
  return request({
    url: '/cloud/edata-digitalhuman/audio/composeAudioForUrl',
    method: 'post',
    data
  })
}
