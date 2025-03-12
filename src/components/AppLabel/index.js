// 音频播放器
import Vue from 'vue'
import appLabel from './index.vue'
const AppLabel = Vue.extend(appLabel)

let instance

export default {
  play(options = {}) {
    if (!instance) {
      instance = new AppLabel({
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
    const ins = new AppLabel()
    ins.$mount(document.createElement('div'))
    document.body.appendChild(ins.$el)
    vue.prototype.$AppLabel = (obj) => {
      ins.src = obj.src
      ins.visible = true
      if (obj.success) {
        ins.success = obj.success
      }
    }
  }
}
