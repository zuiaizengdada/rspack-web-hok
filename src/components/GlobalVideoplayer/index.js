// 音频播放器
import videoplayer from './index.vue'

export default {
  install(vue) {
    const Videoplayer = vue.extend(videoplayer)
    const ins = new Videoplayer()
    ins.$mount(document.createElement('div'))
    document.body.appendChild(ins.$el)
    vue.prototype.$Videoplayer = obj => {
      ins.src = obj.src
      ins.progressDot = obj.progressDot
      ins.videoName = obj.videoName
      ins.showClose = obj.showClose
      ins.visible = true
      ins.play({
        url: obj.src,
        videoId: obj.videoId || '',
        videoType: obj.videoType || 1,
        progressDot: obj.progressDot,
        download: obj.download || false,
        ...obj.config
      })
      if (obj.endedCallback) {
        ins.endedCallback = obj.endedCallback
      }
    }
  }
}
