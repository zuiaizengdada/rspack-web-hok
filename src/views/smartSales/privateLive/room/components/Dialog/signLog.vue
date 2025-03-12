<template>
  <AppDialog
    v-model="visible"
    title="签到记录"
    width="863px"
    :loading="loading"
    height="auto"
    :top="top"
    @success="sure"
  >
    <div class="signLog">
      <div class="myTable">
        <el-table v-loading="loading" height="383" :header-cell-style="{ background: '#F3F3F3' }" :data="list">
          <el-table-column prop="signType" label="签到方式">
            <template slot-scope="{ row }">
              {{ {1: '立即发送', 2: '定时发送'}[row.signType] }}
            </template>
          </el-table-column>
          <el-table-column prop="signSendTime" label="发送时间" width="150" />
          <el-table-column prop="signDuration" label="签到时长">
            <template slot-scope="{ row }">
              {{ row.signDuration / 60 | getOptionsValue(signTimeOption) }}
            </template>
          </el-table-column>
          <el-table-column prop="signCount" label="已签到人数" />
          <el-table-column prop="noSignCount" label="未签到人数" />
          <el-table-column label="操作">
            <template slot-scope="{ row }">
              <el-button type="text" @click="onhandleSignRecord(row)">签到结果</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
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

    <signRecord ref="signRecord" />

    <template slot="footer">
      <div class="ss-material-box-bottom">
        <el-button size="small" :loading="loading" @click="visible = false">取消</el-button>
      </div>
    </template>
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import signRecord from './signRecord.vue'
import { liveRoomSignLog } from '@/api/liveRoom/index.js'
import { signTimeOption } from '@/views/live/columns.js'
export default {
  components: {
    AppDialog,
    signRecord
  },
  data() {
    return {
      signTimeOption,
      top: '114px',
      loading: false,
      visible: false,
      list: [],
      liveRoomId: '',
      currentPage: 1,
      pageSize: 10,
      total: 0
    }
  },
  watch: {
    visible: {
      handler(val) {
        val && this.searchFn()
      },
      deep: true
    }
  },
  mounted() {},
  methods: {
    sure() {},
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
        liveRoomId: this.liveRoomId
      }
      liveRoomSignLog(this.liveRoomId, data).then(res => {
        console.log(res)
        this.list = res.data.items
        this.total = res.data.total
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    searchFn() {
      this.currentPage = 1
      this.getList()
    },
    clearFn() {},
    onhandleSignRecord(row) {
      this.$refs.signRecord && this.$refs.signRecord.open({
        liveRoomId: this.liveRoomId,
        liveRoomSignId: row.id
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.signLog {
    padding: 20px 20px 0 20px;
    .myTable {
      width: 100%;
      background: #ffffff;
      border-radius: 6px;
      border: 1px solid #cbcfd3;
      overflow: hidden;
    }
    .pagination {
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: right;
    }
}
::v-deep {
  .ss-material-box-bottom {
    box-shadow: 0px -2px 4px 0px rgba(0,0,0,0.05);
  }
}
</style>
