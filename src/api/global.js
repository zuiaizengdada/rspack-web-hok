import request from '@/utils/request2'
// import request2 from '@/utils/request'

export function updateLivePhone(data) {
  return request({
    url: '/cloud/edata-sale/clue/livePhone/update',
    method: 'POST',
    data
  })
}

export function getSmsAreaCodes(params) {
  return request({
    url: '/cloud/edata-message/sms-area-code-do/sms/groupBySmsAreaCodes',
    method: 'GET',
    params
  })
}

export function getMailSuffixes(params) {
  return request({
    url: '/cloud/edata-message/mailSuffixes/query',
    method: 'GET',
    params
  })
}
