<template>
  <!-- 上传弹框 -->
  <div class="upload">
    <el-upload
      v-if="fileList.length < maxLength"
      ref="upload"
      class="uploadView m-r-16"
      drag
      action="#"
      :limit="maxLength"
      :accept="accept"
      :before-upload="beforeUpload"
      :http-request="upload"
      :show-file-list="false"
    >
      <i class="el-icon-plus" />
      <div class="uploadViewText">点击/拖拽上传</div>
    </el-upload>

    <template v-for="(item, index) in fileList">
      <uploadItem
        :key="index"
        class="m-r-16"
        :status="item.status"
        :url="item.url"
        :accept="accept"
        :auth-progress="item.authProgress"
        :before-upload="beforeUpload"
        @del="delFile(item, index)"
        @again="alignUpload(item, index)"
        @upload="upload"
      />
    </template>

    <div class="tips overflowOuto" v-html="tips ? tips.replace(/\n/g, '<br />') : ''" />
  </div>
</template>

<script>
import { getFileType } from '@/utils/index'
import uploadItem from './uploadItem.vue'
import { getOssConfig } from '@/api/file'
export default {
  components: {
    uploadItem
  },
  props: {
    tips: {
      type: String,
      default: ''
    },
    maxLength: {
      type: Number,
      default: 1
    },
    beforeUpload: {
      type: Function,
      default: () => {}
    },
    ossTeacherFolder: {
      type: String,
      default: 'hok_web'
    },
    accept: {
      type: String,
      default: '*'
    }
  },
  data() {
    return {
      ossConfig: {
        region: '',
        accessKeyId: '',
        accessKeySecret: '',
        secure: false,
        bucket: '',
        ossBucketUrl: '',
        ossEndPoint: ''
      },
      // 文件上传状态status 0: 未开始上传 1: 文件上传中 2: 文件上传失败 3: 文件上传成功
      // 文件类型fileType: audio[音频mp3/wav/aac/3pg/mar/wma] video[视频3pg/mp4/mov] img[图片jpg/png/jpeg/bmp]
      fileList: [
        // { file: null, name: '大白测试文件', status: 3, authProgress: 0, fileType: 'audio', poster: '', url: 'https://dev.oss.hokkj.cn/高伟光体温高.mp3' }
      ]
    }
  },
  created() {
    this.getOssConfig()
  },
  mounted() {},
  methods: {
    // 获取oss配置
    getOssConfig() {
      this.loading = true
      getOssConfig()
        .then((res) => {
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
        .catch((err) => {
          console.log(err)
          this.$message.error('获取oss配置失败')
          this.loading = false
        })
    },
    // beforeUpload(file) {

    //   // console.log(file, 'file')
    //   // const fileType = getFileType(file.name)
    //   // console.log(fileType)
    //   // if (fileType.fileType === 'img') {
    //   //   const isLt3M = file.size / 1024 / 1024 < 3
    //   //   !isLt3M && this.$message.error('上传图片大小不能超过 3MB!')
    //   //   return isLt3M
    //   // } else if (fileType.fileType === 'video') {
    //   //   const isLt20M = file.size / 1024 / 1024 < 20
    //   //   !isLt20M && this.$message.error('上传视频大小不能超过 20MB!')
    //   //   return isLt20M
    //   // } else if (fileType.fileType === 'audio') {
    //   //   const isLt10M = file.size / 1024 / 1024 < 10
    //   //   !isLt10M && this.$message.error('上传音频大小不能超过 10MB!')
    //   //   return isLt10M
    //   // } else {
    //   //   this.$message.error(`不支持${fileType.suffix}格式的文件上传`)
    //   //   return false
    //   // }
    //   // 限制上传文件大小 500M
    //   // const isLt20M = file.size / 1024 / 1024 < 20
    //   // if (!isLt20M) {
    //   //   this.$message.error('上传文件大小不能超过 20MB!')
    //   // }
    // },
    // 点击上传视频
    async upload(e) {
      this.$refs.upload && this.$refs.upload.clearFiles()
      console.log('上传文件', e)
      if (!e) {
        return
      }
      const selectFile = e.file
      if (!this.beforeUpload(selectFile)) {
        return
      }
      this.fileList = []
      const fileType = getFileType(selectFile.name)
      const obj = {
        file: selectFile, // 文件对象
        name: `${this.$getUuiD(10)}.${this.$getFileType(selectFile.name).suffix}`, // 文件名
        status: 1, // 状态
        authProgress: 0, // 进度
        ossTeacherFolder: `${this.ossTeacherFolder}/${fileType.fileType}/`,
        poster: '', // 封面
        alignUploadShow: false, // 重新上传mask控制
        abortCheckpoint: null, // 中断点
        // eslint-disable-next-line no-undef
        client: new OSS(this.ossConfig),
        url: '' // 地址
      }
      this.fileList.push(obj)
      this.$emit('change', this.fileList)
      const index = this.fileList.length - 1
      const self = this.fileList[index]
      console.log(self)
      try {
        const options = {
          // 获取分片上传进度、断点和返回值。
          progress: (p, cpt, res) => {
            self.authProgress = Number((p * 100).toFixed(2))
            console.log(p, '上传进度')
            self.abortCheckpoint = cpt
          },
          // 设置并发上传的分片数量。
          parallel: 4,
          // 设置分片大小。默认值为1 MB，最小值为100 KB。
          partSize: 1024 * 1024,
          // headers,
          // 自定义元数据，通过HeadObject接口可以获取Object的元数据。
          // meta: { year: 2020, people: 'test' },
          mime: 'text/plain'
        }
        // 分片上传。
        const res = await self.client.multipartUpload(self.ossTeacherFolder + obj.name, obj.file, {
          ...options
        })
        console.log(res, '上传成功的回调')
        // eslint-disable-next-line require-atomic-updates
        self.url = `${this.ossConfig.ossBucketUrl}${self.ossTeacherFolder}${self.name}`
        // eslint-disable-next-line require-atomic-updates
        self.poster = self.url + '?spm=qipa250&x-oss-process=video/snapshot,t_2,f_jpg,w_800,h_600,m_fast'
        // eslint-disable-next-line require-atomic-updates
        self.status = 3
        const fileList = []
        this.fileList.map((v) => {
          v.status === 3 && fileList.push(v)
        })
        this.$emit('change', fileList)
      } catch (err) {
        if (err.name === 'cancel') {
          // eslint-disable-next-line require-atomic-updates
          self.status = 4
        } else {
          console.log('上传失败:', err)
          // eslint-disable-next-line require-atomic-updates
          self.status = 2
        }
      }
    },
    // 点击重新上传
    async alignUpload(item, index) {
      const self = this.fileList[index]
      await this.resumeUpload(self)
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
            width: 200px;
            height: 112px;
        }
    }
}
.upload {
    display: flex;
    flex-wrap: wrap;
    .uploadView {
        width: 200px;
        height: 112px;
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
      width: 339px;
      height: 112px;
      overflow: auto;
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
