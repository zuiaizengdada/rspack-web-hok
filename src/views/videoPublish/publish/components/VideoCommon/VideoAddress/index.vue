<template>
  <div class="address-container flex items-center">
    <publish-title title="添加地址" />
    <video-address />
  </div>
</template>
<script>
import PublishTitle from '../PublishTitle.vue'
import VideoAddress from '../../Common/Address.vue'
export default {
  components: {
    PublishTitle,
    VideoAddress
  }
}
</script>
