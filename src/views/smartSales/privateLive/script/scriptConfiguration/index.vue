<template>
  <!-- 脚本配置 -->
  <div ref="scriptConfiguration" v-loading="ifLoading" class="scriptConfiguration">
    <headerTop :title="scriptInfo.scriptName" @success="onhandleRefrelist" />
    <div class="content">
      <div class="custom-tree-container view">
        <div class="playerContentView">
          <playerView ref="playerView" @onkeyDownQ="onkeyDownQ" @timeupdate="updataCurrentTime" />
        </div>
        <div class="videoPlayTips">提示：按Q键打点，按空格键播放。</div>
        <liveCaption ref="liveCaption" />
      </div>
      <div id="scriptConfigurationLine" class="scriptConfigurationLine">
        <div class="addView">
          <addView ref="addView" :video-detail="videoDetail" @success="onhandleAddEditSuccess" />
        </div>
      </div>
      <div class="view page_warp_right">
        <InteractiveList ref="interactiveList" @onEdit="onEdit" @onListClick="onListClick" @onDel="onDel" />
      </div>
    </div>
  </div>
</template>

<script>
import headerTop from './component/headerTop.vue'
import playerView from './component/playerView.vue'
import InteractiveList from './component/InteractiveList.vue'
import addView from './component/addView.vue'
import { getDetail } from '@/api/liveRoom/script'
import liveCaption from './component/captions/index.vue'
import { mapState } from 'vuex'
export default {
  components: {
    headerTop,
    playerView,
    InteractiveList,
    addView,
    liveCaption
  },
  data() {
    return {
      width: 640, // 默认左边div的宽度
      minLeftWidth: 580, // 左边最小
      minRightWidth: 700, // 右边最小
      lastClientX: 0,
      videoDetail: {
        duration: 0, // 总时长
        coverUrl: '', // 封面
        covertStatus: 1,
        format: '',
        height: '',
        videoName: '',
        videoId: '',
        url: ''
      },
      scriptInfo: {
        scriptName: '',
        scriptId: ''
      },
      loading: false,
      listLoading: false
    }
  },
  computed: {
    ...mapState({
      currentTime: state => state.liveScript.currentTime,
      fullscreen: state => state.liveScript.fullscreen,
      interactDetail: state => state.liveScript.interactDetail,
      ifLoading: state => state.liveScript.ifLoading
    })
  },
  beforeDestroy () {
    console.log('销毁')
    this.$store.dispatch('liveScript/init')
  },
  created() {
    this.listLoading = true
    this.$store.dispatch('liveScript/init')
  },
  mounted() {
    console.log('进入页面')
    this.getDetail().then(() => {
      this.$refs.liveCaption && this.$refs.liveCaption.getList(this.videoDetail.videoId)
      // this.listLoading = true
      return this.$store.dispatch('liveScript/getDetailList', this.$route.params.id).then(() => {
        console.log('加载完全')
        // this.listLoading = false
      })
    }).catch(() => {
      this.$refs.liveCaption && this.$refs.liveCaption.getList(this.videoDetail.videoId)
      // this.listLoading = false
    })
  },
  methods: {
    moveHandle(nowClient) {
      const ScreenWidth = this.$refs.scriptConfiguration.offsetWidth
      console.log(ScreenWidth, 'ScreenWidth')
      if (this.lastClientX === 0) {
        // 第一次拖动 记录起始位置
        this.lastClientX = nowClient
      } else {
        // 计算拖动的距离 赋值给左边div
        const width = this.width + (nowClient - this.lastClientX)
        if ((nowClient - this.lastClientX < 0 && width > this.minLeftWidth) || (nowClient - this.lastClientX > 0 && ScreenWidth - width > this.minRightWidth)) {
          this.width = width
        }
        // 记录最后一个的拖动位置
        this.lastClientX = nowClient
      }
    },
    setLeftStyle: function () {
      const wid = this.width + 'px'
      return `width:${wid};`
    },
    // 按Q键打点
    onkeyDownQ() {
      if (this.fullscreen) { return }
      console.log('触发按Q键打点')
      // 延迟200毫秒，不然会有时间对不上的问题
      setTimeout(() => {
        this.$refs.addView.onAdd(this.currentTime)
      }, 200)
    },
    // 播放时间改变触发
    updataCurrentTime(res) {
      // console.log(res)
      // this.videoDetail.currentTime = Math.round(res)
      this.$store.commit('liveScript/set_currentTime', Math.round(res))
    },
    // 点击编辑按钮
    onEdit(res) {
      this.$refs.addView.onEdit(res)
      this.$refs.playerView.setplay(res.sendTime)
      this.$store.commit('liveScript/set_currentTime', res.sendTime)
    },
    onListClick(res) {
      this.$refs.playerView.setplay(res.sendTime)
      this.$store.commit('liveScript/set_currentTime', res.sendTime)
    },
    onDel(res) {
      this.$refs.addView.onReset(res, this.currentTime)
    },
    // 新增/ 编辑成功
    onhandleAddEditSuccess(res) {
      if (res) {
        const obj = this.interactDetail.find(v => v.scriptInteractId === res)
        console.log(res, obj, '123123')
        obj && this.$refs.addView.onAdd(obj.sendTime)
        obj && this.$refs.playerView.setplay(obj.sendTime)
        obj && this.$store.commit('liveScript/set_currentTime', obj.sendTime)
        // obj && this.$refs.interactiveList && this.$refs.interactiveList.scrollTo(document.querySelector(`#ScriptLiveRoom_${res}`).offsetTop - 203, document.querySelector('#detailContent').scrollTop)
        obj && this.$refs.interactiveList && this.$refs.interactiveList.scrollTo(obj.scriptInteractId)
      }
    },
    // 获取详情
    getDetail() {
      return getDetail(this.$route.params.id).then(res => {
        console.log(res)
        this.scriptInfo = res.data
        this.videoDetail = res.data.videoDetail
        this.$refs.playerView && this.$refs.playerView.play(res.data.videoDetail.url, res.data.videoDetail.coverUrl, res.data.videoDetail)
      })
    },
    // 刷新列表数据
    onhandleRefrelist() {
      this.$store.dispatch('liveScript/init')
      // this.$store.commit('liveScript/set_pageIndex', 1)
      return this.$store.dispatch('liveScript/getDetailList', this.$route.params.id)
    }
  }
}
</script>

