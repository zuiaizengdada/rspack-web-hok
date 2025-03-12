import request from '@/utils/request2'
export function getDeliveryAssistant(params) {
  return request({
    url: `/cloud/delivery/assistant/board/page`,
    method: 'get',
    params
  })
}
