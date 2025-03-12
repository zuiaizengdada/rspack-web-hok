import Vue from 'vue'
import taskCenter from './taskCenterDialog.vue'
import eventBus from '@/utils/eventBus'
const TaskCenter = Vue.extend(taskCenter)

export default {
  install(vue) {
    const ins = new TaskCenter()
    ins.$mount(document.createElement('div'))
    document.body.appendChild(ins.$el)
    // 打开弹框
    const open = (bool) => {
      ins.visible = true
      ins.isVideoEdit = bool
    }
    // 关闭弹框
    const close = () => { ins.visible = false }
    // 添加任务
    const addTask = (obj) => {
      ins.addTask(obj)
      open()
    }
    // 监听
    const on = (key, fn = () => {}) => {
      eventBus.$on(key, (msg) => fn(msg))
    }
    vue.prototype.$taskCenter = {
      open,
      close,
      addTask,
      on
    }
  }
}
