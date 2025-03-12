<template>
  <div class="base-info-container">
    <base-title title="基本信息" style="margin-bottom: 20px" />
    <el-form
      ref="form"
      :model="form"
      size="mini"
      label-width="120px"
      label-position="right"
      :rules="rules"
    >
      <el-form-item label="直播间名称" prop="name">
        <el-input
          v-model="form.name"
          show-word-limit
          style="width: 600px"
          placeholder="请输入"
          maxlength="40"
          @change="handleChangeName"
        />
      </el-form-item>
      <el-form-item label="出场顺序" prop="appearSequence">
        <el-input
          v-model="form.appearSequence"
          class="el_input_p40"
          style="width: 250px"
          :disabled="form.status === 9"
          maxlength="10"
          show-word-limit
        />
        <span class="m-l-10 formTips">可填写第一天、第二天</span>
      </el-form-item>
      <el-form-item label="直播类型" prop="feesType">
        <live-type
          ref="liveTypeRef"
          v-model="form.feesType"
          :type="goodsList ? 'copy' : 'create'"
          @change="handleChangeFeesType"
          @select="handleSelectProducts"
        />
      </el-form-item>
      <el-form-item label="直播场景" prop="type">
        <live-scene @change="handleChangeLiveScene" />
      </el-form-item>
      <el-form-item label="暖场素材" prop="warmUpMaterialName">
        <warm-material
          @change="handleChangeWarmMaterial"
          @upload="handleUploadMaterial"
        />
      </el-form-item>
      <el-form-item label="直播模式" prop="liveModel">
        <live-pattern @change="handleChangeLivePattern" />
      </el-form-item>
      <el-form-item
        v-if="form.liveModel === 'PERSON_LIVE'"
        label="讲师"
        prop="realityTeacherUser"
      >
        <course-instructor @select="handleSelectCourseInstructor" />
      </el-form-item>
      <el-form-item
        v-if="form.liveModel === 'AI_LIVE'"
        prop="videoId"
        label="视频课件"
      >
        <div class="flex">
          <video-courseware
            @select="handleSelectVideoCourseware"
            @clear="handleClearVideo"
          />
          <span
            v-show="form.recordingTeacherName"
            style="margin-left: 6px"
          >讲师：{{ form.recordingTeacherName }}</span>
        </div>
      </el-form-item>
      <el-form-item
        v-show="form.liveModel === 'AI_LIVE' && form.videoId"
        label="备课内容"
        prop="scriptId"
      >
        <lesson-content
          :id="form.videoId"
          ref="lessonContent"
          @select="handleSelectLessonContent"
        />
      </el-form-item>
      <el-form-item label="展示模式" prop="displayMode">
        <display-mode
          ref="displayMode"
          :disable="form.liveModel === 'AI_LIVE'"
          @change="handleChangeDisplayMode"
        />
      </el-form-item>
      <el-form-item
        v-show="form.liveModel === 'AI_LIVE'"
        label="重复观看"
        prop="isRepeatedViewing"
      >
        <div class="relative">
          <el-radio-group
            v-model="form.isRepeatedViewing"
            @input="handleInputRepeatedViewing"
          >
            <el-radio :label="true">允许</el-radio>
            <el-radio :label="false">不允许</el-radio>
          </el-radio-group>
          <el-tooltip
            effect="dark"
            placement="right"
            style="position: absolute; top: -2px; left: 150px"
          >
            <div slot="content" style="line-height: 1.4">
              若选择为不允许，那么使用这个视频的所有直播间，同一个用户不<br />能观看；反之，同一个用户则被允许重复观看。
            </div>
            <span style="padding: 2px"><i class="el-icon-question" /></span>
          </el-tooltip>
        </div>
      </el-form-item>
      <el-form-item label="开播时间" prop="startTime">
        <video-start-time @change="handleChangeVideoStartTime" />
      </el-form-item>
      <el-form-item label="运营助教">
        <teaching-assistant
          ref="teachingAssistant"
          @select="handleSelectTeachingAssistant"
        />
      </el-form-item>
      <el-form-item label="直播人数" prop="isShow">
        <el-radio v-model="form.isShow" :label="true">显示</el-radio>
        <el-radio v-model="form.isShow" :label="false">隐藏</el-radio>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import moment from 'moment'
