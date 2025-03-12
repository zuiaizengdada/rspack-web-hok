import videoExport from '@/views/videoEditor/components/videoExport/index.js'
export const mixinsHotkeys = {
  mounted() {
    this.initDeleteKeydown()
  },
  methods: {
    initDeleteKeydown() {
      document.onkeydown = (e) => {
        const el = e || event || window.event
        if (!el) return false
        if (el.keyCode === 46) {
          this.deleteSelectCutLineItem()
        }
      }
    },
    initKeydown() {
      document.onkeydown = (e) => {
        const el = e || event || window.event
        const currentTime = this.video.currentTime
        const currentZoomSectionWidth = this.video.currentZommEachSectionWidth
        const currentPx = Number((currentTime * currentZoomSectionWidth).toFixed(3))
        const durationTime = this.video.totalVideoDuration
        const palyStatus = this.video.status
        if (!el) return false
        if (el.keyCode === 40) {
          e.preventDefault()
          if (videoExport.getVisible()) {
            return
          }
          if (palyStatus === 'playing') {
            this.updateVideoSeekTime(currentTime, '切换片段上键跳帧播放。。。')
          }
          setTimeout(() => {
            let nextCutIndex = 0
            for (let i = 0; i < this.cutList.length; i++) {
              const x = Number((this.cutList[i]).toFixed(3))
              if (x > currentPx) {
                nextCutIndex = i
                break
              }
            }

            const nextCutPx = Number((this.cutList[nextCutIndex]).toFixed(3))
            console.log(nextCutIndex, currentPx, nextCutPx, 444444)
            if (nextCutIndex > 0) {
              const time = nextCutPx / currentZoomSectionWidth
              this.updateVideoSeekTime(time, '切换片段下键跳帧播放。。。')
            } else {
              this.updateVideoSeekTime(durationTime)
            }
          }, 100)
        } else if (el.keyCode === 38) {
          e.preventDefault()
          if (videoExport.getVisible()) {
            return
          }

          if (palyStatus === 'playing') {
            this.updateVideoSeekTime(-1, '切换片段上键跳帧播放。。。')
          }

          setTimeout(() => {
            let prevCutIndex = 0
            for (let i = 0; i < this.cutList.length; i++) {
              const x = Number((this.cutList[i]).toFixed(3))
              if (x < currentPx) {
                prevCutIndex++
              }
            }

            if (prevCutIndex > 0) {
              const prevCutPx = Number((this.cutList[prevCutIndex - 1]).toFixed(3)) || 0
              const time = prevCutPx / currentZoomSectionWidth
              // time = time === 0 ? 0.1 : time
              this.updateVideoSeekTime(time, '切换片段上键跳帧播放。。。')
            } else {
              this.updateVideoSeekTime(0)
            }
            // console.log(prevCutIndex, currentPx, prevCutPx, 22222)
          }, 100)
        } else if (el.keyCode === 46) {
          this.deleteSelectCutLineItem()
        }
      }
    }
  }
}
