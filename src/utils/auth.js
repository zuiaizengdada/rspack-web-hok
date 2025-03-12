// import Cookies from 'js-cookie'
import { getPlatformOauthCallback } from '@/api/advertisingKanBan'
import { getItem, setItem } from '@/utils/localStorage'

const TokenKey = 'Admin-Token'

export function getToken() {
  // return Cookies.get(TokenKey)
  return getItem(TokenKey)
}

export function setToken(token) {
  // return Cookies.set(TokenKey, token, { expires: 30 })
  return setItem(TokenKey, token)
}

export function removeToken() {
  // Cookies.remove(TokenKey)
  // Cookies.remove('User-Info')
  setItem(TokenKey, null)
  setItem('UserInfo', null)
  return
}

export function getUserInfo() {
  // return Cookies.get('User-Info')
  return getItem('UserInfo')
}

export function setUserInfo(userInfo) {
  // return Cookies.set('User-Info', userInfo, { expires: 30 })
  return setItem('UserInfo', userInfo)
}
// 广告数据新增账号 第三方回调路由处理
export function accountAllBackUrl(params) {
  return new Promise((resolve, reject) => {
    getPlatformOauthCallback({
      auth_code: params.auth_code,
      state: params.state
    })
      .then(() => {
        resolve()
      })
      .catch(() => {
        reject()
      })
  })
}
