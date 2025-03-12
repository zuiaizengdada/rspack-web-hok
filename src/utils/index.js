/**
 * Created by PanJiaChen on 16/11/18.
 */
import axios from 'axios'
import store from '@/store/index'
import moment from 'moment'
/**
  * Parse the time to string
  * @param {(Object|string|number)} time
  * @param {string} cFormat
  * @returns {string | null}
  */
export function parseTime(time, cFormat) {
  if (arguments.length === 0 || !time) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if (typeof time === 'string') {
      time = new Date(time).getTime()
      if (/^[0-9]+$/.test(time)) {
        // support "1548221490638"
        time = parseInt(time)
      } else {
        // support safari
        // https://stackoverflow.com/questions/4310953/invalid-date-in-safari
        time = time.replace(new RegExp(/-/gm), '/')
      }
    }

    if (typeof time === 'number' && time.toString().length === 10) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
    const value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') {
      return ['日', '一', '二', '三', '四', '五', '六'][value]
    }
    return value.toString().padStart(2, '0')
  })
  return time_str
}

/**
  * 时间处理
  * @param {*} date 时间
  * @param {*} fmt 规则
  * @returns 字符串
  */
export const DateFormat = (date, fmt) => {
  // author: meizz
  if (date === '') {
    return ''
  }
  var o = {
    'M+': date.getMonth() + 1, // 月份
    'd+': date.getDate(), // 日
    'h+': date.getHours(), // 小时
    'm+': date.getMinutes(), // 分
    's+': date.getSeconds(), // 秒
    'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
    S: date.getMilliseconds() // 毫秒
  }
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  for (var k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length))
    }
  }
  return fmt
}

/**
  * @param {number} time
  * @param {string} option
  * @returns {string}
  */
export function formatTime(time, option) {
  if (('' + time).length === 10) {
    time = parseInt(time) * 1000
  } else {
    time = +time
  }
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return d.getMonth() + 1 + '月' + d.getDate() + '日' + d.getHours() + '时' + d.getMinutes() + '分'
  }
}

/**
  * @param {string} url
  * @returns {Object}
  */
export function getQueryObject(url) {
  url = url == null ? window.location.href : url
  const search = url.substring(url.lastIndexOf('?') + 1)
  const obj = {}
  const reg = /([^?&=]+)=([^?&=]*)/g
  search.replace(reg, (rs, $1, $2) => {
    const name = decodeURIComponent($1)
    let val = decodeURIComponent($2)
    val = String(val)
    obj[name] = val
    return rs
  })
  return obj
}

/**
  * @param {string} input value
  * @returns {number} output value
  */
export function byteLength(str) {
  // returns the byte length of an utf8 string
  let s = str.length
  for (var i = str.length - 1; i >= 0; i--) {
    const code = str.charCodeAt(i)
    if (code > 0x7f && code <= 0x7ff) s++
    else if (code > 0x7ff && code <= 0xffff) s += 2
    if (code >= 0xdc00 && code <= 0xdfff) i--
  }
  return s
}

/**
  * @param {Array} actual
  * @returns {Array}
  */
export function cleanArray(actual) {
  const newArray = []
  for (let i = 0; i < actual.length; i++) {
    if (actual[i]) {
      newArray.push(actual[i])
    }
  }
  return newArray
}

/**
  * @param {Object} json
  * @returns {Array}
  */
export function param(json) {
  if (!json) return ''
  return cleanArray(
    Object.keys(json).map((key) => {
      if (json[key] === undefined) return ''
      return encodeURIComponent(key) + '=' + encodeURIComponent(json[key])
    })
  ).join('&')
}

/**
  * @param {string} url
  * @returns {Object}
  */
export function param2Obj(url) {
  const search = decodeURIComponent(url.split('?')[1]).replace(/\+/g, ' ')
  if (!search) {
    return {}
  }
  const obj = {}
  const searchArr = search.split('&')
  searchArr.forEach((v) => {
    const index = v.indexOf('=')
    if (index !== -1) {
      const name = v.substring(0, index)
      const val = v.substring(index + 1, v.length)
      obj[name] = val
    }
  })
  return obj
}

/**
  * @param {string} val
  * @returns {string}
  */
export function html2Text(val) {
  const div = document.createElement('div')
  div.innerHTML = val
  return div.textContent || div.innerText
}

/**
  * Merges two objects, giving the last one precedence
  * @param {Object} target
  * @param {(Object|Array)} source
  * @returns {Object}
  */
