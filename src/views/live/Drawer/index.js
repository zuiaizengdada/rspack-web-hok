import Vue from 'vue'
import store from '@/store'
import upperFirst from 'lodash/upperFirst'
import camelCase from 'lodash/camelCase'
const requireComponent = require.context(
  // 其组件目录的相对路径
  '@/views/live/Drawer',
  // 是否查询其子目录
  true,
  // 匹配基础组件文件名的正则表达式
  /\w+\.vue$/
)
const TYPE = {}
requireComponent.keys().forEach(fileName => {
  const componentName = upperFirst(
    camelCase(
      // 获取和目录深度无关的文件名
      fileName
        .split('/')
        .pop()
        .replace(/\.\w+$/, '')
    )
  )
  const componentConfig = requireComponent(fileName)
  TYPE[componentName] = Vue.extend(componentConfig.default || componentConfig)
})

Vue.prototype.$store = store
let instance

export default {
  open(options = {}) {
    if (!(options.type || TYPE[options.type])) {
      return new Error('缺少type参数')
    }
    if (instance) {
      document.body.removeChild(instance.$el)
    }
    instance = new TYPE[options.type]({ el: document.createElement('div') })
    for (const key in options) {
      instance[key] = options[key]
    }
    document.body.appendChild(instance.$el)

    Vue.prototype.$store = store
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
