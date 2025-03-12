<template>
  <origin-info origin="detail" :visible-save="false" :visible-cancel="false" cancel-btn-txt="返回" :status="1" @complete="detailLoadComplete" />
</template>

<script>
import OriginInfo from './components/OriginInfo.vue'
export default {
  components: {
    OriginInfo
  },
  data() {
    return {
      visibleCancel: false
    }
  },
  methods: {
    detailLoadComplete(data) {
      // this.visibleCancel = Boolean(data.videoDetailReqList.length)
    }
  }
}
</script>