export function objectMerge(target, source) {
  if (typeof target !== 'object') {
    target = {}
  }
  if (Array.isArray(source)) {
    return source.slice()
  }
  Object.keys(source).forEach((property) => {
    const sourceProperty = source[property]
    if (typeof sourceProperty === 'object') {
      target[property] = objectMerge(target[property], sourceProperty)
    } else {
      target[property] = sourceProperty
    }
  })
  return target
}

/**
  * @param {HTMLElement} element
  * @param {string} className
  */
export function toggleClass(element, className) {
  if (!element || !className) {
    return
  }
  let classString = element.className
  const nameIndex = classString.indexOf(className)
  if (nameIndex === -1) {
    classString += '' + className
  } else {
    classString = classString.substr(0, nameIndex) + classString.substr(nameIndex + className.length)
  }
  element.className = classString
}

/**
  * @param {string} type
  * @returns {Date}
  */
export function getTime(type) {
  if (type === 'start') {
    return new Date().getTime() - 3600 * 1000 * 24 * 90
  } else {
    return new Date(new Date().toDateString())
  }
}

/**
  * @param {Function} func
  * @param {number} wait
  * @param {boolean} immediate
  * @return {*}
  */
export function debounce(func, wait, immediate) {
  let timeout, args, context, timestamp, result
  const later = function () {
    // 据上一次触发时间间隔
    const last = +new Date() - timestamp

    // 上次被包装函数被调用时间间隔 last 小于设定时间间隔 wait
    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last)
    } else {
      timeout = null
      // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
      if (!immediate) {
        result = func.apply(context, args)
        if (!timeout) context = args = null
      }
    }
  }

  return function (...args) {
    context = this
    timestamp = +new Date()
    const callNow = immediate && !timeout
    // 如果延时不存在，重新设定延时
    if (!timeout) timeout = setTimeout(later, wait)
    if (callNow) {
      result = func.apply(context, args)
      context = args = null
    }

    return result
  }
}

/**
  * This is just a simple version of deep copy
  * Has a lot of edge cases bug
  * If you want to use a perfect deep copy, use lodash's _.cloneDeep
  * @param {Object} source
  * @returns {Object}
  */
export function deepClone(source) {
  if (!source && typeof source !== 'object') {
    throw new Error('error arguments', 'deepClone')
  }
  const targetObj = source.constructor === Array ? [] : {}
  Object.keys(source).forEach((keys) => {
    if (source[keys] && typeof source[keys] === 'object') {
      targetObj[keys] = deepClone(source[keys])
    } else {
      targetObj[keys] = source[keys]
    }
  })
  return targetObj
}
/**
 * @param {number,string}
 * @returns {number,string}
 */
export function filterPrice(num) {
  if (num === null) {
    return 0
  } else {
    const moneyInYuan = num / 100

    let formattedValue
    if (Math.abs(moneyInYuan) >= 100000000) { // 绝对值大于等于1亿
      formattedValue = (moneyInYuan / 100000000).toFixed(2)
      return `${formattedValue}亿`
    } else if (Math.abs(moneyInYuan) >= 10000) { // 绝对值大于等于1万
      formattedValue = (moneyInYuan / 10000).toFixed(2)
      return `${formattedValue}万`
    } else {
      return `${moneyInYuan.toFixed(2)}` // 不足1万直接返回元
    }
  }
}

/**
 * @param {number,string}
 * @returns {number,string}
 */
export function filterPriceNoCompany(num) {
  if (num === null) {
    return 0
  } else {
    const moneyInYuan = num / 100

    let formattedValue
    if (Math.abs(moneyInYuan) >= 100000000) { // 绝对值大于等于1亿
      formattedValue = (moneyInYuan / 100000000).toFixed(2)
      return `${formattedValue}`
    } else if (Math.abs(moneyInYuan) >= 10000) { // 绝对值大于等于1万
      formattedValue = (moneyInYuan / 10000).toFixed(2)
      return `${formattedValue}`
    } else {
      return `${moneyInYuan.toFixed(2)}` // 不足1万直接返回元
    }
  }
}
/**
 * @param {number,string}
 * @returns {number,string}
 */
