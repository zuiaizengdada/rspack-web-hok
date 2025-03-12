const state = {
    historyAddLiveForm: {}
  }

  const getters = {
    historyAddLiveForm(state) {
      return state.historyAddLiveForm
    }
  }
  
  const mutations = {
    SET_HISTORY_ADD_LIVE_FORM: (state, data) => {
      state.historyAddLiveForm = data
    }
  }

  
  const actions = {
    setHistoryAddLiveForm({commit}, params){
        commit('SET_HISTORY_ADD_LIVE_FORM',params)
    }
  }
  
  export default {
    namespaced: true,
    longTime: true,
    state,
    getters,
    mutations,
    actions
  }
  