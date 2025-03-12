<template>
  <div class="coupon-overview">
    <div class="coupon-over-search">
      <couponOverSearch
        :title="'数据展示'"
        @submit="searchData"
        @resetForm="resetForm"
      />
    </div>
    <div class="coupon-over-view">
      <couponOverDataView ref="couponOverDataView" :active-name="activeName" />
    </div>
  </div>
</template>

<script>
import couponOverSearch from '@/views/marketingTools/couponDetail/components/couponOverSearch'
import couponOverDataView from '@/views/marketingTools/couponDetail/components/couponOverDataView'
export default {
  name: 'CouponOverview',
  components: {
    couponOverSearch,
    couponOverDataView
  },
  // eslint-disable-next-line vue/require-prop-types
  props: ['activeName'],
  data() {
    return {
    }
  },
  watch: {
  },
  created() {

  },
  mounted() {
  },
  activated() {
  },
  beforeDestroy() {
    // 要进行函数卸载
  },
  methods: {
    searchData(params) {
      this.$nextTick(() => {
        this.$refs.couponOverDataView.loadData(params)
      })
    },
    resetForm(item) {
      this.searchData(item)
    }
  }
}
</script>

  <style lang="scss" scoped>
  .coupon-overview {
      width: 100%;
      height: 100%;
      display: inline-block;
      margin-bottom: 15px;
      border-radius: 10px;
      background-color: #fff;
      .coupon-over-search {
        margin-top: 10px;
      }
  }
  </style>

