<template>
  <div
    v-infinite-scroll="addList"
    :infinite-scroll-disabled="!isLoadData"
    isLoadData
    class="form-wrapper"
  >
    <el-form
      ref="ruleForm"
      :model="form"
      :rules="rules"
      size="small"
      class="ruleForm"
    >
      <el-form-item label="视频名称" prop="name">
        <el-input
          v-model.trim="form.name"
          placeholder="请输入视频名称"
          style="width: 90%"
          maxlength="50"
          show-word-limit
        />
      </el-form-item>
      <el-form-item label="预设模板" prop="template" label-width="76px">
        <div class="template-row">
          <el-button
            style="width: 68px; height: 32px"
            plain
            type="primary"
            @click="isShowPresetTemplateList = true"
          >
            选择
          </el-button>
          <span v-if="!!presetTemplateName" class="template-label">
            已选择【{{ presetTemplateName }}】
          </span>
        </div>
      </el-form-item>
      <el-row type="flex" justify="space-between">
        <el-col :span="8">
          <el-form-item label="素材类型" prop="materialType">
            <el-select
              v-model="form.materialType"
              style="width: 75%"
              placeholder="请选择"
            >
              <el-option
                v-for="(item, index) in materialTypes"
                :key="Number(index)"
                :label="item"
                :value="Number(index)"
              >
                {{ item }}
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8" style="padding-left: 20px">
          <el-form-item label="IP" prop="teacherId">
            <el-select
              v-model="teacherId"
              placeholder="请选择"
              clearable
              filterable
              style="width: 86%"
              @change="getList"
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
        </el-col>
        <el-col :span="8">
          <div v-if="checkGenerateObj" class="count-tips">
            {{
              checkGenerateObj.periodical === 1
                ? '当天'
                : checkGenerateObj.periodical === 2
                  ? '本周'
                  : '本月'
            }}IP老师已使用
            <div class="count-num">{{ checkGenerateObj.usedTimes }}</div>
            次，还剩余
            <div class="count-num count-num-color">
              {{ checkGenerateObj.remainingTimes }}
            </div>
            次。
          </div>
        </el-col>
      </el-row>
      <el-form-item label="选择形象" prop="characterId" class="custom-label">
        <div class="overAll">
          <div v-for="item in charactersList" :key="item.type">
            <div
              :class="['teacherBox', item.active ? 'overAllActive' : '']"
              :style="{
                'background-position': 'center',
                backgroundImage: `url(${item.rightPhotoUrl})`,
                'background-size': 'contain'
              }"
              @click="
                checkCharacter(item, item.resolutionType != form.resolutionType)
              "
            >
              <img v-if="item.active" :src="iconPanel" class="iconPanel" />
              <img
                v-if="item.isHot === 1"
                src="@/assets/image/aigc/digitalVideoManage/burst-obj.png"
                class="tags-obj"
              />
              <img
                v-if="item.isNew === 1"
                src="@/assets/image/aigc/digitalVideoManage/new-obj.png"
                class="tags-obj"
                :style="{ left: item.isHot === 1 ? '27px' : '' }"
              />
              <div v-if="item.isLast === 1" class="last-top">上次使用</div>
            </div>
            <div class="overAll_name" :title="item.name">
              {{ item.name }}
            </div>
          </div>
          <div v-if="charactersList.length < 1" class="teacher-null-div">
            <img
              class="null-img"
              src="@/assets/image/aigc/digitalVideoManage/null-character.png"
              alt=""
            />
          </div>
        </div>
        <div class="pagination-wrapper">
          <el-pagination
            :current-page="currentPage"
            :page-sizes="[50, 80, 100, 150]"
            :page-size="pageSize"
            layout="jumper, prev, pager, next, sizes, total"
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </el-form-item>

      <el-row type="flex">
        <el-col :span="10">
          <el-form-item label="选择声音" prop="voiceType">
            <el-select
              v-model="form.voiceType"
              placeholder="请选择"
              style="width: 80%"
              @change="getVoiceThirdTypeChange"
            >
              <el-option
                v-for="item in soundList"
                :key="item.label"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>

        <el-button
          plain
          style="
            width: 90px;
            height: 32px;
            padding: 5px 15px;
            margin-left: 20px;
          "
          @click="audiTest"
        >
          音频试听
        </el-button>
      </el-row>
      <el-form-item
        v-if="form.thirdType !== 4"
        label="选择布局"
        prop="resolutionType"
        class="custom-label"
      >
        <div class="people-layout">
          <div
            v-if="getLayoutList(1)"
            :class="[
              'vertical_signal',
              form.resolutionType == 1 ? 'overAllActive' : ''
            ]"
            @click="checkOverAll(1)"
          >
            <img
              v-if="form.resolutionType == 1"
              :src="iconPanel"
              class="iconPanel"
            />
            <span>竖版</span>
          </div>
          <div
            v-if="getLayoutList(0)"
            :class="[
              'horizontal_signal',
              form.resolutionType === 0 ? 'overAllActive' : ''
            ]"
            @click="checkOverAll(0)"
          >
            <img
              v-if="form.resolutionType === 0"
              :src="iconPanel"
              class="iconPanel"
            />
            <span>横板</span>
          </div>
        </div>
      </el-form-item>

      <el-form-item
        v-if="form.thirdType !== 4"
        v-loading="loading"
        label="选择背景"
        class="bgm"
        prop="externalImagesId"
      >
        <div class="checkbox-bg">
          <el-checkbox v-model="isMe" @change="getBgList">
            我创建的背景
          </el-checkbox>
          <el-checkbox v-model="isRecently" @change="getBgList">
            最近使用背景
          </el-checkbox>
        </div>
        <div class="img-list">
          <div
            :class="{
              'horizontal-item': form.resolutionType == 0,
              'vertical-item': form.resolutionType == 1,
              upload: true
            }"
            :style="{
              'margin-right': form.resolutionType == 1 ? '32px' : '18px'
            }"
            @click="uploadImg"
          >
            <i class="el-icon-plus" />
            <span class="lable-img">上传背景图</span>
          </div>
          <div
            v-for="(item, index) in imgList"
            :key="index + item.externalImagesId"
            :class="{
              'horizontal-item': form.resolutionType == 0,
              'vertical-item': form.resolutionType == 1,
              'horizontal-select':
                form.externalImagesId === item.externalImagesId
            }"
            :style="{
              backgroundImage: 'url(' + item.url + ')',
              'margin-right': form.resolutionType == 1 ? '32px' : '18px'
            }"
            @click="selectImg(item)"
          >
            <img
              v-if="form.externalImagesId === item.externalImagesId"
              :src="iconPanel"
              class="iconPanel"
            />
            <span class="lable-img">{{ item.name }}</span>
            <div class="mask-img">
              <div
                class="mask-img-item"
                @click.stop="openBigImg(item.url, 'horizontal')"
              >
                <i class="el-icon-zoom-in" />
                大图
              </div>
              <div
                v-if="item.auth == 1"
                class="mask-img-item"
                style="margin-left: 4px"
                @click.stop="
                  deleteImg(
                    item.imagesId,
                    form.externalImagesId === item.externalImagesId
                  )
                "
              >
                <i class="el-icon-delete" />
                删除
              </div>
            </div>
          </div>
        </div>
      </el-form-item>
    </el-form>
    <!-- 添加背景图弹窗 -->
    <addDialog
      :config="addConfig"
      @success="closeAddDialog"
      @close="addConfig.visible = false"
    />
    <!-- 查看图片 -->
    <reviewImgDialog
      v-model="bigImgVisible"
      :row="selectImgObj"
      @close="bigImgVisible = false"
    />
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
            <audio
              id="audioForm"
              style="width: 100%"
              class="m-t-12"
              :src="audioUrl"
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
    <!-- 选择预设模板 -->
    <presetTemplateList
      v-model="isShowPresetTemplateList"
      @submit="presetTemplateInfo"
      @del="presetTemplateInfoDel"
    />
  </div>
