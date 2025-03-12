<template>
  <AppDialog
    v-model="visible"
    title="连麦记录"
    width="1100px"
    :loading="loading"
    height="auto"
    :top="top"
  >
    <!-- 连麦记录 -->
    <div v-loading="loading" class="lianmaiRecord overflowOuto">
      <div class="myTable">
        <el-table
          :data="list"
          height="330"
          :header-cell-style="{ background: '#f5f5f5' }"
        >
          <el-table-column prop="userName" label="申请连麦学员昵称" />
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
    <div slot="footer" class="ss-material-box-bottom">
      <el-button
        type="primary"
        size="small"
        @click="visible = false"
      >关闭</el-button>
    </div>
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
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
    AppDialog,
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
  watch: {
    visible: {
      handler(val) {
        val && this.getList()
      },
      deep: true
    }
  },
  mounted() {
    this.top = Math.abs(window.innerHeight - 549) / 2 + 'px'
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
    }
  }
}
</script>

<style lang='scss' scoped>
.lianmaiRecord {
  max-height: 518px;
  padding: 20px 20px 0;
  .myTable {
    width: 100%;
    height: 378px;
    background: #ffffff;
    border-radius: 6px;
    border: 1px solid #cbcfd3;
    overflow: hidden;
    .pagination {
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: right;
    }
  }
}
</style>
