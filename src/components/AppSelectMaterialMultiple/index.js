// 音频播放器
import Vue from 'vue'
import appSelectMaterialMultiple from './index.vue'
const AppSelectMaterialMultiple = Vue.extend(appSelectMaterialMultiple)

let instance

export default {
  play(options = {}) {
    if (!instance) {
      instance = new AppSelectMaterialMultiple({
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
    const ins = new AppSelectMaterialMultiple()
    ins.$mount(document.createElement('div'))
    document.body.appendChild(ins.$el)
    vue.prototype.$SelectMaterialMultiple = (obj) => {
      ins.src = obj.src
      ins.types = obj.types || [0, 1, 2, 3]
      ins.type = obj.type
      ins.fileType = obj.fileType
      ins.success = obj.success
      ins.imageList = obj.imageList || []
      ins.audioList = obj.audioList || []
      ins.videoList = obj.videoList || []
      ins.fileList = obj.fileList || []
      ins.current = 1
      ins.max = obj.max
      ins.maxSize = obj.maxSize
      if (obj.success) {
        ins.success = obj.success
      }
      ins.visible = true
    }
  }
}
