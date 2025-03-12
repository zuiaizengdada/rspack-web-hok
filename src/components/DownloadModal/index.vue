<template>
  <el-dialog
    v-if="addAccountFlag"
    class="add_account_page"
    width="631px"
    :modal="false"
    :show-close="false"
    :visible.sync="addAccountFlag"
    :before-close="handleClose"
    :modal-append-to-body="true"
    :close-on-click-modal="false"
  >
    <div slot="title" class="download-title" @click.stop="noClick">
      <p>【伏羲云自媒体客户端Plus】下载提示</p>
      <i class="el-icon-close" @click="handleClose" />
    </div>
    <div class="download-content" @click.stop="noClick">
      <p class="gray-cls">由于发布需要，当前操作需要<span class="color1">安装并运行</span><span class="color3">伏羲云自媒体客户端Plus版本</span>。</p>
      <p class="gray-cls">点击【下载】，快速完成下载和安装。</p>
      <p>如果已安装，请手动启动伏羲云自媒体客户端Plus版本</p>
      <div class="download-cont-img flex flex-column download-cont-img1">
        <p>伏羲云自媒体客户端Plus</p>
        <div class="flex flex-center">
          <img src="../../assets/image/account/icon_mac_download_new.png" @click="downloadDoc(2)" />
          <img src="../../assets/image/account/icon_windows_download_new.png" @click="downloadAndriod(2)" />
        </div>
      </div>
    </div>
  </el-dialog>
</template>
<script>
import { mapGetters } from 'vuex'

export default {
  name: 'AddAccount',
  components: {
  },
  props: {
  },
  data() {
    return {
      addAccountFlag: false,
      ruleForm: {
        name: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入分组名称', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters([
      'isNewSocketVideoPublish'
    ])
  },
  watch: {
    'isNewSocketVideoPublish': {
      handler: function (val) {
        if (val && this.addAccountFlag) {
          this.addAccountFlag = !val
          this.$message({
            message: '伏羲云连接成功~',
            type: 'success'
          })
        }
      },
      immediate: true
    }
  },
  created() {
  },
  mounted() {
    this.$uweb && this.$uweb.setAction('Event_videoPublish_other_guideDownLoadNumer')
  },
  methods: {
    downloadDoc(type) {
      this.$uweb && this.$uweb.setAction('Event_videoPublish_other_iosDownLoadNumber')
      const str = 'https://oss.hokkj.cn/yijianfabu/fuxiyun2.0.dmg?t=' + new Date().getTime()
      window.open(str)
    },
    downloadAndriod(type) {
      this.$uweb && this.$uweb.setAction('Event_videoPublish_other_windowDownLoadNumber')
      const str = 'https://oss.hokkj.cn/yijianfabu/fuxiyun2.0.exe?t=' + new Date().getTime()
      window.open(str)
    },
    close() {
      this.addAccountFlag = false
    },
    show() {
      this.addAccountFlag = true
    },
    noClick() {
      return
    },
    handleClose() {
      this.addAccountFlag = false
    },
    addAccountCom() {
      this.$refs.addAccountComponent.show()
    }
  }
}
</script>

<style scoped lang='scss'>
.add_account_page {
    background-color: rgba(0,0,0,0.4);
    ::v-deep .el-dialog {
        border-radius: 10px;
    }
    ::v-deep .el-dialog__header {
        padding: 0!important;
        border-bottom: 1px solid #e7e7e7;
    }
    .downloadTips{
      font-size: 16px;
      color: #F53F3F;
      border-radius: 8px;
      border: 1px solid #F53F3F;
      padding: 10px 0;
      box-sizing: border-box;
      margin-bottom: 12px;
    }
    .download-title {
        width: 631px;
        height: 98px;
        background-image: url(../../assets/image/account/icn_download_top.png);
        background-size: 100%;
        position: relative;
        p {
            width: 100%;
            height: 98px;
            text-align: center;
            line-height: 98px;
            font-weight: bold;
            font-family: 'PingFangSC-Medium, PingFang SC';
            font-size: 18px;
            color: #333;
        }
        i {
            position: absolute;
            right: 10px;
            top: 10px;
            cursor: pointer;
        }
    }
    .download-content {
        width: 100%;
        .download-cont-img1{
          border-top: 1px solid #EFEFEF;
        }
        .download-cont-img {
            width: 100%;
            margin-top: 20px;
            margin-bottom: 20px;
            p{
              margin: 20px 0;
              font-size: 18px;
              color: #333333;
              font-weight: bold;
            }
            img {
                width: 190px;
                height: 86px;
                margin-left: 29px;
                display: inline-block;
            }
        }
        p {
            line-height: 22px;
            color: #777;
            font-size: 12px;
            text-align: center;
        }
        .gray-cls {
          color: #777;
          .color1{
            color: #F53F3F;
          }
          .color2{
            color: #1AA0FF;
          }
          .color3{
            color: #FF9F1F;
          }
        }
    }
    .p-title {
        font-size: 16px;
    }
    .plat_array_content {
        width: 100%;
        height: 280px;
        .plat_content {
            float: left;
            margin-right: 54px;
            width: 64px;
            height: 64px;
            cursor: pointer;
            img {
                width: 64px;
                height: 64px;
            }
            p {
                font-size: 16px;
                line-height: 30px;
                height: 30px;
                width: 100%;
                text-align: center;
                color: #333;
                float: left;
                margin-top: 5px;
            }
        }
    }
}
</style>

