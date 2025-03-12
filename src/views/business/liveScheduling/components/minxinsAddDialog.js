export default {
  data() {
    return {
      pickerOptionsTimeTo: {
        disabledDate: time => {
          const delay = this.form.liveTimeFrom
          if (delay) {
            // const dd = new Date('2019-09-03').getTime();//9月3号
            // return time.getTime() < dd;
            return time.getTime() < new Date(delay).getTime()
          }
        }

      }
    }
  },
  methods: {
    validLiveTime() {
      const eTime = new Date(this.form.liveTimeTo).getTime()
      const sTime = new Date(this.form.liveTimeFrom).getTime()
      if (eTime < sTime) {
        this.$message.error('直播开始时间不能大于直播结束时间')
        return false
      } else {
        return true
      }
    }
  }
}
