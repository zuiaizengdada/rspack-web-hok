import { getMaterialList } from '@/api/course'
import { dictType } from '@/api/option'
import { getRoleOptions } from '@/api/role'
import { getDomainList, getTradeList } from '@/api/tearchCenter/index'
import { getConfigChannelsource } from '@/api/deliver/baseSeeting'
import { t } from '@/utils/index'
import { getAdPlatformSimpleList } from '@/api/deliver/advertising'
import { getDept, getGoodsPrices } from '@/api/business'
import { jobNoPageList } from '@/views/system/positionManagement/api/job'
import { getChannelSource, getNewChannelSource, getThridShopData } from '@/api/option'
import { getItem } from '@/utils/localStorage'

const state = {
  appTypeOption: [
    { label: '线上模式', value: '0', image: '' },
    { label: '线下模式', value: '1', image: '' }
  ],

  // 素材管理的分组模块
  // 图片分组
  imageClass: [],
  // 音频分组
  audioClass: [],
  // 视频分组
  videoClass: [],
  // 文档分组
  fileClass: [],

  // 用户来源/用户终端
  userTerminal_options: [
    { label: '安卓', value: 'ANDROID' },
    { label: 'IOS', value: 'IOS' },
    { label: 'H5', value: 'H5' },
    { label: '微信小程序', value: 'APPLET' },
    { label: '抖音小程序', value: 'DOUAPPLET' }
  ],
  // 订单状态
  orderStatus_options: [
    { label: '未支付', value: 1 },
    { label: '支付成功', value: 2 },
    { label: '超时已关闭', value: 3 },
    { label: '用户已取消', value: 4 },
    { label: '退款中', value: 5 },
    { label: '部分退款', value: 6 },
    { label: '全部退款', value: 7 },
    { label: '交易结束', value: 8 },
    { label: '没有向第三方发起支付请求', value: 9 },
    { label: '退款金额异常', value: 10 }
  ],
  // 订单类型
  orderType_options: [
    { label: '全部', value: '' },
    { label: '未分类', value: 0 },
    { label: '线上', value: 1 },
    { label: '线上交付', value: 2 },
    { label: '线下', value: 3 },
    { label: '刷单', value: 4 }
  ],
  // 商品类型
  goodsType_options: [
    { label: '图片', value: 0 },
    { label: '音频', value: 1 },
    { label: '视频', value: 2 },
    { label: '专栏', value: 3 },
    { label: '大专栏', value: 4 },
    { label: '线下课', value: 5 }
  ],
  // 支付方式
  paymentType_options: [
    { label: '微信支付', value: 1 },
    { label: '支付宝支付', value: 2 },
    { label: '赠送', value: 3 },
    { label: '抖店支付', value: 4 },
    { label: '快手支付', value: 5 },
    { label: '获客币支付', value: 6 },
    { label: '小鹅通支付', value: 7 }
  ],
  goodsType_obj: {
    0: '图片',
    1: '音频',
    2: '视频',
    3: '普通专栏',
    4: '大专栏',
    5: '线下课',
    6: '直播专栏',
    7: '套餐课',
    8: '直播课'
  },

  // 页面类型
  groupingType: [],

  // 角色信息下拉框
  role_options: [],
  // 岗位
  job_options: [],
  // 用户管理--标签管理--标签类型
  labelType: [
    { label: '手动标签', value: 0 },
    { label: '其他标签', value: 1 }
  ],

  // 2023.8.30修改渠道来源，新渠道来源数据（整合为tree结构的数据）
  newChannelSourceArray: [

  ],
  // 渠道来源
  channelSourceType: [
    { label: '抖店', value: 1 },
    { label: '快手', value: 2 },
    { label: '获课', value: 3 },
    { label: '微店', value: 4 },
    { label: '老用户', value: 5 },
    { label: '销售录入', value: 6 },
    { label: '小鹅通', value: 7 },
    { label: '博商', value: 8 },
    { label: '获客线下', value: 9 },
    { label: '视频号小店', value: 10 },
    { label: '枫页小店', value: 11 },
    { label: '抖音小程序', value: 12 },
    { label: '直播间', value: 13 },
    { label: '平台自营', value: 14 },
    { label: '微信小程序', value: 15 },
    { label: '百度小店', value: 20 }
  ],

  // 三方店铺数据看板
  thirdShopDataType: [
    { label: '抖音', value: 1 },
    { label: '快手', value: 2 },
    { label: '小鹅通', value: 4 },
    { label: '视频号小店', value: 10 },
    { label: '枫页小店', value: 11 },
    { label: '抖音小程序', value: 12 },
    { label: '直播间', value: 13 },
    { label: '微信小程序', value: 15 },
    { label: '平台自营', value: 14 },
    { label: '小红书', value: 16 },
    { label: '线下录单', value: 17 },
    { label: '百度小店', value: 20 }
  ],

  // 三方店铺
  thirdShopType: [
    { label: '抖店', value: 1 },
    { label: '快手小店', value: 2 },
    { label: '小鹅通', value: 7 },
    { label: '微信小店', value: 10 },
    { label: '枫页小店', value: 11 },
    { label: '抖音小程序', value: 12 },
    { label: '微信小程序', value: 15 },
    { label: '直播间', value: 13 },
    { label: '平台自营', value: 14 },
    { label: '小红书', value: 16 },
    { label: '百度小店', value: 20 }
  ],

  // 直播模式
  liveMode: [
    { label: '横屏模式', value: 1 },
    { label: '竖屏模式', value: 2 },
    { label: '语音直播', value: 3 },
    { label: '录播直播', value: 4 }
  ],

  // 直播状态
  liveStatusOption: [
    { label: '未开始', value: 0, des: '' },
    { label: '直播中', value: 1, des: '' },
    { label: '已结束', value: 2, des: '' }
  ],
  // 直播上架状态
  liveTypeOption: [
    { label: '已上架', value: 0, des: '' },
    { label: '已下架', value: 1, des: '' },
    { label: '待上架', value: 2, des: '' }
  ],
  // 所属行业
  industryOption: [],
  // 所属领域
  areaOption: [],
  // 渠道来源
  channelsource: [],
  // 商品价格
  goodsPrices_options: [],
  // 部门
  deptList: [],
  // 投放平台
  adPlatformSimpleList: []
}