<style lang='scss' scoped>
.scriptConfiguration {
  min-width: 1750px;
  height: 100vh;
  // min-height: 790px;
  width: 100vw;
  display: flex;
  flex-direction: column;
  background: #EBEDF0;
  .content {
    width: 100%;
    // min-height: 760px;
    // flex: 1 0 0;
    height: calc(100vh - 73px);
    .custom-tree-container {
      width: 450px;
      height: 100%;
      padding: 20px 0 20px 20px;
      display: flex;
      flex-direction: column;
      .playerContentView {
        // flex: 1 0 0;
        height: 360px;
        background: rgba(0, 0, 0, 0.60);
        border-radius: 10px;
        overflow: hidden;
      }
      .videoPlayTips {
        margin-top: 10px;
        font-size: 16px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #333333;
        line-height: 22px;
        margin-bottom: 20px;
      }
    }
    .addView {
      height: 100%;
      flex: 1 0 0;
      background: #FFFFFF;
      border-radius: 10px;
    }
    .view{
      height: 100%;
      float: left;
      overflow: auto;
    }
    .scriptConfigurationLine{
      padding: 20px 0 20px 20px;
      float: left;
      width: 550px;
      height: 543px;
      // background: #CEDEF5;
      border-radius: 5px;
    }
    .page_warp_right {
      width: calc(100% - 1000px);
      float: 1 0 0;
      height: 100%;
      display: flex;
      flex-direction: column;
      padding: 20px 20px 20px 13px;
    }
  }
}
</style>
