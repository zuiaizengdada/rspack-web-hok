<template>
  <div v-if="!signStatus">
    <!-- 全局遮罩 -->
    <div v-show="isShow" class="mask" />
    <div class="pdf el-message specification">
      <!-- 顶部标题 -->
      <div class="agreement_top">
        <i
          v-if="successUrl !== ''"
          class="el-icon-close"
          @click="handleCloseSign"
        />
        <div class="agreement_tit">{{ pageInfo.protocolName }}</div>
        <div class="agreement_tips">
          为加强公司内容运营及规范管理流程，请仔细阅读并完成签署以便继续使用伏羲云系统，感谢您的理解与支持。
        </div>
      </div>
      <div
        v-if="successUrl === ''"
        class="show overflowOuto overflowOutoStop"
        @scroll="scrollEvent"
      >
        <!-- 使用 iframe 替代 PDF 组件 -->
        <iframe
          v-if="pageInfo.protocolUrl"
          :src="pageInfo.protocolUrl"
          width="100%"
          height="100%"
          frameborder="0"
        ></iframe>
        <div v-else>加载中...</div>
      </div>
      <div
        v-else
        class="show overflowOuto overflowOutoStop"
        @scroll="scrollEvent"
      >
        <!-- 使用 iframe 替代 PDF 组件 -->
        <iframe
          v-if="successUrl"
          :src="successUrl"
          width="100%"
          height="100%"
          frameborder="0"
        ></iframe>
        <div v-else>加载中...</div>
      </div>
      <!-- 签署 -->
      <div v-if="successUrl === ''" class="sign">
        <el-button
          :type="isReadOver ? 'primary' : ''"
          :disabled="!isReadOver"
          size="mini"
          @click="sign"
          >{{ !isReadOver ? '滑动到底部' : '立即签署' }}</el-button
        >
      </div>
      <!-- 下载 -->
      <div v-if="successUrl !== ''" class="download">
        <el-button type="primary" @click="downloadPdf">下载签署文件</el-button>
      </div>
    </div>

    <!-- 对话框部分保持不变 -->
  </div>
</template>

<script>
/* eslint-disable */
// 移除 vue-pdf-embed 导入
import { fileDownload } from '@/utils/index'
import {
  getProtocolTemplate,
  signProtocol,
  getProtocolUrl,
  resendSignProtocolAjax
} from '@/api/system/protocolManage'
import { mapGetters } from 'vuex'
import icon_zhuyiPng from '@/assets/image/oa/icon_zhuyi.png'

