<template>
  <!-- 顶部p0区域 -->
  <div class="p0">
    <div class="p0_content">
      <span class="liveRoomTitle">{{ liveRoomDetail.name }}</span>
      <liveStatus :status="liveRoomDetail.status">
        <!-- <lottie v-if="liveRoomDetail.status === 1" :options="defaultOptions" :height="20" :width="20" /> -->
      </liveStatus>
    </div>
    <div>
      <span class="liveMode mr-30"><span>直播间ID：</span><span>{{ liveRoomDetail.code }}</span></span>
      <span class="liveMode mr-30"><span>直播模式：</span><span>{{ liveRoomDetail.liveModel | getOptionsValue(liveModeOption) }}</span></span>
      <span class="liveTime mr-25"><span>开播时间：</span><span>{{ liveRoomDetail.startTime | renderTime }}</span></span>
      <span v-if="liveRoomDetail.liveModel === 'AI_LIVE' && liveRoomDetail.status === 1" class="liveTime m-r-20"><span>结束时间：</span><span>{{ liveRoomDetail.playEndTime | renderEndTime }}</span></span>
      <el-button type="primary" class="primaryBtn" size="small" @click="onhandleShare">邀课链接</el-button>
    </div>
    <InviteDialog :config="inviteConfig" @close="closeInviteDialog" />
  </div>
</template>

<script>
import liveStatus from './liveStatus.vue'
// import lottie from 'vue-lottie'
import { liveStateOption, liveModeOption } from '../../columns'
import InviteDialog from '../../liveList/component/InviteDialog2.vue'
import { mapState } from 'vuex'
import moment from 'moment'
import * as animationData from './live.json'
export default {
  filters: {
    renderTime(val) {
      if (!val) {
        return ''
      }
      return moment(val).format('YYYY-MM-DD HH:mm')
    },
    renderEndTime(val) {
      if (!val) {
        return ''
      }
      return moment(val).format('HH:mm')
    }
  },
  components: {
    liveStatus,
    InviteDialog
    // lottie
  },
  data() {
    return {
      defaultOptions: { animationData: animationData.default },
      liveStateOption,
      liveModeOption,
      liveRoomId: this.$route.params.id,
      inviteConfig: {
        visible: false,
        row: {}
      }
    }
  },
  computed: {
    ...mapState({
      liveRoomDetail: state => state.im.liveRoomDetail
    })
  },
  mounted() {},
  methods: {
    gotoLiveKanBan() {
      const { href } = this.$router.resolve({
        path: `/liveKanban/${this.liveRoomId}`
      })
      window.open(href, '_blank')
    },
    closeInviteDialog() {
      this.inviteConfig.visible = false
    },
    onhandleShare() {
      console.log('点击分享')
      this.inviteConfig = {
        visible: true,
        row: {
          liveModel: this.liveRoomDetail.liveModel,
          name: this.liveRoomDetail.name,
          code: this.liveRoomDetail.code,
          startTime: this.liveRoomDetail.startTime,
          id: this.$route.params.id
        }
      }
    }
  }
}
</script>

<style lang='scss' scoped>
$margin-values: (25, 30); // 定义数组
@each $value in $margin-values {
  .mr-#{$value} {
    margin-right: #{$value}px; // 动态生成 margin-right 样式
  }
}
.p0 {
  height: 100%;
  padding: 0 51px 0 38px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .p0_content {
    display: flex;
    align-items: center;
    .liveRoomTitle {
      max-width: 400px;
      font-size: 22px;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 900;
      color: #000;
      line-height: 30px;
      text-overflow: -o-ellipsis-lastline;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      line-clamp: 1;
      -webkit-box-orient: vertical;
    }
  }
  .liveMode {
    > span:nth-child(1) {
      font-size: 16px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 600;
      color: #000000;
      line-height: 22px;
    }
    > span:nth-child(2) {
      font-size: 16px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 600;
      color: #000000;
      line-height: 22px;
    }
  }
  .liveTime {
    > span:nth-child(1) {
      font-size: 16px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 600;
      color: #000000;
      line-height: 22px;
    }
    > span:nth-child(2) {
      font-size: 16px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 600;
      color: #000000;
      line-height: 22px;
    }
  }
}
.shareIcon {
  color: #0C6FFF;
  cursor: pointer;
}
.primaryBtn {
  width: 88px;
  height: 32px;
  flex-shrink: 0;
  border-radius: 5px;
  background: #0C6FFF;
}
</style>
