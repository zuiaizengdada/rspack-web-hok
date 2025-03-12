<template>
  <!-- 抽奖记录 -->
  <div class="lotteryRecords">
    <div class="myTable custom-table">
      <el-table v-loading="loading" height="100%" :data="list" :header-cell-style="{ background: '#EFF2F6', color: '#000' }" :cell-style="{ color: '#333' }">
        <el-table-column prop="prizeDrawName" label="抽奖名称" align="center" />
        <el-table-column prop="prizeOrderId" label="中奖订单号" align="center" />
        <el-table-column prop="winnerUserName" label="用户昵称" align="center">
          <template slot-scope="{ row }">
            {{ filtersTextPhone(row.winnerUserName) }}
          </template>
        </el-table-column>
        <el-table-column prop="winnerUserPhone" label="手机号码" width="150">
          <template slot-scope="{ row }">
            <watchPhoneNumber :phone-area-code="row.phoneAreaCode" :default-value="row.winnerUserPhone" :params="row" :user-id="row.winnerUserId" :get-api="operationLogsWrite" />
          </template>
        </el-table-column>
        <el-table-column prop="email" label="邮箱" width="120">
          <template slot-scope="{ row }">
            <watchPhoneNumber :default-value="row.email" :params="row" :user-id="row.winnerUserId" :get-api="operationLogsWriteEmai" />
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="中奖时间" align="center">
          <template slot-scope="{ row }">
            {{ row.createTime | filterTime }}
          </template>
        </el-table-column>
        <el-table-column prop="giveawayType" label="奖品类型" align="center">
          <template slot-scope="{ row }">
            {{ {1: '虚拟商品', 2: '实物商品', 3: '优惠券'}[row.giveawayType] }}
          </template>
        </el-table-column>
        <el-table-column prop="giveawayName" label="中奖奖品" align="center" />
        <el-table-column prop="amount" label="数量" align="center" />
        <el-table-column v-if="showAction" prop="prizeIssueStatus" label="发放状态" align="center">
          <template slot-scope="{ row }">
            {{ {1: '未发放', 2: '已发放'}[row.prizeIssueStatus] }}
          </template>
        </el-table-column>
        <el-table-column v-if="showAction" label="操作" width="129" align="center">
          <template slot-scope="{ row }">
            <el-button v-if="row.giveawayType === 2 && row.prizeIssueStatus === 1" type="text" @click="onhandleSendGoods(row)">发货</el-button>
            <el-button v-if="row.giveawayType === 2" type="text" @click="onhandleDetail(row)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-pagination
      class="pagination"
      :current-page="currentPage"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <sendGoods :config="sendGoodsConfig" @success="sendGoodsSuccess" />
  </div>
</template>

<script>
// import { liveRoomSignLog } from '@/api/liveRoom/index.js'
import { prizeWinnerlist } from '@/api/liveRoom/setting.js'
import sendGoods from './sendGoods.vue'
import watchPhoneNumber from '@/components/watchPhoneNumber'
import { filtersTextPhone } from '@/utils/index'
import { liveOperationType } from '@/views/live/columns.js'
import moment from 'moment'
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
    watchPhoneNumber,
    sendGoods
  },
  data() {
    return {
      loading: false,
      list: [],
      currentPage: 1,
      pageSize: 10,
      liveRoomId: this.$route.params.id,
      prizeDrawId: '',
      downLoading: false,
      showAction: true,
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
    this.getList()
  },
  methods: {
    filtersTextPhone(str) {
      return filtersTextPhone(str)
    },
    handleSizeChange(val) {
      this.pageSize = val
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
      prizeWinnerlist(data).then(res => {
        console.log(res)
        this.list = res.data.items
        this.total = res.data.total
        this.$nextTick(() => {
          this.$refs.elTable && this.$refs.elTable.doLayout()
          this.loading = false
        })
      }).catch(() => {
        this.loading = false
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
    sendGoodsSuccess() {
      this.sendGoodsConfig = {
        visible: false,
        type: 1,
        winId: '',
        liveRoomId: this.liveRoomId
      }
      this.getList()
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
    },
    operationLogsWriteEmai(params) {
      const data = {
        liveRoomId: this.liveRoomId,
        userId: params.winnerUserId,
        email: params.email,
        queryType: 2,
        operationType: liveOperationType.type7
      }
      return this.$store.dispatch('im/operationLogsWrite', data)
    }
  }
}
</script>

<style lang='scss' scoped>
.lotteryRecords {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 10px 15px 0;
  .myTable {
    flex: 1 0 0;
    overflow: hidden;
    border-radius: 10px;
    border: 1px solid #F2F2F2;
  }
  .pagination {
    height: 68px;
    min-height: 68px;
    max-height: 68px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
}
::v-deep {
  .hok-search-form {
    margin-bottom: 0;
  }
  .el-table::before {
    height: 0px;
  }
}

::v-deep {
  /**改变边框颜色===》.custom-table指定上面的类id*/
  .custom-table .el-table--border, .custom-table.el-table--group {
      border: 1px solid #EFF2F6!important;
  }
  /**改变表格内竖线颜色===》.custom-table指定上面的类id*/
  .custom-table .el-table--border  td, .custom-table.el-table--border th, .custom-table.el-table__body-wrapper .el-table--border.is-scrolling-left~.el-table__fixed {
      border-right: 1px solid #EFF2F6!important;
  }
  /**改变合并单元格横线颜色===》.custom-table指定上面的类id */
  .custom-table .el-table--border th.el-table__cell {
      border-bottom: 1px solid #EFF2F6;
  }
  /**改变表格内常规行线颜色===》.custom-table指定上面的类id*/
  .custom-table .el-table  td, .custom-table.el-table th.is-leaf  {
      border-bottom: 1px solid #EFF2F6!important;
  }
  .custom-table .el-table th.el-table__cell.is-leaf, .el-table td.el-table__cell {
    border-bottom: 1px solid #EFF2F6!important;
  }
}
</style>