import BaseTitle from '../Common/BaseTitle'
import WarmMaterial from './WarmMaterial/index'
import TeachingAssistant from './TeachingAssistant/index'
import VideoStartTime from './VideoStartTime/index'
import LivePattern from './LivePattern/index'
import DisplayMode from './DisplayMode/index'
import LessonContent from './LessonContent/index'
import VideoCourseware from './VideoCourseware/index'
import LiveType from './LiveType/index'
import LiveScene from './LiveScene/index'
import CourseInstructor from './CourseInstructor/index'
import eventBus from '@/utils/eventBus'
import { getGoodsList } from '@/api/course'
export default {
  components: {
    BaseTitle,
    WarmMaterial,
    TeachingAssistant,
    VideoStartTime,
    LivePattern,
    DisplayMode,
    LessonContent,
    VideoCourseware,
    LiveType,
    LiveScene,
    CourseInstructor
  },
  provide() {
    return {
      baseInfoForm: this.form
    }
  },

  data() {
    const validateStartTime = (rule, value, callback) => {
      setTimeout(() => {
        if (this.form.liveModel === 'PERSON_LIVE') {
          // 真人直播
          if (this.form.startTime < moment().format('YYYY-MM-DD HH:mm')) {
            return callback('开播时间需要大于当前时间')
          }
          return callback()
        } else if (this.form.liveModel === 'AI_LIVE') {
          // 数字直播

          if (moment(this.form.startTime).diff(moment(), 'minutes') < 5) {
            return callback('开播时间需要大于当前时间前5分钟')
          }
          return callback()
        } else {
          return callback()
        }
      }, 200)
    }
    const validRealityTeacherUser = (rule, value, callback) => {
      if (Object.keys(this.form.realityTeacherUser).length) {
        return callback()
      } else {
        return callback('请添加讲师')
      }
    }
    return {
      goodsList: '',
      form: {
        name: '', // 直播间名称
        appearSequence: '', // 出场顺序
        feesType: 1, // 直播类型 1-免费 2-付费
        type: 1, // 	直播场景 1-正式 2-测试
        warmUp: 2, // 直播暖场 1-暖场图 2-暖场视频
        warmUpUrl: '', // 直播暖场文件url
        warmUpMaterialName: '', // 暖场素材名称
        liveModel: 'AI_LIVE', // 	直播模式 PERSON_LIVE 真人直播；AI_LIVE 智能直播；DIGITAL_PERSON_LIVE 数字人直播
        videoId: '', // 视频课件
        displayMode: 1, // 展示模式：1-横屏展示；2-竖屏展示
        scriptId: '', // 备课内容
        isShow: false, // 人数显示
        tutorTeacherUserIds: [], // 助教老师用户ID集合
        startTime: '', // 直播开始时间
        isRepeatedViewing: true, // 是否重复观看: false 0-否;true 1-是
        liveRoomPayGoodsConfig: [], // 付费直播间关联商品集合
        recordingTeacherName: '',
        recordingTeacherId: '', // 录播讲师ID
        isWarmUpMaterial: 0,
        realityTeacherUser: {}
      },

      rules: {
        name: [
          { required: true, message: '请输入直播间名称', trigger: 'blur' }
        ],
        type: [{ required: true }],
        feesType: [{ required: true }],
        warmUp: [{ required: true }],
        realityTeacherUser: [
          {
            validator: validRealityTeacherUser,
            required: true,
            trigger: 'change'
          }
        ],
        liveModel: [{ required: true }],
        videoId: [
          { required: true, message: '请选择视频课件', trigger: 'change' }
        ],
        displayMode: [{ required: true }],
        startTime: [
          { validator: validateStartTime, required: true, trigger: 'blur' }
        ]
      }
    }
  },
  computed: {},
  mounted() {
    if (this.$store.state.creatLiveRoom.historyAddLiveForm) {
      if (this.$store.state.creatLiveRoom.historyAddLiveForm?.warmUp) {
        this.form.warmUp =
          this.$store.state.creatLiveRoom.historyAddLiveForm?.warmUp
      }
      if (this.$store.state.creatLiveRoom.historyAddLiveForm?.isShow) {
        this.form.isShow =
          this.$store.state.creatLiveRoom.historyAddLiveForm?.isShow
      }
    }
    if (this.form.liveModel === 'AI_LIVE') {
      this.$refs.teachingAssistant.updateInitList(true)
    }

    const goodsList = this.$route.query.goodsList
    this.goodsList = goodsList
    if (goodsList) {
      try {
        const parsedGoodsList = JSON.parse(decodeURIComponent(goodsList))
        this.$refs.liveTypeRef.feesType = 2
        this.form.feesType = 2

        const promises = parsedGoodsList.map(item => {
          const params = {
            current: 1,
            size: 10,
            contentName: '',
            goodsId: item,
            goodsType: 8,
            onlineFlag: 0,
            singleLecture: 1,
            shelveFlag: 0,
            starSalePrice: '',
            endSalePrice: '',
            lecturerId: '',
            sortType: 0,
            shelveHideFlag: ''
          }
          return getGoodsList(params).then(({ data }) => data.records[0])
        })

        Promise.all(promises).then(selectGoods => {
          this.$refs.liveTypeRef.visibleGoodsList = true
          this.$refs.liveTypeRef.selectGoods = selectGoods
          this.$refs.liveTypeRef.checkGoodsList = selectGoods
          this.handleSelectProducts(selectGoods, false)
          this.$refs.liveTypeRef.paymentTime = ''
          this.handleChangeFeesType(2)
        })
      } catch (e) {
        console.error('解析 goodsList 参数失败:', e)
        this.$loading().close()
      }
    }
  },
  methods: {
    handleChangeFeesType(val) {
      this.form.feesType = Number(val)
      this.$parent.$refs.signSet.updateFeesType(val)
    },

    handleChangeLiveScene(val) {
      this.form.type = val
    },

    handleChangeVideoStartTime(val) {
      this.form.startTime = val + ':00'
      this.$parent.$refs.signSet.updateFormTime(this.form.startTime)
      // this.$parent.$refs.signSet.startTime = this.form.startTime
    },
    handleChangeWarmMaterial(val) {
      this.form.warmUp = val
    },
    handleUploadMaterial(data) {
      const { url, name, isWarmUpMaterial } = data
      this.form.warmUpUrl = url
      this.form.warmUpMaterialName = name
      this.form.isWarmUpMaterial = isWarmUpMaterial
    },
    handleChangeDisplayMode(val) {
      console.log(val, 'val')
      this.form.displayMode = Number(val)
    },
    handleChangeLivePattern(val) {
      this.form.liveModel = val

      if (val === 'AI_LIVE') {
        this.$refs.teachingAssistant.updateInitList(true)
        this.$parent.$refs.operateSet.$refs.playBack.updatePlaybackStatus(false)
      } else {
        this.$parent.$refs.operateSet.$refs.playBack.updatePlaybackStatus(true)
        this.form.videoId = undefined
        this.$refs.teachingAssistant.updateInitList(false)
      }
    },
    handleSelectProducts(list, flag = true) {
      console.log(list.length, 'list.length')
      const _list = []
      list.forEach(item => {
        // const subGoodsIds = []
        // if (item.children && item.children.length) {
        //   item.children.forEach(_item => {
        //     subGoodsIds.push(_item.id)
        //   })
        // }
        const _obj = {
          goodsId: item.goodsId, // 商品ID 商品ID或者套餐课商品ID
          goodsType: item.goodsType, // 商品类型 ：0-图片 1-音频 2-视频 3-专栏 4-大专栏 5-线下课 6-套餐课
          // subGoodsIds, // 子商品id列表
          payStartTime: flag ? item.payStartTime + ' 00:00:00' : '', // 付费开始时间
          payEndTime: flag ? item.payEndTime + ' 23:59:59' : ''
        }
        _list.push(_obj)
      })

      this.form.liveRoomPayGoodsConfig = _list
    },
    handleSelectVideoCourseware(data) {
      this.form.videoId = data.videoId
      this.form.recordingTeacherId = data.teacherId
      this.form.recordingTeacherName = data.teacherName
      this.$refs.lessonContent.emptyScript()
      if (data.width > data.height) {
        // 横屏直播
        this.$message('系统检测到您选择了横屏视频，已为您切换成横屏展示')
        this.form.displayMode = 1
      } else if (data.width < data.height) {
        // 竖屏直播
        this.$message('系统检测到您选择了竖屏视频，已为您切换成竖屏展示')
        this.form.displayMode = 2
      }
      eventBus.$emit('handleChangeVideoCourseware', data) // 任务推送
      this.$refs.displayMode.displayMode = String(this.form.displayMode)
    },
    handleSelectLessonContent(data) {
      this.form.scriptId = data.coursewareId
    },
    handleInputRepeatedViewing(val) {
      // this.form.isRepeatedViewing = val === 1
    },
    handleSelectTeachingAssistant(list) {
      console.log(list, '助教老师。。')
      this.form.tutorTeacherUserIds = list
    },
    handleSelectCourseInstructor(data) {
      console.log(data, 'data')
      this.form.realityTeacherUser = data
      this.$refs.form.clearValidate('realityTeacherUser')
    },
    handleChangeName(val) {
      this.$parent.$refs.signSet.updateFormName(val)
    },
    scrollToElement(element) {
      const rect = element.getBoundingClientRect()
      const elementPosition = rect.top + window.pageYOffset
      const offsetPosition = elementPosition - 140

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })
    },
    submitForm() {
      console.log(this.form, '基础设置提交参数。。。')
      return new Promise((resolve, reject) => {
        this.$refs.form.validate((valid, fields) => {
          if (valid) {
            resolve(this.form)
          } else {
            this.$nextTick(() => {
              const firstErrorField = Object.keys(fields)[0]
              const errorElement = this.$el.querySelector(
                `[for="${firstErrorField}"]`
              )
              if (errorElement) {
                this.scrollToElement(errorElement)
              }
            })
            reject(false)
          }
        })
      })
    },

    handleClearVideo() {
      this.form.videoId = ''
      this.form.recordingTeacherId = ''
      this.form.recordingTeacherName = ''
      eventBus.$emit('handleClearVideoCourseware')
    }
  }
}
</script>
<style lang="scss" scoped>
::v-deep .el-form-item__label {
  font-size: 14px;
  font-weight: bold;
  color: #000;
  padding-right: 20px;
}
</style>
