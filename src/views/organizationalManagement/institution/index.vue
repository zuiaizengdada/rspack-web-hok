<template>
  <div class="page_wrap">
    <el-tabs v-model="activeName" @tab-click="handleChangeTab">
      <el-tab-pane label="审核中" name="1">
        <MPageLayout
          ref="MPageLayout"
          type="tablePage"
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
        >
          <template slot="search">
            <filterTop
              :loading="loading"
              :search="search"
              @onSearch="searchFn"
              @onClear="onClear"
            />
          </template>
          <template slot="logo" slot-scope="{ row }">
            <div class="flex">
              <el-image
                v-if="row.bigLogo"
                style="width: 80px; height: 60px"
                :src="row.bigLogo"
                fit="contain"
                :preview-src-list="[row.bigLogo]"
              />
              <el-image
                v-if="row.smallLogo"
                style="width: 80px; height: 60px"
                :src="row.smallLogo"
                fit="contain"
                :preview-src-list="[row.smallLogo]"
              />
            </div>
          </template>
          <template slot="businessLicense" slot-scope="{ row }">
            <el-image
              v-if="row.businessLicense"
              style="width: 80px; height: 60px"
              :src="row.businessLicense"
              fit="contain"
              :preview-src-list="[row.businessLicense]"
            />
          </template>
          <template slot="action" slot-scope="{ row }">
            <el-button type="text" @click="handleEdit(row)">编辑</el-button>
            <el-button
              v-if="row.status === 0"
              type="text"
              @click="handleApproved(row)"
            >
              审核通过
            </el-button>
            <el-button
              v-else-if="row.status === 1"
              type="text"
              @click="handleOpen(row)"
            >
              开通完成确认
            </el-button>
          </template>
          <template slot="phone" slot-scope="{ row }">
            <Phone
              :default-value="row.phone"
              :user-id="row.id"
              :get-phone-query="institutionalGetPhoneApi"
            />
          </template>
        </MPageLayout>
      </el-tab-pane>
      <el-tab-pane label="已入驻" name="2">
        <MPageLayout
          ref="MPageLayout2"
          type="tablePage"
          :slot-arr="slotArr"
          :current-page="config.currentPage"
          :page-sizes="config.pageSizes"
          :page-size="config.pageSize"
          :total="config.total"
          :table-data="config.tableData"
          :table-columns="config.tableColumns2"
          :loading="loading"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        >
          <template slot="search">
            <filterTop
              :loading="loading"
              :search="search"
              type="2"
              @onSearch="searchFn"
              @onClear="onClear"
            />
          </template>
          <template slot="phone" slot-scope="{ row }">
            <Phone
              :default-value="row.phone"
              :user-id="row.organizationId"
              :get-phone-query="organizationGetPhoneApi"
            />
          </template>
          <template slot="signContractStatus" slot-scope="{ row }">
            {{ signContractStatus[row.signContractStatus] }}
          </template>
          <template slot="contractStatus" slot-scope="{ row }">
            {{ contractStatus[row.contractStatus] }}
          </template>
          <template slot="accountStatus" slot-scope="{ row }">
            {{ accountStatus[row.accountStatus] }}
          </template>
          <template slot="action" slot-scope="scope">
            <el-button type="text" @click="handleOpen(scope.row)">
              编辑
            </el-button>
            <el-button type="text" @click="handleConfiguration(scope.row)">
              配置
            </el-button>
            <el-button type="text" @click="handleDetail(scope.row)">
              详情
            </el-button>
            <el-dropdown trigger="click">
              <el-button type="text" class="m-l-10">更多</el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>
                  <el-button
                    type="text"
                    @click.native="openContractHistory(scope.row)"
                  >
                    合同记录
                  </el-button>
                </el-dropdown-item>
                <el-dropdown-item>
                  <el-button
                    type="text"
                    @click.native="setAccountStatus(scope.row)"
                  >
                    {{ scope.row.accountStatus === 0 ? '关停' : '重启' }}账号
                  </el-button>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </MPageLayout>
      </el-tab-pane>
    </el-tabs>
    <!-- 入驻前 编辑 -->
    <el-drawer
      title="编辑机构"
      size="600px"
      :visible.sync="drawerConfig.visible"
      direction="rtl"
      :wrapper-closable="false"
    >
      <Edit
        v-if="drawerConfig.visible"
        :type="activeName"
        :info="drawerConfig.row"
        @success="handleSuccess"
        @close="handleClose"
      />
    </el-drawer>
    <!-- 入驻前 审核通过 -->
    <AppDialog
      v-model="dialogModel.visible"
      title="审核通过确认"
      width="800px"
      height="80%"
      :loading="dialogModel.loading"
      @success="handleSubmitApproved"
    >
      <Approved
        v-if="dialogModel.visible"
        ref="Approved"
        :info="dialogModel.row"
        @success="handleSuccess"
      />
    </AppDialog>
    <!-- 入驻前 完成开通确认 / 入驻后编辑-->
    <el-drawer
      title="完成开通确认"
      size="600px"
      :visible.sync="openConfig.visible"
      direction="rtl"
      :wrapper-closable="false"
    >
      <Open
        v-if="openConfig.visible"
        :type="activeName"
        :info="openConfig.row"
        @close="handleClose"
        @success="handleSuccess"
      />
    </el-drawer>

    <!-- 入驻后 详情 -->
    <AppDialog
      v-model="detailModel.visible"
      :btn-footer="false"
      title="详情"
      width="900px"
      height="auto"
      :loading="detailModel.loading"
    >
      <Detail
        v-if="detailModel.visible"
        :type="activeName"
        :info="detailModel.row"
      />
    </AppDialog>
    <!-- 入驻后 配置 -->
    <AppDialog
      v-model="configurationModel.visible"
      :btn-footer="false"
      title="配置"
      width="900px"
      height="auto"
      class="configuration-dialog"
      :loading="configurationModel.loading"
    >
      <Configuration
        v-if="configurationModel.visible"
        :info="configurationModel.row"
      />
    </AppDialog>
    <ContractHistoryDialog ref="contractHistoryRef" />
  </div>
