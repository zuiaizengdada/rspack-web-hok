<template>
  <div class="live-content">
    <wordsSearch @search="searchFn" />
    <pageData ref="wordsPageData" style="border: 1px solid #fff; margin-top: -10px;" :searchs="wordsFrom" />
  </div>
</template>

<script>
import wordsSearch from './components/wordsSearch.vue'
import pageData from './components/pageData.vue'
export default {
  components: {
    wordsSearch,
    pageData
  },
  data() {
    return {
      wordsFrom: {
        participleName: '',
        currentPage: 1,
        pageSize: 10
      }
    }
  },
  mounted() {
    this.searchFn(this.wordsFrom)
  },
  created() {},
  methods: {
    searchFn(res) {
      console.log('ddsfdsfsdfds:', res)
      this.wordsFrom = res
      this.$refs.wordsPageData.getDataList(res)
    }
  }
}
</script>

<style lang="scss" scoped>
.live-content {
  background: #fff;
  display: flex;
  flex-direction: column;
  height: 100%;
}
</style>