export function filterPriceReturnCompany(num) {
  if (num === null) {
    return 0
  } else {
    const moneyInYuan = num / 100

    // let formattedValue
    if (Math.abs(moneyInYuan) >= 100000000) { // 绝对值大于等于1亿
      // formattedValue = (moneyInYuan / 100000000).toFixed(2)
      return '亿'
    } else if (Math.abs(moneyInYuan) >= 10000) { // 绝对值大于等于1万
      // formattedValue = (moneyInYuan / 10000).toFixed(2)
      return `万`
    } else {
      return `` // 不足1万直接返回元
    }
  }
}

/**
  * @param {Array} arr
  * @returns {Array}
  */
export function uniqueArr(arr) {
  return Array.from(new Set(arr))
}

/**
  * @returns {string}
  */
export function createUniqueString() {
  const timestamp = +new Date() + ''
  const randomNum = parseInt((1 + Math.random()) * 65536) + ''
  return (+(randomNum + timestamp)).toString(32)
}

/**
  * Check if an element has a class
  * @param {HTMLElement} elm
  * @param {string} cls
  * @returns {boolean}
  */
export function hasClass(ele, cls) {
  return !!ele.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'))
}

/**
  * Add class to element
  * @param {HTMLElement} elm
  * @param {string} cls
  */
export function addClass(ele, cls) {
  if (!hasClass(ele, cls)) ele.className += ' ' + cls
}

/**
  * Remove class from element
  * @param {HTMLElement} elm
  * @param {string} cls
  */
export function removeClass(ele, cls) {
  if (hasClass(ele, cls)) {
    const reg = new RegExp('(\\s|^)' + cls + '(\\s|$)')
    ele.className = ele.className.replace(reg, ' ')
  }
}

/**
  * 图片下载
  * @param {string} 下载地址
  * @param {string} 文件名
  */
export function downLink(url, name) {
  return axios({
    method: 'get',
    url: url,
    // 必须显式指明响应类型是一个Blob对象，这样生成二进制的数据，才能通过window.URL.createObjectURL进行创建成功
    responseType: 'blob'
  })
    .then((res) => {
      if (!res) {
        return
      }
      // 将lob对象转换为域名结合式的url
      const blobUrl = window.URL.createObjectURL(res.data)
      const link = document.createElement('a')
      document.body.appendChild(link)
      link.style.display = 'none'
      link.href = blobUrl
      // 设置a标签的下载属性，设置文件名及格式，后缀名最好让后端在数据格式中返回
      link.download = name
      // 自触发click事件
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(blobUrl)
    })
    .catch((err) => {
      console.log(err, '下载失败')
    })
}

/**
  * 扁平数组转树结构
  *
  */
export function t(dataArr) {
  const result = dataArr.reduce((prev, next) => {
    prev[next.parentId] ? prev[next.parentId].push(next) : (prev[next.parentId] = [next])
    return prev
  }, {})
  Object.keys(result).map((key) => {
    result[key].map((item, i) => {
      result[item.id] ? (item.children = result[item.id]) : ''
    })
  })
  return result[0]
}

/**
  * 音频下载
  */
export function downMp3(url, name) {
  axios(url)
    .then((res) => res.blob())
    .then((blob) => {
      const a = document.createElement('a')
      document.body.appendChild(a)
      a.style.display = 'none'
      const url = window.URL.createObjectURL(blob)
      a.href = url
      a.download = name
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    })
    .catch((err) => {
      console.log(err)
    })
}

export function downVideo(url, name) {
  var xhr = new XMLHttpRequest()
  xhr.open('get', url, true) // 也可以使用POST方式，根据接口
  // 						xhr.setRequestHeader("dis_k",`cb9a62d3796e276f8707318b3c48ed3d`);
  // xhr.setRequestHeader("dis_t",`1617786336`);
  xhr.responseType = 'blob' // 返回类型blob

  xhr.onload = function () {
    if (this.status === 200) {
      var blob = this.response
      var reader = new FileReader()
      reader.readAsDataURL(blob) // 转换为base64，可以直接放入a表情href
      reader.onload = function (e) {
        console.log(e, 'e++++++')
        var a = document.createElement('a')
        a.download = name // 下载文件名
        a.href = e.target.result
        a.click()
        window.URL.revokeObjectURL(e.target.result)
      }
    }
  }
  xhr.send()
}

export function downVideo2(url, name, onDownloadProgress, cancelToken) {
  axios(url, {
    responseType: 'blob',
    onDownloadProgress: onDownloadProgress,
    cancelToken
  })
    .then((res) => new Blob([res.data]))
    .then((blob) => {
      const a = document.createElement('a')
      document.body.appendChild(a)
      a.style.display = 'none'
      const url = window.URL.createObjectURL(blob)
      a.href = url
      a.download = name
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    })
    .catch((err) => {
      console.log(err, '下载失败')
    })
}

