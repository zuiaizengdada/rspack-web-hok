import request from '@/utils/request2'

// 第三方形象列表
export function getCharactersList(params) {
  return request({
    url: `/cloud/edata-digitalhuman/characters/charactersList`,
    method: 'GET',
    params
  })
}

// 形象讲师列表
export function getCharactersTeacherList(params) {
  return request({
    url: `/cloud/edata-digitalhuman/teacher/charactersTeacherList`,
    method: 'GET',
    params
  })
}

// 视频讲师列表
export function getVideoTeacherList(params) {
  return request({
    url: `/cloud/edata-digitalhuman/teacher/videoTeacherList`,
    method: 'GET',
    params
  })
}

// 修改关联状态
export function modifyStatus(data) {
  return request({
    url: `/cloud/edata-digitalhuman/characters/modifyStatus`,
    method: 'POST',
    data
  })
}

// 删除关联形象
export function charactersDelete(data) {
  return request({
    url: `/cloud/edata-digitalhuman/characters/delete`,
    method: 'POST',
    data
  })
}

// 生成视频
export function videoGenerate(data) {
  return request({
    url: `/cloud/edata-digitalhuman/video/generate`,
    method: 'POST',
    data
  })
}

// 提交克隆任务
export function submitTask(data) {
  return request({
    url: `/cloud/edata-digitalhuman/audio/submitTask`,
    method: 'POST',
    data
  })
}

// 查询克隆结果
export function queryTaskQuery(params) {
  return request({
    url: `/cloud/edata-digitalhuman/audio/queryTaskQuery/${params.taskId}`,
    method: 'GET'
  })
}

// 视频明细
export function getVideoDetail(params) {
  return request({
    url: `/cloud/edata-digitalhuman/video/detail/${params.videoId}`,
    method: 'GET'
  })
}

// 编辑视频
export function videoEdit(data) {
  return request({
    url: `/cloud/edata-digitalhuman/video/edit`,
    method: 'POST',
    data
  })
}

// 删除视频
export function videoDelete(data) {
  return request({
    url: `/cloud/edata-digitalhuman/video/delete`,
    method: 'POST',
    data
  })
}

// 讲师关联形象列表
export function getConnectList(params) {
  return request({
    url: `/cloud/edata-digitalhuman/characters/connectList`,
    method: 'GET',
    params
  })
}

// 讲师关联形象列表
export function getTeacherCharactersList(params) {
  return request({
    url: `/cloud/edata-digitalhuman/characters/teacherCharactersList`,
    method: 'GET',
    params
  })
}

// 视频列表
export function getVideoList(data) {
  return request({
    url: `/cloud/edata-digitalhuman/video/list`,
    method: 'POST',
    data
  })
}

// 背景图片列表
export function getBackgroundImage(data) {
  return request({
    url: `/cloud/edata-digitalhuman/backgroundImage/list`,
    method: 'POST',
    data
  })
}

// 背景图片删除
export function backgroundImageDelete(data) {
  return request({
    url: `/cloud/edata-digitalhuman/backgroundImage/delete`,
    method: 'POST',
    data
  })
}

// 背景图片编辑
export function backgroundImageEdit(data) {
  return request({
    url: `/cloud/edata-digitalhuman/backgroundImage/edit`,
    method: 'POST',
    data
  })
}
// 上传
export function backgroundImageUpload(data) {
  return request({
    url: `/cloud/edata-digitalhuman/backgroundImage/upload`,
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data;charset=UTF-8'
    },
    data
  })
}

// 关联形象
export function charactersConnect(data) {
  return request({
    url: `/cloud/edata-digitalhuman/characters/connect`,
    method: 'POST',
    data
  })
}

// 获取多音字
export function covertUsingGET(params) {
  return request({
    url: `/cloud/edata-digitalhuman/duoYinZi/covert`,
    method: 'GET',
    params
  })
}

// 获取部门
export function getDept(params) {
  return request({
    url: '/cloud/data-center/tran/data/get/dept',
    method: 'get',
    params
  })
}

/**
 * 查询审批意见
 * @param {*} params
 * @returns {Promise}
 */
export function getReason(params) {
  return request({
    url: '/cloud/edata-digitalhuman/approve/getReason',
    method: 'get',
    params
  })
}

/**
 * 数字人审批列表查询
 * @param {*} data
 * @returns {Promise}
 */
export function videoApproveList(data) {
  return request({
    url: '/cloud/edata-digitalhuman/video/videoApproveList',
    method: 'POST',
    data
  })
}

/**
 * 审批设置
 * @param {*} params
 * @returns {Promise}
 */
export function getApproveSettinglist(params) {
  return request({
    url: '/cloud/edata-digitalhuman/approve/list',
    method: 'GET',
    params
  })
}

/**
 * 编辑(添加-修改)审批人员
 * @param {*} data
 * @returns {Promise}
 */
export function editApprover(data) {
  return request({
    url: '/cloud/edata-digitalhuman/approve/editApprover',
    method: 'POST',
    data
  })
}

/**
 * 删除审批人员
 * @param {*} data
 * @returns {Promise}
 */
