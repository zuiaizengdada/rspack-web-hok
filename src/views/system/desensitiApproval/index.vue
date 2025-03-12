<!-- 协议管理 -->
<template>
  <div class="page-content">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane
        v-for="(item, index) in configList"
        :key="index"
        :name="`first${index}`"
        :label="`${item.name}(${item.nums})`"
      >
        <div class="page_wrap1">
          <filter-top
            :search-form="searchForm"
            :user-array="userArray"
            @handleChangeTeacher="handleChangeTeacher"
            @clear="clear"
            @goApproval="goApproval"
            @getListForSearch="getListForSearch"
          />
          <!-- 内容区(协议管理) -->
          <MPageLayout
            ref="MPageLayout"
            :checkbox="index === 0"
            :slot-arr="slotArr"
            :current-page="config.currentPage"
            :page-sizes="config.pageSizes"
            :page-size="config.pageSize"
            :total="config.total"
            :table-data="config.tableData"
            :table-columns="
              index === 0 ? config.tableColumns : config.tableColumns1
            "
            :loading="loading"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            @handleSelectionChange="handleSelectionChange"
            @sort-change="sortChange"
          >
            <div slot="content" slot-scope="{ row }">
              <span v-html="row.content" />
            </div>
            <div slot="oneLineContext" slot-scope="{ row }">
              <el-tooltip placement="bottom" effect="light">
                <div slot="content">
                  <span v-html="filterStr1(row)" />
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
            <div slot="action" slot-scope="{ row }">
              <!-- v-permission="['web:teachFileList:detail', permsList]" -->
              <span v-if="index === 0" style="margin-right: 10px">
                <el-button type="text" @click="gotoPass(row)">通过</el-button>
                <el-button
                  type="text"
                  style="color: #f53f3f"
                  @click="gotoReject(row)"
                >
                  驳回
                </el-button>
              </span>
              <el-button type="text" @click="gotoOriginal(row)">
                查看原文
              </el-button>
              <el-button v-if="searchForm.approveStatus === 3 && userInfo.nickName === row.applicantUserNick" type="text" @click="gotoRestart(row)">
                重新提交
              </el-button>
            </div>
            <template v-if="index === 0" slot="footer">
              <el-button
                type="primary"
                :disabled="multipleSelection.length === 0"
                @click="batchPass"
              >
                批量通过
              </el-button>
              <el-button
                type="danger"
                :disabled="multipleSelection.length === 0"
                @click="batchRejection"
              >
                批量驳回
              </el-button>
            </template>
          </MPageLayout>
        </div>
      </el-tab-pane>
    </el-tabs>
    <approve-opt ref="approveOpt" @submit="submitForm" />
  </div>
</template>
<script>
import {
  getDesensitizationList,
  getDesensitizationCount,
  desensitizationApprove,
  desensitizationReject,
  desensitizationRestart
} from '@/api/system/desensitiApproval'
import filterTop from './components/filterTop.vue'
import approveOpt from './components/approveOpt.vue'
import fxIconTime from '../../../assets/svg/fx-icon-time.svg'
import { loadUserData, changeTeacher } from '@/utils/videoMange'

