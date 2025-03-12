<template>
  <div v-loading="loading" class="lesson-content">
    <div v-if="empty" class="noLesson">
      <img src="~@/assets/image/videoEmpty.png" alt="" />
      <div class="noLesson-title">欢迎老师您的到来！</div>
      <div class="noLesson-title1">
        为了帮助学员更好的了解课堂中的知识点，需要您根据视频课件内容进行详细的备课。
      </div>
      <div>
        <el-button
          type="primary"
          @click="handlePrepareLesson('ADD')"
        >开始备课</el-button>
        <el-button class="normal" @click="handleImport">快速备课</el-button>
      </div>
    </div>
    <div v-else>
      <div class="lesson-tab flex">
        <div
          v-for="item in tabOptions"
          :key="item.value"
          class="lesson-item"
          :class="{ active: tab === item.value }"
          @click="handleChangeTab(item.value)"
        >
          {{ item.label }} <span v-if="item.value">({{ item.count }})</span>
        </div>
      </div>
      <div class="lesson-seach flex">
        <div>
          <el-button
            size="small"
            class="btn_primary"
            @click="handlePrepareLesson('ADD')"
          >开始备课</el-button>
          <el-button
            size="small"
            class="btn_primary"
            @click="handleImport"
          >快速备课</el-button>
        </div>
        <el-form label-width="70px" size="small" inline @submit.native.prevent>
          <el-form-item label="备课内容">
            <el-input
              v-model="search.content"
              clearable
              @keyup.enter.native="handleSearch"
              @clear="handleSearch"
            />
          </el-form-item>

          <el-button
            type="primary"
            size="small"
            @click="handleSearch"
          >查询</el-button>
        </el-form>
      </div>
      <div v-loading="loadingList" class="lesson-list">
        <el-empty
          v-if="list.length < 1"
          class="noData"
          :image-size="100"
          description="暂无数据"
        />
        <DynamicScroller v-else ref="DynamicScroller" :items="list" :min-item-size="60" style="width: 100%" class="DynamicScroller">
          <template v-slot="{item, index, active}">
            <DynamicScrollerItem :item="item" :active="active" :data-index="index">
              <div style="padding-bottom:10px">
                <div class="lesson-list-item flex">
                  <div class="lesson-list-time">{{ item.sendTime }}</div>
                  <div v-if="item.type!==4" class="lesson-list-text">
                    {{ item.content }}
                    <span v-if="item.type === 1" class="span1">学员提问</span>
                    <span v-else-if="item.type === 3">助教总结</span>
                    <span v-else-if="item.type === 2" class="span3">师生互动</span>
                  </div>
                  <div v-else class="lesson-list-text flex flex-middle">
                    <div class="flex flex-column">
                      <div>{{ item.userName }}问：{{ item.question }}</div>
                      <div>答：{{ item.content }}</div>
                    </div><span class="span2">一对一答疑</span>
                  </div>
                  <div class="lesson-list-btn">
                    <el-button
                      type="primary"
                      size="small"
                      @click="handlePrepareLesson('EDIT', item)"
                    >编辑</el-button>
                    <el-button
                      v-if="!tab && item.type!==5"
                      size="small"
                      @click="handleCancelMark(item.coursewareConfigId,index)"
                    >取消标记</el-button>
                    <el-button
                      size="small"
                      @click="handleDel(item.coursewareConfigId,index)"
                    >删除</el-button>
                  </div>
                </div>
              </div>
            </DynamicScrollerItem>
          </template>
        </DynamicScroller>
      </div>
      <div class="lesson-btn">
        <el-button type="primary" size="small" @click="handleSave">保存</el-button>
        <el-button size="small" @click="handleEnable">保存并启用</el-button>
        <el-button size="small" @click="handleExport">导出课件</el-button>
      </div>
    </div>
    <exportScript
      ref="exportScript"
      :import-template-url-api="getImportFileUrl"
      :import-file-api="importFile"
      :script-id="id"
      title="快速备课"
      tips="系统讲根据您导入的内容，进行快速识别，并进行备课标记"
      params-id="coursewareId"
      @success="handleRefresh"
    />
    <AddDialog :config="config" @success="handleSuccessAdd" />
  </div>
</template>