export function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader()
    fileReader.onload = (e) => {
      resolve(e.target.result)
    }
    // readAsDataURL
    fileReader.readAsDataURL(blob)
    fileReader.onerror = () => {
      reject(new Error('blobToBase64 error'))
    }
  })
}

export function downloadFile(content, filename) {
  var a = document.createElement('a')
  var blob = new Blob([content])
  var url = window.URL.createObjectURL(blob)
  a.href = url
  a.download = filename
  a.click()
  window.URL.revokeObjectURL(url)
}

// 浏览文件
export function browseFile(url) {
  var a = document.createElement('a')
  a.href = url
  a.target = '_blank'
  a.click()
}

export function download(url, filename) {
  ajax(
    url,
    function (xhr) {
      downloadFile(xhr.response, filename)
    },
    {
      responseType: 'blob'
    }
  )
}

export function ajax(url, callback, options) {
  window.URL = window.URL || window.webkitURL
  var xhr = new XMLHttpRequest()
  xhr.open('get', url, true)
  if (options.responseType) {
    xhr.responseType = options.responseType
  }
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      callback(xhr)
    }
  }
  xhr.send()
}

// 判断数据是为null
export function isNull(a) {
  return !a && typeof a !== 'undefined' && a !== 0
}

// 对象去除空值
export function toType(obj) {
  return {}.toString
    .call(obj)
    .match(/\s([a-zA-Z]+)/)[1]
    .toLowerCase()
}
export function filterNull(o) {
  for (var key in o) {
    if (o[key] === null || o[key] === '' || o[key] === undefined) {
      delete o[key]
    }
    if (toType(o[key]) === 'string') {
      o[key] = o[key].trim()
    } else if (toType(o[key]) === 'object') {
      o[key] = filterNull(o[key])
    } else if (toType(o[key]) === 'array') {
      o[key] = filterNull(o[key])
    }
  }
  return o
}

// data传入原始数组
export function dealingwithadult(data) {
  const result = []
  if (!Array.isArray(data)) {
    return result
  }
  const map = {}
  data.forEach((item) => {
    if (item) {
      map[item.menuId] = item
    }
  })
  data.forEach((item) => {
    if (item) {
      const parent = map[item.parentId]
      if (parent) {
        parent.children || (parent.children = [])
        parent.children.push(item)
      } else {
        result.push(item)
      }
    }
  })
  return result
}

// 获取最近(前)day天（一周内）和最近(前)3天日期
export function getDay(day) {
  var today = new Date()
  var targetday_milliseconds = today.getTime() + 1000 * 60 * 60 * 24 * day
  today.setTime(targetday_milliseconds) // 注意，这行是关键代码
  var tYear = today.getFullYear()
  var tMonth = today.getMonth()
  var tDate = today.getDate()
  tMonth = doHandleMonth(tMonth + 1)
  tDate = doHandleMonth(tDate)
  return tYear + '-' + tMonth + '-' + tDate
}
function doHandleMonth(month) {
  var m = month
  if (month.toString().length === 1) {
    m = '0' + month
  }
  return m
}

/**
  * @Summary 浏览器进入全屏方法
  *
  *
  */
export const fullScreen = () => {
  var el = document.documentElement
  var rfs = el.requestFullScreen || el.webkitRequestFullScreen || el.mozRequestFullScreen || el.msRequestFullscreen
  console.log(rfs)
  if (typeof rfs !== 'undefined' && rfs) {
    rfs.call(el)
  }
  return
}
/**
  * @Summary 浏览器退出全屏方法
  *
  * @param
  */
export const exitFullscreen = () => {
  if (document.exitFullScreen) {
    document.exitFullScreen()
  } else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen()
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen()
  } else if (document.msExitFullscreen) {
    document.msExitFullscreen()
  }
}

/**
  * @Summary obj转arr
  *
  */
export const getList2Obj = (obj) => {
  const list = []
  for (const i in obj) {
    list.push({
      label: obj[i],
      value: i
    })
  }
  return list
}

export const getTreeLabelById = (data, id) => {
  let label = null
  const getTreeLabel = (arr, key) => {
    arr.forEach((i) => {
      if (i.value === key) {
        label = i.label
      }
      if (i.children && i.children.length) {
        getTreeLabel(i.children, key)
      }
    })
  }
  getTreeLabel(data, id)
  return label
}

