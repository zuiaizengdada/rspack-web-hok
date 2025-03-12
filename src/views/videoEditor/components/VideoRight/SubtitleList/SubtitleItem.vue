<template>
  <div class="subtitle-item-container">
    <p class="title">{{ formatSSS(data.startTime) }} - {{ formatSSS(data.endTime) }}</p>
    <p class="content videoEditSubtitleItemContent" v-html="data.html||data.content" />
    <p class="line" />
  </div>
</template>
<script>
import { getFormatSSS } from '../../../utils'
export default {
  props: {
    data: {
      type: Object,
      default: () => {}
    }
  },
  methods: {
    formatSSS(val) {
      return getFormatSSS(Number(val))
    }
  }
}
</script>
<style lang="scss" scoped>
  .subtitle-item-container {
    font-size: 12px;
    line-height: 20px;
    .title {
      color: #73aeff;
      margin-bottom: 8px;
    }
    .content {
      color: #a6a6a6;
      margin-bottom: 8px;
      .select{
        color:#F5F522
      }
      .active{
        color:#CC6708
      }
    }
    .line {
      width: 100%;
      height: 1px;
      background: #4d4d4d;
    }
  }
</style>
