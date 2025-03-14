<template>
  <div v-if="!signStatus">112</div>
</template>

<script>
export default {
  data() {
    return {
      signStatus: false
    }
  }
}
// import pdf from 'vue-pdf'

// // 配置 PDF worker
// const pdfjsWorker = require('pdfjs-dist/es5/build/pdf.worker.entry')

// // 设置 worker 路径
// window.pdfjsLib = window.pdfjsLib || {}
// window.pdfjsLib.GlobalWorkerOptions = window.pdfjsLib.GlobalWorkerOptions || {}
// window.pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker

// export default {
//   components: {
//     pdf
//   },
//   data() {
//     return {

//       signFlag: false,
//       numPages: null, // pdf 总页数
//       isReadOver: false,
//       helpUrl: '',
//       testUrl:
//         'https://dev.oss.hokkj.cn/hok_product/protocol/39bb8f1e-cdc5-40c1-8052-fa5fef83d3ec/6b33cebec6bd410d92fafea27729dc01.pdf',
//       pageInfo: {
//         protocolName: '',
//         protocolUrl: '',
//         protocolTemplateId: ''
//       },
//       phoneNumber: '',
//       successUrl: '',
//       isShow: true, // 全局遮罩
//       icon_zhuyiPng,
//       showResendSign: false,
//       resendSignform: {
//         phone: '',
//         protocolTemplateId: ''
//       }, //更换手机号
//       resendSignformRules: {
//         phone: [
//           { required: true, message: '请输入手机号', trigger: 'blur' },
//           {
//             pattern: /^[0-9]{11}$/,
//             message: '请输入正确的手机号',
//             trigger: 'blur'
//           }
//         ]
//       },
//       resendSignformLoding: false
//     }
//   },
//   computed: {
//     ...mapGetters(['signStatus', 'userInfo', 'protocolInfo'])
//   },
//   watch: {
//     signStatus(val) {
//       if (!val) {
//         this.getProtocolTemplate()
//       }
//     }
//   },
//   mounted() {
//     console.log(this.signStatus, '是否签订过协议')
//     if (!this.signStatus) {
//       this.getProtocolTemplate()
//     }
//   },
//   methods: {
//     async getProtocolTemplate() {
//       this.pageInfo = this.protocolInfo
//       const res = await getProtocolTemplate({ type: 2 })
//       this.helpUrl = res.data.protocolUrl
//       console.log(res.data, '协议模板')
//       this.getNumPages(this.pageInfo.protocolUrl)
//       // 手机号屏蔽中间四位
//       this.phoneNumber = this.userInfo.phoneNumber.replace(
//         /(d{3})d{4}(d{4})/,
//         '$1****$2'
//       )
//     },
//     handleCloseSign() {
//       this.$store.dispatch('user/closeSign')
//     },
//     getNumPages(url) {
//       let loadingTask = pdf.createLoadingTask({
//         url: url,
//         CMapReaderFactory
//       })
//       loadingTask.promise
//         .then(pdf => {
//           this.numPages = pdf.numPages
//         })
//         .catch(err => {
//           console.error('pdf 加载失败', err)
//         })
//       this.$forceUpdate()
//     },
//     async submitForm() {
//       const res = await getProtocolUrl({
//         protocolTemplateId: this.pageInfo.protocolTemplateId
//       })
//       console.log(res, '回调')
//       if (res.data !== null) {
//         this.signFlag = false
//         this.successUrl = res.data
//         this.getNumPages(this.successUrl)
//       } else {
//         this.$message({
//           message: '还未签署完成，请继续完成签署操作。',
//           type: 'error'
//         })
//       }
//     },
//     openManual() {
//       window.open(this.helpUrl)
//     },
//     handleClose() {
//       this.signFlag = false
//     },
//     scrollEvent(event) {
//       let scrollBottom =
//         event.target.scrollHeight -
//         event.target.scrollTop -
//         event.target.clientHeight
//       if (scrollBottom < 5) {
//         this.isReadOver = true
//       }
//     },
//     downloadPdf() {
//       fileDownload(this.successUrl, `${this.pageInfo.protocolName}.pdf`)
//     },
//     async sign() {
//       this.signFlag = true
//       await signProtocol({
//         protocolTemplateId: this.pageInfo.protocolTemplateId
//       })
//     },
//     handleShowResendSign() {
//       this.showResendSign = true
//       this.resendSignformLoding = false
//       this.$nextTick(() => {
//         this.resendSignformClear()
//       })
//     },
//     // 限制只能输入数字
//     delNumber(e) {
//       this.resendSignform.phone = e.replace(/[^0-9]/g, '')
//     },
//     //重新发送
//     submitResendSignForm() {
//       this.$refs.resendSignform.validate(valid => {
//         if (valid) {
//           const data = {
//             protocolTemplateId: this.pageInfo.protocolTemplateId,
//             phone: this.resendSignform.phone
//           }
//           this.resendSignformLoding = true
//           resendSignProtocolAjax(data)
//             .then(res => {
//               if (res.code === 1) {
//                 this.showResendSign = false
//                 // 手机号屏蔽中间四位
//                 this.phoneNumber = data.phone?.replace(
//                   /(d{3})d{4}(d{4})/,
//                   '$1****$2'
//                 )
//               }
//             })
//             .finally(() => {
//               this.resendSignformLoding = false
//             })
//         } else {
//           console.log('error submit!!')
//           return false
//         }
//       })
//     },
//     resendSignformClear() {
//       this.resendSignform = {
//         phone: '',
//         protocolTemplateId: ''
//       }
//       this.$refs.resendSignform?.clearValidate()
//     },
//     handleResendSignClose() {
//       this.showResendSign = false
//     }
//   }
// }
</script>

<style lang="scss" scoped>
.overflowOutoStop {
  overscroll-behavior: contain;
}
</style>
