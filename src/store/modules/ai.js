
const ai = {
  namespaced: true,
  state: {
    isScene: undefined,
    isAICenter: false,
    aiShowType: 0,
    ifClose: false // 是否手动点击关闭Ai助手的图标显示
  },
  getters: {
    isScene(state) {
      return state.isScene
    },
    aiShowType(state) {
      return state.aiShowType
    },
    isAICenter(state) {
      return state.isAICenter
    },
    ifClose(state) {
      return state.ifClose
    }
  },
  mutations: {
    SET_SCENE: (state, data) => {
      state.isScene = data
    },
    SET_AISHOWTYPE: (state, data) => {
      state.aiShowType = data
    },
    SET_ATCENTER: (state, data) => {
      state.isAICenter = data
    },
    SET_IFCLOSE: (state, data) => {
      state.ifClose = data
    }
  },
  actions: {
    async setScene({
      commit
    }, data) {
      commit('SET_SCENE', data)
    },
    async setAiShowType({
      commit
    }, data) {
      commit('SET_AISHOWTYPE', data)
    },
    async setAICenter({
      commit
    }, data) {
      commit('SET_ATCENTER', data)
    }
  }

}
export default ai

