<template>
  <div class="container">
    <el-date-picker
      v-model="startTime1"
      format="yyyy-MM-dd"
      value-format="yyyy-MM-dd"
      :picker-options="pickerOptions"

      style="width: 180px"
      type="date"
      placeholder="选择日期"
      :clearable="false"
      @change="handleChangeDate"
    />
    <el-autocomplete
      v-model="startTime2"
      class="m-l-10"
      style="width: 120px"
      :fetch-suggestions="querySearch"

      placeholder="请输入"
      :clearable="false"
      @blur.stop="handleBlurPlayTime"
      @keyup.enter.native="handleBlurPlayTime"
      @select="handleSelect"
    />
    <!-- <span v-if="form.liveModel !== 'PERSON_LIVE'" class="formTips">至少提前5分钟设置好</span>
    <div v-else class="formTips" style="margin-left: 0px">开播时间前30分钟才允许开播。</div> -->
  </div>
</template>
<script>
import moment from 'moment'
export default {
  data() {
    return {
      startTime1: moment().format('YYYY-MM-DD'),
      startTime2: '',
      restaurants: [],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < new Date().getTime() - 86400000
        }
      }
    }
  },
  mounted() {
    this.loadAll()
  },
  methods: {
    handleBlurPlayTime() {
      setTimeout(() => {
        const total = this.formatPrTime(this.startTime2)
        console.log(total, 111111111)
        if (total || total === 0) {
          this.startTime2 = this.getFormatHMS(total * 1000 * 60)
        } else {
          this.startTime2 = this.getFormatHMS(0)
        }
        this.$emit('change', this.startTime1 + ' ' + this.startTime2)
      }, 200)

      //  return
      // this.isEditPlayTime = false
    },
    handleSelect(item) {
      console.log(this.startTime2, 3333333333)
      this.startTime2 = item.value

      this.$emit('change', this.startTime1 + ' ' + this.startTime2)

      //  this.$refs.form && this.$refs.form.validateField('startTime')
    },
    handleChangeDate() {
      this.startTime2 = ''
      const isNotToday = this.validateStartTime(this.startTime1)
      console.log(isNotToday, 'isTody')
      if (isNotToday) {
        this.generateTimeArray()
      } else {
        this.loadAll()
      }

      // this.$emit('change', this.startTime1 + ' ' + this.startTime2)
    },
    generateTimeArray() {
      const timeArray = []
      const startHour = 0
      const endHour = 23

      for (let hour = startHour; hour <= endHour; hour++) {
        for (let minute = 0; minute < 60; minute += 30) {
          const formattedTime = this.formatTime2(hour, minute)
          timeArray.push({ value: formattedTime })
        }
      }
      this.restaurants = timeArray
      this.startTime2 = timeArray[0].value
      this.$emit('change', this.startTime1 + ' ' + this.startTime2)
      // this.timeArray = timeArray
    },
    querySearch(queryString, cb) {
      cb(this.restaurants)
    },
    formatPrTime(val) {
      const isValid = this.volidFormatTime(val)
      if (isValid) {
        const list = val.split(':').reverse()
        for (let i = 0; i < list.length; i++) {
          if (!list[i]) {
            list[i] = '00'
          }
        }
        const mss = Number(list[0]) || 0
        const ss = list.length > 1 ? Number(list[1]) * 60 : 0
        // const ms = list.length > 2 ? Number(list[2]) * 3600 : 0
        // const hs = list.length > 3 ? Number(list[3]) * 3600 : 0
        const total = mss + ss

        return total
      }
    },
    // 接收豪秒的单位
    getFormatHMS(val) {
      return moment.utc(val).format('HH:mm')
    },
    volidFormatTime(val) {
      let isValid = true
      if (val.includes(':')) {
        const list = val.split(':')
        list.forEach((item) => {
          isValid = !isNaN(Number(item))
        })
      } else {
        isValid = !isNaN(Number(val))
      }
      return isValid
    },
    loadAll() {
      // const currentTime = new Date()
      // const startTime = new Date(currentTime)
      // startTime.setMinutes(Math.ceil(currentTime.getMinutes() / 30) * 30)
      // startTime.setSeconds(0, 0)

      // const endTime = new Date(currentTime)

      // endTime.setHours(endTime.getHours() + (24 - endTime.getHours())) // 生成未来24小时的时间
      // console.log(endTime, 'endTime')
      // const timeArray = []
      // const currentTimeObj = new Date(startTime)
      // console.log(currentTimeObj, 'endTime')
      // // eslint-disable-next-line no-unmodified-loop-condition
      // while (currentTimeObj <= endTime) {
      //   timeArray.push({ value: this.formatTime(currentTimeObj) })
      //   currentTimeObj.setMinutes(currentTimeObj.getMinutes() + 30)
      // }
      // console.log(timeArray, 'timeArray')

      const currentTimeObj = this.roundToNearestHalfHour()
      const endTimeObj = moment().endOf('day')

      const timeArray = []
      while (currentTimeObj.isBefore(endTimeObj)) {
        timeArray.push({ value: currentTimeObj.format('HH:mm') })
        currentTimeObj.add(30, 'minutes')
      }

      // timeArray.pop()
      this.restaurants = timeArray
      this.startTime2 = timeArray[0].value
      this.$emit('change', this.startTime1 + ' ' + this.startTime2)
      // return timeArray
    },
    roundToNearestHalfHour() {
      const currentTimeObj = moment()
      const minutes = currentTimeObj.minutes()

      if (minutes < 30) {
        // 取整到最近的半小时
        currentTimeObj.minutes(30)
      } else {
        // 向后取整到最近的半小时
        currentTimeObj.add(1, 'hour').minutes(0)
      }

      return currentTimeObj
      // console.log(this.roundedTime, '取整后的时间')
    },
    validateStartTime(startTime) {
      // if (!startTime) {
      //   this.isStartTimeValid = false
      //   return
      // }

      const currentTime = new Date()
      const selectedTime = new Date(startTime)

      return selectedTime > currentTime
    },
    formatTime2(hour, minute) {
      const formattedHour = String(hour).padStart(2, '0')
      const formattedMinute = String(minute).padStart(2, '0')
      return `${formattedHour}:${formattedMinute}`
    },
    formatTime(date) {
      const hours = String(date.getHours()).padStart(2, '0')
      const minutes = String(date.getMinutes()).padStart(2, '0')
      return `${hours}:${minutes}`
    },
    // 秒转时分
    filtersTime(val) {
      const result = parseInt(val)
      const h = Math.floor(result / 3600) < 10 ? '0' + Math.floor(result / 3600) : Math.floor(result / 3600)
      const m = Math.floor((result / 60 % 60)) < 10 ? '0' + Math.floor((result / 60 % 60)) : Math.floor((result / 60 % 60))
      return h + ':' + m
    }
  }
}
</script>
