import { getSmsAreaCodes, getMailSuffixes } from '@/api/global'
const global = {
  longTime: true, // 是否存储浏览器
  namespaced: true,
  state: {
    smsAreaList: [], // 国际区号
    mailSuffixesList: [] // 邮箱后缀集合
  },
  mutations: {
    SET_SMSAREALIST: (state, data) => {
      state.smsAreaList = data
    },
    SET_MAILSUFFIXESLIST: (state, data) => {
      state.mailSuffixesList = data
    }
  },
  actions: {
    async getSmsAreaCodes({ commit }) {
      const { code, data } = await getSmsAreaCodes()
      if (code === 1 && data) {
        commit('SET_SMSAREALIST', data)
      }
    },
    async getMailSuffixesList({ commit }) {
      const { code, data } = await getMailSuffixes({ suffixes: '' })
      if (code === 1 && data) {
        console.log(data)
        commit('SET_MAILSUFFIXESLIST', data)
      }
    }
  }
}
export default global
