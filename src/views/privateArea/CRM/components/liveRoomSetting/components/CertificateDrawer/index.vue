<template>
  <el-drawer
    :title="compTitle"
    size="80%"
    :visible.sync="visible"
    :with-header="false"
    :destroy-on-close="true"
    :wrapper-closable="false"
    :close-on-press-escape="false"
    :append-to-body="true"
    :modal="true"
  >
    <div
      v-loading="loading"
      class="certificate-drawer-wrapper"
      element-loading-text="正在生成证书..."
    >
      <div slot="title" class="ss-material-box-header">
        <div class="ss-material-box-header-title">
          {{ compTitle }}
        </div>
        <i class="el-icon-close close" @click="handleClose" />
      </div>

      <div class="certificate-drawer-form-wrapper">
        <el-form
          ref="certificateFormRef"
          class="certificate-drawer-form"
          :model="certificateForm"
          :rules="certificateFormRules"
          label-width="100px"
          label-position="top"
        >
          <!-- 新增证书 -->
          <div v-if="type === 'create'" class="title">新增证书</div>

          <el-form-item
            class="certificate-status"
            label="证书状态"
            prop="createCertificate.status"
          >
            <el-switch
              v-model="certificateForm.createCertificate.status"
              style="transform: scale(0.9)"
            />
          </el-form-item>

          <!-- 基础信息 -->
          <div class="title">基础信息</div>

          <el-form-item
            label="证书名称"
            prop="basicInfo.name"
            style="margin-bottom: 0"
          >
            <el-input
              v-model="certificateForm.basicInfo.name"
              placeholder="请输入证书名称"
              :maxlength="12"
              show-word-limit
            />
            <p class="tip">仅用于证书管理，不展示在证书上</p>
          </el-form-item>

          <el-form-item label="证书类型">
            <el-select
              v-model="certificateForm.basicInfo.type"
              placeholder="请选择证书类型"
            >
              <el-option label="班级证书" :value="1" />
            </el-select>
          </el-form-item>

          <el-form-item
            class="certificate-content"
            label="关联内容"
            prop="basicInfo.scheduleId"
          >
            <el-button
              type="primary"
              size="small"
              :disabled="
                (type === 'edit' || type === 'create') && disabledAddContent
              "
              @click="handleAddContent"
            >
              关联班级
            </el-button>
            <div v-if="associatedContent.chapterCount" class="selected-class">
              <div class="selected-class-info">
                <p class="selected-class-name">{{ associatedContent.name }}</p>
                <p class="selected-class-number">
                  {{ associatedContent.chapterCount }}节
                </p>
                <p class="selected-class-time">
                  创建时间: {{ formattedCreateTime }}
                </p>
              </div>
              <i
                v-if="
                  (type !== 'edit' && type !== 'create') && !disabledAddContent
                "
                class="el-icon-close close"
                @click="handleRemoveContent"
              />
            </div>
          </el-form-item>

          <!-- 发放规则 -->
          <div class="title">发放规则</div>

          <el-form-item label="发放条件">
            <el-radio-group v-model="certificateForm.rule.conditionType">
              <el-radio :label="1">完成课程所有任务</el-radio>
              <el-radio
                :label="2"
                :disabled="!associatedContent.chapterCount"
              >完成阶段性任务</el-radio>
            </el-radio-group>

            <div
              v-if="certificateForm.rule.conditionType === 2"
              class="condition-task"
            >
              <span>阶段性任务条件</span>

              <el-checkbox v-model="isFinishContentCountComputed">
                内容完成数 >=
                <el-input
                  v-model="certificateForm.rule.finishContentCount"
                  style="width: 200px; margin: 0 10px"
                  placeholder="请输入内容完成数"
                  @input="handleFinishContentCountInput"
                />
                当前班级图片、视频、直播内容总数{{
                  associatedContent.chapterCount - associatedContent.taskCount
                }}
              </el-checkbox>
              <el-checkbox v-model="isPunchCountComputed">
                打卡总次数 >=
                <el-input
                  v-model="certificateForm.rule.punchCount"
                  style="width: 200px; margin: 0 10px"
                  placeholder="请输入打卡总次数"
                  @input="handlePunchCountInput"
                />
                当前班级打卡任务总数{{ associatedContent.taskCount }}
              </el-checkbox>
            </div>
          </el-form-item>

          <el-form-item label="发放时间">
            <el-radio-group v-model="certificateForm.rule.conditionTime">
              <el-radio :label="1">满足条件立即发放</el-radio>
            </el-radio-group>
          </el-form-item>

          <!-- 证书样式 -->
          <div class="title">证书样式</div>

          <el-form-item label="证书背景图">
            <div class="style-background">
              <div
                v-for="item in certificateBackgrounds"
                :key="item.id"
                class="style-background-img"
                :class="{
                  'style-background-img-active':
                    currentBackgroundImageId === item.id
                }"
                @click="
                  handleSelectBackground(item.imageUrl, item.id, item.imageType)
                "
              >
                <img :src="item.imageUrl" />
              </div>
            </div>
          </el-form-item>

          <!-- 证书信息 -->
          <div class="title">证书信息</div>

          <el-form-item label="证书标题">
            <el-input
              v-model="certificateForm.info.title"
              placeholder="请输入证书标题"
              maxlength="12"
              show-word-limit
            />
          </el-form-item>

          <el-form-item label="完成文案" style="position: relative">
            <AppEditor
              ref="AppEditor"
              v-model="certificateForm.info.content"
              :maximum-words="45"
              :show-word-count="true"
              :editor-config="{
                menus: ['bold', 'fontSize', 'foreColor']
              }"
              :default-style="{
                fontSize: '12px',
                isBold: true
              }"
              @change="handleChangeContent"
            />
          </el-form-item>

          <el-form-item label="课程名称">
            <el-radio-group v-model="certificateForm.info.showCourseTitle">
              <el-radio :label="1">展示</el-radio>
              <el-radio :label="0">隐藏</el-radio>
            </el-radio-group>

            <div
              v-if="certificateForm.info.showCourseTitle === 1"
              class="course-name-input"
            >
              <span>名称显示为: </span>
              <el-radio-group
                v-model="certificateForm.info.courseTitleType"
                class="course-name-input-radio-group"
                @change="handleChangeCourseTitleType"
              >
                <el-radio :label="1">与原课程一致</el-radio>
                <el-radio :label="2">自定义</el-radio>
                <el-input
                  v-model="certificateForm.info.customTitle"
                  placeholder="请输入课程名称"
                  maxlength="12"
                  show-word-limit
                  :disabled="
                    !(
                      certificateForm.info.showCourseTitle === 1 &&
                      certificateForm.info.courseTitleType === 2
                    )
                  "
                />
              </el-radio-group>
            </div>
          </el-form-item>

          <el-form-item label="课程数据">
            <el-checkbox v-model="finishTaskComputed">完成任务</el-checkbox>
            <el-checkbox v-model="finishPunchComputed">完成打卡</el-checkbox>
            <el-checkbox v-model="finishCourseComputed">完成课程</el-checkbox>
          </el-form-item>

          <el-form-item label="鼓励文案" style="position: relative">
            <AppEditor
              ref="AppEditor"
              v-model="certificateForm.info.encourageContent"
              :maximum-words="45"
              :show-word-count="true"
              :editor-config="{
                menus: ['bold', 'fontSize', 'foreColor']
              }"
              :default-style="{
                fontSize: '12px',
                isBold: true
              }"
              @change="handleChangeEncourageContent"
            />
          </el-form-item>

          <!-- 发证信息 -->
          <div class="title">发证信息</div>

          <el-form-item label="发证机构">
            <el-input
              v-model="certificateForm.issueInfo.certificateTenant"
              placeholder="请输入发证机构"
              :maxlength="20"
              show-word-limit
            />
          </el-form-item>

          <el-form-item label="发证日期">
            <el-radio-group v-model="certificateForm.issueInfo.showTime">
              <el-radio :label="1">展示</el-radio>
              <el-radio :label="0">隐藏</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="证书编号">
            <el-radio-group
              v-model="certificateForm.issueInfo.certificateNumber"
            >
              <el-radio :label="1">系统随机</el-radio>
              <el-radio :label="0">隐藏</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="发证印章">
            <UploadFileComp
              title="上传印章图"
              tip="建议尺寸 750*750px 或 1:1，支持 png 格式，大小不超过 1MB。"
              :limit="imageFormatLimits"
              :echo-url="certificateForm.issueInfo.seal"
              @uploadFile="handleUploadSealFile"
              @cancelUploadImage="handleCancelUploadImage"
            />
          </el-form-item>

          <!-- 证书分享 -->
          <div class="title">证书分享</div>

          <el-form-item label="分享语">
            <el-input
              v-model="certificateForm.share.shareContent"
              placeholder="请输入分享语"
              :maxlength="16"
              show-word-limit
            />
          </el-form-item>

          <el-form-item label="二维码" style="margin-bottom: 0">
            <el-radio-group v-model="certificateForm.share.showQrCode">
              <el-radio :label="1">展示</el-radio>
              <el-radio :label="0">隐藏</el-radio>
            </el-radio-group>

            <div
              v-if="certificateForm.share.showQrCode === 1"
              class="qr-code-input"
              style="
                flex-direction: column;
                align-items: flex-start;
                gap: 10px;
                overflow-x: auto;
              "
            >
              <div style="display: flex; align-items: center">
                <span>二维码设置: </span>
                <el-radio-group
                  v-model="certificateForm.share.qrCodeSetting"
                  class="qr-code-input-radio-group"
                  @change="handleChangeQrCodeSetting"
                >
                  <el-radio :label="1">跳转到当前班级学习页</el-radio>
                  <el-radio :label="2">跳转到店铺首页</el-radio>
                  <el-radio :label="3">自定义二维码</el-radio>
                </el-radio-group>
              </div>

              <div
                v-if="
                  certificateForm.share.qrCodeSetting === 1 ||
                    certificateForm.share.qrCodeSetting === 2
                "
                style="display: flex; align-items: center; width: 100%"
              >
                <span>引导文案: </span>
                <el-input
                  v-model="certificateForm.share.guidanceContent"
                  placeholder="请输入引导文案"
                  :maxlength="8"
                  show-word-limit
                  style="width: 100%"
                />
              </div>

              <div
                v-if="certificateForm.share.qrCodeSetting === 3"
                style="display: flex; align-items: center; width: 100%"
              >
                <div
                  style="
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                    width: 100%;
                  "
                >
                  <UploadFileComp
                    title="上传二维码"
                    tip="建议比例 1:1，支持 jpg、jpeg、png 格式，大小不超过 1MB，最佳分辨率 750*750px。"
                    :limit="qrCodeFormatLimits"
                    :echo-url="certificateForm.share.customQrCode"
                    @uploadFile="handleUploadQrCode"
                    @cancelUploadImage="handleCancelUploadQrCode"
                  />
                  <div style="display: flex; align-items: center; width: 100%">
                    <span>引导文案: </span>
                    <el-input
                      v-model="certificateForm.share.guidanceContent"
                      placeholder="请输入引导文案"
                      :maxlength="8"
                      show-word-limit
                      style="width: 100%"
                    />
                  </div>
                </div>
              </div>
            </div>
          </el-form-item>
        </el-form>

        <div class="certificate-preview">
          <div>
            <div class="certificate-preview-label">预览</div>

            <!-- 横版证书 -->
            <HorizontalCertificate
              v-if="certificateForm.style.imageType === 1"
              id="horizontalCertificate"
              :key="JSON.stringify(certificateForm)"
              :certificate-form="certificateForm"
              :display-obj="{
                isShowFinishTask: finishTaskComputed,
                isShowFinishPunch: finishPunchComputed,
                isShowFinishCourse: finishCourseComputed
              }"
            />

            <!-- 竖版证书 -->
            <VerticalCertificate
              v-else
              id="verticalCertificate"
              :key="JSON.stringify(certificateForm)"
              :certificate-form="certificateForm"
              :display-obj="{
                isShowFinishTask: finishTaskComputed,
                isShowFinishPunch: finishPunchComputed,
                isShowFinishCourse: finishCourseComputed
              }"
            />
          </div>
        </div>
      </div>
    </div>

    <div class="certificate-drawer-footer">
      <el-button
        type="primary"
        size="small"
        :loading="loading"
        @click="handleSave"
      >保存</el-button>
    </div>

    <AssociatedClassDialog
      ref="AssociatedClassDialogRef"
      :visible.sync="associatedClassDialogVisible"
      :schedule-id="certificateForm.basicInfo.scheduleId"
      :class-name="associatedClassName"
      :associated-class-type="associatedClassType"
      @confirm="handleConfirm"
    />
  </el-drawer>
