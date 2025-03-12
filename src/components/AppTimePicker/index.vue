<template>
  <div class="">
    <el-date-picker
      v-model="time1"
      type="date"
      placeholder="选择日期"
      format="yyyy-MM-dd"
      value-format="yyyy-MM-dd"
      style="width: 140px"
      :picker-options="pickerOptions1"
      :disabled="disabled"
      @change="time1Change"
    />
    <el-time-picker
      v-model="time2"
      :disabled="disabled || !time1"
      format="HH:mm:ss"
      value-format="HH:mm:ss"
      :picker-options="pickerOptions2"
      placeholder="选择时间"
      style="width: 120px"
      class="m-l-10"
      @change="time2Change"
    />
  </div>
</template>

<script>
import moment from 'moment'
export default {
  components: {
  },
  props: {
    pickerOptions: {
      type: [Array],
      default: () => { return ['', ''] }
    },
    value: {
      type: [Object, String, Date],
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      pickerOptions1: {
        disabledDate: (time) => {
          const val = moment(time).format('YYYY-MM-DD')
          if (!this.pickerOptions || this.pickerOptions.length !== 2) {
            return false
          }
          return val < moment(this.pickerOptions[0]).format('YYYY-MM-DD') || val > moment(this.pickerOptions[1]).format('YYYY-MM-DD')
        }
      },
      pickerOptions2: {
        selectableRange: '00:00:00 - 23:59:59'
      },
      time1: '',
      time2: ''
    }
  },
  watch: {
    value: {
      handler(val) {
        console.log(val)
        if (!val) {
          this.time1 = ''
          this.time2 = ''
        } else {
          const arr = val.split(' ')
          this.time1 = arr[0] || ''
          this.time2 = arr[1] ? arr[1] : ''
        }
        this.getpickerOptions2()
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
  },
  methods: {
    time1Change(val) {
      this.time2 = ''
      this.getpickerOptions2()
      console.log('time1改变', val)
    },
    time2Change(val) {
      if (!val) {
        this.$emit('input', `${this.time1}`)
      } else {
        this.$emit('input', `${this.time1} ${this.time2}`)
      }
    },
    getpickerOptions2() {
      if (!(this.pickerOptions && this.pickerOptions.length === 2)) {
        this.pickerOptions2.selectableRange = '00:00:00 - 23:59:59'
      }
      const pickerOptions1 = moment(this.pickerOptions[0]).format('YYYY-MM-DD')
      const pickerOptions2 = moment(this.pickerOptions[1]).format('YYYY-MM-DD')
      if (pickerOptions1 === pickerOptions2) {
        this.pickerOptions2.selectableRange = `${moment(this.pickerOptions[0]).format('HH:mm:00')} - ${moment(this.pickerOptions[1]).format('HH:mm:59')}`
      } else {
        if (this.time1 === pickerOptions1 && this.time1 < pickerOptions2) {
          this.pickerOptions2.selectableRange = `${moment(this.pickerOptions[0]).format('HH:mm:00')} - 23:59:59`
        } else if (this.time1 !== pickerOptions1 && this.time1 < pickerOptions2) {
          this.pickerOptions2.selectableRange = `00:00:00 - 23:59:59`
        } else if (this.time1 === pickerOptions2) {
          this.pickerOptions2.selectableRange = `00:00:00 - ${moment(this.pickerOptions[1]).format('HH:mm:59')}`
        }
      }
    }
  }
}
</script>

<style lang='scss' scoped>
</style>
