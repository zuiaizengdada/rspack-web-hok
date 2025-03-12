<template>
  <el-dialog
    class="video-detail"
    width="1214px"
    :destroy-on-close="true"
    :visible.sync="finishedVideoDetailFlag"
    :close-on-click-modal="false"
    :before-close="beforeClose"
  >
    <div slot="title">
      <p class="p-title flex-wrap">{{ detailObject.name }}</p>
      <span v-if="!isDistribute" class="title-mess">
        内容来源：<em>{{ detailObject.supplierOrgName }}</em>
      </span>
      <!-- <span class="title-mess">
        时间：<em>{{ detailObject.createTime || '--' }}</em>
      </span> -->
    </div>
    <div class="video-detail-cont">
      <div class="vdc-left">
        <span>
          视频ID:<em>{{ detailObject.bizId }}</em>
        </span>
        <span>
          大小:<em>{{ detailObject.size | filterSize }}</em>
        </span>
        <span>
          时长:<em>{{ getPlayDuration(detailObject.duration * 1000) }}</em>
        </span>
        <span>
          格式:<em>{{ formatArray[detailObject.format] }}</em>
        </span>
        <span>
          分辨率:<em>
            {{ detailObject.videoWidth }}*{{ detailObject.videoHeight }}
          </em>
        </span>
        <span>
          IP:<em>{{ detailObject.teacherName || '--' }}</em>
        </span>
        <span>
          供应机构:<em>{{ detailObject.supplierOrgName || '--' }}</em>
        </span>
        <span>
          合作机构:<em>{{
            detailObject.cpOrgList | filterArrJoin('orgName')
          }}</em>
        </span>
        <span>
          时间:<em>{{ detailObject.createTime || '--' }}</em>
        </span>
        <span>
          分发人:<em>{{ detailObject.createUserName || '--' }}</em>
        </span>
        <span>
          视频组:<em>{{ detailObject.videoGroupName || '--' }}</em>
        </span>

        <template v-if="deliveryList.length">
          <span style="margin-bottom: 5px">分发对象:</span><br />
          <template v-for="(item, index) in deliveryList">
            <div :key="index">
              <span style="margin-bottom: 5px">
                {{ index + 1 }}、{{ item.deliveryTime }}
                {{ item.orgName }}
              </span>
              <br />
            </div>
          </template>
        </template>
      </div>
      <div class="vdc-right">
        <div
          v-show="finishedVideoDetailFlag"
          id="finishedVideoDetailPlay"
          class="video_play"
        />
        <div class="zimu_ls">
          <span>{{ nowWzData }}</span>
        </div>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <!-- <a
        :href="detailObject.videoUrl"
        target="tempiframe"
        download=""
        class="download-a"
        @click="downloadForFlag(3)"
      >
        <el-button
          v-loading="downloadFlag"
          element-loading-spinner="el-icon-loading"
          size="mini"
          type="primary"
        >
          下载视频
        </el-button>
      </a> -->
      <el-button size="mini" @click="finishedVideoDetailFlag = false">
        取消
      </el-button>
    </span>
    <iframe name="tempiframe" style="display: none" />
  </el-dialog>
</template>

<script>
import { getPlayDuration } from '@/utils/index'
import { desensitizedDetailApi } from '@/api/contentDistribution/index.js'
import { getDeliveryCpOrgListApi } from '@/api/videoManagement/vedioSetting'
import { urlVodExportZip } from '@/utils/zip'

