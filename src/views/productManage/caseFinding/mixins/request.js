
import axios from 'axios'
const request = axios.create({
  timeout: 12000 // request timeout
})
request.interceptors.response.use((response) => {
  return response
}, (error) => {
  console.log(error)
}
)

export function whosecardDouyin(url) {
  return request({
    url,
    method: 'get'
  })
}

export function whosecardWeixin(url) {
  return request({
    url,
    method: 'get'
  })
}

export function whosecardKuaishou(url) {
  return request({
    url,
    method: 'get'
  })
}

export function whosecardXiaohongshu(url) {
  return request({
    url,
    method: 'get'
  })
}

// 百度视频
export function publicVideoHaokan(url) {
  return request({
    url,
    method: 'get'
  })
}

// B站
export function publicVideoBilibili(url) {
  return request({
    url,
    method: 'get'
  })
}

//
export function nodeNewsBaidu(url) {
  return request({
    url,
    method: 'get'
  })
}

export function nodeVideoDouyin(url) {
  return request({
    url,
    method: 'get'
  })
}

