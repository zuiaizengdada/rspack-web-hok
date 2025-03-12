<template>
  <div style="position: relative">
    <div
      ref="chatExtractRef"
      :class="['chat-extract', isShowDragMask ? 'child-disable-click' : '']"
      @dragenter.prevent="handleDragEnter"
      @dragover.prevent
      @dragleave.stop="handleDragLeave"
      @drop.prevent="handleDrop"
    >
      <!-- 文件上传区域 -->
      <FileUpload
        ref="fileUploadRef"
        :file-list="fileList"
        @query="getTaskList"
      />
      <!-- 文件展示区域 -->
      <FileShow
        v-if="isShowFileShow"
        :loading.sync="loading"
        :is-no-more="isNoMore"
        :page-params="pageParams"
        :file-list="fileList"
        :word-extract-index="wordExtractIndex"
        @query="handleQueryFileShow"
        @search="handleSearchTaskList"
        @delete="handleDelete"
      />
      <!-- 文件展示缺省 -->
      <div v-else class="file-show-empty">
        <img src="@/assets/image/aiIcon.gif" />
        <span>暂未产生任意记录</span>
      </div>
    </div>
    <!-- 拖拽遮罩层 -->
    <DragMask :visible.sync="isShowDragMask" />
  </div>
</template>

<script>
import FileUpload from './components/file-upload/index.vue'
import FileShow from './components/file-show/index.vue'
import DragMask from './components/drag-mask.vue'
import {
  queryTaskList,
  cancelTask,
  searchTaskList
} from '@/api/aigc/chatExtract'

