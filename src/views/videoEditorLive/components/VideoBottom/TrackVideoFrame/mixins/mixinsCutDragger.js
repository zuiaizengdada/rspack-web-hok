// import { generateSumArray } from '../utils'
import { frameExtractingList } from '../../../../api'

export const mixinsCutDragger = {
  inject: ['video', 'updateCurrentDragItemData', 'updatetoTalVideoDuration'],
  data() {
    return {
      currentCutItemData: {}
    }
  },
  methods: {
    dragStartCutItem(index) {
      event.dataTransfer.setData('text/plain', index)
      this.currentCutItemData = this.cutLineList[index]
      // this.currentCutItemData.startIndex = index
      // this.video.currentDragItemData = this.currentCutItemData
      console.log(this.video.currentDragItemData, '当前拖拽的片段对象。。。')
    },
    dragOverCutItem(e) {
      e.preventDefault()
    },
    dragEnd(targetIndex) {
      const currentDragVideoData = this.video.currentDragItemData
      const currentCutItemData = this.currentCutItemData
      // 根据currentDragVideoData是否有值，判断当前是拖拽视频列表中的视频
      if (Object.keys(currentDragVideoData).length > 0) {
        this.dargEndVideoItem(currentDragVideoData, targetIndex)
      }
      if (Object.keys(currentCutItemData).length > 0) {
        this.dragEndCutItem(targetIndex)
        this.currentCutItemData = {}
      }
    },
    // 视频拖入后
    async dargEndVideoItem(data, targetIndex) {
      console.log(data, 'data')

      const list = JSON.parse(JSON.stringify(this.cutLineList))
      const currentZoomSectionWidth = this.video.currentZommEachSectionWidth
      const res = await frameExtractingList({ videoId: data.id })
      // const resSubtitle = await subtitleList({ videoId: data.id })
      data.frameData = res.data
      // 拖入到第一个位置
      if (targetIndex === 0) {
        const firstItemData = {
          start: 0,
          end: data.duration,
          refVideoId: data.id,
          exportDeleted: false,
          videoPlayStartTime: 0,
          videoPlayEndTime: data.duration,
          width: currentZoomSectionWidth * data.duration,
          videoData: data,
          // subtitleList: resSubtitle,
          duration: data.duration,
          id: new Date().getTime()
        }
        list.unshift(firstItemData)
        const _index = targetIndex + 1
        for (let i = _index; i < list.length; i++) {
          list[i].start += firstItemData.end - firstItemData.start
          list[i].end += firstItemData.end - firstItemData.start
        }
      } else {
        // 拖入到中间位置
        const listLineNewItemData = list[targetIndex]
        const newArray = [{
          start: listLineNewItemData.start,
          end: listLineNewItemData.start + data.duration,
          refVideoId: data.id,
          exportDeleted: false,
          videoPlayStartTime: 0,
          videoPlayEndTime: data.duration,
          width: currentZoomSectionWidth * data.duration,
          videoData: data,
          duration: data.duration,
          // subtitleList: resSubtitle,
          id: new Date().getTime()
        }]
        list.splice(targetIndex, 0, ...newArray)
        const _index = targetIndex + 1
        for (let i = _index; i < list.length; i++) {
          list[i].start += newArray[0].end - newArray[0].start
          list[i].end += newArray[0].end - newArray[0].start
        }
      }
      this.cutLineList = list
      this.updateAllCutLineListTotalDuration()
      this.updateCurrentDragItemData({})
      this.saveOperateClipsVideoCutting()
      // this.saveOperateClipsVideoCutting()
    },
    // 片段拖入后
    async dragEndCutItem(endIndex, historyData) {
      let targetIndex = endIndex
      let sourceIndex
      if (historyData && Object.keys(historyData).length > 0) {
        targetIndex = historyData.start
        sourceIndex = historyData.end
      } else {
        sourceIndex = Number(event.dataTransfer.getData('text/plain'))
      }
      const copyCutLineList = JSON.parse(JSON.stringify(this.cutLineList))
      const _startItem = JSON.parse(JSON.stringify(copyCutLineList[targetIndex]))
      const _sourceItem = JSON.parse(JSON.stringify(copyCutLineList[sourceIndex]))
      copyCutLineList[targetIndex] = _sourceItem
      copyCutLineList[sourceIndex] = _startItem
      const max = copyCutLineList.length
      copyCutLineList.forEach((item, index) => {
        if (index === 0) {
          item.start = 0
          item.end = 0 + item.duration
        } else if (index < max) {
          item.start = copyCutLineList[index - 1].end
          item.end = item.start + item.duration
        }
      })
      this.cutLineList = copyCutLineList
      this.video.cutLineList = this.cutLineList
      console.log(this.cutLineList, '交互位置后的数据')
      this.setActionHistory({
        eventFun: 'change',
        data: {
          start: sourceIndex,
          end: targetIndex
        }
      })
      this.saveOperateClipsVideoCutting()
    },
    async dragLastItemEnd(targetIndex) {
      const currentDragVideoData = this.video.currentDragItemData
      const currentCutItemData = this.currentCutItemData
      const currentZoomSectionWidth = this.video.currentZommEachSectionWidth
      const lastCutItemData = this.cutLineList[this.cutLineList.length - 1]
      // 根据当前拖入片段是否有值，判断是片段拖入还是新增视频拖入
      if (Object.keys(currentCutItemData).length > 0) {
        const deleteIndex = this.cutLineList.findIndex(item => item.id === currentCutItemData.id)
        this.cutLineList.splice(deleteIndex, 1)
        this.cutLineList.push(currentCutItemData)
        this.createCutLineList()
        this.setActionHistory({
          eventFun: 'change',
          data: {
            start: deleteIndex,
            end: this.cutLineList.length - 1
          }
        })
      } else {
        let start = 0
        let end = currentDragVideoData.duration
        const res = await frameExtractingList({ videoId: currentDragVideoData.id })
        currentDragVideoData.frameData = res.data
        // 片段拖入到最后一个位置
        if (lastCutItemData && Object.keys(lastCutItemData).length) {
          start = lastCutItemData.end
          end = lastCutItemData.end + currentDragVideoData.duration
        }

        this.cutLineList.push({
          start,
          end,
          refVideoId: currentDragVideoData.id,
          videoPlayStartTime: 0,
          videoPlayEndTime: currentDragVideoData.duration,
          width: currentZoomSectionWidth * currentDragVideoData.duration,
          videoData: currentDragVideoData,
          // subtitleList: resSubtitle,
          duration: currentDragVideoData.duration,
          id: new Date().getTime(),
          fIndex: this.cutLineList.length
        })
      }
      console.log(this.cutLineList, '交互位置后的数据')
      // const resSubtitle = await subtitleList({ videoId: currentDragVideoData.id })
      this.updateAllCutLineListTotalDuration()
      this.updateCurrentDragItemData({})
      this.saveOperateClipsVideoCutting()
    }

  }

}
