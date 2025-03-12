<template>
  <el-dialog
    title="生成示例"
    :visible.sync="getDialogVisible"
    width="930px"
    append-to-body
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    :before-close="dialogBeforeClose"
  >
    <div class="addExampleDialog">
      <el-form
        ref="form"
        :model="form"
        label-width="auto"
        size="small"
        style="margin-bottom: 20px"
      >
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
            <p>
              音频录制请在安静环境下录制，音频大小限制在20M以内的wav,mp3,mp4a格式
            </p>
            <p>上传源音频会重新进行训练，请谨慎操作</p>
          </div>
        </el-form-item>
        <el-form-item
          label="输入音频文字"
          label-width="110px"
          style="margin-bottom: 10px"
        />
        <el-row type="flex" align="middle" justify="space-between">
          <globleConfig
            v-model="valueSpeed"
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
            v-model="valueVolume"
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
      <editorCustom ref="editorCustomRef" />
    </div>
    <div slot="footer" style="text-align: center">
      <el-button type="primary" :loading="loading" @click="submit">
        生成
      </el-button>
      <el-button @click="dialogBeforeClose">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import globleConfig from '../../../globleConfig/index.vue'
import editorCustom from '../../../editorCustom/index.vue'
import {
  addVoiceTrainingExample,
  editVoiceTrainingExample,
  saveVoiceTrainingExampleDraft
} from '@/api/aiVideoManage/training'
import { voiceFormatLimits } from '@/views/digitalPerson/digitalPersonTraining/config/fileLimits.config'
export default {
  name: 'AddDialog',
  components: { globleConfig, editorCustom },
  model: {
    prop: 'dialogVisibleAdd',
    event: 'change'
  },
  props: {
    dialogVisibleAdd: {
      type: Boolean,
      default: false
    },
    row: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      valueSpeed: 100,
      valueVolume: 100,
      globalInterval: undefined,
      loading: false,
      form: {
        file: undefined
      },
      audioUrl: undefined,
      isPlaying: false,
      audioPlayer: null,
      saveDraftId: undefined,
      balanceNotTipsDialog: false,
      balanceNotTipsDialogMsg: ''
    }
  },
  computed: {
    getDialogVisible: {
      get() {
        return this.dialogVisibleAdd
      },
      set(val) {
        this.$emit('change', val)
      }
    }
  },
  watch: {
    getDialogVisible(val) {
      if (val) {
        // 初始化配置
        this.initConfig()
        this.form = {
          file: undefined
        }
        this.$nextTick(() => {
          this.$refs.editorCustomRef.form = {
            ...this.row,
            generateContent: this.row.generateContent || '',
            speed: 100,
            volume: 100,
            voiceThirdType: undefined
          }
          if (this.row.id) {
            this.$refs.editorCustomRef.form.voiceThirdType = this.row.thirdType
            this.$refs.editorCustomRef.form.voiceType = this.row.voiceType
            this.setJobs()
          }
          this.setJobs()
        })
      } else {
        this.clearSetJobs()
      }
    },
    valueSpeed: {
      handler() {
        this.changeSpeed()
      }
    },
    valueVolume: {
      handler() {
        this.changeVolume()
      }
    }
  },
  methods: {
    // 初始化配置
    initConfig() {
      // 文件格式和大小的限制配置
      this.voiceFormatLimits = voiceFormatLimits
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
    clearSetJobs() {
      clearInterval(this.globalInterval)
      this.globalInterval = undefined
    },
    setJobs() {
      if (!this.globalInterval) {
        this.globalInterval = setInterval(() => {
          this.saveDraft()
        }, 30000)
      }
    },
    saveDraft() {
      return new Promise((reslove, reject) => {
        const infoSubmit = this.$refs.editorCustomRef.submitValidate()
        console.log(infoSubmit, '===infoSubmit====================')
        const obj = {
          ...infoSubmit,
          voiceAudioUrl: this.row.voiceAudioUrl,
          pitch: 100,
          id: this.row.id || this.saveDraftId || undefined,
          trainingId: this.row.trainingId,
          speed: this.valueSpeed,
          voiceId: this.row.voiceId,
          thirdType: this.row.thirdType,
          voiceType: this.row.voiceType,
          volume: this.valueVolume
        }
        saveVoiceTrainingExampleDraft(obj)
          .then(res => {
            this.saveDraftId = res.data
            reslove()
            this.$message.success('保存成功')
          })
          .catch(() => {
            reject()
          })
      })
    },
    submit() {
      const info = this.$refs.editorCustomRef.submitValidate()
      if (!info) return
      this.loading = true
      // 创建 FormData 对象
      const formData = new FormData()
      const params = {
        file: this.form.file,
        voiceAudioUrl: this.row.voiceAudioUrl,
        generateContent: info.generateContent,
        id: this.row.id || this.saveDraftId || undefined,
        pitch: 100,
        trainingId: this.row.trainingId,
        speed: this.valueSpeed,
        thirdType: this.row.thirdType,
        userInputText: info.userInputText,
        voiceId: this.row.voiceId,
        voiceType: this.row.voiceType,
        volume: this.valueVolume
      }

      // 将参数添加到 FormData
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined) {
          formData.append(key, params[key])
        }
      })
      const apiFn = this.row.id || this.saveDraftId
        ? editVoiceTrainingExample
        : addVoiceTrainingExample
      apiFn(formData)
        .then(() => {
          this.loading = false
          this.$message.success('操作成功')
          this.dialogBeforeClose()
        })
        .catch(() => {
          this.loading = false
        })
      console.log(info)
    },
    changeSpeed() {
      if (this.$refs.editorCustomRef) {
        this.$refs.editorCustomRef.form.speed = this.valueSpeed
      }
    },
    changeVolume() {
      if (this.$refs.editorCustomRef) {
        this.$refs.editorCustomRef.form.volume = this.valueVolume
      }
    },
    dialogBeforeClose() {
      this.stopAndCleanupAudio()
      this.$emit('success')
      this.$emit('change', false)
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
.addExampleDialog {
  user-select: none;
  max-height: 600px;
  overflow-y: auto;
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
.globleConfig-item {
  width: 48.5%;
}
::v-deep {
  .el-dialog__header {
    padding-bottom: 20px;
    border-bottom: 1px solid #e7e7e7;
    .el-dialog__title {
      font-size: 16px;
      color: #000;
      font-weight: 600;
      letter-spacing: 1px;
    }
  }
  .el-dialog__body {
    padding: 20px 36px;
  }
  .el-form-item__label {
    font-weight: 600;
    color: #000;
    padding-left: 0 !important;
    padding-right: 20px !important;
  }
}
</style>
