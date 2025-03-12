<template>
  <!-- 顶部p0区域 -->
  <div class="p0">
    <div class="p0_content">
      <span class="liveRoomTitle">{{ liveRoomDetail.name }}</span>
      <span class="liveRoomLiveState m-l-10 m-r-20" :class="`liveRoomLiveState${liveRoomDetail.status}`">
        <svg-icon class-name="liveTypeicon" :icon-class="{'-1': '_wating', 0: 'livenostart', 1: 'liveIng', 2: 'liveSuspend', 3: 'liveError',9: 'audit_info'}[liveRoomDetail.status]" />{{ liveRoomDetail.status | getOptionsValue(liveStateOption) }}
      </span>
      <span class="liveMode m-r-20"><span>直播间ID：</span><span>{{ liveRoomDetail.code }}</span></span>
      <span class="liveMode m-r-20"><span>直播模式：</span><span>{{ liveRoomDetail.liveModel | getOptionsValue(liveModeOption) }}</span></span>
      <span class="liveTime m-r-20"><span>开播时间：</span><span>{{ liveRoomDetail.startTime | renderTime }}</span></span>
      <span v-if="liveRoomDetail.liveModel === 'AI_LIVE' && liveRoomDetail.status === 1" class="liveTime m-r-20"><span>结束时间：</span><span>{{ liveRoomDetail.playEndTime | renderEndTime }}</span></span>
      <el-button type="primary" size="small" @click="onhandleShare">邀课链接</el-button>
      <!-- <svg-icon v-if="liveRoomDetail.status !== 9" icon-class="shareIcon" class-name="shareIcon" @click="onhandleShare" /> -->
    </div>
    <div>
      <el-button type="primary" @click="gotoLiveKanBan">
        <svg-icon class-name="liveTypeicon" icon-class="shujudaping" />
        数据大屏
      </el-button>
    </div>
    <InviteDialog :config="inviteConfig" @close="closeInviteDialog" />
  </div>
</template>

<script>
import { liveStateOption, liveModeOption } from '../../../columns'
import InviteDialog from '@/views/live/liveList/component/InviteDialog.vue'
import { mapState } from 'vuex'
import moment from 'moment'
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
    InviteDialog
  },
  data() {
    return {
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
.p0 {
  height: 100%;
  padding: 0 24px;
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
      font-weight: 600;
      color: #333333;
      line-height: 30px;
      text-overflow: -o-ellipsis-lastline;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      line-clamp: 1;
      -webkit-box-orient: vertical;
    }
    .liveRoomLiveState {
      display: inline-block;
      // background: #E7F0FF;
      border-radius: 5px;
      height: 28px;
      font-size: 16px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      // color: #0C6FFF;
      line-height: 28px;
      padding: 0 12px;
    }

    .liveRoomLiveState0,.liveRoomLiveState-1  {
      background: #EEF2F9;
      color: #717F99;
    }
    .liveRoomLiveState1 {
      background: #E7F0FF;
      color: #1778FF;
    }
    .liveRoomLiveState2 {
      background: #FFF2E6;
      color: #FF7D00;
    }
    .liveRoomLiveState3 {
      background: #FEECEC;
      color: #F53F3F;
    }
    .liveRoomLiveState9 {
      background: #F5F5F5;
      color: #999999;
    }
    .liveMode {
      > span:nth-child(1) {
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #777777;
        line-height: 22px;
      }
      > span:nth-child(2) {
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #333333;
        line-height: 22px;
      }
    }
    .liveTime {
      > span:nth-child(1) {
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #777777;
        line-height: 22px;
      }
      > span:nth-child(2) {
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #333333;
        line-height: 22px;
      }
    }
  }
}
.shareIcon {
  color: #0C6FFF;
  cursor: pointer;
}
</style>
