// 选择发送对象弹框
import Vue from 'vue'
import sendObj from './index.vue'
const SendObj = Vue.extend(sendObj)

let instance

export default {
  open(options = {}) {
    if (!instance) {
      instance = new SendObj({
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
    const ins = new SendObj()
    ins.$mount(document.createElement('div'))
    document.body.appendChild(ins.$el)
    vue.prototype.$SendObj = (obj) => {
      ins.title = obj.title || '选择对象'
      ins.visible = obj.visible || false
      ins.userDisabledFn = obj.userDisabledFn || (() => true)
      ins.columnDisabledFn = obj.columnDisabledFn || (() => true)
      if (obj.success) {
        ins.success = obj.success
      }
    }
  }
}
