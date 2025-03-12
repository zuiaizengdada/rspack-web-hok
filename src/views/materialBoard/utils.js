export function isEmpty(obj) {
  if (typeof obj === 'undefined' || obj === null || obj === '') return true
  return false
}

export function preProcessData(data) {
  Object.keys(data).forEach(item => {
    if (isEmpty(data[item])) {
      delete data[item]
    }
  })
  return data
}
// 把时间的秒数转换成00:00:00格式 例 60s = 00:01:00
export function formatSeconds(value) {
  console.log(value, '进来的值')
  let theTime = parseInt(value) // 秒
  if (theTime < 60) {
    if (theTime < 10) {
      return `00:0${parseInt(theTime)}`
    }
    return `00:${parseInt(theTime)}`
  }
  let theTime1 = 0 // 分
  let theTime2 = 0 // 小时
  if (theTime > 60) {
    theTime1 = parseInt(theTime / 60)
    theTime = parseInt(theTime % 60)
    if (theTime1 > 60) {
      theTime2 = parseInt(theTime1 / 60)
      theTime1 = parseInt(theTime1 % 60)
    }
  }
  let result = `${parseInt(theTime) < 10 ? `0${parseInt(theTime)}` : parseInt(theTime)}`
  if (theTime1 > 0) {
    result = `${parseInt(theTime1) < 10 ? `0${parseInt(theTime1)}` : parseInt(theTime1)}:${result}`
  }
  if (theTime2 > 0) {
    result = `${parseInt(theTime2) < 10 ? `0${parseInt(theTime2)}` : parseInt(theTime2)}:${result}`
  }
  return result
}
