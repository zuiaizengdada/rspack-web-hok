<template>
  <div>
    <el-form ref="form" :inline="true" :model="form" size="small">
      <el-form-item label="结算时间">
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
import moment from 'moment'
export default {
  data() {
    return {
      form: {
        dateRange: []
      },
      pickerOptions: {
        // // 最多选择60天
        // disabledDate(time) {
        //   return time.getTime() < Date.now() - 60 * 24 * 3600 * 1000
        // }
      }
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
    onSubmit() {
      const params = {
        ...this.form,
        startTime: this.form.dateRange && this.form.dateRange[0]
          ? moment(this.form.dateRange[0]).format('YYYY-MM-DD')
          : undefined,
        endTime: this.form.dateRange && this.form.dateRange[1]
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
        startTime: this.form.dateRange && this.form.dateRange[0]
          ? moment(this.form.dateRange[0]).format('YYYY-MM-DD')
          : undefined,
        endTime: this.form.dateRange && this.form.dateRange[1]
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
