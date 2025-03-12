<template>
  <div class="AppDatePicker">
    <el-button
      v-if="show.includes(0)"
      plain
      :size="size"
      :class="{ active: search.active === 0 }"
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
      v-if="show.includes(30)"
      plain
      :size="size"
      :class="{ active: search.active === 7 }"
      @click="handClick(7)"
    >近7天</el-button>
    <el-button
      v-if="show.includes(7)"
      plain
      :size="size"
      :class="{ active: search.active === 30 }"
      @click="handClick(30)"
    >近30天</el-button>
    <el-date-picker
      v-model="search.time"
      class="m-l-10 datePicker"
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
        if (val === '') {
          end = moment().format('YYYY-MM-DD')
          start = moment().format('YYYY-MM-DD')
        } else if (val === 0) {
          end = moment().format('YYYY-MM-DD')
          start = moment().format('YYYY-MM-DD')
        } else {
          end = moment().subtract(0, 'day').format('YYYY-MM-DD')
          start = moment().subtract(val - 1, 'day').format('YYYY-MM-DD')
        }
        const obj = {
          active: val,
          time: [start, end]
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
      if (num === 0) {
        // 今天
        end = moment().format('YYYY-MM-DD')
        start = moment().format('YYYY-MM-DD')
      } else {
        end = moment().subtract(0, 'day').format('YYYY-MM-DD')
        start = moment().subtract(num - 1, 'day').format('YYYY-MM-DD')
      }
      const obj = {
        active: num,
        time: [start, end]
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
        } else {
          end = moment().subtract(1, 'day').format('YYYY-MM-DD')
          start = moment().subtract(this.default - 1, 'day').format('YYYY-MM-DD')
        }
        const obj = {
          active: this.default,
          time: [start, end]
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
      background: #E7F0FF!important;
    }
  }
  .datePicker {
    flex: 1 0 0;
  }
  </style>

