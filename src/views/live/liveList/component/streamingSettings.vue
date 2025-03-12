<template>
  <div class="streamingSettings">
    <div class="streamingSettingsTitle">
      <span class="m-r-10">伏羲云直播客户端</span>
      <div v-permission="['web:liveRoomDetail:personLiveLink', permsList]" style="width: 190px" type="primary" class="downBtn m-r-10" @click="gotoObsDownPage('https://oss.hokkj.cn/common/hokFxyLive_release_setup(x64).exe')">
        <svg-icon icon-class="downIcon" class-name="m-r-10 downIcon" />
        windows客户端下载
      </div>
      <div v-permission="['web:liveRoomDetail:personLiveLink', permsList]" style="width: 190px" type="primary" class="downBtn" @click="gotoObsDownPage('https://oss.hokkj.cn/common/HokFxyLive-macOS.dmg')">
        <svg-icon icon-class="downIcon" class-name="m-r-10 downIcon" />
        MacOS客户端下载
      </div>
    </div>

    <div class="windowLiveTools">
      <el-image :preview-src-list="srcList" :src="srcList[0]" class="windowLiveToolsImg" />
      <el-image :preview-src-list="srcList" :src="srcList[1]" class="windowLiveToolsImg" />
    </div>

    <div v-permission="['web:liveRoomDetail:liveLink', permsList]" type="primary" class="downBtn" @click="openLiveLink">
      直播间链接
    </div>

    <!-- <div class="streamingSettingsTitle">第三方直播工具</div>
    <el-form size="small" label-width="auto">
      <el-form-item label="OBS工具">
        <div class="fl">
          <div type="primary" class="downBtn" @click="gotoObsDownPage('https://obsproject.com/')">
            <svg-icon icon-class="downIcon" class-name="m-r-10 downIcon" />
            下载
          </div>
          <div v-permission="['web:liveRoomDetail:liveLink', permsList]" type="primary" class="downBtn m-l-20" @click="openLiveLink">
            直播间链接
          </div>
        </div>
      </el-form-item>
      <el-form-item v-if="detail && detail.liveModel === 'PERSON_LIVE'" label="服务器">
        <el-input v-model="liveRoomPersonInfo.pushFlowAdder" style="width: 400px;" disabled />
        <el-button v-clipboard:copy="liveRoomPersonInfo.pushFlowAdder" v-clipboard:success="clipboardSuccess" type="text" class="m-l-20">复制</el-button>
      </el-form-item>
      <el-form-item v-if="detail && detail.liveModel === 'PERSON_LIVE'" label="串流密匙">
        <el-input v-model="liveRoomPersonInfo.broadcastStreamSecretKey" style="width: 400px;" disabled />
        <el-button v-clipboard:copy="liveRoomPersonInfo.broadcastStreamSecretKey" v-clipboard:success="clipboardSuccess" type="text" class="m-l-20">复制</el-button>
      </el-form-item>
    </el-form> -->
  </div>
</template>

<script>
const img1 = require('../../../../assets/image/live/liveWindowTips.png')
const img2 = require('../../../../assets/image/live/liveWindowTips2.png')
import clipboard from '@/directive/clipboard/index.js' // use clipboard by v-directive
import Dialog from '@/views/live/Dialog/index.js'
import { getItem } from '@/utils/localStorage'
export default {
  components: {},
  directives: {
    clipboard
  },
  props: {
    liveRoomPersonInfo: {
      type: Object,
      default: () => {
        return {
          broadcastStreamAddr: '', // 播流地址
          broadcastStreamSecretKey: '', // 播流秘钥
          groupId: '', // 直播群Id
          isAllowSendPic: 0, // 是否允许学员发图片
          isShowNotice: 0, // 是否显示系统消息
          isShutUp: 0, // 是否禁言
          playbackSet: 0, // 回放设置：0无回放，1云端录制
          pushFlowAdder: '', // 推流地址
          pushFlowSecretKey: '' // 推流秘钥
        }
      }
    },
    detail: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      srcList: [img1, img2],
      permsList: this.$route.meta.permsList || []
    }
  },
  mounted() {},
  methods: {
    clipboardSuccess() {
      this.$message({
        message: '复制成功！',
        type: 'success',
        duration: 1500
      })
    },
    // 点击打开OBS下载页面
    gotoObsDownPage(url) {
      window.open(url + '?t=' + new Date().getTime())
    },
    // 点击打开查看链接弹框
    openLiveLink() {
      console.log(this.detail, 'detail')
      const orgInfo = getItem('orgInfo')
      console.log(orgInfo, 'orgInfo')
      Dialog.open({
        visible: true,
        liveRoomName: this.detail.name,
        form: {
          link: `${this.detail.domainUrl}pages/liveSub/pages/liveWXAuthH5/index?rId=${this.detail.liveRoomId}&shopId=${orgInfo.organizationId}`
        },
        type: 'LiveLink'
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.streamingSettings {
  .streamingSettingsTitle {
    margin-bottom: 20px;
    font-size: 16px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: bold;
    color: #333333;
    line-height: 22px;
    display: flex;
    align-items: center;
  }
  .downBtn {
    width: 98px;
    height: 32px;
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #FFFFFF;
    line-height: 22px;
    background: #0C6FFF;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    .downIcon {
      width: 20px;
      height: 20px;
      font-size: 20px;
    }
  }
  .windowLiveTools {
    margin-bottom: 20px;
    > .windowLiveToolsImg {
      width: 252px;
      height: 143px;
      margin-right: 17px;
    }
  }
}
::v-deep {
  .el-form-item__label {
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #333333;
    line-height: 22px;
  }
}
</style>