const mutations = {
  SET_APPTYPEOPTION: (state, data) => {
    state.appTypeOption = data
  },
  SET_AUDIOCLASS: (state, data) => {
    state.audioClass = data
  },
  SET_VIDEOCLASS: (state, data) => {
    state.videoClass = data
  },
  SET_IMAGECLASS: (state, data) => {
    state.imageClass = data
  },
  SET_FILECLASS: (state, data) => {
    state.fileClass = data
  },
  SET_GROUPINGTYPE: (state, data) => {
    state.groupingType = data
  },
  SET_ROLEOPTIONS: (state, data) => {
    state.role_options = data
  },
  SET_JOBOPTIONS: (state, data) => {
    state.job_options = data
  },
  SET_AREAOPTION: (state, data) => {
    state.areaOption = data
  },
  SET_INDUSTRYOPTION: (state, data) => {
    state.industryOption = data
  },
  SET_channelsource: (state, data) => {
    state.channelsource = data
  },
  SET_deptList: (state, data) => {
    state.deptList = data
  },
  SET_goodsPricesList: (state, data) => {
    state.goodsPrices_options = data
  },
  SET_adPlatformSimpleList: (state, data) => {
    state.adPlatformSimpleList = data
  },
  SET_channelsourceType: (state, data) => {
    state.channelSourceType = data
  },
  SET_newChannelSourceArray: (state, data) => {
    state.newChannelSourceArray = data
  },
  SET_thridShopType: (state, data) => {
    state.thridShopType = data
  }
}

