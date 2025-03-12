<template>
  <div class="signRecord">
    <div class="myTable custom-table">
      <el-table v-loading="loading" height="100%" :data="list" :header-cell-style="{ background: '#EFF2F6', color: '#000' }" :cell-style="{ color: '#333' }">
        <el-table-column prop="signType" label="签到方式" align="center">
          <template slot-scope="{ row }">
            {{ {1: '立即发送', 2: '定时发送'}[row.signType] }}
          </template>
        </el-table-column>
        <el-table-column prop="signSendTime" label="发送时间" width="250" align="center" />
        <el-table-column prop="signDuration" label="签到时长" align="center">
          <template slot-scope="{ row }">
            {{ row.signDuration | filtersDuration }}
          </template>
        </el-table-column>
        <el-table-column prop="signCount" label="已签到人数" align="center" />
        <el-table-column prop="noSignCount" label="未签到人数" align="center" />
        <el-table-column label="操作" width="250" align="center">
          <template slot-scope="{ row }">
            <el-button type="text" @click="onhandleSignResult(row)">签到结果</el-button>
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
import { liveRoomSignLog } from '@/api/liveRoom/index.js'
import Dialog from '@/views/live/Dialog/index.js'
export default {
  filters: {
    filtersDuration(val) {
      if (!val) {
        return ''
      }
      const result = parseInt(val)
      const h = Math.floor(result / 3600)
      const m = Math.floor((result / 60) % 60)
      const s = Math.floor(result % 60)
      if (h === '0' && m === '0') {
        return s + '秒'
      } else if (h === '00' && m !== '0' && s === '0') {
        return m + '分钟'
      } else if (h === '0') {
        return m + '分钟' + s + '秒'
      } else {
        return h + '时' + m + '分' + s + '秒'
      }
    }
  },
  components: {},
  data() {
    return {
      loading: false,
      list: [],
      currentPage: 1,
      pageSize: 10,
      liveRoomId: this.$route.params.id,
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
        pageIndex: this.currentPage,
        pageSize: this.pageSize,
        liveRoomId: this.$route.params.id
      }
      liveRoomSignLog(this.$route.params.id, data).then(res => {
        console.log(res)
        this.list = res.data.items
        this.total = res.data.total
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    // 点击签到结果按钮
    onhandleSignResult(row) {
      Dialog.open({
        type: 'SignRecord',
        liveRoomId: this.liveRoomId,
        liveRoomSignId: row.id,
        visible: true
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.signRecord {
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
</style>
