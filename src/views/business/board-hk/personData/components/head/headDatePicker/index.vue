<template>
  <div class="AppDatePicker">
    <el-button type="primary" @click="clickToTfzh">投放账号数据</el-button>
    <el-button
      v-if="show.includes(1)"
      plain
      :size="size"
      :class="{ active: search.active === 1 }"
      @click="handClick(1)"
    >
      实时
    </el-button>

    <el-button
      v-if="show.includes(2)"
      plain
      :size="size"
      :class="{ active: search.active === 2 }"
      @click="handClick(2)"
    >
      近7天
    </el-button>
    <el-button
      v-if="show.includes(3)"
      plain
      :size="size"
      :class="{ active: search.active === 3 }"
      @click="handClick(3)"
    >
      本月
    </el-button>
    <el-button
      v-if="show.includes(4)"
      plain
      :size="size"
      :class="{ active: search.active === 4 }"
      @click="handClick(4)"
    >
      今年
    </el-button>
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
    <tfDataDrawer ref="tfDataDrawer" />
  </div>
</template>

<script>
import moment from 'moment'
import tfDataDrawer from '@/views/business/board-hk/personData/components/head/tfDataDrawer'
export default {
  components: {
    tfDataDrawer
  },
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
      default: 0
    },
    search: {
      type: Object,
      default: () => {
        return {
          active: 0,
          time: []
        }
      }
    }
  },
  data() {
    return {}
  },
  mounted() {
    this.search.time = [
      moment().format('YYYY-MM-DD'),
      moment().format('YYYY-MM-DD')
    ]
  },
  methods: {
    clickToTfzh() {
      this.$refs.tfDataDrawer.drawerFlag = true
      this.$refs.tfDataDrawer.loadData()
    },
    handClick(num) {
      let end
      let start
      if (num === 1) {
        end = moment().format('YYYY-MM-DD')
        start = moment().format('YYYY-MM-DD')
      } else if (num === 2) {
        end = moment().format('YYYY-MM-DD')
        start = moment()
          .subtract(num - 1, 'week')
          .format('YYYY-MM-DD')
      } else if (num === 3) {
        end = moment().format('YYYY-MM-DD')
        start = moment().format('YYYY-MM-01')
      } else if (num === 4) {
        end = moment().format('YYYY-MM-DD')
        start = moment().format('YYYY-01-01')
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
        } else if (this.default === 1) {
          end = moment().format('YYYY-MM-DD')
          start = moment().format('YYYY-MM-DD')
        } else if (this.default === 2) {
          end = moment().format('YYYY-MM-DD')
          start = moment()
            .subtract(this.default - 1, 'day')
            .format('YYYY-MM-DD')
        } else if (this.default === 3) {
          end = moment().format('YYYY-MM-DD')
          start = moment().format('YYYY-MM-01')
        } else if (this.default === 4) {
          end = moment().format('YYYY-MM-DD')
          start = moment().format('YYYY-01-01')
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
    background: #e7f0ff !important;
  }
}
.date-picker {
  flex: 1 0 0;
}
</style>
