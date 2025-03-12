<template>
  <div class="editorCustom">
    <headEditor
      ref="headEditor"
      :teacher-id="form.teacherId"
      @prview="prviewPartAudio"
      @handleAIClick="handleAIClick"
      @emitChange="setInsertTag"
    />
    <div class="textEditor-row">
      <textEditor
        ref="textEditorRef"
        @mousemoveChange="mousemoveChange"
        @countChange="countChange"
        @removeAnnotationsClick="removeAnnotationsClick"
      />
    </div>
    <!-- 悬浮在编辑器的底部按钮 -->
    <div class="footer-editor">
      <div class="flex flex-middle">
        <el-button
          :loading="sensitiveLoading"
          class="sensitive-btn"
          size="small"
          @click.stop="sensitiveChecking"
        >
          敏感词检测
        </el-button>
        <span v-if="sensitiveList.length > 0" class="sensitive-content">
          敏感词：{{ sensitiveList.join(',') }}
        </span>
        <span
          v-if="isNotSensitive"
          style="color: #00b42a; margin-left: 10px; font-size: 14px"
        >
          暂无敏感词
        </span>
      </div>
      <div style="height: 34px; display: flex; align-items: flex-end">
        <span class="count">{{ count }}/ 4000</span>
      </div>
    </div>

    <!-- 音频预览 -->
    <div v-DragDialog @DragDialog="() => {}">
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
            <img
              v-show="form.voiceThirdType == 1 || form.voiceThirdType == 3"
              style="width: 100%; height: 30px"
              src="@/assets/image/aigc/digitalVideoManage/audio.gif"
              alt=""
            />
            <div
              v-show="form.voiceThirdType == 1 || form.voiceThirdType == 3"
              class="flex audio-custom"
            >
              <i
                v-if="isPlay"
                class="el-icon-video-pause"
                style="color: #6da8ff"
                @click="playOrpause"
              />
              <i
                v-else
                class="el-icon-video-play"
                style="color: #6da8ff"
                @click="playOrpause"
              />
            </div>
            <audio
              v-show="form.voiceThirdType == 2 || form.voiceThirdType == 5"
              id="audio"
              style="width: 100%"
              class="m-t-12"
              :src="getAudioData"
              autoplay="autoplay"
              controls="controls"
              controlsList="nodownload"
              @timeupdate="timeupdate"
            />

            <!-- <div style="width: 100%; padding-top: 15px; padding-left: 10px">
            <span class="tips">注意：预览最多支持200字，不影响视频生成</span>
          </div> -->
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
    <noviceGuidance
      v-if="isShowNoviceGuidance"
      ref="noviceGuidanceRef"
      @ok="ok"
    />
  </div>
</template>

<script>
import headEditor from './components/headEditor'
import noviceGuidance from './components/noviceGuidance'
import textEditor from './components/textEditor/index.vue'
import { sensitiveChecking } from '@/api/aigc'
import { submitTask, saveDraft, duoYinZiCheck } from '@/api/aiVideoManage'
import audio_sus from '@/assets/svg/aiManage/audio_sus.svg'
import audio_err from '@/assets/svg/aiManage/audio_err.svg'
import eventBus from '@/utils/eventBus'
import { aiBusinessScenePage } from '@/api/aigc/standardIssueConfig'
import { Base64 } from 'js-base64'
import DragDialog from './components/drag-dialog'

