import moment from 'moment'
// 获取时间搓
export function getFormatMS(val) {
  return moment.utc(val, moment.HTML5_FMT.TIME_MS).valueOf()
}

// 格式化时间
export function getFormatSSS(val) {
  return moment.utc(val).format('HH:mm:ss:SSS')
}

// 格式化时间
export function getFormatHMS(val) {
  return moment.utc(val).format('HH:mm:ss')
}

// 获取时间s 数
export function getDurationSS(val) {
  return moment.duration(val) / 1000
}

// 获取时间s 数
export function getDurationMS(val) {
  if (val > 3600000) {
    return moment.utc(val).format('HH:mm:ss')
  } else {
    return moment.utc(val).format('mm:ss')
  }
}

export function volidFormatTime(val) {
  let isValid = true
  if (val.includes(':')) {
    const list = val.split(':')
    list.forEach((item) => {
      isValid = !isNaN(Number(item))
    })
  } else {
    isValid = !isNaN(Number(val))
  }
  return isValid
}
export function formatPrTime(val) {
  const isValid = volidFormatTime(val)
  if (isValid) {
    const list = val.split(':').reverse()
    for (let i = 0; i < list.length; i++) {
      if (!list[i]) {
        list[i] = '00'
      }
    }
    const mss = Number(list[0]) / 1000
    const ss = list.length > 1 ? Number(list[1]) : 0
    const ms = list.length > 2 ? Number(list[2]) * 60 : 0
    const hs = list.length > 3 ? Number(list[3]) * 3600 : 0
    const total = mss + ss + ms + hs
    return total
  }
}

export function getTrackSpeedList(isWidth = true) {
  const speeds = []
  const pxs = []
  const width = isWidth ? 160 : 90
  // 前14级，每级+5 14级后，乘以2的倍数，得到每秒的速度和每秒的像素
  for (let i = 0; i < 20; i++) {
    const m = 5 * (i + 1)
    // if (i >= 14) {
    //   const x = Math.abs(14 - i) // 取绝对值
    //   m = Math.pow(2, x) * 100 // 取2的倍数
    // }
    pxs.push(m)
    speeds.push(width / m)
  }
  return {
    speeds,
    pxs
  }
}

export const markColors = [
  { label: '#718637', value: 'GREEN' },
  { label: '#D22C36', value: 'RED' },
  { label: '#AF8BB1', value: 'PURPLE' },
  { label: '#E96F24', value: 'ORANGE' },
  { label: '#D0A12B', value: 'YELLOW' },
  { label: '#FFFFFF', value: 'WHITE' },
  { label: '#428DFC', value: 'BLUE' },
  { label: '#19F4D6', value: 'CYAN' }
]

export function getColor(color) {
  let markColor
  markColors.forEach(item => {
    if (color === item.value) {
      markColor = item.label
    }
  })
  return markColor
}

export function getColorValue(color) {
  let markColor
  markColors.forEach(item => {
    if (color === item.label) {
      markColor = item.value
    }
  })
  return markColor
}

