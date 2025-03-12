<template>
  <!-- 直播间连麦记录 -->
  <div class="page_wrap">
    <div ref="formView" v-loading="loading" class="lianmaiRecord">
      <div class="myTable">
        <el-table :data="list" height="100%" :header-cell-style="{ background: '#f5f5f5' }">
          <el-table-column prop="userName" label="申请连麦学员昵称" width="150" />
          <el-table-column prop="mobile" label="学员手机号码" width="120">
            <template slot-scope="{ row }">
              <watchPhoneNumber
                :default-value="row.mobile"
                :params="row"
                :user-id="row.userId"
                :get-api="operationLogsWrite"
              />
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="申请时间" width="200">
            <template slot-scope="{ row }">
              {{ row.createTime | filterTime }}
            </template>
          </el-table-column>
          <el-table-column prop="avType" label="连麦类型" width="130">
            <template slot-scope="{ row }">
              {{ row.avType | getOptionsValue(lianMaiType) }}
            </template>
          </el-table-column>
          <el-table-column prop="waitingTime" label="等待时间" width="130">
            <template slot-scope="{ row }">
              {{ row.waitingTime | filterWaitingTime }}
            </template>
          </el-table-column>
          <el-table-column prop="avTime" label="连麦时间" width="130">
            <template slot-scope="{ row }">
              {{ row.avTime | filterWaitingTime }}
            </template>
          </el-table-column>
          <el-table-column prop="avStatus" label="状态" width="130">
            <template slot-scope="{ row }">
              {{ row.avStatus | getOptionsValue(lianMaiStateOption) }}
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
    </div>
  </div>
</template>

<script>
import { getVoiceChatRecord } from '@/api/liveRoom/index'
import {
  liveOperationType,
  lianMaiType,
  lianMaiStateOption
} from '@/views/live/columns.js'
import watchPhoneNumber from '@/components/watchPhoneNumber'

import moment from 'moment'
export default {
  filters: {
    filterTime(val) {
      if (!val) {
        return ''
      }
      return moment(val).format('YYYY-MM-DD HH:mm:ss')
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
      visible: false,
      top: '114px',
      list: [],
      currentPage: 1,
      liveRoomId: '',
      groupId: '',
      pageSize: 10,
      total: 0
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
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
    }
  }
}
</script>

<style lang='scss' scoped>
.page_wrap {
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  .lianmaiRecord {
    padding: 15px;
    height: 100%;
    display: flex;
    flex-direction: column;
    .myTable {
      flex: 1 0 0;
      width: 100%;
      background: #ffffff;
      border-radius: 6px;
      border: 1px solid #F2F2F2;
      overflow: hidden;
    }
    .pagination {
      margin-top: 10px;
      display: flex;
      align-items: center;
      justify-content: right;
    }
  }
}
</style>
