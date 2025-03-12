<template>
  <div v-loading="loading" class="leftSide">
    <!-- 步骤条 -->
    <div class="step-row">
      <step v-model="stepValue" :list="stepList" />
    </div>
    <!-- 全局设置 -->
    <div v-show="stepValue === '2'" class="globleConfig">
      <globleConfig
        v-model="valueSpeed"
        class="globleConfig-item"
        :info="{
          id: 'speed',
          startText: '慢',
          endText: '快',
          min: 50,
          max: 200
        }"
        @ok="changeSpeed"
      />
      <el-divider direction="vertical" class="vertical-el-divider" />
      <globleConfig
        v-if="form.voiceThirdType !== 5"
        v-model="valueVolume"
        class="globleConfig-item globleConfig-item-content-right"
        :info="{
          id: 'volume',
          startText: '小',
          endText: '大',
          min: 50,
          max: 200
        }"
        @ok="changeVolume"
      />
    </div>
    <!-- 表单信息 -->
    <formInfo
      v-show="stepValue === '1'"
      ref="formInfoRef"
      @isValidate="isValidate"
      @changeTeacher="changeTeacher"
      @submit="formInfoSubmit"
      @characterImage="characterImage"
      @updateForm="updateForm"
    />
    <!-- 视频内容 -->
    <editorCustom
      v-show="stepValue === '2'"
      ref="editorCustomRef"
      :form="form"
      @selectTextLengthEmit="selectTextLengthEmit"
      @saveDraftEmit="saveDraftEmit"
      @removeAnnotationsClick="removeAnnotationsClick"
    />

    <savePresetTemplate
      ref="savePresetTemplateRef"
      v-model="isShowSavePresetTemplate"
      @submit="savePresetSubmit"
    />

    <!-- 底部
          :disabled="form.thirdType === 3" -->
    <div class="footer">
      <div class="flex flex-middle">
        <!-- <el-checkbox
          v-if="stepValue === '2'"
          v-model="isPolyphonic"
          class="polyphonic"
          @change="setPolyphonicStyle"
        >
          常见多音字
        </el-checkbox> -->
        <!--  <el-button v-if="stepValue === '2'" size="small" plain>
          文案查重
        </el-button> -->
        <el-button
          v-if="stepValue === '2'"
          size="small"
          type="primary"
          plain
          @click="audioPreview()"
        >
          预览音频
        </el-button>
        <span v-if="stepValue === '2'" class="tips">
          <!-- {{ form.thirdType === 3?'该形象不支持音频预览':'支持选中部分文字进行音频预览' }} -->
          支持选中部分文字进行音频预览
          <span v-if="selectTextLength > 0" class="select-text-length">
            (已选择{{ selectTextLength }}字)
          </span>
        </span>
      </div>
      <div>
        <el-button
          v-if="stepValue === '2'"
          :loading="btnLoading"
          style="width: 80px"
          size="small"
          type="primary"
          plain
          @click="saveDraft()"
        >
          保存
        </el-button>
        <el-button
          v-if="stepValue === '1' && form.thirdType !== 4"
          plain
          type="primary"
          size="small"
          @click="openPreset"
        >
          保存为预设模版
        </el-button>
        <el-button
          v-if="stepValue === '2'"
          :loading="btnLoading"
          style="width: 80px"
          size="small"
          @click="back"
        >
          上一步
        </el-button>
        <el-button
          v-if="stepValue === '1'"
          :class="{ 'dafault-btn': !formOk }"
          :type="formOk ? 'primary' : '-'"
          style="width: 80px"
          :disabled="!formOk"
          size="small"
          @click="next"
        >
          下一步
        </el-button>
        <el-button
          v-if="stepValue === '2'"
          :loading="btnLoading"
          type="primary"
          size="small"
          @click="generateVideo()"
        >
          提交审核
        </el-button>
      </div>
    </div>
    <!-- 次数提示 -->
    <el-dialog
      title=""
      :visible.sync="countDialogVisible"
      width="505px"
      :before-close="
        () => {
          countDialogVisible = false
        }
      "
    >
      <div class="countTip">
        {{
          checkGenerateObj.periodical === 1
            ? '当天'
            : checkGenerateObj.periodical === 2
              ? '本周'
              : '本月'
        }}IP老师已使用{{
          checkGenerateObj.usedTimes
        }}次，已达使用上限次数，建议联系您的负责人。
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          @click="
            () => {
              countDialogVisible = false
            }
          "
        >
          我知道了
        </el-button>
      </span>
    </el-dialog>
    <BalanceNotTipsDialog
      v-model="balanceNotTipsDialog"
      :msg="balanceNotTipsDialogMsg"
    />
  </div>
