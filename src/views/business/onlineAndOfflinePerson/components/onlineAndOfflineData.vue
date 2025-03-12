<template>
  <div class="wrapper-online-offline-data">
    <gmvShow ref="gmvShow" @changeFormData="changeFormData" @changeBizTypeForForm="changeBizTypeForForm" @setBizArray="setBizArray" @changeToList="changeToList" />
    <chartRow ref="chartRow" :biz-data-array="bizDataArray" />
    <listData ref="listData" />
  </div>
</template>

<script>
import gmvShow from './onlineAndOffline/gmvShow.vue'
import chartRow from './onlineAndOffline/chartRow.vue'
import listData from './list/index.vue'
export default {
  components: {
    gmvShow,
    chartRow,
    listData
  },
  data() {
    return {
      bizDataArray: [],
      formOnlineAndOffline: {}
    }
  },
  provide() {
  },
  mounted() {
  },
  created() {
  },
  methods: {
    init(item) {
      this.formOnlineAndOffline = item
      this.$nextTick(() => {
        this.$refs.gmvShow.init(item)
        this.$refs.chartRow.init(item)
      })
    },
    clickBiz(item) {
      this.$nextTick(() => {
        this.$refs.chartRow.init(item)
      })
    },
    changeBizTypeForForm(type, typeName) {
      this.$emit('changeBizTypeForForm', type, typeName)
    },
    changeActive(item) {
      this.formOnlineAndOffline = item
      this.$nextTick(() => {
        this.$refs.gmvShow.changeActive(item)
        this.$refs.chartRow.init(item)
      })
    },
    changeFormData(item) {
      this.$emit('changeFormData', item)
    },
    changeToList(obj) {
      console.log('#####################:', this.formOnlineAndOffline)
      console.log('ooooooooooo：：：：', obj)
      this.$nextTick(() => {
        this.$refs.listData.drawerFlag = true
        this.$refs.listData.init(this.formOnlineAndOffline, obj)
      })
    },
    setBizArray(arr) {
      this.bizDataArray = arr
    }
  }
}
</script>

  <style lang="scss" scoped>
  .wrapper-online-offline-data {
    width: 100%;
    padding: 0 20px;
    float: left;
    background: #fff;
  }
  </style>
