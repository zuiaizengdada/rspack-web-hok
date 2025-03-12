<template>
  <!-- 听课记录 -->
  <div v-loading="loading" class="pageWrap">
    <div class="classAttendanceRecord overflowOuto">
      <div v-for="(value ,key) in list" :key="key" class="attList">
        <div class="attListTitle">
          <span v-if="ifToday(value.key)" class="m-r-10">今天</span>
          <span v-else-if="ifYesterday(value.key)" class="m-r-10">昨天</span>
          <span>{{ value.key }}</span>
        </div>
        <div v-for="(info, i) in value.arr" :key="i" class="goodsList">
          <div class="goodsname">{{ info.liveRoomName }}</div>
          <div class="goodsListform"><div class="formLabel">首次进入直播间时间：</div><div class="formValue">{{ info.firstEntryTime | renderTime('MM-DD HH:mm:ss') }}</div></div>
          <div v-if="info.lastDepartureTime" class="goodsListform"><div class="formLabel">最后离开时间：</div><div class="formValue">{{ info.lastDepartureTime | renderTime('MM-DD HH:mm:ss') }}</div></div>
          <div class="goodsListform"><div class="formLabel">发言次数：</div><div class="formValue">{{ info.speakCount }}</div></div>
          <div class="goodsListform"><div class="formLabel">学习时长：</div><div class="formValue">{{ info.listenClassTime | filtersListen }}</div></div>
        </div>
      </div>
      <div v-if="readerList.length === 0" class="noData">
        <img src="~@/assets/image/zanwusousuoneirong2.png" alt="">
        <div class="noDataText">暂无数据</div>
      </div>
    </div>
    <div v-if="readerList.length > 0" class="pagination">
      <div>共{{ total }}条</div>
      <pagination :total="total" :current="current" :size="size" @currentChange="currentChange" />
    </div>
  </div>
</template>

<script>
import pagination from './pagination.vue'
import { getUserJoinLogs } from '@/api/liveRoom/im'
import { mapState } from 'vuex'
import moment from 'moment'
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
    pagination
  },
  data() {
    return {
      list: {},
      readerList: [],
      loading: false,
      total: 0,
      current: 1,
      size: 10
    }
  },
  computed: {
    ...mapState({
      chatUser: state => state.im.chatUser
    })
  },
  watch: {
    'chatUser': {
      handler(val) {
        this.current = 1
        this.getList()
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
  },
  methods: {
    getList() {
      this.loading = true
      const params = {
        pageIndex: this.current,
        pageSize: this.size,
        traineeId: this.chatUser.userId
      }
      getUserJoinLogs(params).then(res => {
        res.data.items.map((v) => {
          v.time = moment(v.firstEntryTime).format('YYYY-MM-DD')
        })
        this.readerList = res.data.items
        this.list = this.getObj(res.data.items)
        this.total = res.data.total
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    currentChange(res) {
      this.current = res
      this.getList()
    },
    getObj(arr) {
      const obj = {}
      const list = []
      arr.map(v => {
        obj[v.time] ? obj[v.time].push(v) : (obj[v.time] = [v])
      })
      for (const key in obj) {
        obj[key].sort((a, b) => {
          return moment(b.liveStartTime).valueOf() - moment(a.liveStartTime).valueOf()
        })
        list.push({ key: key, arr: obj[key] })
      }
      console.log(list)
      list.sort((a, b) => {
        return moment(b.key).valueOf() - moment(a.key).valueOf()
      })
      return list
    },
    // 判断是否今日
    ifToday(val) {
      if (!val) { return false }
      return moment(val).isSame(moment().format('yyyy-MM-DD'))
    },
    ifYesterday(val) {
      if (!val) { return false }
      return val === moment().subtract(1, 'days').format('YYYY-MM-DD')
    }
  }
}
</script>

<style lang='scss' scoped>
.pageWrap {
  height: 100%;
  min-height: 400px;
  display: flex;
  flex-direction: column;
  .classAttendanceRecord {
    flex: 1 0 0;
    overflow: auto;
      .attList {
          width: 320px;
          margin: auto;
          margin-top: 20px;
          background: #FFFFFF;
          border-radius: 4px;
          border: 1px solid #D8DCE6;
          .attListTitle {
              background: #E7F0FF;
              font-size: 16px;
              font-family: PingFangSC-Medium, PingFang SC;
              font-weight: 500;
              color: #333333;
              line-height: 22px;
              padding: 7px 20px;
          }
          .goodsList {
              padding: 10px 0;
              margin: 0 20px;
              .goodsname {
                  font-size: 16px;
                  font-family: PingFangSC-Medium, PingFang SC;
                  font-weight: bold;
                  color: #333333;
                  line-height: 22px;
                  margin-bottom: 10px;
              }
              .goodsListform {
                  margin-bottom: 10px;
                  display: flex;
                  flex-wrap: wrap;
                  .formLabel {
                      font-size: 16px;
                      font-family: PingFangSC-Regular, PingFang SC;
                      font-weight: 400;
                      color: #777777;
                      line-height: 22px;
                  }
                  .formValue {
                      font-size: 16px;
                      font-family: PingFangSC-Regular, PingFang SC;
                      font-weight: 400;
                      color: #333333;
                      line-height: 22px;
                  }
              }
          }
          .goodsList + .goodsList {
              border-top: 1px solid #F5F5F5;
          }
      }
  }
  .pagination {
    width: 368px;
    height: 62px;
    background: #FFFFFF;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-left: 18px;
    font-size: 14px;
    font-family: MicrosoftYaHei;
    color: #999999;
    line-height: 22px;
    user-select:none;
  }
  .noData {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 100px;
    > img {
      width: 250px;
    }
    .noDataText {
      margin-top: 16px;
      font-size: 16px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #999999;
      line-height: 22px;
    }
  }
}
</style>
