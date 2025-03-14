import { querySyncInfoById } from '@/api/videoManagement/dataApi'
import { saveErrorInfo, syncCheck, getMediaImitateConfig, qryCookieByPlatformAccountId, updateLoginStatus, saveUserVersion } from '@/api/videoManagement/accountManage'
import { isNewClient, isUseNewClient } from '@/utils'
import { Message } from 'element-ui'
import Vue from 'vue'
import router from '@/router'
import store from '..'

const videoManage = {
  namespaced: true,
  state: {
    merchantToken: '',
    videoDetail: {},
    fuxiVersion: '',
    mediaImitateConfig: {},
    syncDataConfig: {},
    allChannelSwitch: {
      19: 0,
      24: 0,
      32: 0,
      31: 0,
      15: 0
    },
    envList: {
      'development': process.env.VUE_APP_BASE_API_NEW,
      'staging': process.env.VUE_APP_BASE_API_NEW,
      'test': process.env.VUE_APP_BASE_API_NEW,
      'beta': process.env.VUE_APP_BASE_API_NEW,
      'production': process.env.VUE_APP_BASE_API_NEW
    }
  },
  getters: {

  },
  mutations: {
    // 同步账号数据
    // SYNC_ACCOUNT_DATA: (state, data) => {
    //   console.log('同步账号数据', data, state.merchantToken)
    // },
    // 获取数据同步需要的token
    GET_ACCOUNT_DATA: (state, data) => {
      state.merchantToken = data
    },
    SET_VIDEO_DETAIL: (state, data) => {
      state.videoDetail = data
    },
    SET_YIXIAOERVERSION: (state, data) => {
      state.fuxiVersion = data
    },
    SET_MEDIAIMITATECONFIG: (state, data) => {
      state.mediaImitateConfig = data
    },
    SET_SYNCDATACONFIG: (state, data) => {
      state.syncDataConfig = data
    },
    SET_YIXIAOERVERSION_DATA: (state, data) => {
      const obj = {}
      obj[19] = data?.dyIsOpen !== 1 ? 0 : data.dyIsOpen
      obj[24] = data?.ksIsOpen !== 1 ? 0 : data.dyIsOpen
      obj[32] = data?.sphIsOpen !== 1 ? 0 : data.dyIsOpen
      obj[31] = data?.xhsIsOpen !== 1 ? 0 : data.dyIsOpen
      obj[15] = data?.bzIsOpen !== 1 ? 0 : data.dyIsOpen
      state.allChannelSwitch = obj
    }
  },
  actions: {
    // 同步账号数据
    async syncAccountData({ commit, state }, data) {
      const res = await querySyncInfoById({ platformAccountId: data })
      if (res.data.length === 0) return
      const newSyncAccountInfo = []
      const obj = {
        accountId: `${res.data[0].platformAccountId}`,
        time: new Date().getTime(),
        platformId: res.data[0].platformId,
        cookie: res.data[0].cookie,
        syncAction: [
          'SyncAccountReportListData',
          'SyncAccountData',
          'SyncAccountNotificationList',
          'SyncAccountContentList'
        ],
        token: state.merchantToken,
        newVersion: state.allChannelSwitch[res.data[0].platformId],
        callbackUrl: state.envList[process.env.NODE_ENV] + '/cloud/edata-wemedia/callBack/syncData',
        startTime: res.data[0].startDate,
        endTime: res.data[0].endDate
      }
      if (isNewClient(res.data[0].platformId)) {
        newSyncAccountInfo.push(obj)
        store.dispatch('settings/insertApiStat', {
          apiUrl: 'platforms-data-sync',
          remark: '平台数据同步',
          platformAccountId: res.data[0].platformAccountId,
          type: 2
        })
      }
      // else {
      //   syncAccountInfo.push(obj)
      //   store.dispatch('settings/insertApiStat', {
      //     apiUrl: 'platforms-data-sync',
      //     remark: '平台数据同步',
      //     platformAccountId: res.data[0].platformAccountId
      //   })
      // }
      // if (syncAccountInfo.length) {
      //   window.videoPublishSocket.emit(
      //     'platforms-data-sync',
      //     JSON.stringify(syncAccountInfo),
      //     response => {
      //       console.log(response, '数据回传参数返回值')
      //     }
      //   )
      // }
      if (newSyncAccountInfo.length) {
        window.videoPublishNewSocket.emit(
          'platforms-data-sync',
          JSON.stringify(newSyncAccountInfo),
          response => {
            console.log(response, '数据回传参数返回值')
          }
        )
      }
    },
    // 获取伏羲云版本
    async getClientVersion() {
      console.log('客户端版本01')
      const res = await store.dispatch('user/getInfo')
      console.log(res, '客户端版本01res')

      // 拿同级模块user里面的userInfo
      window.videoPublishNewSocket.emit(
        'get-version',
        async response => {
          const version = response || '1.0.0'
          const userId = res?.userId || ''
          await saveUserVersion({ version, userId })
        }
      )
    },

    // 获取数据同步需要的token
    getAccountData({ commit }, data) {
      commit('GET_ACCOUNT_DATA', data.merchantToken)
    },
    // 获取当前版本号
    async getMediaImitateConfig({ commit }, data) {
      const res = await getMediaImitateConfig({ type: 1 })
      const res1 = await getMediaImitateConfig({ type: 2 })
      // console.log(res, '获取模拟调用接配置')
      // console.log(res1, '数据同步模拟配置')
      commit('SET_MEDIAIMITATECONFIG', res.data)
      commit('SET_SYNCDATACONFIG', res1.data)
    },
    // 自媒体错误日志上报
    async saveErrorInfo({ commit }, data) {
      const res = await saveErrorInfo(data)
      console.log(res, '自媒体错误日志上报')
    },
    // 数据同步检测
    async syncCheck({ commit }, data) {
      const res = await syncCheck()
      console.log(res, '数据同步检测')
      // 不通过
      if (res.data.isPass === 2) {
        Vue.prototype.$DetectionVideo({
          visible: true,
          btnText: data.btnText,
          nums: res.data.noSyncCount,
          success: (res) => {
            router.push({
              path: '/videoManagement/accountManage'
            })
          },
          continue: () => {
            let str = ''
            if (data.type === 1) {
              str = `&projectVideoId=${data.projectVideoId}`
            }
            router.push({
              path: `/videoEditor?projectId=${data.projectId}&type=${data.type}${str}`
            })
          }
        })
        return false
      } else {
        // 通过
        return true
      }
    },
    // 每次登录之前检测cookie是否真的失效了
    async checkCookie({ commit }, data) {
      // 查询最新的cookie 并且把row.cookie替换成最新的
      const res = await qryCookieByPlatformAccountId({ platformAccountId: data.platformAccountId })
      const newCookie = res.data
      const checkData = [{
        platformId: data.platformId,
        platformAccountId: data.platformAccountId,
        cookie: newCookie
      }]

      return new Promise((resolve, reject) => {
        isUseNewClient(data.platformId, 'check-account-login-status', data.platformAccountId, '检测登录自媒体账号')
          .emit('check-account-login-status', JSON.stringify(checkData), response => {
            try {
              const checkAccountLoginStatusRes = JSON.parse(response)
              const res = checkAccountLoginStatusRes[0]
              updateLoginStatus({
                cookie: res.Code === 200 ? res.cookie : '[]',
                loginStatus: res.Code === 200 ? 2 : 1,
                platformAccountId: data.platformAccountId,
                remark: data.remark || '登录自媒体账号',
                type: 1
              })
              // 当前的cookie是有效的 则把最新的cookie返回出去 反之则返回false 告诉用户重新登录
              if (res.Code === 200) {
                Message({ message: '当前账号已经登录，无需再次登录~', type: 'success', duration: 3 * 1000 })
                resolve(newCookie)
              } else {
                resolve(false)
              }
            } catch (error) {
              reject(error)
            }
          })
      })
    }
  }

}
export default videoManage

