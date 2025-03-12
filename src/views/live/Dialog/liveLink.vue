<template>
  <AppDialog
    v-model="visible"
    title="特别提示"
    width="540px"
    :loading="loading"
    height="auto"
    :top="top"
  >
    <div class="liveLink">
      <div class="tips">
        <i class="el-icon-warning tipsIcon" />
        <div class="tipsContent">
          <div class="tipsTitle">注意</div>
          <div class="tipsMsg">该链接未带助教老师标识，不可以作为邀课链接使用，如果复制发给学员，老师直播间将无法区分该学员是由哪个老师邀请过来的。</div>
        </div>
      </div>
      <el-form ref="ruleForm" :model="form" size="small" label-width="auto" class="demo-ruleForm m-t-20">
        <el-form-item label="链接地址：" prop="link">
          <el-input v-model="form.link" style="width: 400px" disabled />
        </el-form-item>
        <el-form-item label="二维码：" prop="link">
          <span id="liveLinkCode">
            <AppQrcode v-if="logoUrls[1]" :logo-scale="0.2" :correct-level="3" :src="form.link" :size="200" :margin="10" :logo-src="logoUrls[1]" :logo-margin="5" />
            <AppQrcode v-else :src="form.link" :size="200" :margin="10" />
          </span>
        </el-form-item>
      </el-form>
    </div>
    <div slot="footer" class="ss-material-box-bottom">
      <el-button v-clipboard:copy="form.link" v-clipboard:success="clipboardSuccess" size="small" type="primary" class="m-l-20">复制链接</el-button>
      <el-button size="small" class="btn_primary" @click="onhandleDownCode">下载二维码</el-button>
      <el-button size="small" @click="visible = false">取消</el-button>
    </div>
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import AppQrcode from '@/components/AppQrcode'
import domtoimage from 'dom-to-image'
import FileSaver from 'file-saver'
import { getItem } from '@/utils/localStorage'
import clipboard from '@/directive/clipboard/index.js' // use clipboard by v-directive
export default {
  components: { AppDialog, AppQrcode },
  directives: {
    clipboard
  },
  data() {
    return {
      loading: false,
      visible: true,
      liveRoomName: '',
      logoUrls: {},
      form: {
        link: ''
      },
      top: '114px'
    }
  },
  mounted() {
    this.top = Math.abs(window.innerHeight - 562) / 2 + 'px'
    const data = getItem('logoList')
    this.logoUrls = {}
    data.forEach(i => {
      this.logoUrls[i.scope] = i.url
    })
  },
  methods: {
    clipboardSuccess() {
      this.$message({
        message: '复制成功',
        type: 'success',
        duration: 1500
      })
    },
    onhandleDownCode() {
      const _this = this
      const node = document.getElementById('liveLinkCode')
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
.liveLink {
    padding: 20px;
    .tips {
        width: 100%;
        padding: 10px;
        background: #ffeded;
        border-radius: 8px;
        display: flex;
        .tipsIcon {
            width: 24px;
            color: #FF7D00;
            font-size: 24px;
        }
        .tipsContent {
            flex: 1;
            padding-left: 8px;
            .tipsTitle {
                font-size: 16px;
                font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
                font-weight: bold;
                color: #ff4949;
                line-height: 24px;
            }
            .tipsMsg {
                margin-top: 8px;
                font-size: 14px;
                font-family: MicrosoftYaHei;
                color: #ff4949;
                line-height: 22px;
            }
        }
    }
    #liveLinkCode {
        display: inline-block;
        border: 10px solid #F2DFC7;
    }
}
</style>