import { mapGetters } from 'vuex'
import { getItem } from '@/utils/localStorage'
export default {
  filters: {
    filterArrJoin(arr, key) {
      if (!arr) return '--'
      return arr
        .map(item => {
          return item[key]
        })
        .join('、')
    }
  },
  data() {
    return {
      deliveryList: [],

      nowWzData: '',
      downloadFlagSubtitleFile: false,
      downloadFlagSensitiveUrl: false,
      downloadFlag: false,
      videoId: '',
      finishedVideoDetailFlag: false,
      dialogVisible: true,
      detailObject: {},
      formatArray: ['', 'mp4', 'hls', 'mp3'],
      player: null,
      playerSdk: null,
      player_create_finish: false,
      playerStatus: '', // 当前视频的播放状态'play'播放 pause 暂停
      isDistribute: false
    }
  },
  computed: {
    ...mapGetters(['userDeptId'])
  },
  watch: {
    finishedVideoDetailFlag(val) {
      if (val) {
        this.keyDown()
      } else {
        this.keyDownReview()
        this.destroy()
      }
    }
  },
  methods: {
    getDelivery(bizId) {
      if (this.deliveryList.length > 0) return
      getDeliveryCpOrgListApi({
        bizId: bizId,
        type: 1 // 脱敏视频
      }).then(res => {
        if (res.data) {
          this.deliveryList = res.data
        }
      })
    },
    downloadForFlag(num) {
      if (num === 1) {
        this.downloadFlagSubtitleFile = true
      } else if (num === 2) {
        this.downloadFlagSensitiveUrl = true
      } else if (num === 3) {
        this.downloadFlag = true
      }
      const that = this
      setTimeout(function () {
        if (num === 1) {
          that.downloadFlagSubtitleFile = false
        } else if (num === 2) {
          that.downloadFlagSensitiveUrl = false
        } else if (num === 3) {
          that.downloadFlag = false
        }
      }, 1000)
    },
    play(option) {
      this.$nextTick(() => {
        try {
          // eslint-disable-next-line no-undef
          const playerSdk = new VePlayer({
            id: 'finishedVideoDetailPlay',
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
            this.player_create_finish = true
            this.player = playerSdk.getPlayerInstance()
            // playerSdk.on('timeupdate', player => {
            //   this.zimuArr.some(item => {
            //     if (
            //       player.currentTime >= item.startTime / 1000 &&
            //       player.currentTime <= item.endTime / 1000
            //     ) {
            //       this.nowWzData = item.content
            //     }
            //   })
            //   this.$emit('timeupdate', player.currentTime)
            // })
            playerSdk.on('canplay', player => {
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
            playerSdk.on('error', error => {
              // this.$message.error('视频播放错误')
              console.log('视频播放错误', error)
              this.playerStatus = 'error'
            })
          })
          this.playerSdk = playerSdk
        } catch (err) {
          console.log(err)
        }
      })
    },
    // 按钮监听键盘
    keyDown() {
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
    keyDownReview() {
      document.onkeydown = function (event) {
        var e = event || window.event
        e.returnValue = true
      }
    },
    playVideo() {
      if (
        this.playerSdk?.player?.state === 6 ||
        this.playerSdk?.player?.state === 7
      ) {
        this.playerSdk?.player?.paused
          ? this.player && this.player.pause()
          : this.player && this.player.play()
      }
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
      this.videoId = row.finishVideoId
      desensitizedDetailApi({ id: row.id }).then(res => {
        if (res.success) {
          this.detailObject = res.data
          this.play(res.data)
          this.finishedVideoDetailFlag = true
          const orgInfo = getItem('orgInfo')
          this.isDistribute = orgInfo.organizationId === res.data.supplierOrgId
          this.getDelivery(res.data.bizId)
        }
      })
    },
    beforeClose() {
      this.destroy()
      this.finishedVideoDetailFlag = false
    },
    getPlayDuration,
    async downloadVideo(object) {
      this.downloadFlag = true
      const list = []
      list.push({
        src: object.videoUrl,
        name: object.name.replace('.mp4', '') + '.mp4'
      })
      list.push({
        src: object.subtitleFileUrl,
        name: object.name.replace('.mp4', '') + '.srt'
      })
      list.push({
        src: object.sensitiveUrl,
        name: object.name.replace('.mp4', '') + '.xlsx'
      })
      await urlVodExportZip(list, object.name.replace('.mp4', '.zip'))
      this.downloadFlag = false
    }
  }
}
</script>

<style lang="scss" scoped>
.mb10 {
  margin-bottom: 10px;
}
.video-detail {
  width: 100%;
  ::v-deep .el-dialog {
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
    display: inline-block;
    word-break: break-all;
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
      background: #fafcff;
      border-radius: 8px;
      overflow-y: auto;
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
      background-image: url('~@/assets/image/video/jx_bg.png');
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
.el-tooltip__popper[x-placement^='bottom'] .popper__arrow {
  border-bottom-color: #ececec !important;
}
</style>
