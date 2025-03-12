<template>
  <div class="intro-container w-full flex items-center">
    <publish-title title="作品简介" />
    <el-input v-model="intro" type="textarea" show-word-limit :maxlength="200" placeholder="请输入内容" @input="handleInputIntro" />
  </div>
</template>
<script>
import PublishTitle from '../PublishTitle.vue'
export default {
  components: {
    PublishTitle
  },

  data() {
    return {
      intro: ''
    }
  },
  inject: ['updatePublishIntro', 'publishForm', 'video', 'updataPublishAllList'],
  computed: {
    getPublishIntro() {
      return this.publishForm.intro
    }
  },
  watch: {
    getPublishIntro: {
      handler(val) {
        this.intro = val
      },
      deep: true
    }
  },
  methods: {
    handleInputIntro() {
      this.updatePublishIntro(this.intro)
      this.updataPublishAllList('intro', this.intro)
    }
  }
}
</script>
