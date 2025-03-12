import {
  login2,
  loginByPassword2,
  getUserInfo,
  qryNonSyncAccountNum,
  yixiaoerStat,
  qryPublishSuccessInfo,
  qryMerchantByPhoneNew
} from '@/api/login'
import { getToken, setToken, removeToken, setUserInfo } from '@/utils/auth'
import { getThirdLevelItemsWithPaths } from '@/utils/common'
import {
  qryLoginMerchant,
  updatePublishSuccessInfo
} from '@/views/videoPublish/publish/api'
import router, { resetRouter } from '@/router'
// import { updatePublishTaskRecord } from '@/views/videoPublish/publish/api/index'
import { getDeptId, checkSign } from '@/api/business'
import { viewingFlag, trainingVideoViewingRecord } from '@/api/trainingVideo'
import Vue from 'vue'
import { getProtocolTemplate } from '@/api/system/protocolManage'
import { getEnableLecturer } from '@/api/liveRoom/index'
import store from '..'
const state = {
  token: getToken(),
  name: '',
  avatar: '',
  introduction: '',
  roles: [],
  userInfo: {
    roles: [],
    phoneNumber: '',
    sex: 0,
    userId: '',
    userName: '',
    token: '',
    avatar: ''
  },
  envList: {
    development: 'https://dev.cloud.hokkj.cn',
    staging: 'https://dev.cloud.hokkj.cn',
    test: 'https://test.cloud.hokkj.cn',
    beta: 'https://beta.cloud.hokkj.cn',
    production: 'https://cloud.hokkj.cn'
  },
  accountList: [],
  accountNum: 0,
  userDeptId: '',
  ifAdmin: false, // 是否超级管理员
  loadMenus: false, // 第一次加载菜单时用到
  hasCloudDesktop: false, // 是否有云桌面按钮权限,
  isNewSocketVideoPublish: false, // 新的一键发布客户端是否安装链接,
  visibleDialogVideoPublish: false, // 是否显示一键发布全局弹窗
  isUploadVideoSuccess: false,
  orgModules: {
    // 登录机构开通了哪些模块
    enableLecturer: false // 登录机构是否启用了讲师模块：true开通了，false未开通
  },
  protocolInfo: {}, // 协议信息
  signStatus: true, // 是否签订协议
  history: [
    {
      path: '/home',
      joinPath: '/home',
      meta: {
        title: '首页'
      },
      query: {},
      title: '首页', // 这里需要固定跳转name
      name: 'Home'
    }
  ], // main 历史面包屑数据，默认放入首页数据 固定
  curHistory: '',
  historyWhiteList: [],
  // 暂时处理特殊跳转的路由
  userMenuId: '' // 自定义首页id
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_ifAdmin: (state, data) => {
    state.ifAdmin = data
  },
  SET_SIGNSTATUS: (state, signStatus) => {
    state.signStatus = signStatus
  },
  SET_ACCOUNTNUM: (state, accountNum) => {
    state.accountNum = accountNum
  },
  SET_PROTOCOLINFO: (state, protocolInfo) => {
    state.protocolInfo = protocolInfo
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    console.log(avatar, '55555')
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_USERINFO: (state, userInfo) => {
    state.userInfo = userInfo
  },
  SET_USERDEPTID: (state, userDeptId) => {
    state.userDeptId = userDeptId
  },
  SET_LOAD_MENUS: (state, loadMenus) => {
    state.loadMenus = loadMenus
  },
  SET_HasCloudDesktop: (state, data) => {
    state.hasCloudDesktop = data
  },
  SET_UPDATENEWSOCKETVIDEOPUBLISH: (state, bool) => {
    state.isNewSocketVideoPublish = bool
  },
  SET_UPDATEVISIBLEDIALOGVIDEOPUBLISH: (state, bool) => {
    state.visibleDialogVideoPublish = bool
  },
  SET_UPDATEVIDEOUPLOADSUCCESS: (state, bool) => {
    state.isUploadVideoSuccess = bool
  },
  SET_ACCOUNTLIST: (state, data) => {
    state.accountList = data
  },
  SET_ORGMOULES: (state, { key, data }) => {
    state.orgModules[key] = data
  },
  SET_USERMENUID: (state, userMenuId) => {
    state.userMenuId = userMenuId
  },
  SET_CURHISTORY: (state, curRouter) => {
    state.curHistory = curRouter
  },
  // data =>
  // {
  //   path: to.path, // 路由地址
  //   query: to.query, //路由携带的参数
  //   title: to.meta.title //页面模块名称
  // }
  SET_HISTORY: (state, { type = 'add', data }) => {
    const len = state.history.length
    let index = -1
    let curRouter = null
    switch (type) {
      case 'add':
        // 这里获取三级路由的所有的路由 只有在左侧栏的数据才能新增
        curRouter = state.historyWhiteList.find(f => f.joinPath === data.path)
        if (!curRouter) return
        if (len >= 20) state.history.splice(1, 1)
        //  超过20个销毁第二个元素（第一个是首页不做删除） / 有记录的直接覆盖老的
        index = state.history.findIndex(f => f.path === data.path)
        if (index !== -1) {
          state.history.splice(index, 1, {
            ...data,
            title: curRouter.meta.title
          })
        } else {
          // 添加匹配的title,因为只现实侧边栏的title
          data.title = curRouter.meta.title
          state.history.push({ ...data, title: curRouter.meta.title })
        }
        // 确认选中history
        state.curHistory = curRouter
        break
      case 'splice':
        if (data.spliceType === 'all') {
          state.history.splice(1, len)
          router.replace({ path: '/home' })
        } else if (data.spliceType === 'other' || data.spliceType === 'right') {
          if (data.pathIndex === -1) return
          const path = state.history[data.pathIndex].path
          state.history.splice(data.pathIndex + 1, len)
          if (data.spliceType === 'other' && data.pathIndex > 1) {
            state.history.splice(1, data.pathIndex - 1)
          }
          router.replace({ path })
        }
        break
      case 'reset':
        state.history = [
          {
            path: '/home',
            joinPath: '/home',
            query: {},
            title: '首页', // 这里需要固定跳转name
            name: 'Home'
          }
        ]
        break
      case 'remove':
        state.history.splice(
          state.history.findIndex(f => f.path === data),
          1
        )
        break

      default:
        break
    }
  },
  // 处理三级菜单单独跳到另外一个三级菜单的下子页面处理
  SET_SINGLEHISTORY: (state, path) => {
    const curRouter = state.historyWhiteList.find(f => f.joinPath === path)
    if (!curRouter) return
    let index = -1
    const len = state.history.length
    if (len >= 20) state.history.splice(1, 1)
    index = state.history.findIndex(f => f.path === path)

    if (index !== -1) {
      state.history.splice(index, 1, {
        activeMenu: '',
        path: path,
        joinPath: path,
        title: curRouter.meta.title,
        query: curRouter.query
      })
    } else {
      state.history.push({
        activeMenu: '',
        path: path,
        joinPath: path,
        title: curRouter.meta.title,
        query: curRouter.query
      })
    }
    state.curHistory = curRouter
  },
  SET_HISTORYWHITELIST: (state, list) => {
    state.historyWhiteList = [
      {
        path: '/home',
        joinPath: '/home',
        meta: {
          title: '首页'
        },
        query: {},
        title: '首页', // 这里需要固定跳转name
        name: 'Home'
      },
      ...list
    ]
  }
}
const actions = {
  // 设置history白名单数据 arr getRouters数据
  setHistoryWhiteList({ commit }, arr) {
    const list = getThirdLevelItemsWithPaths(arr)
    commit('SET_HISTORYWHITELIST', list) // 重置历史面包屑数据
  },
  setCurHistory({ commit }, router) {
    commit('SET_HISTORYWHITELIST', router) // 重置历史面包屑数据
  },
  async getOrganizationList({ commit }, data) {
    const { userInfo, active } = data
    const { username, password, phone, verifyCode, email } = userInfo
    if (active) {
      return login2({ phone: phone, code: verifyCode, email })
    } else {
      return loginByPassword2({ phone: username.trim(), password: password })
    }
  },
  // 获取新的配置的账号
  async getMediaAccountNew({ commit }, data) {
    const userPhone = localStorage.getItem('userPhone')
    if (userPhone) {
      const { data } = await qryMerchantByPhoneNew({ phone: userPhone })
      console.log(data, '手机号获取token新')
      if (data.length === 0) {
        return
      }
      data.forEach(async element => {
        const { orgId, platformAccountId, userId } = element
        element.callbackUrl =
          state.envList[process.env.NODE_ENV] +
          '/cloud/edata-wemedia/open/callbackUpdateCookie'
        await yixiaoerStat({
          apiUrl: 'keep-online-sync',
          remark: '保持在线状态（新版客户端）',
          isNew: 2,
          orgId,
          platformAccountId,
          userId
        })
        window.videoPublishNewSocket.emit(
          'keep-online-sync',
          JSON.stringify(element),
          response => {}
        )
      })
    }
  },
  // user login
  async login({ commit }, data) {
    try {
      commit('SET_TOKEN', data?.token)
      localStorage.setItem('userPhone', data?.phoneNumber)
      commit('SET_USERINFO', data)
      commit('SET_HISTORY', { type: 'reset' }) // 重置历史面包屑数据
      setToken(data.token)
      setUserInfo(data)
    } catch (e) {
      console.log(e)
    }
  },
  // 获取用户机构id
  async getDeptId({ commit }) {
    try {
      const { data } = await getDeptId({})
      console.log(data, '机构id')
      commit('SET_USERDEPTID', data)
      localStorage.setItem('userDeptId', data)
    } catch (e) {
      console.log(e)
    }
  },
  // 获取用户是否超管
  async getUserAdmin({ commit }) {
    try {
      const { data } = await getUserInfo(state.userInfo.phoneNumber)
      console.log(data, '用户信息')
      commit('SET_ifAdmin', data.userType === '01')
    } catch (e) {
      console.log(e)
    }
  },
  // 获取用户是否签订协议
  async checkSign({ commit }, type) {
    try {
      const res = await getProtocolTemplate({ type: type })
      const { data } = await checkSign({
        protocolTemplateId: res.data.protocolTemplateId
      })
      commit('SET_PROTOCOLINFO', res.data)
      commit('SET_SIGNSTATUS', data)
    } catch (e) {
      console.log(e)
    }
  },
  // 查询未同步数据
  async qrySyncAccountNum({ commit }, data) {
    try {
      const { data } = await qryNonSyncAccountNum()
      commit('SET_ACCOUNTNUM', data)
    } catch (e) {
      console.log(e)
    }
  },
  // 检测是否所有账号都已经返回了数据了

  // 查询发布成功数据
  async qryPublishSuccessInfo({ commit }, data) {
    console.log('触发查询发布成功数据')
    const checkAllData = async (data, data1) => {
      console.log(
        data.length,
        data1.length,
        '检测是否所有账号都已经返回了数据了'
      )
      // 所有数据都返回了之后
      if (data.length === data1.length) {
        const res = await updatePublishSuccessInfo(data1)
        console.log(res, '11111111')
      }
    }
    try {
      const socket = window.videoPublishNewSocket
      if (socket) {
        const res = await qryLoginMerchant()
        const { data } = await qryPublishSuccessInfo()
        const susList = []
        if (data.length) {
          store.dispatch('settings/insertApiStat', {
            apiUrl: 'get-publish-status',
            remark: '获取文章发布至平台后的状态',
            accountNum: data.length,
            type: 2
          })
        }
        data.forEach(item => {
          // taskId
          const params = {
            token: res.data.merchantToken,
            publishId: item.publishId,
            title: item.title,
            platformId: item.platformId,
            newVersion:
              store.state.videoManage.allChannelSwitch[item.platformId],
            cookie: item.cookie,
            accountId: item.accountId,
            mediaTypeEnum: 'MiniVideo'
          }
          socket.emit(
            'get-publish-status',
            JSON.stringify(params),
            response => {
              const responseObj = JSON.parse(response)
              console.log(responseObj, '账号同步结果。。。')
              if (responseObj.messageType === '0') {
                const obj = {
                  status: responseObj.dataBody.status,
                  platDocId: responseObj.dataBody.docId,
                  taskRecordId: item.taskRecordId,
                  taskId: item.taskId
                }
                susList.push(obj)
                checkAllData(data, susList)
              } else {
                const obj = {
                  taskRecordId: item.taskRecordId,
                  status:
                    responseObj.errorInfo ||
                    responseObj.message.includes('作品')
                      ? 6
                      : 99,
                  taskId: item.taskId,
                  platDocId: ''
                }
                susList.push(obj)
                checkAllData(data, susList)
              }
            }
          )
        })
      }
    } catch (e) {
      console.log(e)
    }
  },
  async setSyncAccountNum({ commit }, data) {
    commit('SET_ACCOUNTNUM', data)
  },
  // 关闭弹窗
  async closeSign({ commit }) {
    commit('SET_SIGNSTATUS', true)
  },
  // get user info
  getInfo({ commit, state }) {
    return state.userInfo
    // return new Promise((resolve, reject) => {
    //   getInfo(state.token).then(response => {
    //     const { data } = response
    //     if (!data) {
    //       reject('Verification failed, please Login again.')
    //     }

    //     const { roles, name, avatar, introduction } = data

    //     // roles must be a non-empty array
    //     if (!roles || roles.length <= 0) {
    //       reject('getInfo: roles must be a non-null array!')
    //     }

    //     commit('SET_ROLES', roles)
    //     commit('SET_NAME', name)
    //     commit('SET_AVATAR', avatar)
    //     commit('SET_INTRODUCTION', introduction)
    //     resolve(data)
    //   }).catch(error => {
    //     reject(error)
    //   })
    // })
  },

  // user logout
  logout({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resetRouter()
      dispatch('tagsView/delAllViews', null, { root: true })
      resolve()
      // logout(state.token).then(() => {

      //   // reset visited views and cached views
      //   // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485

      // }).catch(error => {
      //   reject(error)
      // })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      localStorage.removeItem('system_router')
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resolve()
    })
  },

  updateLoadMenus({ commit }) {
    return new Promise((resolve, reject) => {
      commit('SET_LOAD_MENUS', false)
    })
  },

  // dynamically modify permissions
  async changeRoles({ commit, dispatch }, role) {
    const token = role + '-token'

    commit('SET_TOKEN', token)
    setToken(token)

    const { roles } = await dispatch('getInfo')

    resetRouter()

    // generate accessible routes map based on roles
    const accessRoutes = await dispatch('permission/generateRoutes', roles, {
      root: true
    })
    // dynamically add accessible routes
    router.addRoutes(accessRoutes)

    // reset visited views and cached views
    dispatch('tagsView/delAllViews', null, { root: true })
  },

  viewingFlag({ commit }, key) {
    return new Promise((resolve, reject) => {
      viewingFlag({ bindEventId: key })
        .then(res => {
          resolve(!!res.data)
          if (res.code === 1) {
            if (res.data) {
              const config =
                res.data.mandatoryFlag === 1
                  ? {
                      playbackRate: false,
                      pip: false,
                      ignores: ['sdkUnmutePlugin', 'DanmuPlugin', 'progress'],
                      progress: false,
                      keyShortcut: false
                    }
                  : {}
              if (res.data.mandatoryFlag === 0) {
                trainingVideoViewingRecord({
                  bindEventId: key,
                  trainingVideoId: res.data.trainingVideoId
                })
              }
              Vue.prototype.$Videoplayer({
                src: res.data.videoUrl,
                videoName: res.data.videoName,
                showClose: res.data.mandatoryFlag === 0,
                config: config,
                endedCallback: () => {
                  if (res.data.mandatoryFlag === 1) {
                    trainingVideoViewingRecord({
                      bindEventId: key,
                      trainingVideoId: res.data.trainingVideoId
                    })
                  }
                }
              })
            }
          }
        })
        .catch(err => {
          reject(err)
        })
    })
  },

  // 获取机构是否开通师资
  getEnableLecturer({ commit }) {
    return getEnableLecturer().then(res => {
      commit('SET_ORGMOULES', { key: 'enableLecturer', data: res.data })
    })
  },

  setHistory({ commit }, obj) {
    console.log(obj, '路由更新数据111111。。。')
    commit('SET_HISTORY', obj)
  },
  setSingleHistory({ commit }, path) {
    commit('SET_SINGLEHISTORY', path)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
