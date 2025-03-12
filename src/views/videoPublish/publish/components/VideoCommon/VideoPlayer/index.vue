<template>
  <div class="video-player-container relative">
    <div id="player" />
    <div v-if="percentage!==100 && !isError" class="video-loading absolute">
      <div class="progress_box">
        <img :src="iconLoading" class="loading-icon" />
        <p class="loading-txt ">视频加载中 {{ percentage }}%</p>
        <div class="loading-progress">
          <el-progress :percentage="percentage" :show-text="false" />
          <p class="truncate" :title="videoData.title+'.mp4'">{{ videoData.title }}.mp4({{ (videoData.size/1024/1024).toFixed(2) }}M)</p>
        </div>
      </div>
      <div v-if="realSpeed">
        <span>当前下载速度：</span>
        <span class="m-l-12 dowload_speed">{{ realSpeed }}</span>
        <span class="m-l-12 detection" @click="networkDetection">网络检测 <i class="el-icon-d-arrow-right" /></span>
      </div>
    </div>
    <div v-if="percentage!==100 && isError" class="video-error absolute">
      <div class="errorMsg">{{ errorMsg }}</div>
      <div v-if="!isError504" class="manual" @click="manualClear">
        <span style="margin-right: 8px;">手动清理方法</span>
        <svg-icon icon-class="manual" />
      </div>
      <div v-if="!isError504" class="complete">已完成系统盘空间清理</div>
      <el-button type="primary" plain @click="againDowload">重新下载</el-button>
    </div>
  </div>
