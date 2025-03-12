export const mixinsMoveMapsItem = {
  inject: ['updateMoveMapsItemStatus', 'updateCurrentMoveMapsItemData', 'updateCurrentSelectCutItemList'],
  data() {
    return {
      isMoveDown: false,
      moveItemIndex: -1,
      activeMoveData: {},
      movementX: 0
    }
  },
  mounted() {
    this.$nextTick(() => {
      const $tracksBox = document.querySelector('.tracks-box')
      $tracksBox.addEventListener('mousemove', this.mousemoveMarkItem)
      $tracksBox.addEventListener('mouseup', this.mouseupMarkItem)
    })
  },

  methods: {
    mousedownFun(e, data, index) {
      e.stopPropagation()
      this.isMoveDown = true
      this.moveItemIndex = index
      this.activeMoveData = data
      this.updateMoveMapsItemStatus(true)
    },
    mousemoveMarkItem(e) {
      e.stopPropagation()
      if (this.isMoveDown) {
        const activeMoveData = this.mapsList[this.moveItemIndex]
        const currentZoomSectionWidth = this.video.currentZommEachSectionWidth
        const maxTime = this.video.totalVideoDuration
        const movementX = e.movementX
        this.movementX = movementX
        const moveTime = movementX / currentZoomSectionWidth
        const startTime = activeMoveData.startTime + moveTime
        const endTime = activeMoveData.endTime + moveTime
        const moveLeft = activeMoveData.leftTrack + movementX
        if (startTime <= 0 || endTime > maxTime) return false
        activeMoveData.leftTrack = moveLeft
        activeMoveData.startTime = startTime
        activeMoveData.endTime = endTime
      }
    },
    mouseupMarkItem(e) {
      e.stopPropagation()

      if (this.isMoveDown) {
        if (Math.abs(this.movementX) > 0) {
          this.updateStickerItem(this.activeMoveData)
        } else {
          this.activeMapsItemIndex = this.moveItemIndex
          this.video.currentMoveMapsItemData = this.mapsList[this.moveItemIndex]
        }
        this.updateCurrentSelectCutItemList([])
        this.movementX = 0
      } else {
        setTimeout(() => {
          this.activeMapsItemIndex = -1
          this.video.currentMoveMapsItemData = {}
        }, 100)
      }

      this.isMoveDown = false

      this.moveItemIndex = -1

      this.updateMoveMapsItemStatus(false)
    }
  }
}
