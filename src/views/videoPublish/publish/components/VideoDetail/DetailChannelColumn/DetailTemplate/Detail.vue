<template>
  <div class="address-container">
    <template-title title="设置谁可以看" />
    <publish-timed />
  </div>
</template>
<script>
import TemplateTitle from './TemplateTitle.vue'
import PublishTimed from '../../../Common/PublishTimed.vue'
export default {
  components: {
    TemplateTitle,
    PublishTimed
  }
}
</script>