import moment from 'moment'
export default {
  components: {
    DragMask,
    FileUpload,
    FileShow
  },
  props: {
    wordExtractIndex: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      // 是否显示遮罩层
      isShowDragMask: false,
      // 文件上传列表
      fileList: [],
      // 文件加载中
      loading: false,
      // 是否还有更多数据,
      isNoMore: false,
      // 查询参数
      pageParams: {
        // 当前页数
        pageIndex: 1,
        // 每页显示的条数
        pageSize: 20,
        // 开始时间
        startTime: '',
        // 结束时间
        endTime: ''
      },
      // 定时器对象
      timer: null,
      isShowFileShow: true
    }
  },
  watch: {
    // 监听文件上传列表
    fileList: {
      handler(val) {
        if (val.length > 0 && val.some(task => task.taskStatus === 'PENDING')) {
          this.checkTaskStatus()
        } else {
          // 停止定时器
          clearInterval(this.timer)
          // 重置定时器为 null
          this.timer = null
        }
      },
      deep: true,
      immediate: true
    }
  },
  async mounted() {
    if (!localStorage.getItem('uploadingFiles')) {
      localStorage.setItem('uploadingFiles', JSON.stringify([]))
    }
    this.resetPageParams()
    this.checkIsFileShow()
    // 获取任务列表
    await this.getTaskList(this.pageParams)
    this.$uweb?.setAction('Page_ChatExtract_ViewIndex')
  },
  beforeDestroy() {
    // 在组件销毁前清除定时器
    if (this.timer) {
      clearInterval(this.timer)
      // 重置定时器为 null
      this.timer = null
    }
  },
  methods: {
    // 鼠标拖拽移入目标区域
    handleDragEnter() {
      this.isShowDragMask = true
    },
    // 鼠标拖拽移出目标区域
    handleDragLeave(event) {
      if (event.target !== this.$refs.chatExtractRef) return

      this.isShowDragMask = false
    },
    // 鼠标拖拽松开
    handleDrop(event) {
      const files = event.dataTransfer.files

      if (files.length > 0) {
        this.$refs.fileUploadRef.handleFileUpload(files)
      }

      this.isShowDragMask = false
    },
    // 检查任务状态并启动或停止轮询
    checkTaskStatus() {
      if (!this.timer) {
        // 启动轮询
        this.timer = setInterval(() => {
          this.refreshTaskList()
        }, 3000)
      } else {
        // 如果所有任务都已完成，则停止轮询
        clearInterval(this.timer)
        // 重置定时器为 null
        this.timer = null
      }
    },
    // 过滤重复数据
    removeDuplicatesById(array) {
      // 使用 Set 跟踪已出现的 taskId
      const seenIds = new Set()
      // 过滤对象数组，去重
      return array.filter(item => {
        // 如果 taskId 未出现过，则添加到 Set 中，并保留该对象
        if (!seenIds.has(item.taskId)) {
          seenIds.add(item.taskId)
          return true
        }
        // 否则过滤掉重复的对象
        return false
      })
    },
    async checkIsFileShow() {
      const todayEnd = moment().endOf('day').format('YYYY-MM-DD HH:mm:ss')
      const startOfLast7Days = moment()
        .subtract(7, 'days')
        .startOf('day')
        .format('YYYY-MM-DD HH:mm:ss')
      const pageParams = {
        pageIndex: 1,
        pageSize: 20,
        startTime: startOfLast7Days,
        endTime: todayEnd
      }

      const {
        code,
        data: { items }
      } = await queryTaskList(pageParams)
      if (code === 1) {
        const uploadingFiles = JSON.parse(
          localStorage.getItem('uploadingFiles')
        )
        if (items.length || uploadingFiles.length) {
          this.isShowFileShow = true
        } else {
          this.isShowFileShow = false
        }
      }
    },
    // 获取任务列表
    async getTaskList(pageParams, type) {
      this.loading = true
      this.pageParams = pageParams ?? this.pageParams

      // 获取当前日期
      const today = new Date()
      const todayDateString = today.toISOString().split('T')[0] // 将日期转换为字符串形式，格式为 YYYY-MM-DD
      // 提取 startTime 的日期部分
      const startTimeDatePart = this.pageParams.startTime.split(' ')[0]
      const isToday = startTimeDatePart === todayDateString

      const {
        code,
        data: { hasNext, items }
      } = await queryTaskList(this.pageParams)

      if (code === 1) {
        this.checkIsFileShow()
        if (type === 'load' && items.length > 0) {
          if (isToday) {
            this.fileList = [
              ...JSON.parse(localStorage.getItem('uploadingFiles') || []),
              ...this.removeDuplicatesById([...this.fileList, ...items])
            ]
          } else {
            this.fileList = this.removeDuplicatesById([
              ...this.fileList,
              ...items
            ])
          }
        } else {
          this.checkIsFileShow()
          if (isToday) {
            this.fileList = [
              ...JSON.parse(localStorage.getItem('uploadingFiles') || []),
              ...this.removeDuplicatesById([...this.fileList, ...items])
            ]
          } else {
            this.fileList = this.removeDuplicatesById([
              ...this.fileList,
              ...items
            ])
          }
        }

        this.isNoMore = !hasNext
      }
      this.loading = false
    },
    // 刷新任务列表
    async refreshTaskList(pageParams) {
      this.pageParams = pageParams ?? this.pageParams
      const {
        code,
        data: { items }
      } = await queryTaskList(this.pageParams)

      if (code === 1) {
        this.fileList = items

        // 每次刷新任务列表后都重新检查任务状态
        this.checkTaskStatus()
      }
    },
    // 重置pageParams
    resetPageParams() {
      const todayStart = moment().startOf('day').format('YYYY-MM-DD HH:mm:ss')
      const todayEnd = moment().endOf('day').format('YYYY-MM-DD HH:mm:ss')
      const yesterdayStart = moment()
        .subtract(1, 'days')
        .startOf('day')
        .format('YYYY-MM-DD HH:mm:ss')
      const yesterdayEnd = moment()
        .subtract(1, 'days')
        .endOf('day')
        .format('YYYY-MM-DD HH:mm:ss')
      const startOfLast7Days = moment()
        .subtract(7, 'days')
        .startOf('day')
        .format('YYYY-MM-DD HH:mm:ss')

      const timeRanges = [
        { startTime: todayStart, endTime: todayEnd },
        { startTime: yesterdayStart, endTime: yesterdayEnd },
        {
          startTime: startOfLast7Days,
          endTime: todayEnd
        }
      ]

      this.pageParams = {
        pageIndex: 1,
        pageSize: 20,
        ...timeRanges[0] // 默认选择今天时间范围
      }

      return timeRanges
    },
    // 删除文件
    async handleDelete(taskId) {
      let uploadingFiles = JSON.parse(localStorage.getItem('uploadingFiles'))

      const uploadingFile = uploadingFiles.find(file => file.taskId === taskId)

      if (uploadingFile) {
        uploadingFiles = uploadingFiles.filter(file => file.taskId !== taskId)

        localStorage.setItem('uploadingFiles', JSON.stringify(uploadingFiles))

        this.$refs.fileUploadRef.uploadCancel()

        this.$message({
          message: '取消上传成功',
          type: 'success',
          customClass: 'amap-sug-result'
        })
        await this.getTaskList()

        return
      }

      const params = {
        taskId
      }
      const { code } = await cancelTask(params)

      if (code === 1) {
        this.$message({
          message: '删除成功',
          type: 'success',
          customClass: 'amap-sug-result'
        })
        this.checkIsFileShow()
        await this.getTaskList()
      }
    },
    // 查询文件展示列表
    handleQueryFileShow(pageParams, type) {
      if (type !== 'load') {
        this.fileList = []
      }

      this.getTaskList(pageParams, type)
    },
    // 搜索文件展示列表
    async handleSearchTaskList(pageParams) {
      const { code, data } = await searchTaskList(pageParams)

      if (code === 1) {
        this.fileList = data.items
      }
    }
  }
}
</script>

<style scoped lang="scss">
::v-deep .el-input--prefix .el-input__inner {
  padding-left: 30px !important;
}

::v-deep .el-input__inner {
  border-radius: 8px !important;
}

// 滚动条样式
::v-deep ::-webkit-scrollbar {
  width: 3px;
  height: 3px;
  background-color: transparent;
}
::v-deep ::-webkit-scrollbar-thumb {
  border-radius: 6px;
  background: #d0d0d0;
  transition: all 0.4s ease;
}

::v-deep ::-webkit-scrollbar-track {
  background: #fff;
}

.chat-extract {
  width: 100%;
  height: calc(100vh - 50px);
  display: flex;
  flex-direction: column;
  overflow: auto;
  background: linear-gradient(224.7deg, #f8fbff 0%, #f9fcff 100%);
}

.drag-mask {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
  pointer-events: none;
}

// 所有子元素禁止点击
.child-disable-click * {
  pointer-events: none;
}

.file-show-empty {
  width: 100%;
  position: absolute;
  top: 45%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  img {
    width: 120px;
    height: 120px;
    -webkit-user-drag: none;
  }

  span {
    color: #9f9f9f;
    font-size: 14px;
  }
}
</style>
