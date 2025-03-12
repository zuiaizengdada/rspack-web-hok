<template>
  <div class="date-picker-container flex flexCenter">
    <div class="quickDate">
      {{ title }}
      <!-- <el-button v-for="(item,index) in quickDateList" :key="item.label" class="button" :class="{'active':index===activeQuickDateIndex}" size="mini" @click="handleClick(index)">{{ item.label }}</el-button> -->
    </div>
    <el-date-picker
      v-model="value"
      type="daterange"
      :picker-options="pickerOptions"
      range-separator="至"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
      align="right"
      size="mini"

      @input="handleChange"
    />
  </div>
</template>
<script>
import moment from 'moment'
import { quickDateList } from './constants'
export default {
  props: {
    title: {
      type: String,
      default: ''
    }
  },

  data() {
    return {
      value: quickDateList[1].value,
      quickDateList,
      cuttentTime: '',
      pickerOptions: {
        onPick: ({ maxDate, minDate }) => {
          this.cuttentTime = minDate.getTime()
          if (maxDate) {
            this.cuttentTime = ''
          }
        },
        shortcuts: [{
          text: '昨天',
          onClick(picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24)
            picker.$emit('pick', date)
          }
        }, {
          text: '最近一周',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近半年',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 180)
            picker.$emit('pick', [start, end])
          }
        }],
        disabledDate: (time) => {
          // return time.getTime() > Date.now()
          if (time.getTime() > Date.now()) {
            return true
          }
          if (this.cuttentTime !== '') {
            const one = 30 * 6 * 24 * 3600 * 1000
            const minTime = this.cuttentTime - one
            const maxTime = this.cuttentTime + one
            return time.getTime() < minTime || time.getTime() > maxTime // 选择日期范围为一个月
          }
        }
      },
      activeQuickDateIndex: 1

    }
  },

  methods: {
    handleChange(val) {
      let list = []
      if (val) {
        list = [moment(val[0]).format('YYYY-MM-DD'), moment(val[1]).format('YYYY-MM-DD')]
        this.activeQuickDateIndex = -1
      } else {
        list = quickDateList[1].value
        this.value = quickDateList[1].value
        this.activeQuickDateIndex = 1
      }

      this.$emit('change', list)
    },
    handleClick(index) {
      this.activeQuickDateIndex = index
      this.value = quickDateList[index].value
      this.$emit('change', this.value)
    },
    reset() {
      this.activeQuickDateIndex = 1
      this.value = quickDateList[this.activeQuickDateIndex].value
      this.$emit('change', this.value)
    }
  }
}
</script>
<style lang="scss" scoped>
.quickDate{
  font-size: 14px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: #333333;
  margin-right: 12px;
}
.flexCenter{
  align-items: center;
}
</style>
