<template>
  <!-- 文件展示区域 -->
  <div class="file-show">
    <template v-if="showExtractDetail">
      <!-- 提取详情 -->
      <ExtractDetail v-bind="extractDetailInfo" @back="backToIndex" />
    </template>

    <template v-else>
      <!-- 文件搜索区域 -->
      <div class="file-search">
        <el-input
          v-model="pageParams.keywords"
          class="search-input"
          clearable
          placeholder="请输入标题或关键字搜索"
          @keyup.enter.native="handleSearchClick"
          @clear="handleSearchClearClick"
          @input="handleSearchInput"
        ><div slot="prefix" class="search-icon">
          <svg-icon icon-class="_search" /></div></el-input>

        <div class="time-tabs">
          <div
            v-for="(item, index) in timeTabs"
            :key="item"
            :class="[
              'tabs-item',
              currentTimeTabIndex === index ? 'active' : ''
            ]"
            @click="handleTimeTabsClick('query', index)"
          >
            {{ item }}
          </div>
        </div>
      </div>

      <!-- 文件列表区域 -->
      <div class="file-list-warpper" @scroll="handleScroll">
        <ul class="file-list">
          <template v-if="fileList.length">
            <FileCard
              v-for="(item, index) in fileList"
              :key="index"
              v-bind="item"
              class="file-card"
              @delete="handleDelete(item)"
              @retry="handleRetry(item)"
              @click="handleFileCardClick(item)"
            />
          </template>
          <!-- 是否加载完毕 -->
          <div v-if="loading" class="loading-box">
            <svg-icon class="loading-icon" icon-class="_loading" />
          </div>

          <!-- 是否空数据 -->
          <template v-if="!fileList.length && !loading">
            <div class="empty-fileList">
              <img src="@/assets/image/aiIcon.gif" />
              <span>暂未产生任意记录</span>
            </div>
          </template>
        </ul>
      </div>

      <!-- 自定义弹框 -->
      <CustomDialog
        v-bind="dialogDetailObj"
        :visiable="showDialog"
        @close="handleClose"
        @confirm="handleConfirm"
      />
    </template>
  </div>
</template>

<script>
import moment from 'moment'
import CustomDialog from '../custom-dialog.vue'
import FileCard from './components/file-card.vue'
import ExtractDetail from '../../detail/index.vue'
import { timeTabs } from './config'
import { queryTaskDetail, reTryTask } from '@/api/aigc/chatExtract'

