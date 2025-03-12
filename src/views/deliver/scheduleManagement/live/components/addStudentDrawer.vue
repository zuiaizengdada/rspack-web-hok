<template>
  <!-- 班期详情弹框 -->
  <el-drawer
    :size="1038"
    :visible.sync="config.visible"
    v-bind="$attrs"
    :with-header="false"
    :destroy-on-close="true"
    :wrapper-closable="true"
    :close-on-press-escape="false"
    v-on="$listeners"
  >
    <div class="drawerBody">
      <div class="flex-1">
        <div>
          <div class="p-20 border-b border-#EFF2F6" style="height: 60px">
            <p class="font-bold text-16">
              {{ getTitle() }}
            </p>
          </div>
          <div style="padding: 20px">
            <create-class-panel
              ref="createClassPanelRef"
              :config-data.sync="configData"
              :open-time-disabled="
                config.scheduleStatus === 2 && config.editStatus
              "
              :type="config.type"
              :is-class-type="true"
              @submit="handleCreateClassSubmit"
              @delete="handleDelete"
              @getCourseDetail="getCourseDetail"
            />

            <LiveRoomList
              v-if="config.copyStatus"
              ref="LiveRoomListRef"
              :items.sync="liveRoomList"
            />
          </div>
        </div>
      </div>
      <div class="setting-footer">
        <el-button type="primary" size="small" @click="handleSave">
          保存
        </el-button>
        <!-- <el-button
          v-if="config.copyStatus"
          type="primary"
          size="small"
          @click="handleSave"
        >
          下一步
        </el-button> -->
        <el-button size="small" @click="handleCancel">取消</el-button>
      </div>
    </div>
  </el-drawer>
</template>

