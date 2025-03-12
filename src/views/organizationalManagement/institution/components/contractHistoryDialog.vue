<template>
  <AppDialog
    v-model="visible"
    title="合同记录"
    width="1183px"
    :loading="loading"
    height="auto"
    @close="closeDialog"
  >
    <div class="remid">
      <el-button type="primary" size="small" @click="openRemindFn">
        设置合同到期提醒
      </el-button>
    </div>
    <MPageLayout
      ref="MHistoryPageLayout"
      class="history-dialog"
      style="height: 550px"
      type="tablePage"
      :slot-arr="pageInfo.slotArr"
      row-key="contractCode"
      checkbox
      :current-page="config.currentPage"
      :page-sizes="config.pageSizes"
      :page-size="config.pageSize"
      :total="config.total"
      :table-data="config.tableData"
      :table-columns="pageInfo.columns"
      reserve-selection
      :loading="loading"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    >
      <template slot="contractStartTime" slot-scope="{ row }">
        {{ row.contractStartTime }} - {{ row.contractEndTime }}
      </template>
      <template slot="contractMonth" slot-scope="{ row }">
        {{ row.contractMonth }} 个月
      </template>
      <template slot="status" slot-scope="{ row }">
        {{ options['status'][row.status] }}
      </template>
      <template slot="attachmentUrl" slot-scope="{ row }">
        <div v-if="row.attachmentUrl" class="flex">
          <div
            v-for="item in row.attachmentUrl.split(',')"
            :key="item"
            class="image_poster"
          >
            <imgShow :url="item" style="width: 100%; height: 100%" />
          </div>
        </div>
      </template>
      <template slot="settlePeriod" slot-scope="{ row }">
        {{ options['settlePeriod'][row.settlePeriod] }}
      </template>
      <template slot="action" slot-scope="{ row }">
        <el-button
          v-if="[1, 2].includes(row.status)"
          type="text"
          @click="closeContract(row)"
        >
          终止
        </el-button>
      </template>
    </MPageLayout>
    <div slot="footer" />
    <ContractRemindDialog ref="contractRemindDialogRef" />
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import imgShow from '@/views/teacherCenter/components/imgShow.vue'
import ContractRemindDialog from './contractRemindDialog.vue'
import {
  orgContractPageApi,
  orgContractTerminateApi
} from '@/api/organization/settings.js'
import { getHistorPage } from './columns'

export default {
  components: {
    AppDialog,
    imgShow,
    ContractRemindDialog
  },
  data() {
    return {
      visible: false,
      title: '',
      loading: false,
      pageInfo: getHistorPage(),
      config: {
        tableData: [],
        pageSizes: [10, 20, 50, 100],
        pageSize: 10,
        organizationId: '',
        currentPage: 1,
        total: 0
      },
      options: {
        status: ['', '未生效', '合作中', '合同过期', '合同终止'],
        settlePeriod: ['', '按月结算', '按季度结算', '按年结算']
      }
    }
  },
  methods: {
    // 获取列表数据
    async getList() {
      this.loading = true
      const params = {
        pageIndex: this.config.currentPage,
        pageSize: this.config.pageSize,
        organizationId: this.config.organizationId
      }
      try {
        const res = await orgContractPageApi(params)
        this.config.tableData = res.data.items
        this.config.total = res.data.total
        this.loading = false
      } catch (err) {
        this.loading = false
      }
      this.$nextTick(() => {
        this.$refs.MHistoryPageLayout &&
          this.$refs.MHistoryPageLayout.doLayout()
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
      this.this.config = {
        tableData: [],
        pageSizes: [10, 20, 50, 100],
        pageSize: 10,
        organizationId: '',
        currentPage: 1,
        total: 0
      }
      this.getList()
    },
    // 终止合同
    closeContract(row) {
      this.$delModal({
        tips: `确定终止合同吗？`,
        success: () => {
          this.loading = true
          orgContractTerminateApi({
            contractId: row.id
          })
            .then(res => {
              this.loading = false
              this.getList()
              this.$notify.success('合同已终止')
            })
            .catch(() => {
              this.loading = false
              this.$notify.success('终止合同失败')
            })
        }
      })
    },
    openRemindFn() {
      this.$refs.contractRemindDialogRef.openDialog({
        organizationId: this.config.organizationId
      })
    },
    // 关闭弹窗
    closeDialog() {
      this.title = ''
      this.visible = false
      this.loading = false
    },
    // 打开弹窗
    openDialog({ organizationId }) {
      this.visible = true
      this.config.organizationId = organizationId
      this.getList()
    }
  }
}
</script>

<style lang="scss" scoped>
.image_poster {
  position: relative;
  width: 80px;
  height: 60px;
  background: #ffffff;
  border-radius: 4px;
  background: #fafafa;
  display: flex;
  flex-wrap: wrap;
  margin-right: 10px;
  margin-bottom: 10px;
  ::v-deep .imgView {
    width: 100%;
    height: 100%;
  }
}
.remid {
  display: flex;
  justify-content: flex-end;
  margin: 10px 20px -10px 0;
}
.flex {
  display: flex;
  flex-wrap: wrap;
}
::v-deep {
  .tablePage .page_footer {
    justify-content: flex-end;
  }
}
</style>
