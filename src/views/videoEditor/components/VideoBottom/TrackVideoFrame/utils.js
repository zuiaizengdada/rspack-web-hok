export function insertSort(array) {
  const len = array.length
  let current
  let prev
  for (let i = 1; i < len; i++) {
    current = array[i]
    prev = i - 1
    while (prev >= 0 && array[prev] > current) {
      array[prev + 1] = array[prev]
      prev--
    }
    array[prev + 1] = current
  }
  return array
}

export function uniqueArray (array) {
  const arr = Array.from(new Set(array))
  arr.shift()
  arr.pop()
  return arr
}

export function findNearesNumber(array, target, isUp) {
  return array.reduce((pre, curr) => {
    return Math.abs(pre - target) > Math.abs(curr - target) ? curr : pre
  })
}

export function calculateDisplaySize(videoWidth, videoHeight) {
  /**
   * 取值规则：
   * 1.如果视频是16:9或者9：16，那么宽高取值为160*90跟90*160
   * 2.如果视频是4:3或者3:4，那么宽高取值为120*90跟90*120
   * 3.如果宽度>高度，且宽高比>16:9,width=160,height=width/16*9
   * 4.如果宽度>高度，且宽高比>4:3,height=90,width=height/90*160
   * 5.如果高度>宽度，且宽高比>9:16,height=160,width=height/16*9
   * 6.如果高度>宽度，且宽高比>3:4,width=90,height=width/90*120
   * 7.如果宽度等于高度（即宽高比为1:1），你可以选择一个固定的宽高，90*90
   * 8.如果宽度小于高度，且宽高比小于9:16，你可以设置 height=160，然后计算 width=height*宽高比
   * 9.如果宽度大于高度，且宽高比小于4:3，你可以设置 width=120，然后计算 height=width/宽高比
   */
  let displayWidth, displayHeight
  const aspectRatio = videoWidth / videoHeight
  if (videoWidth === videoHeight) {
    displayWidth = displayHeight = 90
  } else if (videoWidth > videoHeight) {
    if (aspectRatio > 16 / 9) {
      displayWidth = 160
      displayHeight = Math.floor(displayWidth / aspectRatio)
    } else if (aspectRatio > 4 / 3) {
      displayHeight = 90
      displayWidth = Math.floor(displayHeight * aspectRatio)
    } else if (aspectRatio >= 4 / 3) {
      displayWidth = 120
      displayHeight = 90
    } else if (aspectRatio < 4 / 3) {
      displayHeight = 90
      displayWidth = Math.floor(videoWidth * 90 / videoHeight)
    }
  } else {
    if (aspectRatio < 9 / 16) {
      displayHeight = 160
      displayWidth = Math.floor(displayHeight * aspectRatio)
    } else if (aspectRatio < 3 / 4) {
      displayWidth = 90
      displayHeight = Math.floor(displayWidth / aspectRatio)
    } else if (aspectRatio <= 3 / 4) {
      displayWidth = 90
      displayHeight = 120
    } else if (aspectRatio > 3 / 4) {
      displayWidth = 90
      displayHeight = Math.floor(displayWidth / aspectRatio)
    }
  }
  // 如果是单数，那么加1
  if (displayWidth % 2 !== 0) displayWidth += 1
  if (displayHeight % 2 !== 0) displayHeight += 1
  return { width: displayWidth, height: displayHeight }
}
