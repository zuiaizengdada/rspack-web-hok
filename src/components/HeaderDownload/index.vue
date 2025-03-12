<template>
  <div>
    <div class="task-box" @click="click">
      <div class="header-task">
        <em class="download-img" />
      </div>
      <div class="header-title">下载</div>
    </div>
    <div v-show="visible" class="message-wrapper" @click="click">
      <div class="message-box">
        <div
          class="message-main"
          :class="showTask ? '' : 'short-message'"
          @click.stop="onNoClick"
        >
          <div v-if="showTask" class="ewm-block">
            <span class="title-span">
              <img src="../../assets/image/account/icn_blue_niu.png" />
              <em>扫码下载获客管理App</em>
            </span>
            <div>
              <span class="ewm-block-img">
                <AppQrcode
                  :size="120"
                  class="qrcode"
                  :margin="0"
                  :src="iosUrl"
                />
                <p>iOS 下载</p>
              </span>
              <div class="line-block" />
              <span class="ewm-block-img">
                <AppQrcode
                  :size="120"
                  class="qrcode"
                  :margin="0"
                  :src="androidUrl"
                />
                <p>Android 下载</p>
              </span>
            </div>
          </div>
          <div class="download-block">
            <span class="title-span">
              <img src="../../assets/image/account/icn_fuxiyun_new.jpg" />
              <em style="color: #FF9F1F;">下载伏羲云自媒体客户端</em>
            </span>
            <div class="icn_down_img">
              <img
                src="../../assets/image/account/icon_mac_download_new.png"
                @click="downloadDoc"
              />
              <img
                style="margin-left: 8px"
                src="../../assets/image/account/icon_windows_download_new.png"
                @click="downloadAndriod"
              />
            </div>
          </div>
          <div
            v-permission="['web:liveRoomDetail:personLiveLink', permsList]"
            class="download-block"
          >
            <span class="title-span">
              <img src="../../assets/image/account/icn_red_niu.png" />
              <em>下载伏羲云直播客户端</em>
            </span>
            <div class="icn_down_img fl">
              <!-- <img style="margin: auto;width: 221px;height: 60px;" src="../../assets/image/account/icn_window_liveTool.png" @click="downLiveWindowTools"> -->
              <img
                src="../../assets/image/account/livemacdown.png"
                @click="downLiveMacTools"
              />
              <img
                style="margin-left: 8px"
                src="../../assets/image/account/livewindowsdown.png"
                @click="downLiveWindowTools"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getItem } from '@/utils/localStorage'
import AppQrcode from '@/components/AppQrcode'
import { getRoutesPermsList } from '@/utils/index'

export default {
  name: 'HeaderDownload',
  components: {
    AppQrcode
  },
  props: {},
  data() {
    return {
      showTask: false,
      visible: false,
      androidUrl: process.env.VUE_APP_ANDROID_DOWNLOAD_URL,
      iosUrl: process.env.VUE_APP_IOS_DOWNLOAD_URL,
      windowDownloadUrl: process.env.VUE_APP_WINDOWS_DOWNLOAD_URL
    }
  },
  computed: {
    permsList() {
      // 获取直播按钮权限
      const info = getRoutesPermsList('liveRoom')?.find(
        v => v.name === 'LiveDetail'
      )
      return info?.meta?.permsList || []
    }
  },
  watch: {},
  mounted() {
    const data = getItem('orgInfo')
    if (data.organizationId === 1000) {
      this.showTask = true
    }
  },
  methods: {
    click() {
      if (this.visible) {
        this.visible = false
      } else {
        this.visible = true
      }
    },
    downloadDoc() {
      this.$uweb &&
        this.$uweb.setAction('Event_videoPublish_other_iosDownLoadNumber')
      const str = 'https://oss.hokkj.cn/yijianfabu/fuxiyun2.0.dmg?t=' + new Date().getTime()
      window.open(str)
    },
    downloadAndriod() {
      this.$uweb &&
        this.$uweb.setAction('Event_videoPublish_other_windowDownLoadNumber')
      const str = 'https://oss.hokkj.cn/yijianfabu/fuxiyun2.0.exe?t=' + new Date().getTime()
      window.open(str)
    },
    downLiveWindowTools() {
      const str =
        'https://oss.hokkj.cn/common/hokFxyLive_release_setup(x64).exe?t=' +
        new Date().getTime()
      window.open(str)
    },
    downLiveMacTools() {
      const str =
        'https://oss.hokkj.cn/common/HokFxyLive-macOS.dmg?t=' +
        new Date().getTime()
      window.open(str)
    },
    onNoClick() {
      return
    }
  }
}
</script>

