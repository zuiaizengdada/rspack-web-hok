<template>
  <div class="avatarCropper" :style="{width: size +'px', height: size + 'px'}">
    <div v-if="!value">
      <el-upload
        v-if="fileList.length < maxLength"
        ref="upload"
        class="uploadView"
        :style="{width: size + 'px', height: size + 'px'}"
        :disabled="disabled"
        action="#"
        :limit="1"
        accept=".jpg,.jpeg,.png"
        :before-upload="beforeUpload"
        :http-request="upload"
        :show-file-list="false"
      >
        <div class="aiAvatarBox">
          <img src="@/assets/image/aigc/aiAvatar.png" alt="" class="aiAvatar" :style="{width: size +'px', height: size + 'px'}">
          <img src="@/assets/image/aigc/aiAvatarAdd.png" alt="" class="aiAvatarAdd">
        </div>
      </el-upload>

      <template v-for="(item, index) in fileList">
        <uploadItem
          :key="index"
          class="m-r-16"
          :status="item.status"
          :err-tips="item.errTips"
          :url="item.url"
          accept=".jpg,.jpeg,.png,.gif"
          :width="size"
          :disabled="disabled"
          :height="size"
          :auth-progress="item.authProgress"
          :before-upload="beforeUpload"
          @del="delFile(item, index)"
          @again="alignUpload(item, index)"
          @upload="upload"
          @onClick="res => $emit('onClick', res)"
        />
      </template>
    </div>
    <div v-else class="aiAvatarBox">
      <AppMyImage
        :src="value"
        fit="fill"
        style="width: 100px; height: 100px;border-radius: 50%;overflow: hidden;object-fit: fill;"
        :options="{
          width: 567,
          fixed: true,
          option: {
            fixed: true,
            fixedNumber: [1, 1],
            fixedBox: false
          }
        }"
        @close="delImage"
        @success="changeImage"
      />
    </div>
  </div>
</template>

<script>
import AppMyImage from '@/components/AppMyImage'
import uploadItem from './uploadItem.vue'
import { getOssConfig } from '@/api/file'
export default {
  components: {
    AppMyImage,
    uploadItem
  },
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    value: {
      type: String,
      default: 'https://dev.oss.hokkj.cn/hok_product/video/2.jpg'
    },
    size: {
      type: Number,
      default: 100
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
      maxLength: 1,
      fileList: []
    }
  },
  mounted() {
    this.getOssConfig()
  },
  methods: {
    // 获取oss配置
    getOssConfig() {
      this.loading = true
      getOssConfig().then((res) => {
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
          this.$message.error({ message: '获取oss配置失败', customClass: 'amap-sug-result' })
          this.loading = false
        })
    },
    changeImage(res) {
      this.$emit('input', res)
    },
    delImage() {
      this.fileList = []
      this.$emit('input', '')
    },
    beforeUpload(file) {
      const suffix = this.$getFileType(file.name).suffix
      const ifFileType = ['png', 'gif', 'png', 'jpeg', 'jpg'].includes(suffix)
      if (!ifFileType) {
        this.$message.error({ message: '请上传支持的文件格式', customClass: 'amap-sug-result' })
        return false
      }
      return ifFileType
    },
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
      const fileType = this.$getFileType(selectFile.name)
      const obj = {
        file: selectFile, // 文件对象
        name: `${this.getUuiD(10)}.${fileType.suffix}`, // 文件名
        status: 4, // 状态
        authProgress: 0, // 进度
        ossTeacherFolder: `${this.ossTeacherFolder}/${fileType.fileType}/`,
        poster: '', // 封面
        alignUploadShow: false, // 重新上传mask控制
        abortCheckpoint: null, // 中断点
        // eslint-disable-next-line no-undef
        client: new OSS(this.ossConfig),
        errTips: '',
        url: '' // 地址
      }
      this.fileList.push(obj)
      const index = this.fileList.length - 1
      const self = this.fileList[index]
      // eslint-disable-next-line require-atomic-updates
      self.authProgress = 0
      // eslint-disable-next-line require-atomic-updates
      self.status = 1
      console.log('222')
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
        this.$emit('input', self.url)
        this.fileList = []
      } catch (err) {
        if (err.name === 'cancel') {
          // eslint-disable-next-line require-atomic-updates
          self.status = 2
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
          self.status = 2
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
    getUuiD(randomLength) {
      return Number(Math.random().toString().substr(2, randomLength) + Date.now()).toString(36) + Math.floor(Math.random() * 10) + 1
    }
  }
}
</script>

<style lang='scss' scoped>
.avatarCropper {
    position: relative;
    cursor: pointer;
    .uploadView {

    }
    .aiAvatarBox {
        position: relative;
        overflow: hidden;
        .aiAvatar {
          border-radius: 50%;
        }
        .aiAvatarAdd {
          position: absolute;
          bottom: 0;
          right: 0;
          width: 30px;
          height: 30px;
          font-size: 18px;
          line-height: 30px;
          color: #fff;
          text-align: center;
          background: #5696FF;
          border-radius: 50%;
        }
    }
}
::v-deep {
  .cropper-view-box {
    border-radius: 50%;
  }
}
</style>
