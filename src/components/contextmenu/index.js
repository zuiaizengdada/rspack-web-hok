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
    } else {
      document.body.removeChild(instance.$el)
      instance = new Contextmenu({
        el: document.createElement('div')
      })
    }
    instance.top = options.top
    instance.left = options.left
    instance.onClickFn = options.onClickFn
    instance.tools = options.tools
    instance.position = options.position
    const viewC = Vue.extend(options.viewComponent)
    const ViewComponent = viewC
    const viewComponentInstance = new ViewComponent({
      el: document.createElement('div')
    })
    for (const key in options.option) {
      viewComponentInstance.a = options.option.a
      viewComponentInstance[key] = options.option[key]
    }
    if (instance.$el.firstElementChild) {
      instance.$el.firstElementChild.appendChild(viewComponentInstance.$el)
      document.body.appendChild(instance.$el)
      Vue.nextTick(() => {
        instance.visible = true
      })
    }
  },

  close() {
    if (instance) {
      instance.visible = false
    }
  }
}