export default {
  components: {
    filterTop,
    approveOpt
  },
  data() {
    return {
      userInfo: this.$store.getters.userInfo,
      fxIconTime,
      activeName: 'first0',
      configList: [
        {
          name: '待审批',
          nums: 0,
          authority: 'system:desensition:approval',
          approveStatus: 1
        },
        {
          name: '审批通过',
          nums: 0,
          authority: 'system:desensition:pass',
          approveStatus: 2
        },
        {
          name: '审批驳回',
          nums: 0,
          authority: 'system:desensition:reject',
          approveStatus: 3
        }
      ],
      permsList: this.$route.meta.permsList || [],
      slotArr: [
        'action',
        'footer',
        'approveStatus',
        'platformId',
        'content',
        'oneLineContext'
      ],
      loading: false,
      userArray: [],
      userList: [],
      more: '',
      statusMap: new Map([
        [1, { name: '待审批', icon: fxIconTime }],
        [2, { name: '审批通过', icon: 'el-icon-success' }],
        [3, { name: '审批驳回', icon: 'el-icon-error' }]
      ]),
      multipleSelection: [],
      searchForm: {
        approveStatus: 1,
        timeArray: [],
        applicantUserId: '',
        content: '',
        videoGroupTitle: '',
        videoName: ''
      },
      config: {
        tableData: [], // 'show-overflow-tooltip': true,
        tableColumns: [
          {
            prop: 'content',
            label: '审批内容',
            type: 'slot',
            visible: true,
            disable: true
          },
          {
            prop: 'oneLineContext',
            label: '上下文一览',
            type: 'slot',
            width: 200,
            visible: true,
            disable: true
          },
          {
            prop: 'videoGroupTitle',
            label: '视频组名称',
            type: 'text',
            visible: true
          },
          {
            prop: 'videoName',
            label: '视频名称',
            type: 'text',
            visible: true
          },
          {
            prop: 'approveStatus',
            label: '审批状态',
            type: 'slot',
            visible: true
          },
          {
            prop: 'applicantUserNick',
            label: '申请者',
            type: 'text',
            visible: true,
            render: row => {
              return row.applicantUserNick || '无'
            }
          },
          {
            prop: 'applicationTime',
            label: '申请时间',
            type: 'text',
            visible: true
          },
          {
            prop: 'action',
            label: '操作',
            width: 190,
            type: 'slot',
            visible: true,
            disable: true
          }
        ],
        tableColumns1: [
          {
            prop: 'content',
            label: '审批内容',
            type: 'slot',
            visible: true,
            disable: true
          },
          {
            prop: 'oneLineContext',
            label: '上下文一览',
            type: 'slot',
            width: 200,
            visible: true,
            disable: true
          },
          {
            prop: 'videoGroupTitle',
            label: '视频组名称',
            type: 'text',
            visible: true
          },
          {
            prop: 'videoName',
            label: '视频名称',
            type: 'text',
            visible: true
          },
          {
            prop: 'approveStatus',
            label: '审批状态',
            type: 'slot',
            visible: true
          },
          {
            prop: 'applicantUserNick',
            label: '申请者',
            type: 'text',
            visible: true
          },
          {
            prop: 'applicationTime',
            label: '申请时间',
            type: 'text',
            visible: true
          },
          {
            prop: 'approveUserNick',
            label: '审批者',
            align: 'center',
            type: 'text',
            visible: true
          },
          {
            prop: 'approveTime',
            label: '审批时间',
            type: 'text',
            visible: true
          },
          {
            prop: 'action',
            label: '操作',
            width: 190,
            type: 'slot',
            visible: true,
            disable: true
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
    this.configList = this.configList.filter(item => {
      return this.permsList.includes(item.authority)
    })
    this.getList()
    this.loadUserNoPage()
  },
  methods: {
    goApproval() {
      this.$router.push({
        path: '/desensitiSettings',
        query: {
          type: 2
        }
      })
    },
    async loadUserNoPage() {
      const { tearchArray, tearchList } = await loadUserData('desensitiUser', 2)
      this.userArray = tearchArray
      this.userList = tearchList
    },
    async handleChangeTeacher(val) {
      this.searchForm = { ...this.searchForm, ...val }
      if (this.searchForm.applicantUserId) {
        const res = await changeTeacher(this.userList, this.userArray, 'desensitiUser', this.searchForm.applicantUserId)
        this.userArray = res
      }
      this.getList()
    },
    handleClick(tab, event) {
      this.config.currentPage = 1
      this.searchForm.approveStatus = this.configList[tab.index].approveStatus
      this.loadUserNoPage()
      this.getList()
    },
    async getDesensitizationCount() {
      const res = await getDesensitizationCount({})
      res.data.forEach((e, index) => {
        // 根据e.approveStatus的值去匹配this.configList里面的approveStatus的值，匹配到了就把e.num赋值给this.configList里面的nums
        this.configList.forEach(item => {
          if (e.approveStatus === item.approveStatus) {
            item.nums = e.num
          }
        })
      })
      console.log(res, '各种状态数量')
    },
    async submitForm(type, data) {
      console.log(data)
      // 获取传入的data数组里面的videoSubtitleId用数组接收
      const ids = data.map(e => e.videoSubtitleId)
      // 审批通过
      if (type % 2 !== 0) {
        const res = await desensitizationApprove({ videoSubtitleIdList: ids })
        // 根据传入的id改变this.data里面对应那条数据的approveStatus
        if (res.code === 1) {
          this.$refs.approveOpt.handleClose()
          this.getList()
          this.$message.success('审批通过')
        }
      } else {
        const res = await desensitizationReject({ videoSubtitleIdList: ids })
        // 根据传入的id改变this.data里面对应那条数据的approveStatus
        if (res.code === 1) {
          this.$refs.approveOpt.handleClose()
          this.getList()
          this.$message.error('审批驳回')
        }
      }
    },
    filterStr(row) {
      // 循环拼接
      let str = ''
      row.oneLineContext.forEach((e, index) => {
        if (e === row.content) {
          str += `<span style='color:#333'>${e}</span>`
        } else {
          str += `<span style='color:#777'>${e}</span>`
        }
        str += index === row.oneLineContext.length - 1 ? '' : '<br/>'
      })
      return str
    },
    filterStr1(row) {
      // 循环拼接
      let str = ''
      row.tenLinesContext.forEach((e, index) => {
        if (e === row.content) {
          str += `<span style='color:#333;'>${e}</span>`
        } else {
          str += `<span style='color:#777;'>${e}</span>`
        }
        str += index === row.oneLineContext.length - 1 ? '' : '<br/>'
      })
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
    gotoRestart(row) {
      console.log(row)
      const params = {
        videoSubtitleId: row.videoSubtitleId
      }
      desensitizationRestart(params).then(res => {
        if (res.code === 1 && res.data) {
          this.$message.success('重新审批申请提交成功！')
          this.getList()
        } else {
          this.$message.error(res.message)
        }
      })
    },
    batchPass() {
      this.$uweb && this.$uweb.setAction('Event_approvalDesensiti_batchPass')
      this.$refs.approveOpt.show(this.multipleSelection, 3, 'batchPass')
    },
    batchRejection() {
      this.$uweb && this.$uweb.setAction('Event_approvalDesensiti_batchReject')
      this.$refs.approveOpt.show(this.multipleSelection, 4, 'batchRejection')
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
        approveStatus: this.searchForm.approveStatus,
        timeArray: [],
        applicantUserId: '',
        content: '',
        videoGroupTitle: '',
        videoName: ''
      }
      this.getList()
    },
    // 获取列表
    async getList() {
      this.getDesensitizationCount()
      this.loading = true
      console.log(this.searchForm, 'this.searchForm')
      const params = {
        pageIndex: this.config.currentPage,
        pageSize: this.config.pageSize,
        approveStatus: this.searchForm.approveStatus,
        applicationStartTime:
          this.searchForm.timeArray !== null
            ? this.searchForm?.timeArray[0]
            : '',
        applicationEndTime:
          this.searchForm.timeArray !== null
            ? this.searchForm?.timeArray[1]
            : '',
        applicantUserId: this.searchForm.applicantUserId,
        content: this.searchForm.content,
        videoGroupTitle: this.searchForm.videoGroupTitle,
        videoName: this.searchForm.videoName
      }
      const res = await getDesensitizationList(params)
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
@import '~@/styles/variables.scss';
.page-content {
  @include responsive-height(20px);
  box-sizing: border-box;
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
::v-deep .page_wrap1 {
  height: 100%;
  background: #fff;
  display: flex;
  flex-direction: column;
  border-radius: 10px;
  // padding-top: 15px;
  .tablePage {
    height: 300px;
  }
  .el-table::before {
    background-color: transparent;
  }
  .my-table {
    margin: 0 !important;
  }
}
</style>
