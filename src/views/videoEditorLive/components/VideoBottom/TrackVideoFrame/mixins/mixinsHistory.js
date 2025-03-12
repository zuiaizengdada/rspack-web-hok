export const mixinsHistory = {
  inject: ['video', 'updateActionList', 'updateActionNextList'],
  data() {
    return {
      historyList: [] // 历史操作数组
    }
  },
  methods: {
    // 历史记录存储
    setActionHistory(data) {
      const actionList = this.video.actionList
      actionList.push(data)
      this.updateActionList(actionList)
    },
    // 历史重置操作
    cutHistoryPrev() {
      const actionList = JSON.parse(JSON.stringify(this.video.actionList))
      const actionNextList = JSON.parse(JSON.stringify(this.video.actionNextList))
      const actionLength = actionList.length
      const lastActionItem = actionList[actionLength - 1]
      const isHistroyAction = true
      if (lastActionItem.eventFun === 'cut') {
        const cutItemValue = lastActionItem.value
        const index = this.cutLineList.findIndex(item => {
          return item.start === cutItemValue
        })
        this.handleClickLineItemMerge(index, isHistroyAction)
      } else if (lastActionItem.eventFun === 'merge') {
        this.handleVideoCut(lastActionItem.value, isHistroyAction)
      } else if (lastActionItem.eventFun === 'change') {
        this.dragEndCutItem(lastActionItem.data.end, lastActionItem.data)
      } else if (lastActionItem.eventFun === 'delete') {
        this.recoverHistoryDeleteCutLineItem(lastActionItem.data)
      }
      actionList.pop()
      actionNextList.push(lastActionItem)
      this.updateActionList(actionList)
      this.updateActionNextList(actionNextList)
    },
    // 历史撤销操作
    cutHistoryNext() {
      const isHistroyAction = true
      const actionList = JSON.parse(JSON.stringify(this.video.actionList))
      const actionNextList = JSON.parse(JSON.stringify(this.video.actionNextList))
      const nextActionLength = actionNextList.length
      const lastActionNextItem = actionNextList[nextActionLength - 1]
      if (lastActionNextItem.eventFun === 'cut') {
        const value = lastActionNextItem.value
        this.handleVideoCut(value, isHistroyAction)
      } else if (lastActionNextItem.eventFun === 'merge') {
        const { index } = lastActionNextItem
        this.handleClickLineItemMerge(index, isHistroyAction)
      } else if (lastActionNextItem.eventFun === 'change') {
        this.dragEndCutItem(lastActionNextItem.data.start, lastActionNextItem.data)
      } else if (lastActionNextItem.eventFun === 'delete') {
        console.log(lastActionNextItem, 555)
        this.recoverHistoryDeleteCutLineItem(lastActionNextItem.data, true)
      }
      actionNextList.pop()
      actionList.push(lastActionNextItem)
      this.updateActionList(actionList)
      this.updateActionNextList(actionNextList)
    }
  }
}
