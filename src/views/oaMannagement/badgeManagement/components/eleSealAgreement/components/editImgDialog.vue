<template>
  <!-- 新增规则弹框 -->
  <AppDialog
    v-if="config.visible"
    :value="config.visible"
    title="图片调整"
    width="600px"
    height="460px"
    :btn-footer="false"
    @close="close"
    @success="success"
  >
    <div class="addDialog">
      <vueCropper
        v-if="resetCropper"
        ref="cropper"
        style="background-image: none"
        :img="option.img"
        :auto-crop="option.autoCrop"
        :output-size="option.outputSize"
        :output-type="option.outputType"
        :info="option.info"
        :fixed="option.fixed"
        :fixed-number="option.fixedNumber"
        :auto-crop-width="option.autoCropWidth"
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
        :can-scale="option.canScale"
        @realTime="realTime"
        @imgLoad="imgLoad"
      />

      <!-- <div v-if="form.type == 2">
            <img
              :src="form.coverPhoto"
              :class="form.radio == 1 ? 'img1' : 'img2'"
            /> -->
    </div>
    <div slot="footer" class="ss-material-box-bottom">
      <el-button
        size="small"
        :loading="loading"
        type="primary"
        @click="success()"
        >完成</el-button
      >
      <el-button size="small" :loading="loading" @click="close()"
        >取消</el-button
      >
    </div>
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import { backgroundImageUpload, backgroundImageEdit } from '@/api/aiVideoManage'
export default {
  components: {
    AppDialog
  },
  props: {
    config: {
      type: Object,
      default: () => {
        return {
          type: 1, // 1新增 2编辑
          row: {},
          radio: 1,
          disable: false,
          visible: false
        }
      }
    }
  },
  data() {
    return {
      loading: false,
      checked1: false,
      value2: 0,
      oldValue2: 0,
      lastnum: 0,
      tips: '支持JPG、JPEG、PNG三种格式图片，图片大小不能超过1M',
      option: {
        img: '',
        canScale: true, // 图片是否允许滚轮缩放
        outputSize: 1, // 裁剪生成图片的质量(可选0.1 - 1)
        outputType: 'png', // 裁剪生成图片的格式（jpeg || png || webp）
        info: true, // 裁剪框的大小信息，图片大小信息
        full: true, // 是否输出原图比例的截图，false按原比例裁切图片，不失真
        height: true, // 是否按照设备的dpr 输出等比例图片
        maxImgSize: 2000, // 限制图片最大宽度和高度
        enlarge: 1, // 图片根据截图框输出比例倍数
        autoCrop: true, // 是否默认生成截图框 默认false
        canMove: true, // 上传图片是否可以移动 默认true
        // autoCropWidth: 200, // 默认生成截图框宽度	容器的80%	0~max
        fixedNumber: [9, 16], // 截图框的宽高比例 [宽度, 高度]
        // autoCropHeight: 'max', // 默认生成截图框高度	容器的80%	0~max
        fixed: true, // 是否开启截图框宽高固定比例
        original: true, // 上传图片按照原始比例渲染	false	true | false
        infoTrue: true, // 为展示真实输出图片宽高 false 展示看到的截图框宽高	false	true | false
        centerBox: true, // 截图框是否被限制在图片里面	false	true | false
        canMoveBox: true, // 截图框能否拖动	true	true | false
        mode: '100px'
      },
      resetCropper: true,
      form: {
        radio: 1,
        coverPhoto: '',
        name: '', // 图片名称
        url: ''
      },
      active: 1,
      rules: {
        name: [{ required: true, message: '请输入图片名称', trigger: 'blur' }],
        coverPhoto: [
          { required: true, message: '请选择图片', trigger: 'change' }
        ],
        radio: [{ required: true, message: '请选择类型', trigger: 'change' }]
      },
      minScale: 0.01
    }
  },
  watch: {
    'config.visible': {
      handler(val) {
        if (val) {
          this.$refs.form && this.$refs.form.resetFields()
          if (this.config.type === 1) {
            console.log(this.config.radio, this.config.type, '6666')
            this.form = {
              type: 1,
              radio: this.config.radio,
              coverPhoto: '',
              name: '' // 图片名称
            }
            this.handlerChangeType()
          } else {
            this.form = JSON.parse(JSON.stringify(this.config.row))
            this.option.img = this.form.url
            console.log(this.form, '表单')
          }
        }
      },
      deep: true,
      immediate: true
    },
    value2(val, old) {
      this.oldValue2 = old
    }
  },
  mounted() {},
  methods: {
    imgLoad() {
      // this.$nextTick(() => {
      //   this.$refs.cropper.scale = 0.15
      //   this.value2 = 0.15
      // })
    },
    realTime() {
      if (this.$refs.cropper.scale > 1) {
        this.$refs.cropper.scale = 1
        this.value2 = 1
      } else {
        this.value2 = this.$refs.cropper.scale
      }
    },
    // 上传文件之前的钩子，参数为上传的文件，若返回 false 或者返回 Promise 且被 reject，则停止上传。
    beforeUpload(file) {
      console.log(file.type, '上传的文件')
      const isIMAGE =
        file.type === 'image/jpeg' ||
        file.type === 'image/jpg' ||
        file.type === 'image/png' ||
        false
      const isLt5M = file.size / 1024 / 1024 < 5
      console.log(isIMAGE, '格式')
      if (!isIMAGE) {
        this.$message.error('上传文件只能是JPG、JPEG、PNG格式!')
      }
      if (!isLt5M) {
        this.$message.error('上传文件大小不能超过 5MB!')
      }
      return isIMAGE && isLt5M
    },
    onExceed() {
      this.$message.error('文件上传个数超过限制')
    },
    close() {
      this.$emit('close')
    },
    handlerChange(num) {
      if (num <= this.minScale) {
        this.$refs.cropper.scale = this.minScale
        this.value2 = this.minScale
        return
      }
      console.log(this.oldValue2, num, '比例')
      this.$refs.cropper.scale = num
      this.$nextTick(() => {
        if (!this.$refs.cropper.checkoutImgAxis()) {
          this.$refs.cropper.scale = this.oldValue2
          this.minScale = this.oldValue2
          this.value2 = this.oldValue2
        } else {
          this.oldValue2 = num
        }
      })
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
        _this.form.coverPhoto = image.src
        _this.option.img = image.src
        _this.value2 = 0
      }
    },
    handlerChangeType(e) {
      const fixedNumberMap = new Map([
        [1, [9, 16]],
        [0, [16, 9]]
      ])
      this.option.fixedNumber = fixedNumberMap.get(this.form.radio)
      console.log(this.option.fixedNumber, '比例')
      this.value2 = 0
      this.resetCropper = false
      setTimeout(() => {
        this.resetCropper = true
      }, 100)
      console.log(e, 'type')
    },
    last() {
      this.active = 1
    },
    success() {
      this.$refs['ruleForm'].validate(valid => {
        if (valid) {
          // 新增
          if (this.form.type === 1) {
            this.$refs.cropper.getCropBlob(async data => {
              const imgType = data?.type.split('/')[1] || 'png'
              console.log('data:', data)
              const formdata = new FormData()
              formdata.append('file', data)
              formdata.append('name', this.form.name)
              formdata.append('resolutionType', this.form.radio)
              formdata.append('fileName', `${this.form.name}.${imgType}`)
              const res = await backgroundImageUpload(formdata)
              if (res.code === 1) {
                this.form.coverPhoto = ''
                this.$emit('success')
              }
            })
          } else {
            // 编辑
            backgroundImageEdit({
              imagesId: this.form.imagesId,
              name: this.form.name
            }).then(res => {
              if (res.code === 1) {
                this.form.coverPhoto = ''
                this.$emit('success')
              }
            })
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.cropper {
  width: auto;
  height: 300px;
}
.cropper-img {
  width: 100%;
  height: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.opt_box {
  display: flex;
  align-items: center;
  margin-top: 16px;
}
.img1 {
  width: 123px;
  height: 218px;
}
.img2 {
  width: 388px;
  height: 218px;
}
.upload-demo1 {
  //margin: 16px auto;
  //text-align: center;
}
.upload-demo {
  width: 100%;
  height: 300px;
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
.addDialog {
  height: 360px;
  padding: 20px 40px 20px 20px;
  .image_poster {
    background: #f5f7fa;
    border-radius: 4px;
    border: 1px solid #dcdcdc;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    > span {
      margin-top: 13px;
      font-size: 12px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: rgba(0, 0, 0, 0.4);
      line-height: 20px;
    }
    &:hover {
      border: 1px dashed #1472ff;
    }
  }
}
</style>
