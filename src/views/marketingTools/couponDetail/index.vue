<template>
  <div class="financial-instrument">
    <el-tabs v-model="activeName">
      <el-tab-pane
        v-for="(item, index) in configList"
        :key="index"
        :name="item.approveStatus"
        :label="`${item.name}`"
      >
        <div v-if="item.name === '数据概览'">
          <couponOverview :active-name="activeName" />
        </div>
        <div v-if="item.name === '明细数据'">
          <couponDataDetail />
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import couponOverview from '@/views/marketingTools/couponDetail/components/couponOverview'
import couponDataDetail from '@/views/marketingTools/couponDetail/components/couponDataDetail'
export default {
  name: 'CouponDetail',
  components: {
    couponOverview,
    couponDataDetail
  },
  data() {
    return {
      activeName: 'dataScreen',
      fromChoose: this.$route.query.formChoose,
      configList: [
        { name: '数据概览', nums: 0, authority: 'web:couponDetail:DataScreen', approveStatus: 'dataScreen' },
        { name: '明细数据', nums: 0, authority: 'web:couponDetail:DetailData', approveStatus: 'detailData' }
      ],
      permsList: this.$route.meta.permsList || []
    }
  },
  watch: {
  },
  created() {
    this.configList = this.configList.filter(item => {
      return this.permsList.includes(item.authority)
    })
  },
  mounted() {
    if (this.fromChoose) {
      this.activeName = this.fromChoose
    } else {
      this.activeName = 'dataScreen'
    }
  },
  activated() {

  },
  beforeDestroy() {
    // 要进行函数卸载
  },
  methods: {
  }
}
</script>

  <style lang="scss" scoped>
  .financial-instrument {
      width: 100%;
      height: 100%;
      padding: 20px;
      border-radius: 10px;
      background-color: #fff;
  }
  </style>

