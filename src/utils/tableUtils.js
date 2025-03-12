// 筛选输出具有相同 label 的数组对象
const filterSameLabelObjects = (arr1, arr2) => {
  const sortedList1 = arr2.map(item => {
    const items = arr1.find(obj => obj.label === item.label)
    return items ? { ...items, visible: item.visible } : undefined
  })
  return sortedList1.filter(item => item) || []
}

export const setColumns = (columns = [], list) => {
  if (!list) return columns
  if (columns.length && list && list.length) {
    // 从 list 中筛选出与 columns 中的 label 匹配的元素
    const matchedItems = filterSameLabelObjects(columns, list) || []
    // 从 list 中筛选出未匹配的元素
    const unmatchedItems =
      columns?.filter(
        item => !list.some(mapItem => mapItem.label === item.label)
      ) || []
    const endList = matchedItems[matchedItems.length - 1]
    if (endList.prop === 'action' || endList.label === '操作') {
      matchedItems.pop()
      const finalList = matchedItems.concat(unmatchedItems)
      finalList.push(endList)
      return finalList || columns
    }
    // 重新合并成一个新数组
    const finalList = matchedItems.concat(unmatchedItems)
    return finalList || columns
  }
}
