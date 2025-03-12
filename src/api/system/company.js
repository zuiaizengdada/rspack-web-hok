import service from '@/utils/request2'
/**
 *@Summary 公司主体分页查询
 *
 * @param {*} params
 * @return {*}
 */
export const companyPage = (params) => {
  return service({
    url: `/cloud/teacher/company/page`,
    method: 'get',
    params
  })
}

/**
 *@Summary 新增公司主体
 *
 * @param {*} data
 * @return {*}
 */
export const companyAdd = (data) => {
  return service({
    url: `/cloud/teacher/company/add`,
    method: 'POST',
    data
  })
}

/**
 *@Summary 删除公司主体
 *
 * @param {*} params
 * @return {*}
 */
export const companyDel = (params) => {
  return service({
    url: `/cloud/teacher/company/delete`,
    method: 'get',
    params
  })
}

/**
 *@Summary 禁用公司主体
 *
 * @param {*} params
 * @return {*}
 */
export const companyDisable = (params) => {
  return service({
    url: `/cloud/teacher/company/disable`,
    method: 'get',
    params
  })
}

/**
 *@Summary 编辑公司主体
 *
 * @param {*} data
 * @return {*}
 */
export const companyEdit = (data) => {
  return service({
    url: `/cloud/teacher/company/edit`,
    method: 'POST',
    data
  })
}

