import {
  clueBasicSum,
  getLineChartData,
  getClueSource,
  clueDeptData
} from '@/api/business/clue'
import { filtersMoneyByZero } from '@/filters/index'

const state = {
  updateTime: '---', // 数据更新时间
  // 查询条件
  search: {
    time: {
      active: 0,
      time: ['', '']
    },
    current: 1, // 1-线索总数 2-已分配线索 3-已转化线索 4-转化总金额 5-转化率
    dept: { name: '', id: '' }, // 当前选择的部门数据
    launchPlatform: undefined // 当前选择的投放平台
  },
  // 线索数量
  clueBasicSum: {
    clueSum: '-', // 线索总数
    clueSumWave: '-', // 线索总数同比
    currentMonthClueSum: '-', // 本月线索总数
    lastMonthClueSum: '-', // 上月线索总数
    allocatedClueSum: '', // 已分配线索总数
    allocatedClueSumWave: '-', // 已分配线索总数同比
    transformedClueSum: '-', // 已转化线索总数
    transformedClueSumWave: '-', // 已转化线索总数同比
    transformedMoneySum: '-', // 转化总金额
    transformedMoneySumWave: '-', // 转化总金额同比
    transformedRate: '-', // 转化率
    transformedRateWave: '-' // 转化率同比
  }
}
const mutations = {
  SET_clueBasicSum: (state, data) => {
    state.clueBasicSum = data
  },
  SET_search: (state, { key, data }) => {
    state.search[key] = data
  },
  SET_launchPlatform: (state, { key, data }) => {
    state.search[key] = data
  },
  SET_updateTime: (state, data) => {
    state.updateTime = data
  }
}
const actions = {
  // 线索数量查询
  getclueBasicSum({ commit }) {
    const params = {
      beginTime: state.search.time.time[0],
      endTime: state.search.time.time[1],
      deptId: state.search.dept.id,
      timeType: { 0: 1, 7: 2, year: 4, month: 3, '': '' }[
        state.search.time.active
      ],
      adPlatform: state.search.launchPlatform
    }
    return clueBasicSum(params).then(res => {
      const obj = {
        clueSum: res.data.clueSum || 0, // 线索总数
        clueSumWave: Number(res.data.clueSumWave) || 0, // 线索总数同比
        currentMonthClueSum: res.data.currentMonthClueSum || 0, // 本月线索总数
        lastMonthClueSum: res.data.lastMonthClueSum || 0, // 上月线索总数
        allocatedClueSum: res.data.allocatedClueSum || 0, // 已分配线索总数
        allocatedClueSumWave: Number(res.data.allocatedClueSumWave) || 0, // 已分配线索总数同比
        transformedClueSum: res.data.transformedClueSum || 0, // 已转化线索总数
        transformedClueSumWave: Number(res.data.transformedClueSumWave) || 0, // 已转化线索总数同比
        transformedMoneySum:
          filtersMoneyByZero(res.data.transformedMoneySum) || 0, // 转化总金额
        transformedMoneySumWave: Number(res.data.transformedMoneySumWave) || 0, // 转化总金额同比
        transformedRate:
          (Number(res.data.transformedRate || 0) * 100).toFixed(2) + '%', // 转化率
        transformedRateWave: Number(res.data.transformedRateWave) || 0 // 转化率同比
      }
      // res.data.transformedRate = (Number(res.data.transformedRate) * 100).toFixed(2) + '%'
      commit('SET_clueBasicSum', obj)
      commit('SET_updateTime', res.data.updateTime)
    })
  },
  // 获取折线图
  getLineChart({ commit }) {
    const params = {
      beginTime: state.search.time.time[0],
      endTime: state.search.time.time[1],
      type: state.search.current,
      deptId: state.search.dept.id,
      adPlatform: state.search.launchPlatform
    }
    return getLineChartData(params)
  },
  // 数据来源 漏斗模型
  getClueSource({ commit }) {
    const params = {
      beginTime: state.search.time.time[0],
      endTime: state.search.time.time[1],
      deptId: state.search.dept.id,
      adPlatform: state.search.launchPlatform
    }
    return getClueSource(params)
  },
  // 部门数据
  getDeptData({ commit }, sort) {
    const params = {
      beginTime: state.search.time.time[0],
      endTime: state.search.time.time[1],
      ...sort
    }
    return clueDeptData(params)
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
