const table = {
  longTime: true, // 是否存储浏览器
  namespaced: true,
  state: {
    tableColumnsMap: {}, // 页面列表查询默认值存储
    initPage: {}
  },
  getters: {
    tableColumnsMap(state) {
      return state.tableColumnsMap
    },
    initPage(state) {
      return state.initPage
    }
  },
  mutations: {
    SET_TABLE_COLUMNS: (state, data) => {
      state.tableColumnsMap = { ...state.tableColumnsMap, ...data }
    },
    SET_INIT_PAGE: (state, data) => {
      state.initPage = { ...state.initPage, ...data }
    }
  },
  actions: {
    setTableColumns({ commit }, data) {
      commit('SET_TABLE_COLUMNS', data)
    },
    setInitPage({ commit }, data) {
      commit('SET_INIT_PAGE', data)
    }
  }

}
export default table

