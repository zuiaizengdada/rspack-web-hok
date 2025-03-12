// 选择商品
import Vue from 'vue'
import ossupload from './index.vue'
const OSSUpload = Vue.extend(ossupload)

let instance

export default {
  play(options = {}) {
    if (!instance) {
      instance = new OSSUpload({
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
    const ins = new OSSUpload()
    ins.$mount(document.createElement('div'))
    document.body.appendChild(ins.$el)
    vue.prototype.$OSSUpload = (obj) => {
      ins.visible = true
      ins.success = obj.success
      if (obj.success) {
        ins.success = obj.success
      }
    }
  }
}
