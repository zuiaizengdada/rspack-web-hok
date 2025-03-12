<template>
  <div class="fabric-container flex justify-center items-center">
    <canvas id="canvas" ref="canvas" style="width:100%;height:100%" />
  </div>
</template>
<script>
import OSS from 'ali-oss'
import { getOssToken } from '@/api/qiniu'
import { fabric } from 'fabric'
export default {
  inject: ['video', 'updateCurrentMoveMapsItemData'],
  data() {
    return {
      fabricCanvas: null,
      mapsList: [],
      isComplete: false,
      currentColor: ''
    }
  },
  computed: {
    getMapsList() {
      return this.video.mapsList
    },
    getCurrentTime() {
      return this.video.currentTime
    },
    getVideoDetail() {
      return this.video.detail
    },
    getVideoRightTickerPanel() {
      return this.video.rightTickerPanelColor
    }

  },
  watch: {
    getCurrentTime(val) {
      this.visibleFrameFixImage(val)
      this.visibleCanvasDom(val)
    },
    async getVideoRightTickerPanel(val) {
      if (val) {
        let currentMoveMapsItemData = this.video.currentMoveMapsItemData
        const index = this.video.mapsList.findIndex(item => item.videoStickerId === this.video.currentMoveMapsItemData.videoStickerId)
        this.video.mapsList[index].canvas.set('fill', val)
        const dataURL = currentMoveMapsItemData.canvas.toDataURL({
          format: 'png',
          quality: 1
        })
        const rectURL = await this.ossUploadImg(dataURL)
        this.video.mapsList[index].url = rectURL
        currentMoveMapsItemData = this.video.mapsList[index]
        this.videEditorLiveupdateStickerItem()
        this.fabricCanvas.renderAll()
        this.video.rightTickerPanelColor = ''
      }
    },
    'video.currentMoveMapsItemData': {
      handler(data) {
        if (data.isDelete) {
          console.log(data, '刪除監聽。。')
          this.removeActiveCanvas()
          this.video.currentMoveMapsItemData = {}
        }
      },
      deep: true
    },
    getVideoDetail() {
      this.initFabric()
    },
    getMapsList(list) {
      this.fabricCanvas.clear()
      this.fabricCanvas.renderAll()
      list.length && list.forEach(item => {
        if (item.stickerType === '2') {
          this.fabricToImage(item)
        } else {
          this.fabricToRect(item)
        }
      })
    }
  },
  methods: {
    initFabric() {
      const $player = document.querySelector('.player-content #player')
      const playerWidth = $player.clientWidth
      const playerHeight = $player.clientHeight
      this.fabricCanvas = new fabric.Canvas('canvas')
      this.fabricCanvas.setWidth(playerWidth)
      this.fabricCanvas.setHeight(playerHeight)

      this.fabricCanvas.on('object:modified', (event) => {
        const currentMoveMapsItemData = this.video.currentMoveMapsItemData
        if (Object.keys(currentMoveMapsItemData).length === 0) return
        const modifiedObject = event.target
        // 监听选中元素的修改
        if (currentMoveMapsItemData.stickerType === '1') {
          this.modifiedFabricRect(modifiedObject)
        } else {
          this.modefiedFabricImage(modifiedObject)
        }
      })
    },
    removeActiveCanvas() {
      const activeObject = this.fabricCanvas.getActiveObject()
      this.fabricCanvas.remove(activeObject)
      this.fabricCanvas.discardActiveObject()
      this.fabricCanvas.renderAll()
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
    // 生成色块元素
    async fabricToRect(data) {
      // const $canvas = document.querySelector('.player-content #player')
      // const canvasWidth = $canvas.clientWidth
      // const canvasHeight = $canvas.clientHeight
      const { widthCanvasScale } = this.getCanvasVideoScale()
      const { width, height, rotateAngle, color, canvasYpos, canvasXpos } = data
      // const { xpos, ypos } = data
      // const rectCenterXpos = (canvasWidth / 2 - width * widthCanvasScale / 2)
      // const rectCenterYpos = (canvasHeight / 2 - height * widthCanvasScale / 2)
      // const rectXpos = (Number(xpos)) * widthCanvasScale
      // const rectYpos = (Number(ypos)) * widthCanvasScale
      const params = {
        // left: rectXpos + rectCenterXpos,
        // top: rectYpos + rectCenterYpos,
        left: Number(canvasXpos),
        top: Number(canvasYpos),
        fill: color,
        width: width * widthCanvasScale,
        height: height * widthCanvasScale,
        angle: Number(rotateAngle),
        hasControls: true,
        visible: false,
        lockRotation: true,
        centerX: 'center',
        centerY: 'center'
      }
      console.log(params, '元素生成参数。。。')
      const rect = new fabric.Rect(params)
      this.fabricCanvas.add(rect)
      data.canvas = rect
    },

    // 生成图片元素
    fabricToImage(data) {
      // const $canvas = document.querySelector('.player-content #player')
      // const canvasWidth = $canvas.clientWidth
      // const canvasHeight = $canvas.clientHeight
      const { widthCanvasScale } = this.getCanvasVideoScale()
      fabric.Image.fromURL(data.url, async (img) => {
        //  const { width, height, xpos, rotateAngle, ypos } = data
        const { width, height, rotateAngle, canvasYpos, canvasXpos } = data
        // const rectXpos = Number(xpos) * widthCanvasScale
        // const rectYpos = Number(ypos) * widthCanvasScale
        // const rectCenterXpos = (canvasWidth / 2 - width * widthCanvasScale / 2)
        // const rectCenterYpos = (canvasHeight / 2 - height * widthCanvasScale / 2)
        const params = {
          // left: rectXpos + rectCenterXpos,
          // top: rectYpos + rectCenterYpos,
          left: Number(canvasXpos),
          top: Number(canvasYpos),
          angle: Number(rotateAngle),
          visible: false,
          lockRotation: true,
          centerX: 'center',
          centerY: 'center',
          scaleToWidth: width * widthCanvasScale,
          scaleToHeight: height * widthCanvasScale,
          scaleY: 0.2,
          scaleX: 0.2
        }
        console.log(params, '图片生成参数。。。')
        img.set(params)
        // 将图片添加到 canvas
        this.fabricCanvas.add(img)
        data.canvas = img
      })
    },
    async modifiedFabricRect(rect) {
      const $canvas = document.querySelector('.player-content #player')
      const canvasWidth = $canvas.clientWidth
      const canvasHeight = $canvas.clientHeight
      const { widthCanvasScale } = this.getCanvasVideoScale()
      const currentMoveMapsItemData = this.video.currentMoveMapsItemData
      const { width, height, left, top, angle, fill, scaleX, scaleY } = rect
      const dataURL = rect.toDataURL({
        format: 'png',
        quality: 1
      })

      const rectURL = await this.ossUploadImg(dataURL)
      const centerXpos = canvasWidth / 2 - width * scaleX / 2
      const centerYpos = canvasHeight / 2 - height * scaleY / 2
      console.log(left, top, centerXpos, centerYpos, '修改的元素。。。')
      currentMoveMapsItemData.width = (width * scaleX) / widthCanvasScale
      currentMoveMapsItemData.color = fill
      currentMoveMapsItemData.url = rectURL
      currentMoveMapsItemData.height = (height * scaleY) / widthCanvasScale
      currentMoveMapsItemData.xpos = (left - centerXpos) / widthCanvasScale
      currentMoveMapsItemData.ypos = (top - centerYpos) / widthCanvasScale
      currentMoveMapsItemData.canvasXpos = left
      currentMoveMapsItemData.canvasYpos = top
      currentMoveMapsItemData.angle = angle
      console.log(currentMoveMapsItemData, '修改后的数据。。。')
      this.videEditorLiveupdateStickerItem()
    },
    modefiedFabricImage(image) {
      const $canvas = document.querySelector('.player-content #player')
      const canvasWidth = $canvas.clientWidth
      const canvasHeight = $canvas.clientHeight
      const currentMoveMapsItemData = this.video.currentMoveMapsItemData
      const { width, height, left, top, angle, scaleX, scaleY } = image
      const centerXpos = canvasWidth / 2 - width * scaleX / 2
      const centerYpos = canvasHeight / 2 - height * scaleY / 2
      const { widthCanvasScale } = this.getCanvasVideoScale()
      currentMoveMapsItemData.width = (width * scaleX) / widthCanvasScale
      currentMoveMapsItemData.height = (height * scaleY) / widthCanvasScale
      currentMoveMapsItemData.xpos = (left - centerXpos) / widthCanvasScale
      currentMoveMapsItemData.ypos = (top - centerYpos) / widthCanvasScale
      currentMoveMapsItemData.canvasXpos = left
      currentMoveMapsItemData.canvasYpos = top
      currentMoveMapsItemData.angle = angle
      this.videEditorLiveupdateStickerItem()
    },
    // 监听播放器当前时间，控制canvas 内部元素显示
    visibleCanvasDom(val) {
      const list = this.video.mapsList
      this.video.currentMoveMapsItemData = {}
      list.forEach(item => {
        if (val >= item.startTime && val <= item.endTime) {
          item.canvas.visible = true
          this.video.currentMoveMapsItemData = item
          setTimeout(() => {
            this.fabricCanvas.setActiveObject(item.canvas)
            this.fabricCanvas.renderAll()
          }, 400)
        } else {
          item.canvas.visible = false
          this.fabricCanvas.discardActiveObject()
          this.fabricCanvas.renderAll()
        }
      })
    },
    // 动态设置帧定格
    visibleFrameFixImage(val) {
      const frameFixList = this.video.videoFrameFixList
      if (frameFixList.length) {
        frameFixList.forEach(item => {
          const endTime = item.startTime + item.duration
          if (val >= item.startTime && val <= endTime) {
            if (!item.setBackgroundImage) {
              this.fabricCanvas.setBackgroundImage(item.content, this.fabricCanvas.renderAll.bind(this.fabricCanvas), {
                left: 0,
                top: 0,
                originX: 'left',
                originY: 'top'
              })
              item.setBackgroundImage = true
            }
          } else {
            this.fabricCanvas.setBackgroundImage(null, this.fabricCanvas.renderAll.bind(this.fabricCanvas))
            item.setBackgroundImage = false
          }
        })
      } else {
        if (this.fabricCanvas) {
          this.fabricCanvas.setBackgroundImage(null, this.fabricCanvas.renderAll.bind(this.fabricCanvas))
        }
      }
    },

    async ossUploadImg(base64) {
      const response = await fetch(base64)
      const blobData = await response.blob()
      const file = new File([blobData], 'image.png', { type: 'image/png' })
      const { data } = await getOssToken()
      const fileName = 'hok_video_live/' + new Date().getTime() + '.png'
      const oss = new OSS({
        region: 'oss-accelerate',
        accessKeyId: data.accessKeyId,
        accessKeySecret: data.accessKeySecret,
        bucket: data.ossBucket,
        secure: true
      })
      await oss.multipartUpload(fileName, file, {})
      return `${data.ossBucketUrl}${fileName}`
    }
  }

}
</script>
<style lang="scss" scoped>
.canvas-container{
    width:100%;
    height:100%;
}
</style>