</template>

<script>
import iconPanel from '@/assets/svg/panel/aiselect_icon.svg'
import { materialTypes } from '@/views/digitalPerson/digitalVideoManage/components/columns'
import {
  getCharactersTeacherList,
  getBackgroundImage,
  getVideoDetail,
  getTeacherCharactersList,
  backgroundImageDelete,
  getCharacterVoicesByOrg,
  submitTask
} from '@/api/aiVideoManage'
import addDialog from '@/views/digitalPerson/bgImgManage/components/addDialog.vue'
import reviewImgDialog from '@/views/digitalPerson/platformProfileManage/components/reviewImgDialog.vue'
import DragDialog from './editorCustom/components/drag-dialog'
import audio_sus from '@/assets/svg/aiManage/audio_sus.svg'
import audio_err from '@/assets/svg/aiManage/audio_err.svg'
import presetTemplateList from './presetTemplateList'
import { checkGenerateFrequency } from '@/api/aiVideoManage/generate'
export default {
  inject: ['setLoading'],
  directives: {
    DragDialog
  },
  components: {
    addDialog,
    reviewImgDialog,
    presetTemplateList
  },
  props: {},
  data() {
    return {
      audio_sus,
      audio_err,
      iconPanel,
      materialTypes,
      form: {
        name: '',
        // 素材类型
        materialType: '',
        teacherId: '',
        // 横竖屏模式 0:横屏 1:竖屏 2:横屏和竖屏
        resolutionType: 1,
        characterId: '',
        externalImagesId: '',
        bgImg: '',
        rightPhotoUrl: '',
        thirdType: 1,
        voiceType: undefined
      },
      teacherId: '',
      teacherList: [],
      layoutList: [0, 1],
      charactersList: [],
      rules: {
        name: [
          { required: true, message: '请输入视频名称', trigger: 'blur' },
          { max: 50, message: '最多输入50个字符', trigger: 'blur' },
          // 不允许特殊字符
          {
            pattern: /^[\w\u4E00-\u9FA5\-\.\,\。\，\(\)\ （\）\:]+$/,
            message: '不允许输入特殊字符',
            trigger: 'change'
          }
        ],
        materialType: [
          { required: true, message: '请选择素材类型', trigger: 'change' }
        ],
        // teacherId: [
        //   { required: true, message: '请选择讲师', trigger: 'change' }
        // ],
        characterId: [
          { required: true, message: '请选择形象', trigger: 'change' }
        ],
        resolutionType: [
          { required: true, message: '请选择布局', trigger: 'change' }
        ],
        externalImagesId: [
          { required: true, message: '请选择背景', trigger: 'change' }
        ],
        voiceType: [
          { required: true, message: '请选择声音', trigger: 'change' }
        ]
      },
      addConfig: {
        type: 1, // 1新增
        radio: 1,
        coverPhoto: '',
        row: {},
        disable: true,
        visible: false
      },
      isMe: false,
      isRecently: false,
      imgList: [],
      selectImgObj: { type: '', url: '' },
      bigImgVisible: false,
      loading: false,
      thirdConfig: { speed: 100, volume: 100, generateContent: '' },
      page: {
        pageIndex: 1,
        pageSize: 20,
        total: 0
      },
      isLoadData: true,
      isLoadImg: true,
      soundList: [],
      audioUrl: '',
      isAudioCompleted: true,
      isAudioError: false,
      dialogVisible: false,
      voiceThirdType: undefined,
      isShowPresetTemplateList: false,
      presetTemplateName: '',
      presetTemplateId: '',
      // {
      //   remainingTimes: 0, // 剩余次数
      //   usedTimes: 0 // 已使用次数
      // }
      checkGenerateObj: undefined,
      balanceNotTipsDialog: false,
      balanceNotTipsDialogMsg: '',
      currentPage: 1,
      pageSize: 50,
      total: 0
    }
  },
  watch: {
    form: {
      handler(val) {
        if (
          !!val.name &&
          !!val.materialType &&
          // !!val.teacherId &&
          !!val.characterId &&
          !!val.voiceType &&
          (Number(val.resolutionType) > -1 || val.thirdType === 4) &&
          (val.resolutionType !== '' || val.thirdType === 4) &&
          (!!val.externalImagesId || val.thirdType === 4)
        ) {
          this.$emit('isValidate', { isOk: true, ...val })
        } else {
          this.$emit('isValidate', { isOk: false, ...val })
        }
      },
      deep: true
    }
  },
  created() {
    const videoId = this.$route?.query?.videoId
    if (this.$route?.query?.thirdType) {
      this.form.thirdType = this.$route?.query?.thirdType
    }

    this.getTeacherList().then(async () => {
      if (videoId) {
        this.getVideoDetail(videoId)
      } else {
        await this.getBgList()
        // 机构入驻解耦新增进入获取所有形象
        this.getList()
      }
    })
  },
  methods: {
    handleCurrentChange(val) {
      this.currentPage = val
      this.getList()
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.getList()
    },
    async checkIPInfo(teacherId) {
      const cg = await checkGenerateFrequency({
        teacherId: teacherId
      })
      this.checkGenerateObj = cg.data ? { ...cg.data } : undefined
    },
    presetTemplateInfoDel(id) {
      if (this.presetTemplateId === id) {
        this.presetTemplateName = ''
        this.presetTemplateId = ''
      }
    },
    async presetTemplateInfo(record) {
      this.presetTemplateName = record.name
      this.presetTemplateId = record.id
      this.form.bgImg = record.imagesUrl
      this.form.voiceType = record.voiceType
      this.form.characterId = record.characterId
      this.form.externalImagesId = record.externalImagesId
      this.form.materialType = record.materialType
      this.form.positionHeight = record.positionHeight
      this.form.positionWidth = record.positionWidth
      this.form.positionX = record.positionX
      this.form.positionY = record.positionY
      this.form.resolutionType = record.resolutionType
      this.form.roleLeftOffset = record.roleLeftOffset
      this.form.roleTopOffset = record.roleTopOffset
      this.form.roleWidth = record.roleWidth
      this.form.teacherId = record.teacherId
      this.form.generateContent = ''
      this.form.rightPhotoUrl = record.photoUrl
      this.form.thirdType = record.thirdType
      this.teacherId = record.teacherId
      this.layoutList =
        this.form.resolutionType === 2 ? [0, 1] : [this.form.resolutionType]
      this.getCharacterVoicesByOrg(true)
      this.getList(false, true, true)
      this.$emit('updateForm', { ...this.form })
      if (record.nextType === 2) {
        this.setLoading(true)
        setTimeout(() => {
          this.submit()
          this.setLoading(false)
        }, 1500)
      }
    },
    getVoiceThirdTypeChange(val) {
      const tt = this.soundList.find(item => item.value === val).thirdType
      if (!!this.voiceThirdType && this.voiceThirdType !== tt) {
        this.$confirm(
          '切换声音，后面已经设置的内容将被重置，确实是否继续？',
          '操作确认',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        )
          .then(() => {
            this.voiceThirdType = this.soundList.find(
              item => item.value === val
            ).thirdType
            this.form.generateContent = ''
            this.$emit('changeTeacher')
          })
          .catch(() => {
            this.form.voiceType = this.soundList.find(
              item => item.thirdType === this.voiceThirdType
            ).value
          })
        return
      }
      this.voiceThirdType = this.soundList.find(
        item => item.value === val
      ).thirdType
      this.form.generateContent = ''
      this.$emit('changeTeacher')
    },
    audiTest() {
      if (this.form.voiceType === undefined) {
        this.$message.error('请选择声音')
        return
      }
      this.dialogVisible = true
      this.isAudioCompleted = false
      this.isAudioError = false
      submitTask({
        characterId: this.form.characterId,
        pitch: 100,
        speed: 100,
        teacherId: this.form.teacherId,
        userInputText:
          (this.voiceThirdType === 3 ? '' : '<speak>') +
          '欢迎体验数字人服务。我是您贴心的虚拟助手，时刻准备通过智能互动为您提供帮助。无论是查询信息、协助办公还是个性化推荐，我都能够以最快的响应速度满足您的需求。请随时告诉我您想要完成的任务，让我们共同探索数字化世界的无限可能。记得，智能科技正改变着未来，而我在这里，就是为了让您的生活更加便捷。这是一段默认预览音频，用以展示我的语音效果和交互能力。期待与您的每一次对话。' +
          (this.voiceThirdType === 3 ? '' : '</speak>'),
        voiceType: this.form.voiceType,
        volume: 100
      })
        .then(res => {
          this.audioUrl =
            this.voiceThirdType === 3
              ? res.data
              : `data:audio/wav;base64,${res.data}`
          this.isAudioCompleted = true
        })
        .catch(() => {
          this.isAudioError = true
        })
    },
    getCharacterVoicesByOrg(isDefault = false) {
      getCharacterVoicesByOrg({ characterId: this.form.characterId }).then(
        res => {
          this.soundList = res.data.map(item => {
            return {
              label: item.name,
              value: item.voiceType,
              thirdType: Number(item.thirdType)
            }
          })
          const videoId = this.$route?.query?.videoId || isDefault
          if (videoId && this.form.voiceType) {
            this.voiceThirdType = this.soundList.find(
              item => item.value === this.form.voiceType
            ).thirdType
          }
        }
      )
    },
    closeAudio(e) {
      e.stopPropagation()
      const audio = document.getElementById('audioForm')
      if (audio !== null) {
        audio.pause()
        audio.currentTime = 0
      }
      this.dialogVisible = false
      this.audioUrl = ''
    },
    dialogVisibleClick(e) {
      e.stopPropagation()
    },
    deleteImg(id, isSelect) {
      this.$delModal({
        width: '505px',
        tips: `<div style="font-weight: bold;color: #333333;line-height: 24px;font-size: 16px;">删除提醒</div><div style="margin-top: 16px;color: #333333;line-height: 22px;font-size: 14px;">确定删除图片?</div>`,
        success: () => {
          this.loading = true
          const data = {
            imagesId: id
          }
          backgroundImageDelete(data)
            .then(res => {
              if (isSelect) {
                this.form.externalImagesId = undefined
                this.form.bgImg = undefined
                this.$emit('characterImage', { ...this.form })
              }
              this.$notify.success({ title: '提示', message: '操作成功' })
              this.getBgList()
            })
            .catch(() => {
              this.loading = false
            })
        }
      })
    },
    isLoadImgFn(val) {
      this.isLoadImg = val
    },
    // 计算图片列表
    computedModel(index) {
      if (this.form.resolutionType === '') return
      const val = {
        0: () => {
          return (index + 2) % 5 === 0 ? '0' : '18px'
        },
        1: () => {
          return (index + 2) % 7 === 0 ? '0' : '42px'
        }
      }[this.form.resolutionType]()
      return val || ''
    },
    async getVideoDetail(videoId) {
      const res = await getVideoDetail({ videoId: videoId })
      this.form = {
        ...this.form,
        ...res.data,
        voiceType: res.data.voiceType,
        materialType: this.$route.query.materialType
          ? Number(this.$route.query.materialType)
          : undefined
      }
      this.form.bgImg = this.form.imagesUrl
      this.teacherId = this.form.teacherId
      this.layoutList =
        this.form.resolutionType === 2 ? [0, 1] : [this.form.resolutionType]
      this.getCharacterVoicesByOrg()
      await this.getBgList()
      this.getList(false)

      this.thirdConfig.speed = res.data.speed
      this.thirdConfig.volume = res.data.volume
      this.thirdConfig.generateContent = res.data.generateContent
      this.$emit('isValidate', {
        isOk: true,
        ...this.form,
        bgImg: this.form.imagesUrl
      })
    },
    submit() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.dialogVisible = false
          this.audioUrl = ''
          this.$emit('submit', {
            ...this.form,
            voiceThirdType: this.voiceThirdType,
            thirdConfig: this.$route?.query?.videoId
              ? { ...this.thirdConfig }
              : undefined
          })
        }
      })
    },
    openBigImg(url, type) {
      this.selectImgObj = { type: type, url: url }
      this.bigImgVisible = true
    },
    selectImg(record) {
      this.form.externalImagesId = record.externalImagesId
      this.form.bgImg = record.ossUrl
      this.$emit('characterImage', { ...this.form })
    },
    // 获取背景的列表
    async addList() {
      this.loading = true
      this.page.pageIndex++
      const params = {
        pageIndex: this.page.pageIndex,
        pageSize: this.page.pageSize,
        resolutionType: this.form.resolutionType,
        isMeCrate: Number(this.isMe),
        recentlyUsed: Number(this.isRecently)
      }
      const res = await getBackgroundImage(params).catch(() => {
        this.isLoadData = true
        this.page.pageIndex = 1
        this.loading = false
      })

      this.page.total = res.data.total
      this.loading = false
      this.imgList.push(...res.data.items)
      this.isLoadData = this.page.total !== this.imgList.length
    },
    // 获取背景的列表
    async getBgList() {
      this.loading = true
      this.page.pageIndex = 1
      const params = {
        pageIndex: this.page.pageIndex,
        pageSize: this.page.pageSize,
        resolutionType: this.form.resolutionType,
        isMeCrate: Number(this.isMe),
        recentlyUsed: Number(this.isRecently)
      }
      const res = await getBackgroundImage(params).catch(() => {
        this.isLoadData = true
        this.page.pageIndex = 1
        this.loading = false
      })
      this.page.total = res.data.total
      this.loading = false
      this.imgList = res.data.items

      this.isLoadData = this.page.total !== this.imgList.length - 1
    },
    closeAddDialog() {
      this.addConfig.visible = false
      setTimeout(() => {
        this.getBgList()
      }, 1000)
    },
    // 上传图片
    uploadImg() {
      this.addConfig = {
        type: 1,
        row: {},
        visible: true,
        radio: Number(this.form.resolutionType),
        disable: true
      }
    },
    // 判断横/竖布局是否存在
    getLayoutList(val) {
      return this.layoutList.findIndex(item => item === val) > -1
    },
    checkOverAll(type) {
      if (type === this.form.resolutionType) return
      this.form.resolutionType = type
      this.form.externalImagesId = undefined
      this.form.bgImg = undefined
      this.$emit('characterImage', { ...this.form })
      this.getBgList()
    },
    // 选择形象
    async checkCharacter(record, isRefreshImg = true) {
      if (!this.isLoadImg) return
      record.active = true
      this.form.thirdType = record.thirdType
      if (this.form.resolutionType !== 0 && this.form.resolutionType !== 1) {
        this.form.resolutionType = 1
      }
      // 添加布局类型 横竖屏模式 0:横屏 1:竖屏 2:横屏和竖屏
      this.layoutList =
        record.resolutionType === 2 ? [0, 1] : [record.resolutionType]
      // if (this.form.resolutionType !== record.resolutionType) {
      // }

      if (record.resolutionType < 2) {
        this.form.resolutionType = record.resolutionType
      } else {
        this.form.resolutionType = 1
      }
      if (isRefreshImg) {
        this.form.externalImagesId = undefined
        this.form.bgImg = undefined
        // this.$emit('characterImage', { ...this.form })
        this.getBgList()
      }
      this.charactersList.forEach(item => {
        if (record.characterId !== item.characterId) {
          item.active = false
        }
      })
      this.form.teacherIdTMP = record.teacherId
      await this.checkIPInfo(record.teacherId)
      this.form.rightPhotoUrl = record.rightPhotoUrl
      this.form.characterId = record.characterId
      this.form.voiceType = undefined
      this.voiceThirdType = undefined
      this.getCharacterVoicesByOrg()

      this.$emit('characterImage', { ...this.form })
    },
    // 获取形象列表数据
    async getList(isClear = true, isMessage = true, isToInfo = false) {
      if (!!this.form.teacherId && isMessage && isClear) {
        this.$confirm(
          '切换IP，后面已经设置的内容将被重置，确实是否继续？',
          '操作确认',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        )
          .then(() => {
            this.form.voiceType = undefined
            this.voiceThirdType = undefined
            this.form.generateContent = ''
            this.getList(true, false)
            this.$emit('changeTeacher')
          })
          .catch(() => {
            this.teacherId = this.form.teacherId
          })
        return
      }

      this.form.teacherId = this.teacherId
      if (this.form.teacherId) {
        await this.checkIPInfo(this.form.teacherId)
      }
      if (isClear) {
        this.form.characterId = ''
        this.form.resolutionType = ''
        this.form.bgImg = undefined
        this.form.externalImagesId = ''
      }
      this.loading = true
      const params = {
        pageIndex: this.currentPage,
        pageSize: this.pageSize,
        status: 1,
        teacherId: this.teacherId
      }
      getTeacherCharactersList(params)
        .then(res => {
          setTimeout(() => {
            this.loading = false
          }, 500)
          this.charactersList = res.data.items.map(m => ({
            ...m,
            active: this.form.characterId === m.characterId
          }))
          if (this.form.characterId && this.$route?.query?.videoId) {
            this.form.teacherIdTMP = this.charactersList.find(
              f => f.active
            ).teacherId
          }
          this.form.resolutionType = 1
          if (
            this.charactersList.length &&
            this.charactersList &&
            isClear &&
            this.form.teacherId
          ) {
            const first = this.charactersList[0]
            first.active = true
            this.layoutList =
              first.resolutionType === 2 ? [0, 1] : [first.resolutionType]
            this.form.resolutionType =
              Number(first.resolutionType) < 2
                ? Number(first.resolutionType)
                : 1
            this.form.characterId = first.characterId
            this.getCharacterVoicesByOrg()
            this.form.thirdType = first.thirdType
          }
          this.form.rightPhotoUrl = this.charactersList.find(
            f => f.active
          )?.rightPhotoUrl
          this.getBgList()
          this.$emit('characterImage', { ...this.form, isToInfo })
          this.$emit('isValidate', {
            isOk: !!this.form.name,
            ...this.form
          })
        })
        .catch(() => {
          this.loading = false
        })
    },
    // 获取讲师列表
    async getTeacherList() {
      const res = await getCharactersTeacherList({ type: 2, status: 1 })
      this.teacherList = res.data
    }
  }
}
</script>

