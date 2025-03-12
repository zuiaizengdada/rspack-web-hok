<template>
  <div class="page-wrap">
    <div v-if="phoneAreaCode === '86'" class="page-btn">
      <el-button v-permission="['web:wallet:handsel', permsList]" type="primary" @click="handleOpen('give')">赠送</el-button>
      <el-button v-permission="['web:wallet:freeze', permsList]" @click="handleOpen('frozen')">冻结</el-button>
    </div>
    <div class="page-header">
      <el-descriptions title="汇总" :column="5">
        <el-descriptions-item label="充值总额">¥{{ summaryCurrent.rechargeTotal }}元</el-descriptions-item>
        <el-descriptions-item label="申请退款总额">¥{{ summaryCurrent.reqRefundTotal }}获课币</el-descriptions-item>
        <el-descriptions-item label="实际退款总额">¥{{ summaryCurrent.realRefundTotal }}获课币</el-descriptions-item>
        <el-descriptions-item label="冻结总额">
          <span style="margin-right: 40px">¥{{ summaryCurrent.frozenTotal }}获课币</span>
          <span class="page-content-tip">虚拟币1元人民币对应1获课币</span>
        </el-descriptions-item>
      </el-descriptions>
    </div>
    <div class="page-content">
      <MPageLayout
        ref="MPageLayout"
        border
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
        if-index
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      >
        <div slot="operateAmount" slot-scope="scope">
          <div :style="`color:${scope.row.operateType == 2 || scope.row.operateType == 3 ? 'green' : 'red'}`">
            <span v-if="scope.row.operateType == 2 || scope.row.operateType == 3"> - </span>
            <span v-else> + </span>
            <span>{{ getOperateAmout(scope.row) }}</span>
          </div>
        </div>
        <div slot="operateHokAmount" slot-scope="scope">
          <div :style="`color:${scope.row.operateType == 2 || scope.row.operateType == 3 ? 'green' : 'red'}`">
            <span v-if="scope.row.operateType == 2 || scope.row.operateType == 3"> - </span>
            <span v-else> + </span>
            <span>{{ (scope.row.operateHokAmount / 100).toFixed(2) }}</span>
          </div>
        </div>
        <div slot="action" slot-scope="{ row }">
          <el-button v-if="row.status === 5" type="primary" @click="handleRecovery(row)">恢复</el-button>
        </div>
      </MPageLayout>
    </div>
    <modal ref="modal" :balance="summaryCurrent.balance" @submit="handleSubmit" />
  </div>
</template>

<script>
import { walletList, walletMyBalance, walletOperate } from '@/api/wallet'
import modal from './components/modal'
import { getColumns } from './columns.js'
export default {
  components: { modal },
  props: {
    userId: {
      type: String,
      default: ''
    },
    phoneAreaCode: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      time: null,
      active: 'orderNo',
      loading: false,
      allColumnsSelected: true,
      allColumnsSelectedIndeterminate: false,
      slotArr: ['headerRight', 'headerLeft', 'footer', 'action', 'operateAmount', 'operateHokAmount'],
      config: {
        tableData: [],
        tableColumns: getColumns.call(this),
        pageSizes: [10, 20, 30, 40],
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      type: '',
      menus: [],
      crud: {
        loading: false,
        data: []
      },
      summaryCurrent: {
        frozenTotal: '0.00',
        realRefundTotal: '0.00',
        reqRefundTotal: '0.00',
        rechargeTotal: '0.00',
        balance: '0.00'
      },
      permsList: this.$route.meta.permsList || []
    }
  },
  watch: {
    'config.tableColumns': {
      handler(val) {
        const arr = val.filter((v) => v.visible)
        if (arr.length === this.config.tableColumns.length) {
          this.allColumnsSelected = true
          this.allColumnsSelectedIndeterminate = false
        } else {
          this.allColumnsSelected = false
          this.allColumnsSelectedIndeterminate = true
        }
      },
      deep: true,
      immediate: true
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.getList()
      this.getSummary()
    },
    getPractice(val) {
      return ((val ?? 0) / 100).toFixed(2)
    },
    async getSummary() {
      const { data } = await walletMyBalance({
        platformUserId: this.userId
      })
      if (!data) {
        this.summaryCurrent = {
          frozenTotal: '0.00',
          realRefundTotal: '0.00',
          reqRefundTotal: '0.00',
          rechargeTotal: '0.00',
          balance: '0.00'
        }
        return
      }
      this.summaryCurrent = {
        rechargeTotal: this.getPractice(data.rechargeTotal),
        reqRefundTotal: this.getPractice(data.reqRefundTotal),
        realRefundTotal: this.getPractice(data.realRefundTotal),
        frozenTotal: this.getPractice(data.frozenTotal),
        balance: this.getPractice(data.balance)
      }
    },
    getOperateAmout(row) {
      if (row.operateType === 4) {
        return '0.00'
      }
      return (row.operateHokAmount / 100).toFixed(2)
    },
    async recovery(row) {
      try {
        const { code } = await walletOperate({
          operateHokAmount: row.operateHokAmount,
          operateType: 5,
          remark: `恢复冻结${row.id}记录的冻结获课币`,
          recordId: row.id,
          platformUserId: this.userId
        })
        if (code === 1) {
          this.$notify.success('恢复成功')
          this.init()
        }
      } catch (e) {
        console.log(e)
      }
    },
    async handleSubmit(form) {
      try {
        const { code } = await walletOperate({
          operateHokAmount: form.amount * 100,
          operateType: this.type === 'give' ? 4 : 3,
          remark: form.remark,
          platformUserId: this.userId
        })
        if (code === 1) {
          this.$notify.success(`${this.type === 'give' ? '赠送' : '冻结'}成功`)
          this.init()
        }
      } catch (e) {
        console.log(e)
      }
    },
    handleRecovery(row) {
      this.$confirm(`是否恢复冻结${row.id}记录的冻结获课币?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.recovery(row)
        })
        .catch(() => {})
    },
    async getList() {
      const params = {
        current: this.config.currentPage,
        size: this.config.pageSize,
        platformUserId: this.userId
      }
      const { data } = await walletList(params)
      this.config.tableData = data.records
      this.config.total = data.total
      this.loading = false
    },
    handleSizeChange(val) {
      this.config.pageSize = val
      this.config.currentPage = 1
      this.getList()
    },
    handleCurrentChange(val) {
      this.config.currentPage = val
      this.getList()
    },
    handleOpen(type) {
      this.type = type
      this.getSummary()
      this.$refs.modal.open({
        type
      })
    },
    // 点击重置按钮
    clear() {
      const tableColumns = getColumns()
      this.config.tableColumns = tableColumns
      localStorage.setItem('msg_tableColumns', JSON.stringify(tableColumns))
    }
  }
}
</script>

<style lang="scss" scoped>
.page-wrap ::v-deep {
  height: 500px;
  background: #fff;
  .page-btn {
    margin: 0 0 10px 20px;
  }
  .page-header {
    padding: 0 20px;
    .page-content-tip {
      color: #7f7f7f;
    }
  }
  .page-content {
    height: 400px;
  }
}
</style>
