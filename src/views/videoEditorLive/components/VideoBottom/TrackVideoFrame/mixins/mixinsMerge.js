export const mixinsMerge = {
  mounted() {
    this.initCancelCutLineSelect()
  },
  methods: {
    handleClickLineItem(index) {
      const activeIndex = this.currentSelectCutIndexList.indexOf(index)
      if (activeIndex > -1) {
        this.currentSelectCutIndexList.splice(activeIndex, 1)
      } else {
        this.currentSelectCutIndexList.push(index)
      }
      this.video.currentSelectCutItemList = this.currentSelectCutIndexList
    },
    handleClickLineItemMerge(index, isHistroyAction) {
      const cutLineList = JSON.parse(JSON.stringify(this.cutLineList))
      const nextMergeData = cutLineList[index]
      const prevMergeData = cutLineList[index - 1]
      const newMergeData = {
        start: prevMergeData.start,
        end: nextMergeData.end,
        duration: nextMergeData.end - prevMergeData.start,
        videoPlayStartTime: prevMergeData.videoPlayStartTime,
        videoPlayEndTime: nextMergeData.videoPlayEndTime,
        width: Number((nextMergeData.end - prevMergeData.start) * this.video.currentZommEachSectionWidth).toFixed(3),
        videoData: prevMergeData.videoData,
        refVideoId: this.video.detail.id,
        exportDeleted: false
      }
      cutLineList.splice(index - 1, 2)
      cutLineList.splice(index - 1, 0, newMergeData)
      this.cutLineList = cutLineList
      this.mouseMoveActiveIndex = -1
      this.currentSelectCutIndexList = []
      this.video.cutLineList = this.cutLineList
      this.updateCurrentSelectCutItemList(this.currentSelectCutIndexList)
      this.saveOperateClipsVideoCutting('合并')
      if (!isHistroyAction) {
        this.setActionHistory({
          eventFun: 'merge',
          value: nextMergeData.start,
          index
        })
      }
    },
    handleMouseOutLineItem() {
      this.mouseMoveActiveIndex = -1
    },
    handleMouseMoveLineItem(index) {
      const mouseMoveItem = this.cutLineList[index]
      const mouseMoveItemId = mouseMoveItem.videoData.id
      const prevMouseMoveItem = this.cutLineList[index - 1]
      const prevMouseMoveItemId = prevMouseMoveItem?.videoData.id
      // 同一视频源下的片段，并且是相邻的两个片段才能进行合并
      if (mouseMoveItemId === prevMouseMoveItemId) {
        if (mouseMoveItem.videoPlayStartTime === prevMouseMoveItem.videoPlayEndTime) {
          if (this.currentSelectCutIndexList.includes(index) && this.currentSelectCutIndexList.includes(index - 1)) {
            this.mouseMoveActiveIndex = index
          }
        }
      }
    },
    initCancelCutLineSelect() {
      const $tracksBox = document.querySelector('.tracks-box')
      $tracksBox.addEventListener('click', () => {
        this.currentSelectCutIndexList = []
        this.updateCurrentSelectCutItemList(this.currentSelectCutIndexList)
      })
    }
  }
}
