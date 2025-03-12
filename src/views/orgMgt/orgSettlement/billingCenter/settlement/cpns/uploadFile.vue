<template>
  <div class="uploadView">
    <el-upload
      action="#"
      :accept="accept"
      :http-request="upload"
      :show-file-list="false"
      drag
      :file-list="fileList"
      :limit="limit"
      :on-exceed="onExceed"
      :before-upload="beforeVideoUpload"
    >
      <div v-if="!fileList.length" class="upload_image_poster">
        <i class="el-icon-upload2 addimag_icon" />
        <span>上传文件</span>
      </div>
      <div v-else @click.stop="() => {}">
        <span class="blue-txt" @click.stop="viewFile"> 查看凭证 </span>
        <i class="el-icon-circle-close icon" @click.stop="delFile" />
      </div>
    </el-upload>
  </div>
</template>

<script>
// import OSS from 'ali-oss'
import { getOssConfig } from '@/api/file'
const ossTeacherFolder = 'hok_ai/file/'
export default {
  props: {
    maxShowLength: {
      type: Number,
      default: 5
    },
    // eslint-disable-next-line vue/require-default-prop
    limit: {
      type: Number,
      default: 1
    },
    beforeVideoUpload: {
      type: Function,
      default: file => {
        const isLt20G = file.size / 1024 / 1024 < 20
        if (!isLt20G) {
          this.$message.error({
            message: '文件大小限20M以内，.pdf,.jpg,.png,.jpeg格式文件',
            customClass: 'amap-sug-result'
          })
        }
        return isLt20G
      }
    }
  },
  data() {
    return {
      // 文件上传状态status 0: 未开始上传 1: 文件上传中 2: 文件上传失败 3: 文件上传成功 4: 暂停上传
      // 文件类型fileType: 0[jpg] 1[png] 2[pdf]
      fileList: [],
      showMore: false,
      accept: '.pdf,.jpg,.png,.jpeg',
      config: {
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
  mounted() {
    // eslint-disable-next-line no-undef
    // this.client = new OSS(this.config)
  },
  created() {
    this.getOssConfig()
  },
  methods: {
    // 获取oss配置
    getOssConfig() {
      this.loading = true
      getOssConfig()
        .then(res => {
          this.config = {
            region: 'oss-accelerate',
            accessKeyId: res.data.accessKeyId,
            accessKeySecret: res.data.accessKeySecret,
            secure: true,
            bucket: res.data.ossBucket,
            ossBucketUrl: res.data.ossBucketUrl,
            ossEndPoint: res.data.ossEndPoint
          }
          // eslint-disable-next-line no-undef
          // this.client = new OSS(this.config)
        })
        .catch(err => {
          console.log(err)
          this.$message.error({
            message: '获取oss配置失败',
            customClass: 'amap-sug-result'
          })
          this.loading = false
        })
    },
    // 点击上传文件
    async upload(e) {
      console.log('上传文件', e)
      if (!e) {
        return
      }
      const selectFile = e.file
      const obj = {
        file: selectFile, // 文件对象
        name: `${this.$getUuiD(10)}/${e.file.name}`, // 文件名
        status: 1, // 状态
        authProgress: 0, // 进度
        poster: '', // 封面
        alignUploadShow: false, // 重新上传mask控制
        abortCheckpoint: null, // 中断点
        // eslint-disable-next-line no-undef
        client: new OSS(this.config),
        url: '' // 视频播放地址
      }
      this.fileList.push(obj)
      this.$emit('change', this.fileList)
      const index = this.fileList.length - 1
      const self = this.fileList[index]
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
          partSize: 1024 * 1024
          // headers,
          // 自定义元数据，通过HeadObject接口可以获取Object的元数据。
          // meta: { year: 2020, people: 'test' },
          // mime: 'text/plain'
        }
        // 分片上传。
        const res = await self.client.multipartUpload(
          ossTeacherFolder + obj.name,
          obj.file,
          {
            ...options
          }
        )
        console.log(res, '上传成功的回调')
        // eslint-disable-next-line require-atomic-updates
        self.url = `${this.config.ossBucketUrl}${ossTeacherFolder}${self.name}`
        // eslint-disable-next-line require-atomic-updates
        self.poster =
          self.url +
          '?spm=qipa250&x-oss-process=video/snapshot,t_2,f_jpg,w_800,h_600,m_fast'
        // eslint-disable-next-line require-atomic-updates
        self.status = 3
        const fileList = []
        this.fileList.map(v => {
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
        const result = await self.client.multipartUpload(
          ossTeacherFolder + self.name,
          self.file,
          {
            checkpoint: self.abortCheckpoint,
            progress: (p, cpt, res) => {
              // 为了实现断点上传，您可以在上传过程中保存断点信息（checkpoint）。发生上传错误后，将已保存的checkpoint作为参数传递给multipartUpload，此时将从上次上传失败的地方继续上传。
              // 获取上传进度。
              self.authProgress = Number((p * 100).toFixed(2))
              self.abortCheckpoint = cpt
            }
          }
        )
        // eslint-disable-next-line require-atomic-updates
        self.url = `${this.config.ossBucketUrl}${ossTeacherFolder}${self.name}`
        // eslint-disable-next-line require-atomic-updates
        self.poster =
          self.url +
          '?spm=qipa250&x-oss-process=video/snapshot,t_2,f_jpg,w_800,h_600,m_fast'
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
    // 查看上传文件
    viewFile() {
      window.open(this.fileList[0].url)
    },
    // 删除
    delFile() {
      const curItem = this.fileList[0]
      if (
        curItem.client &&
        curItem.abortCheckpoint &&
        curItem.abortCheckpoint.name &&
        curItem.abortCheckpoint.uploadId
      ) {
        curItem.client.abortMultipartUpload(
          curItem.abortCheckpoint.name,
          curItem.abortCheckpoint.uploadId
        )
      }
      this.fileList.splice(0, 1)
      this.$emit('change', this.fileList)
    },
    setFileList(fileList) {
      this.fileList = fileList
    },
    onExceed() {
      this.$message.error({
        message: '文件上传个数超过限制',
        customClass: 'amap-sug-result'
      })
    },
    // 获取是否还有正在上传的文件
    getUploadFile() {
      const index = this.fileList.findIndex(v => v.status === 1)
      return index > -1
    },
    // 暂停上传
    pause(self) {
      console.log(self)
      self.client.cancel()
    }
  }
}
</script>

<style lang="scss" scoped>
.uploadView {
  height: 32px;
}
.fileList {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  margin-left: -11px;
  margin-right: -11px;
  width: 760px;
}
.upload_image_poster {
  position: relative;
  width: 109px;
  height: 32px;
  background: #fbfcfe;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 400;
  color: #0c6fff;
  border-radius: 4px;
  border: 1px solid #0c6fff;
  cursor: pointer;
  .addimag_icon {
    font-size: 18px;
    margin-right: 4px;
  }
  &:hover {
    background: #eff6ff;
    border-color: #0c6fff;
  }
  .addimag_icon_error {
    font-size: 14px;
    font-family: MicrosoftYaHei;
    color: #f53f3f;
    line-height: 22px;
  }
  .alignUploadShow {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: 2;
    background: #fbfcfe;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    .alignUploadIcon {
      font-size: 24px;
    }
  }
}
.blue-txt {
  color: #0c6fff;
  font-family: 'Microsoft YaHei';
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 32px;
}
.icon {
  color: #0c6fff;
  font-size: 14px;
  margin-left: 2px;
}
.progress {
  position: absolute;
  bottom: 0;
  width: 100%;
}

::v-deep {
  .el-upload-dragger {
    width: 109px;
    height: 32px;
    flex-shrink: 0;
    border-radius: 0;
    border: none;
  }
}
</style>
