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
            :approve-array="approveArray"
            :tearch-array="tearchArray"
            :platform-array="platformArray"
            :search-form="searchForm"
            :user-array="userArray"
            :user-array1="userArray1"
            :user-array2="userArray2"
            @handleChangeUser="handleChangeUser"
            @clear="clear"
            @tearchFilter="tearchFilter"
            @goApproval="goApproval"
            @handleChangeTeacher="handleChangeTeacher"
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
            :table-columns="
              searchForm.status == 1
                ? config.tableColumns
                : config.tableColumns1
            "
            :loading="loading"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            @sort-change="sortChange"
          >
            <div slot="type" slot-scope="{ row }">
              <el-tooltip
                v-if="[2, 3, 4].includes(row.type)"
                placement="bottom"
                effect="light"
              >
                <div slot="content">
                  <span v-html="filterStr1(row)" />
                </div>
                <span style="color: #0000ff">
                  {{ approveObj[row.type] }}
                </span>
              </el-tooltip>
              <span v-else>
                {{ approveObj[row.type] }}
              </span>
            </div>
            <div slot="teacherName" slot-scope="{ row }">
              <span>
                {{ row.teacherName.join(',') || '--' }}
              </span>
            </div>
            <div slot="action" slot-scope="{ row }">
              <!-- v-permission="['web:teachFileList:detail', permsList]" -->
              <span v-if="index === 0" style="margin-right: 10px">
                <el-button type="text" @click="gotoPass(row)">通过</el-button>
                <el-button
                  type="text"
                  style="color: #f53f3f"
                  @click="gotoReject(row)"
                >驳回</el-button>
              </span>
              <el-button
                type="text"
                @click="gotoOriginal(row)"
              >查看详情</el-button>
            </div>
          </MPageLayout>
        </div>
      </el-tab-pane>
    </el-tabs>
    <approve-opt ref="approveOpt" @submit="submitForm" />
  </div>
