<!-- 账号注销 -->
<template>
  <div v-if="logOffFlag" class="stopOrResume">
    <el-dialog
      :height="'400px'"
      :width="'568px'"
      :visible.sync="logOffFlag"
      @close="handleClose()"
    >
      <div slot="title" class="dialogTitle">
        <img :src="icon_zhuyi" alt="" />
        <div class="titleContent">账号注销操作</div>
      </div>
      <div class="step_box">
        <div :class="active === 1? 'step_fri step_active':'step_fri'">
          <span class="step_fri_nums">1</span>
          <span>账号信息确认</span>
        </div>
        <div :class="active === 2? 'stepLine stepLineActive':'stepLine'" />
        <div :class="active === 2? 'step_sec step_active':'step_sec'">
          <span class="step_fri_nums">2</span>
          <span>账号已注销确认</span>
        </div>
        <div :class="active === 3? 'stepLine stepLineActive':'stepLine'" />
        <div :class="active === 3? 'step_thi step_active':'step_thi'">
          <span class="step_fri_nums">3</span>
          <span>确认注销</span>
        </div>
      </div>
      <div class="content">
        <!-- 账号信息 -->
        <div v-if="active===1" class="accountInfo">
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
        <div v-if="active === 2">
          <el-checkbox v-model="checked">账号已在第三方平台完成注销</el-checkbox>
          <div class="stopTips">
            在确认注销前，请先确保账号已在对应平台完成注销操作
          </div>
        </div>
        <div v-if="active === 3">
          <el-form ref="form" :model="form" :rules="rules" label-width="120px">
            <el-form-item label="账号注销原因" prop="reason">
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
          <div class="stopTips">
            账号注销后，系统将停止该账号的一切操作，包括账号维护、数据统计等所有相关操作，请谨慎操作。
          </div>
        </div>
      </div>
      <div slot="footer" class="dialogFooter">

        <el-button
          v-if="active !== 1"
          size="small"
          :loading="loading"
          @click="last()"
        >上一步</el-button>
        <el-button
          v-if="active !== 3"
          :disabled="active === 2 && !checked"
          size="small"
          :loading="loading"
          type="primary"
          @click="next()"
        >下一步</el-button>
        <el-button
          v-if="active === 3"
          size="small"
          :loading="loading"
          :type="'danger'"
          @click="submitForm()"
        >注销申请</el-button>
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
// import { logoffAccount } from '@/api/videoManagement/accountManage'
import { examineAccount } from '@/api/videoManagement/accountManage'
export default {
  name: 'TransferAccount',
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
      logOffFlag: false,
      loading: false,
      checked: false,
      icon_zhuyi,
      active: 1,
      teacherList: [],
      userArray: [],
      form: {
        reason: ''
      },
      rules: {
        reason: [
          { required: true, message: '请输入原因', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    filtersMoneyByW,
    show() {
      this.logOffFlag = true
    },
    handleClose(done) {
      if (this.active === 3) {
        this.$refs.form.resetFields()
      }
      this.active = 1
      this.logOffFlag = false
    },
    next() {
      this.active++
    },
    last() {
      this.active--
    },
    submitForm() {
    //   debugger
      this.$refs.form.validate(async valid => {
        if (valid) {
          const res = await examineAccount({
            reason: this.form.reason,
            platformAccountId: this.accountInfo.platformAccountId,
            operatorId: this.accountInfo.operatorId,
            platformId: this.accountInfo.platformId,
            teacherIds: this.accountInfo.teacherIds,
            type: 5
          })
          if (res.code === 1) {
            this.$message({
              message: '操作成功',
              type: 'success'
            })
            this.checked = false
            this.$emit('refresh')
            this.handleClose()
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
  .step_box{
      padding:20px 20px 0 20px;
      display: flex;
      align-items: center;
      .step_fri,.step_sec,.step_thi{
          display: flex;
          align-items: center;
          font-size: 16px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #777777;
      }
      .step_active{
          color:#0C6FFF;
          .step_fri_nums{
              color:#0C6FFF;
              border: 1px solid #0C6FFF;
          }
      }
      .step_fri_nums{
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #fff;
          border: 1px solid #777777;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 14px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 500;
          color: #777777;
          margin-right: 10px;
      }
      .stepLine{
          height: 1px;
          background: #777777;
          position: relative;
          width: 40px;
          margin: 0 10px;
      }

      .stepLineActive{
          background: #0C6FFF;
      }

  }
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

