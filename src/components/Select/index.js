import Vue from 'vue'
import Select from './index.vue'
const SelectCon = Vue.extend(Select)

let instance

export default {
  open(options = {}) {
    if (!instance) {
      instance = new SelectCon({
        el: document.createElement('div')
      })
    }
    if (instance.visible) return
    instance.tips = typeof options === 'string' ? options : options.tips || ''
    document.body.appendChild(instance.$el)

    Vue.nextTick(() => {
      instance.visible = true
    })
  },

  close() {
    if (instance) {
      instance.visible = false
    }
  },

  install(vue) {
    const SelectCon = vue.extend(Select)
    const ins = new SelectCon()
    ins.$mount(document.createElement('div'))
    document.body.appendChild(ins.$el)
    vue.prototype.$Select = (obj) => {
      ins.title = obj.title || '选择'
      ins.visible = obj.visible || true
      ins.multiple = obj.multiple
      ins.defultCheck = obj.defultCheck || []
      ins.disabledFn = obj.disabledFn || (() => false)
      ins.type = obj.type || 'label'
      ins.params = obj.params || {}
      if (obj.success) {
        ins.success = obj.success
      }
      if (obj.addFn) {
        ins.addFn = obj.addFn
      }
    }
  }
}
