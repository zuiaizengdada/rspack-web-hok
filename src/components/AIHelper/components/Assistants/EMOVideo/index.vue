<template>
  <div v-loading="loading" class="emo-video">
    <div class="row-tips">
      <el-tag type="warning" class="tips">
        <div>
          操作指引：上传图片，选择IP老师，输入视频文案内容，点击快速生成，
          提醒：建议视频文案不超过50个字，文案内容越多容易导致视频生成失败
        </div>
      </el-tag>
    </div>
    <el-form
      ref="form"
      :model="form"
      label-width="105px"
      style="margin-top: 20px"
    >
      <el-form-item label="图片上传:" prop="imageUrl">
        <el-upload
          ref="upload"
          class="upload-demo"
          drag
          action="#"
          :http-request="fileChange"
          :show-file-list="false"
          :before-upload="beforeUpload"
          accept="image/jpg,image/jpeg,image/png"
        >
          <template v-if="!form.imageUrl">
            <i class="el-icon-upload" />
            <div class="el-upload__text">
              将文件拖到此处，或<em>点击上传</em>
            </div>
            <div class="el-upload__text m-t-10">{{ tips }}</div>
          </template>
          <el-image v-else fit="contain" :src="form.imageUrl" alt="" />
        </el-upload>
      </el-form-item>
      <el-form-item label="IP老师:">
        <el-select
          v-model="form.teacherId"
          :filterable="true"
          placeholder="请选择"
          class="w-200"
          clearable
          @change="teacherChange"
        >
          <el-option
            v-for="item in teacherList"
            :key="item.teacherId"
            :label="item.teacherName"
            :value="item.teacherId"
          >
            {{ item.teacherName }}
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="视频文案:">
        <el-input
          v-model="form.videoContent"
          type="textarea"
          :rows="{ maxRows: 5 }"
          resize="none"
          maxlength="100"
          placeholder="请输入视频文案"
          show-word-limit
        />
      </el-form-item>
      <el-form-item v-if="isShowNext" label="预计生成时间:">
        <div class="flex flex-middle">
          <el-link :underline="false" type="primary">
            <span style="margin-right: 2px">{{ form.generateTime }}</span>
            分钟
          </el-link>
        </div>
      </el-form-item>

      <el-form-item v-if="taskId" label="视频:">
        <div
          v-show="taskStatus === 'SUCCEEDED'"
          id="shareVideoDetailPlay"
          class="video_play"
        />
        <el-empty
          v-show="taskStatus !== 'SUCCEEDED'"
          style="width: 200px; padding: 0"
          :description="
            taskStatus === 'PENDING' || taskStatus === 'RUNNING'
              ? '生成中'
              : '视频生成失败'
          "
        >
          <template slot="image">
            <img src="@/assets/image/aigc/sczt-spdt.png" alt="" />
          </template>
        </el-empty>
      </el-form-item>
    </el-form>
    <el-row :gutter="10" type="flex" justify="end" style="padding-right: 6px">
      <template v-if="!taskId">
        <el-button @click="audioTest">音频试听</el-button>
        <el-button type="primary" @click="generate">确认生成</el-button>
      </template>

      <template v-if="taskStatus === 'SUCCEEDED'">
        <el-button @click="restGenerate">重新生成</el-button>
        <el-button type="primary" @click="downLoadVideo">下载</el-button>
      </template>
    </el-row>

    <!-- 音频预览 -->
    <div>
      <div
        v-show="dialogVisible"
        class="dialogAudio el-dialog"
        @click="dialogVisibleClick"
      >
        <div class="dialogAudio-title el-dialog__header">音频预览</div>
        <div class="dialogAudio-body">
          <div v-if="!isAudioCompleted && !isAudioError" class="generating">
            <div v-loading="true" style="width: 80px; height: 80px" />
            <p style="font-size: 16px; color: #333333">音频生成中</p>
            <el-alert
              class="m-t-12"
              style="width: 200px"
              title="请勿关闭浏览器窗口！"
              type="warning"
              description=""
              show-icon
              :closable="false"
            />
          </div>
          <div v-if="isAudioCompleted && !isAudioError" class="audio_sus">
            <img :src="audio_sus" />
            <p
              style="font-size: 16px; color: #333333; margin-top: 15px"
              class="m-t-12"
            >
              音频已生成
            </p>
            <audio
              id="audioForm"
              style="width: 100%"
              class="m-t-12"
              :src="form.audioUrl"
              autoplay="autoplay"
              controls="controls"
              controlsList="nodownload"
            />
          </div>
          <div v-if="isAudioError" class="generating">
            <img :src="audio_err" />
            <p style="font-size: 16px; color: #333333; margin-top: 15px">
              音频生成失败
            </p>
          </div>
        </div>
        <el-row type="flex" justify="end" class="dialogAudio-footer">
          <el-button @click="closeAudio">取 消</el-button>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
