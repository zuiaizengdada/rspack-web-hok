import Vue from 'vue'
import delModal from './delModal.vue'
const Toast = Vue.extend(delModal)

let instance

export default {
  open(options = {}) {
    if (!instance) {
      instance = new Toast({
        el: document.createElement('div')
      })
    }
    if (instance.visible) return
    instance.tips = typeof options === 'string' ? options : options.tips || ''
    instance.tips =
      options.tips || '删除后内容将无法使用，且不可恢复，确认删除吗？'
    instance.visible = options.visible || true
    instance.sureBtnText = options.sureBtnText || '确定'
    instance.sureBtnBgColor = options.sureBtnBgColor || '#F53F3F'
    instance.noCancelBtn = options.noCancelBtn || false
    instance.cancelBtnText = options.cancelBtnText || '取消'
    instance.cancelBtnBgColor = options.cancelBtnBgColor || '#fff'
    instance.iconClass = options.iconClass || 'icon_zhuyi'
    instance.iconClassName = options.iconClassName || 'c_F53F3F'
    instance.noBtn = options.noBtn || false
    if (options.success) {
      instance.success = options.success
    }
    if (options.fail) {
      instance.fail = options.fail
    }

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
    const ToastCon = vue.extend(delModal)
    const ins = new ToastCon()
    ins.$mount(document.createElement('div'))
    document.body.appendChild(ins.$el)
    vue.prototype.$delModal = obj => {
      ins.width = obj.width || '390px'
      ins.tips = obj.tips || '删除后内容将无法使用，且不可恢复，确认删除吗？'
      ins.visible = obj.visible || true
      ins.sureBtnText = obj.sureBtnText || '确定'
      ins.sureBtnBgColor = obj.sureBtnBgColor || '#F53F3F'
      ins.cancelBtnText = obj.cancelBtnText || '取消'
      ins.noCancelBtn = obj.noCancelBtn || false
      ins.cancelBtnBgColor = obj.cancelBtnBgColor || '#fff'
      ins.iconClass = obj.iconClass || 'icon_zhuyi'
      ins.iconClassName = obj.iconClassName || 'c_F53F3F'
      ins.sureBtnStyle = obj.sureBtnStyle || {}
      ins.noBtn = obj.noBtn || false
      ins.zIndex = '99999999'
      if (obj.success) {
        ins.success = obj.success
      }
      if (obj.fail) {
        ins.fail = obj.fail
      }
    }

    vue.prototype.$Modal = obj => {
      ins.width = obj.width || '390px'
      ins.tips = obj.tips || '删除后内容将无法使用，且不可恢复，确认删除吗？'
      ins.visible = obj.visible || true
      ins.sureBtnText = obj.sureBtnText || '确定'
      ins.sureBtnBgColor = obj.sureBtnBgColor || '#0C6FFF'
      ins.cancelBtnText = obj.cancelBtnText || '取消'
      ins.noCancelBtn = obj.noCancelBtn || false
      ins.cancelBtnBgColor = obj.cancelBtnBgColor || '#fff'
      ins.iconClass = ''
      ins.iconClassName = ''
      ins.sureBtnStyle = obj.sureBtnStyle || {}
      ins.noBtn = obj.noBtn || false
      ins.zIndex = '99999999'
      if (obj.success) {
        ins.success = obj.success
      }
      if (obj.fail) {
        ins.fail = obj.fail
      }
    }
  }
}
