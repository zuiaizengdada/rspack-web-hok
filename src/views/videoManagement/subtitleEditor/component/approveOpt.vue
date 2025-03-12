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
        <div class="titleContent">{{ isBatchApply?'批量申请取消锁定提示':titleMap[type] }}</div>
      </div>
      <div class="content">
        <div>{{ type ===1 ?'撤销内容':'审批内容' }}：
          <span v-if="isBatchApply" v-html="filterStr(content)" />
          <span v-else v-html="content.content" />
        </div>
        <div class="m-t-12">{{ type ===1 ?'确认撤销吗？':'确认申请吗？' }}</div>
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
      isBatchApply: false,
      titleMap: {
        0: '申请取消锁定提示',
        1: '撤销申请提示',
        2: '重新申请取消锁定提示',
        3: '重新申请提示',
        4: '申请取消锁定提示'
      },
      form: {
        reason: ''
      }
    }
  },
  methods: {
    filtersMoneyByW,
    // 过滤字符串
    filterStr(data) {
      console.log(data)
      let str = ''
      if (data.length > 0) {
        data.forEach((item, index) => {
          if (index === 0) {
            str += item.content
          } else {
            // 只拼接前三条内容
            if (index >= 3) {
              return false
            }
            str += `、${item.content}`
          }
        })
      }
      // 超过三条拼接等n条内容
      if (data.length > 3) {
        str += `等${data.length}条内容`
      }
      return str
    },
    show(data, type, all) {
      this.content = data
      this.type = type
      this.isBatchApply = all // 是否为批量申请
      this.stopOrResumeFlag = true
    },
    handleClose(done) {
      this.stopOrResumeFlag = false
    },
    submitForm() {
      // 批量审批跟单个审批
      if (this.isBatchApply) {
        this.$emit('batchSubmit')
      } else {
        this.$emit('submit', this.content.id, this.type)
      }
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
