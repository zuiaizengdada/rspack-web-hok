<template>
  <!-- 上传弹框 -->
  <div class="upload">
    <el-upload
      v-if="fileList.length < 6"
      ref="upload"
      class="uploadView m-b-32"
      :multiple="true"
      drag
      action="#"
      :limit="10"
      accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.png,.jpeg,.bmp"
      :before-upload="beforeUpload"
      :http-request="upload"
      :show-file-list="false"
      :on-exceed="handleExceed"
    >
      <i class="el-icon-upload" />
      <div class="uploadViewText">点击/拖拽上传文件</div>
      <div class="tips" v-html="tips" />
    </el-upload>

    <template v-for="(item, index) in fileList">
      <uploadItem
        :key="index"
        class="m-b-16"
        :status="item.status"
        :url="item.url"
        :name="item.name"
        :size="item.size"
        :auth-progress="item.authProgress"
        @del="delFile(item, index)"
        @pause="pauseFile(item, index)"
        @again="alignUpload(item, index)"
      />
    </template>
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
  data() {
    return {
      tips: '最多同时拖入10个文件，同时上传3个文件，单个文件大小不能超过20M，上传文件格式为jpg,png,bmp,pdf,doc,docx,xls,xlsx',
      ossConfig: {
        region: '',
        accessKeyId: '',
        accessKeySecret: '',
        secure: false,
        bucket: '',
        ossBucketUrl: '',
        ossEndPoint: ''
      },
      // 文件上传状态status 0: 未开始上传/等待上传 1: 文件上传中 2: 文件上传失败 3: 文件上传成功 4:暂停上传 5: 已删除
      // 文件类型fileType: audio[音频mp3/wav/aac/3pg/mar/wma] video[视频3pg/mp4/mov] img[图片jpg/png/jpeg/bmp]
      fileList: [],
      contentType: {
        'pdf': 'application/pdf',
        'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'xls': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'doc': 'application/msword',
        'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'jpg': 'image/jpeg',
        'png': 'image/png',
        'bmp': 'application/x-bmp'
      }
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
    beforeUpload(file) {
      const isLt20M = file.size / 1024 / 1024 < 200
      !isLt20M && this.$message.error('上传文件大小不能超过 20MB!')
      return isLt20M
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
      const fileType = getFileType(selectFile.name)
      const obj = {
        file: selectFile, // 文件对象
        name: `${this.$getUuiD(10)}.${this.$getFileType(selectFile.name).suffix}`, // 文件名
        status: 0, // 状态
        authProgress: 0, // 进度
        ossTeacherFolder: `hok_deliver/${fileType.fileType}/`,
        poster: '', // 封面
        alignUploadShow: false, // 重新上传mask控制
        abortCheckpoint: null, // 中断点
        creatTime: new Date().getTime(),
        // eslint-disable-next-line no-undef
        client: new OSS(this.ossConfig),
        url: '' // 地址
      }
      this.fileList.push(obj)
      this.uploadTask()
    },
    // 点击重新上传
    async alignUpload(item, index) {
      item.status = 0
      this.uploadTask()
    //   const self = this.fileList[index]
    //   await this.resumeUpload(self)
    },
    // 上传重试
    async resumeUpload(self) {
      const fileType = getFileType(self.name)
      self.status = 1
      // 设置重试次数为五次。
      try {
        const headers = {
          'Content-Type': this.contentType[fileType.suffix]
        }
        const result = await self.client.multipartUpload(self.ossTeacherFolder + self.name, self.file, {
          checkpoint: self.abortCheckpoint,
          headers,
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
        // this.$emit('change', this.fileList)
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
      if (item.status !== 3 && item.abortCheckpoint) {
        item.client && item.client.abortMultipartUpload(item.abortCheckpoint.name, item.abortCheckpoint.uploadId)
      }
      this.fileList.splice(index, 1)
    },
    pauseFile(item, index) {
      item.status = 4
      item.client && item.client.cancel()
    },
    // 设置fileList
    setFileList(arr) {
      this.fileList = arr
      console.log(this.fileList, '1231')
      this.$forceUpdate()
    },
    getFileList() {
      return this.fileList
    },
    handleExceed(files, fileList) {
      this.$message.error(`当前限制选择 10 个文件，本次选择了 ${files.length} 个文件，已经选择 ${fileList.length} 个文件`)
    },
    // 上传队列判断
    canUpload(obj) {
      if (obj.status !== 0 && obj.status !== 1) {
        return
      }
      const arrStatus = {
        'wait': 0,
        'uploading': 0,
        'fail': 0,
        'success': 0,
        'pause': 0
      }
      const arrStatusObj = { 0: 'wait', 1: 'uploading', 2: 'fail', 3: 'success', 4: 'pause' }
      this.fileList.map(v => {
        arrStatus[arrStatusObj[v.status]]++
      })
      if (arrStatus.uploading < 3) {
        obj.status = 1
        obj.creatTime = new Date().getTime()
        if (obj.abortCheckpoint) {
          this.resumeUpload(obj)
        } else {
          this.startUpload(obj)
        }
      } else {
        obj.status = 0
      }
    },
    // 更新任务队列
    uploadTask() {
      console.log('更新任务队列')
      const arrStatus = {
        'wait': 0,
        'uploading': 0,
        'fail': 0,
        'success': 0,
        'pause': 0
      }
      const arrStatusObj = { 0: 'wait', 1: 'uploading', 2: 'fail', 3: 'success', 4: 'pause' }
      this.fileList.map(v => {
        arrStatus[arrStatusObj[v.status]]++
      })

      if (arrStatus.uploading < 3) {
        // 更新上传队列
        if (arrStatus.wait > 0) {
          const index = this.fileList.findIndex(v => v.status === 0)
          index > -1 && this.canUpload(this.fileList[index])
        }
      }
      // console.log('开始更新任务队列', this.fileList)
      this.fileList.map(v => {
        v.ranking = {
          1: 1,
          4: 2,
          0: 3,
          2: 4,
          3: 5,
          5: 6
        }[v.status]
      })
      // this.bubbleSort()
      this.fileList.sort((a, b) => {
        if (a.ranking === b.ranking) {
          return a.creatTime - b.creatTime
        }
        return a.ranking - b.ranking
      })
      this.$forceUpdate()
      console.log(arrStatus)
      if ((arrStatus.wait > 0 && arrStatus.uploading < 3)) {
        this.uploadTask()
      }
      console.log('更新任务队列结束', this.fileList)
    //   this.$emit('numberChange', this.fileList.length)
    },
    async startUpload(self) {
      const fileType = getFileType(self.name)
      try {
        const headers = {
          'Content-Type': this.contentType[fileType.suffix]
        }
        console.log(headers, 'headers')
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
          headers,
          // 自定义元数据，通过HeadObject接口可以获取Object的元数据。
          // meta: { year: 2020, people: 'test' },
          mime: 'text/plain'
        }
        // 分片上传。
        const res = await self.client.multipartUpload(self.ossTeacherFolder + self.name, self.file, {
          ...options
        })
        console.log(res, '上传成功的回调')
        // eslint-disable-next-line require-atomic-updates
        self.url = `${this.ossConfig.ossBucketUrl}${self.ossTeacherFolder}${self.name}`
        // eslint-disable-next-line require-atomic-updates
        self.status = 3
        // this.$emit('change', this.fileList)
        this.uploadTask()
      } catch (err) {
        if (err.name === 'cancel') {
          // eslint-disable-next-line require-atomic-updates
          self.status = 4
          this.uploadTask()
        } else {
          console.log('上传失败:', err)
          // eslint-disable-next-line require-atomic-updates
          self.status = 2
          this.uploadTask()
        }
      }
    }
  }
}
</script>

<style lang='scss' scoped>
::v-deep {
    .el-upload {
        width: 100%;
        height: 100%;
        .el-upload-dragger {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            background: #FBFCFE;
            width: 100%;
            height: 100%;
            border: 1px dashed #E1E6ED;
        }
    }
}
.upload {
    width: 872px;
    display: flex;
    flex-wrap: wrap;
    .uploadView {
        width: 100%;
        height: 212px;
        background: #FBFCFE;
        // border: 1px solid #E1E6ED;
        border-radius: 8px;
        .uploadViewText {
            margin-top: 16px;
            font-size: 16px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #0C6FFF;
            line-height: 24px;
        }
    }
    .tips {
        width: 480px;
        margin-top: 8px;
        font-size: 12px;
        font-family: MicrosoftYaHei;
        color: #999999;
        line-height: 20px;
    }
}
.el-icon-upload {
    margin: 0;
    color:  #E1E6ED;
}
.m-b-32 {
    margin-bottom: 32px;
}
</style>
