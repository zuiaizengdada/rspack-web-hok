// 选择商品
import Vue from 'vue'
import appSelectGoods from './index.vue'
const AppSelectGoods = Vue.extend(appSelectGoods)

let instance

export default {
  play(options = {}) {
    if (!instance) {
      instance = new AppSelectGoods({
        el: document.createElement('div')
      })
    }
    if (instance.visible) return
    instance.src = typeof options === 'string' ? options : options.src || ''
    document.body.appendChild(instance.$el)

    Vue.nextTick(() => {
      instance.visible = true
      instance.play(options)
    })
  },

  close() {
    if (instance) {
      instance.visible = false
    }
  },

  install(vue) {
    const ins = new AppSelectGoods()
    ins.$mount(document.createElement('div'))
    document.body.appendChild(ins.$el)
    vue.prototype.$SelectGoods = obj => {
      ins.src = obj.src
      ins.visible = true
      ins.check = JSON.parse(JSON.stringify(obj.check || []))
      ins.initSearch = obj.initSearch
      ins.isSearchPrice = obj.isSearchPrice || false
      ins.searchKeys = obj.searchKeys
      ins.disabledFn = obj.disabledFn || (() => false)
      ins.success = obj.success
      ins.shelveHideFlag = obj.shelveHideFlag
      ins.isPlaform = obj.isPlaform
      ins.tabList = obj.tabList || [
        { id: '0', name: '图文', api: '' },
        { id: '1', name: '音频', api: '' },
        { id: '2', name: '视频', api: '' },
        { id: '3', name: '普通专栏', api: '' },
        { id: '4', name: '大专栏', api: '' },
        { id: '5', name: '线下课', api: '' },
        // { id: '51', name: '线下课【规格】', api: '' },
        // { id: '6', name: '直播专栏', api: '' },
        { id: '7', name: '套餐课', api: '' },
        { id: 'A7', name: '套餐课（直播版）', api: '' },
        { id: '8', name: '视频素材', api: '' },
        { id: '9', name: '音频素材', api: '' },
        { id: '10', name: '直播课', api: '' }
      ]
      ins.packagePrice = Boolean(obj.packagePrice)
      ins.showCourseType = Boolean(obj.showCourseType)
      ins.currentId = obj.currentId || '4'
      ins.multiple = obj.multiple
      ins.current = 1
      ins.tearchSearch = Boolean(obj.tearchSearch)
      ins.filterateHidden = Boolean(obj.filterateHidden)
      ins.defaultValue = obj.defaultValue || []
      ins.goodsInfo = obj.goodsInfo || []
      ins.params = obj.params || {}
      ins.packageChildren = obj.packageChildren || []
      ins.sameSelected = Boolean(obj.sameSelected)
      if (obj.success) {
        ins.success = obj.success
      }
    }
  }
}
