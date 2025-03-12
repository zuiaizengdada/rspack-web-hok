import { teacherQueryByName } from '@/api/tearchCenter/index'
import { userNoPage } from '@/api/addressBookApi'

let tearchList = []
let tearchArray = []

export async function getTeacherData() {
  const { data, code } = await teacherQueryByName({ name: '' })
  if (code === 1) {
    return data.map((i) => {
      return {
        label: i.teacherName,
        value: i.teacherId,
        cooperateStatus: i.cooperateStatus
      }
    })
  }
  return []
}

export async function getUserNoPage() {
  const { data, code } = await userNoPage({ name: '' })
  if (code === 1) {
    return data.map((i) => {
      return {
        label: i.nickName,
        value: i.userId
      }
    })
  }
  return []
}

// 1拿讲师列表  2拿用户列表
export async function loadUserData(storageName, type) {
  let res = []
  if (type === 1) {
    res = await getTeacherData()
  } else {
    res = await getUserNoPage()
  }
  tearchList = res
  const obj = {
    label: '全部',
    options: res
  }
  tearchArray = [obj]
  const teacherData = await checkTeacher(storageName, tearchList)
  return teacherData
}

// 检测是否有常用
function checkTeacher(storageName, tearchList) {
  const accountCommonUse = localStorage.getItem(storageName)
  if (accountCommonUse) {
    const arr = JSON.parse(accountCommonUse)
    // 判断里面的数据是否在tearchList里面
    const arr1 = arr.filter(item => tearchList.find(i => i.value === item.value))
    tearchArray.unshift({
      label: '最近常用',
      options: arr1 || []
    })
    localStorage.setItem(storageName, JSON.stringify(arr1))
  } else {
    tearchArray.unshift({
      label: '最近常用',
      options: []
    })
  }
  return { tearchArray, tearchList }
}

// 改变选中的时候
export async function changeTeacher(mytearchList, mytearchArray, storageName, teacherId) {
  console.log(mytearchArray, 'mytearchArray')
  // 传入的mytearchArray返回出去的应该从mytearchList中匹配到teacherId这条数据添加进去
  const selectData = mytearchList.find(i => i.value === teacherId)
  const newArr = Object.assign([], mytearchArray)
  // 判断是否有最近常用
  if (newArr.length > 1) {
    const changyongArr = newArr[0].options
    const index = changyongArr.findIndex(i => i.value === teacherId)
    // 常用最多只能五个
    if (index !== -1) {
      changyongArr.splice(index, 1)
    }
    if (changyongArr.length > 4) {
      changyongArr.pop()
    }
    changyongArr.unshift(selectData)
    newArr[0].options = changyongArr
    // 把新的常用数据存入本地
    localStorage.setItem(storageName, JSON.stringify(changyongArr))
  }
  return newArr
}
// 优化讲师列表 只展示前300条  搜索再出来所有
export async function tearchFilter(query = '', tearchArray, teacherId) {
  const copyTearchArray = JSON.parse(JSON.stringify(tearchArray))
  let arr = copyTearchArray.filter((item) => {
    return item.label.includes(query) || item.value.includes(query)
  })
  // 如果传了teacherId 则把这条数据加到第一条
  if (teacherId) {
    console.log(teacherId, copyTearchArray, '讲师id')
    const isArr = copyTearchArray.filter((item) => { return item.value === teacherId })
    console.log(isArr)
    if (isArr.length > 0) {
      arr = arr.filter((item) => { return item.value !== teacherId })
      arr.unshift(isArr[0])
    }
  }
  if (arr.length > 300) {
    return arr.slice(0, 300)
  }
  return arr
}

export function filteredGroups(groups) {
  return groups.filter(group => group.options.length > 0 && !group.isHidden)
}
