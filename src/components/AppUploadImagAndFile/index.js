// 选择商品
import Vue from 'vue'
import appUploadImagAndFile from './index.vue'
const AppUploadImagAndFile = Vue.extend(appUploadImagAndFile)

let instance

export default {
  play(options = {}) {
    if (!instance) {
      instance = new AppUploadImagAndFile({
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
    const ins = new AppUploadImagAndFile()
    ins.$mount(document.createElement('div'))
    document.body.appendChild(ins.$el)
    vue.prototype.$AppUploadImagAndFile = (obj) => {
      ins.visible = true
      ins.success = obj?.success
      ins.treeSelectData = obj?.treeSelectData
      ins.accept = obj?.accept || '*'
      ins.type = obj?.type
      ins.api = obj?.api
      ins.form = obj?.form || { id: '', name: '' }
      ins.tips = obj?.tips
      ins.limit = obj.limit || 100
      ins.beforeUpload = obj?.beforeUpload
      if (obj.success) {
        ins.success = obj.success
      }
    }
  }
}
