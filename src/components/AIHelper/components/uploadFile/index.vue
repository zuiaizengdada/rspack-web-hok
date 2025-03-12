<template>
  <div class="uploadView">
    <el-upload
      action="#"
      :accept="accept"
      :http-request="upload"
      :show-file-list="false"
      :multiple="multiple"
      drag
      :file-list="fileList"
      :limit="limit"
      :on-exceed="onExceed"
      :before-upload="beforeVideoUpload"
    >
      <div class="upload_image_poster">
        <i class="el-icon-upload2 addimag_icon" />
        <span>上传文件</span>
      </div>
      <div slot="tip" class="upload_tips">
        <div>最多可上传10个文件，每个文件最大不超过5M。<br />支持doc、docx、pdf、Excel、txt文件格式</div>
      </div>
    </el-upload>
    <div class="fileList">
      <template v-for="(item, index) in fileList">
        <div :key="`image_${index}`" class="image_poster_box">
          <template>
            <div class="image_poster">
              <fileList :config="config" :url="item.status === 3 ? item.url : item.name" :status="item.status" @del="delFile(item, index)" />
            </div>
            <div class="progress">
              <el-progress v-if="item.status !== 3" :stroke-width="4" :show-text="false" :percentage="item.authProgress" :color="item.status !== 2 ? '#5696FF' : '#F54B4B'" />
            </div>
            <!-- <i class="del el-icon-error" @click="delFile(item, index)" /> -->
          </template>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
// import OSS from 'ali-oss'
import fileList from './list.vue'
import { getOssConfig } from '@/api/file'
const ossTeacherFolder = 'hok_ai/file/'
export default {
  components: {
    fileList
  },
  props: {
    maxShowLength: {
      type: Number,
      default: 5
    },
    // eslint-disable-next-line vue/require-default-prop
    limit: {
      type: Number
    },
    multiple: {
      type: Boolean,
      default: true
    },
    accept: {
      type: String,
      default: '*'
    },
    beforeVideoUpload: {
      type: Function,
      default: (file) => {
        const isLt20G = file.size / 1024 / 1024 / 1024 < 20
        if (!isLt20G) {
          this.$message.error({ message: '视频大小限20G以内，MP4格式', customClass: 'amap-sug-result' })
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
        .then((res) => {
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
        .catch((err) => {
          console.log(err)
          this.$message.error({ message: '获取oss配置失败', customClass: 'amap-sug-result' })
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
        const res = await self.client.multipartUpload(ossTeacherFolder + obj.name, obj.file, {
          ...options
        })
        console.log(res, '上传成功的回调')
        // eslint-disable-next-line require-atomic-updates
        self.url = `${this.config.ossBucketUrl}${ossTeacherFolder}${self.name}`
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
        const result = await self.client.multipartUpload(ossTeacherFolder + self.name, self.file, {
          checkpoint: self.abortCheckpoint,
          progress: (p, cpt, res) => {
            // 为了实现断点上传，您可以在上传过程中保存断点信息（checkpoint）。发生上传错误后，将已保存的checkpoint作为参数传递给multipartUpload，此时将从上次上传失败的地方继续上传。
            // 获取上传进度。
            self.authProgress = Number((p * 100).toFixed(2))
            self.abortCheckpoint = cpt
          }
        })
        // eslint-disable-next-line require-atomic-updates
        self.url = `${this.config.ossBucketUrl}${ossTeacherFolder}${self.name}`
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
    // 删除
    delFile(item, index) {
      if (item.client && item.abortCheckpoint && item.abortCheckpoint.name && item.abortCheckpoint.uploadId) {
        item.client.abortMultipartUpload(item.abortCheckpoint.name, item.abortCheckpoint.uploadId)
      }
      this.fileList.splice(index, 1)
      this.$emit('change', this.fileList)
    },
    setFileList(fileList) {
      this.fileList = fileList
    },
    onExceed() {
      this.$message.error({ message: '文件上传个数超过限制', customClass: 'amap-sug-result' })
    },
    // 获取是否还有正在上传的文件
    getUploadFile() {
      const index = this.fileList.findIndex((v) => v.status === 1)
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
  // display: flex;
  // flex-wrap: wrap;
  width: 100%;
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
  width: 358px;
  height: 60px;
  background: #fbfcfe;
  border-radius: 4px;
  display: flex;
  // flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #0c6fff;
  line-height: 20px;
  margin-right: 20px;
  margin-bottom: 20px;
  cursor: pointer;
  // overflow: hidden;
  .addimag_icon {
    font-size: 18px;
    margin-right: 11px;
  }
  &:hover {
    background: #EFF6FF;
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
.upload_tips {
  width: calc(100% - 358px);
  height: 60px;
  float: right;
  > div {
    font-size: 12px;
    font-family: PingFangSC, PingFang SC;
    font-weight: 400;
    color: #999999;
    margin-left: 24px;
    line-height: 20px;
    margin-top: 10px;
  }
}
.image_poster_box {
  position: relative;
  width: 358px;
  height: 60px;
  margin: 0 11px 20px;
  .del {
    position: absolute;
    right: -6px;
    top: -6px;
    color: #686664;
    cursor: pointer;
    z-index: 2;
  }
  .iconview {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: #fafafa;
    font-size: 24px;
    cursor: pointer;
    .iconText {
      margin-top: 8px;
      font-size: 12px;
      font-family: MicrosoftYaHei;
      color: #0c6fff;
      line-height: 20px;
    }
  }
  .image_poster {
    position: relative;
    width: 358px;
    height: 60px;
    background: #ffffff;
    border-radius: 4px;
    background: #fafafa;
    text-align: center;
    // border: 1px dashed #DCDCDC;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #0c6fff;
    line-height: 20px;
    margin-right: 20px;
    margin-bottom: 20px;
    // overflow: hidden;
    background: #FFFFFF;
    border-radius: 6px;
    border: 1px solid #D3D7D8;
    .addimag_icon {
      font-size: 18px;
      margin-bottom: 13px;
    }
    &:hover {
      border-color: #D3D7D8;
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
}
.slide-enter-active {
  animation-name: slideInUp;
  animation-duration: 0.2s;
  animation-fill-mode: both;
}
.slide-leave-active {
  animation-name: slideOutDown;
  animation-duration: 0.2s;
  animation-fill-mode: both;
}
.progress {
  position: absolute;
  bottom: 0;
  width: 100%;
}
@keyframes slideInUp {
  0% {
    transform: translate3d(100%, 0, 0);
    visibility: visible;
  }

  to {
    transform: translateZ(0);
  }
}
@keyframes slideOutDown {
  0% {
    transform: translateZ(0);
  }

  to {
    visibility: hidden;
    transform: translate3d(100%, 0, 0);
  }
}
.delay-leave-active {
  -webkit-animation-delay: 0.2s;
  -moz-animation-delay: 0.2s;
  -o-animation-delay: 0.2s;
  animation-delay: 0.2s;
}
::v-deep {
  .el-upload-dragger {
    width: 358px;
    height: 60px;
    margin-bottom: 10px;
  }
}
</style>
