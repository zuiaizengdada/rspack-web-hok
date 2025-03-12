<template>
  <el-dialog title="投放账号管理" :visible.sync="managerDialogFlag" class="manager-dialog-cls" center>
    <el-form ref="ruleForm" :model="form" :rules="rules">
      <el-form-item label="账号类型" :label-width="formLabelWidth" prop="accountType">
        <el-select
          v-model="form.accountType"
          placeholder="请选择账号类型"
          class="select-input-cls"
        >
          <el-option label="运营团队" :value="0"> 运营团队</el-option>
          <el-option label="直播团队" :value="1"> 直播团队</el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="投放类型" :label-width="formLabelWidth" prop="advertiserType">
        <el-select
          v-model="form.advertiserType"
          placeholder="请选择投放类型"
          class="select-input-cls"
        >
          <el-option label="自投" :value="0">自投</el-option>
          <el-option label="代投" :value="1">代投</el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
      <el-button @click="managerDialogFlag = false">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {
  updateExtra
} from '@/api/advertisingKanBan'
export default {
  props: {

  },
  data() {
    return {
      managerDialogFlag: false,
      formLabelWidth: '120px',
      form: {},
      rowObject: {},
      rules: {
        accountType: [{ required: true, message: '请选择账号类型', trigger: 'change' }],
        advertiserType: [{ required: true, message: '请选择投放类型', trigger: 'change' }]
      }
    }
  },
  watch: {

  },
  mounted() {
  },
  methods: {
    loadData(search) {
      this.rowObject = search
      console.log('ooooooo:', this.rowObject)
      this.$set(this.form, 'accountType', this.rowObject.accountType)
      this.$set(this.form, 'advertiserType', this.rowObject.advertiserType)
      console.log('this.this.form:PPPPPPPPPPPPPPPPPPPPPP', this.form)
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const params = {
            accountType: this.form.accountType,
            deliveryType: this.form.advertiserType,
            id: this.rowObject.id
          }
          updateExtra(params).then(res => {
            if (res.code === 1) {
              this.$message.success('提交成功！')
              this.managerDialogFlag = false
              this.$emit('success')
            }
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.manager-dialog-cls {
    ::v-deep .el-dialog__header {
        border-bottom: 1px solid #ececec;
    }
    ::v-deep .el-dialog__title {
        width: 100%;
        text-align: center;
        display: inline-block;
    }
    .select-input-cls {
        width: 300px;
    }
}

</style>

