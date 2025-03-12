const search = {
  longTime: true, // 是否存储浏览器
  namespaced: true,
  state: {
    pageSearchData: {} // 页面列表查询默认值存储
  },
  mutations: {
    SET_PAGE_SEARCH: (state, data) => {
      state.pageSearchData = { ...state.pageSearchData, ...data }
    }
  },
  actions: {
    setPageSearch({ commit }, data) {
      commit('SET_PAGE_SEARCH', data)
    }
  }

}
export default search

