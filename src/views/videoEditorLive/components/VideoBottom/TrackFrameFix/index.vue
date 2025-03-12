<template>
  <div class="track-fix-conatiner">
    <ul class="relative">
      <li
        v-for="(item,index) in fixList"
        :key="item.frameHoldId"
        class="absolute fix-item"
        :class="{active:index===activeFixItemIndex}"
        :style="{left:item.left+'px',width:item.width+'px'}"
      >
        <span class="line line-left" />
        <p style="width:100%;height:100%" @click="handleClickFixItem(index)" @mousedown="mouseDownFun(index)">帧定格</p>
        <span class="line line-right" />
      </li>
    </ul>
  </div>
</template>
<script>
import OSS from 'ali-oss'
import { getOssToken } from '@/api/qiniu'
import hotkeys from 'hotkeys-js'
import { frameHold, frameHoldList, deleteframeHold } from '../../../api/live.js'
export default {
  inject: [
    'video',
    'updateCurrentSelectCutItemList'
  ],
  data() {
    return {
      fixList: [],
      activeFixItemIndex: -1,
      isMouseDown: false
    }
  },
  computed: {
    getActiveSliderInfo() {
      return this.video.activeSliderInfo
    },
    getCurrentSelectCutItemList() {
      return this.video.currentSelectCutItemList
    }
  },
  watch: {
    getActiveSliderInfo() {
      const currentZoomSectionWidth = this.video.currentZommEachSectionWidth
      this.fixList.forEach(item => {
        // const duration = item.endTime - item.startTime
        const left = item.startTime * currentZoomSectionWidth
        const width = item.duration * currentZoomSectionWidth
        item.left = left
        item.width = width
        console.log(item, 1111111)
        this.$set(item, 'left', left)
        this.$set(item, 'width', width)
      })
    },
    getCurrentSelectCutItemList(val) {
      if (val.length) {
        this.activeFixItemIndex = -1
      }
    }
  },
  mounted() {
    this.getFrameHoldList()
    this.initFrameFixAction()
    this.initCancelFixSelect()
    // 快捷键，上传当前索引值的标记
    hotkeys('delete', (e) => {
      e.preventDefault()
      this.handleKeyDownDeleteframeHold()
    })
  },
  methods: {
    async getFrameHoldList() {
      const projectId = this.$route.query.projectId
      const res = await frameHoldList({ projectId })
      const currentZoomSectionWidth = this.video.currentZommEachSectionWidth
      res.data.forEach(item => {
        item.width = item.duration * currentZoomSectionWidth
        item.left = item.startTime * currentZoomSectionWidth
      })
      setTimeout(() => {
        this.fixList = res.data
        this.video.videoFrameFixList = JSON.parse(JSON.stringify(res.data))
      }, 200)
    },
    async initFrameFixAction() {
      const frameBtn = document.querySelectorAll('.bar-left .icon-list img')[5]
      frameBtn.addEventListener('click', async () => {
        const currentSelectCutItemList = this.video.currentSelectCutItemList
        if (frameBtn.classList.contains('disable')) return
        if (currentSelectCutItemList.length > 1) return
        const $video = document.querySelector('#player video')
        const canvas = document.createElement('canvas')
        canvas.width = $video.clientWidth
        canvas.height = $video.clientHeight
        // 在 Canvas 上绘制 DOM 元素
        const context = canvas.getContext('2d')
        context.drawImage($video, 0, 0, canvas.width, canvas.height)
        const dataURL = canvas.toDataURL('image/png')

        const currentSelectIndex = currentSelectCutItemList[0]
        const currentSelectItem = this.video.cutLineList[currentSelectIndex]
        const { duration, start, refVideoId, videoPlayStartTime } = currentSelectItem
        const projectId = this.$route.query.projectId
        const ossImgURL = await this.ossUploadImg(dataURL)
        await frameHold({
          content: ossImgURL,
          duration,
          intercepTime: videoPlayStartTime,
          intercepVideoId: refVideoId,
          projectId,
          startTime: start
        })
        this.getFrameHoldList()
      })
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
    },
    async handleKeyDownDeleteframeHold() {
      if (this.activeFixItemIndex > -1) {
        await deleteframeHold({
          frameHoldId: this.fixList[this.activeFixItemIndex].frameHoldId
        })
        this.activeFixItemIndex = -1
        this.getFrameHoldList()
      }
    },
    initCancelFixSelect() {
      const $tracksBox = document.querySelector('.tracks-box')
      $tracksBox.addEventListener('click', () => {
        if (this.isMouseDown) {
          // this.activeFixItemIndex = index
          this.updateCurrentSelectCutItemList([])
        } else {
          this.activeFixItemIndex = -1
        }
        this.isMouseDown = false
      })
    },
    mouseDownFun(index) {
      this.isMouseDown = true
      this.activeFixItemIndex = index
    },
    handleClickFixItem(index) {

    }
  }
}
</script>
<style lang="scss" scoped>
.track-fix-conatiner{
    height:24px;
    .fix-item{
        background: #eee;
        height: 20px;
        border-radius: 2px;
        cursor: pointer;
        opacity: .5;
        border:2px solid #eee;
        &.active{
             border:2px solid #0C6FFF;
        }
        p{
            font-size:12px;
            padding-left:10px;
            color:#333;
            line-height:16px;
        }
    }
}
</style>
