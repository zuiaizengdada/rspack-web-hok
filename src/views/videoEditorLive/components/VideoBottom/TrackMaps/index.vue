<template>
  <div
    class="track-maps-container relative"
    @drop="dragEnd"
    @dragover="dragOver($event)"
  >
    <div
      v-for="(item,index) in mapsList"
      :key="item.videoStickerId"
      :class="{'active':index===activeMapsItemIndex}"
      class="maps-item absolute truncate"
      :style="{left:item.leftTrack+'px',width:item.widthTrack+'px'}"
      @mousedown.stop="mousedownFun($event,item,index)"
    >
      <span class="line line-left " @mousedown.stop="mousedownLineFun($event,index,'left')" @mouseup.stop="mouseupLineFun" />
      <p class=" cursor-move"> {{ item.name }}</p>
      <span class="line line-right " @mousedown.stop="mousedownLineFun($event,index,'right')" @mouseup.stop="mouseupLineFun" />
    </div>
  </div>
</template>
<script>
import Vue from 'vue'
import hotkeys from 'hotkeys-js'
import { mixinsMoveMapsItem } from './mixinsMoveMapsItem'
import { mixinsMoveMapsLine } from './mixinsMoveMapsLine'
import { deleteSticker, updateSticker, addSticker, listSticker } from '../../../api/live.js'
export default {
  inject: [
    'video',
    'updataMapsList',
    'updateVideoSeekTime',
    'updateCurrentDragItemData',
    'updateMapsUpdateList'
  ],
  mixins: [mixinsMoveMapsItem, mixinsMoveMapsLine],
  data() {
    return {
      mapsList: [],
      activeMapsItemIndex: -1
    }
  },
  computed: {
    getActiveSliderInfo() {
      return this.video.activeSliderInfo
    },
    getCurrentSelectCutItemList() {
      return this.video.currentSelectCutItemList
    },
    getVideoDetail() {
      return this.video.detail
    }

  },
  watch: {
    getActiveSliderInfo() {
      const currentZoomSectionWidth = this.video.currentZommEachSectionWidth
      this.mapsList.forEach(item => {
        const duration = item.endTime - item.startTime
        const left = item.startTime * currentZoomSectionWidth
        const width = duration * currentZoomSectionWidth
        item.leftTrack = left
        item.widthTrack = width
      })
    },
    getCurrentSelectCutItemList(val) {
      if (val.length) {
        this.activeMapsItemIndex = -1
      }
    },
    getVideoDetail() {
      this.getlistStickerData()
    }
  },
  mounted() {
    // 快捷键，上传当前索引值的标记
    hotkeys('delete', (e) => {
      e.preventDefault()
      this.deleteMarkItem()
    })

    Vue.prototype.videEditorLiveupdateStickerItem = () => {
      console.log(this.video.currentMoveMapsItemData, 'videEditorLiveupdateStickerItem')
      this.updateStickerItem(this.video.currentMoveMapsItemData)
    }
  },
  methods: {
    async dragEnd(e) {
      const dragData = this.video.currentDragItemData
      // 只允许贴图元素添加
      if (dragData.dragId) {
        const currentZoomSectionWidth = this.video.currentZommEachSectionWidth
        const $tracksBox = document.querySelector('.content-right .tracks-box')
        const scrollLefet = $tracksBox.scrollLeft
        const left = scrollLefet + (e.clientX - 120)
        const startTime = Number((left / currentZoomSectionWidth).toFixed(3))
        dragData.startTime = startTime
        this.addStickerData(dragData)
      }
      this.updateCurrentDragItemData({})
    },

    getCanvasVideoData(isCanvas = true) {
      const $canvas = document.querySelector('.player-content #player')
      const canvasWidth = $canvas.clientWidth
      const canvasHeight = $canvas.clientHeight
      const videoWidth = this.video.detail.width
      const videoHeight = this.video.detail.height
      if (isCanvas) {
        const widthCanvasScale = canvasWidth / videoWidth
        const heightCanvasScale = canvasHeight / videoHeight
        return {
          widthCanvasScale,
          heightCanvasScale
        }
      }
    },
    getCanvasVideoScale(isCanvas = true) {
      const $canvas = document.querySelector('.player-content #player')
      const canvasWidth = $canvas.clientWidth
      const canvasHeight = $canvas.clientHeight
      const videoWidth = this.video.detail.width
      const videoHeight = this.video.detail.height
      if (isCanvas) {
        const widthCanvasScale = canvasWidth / videoWidth
        const heightCanvasScale = canvasHeight / videoHeight
        return {
          widthCanvasScale,
          heightCanvasScale
        }
      }
    },
    async addStickerData(data) {
      const $canvas = document.querySelector('.player-content #player')
      const canvasWidth = $canvas.clientWidth
      // const canvasHeight = $canvas.clientHeight
      const { widthCanvasScale } = this.getCanvasVideoData()
      const { projectId } = this.$route.query
      const { url, stickerType, name, startTime } = data
      let width = 0
      let height = 0
      let color = ''
      if (stickerType === '2') {
        const { imgWidth, imgHeight } = await this.getImgUrlWidthAndHeight(url)
        const m = Math.round(imgWidth / canvasWidth) + 1
        console.log(m)
        console.log(imgWidth, imgHeight, '图片宽高。。。')
        // xpos = (canvasWidth / 2 - width / 2) / widthCanvasScale
        // const _width = imgWidth / m
        // const _height = imgHeight / m
        // xpos = (canvasWidth / 2 - _width / 2) / widthCanvasScale
        // ypos = (canvasHeight / 2 - _height / 2) / widthCanvasScale
        width = (imgWidth / m) / widthCanvasScale
        height = (imgHeight / m) / widthCanvasScale
      } else {
        // 色块添加
        // xpos = (canvasWidth / 2 - 50) / widthCanvasScale
        // ypos = (canvasHeight / 2 - 50) / widthCanvasScale
        width = Math.round(100 / widthCanvasScale)
        height = Math.round(100 / widthCanvasScale)
        color = '#fff'
      }
      // const canvasXpos = canvasWidth / 2 - width / 2
      // const canvasYpos = canvasHeight / 2 - height / 2
      await addSticker({
        canvasXpos: 20,
        canvasYpos: 20,
        color,
        duration: 4,
        width,
        height,
        name,
        projectId,
        rotateAngle: 0,
        startTime,
        stickerType,
        url,
        type: 1,
        xpos: 0,
        ypos: 0
      })

      this.getlistStickerData()
    },
    async getlistStickerData() {
      const { projectId } = this.$route.query
      const currentZoomSectionWidth = this.video.currentZommEachSectionWidth
      const res = await listSticker({
        projectId,
        pageIndex: 1,
        pageSize: 100
      })
      res.data.forEach(item => {
        item.leftTrack = item.startTime * currentZoomSectionWidth
        item.endTime = item.startTime + item.duration
        item.widthTrack = item.duration * currentZoomSectionWidth
      })

      this.mapsList = res.data
      this.video.mapsList = this.mapsList
    },
    dragOver(e) {
      e.preventDefault()
    },
    getImgUrlWidthAndHeight(url) {
      return new Promise((resolve, reject) => {
        var image = new Image()
        image.onload = function() {
          console.log(image, '图片对象。。')
          resolve({
            imgWidth: image.width,
            imgHeight: image.height
          })
        }
        image.src = url
      })
    },
    async updateStickerItem(data) {
      const { canvasXpos, canvasYpos, color, duration, height, name, projectId, angle, startTime, stickerType, type, url, videoStickerId, width, xpos, ypos } = data
      const params = {
        color,
        canvasXpos,
        canvasYpos,
        duration,
        height: Math.round(height),
        name,
        projectId,
        rotateAngle: angle,
        startTime,
        stickerType,
        type,
        url,
        videoStickerId,
        width: Math.round(width),
        xpos,
        ypos
      }
      await updateSticker(params)
    },
    async deleteMarkItem() {
      const index = this.activeMapsItemIndex
      if (index > -1) {
        const data = this.video.mapsList[index]
        this.$set(this.video.currentMoveMapsItemData, 'isDelete', true)
        await deleteSticker({
          videoStickerId: data.videoStickerId
        })
        this.$message.success('删除成功')
        this.getlistStickerData()
        this.activeMapsItemIndex = -1
      }
    }

  }
}
</script>
<style lang="scss" scoped>
.track-maps-container{
     height:100px;
    // background: #eee;
    z-index: 2;
    .maps-item{
        top:50%;
        transform:translateY(-50%);
        height: 20px;
        background: #D8D8D8;
        border-radius: 2px;
         border: 1px solid #D8D8D8;
         font-size:12px;
         color:#333;
         padding:0 6px;
         line-height: 20px;
         position: absolute;
        .line{
          position: absolute;
          top:0;
          width:4px;
          background: #1778ff;
          height:100%;
          display: none;
          z-index: 2;
          &.line-left{
            left:-1px;
          }
          &.line-right{
            right:-1px;
          }
        }
        &.active{
             border: 1px solid #1778ff;
             z-index: 2;
             .line{
                display: block;
                cursor:col-resize;

             }
        }
    }
}
</style>
