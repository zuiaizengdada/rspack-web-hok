<template>
  <!-- 新增/编辑收款渠道 -->
  <AppDialog
    v-if="visible"
    v-model="visible"
    :title="title"
    width="460px"
    height="226px"
    :loading="loading"
    @success="send"
  >
    <div class="payChannelDialog overflowOuto">
      <div v-if="type !== 2" class="modal-tips"> 注：请认真确定合同主体名称是否正确，一旦保存不可修改！</div>
      <!-- 新增/编辑收款渠道 -->
      <el-form ref="ruleForm" :model="form" :rules="rules" label-width="130px" size="small">
        <el-form-item label="合同主体名称:" prop="contractSubject">
          <el-input
            v-model="form.contractSubject"
            :disabled="type === 2"
            type="textarea"
            style="width: 280px"
            maxlength="30"
            show-word-limit
          />
        </el-form-item>
        <el-form-item label="统一社会信用码:" prop="unifiedSocialCreditCode">
          <el-input v-model.trim="form.unifiedSocialCreditCode" style="width: 280px" maxlength="20" show-word-limit />
        </el-form-item>
        <el-form-item label="法人代表:" prop="legalPerson">
          <el-input v-model.trim="form.legalPerson" style="width: 280px" maxlength="10" show-word-limit />
        </el-form-item>
        <!-- <el-form-item label="状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio :label="0">启用</el-radio>
            <el-radio :label="1">禁用</el-radio>
          </el-radio-group>
        </el-form-item> -->
      </el-form>
    </div>
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import { companyAdd, companyEdit } from '@/api/system/company'
export default {
  components: {
    AppDialog
  },
  data() {
    return {
      form: {
        contractSubject: '',
        legalPerson: '',
        unifiedSocialCreditCode: '',
        subjectId: ''
      },
      type: 1,
      title: '新增收款渠道',
      visible: false,
      rules: {
        contractSubject: [
          { required: true, message: '请输入合同主体名称', trigger: 'blur' }
        ],
        legalPerson: [
          { required: true, message: '请输入法人代表', trigger: 'blur' }
        ],
        unifiedSocialCreditCode: [
          { required: true, message: '请输入统一社会信用码', trigger: 'blur' }
        ]
        // status: [
        //   { required: true, message: '请选择状态', trigger: 'blur' }
        // ]
      },
      loading: false
    }
  },
  mounted() {},
  methods: {
    open(row, type) {
      this.reset()
      if (type === 2) {
        this.form = {
          contractSubject: row.contractSubject,
          legalPerson: row.legalPerson,
          unifiedSocialCreditCode: row.unifiedSocialCreditCode,
          subjectId: row.subjectId
        }
      }
      this.type = type
      this.title = type === 1 ? '新增合同主体' : '编辑合同主体'
      this.visible = true
    },
    reset() {
      this.form = {
        contractSubject: '',
        legalPerson: '',
        unifiedSocialCreditCode: '',
        subjectId: ''
      }
    },
    successFn() {
      this.$emit('success')
      this.$notify.success({ title: '提示', message: '操作成功' })
      this.visible = false
    },
    send() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          if (this.type === 1) {
            this.add()
          } else {
            this.edit()
          }
        } else {
          return false
        }
      })
    },
    add() {
      this.loading = true
      companyAdd(this.form)
        .then(res => {
          this.loading = false
          this.successFn()
        }).catch(() => {
          this.loading = false
        })
    },
    edit() {
      this.loading = true
      companyEdit(this.form)
        .then(res => {
          this.loading = false
          this.successFn()
        }).catch(() => {
          this.loading = false
        })
    }
  }
}
</script>

<style lang='scss' scoped>
.payChannelDialog {
  height: 518px;
  padding: 16px;
  box-sizing: border-box;
  .modal-tips{
    color: red;
    margin-bottom:15px
  }
  .tips {
    font-size: 12px;
    font-family: MicrosoftYaHei;
    color: #999999;
    line-height: 20px;
  }
}
</style>
