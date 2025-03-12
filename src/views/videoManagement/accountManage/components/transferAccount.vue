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
        <div class="titleContent">{{ transferMap[type] }}</div>
      </div>
      <div class="step_box">
        <div :class="active === 1? 'step_fri step_active':'step_fri'">
          <span class="step_fri_nums">1</span>
          <span>账号信息确认</span>
        </div>
        <div :class="active === 1? 'stepLine':'stepLine stepLineActive'" />
        <div :class="active === 1? 'step_sec':'step_sec step_active'">
          <span class="step_fri_nums">2</span>
          <span>{{ stepsMap[type] }}</span>
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
            <span><span class="title1">IP：</span>{{ accountInfo.teacherName || '--' }}</span>
            <span><span class="title1">粉丝数：</span>{{ filtersMoneyByW(accountInfo.fans) }}</span>
          </div>
          <div class="accountInfo_con">
            <span><span class="title1">运营者：</span>{{ accountInfo.operatorName }}</span>
            <span><span class="title1">所属部门：</span>{{ accountInfo.deptName }}</span>
          </div>
        </div>
        <div v-if="active == 2">
          <el-form ref="form" :model="form" :rules="rules" label-width="120px">
            <el-form-item v-if="type === 3 || type === 5" label="当前IP">
              <div>
                {{ accountInfo.teacherName || '--' }}
              </div>
            </el-form-item>
            <el-form-item v-if="type === 4 || type === 6" label="当前运营者">
              <div>
                {{ accountInfo.operatorName }}
              </div>
            </el-form-item>
            <el-form-item v-if="type === 3" label="变更后IP" prop="teacherIds">
              <filterSelectSingle ref="filterSelectSingle" class="w-365" :placeholder-str="'请选择IP'" :multiple="type === 3" popper-class="eloption-cls" :popper-append-to-body="true" @handleChange="changeHanldeTeacher" />
            </el-form-item>
            <el-form-item v-if="type === 5" label="变更后IP" prop="teacherId">
              <filterSelectSingle ref="filterSelectSingle" class="w-365" :placeholder-str="'请选择IP'" :multiple="type === 3" popper-class="eloption-cls" :popper-append-to-body="true" @handleChange="changeHanldeTeacher" />
              <!-- <el-select v-model="form.teacherId" placeholder="请选择" class="dr-tearch" :multiple="type === 3" filterable popper-class="eloption-cls" :popper-append-to-body="true">
                <el-option
                  v-for="item in teacherList"
                  :key="item.teacherId"
                  :label="item.teacherName"
                  :value="item.teacherId"
                />
              </el-select> -->
            </el-form-item>
            <el-form-item v-if="type === 4 || type === 6" :label="type === 4 ?'变更后运营者':'最新运营人员'" prop="operatorId">
              <el-select v-model="form.operatorId" filterable placeholder="请选择" clearable>
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
            <el-form-item :label="reasonMap[type]" prop="reason">
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
          <div v-if="type===5" class="stopTips">
            账号移交给IP后，账号将完全交由对应IP进行维护。系统将停止该账号的一切操作，包括账号维护、数据统计等所有相关操作，请谨慎操作。
          </div>
          <div v-if="type===6" class="stopTips">
            账号申请恢复后，只要账号未注销，或者用户可以为账号重新进行登录授权，运营人员可继续对该账号进行运营。
          </div>
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
          :type="type!==6?'primary':'danger'"
          @click="submitForm()"
        >{{ stepsMap[type] }} </el-button>
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
import { userNoPage } from '@/api/addressBookApi'
import { recoverAccount, examineAccount } from '@/api/videoManagement/accountManage'
import filterSelectSingle from '@/components/filterSelectSingle/index.vue'

export default {
  name: 'TransferAccount',
  components: { filterSelectSingle },
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
      transferFlag: false,
      loading: false,
      icon_zhuyi,
      active: 1,
      transferMap: {
        3: '转号操作',
        4: '变更运营操作',
        5: '移交IP操作',
        6: '账号恢复'
      },
      stepsMap: {
        3: '转号申请',
        4: '变更运营申请',
        5: '移交IP申请',
        6: '确定恢复'
      },
      reasonMap: {
        3: '转号原因',
        4: '变更运营原因',
        5: '移交IP原因',
        6: '账号恢复原因'
      },
      teacherList: [],
      userArray: [],
      form: {
        reason: '',
        teacherIds: [],
        operatorId: '',
        teacherId: ''
      },
      rules: {
        reason: [
          { required: true, message: '请输入原因', trigger: 'blur' }
        ],
        teacherIds: [
          { required: true, message: '请选择IP', trigger: 'blur' }
        ],
        teacherId: [
          { required: true, message: '请选择IP', trigger: 'change' }
        ],
        operatorId: [
          { required: true, message: '请选择运营者', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    filtersMoneyByW,
    changeHanldeTeacher(val) {
      console.log('触发了改变事件', val)
      if (this.type !== 3) {
        this.form.teacherId = val
      } else {
        this.form.teacherIds = val
      }
    },
    show() {
      this.transferFlag = true
      console.log(this.type, 'type')
      if (this.type === 4 || this.type === 6) {
        this.loadUserNoPage()
      } else {
        // this.getTeacherList()
      }
    },
    // async getTeacherList() {
    //   const res = await teacherQueryByName({
    //     name: ''
    //   })
    //   this.teacherList = res.data
    //   console.log(this.teacherList, 'teacherList')
    // },
    async loadUserNoPage() {
      const res = await userNoPage({
        deptId: '',
        nickName: ''
      })
      // 过滤status === 1数据
      this.userArray = res.data.filter(item => item.status !== 1)
      if (this.type === 6) {
        // 如果是已离职 则清空
        if (this.userArray.find(item => item.userId === this.accountInfo.operatorId).status === 1) {
          this.form.operatorId = ''
        } else {
          this.form.operatorId = this.accountInfo.operatorId
        }
      }
      console.log(this.userArray, 'userArray')
    },
    handleClose(done) {
      if (this.active === 2) {
        this.$refs.form.resetFields()
      }
      this.form.operatorId = ''
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
          let res = null
          // if (this.type === 3) {
          //   res = await transferAccount({
          //     teacherIds: this.form.teacherIds,
          //     reason: this.form.reason,
          //     platformAccountId: this.accountInfo.platformAccountId
          //   })
          // }
          // if (this.type === 4) {
          //   res = await changeOperator({
          //     operatorId: this.form.operatorId,
          //     reason: this.form.reason,
          //     platformAccountId: this.accountInfo.platformAccountId
          //   })
          // }
          // if (this.type === 5) {
          //   res = await transferTeacher({
          //     teacherId: this.form.teacherId,
          //     reason: this.form.reason,
          //     platformAccountId: this.accountInfo.platformAccountId
          //   })
          // }
          if (this.type === 6) {
            res = await recoverAccount({
              operatorId: this.form.operatorId,
              reason: this.form.reason,
              platformAccountId: this.accountInfo.platformAccountId
            })
          } else {
            // 1-停更 2-转号 3-变更运营 4-移交老师 5-注销
            res = await examineAccount({
              operatorId: this.form.operatorId,
              reason: this.form.reason,
              platformAccountId: this.accountInfo.platformAccountId,
              platformId: this.accountInfo.platformId,
              teacherIds: this.type === 5 ? [this.form.teacherId] : this.form.teacherIds,
              type: this.type - 1
            })
          }
          if (res.code === 1) {
            this.$message({
              message: '操作成功',
              type: 'success'
            })
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

