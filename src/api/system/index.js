import service from '@/utils/request'
import { edataUserApi } from '@/utils/http/index.js'
/**
 *@Summary 查询
 *
 * @param {*} params
 * @return {*}
 */
export const logsList = (params) => {
  // return service({
  return edataUserApi({
    url: `/system/logs/list`,
    method: 'get',
    params
  })
}

/**
 *@Summary 购买须知 - 新增
 *
 * @param {*} data
 * @return {*}
 */
export const purchaseAdd = (data) => {
  return service({
    url: `/purchase/notice/add`,
    method: 'post',
    data
  })
}

/**
 *@Summary 购买须知 - 列表
 *
 * @param {*} data
 * @return {*}
 */
export const purchasePage = (data) => {
  return service({
    url: `/purchase/notice/page`,
    method: 'post',
    data
  })
}

/**
 *@Summary 购买须知 - 编辑
 *
 * @param {*} data
 * @return {*}
 */
export const purchaseEdit = (data) => {
  return service({
    url: `/purchase/notice/edit`,
    method: 'post',
    data
  })
}

/**
 *@Summary 购买须知 - 详情
 *
 * @param {*} params
 * @return {*}
 */
export const purchaseDetail = (params) => {
  return service({
    url: `/purchase/notice/detail`,
    method: 'get',
    params
  })
}
