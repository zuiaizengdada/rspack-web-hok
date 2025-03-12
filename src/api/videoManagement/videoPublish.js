import request from '@/utils/request2'

// 根据平台id查询所有账号
export function getAccountList(params) {
  return request({
    url: '/cloud/edata-wemedia/media/account/qryAccountByPlatformId',
    method: 'get',
    params
  })
}

// 分组列表
export function getGroupList(data) {
  return request({
    url: '/cloud/edata-wemedia/media/account/groupList',
    method: 'post',
    data
  })
}

// 查询登录配置信息数据
export function getQryLoginMerchant(params) {
  return request({
    url: '/cloud/edata-wemedia/media/account/qryLoginMerchant',
    method: 'get',
    params
  })
}

// 记忆项查询
export function queryRemember(params) {
  return request({
    url: '/cloud/edata-wemedia/publishRemember/query',
    method: 'get',
    params
  })
}

// 记忆项保存
export function saveAccounts(data) {
  return request({
    url: '/cloud/edata-wemedia/publishRemember/saveAccounts',
    method: 'post',
    data
  })
}

// 蚁小二接口信息记录
export function insertApiStat(data) {
  return request({
    url: '/cloud/edata-wemedia/media/account/insertApiStat',
    method: 'post',
    data
  })
}

// 蚁小二接口信息记录
export function insertFuxiyunApiStat(data) {
  return request({
    url: '/cloud/edata-wemedia/media/account/insertFuxiyunApiStat',
    method: 'post',
    data
  })
}

// 设置记忆项
export function settingRemember(data) {
  return request({
    url: '/cloud/edata-wemedia/publishRemember/setting',
    method: 'post',
    data
  })
}

// 一键发布敏感词检测
export function publishCheck(data) {
  return request({
    url: '/cloud/edata-wemedia/publishRemember/publish/check',
    method: 'post',
    data
  })
}
