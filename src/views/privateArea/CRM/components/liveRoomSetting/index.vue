<template>
  <!-- courseType === 1 的内容 -->
  <div v-if="courseType === 1" class="live-room-setting">
    <el-row v-if="type === 'add'" style="margin-bottom: 20px">
      <el-radio v-model="selectClassType" :label="1">创建班级</el-radio>
      <el-radio v-model="selectClassType" :label="2">选择已有班级</el-radio>
    </el-row>

    <create-class-panel
      v-if="selectClassType === 1"
      ref="createClassPanelRef"
      :config-data.sync="configData"
      :type="type"
      @submit="handleCreateClassSubmit"
      @delete="handleDelete"
    />
    <select-class-panel
      v-if="selectClassType === 2"
      ref="selectClassPanelRef"
      :goods-id-list="configData.classForm.goodsIdList"
    />

    <LiveRoomList
      v-if="taskcopyId && selectClassType === 1"
      ref="LiveRoomListRef"
      :items.sync="liveRoomList"
    />

    <div v-if="type === 'add'" class="setting-footer">
      <el-button size="small" @click="handleBackStep">上一步</el-button>
      <el-button
        type="primary"
        size="small"
        @click="handleNextStep"
      >保存</el-button>
    </div>
  </div>

  <!-- courseType === 0 的内容 -->
  <div v-else class="setting-container">
    <div class="setting-content">
      <div class="setting-header">
        <el-switch
          v-model="isLive"
          :disabled="true"
          inactive-text="需要直播间转化"
        />
        <span v-if="type === 'add'" class="tips">
          开启且保存后不可关闭，开启后，至少设置一个未开始的直播间！
        </span>
      </div>
      <template v-if="isLive">
        <div class="setting-btn">
          <el-button
            v-permission="['web:crm:setLive', permsList]"
            type="primary"
            :disabled="type === 'detail'"
            size="small"
            @click="handleSelectLiveRoom"
          >设置直播间</el-button>
        </div>
        <dynamicTable
          ref="table"
          v-model="tableData"
          hide-pagination
          immediate-check
          :columns="columns"
          :get-list-api="getList"
          class="dialog-table"
        >
          <!-- 表格插槽内容 -->
          <template #action="{ row }">
            <el-button
              style="color: #f53f3f"
              type="text"
              @click="delModal(row)"
            >
              移除
            </el-button>
          </template>
          <template #liveModel="{ row }">
            <MIconStatus
              :background="
                getOptionsValueByKey(
                  'value',
                  'background',
                  row.liveModel,
                  liveModelOption
                )
              "
              :color="
                getOptionsValueByKey(
                  'value',
                  'color',
                  row.liveModel,
                  liveModelOption
                )
              "
              :icon-class="
                getOptionsValueByKey(
                  'value',
                  'icon',
                  row.liveModel,
                  liveModelOption
                )
              "
              :title="
                getOptionsValueByKey(
                  'value',
                  'label',
                  row.liveModel,
                  liveModelOption
                )
              "
            />
          </template>
        </dynamicTable>
      </template>
    </div>
    <div v-if="type === 'add'" class="setting-footer">
      <el-button size="small" @click="handleBackStep">上一步</el-button>
      <el-button type="primary" size="small" @click="handleNextStep">
        {{ form.dataType === 1 ? '下一步' : '保存' }}
      </el-button>
    </div>
    <selectLiveRoom ref="selectLiveRoom" @submit="handleSubmit" />
  </div>
</template>

<script>
import CreateClassPanel from './components/CreateClassPanel/index.vue'
import SelectClassPanel from './components/SelectClassPanel/index.vue'
import { getLiveRoomInfo } from '@/api/liveRoom/index'
import { getColumns } from './columns'
import dynamicTable from '@/components/DynamicTable/table'
import selectLiveRoom from './components/selectLiveRoom/index'
import { getOptionsValueByKey } from '@/filters/index'
import { mapGetters } from 'vuex'
import {
  getTempClassId,
  getCourseDetail,
  addCourseChapter,
  deleteCourseChapter,
  updateCourseChapter,
  addClass,
  copyClass
} from '@/api/liveRoom/course'
import { getDeliveryScheduleDetail } from '@/api/deliver/scheduleManagement'
import { addCourseUnlockConfig } from '@/api/unlock'
import {
  saleTaskPage,
  saleTaskAdd,
  saleTaskRemove
} from '@/api/privateArea/toolbox'
import LiveRoomList from './components/LiveRoomList/index.vue'
import moment from 'moment'

