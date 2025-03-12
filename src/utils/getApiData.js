
import { getDimensionManagement, getTradeList, getDomainList, teacherQueryByName, getTeacherCooperateStatus } from '@/api/tearchCenter/index'
import { deptTree } from '@/api/addressBookApi'

/**
 * @return 获取行业list
 *
 */
export async function getTradeData() {
  const { data, code } = await getTradeList()
  if (code === 1) {
    return getTreeData(data, { label: 'catName', value: 'catId' })
  }
  return []
}
/**
 * @return 获取部门list
 *
 */
export async function getDeptData() {
  const { data, code } = await deptTree()
  if (code === 1) {
    return getTreeData(data, { label: 'label', value: 'id' })
  }
  return []
}
/**
 * @return 获取讲师list
 *
 */
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
/**
 * @return 获取领域list
 *
 */
export async function getDomainData() {
  const { data, code } = await getDomainList()
  if (code === 1) {
    return data.map((i) => {
      return {
        label: i.domainName,
        value: i.domainId
      }
    })
  }
  return []
}

/**
 * @return 合作状态
 *
 */
export async function getTeacherCooperateStatusData() {
  const { data, code } = await getTeacherCooperateStatus()
  if (code === 1) {
    return data.map((i) => {
      return {
        label: i.statusName,
        value: i.status
      }
    })
  }
  return []
}

function getTreeData(data, config = { label: 'label', value: 'value' }) {
  data.forEach((i) => {
    i.label = i[config.label]
    i.value = i[config.value]
    if (i.children && i.children.length) {
      getTreeData(i.children, config)
    } else {
      i.children = null
    }
  })
  return data
}

export const getDimensionOperateData = async() => {
  const { data } = await getDimensionManagement()
  return data ?? []
}
