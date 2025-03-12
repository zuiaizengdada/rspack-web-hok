/**
 * 转化 orderSource
 * @param {*} orderSource
 * @returns
 */
export function orderSourceFilter(orderSource) {
  return orderSource === '-1' ||
    (!orderSource && orderSource !== 0) ||
    orderSource === 999
    ? undefined
    : orderSource
}
