<template>
  <AppDialog
    v-model="visible"
    :close-on-press-escape="closeOnPressEscape"
    width="916px"
    height="auto"
    top="10vh"
    title=""
  >
    <template slot="title">
      <div class="flex flex-middle flex-between" style="height: 36px; width: 100%;">
        <span class="flex flex-middle" style="height: 36px;">
          <span>{{ videoName }}</span>
          <span v-if="videoId" class="videoId flex flex-middle">ID: {{ videoId }}</span>
          <span v-if="videoInfo&& Object.keys(videoInfo).length > 0 && videoInfo.isInvalid !== 1" class="status flex">
            <span style="font-size: 12px;margin-left: 8px;" :class="videoInfo.statusList[videoInfo.autoDesensitizedStatus-1].class"><i :class="[videoInfo.statusList[videoInfo.autoDesensitizedStatus-1].icon,'mr-1'] " />{{ videoInfo.statusList[videoInfo.autoDesensitizedStatus-1].name }}</span>
          </span>
        </span>
        <span v-if="videoInfo&&videoInfo.isMe" class="flex flex-middle" style="height: 36px;">
          <span v-if="videoInfo&& Object.keys(videoInfo).length > 0" class="status flex flex-middle">
            <span v-if="videoInfo.isInvalid !== 1">
              <el-button v-if="videoInfo.isEmptyMirror !== 1 && videoInfo.autoDesensitizedStatus != 1" style="font-size: 14px;" size="mini" :disabled="videoInfo.autoDesensitizedStatus===1" @click="handleClickReload">重新脱敏</el-button>
              <el-button v-if="videoInfo.isEmptyMirror !== 1 && videoInfo.autoDesensitizedStatus === 3" style="font-size: 14px;" size="mini" :disabled="videoInfo.autoDesensitizedStatus===1" @click="reForChuli">重新处理</el-button>
              <el-button v-if="videoInfo.isEmptyMirror !== 1 && videoInfo.autoDesensitizedStatus == 2" style="font-size: 14px; margin-left: 10px;" size="mini" type="primary" @click="toDesensitizationVideo">在线脱敏</el-button>
            </span>
            <span v-else>
              <el-button style="font-size: 14px;" size="mini" @click="setCancelInvalid">取消“无效素材”</el-button>
            </span>
          </span>
        </span>
      </div>
    </template>
    <div class="choose_resource">
      <div v-if="visible" id="msg" />
    </div>
    <div slot="footer" />
    <div class="zimu_ls">
      <span>{{ nowWzData }}</span>
    </div>
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import { getSubTitleList, getWorkbenchSubtitleList } from '@/api/videoManagement/subtitleEditor'
export default {
  components: {
    AppDialog
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    src: {
      type: String,
      default: ''
    },
    videoId: {
      type: String,
      default: ''
    },
    videoName: {
      type: String,
      default: ''
    },
    closeOnPressEscape: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      nowWzData: '',
      zimuArr: [],
      player: null,
      posterShow: true,
      loading: false,
      videoInfo: null,
      playerSdk: null,
      player_create_finish: false,
      playerStatus: '' // 当前视频的播放状态'play'播放 pause 暂停
    }
  },
  watch: {
    visible(val) {
      if (val) {
        this.keyDown()
      } else {
        this.keyDownReview()
        this.destroy()
      }
    }
  },
  mounted() {},
  methods: {
    loadZm(option) {
      console.log('))))))))))))))))))))))', option)
      this.videoInfo = option.videoInfo ? option.videoInfo : null
      console.log(this.videoInfo, 'videoInfo')
      this.nowWzData = ''
      this.zimuArr = []
      if (option.idForVideo === '' || !option.idForVideo) {
        return
      }
      const params = {
        videoId: option.idForVideo
      }
      if (option.videoType === 2) {
        getWorkbenchSubtitleList(params).then(res => {
          if (res.success) {
            this.zimuArr = res.data
          }
        })
      } else {
        getSubTitleList(params).then(res => {
          if (res.success) {
            this.zimuArr = res.data
          }
        })
      }
    },
    play(option) {
      this.loadZm(option)
      this.$nextTick(() => {
        try {
          // eslint-disable-next-line no-undef
          const playerSdk = new VePlayer({
            id: 'msg',
            width: 876,
            height: 492,
            lang: 'zh',
            autoplayMuted: false,
            url: option.url,
            controls: {
              autoHide: false
            },
            autoplay: false,
            sdkErrorPlugin: {
              errorImg: false
            },
            playbackRate: [0.5, 1, 1.25, 1.5, 2, 3],
            ignores: ['sdkUnmutePlugin', 'DanmuPlugin'],
            ...option
          })
          // 需要在播放器创建完成后再去监听timeupdate事件
          playerSdk.on('player_create_finish', () => {
            console.log('播放器创建完成')
            this.player_create_finish = true
            this.player = playerSdk.getPlayerInstance()
            playerSdk.on('timeupdate', (player) => {
              this.zimuArr.some(item => {
                if ((player.currentTime >= item.startTime / 1000) && (player.currentTime <= item.endTime / 1000)) {
                  this.nowWzData = item.content
                }
              })
              this.$emit('timeupdate', player.currentTime)
            })
            playerSdk.on('canplay', (player) => {
              // this.$emit('canplay')
              this.playerStatus = 'canplay'
            })
            playerSdk.on('play', () => {
              console.log('视频播放')
              this.playerStatus = 'play'
            })
            playerSdk.on('pause', () => {
              // console.log('视频播放暂停')
              this.playerStatus = 'pause'
            })
            playerSdk.on('ended', () => {
              // console.log('视频播放结束')
              this.playerStatus = 'ended'
            })
            playerSdk.on('playing', () => {
              // console.log('（暂停、卡顿后）恢复播放')
              this.playerStatus = 'play'
            })
            playerSdk.on('error', (error) => {
              // this.$message.error('视频播放错误')
              console.log('视频播放错误', error)
              this.playerStatus = 'error'
            })
          })
          this.playerSdk = playerSdk
        } catch (err) {
          // console.log('err', err)
        }
      })
    },
    close() {
      this.visible = false
    },
    // 按钮监听键盘
    keyDown () {
      const _this = this
      // 监听键盘按钮
      document.onkeydown = function (event) {
        var e = event || window.event
        var keyCode = e.keyCode || e.which
        // console.log('keyCode', keyCode)
        switch (keyCode) {
          case 32:
            _this.playVideo && _this.playVideo()
            break
          default:
            break
        }
        if (e && e.preventDefault) {
          e.preventDefault()
        } else {
          window.event.returnValue = false
        }
      }
    },
    keyDownReview () {
      document.onkeydown = function (event) {
        var e = event || window.event
        e.returnValue = true
      }
    },
    playVideo() {
      if (this.playerSdk?.player?.state === 6 || this.playerSdk?.player?.state === 7) {
        this.playerSdk?.player?.paused ? this.player && this.player.pause() : this.player && this.player.play()
      }
    },
    setCancelInvalid() {
      this.videoInfo.cancelInvalid(this.videoInfo)
    },
    handleClickReload() {
      this.videoInfo.autoDesensitizedStatus = 1
      this.$set(this.videoInfo, 'autoDesensitizedStatus', 1)
      this.videoInfo.handleClickReload(this.videoInfo)
    },
    toDesensitizationVideo() {
      this.videoInfo.toDesensitizationVideo(this.videoInfo)
    },
    reForChuli() {
      this.videoInfo.reForChuli(this.videoInfo)
    },
    // 销毁当前播放器
    destroy() {
      if (!this.playerSdk) {
        return Promise.resolve()
      } else {
        return this.playerSdk.destroy()
      }
    }
  }
}
</script>

<style lang='scss' scoped>
.status{
  .green{
    color:#00B42A;
    background: #E6F7EA;
  }
  .orange{
      color:#FF7D00;
      background: #FFF2E6;
  }
  .red{
      color:#F53F3F;
      background: #FEECEC;
  }
  span{
     height: 24px;
    border-radius: 12px;
    line-height: 24px;;
    padding:0 10px;
  }
}
::v-deep .ss-material-box-header-title{
  width: 100% !important;
}
.choose_resource {
  width: 100%;
  height: 531px;
  display: flex;
  align-items: center;
  justify-content: center;
  #msg {
    width: 876px;
    height: 492px;
  }
}
  .videoId {
    font-size: 14px;
    font-family: MicrosoftYaHei;
    color: #777777;
    line-height: 22px;
    margin-left: 16px;
  }
  .zimu_ls {
    position: absolute;
    width: 100%;
    height: 30px;
    bottom: 70px;
    span {
      float: left;
      font-size: 14px;
      font-weight: bold;
      color: #fff;
      text-align: center;
      width: 96%;
      padding: 0 2%;
      height: 30px;
      line-height: 30px;
    }
  }
</style>
