// 选择商品
import Vue from 'vue'
import appUpload from './index.vue'
const AppUpload = Vue.extend(appUpload)

let instance

export default {
  play(options = {}) {
    if (!instance) {
      instance = new AppUpload({
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
    const ins = new AppUpload()
    ins.$mount(document.createElement('div'))
    document.body.appendChild(ins.$el)
    vue.prototype.$AppUpload = (obj) => {
      ins.visible = true
      ins.success = obj.success
      ins.treeSelectData = obj.treeSelectData
      ins.accept = obj.accept || '*'
      ins.type = obj.type
      ins.form = obj.form
      ins.tips = obj.tips
      ins.beforeUpload = obj.beforeUpload
      if (obj.success) {
        ins.success = obj.success
      }
    }
  }
}
