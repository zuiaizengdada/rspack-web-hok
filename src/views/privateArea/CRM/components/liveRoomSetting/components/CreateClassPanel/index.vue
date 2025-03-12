<template>
  <div class="create-class-panel">
    <div class="live-room-setting-form">
      <el-form
        ref="classFormRef"
        :model="classForm"
        :rules="classRules"
        label-width="110px"
        label-position="left"
      >
        <el-form-item label="班级名称" prop="className">
          <el-input
            v-model="classForm.className"
            class="class-name-input"
            placeholder="请输入班级名称"
            style="width: 447px"
            :disabled="(type === 'edit' || type === 'detail') && !isClassType"
            maxlength="50"
            show-word-limit
          />
        </el-form-item>

        <el-form-item
          class="course-select-box"
          label="课程名称"
          prop="goodsIdList"
          style="margin-bottom: 10px"
        >
          <div class="course-select-box-wrapper">
            <div
              v-for="(item, index) in configData.goodsName"
              v-show="!configData.goodsNameInput"
              :key="index"
              class="course-select-box-content"
            >
              <span>
                {{ item }}
              </span>
            </div>
            <CourseSelect
              v-show="configData.goodsNameInput"
              ref="CourseSelect"
              class="course-select-box-wrapper"
              :multiple="true"
              current-id="10"
              :tab-list="[{ id: '10', name: '直播课', api: '' }]"
              :params="{ shelveFlag: '' }"
              style="width: 200px"
              :default-id="configData.classForm.goodsIdList"
              :default-list="configData.classForm.goodsNameVoList"
              :tearch-search="true"
              :value="classForm.goodsNameList"
              :material-id-list="configData.classForm.goodsIdList"
              @handleSelected="courseSelect"
            />
          </div>

          <p>课程讲师必须完全相同,且为直播课程</p>
        </el-form-item>

        <el-form-item label="开班时间" prop="classOpeningTime">
          <el-date-picker
            v-model="classForm.classOpeningTime"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            style="width: 447px"
            placeholder="请选择开班时间"
            :picker-options="pickerOptions"
            :disabled="type === 'edit' || type === 'detail' || openTimeDisabled"
            @change="handleOpeningTimeChange"
          />
        </el-form-item>

        <el-form-item label="计划班级人数" prop="capacityQuantity">
          <el-input
            v-model="classForm.capacityQuantity"
            type="text"
            style="width: 447px"
            placeholder="请输入班级人数"
            :disabled="type === 'edit' || type === 'detail'"
            @input="
              value => {
                // 移除非数字字符
                const num = value.replace(/[^\d]/g, '')
                // 限制最大值为9999999
                classForm.capacityQuantity = num
                  ? Math.min(parseInt(num), 9999999)
                  : ''
              }
            "
            @blur="
              () => {
                // 失焦时如果为空或0，设为1
                if (!classForm.capacityQuantity) {
                  classForm.capacityQuantity = 1
                }
              }
            "
          />
        </el-form-item>

        <el-form-item
          class="unlock-type-radio-box"
          label="解锁方式"
          prop="courseUnlockType"
        >
          <el-radio-group
            v-model="classForm.courseUnlockType"
            class="unlock-type-radio"
            :disabled="(type === 'edit' || type === 'detail') && !isClassType"
            @change="handleUnlockTypeChange"
          >
            <el-radio :label="1" class="unlock-type-radio-item">
              <span class="radio-label">自由模式</span>
              <span class="radio-desc">学员可以学习任何一节课</span>
            </el-radio>
            <el-radio :label="2" class="unlock-type-radio-item">
              <span class="radio-label">闯关模式</span>
              <span class="radio-desc">完成小节时自动解锁下一小节</span>
              <el-button
                type="text"
                style="padding: 0 !important"
                :disabled="
                  classForm.courseUnlockType !== 2 || type === 'detail'
                "
                @click="handleSettingRule"
                >设置规则</el-button
              >
            </el-radio>
          </el-radio-group>
        </el-form-item>

        <!-- 证书 -->
        <el-form-item
          v-if="type === 'edit'"
          class="certificate-box"
          label="证书"
          prop="certificate"
        >
          <el-button
            v-if="!certificateDetailInfo.id"
            type="text"
            @click="handleCreateCertificate"
            >创建证书</el-button
          >

          <div v-else class="certificate-box-wrapper">
            <div class="certificate-box-content">
              <img
                :src="certificateDetailInfo.previewImage"
                alt=""
                style="cursor: pointer"
                @click="handlePreviewCertificate"
              />
              <div class="certificate-box-content-info">
                <div class="certificate-box-content-info-title">
                  <span>{{ certificateDetailInfo.name }}</span>
                  <div
                    v-if="certificateDetailInfo.status"
                    class="certificate-box-content-info-title-status-enable"
                  >
                    已启用
                  </div>
                  <div
                    v-else
                    class="certificate-box-content-info-title-status-disable"
                  >
                    禁用
                  </div>
                </div>
                <div class="certificate-box-content-info-desc">
                  <span class="people-num"
                    >已领{{ certificateDetailInfo.count || 0 }}人</span
                  >
                </div>
              </div>
            </div>
            <div class="certificate-box-options">
              <el-button type="text" @click="handleEditCertificate">
                编辑
              </el-button>
              <el-button type="text" @click="handleManageCertificate">
                管理
              </el-button>
              <el-button type="text" @click="handlePreviewCertificate">
                预览
              </el-button>
              <el-button
                v-if="!certificateDetailInfo.status"
                type="text"
                style="color: #00b42a"
                @click="handleEnableCertificate"
              >
                启用
              </el-button>
              <el-button
                v-else
                type="text"
                style="color: #f1330d"
                @click="handleStopCertificate"
              >
                停用
              </el-button>
            </div>
          </div>
        </el-form-item>

        <!-- 入班规则 -->
        <el-form-item
          label="入班规则"
          prop="classRule"
          class="class-rule is-required"
        >
          <div>
            <el-checkbox
              :value="Boolean(classForm.autoEnterClass)"
              style="width: 150px"
              disabled
              @change="handleAutoEnterClassChange"
            >
              智能销售自动入班
            </el-checkbox>
          </div>

          <div style="margin-top: 10px; display: flex; align-items: flex-start">
            <el-checkbox
              :value="Boolean(classForm.dateEnterClass)"
              :disabled="(type === 'edit' || type === 'detail') && !isClassType"
              @change="handleDateEnterClassChange"
            >
              <span style="margin-right: 20px; color: #000000; font-size: 14px">
                按日期入班
              </span>
            </el-checkbox>
            <div>
              <el-date-picker
                v-model="dateEnterClassTimeRange"
                value-format="yyyy-MM-dd HH:mm"
                format="yyyy-MM-dd HH:mm"
                type="datetimerange"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :disabled="
                  type === 'detail' || (type !== 'add' && !isClassType)
                "
                @change="handleDateEnterClassTimeChange"
                :validate-event="true"
              />
              <p>订单类型线索支付成功10分钟未入班自动按日期规则进行入班</p>
            </div>
          </div>
        </el-form-item>
      </el-form>
    </div>

    <!-- 课程目录表格部分 -->
    <div class="live-room-setting-table">
      <div class="live-room-setting-table-header">
        <div class="live-room-setting-table-header-title">
          <span class="live-room-setting-table-header-title-text"
            >课程目录</span
          >
          <span class="live-room-setting-table-header-title-tip">
            目录至少有一个非目录的章节，最多支持4级目录
          </span>
          <span
            v-if="showChapterError && !chapterTableData.length"
            class="live-room-setting-table-header-title-tip-error"
          >
            请新增课程目录
          </span>
        </div>
        <el-button
          v-if="type !== 'detail'"
          type="primary"
          size="small"
          @click="handleAddChapter"
        >
          新增一级章节
        </el-button>
      </div>

      <div class="live-room-setting-table-content">
        <el-table
          :data="chapterTableData"
          :height="tableHeight"
          row-key="id"
          :expand-row-keys="expandRowKeys"
          :tree-props="{
            children: 'childrenChapter'
          }"
          style="width: 100%"
        >
          <el-table-column prop="chapterName" label="章节名称" />
          <el-table-column prop="chapterType" label="章节类型">
            <template #default="scope">
              {{
                ['目录', '图片', '视频', '直播间', '打卡'][
                  scope.row.chapterType - 1
                ]
              }}
            </template>
          </el-table-column>
          <el-table-column prop="playback" label="回放">
            <template #default="scope">
              {{ scope.row.playback ? '支持' : '不支持' }}
            </template>
          </el-table-column>
          <el-table-column prop="sort" label="排序值" />
          <el-table-column
            v-if="type !== 'detail'"
            prop="action"
            label="操作"
            width="300"
          >
            <template #default="scope">
              <el-button
                v-if="scope.row.chapterType === 1 && scope.row.level <= 3"
                type="text"
                style="color: #0c6fff"
                @click="handleAddChild(scope.row)"
                >新增子章节</el-button
              >
              <el-button
                v-if="scope.row.chapterType === 1 && scope.row.level <= 3"
                type="text"
                style="color: #0c6fff"
                @click="
                  selectGoods(
                    scope.row.level >= 3
                      ? [
                          {
                            id: '3',
                            name: '普通专栏',
                            api: '',
                            placeholder: '请按专栏标题模糊搜索'
                          }
                        ]
                      : [
                          {
                            id: '3',
                            name: '普通专栏',
                            api: '',
                            placeholder: '请按专栏标题模糊搜索'
                          },
                          {
                            id: '4',
                            name: '大专栏',
                            api: '',
                            placeholder: '请按专栏标题模糊搜索'
                          }
                        ],
                    'course',
                    scope.row
                  )
                "
                >导入课程</el-button
              >
              <el-button
                type="text"
                style="color: #0c6fff"
                @click="handleEdit(scope.row)"
                >编辑</el-button
              >
              <el-button
                type="text"
                style="color: #ff1f00"
                @click="handleDelete(scope.row)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <!-- 新增章节对话框 -->
    <el-dialog
      class="chapter-dialog"
      :visible.sync="dialogVisible"
      width="860px"
      :before-close="handleCancel"
      :show-close="false"
      :destroy-on-close="true"
      :wrapper-closable="false"
      :close-on-click-modal="false"
      :modal="false"
    >
      <div slot="title" class="ss-material-box-header">
        <div class="ss-material-box-header-title">
          {{ dialogVisibleType === 'add' ? '新增章节' : '编辑章节' }}
        </div>
        <i class="el-icon-close close" @click="handleCancel" />
      </div>

      <el-form ref="chapterFormRef" :model="chapterForm" :rules="chapterRules">
        <!-- 表单内容保持不变 -->
        <el-form-item
          label="上级章节"
          prop="parentId"
          style="display: flex"
          required
        >
          <el-input
            :value="parentChapterName"
            placeholder="请输入上级章节"
            disabled
            style="flex: 1; width: 100%"
          />
        </el-form-item>
        <el-form-item
          v-if="
            chapterForm.chapterType === 1 ||
            chapterForm.chapterType === 2 ||
            chapterForm.chapterType === 4 ||
            (type === 'edit' && chapterType === 'edit') ||
            (type === 'add' && chapterType === 'edit') ||
            (type === 'copy' && chapterType === 'edit')
          "
          label="章节名称"
          prop="chapterName"
        >
          <el-input
            class="chapter-name-input"
            v-model="chapterForm.chapterName"
            type="text"
            placeholder="请输入章节名称"
            maxlength="100"
            show-word-limit
          />
        </el-form-item>

        <el-form-item
          label="章节类型"
          prop="chapterType"
          :style="{
            marginBottom: chapterForm.chapterType === 5 ? '10px' : '22px'
          }"
        >
          <el-select
            v-model="chapterForm.chapterType"
            placeholder="请选择章节类型"
            style="width: 100%"
            :disabled="dialogVisibleType === 'edit'"
            @change="handleChangeChapterType"
          >
            <el-option label="目录" :value="1" />
            <el-option label="图片" :value="2" />
            <el-option label="视频" :value="3" />
            <el-option label="直播间" :value="4" />
            <el-option label="打卡" :value="5" />
          </el-select>
        </el-form-item>

        <el-form-item
          v-if="
            chapterForm.chapterType === 1 ||
            chapterForm.chapterType === 2 ||
            chapterForm.chapterType === 4 ||
            (type === 'edit' && chapterType === 'edit') ||
            (type === 'add' && chapterType === 'edit') ||
            (type === 'copy' && chapterType === 'edit')
          "
          label="排序值"
          prop="sort"
        >
          <div class="sort-box" style="display: flex; align-items: center">
            <el-input
              v-model="chapterForm.sort"
              type="number"
              :min="1"
              :max="9999999"
              placeholder="请输入排序值"
              @input="value => handleSortInput(value)"
              @blur="handleSortBlur"
            />
            <span style="width: 100px; margin-left: 10px; color: #000000">
              值越小越靠前
            </span>
          </div>
        </el-form-item>

        <!-- 根据不同类型显示不同的表单项 -->
        <template v-if="chapterForm.chapterType === 2">
          <el-form-item label="上传内容" prop="chapterContents">
            <div class="upload-content-container">
              <div class="uploadImg-box-wrapper" @click="handleUploadImage">
                <div class="img-box">
                  <img src="@/assets/image/plus-blue.png" />
                </div>
                <div class="text">素材库选择</div>
              </div>

              <div
                v-if="chapterForm.chapterType === 2"
                class="uploaded-images-container"
              >
                <template v-for="(item, index) in chapterForm.chapterContents">
                  <div
                    v-if="item.contentUrl"
                    :key="index"
                    class="uploaded-box-wrapper"
                  >
                    <img class="uploaded-img" :src="item.contentUrl" />
                    <img
                      class="close-icon"
                      src="@/assets/svg/close.svg"
                      @click="handleCancelUpload(index)"
                    />
                    <div class="mask-img">
                      <div
                        class="mask-img-item"
                        @click="
                          openReviewImgDialog(item.contentUrl, 'horizontal')
                        "
                      >
                        <i class="el-icon-zoom-in" />
                        大图
                      </div>
                    </div>
                  </div>
                </template>
              </div>
            </div>
            <div class="tips">
              <p>
                最多上传7张图片，单张图片大小超过1M自动压缩，图片格式限jpg,jpeg,png
              </p>
            </div>
          </el-form-item>
        </template>

        <template v-if="chapterForm.chapterType === 3">
          <el-form-item label="上传内容" prop="chapterContents">
            <div class="upload-content-container">
              <div class="uploadImg-box-wrapper" @click="handleUploadVideo">
                <div class="img-box">
                  <img src="@/assets/image/plus-blue.png" />
                </div>
                <div class="text">素材库选择</div>
              </div>

              <div class="uploaded-images-container">
                <div class="w-100">
                  <div
                    v-if="materialVo.materialFrameUrl"
                    class="w-100 h-100"
                    style="position: relative"
                  >
                    <img
                      class="close-icon"
                      src="@/assets/svg/close.svg"
                      style="z-index: 10; cursor: pointer"
                      @click="handleCancelUpload(0)"
                    />
                    <el-popover
                      placement="bottom-start"
                      width="400"
                      trigger="hover"
                      :content="`${materialVo.materialName} ${materialVo.createTime}`"
                    >
                      <div slot="reference">
                        <el-image
                          style="width: 100px; height: 100px"
                          fit="cover"
                          class="pointer"
                          :src="materialVo.materialFrameUrl"
                          @click="playVideo(materialVo)"
                        />
                      </div>
                    </el-popover>
                  </div>
                </div>
              </div>
            </div>
            <div class="tips">
              <p>
                最多上传一个视频，支持上传5GB以内的mp4、avi、wmv、mov、flv、rmvb、3gp、m4v、mkv、webm格式视频
              </p>
            </div>
          </el-form-item>
        </template>

        <template v-if="chapterForm.chapterType === 4">
          <el-form-item
            class="live-room-select-box"
            label="选择直播间"
            prop="chapterContents"
          >
            <div style="display: flex; align-items: center; gap: 10px">
              <el-select
                v-model="selectedLiveRoomId"
                placeholder="请选择直播间"
                style="width: 200px"
                filterable
                clearable
                @change="handleLiveRoomChange"
              >
                <el-option
                  v-for="(item, index) in liveRoomOptions"
                  :key="`live_room_${item.id}_${index}`"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
              <el-button
                type="info"
                plain
                size="small"
                @click="handleRefreshLiveRoom"
                >刷新</el-button
              >
              <el-button
                type="text"
                style="color: #0c6fff; margin-left: 0"
                @click="handleCreateLiveRoom"
              >
                创建直播间
              </el-button>
            </div>
          </el-form-item>

          <el-form-item label="回放设置" prop="playback">
            <el-switch v-model="chapterForm.playback" />
            <p style="font-size: 12px; color: #999">
              回放有效期以支付时间开始计算，有效期以课程有效期为准
            </p>
          </el-form-item>
        </template>

        <template v-if="chapterForm.chapterType === 5">
          <el-form-item prop="clockIn">
            <el-button type="text" @click="handleSelectClockIn"
              >选择已有作业打卡</el-button
            >
          </el-form-item>
        </template>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button
          v-if="chapterForm.chapterType !== 5"
          type="primary"
          size="mini"
          @click="handleSubmit"
        >
          保存
        </el-button>
        <el-button size="mini" @click="handleCancel">取消</el-button>
      </div>
    </el-dialog>

    <ReviewImgDialog
      v-if="bigImgVisible"
      v-model="bigImgVisible"
      :append-to-body="true"
      :row="selectImg"
      @close="bigImgVisible = false"
    />

    <ReviewImgDialog
      v-if="certificateVisible"
      v-model="certificateVisible"
      :append-to-body="true"
      :row="certificateDetailInfoRow"
      @close="certificateVisible = false"
    />

    <ClockInDrawer
      :visible.sync="clockInDrawerVisible"
      :type="clockInType"
      @confirm="handleConfirmClockIn"
    />

    <CertificateDrawer
      ref="certificateDrawerRef"
      :visible.sync="certificateDialogVisible"
      :type="certificateDialogType"
      :associated-class-type="type"
      :class-name="classForm.className"
      @save="handleSaveCertificate"
    />

    <SettingRuleDialog
      :visible.sync="settingRuleDialogVisible"
      :config-data="settingRuleConfigData"
      @confirm="handleSettingRuleConfirm"
    />
  </div>
