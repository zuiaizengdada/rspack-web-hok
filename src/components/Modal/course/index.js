import Vue from 'vue'
import appCourseEdit from './index.vue'
const AppEditGoods = Vue.extend(appCourseEdit)

export default {
  install(vue) {
    const ins = new AppEditGoods()
    ins.$mount(document.createElement('div'))
    document.body.appendChild(ins.$el)
    vue.prototype.$AppEditGoods = (obj) => {
      ins.src = obj.src
      ins.type = obj.type || 'editVideo'
      ins.goodsId = obj.goodsId || ''
      ins.width = obj.width || '800px'
      ins.visible = obj.visible || false
      if (obj.success) {
        ins.success = obj.success
      }
    }
  }
}
