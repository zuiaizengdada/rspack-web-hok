<template>
  <AppDialog
    v-model="visible"
    :title="title"
    width="500px"
    :loading="loading"
    height="auto"
    :top="top"
    @success="sure"
  >
    <div v-loading="loading" class="scriptAdjustTime overflowOuto">
      <el-form ref="form" :model="form" :rules="rules" label-width="auto" size="small">
        <el-form-item label="调整方向" prop="adjustType">
          <el-radio-group v-model="form.adjustType">
            <el-radio-button :label="1">向前</el-radio-button>
            <el-radio-button :label="2">向后</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="调整秒数" prop="adjustTime">
          <el-input v-model="form.adjustTime" style="width: 120px" @input="delNumber">
            <span slot="append">秒</span>
          </el-input>
        </el-form-item>
      </el-form>
    </div>
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import { scriptTimeModify } from '@/api/liveRoom/index.js'
export default {
  components: {
    AppDialog
  },
  data() {
    return {
      loading: false,
      visible: false,
      title: '时间调整',
      top: '115px',
      form: {
        adjustType: 1, // 1向前，2向后
        adjustTime: 2 // 调整时间
      },
      rules: {
        adjustType: [
          { required: true, message: '请输入选择调整方向', trigger: 'change' }
        ],
        adjustTime: [
          { required: true, message: '请输入调整秒数', trigger: 'blur' }
        ]
      },
      scriptInteractIds: [],
      checkAll: false,
      scriptId: '',
      success: () => {}
    }
  },
  mounted() {
    this.top = Math.abs(window.innerHeight - 318) / 2 + 'px'
  },
  methods: {
    // 限制只能输入英文和数字
    delNumber(e) {
      if (Number(e) < 1) {
        this.form.adjustTime = 1
        return
      }
      if (Number(e) > 120) {
        this.form.adjustTime = 120
        return
      }
      this.form.adjustTime = e.replace(/[^0-9]/g, '')
    },
    sure() {
      this.loading = true
      const data = {
        operateType: this.checkAll ? 1 : 2,
        scriptId: this.scriptId,
        scriptInteractIds: this.scriptInteractIds,
        scriptTime: this.form.adjustType === 1 ? (-Number(this.form.adjustTime)) : this.form.adjustTime
      }
      if (this.checkAll) {
        delete data.scriptInteractIds
      }
      scriptTimeModify(data).then(res => {
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
.scriptAdjustTime {
    height: 200px;
    padding: 20px 10px;
}
</style>
