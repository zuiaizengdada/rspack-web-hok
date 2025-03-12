<template>

  <!-- 上传弹框 -->
  <div>
    <div class="tips" v-html="tips" />
    <div class="upload">
      <el-upload
        v-if="fileList.length < 10"
        ref="upload"
        class="uploadView m-r-16 m-b-16"
        drag
        multiple
        action="#"
        :limit="10"
        accept=".jpg,.png"
        :before-upload="beforeUpload"
        :http-request="upload"
        :show-file-list="false"

        :on-exceed="onExceed"
      >
        <i class="el-icon-plus" />
        <div class="uploadViewText">点击/拖拽上传</div>
      </el-upload>
      <!-- <div v-if="isEdit" class="upload-item">
        <div v-for="(item, index) in fileList" :key="index" class="fileView m-r-16 m-b-16">
          <ImagePreviewer
            style="width: 100%; height: 100%;"
            :src="item.url"
            fit="contain"
            :preview-src-list="[item.url]"
          />
        </div>
      </div> -->
      <draggable v-model="fileList" class="upload-item" @end="onDragEnd">
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
      </draggable>
    </div>
  </div>

</template>

<script>
import { getFileType } from '@/utils/index'
import uploadItem from './uploadItem.vue'
// import { getOssConfig } from '@/api/file'
import { getLiveOssCConfig } from '@/api/liveRoom/index'
import draggable from 'vuedraggable'

export default {
  components: {
    uploadItem,
    draggable
  },
  props: {
    isEdit: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      tips: '建议图片比例16:9，支持 jpg、png、jpeg格式，大小不超过2MB，最佳分辨率750*420px，最多上传10个。',
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
        // { file: null, name: '大白测试文件', status: 2, authProgress: 0, fileType: 'img', poster: '', url: '' }
        // { file: null, name: '大白测试文件', status: 2, authProgress: 0, fileType: 'img', poster: '', url: '' },
        // { file: null, name: '大白测试文件', status: 1, authProgress: 50, fileType: 'img', poster: '', url: '' },
        // { file: null, name: '大白测试文件', status: 1, authProgress: 75, fileType: 'img', poster: '', url: '' },
        // { file: null, name: '大白测试文件', status: 1, authProgress: 100, fileType: 'img', poster: '', url: '' },
        // { file: null, name: '大白测试文件', status: 3, authProgress: 0, fileType: 'img', poster: '', url: 'https://dev.oss.hokkj.cn/微信小程序网络检测规则.png' },
        // { file: null, name: '大白测试文件', status: 3, authProgress: 0, fileType: 'video', poster: '', url: 'https://dev.vod.hokkj.cn/customerTrans/543b0cb1efd77766950828c7ab944f3b/717ff29-1811eb2d9da-0004-fd4c-ff1-00fae.mp4?auth_key=1667628593-6bfb6a56d0144166a803b0174d13ba8a-0-fb252244b3d3bd0b084a5ad042a6ace8' },
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
      getLiveOssCConfig()
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
      console.log(file, 'file')
      const fileType = getFileType(file.name)
      if (this.fileList.length >= 10) {
        this.$message.closeAll()
        this.$message.error('文件上传个数超过限制')
        return false
      }
      if (fileType.fileType === 'img') {
        const isLt2M = file.size / 1024 / 1024 < 2
        // !isLt2M && this.$message.error('上传图片大小不能超过 2M!')
        !isLt2M && this.$message.error('部分图片上传失败，请重新上传。')
        return isLt2M
      } else {
        // this.$message.error(`不支持${fileType.suffix}格式的文件上传`)
        this.$message.error('部分图片上传失败，请重新上传。')
        return false
      }
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
        status: 1, // 状态
        authProgress: 0, // 进度
        ossTeacherFolder: `hok_live/${fileType.fileType}/`,
        poster: '', // 封面
        alignUploadShow: false, // 重新上传mask控制
        abortCheckpoint: null, // 中断点
        // eslint-disable-next-line no-undef
        client: new OSS(this.ossConfig),
        url: '' // 地址
      }
      this.fileList.push(obj)
      // this.$emit('change', this.fileList)
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
        this.$emit('upload', fileList)
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
      this.$emit('change', this.fileList)
    },
    // 设置fileList
    setFileList(arr) {
      this.fileList = arr
    },
    getFileList() {
      return this.fileList
    },
    // 拖拽结束
    onDragEnd() {
      this.$emit('change', this.fileList)
    },
    // 获取是否还有正在上传的文件
    onExceed() {
      this.$message.error('文件上传个数超过限制')
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
            width: 120px;
            height: 90px;
        }
    }
}
.upload {
    display: flex;
    margin-top: 12px;
    .uploadView {
        width: 120px;
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

}
.upload-item {
  display: flex;
  flex-wrap: wrap;
  max-width: 700px;

}
    .tips {
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        color: #999999;

    }
.el-icon-plus {
        font-weight: 700;
    font-size: 14px;
    color: #333333;
}
.fileView {
   width: 120px;
    height: 90px;
    background: #EDEFF2;
    border-radius: 4px;

}

</style>
