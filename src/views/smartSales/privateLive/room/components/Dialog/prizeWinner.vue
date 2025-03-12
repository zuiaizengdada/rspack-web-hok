<template>
  <!-- 中奖结果       -->
  <AppDialog
    v-model="visible"
    :title="title"
    width="1000px"
    :loading="loading"
    height="auto"
    :top="top"
    @success="sure"
  >
    <div v-loading="loading" class="prizeWinner">
      <el-table
        ref="elTable"
        height="383px"
        style="width: 100%"
        :header-cell-style="{
          background: '#EFF2F6',
          padding: '9px 0',
          color: '#333',
          'font-weight': 700,
          'letter-spacing': '1px'
        }"
        :data="list"
        :class="{ 'zb-table': true, 'el-table-null': !list.length }"
      >
        <el-table-column prop="prizeDrawName" label="抽奖名称" width="132" />
        <el-table-column prop="prizeOrderId" label="中奖订单号" width="150" />
        <el-table-column prop="winnerUserName" label="用户昵称" width="80">
          <template slot-scope="{ row }">
            {{ filtersTextPhone(row.winnerUserName) }}
          </template>
        </el-table-column>
        <el-table-column prop="winnerUserPhone" label="手机号码" width="160">
          <template slot-scope="{ row }">
            <watchPhoneNumber
              :phone-area-code="row.phoneAreaCode"
              :default-value="row.winnerUserPhone"
              :params="row"
              :user-id="row.winnerUserId"
              :get-api="operationLogsWrite"
            />
          </template>
        </el-table-column>
        <el-table-column prop="email" label="邮箱" width="220">
          <template slot-scope="{ row }">
            <watchPhoneNumber
              v-if="row.email"
              :default-value="row.email"
              :params="row"
              :user-id="row.couponUserId"
              :onhandle-click="operationLogsWriteEmail"
            />
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="中奖时间" width="160">
          <template slot-scope="{ row }">
            {{ row.createTime | filterTime }}
          </template>
        </el-table-column>
        <el-table-column prop="giveawayType" label="奖品类型" width="120">
          <template slot-scope="{ row }">
            {{
              { 1: '虚拟商品', 2: '实物商品', 3: '优惠券' }[row.giveawayType]
            }}
          </template>
        </el-table-column>
        <el-table-column prop="giveawayName" label="中奖奖品" width="120" />
        <el-table-column prop="amount" label="数量" width="120" />
        <el-table-column
          v-if="showAction"
          prop="prizeIssueStatus"
          label="发放状态"
          width="120"
        >
          <template slot-scope="{ row }">
            {{ { 1: '未发放', 2: '已发放' }[row.prizeIssueStatus] }}
          </template>
        </el-table-column>
        <el-table-column
          v-if="showAction"
          label="操作"
          width="129"
          fixed="right"
        >
          <template slot-scope="{ row }">
            <el-button
              v-if="row.giveawayType === 2 && row.prizeIssueStatus === 1"
              type="text"
              @click="onhandleSendGoods(row)"
            >发货</el-button>
            <el-button
              v-if="row.giveawayType === 2"
              type="text"
              @click="onhandleDetail(row)"
            >详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          :current-page="currentPage"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          :pager-count="5"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
    <div v-if="showAction" slot="footer" class="ss-material-box-bottom">
      <el-button size="small" @click="visible = false">取消</el-button>
      <el-button
        :loading="downLoading"
        size="small"
        type="primary"
        style="
          height: 32px;
          line-height: 32px;
          padding-top: 0;
          padding-bottom: 0;
        "
        @click="onHandleDown"
      >
        <svg-icon
          v-if="!downLoading"
          class-name="daochuicon"
          icon-class="daochu"
        />
        导出名单
      </el-button>
    </div>

    <sendGoods :config="sendGoodsConfig" @success="sendGoodsSuccess" />
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import sendGoods from './sendGoods.vue'
import { prizeWinnerlist, prizeWinnersExport } from '@/api/liveRoom/setting.js'
import moment from 'moment'
import { liveOperationType } from '@/views/live/columns.js'
import watchPhoneNumber from '@/components/watchPhoneNumber'
import { filtersTextPhone } from '@/utils/index'
export default {
  filters: {
    filterTime(val) {
      if (!val) {
        return ''
      } else {
        return moment(val).format('YYYY-MM-DD HH:mm')
      }
    }
  },
  components: {
    AppDialog,
    sendGoods,
    watchPhoneNumber
  },
  data() {
    return {
      loading: false,
      visible: false,
      title: '中奖名单',
      list: [],
      top: '114px',
      pageSize: 10,
      currentPage: 1,
      liveRoomId: '',
      prizeDrawId: '',
      downLoading: false,
      showAction: false,
      sendGoodsConfig: {
        visible: false,
        type: 1,
        winId: '',
        liveRoomId: ''
      },
      total: 0
    }
  },
  mounted() {
    this.top = Math.abs(window.innerHeight - 595) / 2 + 'px'
    this.$nextTick(() => {
      this.searchFn()
    })
  },
  methods: {
    filtersTextPhone(str) {
      return filtersTextPhone(str)
    },
    sure() {
      this.visible = false
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.currentPage = 1
      this.searchFn()
    },
    searchFn() {
      this.currentPage = 1
      this.getList()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getList()
    },
    getList() {
      this.loading = true
      const data = {
        pageIndex: this.currentPage,
        pageSize: this.pageSize,
        liveRoomId: this.liveRoomId,
        prizeDrawId: this.prizeDrawId
      }
      prizeWinnerlist(data)
        .then(res => {
          console.log(res)
          this.list = res.data.items
          this.total = res.data.total
          this.$nextTick(() => {
            this.$refs.elTable && this.$refs.elTable.doLayout()
            this.loading = false
          })
        })
        .catch(() => {
          this.loading = false
        })
    },
    sendGoodsSuccess() {
      this.sendGoodsConfig = {
        visible: false,
        type: 1,
        winId: '',
        liveRoomId: this.liveRoomId
      }
      this.getList()
    },
    onHandleDown() {
      this.downLoading = true
      const data = {
        liveRoomId: this.liveRoomId,
        prizeDrawId: this.prizeDrawId
      }
      prizeWinnersExport(data)
        .then(res => {
          var newWin = window.open('loading page', '_blank')
          newWin.location.href = res.data // 成功 重定向到目标页面
          this.downLoading = false
        })
        .catch(() => {
          this.downLoading = false
        })
    },
    onhandleSendGoods(row) {
      console.log('点击发货')
      this.sendGoodsConfig = {
        visible: true,
        type: 1,
        winId: row.id,
        liveRoomId: this.liveRoomId
      }
    },
    onhandleDetail(row) {
      this.sendGoodsConfig = {
        visible: true,
        type: 2,
        winId: row.id,
        liveRoomId: this.liveRoomId
      }
      console.log(row, '点击详情')
    },
    operationLogsWriteEmail(params) {
      const data = {
        liveRoomId: this.liveRoomId,
        userId: params.winnerUserId,
        queryType: 2,
        email: params.email,
        operationType: liveOperationType.type7
      }
      return this.$store.dispatch('im/operationLogsWrite', data)
    },
    // 手机号埋点
    operationLogsWrite(params) {
      const data = {
        liveRoomId: this.liveRoomId,
        userId: params.winnerUserId,
        phoneNum: params.winnerUserPhone,
        operationType: liveOperationType.type7
      }
      return this.$store.dispatch('im/operationLogsWrite', data)
    }
  }
}
</script>

