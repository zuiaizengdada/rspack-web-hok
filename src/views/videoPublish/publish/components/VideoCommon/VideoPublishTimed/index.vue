<template>
  <div class="timed-container flex w-full  relative" style="padding-bottom:80px;">
    <publish-title title="定时发布" />
    <publish-timed :publish-timed-data="publishTimedData" tips="提示：选择将来2小时~7天的时间范围，如需更多设置，请前往账号单独设置" @change="changePublishTimed" />
  </div>
</template>
<script>
import PublishTitle from '../PublishTitle.vue'
import PublishTimed from '../../Common/PublishTimed.vue'
export default {
  components: {
    PublishTitle,
    PublishTimed
  },
  inject: ['updatePublishTimed', 'publishForm'],
  data() {
    return {
      publishTimedType: 0,
      publishTimeValue: '',
      publishTimedData: null,
      publishTimedList: [
        {
          label: '立即发布',
          value: 0
        },
        {
          label: '定时发布',
          value: 1
        }
      ]
    }
  },
  computed: {
    getPublishFormTimed() {
      return this.publishForm.publishTimed
    }
  },
  watch: {
    getPublishFormTimed: {
      handler() {
        this.initTimed()
      }
    }
  },
  methods: {
    initTimed() {
      this.publishTimedData = this.getPublishFormTimed
      console.log(this.getPublishFormTimed, '定时发布数据')
    },
    changePublishTimed(val) {
      console.log(val, '定时发布更新。。')
      this.updatePublishTimed(val)
    }
  }
}
</script>
<style lang="scss" scoped>
.timed-container{
  .picker{
    top:-5px;
    left:200px;
  }
}
.tips{
  position: absolute;
  font-size:12px;
  line-height: 24px;
  color:#999;
  top:40px;
}
</style>