</template>

<script>
import {
  beforeGetOrganizationList,
  getOrganizationList,
  odealTenantAccountStatusApi,
  institutionalGetPhoneApi,
  organizationGetPhoneApi
} from '@/api/organization/settings.js'
import { findLabelByValue } from '@/utils'
import AppDialog from '@/components/AppDialog'
import Phone from '@/components/watchPhoneNumber/index.vue'
import filterTop from './components/filterTop.vue'
import Detail from './components/detail.vue'
import Edit from './components/editDialog.vue'
import Open from './components/openDialog.vue'
import Approved from './components/approved.vue'
import Configuration from './components/configuration.vue'
import ContractHistoryDialog from './components/contractHistoryDialog.vue'
import {
  getColumns,
  getColumns2,
  statusOption,
  typeOption
} from './components/columns.js'
export default {
  components: {
    filterTop,
    AppDialog,
    Detail,
    Edit,
    Open,
    Approved,
    Phone,
    Configuration,
    ContractHistoryDialog
  },
  data() {
    return {
      institutionalGetPhoneApi,
      organizationGetPhoneApi,
      contractStatus: ['', '未生效', '合作中', '已过期', '合同已终止'], // 合同状态
      signContractStatus: ['未签署', '已签署'], // 是否签署
      accountStatus: ['使用中', '已关停'], // 账号状态
      findLabelByValue,
      typeOption,
      activeName: '1',
      statusOption,
      slotArr: [
        'action',
        'search',
        'type',
        'footer',
        'status',
        'logo',
        'businessLicense',
        'phone',
        'signContractStatus',
        'contractStatus',
        'accountStatus'
      ],
      config: {
        tableData: [],
        tableColumns: getColumns(),
        tableColumns2: getColumns2(),
        pageSizes: [10, 20, 50, 100],
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      search: {
        activeFlag: '',
        name: ''
      },
      loading: false,
      dialogModel: {
        visible: false,
        loading: false,
        row: {}
      },
      detailModel: {
        visible: false,
        loading: false,
        row: {}
      },
      drawerConfig: {
        visible: false,
        row: {},
        isEdit: true
      },
      openConfig: {
        visible: false,
        loading: false,
        row: {}
      },
      configurationModel: {
        visible: false,
        loading: false,
        row: {}
      }
    }
  },
  mounted() {
    this.searchFn()
  },
  methods: {
    handleChangeTab(val) {
      this.activeName = val.name
      this.onClear()
    },
    // 获取列表数据
    async getList() {
      this.loading = true
      const params = {
        pageIndex: this.config.currentPage,
        pageSize: this.config.pageSize,
        status: this.activeName === '2' ? undefined : this.search.status,
        companyName: this.search.companyName,
        type: this.search.type,
        signContractStatus:
          this.activeName === '2' ? this.search.signContractStatus : ''
      }
      try {
        const Pro =
          this.activeName === '1'
            ? beforeGetOrganizationList
            : getOrganizationList
        const res = await Pro(params)
        this.config.tableData = res.data.items.map(i => ({
          ...i,
          typeName: i.type ? findLabelByValue(i.type, typeOption) : '',
          statusName:
            this.activeName === '1'
              ? findLabelByValue(i.status, statusOption)
              : '',
          status: this.activeName === '1' ? i.status : 2
        }))
        this.config.total = res.data.total
        this.loading = false
      } catch (err) {
        this.loading = false
      }
      this.$nextTick(() => {
        this.$refs.MPageLayout2 && this.$refs.MPageLayout2.doLayout()
      })
    },
    // 筛选触发
    searchFn() {
      this.config.currentPage = 1
      this.getList()
    },
    // 分页改变触发
    handleSizeChange(val) {
      this.config.pageSize = val
      this.searchFn()
    },
    // 当前页改变触发
    handleCurrentChange(val) {
      this.config.currentPage = val
      this.getList()
    },
    // 编辑
    handleEdit(row) {
      this.drawerConfig = {
        visible: true,
        row: JSON.parse(JSON.stringify(row))
      }
    },
    // 关停 重启 账号
    setAccountStatus({ accountStatus, organizationId, name }) {
      this.$delModal({
        tips:
          name +
          (accountStatus === 0
            ? ` 关停账号将会影响客户使用系统，请确认。`
            : ` 确定重启账号吗？`),
        success: () => {
          this.loading = true
          odealTenantAccountStatusApi({
            status: accountStatus === 0 ? 1 : 0,
            tenantId: organizationId
          })
            .then(res => {
              this.loading = false
              this.getList()
              this.$notify.success('修改成功')
            })
            .catch(() => {
              this.loading = false
              this.$notify.success('修改失败')
            })
        }
      })
    },
    // 打开合同记录
    openContractHistory(row) {
      console.log('row---', row)
      this.$refs.contractHistoryRef.openDialog({
        organizationId: row.organizationId
      })
    },
    handleApproved(row) {
      this.dialogModel = {
        visible: true,
        loading: false,
        row: JSON.parse(JSON.stringify(row))
      }
    },
    handleDetail(row) {
      this.detailModel = {
        visible: true,
        loading: false,
        row: JSON.parse(JSON.stringify(row))
      }
    },
    handleOpen(row) {
      this.openConfig = {
        visible: true,
        loading: false,
        row: JSON.parse(JSON.stringify(row))
      }
    },
    handleConfiguration(row) {
      this.configurationModel = {
        visible: true,
        loading: false,
        row: JSON.parse(JSON.stringify(row))
      }
    },
    onClear() {
      this.search = {
        status: '',
        name: ''
      }
      this.searchFn()
    },
    handleClose() {
      this.drawerConfig.visible = false
      this.dialogModel.visible = false
      this.openConfig.visible = false
    },
    handleSuccess() {
      this.handleClose()
      this.searchFn()
    },
    handleSubmitApproved() {
      this.$refs.Approved.submit()
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/styles/variables.scss';
.page_wrap {
  @include responsive-height(20px);
  background-color: #fff;
  border-radius: 10px;
  padding: 20px;

  ::v-deep .el-drawer__header {
    padding: 20px;
    border-bottom: 1px solid #e4e7ed;
    font-weight: 600;
    color: #333;
    margin-bottom: 20px;
  }

  ::v-deep .el-tabs__header {
    margin: 0;
  }

  ::v-deep .el-tabs__content {
    @include responsive-height(100px);
  }

  ::v-deep .el-tab-pane {
    height: 100%;
  }

  ::v-deep .tablePage .page_footer {
    justify-content: space-between;
    box-shadow: none;
    padding: 10px 0px 0px;
    height: auto;
  }

  ::v-deep .page_header {
    padding: 0 !important;
  }

  ::v-deep .my-table {
    margin: 0 !important;
  }
}
</style>
