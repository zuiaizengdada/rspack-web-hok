import Vue from 'vue'

export function deepCopy(target) {
  if (typeof target == 'object') {
    const result = Array.isArray(target) ? [] : {}
    for (const key in target) {
      if (typeof target[key] == 'object') {
        result[key] = deepCopy(target[key])
      } else {
        result[key] = target[key]
      }
    }

    return result
  }

  return target
}

export function swap(arr, i, j) {
  const temp = arr[i]
  Vue.set(arr, i, arr[j])
  Vue.set(arr, j, temp)
}

export function $(selector) {
  return document.querySelector(selector)
}

const components = ['VText', 'RectShape', 'CircleShape']
export function isPreventDrop(component) {
  return !components.includes(component) && !component.startsWith('SVG')
}

export function getOptionsValue(value, arr) {
  const obj = arr.find(v => v.type === value)
  if (obj) {
    return obj.label
  } else {
    return ''
  }
}

//获取颜色
export function getRgbString(rgbString) {
  const match = rgbString.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/)
  if (match) {
    const red = parseInt(match[1])
    const green = parseInt(match[2])
    const blue = parseInt(match[3])
    return [red, green, blue]
  }
}

//获取map值
export function getMapKeyByValue(map, value) {
  for (let [key, val] of map.entries()) {
    if (val === value) {
      return key
    }
  }
  return null // 如果没有找到对应的值，返回null
}
