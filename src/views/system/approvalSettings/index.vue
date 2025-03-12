<!-- 协议管理 -->
<template>
  <div class="page-content">
    <div class="">
      <el-breadcrumb
        separator-class="el-icon-arrow-right"
        class="form-breadcrumb"
      >
        <el-breadcrumb-item :to="pageInfo.path">{{
          pageInfo.name
        }}</el-breadcrumb-item>
        <el-breadcrumb-item>{{ pageInfo.name }}设置</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="page_wrap1">
      <div class="page_wrap_header">
        <div class="header_wrap">
          <div>{{ pageInfo.name }}设置</div>
          <div>
            <span>
              <span>{{ types[loginType] }}通知：</span>
              <el-switch v-model="value1" @change="changeSwitch" />
            </span>
            <el-button
              v-if="pageInfo.type === 1"
              v-permission="['web:accountMange:approvalRetrial', permsList]"
              size="small"
              type="primary"
              :loading="loading"
              style="margin-left: 24px"
              @click="openReviewModel"
            >
              <i class="el-icon-plus" /> 审核设置
            </el-button>
            <el-button
              size="small"
              type="primary"
              :loading="loading"
              style="margin-left: 24px"
              @click="openAddModel('add')"
            >
              <i class="el-icon-plus" /> 添加审批人
            </el-button>
          </div>
        </div>
      </div>
      <!-- 内容区(协议管理) -->
      <MPageLayout
        ref="MPageLayout"
        :slot-arr="slotArr"
        :hide-pagination="true"
        :current-page="config.currentPage"
        :page-sizes="config.pageSizes"
        :page-size="config.pageSize"
        :total="config.total"
        :table-data="config.tableData"
        :table-columns="config.tableColumns"
        :loading="loading"
        layout="total, sizes, prev, pager, next, jumper"
      >
        <!-- <div slot="content" slot-scope="{ row }">
          <span v-html="row.content" />
        </div> -->
        <template slot="action" slot-scope="{ row }">
          <el-button type="text" @click="openAddModel('edit', row)">
            编辑
          </el-button>
          <el-button
            type="text"
            style="color: #f53f3f"
            @click="handleClickDel(row)"
          >
            删除
          </el-button>
        </template>
      </MPageLayout>
    </div>
    <add-approval ref="modal" :page-info="pageInfo" @success="getList" />
    <add-review ref="reviewModal" />
  </div>