import { uploadImg } from '@/api/file'
import {
  detectFace,
  getDigitalhumanTeachers,
  composeAudioForUrl,
  submitImageVideoTask,
  queryVideoTask
} from '@/api/aigc'
// import DragDialog from './components/drag-dialog'
import audio_sus from '@/assets/svg/aiManage/audio_sus.svg'
import audio_err from '@/assets/svg/aiManage/audio_err.svg'
export default {
  //   directives: {
  //     DragDialog
  //   },
  data() {
    return {
      audio_sus,
      audio_err,
      form: {
        imageUrl: '',
        audioUrl: '',
        teacherId: '',
        voiceType: undefined,
        videoContent: '',
        thirdType: undefined,
        generateTime: undefined
      },
      tips: '支持jpg/jpeg/png格式，大小不超过2M',
      loading: false,
      teacherList: [],
      dialogVisible: false,
      isAudioCompleted: false,
      isAudioError: false,
      isShowNext: false,
      taskId: undefined,
      intervalGlobal: undefined,
      taskStatus: 'PENDING'
    }
  },
  created() {
    this.getTeacherList()
  },
  destroyed() {
    clearInterval(this.intervalGlobal)
  },
  methods: {
    downLoadVideo() {
      // 把http替换为https
      const url = this.form.videoUrl.replace('http://', 'https://')
      const a = document.createElement('a')
      a.href = url
      a.download = 'image.png'
      a.click()
      setTimeout(() => {
        a.remove()
      })
    },
    restGenerate() {
      this.taskId = undefined
      this.taskStatus = 'PENDING'
      this.generate()
    },
    jobsTask() {
      this.intervalGlobal = setInterval(() => {
        queryVideoTask({ taskId: this.taskId })
          .then(res => {
            this.taskStatus = res.data.taskStatus
            const status = res.data.taskStatus
            if (status === 'SUCCEEDED') {
              clearInterval(this.intervalGlobal)
              this.form.videoUrl = res.data.videoUrl
              this.play(res.data.videoUrl)
            }
            if (status === 'FAILED' || status === 'UNKNOWN') {
              clearInterval(this.intervalGlobal)
              //    this.$message.error({
              //     message: '视频生成失败',
              //     customClass: 'amap-sug-result'
              //   })
            }
          })
          .catch(() => {
            clearInterval(this.intervalGlobal)
          })
      }, 2000)
    },
    generate() {
      if (!this.form.imageUrl) {
        this.$message.error({
          message: '请上传图片',
          customClass: 'amap-sug-result'
        })
        return
      }
      if (!this.form.teacherId) {
        this.$message.error({
          message: '请选择IP老师',
          customClass: 'amap-sug-result'
        })
        return
      }
      if (!this.form.videoContent) {
        this.$message.error({
          message: '请输入视频文案',
          customClass: 'amap-sug-result'
        })
        return
      }
      let text = '<speak>' + this.form.videoContent + '</speak>'
      if (this.form.thirdType === 3) {
        text = text.replace(/<speak>/g, '').replace(/<\/speak>/g, '')
      }
      const params = {
        pitch: 100,
        speed: 100,
        teacherId: this.form.teacherId,
        userInputText: text,
        voiceType: this.form.voiceType,
        volume: 100
      }
      this.loading = true
      composeAudioForUrl(params)
        .then(res => {
          // 获取音频时长
          const audio = document.createElement('audio')
          audio.src = res.data
          audio.addEventListener('loadedmetadata', () => {
            this.form.generateTime = ((audio.duration * 80) / 60).toFixed(2)
            audio.remove()
            submitImageVideoTask({
              audioUrl: res.data,
              imageUrl: this.form.imageUrl
            })
              .then(res2 => {
                this.taskId = res2.data
                this.jobsTask()
                this.loading = false
                this.isShowNext = true
              })
              .catch(() => {
                this.loading = false
                this.isShowNext = false
              })
          })
        })
        .catch(() => {
          this.loading = false
        })
    },
    destroy() {
      if (!this.playerSdk) {
        return Promise.resolve()
      } else {
        return this.playerSdk.destroy()
      }
    },
    play(option) {
      const _this = this
      console.log(this.playerSdk, '视频播放器')
      this.destroy()
        .then(res => {
          setTimeout(() => {
            try {
              // eslint-disable-next-line no-undef
              const playerSdk = new VePlayer({
                id: 'shareVideoDetailPlay',
                width: 788,
                height: 430,
                lang: 'zh',
                autoplayMuted: false,
                url: option,
                controls: {
                  autoHide: false
                },
                autoplay: false,
                sdkErrorPlugin: {
                  errorImg: false
                },
                playbackRate: [0.5, 1, 1.25, 1.5, 2, 3],
                ignores: ['sdkUnmutePlugin', 'DanmuPlugin']
              })
              // 需要在播放器创建完成后再去监听timeupdate事件
              playerSdk.on('player_create_finish', () => {
                console.log('播放器创建完成')
                _this.player_create_finish = true
                _this.player = playerSdk.getPlayerInstance()
                playerSdk.on('timeupdate', player => {
                  this.zimuArr?.some(item => {
                    if (
                      player.currentTime >= item.startTime / 1000 &&
                      player.currentTime <= item.endTime / 1000
                    ) {
                      this.nowWzData = item.content
                    }
                  })
                  _this.$emit('timeupdate', player.currentTime)
                })
                playerSdk.on('canplay', player => {
                  // _this.$emit('canplay')
                  _this.playerStatus = 'canplay'
                })
                playerSdk.on('play', () => {
                  _this.playerStatus = 'play'
                })
                playerSdk.on('pause', () => {
                  // console.log('视频播放暂停')
                  _this.playerStatus = 'pause'
                })
                playerSdk.on('ended', () => {
                  // console.log('视频播放结束')
                  _this.playerStatus = 'ended'
                })
                playerSdk.on('playing', () => {
                  // console.log('（暂停、卡顿后）恢复播放')
                  _this.playerStatus = 'play'
                })
                playerSdk.on('error', error => {
                  // _this.$message.error('视频播放错误')
                  console.log('视频播放错误', error)
                  _this.playerStatus = 'error'
                })
              })
              _this.playerSdk = playerSdk
            } catch (err) {
              console.log(err)
            }
          }, 100)
        })
        .catch(err => {
          console.log(err, 'err')
        })
    },
    audioTest() {
      if (!this.form.teacherId) {
        this.$message.error({
          message: '请选择IP老师',
          customClass: 'amap-sug-result'
        })
        return
      }
      if (!this.form.videoContent) {
        this.$message.error({
          message: '请输入视频文案',
          customClass: 'amap-sug-result'
        })
        return
      }
      this.dialogVisible = true
      this.isAudioCompleted = false
      this.isAudioError = false
      this.form.audioUrl = ''
      let text = '<speak>' + this.form.videoContent + '</speak>'
      if (this.form.thirdType === 3) {
        text = text.replace(/<speak>/g, '').replace(/<\/speak>/g, '')
      }
      const params = {
        // characterId: '',
        pitch: 100,
        speed: 100,
        teacherId: this.form.teacherId,
        userInputText: text,
        voiceType: this.form.voiceType,
        volume: 100
      }
      composeAudioForUrl(params)
        .then(res => {
          this.isAudioCompleted = true
          this.form.audioUrl = res.data
        })
        .catch(() => {
          this.isAudioError = true
        })
    },
    dialogVisibleClick(e) {
      e.stopPropagation()
    },
    closeAudio(e) {
      e.stopPropagation()
      const audio = document.getElementById('audioForm')
      if (audio !== null) {
        audio.pause()
        audio.currentTime = 0
      }
      this.dialogVisible = false
      this.form.audioUrl = ''
    },
    teacherChange(val) {
      if (val) {
        const info = this.teacherList.find(item => item.teacherId === val)
        this.form.voiceType = info.voiceType
        this.form.thirdType = info.thirdType
      } else {
        this.form.thirdType = undefined
        this.form.voiceType = undefined
      }
    },
    async getTeacherList() {
      const res = await getDigitalhumanTeachers()
      this.teacherList = res.data
    },
    beforeUpload(file) {
      const isIMAGE =
        file.type === 'image/jpeg' ||
        file.type === 'image/jpg' ||
        file.type === 'image/png' ||
        false
      const isLt5M = file.size / 1024 / 1024 < 10
      if (!isIMAGE) {
        this.$message.error({
          message: '上传文件只能是JPG、JPEG、PNG格式!',
          customClass: 'amap-sug-result'
        })
      }
      if (!isLt5M) {
        this.$message.error({
          message: '上传文件大小不能超过 10MB!',
          customClass: 'amap-sug-result'
        })
      }
      return isIMAGE && isLt5M
    },
    fileChange(e) {
      this.loading = true
      const fileData = new File([e.file], e.file.name, {
        type: 'text/plain'
      })
      const formData = new FormData()
      formData.append('file', fileData)
      uploadImg(formData)
        .then(res => {
          this.loading = false
          detectFace({ imageUrl: res.data.url }).then(res2 => {
            if (!res2.data) {
              this.$message.error({
                message: '未检测到人脸，请重新上传',
                customClass: 'amap-sug-result'
              })
              return
            }
            this.form.imageUrl = res.data?.url || undefined
          })
        })
        .catch(() => {
          this.loading = false
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.emo-video {
  position: relative;
  .row-tips {
    margin-top: 20px;
    .tips {
      font-size: 16px;
      padding: 10px;
      height: auto !important;
      line-height: initial !important;
    }
  }
}
.upload-demo {
  width: 457px;
  height: 218px;
  color: #999999;
  ::v-deep .el-upload {
    width: 100%;
    height: 100%;
    .el-upload-dragger {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      background-color: #fbfcfe;
      .el-icon-upload {
        font-size: 80px;
      }
    }
  }
}
.dialogAudio {
  width: 30%;
  position: fixed;
  left: 35%;
  top: 20%;
  z-index: 1999;
  border-radius: 10px;
  background-color: #fff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  // transform: translateY(0) !important;
  // transition: all 0.3s ease-out !important;
  user-select: none;
  .dialogAudio-title {
    font-size: 18px;
    color: #303133;
    padding: 15px 20px;
    border-bottom: 1px solid #ebeef5;
  }
  .dialogAudio-body {
    padding: 15px 20px;
  }
  .dialogAudio-footer {
    padding: 15px 20px;
  }
}
.audio_sus {
  display: flex;
  flex-direction: column;
  align-items: center;
  .tips {
    font-size: 12px;
    color: #f53f3f;
  }
}
.generating {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.audio-custom {
  width: 100%;
  justify-content: center;
  font-size: 30px;
  i {
    cursor: pointer;
  }
}
.video_play {
  width: 300px;
  height: 300px;
}
::v-deep .video_play {
  .xgplayer {
    width: 100% !important;
    height: 100% !important;
    border-radius: 10px;
    background: #333333;
  }
}
</style>
