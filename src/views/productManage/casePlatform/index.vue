<template>
  <div class="live-content">
    <casePlatformSearch ref="caseSearch" @search="searchFn" @addDelivery="addDeliveryFa" />
    <pageData ref="pageData" :deliverys="casePlatform" @clearForm="clearFormFa" />
  </div>
</template>

<script>
import casePlatformSearch from './components/casePlatformSearch.vue'
import pageData from './components/pageData.vue'
export default {
  components: {
    casePlatformSearch,
    pageData: pageData
  },
  data() {
    return {
      dataList: [],
      casePlatform: {
        accountName: '',
        pageIndex: 1,
        pageSize: 10,
        platformTypeCode: '',
        platformCode: '',
        platformName: '',
        platformTypeName: ''
      }
    }
  },
  mounted() {
    this.searchFn(this.casePlatform)
  },
  created() {},
  methods: {
    searchFn(res) {
      // this.$refs.pageDataChild.sing(res)
      this.casePlatform = res
      this.$refs.pageData.getDataList(res)
    },
    addDeliveryFa() {
      const type = 1 // 1为新增，2为编辑
      const obj = {}
      this.$refs.pageData.addOrEdit(type, obj)
    },
    clearFormFa() {
      this.$refs.caseSearch.clear()
    }
  }
}
</script>

<style lang="scss" scoped>
.live-content {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #fff;
}
</style>
