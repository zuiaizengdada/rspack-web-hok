<template>
  <div>
    <AppDialog :value="visible" :title="'设置默认封面'" @close="close">
      <div v-if="visible" class="cutout-content">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="截取封面" name="1">
            <div v-loading="isLoading" class="cropper">
              <!--              :auto-crop-height="option.autoCropHeight"-->
              <vueCropper
                v-if="activeName == 1"
                ref="cropper"
                :loading="isLoading ? '视频抽帧中...' : ''"
                style="background-image: none"
                :img="option.img"
                :auto-crop="option.autoCrop"
                :output-size="option.outputSize"
                :output-type="option.outputType"
                :info="option.info"
                :fixed="option.fixed"
                :fixed-number="option.fixedNumber"
                :auto-crop-width="option.autoCropWidth"
                :auto-crop-height="option.autoCropHeight"
                :full="option.full"
                :can-move="option.canMove"
                :can-move-box="option.canMoveBox"
                :original="option.original"
                :center-box="option.centerBox"
                :height="option.height"
                :info-true="option.infoTrue"
                :max-img-size="option.maxImgSize"
                :enlarge="option.enlarge"
                :mode="option.mode"
                @realTime="realTime"
              />
            </div>
            <div style="width: 100%;display: flex;justify-content: center;">
              <div id="videoBox" class="videoBox" @dragover.prevent>
                <div
                  v-if="!isLoading"
                  id="schedule"
                  class="schedule"
                  :style="{ left: `${x}px` }"
                  @mousedown="handleMouseDown"
                >
                  <span class="span1" />
                  <span class="span2" />
                </div>
                <span v-if="!isLoading" class="currentTime" :style="{ left: `${x-12}px` }">{{ currentTime }}</span>
                <img
                  v-for="(item, index) in extractedFramesList"
                  :key="index"
                  :src="item"
                  alt=""
                  style="width: 40px; height: 60px;user-select: none"
                  @dragstart.prevent
                />
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="上传封面" name="2">
            <div class="window-list">
              <el-upload
                v-if="!coverPhoto"
                ref="upload"
                class="upload-demo"
                drag
                action="#"
                multiple
                :limit="1"
                :http-request="fileChange"
                :show-file-list="false"
                :before-upload="beforeUpload"
                :on-exceed="onExceed"
              >
                <i class="el-icon-upload" />
                <div class="el-upload__text">
                  将文件拖到此处，或<em>点击上传</em>
                </div>
                <div class="el-upload__text m-t-10">{{ tips }}</div>
              </el-upload>
              <div v-if="coverPhoto" class="cropper-img">
                <vueCropper
                  v-if="activeName == 2"
                  ref="cropper1"
                  style="background-image: none"
                  :img="option.img"
                  :auto-crop="option.autoCrop"
                  :auto-crop-width="option.autoCropWidth"
                  :auto-crop-height="option.autoCropHeight"
                  :output-size="option.outputSize"
                  :output-type="option.outputType"
                  :info="option.info"
                  :fixed="option.fixed"
                  :fixed-number="option.fixedNumber"
                  :full="option.full"
                  :can-move="option.canMove"
                  :can-move-box="option.canMoveBox"
                  :original="option.original"
                  :center-box="option.centerBox"
                  :height="option.height"
                  :info-true="option.infoTrue"
                  :max-img-size="option.maxImgSize"
                  :enlarge="option.enlarge"
                  :mode="option.mode"
                  @realTime="realTime"
                />
              </div>
              <el-upload
                v-if="coverPhoto"
                class="upload-demo1"
                action="#"
                :http-request="fileChange"
                :show-file-list="false"
                :before-upload="beforeUpload"
                accept="image/jpg,image/jpeg,image/png"
                :on-exceed="onExceed"
              >
                <el-button size="small" type="primary">重新上传</el-button>
              </el-upload>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
      <div slot="footer" class="ss-material-box-bottom">
        <el-button size="small" @click="close()">取消</el-button>
        <el-button
          size="small"
          type="primary"
          @click="submit()"
        >确定</el-button>
      </div>
    </AppDialog>
  </div>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import { blobToBase64 } from '@/utils'