export function deleteApprover(data) {
  return request({
    url: '/cloud/edata-digitalhuman/approve/deleteApprover',
    method: 'POST',
    data
  })
}

/**
 * 视频审批-驳回
 * @param {*} data
 * @returns {Promise}
 */
export function approveOrReject(data) {
  return request({
    url: '/cloud/edata-digitalhuman/approve/approveOrReject',
    method: 'POST',
    data
  })
}

/**
 * 查询飞书通知开关配置
 * @param {*} params
 * @returns {Promise}
 */
export function getNotifyFeishuSwitch() {
  return request({
    url: '/cloud/edata-digitalhuman/config/getNotifyFeishuSwitch',
    method: 'GET'
  })
}

/**
 * 设置飞书通知开关
 * @param {*} data
 * @returns {Promise}
 */
export function setNotifyFeishuSwitch(data) {
  return request({
    url: '/cloud/edata-digitalhuman/config/setNotifyFeishuSwitch',
    method: 'POST',
    data
  })
}

/**
 * 审批人选择下拉数据查询
 * @param {*} params
 * @returns {Promise}
 */
export function getApproverList(params) {
  return request({
    url: '/cloud/edata-digitalhuman/approve/getApproverList',
    method: 'GET',
    params
  })
}

/**
 * 申请者选择下拉数据查询
 * @param {*} params
 * @returns {Promise}
 */
export function getApplicantList(params) {
  return request({
    url: '/cloud/edata-digitalhuman/video/applicants',
    method: 'GET',
    params
  })
}

/**
 * 条件分页查询形象列表
 * @param {*} data
 * @returns {Promise}
 */
export function getCharacterPage(data) {
  return request({
    url: '/cloud/edata-digitalhuman/imageManagement/getCharacterPage',
    method: 'POST',
    data
  })
}

/**
 * 查询所有机构列表
 * @param {*} data
 * @returns {Promise}
 */
export function getAllOrgList(data) {
  return request({
    url: '/cloud/edata-digitalhuman/imageManagement/getAllOrgList',
    method: 'POST',
    data
  })
}

/**
 * 新增形象
 * @param {*} data
 * @returns {Promise}
 */
export function addCharacter(data) {
  return request({
    url: '/cloud/edata-digitalhuman/imageManagement/addCharacter',
    method: 'POST',
    data
  })
}

/**
 * 删除形象
 * @param {*} data
 * @returns {Promise}
 */
export function deleteCharacter(data) {
  return request({
    url: '/cloud/edata-digitalhuman/imageManagement/deleteCharacter',
    method: 'POST',
    data
  })
}

/**
 * 查询已配置机构列表
 * @param {*} data
 * @returns {Promise}
 */
export function getConfiguredOrgList(data) {
  return request({
    url: '/cloud/edata-digitalhuman/imageManagement/getConfiguredOrgList',
    method: 'POST',
    data
  })
}

/**
 * 修改形象
 * @param {*} data
 * @returns {Promise}
 */
export function modifyCharacter(data) {
  return request({
    url: '/cloud/edata-digitalhuman/imageManagement/modifyCharacter',
    method: 'POST',
    data
  })
}

/**
 * 保存草稿
 * @param {*} data
 * @returns {Promise}
 */
export function saveDraft(data) {
  return request({
    url: '/cloud/edata-digitalhuman/video/saveDraft',
    method: 'POST',
    data
  })
}

/**
 * 撤回
 * @param {*} data
 * @returns {Promise}
 */
export function withdraw(data) {
  return request({
    url: '/cloud/edata-digitalhuman/video/withdraw',
    method: 'POST',
    data
  })
}

/**
 * 查询批注和改动点
 * @param {*} params
 * @returns {Promise}
 */
export function getAnnotionsDeltas(params) {
  return request({
    url: '/cloud/edata-digitalhuman/annotion/getAnnotionsDeltas',
    method: 'GET',
    params
  })
}

/**
 * 新增批注
 * @param {*} data
 * @returns {Promise}
 */
export function addAnnotions(data) {
  return request({
    url: '/cloud/edata-digitalhuman/annotion/addAnnotions',
    method: 'POST',
    data
  })
}

/**
 * 修改批注
 * @param {*} data
 * @returns {Promise}
 */
export function editAnnotion(data) {
  return request({
    url: '/cloud/edata-digitalhuman/annotion/editAnnotion',
    method: 'POST',
    data
  })
}

/**
 * 删除批注
 * @param {*} data
 * @returns {Promise}
 */
export function deleteAnnotion(data) {
  return request({
    url: '/cloud/edata-digitalhuman/annotion/deleteAnnotion',
    method: 'POST',
    data
  })
}

/**
 * 视频名称修改
 * @param {*} data
 * @returns {Promise}
 */
export function updateVideoName(data) {
  return request({
    url: '/cloud/edata-digitalhuman/video/updateVideoName',
    method: 'POST',
    data
  })
}

/**
 * 检测文本中所有多音字
 * @param {*} data
 * @returns {Promise}
 */
export function duoYinZiCheck(data) {
  return request({
    url: '/cloud/edata-digitalhuman/duoYinZi/check',
    method: 'POST',
    data
  })
}

