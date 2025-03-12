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
        <pdf
          v-for="i in numPages"
          ref="pdf"
          :key="i"
          :src="pageInfo.protocolUrl"
          :page="i"
        />
      </div>
      <div
        v-else
        class="show overflowOuto overflowOutoStop"
        @scroll="scrollEvent"
      >
        <pdf
          v-for="i in numPages"
          ref="pdf1"
          :key="i"
          :src="successUrl"
          :page="i"
        />
      </div>
      <!-- 簽署 -->
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
    <el-dialog
      :height="'400px'"
      :width="'505px'"
      :top="'25vh'"
      :close-on-click-modal="false"
      :visible.sync="signFlag"
      @close="handleClose()"
    >
      <div class="content">
        <div class="title">
          <img :src="icon_zhuyiPng" class="titleImg" />
          <div class="titleContent">{{ pageInfo.protocolName }}签署提示</div>
        </div>
        <div class="content_phone">
          电子协议已发送至 {{ phoneNumber }} ，请按照指示完成电子协议签名！
        </div>
        <el-button
          size="mini"
          type="primary"
          @click="handleShowResendSign"
          class="content_resendBtn"
          >手机号已停用？点击更换</el-button
        >
        <div class="content_manual" @click="openManual">
          不会操作？点击查看用户操作手册
        </div>
      </div>
      <div class="dialogFooter">
        <div class="support"></div>
        <div>
          <el-button size="mini" type="primary" @click="submitForm()"
            >已完成签名</el-button
          >
          <el-button size="mini" @click="handleClose()">取消</el-button>
        </div>
      </div>
    </el-dialog>
    <el-dialog
      :height="'400px'"
      :width="'505px'"
      :top="'25vh'"
      :close-on-click-modal="false"
      :visible.sync="showResendSign"
      @close="handleResendSignClose()"
    >
      <div class="content">
        <div class="title">
          <img :src="icon_zhuyiPng" class="titleImg" />
          <div class="titleContent">更换手机号</div>
        </div>
        <div class="content_phone">
          本人确认
          {{ phoneNumber }} 手机号无法使用，更换手机号，重新发送电子签协议！
        </div>

        <el-form
          ref="resendSignform"
          :model="resendSignform"
          size="small"
          :rules="resendSignformRules"
          style="margin: 24px 0 0 44px"
        >
          <el-form-item prop="phone">
            <el-input
              v-model.trim="resendSignform.phone"
              style="width: 377px"
              clearable
              maxlength="11"
              @input="delNumber"
              placeholder="请输入手机号"
            />
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialogFooter">
        <div class="support"></div>
        <div>
          <el-button
            size="mini"
            type="primary"
            @click="submitResendSignForm"
            :loading="resendSignformLoding"
            >重新发送</el-button
          >
          <el-button size="mini" @click="handleResendSignClose()"
            >取消</el-button
          >
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
/* eslint-disable */
import vuePdf from 'vue-pdf'
const pdf = { ...vuePdf, destroyed: undefined }
import { fileDownload } from '@/utils/index'
import {
  getProtocolTemplate,
  signProtocol,
  getProtocolUrl,
  resendSignProtocolAjax
} from '@/api/system/protocolManage'
import CMapReaderFactory from 'vue-pdf/src/CMapReaderFactory.js'
import { mapGetters } from 'vuex'
import icon_zhuyiPng from '@/assets/image/oa/icon_zhuyi.png'

export default {
  name: 'vue_pdf_preview',
  components: {
    pdf
  },
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
      this.getNumPages(this.pageInfo.protocolUrl)
      // 手机号屏蔽中间四位
      this.phoneNumber = this.userInfo.phoneNumber.replace(
        /(\d{3})\d{4}(\d{4})/,
        '$1****$2'
      )
    },
    handleCloseSign() {
      this.$store.dispatch('user/closeSign')
    },
    getNumPages(url) {
      let loadingTask = pdf.createLoadingTask({
        url: url,
        CMapReaderFactory
      })
      loadingTask.promise
        .then(pdf => {
          this.numPages = pdf.numPages
        })
        .catch(err => {
          console.error('pdf 加载失败', err)
        })
      this.$forceUpdate()
    },
    async submitForm() {
      const res = await getProtocolUrl({
        protocolTemplateId: this.pageInfo.protocolTemplateId
      })
      console.log(res, '回调')
      if (res.data !== null) {
        this.signFlag = false
        this.successUrl = res.data
        this.getNumPages(this.successUrl)
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
