<template>
  <div
    v-loading="isLoadImg && imgUrl"
    class="dragScaleFabric"
    :style="{
      border: operateType === 2 ? '1px solid #0C6FFF' : '1px solid #f4f4f4'
    }"
  >
    <canvas v-show="!isLoadImg" ref="canvasRef" :width="199" :height="355" />
    <div
      v-if="!backgroundImg && !imgUrl"
      class="null-status"
      :style="{
        'background-image': `url(${getDefaultBgImg})`
      }"
    />
    <!-- 测试 -->
    <!-- <img
      style="width: 90px; height: 160px; position: absolute; bottom: -52%"
      :src="base6411"
      alt=""
    /> -->
  </div>
</template>

<script>
import { fabric } from 'fabric'
export default {
  props: {
    imgUrl: {
      type: String,
      default: undefined
    },
    backgroundImg: {
      type: String,
      default: undefined
    },
    thirdType: {
      type: Number,
      default: undefined
    },
    isVertical: {
      type: Boolean,
      default: true
    },
    positionInfo: {
      type: Object,
      default: () => {
        return {
          left: undefined,
          top: undefined,
          scaleValue: undefined,
          roleWidth: undefined,
          originalInfo: undefined
        }
      }
    },
    ambiguity: {
      type: Number,
      default: 0
    },
    /**
     * @param 1-人形 2-背景
     */
    operateType: {
      type: Number,
      default: 1
    },
    isToInfo: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      canvas: undefined,
      imgInstance: undefined,
      backgroundImageInstance: undefined,
      horizontalImgBg: require('../../../../../assets/image/horizontal_signal_content.png'),
      verticalImgBg: require('../../../../../assets/image/vertical_signal.png'),
      ignoreList: ['mt', 'mtr', 'ml', 'mr', 'mb'],
      isLoadImg: false,
      isLoadBackgroundImg: false,
      base6411: undefined
    }
  },
  computed: {
    getWidth() {
      return this.isVertical ? 199 : 491
    },
    getHeight() {
      return this.isVertical ? 355 : 276
    },
    videoWidth() {
      return this.isVertical ? 1080 : 1920
    },
    videoHeight() {
      return this.isVertical ? 1920 : 1080
    },
    getDefaultBgImg() {
      return this.isVertical ? this.verticalImgBg : this.horizontalImgBg
    }
  },
  watch: {
    backgroundImg: {
      handler(val) {
        if (val) {
          this.renderBackgroundImg()
        } else {
          this.canvas.remove(this.backgroundImageInstance)
          this.canvas.renderAll()
          this.backgroundImageInstance = undefined
        }
      },
      deep: true
    },
    imgUrl: {
      handler(val) {
        if (val) {
          this.$nextTick(() => {
            this.renderImgUrl()
          })
        }
      },
      deep: true
    },
    isVertical: {
      handler(val, oldVal) {
        if (val !== oldVal) {
          this.setCanvasStyle()
        }
      },
      deep: true
    },
    ambiguity: {
      handler(val) {
        this.updateAmbiguityBackgroundImg(val)
      },
      deep: true
    },
    operateType: {
      handler(val) {
        if (val === 1) {
          this.imgInstance && this.canvas.setActiveObject(this.imgInstance)
        } else {
          this.imgInstance &&
            this.imgInstance.bringToFront() &&
            this.canvas.discardActiveObject().renderAll()
        }
        this.canvas.renderAll()
      },
      deep: true
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.init()
    })
    // 禁止键盘操作缩放
    // document.onkeydown = e => {
    //   if (!this.imgInstance) return
    //   this.imgInstance.lockScalingX = true
    //   this.imgInstance.lockScalingY = true
    // }
    // document.onkeyup = e => {
    //   if (!this.imgInstance) return
    //   this.imgInstance.lockScalingX = false
    //   this.imgInstance.lockScalingY = false
    // }
  },
  destroyed() {
    document.onkeydown = null
    document.onkeyup = null
  },
  methods: {
    // 生成截图
    generateImg() {
      if (!this.canvas) return
      return new Promise((resolve, reject) => {
        const base64 = this.canvas.toDataURL({
          format: 'png'
        })
        resolve(base64)
      })
    },
    // 生成背景图
    generateBackgroundImg() {
      if (!this.backgroundImageInstance || !this.canvas) return
      return new Promise((resolve, reject) => {
        const isOriginalProportion =
          this.getWidth / this.backgroundImageInstance.width ===
            this.backgroundImageInstance.scaleX && this.ambiguity === 0
        const proportionVideo = this.videoWidth / this.getWidth
        const canvasClone = new fabric.Canvas('canvasClone')
        canvasClone.setWidth(this.videoWidth)
        canvasClone.setHeight(this.videoHeight)

        fabric.Image.fromURL(
          this.backgroundImg,
          img => {
            img.set({
              left: this.backgroundImageInstance.left * proportionVideo,
              top: this.backgroundImageInstance.top * proportionVideo,
              scaleX: this.backgroundImageInstance.scaleX * proportionVideo,
              scaleY: this.backgroundImageInstance.scaleY * proportionVideo
            })
            const blurFilter = new fabric.Image.filters.Blur({
              blur: this.ambiguity / 10
            })
            img.filters.push(blurFilter)
            img.applyFilters()

            canvasClone.add(img)
            canvasClone.renderAll()
            const base64 = canvasClone.toDataURL({
              format: 'png'
            })
            resolve({
              base64: base64,
              isOriginalProportion
            })
          },
          { crossOrigin: 'Anonymous' }
        )
      })
    },

    // 恢复默认
    async canvasReduction() {
      if (!this.canvas) return
      const objTmp =
        this.operateType === 1 ? this.imgInstance : this.backgroundImageInstance
      if (!objTmp) return
      objTmp.left = 0
      objTmp.top = 0
      objTmp.scaleX = this.canvas.width / objTmp.width
      objTmp.scaleY =
        this.operateType === 1
          ? this.canvas.width / objTmp.width
          : this.canvas.height / objTmp.height
      if (this.operateType === 1) {
        const scale = objTmp.scaleX
        const proportionVideo = this.videoWidth / this.getWidth
        const widthTmp = scale * objTmp.width * proportionVideo
        if (this.thirdType === 2) {
          objTmp.left = (this.getWidth - objTmp.width * scale) / 2
          objTmp.top = this.getHeight - objTmp.height * scale
        }
        const outObj = {
          left: objTmp.left * proportionVideo,
          top: objTmp.top * proportionVideo,
          roleWidth: widthTmp
        }
        this.$emit('offsetInfo', outObj)
      }
      if (this.operateType === 2) {
        objTmp.filters[0].blur = 0
        objTmp.applyFilters()
      }
      this.canvas.renderAll()
    },
    /**
     * @param val 1-放大 2-缩小
     */
    sizeChange(val) {
      if (
        !this.canvas ||
        (this.operateType === 1 && !this.imgInstance) ||
        (this.operateType === 2 && !this.backgroundImageInstance)
      ) {
        return
      }
      const objTmp =
        this.operateType === 1 ? this.imgInstance : this.backgroundImageInstance
      const scale =
        this.operateType === 1
          ? this.imgInstance.scaleX
          : this.backgroundImageInstance.scaleX
      const originalScale = this.canvas.width / objTmp.width
      const originalHeightScale = this.canvas.height / objTmp.height
      const proportion = (this.canvas.width / objTmp.width) * 0.1

      if (val === 1) {
        const ratio = scale + proportion
        objTmp.scaleX = ratio
        objTmp.scaleY = ratio
        this.canvas.renderAll()
      }
      if (val === 2) {
        let ratio = scale - proportion
        if (this.operateType === 2) {
          const wid = objTmp.width * ratio
          const hei = objTmp.height * ratio
          const availableLR = wid - this.getWidth
          const availableTB = hei - this.getHeight
          const offsetLeft =
            objTmp.left > 0 ||
            (objTmp.left < 0 && Math.abs(objTmp.left) >= availableLR)

          const offsetTop =
            objTmp.top > 0 ||
            (objTmp.top < 0 && Math.abs(objTmp.top) >= availableTB)

          if (offsetLeft || offsetTop) {
            if (offsetLeft) {
              objTmp.left = objTmp.left > 0 ? 0 : -availableLR
            }
            if (offsetTop) {
              objTmp.top = objTmp.top > 0 ? 0 : -availableTB
            }
          }

          if (ratio < originalScale) {
            ratio = originalScale
            objTmp.left = 0
            objTmp.top = 0
          }
        }
        objTmp.scaleX = ratio
        objTmp.scaleY = ratio
        if (this.operateType === 2 && ratio < originalHeightScale) {
          objTmp.scaleY = originalHeightScale
        }
        this.canvas.renderAll()
      }
      if (this.operateType === 1) {
        const scaleVideo = scale + (val === 1 ? proportion : -proportion)
        const proportionVideo = this.videoWidth / this.getWidth
        // const widthTmp = scaleVideo * objTmp.width * proportionVideo
        const widthTmp =
          (this.thirdType === 2
            ? scaleVideo * (this.videoWidth - objTmp.width)
            : 0) +
          scaleVideo * objTmp.width * proportionVideo

        // 禁止内容全部超出画布
        if (
          -(scaleVideo * objTmp.width) >= objTmp.left ||
          objTmp.left >= this.getWidth
        ) {
          objTmp.left = 0
          objTmp.scaleX = this.canvas.width / objTmp.width
          objTmp.scaleY = this.canvas.width / objTmp.width
          return
        }
        if (
          -(scaleVideo * objTmp.height) >= objTmp.top ||
          objTmp.top >= this.getHeight
        ) {
          objTmp.top = 0
          objTmp.scaleX = this.canvas.width / objTmp.width
          objTmp.scaleY = this.canvas.width / objTmp.width
          return
        }
        if (
          scaleVideo * objTmp.width >= this.getWidth &&
          this.thirdType === 1
        ) {
          objTmp.top = 0
          objTmp.scaleX = this.canvas.width / objTmp.width
          objTmp.scaleY = this.canvas.width / objTmp.width
        }
        if (
          this.thirdType === 1 &&
          !(scaleVideo * objTmp.width >= this.getWidth && this.thirdType === 1)
        ) {
          const htmp = scaleVideo * objTmp.height
          const jtmp = this.getHeight - htmp
          objTmp.top = jtmp
        }
        this.canvas.setActiveObject(this.imgInstance)
        this.canvas.renderAll()
        const outObj = {
          left: objTmp.left * proportionVideo,
          top: objTmp.top * proportionVideo,
          roleWidth: widthTmp
        }
        this.$emit('offsetInfo', outObj)
      }
    },
    init() {
      const canvasEl = this.$refs.canvasRef
      this.canvas = new fabric.Canvas(canvasEl)
      // this.canvas.altActionKey = 'none'
      this.canvas.uniScaleKey = 'none'
      // 监控移动
      this.canvas.on('object:moving', e => {
        const obj = e.target
        const { left, top, scaleX, scaleY, width, height } = obj
        if (obj.id === 'backgroundImage') {
          const oldScale = this.getWidth / width
          if (oldScale === scaleX) {
            this.backgroundImageInstance.left = 0
            this.backgroundImageInstance.top = 0
            this.canvas.renderAll()
            return
          }
          const wid = width * scaleX
          const hei = height * scaleY
          const availableLR = wid - this.getWidth
          const availableTB = hei - this.getHeight
          const offsetLeft =
            left > 0 || (left < 0 && Math.abs(left) >= availableLR)

          const offsetTop = top > 0 || (top < 0 && Math.abs(top) >= availableTB)
          if (offsetLeft || offsetTop) {
            if (offsetLeft) {
              this.backgroundImageInstance.left = left > 0 ? 0 : -availableLR
            }
            if (offsetTop) {
              this.backgroundImageInstance.top = top > 0 ? 0 : -availableTB
            }
            this.canvas.renderAll()
            return
          }
        }
        if (obj.id === 'figure') {
          // eslint-disable-next-line no-unused-vars
          const proportion = this.videoWidth / this.getWidth

          // 禁止内容全部超出画布
          if (-(scaleX * width) >= left || left >= this.getWidth) {
            this.imgInstance.left = 0
            return
          }
          if (-(scaleY * height) >= top || top >= this.getHeight) {
            this.imgInstance.top = 0
            return
          }

          const widthTmp = scaleX * width * proportion
          const outObj = {
            left: left * proportion,
            top: top * proportion,
            roleWidth: widthTmp
          }
          this.$emit('offsetInfo', outObj)
        }
      })
      // 监控缩放
      this.canvas.on('object:scaling', e => {
        const { width, scaleX, scaleY, height, left, top } = e.target
        const proportion = this.videoWidth / this.getWidth
        const widthTmp =
          (this.thirdType === 2 ? scaleX * (this.videoWidth - width) : 0) +
          scaleX * width * proportion
        // if (widthTmp < 101) {
        //   this.imgInstance.minScaleLimit = scaleX
        //   return
        // }

        // 禁止内容全部超出画布
        if (-(scaleX * width) >= left || left >= this.getWidth) {
          this.imgInstance.left = 0
          this.imgInstance.scaleX = this.canvas.width / width
          this.imgInstance.scaleY = this.canvas.width / width
          return
        }
        if (-(scaleY * height) >= top || top >= this.getHeight) {
          this.imgInstance.top = 0
          this.imgInstance.scaleX = this.canvas.width / width
          this.imgInstance.scaleY = this.canvas.width / width
          return
        }
        if (scaleX * width >= this.getWidth && this.thirdType === 1) {
          this.imgInstance.top = 1.5
          this.imgInstance.scaleX = this.canvas.width / width
          this.imgInstance.scaleY = this.canvas.width / width

          this.canvas.renderAll()
          return
        }
        const lr = left * proportion
        const tb = top * proportion
        const outObj = {
          left: lr,
          top: tb,
          roleWidth: widthTmp
        }
        this.$emit('offsetInfo', outObj)
      })
      // 监听点击
      this.canvas.on('mouse:down', e => {
        const obj = e.target
        if (obj.id) {
          if (obj.id === 'figure') {
            this.imgInstance && this.canvas.setActiveObject(this.imgInstance)
          }
          if (obj.id === 'backgroundImage') {
            this.imgInstance &&
              this.imgInstance.bringToFront() &&
              this.canvas.discardActiveObject().renderAll()
          }
          this.$emit('typeClick', obj.id === 'figure' ? 1 : 2)
        }
      })
      // 监听鼠标滚轮
      this.canvas.on('mouse:wheel', opt => {
        // console.log(opt, 'opt.e.deltaY')
        const targer = opt.target
        const delta = opt.e.deltaY
        if (
          targer &&
          targer.id &&
          this.operateType === 2 &&
          targer.id === 'backgroundImage'
        ) {
          if (delta > 0) {
            this.sizeChange(2)
          } else {
            this.sizeChange(1)
          }
        }
        // opt.e.preventDefault()
        // opt.e.stopPropagation()
      })

      this.renderImgUrl()
      this.renderBackgroundImg()
      this.canvas.renderAll()
    },
    setCanvasStyle() {
      this.canvas.setDimensions({
        width: this.getWidth,
        height: this.getHeight
      })
      this.renderImgUrl()
      this.canvas.remove(this.backgroundImageInstance)
      this.canvas.renderAll()
      this.backgroundImageInstance = undefined
    },
    updateToInfoImage() {
      this.imgInstance.setSrc(
        this.imgUrl,
        img => {
          const isblorbr = this.thirdType > 1
          img.setControlVisible('bl', isblorbr)
          img.setControlVisible('br', isblorbr)
          this.ignoreList.forEach(item => {
            img.setControlVisible(item, false)
          })
          img.minScaleLimit = undefined
          img.lockMovementX = false
          img.lockMovementY = this.thirdType === 1
          const newscale = this.positionInfo.scaleValue / img.width

          if (this.thirdType === 1) {
            const ratio = this.isVertical
              ? 1080 / this.getWidth
              : 1920 / this.getWidth
            const l = this.positionInfo.originalInfo.left
            const t = this.positionInfo.originalInfo.top
            img.left = l / ratio
            img.top = t / ratio
          } else {
            img.left = this.positionInfo.left
            img.top = this.positionInfo.top
          }
          img.scaleX = newscale
          img.scaleY = newscale
          img.bringToFront()
          this.canvas.setActiveObject(this.imgInstance)
          this.canvas.renderAll()
          this.imgInstance = img
          this.$emit('isLoadImg', true)
          this.isLoadImg = false
        },
        { crossOrigin: 'Anonymous' }
      )
    },
    renderImgUrl() {
      if (!this.imgUrl || !this.canvas) return
      this.$emit('isLoadImg', false)
      this.isLoadImg = !!this.imgUrl
      this.$emit('typeClick', 1)
      if (this.imgInstance) {
        if (this.isToInfo) {
          this.updateToInfoImage()
        } else {
          this.imgInstance.setSrc(
            this.imgUrl,
            img => {
              const isblorbr = this.thirdType > 1
              img.setControlVisible('bl', isblorbr)
              img.setControlVisible('br', isblorbr)
              this.ignoreList.forEach(item => {
                img.setControlVisible(item, false)
              })
              const proportion = this.videoWidth / this.getWidth

              img.minScaleLimit = undefined
              img.lockMovementX = false
              img.lockMovementY = this.thirdType === 1
              let newscale = this.canvas.width / img.width
              if (newscale * img.height > this.getHeight && this.isVertical) {
                newscale = this.mapScale(newscale, img.height)
              }
              img.left = 0
              img.top = 0
              if (this.thirdType === 2) {
                img.left = (this.getWidth - img.width * newscale) / 2
                img.top = this.getHeight - img.height * newscale
                const outObj = {
                  left: img.left * proportion,
                  top: img.top * proportion,
                  roleWidth: img.width * newscale * proportion
                }
                this.$emit('offsetInfoInit', outObj)
              } else {
                this.$emit('offsetInfoInit', {})
              }
              img.scaleX = newscale
              img.scaleY = newscale
              img.bringToFront()
              this.canvas.setActiveObject(this.imgInstance)
              this.canvas.renderAll()
              this.imgInstance = img
              this.$emit('isLoadImg', true)
              this.isLoadImg = false
            },
            { crossOrigin: 'Anonymous' }
          )
        }
      } else {
        fabric.Image.fromURL(
          this.imgUrl,
          img => {
            let newscale = this.positionInfo.scaleValue
              ? this.positionInfo.scaleValue / img.width
              : this.canvas.width / img.width
            let defaultLeft = 0
            let defaultTop = 0
            if (newscale * img.height > this.getHeight && this.isVertical) {
              newscale = this.mapScale(newscale, img.height)
            }
            if (this.thirdType === 2) {
              defaultLeft = (this.getWidth - img.width * newscale) / 2
              defaultTop = this.getHeight - img.height * newscale
              const proportion = this.videoWidth / this.getWidth
              let outObj = {
                left: defaultLeft * proportion,
                top: defaultTop * proportion,
                roleWidth: img.width * newscale * proportion
              }
              if (this.positionInfo.originalInfo) {
                outObj = {
                  ...outObj,
                  ...this.positionInfo.originalInfo
                }
              }
              this.$emit('offsetInfo', outObj)
            }
            img.set({
              id: 'figure',
              left:
                this.positionInfo.left || this.positionInfo.left === 0
                  ? this.positionInfo.left
                  : defaultLeft,
              top: this.positionInfo.top || defaultTop,
              scaleX: newscale,
              scaleY: newscale,
              lockRotation: true,
              lockScalingFlip: true,
              lockMovementY: this.thirdType === 1,
              // lockMovementY: true,
              transparentCorners: false,
              cornerColor: '#fff',
              cornerStrokeColor: '#0C6FFF',
              borderColor: '#0C6FFF',
              cornerSize: 8,
              padding: 0,
              cornerStyle: 'rect',
              borderScaleFactor: 1,
              borderDashArray: null
            })
            const isblorbr = this.thirdType > 1
            img.setControlVisible('bl', isblorbr)
            img.setControlVisible('br', isblorbr)
            this.ignoreList.forEach(item => {
              img.setControlVisible(item, false)
            })
            this.canvas.add(img)
            this.canvas.renderAll()
            img.bringToFront()
            this.imgInstance = img
            this.canvas.setActiveObject(this.imgInstance)
            this.$emit('isLoadImg', true)
            this.isLoadImg = false
          },
          { crossOrigin: 'Anonymous' }
        )
      }
    },
    mapScale(val, heightImg) {
      const height = val * heightImg
      if (height > this.getHeight) {
        return this.mapScale(val - 0.01, heightImg)
      } else {
        return val
      }
    },
    updateAmbiguityBackgroundImg(val) {
      if (!this.canvas || !this.backgroundImageInstance) return
      if (this.operateType === 2) {
        this.backgroundImageInstance.filters[0].blur = val / 10
        this.backgroundImageInstance.applyFilters()
        this.canvas.renderAll()
      }
    },
    renderBackgroundImg() {
      if (!this.canvas || !this.backgroundImg) return
      this.$emit('isLoadImg', false)
      this.$emit('typeClick', 2)
      this.isLoadImg = !!this.backgroundImg
      if (this.backgroundImageInstance) {
        this.backgroundImageInstance.setSrc(
          this.backgroundImg,
          img => {
            img.set({
              left: 0,
              top: 0,
              scaleX: this.canvas.width / img.width,
              scaleY: this.canvas.height / img.height
            })

            // img.scaleToWidth(this.canvas.width)
            // img.scaleToHeight(this.canvas.height)
            this.canvas.renderAll()
            this.imgInstance &&
              this.imgInstance.bringToFront() &&
              this.canvas.discardActiveObject().renderAll()
            this.backgroundImageInstance = img
            this.$emit('isLoadImg', true)
            this.isLoadImg = false
          },
          { crossOrigin: 'Anonymous' }
        )
      } else {
        fabric.Image.fromURL(
          this.backgroundImg,
          img => {
            img.set({
              id: 'backgroundImage',
              hasControls: false,
              // left: 0,
              // top: 0,
              lockRotation: true,
              scaleX: this.canvas.width / img.width,
              scaleY: this.canvas.height / img.height
            })
            // img.scaleToWidth(this.canvas.width)
            // img.scaleToHeight(this.canvas.height)
            const blurFilter = new fabric.Image.filters.Blur({
              blur: 0
            })
            img.filters.push(blurFilter)
            img.applyFilters()
            this.canvas.add(img)
            this.canvas.renderAll()
            this.imgInstance &&
              this.imgInstance.bringToFront() &&
              this.canvas.discardActiveObject().renderAll()
            this.backgroundImageInstance = img
            this.$emit('isLoadImg', true)
            this.isLoadImg = false
          },
          { crossOrigin: 'Anonymous' }
        )
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.dragScaleFabric {
  position: relative;
  .null-status {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 999;
    background-size: 100% 100%;
    background-repeat: no-repeat;
  }
}
</style>
