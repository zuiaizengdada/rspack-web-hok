<template>
  <div class="financial-instrument">
    <el-tabs v-model="activeName">
      <el-tab-pane label="订单明细" name="orderList">
        <orderList />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import orderList from '@/views/business/orderInvestigation/components/orderList'
export default {
  name: 'OrderInvestigation',
  components: {
    orderList
  },
  data() {
    return {
      activeName: 'orderList'
    }
  },
  watch: {},
  created() {},
  mounted() {},
  activated() {},
  beforeDestroy() {
    // 要进行函数卸载
  },
  methods: {}
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
