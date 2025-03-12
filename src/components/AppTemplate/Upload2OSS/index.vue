<template>
  <!-- 上传弹框 -->
  <div class="upload">
    <el-upload
      v-show="fileList.length < limit"
      ref="upload"
      class="uploadView m-r-16 m-b-16"
      :style="{ width: styles.width, height: styles.height }"
      drag
      action="#"
      :limit="limit"
      :accept="accept"
      :on-exceed="handleExceed"
      :http-request="upload"
      :show-file-list="false"
    >
      <i class="el-icon-plus" />
      <div class="uploadViewText">点击/拖拽上传</div>
      <span class="tips" v-html="tips" />
    </el-upload>

    <template v-for="(item, index) in fileList">
      <uploadItem
        :key="index"
        class="m-r-16 m-b-16"
        :status="item.status"
        :url="item.url"
        :auth-progress="item.authProgress"
        @del="delFile(item, index)"
        @again="alignUpload(item, index)"
      />
    </template>
  </div>
</template>

<script>
import { getFileType } from '@/utils/index'
import uploadItem from './uploadItem.vue'
import { uploadImg, getOssConfig } from '@/api/file'
import axios from 'axios'
export default {
  components: {
    uploadItem
  },
  props: {
    styles: {
      type: Object,
      default: () => {
        return {
          width: '160px',
          height: '120px'
        }
      }
    },
    accept: {
      type: String,
      default: '.jpg,.png,.jpeg'
    },
    limit: {
      type: Number,
      default: 1
    },
    tips: {
      type: String,
      default: '仅支持jpg、png、jpeg格式图片，大小1M以内'
    },
    enum: {
      type: String,
      default: ''
    },
    maxM: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      // 文件上传状态status 0: 未开始上传 1: 文件上传中 2: 文件上传失败 3: 文件上传成功
      // 文件类型fileType: audio[音频mp3/wav/aac/3pg/mar/wma] video[视频3pg/mp4/mov] img[图片jpg/png/jpeg/bmp]
      fileList: [],
      ossConfig: {
        region: '',
        accessKeyId: '',
        accessKeySecret: '',
        secure: false,
        bucket: '',
        ossBucketUrl: '',
        ossEndPoint: ''
      },
      cancelToken: axios.CancelToken
    }
  },
  created() {
    this.getOssConfig()
  },
  mounted() {
    this.setFileList([])
  },
  methods: {
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
    handleExceed() {
      this.$message.error('文件数量超出限制')
    },
    beforeUpload(file) {
      const fileTypeList = ['image/jpeg', 'image/jpg', 'image/png']
      if (!fileTypeList.includes(file.type)) {
        this.$message({
          message: '仅支持jpg/png/jpeg格式图片',
          type: 'error'
        })
        return
      }
      if (!this.maxM) return true
      const fileType = getFileType(file.name)
      if (fileType.fileType === 'img') {
        const isLt5M = file.size / 1024 / 1024 < (this.maxM || 1)
        !isLt5M && this.$message.error(`上传图片大小不能超过${this.maxM}MB!`)
        return isLt5M
      }
      // 限制上传文件大小 500M
      // const isLt20M = file.size / 1024 / 1024 < 20
      // if (!isLt20M) {
      //   this.$message.error('上传文件大小不能超过 20MB!')
      // }
    },
    // 点击上传视频
    async upload(e) {
      this.$refs.upload.clearFiles()
      console.log('上传文件', e)
      if (!e) {
        return
      }
      const selectFile = e.file
      if (!this.beforeUpload(selectFile)) {
        return
      }
      const formData = new FormData()
      formData.append('file', selectFile)
      this.fileList.push({
        file: selectFile,
        materialType: 1,
        status: 1,
        source: this.cancelToken.source(),
        authProgress: 0,
        materialName: `${this.$getUuiD(10)}.${
          this.$getFileType(selectFile.name).suffix
        }`,
        materialSize: selectFile.size,
        formData: formData
      })
      // this.$emit('change', this.fileList)
      const index = this.fileList.length - 1
      const self = this.fileList[index]
      var reader = new FileReader()
      reader.readAsDataURL(selectFile)
      reader.onload = theFile => {
        var image = new Image()
        image.src = theFile.target.result
        image.onload = async () => {
          try {
            const res = await uploadImg(
              formData,
              progressEvent => {
                const authProgress =
                  ((progressEvent.loaded / progressEvent.total) * 100) | 0
                // 调用onProgress方法来显示进度条，需要传递个对象 percent为进度值
                if (authProgress === 100) {
                  self.authProgress = 99
                } else {
                  self.authProgress = authProgress
                }
              },
              self.source.token
            )
            const url = res.data.url
            if (url) {
              this.fileList[index].status = 3
              this.fileList[index].url = url
              this.fileList[index].resourceUrl = res.data
              this.fileList[index].authProgress = 100
            } else {
              this.fileList[index].status = 2
              this.fileList[index].authProgress = 100
            }
          } catch (e) {
            this.fileList[index].status = 2
            this.fileList[index].authProgress = 100
          }
          this.$emit('change', this.fileList)
        }
      }
      // this.fileList.push(obj)
    },
    // 点击重新上传
    async alignUpload(item, index) {
      const self = this.fileList[index]
      this.fileList.splice(index, 1)
      await this.upload(self)
    },
    // 获取是否还有正在上传的文件
    getUploadFile() {
      const index = this.fileList.findIndex(v => v.status === 1)
      return index > -1
    },
    // 点击删除
    delFile(item, index) {
      console.log(item, index)
      if (item.abortCheckpoint) {
        item.client &&
          item.client.abortMultipartUpload(
            item.abortCheckpoint.name,
            item.abortCheckpoint.uploadId
          )
      }
      this.fileList.splice(index, 1)
      this.$emit('change', this.fileList)
    },
    // 设置fileList
    setFileList(arr) {
      this.fileList = arr
    },
    getFileList() {
      return this.fileList
    }
  }
}
</script>

<style lang='scss' scoped>
::v-deep {
  .el-upload {
    .el-upload-dragger {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: #fbfcfe;
      width: 160px;
      height: 120px;
    }
  }
}
.upload {
  display: flex;
  flex-wrap: wrap;
  .uploadView {
    width: 160px;
    height: 120px;
    background: #fbfcfe;
    border-radius: 4px;
    // border: 1px solid #E1E6ED;
    .uploadViewText {
      margin-top: 12px;
      font-size: 12px;
      font-family: MicrosoftYaHei;
      color: #0c6fff;
      line-height: 20px;
    }
  }
  .tips {
    margin-top: 5px;
    margin-left: 8px;
    font-size: 12px;
    color: #999999;
    line-height: 20px;
  }
}
.el-icon-plus {
  font-weight: 700;
  font-size: 14px;
  color: #333333;
}
</style>
