// 选择商品
import Vue from 'vue'
import appActivation from './index.vue'
const AppAppActivation = Vue.extend(appActivation)

let instance

export default {
  open(options = {}) {
    if (!instance) {
      instance = new AppAppActivation({
        el: document.createElement('div')
      })
    }
    if (instance.visible) return
    instance.src = typeof options === 'string' ? options : options.src || ''
    document.body.appendChild(instance.$el)

    Vue.nextTick(() => {
      instance.visible = true
      // instance.open(options)
    })
  },

  close() {
    if (instance) {
      instance.visible = false
    }
  },

  install(vue) {
    const ins = new AppAppActivation()
    ins.$mount(document.createElement('div'))
    document.body.appendChild(ins.$el)
    vue.prototype.$AppAppActivation = (obj) => {
      ins.src = obj.src
      ins.visible = true
    }
  }
}
