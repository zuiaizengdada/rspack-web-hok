import request from '@/utils/request2'

// 获取形象训练列表
export function getImageTrainingList(data) {
  return request({
    url: `/cloud/edata-digitalhuman/training/getTrainingList`,
    method: 'POST',
    data
  })
}

// 确认采购
export function confirmPurchase(data) {
  return request({
    url: '/cloud/edata-digitalhuman/training/confirmPurchase',
    method: 'POST',
    data
  })
}

// 放弃采购
export function giveUpPurchase(params) {
  return request({
    url: '/cloud/edata-digitalhuman/training/abandonPurchase',
    method: 'GET',
    params
  })
}

// 新增形象训练
export function addImageTraining(data) {
  return request({
    url: '/cloud/edata-digitalhuman/training/addTraining',
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data;charset=UTF-8'
    },
    data
  })
}

// 获取声音训练列表
export function getVoiceTrainingList(data) {
  return request({
    url: '/cloud/edata-digitalhuman/voiceTraining/getTrainingList',
    method: 'POST',
    data
  })
}

// 新增声音训练
export function addVoiceTraining(data) {
  return request({
    url: '/cloud/edata-digitalhuman/voiceTraining/addTraining',
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data;charset=UTF-8'
    },
    data
  })
}

// 放弃声音采购
export function giveUpVoicePurchase(params) {
  return request({
    url: '/cloud/edata-digitalhuman/voiceTraining/abandonPurchase',
    method: 'GET',
    params
  })
}

// 确认声音采购
export function confirmVoicePurchase(params) {
  return request({
    url: '/cloud/edata-digitalhuman/voiceTraining/confirmPurchase',
    method: 'GET',
    params
  })
}

// 编辑声音训练示例
export function editVoiceTrainingExample(data) {
  return request({
    url: '/cloud/edata-digitalhuman/voiceTraining/editTrainingExample',
    method: 'POST',
    data
  })
}

// 新增声音训练示例
export function addVoiceTrainingExample(data) {
  return request({
    url: '/cloud/edata-digitalhuman/voiceTraining/addTrainingExample',
    method: 'POST',
    data
  })
}

// 获取声音训练示例列表
export function getVoiceTrainingExampleList(params) {
  return request({
    url: '/cloud/edata-digitalhuman/voiceTraining/getTrainingExampleList',
    method: 'GET',
    params
  })
}

// 保存声音训练示例草稿
export function saveVoiceTrainingExampleDraft(data) {
  return request({
    url: '/cloud/edata-digitalhuman/voiceTraining/saveTrainingExampleDraft',
    method: 'POST',
    data
  })
}

// 查询IP已采购声音列表
export function getTeacherVoicesByOrg(params) {
  return request({
    url: '/cloud/edata-digitalhuman/voiceTraining/getTeacherVoicesByOrg',
    method: 'GET',
    params
  })
}