</template>

<script>
import step from './step'
import formInfo from './formInfo'
import editorCustom from './editorCustom'
import globleConfig from './globleConfig'
import savePresetTemplate from './savePresetTemplate'
import {
  videoEdit,
  videoGenerate,
  backgroundImageUpload,
  savePresetTemplate as savePreset
} from '@/api/aiVideoManage'
import { uploadImg } from '@/api/file'
import { checkGenerateFrequency } from '@/api/aiVideoManage/generate'
import BalanceNotTipsDialog from '@/views/digitalPerson/digitalPersonTraining/components/balanceNotTipsDialog/index.vue'
import { checkPackageOrderBalance } from '@/api/aiVideoManage/setMealModule'

export default {
  inject: ['generateBackgroundImg', 'generateImg'],
  components: {
    step,
    formInfo,
    editorCustom,
    globleConfig,
    savePresetTemplate,
    BalanceNotTipsDialog
  },
  data() {
    return {
      stepList: [
        {
          id: '1',
          label: '选择形象'
        },
        {
          id: '2',
          label: '视频内容'
        }
      ],
      stepValue: '',
      formOk: false,
      loading: false,
      btnLoading: false,
      form: {
        thirdConfig: {
          speed: 100,
          volume: 100
        },
        roleLeftOffset: undefined,
        roleTopOffset: undefined,
        roleWidth: undefined,
        positionX: undefined,
        positionY: undefined,
        thirdType: undefined
      },
      valueSpeed: 100,
      valueVolume: 100,
      isPolyphonic: false,
      selectTextLength: 0,
      isShowSavePresetTemplate: false,
      countDialogVisible: false,
      checkGenerateObj: {},
      balanceNotTipsDialog: false,
      balanceNotTipsDialogMsg: ''
    }
  },
  watch: {
    'form.teacherId': {
      handler(val) {
        if (val) {
          const config = JSON.parse(
            localStorage.getItem('configEditorCustomDigitalPersonList')
          )
          if (config) {
            const ls = Object.keys(config)
            const key = ls.find(
              f => f === this.$store.state.user.userInfo.userId + val
            )
            if (config[key]) {
              this.$nextTick(() => {
                this.valueSpeed = config[key].speed
                this.valueVolume = config[key].volume
              })
            }
          }
        }
      },
      deep: true,
      lmmediate: true
    },
    valueSpeed(val) {
      this.form.thirdConfig.speed = val
    },
    valueVolume(val) {
      this.form.thirdConfig.volume = val
    }
  },
  methods: {
    async checkBalance() {
      const res = await checkPackageOrderBalance({ type: 3 })
      if (res.data && res.data.length) {
        this.balanceNotTipsDialog = true
        this.balanceNotTipsDialogMsg = res.data
        return true
      }
      return false
    },
    updateForm(record) {
      this.form = {
        ...this.form,
        ...record,
        voiceThirdType: record.voiceThirdType,
        voiceType: record.voiceType
      }
      this.$refs.editorCustomRef.resetValue()
    },
    async savePresetSubmit(name) {
      const coverImg = await this.generateImg()
      const file = this.base64ToFile(
        coverImg,
        `${new Date().getTime() + this.form.name}.png`
      )

      const formData = new FormData()
      formData.append('file', file)
      const res = await uploadImg(formData)
      const cloneForm = { ...this.$refs.formInfoRef.form }
      const params = {
        characterId: cloneForm.characterId,
        coverUrl: res.data.url,
        externalImagesId: cloneForm.externalImagesId,
        materialType: cloneForm.materialType,
        name: name,
        positionHeight: cloneForm.positionHeight,
        positionWidth: cloneForm.positionWidth,
        positionX: cloneForm.positionX,
        positionY: cloneForm.positionY,
        resolutionType: cloneForm.resolutionType,
        roleLeftOffset: cloneForm.roleLeftOffset,
        roleTopOffset: cloneForm.roleTopOffset,
        roleWidth: cloneForm.roleWidth,
        teacherId: cloneForm.teacherId,
        thirdType: cloneForm.thirdType,
        voiceType: cloneForm.voiceType
      }
      savePreset(params)
        .then(() => {
          this.isShowSavePresetTemplate = false
          this.$refs.savePresetTemplateRef.loading = false
          this.$message.success({ message: '保存成功' })
        })
        .catch(() => {
          this.$refs.savePresetTemplateRef.loading = false
        })
    },
    openPreset() {
      // if(){}
      this.isShowSavePresetTemplate = true
    },
    removeAnnotationsClick() {
      this.$emit('removeAnnotationsClick')
    },
    setPolyphonicStyle(val) {
      this.$refs.editorCustomRef.setPolyphonicStyle(val)
    },
    isLoadImg(val) {
      this.$refs.formInfoRef.isLoadImgFn(val)
    },
    reductionannotationsStyle() {
      this.$refs.editorCustomRef.reductionannotationsStyle()
    },
    annotationsClick(text) {
      this.$refs.editorCustomRef.annotationsClick(text)
    },
    offsetInfoInit(info) {
      this.form.roleLeftOffset = info.left
      this.form.roleTopOffset = info.top
      this.form.roleWidth = info.roleWidth
      this.form.positionX = info.left
      this.form.positionY = info.top
      this.$refs.formInfoRef.form.roleLeftOffset = info.left
      this.$refs.formInfoRef.form.roleTopOffset = info.top
      this.$refs.formInfoRef.form.roleWidth = info.roleWidth
      this.$refs.formInfoRef.form.positionX = info.left
      this.$refs.formInfoRef.form.positionY = info.top
    },
    setoffsetInfo(info) {
      this.form.roleLeftOffset =
        info.left || info.left === 0 ? info.left : this.form.roleLeftOffset
      this.form.roleTopOffset =
        info.top || info.top === 0 ? info.top : this.form.roleTopOffset
      this.form.roleWidth =
        info.roleWidth || info.roleWidth === 0
          ? info.roleWidth
          : this.form.roleWidth
      this.form.positionWidth = this.form.roleWidth
      this.form.positionX =
        info.left || info.left === 0 ? info.left : this.form.positionX
      this.form.positionY =
        info.top || info.top === 0 ? info.top : this.form.positionY

      this.$refs.formInfoRef.form.roleLeftOffset = this.form.roleLeftOffset
      this.$refs.formInfoRef.form.roleTopOffset = this.form.roleTopOffset
      this.$refs.formInfoRef.form.roleWidth = this.form.roleWidth
      this.$refs.formInfoRef.form.positionWidth = this.form.roleWidth
      this.$refs.formInfoRef.form.positionX = this.form.positionX
      this.$refs.formInfoRef.form.positionY = this.form.positionY
    },
    selectTextLengthEmit(val) {
      this.selectTextLength = val
    },
    saveDraftEmit(vId, generateContent) {
      this.form.videoId = vId
      // this.$refs.formInfoRef.form.videoId = vId
      this.$refs.formInfoRef.form.generateContent = generateContent
      // this.form.generateContent = generateContent
    },
    saveDraft() {
      this.btnLoading = true
      this.$refs['editorCustomRef']
        .saveDraft(true)
        .then(() => {
          this.btnLoading = false
        })
        .catch(() => (this.btnLoading = false))
    },
    changeVolume(value) {
      this.$uweb &&
        this.$uweb.setAction('Event_Create_AI_Video_Audio_Global_Volume')
      this.form.thirdConfig.volume = value
    },
    changeSpeed(value) {
      this.$uweb &&
        this.$uweb.setAction('Event_Create_AI_Video_Audio_Global_Speed')
      this.form.thirdConfig.speed = value
    },
    audioPreview() {
      this.$refs.editorCustomRef.audioPreview()
    },
    changeTeacher() {
      this.$refs.editorCustomRef.resetValue()
    },

    async generateVideo(isSkip = false) {
      const checkSignStatus = localStorage.getItem(
        'checkSignDigitalhuman' + this.$store.state.user.userInfo.userId
      )
      if (Number(checkSignStatus) !== 1) {
        this.$router.push({
          path: '/digitalPerson/digitalVideoManage'
        })
        return
      }
      const cg = await checkGenerateFrequency({
        teacherId: this.form.teacherId || this.form.teacherIdTMP
      })
      const checkData = cg.data ? { ...cg.data } : { remainingTimes: -1 }
      if (checkData.remainingTimes === 0) {
        this.checkGenerateObj = { ...checkData }
        this.countDialogVisible = true
        return
      }
      const infoSubmit = this.$refs['editorCustomRef'].submitValidate()
      if (!infoSubmit) {
        return
      }
      if (!isSkip) {
        this.btnLoading = true
        const sc = await this.$refs['editorCustomRef']
          .sensitiveChecking()
          .catch(() => {
            this.btnLoading = false
          })
        this.btnLoading = false

        if (sc) {
          this.$confirm(
            `文案中包含敏感词：${this.$refs[
              'editorCustomRef'
            ].sensitiveList.join(
              ','
            )}，可能会触及发布平台风控规则，确认是否继续生成？`,
            '确认操作',
            {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }
          ).then(async () => {
            await this.insertVideo(infoSubmit)
          })
        } else {
          this.generateVideo(true)
        }
        return
      }
      this.$confirm('确定提交审核吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        await this.insertVideo(infoSubmit)
        // this.loading = true
      })
    },
    async insertVideo(infoSubmit) {
      if (this.form.thirdType === 4 && (await this.checkBalance())) {
        return
      }
      const obj = {
        characterId: this.form.characterId,
        externalImagesId: this.form.externalImagesId,
        name: this.form.name,
        resolutionType: this.form.resolutionType,
        pitch: 100,
        speed: this.form.thirdConfig?.speed || 100,
        volume: this.form.thirdConfig?.volume || 100,
        teacherId: this.form.teacherId,
        ...infoSubmit,
        materialType: Number(this.form.materialType),
        videoId: this.form.videoId,
        roleLeftOffset: this.form.roleLeftOffset || undefined,
        roleTopOffset: this.form.roleTopOffset || undefined,
        roleWidth: this.form.roleWidth,
        positionX: this.form.positionX,
        positionY: this.form.positionY,
        positionHeight:
          this.form.roleWidth && this.form.roleWidth
            ? this.form.resolutionType === 1
              ? (this.form.roleWidth / 9) * 16
              : (this.form.roleWidth / 16) * 9
            : undefined,
        positionWidth: this.form.positionWidth || this.form.roleWidth,
        voiceType: this.form.voiceType
      }
      if (this.form.thirdType !== 4) {
        const coverImg = await this.generateImg()
        if (coverImg) {
          const file = this.base64ToFile(
            coverImg,
            `${new Date().getTime() + this.form.name}.png`
          )

          const formData = new FormData()
          formData.append('file', file)
          const res = await uploadImg(formData)
          obj.coverUrl = res.data.url
        }
        const bgmInfo = await this.generateBackgroundImg()
        if (!bgmInfo.isOriginalProportion) {
          const fileName = new Date().getTime() + '.png'
          const bgmFile = this.base64ToFile(bgmInfo.base64, fileName)
          // obj.imagesFile = bgmFile
          const formdata = new FormData()
          formdata.append('file', bgmFile)
          formdata.append('name', this.form.name + '背景图')
          formdata.append('resolutionType', this.form.resolutionType)
          formdata.append('fileName', fileName)
          formdata.append('type', 1)
          const resBgm = await backgroundImageUpload(formdata)
          obj.externalImagesId = resBgm.data
        }
      }
      if (this.form.thirdType === 3) {
        obj.roleLeftOffset = undefined
        obj.roleTopOffset = undefined
      }
      if (this.form.thirdType === 2) {
        obj.positionX = undefined
        obj.positionY = undefined
      }
      if (
        this.form.thirdType === 1 &&
        obj.roleLeftOffset &&
        obj.roleTopOffset
      ) {
        const val = this.form.resolutionType === 1 ? 1920 : 1080
        obj.roleLeftOffset = undefined
        obj.roleTopOffset = undefined
        obj.positionX = this.form.roleWidth / 2 + this.form.positionX
        obj.positionY = val - this.form.positionY

        // obj.roleWidth = undefined
      }
      // console.log(obj, 'objo')
      // return
      // this.loading = true
      this.$emit('loadingEmit', true)
      let res = null
      if (this.$route?.query?.type && this.$route.query?.type === 'edit') {
        obj.externalVideoId = this.form.externalVideoId
        try {
          res = await videoEdit(obj)
          // this.loading = false
          this.$emit('loadingEmit', false)
        } catch (error) {
          // this.loading = false
          this.$emit('loadingEmit', false)
        }
      } else {
        try {
          res = await videoGenerate(obj)
          // this.loading = false
          this.$emit('loadingEmit', false)
        } catch (error) {
          // this.loading = false
          this.$emit('loadingEmit', false)
        }
      }
      // 生成成功了
      if (res.code === 1 && res.data.length === 0) {
        const tsl = JSON.parse(
          localStorage.getItem('configEditorCustomDigitalPersonList')
        )
        const id =
          this.$store.state.user.userInfo.userId + this.form.teacherId + ''
        if (tsl) {
          const ls = Object.keys(tsl)
          const key = ls.find(f => f === id)
          if (key) {
            tsl[key] = {
              speed: this.form.thirdConfig.speed,
              volume: this.form.thirdConfig.volume
            }
            localStorage.setItem(
              'configEditorCustomDigitalPersonList',
              JSON.stringify(tsl)
            )
          } else {
            tsl[id] = {
              speed: this.form.thirdConfig.speed,
              volume: this.form.thirdConfig.volume
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
                speed: this.form.thirdConfig.speed,
                volume: this.form.thirdConfig.volume
              }
            })
          )
        }
        // this.loading = false
        this.$uweb && this.$uweb.setAction('Event_huaweiAiVideo_generate')
        this.$router.push({
          name: 'DigitalVideoManage'
        })
      } else {
        this.$message.error('包含非法敏感词！')
      }
      // 触发关键词
      this.$refs['editorCustomRef'].setSensitiveCheckingList(res.data)
    },
    characterImage(record) {
      const info = { ...record }
      this.$emit('characterImage', info)
    },
    isValidate(record) {
      const info = { ...record }
      this.form.thirdType = info.thirdType || undefined
      console.log(this.form, 'vvvvv')
      this.formOk = info.isOk
      this.$emit('info', info)
    },
    async formInfoSubmit(record) {
      const cg = await checkGenerateFrequency({
        teacherId: record.teacherId || record.teacherIdTMP
      })
      const checkData = cg.data ? { ...cg.data } : { remainingTimes: -1 }
      if (checkData.remainingTimes === 0) {
        this.checkGenerateObj = { ...checkData }
        this.countDialogVisible = true
        return
      }
      this.form = {
        ...record,
        thirdConfig: { ...this.form.thirdConfig }
        // name: record.name,
        // voiceThirdType: record.voiceThirdType,
        // voiceType: record.voiceType
      }

      if (this.form.thirdType === 4 && (await this.checkBalance())) {
        return
      }
      this.stepValue = '2'
      this.$emit('stepValueEmit', 2)
      if (!this.$refs['editorCustomRef'].globalInterval) {
        this.$nextTick(async () => {
          this.btnLoading = true
          await this.$refs['editorCustomRef'].saveDraft(false, { ...this.form })
          this.btnLoading = false
          this.$refs['editorCustomRef'].setJobs()
        })
      }
    },
    back() {
      this.stepValue = '1'
      this.$emit('stepValueEmit', 1)
    },
    async next() {
      this.$refs.formInfoRef.submit()
    },
    base64ToFile(base64, filename) {
      var arr = base64.split(',')
      var mime = arr[0].match(/:(.*?);/)[1]
      var bstr = atob(arr[1])
      var n = bstr.length
      var u8arr = new Uint8Array(n)
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
      }
      return new File([u8arr], filename, { type: mime })
    }
  }
}
</script>
<style lang="scss" scoped>
.leftSide {
  width: 58.1%;
  height: 100%;
  background-color: #fff;
  border-radius: 0 0 10px 10px;
  position: relative;
  .step-row {
    margin: 20px 20px 40px 20px;
  }
  .globleConfig {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 0 20px 25px 20px;
    .globleConfig-item {
      width: 50%;
    }
  }
  .footer {
    user-select: none;
    background-color: #fff;
    display: flex;
    padding: 16px 20px;
    width: 100%;
    align-items: center;
    justify-content: space-between;
    .dafault-btn {
      width: 88px;
      height: 32px;
      background: #d6d6d6;
      border-radius: 4px;
      color: #a9a9a9;
    }
    .polyphonic {
      margin-right: 16px;
    }
  }
}
.tips {
  font-size: 12px;
  color: #777777;
  text-align: left;
  margin-left: 12px;
  .select-text-length {
    color: red;
  }
}
::v-deep .globleConfig-item-content-right {
  div {
    justify-content: flex-end;
  }
}
.vertical-el-divider {
  user-select: none;
}
::v-deep .polyphonic {
  .el-checkbox__label {
    font-size: 12px;
    font-weight: initial;
  }
}
.countTip {
  font-size: 16px;
  font-weight: 400;
  color: #333333;
}
</style>