export default {
  directives: {
    DragDialog
  },
  components: {
    textEditor,
    headEditor,
    noviceGuidance
  },
  props: {
    form: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      audio_sus,
      audio_err,
      editorConfig1: {
        placeholder: '请输入文案'
      },
      mode: 'simple',
      editorRef: null,
      sensitiveLoading: false,
      sensitiveList: [],
      audioUrl: '',
      isAudioCompleted: true,
      isNotSensitive: false,
      dialogVisible: false,
      words: {
        pinyinArray: [],
        yinbiaoArray: [],
        text: ''
      },
      ruleTmpList: [],
      isAudioError: false,
      isShowNoviceGuidance: false,
      count: 0,
      globalInterval: undefined,
      audioCount: 0,
      audioContent: [],
      audioHW: [],
      audioHWIndex: 0,
      isPlay: true
      // selectTextLength: 0
    }
  },
  computed: {
    getAudioData() {
      return Number(this.form.voiceThirdType) === 2||Number(this.form.voiceThirdType) === 5
        ? `data:audio/wav;base64,${this.audioUrl}`
        : Number(this.form.voiceThirdType) === 1
          ? `data:audio/wav;base64,${this.audioHW[this.audioHWIndex]}`
          : this.audioHW[this.audioHWIndex]
    }
  },
  watch: {
    'form.generateContent': {
      handler(val) {
        this.$nextTick(() => {
          this.$refs.textEditorRef.mapOldGenerateContent(val)
        })
      },
      deep: true
    },
    'form.teacherId': {
      handler(val) {},
      deep: true
    },
    'form.thirdType': {
      handler(val) {
        this.$nextTick(() => {
          // this.$refs.headEditor.thirdType = val
          // this.$refs.textEditorRef.thirdType = val
          if (this.$refs.noviceGuidanceRef) {
            this.$refs.noviceGuidanceRef.thirdType = val
          }
        })
      },
      deep: true
    },
    'form.thirdConfig': {
      handler(val) {
        this.$nextTick(() => {
          this.$refs.headEditor.setDefaultSpeechSpeedOrVolumeValue(val)
        })
      },
      deep: true
    },
    'form.voiceThirdType': {
      handler(val) {
        this.$nextTick(() => {
          this.$refs.headEditor.thirdType = val
          this.$refs.textEditorRef.thirdType = val
        })
      },
      deep: true
    }
  },
  created() {
    // const isReadNoviceGuidance = localStorage.getItem(
    //   'readNoviceGuidanceV1-3-3' + this.$store.state.user.userInfo.userId
    // )
    // if (!isReadNoviceGuidance) {
    //   this.isShowNoviceGuidance = true
    // }

    this.getTmpRule()
  },
  destroyed() {
    clearInterval(this.globalInterval)
  },
  methods: {
    removeAnnotationsClick() {
      this.$emit('removeAnnotationsClick')
    },
    async setPolyphonicStyle(val) {
      if (val) {
        const text = this.$refs.textEditorRef.getText()
        const res = await duoYinZiCheck({ content: text })
        if (res.code === 1) {
          this.$refs.textEditorRef.reductionSensitiveStyle()
          res.data.map(item => {
            this.$refs.textEditorRef.setSensitiveStyle(item)
          })
        }
      } else {
        this.$refs.textEditorRef.reductionSensitiveStyle()
      }
    },
    reductionannotationsStyle() {
      this.$refs.textEditorRef.reductionannotationsStyle()
    },
    annotationsClick(text) {
      this.$refs.textEditorRef.annotationsClick(text)
    },
    playOrpause() {
      const audio = document.getElementById('audio')
      if (audio !== null) {
        if (this.isPlay) {
          audio.pause()
        } else {
          audio.play()
        }
        this.isPlay = !this.isPlay
      }
    },
    blobToBase64(blob) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onloadend = () => {
          console.log(reader.result)
          this.audioHW.push(reader.result)
          resolve(
            reader.result.split(',').length > 0
              ? reader.result.split(',')[1]
              : ''
          )
        }
        reader.onerror = reject
        reader.readAsDataURL(blob)
      })
    },
    async pcmtoWav(pcmsrt, sampleRate, numChannels, bitsPerSample) {
      // 参数->（base64编码的pcm流，采样频率，声道数，采样位数）
      const header = {
        // OFFS SIZE NOTES
        chunkId: [0x52, 0x49, 0x46, 0x46], // 0    4    "RIFF" = 0x52494646
        chunkSize: 0, // 4    4    36+SubChunk2Size = 4+(8+SubChunk1Size)+(8+SubChunk2Size)
        format: [0x57, 0x41, 0x56, 0x45], // 8    4    "WAVE" = 0x57415645
        subChunk1Id: [0x66, 0x6d, 0x74, 0x20], // 12   4    "fmt " = 0x666d7420
        subChunk1Size: 16, // 16   4    16 for PCM
        audioFormat: 1, // 20   2    PCM = 1
        numChannels: numChannels || 1, // 22   2    Mono = 1, Stereo = 2...
        sampleRate: sampleRate || 16000, // 24   4    8000, 44100...
        byteRate: 0, // 28   4    SampleRate*NumChannels*BitsPerSample/8
        blockAlign: 0, // 32   2    NumChannels*BitsPerSample/8
        bitsPerSample: bitsPerSample || 16, // 34   2    8 bits = 8, 16 bits = 16
        subChunk2Id: [0x64, 0x61, 0x74, 0x61], // 36   4    "data" = 0x64617461
        subChunk2Size: 0 // 40   4    data size = NumSamples*NumChannels*BitsPerSample/8
      }
      function u32ToArray(i) {
        return [i & 0xff, (i >> 8) & 0xff, (i >> 16) & 0xff, (i >> 24) & 0xff]
      }
      function u16ToArray(i) {
        return [i & 0xff, (i >> 8) & 0xff]
      }
      const pcm = Base64.toUint8Array(pcmsrt)
      header.blockAlign = (header.numChannels * header.bitsPerSample) >> 3
      header.byteRate = header.blockAlign * header.sampleRate
      header.subChunk2Size = pcm.length * (header.bitsPerSample >> 3)
      header.chunkSize = 36 + header.subChunk2Size

      const wavHeader = header.chunkId.concat(
        u32ToArray(header.chunkSize),
        header.format,
        header.subChunk1Id,
        u32ToArray(header.subChunk1Size),
        u16ToArray(header.audioFormat),
        u16ToArray(header.numChannels),
        u32ToArray(header.sampleRate),
        u32ToArray(header.byteRate),
        u16ToArray(header.blockAlign),
        u16ToArray(header.bitsPerSample),
        header.subChunk2Id,
        u32ToArray(header.subChunk2Size)
      )
      const wavHeaderUnit8 = new Uint8Array(wavHeader)

      const mergedArray = new Uint8Array(wavHeaderUnit8.length + pcm.length)
      mergedArray.set(wavHeaderUnit8)
      mergedArray.set(pcm, wavHeaderUnit8.length)
      const blob = new Blob([mergedArray], { type: 'audio/wav' })
      // const blobUrl = window.URL.createObjectURL(blob)
      const base64 = await this.blobToBase64(blob)
      return base64
    },
    countChange(count) {
      this.count = count
    },
    setJobs() {
      if (!this.globalInterval) {
        this.globalInterval = setInterval(() => {
          this.saveDraft()
        }, 30000)
      }
    },
    saveDraft(isActive = false, info = null) {
      return new Promise((reslove, reject) => {
        const infoSubmit = info
          ? {
            generateContent: info.generateContent,
            userInputText: info.userInputText,
            plainText: info.plainText
          }
          : this.submitDraft()
        const tmpInfo = info || this.form
        console.log(tmpInfo, '=======================')
        const obj = {
          characterId: tmpInfo.characterId,
          externalImagesId: tmpInfo.externalImagesId,
          name: tmpInfo.name,
          resolutionType: tmpInfo.resolutionType,
          pitch: 100,
          speed: tmpInfo.thirdConfig.speed,
          volume: tmpInfo.thirdConfig.volume,
          teacherId: tmpInfo.teacherId,
          ...infoSubmit,
          materialType: Number(tmpInfo.materialType),
          externalVideoId: tmpInfo.externalVideoId,
          voiceType: tmpInfo.voiceType,
          videoId: tmpInfo.videoId,
          positionHeight: tmpInfo.positionHeight,
          positionWidth: tmpInfo.positionWidth,
          positionX: tmpInfo.positionX,
          positionY: tmpInfo.positionY,
          roleLeftOffset: tmpInfo.roleLeftOffset,
          roleTopOffset: tmpInfo.roleTopOffset,
          roleWidth: tmpInfo.roleWidth
        }
        saveDraft(obj)
          .then(res => {
            this.$emit('saveDraftEmit', res.data, infoSubmit.generateContent)
            this.form.videoId = res.data
            const tsl = JSON.parse(
              localStorage.getItem('configEditorCustomDigitalPersonList')
            )
            const id =
              this.$store.state.user.userInfo.userId + tmpInfo.teacherId + ''
            if (tsl) {
              const ls = Object.keys(tsl)
              const key = ls.find(f => f === id)
              if (key) {
                tsl[key] = {
                  speed: tmpInfo.thirdConfig.speed,
                  volume: tmpInfo.thirdConfig.volume
                }
                localStorage.setItem(
                  'configEditorCustomDigitalPersonList',
                  JSON.stringify(tsl)
                )
              } else {
                tsl[id] = {
                  speed: tmpInfo.thirdConfig.speed,
                  volume: tmpInfo.thirdConfig.volume
                }
                localStorage.setItem(
                  'configEditorCustomDigitalPersonList',
                  JSON.stringify(tsl)
                )
              }
            } else {
              localStorage.setItem(
                'configEditorCustomDigitalPersonList',
                JSON.stringify({
                  [id]: {
                    speed: tmpInfo.thirdConfig.speed,
                    volume: tmpInfo.thirdConfig.volume
                  }
                })
              )
            }
            reslove()

            this.$message.success('保存成功')
            // if (isActive) {
            //   this.$message.info('保存成功')
            // } else {
            //   this.$message.info('保存成功')
            // }
          })
          .catch(() => {
            reject()
          })
      })
    },
    dialogVisibleClick(e) {
      e.stopPropagation()
    },
    async mousemoveChange({
      text,
      length,
      isNestedSub,
      isAllText,
      isFocus,
      partShow
    }) {
      // this.selectTextLength = length || 0
      this.$emit('selectTextLengthEmit', length || 0)
      if (isAllText) {
        const isNumber = /^\d+$/.test(text)
        this.$refs.headEditor.setNumber(isNumber, text)
        const isChineseSingle =
          /^(?:[\u3400-\u4DB5\u4E00-\u9FEA\uFA0E\uFA0F\uFA11\uFA13\uFA14\uFA1F\uFA21\uFA23\uFA24\uFA27-\uFA29]|[\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872\uD874-\uD879][\uDC00-\uDFFF]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1\uDEB0-\uDFFF]|\uD87A[\uDC00-\uDFE0])+$/.test(
            text
          ) && text.length === 1
        this.$refs.headEditor.setChineseSingle(isChineseSingle, text)
      } else {
        this.$refs.headEditor.setNumber(false, '')
        this.$refs.headEditor.setChineseSingle(false, '')
      }
      this.$refs.headEditor.isFocus = isFocus
      this.$refs.headEditor.setIsNestedSub(isNestedSub, partShow || [])
    },
    resetValue() {
      this.$refs.textEditorRef.resetDom()
    },
    ok() {
      localStorage.setItem(
        'readNoviceGuidanceV1-3-3' + this.$store.state.user.userInfo.userId,
        '1'
      )
      this.isShowNoviceGuidance = false
    },
    async getTmpRule() {
      const res = await aiBusinessScenePage({
        pageIndex: 1,
        pageSize: 1000
      })
      this.ruleTmpList = res.data.items
    },
    handleAIClick(record) {
      const id = Number(record.id)
      if (id > 1 && this.$refs.textEditorRef.getText().length < 1) {
        return this.$message.warning('请填写内容!')
      }
      const rTmp = this.ruleTmpList.find(item => item.id === id + 4 + '')
      let text =
        id === 5
          ? '假设你是一名优秀的文案专家，善于发现文案中的错别字、上下文不连贯性，以及明显的语意问题。请针对以下文案内容，检测并输出结果，要求结果简洁明了：\n'
          : rTmp.prompt
      if (rTmp) {
        text = text.replace('${Content', this.$refs.textEditorRef.getText())
        text = text.replace('}', '')
      }
      if (id === 5) {
        text += this.$refs.textEditorRef.getText()
      }
      const value = text
      eventBus.$emit('externalSend', {
        ...record,
        value
      })
    },
    submitDraft() {
      const str = this.$refs.textEditorRef.getText()
      if (str.length < 1) {
        return false
      }

      let text = this.$refs.textEditorRef.convertSSML()
      if (this.form.thirdType === 3) {
        text = text.replace(/<speak>/g, '').replace(/<\/speak>/g, '')
      }
      return {
        generateContent: this.$refs.textEditorRef.getHtml(),
        userInputText: text,
        plainText: str
      }
    },
    submitValidate() {
      this.reductionannotationsStyle()
      const str = this.$refs.textEditorRef.getText()
      if (str.length < 1) {
        this.$message.warning('请填写内容!')
        return false
      }
      if (str.length > 4000) {
        this.$message.error('文本内容不能超过4000字')
        return false
      }
      let text = this.$refs.textEditorRef.convertSSML()
      if (this.form.thirdType === 3) {
        text = text.replace(/<speak>/g, '').replace(/<\/speak>/g, '')
      }
      return {
        generateContent: this.$refs.textEditorRef.getHtml(),
        userInputText: text,
        plainText: str
      }
    },
    closeAudio(e) {
      e.stopPropagation()
      const audio = document.getElementById('audio')
      if (audio !== null) {
        audio.pause()
        audio.currentTime = 0
      }
      this.dialogVisible = false
      this.audioUrl = ''
    },
    prviewPartAudio(record) {
      const content = this.$refs.textEditorRef.prviewAudio(
        Number(record.id),
        Number(record.value)
      )

      this.audioPreview(true, content)
    },
    timeupdate() {
      const audio = document.getElementById('audio')
      if (!audio || this.audioHW.length < 1) return
      const progress = audio.currentTime / audio.duration
      if (progress === 1) {
        console.log('播放完成', this.audioHWIndex === this.audioHW.length - 1)
        if (this.audioHWIndex === this.audioHW.length - 1) {
          this.isPlay = false
          this.audioHWIndex = 0
          this.$nextTick(() => {
            audio.pause()
          })
          return
        }
        this.audioHWIndex++

        if (this.audioHWIndex < this.audioHW.length) {
          audio.play()
        }
      }
    },
    // 预览音频
    async audioPreview(ispart = false, data = undefined) {
      this.$uweb &&
        this.$uweb.setAction('Event_Create_AI_Video_Audio_Frequency_Review')
      this.isAudioCompleted = false
      this.audioContent = ispart
        ? data
        : this.$refs.textEditorRef.isSelectTextAudioPreview()
      if (this.audioContent.join('').length < 1) return
      // if (this.audioContent.join('').length > 4000) {
      //   this.$message.error('预览音频内容不能超过4000字！')
      //   return
      // }
      if (this.form.voiceThirdType === 3) {
        this.audioContent = this.audioContent.map(item => {
          return item.replace(/<speak>/g, '').replace(/<\/speak>/g, '')
        })
      }
      this.audioCount = 0
      const obj = {
        teacherId: this.form.teacherId,
        characterId: this.form.characterId,
        userInputText: this.audioContent[this.audioCount],
        pitch: 100,
        speed: this.form.thirdConfig.speed || 100,
        voiceType: this.form.voiceType,
        volume: this.form.thirdConfig.volume || 100
      }
      console.log(obj, '============obj===========obj========')
      this.isAudioError = false
      this.isPlay = true
      this.dialogVisible = true
      this.audioUrl = ''
      this.audioHW = []
      this.audioHWIndex = 0
      await submitTask(obj)
        .then(async res => {
          if (res.code === 1 && this.dialogVisible) {
            const type = Number(this.form.voiceThirdType)
            if (type === 2||type === 5) {
              this.audioUrl += res.data
            } else if (type === 1 || type === 3) {
              this.audioHW.push(res.data)
            }
            this.audioCount++
            if (this.audioCount < this.audioContent.length) {
              this.mapAudios()
              // this.isAudioCompleted = true
            } else {
              this.isAudioCompleted = true
              // this.$nextTick(() => {
              //   const vIdDialog = document.getElementById('videoAudioPreviewId')
              //   vIdDialog.addEventListener('click', this.dialogVisibleClick)
              // })
              this.$uweb && this.$uweb.setAction('Event_huaweiAiAudio_preview')
            }
          }
        })
        .catch(err => {
          console.log(err)
          this.isAudioError = true
        })
    },
    async mapAudios() {
      if (!this.dialogVisible) return
      const obj = {
        teacherId: this.form.teacherId,
        characterId: this.form.characterId,
        userInputText: this.audioContent[this.audioCount],
        pitch: 100,
        speed: this.form.thirdConfig.speed,
        volume: this.form.thirdConfig.volume,
        voiceType: this.form.voiceType
      }
      await submitTask(obj)
        .then(async res => {
          if (res.code === 1 && this.dialogVisible) {
            const type = Number(this.form.voiceThirdType)
            if (type === 2||type === 5) {
              this.audioUrl += res.data
            } else if (type === 1 || type === 3) {
              this.audioHW.push(res.data)
            }
            this.audioCount++
          
            if (this.audioCount < this.audioContent.length) {
              this.mapAudios()
            } else {
              this.isAudioCompleted = true
            }
          }
        })
        .catch(err => {
          console.log(err)
          this.isAudioError = true
        })
    },
    setSensitiveCheckingList(data) {
      this.isNotSensitive = false
      this.sensitiveList = data
      this.sensitiveList.map(item => {
        const regItem = item.replace(/【/g, '').replace(/】/g, '')
        this.$refs.textEditorRef.setSensitiveStyle(regItem)
      })
    },
    sensitiveChecking() {
      if (this.$refs.textEditorRef.getText().length < 1) {
        this.$message.warning('请填写内容!')
        return
      }
      return new Promise((resolve, reject) => {
        this.sensitiveLoading = true
        const text = this.$refs.textEditorRef.getText()
        sensitiveChecking({ content: text })
          .then(res => {
            this.sensitiveLoading = false
            if (res.code === 1) {
              this.sensitiveList = res.data
              if (this.sensitiveList.length > 0) {
                this.isNotSensitive = false
                this.$refs.textEditorRef.reductionSensitiveStyle()
                this.sensitiveList.map(item => {
                  const regItem = item.replace(/【/g, '').replace(/】/g, '')
                  this.$refs.textEditorRef.setSensitiveStyle(regItem)
                })
              } else {
                this.$refs.textEditorRef.reductionSensitiveStyle()
                this.isNotSensitive = true
                this.sensitiveList = []
              }
              resolve(this.sensitiveList.length > 0)
            } else {
              resolve(false)
              this.sensitiveList = []
            }
          })
          .catch(() => {
            reject()
            this.sensitiveLoading = false
          })
      })
    },
    setInsertTag(val) {
      this.$refs.textEditorRef.insertTag(val)
    }
  }
}
</script>
<style lang="scss" scoped>
.editorCustom {
  width: 100%;
  height: calc(100vh - 425px);
  padding: 0 20px;
  position: relative;
}
.textEditor-row {
  position: relative;
  width: 100%;
  height: calc(100vh - 425px - 48px);
  border-radius: 0px 0px 4px 4px;
  border: 1px solid #e1e6ed;
  border-top: none;
}
.footer-editor {
  display: flex;
  justify-content: space-between;
  position: absolute;
  width: 96%;
  padding: 0 19px;
  bottom: 20px;
  z-index: 999;
  user-select: none;
  .sensitive-btn {
    background: #f9f9f9;
    border-radius: 4px;
    border: 1px solid #dcdfe6;
    color: #333333;
    font-size: 14px;
    display: flex;
    .sensitive-row {
      display: flex;
      align-items: center;
      img {
        width: 15px;
        height: 15px;
        margin-right: 5px;
      }
    }
    &:hover {
      background-color: #e7f1ff;
      border-color: #b6d4ff;
    }
  }
  .sensitive-content {
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #f53f3f;
    margin-left: 10px;
  }
  .count {
    color: #909399;
    font-size: 12px;
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
</style>
