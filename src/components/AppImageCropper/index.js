import Vue from 'vue'
import appImageCropper from './index.vue'
const AppImageCropper = Vue.extend(appImageCropper)

let instance

export default {
  open(options = {}) {
    if (!instance) {
      instance = new AppImageCropper({
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
    const AppImageCropper = vue.extend(appImageCropper)
    const ins = new AppImageCropper()
    ins.$mount(document.createElement('div'))
    document.body.appendChild(ins.$el)
    vue.prototype.$AppImageCropper = (obj) => {
      ins.title = obj.title || '裁剪图片'
      ins.option.img = obj.url
      ins.width = obj.width
      ins.height = obj.height
      ins.fixed = obj.fixed
      ins.option = {
        ...ins.option,
        ...obj.option
      }
      if (obj.success) {
        ins.success = obj.success
      }
      Vue.nextTick(() => {
        ins.visible = obj.visible || true
      })
    }
  }
}
