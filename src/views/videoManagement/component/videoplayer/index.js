// 音频播放器
import Vue from 'vue'
import videoplayer from './videoplayer.vue'
const Videoplayer = Vue.extend(videoplayer)

let instance

export default {
  play(options = {}) {
    if (!instance) {
      instance = new Videoplayer({
        el: document.createElement('div')
      })
    }
    if (instance.visible) return
    instance.src = typeof options === 'string' ? options : options.src || ''
    instance.closeOnPressEscape = options.closeOnPressEscape || false
    instance.videoId = typeof options === 'string' ? options : options.videoId || ''
    instance.videoName = typeof options === 'string' ? options : options.videoName || ''
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
  }
}
