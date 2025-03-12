<template>
  <div class="automation-setting">
    <el-form :model="form" label-width="210px" label-position="left">
      <el-form-item label="当前任务时间" prop="time">
        {{ form.time[0] }} 至 {{ form.time[1] }}
      </el-form-item>
      <el-form-item label="任务结束后自动创建下一期任务" prop="time">
        <el-checkbox
          v-model="form.isAutoNewTask"
          :true-label="1"
          :false-label="0"
          :disabled="isDisabled || type === 'detail'"
        >开启</el-checkbox>
      </el-form-item>
      <el-form-item label="下期任务时间" prop="nextEndTime">
        {{ form.time[1] }} 至
        <el-date-picker
          v-model="form.nextEndTime"
          type="datetime"
          format="yyyy-MM-dd HH:mm"
          placeholder="选择结束时间"
          :disabled="isDisabled || type === 'detail'"
          :picker-options="pickerOptions"
          value-format="yyyy-MM-dd HH:mm"
        />
      </el-form-item>
    </el-form>
    <el-button
      v-if="type !== 'detail'"
      type="primary"
      @click="submitForm"
    >保存</el-button>
    <el-button v-if="type === 'add'" @click="back">上一步</el-button>
  </div>
</template>

<script>
import moment from 'moment'
export default {
  props: {
    type: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      value1: '',
      form: {
        time: '',
        nextEndTime: ''
      },
      openChecked: false,
      pickerOptions: {
        disabledDate: time => {
          return time.getTime() < moment(this.form.time[1])
        }
      }
    }
  },
  computed: {
    isDisabled() {
      return (
        this.form.createdNextTask ||
        this.form.taskStatus === '4' ||
        this.form.taskStatus === '3'
      )
    }
  },
  methods: {
    setData(form) {
      console.log(11111, this.form)
      this.form = form
    },
    back() {
      this.$emit('addForm', this.form)
      this.$emit('back')
    },
    submitForm() {
      this.$emit('save', this.form)
    }
  }
}
</script>

<style lang="scss" scoped>
.automation-setting {
  padding: 25px;
}
</style>
