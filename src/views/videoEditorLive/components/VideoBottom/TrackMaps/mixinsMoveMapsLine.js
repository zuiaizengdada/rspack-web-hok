
export const mixinsMoveMapsLine = {
  data() {
    return {
      isMoveLine: false,
      isMoveRight: false,
      isMoveLeft: false,
      clientX: 0,
      moveX: 0
    }
  },
  mounted() {
    this.$nextTick(() => {
      // const $contentRight = document.querySelector('.content-right')
      const $tracksBox = document.querySelector('.tracks-box')
      $tracksBox.addEventListener('mousemove', this.mousemoveLineFun)
      $tracksBox.addEventListener('mouseup', this.mouseupLineFun)
    })
  },
  methods: {
    mousedownLineFun(e, index, isMoveType) {
      this.activeMapsItemIndex = index
      this.clientX = e.clientX
      // e.stopPropagation()
      if (isMoveType === 'left') {
        this.isMoveLeft = true
      } else if (isMoveType === 'right') {
        this.isMoveRight = true
      }
      this.isMoveLine = true
    },
    mousemoveLineFun(e) {
      if (this.isMoveLine) {
        const currentZoomSectionWidth = this.video.currentZommEachSectionWidth
        const maxWidth = currentZoomSectionWidth * this.video.totalVideoDuration
        const activeItem = this.mapsList[this.activeMapsItemIndex]
        const endX = activeItem.endTime * currentZoomSectionWidth
        const movementX = e.movementX
        this.moveX = e.clientX - this.movementX
        const leftX = Number(activeItem.leftTrack)
        if (this.isMoveRight) {
          if ((movementX > 0 && endX > maxWidth)) return false
          let moveRightWidth = activeItem.widthTrack + movementX
          moveRightWidth = moveRightWidth < 38 ? 38 : moveRightWidth
          activeItem.widthTrack = moveRightWidth
          activeItem.endTime = activeItem.startTime + activeItem.widthTrack / currentZoomSectionWidth
          activeItem.duration = activeItem.endTime - activeItem.startTime
        } else if (this.isMoveLeft) {
          const moveLeftX = leftX + movementX

          const moveLeftWidth = activeItem.widthTrack - movementX
          if (movementX < 0 && leftX < 4) return false
          if (movementX > 0 && moveLeftX > endX - 38) return false
          activeItem.leftTrack = moveLeftX
          activeItem.widthTrack = moveLeftWidth
          activeItem.startTime = moveLeftX / currentZoomSectionWidth
          activeItem.endTime = activeItem.startTime + activeItem.widthTrack / currentZoomSectionWidth
          activeItem.duration = activeItem.endTime - activeItem.startTime
        }
      }
    },
    mouseupLineFun(e) {
      e.stopPropagation()
      if (this.isMoveLine) {
        console.log(this.moveX, this.activeMapsItemIndex, 11111111)
        const data = this.mapsList[this.activeMapsItemIndex]
        if (data && Object.keys(data).length > 0) {
          if (this.moveX !== 0) {
            this.updateStickerItem(data)
          }
        }
      }
      this.isMoveLine = false
      this.isMoveRight = false
      this.isMoveLeft = false
      this.moveX = 0
    }
  }
}
