<template>
  <!-- 消息模板 -->
  <div class="page-wrap">
    <div class="head-wrap">
      <span>短信设置</span>
    </div>
    <div class="form-wrap">
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="单手机号每天最多发送">
          <el-input v-model="form.sendNum" class="input-width" maxlength="10" type="number" />
          <span> 条</span>
        </el-form-item>
        <el-form-item label="单手机号验证码每天最多发送">
          <el-input v-model="form.sendVerifyNum" class="input-width" maxlength="10" type="number" />
          <span> 条</span>
          <span class="toast-txt">不能大于上述单手机号每天最多发送数</span>
        </el-form-item>
      </el-form>
      <div class="toast-ps">注意:白名单中的手机号不受此限制.</div>
      <div class="btn-wrap"><el-button type="primary" @click="sendSuccess()">提交</el-button></div>
    </div>
  </div>
</template>

<script>
import { msgSetupDetail, msgSetupUpdate } from '@/api/messageManagement/messageSetup'
export default {
  name: 'Messagesetup',
  components: {
  },
  data() {
    return {
      loading: false,
      allColumnsSelected: true,
      allColumnsSelectedIndeterminate: false,
      delStatus: false,
      slotArr: ['headerRight', 'headerLeft', 'action', 'footer'],
      rules: {},
      form: {
        id: '',
        sendNum: '',
        sendVerifyNum: ''
      }
    }
  },
  watch: {
  },
  mounted() {
    // 拖拽后触发的事件
    // this.$dragging.$on('dragged', (res) => {
    //   console.log(res)
    //   localStorage.setItem('msg_tableColumns', JSON.stringify(this.config.tableColumns))
    // })
  },
  created() {
    this.getMsgSetupDetail()
    // const tableColumns = localStorage.getItem('msg_tableColumns')
    // if (tableColumns) {
    //   this.config.tableColumns = JSON.parse(tableColumns)
    // }
  },
  methods: {
    // 获取设置详情
    getMsgSetupDetail() {
      this.loading = true
      const params = {}
      msgSetupDetail(params).then(res => {
        console.log('获取设置详情--->:', res)
        this.loading = false
        this.form.id = res.data.id
        this.form.sendNum = res.data.sendNum
        this.form.sendVerifyNum = res.data.sendVerifyNum
        console.log('this.info', this.info)
      }).catch(() => {
        this.loading = false
      })
    },
    sendSuccess() {
      if (this.form.sendNum > 0 && this.form.sendNum !== '' && this.form.sendVerifyNum > 0 && this.form.sendVerifyNum !== '') {
        if (this.form.sendNum < 200 && this.form.sendNum > this.form.sendVerifyNum) {
          this.msgSetupUpdate(this.form)
        } else {
          this.$message.error('单手机号发送小于200且大于验证码数！')
        }
      } else {
        this.$message.error('输入框不能为空且大于0！')
      }
    },
    // 信息设置
    msgSetupUpdate(params) {
      this.loading = true
      msgSetupUpdate(params).then(res => {
        this.loading = false
        this.$message.success('设置成功')
        this.getMsgSetupDetail()
      }).catch(() => {
        this.loading = false
        this.$message.success('设置失败')
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.page-wrap {
  // height: calc(100vh - 120px);
 background-color: #FFFFFF;
  .head-wrap {
    padding: 20px;
  }
  .form-wrap {
    padding: 20px;
  }
  .btn-wrap {
    padding: 120px 0 0 20px;
  }
  ::v-deep .el-form-item__label {
    width: 210px !important;
  }
  .input-width {
    width: 400px;
  }
  .toast-txt {
    white-space: nowrap;
    color: #909399;
    font-weight: 400;
    margin-left: 10px;
  }
  .toast-ps {
    white-space: nowrap;
    color: #909399;
    font-weight: 400;
    font-size: 14px;
    padding-left: 20px;
  }
}
</style>
