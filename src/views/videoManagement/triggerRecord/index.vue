<!-- 协议管理 -->
<template>
  <div class="page-content">
    <div class="page_wrap1">
      <filter-top
        :tearch-array="tearchArray"
        :platform-array="platformArray"
        :search-form="searchForm"
        :user-array="userArray"
        @clear="clear"
        @getListForSearch="getListForSearch"
      />
      <!-- 内容区(协议管理) -->
      <MPageLayout
        ref="MPageLayout"
        :slot-arr="slotArr"
        :current-page="config.currentPage"
        :page-sizes="config.pageSizes"
        :page-size="config.pageSize"
        :total="config.total"
        :table-data="config.tableData"
        :table-columns="config.tableColumns"
        :loading="loading"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        @handleSelectionChange="handleSelectionChange"
        @sort-change="sortChange"
      >
        <div slot="openUrl" slot-scope="{ row }">
          <a v-if="row.openUrl !== null" :href="row.openUrl" target="_blank" style="color: rgb(0, 0, 255);">查看视频</a>
          <span v-else> -- </span>
        </div>
        <div slot="content" slot-scope="{ row }">
          <el-tooltip placement="bottom" effect="light">
            <div slot="content">
              <span v-html="filterStr(row,1)" />
            </div>
            <span v-html="filterStr(row)" />
          </el-tooltip>
        </div>
        <div slot="approveStatus" slot-scope="{ row }">
          <div :class="`status_box status_box${row.approveStatus}`">
            <i
              v-if="row.approveStatus !== 1"
              style="margin: 2px 4px 0 10px"
              :class="statusMap.get(row.approveStatus).icon"
            />
            <img
              v-else
              style="margin: 2px 4px 0 10px"
              :src="statusMap.get(row.approveStatus).icon"
            />
            {{ statusMap.get(row.approveStatus).name }}
          </div>
        </div>
      </MPageLayout>
    </div>
  </div>
