// 音频播放器
import Vue from 'vue'
import appAudio from './index.vue'
const AppAudio = Vue.extend(appAudio)

let instance

export default {
  open(options = {}) {
    if (!instance) {
      instance = new AppAudio({
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
    const AppAudio = vue.extend(appAudio)
    const ins = new AppAudio()
    ins.$mount(document.createElement('div'))
    document.body.appendChild(ins.$el)
    vue.prototype.$AppAudio = (obj) => {
      ins.src = obj.src
      ins.visible = true
      if (obj.success) {
        ins.success = obj.success
      }
    }
  }
}
