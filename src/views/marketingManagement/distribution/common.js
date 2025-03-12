/*eslint-disable*/
// 将日期转换成一年中的第几周
export function getYearWeek(date) {
  // 按照国际标准
  let time
  let week
  const checkDate = new Date(date)
  checkDate.setDate(checkDate.getDate() + 4 - (checkDate.getDay() || 7))
  time = checkDate.getTime()
  checkDate.setMonth(0)
  checkDate.setDate(1)
  week = Math.floor(Math.round((time - checkDate) / 86400000) / 7) + 1
  return week
}

// 返回格式 2019年第23周，特别注意跨年一周的问题
export function getYearAndWeek(date, anotherDate) {
  const week = getYearWeek(date)
  let year = date.substring(0, 4)
  const anotherYear = anotherDate.substring(0, 4)
  // 处理跨年特殊日期
  if (anotherDate > date) {
    const betweenDay = getBetweenDay(new Date(date), new Date(anotherDate))
    if (betweenDay == 7 && anotherYear != year) {
      if (week == 1) {
        year = parseInt(year) + 1
      }
    }
  } else {
    const betweenDay = getBetweenDay(new Date(anotherDate), new Date(date))
    if (betweenDay == 7 && anotherYear != year) {
      if (week != 1) {
        year = parseInt(year) - 1
      }
    }
  }
  return `${year}年第${week}周`
}
export function getBetweenDay(beginDate, endDate) {
  let dateSpan = endDate - beginDate
  dateSpan = Math.abs(dateSpan)
  const days = Math.floor(dateSpan / (24 * 3600 * 1000))
  return days + 1
}