export default {
  components: { FileCard, CustomDialog, ExtractDetail },
  props: {
    // 查询参数
    pageParams: {
      type: Object,
      default() {
        return {
          // 当前页数
          pageIndex: 1,
          // 每页显示的条数
          pageSize: 20,
          // 开始时间
          startTime: '',
          // 结束时间
          endTime: ''
        }
      }
    },
    // 文件上传列表
    fileList: {
      type: Array,
      default: () => []
    },
    // 文件加载中
    loading: {
      type: Boolean,
      default: false
    },
    // 没有更多了
    isNoMore: {
      type: Boolean,
      default: false
    },
    wordExtractIndex: {
      type: Number,
      default: 0
    }
  },
  inject: ['clearChatMessage'],
  data() {
    return {
      // 时间tabs
      timeTabs: [],
      // 当前时间选项下标
      currentTimeTabIndex: 0,
      // 是否显示弹框
      showDialog: false,
      // 自定义弹框内容
      dialogDetailObj: {},
      // 是否展示提取详情
      showExtractDetail: false,
      // 提取详情信息
      extractDetailInfo: {
        // 模板标题
        title: '',
        // 关键词数组
        keyword: [],
        // 模板内容
        content: ''
      }
    }
  },
  mounted() {
    // 初始化配置
    this.initConfig()
  },
  methods: {
    // 初始化配置
    initConfig() {
      // 时间tab配置
      this.timeTabs = timeTabs
    },
    handleScroll(event) {
      // 获取滚动元素
      const container = event.target

      // 计算滚动位置
      const scrollTop = container.scrollTop

      // 计算元素高度
      const containerHeight = container.clientHeight

      // 计算内容高度
      const contentHeight = container.scrollHeight

      // 判断是否触底
      if (scrollTop + containerHeight >= contentHeight - 10) {
        // 触底事件处理逻辑
        this.load()
      }
    },
    // 下拉加载
    async load() {
      if (!this.isNoMore) {
        this.$emit('update:loading', true)

        this.pageParams = {
          ...this.pageParams,
          pageIndex: ++this.pageParams.pageIndex
        }

        this.$emit('query', this.pageParams, 'load')
      }
    },
    // 重置pageParams
    resetPageParams(type, index) {
      let todayStart, todayEnd, yesterdayStart, yesterdayEnd, startOfLast7Days

      if (type === 'search') {
        todayStart = moment().startOf('day').valueOf()
        todayEnd = moment().endOf('day').valueOf()
        yesterdayStart = moment().subtract(1, 'days').startOf('day').valueOf()
        yesterdayEnd = moment().subtract(1, 'days').endOf('day').valueOf()
        startOfLast7Days = moment().subtract(7, 'days').startOf('day').valueOf()
      } else {
        todayStart = moment().startOf('day').format('YYYY-MM-DD HH:mm:ss')
        todayEnd = moment().endOf('day').format('YYYY-MM-DD HH:mm:ss')
        yesterdayStart = moment()
          .subtract(1, 'days')
          .startOf('day')
          .format('YYYY-MM-DD HH:mm:ss')
        yesterdayEnd = moment()
          .subtract(1, 'days')
          .endOf('day')
          .format('YYYY-MM-DD HH:mm:ss')
        startOfLast7Days = moment()
          .subtract(7, 'days')
          .startOf('day')
          .format('YYYY-MM-DD HH:mm:ss')
      }

      const timeRanges = [
        { startTime: todayStart, endTime: todayEnd },
        { startTime: yesterdayStart, endTime: yesterdayEnd },
        {
          startTime: startOfLast7Days,
          endTime: todayEnd
        }
      ]

      const pageParams = {
        pageIndex: 1,
        pageSize: 20,
        keywords: this.pageParams.keywords,
        ...timeRanges[index] // 默认选择今天时间范围
      }

      return pageParams
    },
    // 时间tab点击
    handleTimeTabsClick(type, index = 0) {
      this.$uweb?.setAction('Event_ChatExtrac_SwitchTab')
      this.currentTimeTabIndex = index
      const pageParams = this.resetPageParams(type, index)
      this.$emit('query', pageParams)
    },
    // 搜索点击
    handleSearchClick() {
      this.$uweb?.setAction('Event_ChatExtrac_ClickSearch')
      const params = this.resetPageParams('search', this.currentTimeTabIndex)

      if (this.pageParams.keywords) {
        this.$emit('search', params)
      } else {
        this.$emit('query')
      }
    },
    // 搜索清空
    handleSearchClearClick() {
      this.$uweb?.setAction('Event_ChatExtrac_ClickSearch')
      const params = {
        // 当前页数
        pageIndex: this.pageParams.pageIndex,
        // 每页显示的条数
        pageSize: this.pageParams.pageSize,
        // 开始时间
        startTime: this.pageParams.startTime,
        // 结束时间
        endTime: this.pageParams.endTime
      }

      this.$emit('query', params)
    },
    // 搜索输入监听
    handleSearchInput(val) {
      if (val === '') {
        this.handleSearchClearClick()
      }
    },
    // 文件删除点击
    handleDelete(item) {
      this.dialogDetailObj.id = item.taskId

      if (item.taskStatus === 'PENDING') {
        this.dialogDetailObj.content =
          '删除该任务后，将中断提取流程，是否继续删除？'
      } else if (item.taskStatus === 'DONE') {
        this.dialogDetailObj.content =
          '删除后提取及改写内容将被同时清空，是否继续删除？'
      } else if (item.taskStatus === 'UPLOADING') {
        this.dialogDetailObj.content =
          '删除该任务后，将中断上传流程，是否继续删除？'
      } else if (item.taskStatus === 'FAILED') {
        this.dialogDetailObj.content = '删除后任务将不再显示，是否继续删除？'
      }

      this.showDialog = item.taskStatus !== 'WAITING'
    },
    // 重新上传文件
    async handleRetry(item) {
      this.$uweb?.setAction('Event_ChatExtrac_ClickRetry')
      const params = {
        taskId: item.taskId
      }
      await reTryTask(params)
      this.$emit('query')
    },
    // 文件卡片点击
    async handleFileCardClick(item) {
      if (item.taskStatus === 'DONE') {
        this.$uweb?.setAction('Event_ChatExtrac_ClickExtracRecord')

        const params = {
          taskId: item.taskId
        }
        const { code, data } = await queryTaskDetail(params)

        if (code === 1) {
          this.extractDetailInfo = {
            ...data,
            conversationId: item.taskId,
            wordExtractIndex: this.wordExtractIndex
          }
          this.showExtractDetail = true
        }
      }
    },
    // 关闭弹框
    handleClose() {
      this.showDialog = false
    },
    // 确认弹框
    async handleConfirm(taskId) {
      this.$emit('delete', taskId)
    },
    // 返回至首页
    backToIndex() {
      this.clearChatMessage()
      this.showExtractDetail = false
      const pageParams = this.resetPageParams('query', this.currentTimeTabIndex)
      this.$emit('query', pageParams)
    }
  }
}
</script>