</template>

<script>
import {
  getLiveRoomList,
  importCourseToChapter,
  updateChapterSort
} from '@/api/liveRoom/course'
import { getScheduleClassPage } from '@/api/deliver/scheduleManagement'
import {
  getCertificateDetail,
  updateCertificateStatus,
  createCertificate,
  updateCertificate
} from '@/api/certificate'
import { addCourseUnlockConfig, getCourseUnlockConfig } from '@/api/unlock'
import ReviewImgDialog from '../ReviewImgDialog/index.vue'
import AppVideo from '@/components/AppVideo'
import { getSourceFileUrl } from '@/api/file'
import CourseSelect from '@/views/deliver/components/courseSelect.vue'
import SettingRuleDialog from '../SettingRuleDialog/index.vue'
import ClockInDrawer from '../ClockInDrawer/index.vue'
import CertificateDrawer from '../CertificateDrawer/index.vue'

export default {
  name: 'CreatePanel',
  components: {
    ReviewImgDialog,
    CourseSelect,
    SettingRuleDialog,
    ClockInDrawer,
    CertificateDrawer
  },
  props: {
    configData: {
      type: Object,
      required: true
    },
    openTimeDisabled: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: 'add'
    },
    isClassType: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      expandRowKeys: [],
      classForm: {
        ...this.configData.classForm,
        courseUnlockType: this.configData.classForm.courseUnlockType || 1
      },
      chapterForm: this.configData.chapterForm,
      chapterTableData: this.configData.chapterTable || [],
      classRules: {
        ...this.configData.classRules,
        classRule: [
          {
            required: true,
            validator: (rule, value, callback) => {
              // 检查是否至少选择了一种入班规则
              if (
                !this.classForm.autoEnterClass &&
                !this.classForm.dateEnterClass
              ) {
                callback(new Error('请至少选择一种入班规则'))
                return
              }

              // 如果选择了按日期入班，则必须填写时间范围
              if (
                this.classForm.dateEnterClass &&
                (!this.classForm.dateEnterClassStartTime ||
                  !this.classForm.dateEnterClassEndTime)
              ) {
                callback(new Error('请选择入班时间范围'))
                return
              }

              // 如果选择了按日期入班且已填写时间范围和开班时间，则检查时间先后顺序
              if (
                this.classForm.dateEnterClass &&
                this.classForm.dateEnterClassEndTime &&
                this.classForm.classOpeningTime
              ) {
                const endTime = new Date(
                  this.classForm.dateEnterClassEndTime
                ).getTime()
                const openingTime = new Date(
                  this.classForm.classOpeningTime
                ).getTime()

                if (endTime >= openingTime) {
                  callback(new Error('入班结束时间必须早于开班时间'))
                  return
                }
              }

              callback()
            },
            trigger: ['change', 'blur']
          }
        ],
        classOpeningTime: [
          { required: true, message: '请选择开班时间', trigger: 'change' }
        ]
      },
      pickerOptions: {
        disabledDate: time => {
          // 限制今天之前的日期
          const isBeforeToday =
            time.getTime() < Date.now() - 1 * 24 * 60 * 60 * 1000

          return isBeforeToday
        }
      },
      chapterRules: {
        chapterName: [
          {
            required: true,
            message: '请输入章节名称',
            trigger: ['blur', 'submit']
          }
        ],
        chapterType: [
          { required: true, message: '请选择章节类型', trigger: ['submit'] }
        ],
        sort: [
          {
            required: true,
            message: '请输入排序值',
            trigger: ['blur', 'submit']
          },
          {
            validator: (rule, value, callback) => {
              // 检查是否为空
              if (!value && value !== 0) {
                callback(new Error('请输入排序值'))
                return
              }

              // 转换为数字进行验证
              const num = Number(value)

              // 检查是否为正整数
              if (!Number.isInteger(num) || num <= 0) {
                callback(new Error('排序值必须为正整数'))
                return
              }

              // 检查范围
              if (num > 9999999) {
                callback(new Error('排序值不能大于9999999'))
                return
              }

              callback()
            },
            trigger: ['blur', 'submit']
          }
        ],
        chapterContents: [
          {
            required: true,
            message: '请选择直播间',
            trigger: ['submit']
          },
          {
            validator: (rule, value, callback) => {
              // 如果是目录类型,不需要校验 chapterContents
              if (this.chapterForm.chapterType === 1) {
                callback()
                return
              }

              // 检查是否有内容
              if (
                !value ||
                !value.length ||
                (!value[0].contentDetail && this.chapterForm.chapterType !== 4)
              ) {
                callback(new Error('请上传内容'))
                return
              }

              // 检查是否有内容
              if (
                !value ||
                !value.length ||
                (!value[0].contentDetail && this.chapterForm.chapterType === 4)
              ) {
                callback(new Error('请选择直播间'))
                return
              }

              callback()
            },
            trigger: ['submit']
          }
        ],
        playback: [
          { required: true, message: '请选择回放设置', trigger: ['submit'] }
        ]
      },
      dialogVisible: this.configData.dialogVisible,
      settingRuleDialogVisible: false,
      clockInDrawerVisible: false,
      certificateDialogVisible: false,
      videoProgress: this.configData.classForm.videoProgress,
      // 大图
      selectImg: { type: '', url: '' },
      // 是否展示大图
      bigImgVisible: false,
      // 对话框类型
      dialogVisibleType: 'add',
      // 对话框类型
      dialogVisibleChapterType: 'root',
      // 直播间选项列表
      liveRoomOptions: [],
      // 父章节名称
      parentChapterName: '',
      // 是否显示章节错误提示
      showChapterError: false,
      // 商品id列表
      goodsIdList: [],
      // 素材id列表
      materialIdList: [],
      tableHeight: 360,
      materialVo: {},
      selectedLiveRoomId: '',
      showSave: true,
      settingRuleConfigData: {
        videoProgress: 100
      },
      certificateDetailInfo: {},
      certificateDialogType: 'create',
      certificateDetailInfoRow: {},
      certificateVisible: false,
      userChangingUnlockType: false,
      taskId: '',
      clockInType: 'add',
      dateEnterClassTimeRange: [],
      sortable: null,
      chapterType: 'add'
    }
  },
  watch: {
    'configData.classForm': {
      handler(newVal) {
        this.classForm = newVal
        // 初始化日期范围
        if (newVal.dateEnterClassStartTime && newVal.dateEnterClassEndTime) {
          this.dateEnterClassTimeRange = [
            newVal.dateEnterClassStartTime,
            newVal.dateEnterClassEndTime
          ]
        }
      },
      deep: true
    },
    'configData.chapterForm': {
      handler(newVal) {
        this.chapterForm = newVal
      },
      deep: true
    },
    'configData.chapterTable': {
      handler(newVal) {
        this.chapterTableData = newVal || []
        // 在数据更新后，使用 nextTick 确保 DOM 更新完成
        // this.$nextTick(() => {
        //   // 如果有需要展开的父章节ID，则展开它
        //   if (this.expandRowKeys.length > 0) {
        //     // 强制更新展开状态
        //     const parentId = this.expandRowKeys[0]
        //     this.expandRowKeys = []
        //     this.$nextTick(() => {
        //       this.expandRowKeys = [parentId]
        //     })
        //   }
        // })
      },
      deep: true,
      immediate: true
    },
    'configData.dialogVisible'(newVal) {
      this.dialogVisible = newVal
      this.handleRefreshLiveRoom()
    },
    'chapterForm.chapterContents': {
      handler(newVal) {
        if (newVal && newVal[0]) {
          this.selectedLiveRoomId = newVal[0].contentDetail || ''
        }
      },
      immediate: true,
      deep: true
    }
  },
  mounted() {
    this.handleRefreshLiveRoom()
    this.showSave = true
    this.$nextTick(() => {
      this.calculateTableHeight()
      if (this.type === 'add' || this.type === 'copy') {
        this.handleUnlockTypeChange(1)
      }
    })

    setTimeout(() => {
      this.getCertificateDetail(this.configData.classForm.certificateId)
    }, 800)
  },
  methods: {
    async getCertificateDetail(certificateId) {
      if (!certificateId) return

      const res = await getCertificateDetail(certificateId)
      if (res.code === 1) {
        this.certificateDetailInfo = res.data
      }
    },
    calculateTableHeight() {
      const windowHeight = window.innerHeight
      this.tableHeight = windowHeight - 600
    },
    // 点击播放视频
    playVideo(row) {
      if (row.courseId) {
        AppVideo.play({
          url: row.materialUrl
        })
      } else {
        if (row.materialId) {
          this.loading = true
          const params = {
            materialId: row.materialId
          }
          getSourceFileUrl(params)
            .then(res => {
              this.loading = false
              AppVideo.play({
                url: res.data,
                materialId: row.materialId,
                poster: row.materialFrameUrl || ''
              })
            })
            .catch(() => {
              this.loading = false
            })
        }
      }
    },
    async handleRefreshLiveRoom() {
      if (this.configData.classForm.goodsIdList.length === 0) return
      const data = {
        pageIndex: 1,
        pageSize: 1000,
        goodsIds: this.configData.classForm.goodsIdList
      }
      const res = await getLiveRoomList(data)
      this.liveRoomOptions = res.data.items
    },
    handleCreateLiveRoom() {
      const baseUrl = process.env.VUE_APP_BASE_URL || window.location.origin
      if (this.classForm.goodsIdList.length === 0) {
        this.$message.warning('请先关闭该窗体，选择班级里面的课程名称')
        return
      }
      // 将数组转换为JSON字符串并进行URL编码
      const goodsListParam = encodeURIComponent(
        JSON.stringify(this.classForm.goodsIdList)
      )
      window.open(
        `${baseUrl}#/privateLive/createNewLiveRoom?goodsList=${goodsListParam}`
      )
    },
    async handleSettingRule() {
      this.settingRuleDialogVisible = true
      if (this.type !== 'add') {
        const res = await getCourseUnlockConfig(
          this.configData.classForm.courseUnlockId
        )
        this.settingRuleConfigData.videoProgress = res.data.videoProgress
      }
    },
    async handleSettingRuleConfirm(data) {
      try {
        this.userChangingUnlockType = true

        const res = await addCourseUnlockConfig({
          unlockType: 2,
          videoProgress: data
        })

        // 直接修改 configData.classForm 的特定字段
        this.$set(this.configData.classForm, 'courseUnlockId', res.data)

        // 同步更新本地表单的特定字段
        this.$set(this.classForm, 'courseUnlockId', res.data)

        this.$message.success('设置成功')
      } catch (error) {
        console.error('设置规则失败:', error)
      } finally {
        setTimeout(() => {
          this.userChangingUnlockType = false
        }, 0)
      }
    },
    async handleSelectClockIn() {
      this.clockInDrawerVisible = true
    },
    async handleConfirmClockIn(type, data) {
      this.settingRuleDialogVisible = false

      // 串行处理每个打卡数据
      for (let i = 0; i < data.length; i++) {
        const item = data[i]

        // 准备章节数据
        const chapterData = {
          ...this.chapterForm,
          chapterType: 5,
          chapterName: item.title,
          chapterContents: [
            {
              contentDetail: item.id,
              contentName: '打卡名称'
            }
          ]
        }
        delete chapterData.playback

        // 直接触发父组件方法,使用await等待每个请求完成
        await this.$emit('submit', type, { ...chapterData, id: this.taskId })

        // 如果是新增子章节，先设置要展开的父章节ID
        if (this.dialogVisibleType === 'add' && chapterData.parentId) {
          this.expandRowKeys = [chapterData.parentId]
        }
      }

      // 最后再关闭对话框
      this.dialogVisible = false
      this.emitConfigDataChange()
    },
    async handleEditCertificate() {
      const editData = {
        id: this.certificateDetailInfo.id,
        createCertificate: {
          status: this.certificateDetailInfo.status === 1
        },
        basicInfo: {
          name: this.certificateDetailInfo.name,
          type: this.certificateDetailInfo.type,
          scheduleId: this.configData.classForm.scheduleId
        },
        rule: {
          conditionType: this.certificateDetailInfo.conditionType,
          conditionTime: this.certificateDetailInfo.conditionTime,
          isFinishContentCount: this.certificateDetailInfo.isFinishContentCount,
          isFinishPunchCount: this.certificateDetailInfo.isFinishPunchCount,
          finishContentCount: this.certificateDetailInfo.finishContentCount,
          punchCount: this.certificateDetailInfo.punchCount
        },
        style: {
          backgroundImage: this.certificateDetailInfo.backgroundImage,
          imageType: this.certificateDetailInfo.imageType
        },
        info: {
          title: this.certificateDetailInfo.title,
          content: this.certificateDetailInfo.content,
          showCourseTitle: this.certificateDetailInfo.showCourseTitle,
          courseTitleType: this.certificateDetailInfo.courseTitleType,
          customTitle: this.certificateDetailInfo.customTitle,
          finishCourse: this.certificateDetailInfo.finishCourse,
          finishPunch: this.certificateDetailInfo.finishPunch,
          finishTask: this.certificateDetailInfo.finishTask,
          encourageContent: this.certificateDetailInfo.encourageContent
        },
        issueInfo: {
          certificateTenant: this.certificateDetailInfo.certificateTenant,
          showTime: this.certificateDetailInfo.showTime,
          certificateNumber: this.certificateDetailInfo.certificateNumber,
          seal: this.certificateDetailInfo.seal
        },
        share: {
          shareContent: this.certificateDetailInfo.shareContent,
          showQrCode: this.certificateDetailInfo.showQrCode,
          qrCodeSetting: this.certificateDetailInfo.qrCodeSetting,
          guidanceContent: this.certificateDetailInfo.guidanceContent,
          customQrCode: this.certificateDetailInfo.customQrCode
        }
      }
      const params = {
        current: 1,
        scheduleId: this.configData.classForm.scheduleId,
        size: 9999,
        type: 2
      }
      const res = await getScheduleClassPage(params)
      const row = res.data.records[0]
      this.$refs.certificateDrawerRef.handleConfirm(row)
      this.$refs.certificateDrawerRef.certificateForm = editData
      this.certificateDialogVisible = true
      this.certificateDialogType = 'edit'
    },
    handleManageCertificate() {
      const baseUrl = process.env.VUE_APP_BASE_URL || window.location.origin
      window.open(`${baseUrl}#/deliver/courseInteraction?type=certificate`)
    },
    handlePreviewCertificate() {
      this.certificateDetailInfoRow = {
        url: this.certificateDetailInfo.previewImage,
        type:
          this.certificateDetailInfo.imageType === 1 ? 'horizontal' : 'vertical'
      }
      this.certificateVisible = true
    },
    async handleEnableCertificate() {
      const res = await updateCertificateStatus(
        this.configData.classForm.certificateId,
        {
          status: 1
        }
      )
      if (res.code === 1) {
        this.$message.success('启用成功')
        this.getCertificateDetail(this.configData.classForm.certificateId)
      }
    },
    async handleStopCertificate() {
      const res = await updateCertificateStatus(
        this.configData.classForm.certificateId,
        {
          status: 0
        }
      )
      if (res.code === 1) {
        this.$message.success('停用成功')
        this.getCertificateDetail(this.configData.classForm.certificateId)
      }
    },
    async handleUnlockTypeChange(value) {
      try {
        this.userChangingUnlockType = true

        const res = await addCourseUnlockConfig({
          unlockType: value,
          videoProgress: value === 2 ? 100 : undefined
        })

        // 只更新解锁相关字段，保持其他字段不变
        this.classForm = {
          ...this.classForm,
          courseUnlockId: res.data,
          courseUnlockType: Number(value)
        }

        // 更新父组件数据时也只更新解锁相关字段
        this.$emit('update:configData', {
          ...this.configData,
          classForm: {
            ...this.classForm,
            courseUnlockId: res.data,
            courseUnlockType: Number(value)
          }
        })

        this.emitConfigDataChange()
      } catch (error) {
        console.error('更新解锁方式失败:', error)
      } finally {
        setTimeout(() => {
          this.userChangingUnlockType = false
        }, 0)
      }
    },
    async handleSaveCertificate(data, type) {
      const res = await (type === 'create'
        ? createCertificate
        : updateCertificate)(data)
      if (res.code === 1) {
        this.$message.success(
          type === 'create' ? '创建证书成功' : '更新证书成功'
        )
        this.certificateDetailInfo = res.data
        this.configData.classForm.certificateId = res.data.id
        this.configData.classForm.certificateName = res.data.name
        this.$refs.certificateDrawerRef.handleClose()
      }
    },
    // 当表单数据变化时，通知父组件
    emitConfigDataChange() {
      this.$emit('update:configData', {
        ...this.configData,
        classForm: this.classForm,
        chapterForm: this.chapterForm,
        chapterTable: this.chapterTableData,
        dialogVisible: this.dialogVisible
      })
    },
    openReviewImgDialog(url, type) {
      this.selectImg = { type: type, url: url }
      this.bigImgVisible = true
    },
    async handleCreateCertificate() {
      this.$refs.certificateDrawerRef.certificateForm.basicInfo.scheduleId =
        this.classForm.scheduleId
      const params = {
        current: 1,
        scheduleId: this.classForm.scheduleId,
        size: 9999,
        type: 2
      }
      const res = await getScheduleClassPage(params)
      const row = res.data.records[0]
      this.$refs.certificateDrawerRef.handleConfirm(row)
      this.certificateDialogVisible = true
      this.certificateDialogType = 'create'
    },
    courseSelect(value, key) {
      if (key === 'clear' || value.length === 0) {
        this.classForm.goodsNameList = []
        this.classForm.goodsIdList = []
        this.classForm.goodsNameVoList = []
      }
      this.classForm.goodsNameVoList = value.map(item => ({
        goodsName: item?.contentName,
        goodsId: item.goodsId
      }))
      this.classForm.goodsIdList = value.map(item => item?.goodsId) || []
      this.classForm.goodsNameList = value.map(item => item?.contentName) || []
      this.$emit('update:configData', {
        ...this.configData,
        classForm: this.classForm,
        chapterForm: this.chapterForm,
        chapterTable: this.chapterTableData,
        dialogVisible: this.dialogVisible
      })
    },
    handleAddChild(row) {
      this.dialogVisible = true
      this.dialogVisibleType = 'add'
      this.dialogVisibleChapterType = 'child'
      this.chapterType = 'add'
      this.parentChapterName = row.chapterName
      this.materialVo.materialFrameUrl = ''
      this.clockInType = 'add'

      this.chapterForm = {
        chapterName: '',
        chapterType: '',
        sort: '',
        parentId: row.id,
        playback: 1,
        level: row.level + 1,
        scheduleId: this.configData.classForm.scheduleId,
        chapterContents: [
          { contentDetail: '', contentName: '', contentUrl: '' }
        ]
      }

      // 使用 nextTick 确保表单已经渲染完成
      this.$nextTick(() => {
        if (this.$refs.chapterFormRef) {
          this.$refs.chapterFormRef.clearValidate()
        }
      })

      this.emitConfigDataChange()
    },
    handleEdit(row) {
      if (row.chapterType === 5) {
        this.clockInType = 'edit'
        this.handleSelectClockIn()
        this.taskId = row.id
        return
      }
      this.dialogVisible = true
      this.dialogVisibleType = 'edit'
      this.chapterType = 'edit'
      this.dialogVisibleChapterType = row.level === 1 ? 'root' : 'child'
      this.materialVo.materialFrameUrl = row.chapterContents[0].contentUrl
      this.materialVo.materialUrl = row.chapterContents[0].contentVideoUrl
      this.materialVo.materialId = row.chapterContents[0].contentDetail
      this.materialVo.materialName = row.chapterContents[0].contentName
      this.materialVo.createTime = ''

      // 修改这里的逻辑
      if (row.parentId === '0' || row.parentId === 0) {
        this.parentChapterName = '根章节'
      } else {
        const parentChapter = this.findChapterById(
          this.chapterTableData,
          row.parentId
        )
        this.parentChapterName = parentChapter
          ? parentChapter.chapterName
          : '上一级章节名称'
      }

      // 使用深拷贝初始化编辑表单数据
      this.chapterForm = JSON.parse(JSON.stringify(row))

      // 如果是直播间类型，需要先获取直播间列表并找到对应的直播间名称
      if (
        this.chapterForm.chapterType === 4 &&
        this.chapterForm.chapterContents?.length
      ) {
        this.handleRefreshLiveRoom().then(() => {
          const liveRoom = this.liveRoomOptions.find(
            item =>
              item.id === this.chapterForm.chapterContents[0].contentDetail
          )
          if (liveRoom) {
            // 保存直播间ID和名称
            this.chapterForm.chapterContents[0] = {
              ...this.chapterForm.chapterContents[0],
              contentDetail: liveRoom.id,
              contentName: liveRoom.name
            }
          }
        })
      }

      // 确保playback是布尔值
      this.chapterForm.playback = Boolean(this.chapterForm.playback)
    },
    handleDelete(row) {
      this.$confirm('确定要删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$emit('delete', row)
      })
    },
    handleAddChapter() {
      this.dialogVisible = true
      this.dialogVisibleType = 'add'
      this.dialogVisibleChapterType = 'root'
      this.parentChapterName = '根章节'
      this.clockInType = 'add'
      this.chapterType = 'add'

      this.chapterForm = {
        chapterName: '',
        chapterType: '',
        sort: '',
        parentId: 0,
        playback: true,
        level: 1,
        scheduleId: this.configData.classForm.scheduleId,
        chapterContents: [
          {
            contentDetail: '',
            contentName: '',
            contentUrl: '',
            contentVideoUrl: ''
          }
        ]
      }

      // 使用 nextTick 确保表单已经渲染完成
      this.$nextTick(() => {
        if (this.$refs.chapterFormRef) {
          this.$refs.chapterFormRef.clearValidate()
        }
      })

      this.emitConfigDataChange()
    },
    handleCancel() {
      this.dialogVisible = false

      // 如果是新增一级章节，重置表单
      if (
        this.dialogVisibleType === 'add' &&
        this.dialogVisibleChapterType === 'root'
      ) {
        this.resetChapterForm()
      }

      this.emitConfigDataChange()
    },
    handleChangeChapterType() {
      this.chapterForm.chapterContents = [
        { contentDetail: '', contentName: '', contentUrl: '' }
      ]
      this.materialVo = {}
      this.$refs.chapterFormRef.clearValidate()
    },
    async handleValidClassForm() {
      return new Promise(resolve => {
        this.$refs.classFormRef.validate(valid => {
          resolve(valid)
        })
      })
    },
    async handleSubmit() {
      this.$refs.chapterFormRef.validate(async valid => {
        if (valid) {
          const data = { ...this.chapterForm }
          if (data.chapterType !== 1 && data.chapterType !== 5) {
            if (
              !data.chapterContents?.length ||
              !data.chapterContents[0].contentDetail
            ) {
              this.$refs.chapterFormRef.validateField('chapterContents')
              return
            }
          }
          if (data.chapterContents[0].contentDetail === '') {
            data.chapterContents.splice(0, 1)
          }
          if (data.chapterType === 1) {
            delete data.chapterContents
            delete data.playback
          } else if (data.chapterType === 2) {
            delete data.playback
          } else if (data.chapterType === 3) {
            delete data.playback
          } else if (data.chapterType === 4) {
            data.playback = data.playback ? 1 : 0
            // 确保保存直播间名称
            const liveRoom = this.liveRoomOptions.find(
              item => item.id === data.chapterContents[0].contentDetail
            )
            if (liveRoom) {
              data.chapterContents[0].contentName = liveRoom.name
            }
            delete data.chapterContents[0].contentUrl
          }

          // 关闭对话框
          this.dialogVisible = false

          // 如果是新增子章节，先设置要展开的父章节ID
          if (this.dialogVisibleType === 'add' && data.parentId) {
            this.expandRowKeys = [data.parentId]
          }

          // 发送数据到父组件
          this.$emit('submit', this.dialogVisibleType, data)
          this.emitConfigDataChange()
          this.$refs.chapterFormRef.clearValidate()
        } else {
          // 验证失败时不关闭对话框
          return false
        }
      })
    },
    // 重置表单状态
    resetChapterForm() {
      // 如果不是新增一级章节，不重置表单
      if (
        !(
          this.dialogVisibleType === 'add' &&
          this.dialogVisibleChapterType === 'root'
        )
      ) {
        return
      }
      const emptyForm = {
        chapterName: '',
        chapterType: '',
        sort: '',
        parentId: 0, // 一级章节固定为0
        playback: 1,
        level: 1, // 一级章节固定为1
        scheduleId: this.configData.classForm.scheduleId,
        chapterContents: [
          {
            contentDetail: '',
            contentName: '',
            contentUrl: '',
            contentVideoUrl: ''
          }
        ]
      }

      this.chapterForm = emptyForm

      if (this.$refs.chapterFormRef) {
        this.$refs.chapterFormRef.resetFields()
      }
    },
    // 添加一个查找章节的辅助方法
    findChapterById(chapters, id) {
      for (const chapter of chapters) {
        if (chapter.id === id) {
          return chapter
        }
        if (chapter.childrenChapter && chapter.childrenChapter.length > 0) {
          const found = this.findChapterById(chapter.childrenChapter, id)
          if (found) {
            return found
          }
        }
      }
      return null
    },
    // 根据商品id查询该商品下面那些素材/商品被选择了
    handleCancelUpload(index) {
      // 清除 chapterContents
      this.chapterForm.chapterContents.splice(index, 1)

      // 如果是视频类型，需要同时清除 materialVo
      if (this.chapterForm.chapterType === 3) {
        this.materialVo = {}
      }

      // 如果 chapterContents 为空，添加一个空对象作为默认值
      if (this.chapterForm.chapterContents.length === 0) {
        this.chapterForm.chapterContents = [
          {
            contentDetail: '',
            contentName: '',
            contentUrl: '',
            contentVideoUrl: ''
          }
        ]
      }
    },
    handleUploadImage() {
      // 过滤掉空内容,只计算实际的图片数量
      const currentImageCount = this.chapterForm.chapterContents.filter(
        item => item.contentDetail || item.contentUrl
      ).length
      // 检查当前已上传的图片数量
      if (currentImageCount >= 7) {
        this.$message.warning('最多只能上传7张图片')
        return
      }

      this.$SelectMaterial({
        visible: true,
        types: [0],
        type: 0,
        multiple: false,
        success: res => {
          console.log(res, 'res')
          // 再次检查添加新图片后是否超过限制
          if (currentImageCount >= 7) {
            this.$message.warning('最多只能上传7张图片')
            return
          }
          // 如果是第一次上传且第一项是空的,则替换它而不是push
          if (
            this.chapterForm.chapterContents.length === 1 &&
            !this.chapterForm.chapterContents[0].contentDetail
          ) {
            this.chapterForm.chapterContents = [
              {
                contentDetail: res.materialId,
                contentName: '图片名称',
                contentUrl: res.materialUrl
              }
            ]
          } else {
            this.chapterForm.chapterContents.push({
              contentDetail: res.materialId,
              contentName: '图片名称',
              contentUrl: res.materialUrl
            })
          }
        }
      })
    },
    handleUploadVideo() {
      this.$SelectMaterial({
        visible: true,
        types: [2],
        type: 2,
        multiple: true,
        optionType: this.chapterType,
        success: async res => {
          // 判断res是否为数组
          if (!Array.isArray(res)) {
            // 准备章节数据
            const chapterData = {
              ...this.chapterForm,
              chapterType: 3, // 视频类型
              chapterName: res.materialName.replace(/\.[^.]+$/, ''),
              chapterContents: [
                {
                  contentDetail: res.materialId,
                  contentName: '视频名称',
                  contentUrl: res.materialFrameUrl,
                  contentVideoUrl: res.materialUrl
                }
              ]
            }

            await this.$emit(
              'submit',
              this.dialogVisibleType,
              chapterData,
              true
            )

            // 如果是新增子章节，先设置要展开的父章节ID
            if (this.dialogVisibleType === 'add' && chapterData.parentId) {
              this.expandRowKeys = [chapterData.parentId]
            }
          } else {
            for (let i = 0; i < res.length; i++) {
              const item = res[i]

              // 准备章节数据
              const chapterData = {
                ...this.chapterForm,
                chapterType: 3, // 视频类型
                chapterName: item.materialName.replace(/\.[^.]+$/, ''),
                chapterContents: [
                  {
                    contentDetail: item.materialId,
                    contentName: '视频名称',
                    contentUrl: item.materialFrameUrl,
                    contentVideoUrl: item.materialUrl
                  }
                ]
              }

              // 触发父组件方法,使用await等待每个请求完成
              // 只在最后一个视频上传完成后显示成功提示
              await this.$emit(
                'submit',
                this.dialogVisibleType,
                chapterData,
                i === res.length - 1
              )

              // 如果是新增子章节，先设置要展开的父章节ID
              if (this.dialogVisibleType === 'add' && chapterData.parentId) {
                this.expandRowKeys = [chapterData.parentId]
              }
            }
          }

          // 所有视频处理完成后关闭对话框
          this.dialogVisible = false

          this.emitConfigDataChange()
        }
      })
    },
    selectGoods(tabList, type, row) {
      const check = this.materialIdList.concat(this.goodsIdList)
      this.$SelectGoods({
        visible: true,
        multiple: false,
        check,
        tabList,
        currentId: tabList[0]?.id,
        success: async res => {
          res.forEach(v => {
            this.chapterForm.chapterContents.push({
              contentDetail: v.goodsId,
              contentName: type === 'image' ? '图片名称' : '视频名称',
              contentUrl: v.coverUrl
            })
          })

          if (type === 'course') {
            const data = {
              chapterId: row.id,
              courseId: res[0].goodsId
            }

            const flag = await importCourseToChapter(data)
            if (flag) {
              if (this.$parent?.getCourseDetail) {
                this.$parent.getCourseDetail(
                  this.configData.classForm.scheduleId
                )
              } else {
                this.$emit(
                  'getCourseDetail',
                  this.configData.classForm.scheduleId
                )
              }
              this.$message.success('导入课程成功')
            }
          }
        }
      })
    },
    handleSortInput(value) {
      // 如果输入为空，允许临时为空
      if (!value) {
        this.chapterForm.sort = ''
        return
      }

      // 移除非数字字符
      value = value.toString().replace(/[^\d]/g, '')

      // 转换为数字
      const num = parseInt(value)

      // 限制最大值
      if (num > 9999999) {
        this.chapterForm.sort = 9999999
      } else {
        this.chapterForm.sort = num || ''
      }
    },
    handleSortBlur() {
      // 失焦时如果为空或非正整数，设为1
      const value = this.chapterForm.sort
      if (!value || parseInt(value) <= 0) {
        this.chapterForm.sort = 1
      }
    },
    handleLiveRoomChange(value) {
      this.selectedLiveRoomId = value

      if (!value) {
        this.chapterForm.chapterContents[0] = {
          contentDetail: '',
          contentName: '',
          contentUrl: ''
        }
        return
      }

      const liveRoom = this.liveRoomOptions.find(item => item.id === value)
      if (liveRoom) {
        this.chapterForm.chapterContents[0] = {
          contentDetail: liveRoom.id,
          contentName: liveRoom.name,
          contentUrl: ''
        }
      }
    },
    handleAutoEnterClassChange(value) {
      this.$set(this.classForm, 'autoEnterClass', value ? 1 : 0)
      this.$refs.classFormRef.validateField('classRule')
    },
    handleDateEnterClassChange(value) {
      this.$set(this.classForm, 'dateEnterClass', value ? 1 : 0)

      // 当取消勾选时,清空时间范围
      if (!value) {
        this.dateEnterClassTimeRange = []
        this.$set(this.classForm, 'dateEnterClassStartTime', '')
        this.$set(this.classForm, 'dateEnterClassEndTime', '')
      }

      this.$refs.classFormRef.validateField('classRule')
    },
    handleDateEnterClassTimeChange(val) {
      if (val) {
        this.$set(this.classForm, 'dateEnterClassStartTime', val[0])
        this.$set(this.classForm, 'dateEnterClassEndTime', val[1])

        // 只在这里触发校验
        this.$nextTick(() => {
          this.$refs.classFormRef.validateField('classRule')
        })
      } else {
        this.$set(this.classForm, 'dateEnterClassStartTime', '')
        this.$set(this.classForm, 'dateEnterClassEndTime', '')
      }

      this.emitConfigDataChange()
    },
    handleOpeningTimeChange() {
      // 只有当选择了"按日期入班"且已设置了时间范围时,才触发校验
      if (
        this.classForm.dateEnterClass &&
        this.dateEnterClassTimeRange?.length
      ) {
        this.$refs.classFormRef.validateField('classRule')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.class-name-input .el-input__inner {
  padding-right: 50px;
}

::v-deep {
  .chapter-name-input .el-input__inner {
    padding-right: 50px;
  }
}

.create-class-panel {
  .live-room-setting-form {
    .course-name-list {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;

      .course-name-item {
        width: fit-content;
        background-color: #f6f6f6;
        border: 1px solid #dcdee1;
        border-radius: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0 10px;
      }
    }

    p {
      color: #999;
      font-size: 12px;
    }

    .class-num-tip {
      color: #999;
      font-size: 14px;
      margin-left: 10px;
    }
  }

  .live-room-setting-table {
    margin-top: 20px;
    padding: 20px;
    background-color: #fafafa;
    border-radius: 8px;

    &-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;

      &-title {
        &-text {
          font-size: 14px;
          color: #000000;
          font-weight: 600;

          &::before {
            content: '*';
            display: inline-block;
            color: red;
          }
        }

        &-tip {
          margin-left: 15px;
          font-size: 14px;
          color: #000000;
        }

        &-tip-error {
          margin-left: 15px;
          color: #ff4949;
          font-size: 12px;
        }
      }
    }
  }

  .upload-content-container {
    display: flex;
    align-items: flex-start;
    gap: 10px;
  }

  .uploadImg-box-wrapper {
    display: flex;
    flex: none;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border: 1px dashed transparent;
    background: #fafafa;
    border-radius: 4px;
    width: 100px;
    height: 100px;
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
      color: #065cff;
      font-size: 12px;
      line-height: 18px;
    }
  }
  .tips {
    color: #999999;
    font-size: 12px;
    line-height: 18px;
    margin-top: 10px;
  }

  .uploaded-images-container {
    display: flex;
    overflow-x: auto;
    overflow-y: hidden;
    gap: 10px;

    &::-webkit-scrollbar {
      height: 6px;
    }

    &::-webkit-scrollbar-track {
      background: #f1f1f1;
      border-radius: 3px;
    }

    &::-webkit-scrollbar-thumb {
      background: #888;
      border-radius: 3px;
    }

    &::-webkit-scrollbar-thumb:hover {
      background: #555;
    }

    .close-icon {
      position: absolute;
      top: 2px;
      right: 2px;
      width: 12px;
      height: 12px;
      z-index: 10;
    }
  }

  .uploaded-box-wrapper {
    flex: 0 0 auto;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border: 1px solid #dcdfe5;
    border-radius: 4px;
    width: 100px;
    height: 100px;
    cursor: pointer;

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
      z-index: 10;
    }
  }
}

