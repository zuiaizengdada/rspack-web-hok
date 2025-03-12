// 直播配置
import { getLiveRoomOrgConfig } from '@/api/liveRoom/index.js'

const state = {
  attendClassTime: '', // 到课时间定义，单位分钟
  finishClassTime: '' // 完课时间定义，单位分钟
}
const mutations = {
  set_state: (state, { key, data }) => {
    state[key] = data
  }
}
const actions = {
  // 获取直播设置数据
  getLiveRoomOrgConfig({ commit }) {
    return getLiveRoomOrgConfig().then(res => {
      commit('set_state', { key: 'attendClassTime', data: res.data.attendClassTime || 0 })
      commit('set_state', { key: 'finishClassTime', data: res.data.finishClassTime || 0})
      return res
    })
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
