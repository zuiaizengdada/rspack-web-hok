<template>
  <div class="liveBroadcast">
    <div class="header">
      <div class="title">{{ ifLive ? '实时直播' : '实时评论' }}</div>
      <div class="switchComments" @click="switchCommit"><img src="~@/assets/image/switchComments.png">{{ ifLive? '切换评论' : '切换直播' }}</div>
    </div>
    <div class="videoPlayer">
      <videoPlayer ref="videoPlayer" />
      <div v-show="!ifLive" class="commentsView" :class="{'isActive': !ifLive}">
        <comments />
      </div>
    </div>
    <img src="@/assets/image/tier.png" alt="" srcset="" class="tierBox">
  </div>
</template>

<script>
import videoPlayer from './videoPlayer2.vue'
import comments from './comments.vue'
import { mapGetters, mapState } from 'vuex'
export default {
  components: {
    videoPlayer,
    comments
  },
  data() {
    return {
      ifLive: true,
      volume: 0
    }
  },
  computed: {
    ...mapGetters(['userInfo']),
    ...mapState({
      liveRoomDetail: state => state.im.liveRoomDetail
    })
  },
  mounted() {
    this.init()
  },
  methods: {
    switchCommit() {
      this.ifLive = !this.ifLive
      this.$refs.videoPlayer && this.$refs.videoPlayer.onhandleVolumeChange(this.volume)
      this.volume = this.ifLive ? 0 : this.$refs.videoPlayer.volume
    },
    init() {
      this.$store.commit('im/set_ifCanScrollBottom', true)
      this.$store.dispatch('im/getLiveRoomDetail', this.$route.params.id).then((res) => {
        console.log(res.data.status, '数据详情')
        if ([1, 2, 3].includes(res.data.status)) {
          // 开播
          if (res.data.liveModel === 'PERSON_LIVE') {
            this.$store.commit('im/set_videoUrl', this.getUrl(JSON.parse(res.data.liveRoomPersonInfo.broadcastInfo).auto).webRtc)
          } else if (res.data.liveModel === 'AI_LIVE') {
            this.$store.commit('im/set_videoUrl', this.getUrl(JSON.parse(res.data.liveRoomIntelligentInfo.broadcastInfo).auto).webRtc)
          }
          this.$store.commit('im/set_pushFlowSwitch', 1)
        } else {
          // 结束
          this.$store.commit('im/set_videoUrl', '')
          this.$store.commit('im/set_pushFlowSwitch', 0)
        }
        // 初始化直播间
        this.$store.dispatch('im/imInit', this.userInfo.userId).then(() => {
          this.$store.dispatch('im/getGroupById', res.data.groupId).then(() => {
            return this.$store.dispatch('im/joinGroup', res.data.groupId)
          }).then(() => {
            this.$store.commit('im/SET_chatUser', { type: 2, userId: res.data.groupId, userName: '公共聊天室', conversationID: `GROUP${res.data.groupId}` })
            // this.$store.dispatch('im/setGroupMemberNameCard', { groupId: res.data.groupId, userId: this.userInfo.userId, nameCard: 'admin' })
          })
        })
      })
    },
    getUrl({ appName = '', streamName = '', txSecret = '', txTime = '', url = '' }) {
      console.log(url, 'url')
      return {
        RTMP: `rtmp://${url}/${appName}/${streamName}?txSecret=${txSecret}&txTime=${txTime}&tabr_bitrates=${this.liveRoomDetail.tabrBitrates}&tabr_start_bitrate=${this.liveRoomDetail.tabrStartBitrate}&tabr_control=auto`,
        flv: `https://${url}/${appName}/${streamName}.flv?txSecret=${txSecret}&txTime=${txTime}&tabr_bitrates=${this.liveRoomDetail.tabrBitrates}&tabr_start_bitrate=${this.liveRoomDetail.tabrStartBitrate}&tabr_control=auto`,
        hls: `https://${url}/${appName}/${streamName}.m3u8?txSecret=${txSecret}&txTime=${txTime}&tabr_bitrates=${this.liveRoomDetail.tabrBitrates}&tabr_start_bitrate=${this.liveRoomDetail.tabrStartBitrate}&tabr_control=auto`,
        webRtc: `webrtc://${url}/${appName}/${streamName}?txSecret=${txSecret}&txTime=${txTime}&tabr_bitrates=${this.liveRoomDetail.tabrBitrates}&tabr_start_bitrate=${this.liveRoomDetail.tabrStartBitrate}&tabr_control=auto`
      }
    }
  }
}
</script>

<style lang='scss' scoped>
.liveBroadcast {
  position: relative;
  padding: 26px 18px 0;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: linear-gradient(90deg, #063C70 0%, #192747 100%);

  .tierBox{
    position: absolute;
    width:100%;
    top:0;
    left:0;
    right:0;
    height: 128px;
    z-index: 998;
    border-radius: 20px 20px 0 0;
    pointer-events: none;
  }
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: -40px;
    .title {
      font-size: 20px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #B6D4FF;
      line-height: 28px;
      position: relative;
      z-index: 999;
    }
    .switchComments {
      position: relative;
      z-index: 999;
      width: 96px;
      height: 32px;
      background-color: rgba(225,225,225,.2);
      border-radius: 4px;
      line-height: 32px;
      text-align: center;
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #FFFFFF;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      > img {
        width: 12px;
        height: 12px;
        margin-right: 5px;
      }
    }
  }
  .videoPlayer {
    flex: 1 0 0;
    position: relative;
    overflow: hidden;
    .commentsView {
      position: absolute;
      background: linear-gradient(90deg, #063C70 0%, #192747 100%);
      transform: all .3s;
      left: -100%;
      z-index: 3;
      width: 100%;
      top:0;
      height: 100%;
    }
    .isActive {
      left: 0;
    }
  }
}
</style>
