<template>
  <!-- 抽奖记录 -->
  <div class="lianmaiRecord">
    <div class="myTable custom-table">
      <el-table v-loading="loading" height="100%" :data="list" :header-cell-style="{ background: '#EFF2F6', color: '#000' }" :cell-style="{ color: '#333' }">
        <el-table-column prop="userName" label="申请连麦学员昵称" align="center" />
        <el-table-column prop="mobile" label="学员手机号码">
          <template slot-scope="{ row }">
            <watchPhoneNumber
              :phone-area-code="row.phoneAreaCode"
              :default-value="row.mobile"
              :params="row"
              :user-id="row.userId"
              :get-api="operationLogsWrite"
            />
          </template>
        </el-table-column>
        <el-table-column prop="email" label="邮箱">
          <template slot-scope="{ row }">
            <watchPhoneNumber
              :default-value="row.email"
              :params="row"
              :user-id="row.userId"
              :get-api="operationLogsWriteEmail"
            />
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="申请时间" align="center">
          <template slot-scope="{ row }">
            {{ row.createTime | filterTime }}
          </template>
        </el-table-column>
        <el-table-column prop="avType" label="连麦类型" align="center">
          <template slot-scope="{ row }">
            {{ row.avType | getOptionsValue(lianMaiType) }}
          </template>
        </el-table-column>
        <el-table-column prop="waitingTime" label="等待时间" align="center">
          <template slot-scope="{ row }">
            {{ row.waitingTime | filterWaitingTime }}
          </template>
        </el-table-column>
        <el-table-column prop="avTime" label="连麦时间" align="center">
          <template slot-scope="{ row }">
            {{ row.avTime | filterWaitingTime }}
          </template>
        </el-table-column>
        <el-table-column prop="avStatus" label="状态" align="center">
          <template slot-scope="{ row }">
            {{ row.avStatus | getOptionsValue(lianMaiStateOption) }}
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
  </div>
</template>

<script>
import { getVoiceChatRecord } from '@/api/liveRoom/index'
import watchPhoneNumber from '@/components/watchPhoneNumber'
import { filtersTextPhone } from '@/utils/index'
import { liveOperationType, lianMaiType, lianMaiStateOption } from '@/views/live/columns.js'
import moment from 'moment'
export default {
  filters: {
    filterTime(val) {
      if (!val) {
        return ''
      } else {
        return moment(val).format('YYYY-MM-DD HH:mm')
      }
    },
    filterWaitingTime(val) {
      if (!val) {
        return '——'
      }
      const result = parseInt(val)
      const h =
        Math.floor(result / 3600) < 10
          ? '0' + Math.floor(result / 3600)
          : Math.floor(result / 3600)
      const m =
        Math.floor((result / 60) % 60) < 10
          ? '0' + Math.floor((result / 60) % 60)
          : Math.floor((result / 60) % 60)
      const s =
        Math.floor(result % 60) < 10
          ? '0' + Math.floor(result % 60)
          : Math.floor(result % 60)
      return h + ':' + m + ':' + s
    }
  },
  components: {
    watchPhoneNumber
  },
  data() {
    return {
      lianMaiType,
      lianMaiStateOption,
      loading: false,
      list: [],
      currentPage: 1,
      pageSize: 10,
      liveRoomId: this.$route.params.id,
      total: 0
    }
  },
  mounted() {
    this.searchFn()
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
        liveRoomId: this.liveRoomId,
        pageIndex: this.currentPage,
        pageSize: this.pageSize
      }
      getVoiceChatRecord(data)
        .then(res => {
          this.list = res.data.items
          this.total = res.data.total
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    // 手机号埋点
    operationLogsWrite(params) {
      const data = {
        liveRoomId: this.liveRoomId,
        userId: params.userId,
        phoneNum: params.mobile,
        operationType: liveOperationType.type2
      }
      return this.$store.dispatch('im/operationLogsWrite', data)
    },
    // 邮箱埋点
    operationLogsWriteEmail(params) {
      const data = {
        liveRoomId: this.liveRoomId,
        userId: params.userId,
        email: params.email,
        queryType: 2,
        operationType: liveOperationType.type2
      }
      return this.$store.dispatch('im/operationLogsWrite', data)
    },
    searchFn() {
      this.currentPage = 1
      this.getList()
    }
  }
}
</script>

<style lang='scss' scoped>
.lianmaiRecord {
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
