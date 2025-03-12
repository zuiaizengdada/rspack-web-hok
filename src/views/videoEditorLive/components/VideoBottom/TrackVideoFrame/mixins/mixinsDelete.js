export const mixinsDelete = {
  data() {
    return {
      deleteCulLineList: []
    }
  },
  mounted() {
    this.initDeleteCutLineItem()
  },
  methods: {
    // 删除所需裁剪块
    deleteSelectCutLineItem(deleteList) {
      const list = deleteList || this.currentSelectCutIndexList
      const currentDurationTotal = this.video.totalVideoDuration
      let total = 0
      // let currentDeleteCutLineItemIndex
      if (list.length === 0) return false
      list.forEach(item => {
        const cutLineItem = this.cutLineList[item]
        // currentDeleteCutLineItemIndex = cutLineItem.fIndex
        const duration = cutLineItem.end - cutLineItem.start
        total += duration
        this.deleteCulLineList.push(this.cutLineList[item])
        this.cutLineList.splice(item, 1)
      })

      const totalDuation = currentDurationTotal - total
      this.currentSelectCutIndexList = []
      this.createCutLineList()
      this.updateCurrentSelectCutItemList(this.currentSelectCutIndexList)
      this.updatetoTalVideoDuration(totalDuation)
      if (this.cutLineList.length === 0) {
        this.updateVideoSeekTime(0.001)
      } else {
        const time = this.video.currentTime
        if (time > totalDuation) {
          this.updateVideoSeekTime(totalDuation)
        } else {
          this.updateVideoSeekTime(time)
        }
      }
      this.setActionHistory({
        eventFun: 'delete',
        data: list
      })
      this.saveOperateClipsVideoCutting('删除')
    },
    recoverHistoryDeleteCutLineItem(deleteList, isRecover) {
      if (isRecover) {
        this.deleteSelectCutLineItem(deleteList)
      } else {
        const cutLineList = this.cutLineList
        const copyDeleteCutLineList = JSON.parse(JSON.stringify(this.deleteCulLineList))
        const _list = copyDeleteCutLineList.reverse()
        deleteList.forEach((item, index) => {
          cutLineList.splice(item, 0, _list[index])
        })
      }

      this.createCutLineList()
      this.saveOperateClipsVideoCutting('删除')
    },
    createCutLineList() {
      const filterList = this.cutLineList
      let totalDuration = 0
      filterList.forEach((item, index) => {
        let start = 0
        if (index !== 0) {
          start = filterList[index - 1].end
        }
        filterList[index].start = start
        filterList[index].end = start + filterList[index].duration
        totalDuration = totalDuration + item.duration
      })
      this.video.cutLineList = this.cutLineList
      this.updatetoTalVideoDuration(totalDuration)
    },
    initDeleteCutLineItem() {
      const frameBtn = document.querySelectorAll('.bar-left .icon-list img')[4]
      frameBtn.addEventListener('click', () => {
        this.deleteSelectCutLineItem()
      })
    },
    getDeleteCulLineListDurationTotal() {
      let total = 0
      this.deleteCulLineList.forEach(item => {
        total += item.duration
      })

      return total
    }

  }
}
