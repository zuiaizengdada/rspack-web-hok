import service from '@/utils/request'
/**
 *@Summary 根据字典类型查询字典数据信息
 *
 * @param {*} params
 * @return {*}
 */
export const dictType = (params) => {
  return service({
    url: `/sys/dict/type/${params}`,
    method: 'get'
  })
}
