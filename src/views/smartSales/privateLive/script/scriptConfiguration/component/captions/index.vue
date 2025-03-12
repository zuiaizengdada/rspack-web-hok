<template>
  <div v-if="list.length > 0" id="liveCaptions" v-loading="loading" class="liveCaptions">
    <virtualList ref="Virtual" v-slot="{item, index}" id-name="liveCaptions" :list-data="list" :estimated-item-size="86">
      <div :key="index" class="liveCaptionsList">
        <div :class="{active: ifActive(item) }" class="liveCaptionsBorder">
          <!-- 字幕 -->
          <div class="liveCaptionsTime">{{ item.startTime | getTime }} - {{ item.endTime | getTime }}</div>
          <div class="liveCaptionsText">{{ item.content }}</div>
        </div>
      </div>
    </virtualList>
  </div>
</template>

<script>
import virtualList from './virtualList'
import { mapState } from 'vuex'
import { getSubtitleList } from '@/api/liveRoom/index.js'
export default {
  components: {
    virtualList
  },
  filters: {
    // 毫秒转时:分:秒:毫秒
    getTime(value) {
      const h =
    Math.floor(value / 3600000) >= 10
      ? String(Math.floor(value / 3600000))
      : '0' + Math.floor(value / 3600000)
      const m =
    Math.floor((value / 60000) % 60) >= 10
      ? String(Math.floor((value / 60000) % 60))
      : '0' + Math.floor((value / 60000) % 60)
      const s =
    Math.floor((value / 1000) % 60) >= 10
      ? String(Math.floor((value / 1000) % 60))
      : '0' + Math.floor((value / 1000) % 60)
      return h + ':' + m + ':' + s
    }
  },
  data() {
    return {
      loading: false,
      copylist: [],
      list: []
    }
  },
  computed: {
    ...mapState({
      currentTime: state => state.liveScript.currentTime
    })
  },
  watch: {
    'currentTime': {
      handler(val) {
        console.log(val, 'currentTime改变')
        this.$nextTick(() => {
          this.scrollTo(val * 1000)
        })
      },
      immediate: true,
      deep: true
    }
  },
  mounted() {
    // this.loading = true
    // let time = 0
    // const timer = setInterval(() => {
    //   if (time >= 10800000) {
    //     this.loading = false
    //     clearInterval(timer)
    //     return
    //   }
    //   const i = Math.round(Math.random() * (30 - 0) + 0)
    //   const endTime = time + (this.copylist[i].endTime - this.copylist[i].startTime)
    //   this.list.push({ startTime: time, endTime: endTime, text: this.copylist[i].text })
    //   time = endTime
    // }, 10)
  },
  methods: {
    scrollTo(currentTime) {
      const index = this.list.findIndex(v => currentTime >= v.startTime && currentTime < v.endTime)
      console.log(index)
      index > -1 && this.$refs.Virtual.scrollTo(index)
    },
    ifActive(item) {
      const t = this.currentTime * 1000
      return t >= item.startTime && t < item.endTime
    },
    getList(videoId) {
      this.loading = true
      const data = {
        videoId: videoId
      }
      getSubtitleList(data).then(res => {
        this.list = res.data
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.liveCaptions {
    flex: 1 0 0;
    background: #FFFFFF;
    border-radius: 10px;
    padding: 20px 0;
    .liveCaptionsList {
        background: #fff;
        margin: 0 16px;
        padding-bottom: 32px;
        .liveCaptionsBorder {
          border-radius: 4px;
          border: 1px solid transparent;
          padding: 4px 8px;
        }
        .liveCaptionsTime {
          font-size: 12px;
          font-family: MicrosoftYaHei;
          color: #0C6FFF;
          line-height: 20px;
          user-select: none;
        }
        .liveCaptionsText {
          font-size: 14px;
          font-family: MicrosoftYaHei;
          color: #666666;
          line-height: 24px;
        }
      .active {
        color: #FF7D00;
        border: 1px solid #DCDFE6;
        background: #F5F5F5;
        // padding: 4px 8px;
      }
    }
}
::v-deep {
    .infinite-list-container{
        &::-webkit-scrollbar {
            width: 4px;
            height: 6px;
            // display: none;
            background-color: transparent;
        }
        &::-webkit-scrollbar-thumb {
            border-radius: 6px;
            background-color: rgba(0, 0, 0, 0.2);
            transition: all 0.4s ease;
        }
        &::-webkit-scrollbar-track {
            background-color: rgba(0, 0, 0, 0.1);
        }
    }
}
</style>
