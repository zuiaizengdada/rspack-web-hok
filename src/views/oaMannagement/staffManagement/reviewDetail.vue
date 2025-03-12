<template>
  <div class="fixed-assets-container">
    <div class="crumbs-box">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item
          :to="{
            path: '/oaManagement/staffManagement/home?currentComponent=review'
          }"
          class="nav-list"
          >{{ breadcrumbTitle }}</el-breadcrumb-item
        >
        <el-breadcrumb-item class="nav-add">{{ title }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <MPageLayout
      ref="MPageLayout"
      type="tablePage"
      :slot-arr="slotArr"
      table-index-width="62px"
      :current-page="config.currentPage"
      :page-sizes="config.pageSizes"
      :page-size="config.pageSize"
      :total="config.total"
      row-key="contractRelationId"
      :table-data="config.tableData"
      :table-columns="config.tableColumns"
      :loading="loading"
      checkbox
      reserve-selection
      layout="total, sizes, prev, pager, next, jumper"
      class="assetChangeRecords"
      :default-sort="{ prop: 'createTime', order: null }"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      @handleSelectionChange="handleSelectionChange"
      @sort-change="sortChange"
    >
      <template slot="search">
        <!-- <el-form ref="search" size="small" :inline="true" :model="search">
          <el-form-item label="操作人" prop="operateUserId">
            <el-select
              v-model="search.operateUserId"
              filterable
              remote
              size="small"
              class="w-200 m-r-10"
              clearable
              placeholder="请输入操作人"
              :remote-method="remoteMethodOperateUser"
              @change="handleSearch"
            >
              <el-option
                v-for="item in operateUserOptions"
                :key="item.userId"
                :label="item.nickName"
                :value="item.userId"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button size="small" type="primary" @click="handleSearch"
              >查询</el-button
            >
            <el-button size="small" @click="handleClickReset">重置</el-button>
          </el-form-item>
        </el-form> -->
      </template>
      <template slot-scope="{ row }" slot="fileName">
        <div
          :title="`${row.fileName}`"
          class="cursor-pointer c_0F71FF"
          @click.stop="handlefileNameClick(row)"
        >
          {{
            row.fileName && row.fileName.length > 10
              ? `${row.fileName.slice(0, 10)}...`
              : row.fileName && row.fileName.slice(0, 10)
          }}
        </div>
      </template>
      <template slot-scope="{ row }" slot="reviewStatus">
        <el-tooltip
          effect="dark"
          :disabled="row.reviewStatus !== 2"
          :content="'驳回原因：' + row.rejectReason"
          placement="top"
          popper-class="mw_400"
        >
          <div class="reviewStatus" :class="`reviewStatus${row.reviewStatus}`">
            <div style="display: flex; align-items: center">
              <svg-icon
                class-name="reviewStatusIcon"
                :icon-class="
                  {
                    0: 'entryRegisterAuditStatus1',
                    1: 'entryRegisterAuditStatus2',
                    2: 'entryRegisterAuditStatus3'
                  }[row.reviewStatus]
                "
              />{{ row.reviewStatus | getOptionsValue(reviewStatusOption) }}
            </div>
          </div>
        </el-tooltip>
        <!-- <div
          class="reviewStatus"
          :class="`reviewStatus${row.reviewStatus}`"
          :title="row.reviewStatus === 2 && row.rejectReason"
        >
          <div style="display: flex; align-items: center">
            <svg-icon
              class-name="reviewStatusIcon"
              :icon-class="
                {
                  0: 'entryRegisterAuditStatus1',
                  1: 'entryRegisterAuditStatus2',
                  2: 'entryRegisterAuditStatus3'
                }[row.reviewStatus]
              "
            />{{ row.reviewStatus | getOptionsValue(reviewStatusOption) }}
          </div>
        </div> -->
      </template>
      <template slot-scope="{ row }" slot="sealStatus">
        <div
          class="sealStatus"
          :class="`sealStatus${row.sealStatus}`"
          v-if="row.needSeal === 1"
        >
          <div style="display: flex; align-items: center">
            <svg-icon
              class-name="sealStatusIcon"
              :icon-class="
                {
                  1: 'entryRegisterAuditStatus1',
                  2: 'entryRegisterAuditStatus2'
                }[row.sealStatus]
              "
            />{{ row.sealStatus | getOptionsValue(sealStatusOption) }}
          </div>
        </div>
        <div v-else class="pd_l_20">——</div>
      </template>
      <div slot="headerRight" style="margin-bottom: 5px">
        <el-button
          size="small"
          type="default"
          class="addBtn"
          @click="handleBatchReview"
          :disabled="multipleSelection.length === 0"
          >批量审核</el-button
        >
        <el-button
          size="small"
          type="default"
          @click="handleOneStamping"
          :loading="oneStampingLoading"
          >一键落章</el-button
        >
      </div>
      <div slot="action" slot-scope="{ row }">
        <el-button
          type="text"
          @click="handleAudt(row)"
          v-if="row.reviewStatus === 0 && row.employeeSignStatus === 1"
          >审核</el-button
        >
        <el-button
          type="text"
          @click="handleFallingChapter(row)"
          v-if="
            row.sealStatus === 1 &&
            row.reviewStatus === 1 &&
            row.employeeSignStatus === 1 &&
            row.needSeal === 1
          "
          >落章</el-button
        >
        <el-button
          type="text"
          @click="handleDown(row)"
          v-if="
            row.sealStatus === 2 ||
            (row.reviewStatus === 1 && row.contractType === 2)
          "
          >下载</el-button
        >
      </div>
    </MPageLayout>

    <oneStampingDialog
      :signFileList="signFileList"
      v-if="oneStampingDialogVisable"
      :visible.sync="oneStampingDialogVisable"
      @close="oneStampingDialogVisable = false"
      @success="oneStampingDialogSuccess()"
    >
    </oneStampingDialog>
    <batchReviewDialog
      v-if="batchReviewDialogVisable"
      @search="queryList()"
      @success="batchReviewDialogSuccess()"
      :signFileList="signFileList"
      :visible.sync="batchReviewDialogVisable"
      @close="batchReviewDialogVisable = false"
    >
    </batchReviewDialog>
    <reviewFileDialog
      :title="row.fileName"
      :url="row.url"
      v-if="reviewFileDialogVisable"
      :visible.sync="reviewFileDialogVisable"
      @close="reviewFileDialogVisable = false"
      @success="reviewFileDialogVisable = false"
    >
    </reviewFileDialog>
  </div>
</template>
<script>
import { getReviewDetailRecordsColumns } from './components/organization/columns'
// import { operateTypeOption, userStatus } from '../constants'
import { userNoPage } from '@/api/addressBookApi'
import oneStampingDialog from './components/organization/components/oneStampingDialog'
import batchReviewDialog from './components/organization/components/batchReviewDialog'
import { signDetailPageListAjax } from '../api/staff.js'
import { fileDownload } from '@/utils/index'
import { reviewStatusOption, sealStatusOption } from './options'
import reviewFileDialog from '@/views/oaMannagement/signFileManagement/components/contractAgreement/components/reviewFileDialog'
import { handleShowFileUrlByStatus } from '@/views/oaMannagement/utils/common'
import moment from 'moment'
export default {
  components: {
    oneStampingDialog,
    batchReviewDialog,
    reviewFileDialog
  },
  data() {
    return {
      moment,
      loading: false,
      allColumnsSelected: true,
      allColumnsSelectedIndeterminate: false,
      config: {
        currentPage: 1,
        pageSizes: [10, 20, 30, 40],
        pageSize: 10,
        total: 0,
        tableData: [],
        tableColumns: getReviewDetailRecordsColumns.call(this)
      },
      slotArr: [
        'footer',
        'search',
        'headerRight',
        'reviewStatus',
        'sealStatus',
        'fileName',
        'action'
      ],
      editFormRow: {},
      title: '签署明细',
      breadcrumbTitle: '',
      search: {},
      operateUserOptions: [],
      batchReviewDialogVisable: false,
      oneStampingDialogVisable: false,
      signFileList: [],
      multipleSelection: [],
      reviewStatusOption,
      sealStatusOption,
      reviewFileDialogVisable: false,
      oneStampingLoading: false
    }
  },
  created() {
    this.breadcrumbTitle = this.$route.query.name || '签署审核'
  },
  mounted() {
    this.$uweb?.setAction('Event_oa_reviewDetail_page')
    this.handleSearch()
  },
  methods: {
    queryList() {
      const { personnelBaseInfoId } = this.$route.query
      const params = {
        ...this.search,
        personnelBaseInfoId,
        pageSize: this.config.pageSize,
        pageIndex: this.config.currentPage
      }
      console.log(params, '查询参数')
      this.loading = true
      const Pro = signDetailPageListAjax
      Pro(params)
        .then(res => {
          if (res.code === 1) {
            res.data.items?.forEach((v, index) => {
              v.index =
                (this.config.currentPage - 1) * this.config.pageSize + index + 1
            })
            this.config.tableData = res.data.items
            this.config.total = res.data.total
            // 刷新表格 防止对不齐
            this.$nextTick(() => {
              this.$refs.MPageLayout?.doLayout()
            })
          }
        })
        .finally(() => {
          this.loading = false
        })
    },
    handleCheckAllChange() {},
    handleClickUserStatusRow(row) {
      this.visibleDialogEditUserStatus = true
    },
    handleSizeChange(val) {
      this.config.pageSize = val
      this.config.currentPage = 1
      this.queryList()
    },
    handleCurrentChange(val) {
      this.config.currentPage = val
      this.queryList()
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    async remoteMethodOperateUser(query) {
      const res = await userNoPage({ nickName: query })
      this.operateUserOptions = res.data
    },
    // 排序
    sortChange({ prop, order }) {
      this.search.orderByWay = 0
      const configMap = {
        createTime: {
          ascending: 0,
          descending: 1,
          default: 0
        }
      }
      if (prop === 'createTime') {
        this.search.orderByWay = configMap[prop][order]
      }
      this.queryList()
    },
    // 重置
    handleClickReset() {
      this.search.operateType = undefined
      this.search.operateUserId = undefined
      // this.search.orderByWay = 0
      this.handleSearch()
    },
    // 搜索
    handleSearch() {
      this.config.currentPage = 1
      this.queryList()
    },
    //审核
    handleAudt(row) {
      this.signFileList = [row]
      this.batchReviewDialogVisable = true
    },
    handleDown(row) {
      this.$uweb?.setAction('Event_oa_reviewDetail_down')
      row.url = handleShowFileUrlByStatus(row)
      fileDownload(row.url, `${row.name}-${row.fileName}.pdf`)
    },
    //落章
    handleFallingChapter(row) {
      row.oneStampingType = 'single'
      this.signFileList = [row]
      this.oneStampingDialogVisable = true
    },
    //批量审核
    handleBatchReview() {
      const list = this.multipleSelection.filter(
        item => item.reviewStatus === 0 && item.employeeSignStatus === 1
      )
      if (list.length === 0) {
        this.$message.error('存在待签署或无待审核文件，无法批量审核')
        return
      }
      this.signFileList = list
      this.batchReviewDialogVisable = true
    },
    //一键落章
    handleOneStamping() {
      const { personnelBaseInfoId } = this.$route.query
      const params = {
        reviewStatus: 1,
        employeeSignStatus: 1,
        sealStatus: 1,
        personnelBaseInfoIds: [personnelBaseInfoId]
      }
      this.oneStampingLoading = true
      this.$store
        .dispatch('oaManage/contractfollowConditionList', params)
        .then(res => {
          if (res?.length === 0) {
            this.$message.error('存在待审核或无待落章文件，无法一键落章')
            return
          }
          this.signFileList = res
          this.oneStampingDialogVisable = true
        })
        .finally(() => {
          this.oneStampingLoading = false
        })
    },
    oneStampingDialogSuccess() {
      this.$uweb?.setAction('Event_oa_reviewDetail_oneStamping')
      this.oneStampingDialogVisable = false
      this.queryList()
    },
    batchReviewDialogSuccess() {
      this.$uweb?.setAction('Event_oa_reviewDetail_batchReview')
      this.batchReviewDialogVisable = false
      this.queryList()
    },
    handlefileNameClick(row) {
      row.url = handleShowFileUrlByStatus(row)
      this.row = { ...row }
      this.reviewFileDialogVisable = true
    }
  }
}
</script>
<style lang="scss" scoped>
.fixed-assets-container {
  overflow: hidden;
  padding: 20px;
  background: #ffffff;
  border-radius: 10px;
  .crumbs-box {
    padding-bottom: 20px;
    border-bottom: 1px solid #eff2f6;
  }
  .assetChangeRecords {
    height: calc(100vh - 300px);
  }
  .assetChangeRecords ::v-deep .el-table__cell {
    padding: 10px 6px;
  }
}
.reviewStatus,
.sealStatus {
  display: inline-block;
  padding: 0 10px;
  width: 74px;
  border-radius: 13px;
  font-size: 12px;
  font-family: MicrosoftYaHei;
  height: 24px;
  line-height: 24px;
  .reviewStatusIcon,
  .sealStatusIcon {
    width: 13px;
    height: 13px;
    font-size: 13px;
    margin-right: 4px;
  }
}

.reviewStatus0,
.sealStatus1 {
  background: #fff2e6;
  color: #ff7d00;
}
.reviewStatus1,
.sealStatus2 {
  background: #e6f7ea;
  color: #00b42a;
}
.reviewStatus2 {
  background: #f6deff;
  color: #b729ff;
}
.pd_l_20 {
  padding-left: 20px;
}
::v-deep .tablePage .page_header .page_header_action {
  justify-content: flex-end;
}
::v-deep .el-table th.el-table-column--selection > .cell {
  display: flex;
  justify-content: space-around;
}
.addBtn {
  border-color: #0c6fff;
  color: #0c6fff;
}
::v-deep .el-button.is-disabled,
.el-button.is-disabled:hover,
.el-button.is-disabled:focus {
  color: #c0c4cc;
  border-color: #e6ebf5;
}
</style>
