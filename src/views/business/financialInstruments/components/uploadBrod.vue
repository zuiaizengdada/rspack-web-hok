<template>
  <div class="update-config-cls">
    <uploadSearch @changeOrdersType="changeOrdersType" @searchFor="searchFor" />
    <brushingOrdersData v-if="ordersType === 0" ref="brushingOrdersData" />
    <putInOrdersData v-if="ordersType === 1" ref="putInOrdersData" />
    <offLineOrdersData v-if="ordersType === 2" ref="offLineOrdersData" />
  </div>
</template>

<script>
import uploadSearch from '@/views/business/financialInstruments/components/uploadSearch'
import brushingOrdersData from '@/views/business/financialInstruments/components/brushingOrdersData.vue'
import offLineOrdersData from '@/views/business/financialInstruments/components/offLineOrdersData'
import putInOrdersData from '@/views/business/financialInstruments/components/putInOrdersData'
export default {
  name: 'UploadBrod',
  components: {
    uploadSearch,
    brushingOrdersData,
    offLineOrdersData,
    putInOrdersData
  },
  data() {
    return {
      ordersType: 0,
      search: {
        orderNo: ''
      }
    }
  },
  watch: {
  },
  created() {

  },
  mounted() {
    this.$refs.brushingOrdersData.loadData(this.search)
  },
  activated() {

  },
  beforeDestroy() {
    // 要进行函数卸载
  },
  methods: {
    changeOrdersType(dataType) {
      this.ordersType = dataType
    },
    searchFor(search) {
      console.log(search)
      this.search = { ...search }
      this.$nextTick(() => {
        if (this.ordersType === 0) {
          this.$refs.brushingOrdersData.loadData(this.search)
        } else if (this.ordersType === 1) {
          this.$refs.putInOrdersData.loadData(this.search)
        } else if (this.ordersType === 2) {
          this.$refs.offLineOrdersData.loadData(this.search)
        }
      })
    }
  }
}
</script>

  <style lang="scss" scoped>
  .update-config-cls {
      width: 100%;
      height: 100%;
      border-radius: 10px;
      background-color: #fff;
      .roi-cls {
          margin-right: 20px;
      }
      .row-cls {
          margin-top: 10px;
      }
  }
  </style>

