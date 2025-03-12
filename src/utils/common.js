// 遍历路由数据 获取所有的三级路由
export function getThirdLevelItemsWithPaths(arr) {
  const thirdLevelItems = []
  function buildPath(item, parentPath, firstPath, level) {
    level += 1
    // 隐藏的子集不触发
    if (level === 4 && !item.hidden) {
      // 如果有/ 那么就是根目录，不用拼接path
      let joinPath = `${parentPath}/${item.path}`
      if (item.path.indexOf('/') > -1) joinPath = item.path
      // 有重定向的就 跳转重定向
      if (item.meta.redirect) joinPath = item.meta.redirect
      const newItem = {
        ...item,
        joinPath,
        firstPath: firstPath
      }
      thirdLevelItems.push(newItem)
    } else {
      if (item.children && item.children.length > 0 && !item.hidden) {
        // 如果当前项有子项，递归遍历子项
        item.children.forEach(child => {
          buildPath(child, `${level > 2 ? (parentPath + (item.path.indexOf('/') > -1 ? '' : '/') + item.path) : ''}`, firstPath, level)
        })
      }
    }
  }
  // 从顶层开始遍历
  arr.forEach(item => {
    if (!item.hidden) buildPath(item, '', item.path, 1)
  })
  return thirdLevelItems
}

// 首页-快捷菜单 遍历路由数据 获取所有的三级路由
export function getThirdLevelItemsWithPathsObj(arr) {
  const thirdLevelItems = {}
  function buildPath(item, parentPath, firstObj, level, twoObj) {
    level += 1
    // 隐藏的子集不触发
    if (level === 4 && !item.hidden) {
      // 如果有/ 那么就是根目录，不用拼接path
      let joinPath = `${parentPath}/${item.path}`
      if (item.path.indexOf('/') > -1) joinPath = item.path
      // 有重定向的就 跳转重定向
      if (item.meta.redirect) joinPath = item.meta.redirect
      const newItem = {
        ...item,
        joinPath,
        firstId: firstObj.id,
        firstOrderNum: firstObj.orderNum,
        firstName: twoObj.meta.title,
        orderNum: twoObj.orderNum
      }
      thirdLevelItems[item.id] = newItem
    } else {
      if (item.children && item.children.length > 0 && !item.hidden) {
        // 如果当前项有子项，递归遍历子项
        item.children.forEach(child => {
          buildPath(child, `${level > 2 ? (parentPath + (item.path.indexOf('/') > -1 ? '' : '/') + item.path) : ''}`, firstObj, level, level === 3 ? item : twoObj)
        })
      }
    }
  }
  // 从顶层开始遍历
  arr.forEach(item => {
    if (!item.hidden) buildPath(item, '', item, 1, {})
  })
  return thirdLevelItems
}
// 获取月份 的第一天和左后一天 yyyy-mm-dd

export function getFirstAndLastDayOfMonth(dateString) {
  function formatDate(date) {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const date = new Date(dateString)
  const year = date.getFullYear()
  const month = date.getMonth()
  const firstDay = new Date(year, month, 1)
  const firstDayFormatted = formatDate(firstDay)
  const nextMonth = month === 11 ? 0 : month + 1 // 处理到达年底时的情况
  const yearOfNextMonth = nextMonth === 0 ? year + 1 : year // 处理到达年底时的情况
  const lastDay = new Date(yearOfNextMonth, nextMonth, 1)
  lastDay.setDate(lastDay.getDate() - 1)
  const lastDayFormatted = formatDate(lastDay)

  return {
    firstDay: firstDayFormatted,
    lastDay: lastDayFormatted
  }
}
