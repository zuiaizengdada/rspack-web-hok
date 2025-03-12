<template>
  <div v-if="visible" class="dialog-container">
    <el-dialog title="图片剪裁" :visible.sync="visible" top="10vh" width="900px">
      <div class="cropper-content">
        <div class="cropper" style="text-align:center">
          <vueCropper
            v-if="visible"
            ref="cropper"
            :img="option.img"
            :auto-crop="option.autoCrop"
            :auto-crop-width="option.autoCropWidth"
            :auto-crop-height="option.autoCropHeight"
            :output-size="option.outputSize"
            :output-type="option.outputType"
            :info="option.info"
            :can-scale="option.canScale"
            :fixed="option.fixed"
            :fixed-number="option.fixedNumber"
            :full="option.full"
            :fixed-box="option.fixedBox"
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
            @img-load="handleImgLoad"
          />
        </div>
      </div>
      <div v-if="!fixed" class="m-t-10">
        <el-button @click="changeFree">自由裁剪</el-button>
        <el-button @click="changeFixed(3)">1:1</el-button>
        <el-button @click="changeFixed(1)">4:3</el-button>
        <el-button @click="changeFixed(2)">3:4</el-button>
        <el-button @click="changeFixed(4)">3:2</el-button>
        <el-button @click="changeFixed(5)">2:3</el-button>
        <el-button @click="changeFixed(6)">16:9</el-button>
        <el-button @click="changeFixed(7)">9:16</el-button>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="visible = false">取 消</el-button>
        <el-button type="primary" :loading="loading" @click="finish">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      default: '裁剪图片'
    },
    visible: {
      type: Boolean,
      default: false
    },
    success: {
      type: Function,
      default: () => {}
    },
    url: {
      type: String,
      default: ''
    },
    width: {
      type: Number,
      default: 300
    },
    height: {
      type: Number,
      default: 300
    },
    fixed: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      option: {
        img: '',
        outputSize: 1, // 裁剪生成图片的质量(可选0.1 - 1)
        outputType: 'png', // 裁剪生成图片的格式（jpeg || png || webp）
        info: true, // 裁剪框的大小信息，图片大小信息
        // full: true,          //是否输出原图比例的截图，false按原比例裁切图片，不失真
        height: true, // 是否按照设备的dpr 输出等比例图片
        maxImgSize: 2000, // 限制图片最大宽度和高度
        enlarge: 1, // 图片根据截图框输出比例倍数
        canScale: true, // 图片是否允许滚轮缩放 默认true
        autoCrop: true, // 是否默认生成截图框 默认false
        canMove: true, // 上传图片是否可以移动 默认true
        autoCropWidth: 200, // 默认生成截图框宽度	容器的80%	0~max
        autoCropHeight: 200, // 默认生成截图框高度	容器的80%	0~max
        fixedBox: false, // 固定截图框大小 不允许改变	false	true | false
        fixed: false, // 是否开启截图框宽高固定比例
        original: false, // 上传图片按照原始比例渲染	false	true | false
        infoTrue: false, // 为展示真实输出图片宽高 false 展示看到的截图框宽高	false	true | false
        centerBox: true, // 截图框是否被限制在图片里面	false	true | false
        canMoveBox: true, // 截图框能否拖动	true	true | false
        fixedNumber: [1, 1] // 截图框的宽高比例 [宽度, 高度]
      },
      dialogVisible: false,
      previews: {}, // 裁剪之后的数据
      loading: false,
      imageInfo: null // 存储图片信息
    }
  },
  methods: {
    // 点击裁剪，这一步是可以拿到处理后的地址
    finish() {
      const _this = this
      this.visible = false
      const obj = {
        width: this.$refs.cropper.cropW.toFixed(0),
        height: this.$refs.cropper.cropH.toFixed(0)
      }
      this.$refs.cropper.getCropBlob((data) => {
        console.log(data)
        _this.success && _this.success(data, obj)
      })
    },
    realTime(data) {
      this.previews = data
      if (!this.imageInfo || !this.$refs.cropper) return

      // 获取当前裁剪框的位置和大小
      const cropRect = {
        x: data.x,
        y: data.y,
        width: data.w,
        height: data.h
      }

      // 检查是否超出图片边界
      if (cropRect.width > this.imageInfo.w ||
          cropRect.height > this.imageInfo.h ||
          cropRect.x < 0 ||
          cropRect.y < 0 ||
          cropRect.x + cropRect.width > this.imageInfo.w ||
          cropRect.y + cropRect.height > this.imageInfo.h) {
        // 如果超出边界，重置裁剪框
        this.$refs.cropper.refresh()
      }
    },
    handleImgLoad(data) {
      this.imageInfo = this.$refs.cropper.getImgInfo()
      // 设置初始裁剪框大小不超过图片
      if (this.imageInfo) {
        const maxWidth = this.imageInfo.w
        const maxHeight = this.imageInfo.h
        this.option.autoCropWidth = Math.min(200, maxWidth)
        this.option.autoCropHeight = Math.min(200, maxHeight)
        this.$refs.cropper.refresh()
      }
    },
    changeFixed(res) {
      if (!this.imageInfo) return

      const maxWidth = this.imageInfo.w
      const maxHeight = this.imageInfo.h
      let targetWidth = 200
      let targetHeight = 200

      switch (res) {
        case 1:
          targetHeight = Math.round((targetWidth * 3) / 4)
          break
        case 2:
          targetHeight = Math.round((targetWidth * 4) / 3)
          break
        case 3:
          targetWidth = 200
          targetHeight = 200
          break
        case 4:
          targetHeight = Math.round((targetWidth * 2) / 3)
          break
        case 5:
          targetHeight = Math.round((targetWidth * 3) / 2)
          break
        case 6:
          targetHeight = Math.round((targetWidth * 9) / 16)
          break
        case 7:
          targetHeight = Math.round((targetWidth * 16) / 9)
          break
      }

      // 确保裁剪框不超过图片大小
      if (targetWidth > maxWidth || targetHeight > maxHeight) {
        const scale = Math.min(maxWidth / targetWidth, maxHeight / targetHeight)
        targetWidth *= scale
        targetHeight *= scale
      }

      this.option.fixed = true
      this.option.autoCropWidth = targetWidth
      this.option.autoCropHeight = targetHeight
      this.option.fixedNumber = this.getFixedNumber(res)
      this.$refs.cropper.refresh()
    },
    getFixedNumber(res) {
      const ratios = {
        1: [4, 3],
        2: [3, 4],
        3: [1, 1],
        4: [3, 2],
        5: [2, 3],
        6: [16, 9],
        7: [9, 16]
      }
      return ratios[res] || [1, 1]
    },
    changeFree() {
      this.option.fixed = false
      if (this.imageInfo) {
        this.option.autoCropWidth = Math.min(200, this.imageInfo.w)
        this.option.autoCropHeight = Math.min(200, this.imageInfo.h)
      }
      this.$refs.cropper.refresh()
    }
  }
}
</script>
<style lang="scss" scoped>
.cropper-content {
  .cropper {
    width: auto;
    height: 667px;
  }
}
.dialog-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.3);
  z-index: 9999999999999999; /* 设置弹框容器的层级 */
}
::v-deep .el-dialog__body {
  padding: 0 20px;
}
</style>
