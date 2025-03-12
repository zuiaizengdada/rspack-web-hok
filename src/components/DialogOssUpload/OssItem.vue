<template>
  <div class="file-item flex justify-between items-center">
    <svg-icon :icon-class="getFileTypeName(uploadData.name)" class="flex-none" style="font-size: 60px" />
    <div class="item-info flex-1">
      <p class="name mb-1">{{ uploadData.name }}</p>
      <div v-show="uploadData.status === 'uploading'" class="percentage">
        <el-progress :percentage="percentage" :show-text="false" class="mb-1" />
        <p>正在上传中 {{ percentage }}%</p>
      </div>
      <div v-show="uploadData.status === 'waiting' || uploadData.status === 'pause'" class="percentage">
        <el-progress :percentage="percentage" :show-text="false" class="mb-1" />
        <p style="color: #ff7d00">等待中...</p>
      </div>
      <div v-show="uploadData.status === 'error'" class="percentage">
        <el-progress :percentage="percentage" :show-text="false" class="mb-1" />
        <p style="color: #f53f3f">上传失败 {{ percentage }}%</p>
      </div>
      <p v-show="uploadData.status === 'success'" class="size">{{ uploadData.size | filterSize }}</p>
    </div>
    <div class="item-btn flex-none">
      <span v-show="uploadData.status === 'waiting'" @click="handleClickStart">开始上传</span>
      <span
        v-show="uploadData.status === 'error' || uploadData.status === 'pause'"
        @click="handleClickReload"
      >重新上传</span>
      <span v-show="uploadData.status === 'uploading'" @click="handleClickPause">暂停上传</span>
      <span v-show="uploadData.status !== 'success'" @click="handleClickCancel">取消上传</span>
      <span v-show="uploadData.status === 'success'" @click="handleClickClose">关闭显示</span>
    </div>
  </div>
</template>
<script>
const OSS = require('ali-oss')
const ossProdcutFolder = 'hok_product/video/'
import _ from 'lodash'
export default {
  props: {
    info: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      abortCheckpoint: '',
      oss: {},
      ossBucketUrl: '',
      uploadData: {},
      percentage: 0
    }
  },
  watch: {
    'info.status': {
      handler(val) {
        this.uploadData.status = val
        if (val === 'uploading') {
          this.upload()
        }
        if (val === 'cancel') {
          this.cancel()
        }
      },
      deep: true
    }
  },
  created() {
    this.getAliOssToken()
    this.uploadData = this.info
  },
  mounted() {
    setTimeout(() => {
      if (this.uploadData.status === 'uploading') {
        this.upload()
      }
    }, 50)
  },
  methods: {
    // 取消
    handleClickCancel() {
      this.$confirm('确定要取消该文件上传吗', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.oss.cancel()
        this.$emit('cancel', this.uploadData)
        const localOssList = JSON.parse(localStorage.getItem('localOssList')) || []
        const uploadIndex = _.findIndex(localOssList, { 'name': this.uploadData.name })
        this.uploadData.abortCheckpoint = this.abortCheckpoint
        if (uploadIndex > -1) {
          localOssList[uploadIndex] = this.uploadData
        } else {
          localOssList.push(this.uploadData)
        }
        localStorage.setItem('localOssList', JSON.stringify(localOssList))
      })
    },
    // 暂停
    handleClickPause() {
      this.$emit('pause', this.uploadData)
      this.uploadData.status = 'pause'
      this.oss.cancel()
    },
    // 重新上传
    async handleClickReload() {
      this.$emit('reload', this.uploadData)
    },
    async upload() {
      const _this = this
      const localOssList = localStorage.getItem('localOssList')
      const ossList = localOssList ? JSON.parse(localOssList) : []
      const uploadIndex = _.findIndex(ossList, { 'name': this.uploadData.name })
      if (uploadIndex > -1) {
        this.abortCheckpoint = ossList[uploadIndex].abortCheckpoint
      }
      try {
        await _this.oss.multipartUpload(ossProdcutFolder + this.uploadData.name, this.uploadData.file, {
          checkpoint: this.abortCheckpoint,
          progress: (p, cpt, res) => {
            this.abortCheckpoint = cpt
            this.percentage = Number((p * 100).toFixed(2))
          }
        })
        if (!this.isUploaded) {
          this.uploadData.status = 'success'
          this.uploadData.src = `${this.ossBucketUrl}${ossProdcutFolder}${this.uploadData.name}`
          this.$emit('success', this.uploadData)
          this.isUploaded = true
          const uploadIndex = _.findIndex(ossList, { 'name': this.uploadData.name })
          if (uploadIndex > -1) {
            ossList.splice(uploadIndex, 1)
            localStorage.setItem('localOssList', JSON.stringify(ossList))
          }
        }
      } catch (err) {
        console.log(err, 99)
        if (err?.status !== 0) {
          this.uploadData.status = 'success'
        }
      }
    },
    cancel() {
      this.oss.cancel()
      this.$emit('cancel', this.uploadData)
    },
    // 关闭显示
    handleClickClose() {
      this.$emit('close', this.uploadData)
    },
    // 开始上传
    handleClickStart() {
      this.$emit('start', this.uploadData)
    },
    getFileTypeName(name) {
      return name.substring(name.lastIndexOf('.') + 1) || 'el-icon-document'
    },
    getAliOssToken() {
      const ossToken = JSON.parse(localStorage.getItem('ossToken'))
      const { accessKeyId, accessKeySecret, ossBucket, ossBucketUrl } = ossToken
      this.ossBucketUrl = ossBucketUrl
      this.oss = new OSS({
        region: 'oss-accelerate',
        accessKeyId,
        accessKeySecret,
        bucket: ossBucket,
        secure: true
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.file-item {
  margin-bottom: 16px;
  border-radius: 4px;
  border: 1px solid #eff2f6;
  padding: 16px;
  .item-info {
    margin: 0 12px;
  }
  .item-btn {
    span {
      margin-right: 12px;
      color: #0c6fff;
      cursor: pointer;
    }
  }
}
</style>
