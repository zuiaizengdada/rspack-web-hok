// 选择商品
import Vue from 'vue'
import selectOffineCource from './index.vue'
const SelectOffineCource = Vue.extend(selectOffineCource)

let instance

export default {
  play(options = {}) {
    if (!instance) {
      instance = new SelectOffineCource({
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
    const ins = new SelectOffineCource()
    ins.$mount(document.createElement('div'))
    document.body.appendChild(ins.$el)
    vue.prototype.$SelectOffineCource = (obj) => {
      ins.src = obj.src
      ins.visible = true
      ins.check = obj.check || []
      ins.submitRequest = obj.submitRequest
      ins.initSearch = obj.initSearch
      ins.disabledFn = obj.disabledFn || (() => false)
      ins.success = obj.success
      ins.multiple = obj.multiple
      ins.current = 1
      ins.defaultValue = obj.defaultValue || []
      ins.params = obj.params || {}
      if (obj.success) {
        ins.success = obj.success
      }
    }
  }
}
