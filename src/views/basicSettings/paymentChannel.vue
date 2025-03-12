<template>
  <div class="page_wrap">
    <MCard>
      <div class="page_wrap_header">
        <div class="header_wrap">
          <div>收款渠道</div>
          <!-- <el-button
            v-permission="['web:paymentChannel:add', permsList]"
            size="small"
            type="primary"
            :loading="loading"
            @click="openAddModel"
          ><i class="el-icon-plus" /> 新增收款渠道</el-button> -->
        </div>
      </div>
      <div class="page_table">
        <dynamicTable
          ref="table"
          v-model="tableData"
          :columns="columns"
          :get-list-api="getList"
        >
          <template slot="action" slot-scope="{ row }">
            <el-button
              v-permission="['web:paymentChannel:edit', permsList]"
              type="text"
              @click="handleClickEdit(row)"
            >编辑</el-button>
            <el-button
              v-permission="['web:paymentChannel:disable', permsList]"
              type="text"
              @click="handleClickDisable(row)"
            >{{ row.status === 0? '禁用':'启用' }}</el-button>
            <el-button
              v-permission="['web:paymentChannel:del', permsList]"
              type="text"
              style="color: #F53F3F"
              @click="handleClickDel(row)"
            >删除</el-button>
          </template>
          <template slot="status" slot-scope="{ row }">
            <AppStatus :status="['success', 'error'][row.status]">
              <span>
                {{ ['启用', '禁用'][row.status] }}
              </span>
            </AppStatus>
          </template>
        </dynamicTable>
      </div>
    </MCard>
    <PayChannelDialog ref="payChannelDialog" @success="successFn" />
  </div>
</template>

<script>
import AppStatus from '@/components/AppStatus'
import dynamicTable from '@/components/DynamicTable/table'
import PayChannelDialog from './components/payChannelDialog.vue'
import { getPaymentchannelPage, disablePaymentchannel, deletePaymentchannel } from '@/api/deliver/baseSeeting'
export default {
  components: {
    AppStatus,
    PayChannelDialog,
    dynamicTable
  },
  data() {
    return {
      tableData: [],
      columns: [
        { prop: 'channel', label: '收款渠道', type: 'text' },
        { prop: 'company', label: '收款单位', type: 'text' },
        { prop: 'account', label: '收款账号', type: 'text' },
        { prop: 'createBy', label: '创建人', type: 'text' },
        { prop: 'createTime', label: '创建时间', type: 'text' },
        { prop: 'status', label: '状态', type: 'slot' }
        // { prop: 'action', label: '操作', type: 'slot' }
      ],
      loading: false,
      payChannelConfig: {
        visible: false,
        type: 1,
        row: {},
        title: '新增收款渠道'
      },
      permsList: this.$route.meta.permsList || []
    }
  },
  // activated() {
  //   this.init()
  // },
  methods: {
    init() {
      this.$refs.table.config.pageIndex = 1
      this.$refs.table.onRefresh()
    },
    async getList(params) {
      return getPaymentchannelPage({
        ...params,
        current: params.pageIndex,
        size: params.pageSize,
        pageIndex: undefined,
        pageSize: undefined
      }).then(res => {
        res.data.items = res.data.records
        return res
      })
    },
    // 点击新增收款渠道按钮
    openAddModel() {
      this.$refs.payChannelDialog.open({}, 1)
    },
    // 点击编辑按钮
    handleClickEdit(row) {
      this.$refs.payChannelDialog.open(row, 2)
    },
    // 点击禁用按钮
    handleClickDisable(row) {
      const text = row.status === 0 ? '禁用' : '启用'
      this.$delModal({
        tips: `是否确认${text},${text}之后会影响搜索和导入数据`,
        success: () => {
          this.loading = true
          const data = {
            id: row.id
          }
          disablePaymentchannel(data).then(res => {
            this.loading = false
            this.$notify.success({ title: '提示', message: '操作成功' })
            this.init()
          }).catch(() => {
            this.loading = false
          })
        }
      })
    },
    // 点击删除按钮
    handleClickDel(row) {
      this.$delModal({
        tips: `确定删除该收款渠道？`,
        success: () => {
          this.loading = true
          const data = {
            id: row.id
          }
          deletePaymentchannel(data).then(res => {
            this.loading = false
            this.$notify.success({ title: '提示', message: '操作成功' })
            this.init()
          }).catch(() => {
            this.loading = false
          })
        }
      })
    },

    // 新增或者编辑的回调
    successFn() {
      this.init()
    }
  }
}
</script>

<style lang='scss' scoped>
.page_wrap {
  height: calc(100vh - 94px);
  background: #fff;
  border-radius: 5px;
  min-width: 1200px;
  overflow: auto;
  box-shadow: 0px 2px 4px -1px rgba(0, 0, 0, 0.12), 0px 4px 5px 0px rgba(0, 0, 0, 0.08),
    0px 1px 10px 0px rgba(0, 0, 0, 0.05);
  .page_wrap_header {
    padding-left: 20px;
    padding-right: 20px;
    font-weight: bold;
    .header_wrap {
      padding-bottom: 20px;
      padding-left: 16px;
      padding-right: 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      box-sizing: border-box;
      border-bottom: 1px solid #e7e7e7;
      font-size: 16px;
      font-family: MicrosoftYaHei;
      color: #333333;
      line-height: 24px;
    }
  }
  .page_table {
    height: calc(100% - 34px);
    padding: 16px 20px;
  }
}
::v-deep {
    .page_header{
        padding: 0!important;
        min-height: 0!important;
    }
     .my-table{
        margin:0!important
    }
    .tablePage .page_footer{
        box-shadow: none;
    }
}
</style>