</template>
<script>
import { queryWeMediaVideoInfo } from '../../../api/index'
import { getHuoshanPosterUrl } from '@/utils/index'
import { isUseNewClient } from '@/utils'
import iconLoading from '../../../../images/svg/loading.svg'
export default {
  data() {
    return {
      playerSdk: null,
      videoUrl: '',
      videoData: '',
      isError504: false,
      realSpeed: '0M/s',
      isError: false,
      percentage: 0,
      iconLoading
    }
  },
  inject: ['updateVideoData', 'updateVideoFilePathOrUrl', 'publishForm'],
  destroyed() {
    this.clearVideoPlayer()
  },
  created() {
    this.getVideoInfo()
  },
  methods: {
    getVideoInfo() {
      const { finishVideoId, orgId = undefined } = this.$route.query
      if (finishVideoId) {
        queryWeMediaVideoInfo({ finishVideoId, orgId }).then((res) => {
          console.log(res, '视频信息。。。。')
          this.videoData = res.data
          const { videoUrl, posterUrl, title } = res.data
          this.videoUrl = videoUrl
          res.data.posterUrl = getHuoshanPosterUrl(posterUrl)
          res.data.title = title
          this.updateVideoData(res.data)
          this.initVideoPlayer()
          this.downloadVideo(res.data)
          this.$emit('getVideoOver')
        })
      }
    },
    // 网络检测
    networkDetection() {
      window.open('https://myplugin.speedtest.cn/#/')
    },
    manualClear() {
      window.open('https://oss.hokkj.cn/yijianfabu/c%E7%9B%98%E6%B8%85%E7%90%86%E6%96%B9%E6%B3%95.pdf')
    },
    againDowload() {
      this.getVideoInfo()
    },
    initVideoPlayer() {
      this.clearVideoPlayer()
      // eslint-disable-next-line no-undef
      const playerSdk = new VePlayer({
        id: 'player',
        url: this.videoUrl,
        ignores: ['sdkUnmutePlugin'],
        controls: true,
        autoplayMuted: false,
        autoplay: false,
        start: {
          isShowPause: false,
          isShowEnd: false,
          mode: 'hide',
          disableAnimate: true
        }
      })

      playerSdk.on('player_create_finish', (player) => {
        this.playerSdk = playerSdk.getPlayerInstance()
      })
    },
    clearVideoPlayer() {
      const dom = document.querySelector('#player')
      dom && (dom.innerHTML = '')
        this.playerSdk?.destroy && this.playerSdk.destroy()
        this.isPlay = false
    },
    // 传入的是Mb 低于0.1Mb/s的时候显示为Kb/s
    conversionSpeed(speed) {
      return speed < 0.1 ? (speed * 1024).toFixed(2) + 'Kb/s' : speed.toFixed(2) + 'M/s'
    },
    // 将视频下载到本地
    downloadVideo(data) {
      console.log(data, '下载视频信息。。。')
      this.isError = false
      const videoDownloadUrl = data.videoDownloadUrl
      isUseNewClient(19, 'down-video', '', '视频远端地址下载至本地').emit('down-video', JSON.stringify(videoDownloadUrl), () => {})
      // this.$store.dispatch('settings/insertApiStat', { 'apiUrl': 'down-video', 'remark': '视频远端地址下载至本地' })
      isUseNewClient(19, 'down-video', '', '视频远端地址下载至本地').on('down-video', (response) => {
        console.log(response, '下载视频进度。。。')
        const result = JSON.parse(response)
        const n = Math.trunc(result.process * 100)
        const speed = result.speed
        if (speed) {
          this.realSpeed = this.conversionSpeed(Number(speed))
        } else {
          this.realSpeed = ''
        }
        // data.videoDownloadUrl跟返回的url是不是同一个地址
        if (data.videoDownloadUrl !== result.url) {
          return
        }
        this.percentage = n
        if (result.messageType === 200) {
          const path = result.path
          this.updateVideoFilePathOrUrl(path)
          this.videoData.localPathUrl = path
          console.log(n, '进度条。。')
        }
        if (result.messageType === 502 || result.messageType === 504) {
          this.percentage = 0
          this.errorMsg = result.message
          this.isError504 = result.messageType === 504
          this.isError = true
          console.log('下载失败。。。')
        }
      })
    }
  }

}
</script>
<style lang="scss" scoped>
#player{
  width:100%;
  height:400px;
}
.video-loading{
  display: flex;
  justify-content: space-between;
}
.video-error{
  display: flex;
  align-items: center;
  justify-content: center;
  .errorMsg{
    font-size: 14px;
    color: #fff;
    margin-bottom: 34px;
  }
  .manual{
    color: #0c6fff;
    font-size: 18px;
    font-weight: 400;
    margin-bottom: 34px;
    cursor: pointer;
  }
  .complete{
    color: #ffffff;
    font-size: 12px;
    font-weight: 400;
    margin-bottom: 10px;
  }
}
.video-loading,.video-error{
  z-index: 200;
  top:0;
  left:0;
  width:100%;
  height: 100%;
  background: rgba(0,0,0,1);
  color:#fff;
  flex-direction: column;
  padding: 20px;
  box-sizing: border-box;
  .dowload_speed{
    color: #00b42a;
    font-size: 14px;
    font-weight: 400;
  }
  .detection{
    color: #1778ff;
    font-size: 14px;
    font-weight: 400;
    cursor: pointer;
  }
  .progress_box{
    width: 360px;
    margin: 100px auto 16px;
    text-align: center;
  }
  .loading-icon{
    width: 40px;
    margin:0 auto 16px;
    animation:rotateLoading 4s linear infinite;

  }
  .loading-txt{
    font-size:16px;
    margin-bottom:32px;
    width: 100%;
  }
  .loading-progress{
    width:360px;
    margin:0 auto 10px;
    p{
      font-size: 14px;
      text-align: left;
    }
  }
}

@-webkit-keyframes rotateLoading {
  0% {
  -webkit-transform:rotate(0);
  -moz-transform:rotate(0);
  -ms-transform:rotate(0);
  -o-transform:rotate(0);
  transform:rotate(0)
}
100% {
  -webkit-transform:rotate(360deg);
  -moz-transform:rotate(360deg);
  -ms-transform:rotate(360deg);
  -o-transform:rotate(360deg);
  transform:rotate(360deg)
}}

</style>
