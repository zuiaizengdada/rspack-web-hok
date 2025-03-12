<template>
  <!-- 海报弹框 -->
  <el-dialog custom-class="dialog-body" :visible.sync="config.visible" width="375px" append-to-body :show-close="false">
    <span slot="title" />
    <div id="posterDialog" class="dialog-body-content">
      <div class="bg1" />
      <div class="bg2">
        <div class="liveRoom">{{ liveRoomName }}</div>
        <div class="liveTime">直播时间：{{ moment(starTime).format('YYYY-MM-DD HH:mm:ss') }}</div>
        <div class="liveInvite">邀请人：{{ nickName }}</div>
        <div class="qrcodeUrl"><AppQrcode :src="src" /></div>
      </div>
      <div class="bg3" />
    </div>
    <div class="ss-material-box-bottom">
      <el-button size="small" @click="config.visible = false">取消</el-button>
      <el-button size="small" type="primary" @click="downPoster">保存海报</el-button>
    </div>
  </el-dialog>
</template>

<script>
import AppQrcode from '@/components/AppQrcode'
// var htmlToImage = require('html-to-image')
import domtoimage from 'dom-to-image'
import FileSaver from 'file-saver'
import moment from 'moment'
export default {
  components: {
    AppQrcode
  },
  props: {
    config: {
      type: Object,
      default: () => {
        return {
          visible: false
        }
      }
    },
    src: {
      type: String,
      default: ''
    },
    nickName: {
      type: String,
      default: ''
    },
    starTime: {
      type: String,
      default: ''
    },
    liveRoomName: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      loading: false
    }
  },
  mounted() {},
  methods: {
    moment,
    downPoster() {
      const _this = this
      const node = document.getElementById('posterDialog')
      domtoimage.toPng(node)
        .then(async function (blob) {
          if (window.saveAs) {
            window.saveAs(blob, `${_this.liveRoomName}.png`)
          } else {
            FileSaver.saveAs(blob, `${_this.liveRoomName}.png`)
          }
        })
    }
  }
}
</script>

<style lang='scss' scoped>
.posterDialog {
  background: #fff url(../../../../../../../assets/image/xkbg.png) center 70px no-repeat;
  display: flex;
  height: 400px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
  .qrcodeUrl {
    width: 200px;
    height: 200px;
    background: pink;
  }
  .liveName {
    font-size: 16px;
    color: #333;
    margin-top: 10px;
    margin-bottom: 10px;
  }
  .liveTime {
    font-size: 14px;
    color: #999;
  }
}
.ss-material-box-bottom {
  display: flex;
  padding-right: 20px;
  padding-left: 20px;
  justify-content: flex-end;
  align-items: center;
  margin-top: auto;
  width: 100%;
  height: 66px;
  // background-color: #fafbfc;
  border-radius: 2px 2px 0 0;
}
::v-deep {
  .dialog-body {
    position: relative;
    width: 900px;
    flex: none;
    display: flex;
    flex-direction: column;
    vertical-align: middle;
    text-align: initial;
    background: #fff;
    border-radius: 2px;
    overflow: hidden;
    border-radius: 10px;
      .el-dialog__header {
        padding: 0;
        padding-bottom: 0;
      }
      .el-dialog__body {
        padding: 0;
      }
    .ss-material-box-header {
      display: flex;
      align-items: center;
      box-sizing: border-box;
      height: 52px;
      padding: 15px 20px;
      // background: #fafbfc;
      background: #FFFFFF;
      border-radius: 2px 2px 0 0;
      border-bottom: 1px solid #f2f2f2;
      color: #353535;
      font-size: 16px;
      // font-weight: 500;
      font-weight: bold;
      .ss-material-box-header-title {
        // max-width: 300px;
        text-overflow: -o-ellipsis-lastline;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        line-clamp: 1;
        -webkit-box-orient: vertical;
      }
    }
    .close {
      color: #b2b2b2;
      margin-left: auto;
      cursor: pointer;
      &:hover {
        color: #409eff;
      }
    }
    .ss-material-box-bottom {
      display: flex;
      padding-right: 20px;
      padding-left: 20px;
      justify-content: flex-end;
      align-items: center;
      margin-top: auto;
      width: 100%;
      height: 66px;
      // background-color: #fafbfc;
      border-radius: 2px 2px 0 0;
    }
  }
}
.dialog-body-content {
  width: 375px;
  display: flex;
  align-items: center;
  flex-direction: column;
  .bg1 {
    width: 375px;
    background: url(../../../../../../../assets/image/poster.png) no-repeat;
    background-size: 375px auto;
    height: 225px;
    background-position: 100% 0;
  }
  .bg2 {
    display: flex;
    align-items: center;
    flex-direction: column;
    width: 375px;
    background: url(../../../../../../../assets/image/poster.png) no-repeat;
    background-size: 375px 300%;
    background-position-x: 0px;
    background-position-y: 50%;
    .liveRoom {
      max-width: 218px;
      font-size: 20px;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: #494D69;
      line-height: 28px;
      text-align: center;
    }
    .liveTime {
      margin-top: 7px;
      margin-bottom: 12px;
      font-size: 16px;
      font-family: AppleSystemUIFont;
      color: #494D69;
      line-height: 18px;
      text-align: center;
    }
    .liveInvite {
      max-width: 218px;
      margin-bottom: 24px;
      font-size: 14px;
      font-family: AppleSystemUIFont;
      color: #494D69;
      line-height: 17px;
      text-align: center;
    }
    .qrcodeUrl {
      width: 160px;
      height: 160px;
      border: 10px solid #F2DFC7;
    }
  }
  .bg3 {
    width: 375px;
    height: 99px;
    background: url(../../../../../../../assets/image/poster.png) no-repeat;
    background-size: 375px auto;
    background-position: 0% 100%;
  }
}
</style>
