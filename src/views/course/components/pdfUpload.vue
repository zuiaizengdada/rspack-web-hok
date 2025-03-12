<template>
  <div class="pdf-container">
    <el-upload
      ref="upload"
      accept=".pdf"
      action="#"
      :disabled="!!fileList.length"
      multiple
      :before-upload="beforeUpload"
      :http-request="fileChange"
      :show-file-list="false"
    >
      <el-button :disabled="!!fileList.length" type="primary">上传pdf</el-button>
    </el-upload>
    <div v-if="authProgress" class="progress">
      <span class="title">{{ name }}</span>
      <el-progress :percentage="authProgress" />
      <span>{{ loadingText }}</span>
    </div>
    <el-button v-if="hasDel" type="text" @click="handleDel">删除文件</el-button>
  </div>
</template>

<script>
import SparkMD5 from 'spark-md5'
import { getOssConfig } from '@/api/file'
import { pdfCheck, pdfAnalysis, pdfAnalysisGet } from '@/api/shop'
import { getFileType } from '@/utils/index'
import request from './request.js'
export default {
  name: 'PdfUpload',
  props: {
    loading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      fileList: [],
      limit: 2,
      loadingText: '',
      md5: '',
      ossConfig: {
        region: '',
        accessKeyId: '',
        accessKeySecret: '',
        secure: false,
        bucket: '',
        ossBucketUrl: '',
        ossEndPoint: ''
      },
      timer: null
    }
  },
  computed: {
    authProgress() {
      return this.fileList[0]?.authProgress ?? 0
    },
    name() {
      return this.fileList[0]?.nickName ?? ''
    },
    hasDel() {
      return this.authProgress === 100
    }
  },
  destroyed() {
    this.timer && clearInterval(this.timer)
  },
  created() {
    this.getOssConfig()
  },
  methods: {
    // 获取oss配置
    getOssConfig() {
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
        })
        .catch(() => {
          this.$message.error('获取oss配置失败')
        })
    },
    // 点击重新上传
    async alignUpload() {
      const self = this.fileList[0]
      this.upload(self)
    },
    getImageUrl(url) {
      return request({
        url,
        method: 'get'
      })
    },
    fileChange(event) {
      const selectFile = event.file
      if (!selectFile) {
        alert('请先选择需要上传的文件!')
        return
      }
      const fileType = getFileType(selectFile.name)
      const uuid = `${this.getUuiD(10)}`
      const obj = {
        file: selectFile, // 文件对象
        name: `${uuid}.${fileType.suffix}`, // 文件名
        nickName: selectFile.name,
        materialName: uuid, // 文件名
        materialSize: selectFile.size,
        status: 4, // 状态
        authProgress: 0, // 进度
        poster: '', // 封面
        alignUploadShow: false, // 重新上传mask控制
        abortCheckpoint: null, // 中断点
        // eslint-disable-next-line no-undef
        client: new OSS(this.ossConfig),
        errTips: '',
        url: '' // 地址
      }
      this.fileList = [obj]
      // 校验md5
      const fileReader = new FileReader()
      const spark = new SparkMD5() // 创建md5对象（基于SparkMD5）
      fileReader.readAsBinaryString(selectFile) // 对应上传的文件
      this.loadingText = '正在解析文件...'
      // 文件读取完毕之后的处理
      fileReader.onload = (e) => {
        spark.appendBinary(e.target.result)
        this.md5 = spark.end()
        this.getCheck()
      }
    },
    async getCheck() {
      this.loadingText = '正在校验md5...'
      this.$emit('update:loading', true)
      try {
        const { data } = await pdfCheck({ md5: this.md5 })
        if (data) {
          this.loadingText = '格式转换中...'
          this.fileList[0].authProgress = 90
          this.getPdfUrl()
          return
        }
        this.upload()
      } catch (e) {
        this.$emit('update:loading', false)
      }
    },
    getUuiD(randomLength) {
      return Number(
        Math.random()
          .toString()
          .substr(2, randomLength) + Date.now())
        .toString(36) + Math.floor(Math.random() * 10) + 1
    },
    beforeUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 20
      if (!isLt2M) {
        this.$message.error('上传pdf文件大小不能超过 20M!')
        return
      }
    },
    upload() {
      const index = this.fileList.length - 1
      const self = this.fileList[index]
      // 文件上传
      self.authProgress = 0
      self.status = 1
      this.setAuthProgress2Upload(index)
    },
    async setAuthProgress2Upload(index) {
      try {
        const self = this.fileList[index]
        // 分片上传。
        await self.client.multipartUpload('file/pdf/' + self.name, self.file, {
        // 获取分片上传进度、断点和返回值。
          progress: (p, cpt, res) => {
            self.authProgress = Number((p * 100 - 20).toFixed(2))
            this.loadingText = '上传文件中...'
            console.log(p, '上传进度')
            self.abortCheckpoint = cpt
          }
        })
        this.loadingText = '上传成功'
        this.fileList[index].url = `${this.ossConfig.ossBucketUrl}file/pdf/${self.name}`
        console.log(this.fileList[index].url, 'this.fileList[index].url')
        this.fileList[index].poster = self.url
        this.fileList[index].status = 3
        const { code } = await pdfAnalysis({
          url: self.url,
          md5: this.md5,
          name: this.fileList[index].nickName
        })
        if (code === 1) {
          this.loadingText = '格式转换中...'
          this.fileList[index].authProgress = 90
          this.getPdfUrl()
        }
      } catch (e) {
        this.$emit('update:loading', false)
      }
    },
    setFileList(fileList) {
      this.fileList = fileList
    },
    getPdfUrl() {
      this.timer = setInterval(async() => {
        const { data } = await pdfAnalysisGet({ md5: this.md5 })
        if (data) {
          this.timer && clearInterval(this.timer)
          this.loadingText = '解析完成...'
          const list = []
          for (let i = 0; i < data.length; i++) {
            const item = data[i]
            const result = await this.getImageUrl(item + '?x-oss-process=image/info')
            const materialSize = result?.FileSize?.value
            list.push(
              {
                materialUrl: item,
                materialSize,
                materialName: this.fileList[0].materialName
              }
            )
            if (list.length === data.length) {
              this.fileList[0].authProgress = 100
            }
          }
          this.$emit('update:loading', false)
          this.$emit('change', list)
        }
      }, 1000)
    },
    handleDel() {
      this.$delModal({
        tips: '删除pdf文件会把对应的图片也一同删除',
        success: () => {
          this.fileList = []
          this.$emit('del')
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.pdf-container{
    display:flex;
    .progress{
        display: flex;
        align-items: center;
        padding:0 20px ;
        .el-progress{
           width: 200px;
        }
    }
    .title{
        margin-right: 10px;
    }
}
</style>
