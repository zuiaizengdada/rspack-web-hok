<template>
  <div>
    <label
      v-if="!echoUrl && !file"
      :for="inputId"
      class="uploadImg-box-wrapper"
    >
      <div class="img-box">
        <img src="@/assets/image/plus-blue.png" />
      </div>
      <div class="text">{{ title }}</div>
    </label>

    <input
      :id="inputId"
      type="file"
      accept="image/jpeg,image/jpg,image/png"
      style="display: none"
      @change="handleImageUpload"
    />

    <div v-if="echoUrl || file" class="uploaded-box-wrapper">
      <img class="uploaded-img" :src="echoUrl || file" />
      <img
        class="close-icon"
        src="@/assets/svg/close.svg"
        @click="handleCancelUploadImage"
      />
      <div class="mask-img">
        <div
          class="mask-img-item"
          @click="openReviewImgDialog(echoUrl || file, 'horizontal')"
        >
          <i class="el-icon-zoom-in" />
          大图
        </div>
      </div>
    </div>

    <div class="tips">
      <p>
        {{ tip }}
      </p>
    </div>

    <ReviewImgDialog
      v-model="bigImgVisible"
      :append-to-body="true"
      :row="selectImg"
      @close="bigImgVisible = false"
    />
  </div>
</template>

<script>
import OSS from 'ali-oss'
import { getOssConfig } from '@/api/file'
import { v4 as uuidv4 } from 'uuid'
import ReviewImgDialog from '../ReviewImgDialog/index.vue'

export default {
  name: 'UploadFile',
  components: {
    ReviewImgDialog
  },
  props: {
    tip: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    },
    limit: {
      type: Object,
      default: () => ({})
    },
    echoUrl: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      // 阿里云oss
      client: null,
      // ossConfig
      ossConfig: {},
      // 上传文件
      file: null,
      inputId: `image-upload-input-${Date.now()}-${Math.random()
        .toString(36)
        .substr(2, 9)}`,
      bigImgVisible: false,
      selectImg: {}
    }
  },
  mounted() {
    this.setOssConfig()
  },
  methods: {
    // 获取oss配置
    getOssConfig,
    // 设置ossConfig
    async setOssConfig() {
      const { code, data } = await getOssConfig()

      if (code === 1) {
        this.ossConfig = {
          region: 'oss-accelerate',
          accessKeyId: data.accessKeyId,
          accessKeySecret: data.accessKeySecret,
          secure: true,
          bucket: data.ossBucket,
          ossBucketUrl: data.ossBucketUrl,
          ossEndPoint: data.ossEndPoint
        }

        this.client = new OSS(this.ossConfig)
      } else {
        this.$message({
          message: data.msg,
          type: 'warning'
        })
      }
    },
    openReviewImgDialog(url, type) {
      this.selectImg = { type: type, url: url }
      this.bigImgVisible = true
    },
    // 形象图片上传
    async handleImageUpload(event) {
      // 获取选中的图片
      const files = event.target ? event.target.files : event

      // 上传文件数量是否超过1
      const isMoreThanOne = files.length > 1
      if (isMoreThanOne) {
        return this.$message({
          message: `最多上传1个印章，请重新选择`,
          type: 'warning'
        })
      }

      // 检查文件格式和大小是否符合要求
      const isValidFiles = await this.checkFileFormatAndSize(files)
      if (!isValidFiles) return

      // 上传文件
      this.file = await this.uploadOSS(files[0])

      this.$emit('uploadFile', this.file)

      // 重置上传输入的值
      if (event.target) {
        event.target.value = ''
      }
    },
    // 检查上传文件格式和大小是否符合要求
    async checkFileFormatAndSize(files) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const extension = file.name.split('.').pop().toLowerCase()
        const fileSize = file.size

        // 检查文件格式
        let isValidFormat = false
        for (const limits of Object.values(this.limit)) {
          if (limits.extensions.includes(extension)) {
            isValidFormat = true
            // 检查文件大小
            if (limits.maxSize && fileSize > limits.maxSize) {
              this.$message({
                message: `文件 "${file.name}" 超过了 ${limits.type} 类型文件的${
                  limits.maxSize / 1024 / 1024
                }M大小限制，请重新选择`,
                type: 'warning'
              })

              return false
            }
          }
        }
        if (!isValidFormat) {
          this.$message({
            message: `文件 "${file.name}" 的格式不支持，请重新选择`,
            type: 'warning'
          })

          return false
        }
      }
      return true
    },
    // 上传阿里OSS
    async uploadOSS(file) {
      const options = {
        meta: { temp: 'demo' },
        mime: 'json',
        headers: { 'Content-Type': 'text/plain' }
      }

      const uploadFileName = this.generateFileName(file)

      const { url } = await this.client.put(uploadFileName, file, options)

      return url
    },
    // 根据文件名获取文件类型
    getFileType(fileName) {
      const extension = fileName.split('.').pop().toLowerCase()

      for (const [type, limits] of Object.entries(this.limit)) {
        if (limits.extensions.includes(extension)) {
          return type
        }
      }
      return 'unknown' // 未知类型
    },
    // 生成文件名
    generateFileName(file, _fileType) {
      const fileUuid = uuidv4()
      const fileName = file.name
      const fileExtension = fileName.split('.').pop()
      const fileType = this.getFileType(file.name, _fileType)
      const date = new Date()
      const year = date.getFullYear()
      const month = date.getMonth() + 1
      const day = date.getDate()

      return `/file/${fileType}/${year}/${month}/${day}/${fileUuid}.${fileExtension}`
    },
    // 取消图片上传
    handleCancelUploadImage() {
      this.file = null
      this.$emit('cancelUploadImage')
    }
  }
}
</script>

<style lang="scss" scoped>
.uploadImg-box-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 1px dashed transparent;
  background: #fafafa;
  border-radius: 4px;
  width: 100px;
  height: 100px;
  margin-top: 10px;
  cursor: pointer;

  &:hover {
    border: 1px dashed #0c6fff;
  }

  .img-box {
    cursor: pointer;
    border-radius: 2px;
    img {
      cursor: pointer;
      width: 20px;
      height: 20px;
    }
  }

  .text {
    cursor: pointer;
    color: #000000;
    font-size: 12px;
    line-height: 18px;
  }
}

.tips {
  color: #999999;
  font-size: 12px;
  line-height: 18px;
  margin-top: 10px;
}

.uploaded-box-wrapper {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 1px solid #dcdfe5;
  border-radius: 4px;
  width: 100px;
  height: 100px;
  margin-top: 10px;
  cursor: pointer;

  &:hover {
    .mask-img {
      display: flex;
    }
  }

  .mask-img {
    display: none;
    width: 100%;
    height: 20px;
    background: rgba(51, 51, 51, 0.4);
    position: absolute;
    bottom: 0;
    align-items: center;
    justify-content: center;
    user-select: none;
    .mask-img-item {
      font-size: 12px;
      color: #ffffff;
      cursor: pointer;
    }
  }

  .uploaded-img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  .close-icon {
    position: absolute;
    top: 2px;
    right: 2px;
    width: 12px;
    height: 12px;
  }
}
</style>
