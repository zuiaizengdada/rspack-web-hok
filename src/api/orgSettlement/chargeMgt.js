// import request from '@/utils/request'
import request2 from '@/utils/request2'

/** 查询机构待支付状态的账期 */
export function chargesListApi(params) {
  return request2({
    url: '/cloud/edata-bill/product/charges/list',
    method: 'get',
    params
  })
}
