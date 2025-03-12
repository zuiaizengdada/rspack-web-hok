
import request from '@/utils/request2'
import axios from 'axios'

export function getExternalTeacherListApi(url, header) {
  return axios({
    url,
    method: 'get',
    header,
    timeout: 8000
  })
}

export function getExternalTeacherListKuaiShouApi(url, header) {
  return axios({
    url,
    method: 'get',
    header,
    timeout: 12000
  })
}

// 收藏视频至师资档案
export function collectTeacher(data) {
  return request({
    url: '/cloud/teacher/teacher/collect',
    method: 'POST',
    data
  })
}

export function closeDouyinApi(url, header) {
  return axios({
    url,
    method: 'get',
    header,
    timeout: 12000
  })
}
export function closeBaiduApi(url, header) {
  return axios({
    url,
    method: 'get',
    header,
    timeout: 12000
  })
}

export function closeSogouApi(url, header) {
  return axios({
    url,
    method: 'get',
    header,
    timeout: 12000
  })
}
