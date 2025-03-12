<template>
  <div class="AppDatePicker">
    <el-button
      v-if="show.includes(12)"
      plain
      :size="size"
      :class="{ active: search.active === 12 }"
      @click="handClick(12)"
    >近1年</el-button>
    <el-date-picker
      v-model="search.time"
      class="m-l-10 date-picker"
      value-format="yyyy-MM"
      :size="size"
      type="monthrange"
      range-separator="至"
      start-placeholder="开始月份"
      end-placeholder="结束月份"
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
          end = moment().format('YYYY-MM')
          start = moment().format('YYYY-MM')
        } else if (typeof val === 'number') {
          end = moment().format('YYYY-MM')
          start = moment().subtract(val, 'months').format('YYYY-MM')
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
      console.log(num)
      let end
      let start
      if (num === '') {
        end = moment().format('YYYY-MM')
        start = moment().format('YYYY-MM')
      } else if (typeof num === 'number') {
        end = moment().format('YYYY-MM')
        start = moment().subtract(num, 'months').format('YYYY-MM')
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
          end = moment().format('YYYY-MM')
          start = moment().format('YYYY-MM')
        } else if (typeof this.default === 'number') {
          end = moment().format('YYYY-MM')
          start = moment().subtract(this.default, 'months').format('YYYY-MM')
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
}
.date-picker {
  flex: 1 0 0;
}
.active {
  border-color: #1890ff !important;
  color: #1890ff !important;
  background: #E7F0FF!important;
}
</style>
