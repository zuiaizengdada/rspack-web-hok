import request from '@/utils/request2'

/**
 * 检查生成频率
 * @param {*} params
 * @returns
 */
export function checkGenerateFrequency(params) {
  return request({
    url: `/cloud/edata-digitalhuman/generateFrequency/checkGenerateFrequency`,
    method: 'GET',
    params
  })
}

/**
 * 新增配置
 * @param {*} data
 * @returns
 */
export function addGenerateFrequencyConfig(data) {
  return request({
    url: `/cloud/edata-digitalhuman/generateFrequency/addGenerateFrequencyConfig`,
    method: 'POST',
    data
  })
}

/**
 * 已配讲师列表
 * @param {*} params
 * @returns
 */
export function configuredTeacherList(params) {
  return request({
    url: `/cloud/edata-digitalhuman/generateFrequency/configuredTeacherList`,
    method: 'GET',
    params
  })
}

/**
 * 删除配置
 * @param {*} data
 * @returns
 */
export function deleteGenerateFrequencyConfig(data) {
  return request({
    url: `/cloud/edata-digitalhuman/generateFrequency/deleteGenerateFrequencyConfig`,
    method: 'POST',
    data
  })
}

/**
 * 修改配置
 * @param {*} data
 * @returns
 */
export function editGenerateFrequencyConfig(data) {
  return request({
    url: `/cloud/edata-digitalhuman/generateFrequency/editGenerateFrequencyConfig`,
    method: 'POST',
    data
  })
}

/**
 * 查询配置
 * @param {*} data
 * @returns
 */
export function getGenerateFrequencyConfigList(data) {
  return request({
    url: `/cloud/edata-digitalhuman/generateFrequency/getGenerateFrequencyConfigList`,
    method: 'POST',
    data
  })
}
