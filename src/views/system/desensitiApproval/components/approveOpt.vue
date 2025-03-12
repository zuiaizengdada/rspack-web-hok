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
        <div class="titleContent">{{ titleMap[type] }}</div>
      </div>
      <div class="content">
        <div>审批内容：
          <span v-for="(item,index) in content" :key="item.id">
            <span v-if="index<5" v-html="item.content" /><span v-if="index<4">{{ index === content.length-1?'':'、' }}</span>
          </span>
          <span v-if="content.length>5">等{{ content.length }}条内容。</span>
        </div>
        <div class="m-t-12">{{ type%2===0?'确认驳回吗？':"确认通过吗？" }}</div>
      </div>
      <div slot="footer" class="dialogFooter">
        <el-button
          size="small"
          :loading="loading"
          @click="handleClose()"
        >取消</el-button>
        <el-button
          size="small"
          :loading="loading"
          :type="type%2===0?'danger':'primary'"
          @click="submitForm()"
        >确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import icon_zhuyi from '@/assets/svg/videoManga/icon_zhuyi.svg'
import { filtersMoneyByW } from '@/filters/index'
export default {
  name: 'StopOrResume',
  data() {
    return {
      stopOrResumeFlag: false,
      loading: false,
      icon_zhuyi,
      type: 1,
      content: [],
      titleMap: {
        1: '确认通过提示',
        2: '确认驳回提示',
        3: '确认批量通过提示',
        4: '确认批量驳回提示'
      },
      form: {
        reason: ''
      }
    }
  },
  methods: {
    filtersMoneyByW,
    show(data, type) {
      console.log(data, 'shuju ')
      this.content = data
      this.type = type
      this.stopOrResumeFlag = true
    },
    handleClose(done) {
      this.stopOrResumeFlag = false
      this.$emit('close')
    },
    submitForm() {
      this.$emit('submit', this.type, this.content)
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
    color: #F53F3F;
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