<style lang='scss' scoped>
.prizeWinner {
  height: 467px;
  padding: 20px;
  .myTable {
  }
}
.pagination {
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
.ss-material-box-bottom {
  display: flex;
  padding-right: 20px;
  padding-left: 20px;
  justify-content: flex-end;
  align-items: center;
  margin-top: auto;
  width: 100%;
  height: 66px;
  box-shadow: 0px -2px 4px 0px rgba(0, 0, 0, 0.05);
  // background-color: #fafbfc;
  border-radius: 2px 2px 0 0;
}
.daochuicon {
  width: 20px;
  height: 20px;
  font-size: 20px;
}
::v-deep .zb-table {
  width: 100%;
  border-left: 1px solid #eff2f6;
  border-right: 1px solid #eff2f6;
  border-radius: 6px;
  .el-table-null {
    border-bottom: 1px solid #eff2f6;
  }
  .el-table th.el-table__cell.is-leaf {
    border-bottom: none;
  }
  .el-table td.el-table__cell {
    border-bottom-color: #eff2f6;
  }
  .el-table::before {
    width: 0 !important;
    height: 0 !important;
  }
  .el-table__header-wrapper {
    .el-table__header {
      th {
        border-bottom: none;
        .cell {
          color: #000;
          font-family: 'Microsoft YaHei';
          font-size: 14px;
          font-style: normal;
          font-weight: 700;
        }
      }
    }
  }
}
</style>