.course-select-box {
  ::v-deep {
    .el-form-item__error {
      top: 90%;
    }
  }
}

::v-deep {
  .el-form-item__label {
    color: #000000;
    width: 92px;
  }
  .chapter-dialog .el-dialog__header {
    padding: 0 !important;
  }
  .chapter-dialog .el-form-item__label {
    text-align: left;
  }
  .chapter-dialog .el-form-item {
    display: flex;
  }
  .chapter-dialog .el-form-item__content {
    flex: 1;
  }
  .el-table {
    th {
      background: #eff2f6;
      font-weight: 700;
      color: #000000;
    }
    .el-table__expand-icon {
      .el-icon-arrow-right {
        background: url('~@/assets/image/down-table.png') no-repeat center
          center;
        background-size: contain;
        width: 12px;
        height: 12px;
        transform: rotate(0);
        transition: transform 0.3s;
        &:before {
          content: '';
        }
      }
    }

    // el-table表格对齐
    .el-table__row:not([class*='el-table__row--level-']) {
      td:first-child {
        padding-left: 24px !important; //一级数据无Child缩进
      }
    }
    .el-table__placeholder {
      margin-left: 3px; //子节点无Child缩进
    }

    .el-table__expand-icon--expanded {
      .el-icon-arrow-right {
        transform: rotate(90deg);
      }
    }
  }

  .el-input.is-disabled .el-input__inner {
    border: none !important;
    border-radius: 10px !important;
    color: #000000 !important;
  }
}

