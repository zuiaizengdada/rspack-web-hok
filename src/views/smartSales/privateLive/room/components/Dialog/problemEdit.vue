<template>
  <AppDialog
    v-model="visible"
    title="处理"
    width="540px"
    :loading="loading"
    height="auto"
    :top="top"
    @success="successFn"
  >
    <div v-loading="loading" class="problemDetail overflowOuto">
      <el-form ref="form" v-loading="loading" :model="form" label-width="auto" size="small" :rules="rules" @submit.native.prevent>
        <el-form-item label="处理状态" prop="status">
          <el-select v-model="form.status" clearable placeholder="请选择">
            <el-option v-for="(item) in option" :key="item.value" :label="item.label" :value="item.value" :disabled="item.value === 1 && status !== 1" />
          </el-select>
        </el-form-item>
        <el-form-item label="处理意见" prop="reason">
          <el-input
            v-model="form.reason"
            type="textarea"
            :rows="2"
            placeholder="请输入"
            maxlength="200"
            show-word-limit
          />
        </el-form-item>
      </el-form>
    </div>
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import { editQuestionFeedback } from '@/api/liveRoom/problemFeedback.js'
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
        status: '',
        reason: ''
      },
      status: '',
      rules: {
        status: [
          { required: true, message: '请选择处理状态', trigger: 'change' }
        ],
        reason: [
          { required: true, message: '请输入处理意见', trigger: 'blur' }
        ]
      },
      success: () => {}
    }
  },
  watch: {
    visible: {
      handler() {
        this.form.status = this.status
      },
      deep: true
    }
  },
  mounted() {
    this.top = Math.abs(window.innerHeight - 318) / 2 + 'px'
  },
  methods: {
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
        handleOpinion: this.form.reason,
        id: this.questionFeedbackId,
        status: this.form.status
      }
      this.loading = false
      editQuestionFeedback(data).then(res => {
        console.log(res)
        this.visible = false
        this.success && this.success()
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.problemDetail {
    height: 200px;
    padding: 20px;
}
</style>
