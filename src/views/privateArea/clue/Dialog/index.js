import Vue from 'vue'
import store from '@/store'
import followUser from './followUser.vue'

// 跟进学员弹框
const FollowUser = Vue.extend(followUser)

const TYPE = { FollowUser }
Vue.prototype.$store = store
let instance

export default {
  open(options = {}) {
    console.log(options)
    if (!(options.type || TYPE[options.type])) {
      return new Error('缺少type参数')
    }
    if (instance) {
      document.body.removeChild(instance.$el)
    }
    // if (!instance) {
    // }
    instance = new TYPE[options.type]({ el: document.createElement('div') })
    for (const key in options) {
      instance[key] = options[key]
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
  }
}
