// 选择商品
import Vue from 'vue'
import appTableFilter from './index.vue'
const AppTableFilter = Vue.extend(appTableFilter)

let instance

export default {
  play(options = {}) {
    if (!instance) {
      instance = new AppTableFilter({
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
    const ins = new AppTableFilter()
    ins.$mount(document.createElement('div'))
    document.body.appendChild(ins.$el)
    vue.prototype.$TableFilter = (obj) => {
      ins.src = obj.src
      ins.visible = true
      ins.success = obj.success
      ins.title = obj.title
      if (obj.success) {
        ins.success = obj.success
      }
    }
  }
}