<script>
import {
  markList,
  importFile,
  getImportFileUrl,
  cancelMark,
  markCount,
  exportFile,
  editModifyStatus,
  deletelMark
} from '@/api/liveRoom/courseware'
import exportScript from '@/views/live/Dialog/exportScript.vue'
import AddDialog from './addDialog.vue'
import moment from 'moment'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'
import { DynamicScroller, DynamicScrollerItem } from 'vue-virtual-scroller'
const tabOptions = [
  {
    label: '全部标记',
    value: 0,
    count: 0
  },
  {
    label: '问题汇总',
    value: 1,
    count: 0
  },
  {
    label: '互动汇总',
    value: 2,
    count: 0
  },
  {
    label: '助教总结',
    value: 3,
    count: 0
  },
  {
    label: '一对一答疑',
    value: 4,
    count: 0
  }
]
export default {
  components: {
    exportScript,
    AddDialog,
    DynamicScroller,
    DynamicScrollerItem
  },
  props: {
    duration: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      isContinuity: false,
      tab: 0,
      list: [],
      importFile,
      getImportFileUrl,
      tabOptions,
      loadingList: false,
      search: {
        content: ''
      },
      config: {
        visible: false,
        data: {},
        dialogType: 'ADD'
      },
      showExport: false,
      pageParams: {
        pageIndex: 1,
        pageSize: 500
      },
      empty: false,
      isEnd: false,
      loading: false
    }
  },
  computed: {
    id() {
      return this.$route.params.id
    }
  },
  mounted() {
    this.init()
    this.$refs.exportScript.init()
  },
  methods: {
    init() {
      this.loading = true
      this.isContinuity = true
      Promise.all([this.getList(), this.getCount()]).finally(() => {
        this.loading = false
        if (!this.list.length) {
          this.empty = true
        }
      })
    },
    async getCount() {
      const { data } = await markCount({
        coursewareId: this.id
      })
      this.tabOptions.forEach(i => {
        i.count = data.find(item => item.type === i.value)?.count || 0
      })
    },
    // 接收豪秒的单位
    getFormatHMS(val) {
      return moment.utc(val).format('HH:mm:ss')
    },
    handleLoadList() {
      if (this.loadingList) {
        return
      }
      if (this.isEnd) {
        return
      }
      this.pageParams.pageIndex += 1
      this.getList()
    },
    async getList() {
      const res = await markList({
        type: this.tab,
        coursewareId: this.id,
        content: this.search.content,
        ...this.pageParams
      })
      if (res.data.pageIndex === 1) {
        this.isContinuity = true
        this.list = []
      }
      this.list = this.list.concat(res.data.items.map(i => ({
        ...i,
        id: i.coursewareConfigId,
        sendTime: this.getFormatHMS(i.sendTime * 1000)
      })))
      if (this.list.length) {
        this.empty = false
      }
      this.isEnd = this.list.length >= res.data.total
      if (!this.isEnd && this.isContinuity && res.data.total && res.data.pageIndex === this.pageParams.pageIndex) {
        this.pageParams.pageIndex += 1
        this.getList()
      } else {
        this.isContinuity = false
      }
      if (!res.data.total) {
        this.isEnd = true
        this.list = []
        return
      }
    },
    handleChangeTab(v) {
      if (this.tab === v) {
        return
      }
      this.tab = v
      this.pageParams = {
        pageIndex: 1,
        pageSize: 500
      }
      this.list = []
      this.isEnd = false
      this.search.content = ''
      this.loading = true
      this.isContinuity = true
      this.getList().finally(() => {
        this.loading = false
      })
    },
    handleSearch() {
      this.handleRefresh()
    },
    handleDel(coursewareConfigId, index) {
      this.$delModal({
        tips: '确定删除该条记录？',
        success: async () => {
          await deletelMark({
            coursewareConfigId,
            coursewareId: this.id
          })
          this.list.splice(index, 1)
          this.$message.success('删除成功')
          this.getCount()
          // this.handleRefresh()
        }
      })
    },
    async handleCancelMark(coursewareConfigId, index) {
      await cancelMark({
        coursewareConfigId,
        coursewareId: this.id
      })
      this.list[index].type = 5
      this.$message.success('取消标记成功')
      this.getCount()

      // this.handleRefresh()
    },
    handlePrepareLesson(type, item) {
      this.config = {
        visible: true,
        data: item,
        dialogType: type,
        duration: this.duration
      }
    },
    handleImport() {
      this.$refs.exportScript.init()
    },
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
        const ms = list.length > 2 ? Number(list[2]) * 3600 : 0
        // const hs = list.length > 3 ? Number(list[3]) * 3600 : 0
        const total = mss + ss + ms
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
    handleSuccessAdd(data) {
      // 无数据时
      if (this.list.length === 0) {
        this.handleRefresh()
        return
      }
      if (this.tab && data.type !== this.tab && this.config.dialogType === 'ADD') {
        this.config = {
          visible: false,
          data: {},
          dialogType: 'ADD',
          duration: this.duration
        }
        this.getCount()
        return
      }
      // 全部tab或者同一种类型下
      if (data.type === this.tab || !this.tab) {
        const i = this.list.findIndex(i => i.id === data.id)
        if (i !== -1) {
          // 编辑时，先删除
          this.list.splice(i, 1)
        }
        this.list.push({ ...data, id: data.coursewareConfigId, sendTime: this.getFormatHMS(data.sendTime * 1000) })
        this.list.sort((a, b) => {
          return this.formatPrTime(a.sendTime) - this.formatPrTime(b.sendTime)
        })
        const index = this.list.findIndex(i => i.coursewareConfigId === data.coursewareConfigId)
        this.$nextTick(() => {
          this.$refs.DynamicScroller.scrollToItem(index)
        })
      } else {
        // 编辑去到了别的tab,只做删除
        const index = this.list.findIndex(i => i.id === data.id)
        this.list.splice(index, 1)
      }
      this.config = {
        visible: false,
        data: {},
        dialogType: 'ADD',
        duration: this.duration
      }
      this.getCount()
    },
    handleRefresh() {
      this.config = {
        visible: false,
        data: {},
        dialogType: 'ADD',
        duration: this.duration
      }
      this.list = []
      this.isEnd = false
      this.pageParams.pageIndex = 1
      this.loading = true
      this.isContinuity = true
      Promise.all([this.getList(), this.getCount()]).finally(() => {
        this.loading = false
      })
    },
    handleSave() {
      this.$message.success('保存成功')
    },
    async handleEnable() {
      await editModifyStatus({
        coursewareId: this.id,
        status: 1
      })
      this.$message.success('保存并启用成功')
      this.handleRefresh()
    },
    async handleExport() {
      const { data } = await exportFile({ coursewareId: this.id })
      window.open(data)
    }
  }
}
</script>

