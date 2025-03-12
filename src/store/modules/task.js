const task = {
  namespaced: true,
  state: {
    visibleTaks: false,
    contentUploadTask: []
  },
  getters: {

  },
  mutations: {
    SET_VISIBL: (state, visible) => {
      state.visibleTaks = visible
    },
    SET_CONTENTUPLOAD: (state, contentUploadTask) => {
      state.contentUploadTask = []
      state.contentUploadTask = contentUploadTask
    }
  },
  actions: {

  }

}
export default task
