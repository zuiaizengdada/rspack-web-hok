<template>
  <!-- 签到设置 -->
  <div class="signInSettings">
    <div class="headerTop">
      <el-button type="primary" icon="el-icon-plus" @click="onhandleSignSetting">签到样式设置</el-button>
      <el-button class="btn_primary" :loading="exportLoading" @click="onhandleClickExportAll">导出所有记录</el-button>
    </div>
    <div class="m-t-20">
      <el-table v-loading="loading" :data="list" :header-cell-style="{ background: '#f5f5f5' }">
        <el-table-column prop="signType" label="签到方式">
          <template slot-scope="{ row }">
            {{ {1: '立即发送', 2: '定时发送'}[row.signType] }}
          </template>
        </el-table-column>
        <el-table-column prop="signSendTime" label="发送时间" width="250" />
        <el-table-column prop="signDuration" label="签到时长">
          <template slot-scope="{ row }">
            {{ row.signDuration | filtersDuration }}
          </template>
        </el-table-column>
        <el-table-column prop="signCount" label="已签到人数" />
        <el-table-column prop="noSignCount" label="未签到人数" />
        <el-table-column label="操作" width="250" fixed="right">
          <template slot-scope="{ row }">
            <el-button type="text" @click="onhandleSignResult(row)">签到结果</el-button>
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
</template>

<script>
import Dialog from '@/views/live/Dialog/index.js'
import { liveRoomSignLog, liveRoomSignResultExportAll } from '@/api/liveRoom/index.js'
export default {
  components: {},
  filters: {
    filtersDuration(val) {
      if (!val) {
        return ''
      }
      const result = parseInt(val)
      const h = Math.floor(result / 3600) < 10 ? '0' + Math.floor(result / 3600) : Math.floor(result / 3600)
      const m = Math.floor((result / 60) % 60) < 10 ? '0' + Math.floor((result / 60) % 60) : Math.floor((result / 60) % 60)
      const s = Math.floor(result % 60) < 10 ? '0' + Math.floor(result % 60) : Math.floor(result % 60)
      if (h === '00' && m === '00') {
        return s + '秒'
      } else if (h === '00' && m !== '00' && s === '00') {
        return m + '分钟'
      } else if (h === '00') {
        return m + '分钟' + s + '秒'
      } else {
        return h + '时' + m + '分' + s + '秒'
      }
    }
  },
  data() {
    return {
      list: [],
      loading: false,
      currentPage: 1,
      pageSize: 10,
      exportLoading: false,
      total: 0,
      liveRoomId: this.$route.params.id
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    onhandleSignSetting() {
      Dialog.open({
        type: 'SignStyle',
        liveRoomId: this.liveRoomId,
        visible: true,
        success: () => {
          Dialog.close()
        }
      })
    },
    // 点击导出所有记录按钮
    onhandleClickExportAll() {
      this.exportLoading = true
      liveRoomSignResultExportAll(this.$route.params.id).then(res => {
        window.open(res.data)
        this.exportLoading = false
      }).catch(() => {
        this.exportLoading = false
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
    handleSizeChange(val) {
      this.pageSize = val
      this.currentPage = 1
      this.getList()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getList()
    }
  }
}
</script>

<style lang='scss' scoped>
.signInSettings {
  .headerTop {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .pagination {
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: right;
  }
}
</style>