</template>
<script>
import {
  triggerPage
} from '@/api/videoManagement/accountApproval'
import { getPlatform } from '@/api/videoManagement/accountManage'
import { userNoPage } from '@/api/addressBookApi'
import filterTop from './components/filterTop.vue'
import fxIconTime from '../../../assets/svg/fx-icon-time.svg'
export default {
  components: {
    filterTop
  },
  data() {
    return {
      fxIconTime,
      permsList: this.$route.meta.permsList || [],
      slotArr: [
        'action',
        'footer',
        'content',
        'openUrl'
      ],
      loading: false,
      userArray: [],
      more: '',
      multipleSelection: [],
      platformArray: [],
      tearchArray: [],
      searchForm: {
        content: '',
        platformId: '',
        userId: '',
        videoGroupName: '',
        videoName: '',
        timeArray: []
      },
      config: {
        tableData: [], // 'show-overflow-tooltip': true,
        tableColumns: [
          {
            prop: 'platformName',
            label: '平台',
            type: 'text',
            width: 200,
            visible: true
          },
          {
            prop: 'name',
            label: '账号',
            type: 'text',
            visible: true
          },
          {
            prop: 'content',
            label: '内容',
            type: 'slot',
            visible: true
          },
          {
            prop: 'openUrl',
            label: '视频链接',
            type: 'slot',
            visible: true
          },
          {
            prop: 'videoGroupName',
            label: '视频组名称',
            type: 'text',
            visible: true,
            render: (row) => {
              return row.videoGroupName || '--'
            }
          },
          {
            prop: 'videoName',
            label: '视频名称',
            type: 'text',
            visible: true,
            render: (row) => {
              return row.videoName || '--'
            }
          },
          {
            prop: 'teacherName',
            label: '录制IP',
            type: 'text',
            visible: true
          },
          {
            prop: 'createUserName',
            label: '发布者',
            type: 'text',
            visible: true
          },
          {
            prop: 'publishTime',
            label: '发布时间',
            type: 'text',
            visible: true,
            render: (row) => {
              return row.publishTime || '--'
            }
          }
        ],
        pageSizes: [10, 20, 30, 40, 50, 100],
        pageSize: 10,
        currentPage: 1,
        total: 0
      }
    }
  },
  created() {
    // 匹配this.permsList是否在this.configList中
    // this.configList = this.configList.filter(item => {
    //   return this.permsList.includes(item.authority)
    // })
    this.getList()
    this.loadUserNoPage()
    this.loadPlatformData()
  },
  methods: {
    loadPlatformData() {
      getPlatform().then(res => {
        if (res.success) {
          this.platformArray = res.data
        }
      })
    },
    loadUserNoPage() {
      const params = {
        nickName: ''
      }
      userNoPage(params)
        .then(res => {
          this.userArray = res.data
        })
        .catch(() => {})
    },
    filterStr(row, type) {
      // topic话题 synopsis简介 title标题
      let str = ''
      if (row.topic) {
        str += `<p ${type === 1 ? '' : "class='text_hidden'"}>话题：${row.topic}</p>`
      }
      if (row.synopsis) {
        str += `<p ${type === 1 ? '' : "class='text_hidden'"}>简介：${row.synopsis}</p>`
      }
      if (row.title) {
        str += `<p ${type === 1 ? '' : "class='text_hidden'"}>标题：${row.title}</p>`
      }
      return str
    },
    gotoPass(row) {
      this.$uweb && this.$uweb.setAction('Event_approvalDesensiti_pass')
      this.$refs.approveOpt.show([row], 1, 'pass')
    },
    gotoReject(row) {
      this.$uweb && this.$uweb.setAction('Event_approvalDesensiti_reject')
      this.$refs.approveOpt.show([row], 2, 'reject')
    },
    gotoOriginal(row) {
      this.$uweb && this.$uweb.setAction('Event_approvalDesensiti_view')
      console.log('riiwoooiw', row)
      const toTaskLog = this.$router.resolve({
        path: `/showSemiVideoDetail/${row.desensitizedProjectId}?videoType=2&videoGroupName=${row.videoGroupTitle}&sensitiveId=${row.videoSubtitleId}&videoId=${row.videoId}`
      })
      window.open(toTaskLog.href, '_blank')
    },
    // 页码改变触发
    handleSizeChange(val) {
      this.config.currentPage = 1
      this.config.pageSize = val
      this.getList()
    },
    // 当前页改变触发
    handleCurrentChange(val) {
      this.config.currentPage = val
      this.getList()
    },
    getListForSearch(data) {
      this.config.currentPage = 1
      this.searchForm = { ...this.searchForm, ...data }
      this.getList()
    },
    // 批量选择
    handleSelectionChange(row) {
      this.multipleSelection = row
      console.log(this.multipleSelection, 'this.multipleSelection')
      const sameScheduleIds = row.filter(
        i => row[0].id === i.id && i.id !== '0'
      ).length
      console.log(sameScheduleIds)
      this.canShowDownJob = sameScheduleIds === row.length
    },
    sortChange() {
      this.getList()
    },
    clear() {
      this.config.currentPage = 1
      this.searchForm = {
        timeArray: [],
        content: '',
        platformId: '',
        userId: '',
        videoGroupName: '',
        videoName: ''
      }
      this.getList()
    },
    // 获取列表
    async getList() {
      this.loading = true
      console.log(this.searchForm, 'this.searchForm')
      const params = {
        pageIndex: this.config.currentPage,
        pageSize: this.config.pageSize,
        startTime:
          this.searchForm.timeArray !== null
            ? this.searchForm?.timeArray[0]
            : '',
        endTime:
          this.searchForm.timeArray !== null
            ? this.searchForm?.timeArray[1]
            : '',
        userId: this.searchForm.userId,
        content: this.searchForm.content,
        platformId: this.searchForm.platformId,
        videoGroupName: this.searchForm.videoGroupName,
        videoName: this.searchForm.videoName
      }
      const res = await triggerPage(params)
      this.config.tableData = res.data.items
      this.config.total = res.data.total
      this.loading = false
    },
    // 预览
    gotoPreview(row) {
      window.open(
        'https://dev.oss.hokkj.cn/hok_product/protocol/6b33cebec6bd410d92fafea27729dc01.pdf'
      )
    },
    // 下载
    gotoDownload() {}
  }
}
</script>
<style lang="scss" scoped>
.page-content {
  height: 100%;
  background: #fff;
  border-radius: 10px;
  padding: 20px;
  ::v-deep .el-tabs {
    height: 100%;
  }
  ::v-deep .el-tabs__item {
    font-size: 16px;
  }
  ::v-deep .el-tabs__content {
    height: calc(100% - 40px);
  }
  ::v-deep .el-tabs__header {
    margin: 0;
  }
  ::v-deep .el-tab-pane {
    height: 100%;
  }
}
.status_box {
  display: flex;
  align-items: center;
  width: 86px;
  height: 24px;
  border-radius: 12px;
  font-size: 12px;
}
.status_box1 {
  width: 74px;
  background: #fff2e6;
  color: #ff7d00;
}

.status_box2 {
  background: #e6f7ea;
  color: #00b42a;
}
.status_box3 {
  background: #feecec;
  color: #f53f3f;
}
.page_wrap1 ::v-deep {
  height: calc(100vh - 165px);
  background: #fff;
  display: flex;
  flex-direction: column;
  border-radius: 10px;
  // padding-top: 15px;
  .tablePage {
    height: 600px;
  }
  .el-table::before {
    background-color: transparent;
  }
  .my-table {
    margin: 0 !important;
  }
}
</style>
