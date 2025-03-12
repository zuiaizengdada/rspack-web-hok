// 检测是否需要同步数据
import detectionVideo from './index.vue'

export default {
  install(vue) {
    const DetectionVideo = vue.extend(detectionVideo)
    const ins = new DetectionVideo()
    ins.$mount(document.createElement('div'))
    document.body.appendChild(ins.$el)
    vue.prototype.$DetectionVideo = obj => {
      ins.visible = true
      ins.nums = obj.nums
      ins.btnText = obj.btnText ? obj.btnText : '我不使用了'
      if (obj.success) {
        ins.success = obj.success
      }
      if (obj.continue) {
        ins.continue = obj.continue
      }
    }
  }
}
