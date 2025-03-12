<template>
  <div class="top-cls">
    <div class="data-search">
      <span class="left-title"><i />{{ title }}</span>
      <span v-if="newTime" class="updata-time">更新时间：{{ newTime }}</span>
      <div class="right-search">
        <AppDatepicker
          ref="AppDatepicker"
          style="width: 558px"
          :show="[0,7, 'month','year']"
          :default="searchActive"
          :search="search.time"
          :picker-options="pickerOptions"
          @change="timeChange"
          @blur="currentTime = ''"
        />
      </div>
    </div>
  </div>
</template>
<script>
import AppDatepicker from '@/components/AppDatePicker'
import moment from 'moment'
export default {
  components: {
    AppDatepicker
  },
  props: {
    title: {
      type: String,
      default: '企业经营数据'
    },
    search: {
      type: Object,
      default: () => {
        return { time: { active: '', time: ['', ''] }, current: 0 }
      }
    },
    searchActive: {
      type: [String, Number],
      default: 'month'
    },
    newTime: {
      type: String,
      default: ''
    },
    fatherForm: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      currentTime: '',
      pickerOptions: {
        disabledDate: (time) => {
          // 先限制今天之前
          if (time.getTime() > Date.now()) {
            return true
          }
          // eslint-disable-next-line eqeqeq
          if (this.currentTime) {
            // 一年以内
            // const one = 364 * 24 * 3600 * 1000
            // 月份为30 * 24 * 3600 *1000
            // const minTime = this.currentTime - one
            // const maxTime = this.currentTime + one
            const minTime = moment(this.currentTime).subtract(1, 'years').valueOf()
            const maxTime = moment(this.currentTime).add(1, 'years').valueOf()
            return time.getTime() < minTime || time.getTime() > maxTime
          }
        },
        onPick: ({ maxDate, minDate }) => {
          this.currentTime = minDate.getTime()
          if (maxDate) {
            this.currentTime = ''
          }
        }
      }
    }
  },
  created() {
    if (JSON.stringify(this.fatherForm) !== '{}' && this?.fatherForm) {
      console.log(this.fatherForm, '父级传过来的时间')
      const timeType = new Map([[1, 0], [2, 7], [3, 'month'], [4, 'year']])
      if (this?.fatherForm?.type !== 0) {
        this.searchActive = timeType.get(this.fatherForm.type)
      } else {
        this.searchActive = ''
        this.$set(this.search, 'time', { active: '', time: [this.fatherForm.startTime, this.fatherForm.endTime] })
      }
    }
  },
  methods: {
    timeChange(val) {
      this.search.time = val
      this.loadOverviewData()
    },
    fillClassString(num) {
      if (num < 0) {
        return 'red-p'
      } else {
        return 'green-p'
      }
    },
    fillDataString(num) {
      const nums = Math.abs(num * 100).toFixed(2)
      return nums + '%'
    },
    loadOverviewData() {
      const timeType = new Map([[0, 1], [7, 2], ['month', 3], ['year', 4]])
      const params = {
        startTime: this.search.time.time[0],
        endTime: this.search.time.time[1],
        type: timeType.get(this.search.time.active) || 0
      }
      this.$emit('submit', params)
    }
  }
}
</script>
<style lang="scss" scoped>
.data-search {
  width: 100%;
  .updata-time{
    margin-left: 16px;
    font-size: 14px;
    font-family: MicrosoftYaHei;
    color: #777777;
    line-height: 22px;
  }
  .left-title {
    width: 100px;
    height: 32px;
    line-height: 32px;
    padding-left: 10px;
    color: #333;
    font-size: 16px;
    font-weight: bold;
    font-family: '微软雅黑';
    i {
      width: 4px;
      height: 24px;
      margin-top: 3px;
      float: left;
      background: #0c6fff;
      border-radius: 8px;
    }
  }
  .right-search {
    float: right;
    height: 30px;
    .date-choose {
      margin-left: 10px;
      position: relative;
      .data_icon {
        position: absolute;
        top: 11px;
        right: 10px;
        z-index: 9;
        color: #c0c4cc;
        font-size: 14px;
        transform: translateY(-50%);
      }
      ::v-deep .el-range__close-icon {
        position: absolute;
        right: 10px;
        top: 11px;
        transform: translateY(-50%);
      }
    }
  }
}
</style>