<style lang="scss" scoped>
.form-wrapper {
  width: 100%;
  height: calc(100vh - 374px);
  border-radius: 0 0 10px 10px;
  overflow-y: auto;

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
  .overAll {
    display: flex;
    flex-wrap: wrap;
    > div {
      margin-right: 16px;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .overAll_name {
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #333333;
      width: 90px;
      // 文本溢出隐藏
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .bgImg {
      width: 100%;
      height: 100%;
    }
  }
  .overAllActive {
    border: 1px solid #0c6fff !important;
  }

  .teacherBox {
    width: 90px;
    height: 160px;
    position: relative;
    border-radius: 4px;
    border: 1px solid #fff;
    background: #f5f5f5;
    background-repeat: no-repeat;
  }
  .teacher-null-div {
    width: 90px;
    height: 160px;
    position: relative;
    border-radius: 4px;
    border: 1px solid #d8dce6;
    background: #ffffff;
    display: flex;
    justify-content: center;
    align-items: center;
    .null-img {
      width: 79px;
      height: 56px;
    }
  }
}
.pagination-wrapper{
  width: 100%;
  text-align: end;
  margin-top: 10px;
}
.iconPanel {
  position: absolute;
  right: 0;
  top: 0;
  width: 16px;
  height: 16px;
  font-size: 16px;
  z-index: 2;
}
.tags-obj {
  position: absolute;
  left: 3px;
  top: 3px;
  width: 20px;
  height: 20px;
  font-size: 16px;
  z-index: 2;
}
.last-top {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 62px;
  padding: 2px 7px;
  background: #9ca9bd;
  border-radius: 4px 0px 4px 0px;
  font-size: 12px;
  color: #ffffff;
  z-index: 2;
  line-height: initial;
}
.people-layout {
  display: flex;
  margin-bottom: 15px;
  .horizontal_signal,
  .vertical_signal {
    width: 90px;
    height: 160px;
    border-radius: 4px;
    border: 1px solid #fff;
    background: #484b55;
    position: relative;
    background-repeat: no-repeat;
    background-size: 100% 100%;
    display: flex;
    justify-content: center;
    span {
      position: absolute;
      bottom: -30px;
      line-height: initial;
    }
  }
  .horizontal_signal {
    background-color: #7777;
    background-image: url('../../../../../assets/image/horizontal_signal.png');
    background-size: 90px 50px;
    // 让横屏的背景图居中
    background-position: 50% 50%;
  }
  .vertical_signal {
    background-image: url('../../../../../assets/image/vertical_signal.png');
    margin-right: 20px;
  }
}
::v-deep .ruleForm {
  padding-left: 20px;
  border-radius: 0 0 10px 10px;
  .el-form-item {
    margin-bottom: 20px !important;
    .el-form-item__content {
      margin-left: 0 !important;
      .el-form-item__error {
        left: 75px;
      }
    }
  }
  .custom-label {
    .el-form-item__label {
      line-height: initial;
    }
  }
}
.checkbox-bg {
  position: absolute;
  top: 7px;
  left: 4vw;
  display: flex;
  align-items: center;
}
::v-deep .checkbox-bg {
  .el-checkbox {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    .el-checkbox__label {
      // font-size: 12px;
      padding-left: 8px !important;
    }
  }
}
.img-list {
  width: 100%;
  background: #ffffff;
  display: flex;
  flex-wrap: wrap;
  margin-top: 43px;
  margin-bottom: 20px;

  .lable-img {
    font-size: 12px;
    font-weight: 400;
    color: #666666;
    position: absolute;
    bottom: -35px;
    left: 0;
    width: 100%;
    // 文本溢出隐藏
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .vertical-item {
    position: relative;
    width: 6rem;
    height: 10.6rem;
    background: #fbfcfe;
    border-radius: 4px;
    border: 1px solid #fff;

    display: flex;
    align-items: center;
    background-repeat: no-repeat;
    background-size: 100% 100%;
    margin-bottom: 37px;
    background-color: #7777;
    cursor: pointer;
    i {
      font-size: 20px;
      font-weight: bold;
      color: #000;
    }
    &:hover {
      .mask-img {
        display: flex;
      }
    }
  }
  .horizontal-item {
    position: relative;
    width: 8.6vw;
    height: 5vw;
    background: #fbfcfe;
    border-radius: 4px;
    border: 1px solid #fff;
    display: flex;
    align-items: center;
    background-repeat: no-repeat;
    background-size: 100% 100%;
    margin-bottom: 37px;
    background-color: #7777;
    cursor: pointer;
    i {
      font-size: 20px;
      font-weight: bold;
      color: #000;
    }
    &:hover {
      .mask-img {
        display: flex;
      }
    }
  }
  .horizontal-select {
    border: 1px solid #0c6fff;
  }
  .upload {
    background: #fbfcfe;
    border: 1px dashed #e1e6ed;
    justify-content: center;
  }
  .mask-img {
    display: none;
    width: 100%;
    height: 24px;
    background: rgba(51, 51, 51, 0.4);
    position: absolute;
    bottom: 0;
    align-items: center;
    justify-content: center;
    user-select: none;
    .mask-img-item {
      cursor: pointer;
      color: #ffffff;
      font-size: 12px;
      i {
        color: #ffffff;
        font-size: 12px;
      }
    }
  }
}
::v-deep .bgm {
  .el-form-item__content {
    .el-form-item__error {
      left: 0 !important;
    }
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
.template-row {
  display: flex;
  align-items: center;
  .template-label {
    font-size: 14px;
    color: #ff8000;
    margin-left: 12px;
  }
}
.count-tips {
  width: 100%;
  height: 100%;
  font-size: 12px;
  font-weight: 400;
  color: #333333;
  display: flex;
  padding-top: 6px;
  user-select: none;

  .count-num {
    width: auto;
    height: 18px;
    min-width: 18px;
    background-color: #999999;
    font-weight: 600;
    border-radius: 50%;
    color: #ffffff;
    margin: 0 4px;
    padding: 0 2px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .count-num-color {
    padding: 0 4px;
    border-radius: 10px;
    background-color: #a5b1c2;
  }
}
</style>
