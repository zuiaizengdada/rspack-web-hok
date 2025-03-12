<template>
  <el-dialog
    class="video-detail"
    width="1214px"
    height="761px"
    :destroy-on-close="true"
    :visible.sync="shareVideoDetailFlag"
    :close-on-click-modal="false"
    :before-close="beforeClose"
  >
    <div slot="title">
      <p class="p-title">{{ detailObject.name }}</p>
      <span class="title-mess">共享者：<em>{{ detailObject.uploadUserName }}</em></span>
      <span class="title-mess">共享时间：<em>{{ detailObject.shareTime }}</em></span>
    </div>
    <div class="video-detail-cont">
      <div class="vdc-left">
        <span>视频ID:<em>{{ detailObject.videoId }}</em></span>
        <span>大小:<em>{{ detailObject.size | filterSize }}</em></span>
        <span>时长:<em>{{ getPlayDuration(detailObject.duration*1000) }}</em></span>
        <span>格式:<em>{{ formatArray[detailObject.format] }}</em></span>
        <span>分辨率:<em>{{ detailObject.definition }}</em></span>
        <span>视频类型:<em>半成品视频</em></span>
        <span>IP:<em>{{ detailObject.teacherName || '--' }}</em></span>
        <span>关联视频组名称:<em>{{ detailObject.videoGroupName? detailObject.videoGroupName:'--' }}</em></span>
      </div>
      <div class="vdc-right">
        <div v-show="shareVideoDetailFlag" id="shareVideoDetailPlay" class="video_play" />
        <div class="zimu_ls">
          <span>{{ nowWzData }}</span>
        </div>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <a
        :href="detailObject.videoUrl"
        target="tempiframe"
        download=""
        class="download-a"
        @click="downloadForFlag(3,detailObject)"
      >
        <el-button v-loading="downloadFlag" element-loading-spinner="el-icon-loading" size="mini" type="primary">下载视频</el-button>
      </a>
      <a
        :href="detailObject.subtitleFileUrl"
        target="tempiframe"
        download=""
        class="download-a"
        @click="downloadForFlag(1)"
      >
        <el-button v-loading="downloadFlagSubtitleFile" :disabled="detailObject.subtitleStatus !== 3" element-loading-spinner="el-icon-loading" size="mini" type="primary">下载字幕</el-button>
      </a>
      <a
        :href="detailObject.sensitiveUrl"
        target="tempiframe"
        download=""
        class="download-a"
        @click="downloadForFlag(2)"
      >
        <el-button v-loading="downloadFlagSensitiveUrl" :disabled="(detailObject.sensitiveWordStatus !== 3 && detailObject.sensitiveWordStatus !== 4)" element-loading-spinner="el-icon-loading" size="mini" type="primary">下载敏感词</el-button>
      </a>

      <el-button size="mini" @click="beforeClose">取消</el-button>
    </span>
    <iframe name="tempiframe" style="display: none" />
  </el-dialog>

</template>