<script>
import {
  getTempClassId,
  getCourseDetail,
  addCourseChapter,
  deleteCourseChapter,
  updateCourseChapter,
  addClass,
  getScheduleDetail,
  getScheduleCourse,
  copyClass
} from '@/api/liveRoom/course'
import { getLiveRoomInfo } from '@/api/liveRoom/index'
import moment from 'moment'
import CreateClassPanel from '@/views/privateArea/CRM/components/liveRoomSetting/components/CreateClassPanel/index.vue'
import LiveRoomList from '@/views/privateArea/CRM/components/liveRoomSetting/components/LiveRoomList/index.vue'
export default {
  components: { CreateClassPanel, LiveRoomList },
  props: {
    config: {
      type: Object,
      default: () => {}
    },
    scheduleId: {
      type: [Number, String],
      default: ''
    },
    goodsId: {
      type: [Number, String],
      default: ''
    },
    current: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      openTimeDisabled: false,
      configData: {
        goodsNameInput: true,
        classForm: {
          className: '',
          classOpeningTime: '',
          capacityQuantity: '',
          goodsIdList: [],
          classType: 2,
          scheduleId: '',
          courseUnlockType: 1,
          autoEnterClass: 0,
          dateEnterClass: 0,
          dateEnterClassStartTime: '',
          dateEnterClassEndTime: ''
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
            { required: true, message: '请选择开班时间', trigger: 'blur' }
          ],
          capacityQuantity: [
            { required: true, message: '请输入班级人数', trigger: 'blur' }
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
        tempId: ''
      },
      liveRoomList: []
    }
  },
  computed: {},
  watch: {
    // props config
    config: {
      async handler(newVal) {
        this.initConfigData()
        if (newVal.copyStatus) {
          const { data } = await copyClass({
            scheduleId: this.config.id
          })
          this.tempId = data
          this.initData()
        }

        if (newVal.editStatus) {
          this.initData()
        }

        // 新增
        if (!newVal.editStatus && !newVal.copyStatus) {
          this.getTempClassId()
        }
      },
      deep: true
    }
  },
  methods: {
    initConfigData() {
      this.configData = {
        goodsNameInput: true,
        classForm: {
          className: '',
          classOpeningTime: '',
          capacityQuantity: '',
          goodsIdList: [],
          classType: 2,
          scheduleId: '',
          courseUnlockType: Number(1),
          autoEnterClass: 0,
          dateEnterClass: 0,
          dateEnterClassStartTime: '',
          dateEnterClassEndTime: ''
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
            { required: true, message: '请选择开班时间', trigger: 'blur' }
          ],
          capacityQuantity: [
            { required: true, message: '请输入班级人数', trigger: 'blur' }
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
        goodsName: []
      }
    },
    // 新增生成零时id
    async getTempClassId() {
      const res = await getTempClassId()
      this.tempClassId = res.data
      this.configData.classForm.scheduleId = this.tempClassId
      this.configData.chapterForm.scheduleId = this.tempClassId
    },
    containsDate(str) {
      const datePattern = /\b\d{4}-\d{2}-\d{2}\b/
      return datePattern.test(str)
    },
    async getScheduleDetail() {
      const { code, data } = await getScheduleDetail({ id: this.config.id })
      if (code === 1) {
        this.configData.classForm = {
          ...data,
          className: data.scheduleNum,
          classOpeningTime: this.config.copyStatus
            ? ''
            : data.deliveryStartTime,
          capacityQuantity: data.capacity,
          courseUnlockType: data.courseUnlockType || 1,
          autoEnterClass: this.config.copyStatus
            ? 0
            : this.config.editStatus
              ? data.autoEnterClass
              : 1
        }
        const time = moment().format('YYYY-MM-DD')
        if (!this.config.editStatus) {
          this.getTempClassId()
          const className = this.configData.classForm.className
          if (this.containsDate(className)) {
            this.configData.classForm.className = `${className} 1`
          } else {
            this.configData.classForm.className = `${className}  ${time}`
          }
        } else {
          this.configData.classForm.scheduleId = this.config.id
          this.configData.chapterForm.scheduleId = this.config.id
        }
      }
    },
    async getScheduleCourse() {
      let res
      if (this.config.copyStatus) {
        res = await getScheduleCourse({ id: this.tempId })
      } else {
        res = await getScheduleCourse({ id: this.config.id })
      }

      if (res.code === 1) {
        this.configData.chapterTable = res.data || []
      }
    },
    // 编辑复制 编辑获取详情
    async initData() {
      await this.getScheduleDetail()
      await this.getScheduleCourse()
      this.extractLiveRooms(this.configData.chapterTable)
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
    getTitle() {
      if (this.config.editStatus) {
        return '编辑'
      }
      if (this.config.copyStatus) {
        return '复制'
      }
      return '新增'
    },
    async getCourseDetail(tempClassId) {
      const res = await getCourseDetail(
        tempClassId || this.configData.classForm.scheduleId
      )
      this.configData.chapterTable = res.data
    },
    // 检查章节及其子章节是否包含直播类型
    hasLiveChapter(chapter) {
      if (chapter.chapterType === 4) {
        return true
      }
      if (chapter.childrenChapter && chapter.childrenChapter.length > 0) {
        return chapter.childrenChapter.some(child => this.hasLiveChapter(child))
      }
      return false
    },
    async handleDelete(row) {
      const res = await deleteCourseChapter({ id: row.id })
      if (res.code === 1) {
        this.$message.success('删除章节成功')
        if (this.config.copyStatus) {
          this.getCourseDetail(this.tempId)
        } else {
          this.getCourseDetail(this.config.id)
        }

        // 如果删除的是直播类型章节或者包含直播类型的目录章节,都需要同步更新 liveRoomList
        if (row.chapterType === 4 || this.hasLiveChapter(row)) {
          await this.extractLiveRooms(await this.getUpdatedChapterTable())
        }
      }
    },
    async handleCreateClassSubmit(type, data, showMessage = true) {
      console.log(type, 'type')
      console.log(data, 'data')
      console.log(showMessage, 'showMessage')
      if (type === 'add') {
        let res
        if (this.config.editStatus) {
          res = await addCourseChapter(data)
        } else {
          res = await addCourseChapter({
            ...data,
            scheduleId: this.config.copyStatus
              ? this.tempId
              : this.configData.classForm.scheduleId
          })
        }

        if (res.code === 1) {
          if (showMessage) {
            this.$message.success('新增章节成功')
          }
          if (this.config.copyStatus) {
            this.getCourseDetail(this.tempId)
          } else {
            this.getCourseDetail(this.config.id)
          }
        }
      } else {
        const res = await updateCourseChapter(data)
        if (res.code === 1) {
          this.$message.success('编辑章节成功')
          if (this.config.copyStatus) {
            this.getCourseDetail(this.tempId)
          } else {
            this.getCourseDetail(this.config.id)
          }

          // 如果是直播类型章节,同步更新 liveRoomList
          // if (data.chapterType === 4) {
          //   await this.extractLiveRooms(await this.getUpdatedChapterTable())
          // }
        }
      }
    },
    async handleAddSave() {
      // 先校验班级表单
      const res = await this.$refs.createClassPanelRef.handleValidClassForm()
      if (!res) {
        return
      }

      // 校验是否有课程目录
      if (!this.configData.chapterTable.length) {
        // 设置显示错误提示
        this.$refs.createClassPanelRef.showChapterError = true
        return
      }

      if (this.liveRoomList.length > 0 && this.config.copyStatus) {
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
              scheduleId: this.config.copyStatus
                ? this.tempId
                : this.tempClassId
            })
          } catch (error) {
            console.error('复制直播间失败:', error)
            return
          }
        }
      }

      let res2
      if (this.config.copyStatus) {
        res2 = await addClass({
          ...this.configData.classForm,
          scheduleId: this.tempId
        })
      } else {
        res2 = await addClass(this.configData.classForm)
      }
      if (res2.code === 1) {
        let msg = ''
        if (this.config.editStatus) {
          msg = '编辑班级成功'
        } else if (this.config.copyStatus) {
          msg = '复制班级成功'
        } else {
          msg = '新增班级成功'
        }
        this.$message.success(msg)

        this.$emit('success')
      }
    },
    handleSave() {
      if (this.config.editStatus) {
        this.handleAddSave()
        return
      }
      if (this.config.copyStatus) {
        this.handleAddSave()
        return
      }
      this.handleAddSave()
    },
    handleCancel() {
      this.config.visible = false
    },
    // 获取最新的章节表数据
    async getUpdatedChapterTable() {
      const res = await getScheduleCourse({
        id: this.config.copyStatus ? this.tempId : this.config.id
      })
      if (res.code === 1) {
        return res.data || []
      }
      return []
    }
  }
}
</script>

<style lang="scss" scoped>
.drawerBody {
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  .flex-1 {
    flex: 1;
  }
  .setting-footer {
    padding: 20px;
    border-top: 1px solid #dfe4ed !important;
  }
  .ss-material-box-header {
    box-sizing: border-box;
    height: 52px;
    display: flex;
    align-items: flex-end;
    position: relative;
    .mytabs {
      padding-left: 20px;
      border-bottom: 1px solid #dfe4ed;
      font-size: 14px;
      font-family: MicrosoftYaHei;
      color: #777777;
      line-height: 24px;
      display: flex;
      .mytabsView {
        margin-right: 21px;
        padding-bottom: 8px;
        cursor: pointer;
      }
      .active {
        font-size: 14px;
        font-family: MicrosoftYaHei;
        color: #0c6fff;
        line-height: 24px;
        border-bottom: 2px solid #0c6fff;
      }
    }
    .close {
      position: absolute;
      right: 20px;
      top: 22px;
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
  .drawerContent {
    flex: 1 0 0;
  }
  .ss-material-box-footer {
    padding-right: 18px;
    border-top: 1px solid #e7e7e7;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
}
::v-deep {
  .el-tabs__header {
    margin: 0;
  }
}
</style>
