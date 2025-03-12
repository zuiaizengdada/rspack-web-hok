import service from '@/utils/request'
/**
 *@Summary 资质列表
 *
 * @param {*} params
 * @return {*}
 */
export const getQualificationinfoPage = (params) => {
  return service({
    url: `/dou/institution/qualificationinfo/page`,
    method: 'get',
    params
  })
}

/**
 *@Summary 上传资源
 *
 * @param {*} params
 * @return {*}
 */
export const resourceUpload = (data) => {
  return service({
    url: `/dou/resource/upload`,
    method: 'post',
    data
  })
}

/**
 *@Summary 新增资质
 *
 * @param {*} params
 * @return {*}
 */
export const qualificationinfoAdd = (data) => {
  return service({
    url: `/dou/institution/qualificationinfo/add`,
    method: 'post',
    data
  })
}

/**
 *@Summary 修改资质
 *
 * @param {*} params
 * @return {*}
 */
export const qualificationinfoEdit = (data) => {
  return service({
    url: `/dou/institution/qualificationinfo/modify`,
    method: 'PUT',
    data
  })
}
/**
 *@Summary 删除资质
 *
 * @param {*} params
 * @return {*}
 */
export const qualificationinfoDel = (id) => {
  return service({
    url: `/dou/institution/qualificationinfo/delete/${id}`,
    method: 'DELETE'
  })
}