.ss-material-box-header {
  display: flex;
  align-items: center;
  box-sizing: border-box;
  height: 52px;
  padding: 15px 20px;
  background: #ffffff;
  border-radius: 10px 10px 0 0;
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

.course-select-box-wrapper::v-deep {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  .course-select-box-wrapper,
  .inputBox {
    width: 447px !important;
  }
  .courseSelect {
    border: 1px solid #dcdee1;
    border-radius: 4px;
    width: 100%;
  }
}

.course-select-box-content {
  display: flex;
  align-items: center;
  background-color: #f6f6f6;
  border: 1px solid #dcdee1;
  border-radius: 4px;
  padding: 0 5px;
  height: 32px;

  span {
    font-size: 12px;
    color: #000000;
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

::v-deep .unlock-type-radio-box .el-form-item__label {
  line-height: 14px !important;
}

::v-deep .certificate-box .el-form-item__label {
  padding-left: 12px !important;
}

.certificate-box-wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 5px 20px 5px 5px;
  background-color: #f8f8f8;
  border-radius: 4px;

  .certificate-box-content {
    display: flex;
    align-items: center;
    gap: 10px;

    img {
      width: 150px;
      height: 84px;
      object-fit: contain;
    }

    &-info {
      display: flex;
      flex-direction: column;
      gap: 10px;

      &-title {
        display: flex;
        align-items: center;
        gap: 10px;
        font-size: 14px;
        color: #000000;
        font-weight: 600;

        &-status-enable {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 12px;
          line-height: 20px;
          border: 1px solid #00b42a;
          border-radius: 4px;
          font-size: 12px;
          color: #00b42a;
          line-height: 20px;
        }

        &-status-disable {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 12px;
          line-height: 20px;
          border: 1px solid #f1330d;
          border-radius: 4px;
          font-size: 12px;
          color: #f1330d;
        }
      }

      &-desc {
        font-size: 12px;
        color: #999999;
        display: flex;
        align-items: center;
        gap: 10px;

        .people-num {
          font-size: 14px;
          color: #777777;
        }
      }
    }
  }

  .certificate-box-options {
    display: flex;
    align-items: center;
    gap: 10px;
  }
}

.unlock-type-radio {
  display: flex;
  flex-direction: column;
  gap: 16px;

  .unlock-type-radio-item {
    height: auto;
    margin: 0;
    display: flex;
    align-items: flex-start;

    .radio-label {
      margin-right: 20px;
      color: #000000;
      font-size: 14px;
    }

    .radio-desc {
      color: #999;
      font-size: 14px;
      font-weight: 400;
      margin-right: 20px;
    }
  }
}
</style>
