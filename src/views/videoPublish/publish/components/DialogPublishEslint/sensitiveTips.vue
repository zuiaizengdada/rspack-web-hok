<!-- 停更及恢复更新 -->
<template>
  <div v-if="stopOrResumeFlag" class="stopOrResume">
    <el-dialog
      :height="'400px'"
      :width="'568px'"
      :visible.sync="stopOrResumeFlag"
      @close="handleClose()"
    >
      <div slot="title" class="dialogTitle">
        <img :src="icon_zhuyi" alt="" />
        <div class="titleContent">包含以下敏感词</div>
      </div>
      <div class="content">
        <div style="color:#FF0000">
          {{ list.join('  ') }}
        </div>
        <div class="stopTips">
          可能会触及发布平台风控规则，建议修改后发布；如继续发布，以上敏感词将被记录，产生的一切后果自负，请知悉！
        </div>
      </div>
      <div slot="footer" class="dialogFooter">
        <el-button
          size="small"
          :loading="loading"
          type="danger"
          @click="submitForm()"
        >继续发布</el-button>
        <el-button
          size="small"
          :loading="loading"
          @click="handleClose()"
        >去修改</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import icon_zhuyi from '@/assets/svg/videoManga/icon_zhuyi.svg'
export default {
  name: 'StopOrResume',
  props: {
    sensitiveList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      stopOrResumeFlag: false,
      loading: false,
      icon_zhuyi
    }
  },
  computed: {
    list: {
      get() {
        // 取sensitiveList里面的sensitive参数
        return this.sensitiveList.map(item => item.sensitive)
      }
    }
  },
  methods: {
    submitForm() {
      this.stopOrResumeFlag = false
      this.$emit('submitForm')
    },
    openDialog() {
      this.stopOrResumeFlag = true
    },
    handleClose() {
      this.stopOrResumeFlag = false
      this.$emit('handleClose')
    }
  }
}
</script>
  <style lang="scss" scoped>
  ::v-deep .el-dialog {
      border-radius: 10px;
      .el-dialog__body {
          padding: 0;
      }
      .el-dialog__footer {
          padding: 0;
      }
  }
  ::v-deep .el-dialog__header{
      padding: 0;
  }
  // .lastTime{
  // font-size: 16px;
  // font-family: PingFangSC-Regular, PingFang SC;
  // font-weight: 400;
  // color: #333333;
  // }
  .stopTips{
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #333333;
      margin-top: 20px;
  }
  .content {
    padding: 20px;
    .accountInfo{
      padding: 20px;
      box-sizing: border-box;
      background: #E7F0FF;
      margin-bottom: 20px;
      .title1{
          font-size: 14px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #777777;
      }
      .accountInfo_con{
          display: flex;
          align-items: center;
          margin-top: 10px;
          font-size: 14px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #333333;
          >span{
           flex: 1;
          }
      }
      .accountInfo_tit{
          font-size: 14px;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: bold;
          color: #333333;
      }
    }
  }
  .dialogTitle{
      padding: 20px;
      box-sizing: border-box;
      display: flex;
      border-bottom:1px solid #e7e7e7 ;
      .titleContent{
          font-size: 16px;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 500;
          color: #333333;
          line-height: 24px;
          margin-left: 10px;
      }
  }
  .dialogFooter{
      padding: 20px 16px;
      border-top: 1px solid #e7e7e7;
  }
  </style>

