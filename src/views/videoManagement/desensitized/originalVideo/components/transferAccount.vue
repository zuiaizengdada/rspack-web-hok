<!-- 转号变更运营移交老师 -->
<template>
  <div v-if="transferFlag" class="stopOrResume">
    <el-dialog
      :height="'400px'"
      :width="'568px'"
      :visible.sync="transferFlag"
      @close="handleClose()"
    >
      <div slot="title" class="dialogTitle">
        <img :src="icon_zhuyi" alt="" />
        <div class="titleContent">转交视频组</div>
      </div>
      <div class="step_box">
        <div :class="active === 1? 'step_fri step_active':'step_fri'">
          <span class="step_fri_nums">1</span>
          <span>视频组信息确认</span>
        </div>
        <div :class="active === 1? 'stepLine':'stepLine stepLineActive'" />
        <div :class="active === 1? 'step_sec':'step_sec step_active'">
          <span class="step_fri_nums">2</span>
          <span>转交人员确认</span>
        </div>
      </div>
      <div class="content">
        <!-- 账号信息 -->
        <div v-if="active===1" class="accountInfo">
          <div class="accountInfo_tit">视频组信息</div>
          <div class="accountInfo_con">
            <span><span class="title1">视频组标题：</span>{{ accountInfo.title }}</span>
            <span><span class="title1">创建时间：</span>{{ DateFormat(new Date(accountInfo.createTime),'yyyy-MM-dd hh:mm:ss') }}</span>
          </div>
          <div class="accountInfo_con">
            <span><span class="title1">IP：</span>{{ accountInfo.teacherName || '--' }}</span>
            <span><span class="title1">视频数：</span>{{ accountInfo.total }}</span>
          </div>
          <div class="accountInfo_con">
            <span><span class="title1">当前创建者：</span>{{ accountInfo.createUserName }}</span>
            <span><span class="title1">交付场景：</span>{{ accountInfo.sceneName }}</span>
          </div>
        </div>
        <div v-if="active == 2">
          <el-form ref="form" :model="form" :rules="rules" label-width="120px">
            <el-form-item label="当前创建者">
              <div>
                {{ accountInfo.createUserName }}
              </div>
            </el-form-item>
            <el-form-item label="转交人员" prop="userId">
              <el-select v-model="form.userId" filterable placeholder="请选择" clearable>
                <el-option
                  v-for="item in userArray"
                  :key="item.userId"
                  :label="item.nickName"
                  :value="item.userId"
                >
                  <span style="float: left">{{ item.nickName }}</span>
                  <span v-if="item.status === 1" style="float: right; color: #f53f3f; font-size: 13px">已离职</span>
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="转交原因" prop="reason">
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
        </div>
      </div>
      <div slot="footer" class="dialogFooter">
        <el-button
          v-if="active === 1"
          size="small"
          :loading="loading"
          type="primary"
          @click="next()"
        >下一步</el-button>
        <el-button
          v-if="active === 2"
          size="small"
          :loading="loading"
          @click="last()"
        >上一步</el-button>
        <el-button
          v-if="active === 2"
          size="small"
          :loading="loading"
          type="primary"
          @click="submitForm()"
        >确定转交 </el-button>
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
import { userNoPage } from '@/api/addressBookApi'
import { DateFormat } from '@/utils/index'
import { transferVIdeoGroup } from '@/api/videoManagement/origin'
export default {
  name: 'TransferAccount',
  props: {
    accountInfo: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      transferFlag: false,
      loading: false,
      icon_zhuyi,
      active: 1,
      teacherList: [],
      userArray: [],
      form: {
        reason: '',
        userId: ''
      },
      rules: {
        reason: [
          { required: true, message: '请输入原因', trigger: 'blur' }
        ],
        userId: [
          { required: true, message: '请选择转交人员', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    DateFormat,
    show() {
      console.log(this.accountInfo, 'accountInfo')
      this.transferFlag = true
      this.loadUserNoPage()
    },
    async loadUserNoPage() {
      const res = await userNoPage({
        deptId: '',
        nickName: ''
      })
      // 过滤status === 1数据
      this.userArray = res.data.filter(item => item.status !== 1)
      console.log(this.userArray, 'userArray')
    },
    handleClose(done) {
      if (this.active === 2) {
        this.$refs.form.resetFields()
      }
      this.active = 1
      this.transferFlag = false
    },
    next() {
      this.active = 2
    },
    last() {
      this.active = 1
    },
    submitForm() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          const res = await transferVIdeoGroup({
            userId: this.form.userId,
            reason: this.form.reason,
            videoGroupId: this.accountInfo.videoGroupId
          })
          if (res.code === 1) {
            this.$message({
              message: '操作成功',
              type: 'success'
            })
            this.$refs.form.resetFields()
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
    .step_fri,.step_sec{
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
        width: 100%;
        height: 1px;
        background: #777777;
        position: relative;
        width: 100px;
        margin: 0 20px;
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

