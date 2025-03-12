import { getHomepageDetail, getLikeData } from '@/api/business/homeSetting/index.js'
const state = {
  navViewList: [], // 金刚区数据
  bannerList: [], // 轮播图数据
  likeList: [], // 猜你喜欢数据
  recommendActive: '', // 爆款推荐活动id
  groupId: {
    like: '', // 猜你喜欢的groupId
    likeId: '', // 猜你喜欢的Id
    recommend: '', // 爆款推荐的groupId
    recommendId: '' // 爆款推荐的id
  },
  refresh: false, // 触发更新
  refreshActive: '' // 根据参数来更新对应的模块: 1: 更新爆款推荐的分组列表 2：更新爆款推荐的列表
}

const mutations = {
  SET_navViewList: (state, data) => {
    state.navViewList = data
  },
  SET_groupId: (state, { data, key }) => {
    state.groupId[key] = data
  },
  SET_bannerList: (state, data) => {
    state.bannerList = data
  },
  SET_likeList: (state, data) => {
    state.likeList = data
  },
  SET_recommendActive: (state, data) => {
    state.recommendActive = data
  },
  SET_refreshActive: (state, data) => {
    state.refreshActive = data
    state.refresh = !state.refresh
    console.log('1111')
  },
  switch_refresh: (state) => {
    state.refresh = !state.refresh
  }
}

const actions = {
  // 获取金刚区或者轮播图的列表数据
  get_navViewList({ commit }, data) {
    return getHomepageDetail(data).then(res => {
      if (data === 2) {
        commit('SET_navViewList', res.data)
        return res.data
      } else {
        commit('SET_bannerList', res.data)
        return res.data
      }
    })
  },
  // 获取猜你喜欢数据
  getLikeList({ commit }) {
    const params = {
      groupingId: state.groupId.like,
      current: 1,
      size: 7
    }
    getLikeData(params).then(res => {
      console.log(res, '获取列表详情数据')
      // this.tableData = res.data.records
      commit('SET_likeList', res.data.records)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
