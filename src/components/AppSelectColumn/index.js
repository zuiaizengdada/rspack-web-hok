// 选择商品
import Vue from 'vue'
import appSelectColumn from './index.vue'
const AppSelectColumn = Vue.extend(appSelectColumn)

let instance

export default {
  play(options = {}) {
    if (!instance) {
      instance = new AppSelectColumn({
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
    const ins = new AppSelectColumn()
    ins.$mount(document.createElement('div'))
    document.body.appendChild(ins.$el)
    vue.prototype.$SelectGoods = (obj) => {
      ins.src = obj.src
      ins.visible = true
      ins.check = obj.check
      ins.defaultValue = obj.defaultValue
      ins.success = obj.success
      ins.tabList = obj.tabList
      if (obj.success) {
        ins.success = obj.success
      }
    }
  }
}