<style lang="scss" scoped>
.lesson-content {
  // height: 100%;
  .lesson-tab {
    .lesson-item {
      width: 195px;
      height: 52px;
      line-height: 52px;
      text-align: center;
      margin-right: 15px;
      font-size: 18px;
      border-radius: 4px;
      border: 1px solid #c2c6ce;
      color: #333333;
      cursor: pointer;
      font-weight: 600;
      &.active {
        background: #0c6fff;
        color: #fff;
        border: 1px solid #0c6fff;
      }
    }
  }
  .lesson-seach {
    margin: 22px 0 10px;
    border-bottom: 1px solid #e7e7e7;
    > div {
      margin-right: 32px;
    }
  }
  .lesson-list {
    height: calc(100vh - 300px);
    overflow-y: auto;
    position: relative;
    .DynamicScroller{
      height: 100%;
    }
    .lesson-list-item {
      border: 1px solid #e7e7e7;
      border-radius: 5px;
      min-height: 60px;
      padding: 0 12px;
      // margin-bottom: 10px;
      align-items: center;
      &:hover {
        border: 1px solid #0c6fff;
        .lesson-list-btn {
          opacity: 1;
        }
      }
      .lesson-list-time {
        width: 80px;
        font-size: 14px;
        font-weight: 600;
        color: #0c6fff;
        position: relative;
        &::after {
          content: '';
          display: block;
          width: 1px;
          height: 20px;
          background: #e7e7e7;
          position: absolute;
          right: 0;
          top: 0;
        }
      }
      .lesson-list-text {
        padding: 0 10px;
        flex: 0 1 74%;
        font-size: 14px;
        color: #333333;
        font-size: 14px;
        word-break: break-all;
        span {
          display: inline-block;
          text-align: center;
          line-height: 24px;
          width: auto;
          flex-shrink: 0;
          border-radius: 5px;
          border: 1px solid #b6f3ca;
          color: #22d881;
          margin-left: 14px;
          padding: 0 6px;
          &.span1 {
            border: 1px solid #a8c5ef;
            color: #3779d9;
          }
          &.span2 {
            border: 1px solid #cdc9ff;
            color: #948bff;
          }
          &.span3 {
            border: 1px solid #ffd18b;
            color: #e4a13c;
          }
        }
      }
      .lesson-list-btn {
        text-align: right;
        flex: 1;
        display: flex;
        justify-content: flex-end;
        opacity: 0;
      }
    }
  }
  .lesson-btn {
    text-align: center;
    padding-top: 10px;
  }
  .noLesson {
    text-align: center;
    img {
      width: 375px;
      height: 266px;
      margin: 139px auto 0;
    }
    .noLesson-title {
      font-size: 32px;
      font-weight: 600;
      color: #000000;
      margin: 68px 0 32px;
    }
    .noLesson-title1 {
      font-size: 20px;
      font-style: normal;
      font-weight: 400;
      color: #777777;
      margin-bottom: 44px;
    }
    ::v-deep .el-button {
      width: 155px;
      height: 52px;
      color: #fff;
      box-shadow: 0 10px 10px 0 #0c6fff33;
      &:last-of-type {
        background: #4fdfda;
        box-shadow: 0 10px 10px 0 #4fdfda33;
        margin-left: 34px;
      }
    }
  }
  .noData{
    margin-top: 100px;
  }
  .normal{
    border: none;
  }
::v-deep {
  .el-form-item__label {
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #333333;
    line-height: 22px;
  }
}
}
</style>
