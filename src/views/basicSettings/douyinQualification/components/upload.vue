<template>
  <!-- 上传弹框 -->
  <div class="upload">
    <el-upload
      v-if="fileList.length < limit"
      ref="upload"
      class="uploadView m-r-16 m-b-16"
      drag
      action="#"
      :limit="limit"
      accept=".jpg,.png,.jpeg"
      :before-upload="beforeUpload"
      :on-exceed="handleExceed"
      :http-request="upload"
      :show-file-list="false"
    >
      <i class="el-icon-plus" />
      <div class="uploadViewText">点击/拖拽上传</div>
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
    <span class="tips" v-html="tips" />
  </div>
</template>

<script>
import { getFileType } from '@/utils/index'
import uploadItem from './uploadItem.vue'
import { uploadImg } from '@/api/file'
import { resourceUpload } from '@/api/system/institution'
import axios from 'axios'
export default {
  components: {
    uploadItem
  },
  props: {
    limit: {
      type: Number,
      default: 1
    },
    tips: {
      type: String,
      default: '注：jpg、jpeg 或png图片，大小限5M以内，限一张图片'
    },
    enum: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      // 文件上传状态status 0: 未开始上传 1: 文件上传中 2: 文件上传失败 3: 文件上传成功
      // 文件类型fileType: audio[音频mp3/wav/aac/3pg/mar/wma] video[视频3pg/mp4/mov] img[图片jpg/png/jpeg/bmp]
      fileList: [
        // { file: null, name: '大白测试文件', status: 2, authProgress: 0, fileType: 'img', poster: '', url: '' }
        // { file: null, name: '大白测试文件', status: 2, authProgress: 0, fileType: 'img', poster: '', url: '' },
        // { file: null, name: '大白测试文件', status: 1, authProgress: 50, fileType: 'img', poster: '', url: '' },
        // { file: null, name: '大白测试文件', status: 1, authProgress: 75, fileType: 'img', poster: '', url: '' },
        // { file: null, name: '大白测试文件', status: 1, authProgress: 100, fileType: 'img', poster: '', url: '' },
        // { file: null, name: '大白测试文件', status: 3, authProgress: 0, fileType: 'img', poster: '', url: 'https://dev.oss.hokkj.cn/微信小程序网络检测规则.png' },
        // { file: null, name: '大白测试文件', status: 3, authProgress: 0, fileType: 'video', poster: '', url: 'https://dev.vod.hokkj.cn/customerTrans/543b0cb1efd77766950828c7ab944f3b/717ff29-1811eb2d9da-0004-fd4c-ff1-00fae.mp4?auth_key=1667628593-6bfb6a56d0144166a803b0174d13ba8a-0-fb252244b3d3bd0b084a5ad042a6ace8' },
        // { file: null, name: '大白测试文件', status: 3, authProgress: 0, fileType: 'audio', poster: '', url: 'https://dev.oss.hokkj.cn/高伟光体温高.mp3' }
      ],
      cancelToken: axios.CancelToken
    }
  },
  mounted() {
    this.setFileList([])
  },
  methods: {
    handleExceed() {
      this.$message.error('文件数量超出限制')
    },
    beforeUpload(file) {
      const fileType = getFileType(file.name)
      if (fileType.fileType === 'img') {
        const isLt5M = file.size / 1024 / 1024 < 5
        !isLt5M && this.$message.error('上传图片大小不能超过5MB!')
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
        materialName: `${this.$getUuiD(10)}.${this.$getFileType(selectFile.name).suffix}`,
        materialSize: selectFile.size,
        formData: formData
      })
      this.$emit('change', this.fileList)
      const index = this.fileList.length - 1
      const self = this.fileList[index]
      var reader = new FileReader()
      reader.readAsDataURL(selectFile)
      reader.onload = (theFile) => {
        var image = new Image()
        image.src = theFile.target.result
        image.onload = async() => {
          try {
            const res = await uploadImg(formData,
              (progressEvent) => {
                const authProgress = (progressEvent.loaded / progressEvent.total * 100) | 0
                // 调用onProgress方法来显示进度条，需要传递个对象 percent为进度值
                if (authProgress === 100) {
                  self.authProgress = 99
                } else {
                  self.authProgress = authProgress
                }
              },
              self.source.token)
            const url = res.data.url
            setTimeout(() => {
              resourceUpload({
                uploadResourceEnum: this.enum,
                resourceUrl: url
              }).then(res => {
                console.log(res)
                this.fileList[index].status = 3
                this.fileList[index].url = url
                this.fileList[index].resourceUrl = res.data
                this.fileList[index].authProgress = 100
              }).catch(() => {
                this.fileList[index].status = 2
                this.fileList[index].authProgress = 100
              })
            }, 500)
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
      await this.upload(self)
    },
    // 上传重试
    async resumeUpload(self) {
      self.status = 1
      // 设置重试次数为五次。
      try {
        const result = await self.client.multipartUpload(self.ossTeacherFolder + self.name, self.file, {
          checkpoint: self.abortCheckpoint,
          progress: (p, cpt, res) => {
            // 为了实现断点上传，您可以在上传过程中保存断点信息（checkpoint）。发生上传错误后，将已保存的checkpoint作为参数传递给multipartUpload，此时将从上次上传失败的地方继续上传。
            // 获取上传进度。
            self.authProgress = Number((p * 100).toFixed(2))
            self.abortCheckpoint = cpt
          }
        })
        // eslint-disable-next-line require-atomic-updates
        self.url = `${this.ossConfig.ossBucketUrl}${self.ossTeacherFolder}${self.name}`
        // eslint-disable-next-line require-atomic-updates
        self.poster = self.url + '?spm=qipa250&x-oss-process=video/snapshot,t_2,f_jpg,w_800,h_600,m_fast'
        // eslint-disable-next-line require-atomic-updates
        self.status = 3
        console.log(result)
        this.$emit('change', this.fileList)
      } catch (e) {
        if (e.name === 'cancel') {
          // eslint-disable-next-line require-atomic-updates
          self.status = 4
        } else {
          console.log('上传失败:', e)
          // eslint-disable-next-line require-atomic-updates
          self.status = 2
        }
      }
    },
    // 获取是否还有正在上传的文件
    getUploadFile() {
      const index = this.fileList.findIndex((v) => v.status === 1)
      return index > -1
    },
    // 点击删除
    delFile(item, index) {
      console.log(item, index)
      if (item.abortCheckpoint) {
        item.client && item.client.abortMultipartUpload(item.abortCheckpoint.name, item.abortCheckpoint.uploadId)
      }
      this.fileList.splice(index, 1)
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
            background: #FBFCFE;
            width: 160px;
            height: 90px;
        }
    }
}
.upload {
    display: flex;
    flex-wrap: wrap;
    .uploadView {
        width: 160px;
        height: 90px;
        background: #FBFCFE;
        border-radius: 4px;
        // border: 1px solid #E1E6ED;
        .uploadViewText {
            margin-top: 12px;
            font-size: 12px;
            font-family: MicrosoftYaHei;
            color: #0C6FFF;
            line-height: 20px;
        }
    }
    .tips {
        margin-top: 5px;
        margin-left: 8px;
        font-size: 12px;
        font-family: MicrosoftYaHei;
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
