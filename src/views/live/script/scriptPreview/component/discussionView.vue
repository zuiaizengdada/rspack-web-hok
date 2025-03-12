<template>
  <div v-loading="ifLoading" class="discussionView">
    <div class="discussionViewTitle">讨论</div>
    <div ref="discussionViewContent" class="discussionViewContent overflowOuto">
      <list v-for="(item) in showArr" :key="item.id" :item="item" @imgLoadSuccess="imgLoadSuccess" />
    </div>
    <div class="discussionViewFooter">
      <div class="tools">
        <svg-icon icon-class="biaoqing" class-name="svgicon" style="stroke:currentColor" />
        <svg-icon icon-class="songhua" class-name="svgicon" style="stroke:currentColor" />
      </div>
      <div class="chatView">
        <el-button class="sendBtn" type="primary" size="small" disabled>发送</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import list from './list.vue'
import { mapState } from 'vuex'
export default {
  components: {
    list
  },
  props: {
    currentTime: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      // 脚本数据
      chatInteract: [],
      scrollTimer: null,
      showArr: [] // 需要展示的数据列表
      // nextCurrentTime: 0 // 记录上次的
    }
  },
  computed: {
    ...mapState({
      interactDetail: state => state.liveScript.interactDetail,
      ifNoMore: state => state.liveScript.ifNoMore,
      ifLoading: state => state.liveScript.ifLoading
    })
  },
  watch: {
    currentTime: {
      handler(newVal, oldVal) {
        console.log(newVal, oldVal, '播放时间改变触发')
        if (!(oldVal && newVal > oldVal)) {
          this.showArr = this.showArr.filter(v => v.sendTime < newVal && (![8, 9, 10].includes(v.msgType)))
        }
        const arr = this.chatInteract.filter(v => v.sendTime === newVal && (![8, 9, 10].includes(v.msgType)))
        arr.length > 0 && (this.showArr = this.showArr.concat(arr))
      },
      // immediate: true,
      deep: true
    },
    showArr: {
      handler(val) {
        this.$nextTick(() => {
          var wrap = this.$refs.discussionViewContent
          clearInterval(this.scrollTimer)
          this.scrollTo(wrap.scrollHeight, wrap.scrollTop, wrap)
        })
      },
      deep: true,
      immediate: true
    },
    ifNoMore: {
      handler(val) {
        if (val) {
          this.interactDetail.map(v => {
            if (v.robots && v.robots.length > 0) {
              v.robots.map((e, i) => {
                this.chatInteract.push({
                  sendTime: v.sendTime,
                  robots: e,
                  msgContent: v.msgContent,
                  width: v.width,
                  height: v.height,
                  msgType: v.msgType,
                  scriptInteractId: v.scriptInteractId,
                  eventType: v.eventType,
                  adjustNumber: v.adjustNumber,
                  id: `${v.scriptInteractId}_${i}`
                })
              })
            }
          })
        }
      }
    }
  },
  mounted() {
    this.chatInteract = []
    this.$store.commit('liveScript/set_ifNoMore', false)
    this.$store.dispatch('liveScript/getDetailList', this.$route.params.id)
  },
  methods: {
    scrollTo(endTop, startTop, element) {
      const a = Math.abs(endTop - startTop)
      const step = a / 10
      let time = 1 // 次数
      this.scrollTimer = setInterval(() => {
        endTop > startTop ? element.scrollTop += step : element.scrollTop -= step
        time = time + 1
        if (time === 10 || step < 10) {
          clearInterval(this.scrollTimer)
          element.scrollTop = endTop
        }
      }, 20)
    },
    imgLoadSuccess() {
      var wrap = this.$refs.discussionViewContent
      clearInterval(this.scrollTimer)
      this.scrollTo(wrap.scrollHeight, wrap.scrollTop, wrap)
    }
  }
}
</script>

<style lang='scss' scoped>
.discussionView {
  height: 100%;
  display: flex;
  width: 100%;
  flex-direction: column;
  background: #fff;
  .discussionViewTitle {
    height: 62px;
    width: 100%;
    border-bottom: 1px solid #E1E6ED;
    line-height: 62px;
    font-size: 16px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #333333;
    line-height: 62px;
    padding-left: 20px;
  }
  .discussionViewContent {
    flex: 1 0 0;
    padding: 20px;
  }
  .discussionViewFooter {
    height: 160px;
    .tools {
      height: 44px;
      background: #FFFFFF;
      display: flex;
      align-items: center;
      padding-left: 23px;
      border-top: 1px solid #E1E6ED;
      border-bottom: 1px solid #E1E6ED;
    }
    .chatView {
      position: relative;
      height: calc(100% - 44px);
      .sendBtn {
        position: absolute;
        right: 24px;
        bottom: 20px;
      }
    }
  }
}
.svgicon {
  width: 24px;
  height: 24px;
  font-size: 24px;
  margin-right: 28px;
  color: #797979;
}
</style>