export default {
  name: 'LiveRoomSetting',
  components: {
    CreateClassPanel,
    SelectClassPanel,
    dynamicTable,
    selectLiveRoom,
    LiveRoomList
  },
  props: {
    type: {
      default: 'add',
      type: String
    },
    taskStatus: {
      default: '1',
      type: String
    },
    courseType: {
      default: 1,
      type: Number
    },
    taskcopyId: {
      default: '',
      type: String
    },
    classId: {
      default: '',
      type: String
    }
  },
  data() {
    return {
      // courseType === 1 的数据
      tempClassId: '',
      tempId: '',
      selectClassType: 1,
      configData: {
        classForm: {
          className: '',
          classOpeningTime: '',
          capacityQuantity: '',
          goodsIdList: [],
          classType: 2,
          scheduleId: '',
          courseUnlockType: 1,
          certificateId: '',
          certificateName: '',
          courseUnlockId: '',
          autoEnterClass: 1,
          dateEnterClass: 0
        },
        chapterForm: {
          chapterName: '',
          chapterType: '',
          sort: '',
          parentId: '',
          playback: 1,
          level: '',
          scheduleId: '',
          chapterContents: [
            {
              contentDetail: '',
              contentId: '',
              contentUrl: ''
            }
          ]
        },
        chapterTable: [],
        classRules: {
          className: [
            { required: true, message: '请输入班级名称', trigger: 'blur' }
          ],
          goodsIdList: [
            { required: true, message: '请输入课程名称', trigger: 'blur' }
          ],
          classOpeningTime: [
            { required: true, message: '请选择开班时间', trigger: 'blur' },
            {
              validator: (rule, value, callback) => {
                // 如果没有设置最小开班时间,则跳过验证
                if (!this.configData.minClassOpeningTime) {
                  callback()
                  return
                }

                try {
                  // 将日期字符串转换为时间戳
                  const valueTimestamp = new Date(value).getTime()
                  const minTimeTimestamp = new Date(
                    this.configData.minClassOpeningTime
                  ).getTime()

                  // 检查时间戳是否有效
                  if (isNaN(valueTimestamp) || isNaN(minTimeTimestamp)) {
                    return callback(new Error('日期格式无效'))
                  }

                  // 使用时间戳进行比较
                  if (valueTimestamp < minTimeTimestamp) {
                    return callback(new Error('开班时间不能小于任务开始时间'))
                  }

                  callback()
                } catch (err) {
                  callback(new Error('日期验证出错'))
                }
              },
              trigger: 'blur'
            }
          ],
          capacityQuantity: [
            { required: true, message: '请输入班级人数', trigger: 'blur' },
            {
              validator: (rule, value, callback) => {
                if (value < this.configData.minCapacityQuantity) {
                  return callback(new Error('计划班级人数不能小于接量人数'))
                }
                callback()
              },
              trigger: 'blur'
            }
          ],
          courseUnlockType: [
            { required: true, message: '请选择解锁方式', trigger: 'blur' }
          ]
        },
        chapterRules: {
          parentId: [
            { required: true, message: '请选择上级章节', trigger: 'blur' }
          ],
          chapterName: [
            { required: true, message: '请输入章节名称', trigger: 'blur' }
          ],
          chapterType: [
            { required: true, message: '请选择章节类型', trigger: 'blur' }
          ],
          chapterContents: [
            {
              required: true,
              message: '请选择直播间',
              trigger: 'blur'
            },
            {
              validator: (rule, value, callback) => {
                if (this.configData.chapterForm.chapterType === 4) {
                  if (!value[0] || !value[0].contentDetail) {
                    callback(new Error('请选择直播间'))
                  } else {
                    callback()
                  }
                } else {
                  callback()
                }
              },
              trigger: ['blur', 'change']
            }
          ],
          sort: [{ required: true, message: '请输入排序值', trigger: 'blur' }],
          playback: [
            { required: true, message: '请选择回放设置', trigger: 'blur' }
          ]
        },
        dialogVisible: false,
        goodsName: [],
        minClassOpeningTime: '',
        minCapacityQuantity: 0
      },
      liveRoomList: [],
      messageList: [],
      visible: false,
      loading: false,
      title: '复制直播间',
      liveRoomId: '',
      createUserName: '',
      createUserId: '',
      success: () => {},
      fail: () => {},
      top: '114px',
      // courseType === 0 的数据
      form: { dataType: 1 },
      tableData: [],
      columns: [],
      isLive: true,
      taskId: '',
      liveModelOption: [
        {
          label: '真人直播',
          value: 'PERSON_LIVE',
          background: '#E7F0FF',
          color: '#0C6FFF',
          icon: 'icon_PERSON_LIVE'
        },
        {
          label: '数字直播',
          value: 'AI_LIVE',
          background: '#E6F7EA',
          color: '#00B42A',
          icon: 'icon_AI_LIVE'
        },
        {
          label: '数字人直播',
          value: 'DIGITAL_PERSON_LIVE',
          background: '#E7F9FF',
          color: '#0099FF',
          icon: 'icon_DIGITAL_PERSON_LIVE'
        }
      ],
      permsList: this.$route?.meta?.permsList || []
    }
  },
  computed: {
    ...mapGetters(['userInfo']),
    disabled() {
      return this.type === 'edit' && this.taskStatus === '4'
    }
  },
  watch: {
    classId: {
      async handler(newVal) {
        if (newVal && this.courseType === 1) {
          !this.taskcopyId && (await this.getDeliveryScheduleDetail(newVal))
          await this.getCourseDetail(newVal)
          if (this.taskcopyId) {
            const res = await copyClass({
              scheduleId: this.classId
            })
            this.tempId = res.data
            await this.getCourseDetail(this.tempId)
          }

          this.extractLiveRooms(this.configData.chapterTable)
        }
      },
      immediate: true
    },
    courseType: {
      handler(newVal) {
        this.columns = newVal === 0 ? getColumns.call(this) : []
      },
      immediate: true
    }
  },
  async mounted() {
    this.top = Math.abs(window.innerHeight - 740) / 2 + 'px'
    this.messageList = []
    if (this.type === 'add') {
      await this.getTempClassId()
    }
  },
  methods: {
    // courseType === 1 的方法
    async getTempClassId() {
      const res = await getTempClassId()
      this.tempClassId = res.data
      this.configData.classForm.scheduleId = res.data
      this.configData.chapterForm.scheduleId = res.data
    },
    async getDeliveryScheduleDetail(classId) {
      const res = await getDeliveryScheduleDetail(classId)
      this.configData.classForm = {
        className: res.data.scheduleNum,
        classOpeningTime: res.data.deliveryStartTime,
        capacityQuantity: res.data.capacity,
        goodsIdList: res.data.goodsIdList,
        scheduleId: res.data.id,
        courseUnlockId: res.data.courseUnlockId || '',
        courseUnlockType: res.data.courseUnlockType || 1,
        certificateId: res.data.certificateId || '',
        certificateName: res.data.certificateName || '',
        autoEnterClass: res.data.autoEnterClass || 1,
        dateEnterClass: res.data.dateEnterClass || 0,
        dateEnterClassStartTime: res.data.dateEnterClassStartTime || '',
        dateEnterClassEndTime: res.data.dateEnterClassEndTime || ''
      }

      this.configData.goodsName = res.data.goodsNameList
      this.tempClassId = res.data.id
    },
    async getCourseDetail(tempClassId) {
      const res = await getCourseDetail(tempClassId)
      this.configData.chapterTable = res.data
    },
    async handleCreateClassSubmit(type, data) {
      if (type === 'add') {
        const res = await addCourseChapter({
          ...data,
          scheduleId: this.taskcopyId ? this.tempId : this.tempClassId
        })
        if (res.code === 1) {
          this.$message.success('新增章节成功')
          if (this.taskcopyId) {
            this.getCourseDetail(this.tempId)
          } else {
            this.getCourseDetail(this.classId || this.tempClassId)
          }

          // 如果是直播类型章节,同步更新 liveRoomList
          // if (data.chapterType === 4) {
          //   await this.extractLiveRooms(await this.getUpdatedChapterTable())
          // }
        }
      } else {
        const res = await updateCourseChapter({
          ...data,
          scheduleId: this.taskcopyId ? this.tempId : this.tempClassId
        })
        if (res.code === 1) {
          this.$message.success('编辑章节成功')
          if (this.taskcopyId) {
            this.getCourseDetail(this.tempId)
          } else {
            this.getCourseDetail(this.classId || this.tempClassId)
          }

          // 如果是直播类型章节,同步更新 liveRoomList
          // if (data.chapterType === 4) {
          //   await this.extractLiveRooms(await this.getUpdatedChapterTable())
          // }
        }
      }
    },
    async handleDelete(row) {
      const res = await deleteCourseChapter({ id: row.id })
      if (res.code === 1) {
        this.$message.success('删除章节成功')
        if (this.taskcopyId) {
          this.getCourseDetail(this.tempId)
        } else {
          this.getCourseDetail(this.classId || this.tempClassId)
        }

        // 如果删除的是直播类型章节或者包含直播类型的目录章节,都需要同步更新 liveRoomList
        if (row.chapterType === 4 || this.hasLiveChapter(row)) {
          await this.extractLiveRooms(await this.getUpdatedChapterTable())
        }
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
    // 递归提取chapterType=4的数据
    async extractLiveRooms(chapters) {
      console.log(chapters, 'chapters')
      // 在提取新数据前先清空数组
      this.liveRoomList = []

      // 收集所有的Promise
      const promises = []

      const extractRoom = chapter => {
        if (chapter.chapterType === 4 && chapter.chapterContents?.[0]) {
          const params = {
            liveRoomId: chapter.chapterContents[0].contentDetail
          }
          promises.push(
            getLiveRoomInfo(params).then(res => {
              const realityTeacherUser = []
              const tutorTeacherUser = []
              const defaultDisabledUser = []
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

              const parentChapterName = this.findChapterById(
                chapters,
                chapter.parentId
              )?.chapterName
              this.liveRoomList.push({
                parentChapterName,
                parentChapterId: chapter.parentId,
                chapterName: chapter.chapterName,
                chapterType: chapter.chapterType,
                sort: chapter.sort,
                parentId: chapter.parentId,
                playback: chapter.playback,
                level: chapter.level,
                id: chapter.id,
                liveRoomId: res.data.liveRoomId,
                liveModel: res.data.liveModel,
                displayMode: res.data.displayMode || 1,
                name: res.data.name,
                createUserName: res.data.createUserName,
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
                startTime: '',
                startTime1: moment().format('YYYY-MM-DD'),
                startTime2: '',
                realityTeacherUser,
                tutorTeacherUser,
                isShow: res.data.isShow,
                playbackSet: res.data.playbackSet,
                status: res.data.status,
                recordingTeacherId:
                  res.data.liveRoomIntelligentInfo.videoTeacherId, // 录播讲师ID
                recordingTeacherName:
                  res.data.liveRoomIntelligentInfo.videoTeacherName, // 录播讲师名称
                scriptId: res.data.liveRoomIntelligentInfo.scriptId, // 互动脚本ID
                scriptName: res.data.liveRoomIntelligentInfo.scriptName, // 互动脚本名称
                videoId: res.data.liveRoomIntelligentInfo.videoId, // 录播视频ID
                videoName: res.data.liveRoomIntelligentInfo.videoName, // 录播视频名称
                copyOption: ['isApply', 'isGoods', 'isCoupon'],
                isRepeatedViewing:
                  res.data.liveRoomIntelligentInfo.isRepeatedViewing
              })
            })
          )
        }

        // 递归处理子章节
        if (chapter.childrenChapter && chapter.childrenChapter.length > 0) {
          chapter.childrenChapter.forEach(child => extractRoom(child))
        }
      }

      // 处理所有章节
      chapters.forEach(chapter => extractRoom(chapter))

      // 等待所有请求完成
      await Promise.all(promises)
    },

    // courseType === 0 的方法
    getOptionsValueByKey,
    async handleSubmit(tableData) {
      const list = tableData.map(i => {
        return {
          ...i,
          teacherNames: i.teacherInfoDtoList
            ?.filter(i => i.teacherRole === 0)
            .map(i => i.teacherName),
          liveId: i.id,
          id: undefined,
          createTime: new Date().toISOString()
        }
      })
      if (this.type === 'add') {
        this.tableData = list
      } else {
        const lives = list.map(i => {
          return {
            liveCode: i.code,
            liveId: i.liveId
          }
        })
        const params = {
          lives,
          taskId: this.taskId
        }
        const { code } = await saleTaskAdd(params)
        if (code === 1) {
          this.$message.success('新增成功')
          this.$nextTick(() => {
            this.$refs.table && this.$refs.table.onRefresh()
          })
        }
      }
    },

    setData(row) {
      this.form = row
      this.taskId = row.id
      this.isLive = row.isLive
      if (this.type === 'edit' || this.type === 'detail') {
        this.$nextTick(() => {
          this.$refs.table && this.$refs.table.onRefresh()
        })
      } else {
        this.tableData = this.form.liveTableData
      }
    },

    getList() {
      return saleTaskPage({
        taskId: this.taskId || this.form.id
      }).then(({ data }) => {
        return {
          data: {
            items: data ?? []
          }
        }
      })
    },

    handleSelectLiveRoom() {
      this.$refs.selectLiveRoom.open()
    },

    delModal(row) {
      this.$delModal({
        tips: '是否确定操作?',
        success: () => {
          this.handleDel(row)
        }
      })
    },

    async handleDel(row) {
      if (this.type === 'add') {
        const index = this.tableData.findIndex(i => i.liveId === row.liveId)
        this.tableData.splice(index, 1)
      } else {
        const { code } = await saleTaskRemove({
          liveId: row.liveId,
          taskId: this.taskId
        })
        if (code === 1) {
          this.$nextTick(() => {
            this.$refs.table.onRefresh()
          })
        }
      }
    },

    // 共用方法
    handleBackStep() {
      if (this.courseType === 0) {
        const lives =
          this.tableData?.map(i => ({
            liveCode: i.code,
            liveId: i.liveId
          })) || []
        const params = {
          isLive: this.isLive,
          lives,
          liveTableData: this.tableData
        }
        if (this.type !== 'edit') {
          this.$emit('addForm', { ...this.form, ...params })
        }
      }
      this.$emit('backStep')
    },
    async handleNextStep() {
      if (this.courseType === 1) {
        if (this.selectClassType === 2) {
          this.$emit(
            'save',
            this.$refs.selectClassPanelRef.selectedRow,
            this.courseType
          )
          return
        }
        // 先校验班级表单
        const valid =
          await this.$refs.createClassPanelRef.handleValidClassForm()

        if (!valid) {
          return
        }

        // 校验是否有课程目录
        if (
          this.selectClassType === 1 &&
          !this.configData.chapterTable.length
        ) {
          this.$refs.createClassPanelRef.showChapterError = true
          return
        }

        // 校验是否有班级
        if (this.selectClassType === 2 && !this.configData.classForm.classId) {
          this.$refs.selectClassPanelRef.showClassError = true
          return
        }

        if (this.liveRoomList.length > 0 && this.taskcopyId) {
          for (let i = 0; i < this.liveRoomList.length; i++) {
            try {
              const res = await this.$refs.LiveRoomListRef.sure(i)
              if (!res) {
                return
              }
              const tempItem = this.liveRoomList[i]
              await updateCourseChapter({
                chapterName: tempItem.chapterName,
                chapterType: tempItem.chapterType,
                sort: tempItem.sort,
                parentId: tempItem.parentId,
                playback: tempItem.playback,
                level: tempItem.level,
                id: tempItem.id,
                chapterContents: [
                  {
                    contentDetail: res.data.newLiveRoomId,
                    contentName: tempItem.name
                  }
                ],
                scheduleId: this.taskcopyId ? this.tempId : this.tempClassId
              })
            } catch (error) {
              console.error('复制直播间失败:', error)
              return
            }
          }
        }
        // 检测chapterTableData以及childrenChapter中是否存在非目录类型的章节
        const checkNonDirectoryChapter = chapters => {
          for (const chapter of chapters) {
            if (chapter.chapterType !== 1) {
              return true
            }
            if (chapter.childrenChapter && chapter.childrenChapter.length) {
              if (checkNonDirectoryChapter(chapter.childrenChapter)) {
                return true
              }
            }
          }
          return false
        }

        const hasNonDirectoryChapter = checkNonDirectoryChapter(
          this.configData.chapterTable
        )
        if (!hasNonDirectoryChapter) {
          this.$message.error('课程目录中至少需要包含一个非目录类型的章节')
          return
        }

        if (!this.configData.classForm.courseUnlockId) {
          const res = await addCourseUnlockConfig({
            unlockType: 1
          })
          this.configData.classForm.courseUnlockId = res.id
        }
        await addClass({
          ...this.configData.classForm,
          scheduleId: this.taskcopyId ? this.tempId : this.tempClassId
        })

        this.$emit(
          'save',
          this.taskcopyId ? this.tempId : this.tempClassId,
          this.courseType
        )
      } else {
        const lives =
          this.tableData?.map(i => ({
            liveCode: i.code,
            liveId: i.liveId
          })) || []
        const params = {
          isLive: this.isLive,
          lives,
          liveTableData: this.tableData
        }
        if (this.form.dataType === 1) {
          this.$emit('nextStep', { ...this.form, ...params })
        } else {
          this.$emit('save', { ...this.form, ...params }, this.courseType)
        }
      }
    },

    // 添加检查章节是否包含直播类型的辅助方法
    hasLiveChapter(chapter) {
      if (chapter.chapterType === 4) {
        return true
      }
      if (chapter.childrenChapter && chapter.childrenChapter.length > 0) {
        return chapter.childrenChapter.some(child => this.hasLiveChapter(child))
      }
      return false
    },

    // 获取最新的章节表数据
    async getUpdatedChapterTable() {
      const res = await getCourseDetail(
        this.taskcopyId ? this.tempId : this.tempClassId
      )
      if (res.code === 1) {
        return res.data || []
      }
      return []
    }
  }
}
</script>

<style lang="scss" scoped>
.live-room-setting {
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 0 20px 60px;
  overflow-y: auto;

  .copyLiveRoom {
    max-height: 622px;
    padding: 20px 20px 0 20px;
    .copyLiveRoomTitle {
      font-size: 20px;
      font-weight: bold;
      text-align: center;
      margin-bottom: 20px;
    }
  }

  .setting-footer {
    width: 80%;
    position: fixed;
    right: 0;
    bottom: 0;
    height: 60px;
    padding: 0 20px;
    border-top: 1px solid #e7e7e7;
    background-color: #fff;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    z-index: 10;
  }

  .copyLiveRoom {
    max-height: 622px;
    padding: 20px 20px 0 20px;
    .copyLiveRoomTitle {
      font-size: 20px;
      font-weight: bold;
      text-align: center;
      margin-bottom: 20px;
    }
  }
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

.setting-container ::v-deep {
  display: flex;
  flex-direction: column;
  flex: 1;
  .setting-content {
    padding: 0 20px;
    display: flex;
    flex-direction: column;
    flex: 1;
  }
  .setting-header {
    margin-bottom: 30px;
    .el-switch__label {
      color: #333;
    }
    .tips {
      font-size: 12px;
      color: #999999;
      font-weight: 400;
      margin-left: 10px;
    }
  }
  .setting-btn {
    margin-bottom: 16px;
  }
  .el-dialog__header {
    border-bottom: 1px solid #e7e7e7;
  }
  .filter-container {
    padding: 0px;
  }
  .my-table {
    margin: 0px;
  }
  .dialog-table {
    flex: 1;
    border-radius: 6px;
    border-top: 1px solid #eff2f6;
    border-left: 1px solid #eff2f6;
    border-right: 1px solid #eff2f6;
    .page_content {
      padding-bottom: 0px;
    }
  }
  .setting-footer {
    margin-top: 30px;
    padding: 0 20px;
    height: 60px;
    border-top: 1px solid #e7e7e7;
    display: flex;
    align-items: center;
    justify-content: flex-start;
  }
}
</style>
