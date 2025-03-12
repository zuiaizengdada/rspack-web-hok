<template>
  <MCard v-loading="loading" class="myLive">
    <div v-for="(item, index) in list" :key="index" class="myLiveList">
      <div class="myLiveListTime" :class="{ today: ifToday(item.key) }">
        <div v-if="ifToday(item.key)">今日</div>
        <div v-else>{{ renderTime(item.key) }}</div>
        <div>{{ renderWeek(item.key) }}</div>
      </div>
      <carousel class="myLiveListContent" :list="item.arr" />
    </div>

    <div v-if="ifNoData" class="noData">
      <img src="~@/assets/image/myliveRoomNodata.png" alt="" />
      <div class="noDataText">暂无直播排班</div>
    </div>
  </MCard>
</template>

<script>
import carousel from './carousel.vue'
import moment from 'moment'
import { getMyLiveRoom } from '@/api/liveRoom/index'
export default {
  components: {
    carousel
  },
  data() {
    return {
      ifNoData: false,
      list: [],
      loading: false
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    // 渲染年月日
    renderTime(val) {
      if (!val) {
        return ''
      }
      console.log(moment(val).format('MM/DD'))
      return moment(val).format('MM/DD')
    },
    // 渲染星期
    renderWeek(val) {
      if (!val) {
        return ''
      }
      const obj = {
        1: '星期一',
        2: '星期二',
        3: '星期三',
        4: '星期四',
        5: '星期五',
        6: '星期六',
        0: '星期日'
      }
      return obj[moment(val).day()]
    },
    // 判断是否今日
    ifToday(val) {
      if (!val) {
        return false
      }
      return moment(val).isSame(moment().format('yyyy-MM-DD'))
    },
    getList() {
      this.loading = true
      this.ifNoData = false
      getMyLiveRoom()
        .then(res => {
          res.data.map(v => {
            v.time = moment(v.startTime).format('yyyy-MM-DD')
          })
          this.list = this.getObj(res.data)
          console.log(this.list)
          this.ifNoData = this.list.length === 0
          setTimeout(() => {
            this.loading = false
          }, 400)
        })
        .catch(() => {
          this.loading = false
        })
    },
    getObj(arr) {
      const obj = {}
      const list = []
      arr.map(v => {
        obj[v.time] ? obj[v.time].push(v) : (obj[v.time] = [v])
      })
      for (const key in obj) {
        obj[key].sort((a, b) => {
          return moment(a.startTime).valueOf() - moment(b.startTime).valueOf()
        })
        list.push({ key: key, arr: obj[key] })
      }
      console.log(list)
      list.sort((a, b) => {
        return moment(a.key).valueOf() - moment(b.key).valueOf()
      })
      return list
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/styles/variables.scss';
.myLive {
  @include responsive-height(66px);
  min-width: 1000px;
  overflow: auto;
  padding: 0;
  position: relative;
  .myLiveList {
    display: flex;
    height: 196px;
    overflow: hidden;
    border-bottom: 1px solid #f5f5f5;
    .myLiveListTime {
      flex: 103px 0 0;
      background: #fafafa;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      > div:nth-child(1) {
        font-size: 24px;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: bold;
        color: #333;
        line-height: 33px;
        padding-bottom: 5px;
      }
      > div:nth-child(2) {
        padding-top: 5px;
        font-size: 18px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #777777;
        line-height: 25px;
      }
    }
    .today {
      > div:nth-child(1) {
        color: #0c6fff;
      }
      > div:nth-child(2) {
        color: #0c6fff;
      }
    }
    .myLiveListContent {
      width: calc(100% - 103px);
    }
  }
  .noData {
    height: 100%;
    // margin-top: 274px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    > img {
      width: 561px;
      height: 326px;
    }
    .noDataText {
      margin-top: 20px;
      font-size: 16px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #999999;
      line-height: 22px;
    }
  }
}
</style>