/**
 * 声音分页列表
 * @param {*} params
 * @returns {Promise}
 */
export function voicesPage(params) {
  return request({
    url: '/cloud/edata-digitalhuman/voices/pageList',
    method: 'GET',
    params
  })
}

/**
 * 新增声音
 * @param {*} data
 * @returns {Promise}
 */
export function voicesAdd(data) {
  return request({
    url: '/cloud/edata-digitalhuman/voices/addVoice',
    method: 'POST',
    data
  })
}

/**
 * 修改声音
 * @param {*} data
 * @returns {Promise}
 */
export function voicesUpdate(data) {
  return request({
    url: '/cloud/edata-digitalhuman/voices/modifyVoice',
    method: 'POST',
    data
  })
}

/**
 * 删除声音
 * @param {*} data
 * @returns {Promise}
 */
export function voicesDel(data) {
  return request({
    url: '/cloud/edata-digitalhuman/voices/deleteVoice',
    method: 'POST',
    data
  })
}

/**
 * 查询声音已配置机构列表
 * @param {*} data
 * @returns {Promise}
 */
export function getVoicesConfiguredOrgList(data) {
  return request({
    url: '/cloud/edata-digitalhuman/voices/getConfiguredOrgList',
    method: 'POST',
    data
  })
}

/**
 * 查询机构声音列表
 * @param {*} data
 * @returns {Promise}
 */
export function getVoicesByOrg(data) {
  return request({
    url: '/cloud/edata-digitalhuman/voices/getVoicesByOrg',
    method: 'POST',
    data
  })
}

/**
 * 查询机构形象关联声音列表
 * @param {*} params
 * @returns {Promise}
 */
export function getCharacterVoicesByOrg(params) {
  return request({
    url: '/cloud/edata-digitalhuman/voices/getCharacterVoicesByOrg',
    method: 'GET',
    params
  })
}

/**
 * 审批申诉
 * @param {*} data
 * @returns {Promise}
 */
export function appeal(data) {
  return request({
    url: '/cloud/edata-digitalhuman/approve/appeal',
    method: 'POST',
    data
  })
}

/**
 * 手动催审
 * @param {*} data
 * @returns {Promise}
 */
export function urgentReview(data) {
  return request({
    url: '/cloud/edata-digitalhuman/approve/urgentReview',
    method: 'POST',
    data
  })
}

/**
 * 获取预设模板列表
 * @param {*} data
 * @returns {Promise}
 */
export function getPresetTemplateList(data) {
  return request({
    url: '/cloud/edata-digitalhuman/presetTemplate/getPresetTemplateList',
    method: 'POST',
    data
  })
}

/**
 * 保存预设模板
 * @param {*} data
 * @returns {Promise}
 */
export function savePresetTemplate(data) {
  return request({
    url: '/cloud/edata-digitalhuman/presetTemplate/savePresetTemplate',
    method: 'POST',
    data
  })
}

/**
 * 修改预设模板
 * @param {*} data
 * @returns {Promise}
 */
export function updatePresetTemplate(data) {
  return request({
    url: '/cloud/edata-digitalhuman/presetTemplate/updatePresetTemplate',
    method: 'POST',
    data
  })
}

/**
 * 删除预设模板
 * @param {*} params
 * @returns {Promise}
 */
export function delPresetTemplate(params) {
  return request({
    url: '/cloud/edata-digitalhuman/presetTemplate/delPresetTemplate',
    method: 'DELETE',
    params
  })
}

/**
 * 校验预设模板参数
 * @param {*} data
 * @returns {Promise}
 */
export function checkPresetTemplate(data) {
  return request({
    url: '/cloud/edata-digitalhuman/presetTemplate/checkPresetTemplate',
    method: 'POST',
    data
  })
}

/**
 * 检查数字人协议签订情况
 * @param {*} params
 * @returns {Promise}
 */
export function checkSignDigitalhuman(params) {
  return request({
    url: '/cloud/edata-oa/checkSign/digitalhuman',
    method: 'GET',
    params
  })
}

/**
 * 获取训练示例列表
 * @param {*} params
 * @returns {Promise}
 */
export function getTrainingExampleList(params) {
  return request({
    url: '/cloud/edata-digitalhuman/training/getTrainingExampleList',
    method: 'GET',
    params
  })
}

/**
 * 新增训练示例
 * @param {*} data
 * @returns {Promise}
 */
export function addTrainingExample(data) {
  return request({
    url: '/cloud/edata-digitalhuman/training/addTrainingExample',
    method: 'POST',
    data
  })
}

/**
 * 编辑训练示例
 * @param {*} data
 * @returns {Promise}
 */
export function editTrainingExample(data) {
  return request({
    url: '/cloud/edata-digitalhuman/training/editTrainingExample',
    method: 'POST',
    data
  })
}

/**
 * 保存训练示例草稿
 * @param {*} data
 * @returns {Promise}
 */
export function saveTrainingExampleDraft(data) {
  return request({
    url: '/cloud/edata-digitalhuman/training/saveTrainingExampleDraft',
    method: 'POST',
    data
  })
}
