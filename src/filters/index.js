// import parseTime, formatTime and set to filter
export { parseTime, formatTime } from '@/utils'
import BigNumber from 'bignumber.js'
/**
 * Show plural label if time is plural number
 * @param {number} time
 * @param {string} label
 * @return {string}
 */
function pluralize(time, label) {
  if (time === 1) {
    return time + label
  }
  return time + label + 's'
}

/**
 * @param {number} time
 */
export function timeAgo(time) {
  const between = Date.now() / 1000 - Number(time)
  if (between < 3600) {
    return pluralize(~~(between / 60), ' minute')
  } else if (between < 86400) {
    return pluralize(~~(between / 3600), ' hour')
  } else {
    return pluralize(~~(between / 86400), ' day')
  }
}

/**
 * Number formatting
 * like 10000 => 10k
 * @param {number} mynum
 * @param {number} digits
 */
export function numberFormatter(mynum, digits) {
  const num = Math.abs(mynum)
  const si = [
    { value: 1E18, symbol: 'E' },
    { value: 1E15, symbol: 'P' },
    { value: 1E12, symbol: 'T' },
    { value: 1E9, symbol: 'G' },
    { value: 1E6, symbol: 'M' },
    { value: 1E3, symbol: 'k' }
  ]
  for (let i = 0; i < si.length; i++) {
    if (num >= si[i].value) {
      return (num / si[i].value).toFixed(digits).replace(/\.0+$|(\.[0-9]*[1-9])0+$/, '$1') + si[i].symbol
    }
  }
  return num.toString()
}

/**
 * 10000 => "10,000"
 * @param {number} num
 */
export function toThousandFilter(num) {
  return (+num || 0).toString().replace(/^-?\d+/g, m => m.replace(/(?=(?!\b)(\d{3})+$)/g, ','))
}

/**
 * Upper case first char
 * @param {String} string
 */
export function uppercaseFirst(string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

/**
 * 文件大小格式化
 * @param {number} limit
 * @returns {string}
 */
export function filterSize(limit) {
  if (!limit) return ''
  var size = ''
  if (limit < 1024) { // 如果小于0.1KB转化成B
    size = limit.toFixed(1) + 'B'
  } else if (limit < 1024 * 1024) { // 如果小于0.1MB转化成KB
    size = (limit / 1024).toFixed(1) + 'KB'
  } else if (limit < 1024 * 1024 * 1024) { // 如果小于0.1GB转化成MB
    size = (limit / (1024 * 1024)).toFixed(1) + 'MB'
  } else { // 其他转化成GB
    size = (limit / (1024 * 1024 * 1024)).toFixed(1) + 'GB'
  }
  var sizestr = size + ''
  var len = sizestr.indexOf('\.')
  var dec = sizestr.substr(len + 1, 2)
  if (dec === '00') { // 当小数点后为00时 去掉小数部分
    return sizestr.substring(0, len) + sizestr.substr(len + 3, 2)
  }
  return sizestr
}

/**
 * 图片宽高格式化
 * @param {JSONString} value
 * @returns string
 */
export function filterDes(value) {
  if (!value) return ''
  return value
}

/**
 * 时间格式化(时分秒)
 */
export function filterTime(time) {
  if (!time) {
    return '00:00:00'
  }
  const result = parseInt(time)
  const h = Math.floor(result / 3600) < 10 ? '0' + Math.floor(result / 3600) : Math.floor(result / 3600)
  const m = Math.floor((result / 60 % 60)) < 10 ? '0' + Math.floor((result / 60 % 60)) : Math.floor((result / 60 % 60))
  const s = Math.floor((result % 60)) < 10 ? '0' + Math.floor((result % 60)) : Math.floor((result % 60))
  return h + ':' + m + ':' + s
}

// option根据value取label
export function getOptionsValue(value, arr) {
  // console.log(value, arr, 'value, arr')
  const obj = arr.find(v => v.value === value)
  if (obj) {
    return obj.label
  } else {
    return '——'
  }
}

/**
 * @param {String} key1 比较的key
 * @param {String} key2 返回的key
 * @param {String} value 比较的值
 * @param {Array} arr 数组对象
 * @returns {String}
 */
// option根据指定key取对象
export function getOptionsValueByKey(key1, key2, value, arr) {
  // console.log(value, arr, 'value, arr')
  const obj = arr.find(v => v[key1] === value)
  if (obj) {
    return obj[key2]
  } else {
    return '——'
  }
}

// 处理实付金额
export function filterPayerTotal(arr) {
  if (typeof arr === 'number') {
    // return arr / 100
    return Number(new BigNumber(arr).div(100).toString())
  } else {
    return ''
  }
}

// 金额处理：分转元 并添加，分割，以及取小数点后两位
export function filtersMoney(money) {
  return parseFloat(BigNumber(Math.abs(+money || 0)).div(100))
    .toFixed(2)
    .toString()
    .split('')
    .reverse()
    .join('')
    .replace(/(\d{3})/g, '$1,')
    .replace(/\,$/, '')
    .split('')
    .reverse()
    .join('')
}

export function filterDate(time, cFormat) {
  if (arguments.length === 0 || !time) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if ((typeof time === 'string')) {
      if ((/^[0-9]+$/.test(time))) {
        // support "1548221490638"
        time = parseInt(time)
      } else {
        // support safari
        // https://stackoverflow.com/questions/4310953/invalid-date-in-safari
        time = time.replace(new RegExp(/-/gm), '/')
      }
    }

    if ((typeof time === 'number') && (time.toString().length === 10)) {
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
    if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value] }
    return value.toString().padStart(2, '0')
  })
  return time_str
}

