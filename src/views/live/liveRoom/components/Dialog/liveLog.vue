<template>
  <div v-loading="loading" class="liveLog">
    <div class="liveLogTitle">直播记录</div>
    <div class="myTable">
      <el-table style="widht: 566px" :data="list" :header-cell-style="{ background: '#F3F3F3' }">
        <el-table-column prop="liveRoomName" label="直播间名称" width="180" />
        <el-table-column prop="liveStartTime" label="开播时间" width="200">
          <template slot-scope="{ row }">
            {{ row.liveStartTime | filterliveStartTime }}
          </template>
        </el-table-column>
        <el-table-column prop="speakCount" label="发言次数" align="center">
          <template slot-scope="{ row }">
            <el-button v-if="row.speakCount > 0" type="text" @click="onhandleOpen(row)">{{ row.speakCount }}</el-button>
            <template v-else>{{ row.speakCount }}</template>
          </template>
        </el-table-column>
        <el-table-column prop="listenClassTime" label="听课时长" width="80">
          <template slot-scope="{ row }">
            {{ row.listenClassTime | filterformLabel }}
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { getUserJoinLogs } from '@/api/liveRoom/im'
import moment from 'moment'
import { mapState } from 'vuex'
import Dialog from '@/views/live/Dialog/index.js'
export default {
  components: {},
  filters: {
    filterformLabel(val) {
      if (!val) { return 0 + '分钟' }
      if (val < 60000) {
        return Math.floor(val / 1000) + '秒'
      }
      return Math.floor(val / 1000 / 60) + '分钟'
    },
    filterliveStartTime(val) {
      if (!val) { return '' }
      return moment(val).format('YYYY-MM-DD HH:mm:ss')
    }
  },
  props: {
    userId: {
      type: String,
      default: ''
    },
    show: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      loading: false,
      list: []
    }
  },
  computed: {
    ...mapState({
      liveRoomDetail: state => state.im.liveRoomDetail
    })
  },
  watch: {
    show: {
      handler(val) {
        val && this.getInfo()
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
    // this.getInfo()
  },
  methods: {
    onhandleOpen(row) {
      console.log(row)
      this.$emit('open')
      Dialog.open({
        type: 'ChatRecords',
        liveRoomId: row.liveRoomId,
        liveRoomName: row.liveRoomName,
        userId: this.userId,
        title: `发言记录（${row.speakCount}）`,
        closeCb: () => {
          setTimeout(() => {
            this.$emit('close')
          }, 200)
        }
      })
    },
    getInfo() {
      this.loading = true
      const params = {
        pageIndex: 1,
        pageSize: 10,
        traineeId: this.userId
      }
      getUserJoinLogs(params).then(res => {
        this.list = []
        res.data.items.map((v, index) => {
          if (this.list.length !== 8) {
            this.list.push(v)
          }
        })
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.liveLog {
  background: #FFFFFF;
  box-shadow: 0px 2px 10px 0px rgba(0,0,0,0.2);
  border-radius: 10px;
  .liveLogTitle {
    font-size: 16px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #333333;
    line-height: 24px;
    border-bottom: 1px solid #E7E7E7;
    height: 64px;
    line-height: 64px;
    padding-left: 20px;
  }
  .myTable {
    padding: 20px;
  }
}
</style>
