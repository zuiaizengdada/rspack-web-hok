<template>
  <AppDialog
    v-model="config.visible"
    title="新增声音训练"
    width="930px"
    height="auto"
    append-to-body
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    :loading="loading"
    :before-close="handleCancel"
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
        <el-form-item label="声音名称" prop="name">
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

        <el-form-item label="声音模型" prop="thirdType">
          <!-- 下拉选择框 -->
          <el-select v-model="form.thirdType" placeholder="请选择">
            <el-option label="模型1" :value="5" />
          </el-select>
        </el-form-item>

        <el-form-item label="源音频" prop="file">
          <label
            v-if="!form.file"
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
            accept="audio/*"
            style="display: none"
            @change="handleVoiceUpload"
          />

          <div v-if="form.file" class="uploaded-box-wrapper">
            <img
              class="uploaded-img"
              src="@/assets/image/voice-upload-default.png"
            />
            <img
              class="close-icon"
              src="@/assets/svg/close.svg"
              @click="handleCancelUploadVoice"
            />

            <img
              v-if="!isPlaying"
              style="
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 32px;
                height: 32px;
                cursor: pointer;
              "
              src="@/assets/image/play_icon@2x.png"
              alt=""
              @click="handlePlayAudio"
            />
            <div v-else class="mask">
              <img
                style="
                  position: absolute;
                  top: 50%;
                  left: 50%;
                  transform: translate(-50%, -50%);
                  width: 45px;
                  height: 45px;
                  cursor: pointer;
                "
                src="@/assets/image/voice-d.svg"
                alt=""
                @click="handlePlayAudio"
              />
            </div>
          </div>

          <div class="tips">
            <p>上传音频格式为wav,mp3,aac,m4a,小于10M的音频</p>
          </div>
        </el-form-item>
        <el-form-item
          v-if="form.thirdType"
          label="输入音频文字"
          style="margin-bottom: 10px"
        />
        <el-row
          v-if="form.thirdType"
          type="flex"
          align="middle"
          justify="space-between"
        >
          <globleConfig
            v-model="form.speed"
            class="globleConfig-item"
            style="padding-left: 5px"
            :info="{
              id: 'speed',
              startText: '慢',
              endText: '快',
              min: 50,
              max: 200
            }"
          />
          <el-divider direction="vertical" class="vertical-el-divider" />
          <globleConfig
            v-model="form.volume"
            class="globleConfig-item"
            :info="{
              id: 'volume',
              startText: '小',
              endText: '大',
              min: 50,
              max: 200
            }"
          />
        </el-row>
      </el-form>
      <editorCustom v-show="form.thirdType" ref="editorCustomRef" />
    </div>

    <template slot="footer">
      <div class="footer">
        <el-button type="primary" @click="handleSubmit">开始训练</el-button>
        <el-button @click="handleCancel">取消</el-button>
      </div>
    </template>
  </AppDialog>
</template>

<script>
import iconPanel from '@/assets/svg/panel/aiselect_icon.svg'
import aidisable from '@/assets/svg/panel/aidisable_icon.svg'
import globleConfig from '../../../globleConfig/index.vue'
import editorCustom from '../../../editorCustom/index.vue'
import AppDialog from '@/components/AppDialog'
import { voiceFormatLimits } from '@/views/digitalPerson/digitalPersonTraining/config/fileLimits.config'
import teacherInput from '@/views/digitalPerson/imageManage/components/teacherSelect/index'

