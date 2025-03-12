<template>
  <div class="title-container flex w-full items-center">
    <publish-title title="作品标题" class="title" />
    <Title :title="title" :max="200" @change="handleChangeTitle" />
  </div>
</template>

<script>
import Title from '../../Common/Title.vue'
import PublishTitle from '../PublishTitle.vue'
export default {
  components: {
    Title,
    PublishTitle
  },
  inject: ['updatePublishTitle', 'publishForm', 'updataPublishAllList'],
  data() {
    return {
      title: ''
    }
  },
  computed: {
    getPublishFormTitle() {
      return this.publishForm.title
    }
  },
  watch: {
    getPublishFormTitle(val) {
      this.title = val
    }
  },
  methods: {
    handleChangeTitle(val) {
      this.updatePublishTitle(val)
      this.updataPublishAllList('title', val)
    }
  }

}
</script>
