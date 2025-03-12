const state = {
  form: {
    name: '', // 直播间名称
    tenantName: '', // 讲师
    managerName: '', // 创建人
    startTime: '', // 开始时间
    endTime: '', // 结束时间
    poster: '', // 直播间封面海报
    assistant: [
      // { name: '测试测试' }
    ],
    canComment: true
  }
}

const mutations = {
  SET_Form: (state, data) => {
    state.form = data
  }
}

const actions = {
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
