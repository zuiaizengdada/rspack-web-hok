<template>
  <!-- 新增规则弹框 -->
  <AppDialog
    v-model="config.visible"
    :title="{ 1: '新增直播间', 2: '编辑直播间' }[config.type]"
    width="602px"
    :loading="loading"
    height="auto"
    @success="sure"
  >
    <div class="addDialog overflowOuto">
      <el-form
        ref="form"
        v-loading="loading"
        :model="form"
        label-width="auto"
        size="small"
        :rules="rules"
      >
        <el-form-item label="直播模式" prop="liveModel">
          <el-radio-group
            v-model="form.liveModel"
            :disabled="config.type === 2"
            @change="changeliveModel"
          >
            <el-radio
              v-for="(item, index) in liveModeOption"
              :key="index"
              :label="item.value"
              :disabled="item.value === 'DIGITAL_PERSON_LIVE'"
            >{{ item.label }}</el-radio>
          </el-radio-group>
          <div class="tipsError">
            注：请谨慎选择直播模式，一旦确定不可修改。
          </div>
        </el-form-item>
        <el-form-item label="直播间名称" prop="name">
          <el-input
            v-model="form.name"
            class="el_input_p40"
            style="width: 450px"
            :disabled="config.type === 2 && form.status === 9"
            maxlength="40"
            show-word-limit
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
          <el-radio-group v-model="form.feesType" :disabled="config.type === 2">
            <el-radio :label="1">免费</el-radio>
            <el-radio :label="2">付费</el-radio>
          </el-radio-group>
          <div class="tipsError">
            注：请谨慎选择直播类型，一旦确定不可修改。
          </div>
        </el-form-item>

        <el-form-item v-if="form.feesType === 2" prop="goods">
          <el-button
            type="primary"
            :disabled="config.type === 2"
            @click="onhandleSelectGoods"
          >选择商品</el-button>
          <goodsList v-if="form.goods.length > 0" :data="form.goods" />
        </el-form-item>

        <el-form-item label="直播标签" prop="type">
          <el-radio-group v-model="form.type">
            <el-radio :label="1">正式</el-radio>
            <el-radio :label="2">测试</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="展示模式" prop="displayMode">
          <el-radio-group
            v-model="form.displayMode"
            :disabled="
              (config.type === 2 && [1, 2, 3, 9].includes(form.status)) ||
                ifLtr5min() ||
                form.liveModel === 'AI_LIVE'
            "
          >
            <el-radio :label="1">横屏展示</el-radio>
            <el-radio :label="2">竖屏展示</el-radio>
          </el-radio-group>
          <div class="screenMoveBox">
            <img
              src="~@/assets/image/landscapeScreen.png"
              alt=""
              style="width: 66px; height: 88px"
            />
            <img
              src="~@/assets/image/verticalScreen.png"
              alt=""
              style="width: 66px; height: 88px"
            />
          </div>
        </el-form-item>
        <el-form-item label="直播封面" prop="imgUrl">
          <template v-if="config.type === 2 && form.status === 9">
            <ImagePreviewer
              style="
                width: 160px;
                height: 120px;
                background: #fbfcfe;
                border-radius: 4px;
              "
              :src="form.imgUrl"
              fit="contain"
              :preview-src-list="[form.imgUrl]"
            />
          </template>
          <template v-else>
            <upload
              key="MUpload"
              ref="MUpload"
              :width="160"
              :height="120"
              accept=".jpg,.jpeg,.png"
              :before-upload="beforeUpload"
              :max-length="1"
              :get-oss-c-onfig-api="getLiveOssCConfig"
              oss-teacher-folder="hok_liveRoom"
              @change="fileChange"
            />
            <!-- <upload ref="MUpload" :width="160" :height="120" accept=".jpg,.jpeg,.png" :before-upload="beforeUpload" :max-length="1" oss-teacher-folder="hok_liveRoom" @change="fileChange" /> -->
            <div class="formTips" style="margin-left: 0px">
              建议图片比例16:9，支持 jpg、png
              、jpeg格式，大小不超过2M，最佳分辨率750*420px。
            </div>
          </template>
        </el-form-item>

        <el-form-item label="直播暖场" prop="warmUp">
          <el-radio-group
            v-model="form.warmUp"
            :disabled="config.type === 2 && [1, 2, 3, 9].includes(form.status)"
          >
            <el-radio :label="1">暖场图</el-radio>
            <el-radio :label="2">暖场视频</el-radio>
          </el-radio-group>
          <AppUploadViewCropper
            v-show="form.warmUp === 1"
            key="MUploadImg"
            ref="MUploadImg"
            upload-text="上传素材库"
            :width="160"
            :height="120"
            accept=".jpg,.jpeg,.png"
            :before-upload="beforeUploadImg"
            :max-length="1"
            :on-check-mdk5="onCheckMdk5"
            :disabled="config.type === 2 && [1, 2, 3, 9].includes(form.status)"
            :cropper-option="{
              // 裁剪设置
              fixed: true, // 是否开启截图框宽高固定比例
              infoTrue: false, // 为展示真实输出图片宽高 false 展示看到的截图框宽高	false	true | false
              centerBox: false, // 截图框是否被限制在图片里面	false	true | false
              canMoveBox: true, // 截图框能否拖动	true	true | false
              fixedNumber: [750, 1334], // 截图框的宽高比例 [宽度, 高度]
              original: false,
              autoCropWidth: 750
            }"
            @onClick="onImgClick"
            @change="res => fileWarmChange(res, 'warmImg')"
          >
            <template slot="tips">
              <div class="tipsBtn">
                <el-button
                  type="primary"
                  size="small"
                  :disabled="
                    config.type === 2 && [1, 2, 3, 9].includes(form.status)
                  "
                  @click="onhandleOpenMaterial(1)"
                >暖场素材库选择</el-button>
              </div>
            </template>
          </AppUploadViewCropper>
          <div
            v-show="form.warmUp === 1"
            class="formTips"
            style="margin-left: 0px"
          >
            建议图片比例16:9，支持 jpg、png
            、jpeg格式，大小不超过2M，最佳分辨率750*420px。
          </div>
          <uploadView
            v-show="form.warmUp === 2"
            key="MUploadVideo"
            ref="MUploadVideo"
            upload-text="上传素材库"
            :width="160"
            :height="120"
            accept=".mp4"
            :before-upload="beforeUploadVideo"
            :disabled="config.type === 2 && [1, 2, 3, 9].includes(form.status)"
            :max-length="1"
            :on-check-mdk5="onCheckMdk5"
            :get-oss-c-onfig-api="getLiveOssCConfig"
            oss-teacher-folder="hok_liveRoom"
            @onClick="onVideoClick"
            @change="res => fileWarmChange(res, 'warmVideo')"
          >
            <template slot="tips">
              <div class="tipsBtn">
                <el-button
                  type="primary"
                  size="small"
                  :disabled="
                    config.type === 2 && [1, 2, 3, 9].includes(form.status)
                  "
                  @click="onhandleOpenMaterial(2)"
                >暖场素材库选择</el-button>
              </div>
            </template>
          </uploadView>
          <div
            v-show="form.warmUp === 2"
            class="formTips"
            style="margin-left: 0px"
          >
            视频文件格式为MP4, 大小限5G以内，分辨率为1080P像素以下。
          </div>

          <!-- <el-checkbox  v-model="form.isWarmUpMaterial" :true-label="1" :false-label="0">上传文件同步到暖场素材库</el-checkbox> -->
        </el-form-item>

        <el-form-item label="开播时间" prop="startTime">
          <el-date-picker
            v-model="form.startTime1"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            :picker-options="pickerOptions"
            :disabled="
              (config.type === 2 && [1, 2, 3, 9].includes(form.status)) ||
                ifLtr5min()
            "
            style="width: 130px"
            type="date"
            placeholder="选择日期"
          />
          <el-autocomplete
            v-model="form.startTime2"
            clearable
            class="m-l-10"
            style="width: 120px"
            :fetch-suggestions="querySearch"
            :disabled="
              (config.type === 2 && [1, 2, 3, 9].includes(form.status)) ||
                ifLtr5min()
            "
            placeholder="请输入"
            @blur.stop="handleBlurPlayTime"
            @keyup.enter.native="handleBlurPlayTime"
            @select="handleSelect"
          />
          <span
            v-if="form.liveModel !== 'PERSON_LIVE'"
            class="formTips"
          >至少提前5分钟设置好</span>
          <div v-else class="formTips" style="margin-left: 0px">
            开播时间前30分钟才允许开播。
          </div>
        </el-form-item>
        <el-form-item
          v-if="form.liveModel === 'PERSON_LIVE'"
          label="真人讲师"
          prop="realityTeacherUser"
        >
          <el-button
            type="primary"
            :disabled="config.type === 2 && form.status === 9"
            @click="addTearch"
          >添加讲师({{ form.realityTeacherUser.length }}/10)</el-button>
          <div>
            <div :class="{ assessBox: form.realityTeacherUser.length > 0 }">
              <el-tag
                v-for="(tag, index) in form.realityTeacherUser"
                :key="tag.userId"
                class="remindPersonListView"
                :closable="!defaultDisabledUser.includes(tag.userId)"
                @close="delTearch(tag, index)"
              >{{ tag.nickName }}</el-tag>
            </div>
          </div>
        </el-form-item>

        <el-form-item
          v-if="form.liveModel === 'AI_LIVE'"
          label="视频课件"
          prop="videoId"
        >
          <!-- 视频课件 -->
          <AppSelect
            :get-api-fn="getVideoList"
            search-key="videoName"
            :popover-width="245"
            :disabled="
              (config.type === 2 && [1, 2, 3, 9].includes(form.status)) ||
                ifLtr5min()
            "
            :value="form.videoId"
            :label="form.videoName"
            :props="{
              label: 'videoName',
              value: 'videoId'
            }"
            @selected="selectedVideo"
          />
        </el-form-item>
        <el-form-item
          v-if="form.liveModel === 'AI_LIVE' && orgModules.enableLecturer"
          label="讲师"
          prop="recordingTeacherId"
        >
          {{ form.recordingTeacherName }}
        </el-form-item>
        <el-form-item
          v-if="form.liveModel === 'AI_LIVE' && form.videoId"
          label="备课内容"
          prop="scriptId"
        >
          <!-- 互动课件 -->
          <AppSelect
            :get-api-fn="getScriptList"
            search-key="coursewareName"
            :disabled="
              (config.type === 2 && [1, 2, 3, 9].includes(form.status)) ||
                ifLtr5min()
            "
            :popover-width="245"
            :value="form.scriptName"
            :label="form.scriptName"
            :props="{
              label: 'coursewareName',
              value: 'coursewareId'
            }"
            @selected="selectScript"
          >
            <div slot-scope="{ row }" class="liveRoomScript">
              <div class="text_hidden_ellipsis">{{ row.coursewareName }}</div>
              <div
                class="text_hidden_ellipsis"
                style="font-size: 12px; margin-top: 6px"
              >
                创建人: {{ row.createUserName }}
              </div>
            </div>
          </AppSelect>
          <el-button
            v-if="ifLatestScript && form.status === 0"
            :disabled="config.type === 2 && [1, 2, 3, 9].includes(form.status)"
            class="m-l-20"
            :loading="latestScriptLoading"
            type="primary"
            size="small"
            @click="getLatestScript"
          >获取最新课件</el-button>
          <div v-if="ifLatestScript && form.status === 0" class="tipsError">
            当前课件有更新新的内容。
          </div>
        </el-form-item>

        <el-form-item label="运营助教" prop="tutorTeacherUser">
          <el-button
            type="primary"
            :disabled="config.type === 2 && form.status === 9"
            @click="addAssistant"
          >添加助教({{ form.tutorTeacherUser.length }}/100)</el-button>
          <div>
            <div :class="{ assessBox: form.tutorTeacherUser.length > 0 }">
              <el-tag
                v-for="(tag, index) in form.tutorTeacherUser"
                :key="tag.userId"
                class="remindPersonListView"
                :closable="!defaultDisabledUser.includes(tag.userId)"
                @close="delAssistant(tag, index)"
              >{{ tag.nickName }}</el-tag>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="关联任务" prop="taskList">
          <saleTask v-model="form.taskList" />
        </el-form-item>
        <el-form-item label="直播人数" prop="isShow">
          <el-radio-group
            v-model="form.isShow"
            :disabled="config.type === 2 && form.status === 9"
          >
            <el-radio :label="true">显示</el-radio>
            <el-radio :label="false">隐藏</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          v-if="form.liveModel === 'PERSON_LIVE'"
          label="回放设置"
          prop="playbackSet"
        >
          <el-radio-group
            v-model="form.playbackSet"
            :disabled="config.type === 2 && [1, 2, 3, 9].includes(form.status)"
          >
            <el-radio :label="0">无回放</el-radio>
            <el-radio :label="1">云端录制</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          v-if="form.liveModel === 'AI_LIVE'"
          label="重复观看"
          prop="isRepeatedViewing"
        >
          <el-radio-group
            v-model="form.isRepeatedViewing"
            :disabled="config.type === 2 && form.status === 9"
          >
            <el-radio :label="false">不允许</el-radio>
            <el-radio :label="true">允许</el-radio>
          </el-radio-group>
          <span
            class="formTips"
            style="margin-top: 5px"
          >注：是否允许学员重复观看同一视频</span>
        </el-form-item>
      </el-form>
    </div>
    <div v-if="form.status === 9" slot="footer" />
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import { liveModeOption } from '../../columns'
import { getFileType } from '@/utils/index'
import upload from './upload.vue'
import {
  addLiveRoom,
  editLiveRoom,
  getLiveRoomInfo,
  getUpdateScript,
  updateNeweScript,
  checkExistence,
  getLiveOssCConfig
} from '@/api/liveRoom/index'
import { getVideoList } from '@/api/liveRoom/script'
import { getCoursewareList } from '@/api/liveRoom/courseware.js'
import { getIds } from '@/utils/index'
import AppSelect from '@/components/AppSelect/index'
import AppUploadViewCropper from '@/components/AppUploadViewCropper/upload'
import uploadView from '@/components/AppUploadView/upload'
import { mapGetters } from 'vuex'
import saleTask from './saleTask.vue'
import goodsList from './goodsList.vue'
import moment from 'moment'
// import Dialog from '../../liveRoom/components/Dialog'
import Dialog from '@/views/live/Dialog'
export default {
  components: {
    saleTask,
    AppDialog,
    AppSelect,
    upload,
    uploadView,
    AppUploadViewCropper,
    goodsList
  },
  props: {
    config: {
      type: Object,
      default: () => {
        return {
          type: 1, // 1新增 2编辑
          row: {},
          visible: false
        }
      }
    }
  },
  data() {
    var validateStartTime = (rule, value, callback) => {
      if (this.config.type === 1) {
        // 新增
        if (!this.form.startTime2) {
          return callback('请选择开播时间')
        }
        this.form.starTime = this.form.startTime1 + ' ' + this.form.startTime2
        if (this.form.liveModel === 'PERSON_LIVE') {
          // 真人直播
          if (this.form.starTime < moment().format('YYYY-MM-DD HH:mm')) {
            return callback('开播时间需要大于当前时间')
          }
          return callback()
        } else if (this.form.liveModel === 'AI_LIVE') {
          // 数字直播
          console.log(moment(this.form.starTime).diff(moment(), 'minutes'))
          if (moment(this.form.starTime).diff(moment(), 'minutes') < 5) {
            return callback('开播时间需要大于当前时间前5分钟')
          }
          return callback()
        } else {
          return callback()
        }
      } else {
        this.form.starTime = this.form.startTime1 + ' ' + this.form.startTime2
        console.log(this.form.status, '直播状态', this.form.starTime)
        // 编辑
        if ([1, 2, 3, 9].includes(this.form.status)) {
          // 直播中
          return callback()
        }
        if (!value) {
          return callback('请选择开播时间')
        }
        console.log(this.form.liveModel, 'this.form.liveModel')
        if (this.form.liveModel === 'PERSON_LIVE') {
          console.log('真人直播')
          // 真人直播
          if (this.form.starTime < moment().format('YYYY-MM-DD HH:mm')) {
            return callback('开播时间需要大于当前时间')
          }
          return callback()
        } else if (this.form.liveModel === 'AI_LIVE') {
          if (this.ifLtr5min()) {
            return callback()
          }
          // 数字直播
          console.log(moment(this.form.starTime).diff(moment(), 'minutes'))
          if (moment(this.form.starTime).diff(moment(), 'minutes') < 5) {
            return callback('开播时间需要大于当前时间前5分钟')
          }
          return callback()
        } else {
          return callback()
        }
      }
    }
    var validateWarmUp = (rule, value, callback) => {
      if (this.form.isWarmUpMaterial === 1) {
        if (value === 1) {
          if (!this.form.warmImg.url) {
            return callback('文件错误: 未上传文件')
          } else if (!this.form.warmImg.md5) {
            return callback('文件错误: 缺少文件md5码')
          } else if (!this.form.warmImg.warmUpMaterialName) {
            return callback('文件错误：缺少文件名')
          }
        } else {
          if (!this.form.warmVideo.url) {
            return callback('文件错误: 未上传文件')
          } else if (!this.form.warmVideo.md5) {
            return callback('文件错误: 缺少文件md5')
          } else if (!this.form.warmVideo.warmUpMaterialName) {
            return callback('文件错误: 缺少文件名')
          }
        }
      }
      return callback()
    }
    return {
      getLiveOssCConfig,
      liveModeOption,
      loading: false,
      latestScriptLoading: false,
      ifLatestScript: false,
      form: {
        liveMode: '',
        type: 1, // 直播间类型，1：正式，2：测试
        feesType: 1,
        goods: [],
        appearSequence: '',
        liveRoomName: '',
        displayMode: 1, // 展示模式: 1横屏展示，2竖屏展示
        imgUrl: '', // 直播封面
        warmUp: 1, // 直播暖场
        isWarmUpMaterial: 0, // 上传视频同步到素材库
        warmImg: {
          // 直播暖场图片
          md5: '', // 文件md5
          url: '', // 文件url
          warmUpMaterialName: '' // 素材名称
        },
        warmVideo: {
          // 直播暖场视频url
          md5: '',
          url: '',
          warmUpMaterialName: ''
        },
        starTime: '',
        startTime1: '',
        startTime2: '',
        realityTeacherUser: [],
        tutorTeacherUser: [],
        taskList: [],
        isShow: false,
        playbackSet: 1,
        recordingTeacherId: '', // 录播讲师ID
        recordingTeacherName: '', // 录播讲师名称
        scriptId: '', // 互动课件ID
        scriptName: '', // 互动课件名称
        videoId: '', // 录播视频ID
        videoName: '', // 录播视频名称
        isRepeatedViewing: true // 是否重复观看0否1是
      },
      originForm: {
        liveMode: '',
        type: 1, // 直播间类型，1：正式，2：测试
        feesType: 1,
        goods: [],
        appearSequence: '',
        liveRoomName: '',
        displayMode: 1, // 展示模式: 1横屏展示，2竖屏展示
        imgUrl: '',
        warmUp: 1, // 直播暖场
        warmImg: {
          // 直播暖场图片
          md5: '', // 文件md5
          url: '', // 文件url
          warmUpMaterialName: '' // 素材名称
        },
        warmVideo: {
          // 直播暖场视频url
          md5: '',
          url: '',
          warmUpMaterialName: ''
        },
        isWarmUpMaterial: 0, // 上传视频同步到素材库
        starTime: '',
        realityTeacherUser: [],
        tutorTeacherUser: [],
        taskList: [],
        isShow: false,
        playbackSet: 1,
        recordingTeacherId: '', // 录播讲师ID
        recordingTeacherName: '', // 录播讲师名称
        scriptId: '', // 互动课件ID
        scriptName: '', // 互动课件名称
        videoId: '', // 录播视频ID
        videoName: '', // 录播视频名称
        isRepeatedViewing: true // 是否重复观看0否1是
      },
      restaurants: [],
      rules: {
        liveModel: [
          { required: true, message: '请选择直播模式', trigger: 'blur' }
        ],
        type: [{ required: true, message: '请选择直播标签', trigger: 'blur' }],
        feesType: [
          { required: true, message: '请选择直播类型', trigger: 'blur' }
        ],
        goods: [
          {
            type: 'array',
            required: true,
            message: '请选择直播间关联商品',
            trigger: 'change'
          }
        ],
        name: [
          { required: true, message: '请输入直播间名称', trigger: 'blur' }
        ],
        displayMode: [
          { required: true, message: '请选择展示模式', trigger: 'blur' }
        ],
        imgUrl: [
          { required: true, message: '请选择直播封面', trigger: 'blur' }
        ],
        startTime: [
          { validator: validateStartTime, required: true, trigger: 'blur' }
        ],
        realityTeacherUser: [
          {
            required: true,
            type: 'array',
            message: '请选择真人讲师',
            trigger: 'blur'
          }
        ],
        videoId: [
          { required: true, message: '请选择录制视频', trigger: 'blur' }
        ],
        recordingTeacherId: [
          { required: true, message: '请选择视频讲师', trigger: 'blur' }
        ],
        warmUp: [{ validator: validateWarmUp, trigger: 'change' }]
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < new Date().getTime() - 86400000
        }
      },
      // 编辑状态下直播中，不能删除的人员userid
      defaultDisabledUser: [],
      checkGoodsList: [], // 选中的商品
      ifOnceOpen: false
    }
  },
  computed: {
    ...mapGetters(['userInfo', 'orgModules'])
  },
  watch: {
    'config.visible': {
      handler(val) {
        if (val) {
          this.ifLatestScript = false
          this.checkGoodsList = []
          this.$refs.form && this.$refs.form.resetFields()
          if (this.config.type === 1) {
            this.ifOnceOpen = true
            this.form = {
              liveModel: 'PERSON_LIVE',
              type: 1, // 直播间类型，1：正式，2：测试
              feesType: 1,
              goods: [],
              appearSequence: '',
              name: '',
              displayMode: 1,
              imgUrl:
                'https://hok-o.oss-cn-beijing.aliyuncs.com/live/livePoster.jpg',
              warmUp: 1, // 直播暖场
              warmImg: {
                // 直播暖场图片
                md5: '', // 文件md5
                url: '', // 文件url
                warmUpMaterialName: '' // 素材名称
              }, // 直播暖场图片
              warmVideo: {
                // 直播暖场视频url
                md5: '',
                url: '',
                warmUpMaterialName: ''
              }, // 直播暖场视频url
              isWarmUpMaterial: 0, // 上传视频同步到素材库
              startTime: '',
              startTime1: moment().format('YYYY-MM-DD'),
              startTime2: '',
              realityTeacherUser: [],
              tutorTeacherUser: [],
              taskList: [],
              isShow: false,
              playbackSet: 1,
              recordingTeacherId: '', // 录播讲师ID
              recordingTeacherName: '', // 录播讲师名称
              scriptId: '', // 互动课件ID
              scriptName: '', // 互动课件名称
              videoId: '', // 录播视频ID
              videoName: '', // 录播视频名称
              isRepeatedViewing: true // 是否重复观看0否1是
            }
            this.$nextTick(() => {
              this.$refs.MUpload &&
                this.$refs.MUpload.setFileList([
                  {
                    status: 3,
                    url: this.form.imgUrl
                  }
                ])
              this.$refs.MUploadImg && this.$refs.MUploadImg.setFileList([])
              this.$refs.MUploadVideo && this.$refs.MUploadVideo.setFileList([])
            })
          } else {
            // const row = JSON.parse(JSON.stringify(this.config.row))
            this.loading = true
            const params = {
              liveRoomId: this.config.row.id
            }
            getLiveRoomInfo(params)
              .then(res => {
                const realityTeacherUser = []
                const tutorTeacherUser = []
                const defaultDisabledUser = []
                const { roundTableStatus, roundTableMasterId } =
                  res.data?.liveRoomPersonInfo
                res.data.teacherInfoList.map(v => {
                  v.teacherRole === 0 &&
                    realityTeacherUser.push({
                      userId: v.teacherId,
                      nickName: v.teacherName
                    })
                  v.teacherRole === 1 &&
                    tutorTeacherUser.push({
                      userId: v.teacherId,
                      nickName: v.teacherName
                    })
                  defaultDisabledUser.push(v.teacherId)
                })
                res.data.materialGoodsDetail &&
                  res.data.materialGoodsDetail.map(v => {
                    v.childrenOpen = false
                    v.coverVerticalUrl = v.coverUrlExtendVo.coverUrl
                    v.goodsId = v.packageGoodsId
                  })
                res.data.taskList &&
                  res.data.taskList.map(v => {
                    v.id = v.taskId
                    v.createUserName = v.taskCreateName
                  })
                this.form = {
                  id: this.config.row.id,
                  type: res.data.type || 1,
                  feesType: res.data.feesType || 1,
                  goods: res.data.materialGoodsDetail || [],
                  appearSequence: res.data.appearSequence || '',
                  code: res.data.code,
                  liveModel: res.data.liveModel,
                  displayMode: res.data.displayMode || 1,
                  name: res.data.name,
                  imgUrl:
                    res.data.imgUrl ||
                    'https://hok-o.oss-cn-beijing.aliyuncs.com/live/livePoster.jpg',
                  warmUp: res.data.warmUp || 1, // 直播暖场
                  warmImg: {
                    md5: res.data.warmUp === 1 ? res.data.md5 : '',
                    url: res.data.warmUp === 1 ? res.data.warmUpUrl : '',
                    warmUpMaterialName:
                      res.data.warmUp === 1 ? res.data.warmUpMaterialName : ''
                  },
                  warmVideo: {
                    md5: res.data.warmUp === 2 ? res.data.md5 : '',
                    url: res.data.warmUp === 2 ? res.data.warmUpUrl : '',
                    warmUpMaterialName:
                      res.data.warmUp === 2 ? res.data.warmUpMaterialName : ''
                  },
                  isWarmUpMaterial: 0, // 上传视频同步到素材库
                  startTime: moment(res.data.startTime).format(
                    'YYYY-MM-DD HH:mm'
                  ),
                  startTime1: moment(res.data.startTime).format('YYYY-MM-DD'),
                  startTime2: moment(res.data.startTime).format('HH:mm'),
                  realityTeacherUser,
                  tutorTeacherUser,
                  taskList: res.data.taskList || [],
                  isShow: res.data.isShow,
                  playbackSet: res.data.playbackSet,
                  status: res.data.status,
                  recordingTeacherId:
                    res.data.liveRoomIntelligentInfo.videoTeacherId, // 录播讲师ID
                  recordingTeacherName:
                    res.data.liveRoomIntelligentInfo.videoTeacherName, // 录播讲师名称
                  scriptId: res.data.liveRoomIntelligentInfo.scriptId, // 互动课件ID
                  scriptName: res.data.liveRoomIntelligentInfo.scriptName, // 互动课件名称
                  videoId: res.data.liveRoomIntelligentInfo.videoId, // 录播视频ID
                  videoName: res.data.liveRoomIntelligentInfo.videoName, // 录播视频名称
                  isRepeatedViewing:
                    res.data.liveRoomIntelligentInfo.isRepeatedViewing,
                  roundTableMasterId,
                  roundTableStatus
                }
                this.originForm = JSON.parse(JSON.stringify(this.form))
                if (
                  this.config.type === 2 &&
                  [1, 2, 3, 9].includes(this.form.status)
                ) {
                  this.defaultDisabledUser = defaultDisabledUser
                }
                console.log(this.form)
                this.$nextTick(() => {
                  this.$refs.MUpload &&
                    this.$refs.MUpload.setFileList([
                      {
                        status: 3,
                        url: this.form.imgUrl
                      }
                    ])
                  if (this.form.warmImg.url) {
                    this.$refs.MUploadImg &&
                      this.$refs.MUploadImg.setFileList([
                        {
                          status: 3,
                          url: this.form.warmImg.url,
                          md5: this.form.warmImg.md5,
                          name: this.form.warmImg.warmUpMaterialName
                        }
                      ])
                  } else {
                    this.$refs.MUploadImg.setFileList([])
                  }
                  if (this.form.warmVideo.url) {
                    this.$refs.MUploadVideo &&
                      this.$refs.MUploadVideo.setFileList([
                        {
                          status: 3,
                          url: this.form.warmVideo.url,
                          md5: this.form.warmVideo.md5,
                          name: this.form.warmVideo.warmUpMaterialName
                        }
                      ])
                  } else {
                    this.$refs.MUploadVideo.setFileList([])
                  }
                })
                this.loading = false
              })
              .catch(() => {
                this.loading = false
              })
            this.getUpdateScript()
          }
        } else {
          this.form = {
            liveModel: 'PERSON_LIVE',
            name: '',
            type: 1,
            feesType: 1,
            goods: [],
            appearSequence: '',
            displayMode: 1,
            imgUrl:
              'https://hok-o.oss-cn-beijing.aliyuncs.com/live/livePoster.jpg',
            warmUp: 1, // 直播暖场
            warmImg: {
              // 直播暖场图片
              md5: '', // 文件md5
              url: '', // 文件url
              warmUpMaterialName: '' // 素材名称
            }, // 直播暖场图片
            warmVideo: {
              // 直播暖场视频url
              md5: '',
              url: '',
              warmUpMaterialName: ''
            }, // 直播暖场视频url
            isWarmUpMaterial: 0, // 上传视频同步到素材库
            startTime: '',
            startTime1: moment().format('YYYY-MM-DD'),
            startTime2: '',
            realityTeacherUser: [],
            tutorTeacherUser: [],
            taskList: [],
            isShow: false,
            playbackSet: 1,
            recordingTeacherId: '', // 录播讲师ID
            recordingTeacherName: '', // 录播讲师名称
            scriptId: '', // 互动课件ID
            scriptName: '', // 互动课件名称
            videoId: '', // 录播视频ID
            videoName: '', // 录播视频名称
            isRepeatedViewing: true // 是否重复观看0否1是
          }
        }
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
    this.restaurants = this.loadAll()
  },
  methods: {
    // 点击切换直播模式
    changeliveModel(val) {
      if (this.config.type === 1 && val === 'AI_LIVE' && this.ifOnceOpen) {
        this.form.tutorTeacherUser = [{ ...this.userInfo }]
        this.ifOnceOpen = false
      }
    },
    // 获取课件是否有更新
    getUpdateScript() {
      if (this.config.type !== 2 || this.config.row.liveModel !== 'AI_LIVE') {
        return
      }
      this.ifLatestScript = false
      getUpdateScript(this.config.row.id)
        .then(res => {
          console.log('获取课件是否有更新')
          this.ifLatestScript = res.data
        })
        .catch(() => {
          this.ifLatestScript = false
        })
    },
    handleBlurPlayTime() {
      const total = this.formatPrTime(this.form.startTime2)
      if (total || total === 0) {
        this.form.startTime2 = this.getFormatHMS(total * 1000 * 60)
      } else {
        this.form.startTime2 = this.getFormatHMS(0)
      }
      return
      // this.isEditPlayTime = false
    },
    // 时间转秒
    formatPrTime(val) {
      const isValid = this.volidFormatTime(val)
      if (isValid) {
        const list = val.split(':').reverse()
        for (let i = 0; i < list.length; i++) {
          if (!list[i]) {
            list[i] = '00'
          }
        }
        const mss = Number(list[0]) || 0
        const ss = list.length > 1 ? Number(list[1]) * 60 : 0
        // const ms = list.length > 2 ? Number(list[2]) * 3600 : 0
        // const hs = list.length > 3 ? Number(list[3]) * 3600 : 0
        const total = mss + ss
        console.log(mss, ss, '1231')
        return total
      }
    },
    volidFormatTime(val) {
      let isValid = true
      if (val.includes(':')) {
        const list = val.split(':')
        list.forEach(item => {
          isValid = !isNaN(Number(item))
        })
      } else {
        isValid = !isNaN(Number(val))
      }
      return isValid
    },
    // 接收豪秒的单位
    getFormatHMS(val) {
      return moment.utc(val).format('HH:mm')
    },
    loadAll() {
      const arr = []
      for (let i = 0; i < 24 * 60 * 60; i = i + 30 * 60) {
        arr.push({ value: this.filtersTime(i) })
      }
      return arr
    },
    // 秒转时分
    filtersTime(val) {
      const result = parseInt(val)
      const h =
        Math.floor(result / 3600) < 10
          ? '0' + Math.floor(result / 3600)
          : Math.floor(result / 3600)
      const m =
        Math.floor((result / 60) % 60) < 10
          ? '0' + Math.floor((result / 60) % 60)
          : Math.floor((result / 60) % 60)
      return h + ':' + m
    },
    querySearch(queryString, cb) {
      cb(this.restaurants)
    },
    handleSelect(item) {
      this.form.startTime2 = item.value
      this.$refs.form && this.$refs.form.validateField('startTime')
    },
    // 限制输入英文数字和汉字
    delNoNumber2(e) {
      this.form.expertName = e.replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5]/g, '')
    },
    // 限制输入英文和数字
    delNoNumber1(e) {
      this.form.expertId = e.replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5]/g, '')
    },
    sure() {
      console.log(this.form)
      if (
        this.form.warmUp === 1 &&
        this.$refs.MUploadImg &&
        this.$refs.MUploadImg.getUploadFile()
      ) {
        return this.$message.error('正在上传暖场图')
      }
      if (
        this.form.warmUp === 2 &&
        this.$refs.MUploadImg &&
        this.$refs.MUploadVideo.getUploadFile()
      ) {
        return this.$message.error('正在上传暖场片')
      }
      this.$refs.form.validate(valid => {
        if (valid) {
          const realityTeacherUserIds = getIds(
            this.form.realityTeacherUser,
            'userId'
          )
          const tutorTeacherUserIds = getIds(
            this.form.tutorTeacherUser,
            'userId'
          )
          let warmUpUrl = ''
          let warmUpMaterialName = ''
          let md5 = ''
          if (this.form.warmUp === 1) {
            warmUpUrl = this.form.warmImg.url
            warmUpMaterialName = this.form.warmImg.warmUpMaterialName
            md5 = this.form.warmImg.md5
          } else if (this.form.warmUp === 2) {
            warmUpUrl = this.form.warmVideo.url
            warmUpMaterialName = this.form.warmVideo.warmUpMaterialName
            md5 = this.form.warmVideo.md5
          }
          const starTime =
            this.form.startTime1 + ' ' + this.form.startTime2 + ':00'
          const liveRoomPayGoodsConfig = this.form.goods.reduce((pre, next) => {
            pre.push({
              goodsId: next.goodsId,
              goodsType: next.goodsType,
              subGoodsIds: next.children.reduce((p, n) => {
                p.push(n.goodsId)
                return p
              }, [])
            })
            return pre
          }, [])
          const params = {
            code: this.form.code,
            type: this.form.type,
            feesType: this.form.feesType,
            liveRoomPayGoodsConfig,
            appearSequence: this.form.appearSequence,
            imgUrl: this.form.imgUrl,
            warmUp: this.form.warmUp,
            warmUpUrl: warmUpUrl,
            warmUpMaterialName,
            md5,
            isWarmUpMaterial: md5 ? 1 : 0,
            isShow: this.form.isShow,
            liveModel: this.form.liveModel,
            displayMode: this.form.displayMode,
            name: this.form.name,
            playbackSet: this.form.playbackSet,
            realityTeacherUserIds,
            startTime: starTime,
            tutorTeacherUserIds,
            taskList: this.form.taskList,
            recordingTeacherId: this.form.recordingTeacherId, // 录播讲师ID
            scriptId: this.form.scriptId, // 互动课件ID
            videoId: this.form.videoId, // 录播视频ID
            isRepeatedViewing: this.form.isRepeatedViewing // 是否重复观看0否1是
          }
          this.config.type !== 1 && (params.liveRoomId = this.form.id)
          this.loading = true
          const apiFn = this.config.type === 1 ? addLiveRoom : editLiveRoom
          console.log(params, 'params')
          apiFn(params)
            .then(res => {
              this.$notify.success({ title: '提示', message: '操作成功' })
              this.loading = false
              this.$emit('success')
            })
            .catch(() => {
              this.loading = false
            })
        } else {
          return false
        }
      })
    },
    // 点击添加讲师
    addTearch() {
      let disabledUser = []
      this.form.tutorTeacherUser.forEach(i => {
        disabledUser.push(i.userId)
      })
      if (this.config.type === 2 && [1, 2].includes(this.form.status)) {
        disabledUser = disabledUser.concat(this.defaultDisabledUser)
      }
      if (this.form.roundTableMasterId && this.form.roundTableStatus) {
        // 真人直播 圆桌会议存在主持人的话主持人不能删除
        disabledUser.push(this.form.roundTableMasterId)
      }
      this.$AddressBook({
        visible: true,
        multiple: true,
        type: [1],
        checkUser: this.form.realityTeacherUser,
        disabledUser,
        maxlength: 10,
        success: res => {
          this.form.realityTeacherUser = res.user
          this.$refs.form && this.$refs.form.validateField('realityTeacherUser')
        }
      })
    },
    // 点击删除讲师
    delTearch(tag, index) {
      if (
        this.form.roundTableMasterId &&
        this.form.roundTableStatus &&
        this.form.realityTeacherUser[index]?.userId ===
          this.form.roundTableMasterId
      ) {
        // 真人直播 圆桌会议存在主持人的话主持人不能删除
        return this.$message.error(
          '主持人不能进行删除，请重新设置主持人后才可以删除'
        )
      }
      this.form.realityTeacherUser.splice(index, 1)
    },
    // 点击添加助教
    addAssistant() {
      let disabledUser = []
      this.form.realityTeacherUser.forEach(i => {
        disabledUser.push(i.userId)
      })
      if (this.config.type === 2 && [1, 2, 3].includes(this.form.status)) {
        disabledUser = disabledUser.concat(this.defaultDisabledUser)
      }
      this.$AddressBook({
        visible: true,
        multiple: true,
        type: [1],
        checkUser: this.form.tutorTeacherUser,
        disabledUser,
        maxlength: 100,
        success: res => {
          this.form.tutorTeacherUser = res.user
        }
      })
    },
    // 点击删除助教
    delAssistant(tag, index) {
      this.form.tutorTeacherUser.splice(index, 1)
    },
    beforeUpload(file) {
      // const isIMAGE = file.type === 'image/jpeg' || 'image/jpg' || 'image/png'
      const type = getFileType(file.name).suffix
      const isIMAGE = ['jpg', 'png', 'JPG', 'PNG', 'jpeg', 'JPEG'].includes(
        type
      )
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isIMAGE) {
        this.$message.error(`仅支持jpg,png,jpeg格式图片!`)
      } else if (!isLt2M) {
        this.$message.error('上传文件大小不能超过 2M!')
      }
      return isIMAGE && isLt2M
    },
    fileChange(res) {
      console.log(res, '上传文件改变触发')
      if (res.length > 0) {
        this.form.imgUrl = res[0].url
      }
    },
    getVideoList(params) {
      const data = {
        pageIndex: params.current,
        pageSize: params.size,
        teacherId: '',
        videoName: params.videoName,
        covertStatus: 2, // 1-转码中 2-转码成功 3-转码失败
        status: 1 // 1:启用 2禁用
      }
      return getVideoList(data).then(res => {
        return {
          items: res.data.items,
          total: res.data.total
        }
      })
    },
    selectedVideo(res) {
      console.log(res)
      this.form.recordingTeacherId = res.teacherId
      this.form.recordingTeacherName = res.teacherName
      this.form.videoId = res.videoId
      this.form.videoName = res.videoName
      this.form.scriptId = ''
      this.form.scriptName = ''
      this.$refs.form && this.$refs.form.validateField('videoId')
      if (res.width > res.height) {
        // 横屏直播
        this.$message('系统检测到您选择了横屏视频，已为您切换成横屏展示')
        this.form.displayMode = 1
      } else if (res.width < res.height) {
        // 竖屏直播
        this.$message('系统检测到您选择了竖屏视频，已为您切换成竖屏展示')
        this.form.displayMode = 2
      }
    },
    getScriptList(params) {
      const data = {
        pageIndex: params.current,
        pageSize: params.size,
        teacherId: '',
        status: 1,
        videoId: this.form.videoId,
        coursewareName: params.coursewareName
      }
      return getCoursewareList(data).then(res => {
        return {
          items: res.data.items,
          total: res.data.total
        }
      })
    },
    selectScript(res) {
      this.form.scriptId = res.coursewareId
      this.form.scriptName = res.coursewareName
    },
    // 判断是否直播前5分钟
    ifLtr5min() {
      if (
        this.config.type !== 2 ||
        this.form.status !== 0 ||
        this.form.liveModel !== 'AI_LIVE'
      ) {
        return false
      } else {
        return moment(this.originForm.startTime).diff(moment(), 'minutes') < 5
      }
    },
    beforeUploadImg(file) {
      // const isIMAGE = file.type === 'image/jpeg' || 'image/jpg' || 'image/png'
      const type = getFileType(file.name).suffix
      const isIMAGE = ['jpg', 'png', 'JPG', 'PNG', 'jpeg', 'JPEG'].includes(
        type
      )
      // const isLt2M = file.size / 1024 / 1024 < 2
      if (!isIMAGE) {
        this.$message.error(`仅支持jpg,png,jpeg格式图片!`)
      }
      // else if (!isLt2M) {
      //   this.$message.error('上传文件大小不能超过 2M!')
      // }
      return isIMAGE
      // return isIMAGE && isLt2M
    },
    beforeUploadVideo(file) {
      const type = getFileType(file.name).suffix
      const isIMAGE = ['mp4', 'MP4'].includes(type)
      // const isIMAGE = file.type === 'video/mp4'
      const isLt5GB = file.size / 1024 / 1024 / 1024 < 5
      if (!isIMAGE) {
        this.$message.error(`仅支持mp4格式文件!`)
      } else if (!isLt5GB) {
        this.$message.error('上传文件大小不能超过 5GB!')
      }
      return isIMAGE && isLt5GB
    },
    fileWarmChange(res, key) {
      console.log(res, '上传文件改变触发')
      // this.form.warmUpMaterialName = getFileType(res[0].file.name).fileName
      if (res.length > 0) {
        this.form[key].url = res[0].url
        this.form[key].warmUpMaterialName = getFileType(
          res[0].file.name
        ).fileName
        this.$refs.form && this.$refs.form.validateField('warmUp')
      }
    },
    onImgClick() {
      this.form.warmImg = {
        md5: '', // 文件md5
        url: '', // 文件url
        warmUpMaterialName: '' // 素材名称
      }
      this.$refs.MUploadImg && this.$refs.MUploadImg.setFileList([])
      this.$refs.form && this.$refs.form.validateField('warmUp')
    },
    onVideoClick() {
      this.form.warmVideo = {
        md5: '', // 文件md5
        url: '', // 文件url
        warmUpMaterialName: '' // 素材名称
      }
      this.$refs.MUploadVideo && this.$refs.MUploadVideo.setFileList([])
      this.$refs.form && this.$refs.form.validateField('warmUp')
    },
    // 点击打开选择暖场素材库弹框
    onhandleOpenMaterial(type) {
      Dialog.open({
        type: 'SelectMaterial',
        fileType: type,
        visible: true,
        success: row => {
          Dialog.close()
          this.form.warmUpMaterialName = row.name
          this.form.warmUp = row.type
          this.form.warmImg = {
            md5: '', // 文件md5
            url: row.type === 1 ? row.url : '', // 文件url
            warmUpMaterialName: row.type === 1 ? row.name : '' // 素材名称
          }
          this.form.warmVideo = {
            md5: '', // 文件md5
            url: row.type === 2 ? row.url : '', // 文件url
            warmUpMaterialName: row.type === 2 ? row.name : '' // 素材名称 // 素材名称
          }
          if (row.type === 1 && this.$refs.MUploadImg) {
            this.$refs.MUploadImg.setFileList([
              {
                status: 3,
                url: row.url
              }
            ])
          } else if (row.type === 2 && this.$refs.MUploadVideo) {
            this.$refs.MUploadVideo.setFileList([
              {
                status: 3,
                url: row.url
              }
            ])
          }
          this.$refs.form && this.$refs.form.validateField('warmUp')
        }
      })
    },
    // 获取最新课件
    getLatestScript() {
      console.log('点击获取最新课件')
      this.$delModal({
        tips: `
          <div style="font-size: 16px;color: #333333;font-weight: bold;line-height: 24px;">请确定是否更新到最新的课件?</div>
          <div class="m-t-16" style="font-size: 14px;color: #333333;line-height: 22px;">
          新的课件将覆盖原课件内容。<br/>
          课件在直播前5分钟有效。<br/>
          课件更新后，将直接生效。<br/>
          </div>
        `,
        success: () => {
          this.latestScriptLoading = true
          const data = {
            liveRoomId: this.config.row.id
          }
          updateNeweScript(data)
            .then(res => {
              this.latestScriptLoading = false
              if (res.code === 1) {
                this.ifLatestScript = false
                this.$delModal({
                  tips: `<div style="font-size: 16px;color: #333333;font-weight: bold;line-height: 24px;">更新成功，请保存当前直播间配置。</div>`,
                  noCancelBtn: true,
                  iconClassName: 'c_00B42A',
                  sureBtnText: '关闭',
                  sureBtnBgColor: '#fff',
                  sureBtnStyle: {
                    color: '#161616',
                    border: '1px solid #DCDFE6'
                  },
                  success: () => {
                    this.ifLatestScript = false
                  }
                })
              } else {
                this.$delModal({
                  tips: `
                  <div style="font-size: 16px;color: #333333;font-weight: bold;line-height: 24px;">更新失败</div>
                  <div class="m-t-16" style="font-size: 14px;color: #333333;line-height: 22px;">${res.message}</div>
                `,
                  noCancelBtn: true,
                  sureBtnText: '关闭',
                  sureBtnBgColor: '#fff',
                  sureBtnStyle: {
                    color: '#161616',
                    border: '1px solid #DCDFE6'
                  },
                  success: () => {}
                })
              }
            })
            .catch(() => {
              this.latestScriptLoading = false
            })
        }
      })
    },
    onCheckMdk5(md5) {
      this.form[this.form.warmUp === 1 ? 'warmImg' : 'warmVideo'].md5 = md5
      return new Promise((resolve, reject) => {
        return checkExistence({ md5: md5, type: this.form.warmUp })
          .then(res => {
            if (res.data) {
              return reject('该文件已在素材库中存在。')
            } else {
              return resolve(!res.data)
            }
          })
          .catch(() => {
            reject('文件校验失败')
          })
      })
    },
    onhandleSelectGoods() {
      this.$SelectGoods({
        visible: true,
        multiple: false,
        initSearch: {
          tagType: 5
        },
        tabList: [
          { id: '10', name: '直播课', api: '' },
          { id: 'A7', name: '套餐课', api: '' }
        ],
        currentId: '10',
        showCourseType: true, // 开启标签筛选
        defaultValue: JSON.parse(JSON.stringify(this.checkGoodsList)),
        goodsInfo: JSON.parse(JSON.stringify(this.form.goods)),
        success: (res, checkList) => {
          console.log(res, 'res', checkList)
          this.form.goods = res
          this.checkGoodsList = checkList
        }
      })
    }
  }
}
</script>

<style lang='scss' scoped>
::v-deep {
  .tearchInput {
    width: 245px;
  }
}
::v-deep {
  .el-upload {
    .el-upload-dragger {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: #fbfcfe;
      width: 160px;
      height: 120px;
    }
  }
  .el_input_p40 {
    > input {
      padding-right: 45px;
    }
  }
}
.addDialog {
  max-height: 600px;
  padding: 20px;
}
.m-l-32 {
  margin-left: 32px;
}
.assessBox {
  margin-top: 16px;
  width: 450px;
  box-sizing: border-box;
  padding: 18px 16px 2px;
  height: auto;
  background: #ffffff;
  border-radius: 6px;
  border: 1px dashed #979797;
}
.remindPersonListView {
  margin-right: 16px;
  margin-bottom: 16px;
}
.screenMoveBox {
  margin-top: 10px;
  width: 182px;
  padding-left: 6px;
  display: flex;
  justify-content: space-between;
}
.formTips {
  margin-left: 10px;
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #999999;
  line-height: 22px;
}
.tipsError {
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #f53f3f;
  line-height: 22px;
}
.tipsBtn {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}
</style>