<script>
import { getPlayDuration } from '@/utils/index'
import { getShareVideoDetailData, downloadAdd } from '@/api/videoManagement/vedioSetting'
import { urlVodExportZip } from '@/utils/zip'
import { getSubTitleList } from '@/api/videoManagement/subtitleEditor'
export default {
  components: {

  },
  data() {
    return {
      nowWzData: '',
      zimuArr: [],
      downloadFlagSubtitleFile: false,
      downloadFlagSensitiveUrl: false,
      downloadFlag: false,
      shareVideoDetailFlag: false,
      dialogVisible: true,
      detailObject: {},
      formatArray: ['', 'mp4', 'hls', 'mp3'],
      player: null,
      playerSdk: null,
      player_create_finish: false,
      playerStatus: '' // 当前视频的播放状态'play'播放 pause 暂停
    }
  },
  watch: {
    shareVideoDetailFlag(val) {
      if (val) {
        this.keyDown()
      } else {
        this.destroy()
        this.keyDownReview()
        console.log('销毁')
      }
    }
  },
  mounted() {},
  methods: {
    downloadForFlag(num, object) {
      if (num === 1) {
        this.downloadFlagSubtitleFile = true
      } else if (num === 2) {
        this.downloadFlagSensitiveUrl = true
      } else if (num === 3) {
        this.downloadFlag = true
      }
      const that = this
      setTimeout(function() {
        if (num === 1) {
          that.downloadFlagSubtitleFile = false
        } else if (num === 2) {
          that.downloadFlagSensitiveUrl = false
        } else if (num === 3) {
          that.downloadFlag = false
        }
      }, 1000)
      downloadAdd(object.semiVideoId).then(res => {
        console.log('download~~~:', res)
      })
    },
    play(option) {
      const _this = this
      this.destroy().then(res => {
        this.$nextTick(() => {
          try {
            // eslint-disable-next-line no-undef
            const playerSdk = new VePlayer({
              id: 'shareVideoDetailPlay',
              width: 788,
              height: 430,
              lang: 'zh',
              autoplayMuted: false,
              url: option.videoUrl,
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
              _this.player_create_finish = true
              _this.player = playerSdk.getPlayerInstance()
              playerSdk.on('timeupdate', (player) => {
                this.zimuArr.some(item => {
                  if ((player.currentTime >= item.startTime / 1000) && (player.currentTime <= item.endTime / 1000)) {
                    this.nowWzData = item.content
                  }
                })
                _this.$emit('timeupdate', player.currentTime)
              })
              playerSdk.on('canplay', (player) => {
                // _this.$emit('canplay')
                _this.playerStatus = 'canplay'
              })
              playerSdk.on('play', () => {
                _this.playerStatus = 'play'
              })
              playerSdk.on('pause', () => {
                // console.log('视频播放暂停')
                _this.playerStatus = 'pause'
              })
              playerSdk.on('ended', () => {
                // console.log('视频播放结束')
                _this.playerStatus = 'ended'
              })
              playerSdk.on('playing', () => {
                // console.log('（暂停、卡顿后）恢复播放')
                _this.playerStatus = 'play'
              })
              playerSdk.on('error', (error) => {
                // _this.$message.error('视频播放错误')
                console.log('视频播放错误', error)
                _this.playerStatus = 'error'
              })
            })
            _this.playerSdk = playerSdk
          } catch (err) {
            console.log(err)
          }
        })
      }).catch((err) => {
        console.log(err, 'err')
      })
    },
    // 按钮监听键盘
    keyDown () {
      const _this = this
      // 监听键盘按钮
      document.onkeydown = function (event) {
        var e = event || window.event
        var keyCode = e.keyCode || e.which
        switch (keyCode) {
          case 32:
            _this.playVideo && _this.playVideo()
            break
          default:
            break
        }
        /* if (e && e.preventDefault) {
          e.preventDefault()
        } else {
          window.event.returnValue = false
        } */
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
    loadZm(row) {
      this.nowWzData = ''
      this.zimuArr = []
      if (row.semiVideoId === '') {
        return
      }
      const params = {
        videoId: row.semiVideoId
      }
      getSubTitleList(params).then(res => {
        console.log('ddddddddddddddd:', res)
        if (res.success) {
          this.zimuArr = res.data
        }
      })
    },
    // 销毁当前播放器
    destroy() {
      if (!this.playerSdk) {
        return Promise.resolve()
      } else {
        return this.playerSdk.destroy()
      }
    },
    show(row) {
      getShareVideoDetailData(row.semiVideoId).then(res => {
        console.log('ress: ', res)
        if (res.success) {
          this.shareVideoDetailFlag = true
          this.play(res.data)
          this.detailObject = res.data
        }
      })
    },
    beforeClose() {
      this.destroy()
      console.log('关闭')
      this.player = null
      this.playerSdk = null
      this.player_create_finish = false
      this.shareVideoDetailFlag = false
    },
    async downloadVideo(object) {
      this.downloadFlag = true
      const list = []
      list.push({ src: object.videoUrl, name: object.name.replace('.mp4', '') + '.mp4' })
      list.push({ src: object.subtitleFileUrl, name: object.name.replace('.mp4', '') + '.srt' })
      list.push({ src: object.sensitiveUrl, name: object.name.replace('.mp4', '') + '.xlsx' })
      await urlVodExportZip(list, object.name.replace('.mp4', '.zip'))
      this.downloadFlag = false
      downloadAdd(object.semiVideoId).then(res => {
        console.log('download~~~:', res)
      })
    },
    getPlayDuration
  }
}
</script>

    <style lang='scss' scoped>
    .video-detail {
      width: 100%;
      ::v-deep .el-dialog {
          height: 716px;
          border-radius: 10px;
      }
      ::v-deep .el-dialog__header {
          border-bottom: 1px solid #e7e7e7;
          padding-bottom: 15px;
      }
      ::v-deep .el-dialog__body {
          width: 100%;
          height: 572px;
          margin: 15px 0;
          padding: 0 20px;
      }
      .p-title {
          color: #333;
          font-size: 16px;
          font-weight: bold;
          max-width: 500px;
          display: inline-block
      }
      .title-mess {
          font-size: 14px;
          color: #777;
          margin-left: 16px;
          em {
              color: #333;
              font-style: normal;
          }
      }
      .video-detail-cont {
          width: 100%;
          height: 100%;
          .vdc-left {
              width: 360px;
              height: 100%;
              float: left;
              padding-top: 20px;
              background: #FAFCFF;
              border-radius: 8px;
              span {
                  padding-left: 15px;
                  width: 100%;
                  display: inline-block;
                  color: #777;
                  font-size: 14px;
                  margin-bottom: 15px;
                  em {
                      color: #333;
                      font-style: normal;
                      margin-left: 15px;
                  }
              }
          }
          .vdc-right {
              position: relative;
              width: 794px;
              height: 100%;
              float: left;
              margin-left: 19px;
              border-radius: 10px;
              background-image: url(../../../../../assets/image/video/jx_bg.png);
              background-size: 100% 100%;
              overflow: hidden;
              .video_play {
                  margin-top: 75px;
                  width: 790px;
                  margin-left: 1px;
                  height: 443px;
              }
          }
      }
    }
    .dialog-footer {
      ::v-deep .el-loading-spinner {
        top: 96%;
      }
    }
    .download-a {
      margin-right: 20px;
    }

    .zimu_ls {
      position: absolute;
      width: 100%;
      height: 30px;
      bottom: 120px;
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