</template>

<script>
import AppEditor from '@/components/AppEditor'
import UploadFileComp from './UploadFileComp.vue'
import AssociatedClassDialog from './AssociatedClassDialog'
import HorizontalCertificate from './HorizontalCertificate'
import VerticalCertificate from './VerticalCertificate'
import { imageFormatLimits, qrCodeFormatLimits } from './fileLimits.config'
import { getCertificateBgList } from '@/api/certificate'
import html2canvas from 'html2canvas'
import OSS from 'ali-oss'
import { getOssConfig } from '@/api/file'
import { v4 as uuidv4 } from 'uuid'
import { getItem } from '@/utils/localStorage'
const orgInfo = getItem('orgInfo')

export default {
  name: 'CertificateDrawer',
  components: {
    AppEditor,
    UploadFileComp,
    AssociatedClassDialog,
    HorizontalCertificate,
    VerticalCertificate
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: 'create'
    },
    className: {
      type: String,
      default: ''
    },
    associatedClassType: {
      type: String,
      default: 'edit'
    },
    courseNameList: {
      type: Array,
      default: () => []
    },
    disabledAddContent: {
      type: Boolean,
      default: true
    }
  },
  data() {
    // 验证finishContentCount
    const validateFinishContentCount = (rule, value, callback) => {
      if (this.certificateForm.rule.isFinishContentCount === 1) {
        if (!value) {
          callback(new Error('请输入内容完成数'))
        } else if (!/^\d+$/.test(value) || value < 0) {
          callback(new Error('请输入大于等于0的正整数'))
        } else if (
          value >
          this.associatedContent.chapterCount - this.associatedContent.taskCount
        ) {
          callback(
            new Error(
              `不能大于当前班级图片、视频、直播内容总数${
                this.associatedContent.chapterCount -
                this.associatedContent.taskCount
              }`
            )
          )
        } else {
          callback()
        }
      } else {
        callback()
      }
    }

    // 验证punchCount
    const validatePunchCount = (rule, value, callback) => {
      if (this.certificateForm.rule.isFinishPunchCount === 1) {
        if (!value) {
          callback(new Error('请输入打卡总次数'))
        } else if (!/^\d+$/.test(value) || value < 0) {
          callback(new Error('请输入大于等于0的正整数'))
        } else if (value > this.associatedContent.taskCount) {
          callback(
            new Error(
              `不能大于当前班级打卡任务总数${this.associatedContent.taskCount}`
            )
          )
        } else {
          callback()
        }
      } else {
        callback()
      }
    }

    return {
      imageFormatLimits,
      qrCodeFormatLimits,
      // 阿里云oss
      client: null,
      // ossConfig
      ossConfig: {},
      associatedClassDialogVisible: false,
      // 证书背景图片
      certificateBackgrounds: [],
      currentBackgroundImageId: '6',
      // 证书表单
      certificateForm: {
        id: undefined,
        // 新增证书
        createCertificate: {
          status: true
        },
        // 基础信息
        basicInfo: {
          name: '',
          type: 1,
          scheduleId: ''
        },
        // 发放规则
        rule: {
          conditionType: 1,
          conditionTime: 1,
          isFinishContentCount: 0,
          isFinishPunchCount: 0,
          finishContentCount: '',
          punchCount: ''
        },
        // 证书样式
        style: {
          backgroundImage: '',
          imageType: 1
        },
        // 证书信息
        info: {
          title: '结课证书',
          content: '恭喜你完成课程',
          showCourseTitle: 1,
          courseTitleType: 1,
          customTitle: '',
          finishCourse: 1,
          finishPunch: 1,
          finishTask: 1,
          encourageContent: '对知识点掌握得很棒，继续加油！'
        },
        // 发证信息
        issueInfo: {
          certificateTenant: orgInfo.name,
          showTime: 1,
          certificateNumber: 1,
          seal: ''
        },
        // 证书分享
        share: {
          shareContent: '名师课程等你来看',
          showQrCode: 1,
          qrCodeSetting: 1,
          guidanceContent: '长按识别二维码',
          customQrCode: ''
        }
      },
      // 证书表单验证
      certificateFormRules: {
        'createCertificate.status': [
          { required: true, message: '请选择证书状态', trigger: 'change' }
        ],
        'basicInfo.name': [
          { required: true, message: '请输入证书名称', trigger: 'blur' }
        ],

        'basicInfo.scheduleId': [
          { required: true, message: '请选择关联内容', trigger: 'change' }
        ],
        'rule.finishContentCount': [
          { validator: validateFinishContentCount, trigger: 'change' }
        ],
        'rule.punchCount': [
          { validator: validatePunchCount, trigger: 'change' }
        ]
      },
      // 关联内容
      associatedContent: {},
      associatedClassName: '',
      loading: false
    }
  },
  computed: {
    compTitle() {
      if (this.type === 'create') {
        return '新增证书'
      } else if (this.type === 'edit') {
        return '编辑证书'
      } else if (this.type === 'copy') {
        return '复制证书'
      }
      return ''
    },
    isFinishContentCountComputed: {
      get() {
        return this.certificateForm.rule.isFinishContentCount === 1
      },
      set(value) {
        this.certificateForm.rule.isFinishContentCount = value ? 1 : 0
      }
    },
    // 完成打卡
    isPunchCountComputed: {
      get() {
        return this.certificateForm.rule.isFinishPunchCount === 1
      },
      set(value) {
        this.certificateForm.rule.isFinishPunchCount = value ? 1 : 0
      }
    },
    // 完成任务
    finishTaskComputed: {
      get() {
        return this.certificateForm.info.finishTask === 1
      },
      set(value) {
        this.certificateForm.info.finishTask = value ? 1 : 0
      }
    },
    // 完成打卡
    finishPunchComputed: {
      get() {
        return this.certificateForm.info.finishPunch === 1
      },
      set(value) {
        this.certificateForm.info.finishPunch = value ? 1 : 0
      }
    },
    // 完成课程
    finishCourseComputed: {
      get() {
        return this.certificateForm.info.finishCourse === 1
      },
      set(value) {
        this.certificateForm.info.finishCourse = value ? 1 : 0
      }
    },
    formattedCreateTime() {
      if (!this.associatedContent.createTime) return ''
      const date = new Date(this.associatedContent.createTime)
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      const hours = String(date.getHours()).padStart(2, '0')
      const minutes = String(date.getMinutes()).padStart(2, '0')
      const seconds = String(date.getSeconds()).padStart(2, '0')
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
    }
  },
  watch: {
    visible: {
      async handler(newVal) {
        if (newVal) {
          const res = await getCertificateBgList()
          this.certificateBackgrounds = res.data.records
          this.currentBackgroundImageId =
            this.certificateBackgrounds.find(
              item =>
                item?.imageUrl === this.certificateForm.style.backgroundImage
            )?.id ?? '6'
          this.handleSelectBackground(
            this.certificateBackgrounds[+this.currentBackgroundImageId - 1]
              .imageUrl,
            this.currentBackgroundImageId,
            this.certificateBackgrounds[+this.currentBackgroundImageId - 1]
              .imageType
          )
          this.setOssConfig()
          this.$nextTick(() => {
            this.handleResize()
          })
        }
      }
    },
    // 监听 isFinishContentCount 变化,触发验证
    'certificateForm.rule.isFinishContentCount'() {
      this.$nextTick(() => {
        this.$refs.certificateFormRef?.validateField('rule.finishContentCount')
      })
    },
    // 监听 isFinishPunchCount 变化,触发验证
    'certificateForm.rule.isFinishPunchCount'() {
      this.$nextTick(() => {
        this.$refs.certificateFormRef?.validateField('rule.punchCount')
      })
    },
    // 监听证书类型变化
    'certificateForm.style.imageType': {
      handler() {
        this.$nextTick(() => {
          this.handleResize()
        })
      }
    },
    // 监听证书表单的变化
    certificateForm: {
      deep: true,
      handler() {
        this.$nextTick(() => {
          this.handleResize()
        })
      }
    }
  },
  async mounted() {
    // 等待下一个 tick,确保 DOM 已渲染
    await this.$nextTick()

    // 预加载背景图
    if (this.certificateForm.style.backgroundImage) {
      await this.preloadImage(this.certificateForm.style.backgroundImage)
    }

    // 延迟执行 resize 以确保组件完全渲染
    setTimeout(() => {
      this.handleResize()
      window.addEventListener('resize', this.handleResize)
    }, 100)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize)
  },
  methods: {
    // 获取oss配置
    getOssConfig,
    // 设置ossConfig
    async setOssConfig() {
      const { code, data } = await getOssConfig()

      if (code === 1) {
        this.ossConfig = {
          region: 'oss-accelerate',
          accessKeyId: data.accessKeyId,
          accessKeySecret: data.accessKeySecret,
          secure: true,
          bucket: data.ossBucket,
          ossBucketUrl: data.ossBucketUrl,
          ossEndPoint: data.ossEndPoint
        }

        this.client = new OSS(this.ossConfig)
      } else {
        this.$message({
          message: data.msg,
          type: 'warning'
        })
      }
    },
    handleResize() {
      this.$nextTick(() => {
        const previewBox = document.querySelector('.certificate-preview-box')
        const container = document.querySelector('.certificate-preview')

        if (!previewBox || !container) return

        // 获取容器的实际尺寸（不包含padding）
        const containerRect = container.getBoundingClientRect()

        // 获取预览框的尺寸
        const previewBoxWidth = previewBox.offsetWidth
        const previewBoxHeight = previewBox.offsetHeight

        // 计算可用空间（考虑标题高度）
        const availableWidth = containerRect.width
        const availableHeight = containerRect.height - 40 // 减去标题高度

        // 计算缩放比例
        const scaleX = availableWidth / previewBoxWidth
        const scaleY = availableHeight / previewBoxHeight

        let scale
        if (this.certificateForm.style.imageType === 1) {
          // 横版：保持宽高比
          scale = Math.min(scaleX, scaleY) * 0.85 // 缩小以留出更多边距
        } else {
          // 竖版：需要考虑整体显示
          scale = Math.min(scaleX, scaleY) * 0.8 // 额外缩小以留出更多边距
        }

        // 计算缩放后的尺寸
        const scaledWidth = previewBoxWidth * scale
        const scaledHeight = previewBoxHeight * scale

        // 计算居中位置
        const translateX = (availableWidth - scaledWidth) / 2
        const translateY = (availableHeight - scaledHeight) / 2

        // 直接应用变换
        if (previewBox) {
          previewBox.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`
        }
      })
    },
    // 关闭
    handleClose() {
      this.$emit('update:visible', false)
      this.resetData()
    },
    resetData() {
      Object.assign(this.$data, this.$options.data.call(this))
    },
    // Base64转File
    dataURLtoFile(dataurl, filename) {
      const arr = dataurl.split(',')
      const mime = arr[0].match(/:(.*?);/)[1]
      const bstr = atob(arr[1])
      let n = bstr.length
      const u8arr = new Uint8Array(n)
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
      }
      return new File([u8arr], filename, { type: mime })
    },
    async uploadOSS(file) {
      const options = {
        meta: { temp: 'demo' },
        mime: 'json',
        headers: { 'Content-Type': 'text/plain' }
      }

      const fileUuid = uuidv4()
      const fileName = file.name
      const fileExtension = fileName.split('.').pop()
      const date = new Date()
      const year = date.getFullYear()
      const month = date.getMonth() + 1
      const day = date.getDate()

      const uploadFileName = `/file/certificates/${year}/${month}/${day}/${fileUuid}.${fileExtension}`

      const { url } = await this.client.put(uploadFileName, file, options)

      return url
    },
    async generateCertificateImage() {
      try {
        const element = document.getElementById(
          this.certificateForm.style.imageType === 1
            ? 'horizontalCertificate'
            : 'verticalCertificate'
        )

        // 创建临时容器
        const tempContainer = document.createElement('div')
        tempContainer.style.position = 'absolute'
        tempContainer.style.left = '-9999px'
        tempContainer.style.top = '0'
        tempContainer.style.width = element.offsetWidth + 'px'
        tempContainer.style.height = element.offsetHeight + 'px'
        document.body.appendChild(tempContainer)

        // 克隆证书元素到临时容器
        const clone = element.cloneNode(true)
        tempContainer.appendChild(clone)

        // 预加载背景图
        await this.preloadImage(this.certificateForm.style.backgroundImage)

        // 等待所有图片加载完成
        const images = [...clone.getElementsByTagName('img')]
        await Promise.all(
          images.map(img => {
            return new Promise((resolve, reject) => {
              const newImg = new Image()
              newImg.crossOrigin = 'anonymous'

              newImg.onload = () => {
                // 加载成功后,将新图片的属性复制到原图片
                img.crossOrigin = 'anonymous'
                img.src = newImg.src
                img.width = newImg.naturalWidth
                img.height = newImg.naturalHeight
                resolve()
              }

              newImg.onerror = () =>
                reject(new Error(`Failed to load image: ${img.src}`))
              newImg.src = img.src
            })
          })
        )

        // 设置克隆元素样式
        clone.style.width = element.offsetWidth + 'px'
        clone.style.height = element.offsetHeight + 'px'
        clone.style.transform = 'none'
        clone.style.position = 'relative'
        clone.style.backgroundImage = `url(${this.certificateForm.style.backgroundImage})`
        clone.style.backgroundSize = 'contain'
        clone.style.backgroundRepeat = 'no-repeat'
        clone.style.backgroundPosition = 'center'

        // 等待一帧以确保样式已应用
        await new Promise(resolve => requestAnimationFrame(resolve))

        // 生成canvas
        const canvas = await html2canvas(clone, {
          useCORS: true,
          allowTaint: true,
          scale: 2,
          backgroundColor: null,
          logging: false,
          width: element.offsetWidth,
          height: element.offsetHeight,
          imageTimeout: 0, // 禁用图片加载超时
          onclone: (_, clonedElement) => {
            const clonedImages = clonedElement.getElementsByTagName('img')
            for (const img of clonedImages) {
              img.crossOrigin = 'anonymous'
              // 确保图片尺寸正确
              if (img.naturalWidth && img.naturalHeight) {
                img.width = img.naturalWidth + 'px'
                img.height = img.naturalHeight + 'px'
              }
            }
          }
        })

        // 清理临时容器
        document.body.removeChild(tempContainer)

        // 转换为base64,使用最高质量
        const imgData = canvas.toDataURL('image/png', 1.0)
        console.log(imgData, `imgData`)

        // 转换为文件对象
        const filename = `certificate_${Date.now()}.png`
        const file = this.dataURLtoFile(imgData, filename)

        console.log(file, `file`)
        // 上传到OSS
        const previewImage = await this.uploadOSS(file)
        return previewImage
      } catch (error) {
        console.error('生成证书图片失败:', error)
        throw error
      }
    },
    async handleSave() {
      const valid = await this.$refs.certificateFormRef.validate()
      if (!valid) return

      this.loading = true
      try {
        const previewImage = await this.generateCertificateImage()
        if (!previewImage) {
          this.$message.error('生成证书图片失败')
          return
        }

        const {
          id,
          createCertificate,
          basicInfo,
          rule,
          style,
          info,
          issueInfo,
          share
        } = this.certificateForm

        const flattenForm = {
          id,
          status: createCertificate.status ? 1 : 0,
          ...basicInfo,
          ...rule,
          ...style,
          ...info,
          ...issueInfo,
          ...share,
          previewImage
        }
        this.$emit('save', flattenForm, this.type)
      } catch (error) {
        this.$message.error('保存证书失败')
      } finally {
        this.loading = false
      }
    },
    // 添加内容
    handleAddContent() {
      if (this.associatedClassType === 'copy' || this.type === 'create') {
        this.certificateForm.basicInfo.scheduleId = ''
      }
      this.associatedClassDialogVisible = true
      this.associatedClassName = this.className
      this.$refs.AssociatedClassDialogRef.selectedClassId =
        this.associatedContent.id
    },
    // 删除内容
    handleRemoveContent() {
      if (this.associatedClassType === 'copy' || this.type === 'create') {
        this.certificateForm.basicInfo.scheduleId = ''
      }
      this.associatedContent = {}
      this.$refs.AssociatedClassDialogRef.selectedClassId = ''
    },
    // 完成文案
    handleChangeContent(value) {
      this.certificateForm.info.content = value
    },
    // 鼓励文案
    handleChangeEncourageContent(value) {
      this.certificateForm.info.encourageContent = value
    },
    // 课程名称
    handleChangeCourseTitleType(value) {
      if (value === 1) {
        this.certificateForm.info.customTitle = ''
      }
    },
    // 上传印章
    handleUploadSealFile(fileUrl) {
      this.certificateForm.issueInfo.seal = fileUrl
    },
    // 取消上传印章
    handleCancelUploadImage() {
      this.certificateForm.issueInfo.seal = ''
    },
    // 二维码设置
    handleChangeQrCodeSetting(value) {
      this.certificateForm.share.qrCodeSetting = value
      this.handleCancelUploadQrCode()
      this.certificateForm.share.guidanceContent = '长按识别二维码'
    },
    // 上传二维码
    handleUploadQrCode(fileUrl) {
      this.certificateForm.share.customQrCode = fileUrl
    },
    // 取消上传二维码
    handleCancelUploadQrCode() {
      this.certificateForm.share.customQrCode = ''
    },
    // 选择背景
    async handleSelectBackground(imageUrl, id, imageType) {
      this.currentBackgroundImageId = id
      this.certificateForm.style.backgroundImage = imageUrl
      this.certificateForm.style.imageType = imageType

      // 预加载新选择的背景图
      await this.preloadImage(imageUrl)

      // 强制在下一个渲染周期重新计算位置
      this.$nextTick(() => {
        this.handleResize()
      })
    },
    // 确认选择班级
    async handleConfirm(row) {
      this.associatedContent = row
      this.certificateForm.basicInfo.scheduleId = row.id
    },
    // 预加载图片
    preloadImage(src) {
      return new Promise((resolve, reject) => {
        const img = new Image()
        img.crossOrigin = 'anonymous'
        img.onload = () => resolve(img)
        img.onerror = reject
        img.src = src
      })
    },
    // 处理内容完成数输入
    handleFinishContentCountInput(value) {
      if (value === '') {
        this.certificateForm.rule.finishContentCount = ''
        return
      }

      // 移除非数字字符
      let newValue = value.replace(/[^0-9]/g, '')
      if (newValue === '') {
        this.certificateForm.rule.finishContentCount = ''
        return
      }

      // 转换为数字并限制范围
      const maxValue =
        this.associatedContent.chapterCount -
          this.associatedContent.taskCount || 0
      newValue = Math.min(Math.max(parseInt(newValue) || 0, 0), maxValue)

      this.certificateForm.rule.finishContentCount = newValue.toString()
    },
    // 处理打卡次数输入
    handlePunchCountInput(value) {
      if (value === '') {
        this.certificateForm.rule.punchCount = ''
        return
      }

      // 移除非数字字符
      let newValue = value.replace(/[^0-9]/g, '')
      if (newValue === '') {
        this.certificateForm.rule.punchCount = ''
        return
      }

      // 转换为数字并限制范围
      const maxValue = this.associatedContent.taskCount || 0
      newValue = Math.min(Math.max(parseInt(newValue) || 0, 0), maxValue)

      this.certificateForm.rule.punchCount = newValue.toString()
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep {
  .el-input__inner {
    height: 30px !important;
    line-height: 30px !important;
    color: #000000;
  }

  .el-radio__label {
    font-weight: 400 !important;
    color: #000000;
  }

  .editor {
    max-width: none !important;
  }

  .editor .text {
    min-height: 100px !important;
  }

  .el-form-item__error {
    top: 60%;
    text-align: right;
    right: 0 !important;
  }

  .certificate-content .el-form-item__error {
    top: -70%;
    text-align: right;
    right: 0 !important;
  }

  .certificate-status .el-form-item__label {
    padding-bottom: 0 !important;
  }

  .certificate-status .el-form-item__content {
    flex: 1;
  }
}

.certificate-drawer-wrapper {
  display: flex;
  flex-direction: column;

  .ss-material-box-header {
    display: flex;
    align-items: center;
    box-sizing: border-box;
    height: 52px;
    padding: 15px 20px;
    background: #ffffff;
    border-radius: 2px 2px 0 0;
    border-bottom: 1px solid #f2f2f2;
    color: #353535;
    font-size: 16px;
    font-weight: bold;
    .ss-material-box-header-title {
      text-overflow: -o-ellipsis-lastline;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      line-clamp: 1;
      -webkit-box-orient: vertical;
    }
  }
  .close {
    color: #b2b2b2;
    margin-left: auto;
    cursor: pointer;
    &:hover {
      color: #409eff;
    }
  }

  .certificate-drawer-form-wrapper {
    display: flex;
    align-items: flex-start;
    height: calc(100vh - 120px);
    overflow-y: auto;

    .certificate-drawer-form {
      display: flex;
      flex-direction: column;
      height: 100%;
      padding: 15px 20px;
      width: 60%;
      overflow-y: auto;

      .form-item {
        margin-bottom: 10px !important;
      }

      .title {
        font-size: 14px;
        font-weight: 600;
        color: #000000;
        border-left: 2px solid #0c6fff;
        padding-left: 8px;
        line-height: 12px;
        margin-bottom: 20px;
        margin-top: 10px;
      }

      .certificate-status {
        display: flex;
        align-items: center;
      }

      .tip {
        font-size: 12px;
        color: #999999;
        line-height: 30px;
      }

      .selected-class {
        display: flex;
        align-items: center;
        justify-content: space-between;
        background-color: #f5f5f5;
        border-radius: 6px;
        padding: 5px 8px;
        margin-top: 10px;
        position: relative;

        .selected-class-img {
          width: 84px;
          height: 84px;
          background: red;
          border-radius: 6px;
        }

        .selected-class-info {
          flex: 1;
          margin-left: 10px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;

          p {
            line-height: 30px;
          }

          .selected-class-name {
            font-size: 14px;
            color: #000000;
            font-weight: 600;
          }

          .selected-class-number {
            font-size: 14px;
            color: #777777;
          }

          .selected-class-time {
            font-size: 14px;
            color: #777777;
          }
        }

        .close {
          position: absolute;
          right: 20px;
          top: 8px;
          color: #777777;
          cursor: pointer;
          &:hover {
            color: #409eff;
          }
        }
      }

      .el-form-item {
        margin-bottom: 10px;

        // 非必填项的父元素样式
        &:not(.is-required) {
          ::v-deep .el-form-item__label {
            padding: 0 0 8px 10px;
            line-height: 1.5;
            color: #000000;
          }
        }

        // 必填项的父元素样式
        &.is-required {
          ::v-deep .el-form-item__label {
            padding: 0 0 8px;
            line-height: 1.5;
            color: #000000;
          }
        }

        ::v-deep .el-form-item__content {
          width: 100%;
          padding-left: 10px;

          .el-input {
            width: 100%;
          }
        }
      }

      .condition-task {
        display: flex;
        flex-direction: column;
        gap: 15px;
        padding: 10px 15px;
        background-color: #f5f5f5;
        border-radius: 6px;
        overflow-x: auto;

        span {
          font-size: 14px;
          color: #000000;
          font-weight: 400;
          line-height: 20px;
        }
      }

      .style-background {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        width: 100%;
        background-color: #f5f5f5;
        border-radius: 6px;
        padding: 10px;

        .style-background-img {
          width: calc((100% - 30px) / 3);
          aspect-ratio: 16/9;
          background: #ffffff;
          padding: 8px;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.3s;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid transparent;

          img {
            width: 100%;
            height: 100%;
            object-fit: contain;
          }

          &:hover {
            transform: scale(1.02);
            box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
          }
        }

        .style-background-img-active {
          border: 2px solid #0c6fff;
        }
      }

      .course-name-input,
      .qr-code-input {
        display: flex;
        align-items: center;
        margin-top: 10px;
        padding: 0 15px;
        border-radius: 6px;
        background-color: #f5f5f5;
        overflow-x: auto;

        span {
          width: 100px;
        }

        .course-name-input-radio-group,
        .qr-code-input-radio-group {
          width: 100%;
          display: flex;
          align-items: center;
        }
      }
    }

    .certificate-preview {
      position: sticky;
      top: 0;
      display: flex;
      flex-direction: column;
      width: 40%;
      height: calc(100vh - 52px - 60px);
      background: #ffffff;
      overflow: hidden;

      > div {
        width: 100%;
        height: 100%;
        position: relative;
        display: flex;
        flex-direction: column;
      }

      .certificate-preview-label {
        font-size: 14px;
        font-weight: 400;
        color: #000000;
        margin: 20px;
        flex-shrink: 0;
      }
    }
  }
}

.certificate-drawer-footer {
  width: 80vw;
  position: fixed;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 15px 30px;
  z-index: 10;
  border-top: 1px solid #f2f2f2;
  background-color: #fff;
}

// 添加loading样式覆盖
::v-deep {
  .el-loading-mask {
    background-color: rgba(255, 255, 255, 0.9);
  }
}

.certificate-preview-box {
  position: absolute;
  transform-origin: top left;
  will-change: transform;
  top: 20px;
}
</style>