export default {
  name: 'vue_pdf_preview',
  // 移除 PDF 组件注册
  data() {
    return {
      signFlag: false,
      numPages: null, // pdf 总页数
      isReadOver: false,
      helpUrl: '',
      testUrl:
        'https://dev.oss.hokkj.cn/hok_product/protocol/39bb8f1e-cdc5-40c1-8052-fa5fef83d3ec/6b33cebec6bd410d92fafea27729dc01.pdf',
      pageInfo: {
        protocolName: '',
        protocolUrl: '',
        protocolTemplateId: ''
      },
      phoneNumber: '',
      successUrl: '',
      isShow: true, // 全局遮罩
      icon_zhuyiPng,
      showResendSign: false,
      resendSignform: {
        phone: '',
        protocolTemplateId: ''
      }, //更换手机号
      resendSignformRules: {
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          {
            pattern: /^[0-9]{11}$/,
            message: '请输入正确的手机号',
            trigger: 'blur'
          }
        ]
      },
      resendSignformLoding: false
    }
  },
  watch: {},
  computed: {
    ...mapGetters(['signStatus', 'userInfo', 'protocolInfo'])
  },
  created() {},
  watch: {
    signStatus(val) {
      if (!val) {
        this.getProtocolTemplate()
      }
    }
  },
  mounted() {
    console.log(this.signStatus, '是否签订过协议')
    if (!this.signStatus) {
      this.getProtocolTemplate()
    }
  },
  methods: {
    async getProtocolTemplate() {
      this.pageInfo = this.protocolInfo
      const res = await getProtocolTemplate({ type: 2 })
      this.helpUrl = res.data.protocolUrl
      console.log(res.data, '协议模板')
      // 手机号屏蔽中间四位
      this.phoneNumber = this.userInfo.phoneNumber.replace(
        /(\d{3})\d{4}(\d{4})/,
        '$1****$2'
      )
    },
    handleCloseSign() {
      this.$store.dispatch('user/closeSign')
    },
    async submitForm() {
      const res = await getProtocolUrl({
        protocolTemplateId: this.pageInfo.protocolTemplateId
      })
      console.log(res, '回调')
      if (res.data !== null) {
        this.signFlag = false
        this.successUrl = res.data
      } else {
        this.$message({
          message: '还未签署完成，请继续完成签署操作。',
          type: 'error'
        })
      }
    },
    openManual() {
      window.open(this.helpUrl)
    },
    handleClose() {
      this.signFlag = false
    },
    scrollEvent(event) {
      let scrollBottom =
        event.target.scrollHeight -
        event.target.scrollTop -
        event.target.clientHeight
      if (scrollBottom < 5) {
        this.isReadOver = true
      }
    },
    downloadPdf() {
      fileDownload(this.successUrl, `${this.pageInfo.protocolName}.pdf`)
    },
    async sign() {
      this.signFlag = true
      await signProtocol({
        protocolTemplateId: this.pageInfo.protocolTemplateId
      })
    },
    handleShowResendSign() {
      this.showResendSign = true
      this.resendSignformLoding = false
      this.$nextTick(() => {
        this.resendSignformClear()
      })
    },
    // 限制只能输入数字
    delNumber(e) {
      this.resendSignform.phone = e.replace(/[^0-9]/g, '')
    },
    //重新发送
    submitResendSignForm() {
      this.$refs.resendSignform.validate(valid => {
        if (valid) {
          const data = {
            protocolTemplateId: this.pageInfo.protocolTemplateId,
            phone: this.resendSignform.phone
          }
          this.resendSignformLoding = true
          resendSignProtocolAjax(data)
            .then(res => {
              if (res.code === 1) {
                this.showResendSign = false
                // 手机号屏蔽中间四位
                this.phoneNumber = data.phone?.replace(
                  /(\d{3})\d{4}(\d{4})/,
                  '$1****$2'
                )
              }
            })
            .finally(() => {
              this.resendSignformLoding = false
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resendSignformClear() {
      this.resendSignform = {
        phone: '',
        protocolTemplateId: ''
      }
      this.$refs.resendSignform?.clearValidate()
    },
    handleResendSignClose() {
      this.showResendSign = false
    }
  }
}
</script>

<style lang="scss" scoped>
// 禁止滚动条穿透
.overflowOutoStop {
  overscroll-behavior: contain;
}
::v-deep .el-dialog {
  border-radius: 10px;
  .el-dialog__body {
    padding: 0;
  }
  .el-dialog__footer {
    padding: 0;
  }
}
::v-deep .el-dialog__header {
  padding: 0;
}

.content {
  padding: 32px 20px 32px 20px;
  .content_phone {
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #333333;
    margin: 20px 0 0 44px;
  }
  .content_manual {
    width: 230px;
    margin-top: 16px;
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #0c6fff;
    cursor: pointer;
    margin-left: 44px;
  }
  .content_resendBtn {
    margin: 20px 0 0 44px;
  }

  .title {
    display: flex;
    align-items: center;
    .titleImg {
      width: 28px;
      height: 28px;
    }
    .titleContent {
      color: #333333;
      font-family: 'Microsoft YaHei';
      font-size: 16px;
      font-style: normal;
      font-weight: 600;
      margin-left: 16px;
    }
  }
}

.dialogFooter {
  display: flex;
  align-items: center;
  padding: 18px 16px;
  // border-top: 1px solid #e7e7e7;
  // box-shadow: 0px -2px 4px 0px rgba(0, 0, 0, 0.05);
  justify-content: space-between;
  .support {
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #999999;
  }
}
.dialogFooter {
  padding: 20px 16px;
  // border-top: 1px solid #e7e7e7;
}
.agreement_top {
  background: url('../../assets/image/agreementTopBg.png') no-repeat;
  background-size: 100% 100%;
  width: 100%;
  height: 108px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  .el-icon-close {
    position: absolute;
    right: 20px;
    top: 20px;
    font-size: 24px;
  }
  .agreement_tit {
    font-size: 18px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #333333;
    margin-top: 24px;
  }
  .agreement_tips {
    margin-top: 16px;
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #333333;
  }
}
.mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 2000;
}
.specification {
  padding: 0 !important;
  border-radius: 6px;
  border: none;
  z-index: 2000;
  width: 1000px;
}
.sign,
.download {
  margin: 40px 0 20px 0;
}
.pdf {
  top: 30px;
  width: 894px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background: #fff;
  .show {
    border-radius: 4px;
    border: 2px solid #eff2f6;
    overflow: auto;
    margin: auto;
    width: 854px;
    height: 524px;
    margin-top: 20px;
  }
  .pdf_footer {
    position: sticky;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 10px 0;
    background-color: rgba(255, 255, 255, 0.5);
    .info {
      display: flex;
      flex-wrap: wrap;
      div {
        width: 30%;
      }
    }
    .operate {
      margin: 10px 0 0;
      display: flex;
      flex-wrap: wrap;
      div {
        // width: 80px;
        text-align: center;
        font-size: 15px;
      }
      .btn {
        cursor: pointer;
        margin: 5px 10px;
        width: 120px;
        border-radius: 10px;
        padding: 5px;
        color: #fff;
        background-color: #3dcbbc;
      }
    }
  }
}
</style>
