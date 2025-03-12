<template>
  <div class="outboundCallRecord">
    <div class="outboundCallRecordTitle"><MTitle>本场外呼记录</MTitle></div>
    <el-table :data="tableData" max-height="400px" style="width: 100%;margin-top: 14px;border-radius: 5px;overflow: hidden;" :header-cell-style="{ background: '#F7F7F7' }" border>
      <el-table-column prop="startTime" label="外呼时间" width="140px">
        <template slot-scope="{ row }">
          {{ row.startTime | parseTime }}
        </template>
      </el-table-column>
      <el-table-column prop="fileUrl" label="外呼语音" align="center">
        <template slot-scope="{ row }">
          <div v-if="row.fileUrl" class="voiceBox">
            <div class="voice">
              <img class="voiceImg1" src="~@/assets/image/liveRoom/outboundCall.png" alt="" />
              <span class="voiceTime">{{ row.answerDuration | renderTotalDuration }}</span>
              <img class="voiceImg2" src="~@/assets/image/liveRoom/voice_play.png" alt="" @click="onPlay(row)" />
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="callStatus" label="外呼状态" width="129px" align="center">
        <template slot-scope="{ row }">
          {{ {1: '未接通', 2: '客服接通', 3: '双方接通'}[row.callStatus] }}
        </template>
      </el-table-column>
      <el-table-column prop="teacherName" label="外呼人员" width="135px" align="center" />
    </el-table>

    <el-pagination
      class="outboundCallRecordpage"
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
import { liveRoomCallPage } from '@/api/liveRoom/liveRoom.js'
export default {
  components: {},
  filters: {
    renderTotalDuration(val) {
      if (!val || typeof val !== 'number') {
        return '00:00:00'
      } else {
        const result = parseInt(val)
        const h = Math.floor(result / 3600) < 10 ? '0' + Math.floor(result / 3600) : Math.floor(result / 3600)
        const m = Math.floor((result / 60 % 60)) < 10 ? '0' + Math.floor((result / 60 % 60)) : Math.floor((result / 60 % 60))
        const s = Math.floor((result % 60)) < 10 ? '0' + Math.floor((result % 60)) : Math.floor((result % 60))
        return h + ':' + m + ':' + s
      }
    }
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
        'liveRoomId': this.liveRoomId,
        'pageIndex': this.currentPage,
        'pageSize': this.pageSize,
        'studentId': this.userId
      }
      liveRoomCallPage(data).then(res => {
        this.tableData = res.data.items
        this.total = res.data.total
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    onPlay(row) {
      console.log(row)
      this.$AppAudio({
        visible: true,
        src: row.fileUrl
      })
    },
    init() {
      this.loading = true
      this.tableData = []
      this.currentPage = 1
      this.getList()
    }
  }
}
</script>

<style lang='scss' scoped>
.outboundCallRecord {
  padding-right: 15px;
}
.outboundCallRecordpage {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-top: 15px;
}
.voiceBox {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  .voice {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 25px;
    padding: 0 5px 0 12px;
    border-radius: 15px;
    background: #0C6FFF;
    width: 139px;
    .voiceImg1 {
      width: 17px;
      height: 10px;
    }
    .voiceTime {
      color: #ffffff;
      font-family: "Microsoft YaHei";
      font-size: 12px;
      font-weight: 400;
      flex: 1 0 0;
      text-align: left;
      padding-left: 6px;
    }
    .voiceImg2 {
      cursor: pointer;
      width: 15px;
      height: 15px;
    }
  }
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
::v-deep .outboundCallRecordTitle {
  .MTitle .line {
    height: 12px;
    width: 2px;
    margin-right: 5px;
  }
}
</style>
