// 音频播放器
import Vue from 'vue'
import appVideo from './index.vue'
const AppVideo = Vue.extend(appVideo)

let instance

export default {
  play(options = {}) {
    if (!instance) {
      instance = new AppVideo({
        el: document.createElement('div')
      })
    }
    if (instance.visible) return
    instance.src = typeof options === 'string' ? options : options.src || ''
    instance.videoId = typeof options === 'string' ? options : options.videoId || ''
    instance.videoName = typeof options === 'string' ? options : options.videoName || ''
    instance.materialId = typeof options === 'string' ? options : options.materialId || ''
    instance.videoInfo = options.videoInfo || {}
    instance.closeOnPressEscape = options.closeOnPressEscape || false
    instance.poster = typeof options === 'string' ? options : options.poster || ''
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
    const AppVideo = vue.extend(appVideo)
    const ins = new AppVideo()
    ins.$mount(document.createElement('div'))
    document.body.appendChild(ins.$el)
    vue.prototype.$AppVideo = (obj) => {
      ins.src = obj.src
      ins.visible = true
      ins.videoName = obj.videoName || ''
      ins.videoId = obj.videoId || ''
      ins.videoInfo = obj.videoInfo || {}
      ins.materialId = obj.materialId
      if (obj.success) {
        ins.success = obj.success
      }
    }
  }
}
