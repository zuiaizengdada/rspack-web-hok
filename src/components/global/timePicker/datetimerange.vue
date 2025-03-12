<template>
  <div class="datetimerange">
    <el-date-picker
      v-model="time.startTime.date"
      format="yyyy-MM-dd"
      value-format="yyyy-MM-dd"
      style="width: 130px"
      type="date"
      :size="size"
      placeholder="选择日期"
    />
    <el-autocomplete
      v-model="time.startTime.time"
      clearable
      :size="size"
      class="m-l-10"
      style="width: 120px"
      :fetch-suggestions="querySearch"
      placeholder="请输入内容"
      @blur.stop="handleBlurPlayTime('startTime')"
      @keyup.enter.native="handleBlurPlayTime('startTime')"
      @select="handleSelect"
    />
    至
    <el-date-picker
      v-model="time.endTime.date"
      format="yyyy-MM-dd"
      :size="size"
      value-format="yyyy-MM-dd"
      style="width: 130px"
      type="date"
      placeholder="选择日期"
    />
    <el-autocomplete
      v-model="time.endTime.time"
      clearable
      :size="size"
      class="m-l-10"
      style="width: 120px"
      :fetch-suggestions="querySearch"
      placeholder="请输入内容"
      @blur.stop="handleBlurPlayTime('endTime')"
      @keyup.enter.native="handleBlurPlayTime('endTime')"
      @select="handleSelect"
    />
  </div>
</template>

<script>
import moment from 'moment'
export default {
  components: {},
  props: {
    value: {
      type: Array,
      default: () => {
        return []
      }
    },
    size: {
      type: String,
      default: 'small'
    }
  },
  data() {
    return {
      time: {
        startTime: {
          date: '', // 年月日
          time: ''
        },
        endTime: {
          date: '',
          time: ''
        },
        restaurants: []
      }
    }
  },
  mounted() {
    this.restaurants = this.loadAll()
  },
  methods: {
    querySearch(queryString, cb) {
      cb(this.restaurants)
    },
    loadAll() {
      const arr = []
      for (let i = 0; i < 24 * 60 * 60; i = i + 30 * 60) {
        arr.push({ value: this.filtersTime(i) })
      }
      return arr
    },
    // 秒转时分
    filtersTime(val) {
      const result = parseInt(val)
      const h = Math.floor(result / 3600) < 10 ? '0' + Math.floor(result / 3600) : Math.floor(result / 3600)
      const m = Math.floor((result / 60 % 60)) < 10 ? '0' + Math.floor((result / 60 % 60)) : Math.floor((result / 60 % 60))
      return h + ':' + m
    },
    handleBlurPlayTime(key) {
      const total = this.formatPrTime(this[key].time)
      if (total || total === 0) {
        this[key].time = this.getFormatHMS(total * 1000 * 60)
      } else {
        this[key].time = this.getFormatHMS(0)
      }
      return
    },
    // 时间转秒
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
        const total = mss + ss
        console.log(mss, ss, '1231')
        return total
      }
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
    // 接收豪秒的单位
    getFormatHMS(val) {
      return moment.utc(val).format('HH:mm')
    },
    handleSelect(item) {
      console.log(item)
    }
  }
}
</script>

<style lang='scss' scoped>
.datetimerange {
    display: inline-block;
}
</style>
