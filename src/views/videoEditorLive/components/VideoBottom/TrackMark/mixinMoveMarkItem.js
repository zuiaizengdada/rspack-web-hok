import { getVideoFrameImage } from './utils'
export const mixinMoveMarkItem = {
  data() {
    return {
      isMoveItem: false,
      activeMoveItemIndex: -1,
      markItemMoveX: 0
    }
  },
  mounted() {
    this.$nextTick(() => {
      const $tracksBox = document.querySelector('.tracks-box')
      $tracksBox.addEventListener('mousemove', this.mousemoveMarkItem)
      $tracksBox.addEventListener('mouseup', this.mouseupMarkItem)
    })
  },
  destroyed() {
    this.activeIndex = -1
    const $tracksBox = document.querySelector('.tracks-box')
    $tracksBox && $tracksBox.removeEventListener('mousemove')
  },
  methods: {
    mousedownMarkItem(data, index) {
      this.isMoveItem = true
      this.activeMoveItemIndex = index
      this.activeIndex = index
      this.updateVisibleMoveMark(true)
    },
    mousemoveMarkItem(e) {
      if (this.isMoveItem) {
        const currentZoomSectionWidth = this.video.currentZommEachSectionWidth
        const maxTime = this.video.totalVideoDuration
        const activeItem = this.markList[this.activeMoveItemIndex]
        const movementX = e.movementX
        const moveLeft = activeItem.left + movementX
        const moveTime = movementX / currentZoomSectionWidth
        const startTime = Number(activeItem.startTime) + Number(moveTime)
        const endTime = Number(activeItem.endTime) + Number(moveTime)
        this.markItemMoveX = movementX
        if (startTime <= 0 || endTime > maxTime) return false
        activeItem.left = moveLeft
        activeItem.startTime = startTime
        activeItem.endTime = endTime
        this.updateMarkList(this.markList)
      }
    },
    async mouseupMarkItem() {
      this.isMoveItem = false
      if (this.activeMoveItemIndex > -1) {
        if (this.markItemMoveX !== 0) {
          const data = this.markList[this.activeMoveItemIndex]
          const url = await getVideoFrameImage(data.startTime)
          data.pictureUrl = url
          this.updateMarkItem(data)
          this.updateVideoSeekTime(data.startTime, '标记内容点击跳帧播放。。。')
          this.markItemMoveX = 0
        }
      }
      this.activeMoveItemIndex = -1
      this.updateVisibleMoveMark(false)
    }
  }
}
