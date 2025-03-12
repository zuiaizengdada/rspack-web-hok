<template>
  <AppDialog
    v-model="visible"
    title="转让"
    width="540px"
    :loading="loading"
    height="auto"
    :top="top"
    @success="successFn"
  >
    <div v-loading="loading" class="problemDetail overflowOuto">
      <el-form ref="form" v-loading="loading" :model="form" label-width="auto" size="small" :rules="rules" @submit.native.prevent>
        <el-form-item label="转到公司" prop="transferToOrg">
          <el-select v-model="form.transferToOrg" clearable placeholder="请选择">
            <el-option v-for="(item) in option" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="转让原因" prop="transferReason">
          <el-input
            v-model="form.transferReason"
            type="textarea"
            :rows="4"
            placeholder="请输入"
            maxlength="500"
            show-word-limit
          />
        </el-form-item>
      </el-form>
    </div>
  </AppDialog>
</template>

<script>
import { getSharingSettingOrgByType, teacherTransferToOrg } from '@/api/tearchCenter/index.js'
import AppDialog from '@/components/AppDialog'
export default {
  components: {
    AppDialog
  },
  data() {
    return {
      loading: false,
      visible: false,
      top: '114px',
      option: [],
      questionFeedbackId: '',
      form: {
        teacherId: '',
        transferToOrg: '',
        transferReason: ''
      },
      status: '',
      rules: {
        transferToOrg: [
          { required: true, message: '请选择转出公司', trigger: 'change' }
        ],
        transferReason: [
          { required: true, message: '请输入转让原因', trigger: 'blur' }
        ]
      },
      success: () => {}
    }
  },
  created() {
    this.getData()
  },
  mounted() {
    this.top = Math.abs(window.innerHeight - 318) / 2 + 'px'
  },
  methods: {
    async getData() {
      await getSharingSettingOrgByType({
        organizationId: JSON.parse(localStorage.getItem('orgInfo')).organizationId,
        sharingSettingType: 2
      }).then(res => {
        this.option = res.data.map(i => ({
          value: i.organizationId,
          label: i.name
        }))
      })
    },
    open(data) {
      this.form = {
        teacherId: data.teacherId,
        transferToOrg: '',
        transferReason: ''
      }
      this.visible = true
      this.$refs.form.resetFields()
    },
    successFn() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.edit()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    edit() {
      const data = {
        'teacherId': this.form.teacherId,
        'transferReason': this.form.transferReason,
        'transferToOrg': this.form.transferToOrg
      }
      this.loading = false
      teacherTransferToOrg(data).then(res => {
        this.$message.success('转让成功')
        this.visible = false
        this.loading = false
        this.$emit('success')
      }).catch(() => {
        this.loading = false
      })
    }
  }
}
</script>

  <style lang='scss' scoped>
  .problemDetail {
      padding: 20px;
  }
  </style>
