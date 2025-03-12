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
    <div class="addImageExampleDialog">
      <el-form ref="form" :model="form" :rules="rules" label-width="90px">
        <el-form-item label="形象视频">
          <div class="video-row">
            <video
              :src="row.videoUrl"
              controls
              controlslist="nodownload"
              preload="auto"
            />
          </div>
        </el-form-item>
        <el-form-item label="选择声音" prop="voiceTypeValue">
          <el-select
            v-model="form.voiceTypeValue"
            placeholder="请选择"
            filterable
            @change="voiceTypeValueChange"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <template v-if="form.voiceTypeValue">
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
              v-if="form.voiceThirdType !== 5"
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
        </template>
      </el-form>
      <editorCustom
        v-show="form.voiceTypeValue"
        ref="editorCustomRef"
        @saveDraft="saveDraft"
      />
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
  getVoicesByOrg,
  addTrainingExample,
  editTrainingExample,
  saveTrainingExampleDraft
} from '@/api/aiVideoManage'

export default {
  name: 'AddImageExampleDialog',
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
      form: { voiceType: undefined, voiceTypeValue: undefined },
      valueSpeed: 100,
      valueVolume: 100,
      options: [],
      rules: {
        voiceTypeValue: [
          { required: true, message: '请选择声音', trigger: 'change' }
        ]
      },
      voiceThirdType: undefined,
      globalInterval: undefined,
      loading: false,
      saveDraftId: undefined
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
        this.form = { voiceType: undefined, voiceTypeValue: undefined }
        this.getVoicesByOrgList()
        this.$nextTick(() => {
          this.$refs.form.resetFields()

          this.$refs.editorCustomRef.form = {
            ...this.row,
            generateContent: this.row.generateContent || '',
            speed: 100,
            volume: 100,
            voiceThirdType: undefined
          }

          if (this.row.id) {
            this.voiceThirdType = this.row.thirdType
            this.$refs.editorCustomRef.form.voiceThirdType = this.row.thirdType
            this.form.voiceTypeValue = this.row.voiceType
            this.$refs.editorCustomRef.form.voiceType = this.row.voiceType
            this.setJobs()
          }
        })
      } else {
        this.clearSetJobs()
      }
    },
    voiceThirdType: {
      handler(val) {
        if (val) {
          console.log(val, 'val')
          this.$refs.editorCustomRef.form.voiceThirdType = val
          this.$refs.editorCustomRef.resetValue()
        }
      },
      deep: true
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
    // 'form.voiceTypeValue'
  },
  methods: {
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
          id: this.row.id || this.saveDraftId || undefined,
          photoUrl: this.row.photoUrl,
          characterVideoUrl: this.row.videoUrl,
          characterId: this.row.characterId,
          pitch: 100,
          speed: this.valueSpeed,
          thirdType: this.voiceThirdType,
          trainingId: this.row.trainingId,
          voiceType: this.form.voiceTypeValue,
          volume: this.valueVolume
        }
        saveTrainingExampleDraft(obj)
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
      this.$refs.form.validate(async valid => {
        if (valid) {
          const info = this.$refs.editorCustomRef.submitValidate()
          if (!info) return
          this.loading = true
          const params = {
            photoUrl: this.row.photoUrl,
            characterVideoUrl: this.row.videoUrl,
            characterId: this.row.characterId,
            generateContent: info.generateContent,
            id: this.row.id || this.saveDraftId || undefined,
            pitch: 100,
            speed: this.valueSpeed,
            thirdType: this.voiceThirdType,
            trainingId: this.row.trainingId,
            userInputText: info.userInputText,
            voiceType: this.form.voiceTypeValue,
            volume: this.valueVolume
          }
          const apiFn =
            this.row.id || this.saveDraftId
              ? editTrainingExample
              : addTrainingExample
          apiFn(params)
            .then(() => {
              this.loading = false
              this.$message.success('操作成功')
              this.dialogBeforeClose()
            })
            .catch(() => {
              this.loading = false
            })
          console.log(info)
        }
      })
    },
    voiceTypeValueChange(val) {
      const info = this.options.find(m => m.value === val)
      this.voiceThirdType = info.thirdType
      this.$refs.editorCustomRef.form.voiceType = val
      this.$refs.editorCustomRef.form.voiceThirdType = this.voiceThirdType
      this.setJobs()
    },
    getVoicesByOrgList() {
      getVoicesByOrg().then(res => {
        this.options = res.data.map(m => ({
          ...m,
          label: m.name,
          value: m.voiceType
        }))
      })
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
      this.$emit('success')
      this.$emit('change', false)
    }
  }
}
</script>

<style lang="scss" scoped>
.addImageExampleDialog {
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
.globleConfig-item {
  width: 48.5%;
}
.video-row {
  margin-top: 10px;
  width: 343px;
  height: 193px;
  border-radius: 4px;
  border: 1px solid #dcdfe5;
  video {
    border-radius: 4px;
    width: 100%;
    height: 100%;
  }
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
