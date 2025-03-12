
import store from '@/store/index'
export const loadJs = (url) => {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = url
    script.type = 'text/javascript'
    document.body.appendChild(script)
    script.onload = () => {
      resolve()
    }
  })
}

export const loadCss = (url) => {
  return new Promise((resolve, reject) => {
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = url
    document.head.appendChild(link)
    link.onload = () => {
      resolve()
    }
  })
}

export const generateUUID = () => {
  var d = new Date().getTime()
  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (d + Math.random() * 16) % 16 | 0
    d = Math.floor(d / 16)
    return (c === 'x' ? r : (r & 0x7 | 0x8)).toString(16)
  })
  return uuid
}

/**
 *
 *
 * @param {*} arr
 * @return {*}
 */
export const isArray = (arr) => {
  return Object.prototype.toString.call(arr) === '[object Array]'
}

/**
 * 通过字典dictType获取字典值，会缓存已经取过的值
 *
 * @param {*} name 字典dictType
 * @return {*} 字典值
 */
export const getDict = async (name) => {
  if (!store.getters['dict/dictList'][name]) {
    await store.dispatch('dict/setDict', name)
  }
  return store.getters['dict/dictList'][name]
}
