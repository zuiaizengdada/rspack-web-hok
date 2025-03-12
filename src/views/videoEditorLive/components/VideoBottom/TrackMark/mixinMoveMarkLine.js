import { getVideoFrameImage } from './utils'
export const mixinMoveMarkLine = {
  inject: ['updateVisibleMoveMark'],
  data() {
    return {
      isMoveLine: false,
      isMoveLineRight: true,
      activeMoveLineIndex: -1
    }
  },
  mounted() {
    this.$nextTick(() => {
      const $contentRight = document.querySelector('.content-right')
      const $tracksBox = document.querySelector('.tracks-box')
      $tracksBox.addEventListener('mousemove', this.mousemoveFun)
      $contentRight.addEventListener('mouseup', this.mouseupFun)
    })
  },
  destroyed() {
    this.activeIndex = -1
    const $contentRight = document.querySelector('.content-right')
    const $tracksBox = document.querySelector('.tracks-box')
    $contentRight && $contentRight.removeEventListener('mouseup')
    $tracksBox && $tracksBox.removeEventListener('mousemove')
  },
  methods: {
    mousedownFun(index, isRight) {
      // this.updateVisibleMoveMark(true)
      this.isMoveLineRight = isRight
      this.isMoveLine = true
      this.activeMoveLineIndex = index
    },
    mousemoveFun(e) {
      if (this.isMoveLine && this.activeMoveLineIndex > -1) {
        console.log('markLineMousemove...........')
        const currentZoomSectionWidth = this.video.currentZommEachSectionWidth
        const maxWidth = currentZoomSectionWidth * this.video.totalVideoDuration
        const activeItem = this.markList[this.activeMoveLineIndex]
        const endX = activeItem.endTime * currentZoomSectionWidth
        const movementX = e.movementX
        const leftX = Number(activeItem.left)
        let currentTime
        // const isActiveAbsorb = this.video.isActiveAbsorb
        // const cutLineList = this.video.cutLineList
        // 往右移
        if (this.isMoveLineRight) {
          // 超出视频时长时，不能移动
          if ((movementX > 0 && endX > maxWidth)) return false
          // 标记宽度，本身宽度+移动距离，最小宽度38
          let moveRightWidth = activeItem.width + movementX
          // 是否开启吸附
          // if (isActiveAbsorb) {
          //   // 当进度条接触到裁剪点左右10个像素时，自动吸附
          //   for (let i = 1; i < cutLineList.length; i++) {
          //     const px = cutLineList[i] - (leftX + moveRightWidth)
          //     if (px > 0 && px < 10) {
          //       moveRightWidth = cutLineList[i] - leftX
          //       break
          //     }
          //   }
          // }
          currentTime = (leftX + moveRightWidth) / currentZoomSectionWidth
          moveRightWidth = moveRightWidth < 38 ? 38 : moveRightWidth
          activeItem.width = moveRightWidth
          // 移动点对应的播放时间
          activeItem.endTime = currentTime.toFixed(3)
        } else {
          // 往左移
          const moveLeftX = leftX + movementX
          const moveLeftWidth = activeItem.width - movementX
          if (movementX < 0 && leftX < 4) return false
          if (movementX > 0 && moveLeftX > endX - 38) return false
          // 是否开启吸附
          // if (isActiveAbsorb) {
          //   // 当进度条接触到裁剪点左右10个像素时，自动吸附
          //   for (let i = 1; i < cutLineList.length; i++) {
          //     const px = moveLeftX - cutLineList[i]
          //     console.log(moveLeftX, cutLineList, 222222222)
          //     if (px > 0 && px < 10) {
          //       moveLeftX = cutLineList[i]
          //       moveLeftWidth = activeItem.width + (cutLineList[i] - leftX)
          //       break
          //     }
          //   }
          // }
          currentTime = (moveLeftX / currentZoomSectionWidth)
          activeItem.left = moveLeftX
          activeItem.width = moveLeftWidth
          activeItem.startTime = currentTime.toFixed(3)
        }

        this.currentTime = currentTime
      }
    },
    mouseupFun() {
      if (this.activeMoveLineIndex > -1) {
        this.updateMarkItem(this.markList[this.activeMoveLineIndex])
        setTimeout(async () => {
          if (!this.isMoveLineRight) {
            const url = await getVideoFrameImage(this.currentTime)
            this.markList[this.activeMoveLineIndex].pictureUrl = url
            this.updateMarkItem(this.markList[this.activeMoveLineIndex])
          }
          this.activeMoveLineIndex = -1
          this.updateVideoSeekTime(this.currentTime, '标记两侧拖动跳帧播放。。')
        }, 650)
      }
      this.isMoveLine = false
      // this.updateVisibleMoveMark(false)
    }
  }
}
