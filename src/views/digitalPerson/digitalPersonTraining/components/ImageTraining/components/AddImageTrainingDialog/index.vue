<template>
  <el-drawer
    :visible.sync="config.visible"
    title="新增形象训练"
    size="723px"
    :loading="loading"
  >
    <div v-loading="loading" class="addDialog">
      <el-form
        ref="form"
        :model="form"
        label-width="auto"
        size="small"
        :rules="rules"
        style="margin-bottom: 20px"
      >
        <el-form-item label="形象名称" prop="name">
          <el-input
            v-model="form.name"
            type="text"
            placeholder="请输入"
            maxlength="80"
            show-word-limit
          />
        </el-form-item>
        <el-form-item label="IP" prop="teacherId">
          <teacherInput
            ref="teacherInput"
            v-model="form.teacherId"
            attribute="teacherId"
          />
        </el-form-item>

        <div class="video-tips-wrapper">
          <!-- 视频录制要求 -->
          <div class="video-tips">
            <div class="video-tips-title">
              <span class="video-tips-title-text">视频录制要求</span>
              <div class="fold" @click="toggleTips">
                <span>{{ isTipsFold ? '收起' : '展开' }}</span>
                <img
                  src="@/assets/image/arrow-down.png"
                  alt=""
                  :style="{
                    transform: isTipsFold ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.3s ease'
                  }"
                />
              </div>
            </div>
            <div v-if="!isTipsFold" class="video-tips-content">
              <p>
                1、脸部正视镜头，轮廓清晰，必须且仅有一个人出镜，避免多人出镜，确保全程脸部无遮挡
              </p>
              <p>
                2、不宜大幅度晃动，手势自然，避免指示性动作（如 OK、一二三等）
              </p>
              <p>3、周围环境安静，光线充足，避免面部过亮或过暗</p>
              <p>4、朗读句子清晰，适当停顿</p>
            </div>
          </div>
          <div v-if="!isTipsFold" class="error-example">
            <div class="error-example-title">错误示例</div>
            <div class="error-example-content">
              <div class="error-example-content-item">
                <img src="@/assets/image/error-example1.png" alt="" />
                <div class="error-example-content-item-text">脸部遮挡</div>
              </div>
              <div class="error-example-content-item">
                <img src="@/assets/image/error-example2.png" alt="" />
                <div class="error-example-content-item-text">多人脸部</div>
              </div>
              <div class="error-example-content-item">
                <img src="@/assets/image/error-example3.png" alt="" />
                <div class="error-example-content-item-text">指示性手势</div>
              </div>
              <div class="error-example-content-item">
                <img src="@/assets/image/error-example4.png" alt="" />
                <div class="error-example-content-item-text">光线暗</div>
              </div>
            </div>
          </div>
        </div>

        <el-form-item label="源视频" prop="file">
          <UploadView
            key="MUploadVideo"
            ref="MUploadVideo"
            type="digitalPerson"
            upload-text="上传"
            :drag="false"
            :width="178"
            :height="100"
            accept=".mp4,.wmv,.flv,.rmvb,.dat,.mov,.mkv,.webm,.avi,.mpeg,.3gp,.ogg"
            :max-length="1"
            :get-oss-c-onfig-api="getOssConfig"
            @onClick="onVideoClick"
            @onSuccess="onVideoUploadSuccess"
          />

          <div class="tips">
            <p>
              1.文件小于500MB，且时长1-5分钟，克隆视频目前有效时长为2分钟（从视频开头截取）
            </p>
            <!-- <p>2.视频分辨率推荐1080P，最大支持2k</p> -->
            <p>
              2.帧速率(fps)必须大于等于25fps,大于25fps会转为25fps,转换后会失帧，如不需自动转，可提前设置好源视频的帧速率
            </p>
            <p>3.视频编码支持H264（推荐）或H265，H265 会被转换为H264</p>
            <p>
              4.上传视频支持mp4、avi、mov、mkv格式。非mp4格式，会转换为mp4格式
            </p>
          </div>
        </el-form-item>

        <el-form-item label="形象图片" prop="photoUrl">
          <label
            v-if="!form.photoUrl"
            for="image-upload-input"
            class="uploadImg-box-wrapper"
          >
            <div class="img-box">
              <img src="@/assets/image/plus-blue.png" />
            </div>
            <div class="text">上传</div>
          </label>

          <input
            id="image-upload-input"
            type="file"
            accept="image/jpeg,image/jpg,image/png"
            style="display: none"
            @change="handleImageUpload"
          />

          <div v-if="form.photoUrl" class="uploaded-box-wrapper">
            <img class="uploaded-img" :src="form.photoUrl" />
            <img
              class="close-icon"
              src="@/assets/svg/close.svg"
              @click="handleCancelUploadImage"
            />
            <div class="mask-img">
              <div
                class="mask-img-item"
                @click="openReviewImgDialog(form.photoUrl, 'horizontal')"
              >
                <i class="el-icon-zoom-in" />
                大图
              </div>
            </div>
          </div>

          <div class="tips"><p>上传图片格式为jpg,jpeg,png,小于1M的图片</p></div>
        </el-form-item>
      </el-form>
      <div class="footer">
        <el-button type="primary" @click="handleSubmit">开始训练</el-button>
        <el-button @click="handleCancel">取消</el-button>
      </div>
    </div>

    <BalanceNotTipsDialog
      v-model="balanceNotTipsDialog"
      :msg="balanceNotTipsDialogMsg"
      :append-to-body="true"
    />

    <ReviewImgDialog
      v-model="bigImgVisible"
      :append-to-body="true"
      :row="selectImg"
      @close="bigImgVisible = false"
    />
  </el-drawer>
