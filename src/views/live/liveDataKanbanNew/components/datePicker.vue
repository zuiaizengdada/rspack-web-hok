<template>
  <div class="AppDatePicker">
    <el-button
      v-if="show.includes(0)"
      plain
      :size="size"
      :class="{ active: search.active === 0 }"
      style="float: left; z-index: 999"
      @click="handClick(0)"
    >今日</el-button>
    <el-button
      v-if="show.includes(1)"
      plain
      :size="size"
      :class="{ active: search.active === 1 }"
      @click="handClick(1)"
    >昨日</el-button>
    <el-button
      v-if="show.includes(7)"
      plain
      :size="size"
      :class="{ active: search.active === 7 }"
      @click="handClick(7)"
    >近7天</el-button>
    <el-button
      v-if="show.includes(30)"
      plain
      :size="size"
      :class="{ active: search.active === 30 }"
      @click="handClick(30)"
    >近30天</el-button>
    <el-button
      v-if="show.includes('week')"
      plain
      :size="size"
      :class="{ active: search.active === 'week' }"
      @click="handClick('week')"
    >本周</el-button>
    <el-button
      v-if="show.includes('month')"
      plain
      :size="size"
      :class="{ active: search.active === 'month' }"
      @click="handClick('month')"
    >本月</el-button>
    <el-button
      v-if="show.includes('year')"
      plain
      :size="size"
      :class="{ active: search.active === 'year' }"
      @click="handClick('year')"
    >今年</el-button>
    <el-date-picker
      v-model="search.time"
      class="m-l-10 date-picker"
      value-format="yyyy-MM-dd"
      :size="size"
      type="daterange"
      range-separator="至"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
      :picker-options="pickerOptions"
      @change="timeChange"
    />
  </div>
</template>

<script>
import moment from 'moment'
export default {
  components: {},
  props: {
    pickerOptions: {
      type: Object,
      default: () => {}
    },
    show: {
      type: Array,
      default: () => {
        return []
      }
    },
    isWhole: {
      type: Boolean,
      default: false
    },
    size: {
      type: String,
      default: 'small'
    },
    default: {
      type: [Number, String],
      default: ''
    },
    search: {
      type: Object,
      default: () => {
        return {
          active: 1,
          time: ['', '']
        }
      }
    }
  },
  data() {
    return {}
  },
  watch: {
    default: {
      handler(val) {
        let end
        let start
        let type = 1
        if (val === '') {
          end = this.search.time[1] || moment().format('YYYY-MM-DD')
          start = this.search.time[0] || moment().format('YYYY-MM-DD')
        } else if (val === 0) {
          end = moment().format('YYYY-MM-DD')
          start = moment().format('YYYY-MM-DD')
        } else if (val === 1) {
          end = moment().subtract(1, 'day').format('YYYY-MM-DD')
          start = moment().subtract(1, 'day').format('YYYY-MM-DD')
        } else if (typeof val === 'number') {
          end = moment().format('YYYY-MM-DD')
          start = moment()
            .subtract(val - 1, 'day')
            .format('YYYY-MM-DD')
        } else if (typeof val === 'string' && val === 'month') {
          end = moment().format('YYYY-MM-DD')
          start = moment().format('YYYY-MM-01')
          type = 3
        } else if (typeof val === 'string' && val === 'year') {
          end = moment().format('YYYY-MM-DD')
          start = moment().format('YYYY-01-01')
          type = 3
        } else if (typeof val === 'string' && val === 'week') {
          end = moment().format('YYYY-MM-DD')
          start = moment().startOf('isoWeek').isoWeekday(1).format('YYYY-MM-DD')
          type = 5
        }

        const obj = {
          active: val,
          time: [start, end],
          type: this.isWhole ? type : undefined
        }
        return this.$emit('change', obj)
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {},
  methods: {
    handClick(num) {
      let end
      let start
      let type = 1
      if (num === 0) {
        // 今天
        end = moment().format('YYYY-MM-DD')
        start = moment().format('YYYY-MM-DD')
      } else if (num === 1) {
        end = moment().subtract(1, 'day').format('YYYY-MM-DD')
        start = moment().subtract(1, 'day').format('YYYY-MM-DD')
      } else if (typeof num === 'number') {
        end = moment().format('YYYY-MM-DD')
        start = moment()
          .subtract(num - 1, 'day')
          .format('YYYY-MM-DD')
      } else if (typeof num === 'string' && num === 'month') {
        end = moment().format('YYYY-MM-DD')
        start = moment().format('YYYY-MM-01')
        type = 3
      } else if (typeof num === 'string' && num === 'year') {
        end = moment().format('YYYY-MM-DD')
        start = moment().format('YYYY-01-01')
        type = 4
      } else if (typeof num === 'string' && num === 'week') {
        end = moment().format('YYYY-MM-DD')
        start = moment().startOf('isoWeek').isoWeekday(1).format('YYYY-MM-DD')
        type = 5
      }
      const obj = {
        active: num,
        time: [start, end],
        type: this.isWhole ? type : undefined
      }
      this.$emit('change', obj)
    },
    timeChange(val) {
      if (val) {
        const obj = {
          active: '',
          time: [val[0], val[1]]
        }
        this.$emit('change', obj)
      } else {
        let end
        let start
        if (this.default === '') {
          // start = ['', '']
          end = moment().format('YYYY-MM-DD')
          start = moment().format('YYYY-MM-DD')
        } else if (this.default === 0) {
          end = moment().format('YYYY-MM-DD')
          start = moment().format('YYYY-MM-DD')
        } else if (this.default === 1) {
          end = moment().subtract(1, 'day').format('YYYY-MM-DD')
          start = moment().subtract(1, 'day').format('YYYY-MM-DD')
        } else if (typeof this.default === 'number') {
          end = moment().format('YYYY-MM-DD')
          start = moment()
            .subtract(this.default - 1, 'day')
            .format('YYYY-MM-DD')
        } else if (
          typeof this.default === 'string' &&
            this.default === 'month'
        ) {
          end = moment().format('YYYY-MM-DD')
          start = moment().format('YYYY-MM-01')
        } else if (
          typeof this.default === 'string' &&
            this.default === 'year'
        ) {
          end = moment().format('YYYY-MM-DD')
          start = moment().format('YYYY-01-01')
        }
        const obj = {
          active: this.default,
          time: [start, end],
          type: this.isWhole ? 1 : undefined
        }
        return this.$emit('change', obj)
      }
    }
  }
}
</script>

  <style lang="scss" scoped>
  .AppDatePicker {
    display: flex;
    .active {
      border-color: #1890ff !important;
      color: #1890ff !important;
      background: #e7f0ff !important;
    }
  }
  .date-picker {
    flex: 1 0 0;
  }
  </style>
