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
      <el-form-item label="渠道平台">
        <el-select
          v-model="form.channelId"
          class="w_f_120"
          placeholder="请选择"
          clearable
        >
          <el-option
            v-for="(item, index) in orderChannels"
            :key="index"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="订单状态">
        <el-select
          v-model="form.orderStatus"
          class="w_f_120"
          placeholder="请选择"
          clearable
        >
          <el-option
            v-for="(item, index) in orderStatus"
            :key="index"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="结算状态">
        <el-select
          v-model="form.settleStatus"
          class="w_f_120"
          placeholder="请选择"
          clearable
        >
          <el-option
            v-for="(item, index) in getSettleStatuss"
            :key="index"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="订单时间">
        <div class="flex flex-middle">
          <el-select v-model="form.timeType" class="w_f_120">
            <el-option label="支付时间" :value="1" />
            <el-option label="结算时间" :value="2" />
          </el-select>
          <el-date-picker
            v-model="form.dateRange"
            type="daterange"
            :picker-options="pickerOptions"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            clearable
          />
        </div>
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
import { orderStatus, orderChannels, settleStatuss } from '../../../../utils'
import {
  getCollectExport,
  orderSettleExportTaskStatus
} from '@/api/business/divideAccounts'
import moment from 'moment'
export default {
  data() {
    return {
      orderStatus,
      orderChannels,
      settleStatuss,
      form: {
        timeType: 2,
        dateRange: []
      },
      pickerOptions: {
        // // 最多选择60天
        // disabledDate(time) {
        //   return time.getTime() < Date.now() - 60 * 24 * 3600 * 1000
        // }
      },
      btnExportLoading: false
    }
  },
  computed: {
    getSettleStatuss() {
      return this.settleStatuss.filter(item => item.value !== 1)
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
      getCollectExport(params)
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
        timeType: 2,
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