/**
  *  @Summary 复制文字
  *
  * @param {*} value
  * @return {*}
  */
export const copy = function (value) {
  var textareaC = document.createElement('textarea')
  textareaC.setAttribute('readonly', 'readonly') // 设置只读属性防止手机上弹出软键盘
  textareaC.value = value
  document.body.appendChild(textareaC) // 将textarea添加为body子元素
  textareaC.select()
  var res = document.execCommand('copy')
  document.body.removeChild(textareaC) // 移除DOM元素
  return res
}
/**
  * 获取昨日的开始时间和结束时间
  * 返回值为obj对象，包含：startTime（字符串）YYYY-MM-DD hh:mm:ss，endTime(字符串)
  */
export const getYesterdayTime = () => {
  const obj = {
    startTime: '',
    endTime: ''
  }
  const MillisecondsADay = 24 * 60 * 60 * 1000 * 1
  // 今日开始时间戳
  const todayStartTime = new Date(new Date().setHours(0, 0, 0, 0)).getTime()
  // 今日结束时间戳
  const todayEndTime = new Date(new Date().setHours(23, 59, 59, 999)).getTime()
  // 昨日开始时间戳
  const yesterdayStartTime = todayStartTime - MillisecondsADay
  // 昨日结束时间戳
  const yesterdayEndTime = todayEndTime - MillisecondsADay
  obj.startTime = DateFormat(new Date(yesterdayStartTime), 'yyyy-MM-dd hh:mm:ss')
  obj.endTime = DateFormat(new Date(yesterdayEndTime), 'yyyy-MM-dd hh:mm:ss')
  return obj
}

/**
  * 获取昨日的开始时间和结束时间
  * 返回值为obj对象，包含：startTime（字符串）YYYY-MM-DD hh:mm:ss，endTime(字符串)
  */
