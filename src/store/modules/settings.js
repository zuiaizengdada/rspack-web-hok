import variables from '@/styles/element-variables.scss'
import defaultSettings from '@/settings'
import { saveAccounts, insertApiStat, insertFuxiyunApiStat } from '@/api/videoManagement/videoPublish'

const { showSettings, tagsView, fixedHeader, sidebarLogo } = defaultSettings

const state = {
  theme: variables.theme,
  showSettings: showSettings,
  tagsView: tagsView,
  fixedHeader: fixedHeader,
  sidebarLogo: sidebarLogo
}

const mutations = {
  CHANGE_SETTING: (state, { key, value }) => {
    // eslint-disable-next-line no-prototype-builtins
    if (state.hasOwnProperty(key)) {
      state[key] = value
    }
  }
}

const actions = {
  changeSetting({ commit }, data) {
    commit('CHANGE_SETTING', data)
  },
  // 保存记忆项
  saveAccounts({ commit }, data) {
    // accountId	账号id platformId	平台id
    return saveAccounts(data).then((res) => {
      console.log('记录成功')
    })
  },
  // 保存记忆项
  insertApiStat({ commit }, data) {
    // accountId	账号id platformId	平台id type1 yixiaoer  type2  fuxiyun
    if (data.type !== 2) {
      delete data.type
      return insertApiStat(data).then((res) => {
        console.log('记录成功')
      })
    } else {
      delete data.type
      return insertFuxiyunApiStat(data).then((res) => {
        console.log('自己客户端记录成功')
      })
    }
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