<style scoped lang="scss">
/* 小于 941px */
@media (max-width: 940.98px) {
  .file-show .file-list-warpper .file-list .file-card {
    width: calc(100% - 10px) !important;
  }
}

/* 大于等于 941px 且小于 1233px */
@media (min-width: 941px) and (max-width: 1232.98px) {
  .file-show .file-list-warpper .file-list .file-card {
    width: calc((100% - 20px) / 2) !important;
  }
}

/* 大于等于 1233px 且小于 1920px */
@media (min-width: 1233px) and (max-width: 1919.98px) {
  .file-show .file-list-warpper .file-list .file-card {
    width: calc((100% - 40px) / 3) !important;
  }
}

/* 大于等于 1920px */
@media (min-width: 1920px) {
  .file-show .file-list-warpper .file-list .file-card {
    width: calc((100% - 60px) / 4) !important;
  }
}

.file-show {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 47px;
  margin-top: 48px;

  .file-search {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 24px;
    gap: 30px;

    .search-input {
      max-width: 25%;
      min-width: 150px;

      .search-icon {
        height: 100%;
        display: flex;
        align-items: center;
        margin-left: 5px;
      }
    }

    .time-tabs {
      display: flex;
      align-items: center;
      font-size: 14px;

      .tabs-item {
        padding: 5px 12px;
        border-radius: 8px;
        cursor: pointer;
      }

      .active {
        background: #5696ff;
        color: #ffffff;
      }
    }
  }

  .file-list-warpper {
    width: 100%;
    height: calc(100vh - 408.52px);
    overflow-y: auto;

    .file-list {
      position: relative;
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      gap: 20px;

      .file-card {
        width: calc((100% - 60px) / 4);

        height: 100px;
      }

      .empty-fileList {
        width: 100%;
        position: absolute;
        top: 90px;
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

      .loading-box,
      .no-more-box {
        width: 100%;
        text-align: center;
        position: absolute;
        top: 90px;

        span {
          color: #9f9f9f;
          font-size: 14px;
        }

        .loading-icon {
          width: 16px;
          height: 16px;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      }
    }
  }
}
</style>