const actions = {
  // 获取分组数据
  getClass({ commit }) {
    return getMaterialList().then((res) => {
      if (res.data) {
        // console.log(t(res.data), '处理后的数据')
        const imageClass = [{ id: '-1', dirName: '全部图片', children: [], parentId: '0', dirId: '-1' }]
        const videoClass = [{ id: '-1', dirName: '全部视频', children: [], parentId: '0', dirId: '-1' }]
        const audioClass = [{ id: '-1', dirName: '全部音频', children: [], parentId: '0', dirId: '-1' }]
        const fileClass = [{ id: '-1', dirName: '全部文档', children: [], parentId: '0', dirId: '-1' }]
        res.data.map((v) => {
          v.id = v.dirId
          v.parentId = v.path ? v.path.split(',').pop() : '-1'
          switch (v.dirType) {
            case 1:
              videoClass.push(v)
              break
            case 2:
              audioClass.push(v)
              break
            case 3:
              imageClass.push(v)
              break
            case 4:
              fileClass.push(v)
              break
          }
          return
        })
        commit('SET_IMAGECLASS', t(imageClass))
        commit('SET_AUDIOCLASS', t(audioClass))
        commit('SET_VIDEOCLASS', t(videoClass))
        commit('SET_FILECLASS', t(fileClass))
        return state
      } else {
        return false
      }
    })
  },
  // 获取页面类型
  getGroupingType({ commit }) {
    return dictType('sys_grouping_type').then((res) => {
      commit('SET_GROUPINGTYPE', res.data)
    })
  },
  // 获取角色信息下拉框
  getRoleOptions({ commit }) {
    return getRoleOptions().then((res) => {
      commit('SET_ROLEOPTIONS', res.data)
    })
  },
  // 获取岗位信息下拉框
  getJobOptions({ commit }) {
    return jobNoPageList().then((res) => {
      commit('SET_JOBOPTIONS', res.data)
    })
  },
  // 获取领域信息
  getAreaOption({ commit }) {
    return getDomainList().then((res) => {
      commit('SET_AREAOPTION', res.data)
    })
  },
  // 获取行业信息
  getIndustryOption({ commit }) {
    return getTradeList().then((res) => {
      res.data.forEach((e) => {
        delChildren(e)
      })
      commit('SET_INDUSTRYOPTION', res.data)
    })
  },
  // 获取渠道来源
  getConfigChannelsource({ commit }) {
    return getConfigChannelsource().then(res => {
      if (res && res.data && res.data.length > 0) {
        const arr = res.data.reduce((pre, next) => {
          pre.push({ label: next.channelSourceName, value: next.channelSource })
          return pre
        }, [])
        commit('SET_channelsource', arr)
      }
    })
  },
  // 获取部门
  getDeptList({ commit }, e) {
    return getDept({ deptId: e.deptId }).then(res => {
      if (res && res.data && res.data.length > 0) {
        const arr = res.data.reduce((pre, next) => {
          pre.push({ label: next.label, id: next.id, children: next.children })
          return pre
        }, [])
        commit('SET_deptList', arr)
      }
    })
  },
  // 获取商品价格
  goodsPrices({ commit }) {
    return getGoodsPrices({}).then(res => {
      if (res && res.data && res.data.length > 0) {
        const arr = res.data.reduce((pre, next) => {
          pre.push({ label: next, value: next })
          return pre
        }, [])
        commit('SET_goodsPricesList', arr)
      }
    })
  },
  // 获取投放平台
  getAdPlatformSimpleList({ commit }) {
    return getAdPlatformSimpleList().then(res => {
      console.log(res, '获取投放平台')
      if (res && res.data && res.data.length > 0) {
        const arr = res.data.reduce((pre, next) => {
          pre.push({ label: next.name, value: next.id })
          return pre
        }, [])
        commit('SET_adPlatformSimpleList', arr)
      }
    })
  },
  // 获取订单渠道来源
  getChannelsourceType({ commit }) {
    return getChannelSource().then(res => {
      if (res && res.data && res.data.length > 0) {
        const arr = res.data.reduce((pre, next) => {
          pre.push({ label: next.channelSourceName, value: next.channelSource })
          return pre
        }, [])
        commit('SET_channelsourceType', arr)
      }
    }).catch(() => {
      commit('SET_channelsourceType', [])
    })
  },
  getNewChannelSourceArray({ commit }) {
    const orgInfo = getItem('orgInfo')
    const params = {
      isUse: true,
      tenantId: orgInfo.organizationId
    }
    return getNewChannelSource(params).then(res => {
      if (res && res.data && res.data.length > 0) {
        const arr = res.data.reduce((pre, next) => {
          if (next.shopList.length > 0) {
            next.shopList.some(item => {
              item.label = item.shopName
              item.value = item.shopId
            })
          }
          pre.push({ label: next.channelSourceName, value: next.channelSource, children: next.shopList })
          return pre
        }, [])
        commit('SET_newChannelSourceArray', arr)
      }
    }).catch(() => {
      commit('SET_newChannelSourceArray', [])
    })
  },
  getThridShopType({ commit }) {
    return getThridShopData().then(res => {
      if (res && res.data && res.data.length > 0) {
        const arr = res.data.reduce((pre, next) => {
          if (next.shopList.length > 0) {
            next.shopList.some(item => {
              item.label = item.message
              item.value = item.code
              item.src = item.imageUrl
            })
          }
          pre.push({ label: next.channelSourceName, value: next.channelSource, children: next.shopList })
          return pre
        }, [])
        commit('SET_thridShopType', arr)
      }
    }).catch(() => {
      commit('SET_thridShopType', [])
    })
  }
}

function delChildren(e) {
  if (e.children && !e.children.length) {
    delete e.children
  } else {
    e.children.forEach((v) => {
      delChildren(v)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
