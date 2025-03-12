<template>
  <div class="lectureRecords">
    <div class="lectureRecordsTitle"><MTitle>历史听课记录</MTitle></div>
    <el-table :data="tableData" max-height="500px" style="width: 100%;margin-top: 14px;border-radius: 5px;overflow: hidden;" :header-cell-style="{ background: '#F7F7F7' }" border>
      <el-table-column prop="liveRoomName" label="直播间名称" />
      <el-table-column prop="liveStartTime" label="开播时间" align="center">
        <template slot-scope="{ row }">
          {{ row.liveStartTime | renderTime('yyyy-MM-DD HH:mm:ss') }}
        </template>
      </el-table-column>
      <el-table-column prop="firstEntryTime" label="首次进入时间" align="center">
        <template slot-scope="{ row }">
          {{ row.firstEntryTime | renderTime('yyyy-MM-DD HH:mm:ss') }}
        </template>
      </el-table-column>
      <el-table-column prop="speakCount" label="发言次数" align="center">
        <template slot-scope="{ row }">
          {{ row.speakCount }}
          <span v-if="row.speakCount" class="detailsBtn" @click="popoverShowFn(row)">明细</span>
        </template>
      </el-table-column>
      <el-table-column prop="listenClassTime" label="听课时长" align="center">
        <template slot-scope="{ row }">
          {{ row.listenClassTime | filtersListen }}
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      class="lectureRecordspage"
      :current-page="currentPage"
      :pager-count="5"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      layout="total,prev,pager,next,jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />

  </div>
</template>

<script>
import { liveRoomListeningRecord } from '@/api/liveRoom/liveRoom.js'
import moment from 'moment'
import Dialog from '@/views/live/Dialog/index.js'
export default {
  filters: {
    renderTime(val, str) {
      if (!val) {
        return ''
      }
      return moment(val).format(str)
    },
    filtersListen(val) {
      if (!val) { return 0 + '分钟' }
      if (val < 60000) {
        return Math.floor(val / 1000) + '秒'
      }
      return Math.floor(val / 1000 / 60) + '分钟'
    }
  },
  components: {
  },
  props: {
    userId: {
      type: String,
      default: ''
    },
    liveRoomId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      config: {
        show: false,
        memberId: ''
      },
      popoverLock: false,
      tableData: [],
      currentPage: 1,
      total: 0,
      pageSize: 10
    }
  },
  mounted() {
    this.init()
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
        traineeId: this.userId
      }
      liveRoomListeningRecord(data).then(res => {
        console.log('获取历史听课记录', res)
        this.tableData = res.data.items
        this.total = res.data.total
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    init() {
      this.loading = true
      this.tableData = []
      this.currentPage = 1
      this.getList()
    },
    popoverShowFn(row) {
      console.log(row)
      Dialog.open({
        type: 'ChatRecords',
        liveRoomId: row.liveRoomId,
        liveRoomName: row.liveRoomName,
        userId: this.userId,
        title: `发言记录（${row.speakCount}）`
        // closeCb: () => {
        //   setTimeout(() => {
        //     this.$emit('close')
        //   }, 200)
        // }
      })
      // Dialog.open({
      //   visible: true,
      //   type: 'LiveTool',
      //   height: 526,
      //   title: '敏感词',
      //   viewComponent: liveLog,
      //   options: {
      //     userId: this.$route.params.id,
      //     show: true,
      //     success: () => {
      //       Dialog.close()
      //     }
      //   }
      // })
      // this.popoverShow = true
    }
  }
}
</script>

<style lang='scss' scoped>
.lectureRecords {
  padding-right: 15px;
}
.lectureRecordspage {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-top: 15px;
}
.detailsBtn {
  padding: 0 8px;
  height: 20px;
  flex-shrink: 0;
  border-radius: 5px;
  border: 1px solid #90BDFF;
  background: #FFF;
  color: #0c6fff;
  font-family: "Microsoft YaHei";
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  margin-left: 11px;
  line-height: 20px;
  cursor: pointer;
}
::v-deep {
  .el-table__header-wrapper {
    .has-gutter {
      .cell {
        font-size: 12px;
        color: #000000;
        font-weight: 400;
      }
    }
  }
  .el-table__row {
    .cell {
      font-size: 12px;
      color: #000000;
      font-weight: 400;
    }
  }
}
::v-deep .lectureRecordsTitle {
  .MTitle .line {
    height: 12px;
    width: 2px;
    margin-right: 5px;
  }
}
</style>
