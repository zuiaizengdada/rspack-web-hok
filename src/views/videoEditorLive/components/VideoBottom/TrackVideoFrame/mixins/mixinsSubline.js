export const mixinsSubline = {
  methods: {
    // 辅助线移动
    subLineMove(data) {
      const { moveX, isMoveLeft, index } = data
      const currentZoomSectionWidth = this.video.currentZommEachSectionWidth
      const duration = this.video.detail.duration
      const maxX = duration * currentZoomSectionWidth
      const currentMoveSubLineIndex = this.currentMoveSubLineIndex + 1
      // 拖动到起点和终点时，删除该裁剪点，
      if (moveX < 1 || moveX > maxX) {
        this.cutList.splice(currentMoveSubLineIndex, 1)
        this.initCutLint()
        this.cutFrameLines()
      } else {
        // 拖动到相邻裁剪点 +-4个像素的吸附效果，删除该裁剪点
        this.cutList.forEach((item, _index) => {
          // 往左移
          if (isMoveLeft) {
            if (this.cutList[currentMoveSubLineIndex] - this.cutList[currentMoveSubLineIndex - 1] < 4) {
              this.cutList.splice(currentMoveSubLineIndex, 1)
              this.initCutLint()
              this.$refs.subline[index].mouseupFun()
            } else {
              this.cutList[currentMoveSubLineIndex] = this.currentCutPointX
              this.initCutLint()
            }
          } else {
            // 往右移
            if (this.cutList[currentMoveSubLineIndex] - this.cutList[currentMoveSubLineIndex + 1 ] > -4) {
              this.cutList.splice(currentMoveSubLineIndex, 1)
              this.initCutLint()
              this.$refs.subline[index].mouseupFun()
            } else {
              this.cutList[currentMoveSubLineIndex] = this.currentCutPointX
              this.initCutLint()
            }
          }
        })
        this.currentCutPointX = moveX
        // this.initCutLint()
      }
    },
    // 辅助线点击
    subLineMousedown(index) {
      this.currentMoveSubLineIndex = index
      this.currentCutPointX = this.cutList[index + 1]
    },
    // 辅助线松开，保存数据
    subLineMouseUp() {
      this.cutFrameLines()
    }
  }
}
