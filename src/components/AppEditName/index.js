// 音频播放器
import Vue from 'vue'
import appEditName from './index.vue'
const AppEditName = Vue.extend(appEditName)

let instance

export default {
  open(options = {}) {
    if (!instance) {
      instance = new AppEditName({
        el: document.createElement('div')
      })
    }
    if (instance.visible) return
    instance.src = typeof options === 'string' ? options : options.src || ''
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
    const AppEditName = vue.extend(appEditName)
    const ins = new AppEditName()
    ins.$mount(document.createElement('div'))
    document.body.appendChild(ins.$el)
    vue.prototype.$AppEditName = (obj) => {
      ins.maxlength = obj.maxlength
      ins.placeholder = obj.placeholder
      ins.text = obj.defaultValue
      ins.visible = true
      ins.title = obj.title
      if (obj.success) {
        ins.success = obj.success
      }
    }
  }
}
