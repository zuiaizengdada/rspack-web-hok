<template>
  <div class="allHeader">
    <div class="headerTop">
      <MTitle>直播数据看板</MTitle>
      <AppDatepicker
        ref="AppDatepicker"
        style="width: 580px"
        :show="[0, 1, 7, 'month', 30]"
        :default="1"
        :search="search.time"
        :picker-options="pickerOptions"
        @change="timeChange"
        @blur="currentTime = ''"
      />
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
    search: {
      type: Object,
      default: () => {
        return {
          time: { active: 1, time: ['', ''] },
          clueType: '', // 线索管理
          channelId: '', // 渠道ID
          deptArray: [], // 跟进人部门链
          teacherId: '',
          teacherName: '',
          paramType: 1
        }
      }
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
            // 2个月以内
            const minTime = moment(this.currentTime).subtract(2, 'month').valueOf()
            const maxTime = moment(this.currentTime).add(2, 'month').valueOf()
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
  mounted() {},
  methods: {
    // 时间改变触发
    timeChange(val) {
      this.search.time = val
      this.$emit('onSearch', val)
    }
  }
}
</script>

<style lang='scss' scoped>
.allHeader {
    .headerTop {
      padding: 0 20px;
      padding-bottom: 8px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      // border-bottom: 1px solid #E0E0E0;
  }
  .tips {
    font-size: 14px;
    font-family: MicrosoftYaHei;
    color: #333333;
    line-height: 22px;
  }
}
</style>
