<template>
  <!-- 消息模板 -->
  <div class="page-wrap">
    <div class="filter_top">
      <filterTop @search="handleSearch" />
    </div>
    <!--表格渲染-->
    <div class="page-content">
      <el-descriptions title="汇总" :column="5">
        <el-descriptions-item label="充值总额">
          ¥{{ summaryCurrent.rechargeTotal }}元
        </el-descriptions-item>
        <el-descriptions-item label="申请退款总额">
          ¥{{ summaryCurrent.reqRefundTotal }}获课币
        </el-descriptions-item>
        <el-descriptions-item label="实际退款总额">
          ¥{{ summaryCurrent.realRefundTotal }}获课币
        </el-descriptions-item>
        <el-descriptions-item label="可用余额">
          ¥{{ summaryCurrent.balance }}获课币
        </el-descriptions-item>
        <el-descriptions-item label="冻结总额">
          <span style="margin-right: 40px">
            ¥{{ summaryCurrent.frozenTotal }}获课币
          </span>
          <!-- <span class="page-content-tip">虚拟币1元人民币对应1获课币</span> -->
        </el-descriptions-item>
      </el-descriptions>
    </div>
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
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    >
      <div slot="nickName" slot-scope="scope">
        <div class="nickName">
          <AppAvatar
            :avatar="scope.row.headImg"
            :name="scope.row.nickName"
            width="45"
            :no-name="true"
          />
          <div class="m-l-10">
            <div>{{ scope.row.nickName }}</div>
          </div>
        </div>
      </div>
      <div slot="email" slot-scope="scope">
        <span>
          <span v-if="!scope.row.emailFlag">{{ scope.row.email }}</span>
          <span v-else>{{ scope.row.emailStr }}</span>
          <i
            v-if="!scope.row.emailFlag && scope.row.email"
            class="pointer el-icon-view"
            @click="onClickChangeEmailFlag(scope.row)"
          />
        </span>
      </div>
      <div slot="operateAmount" slot-scope="scope">
        <div
          :style="`color:${
            scope.row.operateType == 2 || scope.row.operateType == 3
              ? 'green'
              : 'red'
          }`"
        >
          <span v-if="scope.row.operateType == 2 || scope.row.operateType == 3">
            -
          </span>
          <span v-else> + </span>
          <span>{{ getOperateAmout(scope.row) }}</span>
        </div>
      </div>
      <div slot="operateHokAmount" slot-scope="scope">
        <div
          :style="`color:${
            scope.row.operateType == 2 || scope.row.operateType == 3
              ? 'green'
              : 'red'
          }`"
        >
          <span v-if="scope.row.operateType == 2 || scope.row.operateType == 3">
            -
          </span>
          <span v-else> + </span>
          <span>{{ (scope.row.operateHokAmount / 100).toFixed(2) }}</span>
        </div>
      </div>
    </MPageLayout>
  </div>
</template>

<script>
import { walletList, walletSummary } from '@/api/wallet'
import { getColumns } from './columns.js'
import filterTop from './components/filterTop'
import AppAvatar from '@/components/AppAvatar/AppAvatar.vue'
import {
  getEmailByUser
} from '@/api/phoneEncrypt'
export default {
  name: 'MessageLog',
  components: { filterTop, AppAvatar },
  data() {
    return {
      time: null,
      active: 'orderNo',
      loading: false,
      allColumnsSelected: true,
      allColumnsSelectedIndeterminate: false,
      slotArr: [
        'headerRight',
        'headerLeft',
        'footer',
        'nickName',
        'operateAmount',
        'operateHokAmount',
        'email'
      ],
      config: {
        tableData: [],
        tableColumns: getColumns.call(this),
        pageSizes: [10, 20, 30, 40],
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      menus: [],
      crud: {
        loading: false,
        data: []
      },
      query: {},
      summaryCurrent: {
        frozenTotal: '0.00',
        realRefundTotal: '0.00',
        reqRefundTotal: '0.00',
        rechargeTotal: '0.00',
        balance: '0.00'
      }
    }
  },
  watch: {
    'config.tableColumns': {
      handler(val) {
        const arr = val.filter(v => v.visible)
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
    onClickChangeEmailFlag(item) {
      getEmailByUser(item.platformUserId).then(res => {
        if (res.code === 1 && res.data) {
          this.$set(item, 'emailStr', res.data)
          this.$set(item, 'emailFlag', true)
        }
      })
    },
    init() {
      this.getList()
      this.getSummary()
    },
    handleSearch(val) {
      this.config.currentPage = 1
      this.query = val
      this.getList()
      this.getSummary()
    },
    getPractice(val) {
      return ((val ?? 0) / 100).toFixed(2)
    },
    getOperateAmout(row) {
      if (row.operateType === 4) {
        return '0.00'
      }
      return (row.operateHokAmount / 100).toFixed(2)
    },
    async getSummary() {
      const { data } = await walletSummary(this.query)
      this.summaryCurrent = {
        rechargeTotal: this.getPractice(data.rechargeTotal),
        reqRefundTotal: this.getPractice(data.reqRefundTotal),
        realRefundTotal: this.getPractice(data.realRefundTotal),
        frozenTotal: this.getPractice(data.frozenTotal),
        balance: this.getPractice(data.balance)
      }
    },
    async getList(val = {}) {
      const params = {
        current: this.config.currentPage,
        size: this.config.pageSize,
        ...this.query
      }
      const { data } = await walletList(params)
      this.config.tableData = data.records?.map(i => {
        return {
          ...i,
          uid: i.userId
        }
      })
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
@import '~@/styles/variables.scss';
::v-deep .el-input-number .el-input__inner {
  text-align: left;
}
::v-deep .vue-treeselect__control,
::v-deep .vue-treeselect__placeholder,
::v-deep .vue-treeselect__single-value {
  height: 30px;
  line-height: 30px;
}
.page-wrap ::v-deep {
  @include responsive-height(400px);
  .filter_top {
    margin-bottom: 20px;
    padding: 20px;
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 0px 2px 4px -1px rgba(0, 0, 0, 0.12),
      0px 4px 5px 0px rgba(0, 0, 0, 0.08), 0px 1px 10px 0px rgba(0, 0, 0, 0.05);
  }
  .page-content {
    background: #fff;
    padding: 20px;
    .page-content-tip {
      color: #7f7f7f;
    }
  }
  .nickName {
    display: flex;
    align-items: center;
  }
  .filter-item {
    margin-right: 10px;
  }
  .PageLayout {
    background: #fff;
  }

  .el-input-group__prepend {
    background-color: #fff;
  }
}

.el-icon-view {
  margin-left: 10px;
  color: #409EFF
}
</style>
