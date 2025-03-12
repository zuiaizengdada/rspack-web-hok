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
        <div class="titleContent">{{ type===1?'账号停更':'账号恢复更新 ' }}</div>
      </div>
      <div class="content">
        <!-- 账号信息 -->
        <div class="accountInfo">
          <div class="accountInfo_tit">账号基本信息</div>
          <div class="accountInfo_con">
            <span><span class="title1">账号：</span>{{ accountInfo.name }}</span>
            <span><span class="title1">平台：</span>{{ accountInfo.platformName }}</span>
          </div>
          <div class="accountInfo_con">
            <span><span class="title1">IP：</span>{{ accountInfo.teacherName|| '--' }}</span>
            <span><span class="title1">粉丝数：</span>{{ filtersMoneyByW(accountInfo.fans) }}</span>
          </div>
          <div class="accountInfo_con">
            <span><span class="title1">运营者：</span>{{ accountInfo.operatorName }}</span>
            <span><span class="title1">所属部门：</span>{{ accountInfo.deptName }}</span>
          </div>
        </div>

        <el-form ref="form" :model="form" :rules="rules" :label-width="type ===1 ?'100px':'120px'">
          <el-form-item v-if="type !== 1" label="上次停更日期">
            <div class="lastTime">{{ accountInfo.updateTime }}</div>
          </el-form-item>
          <el-form-item :label="type ===1 ?'停更原因':'恢复更新原因'" prop="reason">
            <el-input
              v-model="form.reason"
              type="textarea"
              maxlength="200"
              show-word-limit
              :rows="3"
              placeholder="请填写具体原因"
            />
          </el-form-item>
        </el-form>
        <div v-if="type===1" class="stopTips">
          账号申请停更后，运营人员将不再对此账号继续进行作品更新，将对账号的运营产生不可逆转后果，确认是否继续？
        </div>
      </div>
      <div slot="footer" class="dialogFooter">
        <el-button
          size="small"
          :loading="loading"
          :type="type===1?'danger':'primary'"
          @click="submitForm()"
        >{{ type ===1?'停更申请':'恢复更新' }}</el-button>
        <el-button
          size="small"
          :loading="loading"
          @click="handleClose()"
        >取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import icon_zhuyi from '@/assets/svg/videoManga/icon_zhuyi.svg'
import { filtersMoneyByW } from '@/filters/index'
import { resumeAccount, examineAccount } from '@/api/videoManagement/accountManage'
export default {
  name: 'StopOrResume',
  props: {
    accountInfo: {
      type: Object,
      default: () => {}
    },
    type: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      stopOrResumeFlag: false,
      loading: false,
      icon_zhuyi,
      form: {
        reason: ''
      },
      rules: {
        reason: [
          { required: true, message: '请输入停更原因', trigger: 'blur' }
        ]
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7
        }
      }
    }
  },
  methods: {
    filtersMoneyByW,
    show() {
      this.stopOrResumeFlag = true
      console.log('触发弹窗出来')
    },
    handleClose(done) {
      this.$refs.form.resetFields()
      this.stopOrResumeFlag = false
      this.$emit('close')
    },
    submitForm() {
      console.log(this.accountInfo, '用户信息')
      this.$refs.form.validate(async valid => {
        if (valid) {
          const params = {
            platformAccountId: this.accountInfo.platformAccountId,
            reason: this.form.reason
          }
          let res = null
          if (this.type === 1) {
            params.operatorId = this.accountInfo.operatorId
            params.platformId = this.accountInfo.platformId
            params.teacherIds = this.accountInfo.teacherIds
            params.type = 1
            res = await examineAccount(params)
          } else {
            res = await resumeAccount(params)
          }
          if (res.code === 1) {
            this.$message({
              type: 'success',
              message: this.type === 1 ? '已提交申请' : '恢复更新成功'
            })
            this.handleClose()
            this.$emit('refresh')
          }
        } else {
          return false
        }
      })
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
