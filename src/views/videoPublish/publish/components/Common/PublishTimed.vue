<template>
  <div class="publish-timed-container relative w-full">
    <div class="relative" :class="publishTimedType===1?'publish-last-inline':''">
      <el-radio-group v-model="publishTimedType" @input="handleInputTimed">
        <el-radio v-for="item in publishTimedList" :key="item.value" :label="item.value">{{ item.label }}</el-radio>
      </el-radio-group>
      <el-date-picker v-show="publishTimedType===1" v-model="publishTimeValue" :picker-options="pickerOptions" type="datetime" class="absolute picker" @change="handleChangeDate" />
      <p v-show="publishTimedType===1" class="tips">{{ tips }}</p>
    </div>
  </div>
</template>
<script>
import moment from 'moment'
export default {
  props: {
    publishTimedData: {
      type: Object,
      default: () => {}
    },
    tips: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      publishTimedType: 0,
      publishTimeValue: '',
      publishTimedList: [
        {
          label: '立即发布',
          value: 0
        },
        {
          label: '定时发布',
          value: 1
        }
      ],
      daysNum: 6,
      pickerOptions: {
        disabledDate: (time) => {
          return time.getTime() < Date.now() - 1000 * 60 * 60 * 24 || time.getTime() > Date.now() + 1000 * 60 * 60 * 24 * this.daysNum
        },
        selectableRange: this.getSelectableRange()
      }
    }
  },
  watch: {
    publishTimedData: {
      handler(data) {
        this.publishTimeValue = data.value
        this.publishTimedType = data.type
      },
      deep: true

    },
    publishTimeValue(val) {
      if (['bilibili', 'tiktok', 'xiaohongshu'].includes(this.type)) {
        this.pickerOptions.disabledDate = (time) => {
          return time.getTime() < Date.now() - 1000 * 60 * 60 * 24 || time.getTime() > Date.now() + 1000 * 60 * 60 * 24 * 14
        }
      } else if (this.type === 'kuaishou') {
        this.pickerOptions.disabledDate = (time) => {
          return time.getTime() < Date.now() - 1000 * 60 * 60 * 24 || time.getTime() > Date.now() + 1000 * 60 * 60 * 24 * 12
        }
      } else {
        this.pickerOptions.disabledDate = (time) => {
          return time.getTime() < Date.now() - 1000 * 60 * 60 * 24 || time.getTime() > Date.now() + 1000 * 60 * 60 * 24 * 6
        }
      }

      this.pickerOptions.selectableRange = this.getSelectableRange(val)
    }
  },
  mounted() {
    if (this.publishTimedData) {
      this.publishTimeValue = this.publishTimedData.value
      this.publishTimedType = this.publishTimedData.type
    }
    // 小红书 b站 抖音是14天  快手12天
    this.daysNum = ['bilibili', 'tiktok', 'xiaohongshu'].includes(this.type) ? 14 : this.type === 'kuaishou' ? 12 : 6
  },
  methods: {
    getSelectableRange(selectedDate) {
      if (!selectedDate) return '00:00:00 - 23:59:59'

      const now = new Date()
      const lastSelectableDate = new Date(now.getTime() + 1000 * 60 * 60 * 24 * this.daysNum)
      const selectedMoment = moment(selectedDate)
      const lastSelectableMoment = moment(lastSelectableDate)

      // 判断是否是最后可选择的日期
      if (selectedMoment.format('YYYY-MM-DD') === lastSelectableMoment.format('YYYY-MM-DD')) {
        const hours = now.getHours()
        const minutes = now.getMinutes()
        const seconds = now.getSeconds()
        return `00:00:00 - ${hours}:${minutes}:${seconds}`
      }

      return '00:00:00 - 23:59:59'
    },
    handleInputTimed(val) {
      this.$emit('change', {
        type: this.publishTimedType,
        value: this.publishTimeValue ? moment(this.publishTimeValue).format('YYYY-MM-DD HH:mm:ss') : ''
      })
    },
    handleChangeDate(val) {
      this.$emit('change', {
        type: this.publishTimedType,
        value: this.publishTimeValue ? moment(this.publishTimeValue).format('YYYY-MM-DD HH:mm:ss') : ''
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.publish-last-inline {
  float: left;
  width: 100%;
  height: 70px;
}
  .picker{
    top:-5px;
    left:200px;
  }

  .tips{
    position: absolute;
    font-size:12px;
    line-height: 24px;
    color:#999;
    top:40px;
  }
</style>
