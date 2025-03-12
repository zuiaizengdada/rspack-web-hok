<template>
  <div class="liveRoomSeeting">
    <liveRoomDetail />
    <notice />
    <roomSeeting />
  </div>
</template>

<script>
import liveRoomDetail from './liveRoomSeeting/liveRoomDetail.vue'
import notice from './liveRoomSeeting/notice.vue'
import roomSeeting from './liveRoomSeeting/roomSeeting.vue'
export default {
  components: {
    liveRoomDetail,
    notice,
    roomSeeting
  },
  data() {
    return {}
  },
  mounted() {},
  methods: {}
}
</script>

<style lang='scss' scoped>
</style>