export default {
  components: {
    AppDialog,
    globleConfig,
    editorCustom,
    teacherInput
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
      form: {
        // 声音名称
        name: '',
        // 声音模型
        thirdType: '',
        // 源音频
        file: '',
        userInputText: '',
        // 速度
        speed: 100,
        // 音量
        volume: 100,
        teacherId: undefined
      },
      rules: {
        name: [{ required: true, message: '请输入声音名称', trigger: 'blur' }],
        thirdType: [
          { required: true, message: '请选择声音模型', trigger: 'change' }
        ],
        file: [{ required: true, message: '请上传音频', trigger: 'change' }],
        userInputText: [
          { required: true, message: '请输入音频文字', trigger: 'blur' }
        ]
      },
      audioPlayer: null,
      valueSpeed: 100,
      valueVolume: 100,
      isPlaying: false,
      audioUrl: ''
    }
  },
  watch: {
    'config.visible': {
      handler(val) {
        if (val) {
          this.$refs.form && this.$refs.form.resetFields()
          if (this.config.type === 1) {
            this.form = {
              // 声音名称
              name: '',
              // 声音模型
              thirdType: '',
              // 源音频
              file: '',
              // 输入音频文字
              userInputText: '',
              // 速度
              speed: 100,
              // 音量
              volume: 100,
              teacherId: undefined
            }
          } else {
            this.form = JSON.parse(JSON.stringify(this.config.row))
          }
        } else {
          // 使用新的清理方法
          this.stopAndCleanupAudio()
        }
      },
      deep: true,
      immediate: true
    },
    'form.thirdType': {
      handler(val) {
        if (val) {
          this.$refs.editorCustomRef.form.voiceThirdType = val
          this.$refs.editorCustomRef && this.$refs.editorCustomRef.resetValue()
        }
      },
      deep: true
    }
  },
  mounted() {
    // 初始化配置
    this.initConfig()
  },

  methods: {
    // 初始化配置
    initConfig() {
      // 文件格式和大小的限制配置
      this.voiceFormatLimits = voiceFormatLimits
    },
    // 声音上传
    async handleVoiceUpload(event) {
      // 获取选中的音频
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
      const isValidFiles = await this.checkFileFormatAndSize(files)
      if (!isValidFiles) return

      // 直接使用文件对象
      const file = files[0]
      this.form.file = file

      // 创建临时URL用于预览
      if (this.audioUrl) {
        URL.revokeObjectURL(this.audioUrl)
      }
      this.audioUrl = URL.createObjectURL(file)

      // 重置上传输入的值
      if (event.target) {
        event.target.value = ''
      }
    },
    // 根据文件名获取文件类型
    getFileType(fileName) {
      const extension = fileName.split('.').pop().toLowerCase()

      for (const [type, limits] of Object.entries(this.voiceFormatLimits)) {
        if (limits.extensions.includes(extension)) {
          return type
        }
      }
      return 'unknown' // 未知类型
    },
    // 检查上传文件格式和大小是否符合要求
    async checkFileFormatAndSize(files) {
      // 添加防护性检查
      if (
        !this.voiceFormatLimits ||
        Object.keys(this.voiceFormatLimits).length === 0
      ) {
        this.$message({
          message: '文件格式限制配置未加载，请稍后重试',
          type: 'warning'
        })
        return false
      }

      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const extension = file.name.split('.').pop().toLowerCase()
        const fileSize = file.size

        let isValidFormat = false

        for (const limits of Object.values(this.voiceFormatLimits)) {
          if (
            limits &&
            limits.extensions &&
            limits.extensions.includes(extension)
          ) {
            isValidFormat = true
            if (limits.maxSize && fileSize > limits.maxSize) {
              this.$message({
                message: `文件 "${file.name}" 超过了 ${limits.type} 类型文件的大小限制，请重新选择`,
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
    onVoiceClick() {
      this.$refs.MUploadVoice && this.$refs.MUploadVoice.setFileList([])
    },
    // 提交表单
    async handleSubmit() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          const info = this.$refs.editorCustomRef.submitValidate()
          if (!info) return
          const params = {
            ...this.form,
            pitch: 100,
            generateContent: info.generateContent,
            userInputText: info.userInputText
          }
          this.$emit('submit', params)
          this.stopAndCleanupAudio()
        }
      })
    },
    // 取消提交表单
    handleCancel() {
      // 先停止音频播放
      this.stopAndCleanupAudio()
      this.$emit('cancel')
    },
    // 取消音频上传
    handleCancelUploadVoice() {
      if (this.audioPlayer) {
        this.audioPlayer.pause()
        this.audioPlayer = null
      }
      this.isPlaying = false
      this.form.file = null
      if (this.audioUrl) {
        URL.revokeObjectURL(this.audioUrl)
        this.audioUrl = ''
      }
    },
    // 处理音频播放
    handlePlayAudio() {
      if (!this.audioUrl) return

      if (!this.audioPlayer) {
        this.audioPlayer = new Audio(this.audioUrl)

        // 监听音频播放结束
        this.audioPlayer.addEventListener('ended', () => {
          this.isPlaying = false
        })
      }

      if (this.isPlaying) {
        this.audioPlayer.pause()
        this.isPlaying = false
      } else {
        this.audioPlayer.play()
        this.isPlaying = true
      }
    },
    // 添加一个新的音频清理方法
    stopAndCleanupAudio() {
      if (this.audioPlayer) {
        this.audioPlayer.pause()
        this.audioPlayer.currentTime = 0 // 重置播放进度
        this.audioPlayer.src = '' // 清除音频源
        this.audioPlayer = null
      }
      this.isPlaying = false
      if (this.audioUrl) {
        URL.revokeObjectURL(this.audioUrl)
        this.audioUrl = ''
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.addDialog {
  user-select: none;
  max-height: 600px;
  overflow-y: auto;
  padding: 20px;
  &::-webkit-scrollbar {
    width: 5px;
    height: 5px;
    background-color: transparent;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 6px;
    background: #e5e5e5;
    transition: all 0.4s ease;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
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
    width: 100%;
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

    .mask {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);

      img {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 45px;
        height: 45px;
      }
    }

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
      z-index: 1000;
    }

    img[alt] {
      cursor: pointer;
      transition: transform 0.2s;

      &:hover {
        transform: translate(-50%, -50%) scale(1.1);
      }
    }
  }
}
.globleConfig-item {
  width: 48.5%;
}
::v-deep {
  .el-input {
    input {
      padding-right: 50px;
    }
  }
  .el-dialog__header {
    margin: 8px 0px;

    .close,
    .ss-material-box-header-title {
      color: #000000;
    }
  }
  .el-dialog__body {
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
      box-shadow: 4px 0 8px 0 #0000000d;
      border-radius: 0 0 10px 10px;
    }
  }
}
</style>
