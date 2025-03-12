// 直播脚本配置
import { getScriptInteractInfo } from '@/api/liveRoom/script'

const state = {
  // 直播跳转链接参数设置
  linkQuery: {
    videoId: '',
    videoName: '',
    scriptName: ''
  },
  // 互动详情信息
  interactDetail: [],
  // 时间轴数据
  timeList: [],
  // 是否搜索
  ifSearch: false,
  searchKey: '', // 搜索关键词
  // 全选数据
  multipleSelection: [],
  // 当前播放时间
  currentTime: 0,
  // 全屏状态
  fullscreen: false, // false:非全屏 true:全屏
  // 时间点高亮
  // timeCurrentIndex: 0,
  // 互动高亮
  configurationIndex: '',
  // 记录点击的是时间轴还是互动详情 0 :时间轴 1：互动详情
  timeListTime: null,
  pageIndex: 1,
  pageSize: 2000,
  ifLoading: false,
  ifNoMore: false // 是否加载完全 true:没有更多了 fasle：可以继续加载
}
const mutations = {
  set_interactDetail: (state, data) => {
    state.interactDetail = data
  },
  updata_interactDetail: (state, data) => {
    const index = state.interactDetail.findIndex(v => v.scriptInteractId === data.scriptInteractId)
    if (index > -1) {
      const oldObjSendTime = state.interactDetail[index].sendTime
      state.interactDetail[index] = data
      const arr = state.interactDetail.filter(v => v.sendTime === oldObjSendTime)
      if (arr.length === 0) {
        const i = state.timeList.findIndex(v => v === oldObjSendTime)
        state.timeList.splice(i, 1)
      }
    } else {
      data.id = data.scriptInteractId
      state.interactDetail.push(data)
    }
    state.interactDetail.sort((a, b) => {
      return a.sendTime - b.sendTime
    })
    if (!state.timeList.includes(data.sendTime)) {
      // 新的时间
      state.timeList.push(data.sendTime)
      state.timeList.sort((a, b) => {
        return a - b
      })
    }
  },
  del_interactDetail: (state, scriptInteractId) => {
    const index = state.interactDetail.findIndex(v => v.scriptInteractId === scriptInteractId)
    index > -1 && state.interactDetail.splice(index, 1)
  },
  set_ifNoMore: (state, data) => {
    state.ifNoMore = data
  },
  set_ifLoading: (state, data) => {
    state.ifLoading = data
  },
  set_timeList: (state, data) => {
    state.timeList = data
  },
  set_pageIndex: (state, data) => {
    state.pageIndex = data
  },
  set_ifSearch: (state, data) => {
    state.ifSearch = data
  },
  set_multipleSelection: (state, data) => {
    state.multipleSelection = data
  },
  add_multipleSelection: (state, data) => {
    state.multipleSelection.push(data)
  },
  del_multipleSelection: (state, data) => {
    const index = state.multipleSelection.findIndex(v => v === data)
    index > -1 && state.multipleSelection.splice(index, 1)
  },
  set_currentTime: (state, data) => {
    state.currentTime = data
  },
  set_configurationIndex: (state, data) => {
    state.configurationIndex = data
  },
  set_searchKey: (state, data) => {
    state.searchKey = data
  },
  set_fullscreen: (state, data) => {
    state.fullscreen = data
  },
  set_timeListTime: (state, data) => {
    state.timeListTime = data
  },
  set_linkQuery: (state, { key, value }) => {
    state.linkQuery[key] = value
  }
}
const actions = {
  // 获取互动详情数据
  getDetailList({ commit }, scriptId) {
    return new Promise((resolve, reject) => {
      const data = {
        scriptId: scriptId,
        pageIndex: state.pageIndex,
        pageSize: state.pageSize
      }
      commit('set_ifLoading', true)
      getScriptInteractInfo(data).then(res => {
        console.log(res.data, '互动详情')
        const timeList = state.timeList
        res.data.items.map((v, i) => {
          v.id = v.scriptInteractId
          !timeList.includes(v.sendTime) && timeList.push(v.sendTime)
          return
        }, [])
        // const arr = state. res.data.items
        const arr = state.interactDetail.concat(res.data.items)
        commit('set_timeList', timeList)
        commit('set_interactDetail', arr)
        let pageIndex = state.pageIndex
        pageIndex++
        commit('set_pageIndex', pageIndex)
        if (pageIndex <= res.data.totalPages) {
          actions.getDetailList({ commit }, scriptId)
        } else {
          commit('set_ifLoading', false)
          commit('set_ifNoMore', true)
          resolve()
        }
      }).catch(() => {
        commit('set_ifLoading', false)
        commit('set_ifNoMore', true)
        reject()
      })
    })
  },
  init({ commit }) {
    commit('set_ifNoMore', false)
    commit('set_ifSearch', false)
    commit('set_searchKey', '')
    commit('set_multipleSelection', [])
    commit('set_currentTime', 0)
    commit('set_configurationIndex', '')
    commit('set_fullscreen', false)
    commit('set_pageIndex', 1)
    commit('set_interactDetail', [])
    commit('set_timeList', [])
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
