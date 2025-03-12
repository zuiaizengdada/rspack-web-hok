<template>
  <div>
    <el-dialog
      title="新增图片"
      :visible.sync="visible"
      width="602px"
      :close-on-click-modal="false"
      :footer="null"
      :before-close="handleClose"
    >
      <el-form ref="form" label-width="70px" size="small">
        <el-form-item label="选择图片">
          <el-upload
            ref="upload"
            class="upload-demo"
            drag
            action="#"
            multiple
            :limit="1"
            :http-request="fileChange"
            :show-file-list="false"
            :before-upload="beforeUpload"
            accept="image/jpg,image/jpeg,image/png"
          >
            <template v-if="!file">
              <i class="el-icon-upload" />
              <div class="el-upload__text">
                将文件拖到此处，或<em>点击上传</em>
              </div>
              <div class="el-upload__text m-t-10">{{ tips }}</div>
            </template>
          </el-upload>
          <!-- <div v-if="file" class="cropper-img">
            <vueCropper
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
              @imgLoad="imgLoad"
              @realTime="realTime"
            />
          </div> -->
          <!-- <div class="opt_box">
            <el-upload
              v-show="file"
              class="upload-demo1"
              action="#"
              :http-request="fileChange"
              :show-file-list="false"
              :before-upload="beforeUpload"
              accept="image/jpg,image/jpeg,image/png"
            >
              <el-button size="small" type="primary" plain>重新上传</el-button>
            </el-upload>
            <div v-if="file" class="flex flex-middle">
              <img
                class="slider-icon"
                src="@/assets/image/aigc/digitalVideoManage/reduce.png"
                alt=""
                @click="rangeImgSize(2)"
              >
              <el-slider
                v-model="value"
                style="width: 280px"
                :show-tooltip="false"
                :max="1"
                :min="0.01"
                :step="0.01"
                @input="handlerChange"
              />
              <img
                class="slider-icon"
                src="@/assets/image/aigc/digitalVideoManage/add.png"
                alt=""
                @click="rangeImgSize(1)"
              >
            </div>
          </div> -->
        </el-form-item>
      </el-form>
      <!-- <div slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="submit">
          完成
        </el-button>
        <el-button size="small" @click="handleClose">取消</el-button>
      </div> -->
    </el-dialog>
  </div>