import { imgBase64 } from '@/api/course'
// 创建一个video元素
const video = document.createElement('video')
video.crossOrigin = 'anonymous'
// 创建一个canvas元素
const canvas = document.createElement('canvas')
const ctx = canvas.getContext('2d')
// 抽帧间隔
let frameStep = 0 // 每秒抽取一帧
// import { getHuoshanPosterUrl } from '@/utils'
export default {
  name: 'Index',
  components: {
    AppDialog
  },
  inject: ['video'],
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    isBilibili: {
      type: String,
      default: ''
    },
    // 截图图片列表
    cutOutImgList: {
      type: Array,
      default: () => {
        return []
      }
    },
    cutOutImg: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      activeName: '1',
      tips: '推荐选择与视频尺寸相符合的图片',
      coverPhoto: '',
      x: 0,
      startX: 0,
      startLeft: 0,
      currentTime: '00:00',
      dragging: false,
      isLoading: false,
      extractedFramesList: [], // 抽帧图列表
      option: {
        img: '',
        outputSize: 1, // 裁剪生成图片的质量(可选0.1 - 1)
        outputType: 'png', // 裁剪生成图片的格式（jpeg || png || webp）
        info: true, // 裁剪框的大小信息，图片大小信息
        full: true, // 是否输出原图比例的截图，false按原比例裁切图片，不失真
        height: true, // 是否按照设备的dpr 输出等比例图片
        maxImgSize: 2000, // 限制图片最大宽度和高度
        enlarge: 1, // 图片根据截图框输出比例倍数
        autoCrop: true, // 是否默认生成截图框 默认false
        canMove: false, // 上传图片是否可以移动 默认true
        autoCropWidth: '500', // 默认生成截图框宽度	容器的80%	0~max
        fixedNumber: [3, 4], // 截图框的宽高比例 [宽度, 高度]
        autoCropHeight: '200', // 默认生成截图框高度	容器的80%	0~max
        fixed: true, // 是否开启截图框宽高固定比例
        original: false, // 上传图片按照原始比例渲染	false	true | false
        infoTrue: false, // 为展示真实输出图片宽高 false 展示看到的截图框宽高	false	true | false
        centerBox: true, // 截图框是否被限制在图片里面	false	true | false
        canMoveBox: true // 截图框能否拖动	true	true | false
      }
    }
  },
  watch: {
    cutOutImg: {
      handler() {
        console.log(this.cutOutImg, '截图')
        this.option.img = this.cutOutImg
        this.initData()
      }
    },
    visible: {
      handler(val) {
        if (val) {
          console.log('打开了截图弹窗')
          this.extractedFramesList = []
          this.startExtraction()
        }
        this.initData()
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    startExtraction() {
      const that = this
      this.isLoading = true
      // 当视频元数据加载完成后
      video.onloadedmetadata = function () {
        console.log(video, '视频')
        console.log(video.duration)
        Number(video.duration.toFixed(2))
        // 设置canvas的大小与视频帧的大小相同
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        frameStep = Number((video.duration / 9).toFixed(2))
        // 开始抽帧
        extractFrames()
      }

      // 抽帧函数
      function extractFrames() {
        console.log(video.currentTime, video.duration, frameStep, '视频的播放时间')
        // 64.040634 64.040635 7.113000777777779 '视频的播放时间'
        // 如果视频还没有播放完
        if (video.duration - video.currentTime > 0.01) {
          console.log(video.currentTime, video.duration, frameStep, '视频的播放时间1111')
          video.currentTime += frameStep
        } else {
          console.log('视频播放完毕移除了事件')
          that.isLoading = false
          // 如果视频已经播放完，移除seeked事件监听器
          video.removeEventListener('seeked', drawVideo)
        }
      }
      // 当视频的播放位置改变后
      video.addEventListener('seeked', drawVideo)
      function drawVideo() {
        console.log('添加了监听')
        // 绘制当前帧到canvas上
        ctx.drawImage(video, 0, 0)

        // 获取当前帧的图片数据
        const frameData = canvas.toDataURL('image/png')
        that.extractedFramesList.push(frameData)
        console.log(that.extractedFramesList, '抽帧图列表')
        // this.imgSrc = this.extractedFramesList.value[0]
        // 继续抽帧
        extractFrames()
      }
      console.log(this.video, '视频信息')
      // 加载视频
      video.src = this.video.data.videoDownloadUrl
    },
    handleMouseDown(event) {
      console.log(event)
      this.startX = event.clientX
      this.startLeft = this.x
      this.dragging = true
      window.addEventListener('mousemove', this.handleMouseMove)
      window.addEventListener('mouseup', this.handleMouseUp)
    },
    handleMouseMove(event) {
      if (!this.dragging) return
      // 计算新的x坐标
      let newX = this.startLeft + event.clientX - this.startX
      // 获取videoBox的宽度
      const videoBoxWidth = document.getElementById('videoBox').offsetWidth
      // 检查新的x坐标是否在边界内
      if (newX < 0) {
        newX = 0
      } else if (newX > videoBoxWidth) {
        newX = videoBoxWidth
      }
      // 更新x坐标
      this.x = newX
    },
    handleMouseUp(event) {
      this.dragging = false
      // 鼠标离开后获取鼠标在videoBox中的位置百分比
      const percent = this.x / document.getElementById('videoBox').offsetWidth
      // 根据百分比计算视频的播放位置
      video.currentTime = percent * video.duration
      // 转换成00:00格式
      const newTime = this.formatTime(video.currentTime)
      this.currentTime = newTime

      // 绘制当前帧到canvas上
      ctx.drawImage(video, 0, 0)
      // 获取当前帧的图片数据
      const frameData = canvas.toDataURL('image/png')
      this.option.img = frameData
      window.removeEventListener('mousemove', this.handleMouseMove)
      window.removeEventListener('mouseup', this.handleMouseUp)
    },
    formatTime(val) {
      let m = Math.floor(val / 60)
      let s = Math.floor(val % 60)
      m = m < 10 ? `0${m}` : m
      s = s < 10 ? `0${s}` : s
      return `${m}:${s}`
    },
    // 初始化数据
    initData() {
      // const { width, height } = this.video.data
      this.option.img = this.video.data.posterUrl
      if (this.isBilibili === '15') {
        this.option.fixedNumber = [4, 3]
      }
      // const that = this
      const img = new Image()
      img.src = this.option.img
      img.onload = function () {
        // console.log(this.width, '')
        // that.option.autoCropWidth = 'max'
        // console.log(img, '图片信息')
      }
    },
    handleClick(tab) {
      if (tab.name === '1') {
        this.option.img = this.cutOutImg
        this.initData()
      } else {
        this.option.img = this.coverPhoto
      }
    },
    realTime() {},
    // 提交
    submit() {
      const _this = this
      let obj = {}
      if (this.activeName === '1') {
        obj = {
          width: this.$refs.cropper.cropW.toFixed(0),
          height: this.$refs.cropper.cropH.toFixed(0)
        }
        this.$refs.cropper.getCropBlob(data => {
          _this.success && _this.success(data, obj)
        })
      } else {
        obj = {
          width: this.$refs.cropper1.cropW.toFixed(0),
          height: this.$refs.cropper1.cropH.toFixed(0)
        }
        this.$refs.cropper1.getCropBlob(data => {
          _this.success && _this.success(data, obj)
        })
      }
    },
    // 上传文件之前的钩子，参数为上传的文件，若返回 false 或者返回 Promise 且被 reject，则停止上传。
    beforeUpload(file) {
      const isIMAGE = file.type === 'image/jpeg' || 'image/jpg' || 'image/png'
      const isLt5M = file.size / 1024 / 1024 < 5
      if (!isIMAGE) {
        this.$message.error('上传文件只能是图片格式!')
      }
      if (!isLt5M) {
        this.$message.error('上传文件大小不能超过 5MB!')
      }
      return isIMAGE && isLt5M
    },
    onExceed() {
      this.$message.error('文件上传个数超过限制')
    },
    fileChange(e) {
      const _this = this
      const selectFile = e.file
      // 图片上传
      const formData = new FormData()
      formData.append('file', selectFile)
      var reader = new FileReader()
      reader.readAsDataURL(selectFile)
      reader.onload = function (theFile) {
        var image = new Image()
        image.src = theFile.target.result
        console.log('解析的图片url', image.src)
        _this.coverPhoto = image.src
        _this.option.img = image.src
      }
    },
    success(data, obj) {
      // 图片上传
      blobToBase64(data).then(res => {
        imgBase64({ base64Data: res }).then(item => {
          this.activeName = '1'
          this.coverPhoto = ''
          this.$emit('success', item.data.url)
        })
      })
    },
    close() {
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss" scoped>
.videoBox {
  display: flex;
  margin-top: 20px;
  justify-content: center;
  position: relative;
  user-select: none;
  width: 400px;
  height: 80px;
  /* flex-wrap: wrap; */
}
.currentTime{
  position: absolute;
  bottom: -2px;
  width: 40px;
}
.schedule {
    width: 12px;
    height: 64px;
    text-align: center;
    background: #fff;
    border: 1px solid #0c6fff;
    box-sizing: border-box;
    border-radius: 2px;
    position: absolute;
    left: 0;
    top: -2px;
    z-index: 99;
    cursor: pointer;
    span{
      position: absolute;
      top: 50%;
      margin-top: -6px;
      display: inline-block;
      width: 2px;
      height: 12px;
      background: #d8d8d8;
    }
    .span1{
      left: 2px;
    }
    .span2{
      left: 6px;
    }
}
::v-deep .cropper-modal {
  background: rgba(241, 245, 252, 0.5);
}
.cutout-content {
  padding: 16px;
  .cropper {
    width: auto;
    height: 400px;
  }
  .upload-demo1 {
    margin-top: 16px;
  }
  .cropper-img {
    width: 100%;
    height: 400px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .window-list {
    width: 100%;
    height: 450px;
    padding: 0 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    &::-webkit-scrollbar {
      width: 8px;
      height: 10px;
      background-color: rgba(0, 0, 0, 0);
    }

    &::-webkit-scrollbar-thumb {
      border-radius: 6px;
      background-color: rgba(0, 0, 0, 0.2);
      transition: all 0.4s ease;
      -moz-transition: all 0.4s ease;
      -webkit-transition: all 0.4s ease;
      -o-transition: all 0.4s ease;
    }
    &::-webkit-scrollbar-track {
      background-color: rgba(0, 0, 0, 0.1);
    }
    .upload-demo {
      width: 100%;
      height: 100%;
      ::v-deep .el-upload {
        width: 100%;
        height: 100%;
        .el-upload-dragger {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
      }
    }
  }
}
</style>
