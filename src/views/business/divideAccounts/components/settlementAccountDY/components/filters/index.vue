<template>
  <div>
    <el-form ref="form" :inline="true" :model="form" size="small">
      <el-form-item label="订单号">
        <el-input
          v-model="form.orderNo"
          class="w_f_150"
          placeholder="请输入订单号"
          clearable
        />
      </el-form-item>
      <!-- <el-form-item label="退款单号">
        <el-input
          v-model="form.refundNo"
          class="w_f_150"
          placeholder="请输入退款单号"
          clearable
        />
      </el-form-item> -->
      <el-form-item label="类型">
        <el-select
          v-model="form.inOut"
          class="w_f_120"
          placeholder="请选择"
          clearable
        >
          <el-option label="收入" :value="1" />
          <el-option label="支出" :value="2" />
        </el-select>
      </el-form-item>

      <el-form-item label="动账时间">
        <el-date-picker
          v-model="form.dateRange"
          :picker-options="pickerOptions"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          clearable
        />
      </el-form-item>
      <el-form-item>
        <el-button size="small" :loading="btnExportLoading" @click="exportData">
          导出
        </el-button>

        <el-button size="small" @click="resetForm">重置</el-button>

        <el-button
          type="primary"
          class="col-submit-btn"
          size="small"
          @click="onSubmit"
        >
          查询
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {
  getCapitalExport,
  orderSettleExportTaskStatus
} from '@/api/business/divideAccounts'
import moment from 'moment'
export default {
  data() {
    return {
      form: {
        timeType: 1,
        dateRange: []
      },
      pickerOptions: {
        // 最多选择60天
        disabledDate(time) {
          return time.getTime() < Date.now() - 60 * 24 * 3600 * 1000
        }
      },
      btnExportLoading: false
    }
  },
  created() {
    this.setDefaultTime()
    this.onSubmit()
  },
  methods: {
    setDefaultTime() {
      this.form.dateRange = [
        new Date(new Date().getTime() - 30 * 24 * 3600 * 1000),
        new Date()
      ]
    },
    exportData() {
      this.btnExportLoading = true
      const params = {
        ...this.form,
        channel: 2,
        startTime:
          this.form.dateRange && this.form.dateRange[0]
            ? moment(this.form.dateRange[0]).format('YYYY-MM-DD')
            : undefined,
        endTime:
          this.form.dateRange && this.form.dateRange[1]
            ? moment(this.form.dateRange[1]).format('YYYY-MM-DD')
            : undefined
      }
      delete params.dateRange
      getCapitalExport(params)
        .then(res => {
          this.getOrderExportTaskStatus(res.data.taskId)
        })
        .catch(() => {
          this.btnExportLoading = false
          this.$message.error('导出失败')
        })
    },
    getOrderExportTaskStatus(id) {
      orderSettleExportTaskStatus({ taskId: id })
        .then(res => {
          if (res.data.status === 2) {
            this.btnExportLoading = false
            this.$message.success('导出成功')
            window.open(res.data.fileUrl)
          } else {
            this.getOrderExportTaskStatus(id)
          }
        })
        .catch(() => {
          this.btnExportLoading = false
          this.$message.error('导出失败')
        })
    },
    onSubmit() {
      const params = {
        ...this.form,
        startTime:
          this.form.dateRange && this.form.dateRange[0]
            ? moment(this.form.dateRange[0]).format('YYYY-MM-DD')
            : undefined,
        endTime:
          this.form.dateRange && this.form.dateRange[1]
            ? moment(this.form.dateRange[1]).format('YYYY-MM-DD')
            : undefined
      }
      delete params.dateRange
      this.$emit('query', params)
    },
    resetForm() {
      this.form = {
        timeType: 1,
        dateRange: []
      }
      this.setDefaultTime()
      this.$refs.form.resetFields()
      const params = {
        ...this.form,
        startTime:
          this.form.dateRange && this.form.dateRange[0]
            ? moment(this.form.dateRange[0]).format('YYYY-MM-DD')
            : undefined,
        endTime:
          this.form.dateRange && this.form.dateRange[1]
            ? moment(this.form.dateRange[1]).format('YYYY-MM-DD')
            : undefined
      }
      delete params.dateRange
      this.$emit('resetQuery', params)
    }
  }
}
</script>

<style lang="scss" scoped>
.w_f_150 {
  width: 150px;
}
.w_f_120 {
  width: 120px;
}
</style>
