// 视频导出弹框组件
import Vue from 'vue'
import videoExport from './index.vue'
const VideoExport = Vue.extend(videoExport)

let instance

export default {
  open(options = {}) {
    if (!instance) {
      instance = new VideoExport({
        el: document.createElement('div')
      })
    }
    // if (instance.visible) return
    instance.projectId = typeof options === 'string' ? options : options.projectId || ''
    instance.projectVideoId = typeof options === 'string' ? options : options.projectVideoId || ''
    instance.cutLineActiveList = options.cutLineActiveList || []
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

  getVisible() {
    if (instance) {
      return instance.visible
    } else {
      return false
    }
  }
}