</template>
<script>
import AddApproval from './components/addApproval.vue'
import AddReview from './components/addReview.vue'
import {
  getExamineSetUpList,
  editStatus,
  deleteExamineAccount,
  getDesensitizedExamineSetUpList,
  deleteDesensitizedExamineAccount,
  editDesensitizedStatus
} from '@/api/system/approvalSettings'
import { getSendMsgTypeConfigApi } from '@/api/deliver/baseSeeting'
import { getItem } from '@/utils/localStorage'
export default {
  components: { AddApproval, AddReview },
  data() {
    return {
      loginType: 'feishu',
      types: {
        feishu: '飞书',
        wecom: '企微'
      },
      permsList: this.$route.meta.permsList || [],
      value1: false,
      slotArr: ['action'],
      loading: false,
      setUpId: '',
      typeList: [
        { type: 1, name: '账号审批', path: '/videoManagement/accountApproval' },
        { type: 2, name: '脱敏审批', path: '/desensitiApproval' }
      ],
      pageInfo: {
        type: 1,
        name: '账号审批',
        path: '/videoManagement/accountApproval'
      },
      config: {
        tableData: [], // 'show-overflow-tooltip': true,
        tableColumns: [
          {
            prop: 'examineUserName',
            label: '审批人员',
            type: 'text',
            width: 200,
            visible: true,
            disable: true
          },
          {
            prop: 'deptName',
            label: '所在部门',
            type: 'text',
            visible: true
          },
          {
            prop: 'examineDeptName',
            label: '审批部门范围',
            type: 'text',
            visible: true
          },
          {
            prop: 'remindUserName',
            label: '抄送人员',
            type: 'text',
            visible: true
          },
          {
            prop: 'noticeCrowd',
            label: '通知群',
            type: 'text',
            visible: true,
            render: row => {
              if (row.noticeCrowd === null) {
                return '--'
              }
              //  取noticeCrowd集合里面的name
              const arr = []
              row.noticeCrowd.forEach(item => {
                arr.push(item.name)
              })
              return arr.join(',') || '-'
            }
          },
          { prop: 'action', label: '操作', type: 'slot' }
        ],
        pageSizes: [10, 20, 30, 40, 50, 100],
        pageSize: 10,
        currentPage: 1,
        total: 0
      }
    }
  },
  created() {
    this.pageInfo = this.typeList.find(
      item => String(item.type) === String(this.$route.query.type)
    )
    this.getSendMsgTypeConfig()
    this.getList()
    console.log(this.permsList, '权限')
  },
  methods: {
    // 设置复审人
    openReviewModel() {
      this.$refs.reviewModal.open()
    },
    // 获取信息来源是企微还是飞书
    async getSendMsgTypeConfig() {
      try {
        const orgInfo = getItem('orgInfo')
        const { data } = await getSendMsgTypeConfigApi({
          tenantId: orgInfo.organizationId
        })
        if (data) {
          this.loginType = data === 1 ? 'feishu' : 'wecom'
        }
      } catch (error) {
        console.log(error)
      }
    },
    async changeSwitch(val) {
      this.loading = true
      const params = {
        setUpId: this.setUpId,
        status: val ? 1 : 2
      }
      try {
        let res = null
        if (this.pageInfo.type === 1) {
          res = await editStatus(params)
        } else {
          res = await editDesensitizedStatus(params)
        }
        if (res.code === 1) {
          this.$notify.success({ title: '提示', message: '操作成功' })
        }
      } catch (error) {
        console.log(error)
      }
      this.getList()
      this.loading = false
    },
    openAddModel(type, row = {}) {
      this.$refs.modal.open(type, row, this.setUpId)
    },
    handleClickEdit() {},
    handleClickDel(row) {
      this.$delModal({
        tips: `确定删除该审批人员？`,
        success: async () => {
          this.loading = true
          const data = {
            examineId: row.examineId,
            setUpId: this.setUpId
          }
          if (this.pageInfo.type === 1) {
            await deleteExamineAccount(data)
          } else {
            await deleteDesensitizedExamineAccount(data)
          }
          this.loading = false
          this.$notify.success({ title: '提示', message: '删除成功' })
          this.getList()
        }
      })
    },
    sortChange() {
      this.getList()
    },
    // 获取列表
    async getList() {
      this.loading = true
      // const params = {
      // }
      let res = null
      if (this.pageInfo.type === 1) {
        res = await getExamineSetUpList({})
      } else {
        res = await getDesensitizedExamineSetUpList({})
      }
      console.log(res, '账号审批设置')
      this.config.tableData = res.data.examineInfoList
      this.setUpId = res.data.setUpId
      this.value1 = res.data.status === 1
      this.config.total = res.data.total
      this.loading = false
    }
  }
}
</script>
<style lang="scss" scoped>
.page-content {
  height: 100%;
  background: #fff;
  border-radius: 10px;
  padding: 20px;
  .page_wrap_header {
    // padding-left: 20px;
    padding-right: 20px;
    font-weight: bold;
    .header_wrap {
      padding: 10px 0;
      display: flex;
      align-items: center;
      justify-content: space-between;
      box-sizing: border-box;
      border-bottom: 1px solid #e7e7e7;
      font-size: 16px;
      font-family: MicrosoftYaHei;
      color: #333333;
      // line-height: 24px;
    }
  }
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
.form-breadcrumb {
  padding-bottom: 20px;
  border-bottom: 1px solid #eff2f6;
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
