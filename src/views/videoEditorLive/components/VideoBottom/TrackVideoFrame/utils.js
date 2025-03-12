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

export function generateSumArray(arr) {
  const sumArray = []
  let sum = 0

  for (let i = 0; i < arr.length; i++) {
    sum += arr[i]
    sumArray.push(sum)
  }

  return sumArray
}