<style lang="scss" scoped>
.task-box {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  -moz-user-select: none; /*火狐*/
  -webkit-user-select: none; /*webkit浏览器*/
  -ms-user-select: none; /*IE10*/
  -khtml-user-select: none; /*早期浏览器*/
  user-select: none;
  .header-task {
    font-size: 0 !important;
    .task-icon {
      font-size: 20px;
      vertical-align: middle;
    }
    .download-img {
      width: 22px;
      height: 22px;
      background-image: url(../../assets/image/account/icn_download.png);
      background-size: 100%;
      float: left;
      margin-top: 0px;
    }
  }
  .header-title {
    margin-left: 8px;
    font-family: ArialMT, ArialMT;
    font-weight: 400;
    font-size: 14px;
    color: #333333;
    text-align: left;
    font-style: normal;
    text-transform: none;
  }
}

.message-wrapper {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  z-index: 2001;
  cursor: default;
}
.message-box {
  position: relative;
  .message-main {
    position: absolute;
    top: 58px;
    right: 115px;
    z-index: 2001;
    width: 368px;
    // height: 444px;
    background: #ffffff;
    box-shadow: 0px 4px 12px 0px rgba(22, 22, 22, 0.25);
    border-radius: 12px;
    padding: 22px 20px;
    &:after {
      position: absolute;
      content: ' ';
      top: -16px;
      right: 35px;
      display: block;
      width: 0;
      height: 0;
      border: 8px solid #ffffff;
      border-color: transparent transparent #ffffff;
    }
    .ewm-block {
      width: 100%;
      height: 234px;
      border-radius: 8px;
      background: #f3f8ff;
      .title-span {
        width: 100%;
        height: 36px;
        line-height: 36px;
        display: inline-block;
        text-align: center;
        margin-top: 16px;
        img {
          width: 32px;
          height: 32px;
          display: inline-block;
          margin-right: 10px;
        }
        em {
          color: #0c6fff;
          font-size: 16px;
          display: inline-block;
          font-style: normal;
        }
      }
      .line-block {
        float: left;
        width: 1px;
        height: 120px;
        margin-top: 10px;
        background: #d0d8e6;
      }
      .ewm-block-img {
        width: 120px;
        height: 150px;
        float: left;
        margin-top: 10px;
        margin-left: 20px;
        margin-right: 20px;
        img {
          width: 120px;
          height: 120px;
        }
        p {
          width: 100%;
          height: 35px;
          line-height: 35px;
          text-align: center;
          color: #333;
          font-size: 14px;
        }
      }
    }
    .download-block {
      margin-top: 20px;
      width: 100%;
      height: 144px;
      border-radius: 8px;
      background: #f3f8ff;
      .title-span {
        width: 100%;
        height: 36px;
        line-height: 36px;
        display: inline-block;
        text-align: center;
        margin-top: 16px;
        img {
          width: 32px;
          height: 32px;
          display: inline-block;
          margin-right: 10px;
        }
        em {
          color: #0c6fff;
          font-size: 16px;
          display: inline-block;
          font-style: normal;
        }
      }
      .icn_down_img {
        margin-top: 8px;
        width: 100%;
        img {
          float: left;
          width: 136px;
          height: 60px;
          margin-left: 16px;
          margin-right: 16px;
        }
      }
    }
  }
  /* .short-message {
    height: 200px;
  } */
}
</style>