</template>
<script>
import {
  getExaminePage,
  getPageCount
} from '@/api/videoManagement/accountApproval'
import { getPlatform } from '@/api/videoManagement/accountManage'
import { loadUserData, changeTeacher, tearchFilter } from '@/utils/videoMange'
import filterTop from './components/filterTop.vue'
import approveOpt from './components/approveOpt.vue'
import fxIconTime from '../../../assets/svg/fx-icon-time.svg'
import { operateAccountExamine } from '@/api/videoManagement/accountApproval'
import { tableColumns, tableColumns1, configList, approveArray } from './columns'
export default {
  components: {
    filterTop,
    approveOpt
  },
  data() {
    return {
      fxIconTime,
      activeName: 'first0',
      approveObj: {
        1: '停更',
        2: '转号',
        3: '变更运营',
        4: '移交老师',
        5: '注销'
      },
      approveArray: approveArray,
      configList: configList,
      permsList: this.$route.meta.permsList || [],
      slotArr: ['action', 'footer', 'type', 'teacherName'],
      loading: false,
      userArray: [],
      userArray1: [],
      userArray2: [],
      userList: [],
      userList1: [],
      userList2: [],
      approveStatus: 1,
      more: '',
      statusMap: new Map([
        [1, { name: '待审批', icon: fxIconTime }],
        [2, { name: '审批通过', icon: 'el-icon-success' }],
        [3, { name: '审批驳回', icon: 'el-icon-error' }]
      ]),
      multipleSelection: [],
      platformArray: [],
      tearchArray: [],
      searchForm: {
        accountName: '', // 账号名称
        status: 1, // 审批状态
        operatorId: '', // 运营者
        platformId: '', // 平台ID
        teacherId: '', // IP
        applicantId: '', // 申请人
        examineUserId: '', // 审批人
        type: '', // 审批类型
        timeArray: []
      },
      config: {
        tableData: [], // 'show-overflow-tooltip': true,
        tableColumns: tableColumns,
        tableColumns1: tableColumns1,
        pageSizes: [10, 20, 30, 40, 50, 100],
        pageSize: 10,
        currentPage: 1,
        total: 0
      }
    }
  },
  created() {
    this.$store.dispatch('user/viewingFlag', 'operationApproveAccount')
    this.getList()
    this.loadUserNoPage()
    this.loadTeacherData()
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
    goApproval() {
      this.$router.push({
        path: '/approvalSettings',
        query: {
          type: 1
        }
      })
    },
    async loadTeacherData() {
      const { tearchArray, tearchList } = await loadUserData('accountApprovalTearch', 1)
      this.tearchArray = tearchArray
      this.tearchList = tearchList
      this.tearchFilter('')
    },
    async tearchFilter(query) {
      const res = await tearchFilter(query, this.tearchList)
      this.tearchArray[0].isHidden = query.length > 0
      this.tearchArray[1].options = res
    },
    async handleChangeTeacher(data) {
      if (this.searchForm.teacherId) {
        const res = await changeTeacher(this.tearchList, this.tearchArray, 'accountApprovalTearch', this.searchForm.teacherId)
        console.log(res, '选择了IP')
        this.tearchArray = res
      }
      this.getListForSearch(data)
    },
    async loadUserNoPage() {
      const { tearchArray, tearchList } = await loadUserData('accountApprovalUser1', 2)
      const res = await loadUserData('accountApprovalUser2', 2)
      const res1 = await loadUserData('accountApprovalUser3', 2)
      this.userArray = tearchArray
      this.userArray1 = res.tearchArray
      this.userArray2 = res1.tearchArray
      this.userList = tearchList
      this.userList1 = res.tearchList
      this.userList2 = res1.tearchList
    },
    async changeUser(userList, userArray, storageKey, userId) {
      if (userId) {
        const res = await changeTeacher(userList, userArray, storageKey, userId)
        return res
      }
      return userArray
    },
    async handleChangeUser(data, type) {
      if (type === 1) {
        this.userArray = await this.changeUser(this.userList, this.userArray, 'accountApprovalUser1', this.searchForm.operatorId)
      } else {
        if (type === 2) {
          this.userArray1 = await this.changeUser(this.userList1, this.userArray1, 'accountApprovalUser2', this.searchForm.applicantId)
        }
        if (type === 3) {
          this.userArray2 = await this.changeUser(this.userList2, this.userArray2, 'accountApprovalUser3', this.searchForm.examineUserId)
        }
      }
      this.getListForSearch(data)
    },
    handleClick(tab, event) {
      this.config.currentPage = 1
      this.searchForm.status = this.configList[tab.index].approveStatus
      this.approveStatus = this.configList[tab.index].approveStatus
      this.loadTeacherData()
      this.loadUserNoPage()
      this.getList()
    },
    async getDesensitizationCount() {
      const res = await getPageCount({})
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
      console.log(type, data)
      const params = {
        operateType: type === 'pass' ? 1 : 2,
        platformAccountId: data[0].platformAccountId,
        examinePhase: data[0].examinePhase,
        recordId: data[0].recordId,
        type: data[0].type
      }
      const res = await operateAccountExamine(params)
      if (res.code === 1) {
        this.$message.success(`${type === 'pass' ? '通过' : '驳回'}成功`)
        this.$refs.approveOpt.handleClose()
        this.getList()
      }
    },
    filterStr1(row) {
      let str = ''
      if (row.type === 3) {
        str += `<div style='color:#333;'>当前运营：${row.operatorName}</div>`
        str += `<div style='color:red;margin-top:10px'>变更后运营：${row.newOperatorName}</div>`
      } else {
        const teacherNameStr = row.teacherName.join(',')
        str += `<div style='color:#333;'>当前IP：${teacherNameStr || '--'}</div>`
        str += `<div style='color:red;margin-top:10px'>变更后IP：${row.newTeacherName.join(
          ','
        )}</div>`
      }
      return str
    },
    gotoPass(row) {
      this.$refs.approveOpt.show([row], row.type, 'pass')
    },
    gotoReject(row) {
      this.$refs.approveOpt.show([row], row.type, 'reject')
    },
    gotoOriginal(row) {
      const path = this.$route.path
      this.$router.push({
        path: `/videoManagement/myAccountDetail?fromType=all&accountId=${row.platformAccountId}`,
        query: {
          path,
          name: '账号审批'
        }
      })
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
    sortChange() {
      this.getList()
    },
    clear() {
      this.config.currentPage = 1
      this.searchForm = {
        accountName: '', // 账号名称
        status: this.approveStatus, // 审批状态
        operatorId: '', // 运营者
        platformId: '', // 平台ID
        teacherId: '', // IP
        applicantId: '', // 申请人
        examineUserId: '', // 审批人
        type: '', // 审批类型
        timeArray: []
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
        startTime:
          this.searchForm.timeArray !== null
            ? this.searchForm?.timeArray[0]
            : '',
        endTime:
          this.searchForm.timeArray !== null
            ? this.searchForm?.timeArray[1]
            : '',
        accountName: this.searchForm.accountName, // 账号名称
        status: this.searchForm.status, // 审批状态
        operatorId: this.searchForm.operatorId, // 运营者
        platformId: this.searchForm.platformId, // 平台ID
        teacherId: this.searchForm.teacherId, // IP
        applicantId: this.searchForm.applicantId, // 申请人
        examineUserId: this.searchForm.examineUserId, // 审批人
        type: this.searchForm.type // 审批类型
      }
      const res = await getExaminePage(params)
      console.log(res, this.config.tableData, 'res')
      this.config.tableData = res.data.items
      this.config.total = res.data.total
      this.loading = false
    }
  }
}
</script>
<style lang="scss" scoped>
@import '~@/styles/variables.scss';
.page-content {
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
  @include responsive-height(100px);
  background: #fff;
  display: flex;
  flex-direction: column;
  border-radius: 10px;
  // padding-top: 15px;
  .tablePage {
    height: 475px;
  }
  .el-table::before {
    background-color: transparent;
  }
  .my-table {
    margin: 0 !important;
  }
}
</style>
