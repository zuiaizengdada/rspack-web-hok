<template>
  <div class="wrapper-online-offline-data">
    <gmvShow ref="gmvShow" @changeFormData="changeFormData" @setBizArray="setBizArray" @changeToList="changeToList" @changeBizTypeForForm="changeBizTypeForForm" />
    <chartRow v-if="formForOnlineAndOfflineData.chooseType !== 2" ref="chartRow" :biz-data-array="bizDataArray" />
    <div style="width: 100%; height: 1px;" />
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
      formForOnlineAndOfflineData: {}
    }
  },
  provide() {
  },
  mounted() {
  },
  created() {
  },
  methods: {
    changeChooseType(item) {
      this.$nextTick(() => {
        this.$refs.revenueOrYj.revenType = item.chooseType
      })
    },
    changeProductCategory(item) {
      this.$nextTick(() => {
        if (!this.formForOnlineAndOfflineData.employeeDeptId && this.formForOnlineAndOfflineData.offlineFlag === 0) {
          this.$refs.chooseChannel.channelType = item.productCategory
        }
      })
    },
    init(item) {
      console.log('onlineandofflineinitform:::::::::', item)
      this.formForOnlineAndOfflineData = item
      this.$nextTick(() => {
        this.$refs.gmvShow.init(item)
        if (item.chooseType !== 2) {
          this.$refs.chartRow.init(item)
        }
      })
    },
    addTearcherData(obj) {
      this.$nextTick(() => {
        this.$refs.listData.drawerFlag = true
        this.$refs.listData.changeDataHasTearcher(this.formForOnlineAndOfflineData, this.formForOnlineAndOfflineData.bizTypeActive, obj)
      })
    },
    changeBizTypeForForm(type, typeName) {
      this.$emit('changeBizTypeForForm', type, typeName)
    },

    changeFormData(item) {
      this.$emit('changeFormData', item)
    },
    changeToList(obj) {
      this.$nextTick(() => {
        this.$refs.listData.drawerFlag = true
        this.$refs.listData.init(this.formForOnlineAndOfflineData, obj)
      })
    },
    changeBizActive(item) {
      this.$refs.gmvShow.changeBizActive(item)
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
    background: #fff;
  }
  </style>