</template>
<script>
import { uploadImg, getOssConfig } from '@/api/file'
export default {
  model: {
    prop: 'visible',
    event: 'getVisible'
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    configInfo: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      file: null,
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
        enlarge: 0.75, // 图片根据截图框输出比例倍数
        autoCrop: true, // 是否默认生成截图框 默认false
        canMove: true, // 上传图片是否可以移动 默认true
        // autoCropWidth: 200, // 默认生成截图框宽度	容器的80%	0~max
        fixedNumber: [9, 16], // 截图框的宽高比例 [宽度, 高度]
        // autoCropHeight: 'max', // 默认生成截图框高度	容器的80%	0~max
        fixed: true, // 是否开启截图框宽高固定比例
        original: true, // 上传图片按照原始比例渲染	false	true | false
        infoTrue: true, // 为展示真实输出图片宽高 false 展示看到的截图框宽高	false	true | false
        centerBox: false, // 截图框是否被限制在图片里面	false	true | false
        canMoveBox: true // 截图框能否拖动	true	true | false
      },
      value: 0,
      ossConfig: {
        region: '',
        accessKeyId: '',
        accessKeySecret: '',
        secure: false,
        bucket: '',
        ossBucketUrl: '',
        ossEndPoint: ''
      }
    }
  },
  computed: {
    dialogVisible: {
      get() {
        return this.visible
      },
      set(val) {
        this.$emit('getVisible', val)
      }
    }
  },
  watch: {
    visible(val) {
      if (val) {
        this.option = {
          ...this.option,
          ...this.configInfo.cropperConfig
        }
      } else {
        this.file = null
        this.option.img = ''
      }
    }
  },
  created() {
    this.getOssConfig()
  },
  methods: {
    imgLoad() {
      // this.$nextTick(() => {
      //   this.$refs.cropper.scale = 0.15
      //   this.value2 = 0.15
      // })
    },
    getOssConfig() {
      this.loading = true
      getOssConfig()
        .then(res => {
          this.ossConfig = {
            region: 'oss-accelerate',
            accessKeyId: res.data.accessKeyId,
            accessKeySecret: res.data.accessKeySecret,
            secure: true,
            bucket: res.data.ossBucket,
            ossBucketUrl: res.data.ossBucketUrl,
            ossEndPoint: res.data.ossEndPoint
          }
          // eslint-disable-next-line no-undef
        })
        .catch(err => {
          console.log(err)
          this.$message.error('获取oss配置失败')
          this.loading = false
        })
    },
    realTime() {
      this.value = this.$refs.cropper.scale
    },
    async submit() {
      const fileData = new File([this.file], this.file.name, {
        type: 'text/plain'
      })
      const formData = new FormData()
      formData.append('file', fileData)
      try {
        const res = await uploadImg(formData)
        this.$emit('submit', {
          file: res.data.url,
          type: this.configInfo.type
        })
      } catch (e) {
        console.log(e)
      }
      // this.$refs.cropper.getCropBlob(async data => {
      //   console.log(data, 'data')
      //   const fileData = new File([data], this.file.name, {
      //     type: 'text/plain'
      //   })
      //   const formData = new FormData()
      //   formData.append('file', fileData)
      //   try {
      //     const res = await uploadImg(formData)
      //     this.$emit('submit', {
      //       file: res.data.url,
      //       type: this.configInfo.type
      //     })
      //   } catch (e) {
      //     console.log(e)
      //   }
      // })
    },
    rangeImgSize(type) {
      this.value = type === 1 ? this.value + 0.1 : this.value - 0.1
    },
    handlerChange(num) {
      this.$refs.cropper.scale = num
    },
    handleClose() {
      this.$emit('close')
      this.file = null
      this.option.img = ''
    },
    // 上传文件之前的钩子，参数为上传的文件，若返回 false 或者返回 Promise 且被 reject，则停止上传。
    beforeUpload(file) {
      const isIMAGE =
        file.type === 'image/jpeg' ||
        file.type === 'image/jpg' ||
        file.type === 'image/png' ||
        false
      const isLt5M = file.size / 1024 / 1024 < 5
      if (!isIMAGE) {
        this.$message.error('上传文件只能是JPG、JPEG、PNG格式!')
      }
      if (!isLt5M) {
        this.$message.error('上传文件大小不能超过 5MB!')
      }
      return isIMAGE && isLt5M
    },
    fileChange(e) {
      // const selectFile = e.file
      this.file = e.file
      const fileData = new File([this.file], this.file.name, {
        type: 'text/plain'
      })
      const formData = new FormData()
      formData.append('file', fileData)
      uploadImg(formData).then(res => {
        this.$emit('submit', {
          file: res.data.url,
          type: this.configInfo.type
        })
      })

      // var reader = new FileReader()
      // reader.readAsDataURL(selectFile)
      // reader.onload = async theFile => {
      //   var image = new Image()
      //   image.src = theFile.target.result
      //   this.option.img = image.src
      // }
    }
  }
}
</script>
<style lang="scss" scoped>
::v-deep .el-dialog__header {
  padding: 12px 20px;
  border-bottom: 1px solid #e7e7e7;

  .el-dialog__title {
    font-size: 16px;
  }
  .el-dialog__headerbtn {
    top: 15px;
    i {
      font-size: 20px;
      color: #000;
    }
  }
}
.cropper-img {
  width: 457px;
  height: 218px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
::v-deep {
  .el-dialog__body {
    padding-top: 38px !important;
  }
  .el-form-item {
    display: flex;
    align-items: flex-start;
    label {
      width: fit-content !important;
      font-weight: normal;
      color: #333;
      white-space: nowrap;
      padding: 0 !important;
      line-height: initial !important;
    }
    .el-form-item__content {
      margin-left: 10px !important;
    }
  }
}
.opt_box {
  display: flex;
  align-items: center;
  margin-top: 16px;
}
.slider-icon {
  width: 20px;
  height: 20px;
  margin: 0 20px;
}
.upload-demo {
  width: 457px;
  height: 218px;
  color: #999999;
  ::v-deep .el-upload {
    width: 100%;
    height: 100%;
    .el-upload-dragger {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      background-color: #fbfcfe;
      .el-icon-upload {
        font-size: 80px;
      }
    }
  }
}
</style>