</template>

<script>
import iconPanel from '@/assets/svg/panel/aiselect_icon.svg'
import aidisable from '@/assets/svg/panel/aidisable_icon.svg'
import UploadView from '@/components/AppUploadView/upload'
import OSS from 'ali-oss'
import { getOssConfig } from '@/api/file'
import { v4 as uuidv4 } from 'uuid'
import {
  imageFormatLimits,
  videoFormatLimits
} from '../../../../config/fileLimits.config'
import ReviewImgDialog from '../ReviewImgDialog/index.vue'
import teacherInput from '@/views/digitalPerson/imageManage/components/teacherSelect/index'
import { checkPackageOrderBalance } from '@/api/aiVideoManage/setMealModule'
import BalanceNotTipsDialog from '@/views/digitalPerson/digitalPersonTraining/components/balanceNotTipsDialog/index.vue'

export default {
  components: {
    UploadView,
    ReviewImgDialog,
    teacherInput,
    BalanceNotTipsDialog
  },
  props: {
    config: {
      type: Object,
      default: () => {
        return {
          type: 1,
          row: {},
          visible: false
        }
      }
    }
  },
  data() {
    return {
      loading: false,
      iconPanel,
      aidisable,
      balanceNotTipsDialog: false,
      balanceNotTipsDialogMsg: '',
      form: {
        // 形象名称
        name: '',
        // 形象图片
        photoUrl: '',
        // 源视频
        file: '',
        // 上传oss
        uploadOss: '',
        teacherId: undefined
      },
      rules: {
        name: [{ required: true, message: '请输入形象名称', trigger: 'blur' }],
        photoUrl: [
          { required: true, message: '请上传图片', trigger: 'change' }
        ],
        file: [{ required: true, message: '请上传视频', trigger: 'change' }]
      },
      // 阿里云oss
      client: null,
      // ossConfig
      ossConfig: {},
      // 定义文件格式和大小的限制
      imageFormatLimits: {},
      videoFormatLimits: {},
      selectImg: { type: '', url: '' },
      // 是否展示大图
      bigImgVisible: false,
      // 是否展开视频录制要求
      isTipsFold: false
    }
  },
  watch: {
    'config.visible': {
      handler(val) {
        if (val) {
          this.$refs.form && this.$refs.form.resetFields()
          if (this.config.type === 1) {
            this.form = {
              // 形象名称
              name: '',
              // 形象图片
              photoUrl: '',
              // 源视频
              file: '',
              // 上传oss
              uploadOss: '',
              teacherId: undefined
            }
          } else {
            this.form = JSON.parse(JSON.stringify(this.config.row))
          }
        }
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
    // 初始化配置
    this.initConfig()
  },

  methods: {
    getOssConfig,
    // 初始化配置
    initConfig() {
      // oss配置
      this.setOssConfig()
      // 文件格式和大小的限制配置
      this.imageFormatLimits = imageFormatLimits
      this.videoFormatLimits = videoFormatLimits
    },
    // 设置ossConfig
    async setOssConfig() {
      const { code, data } = await getOssConfig()

      if (code === 1) {
        this.ossConfig = {
          region: 'oss-accelerate',
          accessKeyId: data.accessKeyId,
          accessKeySecret: data.accessKeySecret,
          secure: true,
          bucket: data.ossBucket,
          ossBucketUrl: data.ossBucketUrl,
          ossEndPoint: data.ossEndPoint
        }

        this.client = new OSS(this.ossConfig)
      } else {
        this.$message({
          message: data.msg,
          type: 'warning'
        })
      }
    },
    // 形象图片上传
    async handleImageUpload(event) {
      // 获取选中的图片
      const files = event.target ? event.target.files : event

      // 上传文件数量是否超过1
      const isMoreThanOne = files.length > 1
      if (isMoreThanOne) {
        return this.$message({
          message: `最多上传1个文件，请重新选择`,
          type: 'warning'
        })
      }

      // 检查文件格式和大小是否符合要求
      const isValidFiles = await this.checkFileFormatAndSize(files, 'image')
      if (!isValidFiles) return

      // 上传文件
      this.uploadFile(files[0], 'image')

      // 重置上传输入的值
      if (event.target) {
        event.target.value = ''
      }
    },
    // 根据文件名获取文件类型
    getFileType(fileName, fileType) {
      const extension = fileName.split('.').pop().toLowerCase()

      for (const [type, limits] of Object.entries(
        fileType === 'image' ? this.imageFormatLimits : this.videoFormatLimits
      )) {
        if (limits.extensions.includes(extension)) {
          return type
        }
      }
      return 'unknown' // 未知类型
    },
    async uploadFile(file, fileType) {
      this.form.photoUrl = await this.uploadOSS(file, fileType)
    },

    // 上传阿里OSS
    async uploadOSS(file, fileType) {
      const options = {
        meta: { temp: 'demo' },
        mime: 'json',
        headers: { 'Content-Type': 'text/plain' }
      }

      const uploadFileName = this.generateFileName(file, fileType)

      const { url } = await this.client.put(uploadFileName, file, options)

      return url
    },
    // 生成文件名
    generateFileName(file, _fileType) {
      const fileUuid = uuidv4()
      const fileName = file.name
      const fileExtension = fileName.split('.').pop()
      const fileType = this.getFileType(file.name, _fileType)
      const date = new Date()
      const year = date.getFullYear()
      const month = date.getMonth() + 1
      const day = date.getDate()

      return `/digitalPersonTraining/${fileType}/${year}/${month}/${day}/${fileUuid}.${fileExtension}`
    },
    // 检查上传文件格式和大小是否符合要求
    async checkFileFormatAndSize(files, fileType) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const extension = file.name.split('.').pop().toLowerCase()
        const fileSize = file.size

        // 检查文件格式
        let isValidFormat = false
        for (const limits of Object.values(
          fileType === 'image' ? this.imageFormatLimits : this.videoFormatLimits
        )) {
          if (limits.extensions.includes(extension)) {
            isValidFormat = true
            // 检查文件大小
            if (limits.maxSize && fileSize > limits.maxSize) {
              this.$message({
                message: `文件 "${file.name}" 超过了 ${limits.type} 类型文件的${
                  limits.maxSize / 1024 / 1024
                }M大小限制，请重新选择`,
                type: 'warning'
              })

              return false
            }
          }
        }
        if (!isValidFormat) {
          this.$message({
            message: `文件 "${file.name}" 的格式不支持，请重新选择`,
            type: 'warning'
          })

          return false
        }
      }
      return true
    },
    // 取消图片上传
    handleCancelUploadImage() {
      this.form.photoUrl = ''
    },
    onVideoClick() {
      this.$refs.MUploadVideo && this.$refs.MUploadVideo.setFileList([])
    },
    // 提交表单
    async handleSubmit() {
      const res = await checkPackageOrderBalance({ type: 1 })
      if (res.data && res.data.length) {
        this.balanceNotTipsDialog = true
        this.balanceNotTipsDialogMsg = res.data
        return
      }

      this.form.file = this.$refs.MUploadVideo.rowFile
      this.form.uploadOss =
        this.$refs.MUploadVideo.row.res.requestUrls[0].split('?')[0]

      this.$refs['form'].validate(valid => {
        if (valid) {
          this.$emit('sumbit', this.form)
        }
      })
    },
    // 取消提交表单
    handleCancel() {
      this.config.visible = false
    },
    openReviewImgDialog(url, type) {
      this.selectImg = { type: type, url: url }
      this.bigImgVisible = true
    },
    // 展开视频录制要求
    toggleTips() {
      this.isTipsFold = !this.isTipsFold
    },
    // 获取视频第一帧
    getVideoFirstFrame(file) {
      return new Promise(resolve => {
        // 创建video元素
        const video = document.createElement('video')
        // 设置视频自动播放
        video.autoplay = true
        // 设置视频静音(autoplay需要静音)
        video.muted = true
        video.preload = 'auto'
        video.src = URL.createObjectURL(file)

        // 监听视频可以播放时
        video.oncanplay = () => {
          // 暂停在第一帧
          video.pause()

          // 创建canvas
          const canvas = document.createElement('canvas')
          canvas.width = video.videoWidth
          canvas.height = video.videoHeight

          // 绘制第一帧
          const ctx = canvas.getContext('2d')
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

          // 转换为base64
          const dataUrl = canvas.toDataURL('image/jpeg', 0.9) // 设置图片质量为0.9

          // 释放资源
          URL.revokeObjectURL(video.src)

          resolve(dataUrl)
        }

        // 设置一个超时,防止视频加载失败
        setTimeout(() => {
          URL.revokeObjectURL(video.src)
          resolve(null)
        }, 3000)
      })
    },

    // 监听视频上传成功
    async onVideoUploadSuccess(e) {
      try {
        // 获取视频第一帧作为默认图片
        if (!this.form.photoUrl) {
          const firstFrame = await this.getVideoFirstFrame(e.file)
          if (firstFrame) {
            // 将base64转为文件对象
            const file = this.dataURLtoFile(firstFrame, 'first-frame.jpg')
            // 上传图片
            await this.uploadFile(file, 'image')
          } else {
            this.$message.warning('获取视频首帧失败')
          }
        }
      } catch (error) {
        console.error('获取视频首帧失败:', error)
        this.$message.error('获取视频首帧失败')
      }
    },

    // base64转文件对象
    dataURLtoFile(dataurl, filename) {
      const arr = dataurl.split(',')
      const mime = arr[0].match(/:(.*?);/)[1]
      const bstr = atob(arr[1])
      let n = bstr.length
      const u8arr = new Uint8Array(n)
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
      }
      return new File([u8arr], filename, { type: mime })
    },

    onVideoRemove() {
      // 清空形象图片
      this.form.photoUrl = ''
    }
  }
}
</script>

