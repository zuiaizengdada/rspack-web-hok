import Vue from 'vue'
import contextmenu from './index.vue'
const Contextmenu = Vue.extend(contextmenu)

let instance

export default {
  open(options = {}) {
    if (!instance) {
      instance = new Contextmenu({
        el: document.createElement('div')
      })
    }
    // if (instance.visible) return
    instance.top = options.top
    instance.left = options.left
    instance.onClickFn = options.onClickFn
    instance.tools = options.tools
    instance.markType = options.markType // 标记类型
    instance.markHeight = options.markHeight || 310
    document.body.appendChild(instance.$el)

    Vue.nextTick(() => {
      instance.visible = true
    })
  },

  close() {
    if (instance) {
      instance.visible = false
    }
  }
}