export const getSevenDayTime = (num) => {
  const obj = {
    startTime: '',
    endTime: ''
  }
  const MillisecondsADay = 24 * 60 * 60 * 1000 * num
  // 今日开始时间戳
  const todayStartTime = new Date(new Date().setHours(0, 0, 0, 0)).getTime()
  // 今日结束时间戳
  const todayEndTime = new Date(new Date().setHours(23, 59, 59, 999)).getTime()
  // 昨日开始时间戳
  const yesterdayStartTime = todayStartTime - MillisecondsADay
  // 昨日结束时间戳
  // const yesterdayEndTime = todayEndTime - MillisecondsADay
  obj.startTime = DateFormat(new Date(yesterdayStartTime), 'yyyy-MM-dd hh:mm:ss')
  obj.endTime = DateFormat(new Date(todayEndTime), 'yyyy-MM-dd hh:mm:ss')
  return obj
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

export function removedup(arr, batch) {
  if (!Array.isArray(arr)) {
    return arr
  }
  if (arr.length === 0) {
    return []
  }
  const obj = {}
  const uniqueArr = arr.reduce(function (total, item) {
    obj[item[batch]] ? '' : (obj[item[batch]] = true && total.push(item))
    return total
  }, [])
  return uniqueArr
}

// s为播放上传总秒数, 大于1小时，展示小时
export function getPlayDuration(s) {
  return s > 3600 * 1000 ? moment.utc(s).format('HH:mm:ss') : moment(s).format('mm:ss')
}

/**
  * 获取火山播放视频封面url
  * @param {*} url 火山返回的PosterUri 或者 StoreUri
  * @param {*} options.tplv 封面图处理模板
  * tplv-vod-obj：获取图片源文件 (默认)
  * tplv-vod-noop：获取压缩的原图
  * tplv-vod-rs： 设置模版宽和高的像素，等比例缩小图片，至整个图片可以放入模版框内。格式为 tplv-vod-rs:宽:高。如果某条边设置为0px，则用另一条边的长做等比缩小；
  * tplv-vod-cc：居中裁剪。需设置宽和高的像素值。参数格式为 tplv-vod-cc:宽:高。先居中裁剪尽量少的像素到指定的宽高比，后缩小到指定宽高；如果某条边被设置为0px，则使用该边在原图中的像素；
  * tplv-vod-cs：智能裁剪。需设置宽和高的像素值。格式为 tplv-vod-cs:宽:高。智能保留图片中的特征区域，缩小方式同 tplv-vod-cc。
  * @param {*} options.imgType 片格式 image（保留源格式）(默认) jpeg webp
  * @returns 封面地址
  */
export function getHuoshanPosterUrl(url = '', options = {}) {
  if (!url) {
    return ''
  }
  // {协议}://{封面图域名}/{PosterUri或StoreUri}~{封面图处理模版}.{图片格式}
  return `${process.env.VUE_APP_HUOSHAN_PSSTERURI}${url}~${options.tplv ? options.tplv : 'tplv-vod-obj'}.${options.imgType ? options.imgType : 'image'}`
}

/**
 * 通过后缀判断是否音频，视频，图片
 * @param {*} url 文件的url或者文件名
 * @returns {*} obj suffix|文件的后缀(jpg,mp3等) fileType|文件的类型(video|audio|img)
 */
export function getFileType(url) {
  const str = url.toLowerCase().split('?')[0]
  let suffix = ''
  let fileType = ''
  let fileName = ''
  // 音频判断
  if (/\.(amr|mp3|wav|aac|mar|wma)$/.test(str)) {
    fileType = 'audio'
  } else if (/\.(3pg|mp4|mov)$/.test(str)) {
    fileType = 'video'
  } else if (/\.(jpg|png|jpeg|bmp)$/.test(str)) {
    fileType = 'img'
  } else if (/\.(doc|docx|xls|xlsx|pdf)$/.test(str)) {
    fileType = 'file'
  }
  const index = str.lastIndexOf('.') + 1
  const length = str.length
  suffix = str.substring(index, length)
  fileName = str.substring(0, index - 1)
  return {
    suffix,
    fileName,
    fileType
  }
}
export function formatDuring(mss) {
  if (mss === 0) {
    return '00:00:00.000'
  }
  if (!mss) {
    return '---'
  }
  var hours = parseInt((mss % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  if (hours < 10) {
    hours = '0' + hours
  }
  var minutes = parseInt((mss % (1000 * 60 * 60)) / (1000 * 60))
  if (minutes < 10) {
    minutes = '0' + minutes
  }
  var seconds = ((mss % (1000 * 60)) / 1000).toFixed(3)
  if (seconds < 10) {
    seconds = '0' + seconds
  }
  return hours + ':' + minutes + ':' + seconds
}
/**
  * @param {String} key router path
  * @returns router children
  */
export const getRoutesPermsList = (key) => {
  const permissionRoutes = store.getters['permission_routes']
  let child = []
  const getRoutesChild = (arr, path) => {
    arr.forEach((i) => {
      if (i.path === path) {
        child = i.children
      }
      if (i.children && i.children.length) {
        getRoutesChild(i.children, path)
      }
    })
  }
  getRoutesChild(permissionRoutes, key)
  return child
}

// 判断系统类型
export const OSnow = () => {
  var agent = navigator.userAgent.toLowerCase()
  var isMac = /macintosh|mac os x/i.test(navigator.userAgent)
  if (agent.indexOf('win32') >= 0 || agent.indexOf('wow32') >= 0) {
    // your code
    return 'win32'
  }
  if (agent.indexOf('win64') >= 0 || agent.indexOf('wow64') >= 0) {
    // your code
    return 'win64'
  }
  if (isMac) {
    // your code
    return 'mac'
  }
  return '未知'
}

// 获取数组内的id集合
export const getIds = (arr, key) => {
  return arr.reduce((pre, next) => {
    pre.push(next[key])
    return pre
  }, [])
}

/**
 * @returns 时间段内所有的日期
 * @param starDay
 * @param endDay
 */
export const getDayAll = (starDay, endDay) => {
  var arr = []
  var dates = []
  // 两个日期相同，返回24小时格式
  if (starDay === endDay) {
    const curTime = moment().format('H') // 当前时间
    const endTime = starDay === moment().format('YYYY-MM-DD') ? curTime : 24 // 今日结束时间为当前时间
    for (let t = 0; t <= endTime; t++) {
      dates.push(`${t}:00`)
    }
    // 0点加上昨天的日期，格式为昨天 24:00
    dates[0] = `${moment(starDay).subtract(1, 'day').format('MM-DD')} 24:00`
    return dates
  }
  // 设置两个日期UTC时间
  var db = new Date(starDay)
  var de = new Date(endDay)
  // 获取两个日期GTM时间
  var s = db.getTime() - 24 * 60 * 60 * 1000
  var d = de.getTime() - 24 * 60 * 60 * 1000
  // 获取到两个日期之间的每一天的毫秒数
  for (var i = s; i <= d;) {
    i = i + 24 * 60 * 60 * 1000
    arr.push(parseInt(i))
  }
  // 获取每一天的时间  YY-MM-DD
  for (var j in arr) {
    var time = new Date(arr[j])
    var year = time.getFullYear(time)
    var mouth = (time.getMonth() + 1) >= 10 ? (time.getMonth() + 1) : ('0' + (time.getMonth() + 1))
    var day = time.getDate() >= 10 ? time.getDate() : ('0' + time.getDate())
    var YYMMDD = year + '-' + mouth + '-' + day
    dates.push(YYMMDD)
  }
  return dates
}

// 过滤所有的数值
/**
 * @returns 过滤完的数据
 * @param num
 */
export const getFilterPrice = (num) => {
  if (num === null) {
    return 0
  } else {
    const newNum = num
    if (newNum < 10000000 && newNum > -10000000) {
      return newNum
    } else {
      return (newNum / 10000).toFixed(2) + '万'
    }
  }
}

export function isAllEqual(array) {
  if (array.length > 0) {
    return !array.some(function(value, index) {
      return value !== array[0]
    })
  } else {
    return true
  }
}

export function getBrowser2UserAgent() {
  const userAgent = navigator.userAgent // 取得浏览器的userAgent字符串
  const userAgentEnum = {
    isEdge: 'Edg', // 判断是否IE的Edge浏览器
    is360: 'QIHU', // 判断是否360安全浏览器
    isQQ: 'QQBrowser', // 判断是否QQ浏览器
    isSouGou: 'MetaSr', // 判断是否搜狗浏览器
    isWechat: 'MicroMessenger'// 判断是否微信浏览器
  }
  let browserType
  for (const key in userAgentEnum) {
    if (userAgent.indexOf(userAgentEnum[key]) > -1) {
      browserType = key
    }
  }
  if (!browserType && userAgent.indexOf('Chrome') > -1) {
    return 'isChrome'
  }
  return browserType
}
// obj转query
/**
 * @returns str
 * @param obj
 */

export function changeQuery(obj) {
  if (typeof obj !== 'object' || Array.isArray(obj)) return
  const result = []
  for (const key in obj) {
    result.push(`${key}=${obj[key]}`)
  }
  return result.join('&')
}

export function secondIsLiveDuration(val) {
  if (!val || typeof val !== 'number') {
    return '00时00分00秒'
  } else {
    const result = parseInt(val)
    const h = Math.floor(result / 3600) < 10 ? '0' + Math.floor(result / 3600) : Math.floor(result / 3600)
    const m = Math.floor((result / 60 % 60)) < 10 ? '0' + Math.floor((result / 60 % 60)) : Math.floor((result / 60 % 60))
    const s = Math.floor((result % 60)) < 10 ? '0' + Math.floor((result % 60)) : Math.floor((result % 60))
    return h + '时' + m + '分' + s + '秒'
  }
}

// 字符串中过滤手机号码
export const filtersTextPhone = (str) => {
  var regExp = new RegExp('^.*(1[3-9]\\d{9}).*$')
  if (regExp.test(str)) {
    const filterStr = str.replace(/(1[3-9]\d)\d{4}(\d{4})/g, '$1****$2')
    return filterStr
  } else {
    return str
  }
}

// 下载PDF文件到本地
export function fileDownload(url, filename) {
  // 1.创建xhr对象
  const xhr = new XMLHttpRequest()
  // 2.设置请求方式和请求地址
  xhr.open('GET', url, true)
  // 3.设置请求头
  xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
  // 4.设置响应类型
  xhr.responseType = 'blob'
  // 5.监听状态变化
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      // 6.创建blob对象
      const blob = xhr.response
      // 7.创建a标签
      const a = document.createElement('a')
      // 8.创建url对象
      const url = window.URL.createObjectURL(blob)
      // 9.设置a标签的href属性
      a.href = url
      // 10.设置a标签的download属性
      a.download = filename
      // 11.触发a标签的点击事件
      a.click()
      // 12.释放url对象
      window.URL.revokeObjectURL(url)
    }
  }
  // 13.发送请求
  xhr.send()
}
//
/**
 * @param {Array} arr 判断数组内有没有重复的值
 *
 * @return {Boolean}
 */

export const hasDuplicate = (arr) => {
  const uniqueElements = new Set(arr)
  console.log(uniqueElements.size, arr.length)
  // 如果集合的大小与数组长度不相等，说明有重复元素，返回 true；否则返回 false
  return uniqueElements.size !== arr.length
}

export const getH5OriginUrl = () => {
  return 'https://h5.hokkj.cn'
}

// 过滤特殊字符
export const filterSpecialCharacters = (val) => {
  return val.replace(/[\[\] #【】（）『』「」〖〗m²•①★※→]/g, '')
}

export const formatterForNumber = (num) => {
  return String(num).replace(/\d{1,3}(?=(\d{3})+(\.|$))/g, '$&,')
}
// 格式化数字
export const formatterForW = (num) => {
  let numReturn = ''
  if (num > 10000) {
    const nums = (num / 10000).toFixed(2) + ''
    const numStr = nums.substring(nums.indexOf('.'), nums.length)
    numReturn = formatterForNumber(parseInt(num / 10000)) + numStr + 'w'
    return numReturn
  } else {
    numReturn = formatterForNumber(num)
    return numReturn
  }
}

// 邮箱校验规则
export const handleEmailValid = (str) => {
  if (!str) return false
  const emailRegExp = /^[A-Za-z0-9_.+-\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
  return emailRegExp.test(str)
}
// 判断当前的版本号是否在xx版本之后
export const isGreaterThan = (version1, version2) => {
  const parts1 = version1.split('.').map(Number)
  const parts2 = version2.split('.').map(Number)
  for (let i = 0; i < parts1.length; i++) {
    if (parts1[i] > parts2[i]) {
      return true
    } else if (parts1[i] < parts2[i]) {
      return false
    }
  }

  return false
}

// 根据传入的渠道id判断是用新版本的客户端还是老版本客户端 老客户端则记录接口调用
export const isUseNewClient = (platformId, apiName, platformAccountId, remark) => {
  let mysocket = null
  // console.log(store.getters.newPublishConfig, 'store.getters.newPublishConfig')
  // if (store.getters.isNewSocketVideoPublish && store.getters.newPublishConfig.includes(platformId) && window.videoPublishNewSocket.connected) {
  //   console.log(apiName, '新版本客户端')
  store.dispatch('settings/insertApiStat', { 'apiUrl': apiName, platformAccountId: platformAccountId, 'remark': remark, type: 2 })
  mysocket = window.videoPublishNewSocket
  // } else {
  //   console.log(apiName, '老版本客户端')
  //   mysocket = window.videoPublishSocket
  //   store.dispatch('settings/insertApiStat', { 'apiUrl': apiName, platformAccountId: platformAccountId, 'remark': remark, type: 1 })
  // }
  return mysocket
}

// 是否用了新版客户端
export const isNewClient = (platformId) => {
  // if (store.getters.isNewSocketVideoPublish && store.getters.newPublishConfig.includes(platformId)) {
  return true
  // }
  // return false
}

// 判断是否有值
export function hasValue(val) {
  return val !== null && val !== undefined && val !== '' && !Number.isNaN(val)
}

// 通过value获取options的label
export function findLabelByValue(value, options) {
  const status = options.find(option => option.value === value)
  return status ? status.label : ''
}

// 获取当前选中文本
export function getSelectedText() {
  var text = ''
  if (typeof window.getSelection !== 'undefined') {
    text = window.getSelection().toString()
  } else if (typeof document.selection !== 'undefined' && document.selection.type === 'Text') {
    text = document.selection.createRange().text
  }
  return text
}

// 获取选中文本的开始及结束位置
export function getSelectedTextPosition() {
  var position = { start: 0, end: 0 }
  if (typeof window.getSelection !== 'undefined') {
    var selection = window.getSelection()
    position.start = selection.anchorOffset
    position.end = selection.focusOffset
    console.log(position, '选中文字位置')
  } else if (typeof document.selection !== 'undefined' && document.selection.type === 'Text') {
    var range = document.selection.createRange()
    var textRange = range.duplicate()
    textRange.moveToElementText(range.parentElement())
    textRange.setEndPoint('EndToEnd', range)
    position.start = textRange.text.length - range.text.length
    position.end = position.start + range.text.length
  }
  return position
}

// 清空选中的文本
export function clearSelectedText() {
  if (window.getSelection) {
    window.getSelection().removeAllRanges()
  } else if (document.selection) {
    document.selection.empty()
  }
}

// 另一种更简单的方法，使用 Intl.NumberFormat
export function formatNumber(num, decimals = 2) {
  if (num === null || num === undefined) return '0.00'

  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(num)
}

export const delay = (t) => new Promise(r => setTimeout(r, t))