<style lang="scss" scoped>
.addDialog {
  height: 360px;
  padding: 20px;

  .video-tips-wrapper {
    padding: 20px;
    background-color: #fafafa;
    border-radius: 8px;
    margin-bottom: 10px;

    .video-tips {
      &-title {
        display: flex;
        justify-content: space-between;
        align-items: center;

        &-text {
          font-size: 14px;
          font-weight: 700;
          color: #000;
        }

        .fold {
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          gap: 4px;

          span {
            font-size: 14px;
            color: #0c6fff;
          }

          img {
            width: 10px;
            height: 10px;
          }
        }
      }

      &-content {
        margin-top: 10px;
        font-size: 14px;
        color: #777777;
        background-color: #ffffff;
        padding: 15px 10px;
        border-radius: 8px;
        display: flex;
        flex-direction: column;
        gap: 10px;
      }
    }

    .error-example {
      margin-top: 10px;

      &-title {
        font-size: 14px;
        font-weight: 700;
        color: #000;
        margin-bottom: 10px;
      }

      &-content {
        display: flex;
        gap: 10px;
        background-color: #ffffff;
        padding: 20px 25px;
        border-radius: 8px;

        &-item {
          border-radius: 10px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;

          img {
            width: 100%;
            height: 100%;
            object-fit: contain;
            margin-bottom: 10px;
          }

          &-text {
            font-size: 14px;
            color: #000000;
          }
        }
      }
    }
  }

  .uploadImg-box-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border: 1px dashed transparent;
    background: #fafafa;
    border-radius: 4px;
    width: 100px;
    height: 100px;
    margin-top: 10px;
    cursor: pointer;

    &:hover {
      border: 1px dashed #0c6fff;
    }

    .img-box {
      cursor: pointer;
      border-radius: 2px;
      img {
        cursor: pointer;
        width: 20px;
        height: 20px;
      }
    }

    .text {
      cursor: pointer;
      color: #000000;
      font-size: 12px;
      line-height: 18px;
    }
  }
  .tips {
    color: #999999;
    font-size: 12px;
    line-height: 18px;
    margin-top: 10px;
  }

  .uploaded-box-wrapper {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border: 1px solid #dcdfe5;
    border-radius: 4px;
    width: 100px;
    height: 100px;
    margin-top: 10px;
    cursor: pointer;

    &:hover {
      .mask-img {
        display: flex;
      }
    }

    .mask-img {
      display: none;
      width: 100%;
      height: 20px;
      background: rgba(51, 51, 51, 0.4);
      position: absolute;
      bottom: 0;
      align-items: center;
      justify-content: center;
      user-select: none;
      .mask-img-item {
        font-size: 12px;
        color: #ffffff;
        cursor: pointer;
      }
    }

    .uploaded-img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }

    .close-icon {
      position: absolute;
      top: 2px;
      right: 2px;
      width: 12px;
      height: 12px;
    }
  }
}

::v-deep {
  .el-input {
    input {
      padding-right: 50px;
    }
  }

  .el-drawer {
    border-radius: 10px 0 0 10px;
    .el-drawer__header {
      border-bottom: 1px solid #eff2f6;
      padding-bottom: 20px;
      margin-bottom: 0;
      span {
        font-weight: 700;
        color: #000;
        font-size: 16px;
      }
      .el-drawer__close-btn {
        i {
          color: #000;
        }
      }
    }
    .el-drawer__body {
      &::-webkit-scrollbar {
        width: 6px;
        height: 6px;
        background-color: transparent;
      }
      &::-webkit-scrollbar-thumb {
        background: #d8d8d8;
        transition: all 0.4s ease;
      }

      &::-webkit-scrollbar-track {
        background: #fff;
      }

      .el-form-item__label {
        color: #000000;
      }
      .footer {
        margin-top: 20px;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 15px 0;
        gap: 10px;
      }
    }
  }
}
</style>
