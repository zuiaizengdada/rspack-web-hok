// 音频播放器
import Vue from 'vue'
import appSelectMaterial from './index.vue'
const AppSelectMaterial = Vue.extend(appSelectMaterial)

let instance

export default {
  play(options = {}) {
    if (!instance) {
      instance = new AppSelectMaterial({
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
    const ins = new AppSelectMaterial()
    ins.$mount(document.createElement('div'))
    document.body.appendChild(ins.$el)
    vue.prototype.$SelectMaterial = (obj) => {
      ins.src = obj.src
      ins.visible = true
      ins.types = obj.types || [0, 1, 2, 3]
      ins.type = String(ins.types[0])
      ins.success = obj.success
      ins.multiple = obj.multiple
      ins.optionType = obj.optionType
      ins.current = 1
      ins.defaultValue = obj.defaultValue
      ins.disabledFn = obj.disabledFn || (() => { return false })
      if (obj.success) {
        ins.success = obj.success
      }
    }
  }
}
