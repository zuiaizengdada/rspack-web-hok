<template>
  <div class="live-content">
    <deliveryScenarioSearch @search="searchFn" @addDelivery="addDeliveryFa" />
    <pageData ref="pageData" style="border: 1px solid #fff; margin-top: -10px;" :deliverys="searchForm" />
  </div>
</template>

<script>
import deliveryScenarioSearch from './components/deliveryScenarioSearch.vue'
import pageData from './components/pageData.vue'
export default {
  components: {
    deliveryScenarioSearch,
    pageData: pageData
  },
  data() {
    return {
      dataList: [],
      searchForm: {
        sceneName: '',
        pageIndex: 1,
        pageSize: 10
      }
    }
  },
  mounted() {
    this.searchFn(this.searchForm)
  },
  created() {
  },
  methods: {
    searchFn(res) {
      // this.$refs.pageDataChild.sing(res)
      this.$refs.pageData.getDataList(res)
    },
    addDeliveryFa() {
      const type = 1 // 1为新增，2为编辑
      const obj = {}
      this.$refs.pageData.addOrEdit(type, obj)
    }
  }
}
</script>

<style lang="scss" scoped>
.live-content {
  display: flex;
  flex-direction: column;
  background: #fff;
}
</style>
