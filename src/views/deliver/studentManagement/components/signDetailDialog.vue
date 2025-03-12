<template>
  <!-- 签到记录弹框 -->
  <AppDialog
    v-model="config.visible"
    title="签到记录"
    width="900px"
    height="480px"
  >
    <div class="signDetailDialog overflowOuto">
      <signLog v-if="config.visible" height="400px" :delivery-info-id="config.deliveryInfoId" :schedule-id="config.scheduleId" />
    </div>
    <div slot="footer" />
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import signLog from './signLog.vue'
export default {
  components: {
    AppDialog,
    signLog
  },
  props: {
    config: {
      type: Object,
      default: () => {
        return {
          visible: false,
          deliveryInfoId: '',
          scheduleId: ''
        }
      }
    }
  },
  data() {
    return {
    }
  },
  mounted() {},
  methods: {
  }
}
</script>

<style lang='scss' scoped>
.signDetailDialog {
    height: 480px;
    padding: 16px;
    padding-bottom: 0;
}
</style>