// 金额处理，整数去0
export function filtersMoneyByZero(money) {
  return filtersMoney(money).replace(/(\.00)$/, '')
}

// 金额处理，不带千分号
export function filtersMoneyByZeroNoSplit(money) {
  return parseFloat(BigNumber(Math.abs(+money || 0)).div(100)).toFixed(2)
    .toString()
    .replace(/(\.00)$/, '')
}

// 金额处理,大于10000显示w,小于10000展示千分位
export function filtersMoneyByW(money) {
  if (!money) {
    return '0'
  }
  if (money >= 10000) {
    return (money / 10000).toFixed(2) + 'w'
  } else {
    // 金额展示千分位
    return money.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')
  }
}

// 金额处理,大于10000显示w,小于10000展示千分位
export function filtersMoneyByWang(money, flag = false, unit = '万') {
  // flag为true表示需要分转元
  if (!money) {
    return '0'
  }
  if (flag) {
    money = filtersMoneyByZero(money)
  }
  if (money >= 10000) {
    return (money / 10000).toFixed(2) + unit
  } else {
    // 金额展示千分位
    return money.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')
  }
}

// 百分比处理(小数转百分制，取2位小数)
export function filtersRate(rate, unit = '%') {
  if (!rate) {
    return '0' + unit
  } else {
    return parseFloat(BigNumber(Math.abs(+rate || 0)).times(100)).toFixed(2)
      .toString()
      .replace(/(\.00)$/, '') + unit
  }
}

export function parseOrderType(type) {
  // 订单类型 1.新购 2.赠送 3.赠送 4.赠送 5.转课 6.预存
  switch (type) {
    case 1:
      return '新购'
    case 2:
      return '赠送'
    case 3:
      return '赠送'
    case 4:
      return '赠送'
    case 5:
      return '转课'
    case 6:
      return '预存'
    default:
      return ''
  }
}

export function parseStatus(status) {
  // 状态 1.待交付，2.交付中，3.延期交付，4锁定交付，5已交付，6已关闭
  switch (status) {
    case 1:
      return '待交付'
    case 2:
      return '交付中'
    case 3:
      return '延期交付'
    case 4:
      return '锁定交付'
    case 5:
      return '已交付'
    case 6:
      return '已关闭'
    default:
      return ''
  }
}

export function parseLiveModel(type) {
  // PERSON_LIVE 真人直播；AI_LIVE 智能直播；DIGITAL_PERSON_LIVE 数字人直播
  switch (status) {
    case 'PERSON_LIVE':
      return '真人直播'
    case 'AI_LIVE':
      return '智能直播'
    case 'DIGITAL_PERSON_LIVE':
      return '数字人直播'
    default:
      return ''
  }
}
export function parsePackageGoodsType(typeString) {
  // 0:图片,1:音频，2视频,3专栏，4大专栏，5线下课程，6直播专栏，7套餐课
  const type = Number(typeString)
  switch (type) {
    case 0:
      return '图片'
    case 1:
      return '音频'
    case 2:
      return '视频'
    case 3:
      return '专栏'
    case 4:
      return '大专栏'
    case 5:
      return '线下课程'
    case 6:
      return '直播专栏'
    case 7:
      return '套餐课'
    case 8:
      return '直播课'
    default:
      return ''
  }
}

export function parseShiftStatus(status) {
  // 1待审批/2审批中/3审批通过，4审批驳回
  switch (status) {
    case 1:
      return '待提交'
    case 2:
      return '待审批'
    case 3:
      return '审批中'
    case 4:
      return '审批通过'
    case 5:
      return '审批驳回'
    default:
      return ''
  }
}

export default {
  filtersMoney,
  filterDate,
  filtersMoneyByZero
}
