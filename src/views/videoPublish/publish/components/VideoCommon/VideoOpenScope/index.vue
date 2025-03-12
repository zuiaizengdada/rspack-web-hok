<template>
  <div class="open-scope-container flex w-full items-center">
    <publish-title title="公开范围" />
    <open-scope :scope-type="scopeType" @change="changeOpenScope" />
  </div>
</template>
<script>
import PublishTitle from '../PublishTitle.vue'
import OpenScope from '../../Common/OpenScope.vue'
export default {
  components: { PublishTitle, OpenScope },
  data() {
    return {
      scopeType: 0
    }
  },
  inject: ['publishForm', 'updatePublishOpenScope'],
  computed: {
    getPublishFormOpenScope() {
      return this.publishForm.openScope
    }
  },
  watch: {
    getPublishFormOpenScope(val) {
      this.scopeType = val
    }
  },
  methods: {
    changeOpenScope(val) {
      this.updatePublishOpenScope(val)
    },
    // 改变选中项
    changeType() {
      this.scopeType = this.getPublishFormOpenScope
    }
  }
}
</script>
