<template>
  <div class="editorCustom">
    <!-- :teacher-id="form.teacherId" -->
    <headEditor
      ref="headEditor"
      @handleAIClick="handleAIClick"
      @emitChange="setInsertTag"
    />
    <div class="textEditor-row">
      <textEditor
        ref="textEditorRef"
        @mousemoveChange="mousemoveChange"
        @countChange="countChange"
      />
    </div>
    <!-- 悬浮在编辑器的底部按钮 -->
    <div class="footer-editor">
      <div style="height: 34px; display: flex; align-items: flex-end">
        <span class="count">{{ count }}/ 500</span>
      </div>
    </div>
  </div>
</template>

<script>
import headEditor from './components/headEditor'
import textEditor from './components/textEditor/index.vue'
import audio_sus from '@/assets/svg/aiManage/audio_sus.svg'
import audio_err from '@/assets/svg/aiManage/audio_err.svg'
import eventBus from '@/utils/eventBus'
import { aiBusinessScenePage } from '@/api/aigc/standardIssueConfig'

export default {
  components: {
    textEditor,
    headEditor
  },
  data() {
    return {
      form: { voiceThirdType: 2 },
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
  watch: {
    'form.generateContent': {
      handler(val) {
        this.$nextTick(() => {
          this.setValue(val)
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
    this.getTmpRule()
  },
  destroyed() {
    clearInterval(this.globalInterval)
  },
  methods: {
    setValue(val) {
      this.$refs.textEditorRef.setValue(val)
    },

    countChange(count) {
      this.count = count
    },
    setJobs() {
      console.log('this.globalInterval')
      if (!this.globalInterval) {
        console.log('cjcjcjjcs')
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
        console.log(infoSubmit, '===infoSubmit====================')
        const obj = {
          ...infoSubmit,
          characterId: tmpInfo.characterId,
          id: tmpInfo.id || undefined,
          characterVideoUrl: tmpInfo.videoUrl,
          photoUrl: tmpInfo.photoUrl,
          pitch: 100,
          speed: tmpInfo.speed,
          thirdType: tmpInfo.voiceThirdType,
          trainingId: tmpInfo.trainingId,
          // videoUrl: tmpInfo.videoUrl,
          voiceType: tmpInfo.voiceType,
          volume: tmpInfo.volume
        }
        saveTrainingExampleDraft(obj)
          .then(res => {
            this.$emit('saveDraft', res.data)
            this.$message.success('保存成功')
            reslove()
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
      const str = this.$refs.textEditorRef.getText()
      if (str.length < 1) {
        this.$message.warning('请填写内容!')
        return false
      }
      if (str.length > 500) {
        this.$message.error('文本内容不能超过500字')
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
  margin-top: 20px;
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
  justify-content: flex-end;
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
