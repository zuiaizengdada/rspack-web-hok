
import institutionConfig from '@/utils/institutionConfig'
const dict = {
  longTime: true, // 是否存储浏览器
  namespaced: true,
  state: {
    orgInfo: institutionConfig[0]
  },
  getters: {
    orgInfo(state) {
      return state.orgInfo
    }
  },
  mutations: {
    SET_ORGINFO: (state, data) => {
      state.orgInfo = data
    }
  },
  actions: {
    setOrgInfo({ commit }, data) {
      // 匹配机构合并机构数据
      const obj = institutionConfig?.find(item => item.tenantId === data.organizationId)
      const newData = { ...obj, ...data }
      commit('SET_ORGINFO', newData)
    }
  }

}
export default dict

